const fs = require('fs');
const assert = require('assert');
const http = require('http');

console.log('================================================================');
console.log('🧪 TESTING AVAILABLE SYSTEMS ACTIONS (EYE VIEW, EDIT, DELETE)');
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

async function asyncTest(name, fn) {
  totalTests++;
  try {
    await fn();
    console.log(`✅ PASS: ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`❌ FAIL: ${name} -> ${err.message}`);
    process.exitCode = 1;
  }
}

const html = fs.readFileSync('index.html', 'utf8');
const appJs = fs.readFileSync('app.js', 'utf8');

// --- 1. SECTION HEADING & SUBTITLE ---
console.log('--- 1. Section Heading & Subtitle Verification ---');

test('Available Systems section has exact title and subtitle', () => {
  assert(html.includes('📦 Available Systems Ready for Immediate Assignment'), 'Section must contain exact title');
  assert(html.includes('Unassigned devices in IT inventory ready for immediate employee provisioning'), 'Section must contain exact subtitle');
});

// --- 2. TABLE STRUCTURE & COLUMNS ---
console.log('\n--- 2. Table Structure & Columns ---');

test('Available Systems table header contains Actions column and exactly 11 columns', () => {
  const idx = html.indexOf('id="nonAssignedTableBody"');
  const prevTableIdx = html.lastIndexOf('<table', idx);
  const tableChunk = html.substring(prevTableIdx, idx);
  const thMatches = tableChunk.match(/<th[\s\S]*?<\/th>/g) || [];
  assert.strictEqual(thMatches.length, 11, `Expected 11 columns, got ${thMatches.length}`);
  assert(tableChunk.includes('Actions'), 'Actions header must exist');
});

test('Empty state in renderNonAssignedView matches 11 columns', () => {
  const checkIdx = appJs.indexOf('nonAssigned.length === 0');
  const emptyChunk = appJs.substring(checkIdx, checkIdx + 200);
  assert(emptyChunk.includes('colspan="11"'), 'Empty state must use colspan="11"');
});

// --- 3. ROW ACTIONS IN RENDERNONASSIGNEDVIEW ---
console.log('\n--- 3. Row Actions in renderNonAssignedView ---');

test('renderNonAssignedView template includes Eye View, Edit, and Delete action buttons', () => {
  const mapStart = appJs.indexOf('tbody.innerHTML = nonAssigned.map');
  const mapEnd = appJs.indexOf("}).join('');", mapStart) + "}).join('');".length;
  const rowTemplate = appJs.substring(mapStart, mapEnd);

  // Eye View button
  assert(rowTemplate.includes('window.ITApp.viewAvailableSystem'), 'Row must contain viewAvailableSystem');
  assert(rowTemplate.includes('👁️'), 'Row must contain 👁️ icon');

  // Edit button
  assert(rowTemplate.includes('window.ITApp.editAvailableSystem'), 'Row must contain editAvailableSystem');
  assert(rowTemplate.includes('✏️'), 'Row must contain ✏️ icon');

  // Delete button
  assert(rowTemplate.includes('window.ITApp.deleteAvailableSystem'), 'Row must contain deleteAvailableSystem');
  assert(rowTemplate.includes('🗑️'), 'Row must contain 🗑️ icon');
});

// --- 4. EXPOSURE ON WINDOW.ITAPP ---
console.log('\n--- 4. window.ITApp Exposed Methods ---');

test('window.ITApp exposes viewAvailableSystem, editAvailableSystem, deleteAvailableSystem, renderNonAssignedTable', () => {
  const itAppIdx = appJs.indexOf('window.ITApp = {');
  assert(itAppIdx !== -1, 'window.ITApp = { must be present');
  const chunk = appJs.substring(itAppIdx, itAppIdx + 3000);

  assert(chunk.includes('viewAvailableSystem(assetId)'), 'window.ITApp must expose viewAvailableSystem');
  assert(chunk.includes('editAvailableSystem(assetId)'), 'window.ITApp must expose editAvailableSystem');
  assert(chunk.includes('deleteAvailableSystem(assetId)'), 'window.ITApp must expose deleteAvailableSystem');
  assert(chunk.includes('renderNonAssignedTable()'), 'window.ITApp must expose renderNonAssignedTable');
});

// --- 5. EYE VIEW SPECIFICATIONS & MISSING VALUE HANDLING ---
console.log('\n--- 5. Eye View Details & Missing Value Rule (—) ---');

test('viewAvailableSystem displays all required fields and replaces missing values with —', () => {
  const fnStart = appJs.indexOf('viewAvailableSystem(assetId) {');
  assert(fnStart !== -1, 'viewAvailableSystem method must exist');
  const fnEnd = appJs.indexOf('editAvailableSystem(assetId) {', fnStart);
  const fnBody = appJs.substring(fnStart, fnEnd);

  // Required display sections and fields
  assert(fnBody.includes('Asset ID'), 'Must display Asset ID');
  assert(fnBody.includes('Category'), 'Must display Category');
  assert(fnBody.includes('Hardware Specifications') || fnBody.includes('Hardware Asset Specification'), 'Must display Hardware Specifications');
  assert(fnBody.includes('Specification Details'), 'Must display Specification Details');
  assert(fnBody.includes('CPU Configuration'), 'Must display CPU');
  assert(fnBody.includes('RAM Memory'), 'Must display RAM');
  assert(fnBody.includes('SSD Storage'), 'Must display SSD');
  assert(fnBody.includes('HDD Storage'), 'Must display HDD');
  assert(fnBody.includes('Monitor Model / Display'), 'Must display Monitor');
  assert(fnBody.includes('Operating System'), 'Must display OS');
  assert(fnBody.includes('IP Address'), 'Must display IP Address');
  assert(fnBody.includes('SMPS / Power Supply'), 'Must display SMPS');
  assert(fnBody.includes('Serial Number'), 'Must display Serial Number');
  assert(fnBody.includes('Purchase Date'), 'Must display Purchase Date');
  assert(fnBody.includes('Warranty Status'), 'Must display Warranty Status');
  assert(fnBody.includes('Previous User'), 'Must display Previous User');
  assert(fnBody.includes('Work Status'), 'Must display Work Status');
  assert(fnBody.includes('Office Location (Floor)'), 'Must display Location');
  assert(fnBody.includes('Department / Team'), 'Must display Team');
  assert(fnBody.includes('Hardware Condition'), 'Must display Condition');
  assert(fnBody.includes('Remarks'), 'Must display Remarks');

  // Missing values display '—'
  assert(fnBody.includes("return '—';"), "displayVal must return '—' for missing/empty/null/none values");
});

// --- 6. EDIT STOCK ENTRY IMPLEMENTATION ---
console.log('\n--- 6. Edit Stock Entry Form & Value Preservation ---');

test('editAvailableSystem delegates to openInstockEntryModal with assetId', () => {
  const fnStart = appJs.indexOf('editAvailableSystem(assetId) {');
  assert(fnStart !== -1, 'editAvailableSystem method must exist');
  const fnEnd = appJs.indexOf('deleteAvailableSystem(assetId)', fnStart);
  const fnBody = appJs.substring(fnStart, fnEnd);
  assert(fnBody.includes('this.openInstockEntryModal(null, assetId)'), 'Must call openInstockEntryModal with assetId');
});

test('openInstockEntryModal shows Edit Stock Entry title when editing existing system', () => {
  assert(appJs.includes('titleEl.textContent = `Edit Stock Entry (${sys.id || editId})`'), 'Modal title must be Edit Stock Entry (ID)');
});

test('handleInstockFormSubmit preserves existing unchanged asset values and refreshes available systems view', () => {
  const submitIdx = appJs.indexOf('async handleInstockFormSubmit(event)');
  const submitChunk = appJs.substring(submitIdx, submitIdx + 25000);

  assert(submitChunk.includes('...existingAsset'), 'Payload must merge existingAsset to preserve unchanged values');
  assert(submitChunk.includes('this.renderNonAssignedView()'), 'Must call renderNonAssignedView to refresh list immediately');
});

// --- 7. DELETE CONFIRMATION & SAFETY RULES ---
console.log('\n--- 7. Safe Deletion Workflow & Confirmation ---');

test('deleteAvailableSystem shows confirmation with selected Asset ID and safe cancellation', () => {
  const fnStart = appJs.indexOf('async deleteAvailableSystem(assetId) {');
  assert(fnStart !== -1, 'deleteAvailableSystem must exist');
  const fnEnd = appJs.indexOf('openQuickAssignModal(assetId)', fnStart);
  const fnBody = appJs.substring(fnStart, fnEnd);

  // Safety checks
  assert(fnBody.includes("role === 'Viewer'"), 'Must guard against Viewer deletion');
  assert(fnBody.includes("asset.status === 'Assigned'"), 'Must prevent deleting assigned active assets');

  // Confirmation dialog with Asset ID
  assert(fnBody.includes('confirmSave'), 'Must call confirmSave for confirmation');
  assert(fnBody.includes('asset.id'), 'Must display selected Asset ID in confirmation');
  assert(fnBody.includes('if (!confirmed)'), 'Must cancel and return if not confirmed');

  // Safe deletion & refresh
  assert(fnBody.includes("fetch(`/api/assets/${encodeURIComponent(asset.id)}`, { method: 'DELETE' })"), 'Must call DELETE /api/assets/:id');
  assert(fnBody.includes('this.renderNonAssignedView()'), 'Must call renderNonAssignedView after deletion');
});

// --- 8. LIVE API VERIFICATION ---
console.log('\n--- 8. Live Server API Check ---');

async function checkServer() {
  await asyncTest('Local API responds and contains inventory data', () => {
    return new Promise((resolve, reject) => {
      http.get('http://localhost:3000/api/assets', (res) => {
        let rawData = '';
        res.on('data', chunk => rawData += chunk);
        res.on('end', () => {
          try {
            assert.strictEqual(res.statusCode, 200, `Expected 200, got ${res.statusCode}`);
            const assets = JSON.parse(rawData);
            assert(Array.isArray(assets), 'Assets must be an array');
            assert(assets.length > 0, 'Assets array must not be empty');

            const unassigned = assets.filter(a => a.status === 'Non-Assigned' || a.status === 'Available');
            console.log(`    Live unassigned systems in inventory: ${unassigned.length}`);
            resolve();
          } catch (e) {
            reject(e);
          }
        });
      }).on('error', reject);
    });
  });

  console.log('\n================================================================');
  console.log(`🏁 RESULT: ${passedTests} / ${totalTests} TESTS PASSED!`);
  console.log('================================================================\n');

  if (passedTests !== totalTests) {
    process.exit(1);
  }
}

checkServer();
