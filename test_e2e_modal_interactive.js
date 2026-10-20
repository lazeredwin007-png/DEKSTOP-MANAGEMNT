const fs = require('fs');
const assert = require('assert');

console.log('========================================================================');
console.log('🧪 COMPREHENSIVE E2E INTERACTIVE MODAL & LIFECYCLE TEST');
console.log('========================================================================\n');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`✅ PASS: ${name}`);
    passed++;
  } catch (err) {
    console.error(`❌ FAIL: ${name} -> ${err.message}`);
    failed++;
  }
}

// ----------------------------------------------------------------------
// 1. Structure Verification of index.html
// ----------------------------------------------------------------------
const html = fs.readFileSync('index.html', 'utf8');

test('DOM Structure: User Assignment is Card 1, Hardware Specs is Card 2', () => {
  const modalStart = html.indexOf('id="modalEditAsset"');
  assert(modalStart !== -1, 'modalEditAsset not found in index.html');
  const modalBodyStart = html.indexOf('<div class="modal-body">', modalStart);
  assert(modalBodyStart !== -1, 'modal-body not found inside modalEditAsset');
  const modalBodyChunk = html.substring(modalBodyStart, modalBodyStart + 12000);

  // Find all modal-section-box elements
  const boxMatches = [...modalBodyChunk.matchAll(/<div class="modal-section-box([^"]*)">/g)];
  assert(boxMatches.length >= 2, 'Expected at least 2 section boxes in modal body');

  const firstBoxStart = boxMatches[0].index;
  const secondBoxStart = boxMatches[1].index;

  const firstBoxContent = modalBodyChunk.substring(firstBoxStart, secondBoxStart);
  const secondBoxContent = modalBodyChunk.substring(secondBoxStart, secondBoxStart + 3500);

  // Check First Box
  assert(firstBoxContent.includes('👤 User Assignment &amp; Allocation'), 'First box must have title 👤 User Assignment & Allocation');
  assert(firstBoxContent.includes('Employee • Team • Status'), 'First box must have subtitle Employee • Team • Status');
  assert(firstBoxContent.includes('id="editAssetUser"'), 'First box must contain editAssetUser');
  assert(firstBoxContent.includes('id="editAssetOldUsername"'), 'First box must contain editAssetOldUsername');

  // Check Second Box
  assert(secondBoxContent.includes('Hardware Specifications'), 'Second box must have title Hardware Specifications');
  assert(secondBoxContent.includes('CPU • RAM • Storage • Display • Network &amp; OS'), 'Second box must have subtitle CPU • RAM • Storage • Display • Network & OS');
  assert(secondBoxContent.includes('id="editAssetCpu"'), 'Second box must contain editAssetCpu');
  assert(secondBoxContent.includes('id="editAssetRam"'), 'Second box must contain editAssetRam');
  assert(secondBoxContent.includes('id="editAssetId"'), 'Second box must contain editAssetId');
});

// ----------------------------------------------------------------------
// 2. Interactive App Class Simulation (app.js)
// ----------------------------------------------------------------------
const appCode = fs.readFileSync('app.js', 'utf8');

// Mock DOM elements dictionary
const elements = {};
function mockElement(id, tagName = 'input', type = 'text') {
  const el = {
    id,
    tagName: tagName.toUpperCase(),
    type,
    value: '',
    textContent: '',
    style: {},
    classList: {
      add: () => {},
      remove: () => {}
    },
    addEventListener: () => {},
    options: [],
    appendChild: (opt) => el.options.push(opt)
  };
  elements[id] = el;
  return el;
}

// Pre-create all modal elements
[
  'editAssetOriginalId',
  'editAssetTypeBadge',
  'editAssetIdBadge',
  'editAssetUserBadge',
  'editAssetStatusBadge',
  'editAssetCpu',
  'editAssetRam',
  'editAssetSsd',
  'editAssetHdd',
  'editAssetMonitor',
  'editAssetType',
  'editAssetUser',
  'editAssetTl',
  'editAssetTeam',
  'editAssetStatus',
  'editAssetWorkStatus',
  'editAssetLocation',
  'editAssetCondition',
  'editAssetOldUsername',
  'editAssetExitDate',
  'editAssetId',
  'editAssetSerialNumber',
  'editAssetIpAddress',
  'editAssetOs',
  'editAssetAssignedDate',
  'editAssetWarrantyType',
  'editAssetWarrantyStatus',
  'editAssetWarrantyEnd',
  'editAssetRemark',
  'btnHeaderSaveAsset',
  'btnSaveAssetEdit',
  'editAssetSavedTag',
  'editAssetSaveStateBadge',
  'editModalSavedFeedback'
].forEach(id => mockElement(id));

// Set up mock window and document
global.document = {
  body: { classList: { add: () => {}, remove: () => {} } },
  getElementById: (id) => elements[id] || null,
  addEventListener: () => {},
  querySelector: () => null,
  querySelectorAll: () => [],
  createElement: (tag) => ({ tagName: tag.toUpperCase(), value: '', textContent: '', style: {}, classList: { add: () => {}, remove: () => {} } })
};

global.localStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {}
};

global.sessionStorage = {
  getItem: () => 'true',
  setItem: () => {},
  removeItem: () => {}
};

global.window = {
  location: { protocol: 'http:' },
  addEventListener: () => {},
  removeEventListener: () => {},
  scrollTo: () => {}
};



global.Utils = {
  escapeHtml: s => s || '',
  showToast: () => {}
};

// Evaluate appCode
const AppModule = new Function('Utils', 'document', 'window', `
  ${appCode}
`);

AppModule(global.Utils, global.document, global.window);
const store = global.window.ITAssetStoreInstance;
const itApp = global.window.ITAppControllerInstance;
global.store = store;

test('Scenario 1: First Assignment -> Edwin, Previous User = —', () => {
  const asset = {
    id: 'AST-TEST-101',
    type: 'Desktop',
    user: 'Edwin',
    oldUsername: 'None',
    status: 'Assigned',
    workStatus: 'Currently Working'
  };
  store.data.assets = [asset];

  itApp.populateEditAssetModal(asset);

  const userInput = elements['editAssetUser'];
  const oldUserInput = elements['editAssetOldUsername'];

  assert.strictEqual(userInput.value, 'Edwin', 'Assigned Employee Name must be Edwin');
  assert.strictEqual(oldUserInput.value, '—', 'Previous User must be — for first assignment');
  assert.notStrictEqual(userInput.value, oldUserInput.value, 'Fields must not display duplicate names');
});

test('Scenario 2: Reassignment Edwin → Benitta, Assigned = Benitta, Previous User = Edwin', () => {
  const asset = store.data.assets.find(a => a.id === 'AST-TEST-101');
  assert(asset, 'Asset must exist');

  itApp.populateEditAssetModal(asset);

  // Admin types 'Benitta' into Assigned Employee Name
  const userInput = elements['editAssetUser'];
  const oldUserInput = elements['editAssetOldUsername'];
  userInput.value = 'Benitta';
  userInput.oninput();

  assert.strictEqual(userInput.value, 'Benitta', 'User input is now Benitta');
  assert.strictEqual(oldUserInput.value, 'Edwin', 'Previous User should automatically update to former employee Edwin');

  // Submit Save
  const formData = new Map();
  formData.set('editOriginalAssetId', 'AST-TEST-101');
  formData.set('editAssetId', 'AST-TEST-101');
  formData.set('editType', 'Desktop');
  formData.set('editCpu', 'i7');
  formData.set('editRam', '32GB');
  formData.set('editUser', 'Benitta');
  formData.set('editOldUsername', oldUserInput.value);
  formData.set('editTeam', 'PHP');
  formData.set('editStatus', 'Assigned');
  formData.set('editWorkStatus', 'Currently Working');

  itApp.executeSaveAssetEdit(formData);

  assert.strictEqual(asset.user, 'Benitta', 'Persisted user is Benitta');
  assert.strictEqual(asset.oldUsername, 'Edwin', 'Persisted oldUsername is Edwin');

  // Check assignmentHistory
  const hist = store.data.assignmentHistory.find(h => h.assetId === 'AST-TEST-101');
  assert(hist, 'Assignment history record must be created');
  assert.strictEqual(hist.previousUser, 'Edwin', 'History previousUser is Edwin');
  assert.strictEqual(hist.newUser, 'Benitta', 'History newUser is Benitta');

  // Re-open modal
  itApp.populateEditAssetModal(asset);
  assert.strictEqual(userInput.value, 'Benitta', 'Modal Assigned Employee Name must be Benitta');
  assert.strictEqual(oldUserInput.value, 'Edwin', 'Modal Previous User must be Edwin');
  assert.notStrictEqual(userInput.value, oldUserInput.value, 'Fields must not display duplicate names');
});

test('Scenario 3: Reassignment again Benitta → Charlie, Assigned = Charlie, Previous User = Benitta', () => {
  const asset = store.data.assets.find(a => a.id === 'AST-TEST-101');
  assert(asset, 'Asset must exist');

  itApp.populateEditAssetModal(asset);

  // Admin types 'Charlie' into Assigned Employee Name
  const userInput = elements['editAssetUser'];
  const oldUserInput = elements['editAssetOldUsername'];
  userInput.value = 'Charlie';
  userInput.oninput();

  assert.strictEqual(userInput.value, 'Charlie', 'User input is now Charlie');
  assert.strictEqual(oldUserInput.value, 'Benitta', 'Previous User should update to former employee Benitta');

  // Submit Save
  const formData = new Map();
  formData.set('editOriginalAssetId', 'AST-TEST-101');
  formData.set('editAssetId', 'AST-TEST-101');
  formData.set('editType', 'Desktop');
  formData.set('editCpu', 'i7');
  formData.set('editRam', '32GB');
  formData.set('editUser', 'Charlie');
  formData.set('editOldUsername', oldUserInput.value);
  formData.set('editTeam', 'PHP');
  formData.set('editStatus', 'Assigned');
  formData.set('editWorkStatus', 'Currently Working');

  itApp.executeSaveAssetEdit(formData);

  assert.strictEqual(asset.user, 'Charlie', 'Persisted user is Charlie');
  assert.strictEqual(asset.oldUsername, 'Benitta', 'Persisted oldUsername is Benitta');

  // Re-open modal
  itApp.populateEditAssetModal(asset);
  assert.strictEqual(userInput.value, 'Charlie', 'Modal Assigned Employee Name must be Charlie');
  assert.strictEqual(oldUserInput.value, 'Benitta', 'Modal Previous User must be Benitta');
  assert.notStrictEqual(userInput.value, oldUserInput.value, 'Fields must not display duplicate names');
});

test('Existing Asset with duplicate in record (PIX_DSK_02): Resolves to —', () => {
  const pixDsk02 = {
    id: 'PIX_DSK_02',
    type: 'Desktop',
    user: 'Siva Ganesh S',
    oldUsername: 'Siva Ganesh S', // Corrupted/duplicate in record
    status: 'Assigned',
    workStatus: 'Currently Working'
  };
  store.data.assets.push(pixDsk02);

  itApp.populateEditAssetModal(pixDsk02);

  const userInput = elements['editAssetUser'];
  const oldUserInput = elements['editAssetOldUsername'];

  assert.strictEqual(userInput.value, 'Siva Ganesh S', 'Assigned Employee Name is Siva Ganesh S');
  assert.strictEqual(oldUserInput.value, '—', 'Previous User must NOT duplicate Siva Ganesh S; displays —');
  assert.notStrictEqual(userInput.value, oldUserInput.value, 'No duplicate names displayed');
});

console.log('\n========================================================================');
console.log(`🏁 E2E RESULTS: ${passed} PASSED, ${failed} FAILED`);
console.log('========================================================================\n');

if (failed > 0) process.exit(1);
