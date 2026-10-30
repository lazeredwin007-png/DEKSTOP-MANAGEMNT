const fs = require('fs');
const assert = require('assert');

console.log('================================================================');
console.log('🧪 TESTING NON-ASSIGNED SYSTEM: ONLY NEW SYSTEMS FROM INSTOCK');
console.log('================================================================\n');

// Mock DOM environment
const elements = {};
function createMockElement(id, tagName = 'div') {
  return {
    id,
    tagName: tagName.toUpperCase(),
    value: '',
    style: {},
    innerHTML: '',
    textContent: '',
    children: [],
    dataset: {},
    querySelectorAll: () => [],
    querySelector: () => null,
    addEventListener: () => {},
    closest: () => null,
    focus: () => {},
    classList: { add: () => {}, remove: () => {}, contains: () => false, toggle: () => {} }
  };
}

const mockIds = [
  'nonAssignedTableBody', 'cardNonAssignedViewTotal', 'cardAvailDesktop', 'cardAvailLaptop',
  'cardAvailDesktopPill', 'cardAvailLaptopPill', 'nonAssignedFilteredCountPill', 'nonAssignedCountBadge',
  'nonAssignedSearchInput', 'nonAssignedTypeFilter', 'nonAssignedCpuFilter', 'nonAssignedTeamFilter',
  'nonAssignedConditionFilter', 'modalViewAsset', 'viewAssetModalDialog', 'viewAssetModalMeta',
  'viewAssetModalBody', 'viewAssetEditModalBtn', 'viewAssetHistoryModalBtn',
  'modalInstockEntry', 'instockEditId', 'instockAssetId', 'instockModalTitle', 'instockComponentType',
  'btnSaveInstockEntry', 'cardNonAssigned', 'cardNonAssignedPill',
  'cardTotalAssets', 'cardTotalAssigned', 'cardTotalSystems', 'cardAvailableSystems',
  'cardAssignedSystems', 'cardDesktops', 'cardLaptops', 'cardFleetTypePill', 'cardAssignedFleetPill',
  'ribbonTotalSystems', 'ribbonAvailableSystems', 'ribbonAssignedSystems', 'cardSwapSystem',
  'cardPendingRequirements', 'cardWarrantyExpiring'
];

mockIds.forEach(id => {
  elements[id] = createMockElement(id, id.includes('Filter') ? 'select' : id.includes('Input') ? 'input' : 'div');
});

global.document = {
  getElementById: (id) => elements[id] || null,
  querySelector: (sel) => null,
  querySelectorAll: () => [],
  createElement: (tag) => createMockElement(`dyn_${Math.random()}`, tag),
  addEventListener: () => {},
  removeEventListener: () => {}
};

global.window = {
  ITApp: {},
  location: { hash: '#non-assigned', pathname: '/', protocol: 'http:', origin: 'http://localhost:3000' },
  history: { pushState: () => {}, replaceState: () => {}, state: { view: 'non-assigned' } },
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

global.fetch = async () => ({ ok: true, status: 200, json: async () => ([]) });

// Load app.js
const appCode = fs.readFileSync('app.js', 'utf8');
eval(appCode);

const app = window.ITAppControllerInstance;
const store = window.ITAssetStoreInstance;
assert(app, 'AppController must exist');
assert(store, 'AssetStore must exist');

let testsPassed = 0;

// Setup inventory with 3 distinct types of records:
// Record 1: Old returned employee desktop (from Excel sheet, user exited) -> SHOULD BE EXCLUDED
// Record 2: Standalone Instock component (RAM, Available) -> SHOULD BE EXCLUDED
// Record 3: New System created in Instock (Desktop, Available) -> MUST BE INCLUDED
// Record 4: New System created in Instock (Laptop, Available) -> MUST BE INCLUDED
// Record 5: New System created in Instock (Assigned to employee) -> SHOULD BE EXCLUDED from non-assigned

store.data.assets = [
  {
    id: 'PIX_DSK_OLD_RETURNED',
    type: 'Desktop',
    cpu: 'Intel Core i5-8400',
    ram: '8GB DDR4',
    status: 'Non-Assigned',
    oldUsername: 'Dinesh Kumar',
    workStatus: 'User Exit',
    userExitDate: '2026-09-15',
    condition: 'Good',
    remark: 'Returned by employee upon resignation'
  },
  {
    id: 'PIX_DSK_NEW_INSTOCK_01',
    type: 'Desktop',
    cpu: 'Intel Core i7-13700',
    ram: '32GB DDR5',
    ssd: '1TB NVMe',
    status: 'Non-Assigned',
    condition: 'Brand New',
    remark: 'New System Configuration'
  },
  {
    id: 'PIX_LAP_NEW_INSTOCK_02',
    type: 'Laptop',
    cpu: 'Apple M3 Pro',
    ram: '18GB',
    ssd: '512GB',
    status: 'Available',
    condition: 'Brand New',
    remark: 'New System Configuration'
  },
  {
    id: 'PIX_DSK_NEW_ASSIGNED',
    type: 'Desktop',
    cpu: 'AMD Ryzen 7 7800X3D',
    ram: '32GB',
    status: 'Assigned',
    user: 'Karthik Raja',
    condition: 'Brand New',
    remark: 'New System Configuration'
  }
];

store.data.instockHardware = [
  {
    id: 'PIX_DSK_NEW_INSTOCK_01',
    component_type: 'NEW SYSTEM',
    model: 'Intel Core i7-13700 • 32GB DDR5',
    status: 'Available'
  },
  {
    id: 'PIX_LAP_NEW_INSTOCK_02',
    component_type: 'NEW SYSTEM',
    model: 'Apple M3 Pro • 18GB',
    status: 'Available'
  },
  {
    id: 'PIX_DSK_NEW_ASSIGNED',
    component_type: 'NEW SYSTEM',
    model: 'AMD Ryzen 7 7800X3D • 32GB',
    status: 'Assigned',
    assigned_user: 'Karthik Raja'
  },
  {
    id: 'STK-RAM-999',
    component_type: 'RAM',
    model: 'Corsair Vengeance 16GB',
    status: 'Available'
  },
  {
    id: 'STK-SSD-888',
    component_type: 'SSD',
    model: 'Samsung 990 Pro 1TB',
    status: 'Available'
  }
];

// Test 1: getNonAssignedNewSystems returns only the 2 available New Systems
console.log('Test 1: getNonAssignedNewSystems() filtering');
const nonAssignedNewSys = app.getNonAssignedNewSystems();
console.log('Returned IDs:', nonAssignedNewSys.map(s => s.id));

assert.strictEqual(nonAssignedNewSys.length, 2, `Expected exactly 2 systems, got ${nonAssignedNewSys.length}`);
assert(nonAssignedNewSys.some(s => s.id === 'PIX_DSK_NEW_INSTOCK_01'), 'Must include PIX_DSK_NEW_INSTOCK_01');
assert(nonAssignedNewSys.some(s => s.id === 'PIX_LAP_NEW_INSTOCK_02'), 'Must include PIX_LAP_NEW_INSTOCK_02');

// Exclusions verification
assert(!nonAssignedNewSys.some(s => s.id === 'PIX_DSK_OLD_RETURNED'), 'Must EXCLUDE old returned/used system PIX_DSK_OLD_RETURNED');
assert(!nonAssignedNewSys.some(s => s.id === 'PIX_DSK_NEW_ASSIGNED'), 'Must EXCLUDE assigned new system PIX_DSK_NEW_ASSIGNED');
assert(!nonAssignedNewSys.some(s => s.id === 'STK-RAM-999'), 'Must EXCLUDE spare RAM component STK-RAM-999');
assert(!nonAssignedNewSys.some(s => s.id === 'STK-SSD-888'), 'Must EXCLUDE spare SSD component STK-SSD-888');
console.log('✅ PASS: Only available New Systems from Instock are returned (old returned systems and spare components excluded).');
testsPassed++;

// Test 2: renderNonAssignedView displays only the 2 New Systems in the UI
console.log('\nTest 2: renderNonAssignedView() UI rendering');
app.renderNonAssignedView();
const tableHtml = elements['nonAssignedTableBody'].innerHTML;

assert(tableHtml.includes('PIX_DSK_NEW_INSTOCK_01'), 'Table must contain PIX_DSK_NEW_INSTOCK_01');
assert(tableHtml.includes('PIX_LAP_NEW_INSTOCK_02'), 'Table must contain PIX_LAP_NEW_INSTOCK_02');
assert(!tableHtml.includes('PIX_DSK_OLD_RETURNED'), 'Table must NOT contain PIX_DSK_OLD_RETURNED');
assert(!tableHtml.includes('PIX_DSK_NEW_ASSIGNED'), 'Table must NOT contain PIX_DSK_NEW_ASSIGNED');
assert(!tableHtml.includes('STK-RAM-999'), 'Table must NOT contain STK-RAM-999');

// Counter pills
assert.strictEqual(elements['cardNonAssignedViewTotal'].textContent, 2, 'Total non-assigned counter must be 2');
assert.strictEqual(elements['cardAvailDesktop'].textContent, 1, 'Desktop counter must be 1');
assert.strictEqual(elements['cardAvailLaptop'].textContent, 1, 'Laptop counter must be 1');
console.log('✅ PASS: UI table and counter cards display only New Systems from Instock.');
testsPassed++;

// Test 3: Action buttons are rendered on New Systems
console.log('\nTest 3: Action buttons on New System rows');
assert(tableHtml.includes("window.ITApp.viewAvailableSystem('PIX_DSK_NEW_INSTOCK_01')"), 'View action exists on PIX_DSK_NEW_INSTOCK_01');
assert(tableHtml.includes("window.ITApp.editAvailableSystem('PIX_DSK_NEW_INSTOCK_01')"), 'Edit action exists on PIX_DSK_NEW_INSTOCK_01');
assert(tableHtml.includes("window.ITApp.deleteAvailableSystem('PIX_DSK_NEW_INSTOCK_01')"), 'Delete action exists on PIX_DSK_NEW_INSTOCK_01');
console.log('✅ PASS: All 3 actions (Eye View, Edit, Delete) present on New System rows.');
testsPassed++;

console.log('\n================================================================');
console.log(`🏁 ALL ${testsPassed} TESTS PASSED!`);
console.log('================================================================\n');
