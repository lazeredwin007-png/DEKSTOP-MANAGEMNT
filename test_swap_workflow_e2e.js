const fs = require('fs');
const assert = require('assert');
const db = require('./database.js');

console.log('================================================================');
console.log('🧪 RUNNING SYSTEM SWAP FACILITY END-TO-END WORKFLOW VERIFICATION');
console.log('================================================================\n');

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
    options: [],
    selectedIndex: 0,
    querySelectorAll: () => [],
    addEventListener: function (event, handler) {
      if (!this._handlers) this._handlers = {};
      if (!this._handlers[event]) this._handlers[event] = [];
      this._handlers[event].push(handler);
    },
    dispatchEvent: function (event) {
      if (this._handlers && this._handlers[event.type]) {
        this._handlers[event.type].forEach(h => h(event));
      }
    },
    closest: () => null,
    focus: () => { },
    classList: { add: () => { }, remove: () => { }, contains: () => false, toggle: () => { } }
  };
}

const mockIds = [
  'swapOldUserSelect', 'swapOldTeam', 'swapOldAssetId', 'swapOldDetails', 'swapOldUsername',
  'swapNewUserInput', 'swapNewTeamSelect', 'swapAssetTypeSelect', 'swapNewAssetId',
  'swapCpuInput', 'swapRamSelect', 'swapSsdSelect', 'swapHddSelect', 'swapMonitorInput',
  'swapAssignedDateInput', 'swapDateInput', 'swapAutoFillBanner', 'swapAutoFillTypeBadge',
  'swapOldAssetTypePill', 'swapCompatibleRuleBadge', 'swapCompatibleTypesHelp', 'swapCompatibleTypesList',
  'swapOldAssetDatalist', 'assetTypeList', 'swapSystemForm', 'swapHistoryTableBody',
  'loginWrapper', 'appContainer', 'currentPageTitle', 'currentBreadcrumb', 'btnBackToDashboard',
  'currentUserDisplayName', 'currentUserAvatar', 'currentUserRoleBadge'
];

mockIds.forEach(id => {
  elements[id] = createMockElement(id, id.includes('Select') ? 'select' : id.includes('Input') ? 'input' : 'div');
});

// Setup document and window globals
global.document = {
  getElementById: (id) => elements[id] || null,
  querySelector: (sel) => null,
  querySelectorAll: () => [],
  addEventListener: () => { },
  body: { classList: { add: () => { }, remove: () => { } } }
};

global.window = {
  location: { hash: '#swap-system', pathname: '/', protocol: 'file:', origin: 'file://' },
  history: { pushState: () => { }, replaceState: () => { }, state: { view: 'swap-system' } },
  scrollTo: () => { },
  addEventListener: () => { }
};
global.history = global.window.history;

global.sessionStorage = {
  getItem: (k) => k === 'apexit_auth_user' ? JSON.stringify({ username: 'admin', role: 'admin' }) : null,
  setItem: () => { },
  removeItem: () => { }
};
global.localStorage = {
  getItem: () => null,
  setItem: () => { },
  removeItem: () => { }
};

global.HTMLInputElement = function () { };
global.HTMLInputElement.prototype = {};

// Load app.js in sandbox
const appCode = fs.readFileSync('app.js', 'utf8');
eval(appCode);

const testApp = window.ITApp;
assert(testApp, 'window.ITApp must be initialized');

// Sync store with database assets
window.ITAssetStoreInstance.data.assets = db.getAllAssets();

console.log('--- 1. Testing System Swap Pool Population (Assigned Systems Excluded) ---');
testApp.populateSwapOldUserSelect('all');
const oldSelect = elements['swapOldUserSelect'];
console.log('oldSelect.innerHTML preview:\n', oldSelect.innerHTML.substring(0, 400));
assert(!oldSelect.innerHTML.includes('Active Assigned Systems'), 'Must NOT include Active Assigned Systems optgroup (Assigned systems excluded as requested)');
assert(oldSelect.innerHTML.includes('User Exit Systems'), 'Must include User Exit Systems optgroup');
assert(oldSelect.innerHTML.includes('PIX_DSK_09 — Gayathri K'), 'Must contain PIX_DSK_09 with full ID first');
console.log('✅ PASS: Dropdown populated with swappable pool only (Assigned systems excluded, In-Stock and User Exit available with full IDs).');

console.log('\n--- 2. Testing Desktop Selection -> Same Replacement Asset Type & Same Asset ID ---');
testApp.syncSwapOldAssetToReplacement('PIX_DSK_09');
assert.strictEqual(elements['swapAssetTypeSelect'].value, 'Desktop', 'Replacement type must be Desktop');
assert.strictEqual(elements['swapNewAssetId'].value, 'PIX_DSK_09', 'New Asset ID (Yellow) must match Old Asset ID (Red): PIX_DSK_09');
assert.strictEqual(elements['swapOldAssetTypePill'].textContent, 'Desktop Detected', 'Visual pill must show Desktop Detected');
assert.strictEqual(elements['swapCompatibleRuleBadge'].textContent, 'Desktop Swap Rule Enforced', 'Rule badge must enforce Desktop rule');
assert(elements['assetTypeList'].innerHTML.includes('Desktop (Matched to Old Asset)'), 'Compatible options must include Desktop matched');
assert(elements['assetTypeList'].innerHTML.includes('Workstation'), 'Compatible options must include Workstation');
assert(elements['assetTypeList'].innerHTML.includes('Mini PC'), 'Compatible options must include Mini PC');
assert(!elements['assetTypeList'].innerHTML.includes('MacBook'), 'Desktop swap rule must NOT include MacBook');
console.log('✅ PASS: PIX_DSK_09 correctly identified as Desktop, New Asset ID strictly matches Old Asset ID (PIX_DSK_09), and Desktop compatible tiers enforced.');

console.log('\n--- 3. Testing Laptop Selection -> Same Replacement Asset Type & Same Asset ID ---');
testApp.syncSwapOldAssetToReplacement('PIX_LAP_01');
assert.strictEqual(elements['swapAssetTypeSelect'].value, 'Laptop', 'Replacement type must be Laptop');
assert.strictEqual(elements['swapNewAssetId'].value, 'PIX_LAP_01', 'New Asset ID (Yellow) must match Old Asset ID (Red): PIX_LAP_01');
assert.strictEqual(elements['swapOldAssetTypePill'].textContent, 'Laptop Detected', 'Visual pill must show Laptop Detected');
assert.strictEqual(elements['swapCompatibleRuleBadge'].textContent, 'Laptop Swap Rule Enforced', 'Rule badge must enforce Laptop rule');
assert(elements['assetTypeList'].innerHTML.includes('Laptop (Matched to Old Asset)'), 'Compatible options must include Laptop matched');
assert(elements['assetTypeList'].innerHTML.includes('MacBook'), 'Compatible options must include MacBook');
assert(!elements['assetTypeList'].innerHTML.includes('Mini PC'), 'Laptop swap rule must NOT include Mini PC');
console.log('✅ PASS: PIX_LAP_01 correctly identified as Laptop, New Asset ID strictly matches Old Asset ID (PIX_LAP_01), and Laptop compatible tiers enforced.');

console.log('\n--- 4. Testing Direct Input of Asset ID (Typing) ---');
testApp.syncSwapOldAssetToReplacement('AST-LPT-2002');
assert.strictEqual(elements['swapAssetTypeSelect'].value, 'Laptop', 'Direct typed AST-LPT-2002 must resolve to Laptop');
assert.strictEqual(elements['swapNewAssetId'].value, 'AST-LPT-2002', 'Direct typed AST-LPT-2002 must set New Asset ID to AST-LPT-2002');
testApp.syncSwapOldAssetToReplacement('AST-DSK-1001');
assert.strictEqual(elements['swapAssetTypeSelect'].value, 'Desktop', 'Direct typed AST-DSK-1001 must resolve to Desktop');
assert.strictEqual(elements['swapNewAssetId'].value, 'AST-DSK-1001', 'Direct typed AST-DSK-1001 must set New Asset ID to AST-DSK-1001');
testApp.syncSwapOldAssetToReplacement('MAC-01');
assert.strictEqual(elements['swapAssetTypeSelect'].value, 'MacBook', 'Direct typed MAC-01 must resolve to MacBook');
assert.strictEqual(elements['swapNewAssetId'].value, 'MAC-01', 'Direct typed MAC-01 must set New Asset ID to MAC-01');
console.log('✅ PASS: Direct typing of asset IDs instantly synchronizes to the exact same replacement asset type and New Asset ID.');

console.log('\n--- 5. Testing Clearing Asset ID ---');
testApp.syncSwapOldAssetToReplacement('');
assert.strictEqual(elements['swapAssetTypeSelect'].value, '', 'Clearing asset ID must clear replacement type');
assert.strictEqual(elements['swapNewAssetId'].value, '', 'Clearing asset ID must clear New Asset ID');
assert.strictEqual(elements['swapOldAssetTypePill'].style.display, 'none', 'Pill must be hidden on clear');
assert.strictEqual(elements['swapCompatibleRuleBadge'].style.display, 'none', 'Rule badge must be hidden on clear');
console.log('✅ PASS: Clearing input cleanly resets state.');

console.log('\n================================================================');
console.log('🏁 ALL END-TO-END WORKFLOW CHECKS PASSED WITH ZERO ERRORS!');
console.log('================================================================\n');
process.exit(0);
