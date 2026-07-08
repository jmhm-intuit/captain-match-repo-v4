(function () {
  var STORAGE_KEY = "squadflow_captain_v2_local";
  var DB_NAME = "captain_match_planner_local_db";
  var DB_VERSION = 4;
  var DB_SCHEMA_VERSION = 7;
  var APP_VERSION = "5.0";
  var POS_KEYS = ["forward", "wing", "center", "defense", "goalie"];
  var POS_SHORT = { forward: "FWD", wing: "WNG", center: "CTR", defense: "DEF", goalie: "GK" };
  var POS_FULL = { forward: "Forward", wing: "Wing", center: "Center", defense: "Defense", goalie: "Goalie" };
  var FORMATIONS = {
    "2-3-1": [
      { position: "FWD", role: "forward", x: 50, y: 14 },
      { position: "LM", role: "wing", x: 26, y: 38 },
      { position: "CM", role: "center", x: 50, y: 40 },
      { position: "RM", role: "wing", x: 74, y: 38 },
      { position: "LB", role: "defense", x: 35, y: 64 },
      { position: "RB", role: "defense", x: 65, y: 64 },
      { position: "GK", role: "goalie", x: 50, y: 88 }
    ],
    "3-2-1": [
      { position: "FWD", role: "forward", x: 50, y: 14 },
      { position: "LM", role: "wing", x: 36, y: 38 },
      { position: "RM", role: "wing", x: 64, y: 38 },
      { position: "LB", role: "defense", x: 27, y: 64 },
      { position: "CB", role: "defense", x: 50, y: 64 },
      { position: "RB", role: "defense", x: 73, y: 64 },
      { position: "GK", role: "goalie", x: 50, y: 88 }
    ]
  };
  var TEMPLATES = {
    balanced: [
      { id: "w_12", label: "At 12 min", minute: 12, live: false, targetSubs: "" },
      { id: "w_half", label: "At Half", minute: 25, live: false, targetSubs: "" },
      { id: "w_last", label: "Last 12 min", minute: 38, live: true, targetSubs: "" }
    ],
    fast: [
      { id: "w_8", label: "At 8 min", minute: 8, live: false, targetSubs: "" },
      { id: "w_16", label: "At 16 min", minute: 16, live: false, targetSubs: "" },
      { id: "w_half", label: "At Half", minute: 25, live: false, targetSubs: "" }
    ],
    heavy: [
      { id: "w_8", label: "At 8 min", minute: 8, live: false, targetSubs: "" },
      { id: "w_16", label: "At 16 min", minute: 16, live: false, targetSubs: "" },
      { id: "w_half", label: "At Half", minute: 25, live: false, targetSubs: "" },
      { id: "w_sh8", label: "Second half +8", minute: 33, live: false, targetSubs: "" },
      { id: "w_last8", label: "Last 8 min", minute: 42, live: true, targetSubs: "" }
    ],
    simple: [
      { id: "w_half", label: "At Half", minute: 25, live: false, targetSubs: "" },
      { id: "w_last", label: "Last 12 min", minute: 38, live: true, targetSubs: "" }
    ]
  };
  var AVATARS = [
    { id: "avatar-01", label: "Avatar 01", src: "assets/avatars/avatar-01.png" },
    { id: "avatar-02", label: "Avatar 02", src: "assets/avatars/avatar-02.png" },
    { id: "avatar-03", label: "Avatar 03", src: "assets/avatars/avatar-03.png" },
    { id: "avatar-04", label: "Avatar 04", src: "assets/avatars/avatar-04.png" },
    { id: "avatar-05", label: "Avatar 05", src: "assets/avatars/avatar-05.png" },
    { id: "avatar-06", label: "Avatar 06", src: "assets/avatars/avatar-06.png" },
    { id: "avatar-07", label: "Avatar 07", src: "assets/avatars/avatar-07.png" },
    { id: "avatar-08", label: "Avatar 08", src: "assets/avatars/avatar-08.png" },
    { id: "avatar-09", label: "Avatar 09", src: "assets/avatars/avatar-09.png" },
    { id: "avatar-10", label: "Avatar 10", src: "assets/avatars/avatar-10.png" },
    { id: "avatar-11", label: "Avatar 11", src: "assets/avatars/avatar-11.png" },
    { id: "avatar-12", label: "Avatar 12", src: "assets/avatars/avatar-12.png" },
    { id: "avatar-13", label: "Avatar 13", src: "assets/avatars/avatar-13.png" },
    { id: "avatar-14", label: "Avatar 14", src: "assets/avatars/avatar-14.png" },
    { id: "avatar-15", label: "Avatar 15", src: "assets/avatars/avatar-15.png" },
    { id: "avatar-16", label: "Avatar 16", src: "assets/avatars/avatar-16.png" },
    { id: "avatar-17", label: "Avatar 17", src: "assets/avatars/avatar-17.png" },
    { id: "avatar-18", label: "Avatar 18", src: "assets/avatars/avatar-18.png" },
    { id: "avatar-19", label: "Avatar 19", src: "assets/avatars/avatar-19.png" },
    { id: "avatar-20", label: "Avatar 20", src: "assets/avatars/avatar-20.png" },
    { id: "avatar-21", label: "Avatar 21", src: "assets/avatars/avatar-21.png" },
    { id: "avatar-22", label: "Avatar 22", src: "assets/avatars/avatar-22.png" },
    { id: "avatar-23", label: "Avatar 23", src: "assets/avatars/avatar-23.png" },
    { id: "avatar-24", label: "Avatar 24", src: "assets/avatars/avatar-24.png" },
    { id: "avatar-25", label: "Avatar 25", src: "assets/avatars/avatar-25.png" },
    { id: "avatar-26", label: "Avatar 26", src: "assets/avatars/avatar-26.png" },
    { id: "avatar-27", label: "Avatar 27", src: "assets/avatars/avatar-27.png" },
    { id: "avatar-28", label: "Avatar 28", src: "assets/avatars/avatar-28.png" },
    { id: "avatar-29", label: "Avatar 29", src: "assets/avatars/avatar-29.png" },
    { id: "avatar-30", label: "Avatar 30", src: "assets/avatars/avatar-30.png" }
  ];

  var state = {
    view: "home",
    activeTeamId: null,
    activeTournamentId: null,
    activeMatchId: null,
    activeSlot: null,
    toast: null,
    avatarTarget: null,
    tournamentPanelOpen: false,
    confirmRemovePlayerId: null,
    editingSubPositionId: null,
    editingPlayerId: null,
    playerEditDraft: null,
    momentByMatch: {},
    dbReady: false,
    storageBackend: "starting",
    persistenceStatus: "loading",
    lastSavedAt: null,
    scheduleViewMode: "summary",
    tournamentSetupEditing: false,
    dataTable: "tournaments",
    profilePlayerId: null,
    lastPlanMatchId: null
  };

  var data = emptyData();
  var saveQueue = Promise.resolve();
  var DataService = createDataService();

  function uid(prefix) {
    return prefix + "_" + Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-4);
  }
  function nowIso() { return new Date().toISOString(); }
  function clone(obj) { return JSON.parse(JSON.stringify(obj)); }
  function emptyData() {
    return { teams: [], teamPlayers: [], globalPlayers: [], tournaments: [], tournamentPlayers: [], matches: [], matchPlayers: [], customAvatars: [] };
  }
  function normalizeSnapshot(snapshot) {
    var clean = emptyData();
    snapshot = snapshot || {};
    clean.teams = Array.isArray(snapshot.teams) ? snapshot.teams : [];
    clean.teamPlayers = Array.isArray(snapshot.teamPlayers) ? snapshot.teamPlayers : [];
    clean.globalPlayers = Array.isArray(snapshot.globalPlayers) ? snapshot.globalPlayers : [];
    clean.tournaments = Array.isArray(snapshot.tournaments) ? snapshot.tournaments : [];
    clean.tournamentPlayers = Array.isArray(snapshot.tournamentPlayers) ? snapshot.tournamentPlayers : [];
    clean.matches = Array.isArray(snapshot.matches) ? snapshot.matches : [];
    clean.matchPlayers = Array.isArray(snapshot.matchPlayers) ? snapshot.matchPlayers : [];
    clean.customAvatars = Array.isArray(snapshot.customAvatars) ? snapshot.customAvatars : [];
    return clean;
  }
  function rowsForStore(storeName, snapshot) {
    snapshot = normalizeSnapshot(snapshot);
    if (storeName === "teams" || storeName === "teamPlayers" || storeName === "globalPlayers" || storeName === "tournaments" || storeName === "tournamentPlayers" || storeName === "matches" || storeName === "matchPlayers" || storeName === "customAvatars") return snapshot[storeName] || [];
    if (storeName === "playerAliases") {
      var aliases = [];
      (snapshot.globalPlayers || []).forEach(function (gp) {
        (gp.aliases || []).forEach(function (alias, index) {
          aliases.push({ id: "alias_" + gp.id + "_" + index, globalPlayerId: gp.id, aliasName: alias, normalizedAlias: normalizeAlias(alias) });
        });
      });
      return aliases;
    }
    if (storeName === "matchLineups") {
      return (snapshot.matches || []).map(function (m) { return { id: "lineup_" + m.id, matchId: m.id, tournamentId: m.tournamentId, formation: m.formation || "2-3-1", autosuggestMode: m.suggestMode || "positional", rotationStyle: m.rotationStyle || "balanced", finalPhase: m.finalPhase || "live", subTiming: m.subTiming || "standard", updatedAt: m.updatedAt || m.createdAt || nowIso() }; });
    }
    if (storeName === "lineupAssignments") {
      var assignments = [];
      (snapshot.matches || []).forEach(function (m) {
        Object.keys(m.lineup || {}).forEach(function (slot) {
          if (m.lineup[slot]) assignments.push({ id: "assign_" + m.id + "_" + slot, matchId: m.id, lineupId: "lineup_" + m.id, slotKey: slot, matchPlayerId: m.lineup[slot] });
        });
      });
      return assignments;
    }
    if (storeName === "substitutionWindows") {
      var windows = [];
      (snapshot.matches || []).forEach(function (m) {
        (m.subWindows || []).forEach(function (w, index) {
          windows.push({ id: m.id + "_" + w.id, matchId: m.id, windowKey: w.id, label: w.label, minute: w.minute, live: !!w.live, targetSubs: w.targetSubs || "", sortOrder: index + 1 });
        });
      });
      return windows;
    }
    if (storeName === "substitutionChanges") {
      var changes = [];
      (snapshot.matches || []).forEach(function (m) {
        (m.subs || []).forEach(function (sub, index) {
          changes.push({ id: sub.id || (m.id + "_sub_" + index), matchId: m.id, substitutionWindowId: m.id + "_" + sub.windowId, windowKey: sub.windowId, playerInMatchPlayerId: sub.playerInId, playerOutMatchPlayerId: sub.playerOutId, incomingSlotKey: sub.position || "", manualPositionOverride: !!sub.manualPosition, sortOrder: sub.order || index + 1 });
        });
      });
      return changes;
    }
    return [];
  }
  function createDataService() {
    var tableNames = ["teams", "teamPlayers", "globalPlayers", "tournaments", "tournamentPlayers", "matches", "matchPlayers", "customAvatars", "playerAliases", "matchLineups", "lineupAssignments", "substitutionWindows", "substitutionChanges"];
    var indexedStore = createIndexedDbStore(tableNames);
    var fallbackStore = createLocalStorageStore();
    var activeStore = fallbackStore;
    return {
      backendName: function () { return activeStore.name; },
      load: function () {
        if (!indexedStore.supported) {
          activeStore = fallbackStore;
          state.storageBackend = activeStore.name;
          return fallbackStore.load();
        }
        return indexedStore.load().then(function (snapshot) {
          activeStore = indexedStore;
          state.storageBackend = activeStore.name;
          return snapshot;
        }).catch(function (err) {
          console.warn("IndexedDB load failed; falling back to localStorage.", err);
          activeStore = fallbackStore;
          state.storageBackend = activeStore.name;
          return fallbackStore.load();
        });
      },
      save: function (snapshot) {
        return activeStore.save(snapshot).catch(function (err) {
          if (activeStore !== fallbackStore) {
            console.warn("IndexedDB save failed; falling back to localStorage.", err);
            activeStore = fallbackStore;
            state.storageBackend = activeStore.name;
            return fallbackStore.save(snapshot);
          }
          throw err;
        });
      },
      clear: function () {
        return activeStore.clear().then(function () {
          if (activeStore !== fallbackStore) return fallbackStore.clear().catch(function () {});
        });
      }
    };
  }
  function createLocalStorageStore() {
    return {
      name: "localStorage fallback",
      load: function () {
        return Promise.resolve().then(function () {
          var raw = localStorage.getItem(STORAGE_KEY);
          if (!raw) return null;
          return normalizeSnapshot(JSON.parse(raw));
        }).catch(function () { return null; });
      },
      save: function (snapshot) {
        return Promise.resolve().then(function () {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizeSnapshot(snapshot)));
        });
      },
      clear: function () {
        return Promise.resolve().then(function () { localStorage.removeItem(STORAGE_KEY); });
      }
    };
  }
  function createIndexedDbStore(tableNames) {
    var supported = typeof indexedDB !== "undefined";
    var dbPromise = null;
    function openDb() {
      if (!supported) return Promise.reject(new Error("IndexedDB is not available."));
      if (dbPromise) return dbPromise;
      dbPromise = new Promise(function (resolve, reject) {
        var request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onupgradeneeded = function (event) {
          var db = event.target.result;
          tableNames.forEach(function (name) {
            if (!db.objectStoreNames.contains(name)) db.createObjectStore(name, { keyPath: "id" });
          });
          if (!db.objectStoreNames.contains("meta")) db.createObjectStore("meta", { keyPath: "key" });
        };
        request.onsuccess = function (event) { resolve(event.target.result); };
        request.onerror = function () { reject(request.error || new Error("Could not open IndexedDB.")); };
      });
      return dbPromise;
    }
    function txDone(tx) {
      return new Promise(function (resolve, reject) {
        tx.oncomplete = function () { resolve(); };
        tx.onerror = function () { reject(tx.error || new Error("IndexedDB transaction failed.")); };
        tx.onabort = function () { reject(tx.error || new Error("IndexedDB transaction aborted.")); };
      });
    }
    function getAll(store) {
      return new Promise(function (resolve, reject) {
        if (store.getAll) {
          var request = store.getAll();
          request.onsuccess = function () { resolve(request.result || []); };
          request.onerror = function () { reject(request.error); };
          return;
        }
        var rows = [];
        var cursorRequest = store.openCursor();
        cursorRequest.onsuccess = function (event) {
          var cursor = event.target.result;
          if (!cursor) return resolve(rows);
          rows.push(cursor.value);
          cursor.continue();
        };
        cursorRequest.onerror = function () { reject(cursorRequest.error); };
      });
    }
    function readLegacySnapshotIfNeeded(snapshot) {
      var hasRows = ["globalPlayers", "tournaments", "tournamentPlayers", "matches", "matchPlayers"].some(function (name) { return (snapshot[name] || []).length > 0; });
      if (hasRows) return Promise.resolve(snapshot);
      try {
        var raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          var legacy = normalizeSnapshot(JSON.parse(raw));
          var legacyHasRows = ["globalPlayers", "tournaments", "tournamentPlayers", "matches", "matchPlayers"].some(function (name) { return (legacy[name] || []).length > 0; });
          if (legacyHasRows) return Promise.resolve(legacy);
        }
      } catch (e) {}
      return Promise.resolve(null);
    }
    return {
      name: "IndexedDB local database",
      supported: supported,
      load: function () {
        return openDb().then(function (db) {
          var tx = db.transaction(tableNames, "readonly");
          return Promise.all(tableNames.map(function (name) { return getAll(tx.objectStore(name)); })).then(function (results) {
            var snapshot = emptyData();
            tableNames.forEach(function (name, index) { snapshot[name] = results[index] || []; });
            return readLegacySnapshotIfNeeded(snapshot);
          });
        });
      },
      save: function (snapshot) {
        snapshot = normalizeSnapshot(snapshot);
        return openDb().then(function (db) {
          var stores = tableNames.concat(["meta"]);
          var tx = db.transaction(stores, "readwrite");
          tableNames.forEach(function (name) {
            var store = tx.objectStore(name);
            store.clear();
            rowsForStore(name, snapshot).forEach(function (row) { store.put(clone(row)); });
          });
          tx.objectStore("meta").put({ key: "schemaVersion", value: DB_SCHEMA_VERSION });
          tx.objectStore("meta").put({ key: "appVersion", value: APP_VERSION });
          tx.objectStore("meta").put({ key: "lastSavedAt", value: nowIso() });
          tx.objectStore("meta").put({ key: "storeNames", value: tableNames });
          return txDone(tx);
        });
      },
      clear: function () {
        return openDb().then(function (db) {
          var stores = tableNames.concat(["meta"]);
          var tx = db.transaction(stores, "readwrite");
          stores.forEach(function (name) { tx.objectStore(name).clear(); });
          return txDone(tx);
        });
      }
    };
  }
  function save() {
    state.persistenceStatus = "saving";
    var snapshot = clone(data);
    saveQueue = saveQueue.catch(function () {}).then(function () {
      return DataService.save(snapshot);
    }).then(function () {
      state.persistenceStatus = "saved";
      state.lastSavedAt = nowIso();
    }).catch(function (err) {
      console.error("Local save failed", err);
      state.persistenceStatus = "error";
      state.toast = "Local save failed. Export a backup before closing.";
    });
    return saveQueue;
  }
  function initializeApp() {
    var root = document.getElementById("app");
    if (root) root.innerHTML = '<div class="loading-screen"><div class="loading-card"><h1>Captain Match Planner</h1><p>Opening local database...</p></div></div>';
    DataService.load().then(function (loaded) {
      data = migrateData(loaded || seedData());
      state.activeTeamId = preferredTeamId();
      data.tournaments.forEach(function (t) { reconcileTournamentSchedule(t.id); });
      state.dbReady = true;
      state.persistenceStatus = "ready";
      state.activeTeamId = state.activeTeamId || preferredTeamId();
      state.activeTournamentId = preferredTournamentId() || (teamTournaments(state.activeTeamId)[0] && teamTournaments(state.activeTeamId)[0].id) || (data.tournaments[0] && data.tournaments[0].id);
      var preferredMatch = state.activeTournamentId ? nextMatch(state.activeTournamentId) : null;
      state.activeMatchId = preferredMatch ? preferredMatch.id : (data.matches[0] && data.matches[0].id);
      return save();
    }).then(function () {
      render();
    }).catch(function (err) {
      console.error("Could not initialize local database", err);
      data = migrateData(seedData());
      state.dbReady = true;
      state.storageBackend = "memory only";
      state.persistenceStatus = "error";
      state.activeTeamId = preferredTeamId();
      state.activeTournamentId = preferredTournamentId() || (teamTournaments(state.activeTeamId)[0] && teamTournaments(state.activeTeamId)[0].id) || (data.tournaments[0] && data.tournaments[0].id);
      state.activeMatchId = data.matches[0] && data.matches[0].id;
      render();
      toast("Local database could not open. Export a backup if you make changes.");
    });
  }
  function resetData() {
    if (!confirm("Reset all local Match Planner data?")) return;
    DataService.clear().then(function () {
      data = migrateData(seedData());
      state.activeTeamId = preferredTeamId();
      data.tournaments.forEach(function (t) { reconcileTournamentSchedule(t.id); });
      state.activeTournamentId = preferredTournamentId() || (teamTournaments(state.activeTeamId)[0] && teamTournaments(state.activeTeamId)[0].id) || data.tournaments[0].id;
      var resetMatch = nextMatch(state.activeTournamentId);
      state.activeMatchId = resetMatch ? resetMatch.id : data.matches[0].id;
      state.view = "home";
      return save();
    }).then(function () {
      render();
      toast("Local database reset.");
    }).catch(function () {
      alert("Could not reset the local database. Try exporting a backup and clearing site data manually.");
    });
  }
  function toast(msg) {
    state.toast = msg;
    render();
    setTimeout(function () { state.toast = null; render(); }, 1800);
  }
  function activeTeam() { return data.teams.find(function (tm) { return tm.id === state.activeTeamId; }) || data.teams[0] || { id: "team_green_fc", name: "Green FC", color: "#0b5d3b", colorName: "Forest Green" }; }
  function preferredTeamId() { return (state.activeTeamId && data.teams.find(function (tm) { return tm.id === state.activeTeamId; }) && state.activeTeamId) || (data.teams.find(function (tm) { return tm.name === "Green FC"; }) || data.teams[0] || {}).id; }
  function teamById(id) { return data.teams.find(function (tm) { return tm.id === id; }); }
  function teamTournaments(teamId) { return data.tournaments.filter(function (t) { return !t.archived && (!teamId || t.teamId === teamId); }); }
  function visibleTournaments() { return teamTournaments((activeTeam() || {}).id); }
  function activeTournament() { var t = data.tournaments.find(function (x) { return x.id === state.activeTournamentId && (!activeTeam().id || x.teamId === activeTeam().id); }); return t || visibleTournaments()[0] || data.tournaments.find(function (x) { return !x.archived; }) || data.tournaments[0]; }
  function activeMatch() { return data.matches.find(function (m) { return m.id === state.activeMatchId; }) || data.matches.find(function (m) { return m.tournamentId === state.activeTournamentId; }); }
  function tournamentPlayers(tId) { return data.tournamentPlayers.filter(function (p) { return p.tournamentId === tId; }); }
  function tournamentPlayer(id) { return data.tournamentPlayers.find(function (p) { return p.id === id; }); }
  function globalPlayer(id) { return data.globalPlayers.find(function (p) { return p.id === id; }); }
  function teamPlayers(teamId) { return data.teamPlayers.filter(function (p) { return p.teamId === teamId && p.active !== false; }); }
  function teamPlayer(teamId, globalPlayerId) { return data.teamPlayers.find(function (p) { return p.teamId === teamId && p.globalPlayerId === globalPlayerId && p.active !== false; }); }
  function teamMembershipPills(globalPlayerId) { var rows = teamPlayersForGlobal(globalPlayerId); return rows.length ? rows.map(function (tp) { var tm = teamById(tp.teamId) || {}; var style = tm.color ? ' style="border-color:' + escapeAttr(tm.color) + ';color:' + escapeAttr(tm.color) + '"' : ''; return '<span class="team-pill"' + style + '>' + escapeHtml(tm.name || 'Team') + ' · ' + escapeHtml(tp.membership === 'team' ? 'Roster' : 'Support') + '</span>'; }).join('') : '<span class="team-pill muted">No team</span>'; }
  function teamPlayersForGlobal(globalPlayerId) { return (data.teamPlayers || []).filter(function (tp) { return tp.globalPlayerId === globalPlayerId && tp.active !== false; }); }
  function ensureTeamPlayer(teamId, globalPlayerId, membership, skills) { if (!teamId || !globalPlayerId) return null; var existing = data.teamPlayers.find(function (tp) { return tp.teamId === teamId && tp.globalPlayerId === globalPlayerId; }); if (existing) { existing.active = true; if (membership) existing.membership = membership; if (skills && !existing.skills) existing.skills = clone(skills); existing.updatedAt = nowIso(); return existing; } var row = { id: uid('team_player'), teamId: teamId, globalPlayerId: globalPlayerId, membership: membership || 'support', skills: clone(skills || (globalPlayer(globalPlayerId) && globalPlayer(globalPlayerId).defaultSkills) || defaultSkills()), active: true, createdAt: nowIso(), updatedAt: nowIso() }; data.teamPlayers.push(row); return row; }
  function ensureTournamentPlayerFromTeam(tId, teamPlayerRow) { var t = data.tournaments.find(function (x) { return x.id === tId; }); if (!t || !teamPlayerRow) return null; var existing = data.tournamentPlayers.find(function (tp) { return tp.tournamentId === tId && tp.globalPlayerId === teamPlayerRow.globalPlayerId; }); var skills = clone(teamPlayerRow.skills || (globalPlayer(teamPlayerRow.globalPlayerId) && globalPlayer(teamPlayerRow.globalPlayerId).defaultSkills) || defaultSkills()); if (existing) { existing.membership = teamPlayerRow.membership || existing.membership; existing.skills = normalizeSkills(existing.skills || skills); existing.teamId = t.teamId; return existing; } var tpId = uid('tp'); var pos = derivePositions(skills, tId, tpId); var gp = globalPlayer(teamPlayerRow.globalPlayerId); var tp = { id: tpId, teamId: t.teamId, tournamentId: tId, globalPlayerId: teamPlayerRow.globalPlayerId, membership: teamPlayerRow.membership || 'support', skills: skills, primaryPosition: pos.primary, secondaryPosition: pos.secondary, goalieEligible: skills.goalie >= 3, tournamentGoalie: gp && /franco/i.test(gp.name) && skills.goalie >= 3, createdAt: nowIso(), updatedAt: nowIso() }; data.tournamentPlayers.push(tp); return tp; }
  function syncTournamentRosterFromTeam(tId) { var t = data.tournaments.find(function (x) { return x.id === tId; }); if (!t || !t.teamId) return; teamPlayers(t.teamId).forEach(function (row) { ensureTournamentPlayerFromTeam(tId, row); }); }
  function matchDateSort(a, b) {
    return ((a.date || '') + (a.time || '') + (a.createdAt || '')).localeCompare((b.date || '') + (b.time || '') + (b.createdAt || ''));
  }
  function matches(tId) {
    return data.matches.filter(function (m) { return m.tournamentId === tId; }).sort(matchDateSort);
  }
  function tournamentById(tId) { return data.tournaments.find(function (t) { return t.id === tId; }); }
  function matchNumber(matchOrId) {
    var m = typeof matchOrId === 'string' ? data.matches.find(function (x) { return x.id === matchOrId; }) : matchOrId;
    if (!m) return 0;
    if (m.sequence) return Number(m.sequence);
    var ms = matches(m.tournamentId);
    var idx = ms.findIndex(function (x) { return x.id === m.id; });
    return idx >= 0 ? idx + 1 : 0;
  }
  function matchDisplayTitle(match) {
    var n = match && match.sequence ? Number(match.sequence) : matchNumber(match);
    return n ? 'Match ' + n : (match && match.title) || 'Match';
  }
  function matchScheduleLabel(match) {
    var t = match ? tournamentById(match.tournamentId) : null;
    var parts = [];
    if (t && t.name) parts.push(t.name);
    parts.push(matchDisplayTitle(match));
    if (match && match.date) parts.push(formatDateLabel(match.date));
    return parts.join(' · ');
  }
  function matchDisplayTitleWithOpponent(match) {
    var title = matchDisplayTitle(match);
    return match && match.opponent ? title + ' · vs ' + match.opponent : title;
  }
  function renumberTournamentMatches(tId) {
    var ms = data.matches.filter(function (m) { return m.tournamentId === tId; });
    var validMax = ms.length;
    var used = {};
    var hasLocked = false;
    ms.forEach(function (m) {
      var seq = Number(m.sequence || 0);
      if (!m.sequenceLocked || seq < 1 || seq > validMax || used[seq]) {
        m.sequenceLocked = !!(m.sequenceLocked && seq >= 1 && seq <= validMax && !used[seq]);
      }
      if (m.sequenceLocked) { used[seq] = true; hasLocked = true; }
    });
    var sortedByDate = ms.slice().sort(matchDateSort);
    if (!hasLocked) {
      sortedByDate.forEach(function (m, index) { m.sequence = index + 1; });
    } else {
      var missing = [];
      for (var i = 1; i <= ms.length; i++) if (!used[i]) missing.push(i);
      sortedByDate.filter(function (m) { return !m.sequenceLocked; }).forEach(function (m) {
        m.sequence = missing.shift() || (ms.length + 1);
      });
    }
    ms.forEach(function (m) { m.title = 'Match ' + (Number(m.sequence || 0) || matchNumber(m)); });
  }
  function matchPlayers(matchId) { return data.matchPlayers.filter(function (p) { return p.matchId === matchId; }).sort(function (a, b) { return a.signupOrder - b.signupOrder; }); }
  function activeMatchPlayers(matchId) { return matchPlayers(matchId).filter(function (p) { return p.included && p.status === "confirmed" && p.availability !== "out"; }); }
  function lineupFor(match) { if (!match.lineup) match.lineup = {}; return match.lineup; }
  function allAvatars() {
    return AVATARS.concat((data && data.customAvatars) ? data.customAvatars : []);
  }
  function avatarById(id) { return allAvatars().find(function (a) { return a.id === id; }) || AVATARS[0]; }

  function normalizeName(name) {
    return String(name || "")
      .trim()
      .toLowerCase()
      .replace(/^\d+\s*[-.)]\s*/, "")
      .replace(/[%]/g, " percent ")
      .replace(/[^a-z0-9 ]+/g, " ")
      .replace(/\b(percent|confirmed|confirm|maybe|probable|in|out|yes|no|cant|can't|cannot)\b/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }
  function normalizeAlias(name) {
    return String(name || "").trim().toLowerCase().replace(/[^a-z0-9 ]+/g, " ").replace(/\s+/g, " ").trim();
  }
  function prettyName(name) {
    var clean = String(name || "").replace(/^\d+\s*[-.)]\s*/, "").replace(/\s+/g, " ").trim();
    if (!clean) return "";
    return clean.split(" ").map(function (part) { return part ? part.charAt(0).toUpperCase() + part.slice(1).toLowerCase() : part; }).join(" ");
  }
  function parseAvailability(line) {
    var lower = String(line || "").toLowerCase();
    var pctMatch = lower.match(/(100|9\d|8\d|7\d|6\d|5\d|4\d|3\d|2\d|1\d)\s*%/);
    var probability = pctMatch ? parseInt(pctMatch[1], 10) : null;
    var availability = "confirmed";
    if (/\b(out|no|can't|cant|cannot)\b/.test(lower)) availability = "out";
    else if (/\b(maybe|probable)\b/.test(lower)) availability = "probable";
    else if (probability !== null && probability < 60) availability = "uncertain";
    else if (probability !== null && probability < 90) availability = "probable";
    else if (/\b(in|yes|confirmed|confirm)\b/.test(lower)) availability = "confirmed";
    if (probability === null) probability = availability === "confirmed" ? 100 : availability === "probable" ? 80 : availability === "uncertain" ? 50 : 0;
    var namePart = String(line || "")
      .replace(/^\s*[-*]+\s*/, "")
      .replace(/^\s*\d+\s*[-.)]\s*/, "")
      .replace(/\b(100|9\d|8\d|7\d|6\d|5\d|4\d|3\d|2\d|1\d)\s*%/ig, "")
      .replace(/\b(confirmed|confirm|maybe|probable|in|out|yes|no|cant|can't|cannot)\b/ig, "")
      .replace(/\([^)]*\)/g, "")
      .replace(/[\-:]+$/g, "")
      .trim();
    return { name: prettyName(namePart), normalized: normalizeAlias(namePart), availability: availability, probability: probability };
  }
  function isOutHeaderLine(line) {
    var clean = String(line || "").trim().toLowerCase().replace(/[:：]+$/g, "");
    return /^(out|outs|not available|unavailable|out players|players out|missing)$/.test(clean);
  }
  function isInHeaderLine(line) {
    var clean = String(line || "").trim().toLowerCase().replace(/[:：]+$/g, "");
    return /^(in|ins|available|confirmed|playing|players in|roster|team)$/.test(clean);
  }
  function isLikelyRosterMetaLine(line) {
    var clean = String(line || "").trim();
    var lower = clean.toLowerCase();
    if (!clean) return true;
    if (/^(mon|monday|tue|tues|tuesday|wed|wednesday|thu|thur|thurs|thursday|fri|friday|sat|saturday|sun|sunday)\b/.test(lower) && /\d/.test(lower)) return true;
    if (/^(date|time|field|vs|opponent|match)\b[:：]/.test(lower)) return true;
    return false;
  }
  function parseRosterText(text) {
    var seen = {};
    var rows = [];
    var ignoredOut = [];
    var inOutSection = false;
    String(text || "").split(/\n+/).forEach(function (line, index) {
      var raw = String(line || "").trim();
      if (!raw) return;
      if (isOutHeaderLine(raw)) { inOutSection = true; return; }
      if (isInHeaderLine(raw)) { inOutSection = false; return; }
      if (isLikelyRosterMetaLine(raw)) return;
      var parsed = parseAvailability(raw);
      parsed.raw = line;
      parsed.order = index + 1;
      if (!parsed.normalized) return;
      if (inOutSection) {
        parsed.availability = "out";
        parsed.probability = 0;
        ignoredOut.push(parsed);
        return;
      }
      if (seen[parsed.normalized]) return;
      seen[parsed.normalized] = true;
      rows.push(parsed);
    });
    rows.outIgnoredCount = ignoredOut.length;
    rows.outIgnored = ignoredOut;
    return rows;
  }
  function levenshtein(a, b) {
    a = a || ""; b = b || "";
    var m = a.length, n = b.length, dp = [];
    for (var i = 0; i <= m; i++) dp[i] = [i];
    for (var j = 1; j <= n; j++) dp[0][j] = j;
    for (var i2 = 1; i2 <= m; i2++) {
      for (var j2 = 1; j2 <= n; j2++) {
        var cost = a[i2 - 1] === b[j2 - 1] ? 0 : 1;
        dp[i2][j2] = Math.min(dp[i2 - 1][j2] + 1, dp[i2][j2 - 1] + 1, dp[i2 - 1][j2 - 1] + cost);
      }
    }
    return dp[m][n];
  }
  function findRosterMatch(parsedName, tId) {
    var normalized = normalizeAlias(parsedName);
    var roster = tournamentPlayers(tId);
    for (var i = 0; i < roster.length; i++) {
      var gp = globalPlayer(roster[i].globalPlayerId);
      if (!gp) continue;
      if (gp.normalizedName === normalized) return { kind: "exact", tPlayer: roster[i], distance: 0 };
      if ((gp.aliases || []).map(normalizeAlias).indexOf(normalized) >= 0) return { kind: "alias", tPlayer: roster[i], distance: 0 };
    }
    var first = normalized.split(" ")[0];
    var best = null;
    roster.forEach(function (tp) {
      var gp = globalPlayer(tp.globalPlayerId);
      if (!gp) return;
      var candidates = [gp.normalizedName].concat((gp.aliases || []).map(normalizeAlias));
      candidates.forEach(function (c) {
        [c, c.split(" ")[0]].forEach(function (part) {
          if (!part) return;
          var d = levenshtein(first, part);
          var threshold = Math.max(2, Math.ceil(Math.max(first.length, part.length) * 0.3));
          if (d <= threshold && (!best || d < best.distance)) best = { kind: "fuzzy", tPlayer: tp, distance: d, threshold: threshold };
        });
      });
    });
    return best || { kind: "none", tPlayer: null, distance: null };
  }
  function stars(n) {
    n = Number(n || 0);
    var html = "";
    for (var i = 1; i <= 5; i++) html += i <= n ? "&#9733;" : "&#9734;";
    return html;
  }
  function skillClass(value) {
    value = Number(value || 0);
    if (value >= 5) return "starpos";
    if (value >= 4) return "primary";
    if (value <= 2) return "greyed";
    return "";
  }
  function derivePositions(skills, tId, tpId) {
    var s = normalizeSkills(skills);
    var scarcity = positionScarcityMap(tId, tpId);
    var ordered = POS_KEYS.slice().sort(function (a, b) {
      var scoreDiff = (s[b] || 0) - (s[a] || 0);
      if (scoreDiff !== 0) return scoreDiff;
      var scarcityDiff = (scarcity[a] || 0) - (scarcity[b] || 0);
      if (scarcityDiff !== 0) return scarcityDiff;
      return POS_KEYS.indexOf(a) - POS_KEYS.indexOf(b);
    });
    return { primary: POS_SHORT[ordered[0]], secondary: POS_SHORT[ordered[1]] };
  }
  function defaultSkills(role) {
    return { forward: 3, wing: 3, center: 3, defense: 3, goalie: 1 };
  }
  function seedSkills(role) {
    var s = defaultSkills();
    if (role === "goalie") { s.goalie = 5; s.defense = 3; s.forward = 2; s.wing = 2; s.center = 2; }
    if (role === "defense") { s.defense = 5; s.center = 3; s.forward = 2; s.wing = 2; }
    if (role === "center") { s.center = 5; s.wing = 3; s.defense = 3; s.forward = 2; }
    if (role === "wing") { s.wing = 5; s.forward = 4; s.center = 3; s.defense = 2; }
    if (role === "forward") { s.forward = 5; s.wing = 4; s.center = 2; s.defense = 2; }
    return s;
  }
  function normalizeSkills(skills) {
    skills = skills || {};
    var out = {};
    POS_KEYS.forEach(function (k) {
      var v = Number(skills[k]);
      out[k] = isNaN(v) ? (k === "goalie" ? 1 : 3) : Math.max(1, Math.min(5, v));
    });
    return out;
  }
  function positionScarcityMap(tId, excludeTpId) {
    var counts = { forward: 0, wing: 0, center: 0, defense: 0, goalie: 0 };
    if (!tId || !data || !data.tournamentPlayers) return counts;
    tournamentPlayers(tId).forEach(function (tp) {
      if (excludeTpId && tp.id === excludeTpId) return;
      var s = normalizeSkills(tp.skills);
      POS_KEYS.forEach(function (k) { if ((s[k] || 0) >= 4) counts[k] += 1; });
    });
    return counts;
  }
  function clampStrongPositions(skills, tId, tpId) {
    var s = normalizeSkills(skills);
    var strong = POS_KEYS.filter(function (k) { return (s[k] || 0) > 3; });
    if (strong.length <= 3) return { skills: s, changed: false };
    var scarcity = positionScarcityMap(tId, tpId);
    strong.sort(function (a, b) {
      var scoreDiff = (s[b] || 0) - (s[a] || 0);
      if (scoreDiff !== 0) return scoreDiff;
      var scarcityDiff = (scarcity[a] || 0) - (scarcity[b] || 0);
      if (scarcityDiff !== 0) return scarcityDiff;
      return POS_KEYS.indexOf(a) - POS_KEYS.indexOf(b);
    });
    var keep = strong.slice(0, 3);
    strong.slice(3).forEach(function (k) { s[k] = 3; });
    return { skills: s, changed: true, keep: keep };
  }
  function refreshPlayerPositions(tId) {
    tournamentPlayers(tId).forEach(function (tp) {
      var clean = clampStrongPositions(tp.skills, tp.tournamentId, tp.id);
      tp.skills = clean.skills;
      tp.goalieEligible = (tp.skills.goalie || 0) >= 3;
      var pos = derivePositions(tp.skills, tp.tournamentId, tp.id);
      tp.primaryPosition = pos.primary;
      tp.secondaryPosition = pos.secondary;
    });
  }
  function ensureV5Teams(d) {
    d.teams = Array.isArray(d.teams) ? d.teams : [];
    d.teamPlayers = Array.isArray(d.teamPlayers) ? d.teamPlayers : [];
    var green = d.teams.find(function (tm) { return tm.id === 'team_green_fc' || tm.name === 'Green FC'; });
    if (!green) { green = { id: 'team_green_fc', name: 'Green FC', color: '#0b5d3b', colorName: 'Forest Green', active: true, createdAt: nowIso(), updatedAt: nowIso() }; d.teams.push(green); }
    green.id = green.id || 'team_green_fc'; green.name = green.name || 'Green FC'; green.color = green.color || '#0b5d3b'; green.colorName = green.colorName || 'Forest Green'; green.active = green.active !== false;
    var intuit = d.teams.find(function (tm) { return tm.id === 'team_intuit_united' || tm.name === 'Intuit United'; });
    if (!intuit) { intuit = { id: 'team_intuit_united', name: 'Intuit United', color: '#1769ff', colorName: 'Blue', active: true, createdAt: nowIso(), updatedAt: nowIso() }; d.teams.push(intuit); }
    intuit.id = intuit.id || 'team_intuit_united'; intuit.name = intuit.name || 'Intuit United'; intuit.color = intuit.color || '#1769ff'; intuit.colorName = intuit.colorName || 'Blue'; intuit.active = intuit.active !== false;
    d.tournaments.forEach(function (t) { if (!t.teamId) t.teamId = (t.teamName === 'Intuit United') ? intuit.id : green.id; if (!t.teamName) t.teamName = (d.teams.find(function (tm) { return tm.id === t.teamId; }) || green).name; });
    if (!d.tournaments.some(function (t) { return t.teamId === intuit.id; })) {
      var first = nextWeekdayDate('Wednesday');
      d.tournaments.push({ id: 't_intuit_united_s1', teamId: intuit.id, name: 'Season 1', teamName: 'Intuit United', defaultDay: 'Wednesday', location: '', startDate: first, weekCount: 7, matchTarget: 7, skipDates: [], createdAt: nowIso(), updatedAt: nowIso(), archived: false });
    }
    d.tournamentPlayers.forEach(function (tp) {
      var t = d.tournaments.find(function (x) { return x.id === tp.tournamentId; });
      var teamId = t && t.teamId ? t.teamId : green.id;
      tp.teamId = teamId;
      var existing = d.teamPlayers.find(function (row) { return row.teamId === teamId && row.globalPlayerId === tp.globalPlayerId; });
      if (!existing) d.teamPlayers.push({ id: uid('team_player'), teamId: teamId, globalPlayerId: tp.globalPlayerId, membership: tp.membership || 'support', skills: clone(tp.skills || defaultSkills()), active: true, createdAt: tp.createdAt || nowIso(), updatedAt: tp.updatedAt || nowIso() });
    });
    var supportIds = {};
    d.tournamentPlayers.forEach(function (tp) { if ((tp.membership || 'support') === 'support') supportIds[tp.globalPlayerId] = tp.skills || defaultSkills(); });
    Object.keys(supportIds).forEach(function (gpId) {
      if (!d.teamPlayers.some(function (row) { return row.teamId === intuit.id && row.globalPlayerId === gpId; })) d.teamPlayers.push({ id: uid('team_player'), teamId: intuit.id, globalPlayerId: gpId, membership: 'support', skills: clone(supportIds[gpId] || defaultSkills()), active: true, createdAt: nowIso(), updatedAt: nowIso() });
    });
    d.teamPlayers.forEach(function (row) { row.active = row.active !== false; row.membership = row.membership === 'team' ? 'team' : 'support'; row.skills = normalizeSkills(row.skills || (d.globalPlayers.find(function (gp) { return gp.id === row.globalPlayerId; }) || {}).defaultSkills || defaultSkills()); });
  }
  function migrateData(d) {
    d.globalPlayers = d.globalPlayers || [];
    d.tournaments = d.tournaments || [];
    d.tournamentPlayers = d.tournamentPlayers || [];
    d.matches = d.matches || [];
    d.matchPlayers = d.matchPlayers || [];
    d.teams = Array.isArray(d.teams) ? d.teams : [];
    d.teamPlayers = Array.isArray(d.teamPlayers) ? d.teamPlayers : [];
    ensureV5Teams(d);
    d.customAvatars = Array.isArray(d.customAvatars) ? d.customAvatars : [];
    d.customAvatars.forEach(function (a, index) {
      if (!a.id) a.id = uid("avatar");
      if (!a.label) a.label = "Custom Avatar " + (index + 1);
      if (!a.src && a.dataUrl) a.src = a.dataUrl;
      a.custom = true;
      a.createdAt = a.createdAt || nowIso();
      a.updatedAt = a.updatedAt || a.createdAt;
    });
    d.tournaments.forEach(function (t) {
      if (t.archived === undefined) t.archived = false;
      var ms = (d.matches || []).filter(function (m) { return m.tournamentId === t.id; });
      var dates = ms.map(function (m) { return m.date; }).filter(Boolean).sort();
      if (!t.startDate && dates.length) t.startDate = dates[0];
      if (!t.matchTarget) t.matchTarget = 7;
      t.matchTarget = clampMatchTarget(t.matchTarget);
      if (ms.length > 9 && t.matchTarget > 7) {
        var sortedMs = ms.slice().sort(function (a, b) { return ((a.date || '') + (a.time || '')).localeCompare((b.date || '') + (b.time || '')); });
        var extrasLookGenerated = sortedMs.slice(7).every(function (m) { return !hasMatchUserData(m, d.matchPlayers || []); });
        if (extrasLookGenerated) t.matchTarget = 7;
      }
      if (!t.weekCount) t.weekCount = Math.max(t.matchTarget || 7, 7);
      t.skipDates = Array.isArray(t.skipDates) ? t.skipDates : [];
      if (!t.defaultDay && dates.length) t.defaultDay = weekdayName(dates[0]);
    });
    d.tournamentPlayers.forEach(function (tp) {
      tp.skills = normalizeSkills(tp.skills);
      var clean = clampStrongPositions(tp.skills, tp.tournamentId, tp.id);
      tp.skills = clean.skills;
      tp.goalieEligible = (tp.skills.goalie || 0) >= 3;
      var pos = derivePositions(tp.skills, tp.tournamentId, tp.id);
      tp.primaryPosition = pos.primary;
      tp.secondaryPosition = pos.secondary;
      if (tp.tournamentGoalie && tp.skills.goalie < 3) tp.tournamentGoalie = false;
    });
    d.matches.forEach(function (m) {
      if (m.location === undefined) m.location = "";
      if (m.sequenceLocked === undefined) m.sequenceLocked = false;
      if (m.time === undefined || m.time === null) m.time = "";
      if (!m.suggestMode || m.suggestMode === "strongest") m.suggestMode = "positional";
      if (m.suggestMode === "fairness") m.suggestMode = "signup";
      if (!m.rotationStyle) m.rotationStyle = "balanced";
      if (!m.keeperPlan) m.keeperPlan = "fixed";
      if (m.keeperPlan !== "fixed" && m.keeperPlan !== "split" && m.keeperPlan !== "manual") m.keeperPlan = "fixed";
      if (!m.subTiming) m.subTiming = inferSubTiming(m);
      if (!m.finalPhase) m.finalPhase = hasLiveFinalWindow(m) ? "live" : "planned";
      if (m.finalPhase !== "live" && m.finalPhase !== "planned") m.finalPhase = "live";
      if (m.generatedFromTournament === undefined) m.generatedFromTournament = !hasMatchUserData(m, d.matchPlayers || []);
      if (m.title && /^vs\s+/i.test(m.title) && m.opponent) m.title = "Match";
      normalizeFormationLineup(m);
      applyFinalPhaseMode(m, m.finalPhase, true);
    });
    d.tournaments.forEach(function (t) { syncTournamentRosterFromTeam(t.id); });
    return d;
  }
  function weekdayName(dateStr) {
    var d = new Date(dateStr + "T00:00:00");
    if (isNaN(d.getTime())) return "Tuesday";
    return ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][d.getDay()];
  }
  function nextWeekdayDate(targetWeekday) {
    var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var idx = days.indexOf(targetWeekday || "Tuesday");
    if (idx < 0) idx = 2;
    var d = new Date();
    d.setHours(0, 0, 0, 0);
    var diff = (idx - d.getDay() + 7) % 7;
    if (diff === 0) diff = 7;
    d.setDate(d.getDate() + diff);
    return d.toISOString().slice(0, 10);
  }
  function addDays(dateStr, days) {
    var d = new Date(dateStr + "T00:00:00");
    d.setDate(d.getDate() + days);
    return d.toISOString().slice(0, 10);
  }
  function clampMatchTarget(value) {
    return Math.max(1, Math.min(9, Number(value || 7)));
  }
  function skipDatesFor(t) {
    if (!t.skipDates) t.skipDates = [];
    t.skipDates = t.skipDates.filter(Boolean).filter(function (d, i, arr) { return arr.indexOf(d) === i; }).sort();
    return t.skipDates;
  }
  function isSkipDate(t, date) {
    return skipDatesFor(t).indexOf(date) >= 0;
  }
  function addSkipDate(t, date) {
    var skips = skipDatesFor(t);
    if (date && skips.indexOf(date) < 0) skips.push(date);
    t.skipDates = skips.filter(Boolean).sort();
  }
  function removeSkipDate(t, date) {
    if (!t) return;
    t.skipDates = skipDatesFor(t).filter(function (d) { return d !== date; });
  }
  function hasLineupData(m) {
    return !!(m && m.lineup && Object.keys(m.lineup).some(function (k) { return !!m.lineup[k]; }));
  }
  function hasLiveFinalWindow(match) {
    return !!(match && (match.subWindows || []).some(function (w) { return !!w.live && Number(w.minute || 0) >= 37; }));
  }
  function inferSubTiming(match) {
    var count = (match && match.subWindows ? match.subWindows.length : 0);
    if (count >= 5) return "heavy";
    if ((match && match.subWindows || []).some(function (w) { return Number(w.minute || 0) === 8 || Number(w.minute || 0) === 16; })) return "fast";
    return "standard";
  }
  function finalWindow(match) {
    if (!match) return null;
    var windows = match.subWindows || [];
    var sorted = windows.slice().sort(function (a, b) { return Number(a.minute || 0) - Number(b.minute || 0); });
    return sorted.filter(function (w) { return Number(w.minute || 0) >= 37; })[0] || null;
  }
  function finalPhaseConfig(match) {
    var timing = (match && (match.subTiming || inferSubTiming(match))) || "standard";
    return timing === "heavy" ? { minute: 42, label: "Last 8 min", text: "final 8" } : { minute: 38, label: "Last 12 min", text: "final 12" };
  }
  function applyFinalPhaseMode(match, mode, quiet) {
    if (!match) return;
    match.finalPhase = mode === "planned" ? "planned" : "live";
    match.subWindows = Array.isArray(match.subWindows) ? match.subWindows : clone(TEMPLATES.balanced);
    var cfg = finalPhaseConfig(match);
    var fw = finalWindow(match);
    if (!fw) {
      fw = { id: uid("w"), label: cfg.label, minute: cfg.minute, live: match.finalPhase === "live", targetSubs: "" };
      match.subWindows.push(fw);
    }
    var standardFinal = /^(Last 12 min|Last 8 min|Second half \+16|Custom live phase)$/i.test(fw.label || "") || fw.id === "w_last" || fw.id === "w_last8" || fw.id === "w_sh16";
    if (standardFinal) {
      fw.label = cfg.label;
      fw.minute = cfg.minute;
    }
    fw.live = match.finalPhase === "live";
    if (!quiet) { match.subs = (match.subs || []).filter(function (sub) { return sub.windowId !== fw.id || !fw.live; }); }
  }

  function hasMatchUserData(m, matchPlayersOverride) {
    if (!m) return false;
    var allMatchPlayers = matchPlayersOverride || ((typeof data !== 'undefined' && data && data.matchPlayers) ? data.matchPlayers : []);
    if (m.sequenceLocked) return true;
    if (m.opponent || m.time || m.rawRosterText) return true;
    if (m.scoreFor !== null && m.scoreFor !== undefined) return true;
    if (m.scoreAgainst !== null && m.scoreAgainst !== undefined) return true;
    if (m.status === 'planned' || m.status === 'completed') return true;
    if (hasLineupData(m)) return true;
    if ((m.subs || []).length) return true;
    if ((allMatchPlayers || []).some(function (p) { return p.matchId === m.id; })) return true;
    return false;
  }
  function isTrimCandidate(m) {
    return !!m && m.generatedFromTournament !== false && !hasMatchUserData(m);
  }
  function normalizeFormationLineup(match) {
    if (!match) return;
    match.lineup = match.lineup || {};
    if (match.formation === '3-2-1') {
      if (match.lineup.CM && !match.lineup.LM) match.lineup.LM = match.lineup.CM;
      if (match.lineup.AM && !match.lineup.RM) match.lineup.RM = match.lineup.AM;
      delete match.lineup.CM;
      delete match.lineup.AM;
      (match.subs || []).forEach(function (sub) {
        if (sub.position === 'CM') sub.position = 'LM';
        if (sub.position === 'AM') sub.position = 'RM';
      });
    }
  }
  function trimExtraGeneratedMatches(tId) {
    var t = data.tournaments.find(function (x) { return x.id === tId; });
    if (!t) return;
    var target = clampMatchTarget(t.matchTarget || 7);
    var sorted = matches(tId);
    var extra = sorted.length - target;
    if (extra <= 0) return;
    var removeIds = [];
    for (var i = sorted.length - 1; i >= 0 && extra > 0; i--) {
      var m = sorted[i];
      if (isTrimCandidate(m)) {
        removeIds.push(m.id);
        extra--;
      }
    }
    if (removeIds.length) {
      data.matches = data.matches.filter(function (m) { return removeIds.indexOf(m.id) < 0; });
      data.matchPlayers = data.matchPlayers.filter(function (p) { return removeIds.indexOf(p.matchId) < 0; });
    }
  }
  function regenerateEmptyGeneratedSchedule(tId) {
    var removeIds = data.matches.filter(function (m) { return m.tournamentId === tId && isTrimCandidate(m); }).map(function (m) { return m.id; });
    if (removeIds.length) {
      data.matches = data.matches.filter(function (m) { return removeIds.indexOf(m.id) < 0; });
      data.matchPlayers = data.matchPlayers.filter(function (p) { return removeIds.indexOf(p.matchId) < 0; });
    }
    fillTournamentSchedule(tId);
  }

  function fillTournamentSchedule(tId) {
    var t = data.tournaments.find(function (x) { return x.id === tId; });
    if (!t) return false;
    var changed = false;
    var target = clampMatchTarget(t.matchTarget || 7);
    t.matchTarget = target;
    skipDatesFor(t);
    var ms = matches(tId);
    var start = t.startDate || (ms[0] && ms[0].date) || nextWeekdayDate(t.defaultDay);
    if (t.startDate !== start) { t.startDate = start; changed = true; }
    trimExtraGeneratedMatches(tId);
    var guard = 0;
    var weekIndex = 0;
    while (data.matches.filter(function (m) { return m.tournamentId === tId; }).length < target && guard < 90) {
      var date = addDays(start, weekIndex * 7);
      if (!isSkipDate(t, date)) {
        var onDate = data.matches.filter(function (m) { return m.tournamentId === tId && m.date === date; });
        if (!onDate.length) {
          var created = createMatchSeed(tId, date, data.matches.filter(function (m) { return m.tournamentId === tId; }).length);
          created.generatedFromTournament = true;
          data.matches.push(created);
          changed = true;
        }
      }
      weekIndex++;
      guard++;
    }
    trimExtraGeneratedMatches(tId);
    renumberTournamentMatches(tId);
    t.weekCount = tournamentWeeks(tId).length;
    return changed;
  }
  function reconcileTournamentSchedule(tId) {
    var t = data.tournaments.find(function (x) { return x.id === tId; });
    if (!t) return;
    t.matchTarget = clampMatchTarget(t.matchTarget || 7);
    skipDatesFor(t);
    matches(tId).forEach(normalizeFormationLineup);
    fillTournamentSchedule(tId);
  }
  function createMatchObject(tournamentId, date, time, opponent) {
    var t = data.tournaments.find(function (x) { return x.id === tournamentId; });
    return {
      id: uid("match"), tournamentId: tournamentId, title: opponent ? "vs " + opponent : "Match",
      date: date || nextWeekdayDate(t && t.defaultDay), time: time || "", opponent: opponent || "",
      location: t ? (t.location || "") : "", formation: lastFormation(tournamentId) || "2-3-1", suggestMode: "positional", rotationStyle: "balanced", keeperPlan: "fixed", subTiming: "standard", finalPhase: "live",
      status: "draft", scoreFor: null, scoreAgainst: null, result: "", rawRosterText: "", matchImportSummary: null,
      lineup: {}, subWindows: clone(TEMPLATES.balanced), subs: [], strategyNote: defaultStrategyNote(), showMinutes: false,
      createdAt: nowIso(), updatedAt: nowIso(), generatedFromTournament: false
    };
  }
  function lastFormation(tournamentId) {
    var ms = matches(tournamentId).filter(function (m) { return m.formation; });
    if (!ms.length) return "2-3-1";
    return ms[ms.length - 1].formation || "2-3-1";
  }
  function defaultStrategyNote() {
    return "Last phase: live rotation. We will define changes in the moment based on who is tired and who is ready to jump in. Unlimited changes, stay ready.";
  }
  function seedData() {
    var tournamentId = "t_green_fc_s5";
    var seed = [
      ["Jose", "defense", ["Chema"], "team"],
      ["Franco", "goalie", [], "team"],
      ["Nishanth", "wing", ["Nisanth", "Nishant"], "team"],
      ["Johan", "forward", [], "team"],
      ["Fernando", "defense", ["Fer"], "team"],
      ["Thomas", "center", [], "team"],
      ["Lucas", "center", [], "team"],
      ["Roberto", "wing", [], "team"],
      ["Miguel", "forward", [], "team"],
      ["Andrew", "defense", [], "support"],
      ["Chris", "defense", [], "support"],
      ["Himanshu", "wing", [], "support"],
      ["Tobias", "forward", ["Tobi"], "support"],
      ["Greg", "defense", [], "support"],
      ["Eric", "wing", [], "support"]
    ];
    var globalPlayers = [];
    var tPlayers = [];
    seed.forEach(function (row, index) {
      var name = row[0], role = row[1], aliases = row[2], membership = row[3];
      var gpId = uid("gp");
      var skills = seedSkills(role);
      if (name === "Jose") skills = { forward: 3, wing: 4, center: 3, defense: 5, goalie: 1 };
      if (name === "Franco") skills = { forward: 2, wing: 2, center: 2, defense: 4, goalie: 5 };
      if (name === "Fernando") skills = { forward: 2, wing: 2, center: 4, defense: 5, goalie: 1 };
      if (name === "Thomas") skills = { forward: 2, wing: 3, center: 5, defense: 4, goalie: 1 };
      if (name === "Lucas") skills = { forward: 3, wing: 4, center: 5, defense: 3, goalie: 1 };
      var clean = clampStrongPositions(skills, tournamentId); skills = clean.skills; var pos = derivePositions(skills, tournamentId);
      globalPlayers.push({ id: gpId, name: name, normalizedName: normalizeAlias(name), aliases: aliases, avatarId: AVATARS[index % AVATARS.length].id, defaultSkills: skills, createdAt: nowIso(), updatedAt: nowIso() });
      tPlayers.push({ id: uid("tp"), tournamentId: tournamentId, globalPlayerId: gpId, membership: membership, skills: clone(skills), primaryPosition: pos.primary, secondaryPosition: pos.secondary, goalieEligible: skills.goalie >= 3, tournamentGoalie: name === "Franco", createdAt: nowIso(), updatedAt: nowIso() });
    });
    var first = nextWeekdayDate("Tuesday");
    var t = { id: tournamentId, name: "Season 5", teamName: "Green FC", defaultDay: "Tuesday", location: "Home field", startDate: first, weekCount: 7, matchTarget: 7, skipDates: [], createdAt: nowIso(), updatedAt: nowIso() };
    var matchesSeed = [];
    for (var i = 0; i < 7; i++) { var seededMatch = createMatchSeed(tournamentId, addDays(first, i * 7), i); seededMatch.location = t.location || ''; matchesSeed.push(seededMatch); }
    return { globalPlayers: globalPlayers, tournaments: [t], tournamentPlayers: tPlayers, matches: matchesSeed, matchPlayers: [] };
  }
  function createMatchSeed(tId, date, index) {
    var t = (data && data.tournaments) ? data.tournaments.find(function (x) { return x.id === tId; }) : null;
    return { id: uid("match"), tournamentId: tId, title: "Match " + (index + 1), date: date, time: "", opponent: "", location: t ? (t.location || "") : "", formation: index === 0 ? "2-3-1" : "2-3-1", suggestMode: "positional", rotationStyle: "balanced", keeperPlan: "fixed", subTiming: "standard", finalPhase: "live", status: "draft", scoreFor: null, scoreAgainst: null, result: "", rawRosterText: "", matchImportSummary: null, lineup: {}, subWindows: clone(TEMPLATES.balanced), subs: [], strategyNote: defaultStrategyNote(), showMinutes: false, createdAt: nowIso(), updatedAt: nowIso(), generatedFromTournament: true };
  }

  function playerContext(matchPlayer) {
    var tp = matchPlayer.tournamentPlayerId ? tournamentPlayer(matchPlayer.tournamentPlayerId) : null;
    var gp = tp ? globalPlayer(tp.globalPlayerId) : (matchPlayer.globalPlayerId ? globalPlayer(matchPlayer.globalPlayerId) : null);
    var skills = tp ? tp.skills : (gp ? gp.defaultSkills : (matchPlayer.temporarySkills || defaultSkills("wing")));
    return {
      matchPlayer: matchPlayer,
      tournamentPlayer: tp,
      globalPlayer: gp,
      name: gp ? gp.name : matchPlayer.name,
      avatarId: gp ? gp.avatarId : matchPlayer.avatarId,
      avatar: avatarById(gp ? gp.avatarId : matchPlayer.avatarId),
      membership: tp ? tp.membership : "support",
      skills: skills,
      primaryPosition: tp ? tp.primaryPosition : derivePositions(skills).primary,
      secondaryPosition: tp ? tp.secondaryPosition : derivePositions(skills).secondary,
      goalieEligible: tp ? tp.goalieEligible : skills.goalie >= 3,
      tournamentGoalie: tp ? tp.tournamentGoalie : false,
      signupOrder: matchPlayer.signupOrder || 999
    };
  }
  function slotStyle(slot) { return "left:" + slot.x + "%;top:" + slot.y + "%;"; }
  function roleForPosition(position, formation) {
    var slot = (FORMATIONS[formation] || FORMATIONS["2-3-1"]).find(function (s) { return s.position === position; });
    return slot ? slot.role : "center";
  }
  function roleSkill(ctx, role) {
    var s = (ctx && ctx.skills) || defaultSkills("wing");
    if (role === "goalie") return Number(s.goalie || 0);
    if (role === "defense") return Number(s.defense || 0);
    if (role === "wing") return Number(s.wing || 0);
    if (role === "center") return Number(s.center || 0);
    if (role === "forward") return Number(s.forward || 0);
    return 0;
  }
  function bestRosterSkillForSlot(peers, slot) {
    var best = 0;
    (peers || []).forEach(function (p) {
      if (p.membership === "team") best = Math.max(best, roleSkill(p, slot.role));
    });
    return best;
  }
  function supportStartAdjustment(ctx, slot, peers) {
    if (!ctx || ctx.membership !== "support" || slot.position === "GK") return 0;
    var main = roleSkill(ctx, slot.role);
    var bestRoster = bestRosterSkillForSlot(peers, slot);
    var critical = slot.role === "defense" || slot.role === "center";
    if (critical) {
      if (main < 5) return -520;
      if (bestRoster >= 3 && (main - bestRoster) < 2) return -380;
      return 20;
    }
    if (slot.role === "forward") {
      if (main >= 5 && (main - bestRoster) >= 2) return 20;
      if ((main - bestRoster) < 2) return -170;
      return -40;
    }
    if ((main - bestRoster) < 2) return -110;
    return -30;
  }
  function lineupFitScore(ctx, slot, mode, peers) {
    return fitScore(ctx, slot, mode) + supportStartAdjustment(ctx, slot, peers);
  }
  function fitScore(ctx, slot, mode) {
    var s = ctx.skills || defaultSkills("wing");
    var score = 0;
    if (slot.position === "GK") {
      if (!ctx.goalieEligible && s.goalie < 3) return -10000 + (s.goalie || 0) * 20;
      score = (s.goalie || 0) * 300;
      if (ctx.tournamentGoalie) score += 700;
      if (ctx.membership === "team") score += 25;
      return score;
    }
    if (slot.role === "defense") score = (s.defense || 0) * 120 + (s.center || 0) * 22 + (s.wing || 0) * 12;
    if (slot.role === "wing") score = (s.wing || 0) * 120 + (s.forward || 0) * 30 + (s.center || 0) * 24 + (s.defense || 0) * 8;
    if (slot.role === "center") score = (s.center || 0) * 120 + (s.wing || 0) * 28 + (s.defense || 0) * 22 + (s.forward || 0) * 12;
    if (slot.role === "forward") score = (s.forward || 0) * 130 + (s.wing || 0) * 30 + (s.center || 0) * 12;
    var primaryRole = posShortToRole(ctx.primaryPosition);
    var secondaryRole = posShortToRole(ctx.secondaryPosition);
    if (primaryRole === slot.role) score += 45;
    if (secondaryRole === slot.role) score += 22;
    var mainSkill = slot.role === "defense" ? s.defense : slot.role === "wing" ? s.wing : slot.role === "center" ? s.center : s.forward;
    if (mainSkill >= 5) score += 60;
    if (mainSkill === 4) score += 25;
    if (mainSkill <= 2) score -= 120;
    if (ctx.membership === "team") score += 55;
    if (mode === "signup") {
      score += Math.max(0, 95 - (ctx.signupOrder || 99) * 6);
    } else {
      score += Math.max(0, 15 - (ctx.signupOrder || 99));
    }
    return score;
  }
  function posShortToRole(short) {
    if (short === "FWD") return "forward";
    if (short === "WNG") return "wing";
    if (short === "CTR") return "center";
    if (short === "DEF") return "defense";
    if (short === "GK") return "goalie";
    return "center";
  }
  function suggestLineup(matchId, mode) {
    var match = data.matches.find(function (m) { return m.id === matchId; });
    if (!match) return;
    mode = mode || match.suggestMode || "positional";
    match.suggestMode = mode;
    var players = activeMatchPlayers(matchId).map(playerContext);
    var formation = FORMATIONS[match.formation] || FORMATIONS["2-3-1"];
    if (players.length < 1) return toast("Import players first.");
    var gkSlot = formation.find(function (s) { return s.position === "GK"; });
    var outSlots = formation.filter(function (s) { return s.position !== "GK"; });
    var gkCandidates = players.slice().sort(function (a, b) { return fitScore(b, gkSlot, mode) - fitScore(a, gkSlot, mode); });
    var goalie = gkCandidates[0];
    var remaining = players.filter(function (p) { return p.matchPlayer.id !== goalie.matchPlayer.id; });
    var best = { score: -Infinity, assign: {} };
    function backtrack(index, available, assign, score) {
      if (index >= outSlots.length) {
        if (score > best.score) best = { score: score, assign: clone(assign) };
        return;
      }
      var slot = outSlots[index];
      available.forEach(function (ctx, i) {
        var nextAvailable = available.slice(0, i).concat(available.slice(i + 1));
        assign[slot.position] = ctx.matchPlayer.id;
        backtrack(index + 1, nextAvailable, assign, score + lineupFitScore(ctx, slot, mode, players));
        delete assign[slot.position];
      });
      if (available.length === 0) backtrack(index + 1, available, assign, score - 9999);
    }
    backtrack(0, remaining, {}, 0);
    var lineup = {};
    if (goalie) lineup.GK = goalie.matchPlayer.id;
    Object.keys(best.assign).forEach(function (pos) { lineup[pos] = best.assign[pos]; });
    match.lineup = lineup;
    match.status = "planned";
    match.showMinutes = true;
    match.updatedAt = nowIso();
    save();
    render();
    toast(mode === "signup" ? "Sign-up order lineup suggested." : "Positional lineup suggested.");
  }
  function benchPlayers(match) {
    return benchPlayersForLineup(match, lineupFor(match));
  }
  function orderedSubWindows(match) {
    return (match.subWindows || []).slice().sort(function (a, b) { return a.minute - b.minute; });
  }
  function lineupSnapshot(match, throughWindowId) {
    var current = clone(lineupFor(match));
    if (!throughWindowId || throughWindowId === "initial") return current;
    var windows = orderedSubWindows(match);
    for (var i = 0; i < windows.length; i++) {
      var w = windows[i];
      if (!w.live) {
        (match.subs || []).filter(function (s) { return s.windowId === w.id; }).forEach(function (s) {
          applySubToLineup(match, current, s);
        });
      }
      if (throughWindowId !== "final" && w.id === throughWindowId) break;
    }
    return current;
  }
  function benchPlayersForLineup(match, lineupMap) {
    var used = Object.keys(lineupMap || {}).map(function (k) { return lineupMap[k]; }).filter(Boolean);
    return activeMatchPlayers(match.id).filter(function (p) { return used.indexOf(p.id) < 0; });
  }
  function orderedSubsInWindow(match, windowId) {
    return (match.subs || []).filter(function (s) { return s.windowId === windowId; }).sort(function (a, b) { return (a.order || 0) - (b.order || 0); });
  }
  function lineupBeforeWindow(match, windowId) {
    var current = clone(lineupFor(match));
    var windows = orderedSubWindows(match);
    for (var i = 0; i < windows.length; i++) {
      var w = windows[i];
      if (w.id === windowId) break;
      if (!w.live) {
        orderedSubsInWindow(match, w.id).forEach(function (s) {
          applySubToLineup(match, current, s);
        });
      }
    }
    return current;
  }
  function lineupBeforeSub(match, subId) {
    var target = (match.subs || []).find(function (s) { return s.id === subId; });
    if (!target) return clone(lineupFor(match));
    var current = lineupBeforeWindow(match, target.windowId);
    orderedSubsInWindow(match, target.windowId).forEach(function (s) {
      if (s.id === target.id) return;
      if ((s.order || 0) < (target.order || 0)) applySubToLineup(match, current, s);
    });
    return current;
  }
  function lineupBeforeNewSub(match, windowId) {
    var current = lineupBeforeWindow(match, windowId);
    orderedSubsInWindow(match, windowId).forEach(function (s) {
      applySubToLineup(match, current, s);
    });
    return current;
  }
  function positionOfPlayer(lineupMap, playerId) {
    var found = '';
    Object.keys(lineupMap || {}).forEach(function (pos) { if (lineupMap[pos] === playerId) found = pos; });
    return found;
  }
  function idsOnField(lineupMap) {
    return Object.keys(lineupMap || {}).map(function (p) { return lineupMap[p]; }).filter(Boolean);
  }
  function applySubToLineup(match, current, sub) {
    if (!sub || !sub.playerInId) return current;
    var outPos = positionOfPlayer(current, sub.playerOutId);
    var targetPos = sub.position || outPos;
    if (!targetPos) return current;
    Object.keys(current || {}).forEach(function (pos) { if (current[pos] === sub.playerInId) delete current[pos]; });
    if (outPos && targetPos !== outPos) {
      var shiftedPlayerId = current[targetPos];
      current[targetPos] = sub.playerInId;
      if (shiftedPlayerId && shiftedPlayerId !== sub.playerOutId) current[outPos] = shiftedPlayerId;
      else delete current[outPos];
    } else {
      current[targetPos] = sub.playerInId;
    }
    return current;
  }
  function matchPlayerGkCapable(matchPlayerId) {
    var mp = data.matchPlayers.find(function (p) { return p.id === matchPlayerId; });
    if (!mp) return false;
    var ctx = playerContext(mp);
    return !!(ctx.tournamentGoalie || ctx.goalieEligible || (ctx.skills && Number(ctx.skills.goalie || 0) >= 3));
  }
  function subRequiresGkCapable(match, sub, nextInId, nextOutId, nextPosition) {
    var before = lineupBeforeWindow(match, sub.windowId);
    var outPos = positionOfPlayer(before, nextOutId);
    var targetPos = nextPosition || sub.position || outPos;
    return outPos === 'GK' || targetPos === 'GK';
  }
  function validateSubChoice(match, sub, nextInId, nextOutId, nextPosition) {
    if (!match || !sub) return false;
    var rows = orderedSubsInWindow(match, sub.windowId).filter(function (r) { return r.id !== sub.id; });
    var usedIn = rows.map(function (r) { return r.playerInId; }).filter(Boolean);
    var usedOut = rows.map(function (r) { return r.playerOutId; }).filter(Boolean);
    var beforeWindow = lineupBeforeWindow(match, sub.windowId);
    var benchAtWindow = benchPlayersForLineup(match, beforeWindow).map(function (p) { return p.id; });
    var fieldAtWindow = idsOnField(beforeWindow);
    if (nextInId && benchAtWindow.indexOf(nextInId) < 0) { toast('Incoming player must be on the bench before this window.'); return false; }
    if (nextOutId && fieldAtWindow.indexOf(nextOutId) < 0) { toast('Outgoing player must be on the field before this window.'); return false; }
    if (nextInId && usedOut.indexOf(nextInId) >= 0) { toast('A player taken out cannot also go in during the same window.'); return false; }
    if (nextOutId && usedIn.indexOf(nextOutId) >= 0) { toast('A player going in cannot also go out during the same window.'); return false; }
    if (nextInId && usedIn.indexOf(nextInId) >= 0) { toast('This incoming player is already used in this window.'); return false; }
    if (nextOutId && usedOut.indexOf(nextOutId) >= 0) { toast('This outgoing player is already used in this window.'); return false; }
    if (nextInId && nextOutId && nextInId === nextOutId) { toast('Incoming and outgoing player cannot be the same.'); return false; }
    if (subRequiresGkCapable(match, sub, nextInId, nextOutId, nextPosition) && !matchPlayerGkCapable(nextInId)) {
      toast('Goalkeeper substitutions require the incoming player to be GK-capable.');
      return false;
    }
    return true;
  }

  function subPositionLabel(match, sub) {
    var before = lineupBeforeWindow(match, sub.windowId);
    var outPos = positionOfPlayer(before, sub.playerOutId);
    var targetPos = sub.position || outPos || 'POS';
    return sub.manualPosition && outPos && targetPos !== outPos ? targetPos + ' ↔ ' + outPos : targetPos;
  }
  function positionOverrideOptions(match, sub) {
    var before = lineupBeforeWindow(match, sub.windowId);
    var selected = sub.position || positionOfPlayer(before, sub.playerOutId) || '';
    return (FORMATIONS[match.formation] || FORMATIONS['2-3-1']).map(function (slot) {
      var mp = before[slot.position] ? data.matchPlayers.find(function (p) { return p.id === before[slot.position]; }) : null;
      var name = mp ? playerContext(mp).name.split(' ')[0] : 'empty';
      var label = slot.position + ' · ' + name;
      return '<option value="' + slot.position + '" ' + (slot.position === selected ? 'selected' : '') + '>' + escapeHtml(label) + '</option>';
    }).join('');
  }
  function candidateInPlayers(match, sub) {
    var beforeWindow = lineupBeforeWindow(match, sub.windowId);
    var benchAtWindow = benchPlayersForLineup(match, beforeWindow).map(function (p) { return p.id; });
    var rows = orderedSubsInWindow(match, sub.windowId).filter(function (r) { return r.id !== sub.id; });
    var usedIn = rows.map(function (r) { return r.playerInId; }).filter(Boolean);
    var usedOut = rows.map(function (r) { return r.playerOutId; }).filter(Boolean);
    var allowed = benchAtWindow.filter(function (id) { return usedIn.indexOf(id) < 0 && usedOut.indexOf(id) < 0; });
    if (sub.playerInId && allowed.indexOf(sub.playerInId) < 0) allowed.unshift(sub.playerInId);
    return activeMatchPlayers(match.id).filter(function (mp) { return allowed.indexOf(mp.id) >= 0; });
  }

  function candidateOutPlayers(match, sub) {
    var beforeWindow = lineupBeforeWindow(match, sub.windowId);
    var rows = orderedSubsInWindow(match, sub.windowId).filter(function (r) { return r.id !== sub.id; });
    var usedOut = rows.map(function (r) { return r.playerOutId; }).filter(Boolean);
    var usedIn = rows.map(function (r) { return r.playerInId; }).filter(Boolean);
    var regular = [];
    var keepers = [];
    idsOnField(beforeWindow).forEach(function (id) {
      if (usedOut.indexOf(id) >= 0 || usedIn.indexOf(id) >= 0) return;
      var pos = positionOfPlayer(beforeWindow, id);
      if (pos === 'GK') keepers.push(id);
      else regular.push(id);
    });
    var ids = regular.concat(keepers);
    if (sub.playerOutId && ids.indexOf(sub.playerOutId) < 0) ids.push(sub.playerOutId);
    return ids.map(function (id) { return activeMatchPlayers(match.id).find(function (mp) { return mp.id === id; }); }).filter(Boolean);
  }

  function chooseBestOutForIn(match, current, inId, blockedOut) {
    blockedOut = blockedOut || {};
    var inMp = data.matchPlayers.find(function (p) { return p.id === inId; });
    var inCtx = inMp ? playerContext(inMp) : null;
    var best = null;
    (FORMATIONS[match.formation] || FORMATIONS['2-3-1']).forEach(function (slot) {
      if (slot.position === 'GK') return;
      var outId = current[slot.position];
      if (!outId || blockedOut[outId]) return;
      var score = inCtx ? subFit(inCtx, slot.position, match.formation) : 0;
      if (slot.role === 'wing') score += 90;
      if (slot.role === 'forward') score += 30;
      if (slot.role === 'center') score -= 15;
      if (slot.role === 'defense') score -= 30;
      if (!best || score > best.score) best = { playerOutId: outId, position: slot.position, score: score };
    });
    return best;
  }
  function selectedMoment(match) {
    return (state.momentByMatch && state.momentByMatch[match.id]) || "initial";
  }
  function isPastMatch(m) {
    if (!m || !m.date) return false;
    if (m.status === "completed") return true;
    if (m.status === "cancelled" || m.status === "postponed") return false;
    var time = m.time || "23:59";
    var when = new Date((m.date || "") + "T" + time);
    return !isNaN(when.getTime()) && when.getTime() < Date.now();
  }
  function nextMatch(tId) {
    var future = matches(tId).filter(function (m) { return isConfirmedScheduleMatch(m) && !isPastMatch(m); });
    return future[0] || matches(tId).find(function (m) { return isConfirmedScheduleMatch(m); }) || matches(tId)[0];
  }
  function isConfirmedScheduleMatch(m) {
    return !!m && m.status !== "completed" && m.status !== "cancelled" && m.status !== "postponed";
  }
  function remainingMatches(tId) {
    return matches(tId).filter(function (m) { return isConfirmedScheduleMatch(m) && !isPastMatch(m); });
  }
  function todayDateString() {
    var d = new Date();
    d.setHours(0, 0, 0, 0);
    return d.toISOString().slice(0, 10);
  }
  function isUpcomingDateMatch(m) {
    return !!m && isConfirmedScheduleMatch(m) && !!m.date && m.date >= todayDateString();
  }
  function preferredTournamentId() {
    var candidates = [];
    visibleTournaments().forEach(function (t) {
      matches(t.id).filter(isUpcomingDateMatch).forEach(function (m) {
        candidates.push({ tournamentId: t.id, matchId: m.id, date: m.date, time: m.time || "" });
      });
    });
    candidates.sort(function (a, b) { return (a.date + a.time).localeCompare(b.date + b.time); });
    if (candidates.length) return candidates[0].tournamentId;
    var sorted = visibleTournaments().slice().sort(function (a, b) {
      var aDate = tournamentStats(a.id).end || a.updatedAt || a.createdAt || "";
      var bDate = tournamentStats(b.id).end || b.updatedAt || b.createdAt || "";
      return bDate.localeCompare(aDate);
    });
    return sorted[0] && sorted[0].id;
  }
  function syncActiveTournamentToPreferred(force) {
    var preferred = preferredTournamentId();
    if (!preferred) return;
    var active = activeTournament();
    var activeHasUpcoming = active && matches(active.id).some(isUpcomingDateMatch);
    if (force || !state.activeTournamentId || !activeHasUpcoming) {
      state.activeTournamentId = preferred;
      var n = nextMatch(preferred);
      state.activeMatchId = n && n.id;
    }
  }
  function metaParts(match) {
    var parts = [];
    if (match.opponent) parts.push("vs " + match.opponent);
    if (match.date) parts.push(formatLongDate(match.date));
    if (match.time) parts.push(match.time);
    if (match.location) parts.push(match.location);
    return parts;
  }
  function formatDateLabel(dateStr) {
    if (!dateStr) return "Not set";
    var d = new Date(dateStr + "T00:00:00");
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  }
  function formatLongDate(dateStr) {
    if (!dateStr) return "Not set";
    var d = new Date(dateStr + "T00:00:00");
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
  }
  function formatDateTime(iso) {
    if (!iso) return "Not saved yet";
    var d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleString(undefined, { year: "numeric", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
  }
  function tournamentStats(tId) {
    var ms = matches(tId);
    var dates = ms.map(function (m) { return m.date; }).filter(Boolean).sort();
    var byDate = {};
    ms.forEach(function (m) { if (m.date) { byDate[m.date] = byDate[m.date] || []; byDate[m.date].push(m); } });
    var doubleHeaders = Object.keys(byDate).filter(function (d) { return byDate[d].length > 1; }).length;
    var completed = ms.filter(function (m) { return isPastMatch(m) || m.status === "completed"; }).length;
    var upcoming = remainingMatches(tId).length;
    return {
      start: dates[0] || "",
      end: dates[dates.length - 1] || "",
      matchCount: ms.length,
      completed: completed,
      upcoming: upcoming,
      doubleHeaders: doubleHeaders,
      next: nextMatch(tId),
      byDate: byDate
    };
  }
  function weeksBetween(start, end) {
    if (!start || !end) return 0;
    var diff = new Date(end + "T00:00:00") - new Date(start + "T00:00:00");
    if (isNaN(diff)) return 0;
    return Math.max(0, Math.round(diff / 86400000 / 7));
  }
  function tournamentWeeks(tId) {
    var t = data.tournaments.find(function (x) { return x.id === tId; }) || activeTournament();
    var st = tournamentStats(tId);
    var start = t.startDate || st.start || nextWeekdayDate(t && t.defaultDay);
    var allDates = [start].concat(matches(tId).map(function (m) { return m.date; })).concat(skipDatesFor(t)).filter(Boolean).sort();
    var lastDate = allDates[allDates.length - 1] || start;
    var weekCount = weeksBetween(start, lastDate) + 1;
    weekCount = Math.max(weekCount, 1);
    t.weekCount = weekCount;
    var weeks = [];
    for (var i = 0; i < weekCount; i++) {
      var date = addDays(start, i * 7);
      weeks.push({ index: i + 1, date: date, skipped: isSkipDate(t, date), matches: (st.byDate[date] || []).slice().sort(function (a, b) { return (a.time || '').localeCompare(b.time || ''); }) });
    }
    return weeks;
  }
  function tournamentStatus(t) {
    if (t.archived) return { label: 'Archived', className: '', next: null };
    var next = nextMatch(t.id);
    var hasUpcoming = matches(t.id).some(isUpcomingDateMatch);
    var preferred = preferredTournamentId();
    if (t.id === preferred && hasUpcoming) return { label: 'Current', className: 'goal', next: next };
    if (hasUpcoming) return { label: 'Coming up', className: 'team', next: next };
    return { label: 'Past', className: '', next: next };
  }
  function tournamentOptionLabel(t) {
    var status = tournamentStatus(t);
    var label = (t.teamName || 'Team') + ' / ' + (t.name || 'Tournament') + ' — ' + status.label;
    if (status.next && status.next.date && status.label !== 'Past') label += ' · Next ' + formatDateLabel(status.next.date);
    return label;
  }
  function tournamentOptionsHtml(selectedId) {
    return visibleTournaments().map(function (x) {
      return '<option value="' + x.id + '" ' + (x.id === selectedId ? 'selected' : '') + '>' + escapeHtml(tournamentOptionLabel(x)) + '</option>';
    }).join('');
  }
  function renderTournamentSelector(t) {
    var status = tournamentStatus(t);
    var next = status.next;
    var nextText = next && next.date ? ('Next ' + matchDisplayTitle(next) + ' · ' + formatDateLabel(next.date)) : 'No upcoming match';
    return '<div class="compact-tournament-selector"><label>Tournament</label><select onchange="app.setActiveTournament(this.value)">' + tournamentOptionsHtml(t.id) + '</select><div class="row tournament-status-row"><span class="badge ' + status.className + '">' + escapeHtml(status.label) + '</span><small>' + escapeHtml(nextText) + '</small></div></div>';
  }
  function seasonProgressPct(tId) {
    var st = tournamentStats(tId);
    if (!st.matchCount) return 0;
    return Math.round((st.completed / st.matchCount) * 100);
  }

  function applySubTemplate(matchId, key) {
    var match = data.matches.find(function (m) { return m.id === matchId; });
    if (!match) return;
    match.subTiming = key === "heavy" ? "heavy" : key === "fast" ? "fast" : key === "simple" ? "standard" : "standard";
    match.subWindows = clone(TEMPLATES[key] || TEMPLATES.balanced);
    applyFinalPhaseMode(match, match.finalPhase || "live", true);
    match.subs = [];
    save(); render(); toast("Sub windows updated.");
  }
  function addWindow(matchId) {
    var match = data.matches.find(function (m) { return m.id === matchId; });
    if (!match) return;
    match.subTiming = "custom";
    match.subWindows.push({ id: uid("w"), label: "Custom window", minute: 25, live: false, targetSubs: "" });
    save(); render();
  }
  function updateWindow(matchId, windowId, field, value) {
    var match = data.matches.find(function (m) { return m.id === matchId; });
    var w = match && match.subWindows.find(function (x) { return x.id === windowId; });
    if (!w) return;
    if (field === "minute") value = Number(value || 0);
    if (field === "targetSubs") value = value === "" ? "" : Number(value || 0);
    if (field === "live") value = !!value;
    w[field] = value;
    save(); render();
  }
  function deleteWindow(matchId, windowId) {
    var match = data.matches.find(function (m) { return m.id === matchId; });
    if (!match) return;
    match.subWindows = match.subWindows.filter(function (w) { return w.id !== windowId; });
    match.subs = match.subs.filter(function (s) { return s.windowId !== windowId; });
    save(); render();
  }
  function subFit(ctx, position, formation) {
    var slot = (FORMATIONS[formation] || FORMATIONS["2-3-1"]).find(function (s) { return s.position === position; });
    return fitScore(ctx, slot || { position: position, role: roleForPosition(position, formation) }, "positional");
  }
  function rotationConfig(style) {
    if (style === "competitive") return { skill: 1.25, minutesIn: 7, minutesOut: 5, protectLow: 5, firstUseBonus: 180, supportPenalty: 60, recentPenalty: 140, repeatOutPenalty: 260, defCoverBonus: 80, defRestBonus: 40, label: "Competitive" };
    if (style === "fair") return { skill: 0.78, minutesIn: 24, minutesOut: 14, protectLow: 18, firstUseBonus: 360, supportPenalty: 120, recentPenalty: 260, repeatOutPenalty: 820, defCoverBonus: 360, defRestBonus: 260, label: "Fair minutes" };
    return { skill: 1.0, minutesIn: 18, minutesOut: 10, protectLow: 12, firstUseBonus: 300, supportPenalty: 90, recentPenalty: 200, repeatOutPenalty: 700, defCoverBonus: 300, defRestBonus: 220, label: "Balanced" };
  }

  function plannedHorizon(match) {
    if (!match || match.finalPhase !== "live") return 50;
    var fw = finalWindow(match);
    return Math.max(0, Math.min(50, Number((fw && fw.minute) || 38)));
  }
  function outfieldIds(match) {
    var gkId = lineupFor(match).GK;
    return activeMatchPlayers(match.id).filter(function (p) { return p.id !== gkId; }).map(function (p) { return p.id; });
  }
  function averageTargetMinutes(match) {
    var ids = outfieldIds(match);
    if (!ids.length) return 0;
    return (6 * plannedHorizon(match)) / ids.length;
  }
  function scoreSubCandidate(match, inCtx, outCtx, slot, minutesSoFar, changedRoles, recentIn, config, outCounts, allowDefenseRotation) {
    if (!inCtx || !outCtx || !slot || slot.position === "GK") return -Infinity;
    var inSkill = roleSkill(inCtx, slot.role);
    var outSkill = roleSkill(outCtx, slot.role);
    var critical = slot.role === "defense" || slot.role === "center";
    if (critical && inSkill <= 2) return -Infinity;
    var score = subFit(inCtx, slot.position, match.formation) * config.skill;
    var target = averageTargetMinutes(match);
    var inMins = minutesSoFar[inCtx.matchPlayer.id] || 0;
    var outMins = minutesSoFar[outCtx.matchPlayer.id] || 0;
    var previousOuts = (outCounts && outCounts[outCtx.matchPlayer.id]) || 0;
    var strongDefenseCover = slot.role === "defense" && inSkill >= 4;
    score += Math.max(0, target - inMins) * config.minutesIn;
    score += Math.max(0, outMins - target) * config.minutesOut;
    score -= Math.max(0, target - outMins) * (config.protectLow || 8);
    if (inMins <= 0) score += config.firstUseBonus || 260;
    if (outMins >= target + 5) score += 110;
    if (previousOuts > 0) score -= (config.repeatOutPenalty || 600) * previousOuts;
    else if ((match.rotationStyle || "balanced") !== "competitive") score += 85;
    if (slot.role === "wing") score += 80;
    if (slot.role === "forward") score += 30;
    if (slot.role === "center") score -= 35;
    if (slot.role === "defense") {
      if (allowDefenseRotation && strongDefenseCover) {
        score += config.defCoverBonus || 260;
        if (previousOuts === 0) score += config.defRestBonus || 180;
        if (outMins >= target - 10) score += 120;
      } else {
        score -= 95;
      }
    }
    if (changedRoles.defense && slot.role === "defense") score -= 1000;
    if (slot.role === "center" && changedRoles.core >= 1) score -= 650;
    if (slot.role === "defense" && changedRoles.core >= 1) score -= (allowDefenseRotation && strongDefenseCover) ? 220 : 650;
    if (recentIn[outCtx.matchPlayer.id]) score -= config.recentPenalty;
    if (inCtx.membership === "team" && outCtx.membership === "support") score += 120;
    if (inCtx.membership === "support" && outCtx.membership === "team") {
      score -= config.supportPenalty;
      if (critical && !(inSkill >= 5 && (inSkill - outSkill) >= 2)) score -= 420;
      else if (slot.role === "forward" && !(inSkill >= 5 && (inSkill - outSkill) >= 2)) score -= 170;
      else if (!critical && (inSkill - outSkill) < 2) score -= 120;
    }
    if (inSkill < outSkill) score -= (outSkill - inSkill) * 110;
    if (inSkill >= 5) score += 65;
    if (inSkill === 4) score += 28;
    if (inSkill <= 2) score -= 180;
    return score;
  }

  function ensureHeavyRotationIfNeeded(match, benchCount) {
    if (!match || benchCount <= 3) return false;
    if (match.subTiming === "custom") return false;
    if (match.subTiming !== "heavy" || inferSubTiming(match) !== "heavy") {
      match.subTiming = "heavy";
      match.subWindows = clone(TEMPLATES.heavy);
      applyFinalPhaseMode(match, match.finalPhase || "live", true);
      match.subs = [];
      return true;
    }
    return false;
  }
  function buildSplitKeeperSub(match) {
    if ((match.keeperPlan || "fixed") !== "split") return null;
    var initial = lineupFor(match);
    var gkOut = initial.GK;
    if (!gkOut) return null;
    var half = orderedSubWindows(match).filter(function (w) { return !w.live; }).find(function (w) { return Number(w.minute || 0) >= 24 && Number(w.minute || 0) <= 26; });
    if (!half) return null;
    var bench = benchPlayersForLineup(match, initial).filter(function (mp) { return mp.id !== gkOut && matchPlayerGkCapable(mp.id); });
    if (!bench.length) return null;
    var incoming = bench.map(playerContext).sort(function (a, b) { return roleSkill(b, 'goalie') - roleSkill(a, 'goalie'); })[0];
    if (!incoming) return null;
    return { id: uid("sub"), matchId: match.id, windowId: half.id, playerInId: incoming.matchPlayer.id, playerOutId: gkOut, position: "GK", manualPosition: false, order: 0, keeperChange: true };
  }

  function suggestSubs(matchId) {
    var match = data.matches.find(function (m) { return m.id === matchId; });
    if (!match) return;
    applyFinalPhaseMode(match, match.finalPhase || "live", true);
    var formation = FORMATIONS[match.formation] || FORMATIONS["2-3-1"];
    var active = activeMatchPlayers(matchId);
    var startingIds = idsOnField(lineupFor(match));
    if (startingIds.length < Math.min(7, active.length)) return toast("Build a starting lineup first.");
    var initialBench = benchPlayersForLineup(match, lineupFor(match));
    if (!initialBench.length) {
      match.subs = [];
      save(); render(); toast("No bench players for subs.");
      return;
    }
    var switchedHeavy = ensureHeavyRotationIfNeeded(match, initialBench.length);
    var windows = orderedSubWindows(match);
    var activeWindows = windows.filter(function (w) { return !w.live; });
    if (!activeWindows.length) return toast("Add at least one fixed substitution window.");
    var all = active.map(playerContext);
    var allById = {};
    all.forEach(function (c) { allById[c.matchPlayer.id] = c; });
    var benchCount = initialBench.length;
    var plan = [];
    var minutesSoFar = {};
    active.forEach(function (p) { minutesSoFar[p.id] = 0; });
    var current = clone(lineupFor(match));
    var lastMinute = 0;
    var config = rotationConfig(match.rotationStyle || "balanced");
    var recentIn = {};
    var outCounts = {};
    active.forEach(function (p) { outCounts[p.id] = 0; });
    var allowDefenseRotation = initialBench.length >= 2 && (match.rotationStyle || "balanced") !== "competitive";
    var splitKeeperRow = buildSplitKeeperSub(match);
    match.subs = [];
    activeWindows.forEach(function (w, wIndex) {
      var minute = Math.max(0, Math.min(50, Number(w.minute || 0)));
      addMinutes(current, minutesSoFar, minute - lastMinute);
      lastMinute = minute;
      var override = w.targetSubs !== undefined && w.targetSubs !== "" && w.targetSubs !== null;
      var desired = Math.min(3, override ? Number(w.targetSubs) : desiredSubsForWindow(benchCount, wIndex, activeWindows.length, match.rotationStyle || "balanced"));
      var preWindow = clone(current);
      var preBenchIds = benchPlayersForLineup(match, preWindow).map(function (p) { return p.id; });
      var preFieldIds = idsOnField(preWindow);
      var alreadyInThisWindow = {};
      var alreadyOutThisWindow = {};
      var changedRoles = { core: 0 };
      var windowRows = [];
      if (splitKeeperRow && splitKeeperRow.windowId === w.id) {
        windowRows.push(splitKeeperRow);
        alreadyInThisWindow[splitKeeperRow.playerInId] = true;
        alreadyOutThisWindow[splitKeeperRow.playerOutId] = true;
        recentIn[splitKeeperRow.playerInId] = true;
      }
      for (var k = 0; k < desired; k++) {
        var candidateIds = preBenchIds.filter(function (id) { return !alreadyInThisWindow[id] && !alreadyOutThisWindow[id]; });
        if (!candidateIds.length) break;
        var best = null;
        candidateIds.forEach(function (inId) {
          var inCtx = allById[inId];
          formation.forEach(function (slot) {
            if (slot.position === "GK") return;
            var outId = preWindow[slot.position];
            if (!outId || preFieldIds.indexOf(outId) < 0 || alreadyOutThisWindow[outId] || alreadyInThisWindow[outId]) return;
            var outCtx = allById[outId];
            var score = scoreSubCandidate(match, inCtx, outCtx, slot, minutesSoFar, changedRoles, recentIn, config, outCounts, allowDefenseRotation);
            if (!best || score > best.score) best = { inId: inId, outId: outId, position: slot.position, score: score, role: slot.role };
          });
        });
        if (!best || !isFinite(best.score)) break;
        var row = { id: uid("sub"), matchId: matchId, windowId: w.id, playerInId: best.inId, playerOutId: best.outId, position: best.position, manualPosition: false, order: windowRows.length + 1 };
        windowRows.push(row);
        plan.push(row);
        alreadyInThisWindow[best.inId] = true;
        alreadyOutThisWindow[best.outId] = true;
        recentIn[best.inId] = true;
        changedRoles[best.role] = true;
        if (best.role === "center" || best.role === "defense") changedRoles.core = (changedRoles.core || 0) + 1;
      }
      windowRows.forEach(function (row) {
        if (plan.indexOf(row) < 0) plan.push(row);
        if (row.playerOutId && outCounts[row.playerOutId] !== undefined && !row.keeperChange) outCounts[row.playerOutId] += 1;
        applySubToLineup(match, current, row);
      });
    });
    match.subs = plan.sort(function (a, b) { var wa = (match.subWindows || []).find(function (w) { return w.id === a.windowId; }); var wb = (match.subWindows || []).find(function (w) { return w.id === b.windowId; }); return Number(wa && wa.minute || 0) - Number(wb && wb.minute || 0) || (a.order || 0) - (b.order || 0); });
    if ((match.subWindows || []).some(function (w) { return w.live; })) match.strategyNote = match.strategyNote || defaultStrategyNote();
    save(); render(); toast((switchedHeavy ? "Heavy rotation applied. " : "") + "Substitution plan suggested with " + config.label.toLowerCase() + " rotation.");
  }

  function desiredSubsForWindow(benchCount, index, windowCount, style) {
    if (benchCount <= 0) return 0;
    if (index === 0) return Math.min(3, benchCount);
    if (style === "competitive") {
      if (benchCount === 1) return index === 1 ? 1 : 0;
      if (benchCount === 2) return index === 1 ? 1 : 0;
      return index < windowCount - 1 ? Math.min(2, benchCount) : 1;
    }
    if (benchCount === 1) return index === 1 ? 1 : 0;
    if (benchCount === 2) return index < 3 ? 2 : 0;
    if (benchCount === 3) return style === "fair" ? (index < windowCount ? 3 : 0) : (index === 1 ? 2 : index === 2 ? 2 : 1);
    var base = style === "fair" ? 3 : 2;
    return Math.min(3, Math.max(1, base));
  }

  function addSubRow(matchId, windowId) {
    var match = data.matches.find(function (m) { return m.id === matchId; });
    if (!match) return;
    if (idsOnField(lineupFor(match)).length < Math.min(7, activeMatchPlayers(matchId).length)) return toast("Build a starting lineup first.");
    var order = orderedSubsInWindow(match, windowId).length + 1;
    var placeholder = { id: uid("sub"), matchId: matchId, windowId: windowId, playerInId: "", playerOutId: "", position: "", manualPosition: false, order: order };
    var beforeWindow = lineupBeforeWindow(match, windowId);
    var benchAtWindow = benchPlayersForLineup(match, beforeWindow);
    var alreadyIn = orderedSubsInWindow(match, windowId).map(function (s) { return s.playerInId; });
    var candidateIn = benchAtWindow.filter(function (p) { return alreadyIn.indexOf(p.id) < 0; });
    if (!candidateIn.length) return toast("No eligible bench players left for this window.");
    var playerInId = candidateIn[0].id;
    var current = lineupBeforeNewSub(match, windowId);
    var blockedOut = {};
    orderedSubsInWindow(match, windowId).forEach(function (s) { if (s.playerOutId) blockedOut[s.playerOutId] = true; });
    var choice = chooseBestOutForIn(match, current, playerInId, blockedOut);
    if (!choice) return toast("No eligible on-field player to sub out.");
    placeholder.playerInId = playerInId;
    placeholder.playerOutId = choice.playerOutId;
    placeholder.position = choice.position;
    match.subs.push(placeholder);
    save(); render();
  }
  function updateSub(matchId, subId, field, value) {
    var match = data.matches.find(function (m) { return m.id === matchId; });
    var sub = match && match.subs.find(function (s) { return s.id === subId; });
    if (!sub) return;
    var nextInId = field === "playerInId" ? value : sub.playerInId;
    var nextOutId = field === "playerOutId" ? value : sub.playerOutId;
    var nextPosition = field === "position" ? value : sub.position;
    if (!validateSubChoice(match, sub, nextInId, nextOutId, nextPosition)) { render(); return; }
    sub[field] = value;
    if (field === "playerOutId") {
      var before = lineupBeforeWindow(match, sub.windowId);
      var pos = positionOfPlayer(before, value);
      if (pos) sub.position = pos;
      sub.manualPosition = false;
    }
    save(); render();
  }
  function deleteSub(matchId, subId) {
    var match = data.matches.find(function (m) { return m.id === matchId; });
    if (!match) return;
    match.subs = match.subs.filter(function (s) { return s.id !== subId; });
    save(); render();
  }
  function estimateMinutesBundle(match) {
    var players = activeMatchPlayers(match.id);
    var planned = {};
    var full = {};
    players.forEach(function (p) { planned[p.id] = 0; full[p.id] = 0; });
    var current = clone(lineupFor(match));
    var windows = (match.subWindows || []).slice().sort(function (a, b) { return a.minute - b.minute; });
    var liveFinal = match.finalPhase === "live";
    var cutoff = liveFinal ? plannedHorizon(match) : 50;
    var last = 0;
    windows.forEach(function (w) {
      var minute = Math.max(0, Math.min(50, Number(w.minute || 0)));
      if (liveFinal && minute > cutoff) return;
      var segmentEnd = Math.min(minute, cutoff);
      addMinutes(current, planned, segmentEnd - last);
      addMinutes(current, full, segmentEnd - last);
      last = segmentEnd;
      if (!w.live && minute <= cutoff) {
        (match.subs || []).filter(function (s) { return s.windowId === w.id; }).forEach(function (s) { applySubToLineup(match, current, s); });
      }
    });
    addMinutes(current, planned, cutoff - last);
    addMinutes(current, full, cutoff - last);
    if (liveFinal && cutoff < 50) {
      var extra = 50 - cutoff;
      var gkIds = goalkeeperIdsForPlan(match);
      players.forEach(function (p) {
        if (!gkIds[p.id]) full[p.id] = (full[p.id] || 0) + extra;
      });
      if ((match.keeperPlan || 'fixed') === 'fixed') {
        var gkId = lineupFor(match).GK;
        if (gkId && full[gkId] !== undefined) full[gkId] = 50;
      }
    } else {
      addMinutes(current, full, 50 - cutoff);
    }
    return { planned: planned, full: full, liveFinal: liveFinal, cutoff: cutoff };
  }
  function estimateMinutes(match) {
    return estimateMinutesBundle(match).full;
  }
  function addMinutes(current, mins, delta) {
    if (delta <= 0) return;
    Object.keys(current).forEach(function (pos) { var id = current[pos]; if (id && mins[id] !== undefined) mins[id] += delta; });
  }

  function importRoster(matchId) {
    var match = data.matches.find(function (m) { return m.id === matchId; });
    if (!match) return;
    var parsed = parseRosterText(match.rawRosterText);
    data.matchPlayers = data.matchPlayers.filter(function (p) { return p.matchId !== matchId; });
    match.lineup = {};
    match.subs = [];
    parsed.forEach(function (row, index) {
      var found = findRosterMatch(row.name, match.tournamentId);
      var mp = { id: uid("mp"), matchId: matchId, tournamentPlayerId: null, globalPlayerId: null, name: row.name, normalizedName: row.normalized, status: "confirmed", matchType: "new", availability: row.availability, probability: row.probability, included: row.availability !== "out", signupOrder: index + 1, raw: row.raw, suggestedTournamentPlayerId: null, avatarId: AVATARS[index % AVATARS.length].id, temporarySkills: defaultSkills(), createdAt: nowIso() };
      if (found.kind === "exact" || found.kind === "alias") {
        mp.tournamentPlayerId = found.tPlayer.id;
        mp.globalPlayerId = found.tPlayer.globalPlayerId;
        mp.matchType = found.tPlayer.membership;
        mp.status = "confirmed";
      } else if (found.kind === "fuzzy") {
        mp.status = "review";
        mp.suggestedTournamentPlayerId = found.tPlayer.id;
      } else {
        mp.status = "new";
        mp.matchType = "new";
      }
      data.matchPlayers.push(mp);
    });
    var summary = rosterImportSummary(matchId);
    summary.outIgnored = parsed.outIgnoredCount || 0;
    match.matchImportSummary = summary;
    match.status = "draft";
    match.updatedAt = nowIso();
    save(); render(); toast("Roster imported: " + summary.team + " team, " + summary.support + " support, " + summary.newPlayers + " new, " + summary.outIgnored + " out ignored.");
  }
  function rosterImportSummary(matchId) {
    var players = data.matchPlayers.filter(function (p) { return p.matchId === matchId; });
    return {
      team: players.filter(function (p) { return p.matchType === "team"; }).length,
      support: players.filter(function (p) { return p.matchType === "support"; }).length,
      newPlayers: players.filter(function (p) { return p.status === "new" || p.status === "review"; }).length,
      outIgnored: 0
    };
  }
  function createSupportFromName(tId, name) {
    var normalized = normalizeAlias(name);
    var existingGp = data.globalPlayers.find(function (gp) { return gp.normalizedName === normalized || (gp.aliases || []).map(normalizeAlias).indexOf(normalized) >= 0; });
    var gpId;
    if (existingGp) gpId = existingGp.id;
    else {
      gpId = uid("gp");
      data.globalPlayers.push({ id: gpId, name: prettyName(name), normalizedName: normalized, aliases: [], avatarId: AVATARS[data.globalPlayers.length % AVATARS.length].id, defaultSkills: defaultSkills(), createdAt: nowIso(), updatedAt: nowIso() });
    }
    var existingTp = data.tournamentPlayers.find(function (tp) { return tp.tournamentId === tId && tp.globalPlayerId === gpId; });
    if (existingTp) return { globalPlayerId: gpId, tournamentPlayerId: existingTp.id };
    var skills = clone((existingGp && existingGp.defaultSkills) || defaultSkills());
    var tpId = uid("tp");
    var pos = derivePositions(skills, tId, tpId);
    var t = data.tournaments.find(function (x) { return x.id === tId; });
    ensureTeamPlayer(t && t.teamId ? t.teamId : activeTeam().id, gpId, 'support', skills);
    data.tournamentPlayers.push({ id: tpId, teamId: t && t.teamId ? t.teamId : activeTeam().id, tournamentId: tId, globalPlayerId: gpId, membership: "support", skills: skills, primaryPosition: pos.primary, secondaryPosition: pos.secondary, goalieEligible: skills.goalie >= 3, tournamentGoalie: false, createdAt: nowIso(), updatedAt: nowIso() });
    refreshPlayerPositions(tId);
    return { globalPlayerId: gpId, tournamentPlayerId: tpId };
  }
  function acceptFuzzy(matchId, matchPlayerId) {
    var mp = data.matchPlayers.find(function (p) { return p.id === matchPlayerId && p.matchId === matchId; });
    if (!mp || !mp.suggestedTournamentPlayerId) return;
    var tp = tournamentPlayer(mp.suggestedTournamentPlayerId);
    var gp = tp && globalPlayer(tp.globalPlayerId);
    if (!tp || !gp) return;
    var finalName = prompt("What name should we use for this player going forward?", gp.name || mp.name);
    if (finalName === null) return;
    applyPlayerFutureName(gp, mp.name, finalName);
    mp.tournamentPlayerId = tp.id;
    mp.globalPlayerId = tp.globalPlayerId;
    mp.matchType = tp.membership;
    mp.status = "confirmed";
    mp.suggestedTournamentPlayerId = null;
    save(); render(); toast("Player matched and name confirmed.");
  }
  function applyPlayerFutureName(gp, importedName, finalName) {
    gp.aliases = gp.aliases || [];
    var oldName = gp.name;
    var cleanFinal = prettyName(finalName || oldName || importedName);
    [importedName, oldName].forEach(function (n) {
      var alias = normalizeAlias(n);
      if (alias && alias !== normalizeAlias(cleanFinal) && gp.aliases.map(normalizeAlias).indexOf(alias) < 0) gp.aliases.push(n);
    });
    gp.name = cleanFinal;
    gp.normalizedName = normalizeAlias(cleanFinal);
    gp.updatedAt = nowIso();
  }
  function rejectFuzzy(matchId, matchPlayerId) {
    var mp = data.matchPlayers.find(function (p) { return p.id === matchPlayerId && p.matchId === matchId; });
    if (!mp) return;
    var created = createSupportFromName(data.matches.find(function (m) { return m.id === matchId; }).tournamentId, mp.name);
    mp.tournamentPlayerId = created.tournamentPlayerId;
    mp.globalPlayerId = created.globalPlayerId;
    mp.matchType = "support";
    mp.status = "confirmed";
    mp.suggestedTournamentPlayerId = null;
    save(); render(); toast("Added as support player.");
  }

  function render() {
    var app = document.getElementById("app");
    app.innerHTML = renderShell();
    bindAfterRender();
  }
  function renderTeamOptions() {
    return (data.teams || []).filter(function (tm) { return tm.active !== false; }).slice(0, 5).map(function (tm) { return '<option value="' + tm.id + '" ' + (tm.id === activeTeam().id ? 'selected' : '') + '>' + escapeHtml(tm.name) + '</option>'; }).join('');
  }
  function renderShell() {
    if (state.view === "home" || state.view === "tournaments" || state.view === "matches") syncActiveTournamentToPreferred(false);
    var t = activeTournament();
    var page = state.view === "home" ? renderHome() : state.view === "tournaments" ? renderTournaments() : state.view === "team" ? renderTeam() : state.view === "matches" ? renderMatches() : state.view === "data" ? renderDataView() : renderPlan();
    var team = activeTeam();
    return '<div class="app-shell">' +
      '<div class="topbar"><div class="brand"><div class="logo">MP</div><div><h1>Captain Match Planner</h1><p>' + escapeHtml(team ? team.name : 'Team') + (t ? ' / ' + escapeHtml(t.name) : '') + '</p></div></div>' +
      '<div class="top-actions"><div class="team-switcher"><label>Team</label><select onchange="app.setActiveTeam(this.value)">' + renderTeamOptions() + '</select></div><button class="btn secondary small" onclick="app.createTeamPrompt()">+ Team</button><button class="btn secondary small" onclick="app.exportData()">Export</button><button class="btn secondary small" onclick="app.importDataPrompt()">Import</button></div></div>' +
      page +
      '<div class="nav"><button class="' + navClass("home") + '" onclick="app.go(\'home\')">Home</button><button class="' + navClass("tournaments") + '" onclick="app.go(\'tournaments\')">Tournaments</button><button class="' + navClass("team") + '" onclick="app.go(\'team\')">Team</button><button class="' + navClass("matches") + '" onclick="app.go(\'matches\')">Matches</button></div>' +
      (state.toast ? '<div class="toast">' + escapeHtml(state.toast) + '</div>' : '') +
      (state.avatarTarget ? renderAvatarModal() : '') +
      (state.tournamentPanelOpen ? renderTournamentPanel() : '') +
      (state.confirmRemovePlayerId ? renderRemovePlayerDialog() : '') +
      (state.profilePlayerId ? renderPlayerProfileDrawer() : '') +
      '</div>';
  }
  function navClass(view) { return state.view === view ? "active" : ""; }
  function storageStatusLabel() {
    var backend = state.storageBackend || DataService.backendName && DataService.backendName() || "local";
    var status = state.persistenceStatus || "ready";
    if (backend === "IndexedDB local database") backend = "Local DB";
    return backend + " · " + status;
  }
  function dataStoreNames() {
    return ["teams", "teamPlayers", "tournaments", "matches", "tournamentPlayers", "globalPlayers", "matchPlayers", "customAvatars", "playerAliases", "matchLineups", "lineupAssignments", "substitutionWindows", "substitutionChanges"];
  }
  function formatCellValue(value) {
    if (value === null || value === undefined || value === '') return '<span class="muted-cell">—</span>';
    if (typeof value === 'object') return '<details><summary>JSON</summary><pre>' + escapeHtml(JSON.stringify(value, null, 2)) + '</pre></details>';
    return escapeHtml(String(value));
  }
  function renderDataView() {
    var table = state.dataTable || 'tournaments';
    var stores = dataStoreNames();
    var rows = rowsForStore(table, data);
    var columns = [];
    rows.slice(0, 20).forEach(function (row) { Object.keys(row || {}).forEach(function (key) { if (columns.indexOf(key) < 0) columns.push(key); }); });
    if (!columns.length) columns = ['id'];
    var buttons = stores.map(function (name) { var count = rowsForStore(name, data).length; return '<button class="data-table-btn ' + (name === table ? 'active' : '') + '" onclick="app.setDataTable(\'' + name + '\')"><span>' + escapeHtml(name) + '</span><strong>' + count + '</strong></button>'; }).join('');
    return '<div class="grid data-page"><div class="card"><div class="row space"><div><div class="eyebrow">Local database</div><h2>Data</h2><div class="subtext">Read-only view of the current IndexedDB/local data. Use this to verify what the app has saved.</div></div><a class="btn secondary small link-btn" href="database-check.html" target="_blank">Open full page</a></div></div>' +
      '<div class="data-layout"><div class="card data-sidebar"><h3>Tables</h3><div class="data-table-list">' + buttons + '</div></div>' +
      '<div class="card data-table-card"><div class="row space"><div><h3>' + escapeHtml(table) + '</h3><div class="subtext">' + rows.length + ' records</div></div></div><div class="data-table-wrap"><table><thead><tr>' + columns.map(function (c) { return '<th>' + escapeHtml(c) + '</th>'; }).join('') + '</tr></thead><tbody>' + (rows.length ? rows.map(function (row) { return '<tr>' + columns.map(function (c) { return '<td>' + formatCellValue(row[c]) + '</td>'; }).join('') + '</tr>'; }).join('') : '<tr><td colspan="' + columns.length + '">No rows saved for this table.</td></tr>') + '</tbody></table></div></div></div></div>';
  }

  function renderHome() {
    var t = activeTournament();
    if (!t) return '<div class="grid home-compact"><div class="card empty-state"><h2>' + escapeHtml(activeTeam().name || 'Team') + '</h2><p>No tournament yet for this team.</p><button class="btn" onclick="app.openTournamentPanel()">Create tournament</button></div></div>';
    var next = nextMatch(t.id);
    var left = remainingMatches(t.id);
    var nextCta = next ? '<button class="btn hero-btn" onclick="app.openMatch(\'' + next.id + '\')">Plan next match</button>' : '<button class="btn hero-btn" onclick="app.go(\'tournaments\')">Create schedule</button>';
    var nextMeta = next ? metaParts(next) : [];
    return '<div class="grid home-compact">' +
      '<div class="home-hero card"><a class="data-check-pill" href="database-check.html" target="_blank" rel="noopener">Data check</a><div><div class="eyebrow light">Next match</div><h2>' + escapeHtml(t.teamName || 'Team') + '</h2>' +
        (next ? '<div class="home-next-date"><span>' + escapeHtml(formatLongDate(next.date)) + '</span>' + (next.time ? '<strong>' + escapeHtml(next.time) + '</strong>' : '') + '</div>' : '<p>No confirmed upcoming match.</p>') +
        (next && nextMeta.length ? '<div class="home-meta-line">' + nextMeta.map(function (x) { return '<span>' + escapeHtml(x) + '</span>'; }).join('') + '</div>' : '') +
        '<div class="hero-actions">' + nextCta + '<button class="btn secondary" onclick="app.go(\'matches\')">All matches</button></div></div>' +
        '<div class="home-count"><small>' + escapeHtml(t.name || 'Tournament') + '</small><strong>' + left.length + '</strong><span>matches left</span></div></div>' +
      '<div class="card remaining-card"><div class="row space"><div><h2>Matches left in ' + escapeHtml(t.name || 'Tournament') + '</h2><div class="subtext">Confirmed matches only. Date, time, and field come from the Tournament or Matches sections.</div></div><button class="btn secondary" onclick="app.go(\'tournaments\')">Edit tournament</button></div>' +
        (left.length ? '<div class="remaining-list">' + left.map(function (m, i) { var meta = []; if (m.time) meta.push(m.time); if (m.location) meta.push(m.location); if (m.opponent) meta.push('vs ' + m.opponent); return '<button class="remaining-row" onclick="app.openMatch(\'' + m.id + '\')"><div><span>' + escapeHtml(matchDisplayTitle(m)) + '</span><strong>' + escapeHtml(formatLongDate(m.date)) + '</strong></div>' + (meta.length ? '<small>' + escapeHtml(meta.join(' · ')) + '</small>' : '') + '</button>'; }).join('') + '</div>' : '<div class="empty-state">No confirmed matches left in the current tournament.</div>') + '</div>' +
      '<div class="app-version">App v' + APP_VERSION + ' · ' + escapeHtml(storageStatusLabel()) + ' · Last updated ' + escapeHtml(formatDateTime(state.lastSavedAt)) + '</div></div>';
  }
  function renderWeekPill(w) {
    var cls = w.matches.length === 0 ? 'bye' : w.matches.length > 1 ? 'double' : 'single';
    var label = w.matches.length === 0 ? 'Bye' : w.matches.length > 1 ? w.matches.length + ' games' : 'Game';
    return '<div class="week-pill ' + cls + '"><span>W' + w.index + '</span><strong>' + formatDateLabel(w.date) + '</strong><small>' + label + '</small></div>';
  }

  function renderTournaments() {
    var t = activeTournament();
    if (!t) return '<div class="grid tournament-page redesigned"><div class="card empty-state"><h2>No tournament for ' + escapeHtml(activeTeam().name || 'this team') + '</h2><button class="btn" onclick="app.openTournamentPanel()">Create tournament</button></div></div>';
    var st = tournamentStats(t.id);
    var mode = state.scheduleViewMode || 'summary';
    var status = tournamentStatus(t);
    return '<div class="grid tournament-page redesigned">' +
      '<div class="card tournament-command compact"><div class="row space tournament-top-row"><div><div class="eyebrow">Tournament organization</div><h2>' + escapeHtml(t.name) + '</h2><div class="subtext">Current schedule defaults to the tournament with the closest upcoming match. Day and time are the critical fields; field and opponent live in Full view.</div></div><div class="row tournament-actions">' + renderTournamentSelector(t) + '<button class="btn" onclick="app.openTournamentPanel()">+ Create tournament</button></div></div>' +
        '<div class="tournament-metrics compact"><div><strong>' + formatDateLabel(st.start) + '</strong><span>Start</span></div><div><strong>' + (t.defaultDay || weekdayName(st.start || '')) + '</strong><span>Play day</span></div><div><strong>' + (t.matchTarget || 7) + '</strong><span>Length</span></div><div><strong>' + st.doubleHeaders + '</strong><span>Double headers</span></div></div></div>' +
      renderTournamentSetupCard(t, st) +
      '<div class="card schedule-card"><div class="row space"><div><h2>Schedule</h2><div class="subtext">Summary shows day and time. Full adds field, opponent, and exception actions. Skip weeks remain visible.</div></div><div class="row"><div class="tabs compact-tabs"><button class="' + (mode === 'summary' ? 'active' : '') + '" onclick="app.setScheduleView(\'summary\')">Summary</button><button class="' + (mode === 'full' ? 'active' : '') + '" onclick="app.setScheduleView(\'full\')">Full</button></div><button class="btn ghost small" onclick="app.refillSchedule(\'' + t.id + '\')">Repair / fill</button></div></div><div class="schedule-table schedule-' + mode + '">' + renderScheduleRows(t, mode) + '</div></div>' +
      '<div class="card"><h2>All tournaments for ' + escapeHtml(activeTeam().name || 'team') + '</h2><div class="tournament-list">' + visibleTournaments().map(renderTournamentItem).join('') + '</div></div>' +
      '</div>';
  }
  function renderTournamentSetupCard(t, st) {
    if (!state.tournamentSetupEditing) {
      return '<div class="card active-tournament-card setup-summary-card"><div class="row space"><div><h2>Tournament setup</h2><div class="subtext">Base schedule: start date, weekly play day, length, and default field.</div></div><div class="row"><button class="btn secondary small" onclick="app.startTournamentEdit()">✎ Edit</button><button class="btn ghost small" onclick="app.deleteTournamentPrompt(\'' + t.id + '\')">Archive / delete</button></div></div>' +
        '<div class="setup-summary-grid"><div><span>Name</span><strong>' + escapeHtml(t.name || 'Tournament') + '</strong></div><div><span>Start date</span><strong>' + escapeHtml(formatLongDate(t.startDate || st.start || '')) + '</strong></div><div><span>Play day</span><strong>' + escapeHtml(t.defaultDay || weekdayName(st.start || '') || '—') + '</strong></div><div><span>Length</span><strong>' + (t.matchTarget || 7) + ' matches</strong></div><div><span>Default field</span><strong>' + escapeHtml(t.location || 'Not set') + '</strong></div></div></div>';
    }
    return '<div class="card active-tournament-card setup-edit-card"><div class="row space"><div><h2>Edit tournament setup</h2><div class="subtext">Structural changes rebuild empty generated matches. Planned/rescheduled matches are preserved.</div></div><div class="row"><button class="btn green small" onclick="app.applyTournamentSetup(\'' + t.id + '\')">Apply schedule changes</button><button class="btn secondary small" onclick="app.cancelTournamentEdit()">Cancel</button></div></div>' +
      '<div class="field-row three"><div><label>Tournament name</label><input id="editTournamentName" value="' + escapeAttr(t.name || '') + '"></div><div><label>Start date</label><input id="editTournamentStart" type="date" value="' + escapeAttr(t.startDate || st.start || '') + '"></div><div><label>Play day</label><select id="editTournamentDay">' + weekdayOptions(t.defaultDay || weekdayName(t.startDate || st.start || '') || 'Tuesday') + '</select></div></div>' +
      '<div class="field-row three"><div><label>Tournament length</label><select id="editTournamentTarget"><option value="7" ' + ((t.matchTarget || 7) == 7 ? 'selected' : '') + '>7 matches</option><option value="8" ' + ((t.matchTarget || 7) == 8 ? 'selected' : '') + '>8 matches</option><option value="9" ' + ((t.matchTarget || 7) == 9 ? 'selected' : '') + '>9 matches</option></select></div><div><label>Default field</label><input id="editTournamentLocation" placeholder="Optional" value="' + escapeAttr(t.location || '') + '"></div><div><label>Delete/archive</label><button class="btn ghost" onclick="app.deleteTournamentPrompt(\'' + t.id + '\')">Archive / delete tournament</button></div></div></div>';
  }
  function renderScheduleRows(t, mode) {
    var weeks = tournamentWeeks(t.id);
    if (!weeks.length) return '<div class="empty-state">No weeks generated yet.</div>';
    if (mode === 'full') {
      return '<div class="schedule-card-head full"><div>Week</div><div>Match</div><div>Date</div><div>Time</div><div>Opponent</div><div>Field</div><div>Status</div><div>Actions</div></div>' + weeks.map(renderScheduleWeekFull).join('');
    }
    return '<div class="schedule-card-head summary"><div>Week</div><div>Match</div><div>Day / date</div><div>Time</div><div>Actions</div></div>' + weeks.map(renderScheduleWeekSummary).join('');
  }
  function renderScheduleWeekSummary(w) {
    var t = activeTournament();
    if (!w.matches.length) {
      var skipped = isSkipDate(t, w.date);
      return '<div class="schedule-card-row schedule-summary-row schedule-skip"><div><strong>W' + w.index + '</strong></div><div><span class="badge">' + (skipped ? 'Skip week' : 'Open week') + '</span></div><div><strong>' + escapeHtml(formatLongDate(w.date)) + '</strong></div><div class="muted-cell">—</div><div class="row compact-actions">' + (skipped ? '<button class="btn small secondary" onclick="app.unskipWeek(\'' + t.id + '\',\'' + w.date + '\')">Unskip</button>' : '<button class="btn small secondary" onclick="app.skipWeek(\'' + t.id + '\',\'' + w.date + '\')">Skip</button>') + '<button class="btn small" onclick="app.addMatchOnDate(\'' + t.id + '\',\'' + w.date + '\')">Add game</button></div></div>';
    }
    var isDouble = w.matches.length > 1;
    return w.matches.map(function (m, index) {
      var defaultTime = index === 0 ? '19:00' : (w.matches[index - 1] && w.matches[index - 1].time ? addHoursToTime(w.matches[index - 1].time, 1) : '20:00');
      var status = isDouble ? '<span class="badge warn">Double header</span>' : '';
      if (m.sequenceLocked) status += '<span class="badge team">Rescheduled</span>';
      return '<div class="schedule-card-row schedule-summary-row ' + (isDouble ? 'schedule-double' : '') + ' ' + (isPastMatch(m) ? 'schedule-past' : '') + '"><div><strong>W' + w.index + '</strong></div><div><strong>' + escapeHtml(matchScheduleLabel(m)) + '</strong>' + status + '</div><div><input type="date" value="' + escapeAttr(m.date || '') + '" onchange="app.updateMatch(\'' + m.id + '\',\'date\',this.value)"></div><div>' + timeInputHtml(m.id, m.time, defaultTime) + '</div><div class="row compact-actions"><button class="btn small" onclick="app.openMatch(\'' + m.id + '\')">Plan</button><button class="btn small secondary" onclick="app.addMatchOnDate(\'' + t.id + '\',\'' + w.date + '\')">Double</button><button class="btn small ghost" onclick="app.shiftFutureMatches(\'' + t.id + '\',\'' + w.date + '\')">Push +1wk</button></div></div>';
    }).join('');
  }
  function renderScheduleWeekFull(w) {
    var t = activeTournament();
    if (!w.matches.length) {
      var skipped = isSkipDate(t, w.date);
      return '<div class="schedule-card-row schedule-full-row schedule-skip"><div><strong>Week ' + w.index + '</strong></div><div><span class="badge">' + (skipped ? 'Skip week' : 'Open week') + '</span></div><div>' + escapeHtml(formatLongDate(w.date)) + '</div><div></div><div></div><div></div><div>' + (skipped ? '<span class="badge">Skipped</span>' : '') + '</div><div class="row compact-actions">' + (skipped ? '<button class="btn small secondary" onclick="app.unskipWeek(\'' + t.id + '\',\'' + w.date + '\')">Unskip</button>' : '<button class="btn small ghost" onclick="app.skipWeek(\'' + t.id + '\',\'' + w.date + '\')">Skip</button>') + '<button class="btn small" onclick="app.addMatchOnDate(\'' + t.id + '\',\'' + w.date + '\')">Add game</button></div></div>';
    }
    var isDouble = w.matches.length > 1;
    return w.matches.map(function (m, index) {
      var defaultTime = index === 0 ? '19:00' : (w.matches[index - 1] && w.matches[index - 1].time ? addHoursToTime(w.matches[index - 1].time, 1) : '20:00');
      var status = [];
      if (isDouble) status.push('<span class="badge warn">Double header' + (index > 0 ? ' 2' : '') + '</span>');
      if (isPastMatch(m)) status.push('<span class="badge">Past</span>');
      if (m.sequenceLocked) status.push('<span class="badge team">Rescheduled</span>');
      return '<div class="schedule-card-row schedule-full-row ' + (isDouble ? 'schedule-double' : '') + ' ' + (isPastMatch(m) ? 'schedule-past' : '') + '"><div><strong>Week ' + w.index + '</strong></div><div><strong>' + escapeHtml(matchScheduleLabel(m)) + '</strong></div><div><input type="date" value="' + escapeAttr(m.date || '') + '" onchange="app.updateMatch(\'' + m.id + '\',\'date\',this.value)"></div><div>' + timeInputHtml(m.id, m.time, defaultTime) + '</div><div><input value="' + escapeAttr(m.opponent || '') + '" placeholder="Opponent" onchange="app.updateMatch(\'' + m.id + '\',\'opponent\',this.value)"></div><div><input value="' + escapeAttr(m.location || '') + '" placeholder="Field" onchange="app.updateMatch(\'' + m.id + '\',\'location\',this.value)"></div><div>' + status.join(' ') + '</div><div class="row compact-actions"><button class="btn small" onclick="app.openMatch(\'' + m.id + '\')">Plan</button><button class="btn small secondary" onclick="app.addMatchOnDate(\'' + t.id + '\',\'' + w.date + '\')">Double</button><button class="btn small ghost" onclick="app.skipWeek(\'' + t.id + '\',\'' + w.date + '\')">Skip</button><button class="btn small ghost" onclick="app.shiftFutureMatches(\'' + t.id + '\',\'' + w.date + '\')">Push +1wk</button></div></div>';
    }).join('');
  }
  function addHoursToTime(time, hours) {
    if (!time) return '';
    var parts = String(time).split(':');
    var h = Number(parts[0] || 0), m = Number(parts[1] || 0);
    if (isNaN(h) || isNaN(m)) return '';
    h = (h + Number(hours || 0)) % 24;
    if (h < 0) h += 24;
    return String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0');
  }
  function timeInputHtml(matchId, value, defaultTime) {
    var current = escapeAttr(value || "");
    var fallback = escapeAttr(defaultTime || "19:00");
    return '<input type="time" value="' + current + '" data-default-time="' + fallback + '" onfocus="if(!this.value)this.value=this.dataset.defaultTime" onchange="app.updateMatch(\'' + matchId + '\',\'time\',this.value)">';
  }
  function renderTournamentItem(t) {
    var count = matches(t.id).length;
    var st = tournamentStats(t.id);
    var status = tournamentStatus(t);
    return '<div class="tournament-item ' + (activeTournament() && t.id === activeTournament().id ? 'active' : '') + ' ' + (t.archived ? 'archived' : '') + '"><div><div class="player-title">' + escapeHtml(t.teamName) + ' / ' + escapeHtml(t.name) + ' <span class="badge ' + status.className + '">' + escapeHtml(status.label) + '</span></div><div class="subtext">' + escapeHtml(t.defaultDay || '') + ' · ' + count + ' matches · ' + formatDateLabel(st.start) + ' → ' + formatDateLabel(st.end) + '</div></div><button class="btn small secondary" onclick="app.setActiveTournament(\'' + t.id + '\')">Select</button></div>';
  }

  function renderTeam() {
    var team = activeTeam();
    var t = activeTournament();
    var players = t ? tournamentPlayers(t.id) : [];
    var teamRows = players.filter(function (p) { return p.membership === "team"; });
    var support = players.filter(function (p) { return p.membership === "support"; });
    return '<div class="grid team-page">' +
      '<div class="card team-header-card"><div class="row space"><div><div class="eyebrow">Team workspace</div><h2>' + escapeHtml(team.name || 'Team') + '</h2><div class="subtext">V5 supports shared global players with team-specific roster/support membership.</div></div><div class="row"><button class="btn" onclick="app.addPlayerPrompt()">Add player</button><button class="btn secondary" onclick="app.addExistingPlayerToTeamPrompt()">Add existing</button><button class="btn secondary" onclick="app.go(\'tournaments\')">Tournaments</button></div></div>' +
      '<div class="field-row"><div><label>Team name</label><input value="' + escapeAttr(team.name || '') + '" onchange="app.updateTeam(\'name\',this.value)"></div><div><label>Team color</label><input type="color" value="' + escapeAttr(team.color || '#1769ff') + '" onchange="app.updateTeam(\'color\',this.value)"></div><div><label>Active tournament</label><div class="readonly-chip">' + escapeHtml(t ? t.name : 'No tournament yet') + '</div></div></div>' +
      '<div class="kpi"><div class="pill"><div class="num">' + teamRows.length + '</div><div class="txt">Roster</div></div><div class="pill"><div class="num">' + support.length + '</div><div class="txt">Support</div></div><div class="pill"><div class="num">' + teamPlayers(team.id).length + '</div><div class="txt">Team pool</div></div></div></div>' +
      '<div class="card team-section"><div class="row space"><div><h3>Roster players</h3><div class="subtext">Regular players for ' + escapeHtml(team.name || 'this team') + '.</div></div></div><div class="list roster-list compact-roster">' + (teamRows.length ? teamRows.map(renderRosterPlayer).join('') : '<div class="empty-state">No roster players.</div>') + '</div></div>' +
      '<div class="card support-section"><div class="row space"><div><h3>Support players</h3><div class="subtext">Support can be shared across teams. Existing Green FC support was added to Intuit United as support.</div></div></div><div class="list roster-list compact-roster">' + (support.length ? support.map(renderRosterPlayer).join('') : '<div class="empty-state">No support players.</div>') + '</div></div>' +
      '<div class="card"><div class="row space"><div><h3>Shared player pool</h3><div class="subtext">Players can belong to multiple teams. Badges show each team role.</div></div></div><div class="player-pool-list">' + renderPlayerPoolList() + '</div></div>' +
      '</div>';
  }
  function renderPlayerPoolList() {
    return (data.globalPlayers || []).map(function (gp) {
      return '<div class="pool-row"><button class="avatar small" onclick="app.openPlayerProfile(\'' + gp.id + '\')"><img src="' + avatarById(gp.avatarId).src + '" alt=""></button><div><button class="link-title" onclick="app.openPlayerProfile(\'' + gp.id + '\')">' + escapeHtml(gp.name) + '</button><div class="team-pill-row">' + teamMembershipPills(gp.id) + '</div></div><button class="btn tiny secondary" onclick="app.addGlobalPlayerToActiveTeam(\'' + gp.id + '\')">Add to team</button></div>';
    }).join('') || '<div class="empty-state">No players yet.</div>';
  }
  function renderRosterPlayer(tp) {
    var gp = globalPlayer(tp.globalPlayerId);
    if (!gp) return '';
    var editing = state.editingPlayerId === tp.id && state.playerEditDraft;
    var draft = editing ? state.playerEditDraft : null;
    var skills = editing ? normalizeSkills(draft.skills) : normalizeSkills(tp.skills);
    var membership = editing ? draft.membership : tp.membership;
    var name = editing ? draft.name : gp.name;
    var avatarId = editing ? draft.avatarId : gp.avatarId;
    var pos = derivePositions(skills, tp.tournamentId, tp.id);
    var gloveClass = tp.tournamentGoalie ? 'selected' : (skills.goalie >= 3 ? 'eligible' : 'disabled');
    var gloveTitle = tp.tournamentGoalie ? 'Tournament goalie' : (skills.goalie >= 3 ? 'Set as tournament goalie' : 'Needs 3+ goalie stars');
    if (!editing) {
      return '<div class="roster-matrix-row ' + (skills.goalie >= 3 ? 'goalie-capable ' : '') + (membership === 'support' ? 'support-player' : 'team-player') + '"><div class="avatar small"><img src="' + avatarById(avatarId).src + '" alt=""></div>' +
        '<div class="roster-identity"><button class="link-title" onclick="app.openPlayerProfile(\'' + gp.id + '\')">' + escapeHtml(name) + '</button><div class="team-pill-row compact">' + teamMembershipPills(gp.id) + '</div><div class="row mini-meta">' + membershipBadge(membership) + '<span class="badge">' + escapeHtml(tp.primaryPosition || pos.primary) + ' / ' + escapeHtml(tp.secondaryPosition || pos.secondary) + '</span></div></div>' +
        '<div class="skill-mini-grid">' + POS_KEYS.map(function (k) { return skillReadoutCompact(skills, k); }).join('') + '</div>' +
        '<div class="roster-actions compact-actions"><button class="btn small secondary" onclick="app.editPlayer(\'' + tp.id + '\')">✎</button><button class="glove-button ' + gloveClass + '" title="' + gloveTitle + '" onclick="app.setTournamentGoalie(\'' + tp.id + '\')">🧤</button><button class="x-button" onclick="app.askRemoveTournamentPlayer(\'' + tp.id + '\')">×</button></div></div>';
    }
    return '<div class="roster-row editing ' + (skills.goalie >= 3 ? 'goalie-capable ' : '') + (membership === 'support' ? 'support-player' : 'team-player') + '"><button class="avatar" onclick="app.pickAvatar(\'' + gp.id + '\')"><img src="' + avatarById(avatarId).src + '" alt=""></button>' +
      '<div class="roster-main"><div class="row"><input class="name-inline" value="' + escapeAttr(name) + '" oninput="app.updatePlayerDraft(\'name\',this.value)">' + membershipBadge(membership) + '<span class="badge">' + escapeHtml(pos.primary) + ' / ' + escapeHtml(pos.secondary) + '</span></div>' +
      '<div class="subtext">Edit mode. Changes are saved only after pressing Save.</div><div class="skills compact-skills">' + POS_KEYS.map(function (k) { return skillDraftEditor(skills, k); }).join('') + '</div></div>' +
      '<div class="roster-actions"><select onchange="app.updatePlayerDraft(\'membership\',this.value)"><option value="team" ' + (membership === 'team' ? 'selected' : '') + '>Roster</option><option value="support" ' + (membership === 'support' ? 'selected' : '') + '>Support</option></select><button class="glove-button ' + gloveClass + '" title="' + gloveTitle + '" onclick="app.setTournamentGoalie(\'' + tp.id + '\')">🧤</button><button class="btn small green" onclick="app.savePlayerEdit()">Save</button><button class="btn small secondary" onclick="app.cancelPlayerEdit()">Cancel</button><button class="x-button" onclick="app.askRemoveTournamentPlayer(\'' + tp.id + '\')">×</button></div></div>';
  }
  function skillReadoutCompact(skills, key) {
    var value = Number(skills[key] || 1);
    return '<span class="skill-mini ' + skillClass(value) + '"><b>' + POS_SHORT[key] + '</b><em>' + value + '★</em></span>';
  }
  function skillReadout(skills, key) {
    var value = skills[key] || 1;
    return '<div class="skillbox ' + skillClass(value) + '"><div class="lbl">' + POS_FULL[key] + '</div><div class="stars">' + stars(value) + '</div><strong>' + value + '</strong></div>';
  }
  function skillDraftEditor(skills, key) {
    var value = skills[key] || 1;
    return '<div class="skillbox ' + skillClass(value) + '"><div class="lbl">' + POS_FULL[key] + '</div><div class="stars">' + stars(value) + '</div><select onchange="app.updatePlayerDraftSkill(\'' + key + '\',this.value)">' + [1,2,3,4,5].map(function (n) { return '<option value="' + n + '" ' + (n === value ? 'selected' : '') + '>' + n + '</option>'; }).join('') + '</select></div>';
  }
  function skillEditor(tp, key) {
    return skillDraftEditor(tp.skills || {}, key);
  }
  function renderMatches() {
    var t = activeTournament();
    if (!t) return '<div class="grid matches-page"><div class="card empty-state"><h2>No tournament for ' + escapeHtml(activeTeam().name || 'this team') + '</h2><button class="btn" onclick="app.openTournamentPanel()">Create tournament</button></div></div>';
    var all = matches(t.id);
    var next = nextMatch(t.id);
    var upcoming = all.filter(function (m) { return isConfirmedScheduleMatch(m) && !isPastMatch(m) && (!next || m.id !== next.id); });
    var past = all.filter(function (m) { return isPastMatch(m) || m.status === "completed"; }).sort(function (a, b) { return ((b.date || '') + (b.time || '')).localeCompare((a.date || '') + (a.time || '')); });
    var st = tournamentStats(t.id);
    return '<div class="grid matches-page">' +
      '<div class="card next-plan-card"><div><div class="eyebrow">Plan next match</div><h2>' + (next ? escapeHtml(matchDisplayTitleWithOpponent(next)) : 'No confirmed match') + '</h2>' + (next ? '<div class="subtext">' + escapeHtml(metaParts(next).join(' · ')) + '</div>' : '<div class="subtext">Create or confirm a match in Tournament.</div>') + '</div><div class="row"><button class="btn hero-btn" ' + (next ? 'onclick="app.openMatch(\'' + next.id + '\')"' : 'onclick="app.go(\'tournaments\')"') + '>' + (next ? 'Plan next match' : 'Open tournament') + '</button></div></div>' +
      '<div class="card matches-control"><div class="row space"><div><div class="eyebrow">Matches</div><h2>' + escapeHtml(t.teamName) + ' / ' + escapeHtml(t.name) + '</h2><div class="subtext">Date, time, field, and opponent sync with Tournament. Planning stays here.</div></div><div class="selector-stack"><label>Tournament</label><select onchange="app.setActiveTournament(this.value); app.go(\'matches\');">' + tournamentOptionsHtml(t.id) + '</select></div></div><div class="tournament-metrics compact"><div><strong>' + st.matchCount + '</strong><span>Total</span></div><div><strong>' + st.upcoming + '</strong><span>Upcoming</span></div><div><strong>' + st.completed + '</strong><span>Past</span></div><div><strong>' + st.doubleHeaders + '</strong><span>Double</span></div></div></div>' +
      '<div class="card"><div class="row space"><div><h3>Match list</h3><div class="subtext">Every match has a Plan button. Copy and delete stay secondary.</div></div><div class="row"><button class="btn secondary" onclick="app.addManualMatch()">Add match</button><button class="btn ghost" onclick="app.refillSchedule(\'' + t.id + '\')">Fill to target</button></div></div></div>' +
      renderMatchTable('Next match to plan', next ? [next] : [], true) +
      renderMatchTable('Upcoming matches', upcoming, false) +
      renderMatchTable('Past matches', past, false) +
      '</div>';
  }
  function renderMatchTable(title, list, isNextSection) {
    return '<div class="card"><h3>' + escapeHtml(title) + '</h3>' + (list.length ? '<div class="match-table"><div class="match-row match-head"><div>Plan</div><div>Match</div><div>Date</div><div>Time</div><div>Opponent</div><div>Field</div><div>Formation</div><div>Actions</div></div>' + list.map(function (m) { return renderMatchRow(m, isNextSection); }).join('') + '</div>' : '<div class="empty-state">No matches in this section.</div>') + '</div>';
  }
  function renderMatchRow(m, isNext) {
    var past = isPastMatch(m) || m.status === "completed";
    var status = past && m.status !== "completed" ? 'past' : m.status;
    return '<div class="match-row ' + (past ? 'past' : '') + ' ' + (isNext ? 'next' : '') + '">' +
      '<div><button class="btn small" onclick="app.openMatch(\'' + m.id + '\')">Plan</button></div>' +
      '<div><div class="player-title">' + escapeHtml(matchDisplayTitle(m)) + '</div><div class="subtext">' + escapeHtml(status || '') + '</div></div>' +
      '<div><input type="date" value="' + escapeAttr(m.date || '') + '" onchange="app.updateMatch(\'' + m.id + '\',\'date\',this.value)"></div>' +
      '<div>' + timeInputHtml(m.id, m.time) + '</div>' +
      '<div><input value="' + escapeAttr(m.opponent || '') + '" placeholder="Opponent" onchange="app.updateMatch(\'' + m.id + '\',\'opponent\',this.value)"></div>' +
      '<div><input value="' + escapeAttr(m.location || '') + '" placeholder="Field" onchange="app.updateMatch(\'' + m.id + '\',\'location\',this.value)"></div>' +
      '<div><select onchange="app.updateMatch(\'' + m.id + '\',\'formation\',this.value)"><option value="2-3-1" ' + (m.formation === '2-3-1' ? 'selected' : '') + '>2-3-1</option><option value="3-2-1" ' + (m.formation === '3-2-1' ? 'selected' : '') + '>3-2-1</option></select></div>' +
      '<div class="row right-actions"><button class="btn small secondary" onclick="app.duplicateMatch(\'' + m.id + '\')">Copy</button><button class="btn small danger" onclick="app.deleteMatch(\'' + m.id + '\')">Delete</button></div>' +
      '</div>';
  }
  function matchSummary(m) {
    var parts = metaParts(m);
    if (m.formation) parts.push('Formation ' + m.formation);
    return '<div class="player-title">' + escapeHtml(matchDisplayTitle(m)) + '</div><div class="subtext">' + escapeHtml(parts.join(' · ')) + '</div>';
  }
  function renderPlan() {
    var match = activeMatch();
    if (!match) return '<div class="card empty-state">No match selected.</div>';
    var parsed = parseRosterText(match.rawRosterText || "");
    var active = activeMatchPlayers(match.id);
    var bench = benchPlayers(match);
    return '<div class="wizard">' +
      '<div class="card"><div class="row space"><div><h2>Match planner</h2>' + matchSummary(match) + '</div><button class="btn secondary" onclick="app.go(\'matches\')">Back to matches</button></div><div class="kpi" style="margin-top:12px"><div class="pill"><div class="num">' + active.length + '</div><div class="txt">Active players</div></div><div class="pill"><div class="num">' + Math.min(7, active.length) + '</div><div class="txt">Starters</div></div><div class="pill"><div class="num">' + bench.length + '</div><div class="txt">Bench</div></div></div></div>' +
      renderStepImport(match, parsed) +
      renderStepConfirm(match) +
      renderStepFormation(match) +
      renderStepLineup(match) +
      renderStepSubs(match) +
      renderPlanHighlights(match) +
      renderStepShare(match) +
      '</div>';
  }
  function renderStepImport(match, parsed) {
    var summary = match.matchImportSummary;
    var ignored = summary ? (summary.outIgnored || 0) : (parsed.outIgnoredCount || 0);
    var summaryHtml = summary ? '<div class="import-summary"><span><strong>' + summary.team + '</strong> team players</span><span><strong>' + summary.support + '</strong> support players</span><span><strong>' + summary.newPlayers + '</strong> new players</span><span><strong>' + ignored + '</strong> out ignored</span></div>' : (ignored ? '<div class="import-summary muted-summary"><span><strong>' + parsed.length + '</strong> available detected</span><span><strong>' + ignored + '</strong> out ignored</span></div>' : '');
    return '<div class="card"><div class="step-header"><h2><span class="stepnum">1</span>Import WhatsApp roster</h2><span class="badge">Detected ' + parsed.length + '</span></div>' + summaryHtml + '<div class="grid two"><div><label>Paste final roster from WhatsApp</label><textarea oninput="app.updateMatch(\'' + match.id + '\',\'rawRosterText\',this.value,false)">' + escapeHtml(match.rawRosterText || '') + '</textarea><div class="row" style="margin-top:10px"><button class="btn" onclick="app.importRoster(\'' + match.id + '\')">Import and match names</button><button class="btn secondary" onclick="app.insertSampleRoster(\'' + match.id + '\')">Use sample</button></div><p class="subtext">Paste the full WhatsApp message. Names under an <strong>Out</strong> section are ignored and not added to the match roster.</p></div><div><label>Live parser preview</label><div class="list parse-preview">' + (parsed.length ? parsed.map(renderParsedRow).join('') : '<div class="empty-state">Paste names to preview.</div>') + '</div></div></div></div>';
  }
  function renderParsedRow(r) {
    return '<div class="item"><div><div class="player-title">' + escapeHtml(r.name) + '</div><div class="subtext">' + escapeHtml(r.availability) + ' / ' + r.probability + '%</div></div><div class="prob"><span style="width:' + Math.max(0, Math.min(100, r.probability)) + '%"></span></div></div>';
  }
  function renderStepConfirm(match) {
    var players = matchPlayers(match.id);
    var currentIds = players.map(function (p) { return p.tournamentPlayerId; }).filter(Boolean);
    var options = tournamentPlayers(match.tournamentId).filter(function (tp) { return currentIds.indexOf(tp.id) < 0; }).map(function (tp) { var gp = globalPlayer(tp.globalPlayerId); return '<option value="' + tp.id + '">' + escapeHtml(gp ? gp.name : 'Player') + ' · ' + escapeHtml(tp.membership) + '</option>'; }).join('');
    return '<div class="card"><div class="step-header"><h2><span class="stepnum">2</span>Confirm players</h2><div class="row"><span class="badge">Team / Support / New</span><span class="badge">Signed-up order</span></div></div>' +
      '<div class="manual-player-add"><label>Add roster player manually</label><div class="row"><select id="manualPlayer_' + match.id + '"><option value="">Search/select roster player</option>' + options + '</select><button class="btn small" onclick="app.addRosterPlayerToMatch(\'' + match.id + '\')">Add</button></div></div>' +
      (players.length ? '<div class="list confirm-player-list">' + players.map(function (mp) { return renderMatchPlayerConfirm(mp, match); }).join('') + '</div>' : '<div class="empty-state">Import a WhatsApp list first, or add a roster player manually.</div>') + '</div>';
  }

  function renderMatchPlayerConfirm(mp, match) {
    var suggested = mp.suggestedTournamentPlayerId ? tournamentPlayer(mp.suggestedTournamentPlayerId) : null;
    var sGp = suggested ? globalPlayer(suggested.globalPlayerId) : null;
    if (mp.status === "new") {
      var rosterOptions = tournamentPlayers(data.matches.find(function (m) { return m.id === mp.matchId; }).tournamentId).map(function (tp) { var gp = globalPlayer(tp.globalPlayerId); return '<option value="' + tp.id + '">' + escapeHtml(gp ? gp.name : 'Player') + ' · ' + escapeHtml(tp.membership) + '</option>'; }).join('');
      return '<div class="item new-player-row"><div><div class="row"><div class="player-title">' + escapeHtml(mp.name) + '</div><span class="badge warn">New player</span></div><div class="subtext">Create a new support player or replace with an existing roster player.</div></div><div class="new-player-actions"><button class="btn small green" onclick="app.createNewMatchPlayer(\'' + mp.matchId + '\',\'' + mp.id + '\')">Create new player</button><div class="row"><select id="replace_' + mp.id + '"><option value="">Search existing player</option>' + rosterOptions + '</select><button class="btn small secondary" onclick="app.replaceMatchPlayer(\'' + mp.matchId + '\',\'' + mp.id + '\')">Replace</button></div></div></div>';
    }
    if (mp.status === "review") {
      return '<div class="item"><div><div class="row"><div class="player-title">' + escapeHtml(mp.name) + '</div><span class="badge warn">Review</span></div><div class="subtext">Possible match: ' + escapeHtml(sGp ? sGp.name : '') + '</div></div><div class="row"><button class="btn small green" onclick="app.acceptFuzzy(\'' + mp.matchId + '\',\'' + mp.id + '\')">Use existing</button><button class="btn small amber" onclick="app.rejectFuzzy(\'' + mp.matchId + '\',\'' + mp.id + '\')">Create support</button></div></div>';
    }
    var ctx = playerContext(mp);
    return '<div class="item confirm-player-row"><div class="row"><button class="avatar small" onclick="app.openPlayerProfile(\'' + (ctx.globalPlayer ? ctx.globalPlayer.id : '') + '\')"><img src="' + ctx.avatar.src + '"></button><div><button class="link-title" onclick="app.openPlayerProfile(\'' + (ctx.globalPlayer ? ctx.globalPlayer.id : '') + '\')">' + escapeHtml(ctx.name) + '</button><div class="subtext">Signup #' + mp.signupOrder + ' · ' + escapeHtml(mp.availability) + ' · ' + mp.probability + '%</div><div class="team-pill-row compact">' + (ctx.globalPlayer ? teamMembershipPills(ctx.globalPlayer.id) : '') + '</div></div></div><div class="row"><button class="btn tiny secondary" title="Move earlier in sign-up order" onclick="app.moveMatchPlayerOrder(\'' + mp.id + '\',-1)">↑</button><button class="btn tiny secondary" title="Move later in sign-up order" onclick="app.moveMatchPlayerOrder(\'' + mp.id + '\',1)">↓</button>' + membershipBadge(ctx.membership) + '<label class="row" style="margin:0;text-transform:none;letter-spacing:0"><input style="width:auto" type="checkbox" ' + (mp.included ? 'checked' : '') + ' onchange="app.toggleMatchPlayer(\'' + mp.id + '\',this.checked)"> Include</label><button class="btn small secondary" onclick="app.removeMatchPlayer(\'' + mp.id + '\')">Remove</button></div></div>';
  }

  function gkCapableMatchPlayers(match) {
    return activeMatchPlayers(match.id).filter(function (mp) { return matchPlayerGkCapable(mp.id); });
  }
  function renderKeeperPlanOptions(match) {
    var keepers = gkCapableMatchPlayers(match);
    if (keepers.length < 2) return '<div class="control-group keeper-compact"><label>Keeper plan</label><div class="keeper-plan-note">Fixed GK · 50 minutes</div></div>';
    var plan = match.keeperPlan || 'fixed';
    return '<div class="control-group"><label>Keeper plan</label><div class="tabs compact-control"><button class="' + (plan === 'fixed' ? 'active' : '') + '" onclick="app.updateMatch(\'' + match.id + '\',\'keeperPlan\',\'fixed\')">Fixed GK · 50</button><button class="' + (plan === 'split' ? 'active' : '') + '" onclick="app.updateMatch(\'' + match.id + '\',\'keeperPlan\',\'split\')">Split halves</button><button class="' + (plan === 'manual' ? 'active' : '') + '" onclick="app.updateMatch(\'' + match.id + '\',\'keeperPlan\',\'manual\')">Manual</button></div><p class="subtext">Standard is fixed GK. Split halves creates a keeper change at half if a bench GK is available.</p></div>';
  }
  function renderStepFormation(match) {
    var mode = match.suggestMode || 'positional';
    var rotation = match.rotationStyle || 'balanced';
    var finalPhase = match.finalPhase || 'live';
    var timing = match.subTiming || inferSubTiming(match);
    var benchCount = benchPlayers(match).length;
    var heavyRecommended = benchCount > 3;
    var finalLabel = timing === 'heavy' ? 'final 8' : 'final 12';
    var keeperOptions = renderKeeperPlanOptions(match);
    var intentText = rotation === 'competitive' ? 'Prioritizes stronger positional fit. Minimum time is still protected.' : rotation === 'fair' ? 'Prioritizes playing-time balance while avoiding weak DEF / Center structure.' : 'Balances team strength and playing time. Roster players win close calls.';
    return '<div class="card plan-settings-card"><div class="step-header"><h2><span class="stepnum">3</span>Plan settings</h2><div class="row"><button class="btn" onclick="app.autoPlanMatch(\'' + match.id + '\')">Auto plan match</button><span class="badge">First draft only · manual edits stay available</span></div></div>' +
      '<div class="plan-command-layout">' +
        '<section class="formation-command"><label>Formation</label><div class="formation-grid">' + Object.keys(FORMATIONS).map(function (key) { return renderFormationOption(match, key); }).join('') + '</div></section>' +
        '<section class="plan-control-panel"><div class="control-group"><label>Starting lineup priority</label><div class="tabs compact-control"><button class="' + (mode === 'positional' ? 'active' : '') + '" onclick="app.updateMatch(\'' + match.id + '\',\'suggestMode\',\'positional\')">Best positional fit</button><button class="' + (mode === 'signup' ? 'active' : '') + '" onclick="app.updateMatch(\'' + match.id + '\',\'suggestMode\',\'signup\')">Sign-up order</button></div><p class="subtext">Signed-up players rank higher only when choices are close.</p></div>' +
        '<div class="control-group"><label>Rotation intent</label><div class="intent-spectrum ' + escapeAttr(rotation) + '"><button class="' + (rotation === 'competitive' ? 'active' : '') + '" onclick="app.updateMatch(\'' + match.id + '\',\'rotationStyle\',\'competitive\')"><strong>Competitive</strong><span>Stronger</span></button><button class="' + (rotation === 'balanced' ? 'active' : '') + '" onclick="app.updateMatch(\'' + match.id + '\',\'rotationStyle\',\'balanced\')"><strong>Balanced</strong><span>Default</span></button><button class="' + (rotation === 'fair' ? 'active' : '') + '" onclick="app.updateMatch(\'' + match.id + '\',\'rotationStyle\',\'fair\')"><strong>Fair minutes</strong><span>Time</span></button></div><div class="intent-readout">' + escapeHtml(intentText) + '</div></div>' +
        '<div class="control-grid"><div class="control-group"><label>Substitution timing</label><div class="tabs compact-control"><button class="' + (timing === 'standard' || timing === 'balanced' ? 'active' : '') + '" onclick="app.applySubTemplate(\'' + match.id + '\',\'balanced\')">Standard</button><button class="' + (timing === 'heavy' ? 'active' : '') + '" onclick="app.applySubTemplate(\'' + match.id + '\',\'heavy\')">Heavy</button><button class="' + (timing === 'custom' ? 'active' : '') + '" onclick="app.addWindow(\'' + match.id + '\')">Custom</button></div><p class="subtext">' + (heavyRecommended ? 'Bench has 4+ players: Auto plan will switch to heavy every 8 minutes.' : 'Auto timing uses max 3 changes per window.') + '</p></div>' +
        '<div class="control-group"><label>Final phase</label><div class="tabs compact-control"><button class="' + (finalPhase === 'planned' ? 'active' : '') + '" onclick="app.setFinalPhase(\'' + match.id + '\',\'planned\')">Plan ' + escapeHtml(finalLabel) + '</button><button class="' + (finalPhase === 'live' ? 'active' : '') + '" onclick="app.setFinalPhase(\'' + match.id + '\',\'live\')">Live ' + escapeHtml(finalLabel) + '</button></div><p class="subtext">Live phase is shown as planned + all-in estimate in Highlights.</p></div></div>' +
        keeperOptions +
        '<div class="changes-auto-card"><strong>Changes per window</strong><span>Auto · max 3</span><em>Use target changes inside a custom window when you need manual control.</em></div>' +
      '</section></div></div>';
  }

  function renderFormationOption(match, key) {
    return '<button class="formation-card ' + (match.formation === key ? 'active' : '') + '" onclick="app.updateMatch(\'' + match.id + '\',\'formation\',\'' + key + '\')"><div class="player-title">' + key + '</div><div class="subtext">' + (key === '2-3-1' ? '2 DEF / 3 MID / 1 FWD' : '3 DEF / 2 MID / 1 FWD') + '</div>' + renderMiniField(key) + '</button>';
  }
  function renderMiniField(key) {
    return '<div class="mini-field">' + FORMATIONS[key].map(function (s) { return '<div class="mini-slot" style="' + slotStyle(s) + '">' + s.position + '</div>'; }).join('') + '</div>';
  }
  function renderStepLineup(match) {
    var players = activeMatchPlayers(match.id);
    var used = Object.keys(lineupFor(match)).map(function (p) { return match.lineup[p]; }).filter(Boolean);
    return '<div class="card"><div class="step-header"><h2><span class="stepnum">4</span>Build lineup</h2><div class="row"><button class="btn" onclick="app.suggestLineup(\'' + match.id + '\',\'' + (match.suggestMode || 'positional') + '\')">Auto Suggest</button><button class="btn secondary" onclick="app.clearLineup(\'' + match.id + '\')">Clear</button></div></div><div class="lineup-wrap"><div>' + renderLineupField(match, false) + '</div><div><h3>Players</h3><p class="subtext">Tap a field slot, then tap a player to assign manually. Two-player lines are centered.</p><div class="list">' + (players.length ? players.map(function (mp) { return renderAssignablePlayer(mp, used.indexOf(mp.id) >= 0); }).join('') : '<div class="empty-state">Import players first.</div>') + '</div><h3 style="margin-top:16px">Bench</h3><div class="bench">' + (benchPlayers(match).map(function (mp) { return renderBenchChip(playerContext(mp)); }).join('') || '<span class="subtext">No bench players.</span>') + '</div></div></div></div>';
  }
  function renderLineupField(match, shareMode, lineupMap, displayMode) {
    var mode = displayMode || (shareMode ? 'share' : 'edit');
    var className = mode === 'moment' ? 'lineup-field moment-field compact-field' : (shareMode ? 'share-field compact-field' : 'lineup-field edit-field');
    var snapshot = lineupMap || lineupFor(match);
    return '<div class="' + className + '">' + FORMATIONS[match.formation].map(function (slot) { return mode === 'edit' ? renderPositionSlot(match, slot, snapshot) : renderShareSlot(match, slot, snapshot); }).join('') + '</div>';
  }
  function renderPositionSlot(match, slot, lineupMap) {
    var playerId = (lineupMap || lineupFor(match))[slot.position];
    var mp = playerId ? data.matchPlayers.find(function (p) { return p.id === playerId; }) : null;
    var ctx = mp ? playerContext(mp) : null;
    var active = state.activeSlot === slot.position ? ' active' : '';
    var filled = ctx ? ' filled' : '';
    return '<div class="position-slot' + active + filled + '" style="' + slotStyle(slot) + '" onclick="app.selectSlot(\'' + slot.position + '\')">' + (ctx ? '<button class="clear" onclick="event.stopPropagation();app.clearSlot(\'' + match.id + '\',\'' + slot.position + '\')">x</button><div class="avatar"><img src="' + ctx.avatar.src + '"></div><div class="name">' + escapeHtml(ctx.name.split(' ')[0]) + '</div><div class="pos">' + slot.position + '</div>' : '<div class="pos">' + slot.position + '</div><div style="font-size:28px;font-weight:1000">+</div>') + '</div>';
  }
  function renderAssignablePlayer(mp, used) {
    var ctx = playerContext(mp);
    return '<button class="player-chip ' + (used ? 'dim' : '') + '" onclick="app.assignSelected(\'' + mp.id + '\')"><div class="avatar small"><img src="' + ctx.avatar.src + '"></div><div><div class="player-title">' + escapeHtml(ctx.name) + '</div><div class="subtext">' + escapeHtml(ctx.primaryPosition) + ' / ' + escapeHtml(ctx.secondaryPosition) + ' / #' + mp.signupOrder + '</div></div>' + membershipBadge(ctx.membership) + '</button>';
  }
  function renderBenchChip(ctx) {
    return '<div class="player-chip"><div class="avatar small"><img src="' + ctx.avatar.src + '"></div><div><div class="player-title">' + escapeHtml(ctx.name.split(' ')[0]) + '</div><div class="subtext">' + escapeHtml(ctx.primaryPosition) + '</div></div></div>';
  }
  function renderStepSubs(match) {
    var cfg = rotationConfig(match.rotationStyle || 'balanced');
    var timing = match.subTiming || inferSubTiming(match);
    var cfgFinal = finalPhaseConfig(match);
    var finalText = (match.finalPhase || 'live') === 'live' ? 'Live ' + cfgFinal.text : 'Plan ' + cfgFinal.text;
    return '<div class="card"><div class="step-header"><h2><span class="stepnum">5</span>Plan substitutions</h2><div class="row"><button class="btn" onclick="app.suggestSubs(\'' + match.id + '\')">Auto Suggest Subs</button><button class="btn secondary" onclick="app.clearSubs(\'' + match.id + '\')">Clear</button></div></div>' +
      '<div class="plan-summary-row"><span class="badge">' + escapeHtml(cfg.label) + '</span><span class="badge">' + escapeHtml(timing === 'heavy' ? 'Heavy rotation' : timing === 'custom' ? 'Custom timing' : 'Standard timing') + '</span><span class="badge">' + escapeHtml(finalText) + '</span><span class="subtext">Auto uses max 3 changes per window. Each window is treated as a simultaneous batch.</span></div>' +
      '<div class="sub-planner-grid"><div>' + renderMomentPreview(match) + '</div><div class="grid">' + (match.subWindows || []).sort(function(a,b){return a.minute-b.minute;}).map(function (w) { return renderWindow(match, w); }).join('') + '<button class="btn secondary" onclick="app.addWindow(\'' + match.id + '\')">Add custom window</button><div><label>Strategy note</label><textarea onchange="app.updateMatch(\'' + match.id + '\',\'strategyNote\',this.value)">' + escapeHtml(match.strategyNote || '') + '</textarea></div></div></div></div>';
  }

  function renderMomentPreview(match) {
    var windows = orderedSubWindows(match).filter(function (w) { return !w.live; });
    var chosen = selectedMoment(match);
    var buttons = '<button class="' + (chosen === 'initial' ? 'active' : '') + '" onclick="app.setMoment(\'' + match.id + '\',\'initial\')">Initial</button>' +
      windows.map(function (w) { return '<button class="' + (chosen === w.id ? 'active' : '') + '" onclick="app.setMoment(\'' + match.id + '\',\'' + w.id + '\')">' + escapeHtml(w.label) + '</button>'; }).join('') +
      '<button class="' + (chosen === 'final' ? 'active' : '') + '" onclick="app.setMoment(\'' + match.id + '\',\'final\')">Final planned</button>';
    var snapshot = lineupSnapshot(match, chosen);
    var bench = benchPlayersForLineup(match, snapshot);
    return '<div class="moment-preview"><div class="row space"><div><h3>Formation view by moment</h3><div class="subtext">Toggle to see who is on the field after each substitution window.</div></div><div class="tabs moment-tabs">' + buttons + '</div></div>' +
      '<div class="moment-grid"><div>' + renderLineupField(match, false, snapshot, 'moment') + '</div><div><h3>Bench at this moment</h3><div class="bench">' + (bench.map(function (mp) { return renderBenchChip(playerContext(mp)); }).join('') || '<span class="subtext">No bench players.</span>') + '</div></div></div></div>';
  }
  function renderWindow(match, w) {
    var rows = (match.subs || []).filter(function (s) { return s.windowId === w.id; }).sort(function (a, b) { return a.order - b.order; });
    return '<div class="window-card"><div class="row space"><div><div class="player-title">' + escapeHtml(w.label) + '</div><div class="subtext">Minute ' + w.minute + (w.live ? ' / live rotation message only' : '') + '</div></div><button class="btn small danger" onclick="app.deleteWindow(\'' + match.id + '\',\'' + w.id + '\')">Delete</button></div>' +
      '<div class="field-row three"><div><label>Label</label><input value="' + escapeAttr(w.label) + '" onchange="app.updateWindow(\'' + match.id + '\',\'' + w.id + '\',\'label\',this.value)"></div><div><label>Minute</label><input type="number" min="0" max="50" value="' + w.minute + '" onchange="app.updateWindow(\'' + match.id + '\',\'' + w.id + '\',\'minute\',this.value)"></div><div><label>Target changes</label><input type="number" min="0" max="7" placeholder="Auto" value="' + (w.targetSubs === undefined ? '' : w.targetSubs) + '" onchange="app.updateWindow(\'' + match.id + '\',\'' + w.id + '\',\'targetSubs\',this.value)"></div></div>' +
      '<label class="row" style="margin:0;text-transform:none;letter-spacing:0"><input style="width:auto" type="checkbox" ' + (w.live ? 'checked' : '') + ' onchange="app.updateWindow(\'' + match.id + '\',\'' + w.id + '\',\'live\',this.checked)"> Mark as live rotation, not fixed subs</label>' +
      (!w.live ? '<div class="list">' + (rows.length ? rows.map(function (s) { return renderSubRow(match, s); }).join('') : '<div class="empty-state">No fixed subs in this window.</div>') + '</div><button class="btn small ghost" onclick="app.addSubRow(\'' + match.id + '\',\'' + w.id + '\')">Add change</button>' : '<div class="empty-state">Use the strategy note for this live phase.</div>') + '</div>';
  }
  function playerOptionsFrom(players, selected) {
    if (!players.length && selected) {
      var existing = data.matchPlayers.find(function (p) { return p.id === selected; });
      if (existing) players = [existing];
    }
    return players.map(function (mp) {
      var ctx = playerContext(mp);
      return '<option value="' + mp.id + '" ' + (mp.id === selected ? 'selected' : '') + '>' + escapeHtml(ctx.name) + '</option>';
    }).join('');
  }
  function playerOutOptionsFrom(match, players, selected, sub) {
    var before = lineupBeforeWindow(match, sub.windowId);
    if (!players.length && selected) {
      var existing = data.matchPlayers.find(function (p) { return p.id === selected; });
      if (existing) players = [existing];
    }
    return players.map(function (mp) {
      var ctx = playerContext(mp);
      var pos = positionOfPlayer(before, mp.id);
      var suffix = pos === 'GK' ? ' · GK' : '';
      return '<option value="' + mp.id + '" ' + (mp.id === selected ? 'selected' : '') + '>' + escapeHtml(ctx.name + suffix) + '</option>';
    }).join('');
  }
  function renderSubPositionControl(match, s) {
    var label = subPositionLabel(match, s);
    if (state.editingSubPositionId === s.id) {
      return '<select class="position-override-select" title="Choose where the incoming player goes" onchange="app.setSubTargetPosition(\'' + match.id + '\',\'' + s.id + '\',this.value)" onblur="app.stopSubPositionOverride()">' + positionOverrideOptions(match, s) + '</select>';
    }
    return '<button type="button" class="position-chip ' + (s.manualPosition ? 'manual' : '') + '" title="Double-click to override the incoming position" ondblclick="app.startSubPositionOverride(\'' + match.id + '\',\'' + s.id + '\')">' + escapeHtml(label) + '</button>';
  }
  function renderSubRow(match, s) {
    var inPlayers = candidateInPlayers(match, s);
    var outPlayers = candidateOutPlayers(match, s);
    return '<div class="sub-row smart-sub-row compact-sub-row"><div><label>IN</label><select class="in-select" onchange="app.updateSub(\'' + match.id + '\',\'' + s.id + '\',\'playerInId\',this.value)">' + playerOptionsFrom(inPlayers, s.playerInId) + '</select></div><div>' + renderSubPositionControl(match, s) + '</div><div><label>OUT</label><select class="out-select" onchange="app.updateSub(\'' + match.id + '\',\'' + s.id + '\',\'playerOutId\',this.value)">' + playerOutOptionsFrom(match, outPlayers, s.playerOutId, s) + '</select></div><button class="btn small danger" onclick="app.deleteSub(\'' + match.id + '\',\'' + s.id + '\')">×</button></div>';
  }
  function renderMinutes(players, minutes) {
    return '<div style="margin-top:12px"><h3>Estimated minutes</h3><div class="minutes-grid">' + players.map(function (mp) { var ctx = playerContext(mp); var min = Math.round(minutes[mp.id] || 0); return '<div class="minute-card"><div class="row"><div class="avatar small"><img src="' + ctx.avatar.src + '"></div><div><div class="player-title">' + escapeHtml(ctx.name) + '</div><div class="subtext">' + min + ' / 50 min</div></div></div><div class="minute-bar"><span style="width:' + Math.min(100, min * 2) + '%"></span></div></div>'; }).join('') + '</div></div>';
  }
  function goalkeeperIdsForPlan(match) {
    var ids = {};
    var gk = lineupFor(match).GK;
    if (gk) ids[gk] = true;
    (match.subs || []).forEach(function (s) {
      var before = lineupBeforeWindow(match, s.windowId);
      var outPos = positionOfPlayer(before, s.playerOutId);
      var targetPos = s.position || outPos;
      if (outPos === 'GK') ids[s.playerOutId] = true;
      if (targetPos === 'GK') ids[s.playerInId] = true;
    });
    return ids;
  }
  function goalkeeperTargetMinutes(match, playerId) {
    if ((match.keeperPlan || 'fixed') === 'split') return 25;
    return 50;
  }
  function segmentLineups(match) {
    var segments = [];
    var current = clone(lineupFor(match));
    var last = 0;
    orderedSubWindows(match).forEach(function (w) {
      var minute = Math.max(0, Math.min(50, Number(w.minute || 0)));
      if (minute > last) segments.push({ start: last, end: minute, lineup: clone(current), live: false });
      if (!w.live) orderedSubsInWindow(match, w.id).forEach(function (s) { applySubToLineup(match, current, s); });
      last = Math.max(last, minute);
    });
    if (last < 50) segments.push({ start: last, end: 50, lineup: clone(current), live: match.finalPhase === 'live' });
    return segments.filter(function (seg) { return seg.end > seg.start; });
  }
  function slotScoreForPlayer(match, lineup, slot) {
    var id = lineup[slot.position];
    if (!id) return 0;
    var mp = data.matchPlayers.find(function (p) { return p.id === id; });
    return mp ? roleSkill(playerContext(mp), slot.role) : 0;
  }
  function computePlanScores(match) {
    if (!match || !hasLineupData(match)) return { team: 0, defense: 0, center: 0, forward: 0 };
    var formation = FORMATIONS[match.formation] || FORMATIONS['2-3-1'];
    var segments = segmentLineups(match);
    var teamSum = 0, teamDen = 0, defSum = 0, defDen = 0, fwdSum = 0, fwdDen = 0, ctrSum = 0, ctrDen = 0;
    segments.forEach(function (seg) {
      var dur = seg.end - seg.start;
      formation.forEach(function (slot) {
        var value = slotScoreForPlayer(match, seg.lineup, slot);
        teamSum += value * dur;
        teamDen += dur;
        if (slot.role === 'defense') { defSum += value * dur; defDen += dur; }
        if (slot.role === 'forward') { fwdSum += value * dur; fwdDen += dur; }
      });
      if (match.formation === '3-2-1') {
        var cb = formation.find(function (s) { return s.position === 'CB'; });
        var cbScore = cb ? slotScoreForPlayer(match, seg.lineup, cb) : 0;
        var support = 0;
        ['LM','RM','FWD'].forEach(function (pos) {
          var id = seg.lineup[pos];
          var mp = id ? data.matchPlayers.find(function (p) { return p.id === id; }) : null;
          if (mp) support = Math.max(support, roleSkill(playerContext(mp), 'center'));
        });
        ctrSum += ((cbScore * 0.30) + (support * 0.70)) * dur;
        ctrDen += dur;
      } else {
        var cm = formation.find(function (s) { return s.position === 'CM'; });
        ctrSum += (cm ? slotScoreForPlayer(match, seg.lineup, cm) : 0) * dur;
        ctrDen += dur;
      }
    });
    function avg(sum, den) { return den ? Math.round((sum / den) * 10) / 10 : 0; }
    return { team: avg(teamSum, teamDen), defense: avg(defSum, defDen), center: avg(ctrSum, ctrDen), forward: avg(fwdSum, fwdDen) };
  }
  function scoreLabel(value) {
    value = Number(value || 0);
    if (value >= 4.6) return 'Elite';
    if (value >= 4.1) return 'Strong';
    if (value >= 3.5) return 'Stable';
    if (value >= 3.0) return 'Needs support';
    return 'Risk';
  }
  function planWarnings(match, bundle) {
    var warnings = [];
    if (!match || !hasLineupData(match)) return warnings;
    var active = activeMatchPlayers(match.id);
    var gkIds = goalkeeperIdsForPlan(match);
    var outfield = active.filter(function (mp) { return !gkIds[mp.id]; });
    var plannedAvg = outfield.length ? (6 * plannedHorizon(match)) / outfield.length : 0;
    var targetFloor = Math.max(0, plannedAvg - 10);
    outfield.forEach(function (mp) {
      var planned = Math.round((bundle.planned && bundle.planned[mp.id]) || 0);
      if (targetFloor && planned < targetFloor) warnings.push({ level: 'warn', title: playerContext(mp).name + ' is below target minutes', detail: planned + ' planned min vs ' + Math.round(targetFloor) + ' min target floor.' });
    });
    Object.keys(gkIds).forEach(function (id) {
      var mp = data.matchPlayers.find(function (p) { return p.id === id; });
      if (!mp) return;
      var targetGk = goalkeeperTargetMinutes(match, id);
      var full = Math.round((bundle.full && bundle.full[id]) || 0);
      if (full < targetGk - 5) warnings.push({ level: 'warn', title: playerContext(mp).name + ' is below GK target', detail: full + ' min vs ' + targetGk + ' min keeper target.' });
    });
    var initialBench = benchPlayersForLineup(match, lineupFor(match)).map(function (p) { return p.id; });
    var firstWindow = orderedSubWindows(match).filter(function (w) { return !w.live; })[0];
    if (firstWindow && initialBench.length) {
      var rowsFirst = orderedSubsInWindow(match, firstWindow.id);
      var firstIn = rowsFirst.map(function (s) { return s.playerInId; }).filter(Boolean);
      var expected = Math.min(3, initialBench.length);
      var usedInitial = initialBench.filter(function (id) { return firstIn.indexOf(id) >= 0; }).length;
      if (usedInitial < expected) warnings.push({ level: 'warn', title: 'First window does not bring in all bench players', detail: 'Expected ' + expected + ', found ' + usedInitial + '.' });
    }
    var outHistory = {};
    orderedSubWindows(match).forEach(function (w) {
      if (w.live) return;
      var before = lineupBeforeWindow(match, w.id);
      var benchIds = benchPlayersForLineup(match, before).map(function (p) { return p.id; });
      var fieldIds = idsOnField(before);
      var rows = orderedSubsInWindow(match, w.id);
      var inIds = {}, outIds = {}, defChanges = 0;
      rows.forEach(function (s) {
        if (!s.playerInId || !s.playerOutId) warnings.push({ level: 'fix', title: w.label + ' has an incomplete change', detail: 'Choose both IN and OUT players.' });
        if (s.playerInId && benchIds.indexOf(s.playerInId) < 0) warnings.push({ level: 'fix', title: playerNameById(s.playerInId) + ' is not on the bench at ' + w.label, detail: 'Incoming players must come from the pre-window bench.' });
        if (s.playerOutId && fieldIds.indexOf(s.playerOutId) < 0) warnings.push({ level: 'fix', title: playerNameById(s.playerOutId) + ' is not on the field at ' + w.label, detail: 'Outgoing players must come from the pre-window field.' });
        if (s.playerInId && outIds[s.playerInId]) warnings.push({ level: 'fix', title: playerNameById(s.playerInId) + ' is both OUT and IN at ' + w.label, detail: 'Same-window re-entry is not allowed.' });
        if (s.playerOutId && inIds[s.playerOutId]) warnings.push({ level: 'fix', title: playerNameById(s.playerOutId) + ' is both IN and OUT at ' + w.label, detail: 'Same-window re-entry is not allowed.' });
        if (s.playerInId && inIds[s.playerInId]) warnings.push({ level: 'fix', title: playerNameById(s.playerInId) + ' is used twice as IN at ' + w.label, detail: 'Each player can enter once per window.' });
        if (s.playerOutId && outIds[s.playerOutId]) warnings.push({ level: 'fix', title: playerNameById(s.playerOutId) + ' is used twice as OUT at ' + w.label, detail: 'Each player can leave once per window.' });
        inIds[s.playerInId] = true; outIds[s.playerOutId] = true;
        var pos = positionOfPlayer(before, s.playerOutId);
        var role = roleForPosition(pos, match.formation);
        if (role === 'defense') defChanges++;
        if ((pos === 'GK' || (s.position || pos) === 'GK') && (match.keeperPlan || 'fixed') === 'fixed') warnings.push({ level: 'warn', title: 'GK change found while keeper plan is fixed', detail: 'Use Split halves or Manual if this is intentional.' });
        if (s.playerOutId && !gkIds[s.playerOutId]) outHistory[s.playerOutId] = (outHistory[s.playerOutId] || 0) + 1;
      });
      if (defChanges > 1) warnings.push({ level: 'warn', title: 'Multiple defenders changed at ' + w.label, detail: 'Avoid changing both defenders in the same window when possible.' });
    });
    Object.keys(outHistory).forEach(function (id) {
      if (outHistory[id] > 1) warnings.push({ level: 'warn', title: playerNameById(id) + ' is taken out multiple times', detail: 'Balanced/Fair plans should rotate rest across other eligible outfield players when possible.' });
    });
    var lineup = lineupFor(match);
    (FORMATIONS[match.formation] || FORMATIONS['2-3-1']).forEach(function (slot) {
      if (slot.position === 'GK') return;
      var id = lineup[slot.position];
      var mp = id ? data.matchPlayers.find(function (p) { return p.id === id; }) : null;
      if (!mp) return;
      var ctx = playerContext(mp);
      if (ctx.membership !== 'support') return;
      var main = roleSkill(ctx, slot.role);
      var bestRoster = bestRosterSkillForSlot(activeMatchPlayers(match.id).map(playerContext), slot);
      var critical = slot.role === 'defense' || slot.role === 'center' || slot.role === 'forward';
      if (critical && !(main >= 5 && (main - bestRoster) >= 2)) warnings.push({ level: 'warn', title: 'Support player starts in a critical role', detail: ctx.name + ' starts at ' + slot.position + '. Roster players should win close calls.' });
    });
    return warnings;
  }
  function playerNameById(id) {
    var mp = data.matchPlayers.find(function (p) { return p.id === id; });
    return mp ? playerContext(mp).name : 'Player';
  }
  function computePlanHighlights(match) {
    var bundle = hasLineupData(match) ? estimateMinutesBundle(match) : { planned: {}, full: {}, liveFinal: false, cutoff: 50 };
    var scores = computePlanScores(match);
    var warnings = planWarnings(match, bundle);
    var fixCount = warnings.filter(function (w) { return w.level === 'fix'; }).length;
    var status = !hasLineupData(match) ? { cls: 'empty', label: 'Generate plan', detail: 'Build a lineup and substitutions to see highlights.' } : fixCount ? { cls: 'fix', label: 'Fix required', detail: fixCount + ' critical issue' + (fixCount === 1 ? '' : 's') } : warnings.length ? { cls: 'warn', label: 'Needs review', detail: warnings.length + ' coaching note' + (warnings.length === 1 ? '' : 's') } : { cls: 'good', label: 'Strong plan', detail: 'No critical warnings' };
    return { bundle: bundle, scores: scores, warnings: warnings, status: status };
  }
  function renderScoreCard(label, value, icon) {
    var pct = Math.max(0, Math.min(100, Number(value || 0) / 5 * 100));
    return '<div class="score-card"><div class="score-icon">' + icon + '</div><div><span>' + escapeHtml(label) + '</span><strong>' + Number(value || 0).toFixed(1) + '</strong><em>' + escapeHtml(scoreLabel(value)) + '</em></div><div class="score-meter"><i style="width:' + pct + '%"></i></div></div>';
  }
  function renderPlanWarnings(warnings) {
    if (!warnings.length) return '<div class="coaching-card good-note"><strong>Good plan</strong><span>No invalid substitutions or major time-balance risks detected.</span></div>';
    return '<div class="warning-stack">' + warnings.slice(0, 6).map(function (w) { return '<div class="coaching-card ' + (w.level === 'fix' ? 'fix-note' : 'warn-note') + '"><strong>' + escapeHtml(w.title) + '</strong><span>' + escapeHtml(w.detail || '') + '</span></div>'; }).join('') + (warnings.length > 6 ? '<div class="subtext">+' + (warnings.length - 6) + ' more notes.</div>' : '') + '</div>';
  }
  function renderPlayingTimeChart(match, highlights) {
    var active = activeMatchPlayers(match.id);
    if (!active.length || !hasLineupData(match)) return '<div class="empty-state">Build a lineup to see playing-time balance.</div>';
    var bundle = highlights.bundle;
    var gkIds = goalkeeperIdsForPlan(match);
    var outfield = active.filter(function (mp) { return !gkIds[mp.id]; });
    var plannedAvg = outfield.length ? (6 * plannedHorizon(match)) / outfield.length : 0;
    var targetFloor = Math.max(0, plannedAvg - 10);
    var live = bundle.liveFinal;
    var rows = active.slice().sort(function (a, b) { return (a.signupOrder || 99) - (b.signupOrder || 99); }).map(function (mp) {
      var ctx = playerContext(mp);
      var planned = Math.round((bundle.planned && bundle.planned[mp.id]) || 0);
      var full = Math.round((bundle.full && bundle.full[mp.id]) || planned);
      var isGk = !!gkIds[mp.id];
      var target = isGk ? goalkeeperTargetMinutes(match, mp.id) : targetFloor;
      var status = isGk ? (full < target - 5 ? 'low' : 'ok') : (planned < target ? 'low' : planned >= plannedAvg + 10 ? 'high' : 'ok');
      var plannedPct = Math.max(0, Math.min(100, planned / 50 * 100));
      var fullPct = Math.max(plannedPct, Math.min(100, full / 50 * 100));
      var targetPct = Math.max(0, Math.min(100, target / 50 * 100));
      var minuteText = live ? planned + ' planned · ~' + full + ' all-in' : full + ' min';
      var targetText = isGk ? 'GK target ' + Math.round(target) + ' min' : 'Target floor ' + Math.round(targetFloor) + ' min';
      return '<div class="time-row ' + status + (isGk ? ' gk-row' : '') + '" style="--planned:' + plannedPct + '%;--full:' + fullPct + '%;--target:' + targetPct + '%"><div class="time-player"><div class="avatar small"><img src="' + ctx.avatar.src + '"></div><div><strong>' + escapeHtml(ctx.name) + '</strong><span>' + escapeHtml(targetText) + '</span></div></div><div class="time-track"><i class="allin"></i><i class="planned"></i><b></b></div><div class="time-value">' + escapeHtml(minuteText) + (status === 'low' ? '<em>Below target</em>' : '') + '</div></div>';
    }).join('');
    var gkLabel = (match.keeperPlan || 'fixed') === 'split' ? 'GK half target: 25 min' : 'GK target: 50 min';
    return '<div class="time-chart"><div class="time-chart-head"><strong>Playing time balance</strong><span>Outfield target floor: ' + Math.round(targetFloor) + ' min · planned avg ' + Math.round(plannedAvg) + ' min · ' + gkLabel + '</span></div>' + rows + '</div>';
  }
  function renderCoachReadout(match, highlights) {
    if (!hasLineupData(match)) return 'Generate the plan to see the coach readout.';
    var scores = highlights.scores;
    if (highlights.status.cls === 'fix') return 'Fix the substitution issue before sharing the plan.';
    var lead = (match.rotationStyle || 'balanced') === 'fair' ? 'Fair-minutes plan' : (match.rotationStyle || 'balanced') === 'competitive' ? 'Competitive plan' : 'Balanced plan';
    var strength = scores.forward >= 4.3 ? 'strong forward threat' : scores.defense >= 4 ? 'stable defensive base' : 'balanced structure';
    var risk = highlights.warnings.length ? ' Review the coaching notes before kickoff.' : ' No major risks detected.';
    return lead + ' with ' + strength + '. ' + risk;
  }
  function renderPlanHighlights(match) {
    var h = computePlanHighlights(match);
    var s = h.scores;
    return '<div class="card plan-highlights-card"><div class="step-header"><h2><span class="stepnum">6</span>Plan highlights</h2><span class="badge">Recalculates after manual edits</span></div>' +
      '<div class="plan-health ' + h.status.cls + '"><div><span>' + escapeHtml(h.status.label) + '</span><strong>' + escapeHtml(h.status.detail) + '</strong></div><p>' + escapeHtml(renderCoachReadout(match, h)) + '</p></div>' +
      '<div class="score-grid">' + renderScoreCard('Team Score', s.team, '★') + renderScoreCard('Defense', s.defense, '🛡') + renderScoreCard('Center', s.center, '◈') + renderScoreCard('Forward', s.forward, '⚡') + '</div>' +
      '<div class="highlights-grid"><div><h3>Warnings / coaching notes</h3>' + renderPlanWarnings(h.warnings) + '</div><div>' + renderPlayingTimeChart(match, h) + '</div></div></div>';
  }
  function renderShareHighlightsCompact(match) {
    var h = computePlanHighlights(match);
    if (!hasLineupData(match)) return '';
    var s = h.scores;
    return '<div class="poster-highlights"><div><strong>' + escapeHtml(h.status.label) + '</strong><span>' + escapeHtml(h.status.detail) + '</span></div><div class="poster-score-row"><span>Team ' + s.team.toFixed(1) + '</span><span>DEF ' + s.defense.toFixed(1) + '</span><span>CTR ' + s.center.toFixed(1) + '</span><span>FWD ' + s.forward.toFixed(1) + '</span></div></div>';
  }
  function renderStepShare(match) {
    var text = buildShareText(match);
    return '<div class="card share-step"><div class="step-header"><h2><span class="stepnum">7</span>Share match plan</h2><div class="row"><button class="btn" onclick="app.downloadShareImage(\'' + match.id + '\')">Download image</button><button class="btn secondary" onclick="app.openShareImage(\'' + match.id + '\')">Open image</button><button class="btn secondary" onclick="app.copyShareImage(\'' + match.id + '\')">Copy image to clipboard</button><button class="btn ghost" onclick="app.copyShareText(\'' + match.id + '\')">Copy WhatsApp text</button></div></div><div class="share-stack"><div class="share-main">' + renderShareCard(match) + '</div><div class="share-message"><label>WhatsApp message</label><textarea class="share-text" id="shareText">' + escapeHtml(text) + '</textarea></div></div></div>';
  }
  function renderShareCard(match) {
    var t = activeTournament();
    var nextBench = benchPlayers(match);
    var benchHtml = nextBench.map(function (mp) {
      var ctx = playerContext(mp);
      return '<div class="bench-card"><div class="avatar small"><img src="' + ctx.avatar.src + '"></div><div><strong>' + escapeHtml(ctx.name.split(' ')[0]) + '</strong><span>' + escapeHtml(ctx.primaryPosition) + '</span></div>' + membershipBadge(ctx.membership) + '</div>';
    }).join('') || '<div class="share-live">No bench</div>';
    var meta = metaParts(match);
    return '<div class="share-poster" id="shareCard"><div class="poster-sun">7v7</div><div class="poster-header"><div><div class="eyebrow light">Match plan</div><h2>' + escapeHtml(t.teamName) + '</h2>' + (meta.length ? '<p>' + escapeHtml(meta.join(' · ')) + '</p>' : '') + '</div><div class="poster-badge"><strong>' + escapeHtml(match.formation) + '</strong><span>formation</span></div></div>' +
      '<div class="poster-body"><div class="poster-field-card"><div class="poster-label">Starting 7</div>' + renderLineupField(match, true) + '</div><div class="poster-plan-card"><div class="poster-label">Bench</div><div class="bench poster-bench-list">' + benchHtml + '</div>' + renderShareSubTimeline(match) + '</div></div>' +
      renderShareHighlightsCompact(match) +
      '<div class="poster-footer"><div><strong>Last phase</strong><span>' + escapeHtml(match.strategyNote || defaultStrategyNote()) + '</span></div></div></div>';
  }
  function renderShareSubTimeline(match) {
    var windows = orderedSubWindows(match);
    return '<div class="share-subtimeline poster-timeline"><div class="poster-label">Rotations</div>' + windows.map(function (w) {
      if (w.live) return '<div class="share-window live-window"><div class="share-window-title">' + escapeHtml(w.label) + '</div><div class="share-live">Live rotation · tired player asks out, ready player jumps in</div></div>';
      var rows = (match.subs || []).filter(function (s) { return s.windowId === w.id; });
      return '<div class="share-window"><div class="share-window-title">' + escapeHtml(w.label) + '</div>' + (rows.length ? rows.map(function (s) { return renderShareSubRow(match, s); }).join('') : '<div class="share-live">No fixed changes</div>') + '</div>';
    }).join('') + '</div>';
  }
  function renderShareSubRow(match, s) {
    var inMp = data.matchPlayers.find(function (p) { return p.id === s.playerInId; });
    var outMp = data.matchPlayers.find(function (p) { return p.id === s.playerOutId; });
    var inCtx = inMp ? playerContext(inMp) : null;
    var outCtx = outMp ? playerContext(outMp) : null;
    return '<div class="sub-visual-row poster-sub-row"><div class="mini-person in">' + (inCtx ? '<div class="avatar small"><img src="' + inCtx.avatar.src + '"></div><div><em>IN</em><span>' + escapeHtml(inCtx.name.split(' ')[0]) + '</span></div>' : '<span>TBD</span>') + '</div><div class="sub-arrow"><strong>' + escapeHtml(s.position || '') + '</strong></div><div class="mini-person out">' + (outCtx ? '<div class="avatar small"><img src="' + outCtx.avatar.src + '"></div><div><em>OUT</em><span>' + escapeHtml(outCtx.name.split(' ')[0]) + '</span></div>' : '<span>TBD</span>') + '</div></div>';
  }

  function renderShareSlot(match, slot, lineupMap) {
    var playerId = (lineupMap || lineupFor(match))[slot.position];
    var mp = playerId ? data.matchPlayers.find(function (p) { return p.id === playerId; }) : null;
    if (!mp) return '<div class="share-slot compact-slot empty" style="' + slotStyle(slot) + '"><div class="label">' + slot.position + '</div></div>';
    var ctx = playerContext(mp);
    return '<div class="share-slot compact-slot filled" style="' + slotStyle(slot) + '"><div class="avatar"><img src="' + ctx.avatar.src + '"></div><div class="label">' + slot.position + ' ' + escapeHtml(ctx.name.split(' ')[0]) + '</div></div>';
  }
  function buildShareText(match) {
    var lines = [];
    var t = activeTournament();
    lines.push("Match Plan - " + matchDisplayTitle(match));
    lines.push(t.teamName + (match.opponent ? " - vs " + match.opponent : ""));
    var meta = [];
    if (match.date) meta.push(formatLongDate(match.date));
    if (match.time) meta.push(match.time);
    if (match.location) meta.push(match.location);
    if (meta.length) lines.push(meta.join(" / "));
    if (match.formation) lines.push("Formation: " + match.formation);
    lines.push("");
    lines.push("Starting 7:");
    FORMATIONS[match.formation].forEach(function (slot) {
      var mp = data.matchPlayers.find(function (p) { return p.id === lineupFor(match)[slot.position]; });
      lines.push(slot.position + ": " + (mp ? playerContext(mp).name : "TBD"));
    });
    var bench = benchPlayers(match).map(function (mp) { return playerContext(mp).name; });
    lines.push("");
    lines.push("Bench: " + (bench.length ? bench.join(", ") : "No bench"));
    lines.push("");
    lines.push("Subs:");
    (match.subWindows || []).slice().sort(function (a, b) { return a.minute - b.minute; }).forEach(function (w) {
      lines.push(w.label + ":");
      if (w.live) {
        lines.push("- Live rotation. Decide changes in the moment based on who is tired and ready.");
      } else {
        var rows = (match.subs || []).filter(function (s) { return s.windowId === w.id; });
        if (!rows.length) lines.push("- No fixed changes");
        rows.forEach(function (s) {
          var inMp = data.matchPlayers.find(function (p) { return p.id === s.playerInId; });
          var outMp = data.matchPlayers.find(function (p) { return p.id === s.playerOutId; });
          lines.push("- " + (inMp ? playerContext(inMp).name : "TBD") + " IN at " + subPositionLabel(match, s) + " -> " + (outMp ? playerContext(outMp).name : "TBD") + " OUT");
        });
      }
    });
    if (match.strategyNote) { lines.push(""); lines.push("Strategy: " + match.strategyNote); }
    return lines.join("\n");
  }
  function absoluteUrlMaybe(value) {
    if (!value || /^data:|^blob:|^https?:/i.test(value)) return value;
    try { return new URL(value, window.location.href).href; } catch (e) { return value; }
  }
  function absolutizeCssUrls(value) {
    return String(value || '').replace(/url\((['"]?)([^'")]+)\1\)/g, function (_, quote, url) { return 'url("' + absoluteUrlMaybe(url) + '")'; });
  }
  function prepareShareClone(node) {
    var clone = node.cloneNode(true);
    function inline(src, dst) {
      var cs = window.getComputedStyle(src);
      dst.setAttribute('style', absolutizeCssUrls(cs.cssText));
      if (dst.tagName && dst.tagName.toLowerCase() === 'img') dst.setAttribute('src', absoluteUrlMaybe(src.currentSrc || src.src || dst.getAttribute('src')));
      for (var i = 0; i < src.children.length; i++) inline(src.children[i], dst.children[i]);
    }
    inline(node, clone);
    return clone;
  }
  function loadCanvasImage(src) {
    return new Promise(function (resolve) {
      if (!src) return resolve(null);
      var img = new Image();
      if (!/^data:|^blob:/i.test(src)) img.crossOrigin = 'anonymous';
      img.onload = function () { resolve(img); };
      img.onerror = function () { resolve(null); };
      img.src = absoluteUrlMaybe(src);
    });
  }
  function canvasToBlob(canvas, callback) {
    if (canvas.toBlob) return canvas.toBlob(function (blob) { callback(blob); }, 'image/png');
    try {
      var dataUrl = canvas.toDataURL('image/png');
      var bytes = atob(dataUrl.split(',')[1]);
      var arr = new Uint8Array(bytes.length);
      for (var i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i);
      callback(new Blob([arr], { type: 'image/png' }));
    } catch (e) { callback(null); }
  }
  function roundRect(ctx, x, y, w, h, r) {
    r = Math.min(r || 0, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }
  function fillRoundRect(ctx, x, y, w, h, r, fill, stroke, lw) {
    roundRect(ctx, x, y, w, h, r);
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.lineWidth = lw || 2; ctx.strokeStyle = stroke; ctx.stroke(); }
  }
  function drawFitText(ctx, text, x, y, maxWidth, font, fill, align) {
    ctx.font = font;
    ctx.fillStyle = fill || '#102344';
    ctx.textAlign = align || 'left';
    ctx.textBaseline = 'alphabetic';
    var value = String(text || '');
    if (!maxWidth || ctx.measureText(value).width <= maxWidth) return ctx.fillText(value, x, y);
    while (value.length > 1 && ctx.measureText(value + '…').width > maxWidth) value = value.slice(0, -1);
    ctx.fillText(value + '…', x, y);
  }
  function drawWrappedText(ctx, text, x, y, maxWidth, lineHeight, maxLines, font, fill) {
    ctx.font = font;
    ctx.fillStyle = fill || '#102344';
    ctx.textAlign = 'left';
    var words = String(text || '').split(/\s+/);
    var line = '';
    var lines = [];
    words.forEach(function (word) {
      var test = line ? line + ' ' + word : word;
      if (ctx.measureText(test).width > maxWidth && line) { lines.push(line); line = word; }
      else line = test;
    });
    if (line) lines.push(line);
    lines.slice(0, maxLines || lines.length).forEach(function (l, i) { ctx.fillText(l, x, y + i * lineHeight); });
  }
  function drawCircleImage(ctx, img, cx, cy, size) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, size / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    if (img) {
      var iw = img.width || size, ih = img.height || size;
      var scale = Math.max(size / iw, size / ih);
      var w = iw * scale, h = ih * scale;
      ctx.drawImage(img, cx - w / 2, cy - h / 2, w, h);
    } else {
      ctx.fillStyle = '#dce8f7';
      ctx.fillRect(cx - size / 2, cy - size / 2, size, size);
    }
    ctx.restore();
    ctx.lineWidth = Math.max(5, size * 0.07);
    ctx.strokeStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(cx, cy, size / 2, 0, Math.PI * 2);
    ctx.stroke();
  }
  function drawMarker(ctx, img, label, x, y, avatarSize, maxLabelWidth) {
    drawCircleImage(ctx, img, x, y, avatarSize);
    var text = String(label || '');
    ctx.font = '800 ' + Math.round(avatarSize * 0.24) + 'px Arial, sans-serif';
    var width = Math.min(maxLabelWidth || 230, Math.max(110, ctx.measureText(text).width + 34));
    var pillH = Math.round(avatarSize * 0.35);
    fillRoundRect(ctx, x - width / 2, y + avatarSize * 0.39, width, pillH, pillH / 2, '#102d59', null, 0);
    drawFitText(ctx, text, x, y + avatarSize * 0.39 + pillH * 0.72, width - 18, '800 ' + Math.round(avatarSize * 0.23) + 'px Arial, sans-serif', '#ffffff', 'center');
  }
  function shareCardBlob(callback) {
    var match = activeMatch();
    if (!match) { toast('No match selected.'); return callback && callback(null); }
    var t = data.tournaments.find(function (x) { return x.id === match.tournamentId; }) || activeTournament() || {};
    var formation = FORMATIONS[match.formation] || FORMATIONS['2-3-1'];
    var lineup = lineupFor(match);
    var avatarSources = [];
    formation.forEach(function (slot) {
      var mp = data.matchPlayers.find(function (p) { return p.id === lineup[slot.position]; });
      if (mp) avatarSources.push(playerContext(mp).avatar.src);
    });
    benchPlayers(match).forEach(function (mp) { avatarSources.push(playerContext(mp).avatar.src); });
    (match.subs || []).forEach(function (s) {
      [s.playerInId, s.playerOutId].forEach(function (id) { var mp = data.matchPlayers.find(function (p) { return p.id === id; }); if (mp) avatarSources.push(playerContext(mp).avatar.src); });
    });
    var sources = ['assets/field-background.png'].concat(avatarSources.filter(function (src, i, arr) { return src && arr.indexOf(src) === i; }));
    Promise.all(sources.map(loadCanvasImage)).then(function (images) {
      try {
        var imageMap = {};
        sources.forEach(function (src, i) { imageMap[src] = images[i]; });
        var windows = orderedSubWindows(match);
        var bench = benchPlayers(match);
        var rotationHeight = 0;
        windows.forEach(function (w) {
          var rows = (match.subs || []).filter(function (s) { return s.windowId === w.id; });
          rotationHeight += w.live ? 92 : Math.max(92, 48 + Math.max(1, rows.length) * 38);
        });
        var W = 1200, H = Math.max(1760, 1260 + Math.ceil(bench.length / 4) * 86 + rotationHeight + 210);
        var canvas = document.createElement('canvas');
        canvas.width = W;
        canvas.height = H;
        var ctx = canvas.getContext('2d');
        var grad = ctx.createLinearGradient(0, 0, W, H);
        grad.addColorStop(0, '#f6fbff');
        grad.addColorStop(1, '#e8f2ff');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = '#1d63e8';
        ctx.beginPath();
        ctx.arc(1040, 80, 170, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 0.09;
        ctx.fillStyle = '#1d63e8';
        ctx.beginPath();
        ctx.arc(1040, 80, 250, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        fillRoundRect(ctx, 50, 50, 1100, H - 100, 48, 'rgba(255,255,255,0.92)', '#cfe0f5', 4);
        drawFitText(ctx, 'MATCH PLAN', 95, 115, 500, '900 28px Arial, sans-serif', '#1d63e8');
        drawFitText(ctx, t.teamName || 'Team', 95, 175, 640, '900 58px Arial, sans-serif', '#102344');
        var title = matchDisplayTitle(match);
        drawFitText(ctx, title, 95, 225, 700, '800 30px Arial, sans-serif', '#52637c');
        var meta = metaParts(match).join(' · ');
        if (meta) drawFitText(ctx, meta, 95, 265, 900, '700 30px Arial, sans-serif', '#52637c');
        fillRoundRect(ctx, 890, 120, 190, 92, 30, '#102d59', null, 0);
        drawFitText(ctx, match.formation || '', 985, 158, 150, '900 34px Arial, sans-serif', '#ffffff', 'center');
        drawFitText(ctx, 'formation', 985, 192, 150, '700 20px Arial, sans-serif', '#bcd3ff', 'center');

        var hi = computePlanHighlights(match);
        var scoreY = 305;
        fillRoundRect(ctx, 95, scoreY, 1010, 104, 28, '#f7fbff', '#d6e4f5', 3);
        drawFitText(ctx, hi.status.label, 122, scoreY + 42, 260, '900 28px Arial, sans-serif', hi.status.cls === 'fix' ? '#b91c1c' : hi.status.cls === 'warn' ? '#b45309' : '#106b36');
        drawFitText(ctx, hi.status.detail, 122, scoreY + 76, 310, '800 22px Arial, sans-serif', '#52637c');
        var scoreItems = [['Team', hi.scores.team], ['DEF', hi.scores.defense], ['CTR', hi.scores.center], ['FWD', hi.scores.forward]];
        scoreItems.forEach(function (item, i) {
          var x = 455 + i * 155;
          drawFitText(ctx, item[0], x, scoreY + 34, 120, '800 18px Arial, sans-serif', '#52637c', 'center');
          drawFitText(ctx, Number(item[1] || 0).toFixed(1), x, scoreY + 76, 120, '900 34px Arial, sans-serif', '#102344', 'center');
        });

        var fieldX = 120, fieldY = 455, fieldW = 960, fieldH = 610;
        fillRoundRect(ctx, fieldX - 18, fieldY - 18, fieldW + 36, fieldH + 36, 34, '#dff2d4', '#ffffff', 6);
        var fieldImg = imageMap['assets/field-background.png'];
        if (fieldImg) ctx.drawImage(fieldImg, fieldX, fieldY, fieldW, fieldH);
        else { fillRoundRect(ctx, fieldX, fieldY, fieldW, fieldH, 24, '#74b957', '#ffffff', 4); }
        formation.forEach(function (slot) {
          var mp = data.matchPlayers.find(function (p) { return p.id === lineup[slot.position]; });
          var x = fieldX + (slot.x / 100) * fieldW;
          var y = fieldY + (slot.y / 100) * fieldH;
          if (slot.position === 'GK') y = Math.min(fieldY + fieldH - 72, y);
          if (mp) {
            var ctxp = playerContext(mp);
            drawMarker(ctx, imageMap[ctxp.avatar.src], slot.position + ' ' + ctxp.name.split(' ')[0], x, y, 88, 230);
          } else {
            fillRoundRect(ctx, x - 60, y - 25, 120, 50, 25, 'rgba(16,45,89,0.9)', null, 0);
            drawFitText(ctx, slot.position, x, y + 10, 100, '900 26px Arial, sans-serif', '#ffffff', 'center');
          }
        });

        var benchY = 1115;
        drawFitText(ctx, 'Bench', 95, benchY, 500, '900 34px Arial, sans-serif', '#102344');
        if (!bench.length) drawFitText(ctx, 'No bench players', 95, benchY + 45, 700, '700 24px Arial, sans-serif', '#52637c');
        bench.slice(0, 12).forEach(function (mp, i) {
          var ctxp = playerContext(mp);
          var x = 95 + (i % 4) * 265;
          var y = benchY + 45 + Math.floor(i / 4) * 85;
          fillRoundRect(ctx, x, y, 235, 62, 22, '#f7fbff', '#d6e4f5', 3);
          drawCircleImage(ctx, imageMap[ctxp.avatar.src], x + 35, y + 31, 46);
          drawFitText(ctx, ctxp.name.split(' ')[0], x + 72, y + 30, 120, '800 23px Arial, sans-serif', '#102344');
          drawFitText(ctx, ctxp.primaryPosition || '', x + 72, y + 54, 100, '800 17px Arial, sans-serif', '#52637c');
        });

        var rotY = benchY + 55 + Math.ceil(Math.min(bench.length, 12) / 4) * 85;
        drawFitText(ctx, 'Rotations', 95, rotY, 500, '900 34px Arial, sans-serif', '#102344');
        var cursorY = rotY + 30;
        windows.forEach(function (w) {
          var rows = (match.subs || []).filter(function (s) { return s.windowId === w.id; });
          var cardH = w.live ? 92 : Math.max(92, 48 + Math.max(1, rows.length) * 38);
          fillRoundRect(ctx, 95, cursorY, 1010, cardH, 24, '#f7fbff', '#d6e4f5', 3);
          drawFitText(ctx, w.label, 122, cursorY + 42, 220, '900 23px Arial, sans-serif', '#1d63e8');
          if (w.live) {
            drawWrappedText(ctx, 'Live rotation · tired player asks out, ready player jumps in', 350, cursorY + 38, 690, 28, 2, '800 23px Arial, sans-serif', '#52637c');
          } else if (rows.length) {
            rows.forEach(function (s, i) {
              var inp = data.matchPlayers.find(function (p) { return p.id === s.playerInId; });
              var outp = data.matchPlayers.find(function (p) { return p.id === s.playerOutId; });
              var text = (inp ? playerContext(inp).name.split(' ')[0] : 'TBD') + ' in → ' + (outp ? playerContext(outp).name.split(' ')[0] : 'TBD') + ' out';
              drawFitText(ctx, text, 350, cursorY + 40 + i * 36, 720, '800 23px Arial, sans-serif', '#52637c');
            });
          } else {
            drawFitText(ctx, 'No fixed changes', 350, cursorY + 42, 720, '800 23px Arial, sans-serif', '#52637c');
          }
          cursorY += cardH + 14;
        });
        if (match.strategyNote) {
          fillRoundRect(ctx, 95, cursorY + 10, 1010, 110, 24, '#eef6ff', '#d6e4f5', 3);
          drawFitText(ctx, 'Last phase / coaching note', 122, cursorY + 48, 420, '900 24px Arial, sans-serif', '#102344');
          drawWrappedText(ctx, match.strategyNote, 122, cursorY + 82, 940, 27, 3, '700 22px Arial, sans-serif', '#52637c');
        }
        canvasToBlob(canvas, callback);
      } catch (e) {
        console.error(e);
        toast('Could not create image.');
        if (callback) callback(null);
      }
    });
  }

  function membershipBadge(m) { return '<span class="badge ' + (m === 'team' ? 'team' : 'support') + '">' + (m === 'team' ? 'Team' : 'Support') + '</span>'; }
  function weekdayOptions(selected) {
    return ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(function (d) { return '<option value="' + d + '" ' + (d === selected ? 'selected' : '') + '>' + d + '</option>'; }).join('');
  }
  function renderAvatarModal() {
    var target = globalPlayer(state.avatarTarget);
    var draftActive = state.playerEditDraft && target && state.playerEditDraft.gpId === target.id;
    var currentAvatarId = draftActive ? state.playerEditDraft.avatarId : (target && target.avatarId);
    return '<div class="overlay" onclick="app.closeAvatarPicker()"><div class="modal" onclick="event.stopPropagation()"><div class="row space"><div><h2>Choose avatar</h2><div class="subtext">' + escapeHtml(target ? target.name : 'Add custom avatar') + '</div></div><button class="btn secondary" onclick="app.closeAvatarPicker()">Close</button></div>' +
      '<div class="avatar-upload-box"><h3>Upload avatar</h3><div class="field-row"><div><label>Avatar name</label><input id="avatarUploadName" placeholder="Example: Joey"></div><div><label>Image</label><input id="avatarUploadFile" type="file" accept="image/*"></div></div><button class="btn secondary small" onclick="app.uploadAvatar()">Upload avatar</button><div class="subtext">Uploaded avatars are stored in the local database and included in backups.</div></div>' +
      '<div class="avatar-grid">' + allAvatars().map(function (a) { return '<button class="avatar-option ' + (currentAvatarId === a.id ? 'active' : '') + '" onclick="app.setAvatar(\'' + (target ? target.id : '') + '\',\'' + a.id + '\')"><div class="avatar large"><img src="' + a.src + '"></div><span>' + escapeHtml(a.label) + '</span></button>'; }).join('') + '</div></div></div>';
  }
  function renderPlayerProfileDrawer() {
    var gp = globalPlayer(state.profilePlayerId);
    if (!gp) return '';
    var rows = teamPlayersForGlobal(gp.id);
    var currentMembership = teamPlayer(activeTeam().id, gp.id);
    var skills = normalizeSkills((currentMembership && currentMembership.skills) || gp.defaultSkills || defaultSkills());
    return '<div class="overlay side-overlay" onclick="app.closePlayerProfile()"><div class="side-panel player-profile-panel" onclick="event.stopPropagation()"><div class="row space"><div><div class="eyebrow">Player profile</div><h2>' + escapeHtml(gp.name) + '</h2><div class="team-pill-row">' + teamMembershipPills(gp.id) + '</div></div><button class="btn secondary" onclick="app.closePlayerProfile()">Close</button></div>' +
      '<div class="profile-hero"><button class="avatar xl" onclick="app.pickAvatar(\'' + gp.id + '\')"><img src="' + avatarById(gp.avatarId).src + '" alt=""></button><div><div class="subtext">Global player profile. Ratings and avatar are shared across teams.</div><div class="skills compact-skills profile-skills">' + POS_KEYS.map(function (k) { return skillReadoutCompact(skills, k); }).join('') + '</div></div></div>' +
      '<div class="card subtle-card"><h3>Team memberships</h3>' + (rows.length ? rows.map(function (row) { var tm = teamById(row.teamId) || {}; return '<div class="membership-row"><span class="team-dot" style="background:' + escapeAttr(tm.color || '#1769ff') + '"></span><strong>' + escapeHtml(tm.name || 'Team') + '</strong><select onchange="app.updateTeamMembership(\'' + row.id + '\',this.value)"><option value="team" ' + (row.membership === 'team' ? 'selected' : '') + '>Roster</option><option value="support" ' + (row.membership === 'support' ? 'selected' : '') + '>Support</option></select></div>'; }).join('') : '<div class="empty-state">Not assigned to a team yet.</div>') + '</div>' +
      '<div class="row"><button class="btn" onclick="app.addGlobalPlayerToActiveTeam(\'' + gp.id + '\')">Add to ' + escapeHtml(activeTeam().name || 'team') + '</button><button class="btn secondary" onclick="app.closePlayerProfile(); app.go(\'team\');">Open Team section</button></div></div></div>';
  }
  function renderTournamentPanel() {
    var t = activeTournament() || { defaultDay: 'Tuesday', location: '' };
    return '<div class="overlay side-overlay" onclick="app.closeTournamentPanel()"><div class="side-panel" onclick="event.stopPropagation()"><div class="row space"><div><div class="eyebrow">Create tournament</div><h2>New tournament</h2><div class="subtext">Creates a 7-match weekly schedule. Times are blank until selected.</div></div><button class="btn secondary" onclick="app.closeTournamentPanel()">Close</button></div>' +
      '<div class="grid"><div><label>Tournament name</label><input id="newTournamentName" value="Season ' + (data.tournaments.length + 1) + '"></div><div class="field-row"><div><label>Fixed match day</label><select id="newDefaultDay">' + weekdayOptions(t.defaultDay || 'Tuesday') + '</select></div><div><label>First match date</label><input id="newFirstDate" type="date" value="' + nextWeekdayDate(t.defaultDay || 'Tuesday') + '"></div></div><div class="field-row"><div><label>Target matches</label><select id="newMatchCount"><option value="7" selected>7 regular matches</option><option value="8">8 with extension</option><option value="9">9 with finals</option></select></div><div><label>Default field</label><input id="newLocation" placeholder="Optional" value="' + escapeAttr(t.location || '') + '"></div></div><label class="row check-row"><input id="copyRoster" type="checkbox" checked> Copy active roster as starting point</label><button class="btn" onclick="app.createTournament()">Create tournament and schedule</button></div></div></div>';
  }
  function renderRemovePlayerDialog() {
    var tp = tournamentPlayer(state.confirmRemovePlayerId);
    var gp = tp ? globalPlayer(tp.globalPlayerId) : null;
    return '<div class="overlay" onclick="app.cancelRemoveTournamentPlayer()"><div class="modal confirm-modal" onclick="event.stopPropagation()"><h2>Remove ' + escapeHtml(gp ? gp.name : 'player') + '?</h2><p class="subtext">Default action removes the player from this team only. The global player profile remains available for other teams.</p><div class="row"><button class="btn amber" onclick="app.moveTournamentPlayerToSupport(\'' + (tp ? tp.id : '') + '\')">Move to support</button><button class="btn danger" onclick="app.deleteTournamentPlayer(\'' + (tp ? tp.id : '') + '\')">Remove from team</button><button class="btn secondary" onclick="app.cancelRemoveTournamentPlayer()">Cancel</button></div></div></div>';
  }
  function bindAfterRender() {}
  function escapeHtml(str) { return String(str == null ? '' : str).replace(/[&<>"']/g, function (m) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[m]; }); }
  function escapeAttr(str) { return escapeHtml(str).replace(/`/g, '&#096;'); }

  window.app = {
    go: function (view) { if (view === 'matches' && state.lastPlanMatchId && data.matches.find(function (m) { return m.id === state.lastPlanMatchId; })) { this.openMatch(state.lastPlanMatchId); return; } state.view = view; if (view === "home" || view === "tournaments" || view === "matches") syncActiveTournamentToPreferred(false); render(); },
    openMatchesOverview: function () { state.view = 'matches'; state.lastPlanMatchId = null; syncActiveTournamentToPreferred(false); render(); },
    setActiveTeam: function (teamId) { var tm = teamById(teamId); if (!tm) return; state.activeTeamId = tm.id; state.activeTournamentId = preferredTournamentId() || (teamTournaments(tm.id)[0] && teamTournaments(tm.id)[0].id); var m = state.activeTournamentId ? nextMatch(state.activeTournamentId) : null; state.activeMatchId = m && m.id; state.lastPlanMatchId = null; state.view = 'home'; save(); render(); },
    updateTeam: function (field, value) { var tm = activeTeam(); if (!tm) return; if (field === 'name') { tm.name = value || tm.name; data.tournaments.filter(function (t) { return t.teamId === tm.id; }).forEach(function (t) { t.teamName = tm.name; }); } else if (field === 'color') tm.color = value || tm.color; tm.updatedAt = nowIso(); save(); render(); },
    createTeamPrompt: function () { var activeCount = (data.teams || []).filter(function (tm) { return tm.active !== false; }).length; if (activeCount >= 5) return toast('V5 UI supports up to 5 active teams in the switcher.'); var name = prompt('New team name'); if (!name) return; var color = prompt('Team color hex', '#1769ff') || '#1769ff'; var id = uid('team'); data.teams.push({ id: id, name: prettyName(name), color: color, colorName: '', active: true, createdAt: nowIso(), updatedAt: nowIso() }); state.activeTeamId = id; state.activeTournamentId = null; state.activeMatchId = null; save(); render(); toast('Team created. Add a tournament when ready.'); },
    openTournamentPanel: function () { state.tournamentPanelOpen = true; render(); },
    closeTournamentPanel: function () { state.tournamentPanelOpen = false; render(); },
    openPlayerProfile: function (gpId) { if (!gpId) return; state.profilePlayerId = gpId; render(); },
    closePlayerProfile: function () { state.profilePlayerId = null; render(); },
    addGlobalPlayerToActiveTeam: function (gpId) { var gp = globalPlayer(gpId); if (!gp) return; var role = confirm('Add ' + gp.name + ' as roster player for ' + activeTeam().name + '? OK = Roster, Cancel = Support') ? 'team' : 'support'; var row = ensureTeamPlayer(activeTeam().id, gpId, role, gp.defaultSkills); visibleTournaments().forEach(function (t) { ensureTournamentPlayerFromTeam(t.id, row); refreshPlayerPositions(t.id); }); save(); render(); toast('Player added to ' + activeTeam().name + '.'); },
    addExistingPlayerToTeamPrompt: function () { var q = prompt('Search existing player name'); if (!q) return; var n = normalizeAlias(q); var matches = data.globalPlayers.filter(function (gp) { return gp.normalizedName.indexOf(n) >= 0 || n.indexOf(gp.normalizedName) >= 0 || (gp.aliases || []).some(function (a) { return normalizeAlias(a).indexOf(n) >= 0; }); }); if (!matches.length) return toast('No existing player found. Use Add player to create a new one.'); this.addGlobalPlayerToActiveTeam(matches[0].id); },
    updateTeamMembership: function (teamPlayerId, membership) { var row = data.teamPlayers.find(function (tp) { return tp.id === teamPlayerId; }); if (!row) return; row.membership = membership === 'team' ? 'team' : 'support'; row.updatedAt = nowIso(); data.tournaments.filter(function (t) { return t.teamId === row.teamId; }).forEach(function (t) { var tp = data.tournamentPlayers.find(function (x) { return x.tournamentId === t.id && x.globalPlayerId === row.globalPlayerId; }); if (tp) tp.membership = row.membership; }); save(); render(); },
    resetData: resetData,
    setActiveTournament: function (id) { state.activeTournamentId = id; var t = data.tournaments.find(function (x) { return x.id === id; }); if (t && t.teamId) state.activeTeamId = t.teamId; syncTournamentRosterFromTeam(id); var m = nextMatch(id); state.activeMatchId = m && m.id; render(); },
    setScheduleView: function (mode) { state.scheduleViewMode = mode === 'full' ? 'full' : 'summary'; render(); },
    setDataTable: function (name) { state.dataTable = name || 'tournaments'; render(); },
    startTournamentEdit: function () { state.tournamentSetupEditing = true; render(); },
    cancelTournamentEdit: function () { state.tournamentSetupEditing = false; render(); },
    applyTournamentSetup: function (tId) {
      var t = data.tournaments.find(function (x) { return x.id === tId; }); if (!t) return;
      var oldStart = t.startDate || ''; var oldDay = t.defaultDay || ''; var oldTarget = Number(t.matchTarget || 7); var oldLocation = t.location || '';
      var name = document.getElementById('editTournamentName'); var start = document.getElementById('editTournamentStart'); var day = document.getElementById('editTournamentDay'); var target = document.getElementById('editTournamentTarget'); var loc = document.getElementById('editTournamentLocation');
      t.name = name && name.value ? name.value : t.name;
      t.startDate = start && start.value ? start.value : t.startDate;
      t.defaultDay = day && day.value ? day.value : t.defaultDay;
      t.matchTarget = clampMatchTarget(target && target.value ? target.value : t.matchTarget);
      t.location = loc ? loc.value : t.location;
      var structural = oldStart !== (t.startDate || '') || oldDay !== (t.defaultDay || '') || oldTarget !== Number(t.matchTarget || 7);
      if (oldLocation !== (t.location || '') && confirm('Update the default field for future matches in ' + (t.name || 'this tournament') + '? Past matches will not change.')) {
        var today = todayDateString();
        matches(tId).filter(function (m) { return !m.date || m.date >= today; }).forEach(function (m) { m.location = t.location || ''; m.updatedAt = nowIso(); });
      }
      if (structural) regenerateEmptyGeneratedSchedule(tId); else { fillTournamentSchedule(tId); renumberTournamentMatches(tId); }
      t.updatedAt = nowIso(); state.tournamentSetupEditing = false; save(); render(); toast('Tournament setup updated.');
    },
    deleteTournamentPrompt: function (tId) {
      var t = data.tournaments.find(function (x) { return x.id === tId; }); if (!t) return;
      var choice = prompt('Archive or delete ' + (t.name || 'this tournament') + '?\n\nType ARCHIVE to hide it but keep data.\nType DELETE to permanently delete the tournament, matches, and roster copy.');
      if (!choice) return; choice = choice.trim().toUpperCase();
      if (choice === 'ARCHIVE') { t.archived = true; t.updatedAt = nowIso(); state.activeTournamentId = preferredTournamentId() || (visibleTournaments()[0] && visibleTournaments()[0].id) || (data.tournaments[0] && data.tournaments[0].id); save(); render(); toast('Tournament archived.'); return; }
      if (choice === 'DELETE') { var confirmName = prompt('Permanent delete. Type the tournament name to confirm:', ''); if (confirmName !== (t.name || '')) return toast('Delete cancelled.'); var matchIds = data.matches.filter(function (m) { return m.tournamentId === tId; }).map(function (m) { return m.id; }); data.tournaments = data.tournaments.filter(function (x) { return x.id !== tId; }); data.matches = data.matches.filter(function (m) { return m.tournamentId !== tId; }); data.matchPlayers = data.matchPlayers.filter(function (p) { return matchIds.indexOf(p.matchId) < 0; }); data.tournamentPlayers = data.tournamentPlayers.filter(function (p) { return p.tournamentId !== tId; }); state.activeTournamentId = preferredTournamentId() || (visibleTournaments()[0] && visibleTournaments()[0].id) || (data.tournaments[0] && data.tournaments[0].id); var next = state.activeTournamentId ? nextMatch(state.activeTournamentId) : null; state.activeMatchId = next && next.id; save(); render(); toast('Tournament deleted.'); return; }
      toast('No changes made.');
    },
    createTournament: function () {
      var name = document.getElementById('newTournamentName').value || 'Tournament';
      var team = activeTeam(); var teamName = team ? team.name : 'Team';
      var defaultDay = document.getElementById('newDefaultDay').value || 'Tuesday';
      var location = document.getElementById('newLocation').value || '';
      var firstDate = document.getElementById('newFirstDate').value || nextWeekdayDate(defaultDay);
      var count = Number(document.getElementById('newMatchCount').value || 7);
      var copyRoster = document.getElementById('copyRoster') ? document.getElementById('copyRoster').checked : true;
      var id = uid('t');
      data.tournaments.push({ id: id, name: name, teamId: team ? team.id : 'team_green_fc', teamName: teamName, defaultDay: defaultDay, location: location, startDate: firstDate, weekCount: count, matchTarget: count, skipDates: [], createdAt: nowIso(), updatedAt: nowIso() });
      syncTournamentRosterFromTeam(id);
      // V5 uses team membership as the tournament roster source.

      for (var i = 0; i < count; i++) data.matches.push(createMatchSeed(id, addDays(firstDate, i * 7), i));
      reconcileTournamentSchedule(id);
      state.activeTournamentId = id; state.activeMatchId = matches(id)[0].id; state.tournamentPanelOpen = false; save(); render(); toast('Tournament created.');
    },
    updateTournamentPlayer: function (tpId, field, value) { var tp = tournamentPlayer(tpId); if (!tp) return; if (value === 'true') value = true; if (value === 'false') value = false; tp[field] = value; refreshPlayerPositions(tp.tournamentId); tp.updatedAt = nowIso(); save(); render(); },
    updateGlobalPlayerName: function (gpId, value) { var gp = globalPlayer(gpId); if (!gp) return; gp.name = prettyName(value || gp.name); gp.normalizedName = normalizeAlias(gp.name); gp.updatedAt = nowIso(); save(); render(); },
    updateSkill: function (tpId, key, value) { var tp = tournamentPlayer(tpId); if (!tp) return; var nextValue = Number(value); var current = Number(tp.skills[key] || 0); if (nextValue > 3 && current <= 3) { var strongCount = POS_KEYS.filter(function (k) { return k !== key && Number(tp.skills[k] || 0) > 3; }).length; if (strongCount >= 3) { toast('Max 3 strong positions allowed. Lower another 4/5 first.'); render(); return; } } tp.skills[key] = nextValue; var clean = clampStrongPositions(tp.skills, tp.tournamentId, tp.id); tp.skills = clean.skills; tp.goalieEligible = tp.skills.goalie >= 3; if (tp.tournamentGoalie && !tp.goalieEligible) tp.tournamentGoalie = false; refreshPlayerPositions(tp.tournamentId); tp.updatedAt = nowIso(); save(); render(); },
    rederivePositions: function (tpId) { var tp = tournamentPlayer(tpId); if (!tp) return; refreshPlayerPositions(tp.tournamentId); save(); render(); },
    setTournamentGoalie: function (tpId) { var tp = tournamentPlayer(tpId); if (!tp) return; if ((tp.skills.goalie || 0) < 3) return toast('A tournament goalie needs 3+ goalie stars.'); tournamentPlayers(tp.tournamentId).forEach(function (p) { p.tournamentGoalie = false; }); tp.tournamentGoalie = true; tp.goalieEligible = true; var gp = globalPlayer(tp.globalPlayerId); save(); render(); toast((gp ? gp.name : 'Player') + ' selected as goalie for the rest of the tournament.'); },
    askRemoveTournamentPlayer: function (tpId) { state.confirmRemovePlayerId = tpId; render(); },
    cancelRemoveTournamentPlayer: function () { state.confirmRemovePlayerId = null; render(); },
    moveTournamentPlayerToSupport: function (tpId) { var tp = tournamentPlayer(tpId); if (!tp) return; tp.membership = 'support'; var tt = data.tournaments.find(function (x) { return x.id === tp.tournamentId; }); ensureTeamPlayer(tt && tt.teamId ? tt.teamId : activeTeam().id, tp.globalPlayerId, 'support', tp.skills); state.confirmRemovePlayerId = null; save(); render(); toast('Moved to support.'); },
    deleteTournamentPlayer: function (tpId) { var tp = tournamentPlayer(tpId); if (!tp) return; var tt = data.tournaments.find(function (x) { return x.id === tp.tournamentId; }); data.tournamentPlayers = data.tournamentPlayers.filter(function (p) { return p.id !== tpId; }); var row = teamPlayer(tt && tt.teamId ? tt.teamId : activeTeam().id, tp.globalPlayerId); if (row) row.active = false; state.confirmRemovePlayerId = null; save(); render(); toast('Player removed from this team.'); },
    removeTournamentPlayer: function (tpId) { state.confirmRemovePlayerId = tpId; render(); },
    addPlayerPrompt: function () { var name = prompt('Player name'); if (!name) return; var role = confirm('Add as Team player? OK = Team, Cancel = Support') ? 'team' : 'support'; var t = activeTournament(); var created = createSupportFromName(t.id, name); var tp = tournamentPlayer(created.tournamentPlayerId); tp.membership = role; ensureTeamPlayer(t.teamId || activeTeam().id, tp.globalPlayerId, role, tp.skills); refreshPlayerPositions(t.id); save(); render(); },
    editPlayer: function (tpId) { var tp = tournamentPlayer(tpId); var gp = tp && globalPlayer(tp.globalPlayerId); if (!tp || !gp) return; state.editingPlayerId = tpId; state.playerEditDraft = { tpId: tp.id, gpId: gp.id, name: gp.name, avatarId: gp.avatarId, membership: tp.membership, skills: clone(normalizeSkills(tp.skills)) }; render(); },
    updatePlayerDraft: function (field, value) { if (!state.playerEditDraft) return; state.playerEditDraft[field] = value; render(); },
    updatePlayerDraftSkill: function (key, value) { if (!state.playerEditDraft) return; var skills = normalizeSkills(state.playerEditDraft.skills); var nextValue = Number(value); var current = Number(skills[key] || 0); if (nextValue > 3 && current <= 3) { var strongCount = POS_KEYS.filter(function (k) { return k !== key && Number(skills[k] || 0) > 3; }).length; if (strongCount >= 3) { toast('Max 3 strong positions allowed. Lower another 4/5 first.'); render(); return; } } skills[key] = nextValue; state.playerEditDraft.skills = skills; render(); },
    savePlayerEdit: function () { var draft = state.playerEditDraft; if (!draft) return; var tp = tournamentPlayer(draft.tpId); var gp = globalPlayer(draft.gpId); if (!tp || !gp) return; var clean = clampStrongPositions(draft.skills, tp.tournamentId, tp.id); gp.name = prettyName(draft.name || gp.name); gp.normalizedName = normalizeAlias(gp.name); gp.avatarId = draft.avatarId || gp.avatarId; gp.updatedAt = nowIso(); tp.membership = draft.membership || tp.membership; tp.skills = clean.skills; var tt = data.tournaments.find(function (x) { return x.id === tp.tournamentId; }); var teamRow = ensureTeamPlayer(tt && tt.teamId ? tt.teamId : activeTeam().id, gp.id, tp.membership, clean.skills); if (teamRow) { teamRow.skills = clone(clean.skills); teamRow.membership = tp.membership; } data.tournamentPlayers.forEach(function (other) { var ot = data.tournaments.find(function (x) { return x.id === other.tournamentId; }); if (other.globalPlayerId === gp.id && ot && tt && ot.teamId === tt.teamId) { other.membership = tp.membership; other.skills = clone(clean.skills); } }); tp.goalieEligible = (tp.skills.goalie || 0) >= 3; if (tp.tournamentGoalie && !tp.goalieEligible) tp.tournamentGoalie = false; refreshPlayerPositions(tp.tournamentId); tp.updatedAt = nowIso(); state.editingPlayerId = null; state.playerEditDraft = null; save(); render(); toast('Player saved.'); },
    cancelPlayerEdit: function () { state.editingPlayerId = null; state.playerEditDraft = null; render(); },
    pickAvatar: function (gpId) { state.avatarTarget = gpId; render(); },
    closeAvatarPicker: function () { state.avatarTarget = null; render(); },
    setAvatar: function (gpId, avatarId) { var gp = globalPlayer(gpId); if (!gp) return; if (state.playerEditDraft && state.playerEditDraft.gpId === gpId) { state.playerEditDraft.avatarId = avatarId; state.avatarTarget = null; render(); return; } gp.avatarId = avatarId; gp.updatedAt = nowIso(); state.avatarTarget = null; save(); render(); },
    uploadAvatar: function () { var nameInput = document.getElementById('avatarUploadName'); var fileInput = document.getElementById('avatarUploadFile'); var label = nameInput ? nameInput.value.trim() : ''; var file = fileInput && fileInput.files && fileInput.files[0]; if (!label) return toast('Avatar name is required.'); if (!file) return toast('Choose an image file.'); if (!/^image\//.test(file.type || '')) return toast('Please upload an image file.'); var reader = new FileReader(); reader.onload = function () { var avatar = { id: uid('avatar'), label: label, src: reader.result, custom: true, createdAt: nowIso(), updatedAt: nowIso() }; data.customAvatars = data.customAvatars || []; data.customAvatars.push(avatar); var target = state.avatarTarget && globalPlayer(state.avatarTarget); if (target) { if (state.playerEditDraft && state.playerEditDraft.gpId === target.id) state.playerEditDraft.avatarId = avatar.id; else { target.avatarId = avatar.id; target.updatedAt = nowIso(); } } state.avatarTarget = null; save(); render(); toast('Avatar uploaded.'); }; reader.onerror = function () { toast('Could not read that image.'); }; reader.readAsDataURL(file); },
    updateTournament: function (tId, field, value) { var t = data.tournaments.find(function (x) { return x.id === tId; }); if (!t) return; if (field === 'weekCount') value = Number(value || 1); if (field === 'matchTarget') value = clampMatchTarget(value); if (field === 'startDate') t.startDate = value; else t[field] = value; if (field === 'startDate' || field === 'defaultDay') { t.skipDates = []; data.matches.filter(function (m) { return m.tournamentId === tId && m.generatedFromTournament !== false && !m.sequenceLocked && !hasMatchUserData(m); }).forEach(function (m, index) { m.date = addDays(t.startDate || nextWeekdayDate(t.defaultDay), index * 7); m.updatedAt = nowIso(); }); } t.updatedAt = nowIso(); reconcileTournamentSchedule(tId); save(); render(); },
    updateTournamentLocation: function (tId, value) { var t = data.tournaments.find(function (x) { return x.id === tId; }); if (!t) return; var old = t.location || ''; t.location = value || ''; if (old !== t.location && confirm('Update the default field for future matches in ' + (t.name || 'this tournament') + '? Past matches will not change.')) { var today = todayDateString(); matches(tId).filter(function (m) { return !m.date || m.date >= today; }).forEach(function (m) { m.location = t.location; m.updatedAt = nowIso(); }); } t.updatedAt = nowIso(); save(); render(); },
    setTournamentTarget: function (tId, value) { var t = data.tournaments.find(function (x) { return x.id === tId; }); if (!t) return; t.matchTarget = clampMatchTarget(value); fillTournamentSchedule(tId); t.updatedAt = nowIso(); save(); render(); toast('Tournament target updated.'); },
    refillSchedule: function (tId, shouldRender) { fillTournamentSchedule(tId); if (shouldRender !== false) { save(); render(); toast('Schedule repaired and filled to target.'); } },
    addMatchOnDate: function (tId, date) { var t = data.tournaments.find(function (x) { return x.id === tId; }); if (t) removeSkipDate(t, date); var existing = matches(tId).filter(function (m) { return m.date === date; }).sort(function (a, b) { return (a.time || '').localeCompare(b.time || ''); }); var m = createMatchObject(tId, date, '', ''); m.generatedFromTournament = false; if (existing.length) { if (!existing[0].time) { existing[0].time = '19:00'; existing[0].updatedAt = nowIso(); } m.time = addHoursToTime(existing[existing.length - 1].time || '19:00', 1) || '20:00'; } data.matches.push(m); trimExtraGeneratedMatches(tId); renumberTournamentMatches(tId); if (t) t.weekCount = tournamentWeeks(tId).length; state.activeTournamentId = tId; state.activeMatchId = m.id; save(); render(); toast(existing.length ? 'Double-header match added.' : 'Match added for ' + date + '.'); },
    skipWeek: function (tId, date) { var t = data.tournaments.find(function (x) { return x.id === tId; }); if (!t) return; var existing = matches(tId).filter(function (m) { return m.date === date; }); if (!existing.length && isSkipDate(t, date)) return toast('This week is already skipped.'); if (!confirm('Skip week ' + date + '? This removes matches on that date and adds a future week if needed.')) return; addSkipDate(t, date); var ids = existing.map(function (m) { return m.id; }); data.matches = data.matches.filter(function (m) { return ids.indexOf(m.id) < 0; }); data.matchPlayers = data.matchPlayers.filter(function (p) { return ids.indexOf(p.matchId) < 0; }); fillTournamentSchedule(tId); if (ids.indexOf(state.activeMatchId) >= 0) { var n = nextMatch(tId); state.activeMatchId = n && n.id; } save(); render(); toast('Skip week added.'); },
    unskipWeek: function (tId, date) { var t = data.tournaments.find(function (x) { return x.id === tId; }); if (!t) return; removeSkipDate(t, date); fillTournamentSchedule(tId); save(); render(); toast('Skip week removed.'); },
    shiftFutureMatches: function (tId, date) { if (!confirm('Move this week and all future matches one week later? Match numbers will stay in order.')) return; matches(tId).filter(function (m) { return m.date && m.date >= date && m.status !== 'completed'; }).forEach(function (m) { m.date = addDays(m.date, 7); m.sequenceLocked = true; m.updatedAt = nowIso(); }); var t = data.tournaments.find(function (x) { return x.id === tId; }); if (t) { t.skipDates = skipDatesFor(t).map(function (d) { return d >= date ? addDays(d, 7) : d; }); t.updatedAt = nowIso(); } renumberTournamentMatches(tId); save(); render(); toast('Future schedule shifted one week.'); },
    addManualMatch: function () { var t = activeTournament(); var m = createMatchObject(t.id, nextWeekdayDate(t.defaultDay), '', ''); m.generatedFromTournament = false; data.matches.push(m); renumberTournamentMatches(t.id); state.activeMatchId = m.id; save(); render(); toast('Match added.'); },
    generateMoreMatches: function () { var t = activeTournament(); var count = Number(prompt('Confirmed matches target?', String(t.matchTarget || 7)) || t.matchTarget || 7); this.setTournamentTarget(t.id, count); },
    updateMatch: function (matchId, field, value, rerender) { var m = data.matches.find(function (x) { return x.id === matchId; }); if (!m) return; var oldDate = m.date; m[field] = value; if (field === 'formation') { m.lineup = {}; m.subs = []; state.momentByMatch[matchId] = 'initial'; normalizeFormationLineup(m); } if (field === 'date') { var t = data.tournaments.find(function (x) { return x.id === m.tournamentId; }); if (oldDate && oldDate !== value) m.sequenceLocked = true; if (t) removeSkipDate(t, value); } if (field === 'date' || field === 'time' || field === 'opponent' || field === 'location') { renumberTournamentMatches(m.tournamentId); var tt = data.tournaments.find(function (x) { return x.id === m.tournamentId; }); if (tt) tt.weekCount = tournamentWeeks(m.tournamentId).length; } m.updatedAt = nowIso(); save(); if (rerender !== false) render(); },
    setScore: function (matchId, field, value) { var m = data.matches.find(function (x) { return x.id === matchId; }); if (!m) return; m[field] = value === '' ? null : Number(value); if (m.scoreFor !== null && m.scoreFor !== undefined && m.scoreAgainst !== null && m.scoreAgainst !== undefined) { m.result = m.scoreFor > m.scoreAgainst ? 'W' : m.scoreFor < m.scoreAgainst ? 'L' : 'D'; m.status = 'completed'; } m.updatedAt = nowIso(); save(); render(); },
    duplicateMatch: function (matchId) { var m = data.matches.find(function (x) { return x.id === matchId; }); if (!m) return; var copy = clone(m); copy.id = uid('match'); copy.title = (copy.title || 'Match') + ' copy'; copy.date = addDays(copy.date, 0); copy.status = 'draft'; copy.lineup = {}; copy.subs = []; copy.generatedFromTournament = false; data.matches.push(copy); renumberTournamentMatches(copy.tournamentId); save(); render(); },
    deleteMatch: function (matchId) { if (!confirm('Delete this match?')) return; data.matches = data.matches.filter(function (m) { return m.id !== matchId; }); data.matchPlayers = data.matchPlayers.filter(function (p) { return p.matchId !== matchId; }); renumberTournamentMatches(state.activeTournamentId); if (state.activeMatchId === matchId) { var m = matches(state.activeTournamentId)[0]; state.activeMatchId = m && m.id; } save(); render(); },
    openMatch: function (id) { if (!id) return; state.activeMatchId = id; state.lastPlanMatchId = id; var m = data.matches.find(function (x) { return x.id === id; }); if (m) { state.activeTournamentId = m.tournamentId; var t = data.tournaments.find(function (x) { return x.id === m.tournamentId; }); if (t && t.teamId) state.activeTeamId = t.teamId; syncTournamentRosterFromTeam(m.tournamentId); } state.view = 'plan'; state.activeSlot = null; state.momentByMatch[id] = state.momentByMatch[id] || 'initial'; render(); },
    insertSampleRoster: function (matchId) { var sample = 'Tues 23 - 7:10 and 8:05\n1-Jose\n2-Franco\n3-Nishanth\n4-Johan\n5-Fernando\n6-Thomas\n7-Lucas\n8-Roberto 80%\n9-Miguel maybe\n\nOut\n1-Chris\n2-Tobi'; this.updateMatch(matchId, 'rawRosterText', sample); },
    importRoster: importRoster,
    acceptFuzzy: acceptFuzzy,
    rejectFuzzy: rejectFuzzy,
    createNewMatchPlayer: function (matchId, mpId) { var mp = data.matchPlayers.find(function (p) { return p.id === mpId && p.matchId === matchId; }); var match = data.matches.find(function (m) { return m.id === matchId; }); if (!mp || !match) return; var finalName = prompt('Name for this player going forward?', mp.name); if (finalName === null) return; var created = createSupportFromName(match.tournamentId, finalName || mp.name); var tp = tournamentPlayer(created.tournamentPlayerId); var gp = globalPlayer(created.globalPlayerId); if (gp && mp.name) applyPlayerFutureName(gp, mp.name, finalName || mp.name); mp.tournamentPlayerId = created.tournamentPlayerId; mp.globalPlayerId = created.globalPlayerId; mp.matchType = tp ? tp.membership : 'support'; mp.status = 'confirmed'; save(); render(); toast('New player created.'); },
    replaceMatchPlayer: function (matchId, mpId) { var select = document.getElementById('replace_' + mpId); var tpId = select && select.value; if (!tpId) return toast('Choose an existing player.'); var mp = data.matchPlayers.find(function (p) { return p.id === mpId && p.matchId === matchId; }); var tp = tournamentPlayer(tpId); var gp = tp && globalPlayer(tp.globalPlayerId); if (!mp || !tp || !gp) return; var finalName = prompt('What name should we use for this player going forward?', gp.name || mp.name); if (finalName === null) return; applyPlayerFutureName(gp, mp.name, finalName); mp.tournamentPlayerId = tp.id; mp.globalPlayerId = tp.globalPlayerId; mp.matchType = tp.membership; mp.status = 'confirmed'; save(); render(); toast('Player replaced with existing roster player.'); },
    addRosterPlayerToMatch: function (matchId) { var select = document.getElementById('manualPlayer_' + matchId); var tpId = select && select.value; if (!tpId) return toast('Choose a roster player.'); var tp = tournamentPlayer(tpId); var gp = tp && globalPlayer(tp.globalPlayerId); if (!tp || !gp) return; var existing = data.matchPlayers.find(function (p) { return p.matchId === matchId && p.tournamentPlayerId === tpId; }); if (existing) return toast('Player already added.'); data.matchPlayers.push({ id: uid('mp'), matchId: matchId, tournamentPlayerId: tp.id, globalPlayerId: gp.id, name: gp.name, normalizedName: gp.normalizedName, status: 'confirmed', matchType: tp.membership, availability: 'confirmed', probability: 100, included: true, signupOrder: matchPlayers(matchId).length + 1, raw: gp.name, suggestedTournamentPlayerId: null, createdAt: nowIso() }); var match = data.matches.find(function (m) { return m.id === matchId; }); if (match) match.matchImportSummary = rosterImportSummary(matchId); save(); render(); toast('Roster player added to match.'); },
    moveMatchPlayerOrder: function (mpId, delta) { var mp = data.matchPlayers.find(function (p) { return p.id === mpId; }); if (!mp) return; var rows = matchPlayers(mp.matchId); var index = rows.findIndex(function (p) { return p.id === mpId; }); var nextIndex = Math.max(0, Math.min(rows.length - 1, index + Number(delta || 0))); if (index < 0 || index === nextIndex) return; var moved = rows.splice(index, 1)[0]; rows.splice(nextIndex, 0, moved); rows.forEach(function (p, i) { p.signupOrder = i + 1; }); save(); render(); },
    toggleMatchPlayer: function (mpId, checked) { var mp = data.matchPlayers.find(function (p) { return p.id === mpId; }); if (!mp) return; mp.included = checked; save(); render(); },
    removeMatchPlayer: function (mpId) { data.matchPlayers = data.matchPlayers.filter(function (p) { return p.id !== mpId; }); save(); render(); },
    suggestLineup: suggestLineup,
    autoPlanMatch: function (matchId) { var m = data.matches.find(function (x) { return x.id === matchId; }); if (!m) return; suggestLineup(matchId, m.suggestMode || 'positional'); suggestSubs(matchId); toast('Auto match plan generated.'); },
    selectSlot: function (position) { state.activeSlot = state.activeSlot === position ? null : position; render(); },
    assignSelected: function (mpId) { var match = activeMatch(); if (!match || !state.activeSlot) return toast('Select a field slot first.'); Object.keys(lineupFor(match)).forEach(function (pos) { if (match.lineup[pos] === mpId) delete match.lineup[pos]; }); match.lineup[state.activeSlot] = mpId; match.status = 'planned'; match.showMinutes = true; state.activeSlot = null; save(); render(); },
    clearSlot: function (matchId, position) { var m = data.matches.find(function (x) { return x.id === matchId; }); if (!m) return; delete lineupFor(m)[position]; save(); render(); },
    clearLineup: function (matchId) { var m = data.matches.find(function (x) { return x.id === matchId; }); if (!m) return; m.lineup = {}; m.subs = []; m.showMinutes = false; state.momentByMatch[matchId] = 'initial'; save(); render(); },
    setMoment: function (matchId, momentId) { state.momentByMatch[matchId] = momentId; render(); },
    applySubTemplate: applySubTemplate,
    setFinalPhase: function (matchId, mode) { var m = data.matches.find(function (x) { return x.id === matchId; }); if (!m) return; applyFinalPhaseMode(m, mode, false); var cfg = finalPhaseConfig(m); save(); render(); toast((m.finalPhase === 'planned' ? cfg.text + ' will be planned.' : cfg.text + ' set as live coaching.')); },
    addWindow: addWindow,
    updateWindow: updateWindow,
    deleteWindow: deleteWindow,
    suggestSubs: suggestSubs,
    addSubRow: addSubRow,
    updateSub: updateSub,
    startSubPositionOverride: function (matchId, subId) { state.editingSubPositionId = subId; render(); },
    stopSubPositionOverride: function () { state.editingSubPositionId = null; render(); },
    setSubTargetPosition: function (matchId, subId, position) { var match = data.matches.find(function (m) { return m.id === matchId; }); var sub = match && match.subs.find(function (s) { return s.id === subId; }); if (!sub) return; var before = lineupBeforeWindow(match, sub.windowId); var outPos = positionOfPlayer(before, sub.playerOutId); if (!validateSubChoice(match, sub, sub.playerInId, sub.playerOutId, position)) { state.editingSubPositionId = null; render(); return; } sub.position = position; sub.manualPosition = !!(outPos && position !== outPos); state.editingSubPositionId = null; save(); render(); },
    deleteSub: deleteSub,
    clearSubs: function (matchId) { var m = data.matches.find(function (x) { return x.id === matchId; }); if (!m) return; m.subs = []; save(); render(); },
    copyShareText: function (matchId) { var m = data.matches.find(function (x) { return x.id === matchId; }); var box = document.getElementById('shareText'); var text = box ? box.value : buildShareText(m); if (navigator.clipboard && window.isSecureContext) { navigator.clipboard.writeText(text).then(function () { toast('WhatsApp text copied.'); }).catch(function () { fallbackCopy(text, 'WhatsApp text copied.'); }); } else fallbackCopy(text, 'WhatsApp text copied.'); },
    downloadShareImage: function (matchId) { shareCardBlob(function (blob) { if (!blob) return toast('Could not create image.'); var url = URL.createObjectURL(blob); var a = document.createElement('a'); a.href = url; a.download = 'match-planner-card.png'; document.body.appendChild(a); a.click(); document.body.removeChild(a); setTimeout(function () { URL.revokeObjectURL(url); }, 2000); toast('Image downloaded.'); }); },
    openShareImage: function (matchId) { var opened = window.open('', '_blank'); shareCardBlob(function (blob) { if (!blob) { if (opened) opened.close(); return toast('Could not create image.'); } var url = URL.createObjectURL(blob); if (opened) { opened.location.href = url; opened.document.title = 'Match plan image'; toast('Image opened.'); } else toast('Popup blocked. Use Download image instead.'); setTimeout(function () { URL.revokeObjectURL(url); }, 60000); }); },
    copyShareImage: function (matchId) { if (!navigator.clipboard || !window.ClipboardItem) return toast('Clipboard image copy is not supported in this browser.'); shareCardBlob(function (blob) { if (!blob) return toast('Could not create image.'); navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]).then(function () { toast('Image copied to clipboard.'); }).catch(function () { toast('Could not copy image to clipboard.'); }); }); },
    exportData: function () { var backup = { exportFormat: 'captain-match-planner-local-snapshot', appVersion: APP_VERSION, schemaVersion: DB_SCHEMA_VERSION, storageBackend: state.storageBackend, exportedAt: nowIso(), data: clone(data) }; var blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' }); var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'captain-match-planner-v' + APP_VERSION.replace(/\./g, '_') + '-backup.json'; a.click(); URL.revokeObjectURL(a.href); },
    importDataPrompt: function () { var input = document.createElement('input'); input.type = 'file'; input.accept = '.json,application/json'; input.onchange = function () { var file = input.files[0]; if (!file) return; var reader = new FileReader(); reader.onload = function () { try { var parsed = JSON.parse(reader.result); var incoming = parsed && parsed.data && parsed.exportFormat ? parsed.data : parsed; data = migrateData(incoming); state.activeTeamId = preferredTeamId(); data.tournaments.forEach(function (t) { reconcileTournamentSchedule(t.id); }); state.activeTournamentId = preferredTournamentId() || (teamTournaments(state.activeTeamId)[0] && teamTournaments(state.activeTeamId)[0].id) || (data.tournaments[0] && data.tournaments[0].id); var importedNext = state.activeTournamentId ? nextMatch(state.activeTournamentId) : null; state.activeMatchId = importedNext ? importedNext.id : (data.matches[0] && data.matches[0].id); save().then(function () { render(); toast('Data imported into local database.'); }); } catch (e) { alert('Invalid JSON backup.'); } }; reader.readAsText(file); }; input.click(); }
  };
  function fallbackCopy(text, message) { var ta = document.createElement('textarea'); ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.left = '-9999px'; ta.style.top = '0'; document.body.appendChild(ta); ta.focus(); ta.select(); var ok = false; try { ok = document.execCommand('copy'); } catch (e) { ok = false; } document.body.removeChild(ta); toast(ok ? (message || 'Copied.') : 'Copy failed. Select the text and copy manually.'); }
  initializeApp();
})();
