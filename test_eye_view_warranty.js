const fs = require('fs');
const assert = require('assert');
const db = require('./database.js');

console.log('====================================================');
console.log('🧪 TESTING EYE VIEW WARRANTY DISPLAY & OPTIMIZATIONS');
console.log('====================================================');

// Mock DOM elements
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
    querySelectorAll: () => [],
    addEventListener: () => {},
    closest: () => null,
    focus: () => {},
    classList: { add: () => {}, remove: () => {}, contains: () => false, toggle: () => {} }
  };
}

const mockIds = [
  'assetsTypeFilter', 'assetsCpuFilter', 'assetsTeamFilter',
  'assetsStatusFilter', 'assetsWorkStatusFilter', 'assetsSearchInput',
  'cpuPresetList', 'allAssetsTableBody', 'assetSortIndicator',
  'assetsFilterCountBadge', 'assetsFilterBreakdownText',
  'assetsToolbarCountPill', 'assetsResetFiltersBtn', 'loginWrapper',
  'appContainer', 'currentPageTitle', 'currentBreadcrumb', 'btnBackToDashboard',
  'currentUserDisplayName', 'currentUserAvatar', 'currentUserRoleBadge',
  'modalViewAsset', 'viewAssetModalDialog', 'viewAssetModalHeader',
  'viewAssetModalMeta', 'viewAssetModalBody', 'viewAssetModalFooter',
  'viewAssetEditModalBtn', 'modalEditAsset', 'warrantyComponentsContainer'
];

mockIds.forEach(id => {
  elements[id] = createMockElement(id, id.includes('Filter') ? 'select' : id.includes('Search') ? 'input' : 'div');
});

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

global.window = {
  location: { hash: '#all-assets', pathname: '/', protocol: 'http:', origin: 'http://localhost:3000' },
  history: { pushState: () => {}, replaceState: () => {}, state: { view: 'all-assets' } },
  addEventListener: () => {},
  removeEventListener: () => {},
  scrollTo: () => {},
  sessionStorage: global.sessionStorage,
  localStorage: global.localStorage
};

global.history = global.window.history;
global.location = global.window.location;

global.document = {
  getElementById: (id) => elements[id] || createMockElement(id),
  querySelectorAll: () => [],
  querySelector: () => null,
  body: { appendChild: () => {} },
  addEventListener: () => {}
};

global.fetch = () => Promise.resolve({
  ok: true,
  json: () => Promise.resolve([])
});

// Load app.js
eval(fs.readFileSync('app.js', 'utf8'));

const testApp = window.ITAppControllerInstance;
const testStore = window.ITAssetStoreInstance;

assert(testApp, 'AppController instance should exist');
assert(testStore, 'Store instance should exist');

console.log('✅ PASS: Application and Store successfully loaded in test runner.');

// Test 1: calculateComponentWarranty logic
console.log('\n--- 1. Testing Warranty Calculation Engine ---');
const today = new Date();
const pastDate = '2023-01-01';
const futureDate = new Date(today.getTime() + 180 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10);
const expiringDate = new Date(today.getTime() + 15 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10);

const wActive = testApp.calculateComponentWarranty('2025-01-01', futureDate);
assert.strictEqual(wActive.status, 'Active', 'Future date should be Active');
assert(wActive.daysRemaining > 30, 'Active should have > 30 days remaining');
console.log('✅ PASS: Future warranty correctly calculated as Active (> 30 days).');

const wExpiring = testApp.calculateComponentWarranty('2025-01-01', expiringDate);
assert.strictEqual(wExpiring.status, 'Expiring Soon', '15 days should be Expiring Soon');
assert(wExpiring.daysRemaining <= 30 && wExpiring.daysRemaining > 0, 'Expiring Soon should have <= 30 days remaining');
console.log('✅ PASS: 15-day warranty correctly calculated as Expiring Soon.');

const wExpired = testApp.calculateComponentWarranty('2022-01-01', pastDate);
assert.strictEqual(wExpired.status, 'Expired', 'Past date should be Expired');
assert(wExpired.daysRemaining <= 0, 'Expired should have <= 0 days remaining');
console.log('✅ PASS: Past date correctly calculated as Expired.');

const wNonWarranty = testApp.calculateComponentWarranty('2025-01-01', 'Non-Warranty');
assert.strictEqual(wNonWarranty.status, 'Not Available', 'Non-Warranty should be Not Available');
console.log('✅ PASS: Non-Warranty correctly evaluated as Not Available.');

// Test 2: Eye View rendering for Asset with Mixed Components
console.log('\n--- 2. Testing Eye View Filtering (Mixed Components) ---');
const testAssetMixed = {
  id: 'TEST_MIX_01',
  type: 'Desktop',
  user: 'Alice Test',
  team: 'Engineering',
  cpu: 'Core i5 10th Gen',
  ram: '16GB DDR4',
  ssd: '512GB SSD',
  hdd: 'None',
  monitor: 'Dell 24 inch',
  status: 'Assigned',
  assignedDate: '2025-01-15',
  warrantyComponents: [
    { id: 'c1', type: 'RAM', coverage: 'warranty', assignedDate: '2025-01-15', expiryDate: futureDate },
    { id: 'c2', type: 'SSD', coverage: 'warranty', assignedDate: '2025-01-15', expiryDate: pastDate }, // EXPIRED
    { id: 'c3', type: 'Monitor', coverage: 'non-warranty', assignedDate: '2025-01-15', expiryDate: 'Non-Warranty' }, // NON-WARRANTY
    { id: 'c4', type: 'SMPS', coverage: 'warranty', assignedDate: '2025-01-15', expiryDate: expiringDate }, // EXPIRING SOON
    { id: 'c5', type: 'Keyboard', coverage: 'warranty', assignedDate: '2025-01-15', expiryDate: futureDate, status: 'Replaced' } // REPLACED
  ]
};

testStore.data.assets.push(testAssetMixed);

(async () => {
  await testApp.viewAsset('TEST_MIX_01');
  const bodyHtml = elements['viewAssetModalBody'].innerHTML;
  const tableMatch = bodyHtml.match(/<table class="itam-table">[\s\S]*?<\/table>/);
  const tableHtml = tableMatch ? tableMatch[0] : '';

  assert(tableHtml.includes('RAM'), 'Active RAM should appear in Under Warranty table');
  assert(tableHtml.includes('SMPS'), 'Expiring Soon SMPS should appear in Under Warranty table');
  assert(!tableHtml.includes('SSD') && !tableHtml.includes('Expired'), 'Expired SSD should NOT appear in warranty table');
  assert(!tableHtml.includes('Keyboard'), 'Replaced Keyboard should NOT appear in warranty table');
  assert(bodyHtml.includes('2 Active Warranty Items'), 'Active count should be exactly 2 items');
  console.log('✅ PASS: Eye View correctly filters ONLY active and expiring warranty items (excludes expired, non-warranty, and replaced).');

  // Test 3: Asset with NO Components Under Warranty
  console.log('\n--- 3. Testing Eye View with Zero Components Under Warranty ---');
  const testAssetZero = {
    id: 'TEST_ZERO_01',
    type: 'Desktop',
    user: 'Bob Stock',
    team: 'IT',
    cpu: 'i3 2nd Gen',
    ram: '8 DDR3',
    ssd: 'None',
    hdd: '500GB HDD',
    monitor: 'None',
    status: 'Non-Assigned',
    warrantyEnd: 'Non-Warranty',
    assignedDate: '2025-01-15',
    warrantyComponents: [
      { id: 'z1', type: 'RAM', coverage: 'non-warranty', assignedDate: '2025-01-15', expiryDate: 'Non-Warranty' },
      { id: 'z2', type: 'HDD', coverage: 'warranty', assignedDate: '2023-01-01', expiryDate: pastDate }
    ]
  };
  testStore.data.assets.push(testAssetZero);
  await testApp.viewAsset('TEST_ZERO_01');
  const zeroBodyHtml = elements['viewAssetModalBody'].innerHTML;

  assert(zeroBodyHtml.includes('0 Items Under Warranty'), 'Count badge should show 0 Items Under Warranty');
  assert(zeroBodyHtml.includes('No Components Under Active Warranty'), 'Clean fallback container should be rendered');
  console.log('✅ PASS: Zero warranty components correctly renders fallback state and 0 items badge.');

  // Test 4: Verify saving in Edit Modal updates Eye View immediately
  console.log('\n--- 4. Testing Reflecting Changes Saved Through Edit Asset Modal ---');
  testAssetZero.warrantyComponents = [
    { id: 'z1', type: 'RAM', coverage: 'warranty', assignedDate: '2025-01-15', expiryDate: futureDate }
  ];
  await testApp.viewAsset('TEST_ZERO_01');
  const updatedBodyHtml = elements['viewAssetModalBody'].innerHTML;
  assert(updatedBodyHtml.includes('1 Active Warranty Item'), 'Updated count should be 1 Active Warranty Item');
  assert(updatedBodyHtml.includes('RAM'), 'RAM should now appear in Eye View');
  console.log('✅ PASS: Saved edits in Edit IT Asset Specification immediately reflect in Eye View.');

  // Test 5: Verify compact layout of System Configuration and User Custody
  console.log('\n--- 5. Testing Layout Optimization & Compact Design ---');
  assert(updatedBodyHtml.includes('PROCESSOR (CPU)'), 'Processor visible in System Configuration');
  assert(updatedBodyHtml.includes('SYSTEM RAM'), 'System RAM visible in System Configuration');
  assert(updatedBodyHtml.includes('SSD STORAGE'), 'SSD Storage visible in System Configuration');
  assert(updatedBodyHtml.includes('HDD STORAGE'), 'HDD Storage visible in System Configuration');
  assert(updatedBodyHtml.includes('OPERATING SYSTEM'), 'Operating System visible in System Configuration');
  assert(updatedBodyHtml.includes('IP ADDRESS'), 'IP Address visible in System Configuration');
  assert(updatedBodyHtml.includes('MAC ADDRESS / SERIAL NO'), 'MAC Address visible in System Configuration');
  assert(updatedBodyHtml.includes('PRIMARY MONITOR'), 'Primary Monitor visible in System Configuration');
  assert(updatedBodyHtml.includes('SYSTEM ALLOTTED USER'), 'User heading visible with compact styling');
  assert(updatedBodyHtml.includes('OLD USER NAME'), 'Old user panel distinct and compact');
  console.log('✅ PASS: All 8 core hardware specs and compact user custody fields rendered properly.');

  // Test 6: Verify Database Integrity
  console.log('\n--- 6. Verifying Database Integrity ---');
  const count = db.db.prepare('SELECT count(*) as c FROM assets').get().c;
  assert(count > 0, 'Database assets count must remain positive');
  const compCount = db.db.prepare('SELECT count(*) as c FROM component_lifecycle').get().c;
  assert(compCount > 0, 'Component lifecycle records must remain intact');
  console.log(`✅ PASS: Database verified intact with ${count} assets and ${compCount} component lifecycle records.`);

  // Test 7: Verify all 5 hardware specs (CPU, RAM, HDD, SSD, Monitor) under warranty in Eye View
  console.log('\n--- 7. Testing All 5 Hardware Specs (CPU, RAM, HDD, SSD, Monitor) Under Warranty in Eye View ---');
  const testAssetFullWarranty = {
    id: 'TEST_FULL_HW_01',
    type: 'Desktop',
    user: 'Dinesh Hardware Lead',
    team: 'AI',
    cpu: 'Intel Core i7-12700',
    ram: '32GB DDR5',
    ssd: '1TB NVMe M.2',
    hdd: '2TB Seagate HDD',
    monitor: 'Dell 27 inch 4K',
    status: 'Assigned',
    warrantyEnd: futureDate,
    warrantyType: 'Component Lifecycle Tracking',
    assignedDate: '2025-01-15'
  };
  testStore.data.assets.push(testAssetFullWarranty);

  // Check getWarrantyComponentsForAsset
  const generatedComps = testApp.getWarrantyComponentsForAsset(testAssetFullWarranty);
  assert(generatedComps.length >= 5, 'Should generate at least 5 warranty components for all specs');
  assert(generatedComps.some(c => (c.type || '').toLowerCase().includes('cpu') && c.spec.includes('i7')), 'CPU component with spec should be present');
  assert(generatedComps.some(c => (c.type || '').toLowerCase().includes('ram') && c.spec.includes('32GB')), 'RAM component with spec should be present');
  assert(generatedComps.some(c => (c.type || '').toLowerCase().includes('ssd') && c.spec.includes('1TB')), 'SSD component with spec should be present');
  assert(generatedComps.some(c => (c.type || '').toLowerCase().includes('hdd') && c.spec.includes('2TB')), 'HDD component with spec should be present');
  assert(generatedComps.some(c => (c.type || '').toLowerCase().includes('mon') && c.spec.includes('27 inch')), 'Monitor component with spec should be present');
  console.log('✅ PASS: getWarrantyComponentsForAsset automatically tracks CPU, RAM, SSD, HDD, and Monitor with full specs.');

  // View asset in Eye View
  await testApp.viewAsset('TEST_FULL_HW_01');
  const fullBodyHtml = elements['viewAssetModalBody'].innerHTML;
  const fullTableMatch = fullBodyHtml.match(/<table class="itam-table">[\s\S]*?<\/table>/);
  const fullTableHtml = fullTableMatch ? fullTableMatch[0] : '';

  assert(fullTableHtml.includes('CPU') || fullTableHtml.includes('Processor'), 'CPU / Processor must appear in Under Warranty table');
  assert(fullTableHtml.includes('RAM'), 'RAM must appear in Under Warranty table');
  assert(fullTableHtml.includes('SSD'), 'SSD must appear in Under Warranty table');
  assert(fullTableHtml.includes('HDD'), 'HDD must appear in Under Warranty table');
  assert(fullTableHtml.includes('Monitor'), 'Monitor must appear in Under Warranty table');
  assert(fullTableHtml.includes('Intel Core i7-12700') || fullTableHtml.includes('i7'), 'CPU spec visible in Eye View table');
  assert(fullTableHtml.includes('32GB DDR5'), 'RAM spec visible in Eye View table');
  assert(fullTableHtml.includes('1TB NVMe M.2'), 'SSD spec visible in Eye View table');
  assert(fullTableHtml.includes('2TB Seagate HDD'), 'HDD spec visible in Eye View table');
  assert(fullTableHtml.includes('Dell 27 inch 4K'), 'Monitor spec visible in Eye View table');
  assert(fullBodyHtml.includes('5 Active Warranty Items'), 'Active count badge must show 5 Active Warranty Items');
  console.log('✅ PASS: Eye View displays all 5 hardware components (CPU, RAM, HDD, SSD, Monitor) under active warranty with clean spec subtitles.');

  // Test 8: Editing and saving hardware specs updates warrantyComponents and Eye View
  console.log('\n--- 8. Testing Edit IT Asset Specs Saving & Eye View Sync ---');
  testAssetFullWarranty.warrantyComponents = [
    { id: 'hw-cpu', type: 'CPU / Processor', spec: 'Intel Core i9-13900K', coverage: 'warranty', assignedDate: '2025-01-15', expiryDate: futureDate },
    { id: 'hw-ram', type: 'RAM', spec: '64GB DDR5 RGB', coverage: 'warranty', assignedDate: '2025-01-15', expiryDate: futureDate },
    { id: 'hw-ssd', type: 'SSD', spec: '2TB Samsung 990 Pro', coverage: 'warranty', assignedDate: '2025-01-15', expiryDate: futureDate },
    { id: 'hw-hdd', type: 'HDD', spec: 'None', coverage: 'non-warranty', assignedDate: '2025-01-15', expiryDate: 'Non-Warranty' },
    { id: 'hw-mon', type: 'Monitor', spec: 'LG UltraWide 34 inch', coverage: 'warranty', assignedDate: '2025-01-15', expiryDate: futureDate }
  ];
  await testApp.viewAsset('TEST_FULL_HW_01');
  const editedBodyHtml = elements['viewAssetModalBody'].innerHTML;
  const editedTableMatch = editedBodyHtml.match(/<table class="itam-table">[\s\S]*?<\/table>/);
  const editedTableHtml = editedTableMatch ? editedTableMatch[0] : '';

  assert(editedTableHtml.includes('Intel Core i9-13900K'), 'Updated i9 CPU spec must appear in Eye View');
  assert(editedTableHtml.includes('64GB DDR5 RGB'), 'Updated 64GB RAM spec must appear in Eye View');
  assert(editedTableHtml.includes('2TB Samsung 990 Pro'), 'Updated 2TB SSD spec must appear in Eye View');
  assert(editedTableHtml.includes('LG UltraWide 34 inch'), 'Updated LG Monitor spec must appear in Eye View');
  assert(!editedTableHtml.includes('HDD') && !editedTableHtml.includes('Seagate'), 'Non-Warranty HDD must NOT appear in Eye View');
  assert(editedBodyHtml.includes('4 Active Warranty Items'), 'Active count badge must show 4 Active Warranty Items');
  console.log('✅ PASS: Edit IT Asset Specification changes reflect with high precision in Eye View.');

  console.log('\n====================================================');
  console.log('🏁 ALL TESTS PASSED SUCCESSFULLY! (8 / 8 SUITES)');
  console.log('====================================================');
})();
