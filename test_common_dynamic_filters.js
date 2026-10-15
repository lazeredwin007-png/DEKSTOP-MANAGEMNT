const fs = require('fs');
const vm = require('vm');

console.log('--- RUNNING FULL DYNAMIC DEPENDENT FILTERS TEST SUITE ---');

// Mock DOM elements registry
const elements = {};

function createMockElement(id, tagName = 'div') {
  const el = {
    id,
    tagName: tagName.toUpperCase(),
    value: '',
    innerHTML: '',
    style: {},
    classList: {
      _classes: new Set(),
      add(c) { this._classes.add(c); },
      remove(c) { this._classes.delete(c); },
      contains(c) { return this._classes.has(c); }
    },
    addEventListener() {},
    dispatchEvent() {},
    querySelectorAll(sel) {
      if (sel === 'option') {
        const matches = [];
        const optRegex = /<option value="([^"]*)">/g;
        let m;
        while ((m = optRegex.exec(el.innerHTML)) !== null) {
          matches.push({ value: m[1] });
        }
        return matches;
      }
      return [];
    },
    querySelector() { return null; }
  };
  elements[id] = el;
  return el;
}

// Set up window / document sandbox
const sandbox = {
  console,
  setTimeout,
  clearTimeout,
  setInterval: () => {},
  clearInterval: () => {},
  history: { pushState() {}, replaceState() {}, state: null },
  Event: class { constructor(type) { this.type = type; } },
  CustomEvent: class { constructor(type) { this.type = type; } },
  location: { reload() {}, hash: '' },
  localStorage: {
    _data: {},
    getItem(k) { return this._data[k] || null; },
    setItem(k, v) { this._data[k] = String(v); },
    removeItem(k) { delete this._data[k]; },
    clear() { this._data = {}; }
  },
  sessionStorage: {
    _data: { 'apexit_auth_user': JSON.stringify({ username: 'admin', role: 'admin' }) },
    getItem(k) { return this._data[k] || null; },
    setItem(k, v) { this._data[k] = String(v); },
    removeItem(k) { delete this._data[k]; },
    clear() { this._data = {}; }
  },
  fetch: async () => ({ ok: true, json: async () => ({}) }),
  document: {
    getElementById(id) {
      if (!elements[id]) {
        elements[id] = createMockElement(id);
      }
      return elements[id];
    },
    querySelector(sel) { return null; },
    querySelectorAll(sel) { return []; },
    addEventListener() {},
    createElement(tag) { return createMockElement('el_' + Math.random(), tag); },
    body: { appendChild() {} }
  },
  window: null,
  addEventListener() {},
  removeEventListener() {},
  scrollTo() {}
};
sandbox.window = sandbox;

// Load and execute app.js in sandbox
const appCode = fs.readFileSync('app.js', 'utf8');
vm.createContext(sandbox);
vm.runInContext(appCode, sandbox);

const app = sandbox.window.ITAppControllerInstance;
const store = sandbox.window.ITAssetStoreInstance;
const db = require('./database.js');
store.data.assets = db.getAllAssets();
store.data.requirements = db.getRequirements();
const ITApp = sandbox.window.ITApp;

let passed = 0;
let total = 0;
function test(name, fn) {
  total++;
  try {
    fn();
    passed++;
    console.log(`  ✅ PASS: ${name}`);
  } catch (err) {
    console.error(`  ❌ FAIL: ${name} -> ${err.message}`);
  }
}

// Ensure mock elements exist
[
  'assetsSearchInput', 'assetsTypeFilter', 'assetsCpuFilter', 'assetsTeamFilter', 'assetsStatusFilter', 'assetsWorkStatusFilter',
  'assignedUsersSearch', 'assignedUsersTypeFilter', 'assignedUsersTeamFilter', 'assignedUsersWorkStatusFilter', 'assignedUsersCountPill', 'assignedUsersResetFiltersBtn', 'assignedUsersTableBody',
  'nonAssignedSearchInput', 'nonAssignedTypeFilter', 'nonAssignedCpuFilter', 'nonAssignedTeamFilter', 'nonAssignedConditionFilter', 'nonAssignedResetBtn', 'nonAssignedFilteredCountPill', 'nonAssignedCountBadge', 'cardNonAssignedViewTotal', 'cardAvailDesktop', 'cardAvailLaptop',
  'reqSearchInput', 'reqStatusFilter', 'reqPriorityFilter', 'reqCountPill', 'reqResetFiltersBtn', 'requirementsTableBody',
  'teamsDatalist', 'newUserTeamInput', 'reportsTeamFilter', 'editAssetTeam'
].forEach(id => sandbox.document.getElementById(id));

console.log('\n--- [1] POPULATE TEAM DROPDOWNS & DEDUPLICATION ---');
test('populateTeamDropdowns runs and eliminates case-insensitive duplicate teams', () => {
  app.populateTeamDropdowns();
  const filter = sandbox.document.getElementById('assignedUsersTeamFilter');
  const options = filter.querySelectorAll('option').map(o => o.value);
  const lower = options.map(o => o.toLowerCase());
  if (lower.length !== new Set(lower).size) {
    throw new Error(`Duplicate teams found: ${options.join(', ')}`);
  }
});

console.log('\n--- [2] ASSIGNED USERS DIRECTORY DYNAMIC FILTERS ---');
test('Initial assigned users filter state has all assigned assets', () => {
  const filterState = app.updateDependentAssignedUsersFilters();
  if (!filterState) throw new Error('filterState is null');
  if (filterState.finalFilteredList.length === 0) throw new Error('No assigned users found');
  console.log(`    Total assigned users: ${filterState.finalFilteredList.length}`);
});

test('Filtering assigned users by Laptop restricts available teams to only Laptop teams', () => {
  const typeEl = sandbox.document.getElementById('assignedUsersTypeFilter');
  typeEl.value = 'Laptop';
  app.handleAssignedUsersFilterChange('type');

  const teamEl = sandbox.document.getElementById('assignedUsersTeamFilter');
  const availableTeams = teamEl.querySelectorAll('option').map(o => o.value).filter(v => v !== 'all');
  
  // Verify all available teams in dropdown actually have assigned laptops
  const laptopAssets = store.data.assets.filter(a => a.status === 'Assigned' && a.type === 'Laptop');
  const trueLaptopTeams = new Set(laptopAssets.map(a => a.team.trim().toLowerCase()));
  
  for (const t of availableTeams) {
    if (!trueLaptopTeams.has(t.toLowerCase())) {
      throw new Error(`Team "${t}" is in dropdown but has no assigned laptops!`);
    }
  }
  console.log(`    Valid Laptop Teams: ${availableTeams.join(', ')}`);
});

test('Resetting assigned users filters restores default state', () => {
  ITApp.resetAssignedUsersFilters();
  const typeEl = sandbox.document.getElementById('assignedUsersTypeFilter');
  const teamEl = sandbox.document.getElementById('assignedUsersTeamFilter');
  if (typeEl.value !== 'all') throw new Error(`Type filter not reset: ${typeEl.value}`);
  if (teamEl.value !== 'all') throw new Error(`Team filter not reset: ${teamEl.value}`);
});

console.log('\n--- [3] NON-ASSIGNED AVAILABLE POOL DYNAMIC FILTERS ---');
test('Initial available pool filter state has available assets', () => {
  const filterState = app.updateDependentNonAssignedFilters();
  if (!filterState) throw new Error('filterState is null');
  if (filterState.finalFilteredList.length === 0) throw new Error('No available assets found');
  console.log(`    Total available pool: ${filterState.finalFilteredList.length}`);
});

test('Filtering non-assigned pool by Laptop restricts CPU dropdown to unassigned laptop CPUs', () => {
  const typeEl = sandbox.document.getElementById('nonAssignedTypeFilter');
  typeEl.value = 'Laptop';
  app.handleNonAssignedFilterChange('type');

  const cpuEl = sandbox.document.getElementById('nonAssignedCpuFilter');
  const availableCpus = cpuEl.querySelectorAll('option').map(o => o.value).filter(v => v !== 'all');

  const unassignedLaptops = store.data.assets.filter(a =>
    (a.status === 'Non-Assigned' || a.status === 'Available') &&
    a.status !== 'Assigned' &&
    a.status !== 'Retired' &&
    (a.type === 'Laptop' || a.type === 'MacBook')
  );
  const trueCpus = new Set(unassignedLaptops.map(a => sandbox.Utils.normalizeCpu(a.cpu)));

  for (const c of availableCpus) {
    if (!trueCpus.has(c)) {
      throw new Error(`CPU "${c}" is in dropdown but no available laptop has this CPU!`);
    }
  }
  console.log(`    Valid Unassigned Laptop CPUs: ${availableCpus.join(', ')}`);
});

test('Resetting non-assigned filters clears lastNonAssignedFilterChanged and resets inputs', () => {
  ITApp.resetNonAssignedFilters();
  if (app.lastNonAssignedFilterChanged !== null) throw new Error('lastNonAssignedFilterChanged was not cleared');
  const typeEl = sandbox.document.getElementById('nonAssignedTypeFilter');
  const cpuEl = sandbox.document.getElementById('nonAssignedCpuFilter');
  if (typeEl.value !== 'all') throw new Error(`Type filter not reset: ${typeEl.value}`);
  if (cpuEl.value !== 'all') throw new Error(`CPU filter not reset: ${cpuEl.value}`);
});

console.log('\n--- [4] REQUIREMENTS DYNAMIC DEPENDENT FILTERS ---');
test('Initial requirements filter state displays all requirements', () => {
  const filterState = app.updateDependentRequirementsFilters();
  if (!filterState) throw new Error('filterState is null');
  if (filterState.finalFilteredList.length === 0) throw new Error('No requirements found');
  console.log(`    Total requirements: ${filterState.finalFilteredList.length}`);
});

test('Filtering requirements by Status "Purchase Required" restricts Priority dropdown', () => {
  const statEl = sandbox.document.getElementById('reqStatusFilter');
  statEl.value = 'Purchase Required';
  app.handleRequirementsFilterChange('status');

  const prioEl = sandbox.document.getElementById('reqPriorityFilter');
  const availablePrios = prioEl.querySelectorAll('option').map(o => o.value).filter(v => v !== 'all');

  const matchReqs = store.data.requirements.filter(r => r.status === 'Purchase Required');
  const truePrios = new Set(matchReqs.map(r => r.priority));

  for (const p of availablePrios) {
    if (!truePrios.has(p)) {
      throw new Error(`Priority "${p}" is in dropdown but no Purchase Required requirement has it!`);
    }
  }
  console.log(`    Valid Priorities for "Purchase Required": ${availablePrios.join(', ')}`);
});

test('Incompatible priority auto-resets when status changes', () => {
  const prioEl = sandbox.document.getElementById('reqPriorityFilter');
  prioEl.value = 'Urgent';
  app.handleRequirementsFilterChange('priority');

  // Change status to 'Purchase Required' (which only has Medium, not Urgent)
  const statEl = sandbox.document.getElementById('reqStatusFilter');
  statEl.value = 'Completed';
  app.handleRequirementsFilterChange('status');

  // Priority must have auto-reset to 'all' because Urgent has 0 matches with Purchase Required
  if (prioEl.value !== 'all') {
    throw new Error(`Expected priority to auto-reset to 'all', but got "${prioEl.value}"`);
  }
  console.log('    Incompatible priority correctly auto-reset to "all"');
});

test('Resetting requirements filters restores default state', () => {
  ITApp.resetRequirementsFilters();
  if (app.lastReqFilterChanged !== null) throw new Error('lastReqFilterChanged not cleared');
  const statEl = sandbox.document.getElementById('reqStatusFilter');
  const prioEl = sandbox.document.getElementById('reqPriorityFilter');
  if (statEl.value !== 'all') throw new Error(`Status not reset: ${statEl.value}`);
  if (prioEl.value !== 'all') throw new Error(`Priority not reset: ${prioEl.value}`);
});

console.log('\n--- [5] GLOBAL ITApp EXPOSURE VERIFICATION ---');
test('All required methods are exposed on window.ITApp', () => {
  const requiredMethods = [
    'handleAssetFilterChange', 'renderAllAssetsTable',
    'handleAssignedUsersFilterChange', 'renderAssignedUsersTable', 'resetAssignedUsersFilters',
    'handleNonAssignedFilterChange', 'resetNonAssignedFilters',
    'handleRequirementsFilterChange', 'renderRequirementsTable', 'resetRequirementsFilters'
  ];
  for (const m of requiredMethods) {
    if (typeof ITApp[m] !== 'function') {
      throw new Error(`Missing method on window.ITApp: ${m}`);
    }
  }
});

console.log(`\n========================================`);
console.log(`ALL CHECKS COMPLETE: ${passed} / ${total} TESTS PASSED`);
console.log(`========================================\n`);

if (passed === total) {
  process.exit(0);
} else {
  process.exit(1);
}
