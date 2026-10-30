/**
 * test_unified_non_assigned_pool_and_user_exit.js
 * Comprehensive automated test suite for:
 * PROMPT — UNIFIED NON-ASSIGNED AVAILABLE POOL & USER EXIT INVENTORY
 */

const assert = require('assert');
const fs = require('fs');

console.log('================================================================');
console.log('🧪 TESTING UNIFIED NON-ASSIGNED AVAILABLE POOL & USER EXIT INVENTORY');
console.log('================================================================\n');

// 1. Setup DOM and ITApp environment mock
const elements = {};
function createMockElement(id, tagName = 'div') {
  const el = {
    id,
    tagName: tagName.toUpperCase(),
    value: '',
    style: {},
    _innerHTML: '',
    textContent: '',
    children: [],
    dataset: {},
    options: [],
    querySelectorAll: () => [],
    querySelector: () => null,
    addEventListener: () => {},
    removeEventListener: () => {},
    closest: () => null,
    focus: () => {},
    reset: () => {},
    remove: () => {},
    appendChild: (c) => c,
    removeChild: (c) => c,
    classList: { add: () => {}, remove: () => {}, contains: () => false, toggle: () => {} }
  };
  Object.defineProperty(el, 'innerHTML', {
    get() { return this._innerHTML; },
    set(html) {
      this._innerHTML = html;
      if (html && typeof html === 'string' && html.includes('<option')) {
        const re = /value=["']([^"']*)["']/g;
        let m;
        this.options = [];
        while ((m = re.exec(html)) !== null) {
          this.options.push({ value: m[1] });
        }
      }
    }
  });
  return el;
}

const mockIds = [
  'instockTotalCount', 'instockAvailableCount', 'instockNonAssignedCount',
  'instockReadyCount', 'instockAssignedCount', 'instockMaintenanceCount',
  'instockRequestsCount', 'instockCategoryCardsContainer',
  'instockCatCard_all', 'instockCatCount_all',
  'instockCatCard_NEW_SYSTEM', 'instockCatCount_NEW_SYSTEM_total', 'instockCatCount_NEW_SYSTEM', 'instockCatCount_NEW_SYSTEM_av', 'instockCatCount_NEW_SYSTEM_ass',
  'instockCatCard_CPU', 'instockCatCount_CPU_total', 'instockCatCount_CPU', 'instockCatCount_CPU_av', 'instockCatCount_CPU_ass',
  'instockCatCard_RAM', 'instockCatCount_RAM_total', 'instockCatCount_RAM', 'instockCatCount_RAM_av', 'instockCatCount_RAM_ass',
  'instockCatCard_SSD', 'instockCatCount_SSD_total', 'instockCatCount_SSD', 'instockCatCount_SSD_av', 'instockCatCount_SSD_ass',
  'instockCatCard_MONITOR', 'instockCatCount_MONITOR_total', 'instockCatCount_MONITOR', 'instockCatCount_MONITOR_av', 'instockCatCount_MONITOR_ass',
  'instockCatCard_SMPS', 'instockCatCount_SMPS_total', 'instockCatCount_SMPS', 'instockCatCount_SMPS_av', 'instockCatCount_SMPS_ass',
  'instockCatCard_OTHER', 'instockCatCount_OTHER_total', 'instockCatCount_OTHER', 'instockCatCount_OTHER_av', 'instockCatCount_OTHER_ass',
  'instockCatCard_MOUSE', 'instockCatCount_MOUSE_total', 'instockCatCount_MOUSE', 'instockCatCount_MOUSE_av', 'instockCatCount_MOUSE_ass',
  'instockCatCard_KEYBOARD', 'instockCatCount_KEYBOARD_total', 'instockCatCount_KEYBOARD', 'instockCatCount_KEYBOARD_av', 'instockCatCount_KEYBOARD_ass',
  'instockInventorySearch', 'instockInventoryStatusFilter', 'instockInventoryCategoryFilter',
  'instockFilterDateFrom', 'instockFilterDateTo', 'instockInventoryTable', 'instockInventoryTableBody',
  'instockInventoryCountBadge', 'instockPaginationInfo', 'instockPaginationControls', 'instockPageSizeSelect',
  'swapOldUserSelect', 'swapOldAssetDatalist', 'swapOldAssetId', 'swapOldUsername', 'swapOldTeam', 'swapOldDetails',
  'swapNewAssetId', 'swapNewUserInput', 'swapNewTeam', 'swapAssetTypeSelect', 'swapCpu', 'swapRam', 'swapHdd', 'swapSsd', 'swapMonitor',
  'swapAssignedDate', 'swapReason', 'swapRemark', 'swapAutoFillBanner', 'swapSystemForm',
  'btnFilterSwapPoolAll', 'btnFilterSwapPoolInStock', 'btnFilterSwapPoolUserExit',
  'nonAssignedTableBody', 'cardNonAssignedViewTotal', 'cardAvailDesktop', 'cardAvailLaptop',
  'cardAvailDesktopPill', 'cardAvailLaptopPill', 'nonAssignedCountBadge',
  'nonAssignedSearchInput', 'nonAssignedTypeFilter', 'nonAssignedCpuFilter', 'nonAssignedTeamFilter', 'nonAssignedConditionFilter',
  'allAssetsTableBody', 'assetsFilterCountBadge', 'assetsFilterBreakdownText', 'assetsToolbarCountPill', 'assetsResetFiltersBtn',
  'assetsSearchInput', 'assetsTypeFilter', 'assetsCpuFilter', 'assetsTeamFilter', 'assetsStatusFilter', 'assetsWorkStatusFilter',
  'themeToggleBtn', 'headerThemeToggle', 'toggleDarkModeBtn'
];

mockIds.forEach(id => {
  elements[id] = createMockElement(id, id.includes('Filter') || id.includes('Select') ? 'select' : id.includes('Search') || id.includes('Input') ? 'input' : 'div');
});

global.document = {
  getElementById: (id) => {
    if (!elements[id]) {
      elements[id] = createMockElement(id);
    }
    return elements[id];
  },
  querySelector: (sel) => createMockElement(`sel_${Math.random()}`),
  querySelectorAll: (sel) => [],
  createElement: (tag) => createMockElement(`dyn_${Math.random()}`, tag),
  addEventListener: () => {},
  removeEventListener: () => {}
};

global.window = {
  ITApp: {},
  location: { hash: '#instock', pathname: '/', protocol: 'http:', origin: 'http://localhost:3000' },
  history: { pushState: () => {}, replaceState: () => {}, state: { view: 'instock' } },
  addEventListener: () => {},
  removeEventListener: () => {}
};

global.sessionStorage = {
  getItem: (k) => k === 'apexit_auth_user' ? JSON.stringify({ username: 'admin', role: 'admin' }) : null,
  setItem: () => {},
  removeItem: () => {}
};

global.localStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {}
};

const networkCalls = [];
global.fetch = async (url, options = {}) => {
  networkCalls.push({ url, method: options.method || 'GET', body: options.body ? JSON.parse(options.body) : null });
  if (options.method === 'DELETE' || options.method === 'PUT' || options.method === 'POST') {
    return { ok: true, status: 200, json: async () => ({ success: true }) };
  }
  return { ok: true, status: 200, json: async () => ([]) };
};

// Load app.js in sandbox
const appCode = fs.readFileSync('app.js', 'utf8');
eval(appCode);

const app = window.ITAppControllerInstance || window.ITApp;
const store = window.ITAssetStoreInstance;
store.isServerConnected = true;

// Setup test database state
store.data = {
  instockHardware: [
    {
      id: 'PIX_DSK_41',
      component_type: 'NEW SYSTEM',
      model: 'Intel Core i7-13700 3.4GHz • 8GB DDR4',
      spec: 'SSD: 512GB SSD | HDD: None | Mon: Dell 24" | SMPS: 650W',
      serial_number: 'SN-NEW-41',
      purchase_date: '2026-10-25',
      status: 'Available',
      assigned_user: '',
      remark: 'New System Configuration'
    },
    {
      id: 'STK-CPU-103',
      component_type: 'CPU',
      model: 'Intel Core i5-11400',
      status: 'Under Maintenance',
      assigned_user: ''
    },
    {
      id: 'STK-SMPS-403',
      component_type: 'SMPS',
      model: 'Corsair CV550',
      status: 'Under Maintenance',
      assigned_user: ''
    }
  ],
  assets: [
    {
      id: 'PIX_DSK_01',
      type: 'Desktop',
      user: 'Sundar Pichai',
      team: 'SYSTEM ADMIN',
      cpu: 'Intel Core i7-13700',
      ram: '32GB DDR5',
      ssd: '512GB SSD',
      hdd: 'None',
      status: 'Assigned',
      workStatus: 'Currently Working',
      oldUsername: 'None'
    },
    {
      id: 'PIX_DSK_02',
      type: 'Desktop',
      user: '',
      team: 'MOBIL TEAM',
      cpu: 'Intel Core i5-10400',
      ram: '16GB DDR4',
      ssd: '256GB SSD',
      hdd: '1TB HDD',
      serialNumber: 'SN-DSK-02',
      status: 'Non-Assigned',
      workStatus: 'User Exit',
      userExitDate: '2026-10-07',
      oldUsername: 'Siva Ganesh S',
      condition: 'Good'
    },
    {
      id: 'PIX_DSK_03',
      type: 'Desktop',
      user: '',
      team: 'PHP',
      cpu: 'AMD Ryzen 5 5600G',
      ram: '16GB DDR4',
      ssd: '512GB SSD',
      hdd: 'None',
      serialNumber: 'SN-DSK-03',
      status: 'Non-Assigned',
      workStatus: 'User Exit',
      userExitDate: '2026-10-09',
      oldUsername: 'Gomez Edwin Lazer Y',
      condition: 'Good'
    },
    {
      id: 'PIX_DSK_41',
      type: 'Desktop',
      user: '',
      team: '',
      cpu: 'Intel Core i7-13700 3.4GHz',
      ram: '8GB DDR4',
      ssd: '512GB SSD',
      hdd: 'None',
      serialNumber: 'SN-NEW-41',
      status: 'Non-Assigned',
      workStatus: 'Currently Working',
      condition: 'Brand New',
      remark: 'New System Configuration'
    },
    {
      id: 'PIX_LPT_01',
      type: 'Laptop',
      user: 'Priya Sharma',
      team: 'AI',
      cpu: 'Apple M2 Pro',
      ram: '32GB',
      ssd: '1TB SSD',
      hdd: 'None',
      status: 'Assigned',
      workStatus: 'Currently Working',
      oldUsername: ''
    }
  ],
  users: [
    { id: 'USR-01', name: 'Sundar Pichai', team: 'SYSTEM ADMIN', assetId: 'PIX_DSK_01', status: 'Assigned' },
    { id: 'USR-02', name: 'Priya Sharma', team: 'AI', assetId: 'PIX_LPT_01', status: 'Assigned' }
  ],
  swapLogs: [],
  activityLogs: []
};

// -------------------------------------------------------------
// Test 1: Non-Assigned Available Pool includes genuine unassigned Desktops & Laptops + New Systems
// -------------------------------------------------------------
console.log('--- Test 1: Unified Non-Assigned Available Pool ---');
const availablePool = app.getNonAssignedPoolAssets();
console.log('Available Pool Items:', availablePool.map(a => a.id));

assert(availablePool.some(a => a.id === 'PIX_DSK_41'), 'New System PIX_DSK_41 must be in Available Pool');
assert(availablePool.some(a => a.id === 'PIX_DSK_02'), 'User Exit Desktop PIX_DSK_02 must be in Available Pool');
assert(availablePool.some(a => a.id === 'PIX_DSK_03'), 'User Exit Desktop PIX_DSK_03 must be in Available Pool');
assert(!availablePool.some(a => a.id === 'PIX_DSK_01'), 'Assigned Desktop PIX_DSK_01 must NOT be in Available Pool');
assert(!availablePool.some(a => a.id === 'PIX_LPT_01'), 'Assigned Laptop PIX_LPT_01 must NOT be in Available Pool');
assert(!availablePool.some(a => a.id === 'STK-CPU-103'), 'Hardware component STK-CPU-103 must NOT be in Available Pool');
assert(!availablePool.some(a => a.id === 'STK-SMPS-403'), 'Hardware component STK-SMPS-403 must NOT be in Available Pool');

assert.strictEqual(availablePool.length, 3, 'Available pool must have exactly 3 systems without duplicates');
console.log('✅ PASS: Available Pool contains New Systems and unassigned Desktops/Laptops without duplicates.\n');

// -------------------------------------------------------------
// Test 2: Non-Assigned View rendering and Counters
// -------------------------------------------------------------
console.log('--- Test 2: Non-Assigned View Rendering & Metric Counters ---');
app.renderNonAssignedView();

const cardTotal = document.getElementById('cardNonAssignedViewTotal').textContent;
const cardDsk = document.getElementById('cardAvailDesktop').textContent;
const cardLpt = document.getElementById('cardAvailLaptop').textContent;
const countBadge = document.getElementById('nonAssignedCountBadge').textContent;

console.log('cardNonAssignedViewTotal:', cardTotal);
console.log('cardAvailDesktop:', cardDsk);
console.log('cardAvailLaptop:', cardLpt);
console.log('nonAssignedCountBadge:', countBadge);

assert.strictEqual(parseInt(cardTotal, 10), 3, 'cardNonAssignedViewTotal must be 3');
assert.strictEqual(parseInt(cardDsk, 10), 3, 'cardAvailDesktop must be 3');
assert.strictEqual(parseInt(cardLpt, 10), 0, 'cardAvailLaptop must be 0');
assert(countBadge.includes('3 Available'), 'Badge must show 3 Available');

const tableHtml = document.getElementById('nonAssignedTableBody').innerHTML;
assert(tableHtml.includes('PIX_DSK_41'), 'Table must render PIX_DSK_41');
assert(tableHtml.includes('PIX_DSK_02'), 'Table must render PIX_DSK_02');
assert(tableHtml.includes('PIX_DSK_03'), 'Table must render PIX_DSK_03');
assert(tableHtml.includes('User Exit'), 'Table must render User Exit badge');
assert(tableHtml.includes('New System'), 'Table must render New System badge for PIX_DSK_41 instead of Currently Working');
assert(tableHtml.includes('Siva Ganesh S'), 'Table must render previous user Siva Ganesh S');
console.log('✅ PASS: Non-Assigned view correctly renders all 3 systems with User Exit & New System badges & counters.\n');

// -------------------------------------------------------------
// Test 3: Desktop Workstations & Laptop Views EXCLUDE Non-Assigned systems
// -------------------------------------------------------------
console.log('--- Test 3: Desktop Workstations & Laptop Views exclude Non-Assigned systems ---');
app.currentView = 'desktop';
const dskRes = app.updateDependentAssetFilters();
const dskList = dskRes.finalFilteredList;
console.log('Desktop Workstations Count:', dskList.length, dskList.map(a => a.id));

assert(dskList.some(a => a.id === 'PIX_DSK_01'), 'Assigned desktop must be in Desktop Workstations');
assert(!dskList.some(a => a.id === 'PIX_DSK_02'), 'Non-Assigned desktop PIX_DSK_02 must NOT be in Desktop Workstations');
assert(!dskList.some(a => a.id === 'PIX_DSK_03'), 'Non-Assigned desktop PIX_DSK_03 must NOT be in Desktop Workstations');
assert(!dskList.some(a => a.id === 'PIX_DSK_41'), 'Non-Assigned New System PIX_DSK_41 must NOT be in Desktop Workstations');
assert(!dskList.some(a => a.id === 'PIX_LPT_01'), 'Laptop must NOT be in Desktop Workstations');
assert.strictEqual(dskList.length, 1, 'Desktop Workstations must contain only 1 assigned desktop');

app.currentView = 'laptop';
const lptRes = app.updateDependentAssetFilters();
const lptList = lptRes.finalFilteredList;
console.log('Laptop Fleet Count:', lptList.length, lptList.map(a => a.id));
assert(lptList.some(a => a.id === 'PIX_LPT_01'), 'Assigned Laptop PIX_LPT_01 must be in Laptops view');
assert(!lptList.some(a => a.id === 'PIX_DSK_01'), 'Desktop must NOT be in Laptops view');
assert.strictEqual(lptList.length, 1, 'Laptop Fleet must contain only assigned laptops');

app.currentView = 'all-assets';
const allRes = app.updateDependentAssetFilters();
assert.strictEqual(allRes.finalFilteredList.length, 5, 'All IT Assets view must show all 5 genuine assets (both Assigned and Non-Assigned)');
console.log('✅ PASS: Desktop Workstations & Laptops strictly show assigned systems (Non-Assigned excluded); All IT Assets includes all systems.\n');

// -------------------------------------------------------------
// Test 4: System Swap Facility Dropdown
// -------------------------------------------------------------
console.log('--- Test 4: System Swap Facility Dropdown Separation ---');
app.populateSwapOldUserSelect('all');
const swapSelectHtml = document.getElementById('swapOldUserSelect').innerHTML;

assert(swapSelectHtml.includes('In-Stock / Available Pool'), 'Must include In-Stock optgroup');
assert(swapSelectHtml.includes('User Exit Systems'), 'Must include User Exit optgroup');
assert(swapSelectHtml.includes('PIX_DSK_41'), 'In-Stock optgroup must contain PIX_DSK_41');
assert(swapSelectHtml.includes('PIX_DSK_02'), 'User Exit optgroup must contain PIX_DSK_02');
assert(swapSelectHtml.includes('PIX_DSK_03'), 'User Exit optgroup must contain PIX_DSK_03');
assert(!swapSelectHtml.includes('PIX_DSK_01'), 'Currently assigned systems must NOT appear in swap dropdown');
assert(!swapSelectHtml.includes('PIX_LPT_01'), 'Currently assigned systems must NOT appear in swap dropdown');
console.log('✅ PASS: System Swap Facility dropdown separates In-Stock and User Exit pools without assigned systems.\n');

// -------------------------------------------------------------
// Test 5: System Swap Execution — Reallocate User Exit System without duplication
// -------------------------------------------------------------
console.log('--- Test 5: Reallocating User Exit System (PIX_DSK_02) via Swap Form ---');
const prevAssetCount = store.data.assets.length;

// Create FormData mock for swapping/reallocating PIX_DSK_02 to Arun Kumar
const formData = new Map();
formData.set('swapOldAssetId', 'PIX_DSK_02');
formData.set('swapOldUsername', 'Siva Ganesh S');
formData.set('swapNewUser', 'Arun Kumar');
formData.set('swapNewTeam', 'PHP');
formData.set('swapAssetType', 'Desktop');
formData.set('swapNewAssetId', 'PIX_DSK_02'); // Same asset reallocation
formData.set('swapCpu', 'Intel Core i5-10400');
formData.set('swapRam', '16GB DDR4');
formData.set('swapSsd', '256GB SSD');
formData.set('swapHdd', '1TB HDD');
formData.set('swapMonitor', 'Dell 24"');
formData.set('swapAssignedDate', '2026-10-28');
formData.set('swapReason', 'Reallocation to new PHP developer');
formData.set('swapRemark', 'Reallocated from User Exit pool');

app.handleConfirmSwap(formData);

assert.strictEqual(store.data.assets.length, prevAssetCount, 'Must NOT create duplicate asset record!');
const reallocated = store.data.assets.find(a => a.id === 'PIX_DSK_02');
assert.strictEqual(reallocated.user, 'Arun Kumar', 'User must be updated to Arun Kumar');
assert.strictEqual(reallocated.team, 'PHP', 'Team must be updated to PHP');
assert.strictEqual(reallocated.status, 'Assigned', 'Status must be updated to Assigned');
assert.strictEqual(reallocated.workStatus, 'Currently Working', 'Work status must be Currently Working');
assert.strictEqual(reallocated.oldUsername, 'Siva Ganesh S', 'Previous user must be preserved as Siva Ganesh S');
assert.strictEqual(reallocated.userExitDate, '', 'userExitDate must be cleared upon active reallocation');

// Check that PIX_DSK_02 is now removed from Available Pool
const newPool = app.getNonAssignedPoolAssets();
assert(!newPool.some(a => a.id === 'PIX_DSK_02'), 'PIX_DSK_02 must no longer be in Available Pool');
assert.strictEqual(newPool.length, 2, 'Available pool must now be 2 systems');

// Check that network calls were dispatched for persistence
assert(networkCalls.some(c => c.url.includes('/api/assets/PIX_DSK_02') && c.method === 'PUT'), 'Must persist asset update to backend');
assert(networkCalls.some(c => c.url.includes('/api/swap-logs') && c.method === 'POST'), 'Must persist swap log to backend');

console.log('✅ PASS: Reallocation successfully updated existing record without duplication, cleared exit date, and synced to backend.\n');

console.log('================================================================');
console.log('🏁 RESULT: ALL 5 TEST SUITES PASSED PERFECTLY!');
console.log('================================================================');
process.exit(0);
