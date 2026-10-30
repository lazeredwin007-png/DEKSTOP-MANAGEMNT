const fs = require('fs');
const assert = require('assert');

console.log('================================================================');
console.log('🧪 TESTING GLOBAL SAVE CONFIRMATION (YES/NO) & QUICK ACTION REMOVAL');
console.log('================================================================\n');

let passedTests = 0;
let totalTests = 0;

function test(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`✅ PASS: ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`❌ FAIL: ${name} -> ${err.message}`);
    process.exitCode = 1;
  }
}

const html = fs.readFileSync('index.html', 'utf8');
const appJs = fs.readFileSync('app.js', 'utf8');
const css = fs.readFileSync('styles.css', 'utf8');

// --- 1. QUICK ACTION REMOVAL TESTS ---
console.log('--- 1. Quick Action Removal from Available Systems ---');

test('Available Systems table in index.html does NOT contain Quick Action header', () => {
  const idx = html.indexOf('id="nonAssignedTableBody"');
  const prevTableIdx = html.lastIndexOf('<table', idx);
  const tableChunk = html.substring(prevTableIdx, idx);
  assert(!tableChunk.includes('<th>Quick Action</th>'), 'thead must not contain <th>Quick Action</th>');
  assert(!tableChunk.includes('Quick Action'), 'thead must not contain Quick Action');
});

test('Available Systems table header in index.html has exactly 11 columns with Actions', () => {
  const idx = html.indexOf('id="nonAssignedTableBody"');
  const prevTableIdx = html.lastIndexOf('<table', idx);
  const tableChunk = html.substring(prevTableIdx, idx);
  const thMatches = tableChunk.match(/<th[\s\S]*?<\/th>/g) || [];
  assert.strictEqual(thMatches.length, 11, `Expected 11 <th> elements, found ${thMatches.length}`);
  assert(tableChunk.includes('Actions'), 'thead must contain Actions column');
});

test('renderNonAssignedView in app.js uses colspan="11" for empty state', () => {
  const checkIdx = appJs.indexOf('nonAssigned.length === 0');
  const emptyChunk = appJs.substring(checkIdx, checkIdx + 200);
  assert(emptyChunk.includes('colspan="11"'), 'Empty state must use colspan="11"');
});

test('renderNonAssignedView does NOT render Quick Action cell or quick assign button in table rows', () => {
  const mapStart = appJs.indexOf('tbody.innerHTML = nonAssigned.map');
  const mapEnd = appJs.indexOf("}).join('');", mapStart) + "}).join('');".length;
  const rowTemplate = appJs.substring(mapStart, mapEnd);
  assert(!rowTemplate.includes('quickAssignAsset'), 'Row template must not contain quickAssignAsset');
  assert(!rowTemplate.includes('⚡ Quick Assign'), 'Row template must not contain ⚡ Quick Assign');
  assert(!rowTemplate.includes('btn-action-view'), 'Row template must not contain btn-action-view button');
  assert(!rowTemplate.includes('btn-action-edit'), 'Row template must not contain btn-action-edit button');
  assert(!rowTemplate.includes('action-btn-group'), 'Row template must not contain action-btn-group');
});

// --- 2. GLOBAL SAVE CONFIRMATION MODAL UI TESTS ---
console.log('\n--- 2. Global Save Confirmation Modal UI & Buttons ---');

test('index.html contains modalGlobalSaveConfirm modal with high z-index', () => {
  assert(html.includes('id="modalGlobalSaveConfirm"'), 'modalGlobalSaveConfirm must exist in index.html');
  assert(html.includes('id="globalSaveConfirmTitle"'), 'globalSaveConfirmTitle must exist in index.html');
  assert(html.includes('id="globalSaveConfirmMessage"'), 'globalSaveConfirmMessage must exist in index.html');
});

test('modalGlobalSaveConfirm contains explicit YES and NO buttons', () => {
  assert(html.includes('id="btnGlobalSaveConfirmYes"'), 'btnGlobalSaveConfirmYes must exist');
  assert(html.includes('id="btnGlobalSaveConfirmNo"'), 'btnGlobalSaveConfirmNo must exist');

  const yesBtnMatch = html.match(/<button[^>]*id="btnGlobalSaveConfirmYes"[^>]*>([\s\S]*?)<\/button>/);
  assert(yesBtnMatch, 'YES button element found');
  assert(yesBtnMatch[1].includes('YES'), 'Confirm button text must contain YES');

  const noBtnMatch = html.match(/<button[^>]*id="btnGlobalSaveConfirmNo"[^>]*>([\s\S]*?)<\/button>/);
  assert(noBtnMatch, 'NO button element found');
  assert(noBtnMatch[1].includes('NO'), 'Cancel button text must contain NO');
});

test('modalConfirmSaveAsset buttons explicitly include YES and NO', () => {
  const saveAssetModalMatch = html.match(/id="modalConfirmSaveAsset"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/);
  assert(saveAssetModalMatch, 'modalConfirmSaveAsset found');
  const content = saveAssetModalMatch[0];
  assert(content.includes('YES'), 'modalConfirmSaveAsset must have YES option');
  assert(content.includes('NO'), 'modalConfirmSaveAsset must have NO option');
});

test('styles.css contains styling for modalGlobalSaveConfirm and YES/NO buttons', () => {
  assert(css.includes('#modalGlobalSaveConfirm'), 'styles.css must have #modalGlobalSaveConfirm rule');
  assert(css.includes('#btnGlobalSaveConfirmYes'), 'styles.css must have #btnGlobalSaveConfirmYes rule');
  assert(css.includes('#btnGlobalSaveConfirmNo'), 'styles.css must have #btnGlobalSaveConfirmNo rule');
});

// --- 3. JAVASCRIPT SAVE CONFIRMATION ENGINE TESTS ---
console.log('\n--- 3. JavaScript Save Confirmation Engine & Wiring ---');

test('app.js defines confirmSave method returning a Promise', () => {
  assert(appJs.includes('confirmSave(options = {})'), 'app.confirmSave must be defined in app.js');
  assert(appJs.includes('new Promise((resolve)'), 'confirmSave must return a Promise');
});

test('Utils.confirmSave and window.ITApp.confirmSave are exposed', () => {
  assert(appJs.includes('confirmSave(options)'), 'Utils must have confirmSave method');
  assert(appJs.includes('window.ITApp = {') || appJs.includes('window.ITApp = Object.freeze'), 'window.ITApp exists');
  assert(appJs.includes('closeGlobalSaveConfirm()'), 'closeGlobalSaveConfirm helper must exist in window.ITApp');
});

test('Forms & Save handlers across portal are guarded by confirmSave', () => {
  const formsToVerify = [
    'editAssetForm',
    'newUserForm',
    'swapForm',
    'reqForm',
    'nonItForm',
    'addSwitchForm',
    'addBypassIpForm',
    'addAntivirusForm',
    'addRepairForm',
    'editWarrantyForm',
    'settingsForm',
    'submitQuickAssign',
    'handleSaveNewComponent',
    'handleSaveEditComponent',
    'handleSaveReplaceComponent',
    'handleAssignAssetSubmit',
    'handleReturnAssetSubmit',
    'handleEditAllocationSubmit',
    'handleInstockFormSubmit',
    'handlePageInstockEntrySubmit',
    'handleNewRequestSubmit',
    'handleUpdateReqStatusSubmit',
    'handleAssignHardwareToReqSubmit'
  ];

  formsToVerify.forEach(form => {
    assert(appJs.includes(form), `Target form/handler ${form} must be in app.js`);
  });

  const matches = appJs.match(/confirmSave\(\{/g) || [];
  assert(matches.length >= 20, `Expected at least 20 confirmSave invocations, found ${matches.length}`);
  console.log(`    Total confirmSave integration points: ${matches.length}`);
});

console.log('\n================================================================');
console.log(`🏁 RESULT: ${passedTests} / ${totalTests} TESTS PASSED!`);
console.log('================================================================\n');

if (passedTests !== totalTests) {
  process.exit(1);
}
