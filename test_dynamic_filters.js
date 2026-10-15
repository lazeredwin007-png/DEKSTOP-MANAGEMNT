const fs = require('fs');
const db = require('./database.js');

// Mock all DOM elements
const elements = {};

function createMockElement(id, tagName = 'div') {
  return {
    id,
    tagName: tagName.toUpperCase(),
    value: 'all',
    style: {},
    innerHTML: '',
    textContent: '',
    children: [],
    querySelectorAll: () => [],
    addEventListener: () => {},
    closest: () => null,
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
  'currentUserDisplayName', 'currentUserAvatar', 'currentUserRoleBadge'
];

mockIds.forEach(id => {
  elements[id] = createMockElement(id, id.includes('Filter') ? 'select' : id.includes('Search') ? 'input' : 'div');
});
elements['assetsSearchInput'].value = '';

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
  json: () => Promise.resolve(db.getAllAssets())
});

// Load app.js
eval(fs.readFileSync('app.js', 'utf8'));

// Populate store data directly with real SQLite records
const assets = db.getAllAssets();
window.ITAssetStoreInstance.data.assets = assets;
const app = window.ITAppControllerInstance;

// Function to inspect select options
function parseOptions(selectEl) {
  const matches = selectEl.innerHTML.match(/value="([^"]*)"/g) || [];
  return matches.map(m => m.replace(/value="|"/g, ''));
}

console.log('====================================================');
console.log('🧪 VERIFYING DYNAMIC DEPENDENT ASSET FILTERS');
console.log('====================================================\n');

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`✅ PASS: ${message}`);
    passedTests++;
  } else {
    console.error(`❌ FAIL: ${message}`);
    process.exitCode = 1;
  }
}

// Ensure app is on all-assets view
app.currentView = 'all-assets';

// Run initial filter update
window.ITApp.resetAllAssetFilters();

// TEST 1: Initial state
assert(elements['assetsToolbarCountPill'].textContent.includes('108 / 108 Assets'), `Initial state displays 108 / 108 assets (Got: "${elements['assetsToolbarCountPill'].textContent.trim()}")`);
const initialTypes = parseOptions(elements['assetsTypeFilter']);
const initialCpus = parseOptions(elements['assetsCpuFilter']);
assert(initialTypes.includes('all') && initialTypes.includes('Desktop') && initialTypes.includes('Laptop'), 'Type options contain all, Desktop, and Laptop');
assert(initialCpus.includes('all') && initialCpus.includes('Apple M1 Pro') && initialCpus.includes('i3 2nd Gen'), 'Initial CPUs contain both Laptop and Desktop CPUs');

// TEST 2: Select Device Type = 'Desktop'
elements['assetsTypeFilter'].value = 'Desktop';
window.ITApp.handleAssetFilterChange('type');

const desktopCpus = parseOptions(elements['assetsCpuFilter']);
assert(!desktopCpus.includes('Apple M1 Pro'), 'Desktop selection excludes Laptop-only Apple M1 Pro');
assert(!desktopCpus.includes('i7 11th Gen'), 'Desktop selection excludes Laptop-only i7 11th Gen');
assert(desktopCpus.includes('i3 2nd Gen'), 'Desktop selection includes i3 2nd Gen');
assert(desktopCpus.includes('i5 6th Gen'), 'Desktop selection includes i5 6th Gen');
assert(elements['assetsToolbarCountPill'].textContent.includes('82 / 108 Assets'), `Desktop matches exactly 82 assets (Got: "${elements['assetsToolbarCountPill'].textContent.trim()}")`);

// TEST 3: Select Device Type = 'Laptop'
elements['assetsTypeFilter'].value = 'Laptop';
window.ITApp.handleAssetFilterChange('type');

const laptopCpus = parseOptions(elements['assetsCpuFilter']);
assert(laptopCpus.includes('Apple M1 Pro'), 'Laptop selection includes Apple M1 Pro');
assert(laptopCpus.includes('i7 11th Gen'), 'Laptop selection includes i7 11th Gen');
assert(!laptopCpus.includes('i3 2nd Gen'), 'Laptop selection excludes Desktop-only i3 2nd Gen');
assert(!laptopCpus.includes('i5 6th Gen'), 'Laptop selection excludes Desktop-only i5 6th Gen');
assert(!laptopCpus.includes('i5 7th Gen'), 'Laptop selection excludes Desktop-only i5 7th Gen');
assert(elements['assetsToolbarCountPill'].textContent.includes('26 / 108 Assets'), `Laptop matches exactly 26 assets (Got: "${elements['assetsToolbarCountPill'].textContent.trim()}")`);

// TEST 4: Select CPU = 'Apple M1 Pro' (under Laptop)
elements['assetsCpuFilter'].value = 'Apple M1 Pro';
window.ITApp.handleAssetFilterChange('cpu');

const appleTeams = parseOptions(elements['assetsTeamFilter']);
assert(appleTeams.includes('Mobile') || appleTeams.includes('Mobile Team'), 'Apple M1 Pro shows only team having Apple assets');
assert(elements['assetsToolbarCountPill'].textContent.includes('1 / 108 Assets'), `Apple M1 Pro matches 1 laptop (Got: "${elements['assetsToolbarCountPill'].textContent.trim()}")`);

// TEST 5: Switching Type to 'Desktop' while CPU is 'Apple M1 Pro'
// Expected: CPU must automatically reset to 'all' because Apple M1 Pro is invalid for Desktop!
elements['assetsTypeFilter'].value = 'Desktop';
window.ITApp.handleAssetFilterChange('type');

assert(elements['assetsCpuFilter'].value === 'all', `CPU automatically reset to "all" when Desktop selected (Got: "${elements['assetsCpuFilter'].value}")`);
assert(elements['assetsToolbarCountPill'].textContent.includes('82 / 108 Assets'), `Displays all 82 Desktops after automatic invalidation reset (Got: "${elements['assetsToolbarCountPill'].textContent.trim()}")`);
const newDesktopCpus = parseOptions(elements['assetsCpuFilter']);
assert(!newDesktopCpus.includes('Apple M1 Pro'), 'New CPU dropdown does not contain Apple M1 Pro');
assert(newDesktopCpus.includes('i3 2nd Gen'), 'New CPU dropdown contains Desktop CPUs');

// TEST 6: Reverse Invalidation: Select CPU = 'i3 2nd Gen' on Desktop, then switch Type to Laptop
elements['assetsCpuFilter'].value = 'i3 2nd Gen';
window.ITApp.handleAssetFilterChange('cpu');
assert(elements['assetsToolbarCountPill'].textContent.includes('19 / 108 Assets'), `i3 2nd Gen matches 19 Desktops (Got: "${elements['assetsToolbarCountPill'].textContent.trim()}")`);

elements['assetsTypeFilter'].value = 'Laptop';
window.ITApp.handleAssetFilterChange('type');

assert(elements['assetsCpuFilter'].value === 'all', `CPU automatically reset to "all" when Laptop selected from i3 2nd Gen (Got: "${elements['assetsCpuFilter'].value}")`);
assert(elements['assetsToolbarCountPill'].textContent.includes('26 / 108 Assets'), `Displays all 26 Laptops after automatic invalidation reset (Got: "${elements['assetsToolbarCountPill'].textContent.trim()}")`);

// TEST 7: Search filter dynamically searches Asset ID, CPU, RAM
elements['assetsTypeFilter'].value = 'all';
elements['assetsCpuFilter'].value = 'all';
elements['assetsSearchInput'].value = 'Apple';
window.ITApp.handleAssetFilterChange('search');

const searchTypes = parseOptions(elements['assetsTypeFilter']);
const searchCpus = parseOptions(elements['assetsCpuFilter']);
assert(!searchTypes.includes('Desktop'), 'Searching "Apple" narrows Type to Laptop only');
assert(searchTypes.includes('Laptop'), 'Searching "Apple" includes Laptop');
assert(searchCpus.includes('Apple M1 Pro') && searchCpus.length === 2, 'Searching "Apple" narrows CPU dropdown to Apple M1 Pro (+ all)');
assert(elements['assetsToolbarCountPill'].textContent.includes('1 / 108 Assets'), `Searching "Apple" matches exactly 1 asset (Got: "${elements['assetsToolbarCountPill'].textContent.trim()}")`);

// TEST 8: Search RAM "16GB"
elements['assetsSearchInput'].value = '16GB';
window.ITApp.handleAssetFilterChange('search');
const ramMatchingCount = assets.filter(a => (a.ram || '').toLowerCase().includes('16gb')).length;
assert(elements['assetsToolbarCountPill'].textContent.includes(`${ramMatchingCount} / 108 Assets`), `Searching "16GB" matches ${ramMatchingCount} assets (Got: "${elements['assetsToolbarCountPill'].textContent.trim()}")`);

// TEST 9: Deduplication & Zero-matching options
elements['assetsSearchInput'].value = '';
window.ITApp.handleAssetFilterChange('search');
const allTeamOpts = parseOptions(elements['assetsTeamFilter']);
const uniqueTeamsLower = new Set(allTeamOpts.map(t => t.toLowerCase()));
assert(allTeamOpts.length === uniqueTeamsLower.size, 'Team dropdown has NO case-insensitive duplicates (Admin/ADMIN deduplicated)');

console.log('\n====================================================');
console.log(`🏁 TEST RESULTS: ${passedTests} / ${totalTests} PASSED`);
console.log('====================================================\n');
if (passedTests === totalTests) {
  console.log('🎉 ALL DYNAMIC DEPENDENT FILTER TESTS PASSED PERFECTLY!');
  process.exit(0);
} else {
  process.exit(1);
}
