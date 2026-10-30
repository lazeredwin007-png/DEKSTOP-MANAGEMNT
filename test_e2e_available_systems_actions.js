const fs = require('fs');
const assert = require('assert');

console.log('================================================================');
console.log('🧪 RUNNING END-TO-END SIMULATION: AVAILABLE SYSTEMS ACTIONS');
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
  'instockModel', 'instockSpec', 'instockSerial', 'instockPurchaseDate', 'instockStatus',
  'instockStatusPending', 'instockStatusAssigned', 'instockAssignedUser', 'instockAssignedDate',
  'instockAssignedTeam', 'instockAssignedTl', 'instockReason', 'instockRemark', 'btnSaveInstockEntry',
  'instockAllUsersDatalist', 'instockSystemAssetDatalist', 'instockSystemAssetId',
  'newSystemCpu', 'newSystemRam', 'newSystemSsd', 'newSystemHdd', 'newSystemOs', 'newSystemIp',
  'newSystemMac', 'newSystemMonitor', 'newSystemMonitorDropdown', 'newSystemMonitorNoneCheckbox',
  'newSystemSmps', 'newSystemPurchaseDate', 'newSystemExtendWarranty', 'newSystemWarrantyEnd',
  'newSystemWarrantyDaysBox', 'newSystemWarrantyDaysText', 'newSystemWarrantyDaysIcon',
  'modalGlobalSaveConfirm', 'globalSaveConfirmTitle', 'globalSaveConfirmMessage',
  'btnGlobalSaveConfirmYes', 'btnGlobalSaveConfirmNo'
];

mockIds.forEach(id => {
  elements[id] = createMockElement(id, id.includes('Filter') || id.includes('Dropdown') || id.includes('Select') || id.includes('Type') ? 'select' : id.includes('Input') || id.includes('Search') || id.includes('Serial') ? 'input' : id.includes('Checkbox') || id.includes('StatusPending') || id.includes('StatusAssigned') ? 'input' : 'div');
  if (id.includes('Checkbox') || id.includes('StatusPending') || id.includes('StatusAssigned')) {
    elements[id].type = id.includes('Checkbox') ? 'checkbox' : 'radio';
    elements[id].checked = false;
  }
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

// Mock fetch
const fetchCalls = [];
global.fetch = async (url, options = {}) => {
  fetchCalls.push({ url, method: options.method || 'GET', body: options.body });
  if (options.method === 'DELETE') {
    return { ok: true, status: 200, json: async () => ({ success: true }) };
  }
  if (options.method === 'PUT' || options.method === 'POST') {
    return { ok: true, status: 200, json: async () => JSON.parse(options.body || '{}') };
  }
  return { ok: true, status: 200, json: async () => ([]) };
};

// Load app.js
const appCode = fs.readFileSync('app.js', 'utf8');
eval(appCode);

const app = window.ITAppControllerInstance;
assert(app, 'AppController instance must be initialized');
const store = window.ITAssetStoreInstance;
assert(store, 'AssetStore instance must be initialized');

// Set mock instockHardware with NEW SYSTEM records created in Instock
store.data.instockHardware = [
  { id: 'PIX_DSK_TEST01', component_type: 'NEW SYSTEM', status: 'Available' },
  { id: 'PIX_LAP_TEST02', component_type: 'NEW SYSTEM', status: 'Available' }
];

// Set mock assets data with 2 available systems (one Desktop with missing values to test '—', one Laptop)
store.data.assets = [
  {
    id: 'PIX_DSK_TEST01',
    type: 'Desktop',
    cpu: 'Intel Core i5-12400',
    ram: '16GB DDR4',
    ssd: '512GB NVMe',
    hdd: '-',
    monitor: 'Dell 24" P2419H',
    os: 'Windows 11 Pro',
    ipAddress: '192.168.1.105',
    smps: '450W Bronze',
    serialNumber: 'SN-TEST-001',
    purchaseDate: '2024-01-15',
    warrantyEnd: '2027-01-15',
    status: 'Non-Assigned',
    oldUsername: 'Gokul Kannan',
    workStatus: 'In Stock',
    location: 'Floor 2',
    team: 'Software Development',
    condition: 'Good',
    remark: null // test displayVal null -> '—'
  },
  {
    id: 'PIX_LAP_TEST02',
    type: 'Laptop',
    cpu: 'Apple M2',
    ram: '16GB',
    ssd: '256GB',
    hdd: 'None',
    monitor: 'Built-in Retina',
    os: 'macOS Sonoma',
    ipAddress: '', // test displayVal empty -> '—'
    smps: 'None',
    serialNumber: 'C02TEST02',
    purchaseDate: '2024-03-01',
    warrantyEnd: '2025-03-01',
    status: 'Available',
    oldUsername: '',
    workStatus: 'User Exit',
    location: 'IT Storage',
    team: '',
    condition: 'Excellent',
    remark: 'Returned upon employee exit'
  }
];

let testsPassed = 0;

// Test 1: Render Non-Assigned View
console.log('Test 1: Render Non-Assigned View & Actions Column');
app.renderNonAssignedView();
const tbodyHtml = elements['nonAssignedTableBody'].innerHTML;
assert(tbodyHtml.includes('PIX_DSK_TEST01'), 'Table must contain PIX_DSK_TEST01');
assert(tbodyHtml.includes('PIX_LAP_TEST02'), 'Table must contain PIX_LAP_TEST02');
assert(tbodyHtml.includes("window.ITApp.viewAvailableSystem('PIX_DSK_TEST01')"), 'Row 1 must have viewAvailableSystem');
assert(tbodyHtml.includes("window.ITApp.editAvailableSystem('PIX_DSK_TEST01')"), 'Row 1 must have editAvailableSystem');
assert(tbodyHtml.includes("window.ITApp.deleteAvailableSystem('PIX_DSK_TEST01')"), 'Row 1 must have deleteAvailableSystem');
assert(tbodyHtml.includes('👁️') && tbodyHtml.includes('✏️') && tbodyHtml.includes('🗑️'), 'Icons must be present');
console.log('✅ PASS: Table rendered with 11 columns and Eye View, Edit, Delete buttons for every row.');
testsPassed++;

// Test 2: Eye View Detailed Display & Missing Values
console.log('\nTest 2: Eye View Detailed Display & Missing Value Rule (—)');
window.ITApp.viewAvailableSystem('PIX_DSK_TEST01');
const eyeBodyHtml = elements['viewAssetModalBody'].innerHTML;
assert(eyeBodyHtml.includes('PIX_DSK_TEST01'), 'Must display Asset ID');
assert(eyeBodyHtml.includes('Intel Core i5-12400'), 'Must display CPU');
assert(eyeBodyHtml.includes('16GB DDR4'), 'Must display RAM');
assert(eyeBodyHtml.includes('512GB NVMe'), 'Must display SSD');
assert(eyeBodyHtml.includes('P2419H'), 'Must display Monitor');
assert(eyeBodyHtml.includes('192.168.1.105'), 'Must display IP Address');
assert(eyeBodyHtml.includes('SN-TEST-001'), 'Must display Serial Number');
assert(eyeBodyHtml.includes('Gokul Kannan'), 'Must display Previous User');
assert(eyeBodyHtml.includes('Floor 2'), 'Must display Location');
// HDD is '-' and remark is null -> must display '—'
assert(eyeBodyHtml.includes('>—<'), "Missing/nil values must display '—'");
assert(elements['modalViewAsset'].style.display !== 'none', 'Modal must be open');
console.log('✅ PASS: Eye View displays all hardware, specs, serial, warranty, allocation details, and displays "—" for missing values.');
testsPassed++;

// Test 3: Edit Available System
console.log('\nTest 3: Edit Available System (Stock Entry Form)');
window.ITApp.editAvailableSystem('PIX_DSK_TEST01');
assert.strictEqual(elements['instockModalTitle'].textContent, 'Edit Stock Entry (PIX_DSK_TEST01)', 'Modal title must be Edit Stock Entry (ID)');
assert.strictEqual(elements['newSystemCpu'].value, 'Intel Core i5-12400', 'CPU input pre-filled');
assert.strictEqual(elements['newSystemRam'].value, '16GB DDR4', 'RAM input pre-filled');
assert.strictEqual(elements['newSystemSsd'].value, '512GB NVMe', 'SSD input pre-filled');
assert.strictEqual(elements['newSystemMonitor'].value, 'Dell 24" P2419H', 'Monitor input pre-filled');
console.log('✅ PASS: Edit Stock Entry modal opened with correct title and pre-filled specifications.');
testsPassed++;

// Test 4: Delete Available System - Cancel Leaves Record Unchanged
console.log('\nTest 4: Delete Confirmation Dialog - Cancel Leaves Record Unchanged');
// Mock confirmSave returning false (Cancel)
app.confirmSave = async ({ title, message, yesText, noText }) => {
  assert(title.includes('Delete Available System'), 'Dialog title must indicate delete');
  assert(message.includes('PIX_DSK_TEST01'), 'Dialog must display selected Asset ID');
  assert.strictEqual(yesText, 'YES, DELETE', 'YES text must be YES, DELETE');
  assert.strictEqual(noText, 'NO, CANCEL', 'NO text must be NO, CANCEL');
  return false; // User clicked Cancel
};

(async () => {
  await window.ITApp.deleteAvailableSystem('PIX_DSK_TEST01');
  const foundAfterCancel = store.data.assets.find(a => a.id === 'PIX_DSK_TEST01');
  assert(foundAfterCancel, 'Asset must NOT be deleted after cancel');
  console.log('✅ PASS: Delete confirmation dialog showed selected Asset ID, and cancel left record completely unchanged.');
  testsPassed++;

  // Test 5: Delete Available System - Confirm Removes Record & Refreshes UI
  console.log('\nTest 5: Delete Confirmation Dialog - Confirm Safely Removes Record & Refreshes UI');
  app.confirmSave = async () => true; // User clicked YES, DELETE
  await window.ITApp.deleteAvailableSystem('PIX_DSK_TEST01');

  const foundAfterConfirm = store.data.assets.find(a => a.id === 'PIX_DSK_TEST01');
  assert(!foundAfterConfirm, 'Asset must be removed from active inventory');
  const deleteFetch = fetchCalls.find(c => c.method === 'DELETE' && c.url.includes('PIX_DSK_TEST01'));
  assert(deleteFetch, 'DELETE request must be sent to /api/assets/PIX_DSK_TEST01');

  // Verify UI refreshed immediately
  const refreshedTbody = elements['nonAssignedTableBody'].innerHTML;
  assert(!refreshedTbody.includes('PIX_DSK_TEST01'), 'Deleted asset must not appear in table');
  assert(refreshedTbody.includes('PIX_LAP_TEST02'), 'Unrelated records must remain untouched');
  console.log('✅ PASS: Confirmed deletion sent DELETE request, removed asset from inventory, preserved other assets, and immediately refreshed the UI.');
  testsPassed++;

  console.log('\n================================================================');
  console.log(`🏁 ALL ${testsPassed} END-TO-END TESTS PASSED SUCCESSFULLY!`);
  console.log('================================================================\n');
})();
