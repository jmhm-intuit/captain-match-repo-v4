import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

type JsonRecord = Record<string, unknown>;

const corsHeaders = {
  "Access-Control-Allow-Origin": Deno.env.get("CORS_ORIGIN") || "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const passwordSecret = Deno.env.get("TEAM_PASSWORD_SECRET") || "";

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});

function json(body: JsonRecord, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function requireEnv() {
  if (!supabaseUrl || !serviceRoleKey || !passwordSecret) {
    throw new Error("Missing Supabase Edge Function environment variables.");
  }
}

function base64UrlEncode(input: Uint8Array | string) {
  const bytes = typeof input === "string" ? new TextEncoder().encode(input) : input;
  let binary = "";
  bytes.forEach((b) => binary += String.fromCharCode(b));
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlDecodeToString(input: string) {
  const padded = input.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat((4 - input.length % 4) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

async function hmacHex(value: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(passwordSecret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));
  return Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function signSession(payload: JsonRecord) {
  const encoded = base64UrlEncode(JSON.stringify(payload));
  const signature = await hmacHex(encoded);
  return `${encoded}.${signature}`;
}

async function verifySession(token: string) {
  const [encoded, signature] = String(token || "").split(".");
  if (!encoded || !signature) throw Object.assign(new Error("Invalid session."), { status: 401 });

  const expected = await hmacHex(encoded);
  if (signature !== expected) {
    throw Object.assign(new Error("Invalid session signature."), { status: 401 });
  }

  const payload = JSON.parse(base64UrlDecodeToString(encoded));

  if (!payload.exp || Number(payload.exp) < Date.now()) {
    throw Object.assign(new Error("Session expired."), { status: 401 });
  }

  if (!payload.workspaceId) {
    throw Object.assign(new Error("Session is missing workspace."), { status: 401 });
  }

  return payload as { workspaceId: string; workspaceSlug: string; exp: number };
}

function cleanSlug(slug: unknown) {
  return String(slug || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function publicWorkspace(workspace: JsonRecord) {
  return {
    id: workspace.id,
    workspace_slug: workspace.workspace_slug,
    display_name: workspace.display_name,
    updated_at: workspace.updated_at,
  };
}

async function getSnapshot(workspaceId: string) {
  const { data, error } = await supabase
    .from("app_snapshots")
    .select("data, app_version, schema_version, updated_at, updated_by_device")
    .eq("workspace_id", workspaceId)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  const snapshot = data.data as JsonRecord;

  return {
    ...(snapshot || {}),
    appVersion: data.app_version || (snapshot && snapshot.appVersion),
    schemaVersion: data.schema_version || (snapshot && snapshot.schemaVersion),
    updated_at: data.updated_at,
    updatedByDevice: data.updated_by_device,
  };
}

async function loadWorkspaceBySlug(workspaceSlug: string) {
  const { data, error } = await supabase
    .from("workspaces")
    .select("id, workspace_slug, display_name, password_hash, updated_at")
    .eq("workspace_slug", workspaceSlug)
    .maybeSingle();

  if (error) throw error;
  return data;
}

async function handleCreate(body: JsonRecord) {
  const workspaceSlug = cleanSlug(body.workspaceSlug);
  const displayName = String(body.displayName || "Coach Planner").trim() || "Coach Planner";
  const password = String(body.password || "");

  if (!workspaceSlug) {
    return json({ ok: false, error: "Workspace code is required." }, 400);
  }

  if (password.length < 4) {
    return json({ ok: false, error: "Password must be at least 4 characters." }, 400);
  }

  const passwordHash = await hmacHex(`password:${workspaceSlug}:${password}`);

  const { data, error } = await supabase
    .from("workspaces")
    .insert({
      workspace_slug: workspaceSlug,
      display_name: displayName,
      password_hash: passwordHash,
    })
    .select("id, workspace_slug, display_name, updated_at")
    .single();

  if (error) {
    if (String(error.code) === "23505") {
      return json({ ok: false, error: "Workspace code already exists." }, 409);
    }
    throw error;
  }

  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

  const token = await signSession({
    workspaceId: data.id,
    workspaceSlug: data.workspace_slug,
    exp: new Date(expiresAt).getTime(),
  });

  return json({
    ok: true,
    workspace: data,
    token,
    expiresAt,
    snapshot: null,
  });
}

async function handleAccess(body: JsonRecord) {
  const workspaceSlug = cleanSlug(body.workspaceSlug);
  const password = String(body.password || "");
  const workspace = await loadWorkspaceBySlug(workspaceSlug);

  if (!workspace) {
    return json({ ok: false, error: "Workspace not found." }, 404);
  }

  const passwordHash = await hmacHex(`password:${workspaceSlug}:${password}`);

  if (workspace.password_hash !== passwordHash) {
    return json({ ok: false, error: "Incorrect workspace password." }, 401);
  }

  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

  const token = await signSession({
    workspaceId: workspace.id,
    workspaceSlug: workspace.workspace_slug,
    exp: new Date(expiresAt).getTime(),
  });

  const snapshot = await getSnapshot(workspace.id);

  return json({
    ok: true,
    workspace: publicWorkspace(workspace),
    token,
    expiresAt,
    snapshot,
  });
}

async function handleLoad(body: JsonRecord) {
  const session = await verifySession(String(body.token || ""));

  const { data: workspace, error } = await supabase
    .from("workspaces")
    .select("id, workspace_slug, display_name, updated_at")
    .eq("id", session.workspaceId)
    .single();

  if (error) throw error;

  const snapshot = await getSnapshot(session.workspaceId);

  return json({
    ok: true,
    workspace,
    snapshot,
  });
}

async function handleSave(body: JsonRecord) {
  const session = await verifySession(String(body.token || ""));
  const snapshot = body.snapshot as JsonRecord;

  if (!snapshot || typeof snapshot !== "object" || !snapshot.data) {
    return json({ ok: false, error: "Snapshot payload is required." }, 400);
  }

  const current = await getSnapshot(session.workspaceId);
  const known = String(body.clientKnownUpdatedAt || "");
  const force = Boolean(body.force);

  if (!force && current && known && current.updated_at && String(current.updated_at) !== known) {
    return json({
      ok: false,
      code: "snapshot_conflict",
      error: "Cloud snapshot changed since this device loaded it.",
      snapshot: current,
    }, 409);
  }

  const row = {
    workspace_id: session.workspaceId,
    data: snapshot,
    app_version: String(body.appVersion || snapshot.appVersion || ""),
    schema_version: Number(body.schemaVersion || snapshot.schemaVersion || 0),
    updated_by_device: String(body.deviceId || "unknown-device"),
  };

  const { data, error } = await supabase
    .from("app_snapshots")
    .upsert(row, { onConflict: "workspace_id" })
    .select("data, app_version, schema_version, updated_at, updated_by_device")
    .single();

  if (error) throw error;

  return json({
    ok: true,
    snapshot: {
      ...(data.data as JsonRecord),
      updated_at: data.updated_at,
      updatedByDevice: data.updated_by_device,
    },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return json({ ok: false, error: "POST only." }, 405);
  }

  try {
    requireEnv();

    const body = await req.json().catch(() => ({}));
    const action = String(body.action || "");

    if (action === "create") return await handleCreate(body);
    if (action === "access") return await handleAccess(body);
    if (action === "load") return await handleLoad(body);
    if (action === "save") return await handleSave(body);

    return json({ ok: false, error: "Unknown action." }, 400);
  } catch (err) {
    const status = Number((err as Error & { status?: number }).status || 500);
    console.error(err);
    return json({ ok: false, error: (err as Error).message || "Unexpected error." }, status);
  }
});
