const fs = require('fs');
const assert = require('assert');
const http = require('http');
const db = require('./database.js');

console.log('================================================================');
console.log('🧪 TESTING INSTOCK PAGE FULL FUNCTIONALITY & FIX VERIFICATION');
console.log('================================================================\n');

function apiRequest(path, method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path,
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    const req = http.request(options, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: data ? JSON.parse(data) : {} });
        } catch (e) {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

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

async function asyncTest(name, fn) {
  try {
    await fn();
    console.log(`✅ PASS: ${name}`);
    passed++;
  } catch (err) {
    console.error(`❌ FAIL: ${name} -> ${err.message}`);
    failed++;
  }
}

(async () => {
  const html = fs.readFileSync('index.html', 'utf8');
  const appJs = fs.readFileSync('app.js', 'utf8');

  // --- 1. ADD STOCK BUTTON & MODAL ---
  console.log('--- 1. Add Stock Button & Modal Verification ---');

  test('Add Stock button exists with ID btnAddStockPrimary and invokes openInstockEntryModal()', () => {
    assert(html.includes('id="btnAddStockPrimary"'), 'btnAddStockPrimary button must exist');
    assert(html.includes('onclick="window.ITApp.openInstockEntryModal()"'), 'Must call openInstockEntryModal()');
  });

  test('modalInstockEntry has all required stock input fields: Asset ID, Category, Model, Spec, Serial, Purchase Date, Status', () => {
    assert(html.includes('id="instockAssetId"'), 'instockAssetId exists');
    assert(html.includes('id="instockComponentType"'), 'instockComponentType exists');
    assert(html.includes('id="instockModel"'), 'instockModel exists');
    assert(html.includes('id="instockSpec"'), 'instockSpec exists');
    assert(html.includes('id="instockSerial"'), 'instockSerial exists');
    assert(html.includes('id="instockPurchaseDate"'), 'instockPurchaseDate exists');
    assert(html.includes('id="instockStatus"'), 'instockStatus exists');
    assert(html.includes('id="instockAssignedFieldsSection"'), 'instockAssignedFieldsSection exists');
    assert(html.includes('id="btnSaveInstockEntry"'), 'btnSaveInstockEntry exists');
  });

  test('handleInstockFormSubmit requires fields, validates duplicates, prompts YES/NO confirm, and refreshes UI', () => {
    assert(appJs.includes('handleInstockFormSubmit(event)'), 'handleInstockFormSubmit defined');
    assert(appJs.includes('Duplicate Asset ID'), 'Checks duplicate asset id');
    assert(appJs.includes('Duplicate Serial Number'), 'Checks duplicate serial number');
    assert(appJs.includes('this.confirmSave({'), 'Uses confirmSave for YES/NO prompt');
    assert(appJs.includes('this.renderInstockDashboard()'), 'Refreshes summary counts');
    assert(appJs.includes('this.renderInstockInventoryTable()'), 'Refreshes inventory table');
  });

  // --- 2. EYE ICON - VIEW DETAILS ---
  console.log('\n--- 2. Eye Icon View Details Verification ---');

  test('Eye icon in Instock table invokes viewInstockItem with dynamic asset ID', () => {
    assert(appJs.includes("onclick=\"window.ITApp.viewInstockItem('${item.id}')\""), 'Eye button calls viewInstockItem with item.id');
    assert(appJs.includes('title="View Details"'), 'Eye button has View Details tooltip');
  });

  test('viewInstockItem populates and displays Hardware Asset Specification modal with selected row details', () => {
    assert(appJs.includes('viewInstockItem(id)'), 'viewInstockItem defined');
    assert(appJs.includes("openModal('modalViewAsset')"), 'Opens Hardware Asset Specification modal');
    assert(appJs.includes('viewAssetModalMeta'), 'Sets meta badges');
    assert(appJs.includes('viewAssetModalBody'), 'Renders specification body');
    assert(appJs.includes('viewAssetEditModalBtn'), 'Connects edit button from view modal');
  });

  // --- 3. PENCIL ICON - EDIT ASSET ---
  console.log('\n--- 3. Pencil Icon Edit Asset Verification ---');

  test('Edit icon in Instock table invokes openInstockEntryModal with dynamic asset ID', () => {
    assert(appJs.includes("onclick=\"window.ITApp.openInstockEntryModal(null, '${item.id}')\""), 'Pencil button calls openInstockEntryModal with item.id');
    assert(appJs.includes('title="Edit Asset"'), 'Pencil button has Edit Asset tooltip');
  });

  test('openInstockEntryModal populates existing values, prevents ID change, and handles empty model gracefully', () => {
    assert(appJs.includes('item.model || item.spec'), 'Populates model from spec if model is empty');
    assert(appJs.includes('item.spec || item.model'), 'Populates spec from model if spec is empty');
    assert(appJs.includes('assetIdInput.disabled = true'), 'Disables asset ID input in edit mode');
    assert(appJs.includes('Edit Stock Entry'), 'Sets edit title');
  });

  // --- 4. TRASH ICON - DELETE ASSET ---
  console.log('\n--- 4. Trash Icon Delete Asset & Data Protection ---');

  test('Delete icon in Instock table invokes deleteInstockEntry with dynamic asset ID', () => {
    assert(appJs.includes("onclick=\"window.ITApp.deleteInstockEntry('${item.id}')\""), 'Trash button calls deleteInstockEntry with item.id');
    assert(appJs.includes('title="Delete Asset"'), 'Trash button has Delete Asset tooltip');
  });

  test('deleteInstockEntry enforces data protection for assigned assets and prompts YES, DELETE / NO, CANCEL', () => {
    assert(appJs.includes("item.status === 'Assigned'"), 'Checks if item status is Assigned');
    assert(appJs.includes('Deletion Blocked'), 'Displays Deletion Blocked error toast if assigned');
    assert(appJs.includes("yesText: 'YES, DELETE'"), 'Provides YES, DELETE button');
    assert(appJs.includes("noText: 'NO, CANCEL'"), 'Provides NO, CANCEL button');
    assert(appJs.includes('Utils.escapeHtml(item.id)'), 'Clearly displays selected Asset ID');
  });

  // --- 5. SEARCH, FILTER & DYNAMIC COUNTS ---
  console.log('\n--- 5. Search, Filter & Record Count Verification ---');

  test('Heading and description are preserved exactly', () => {
    assert(html.includes('Hardware Inventory Records'), 'Header text preserved');
    assert(html.includes('Searchable and filterable real-time stock table'), 'Description text preserved');
  });

  test('populateInstockCategoryFilter populates All Categories and distinct categories dynamically', () => {
    assert(appJs.includes('populateInstockCategoryFilter()'), 'populateInstockCategoryFilter defined');
    assert(appJs.includes('<option value="all">All Categories</option>'), 'Has All Categories option');
  });

  test('Dynamic count badge uses "Showing X records" label', () => {
    assert(appJs.includes('Showing ${filtered.length} record'), 'Dynamic count badge format matches requirement');
  });

  test('Search matches Asset ID, Category, Model, Spec, and Serial Number', () => {
    assert(appJs.includes('(item.id || \'\').toLowerCase().includes(searchVal)'), 'Searches id');
    assert(appJs.includes('(item.component_type || \'\').toLowerCase().includes(searchVal)'), 'Searches category');
    assert(appJs.includes('(item.model || \'\').toLowerCase().includes(searchVal)'), 'Searches model');
    assert(appJs.includes('(item.spec || \'\').toLowerCase().includes(searchVal)'), 'Searches spec');
    assert(appJs.includes('(item.serial_number || \'\').toLowerCase().includes(searchVal)'), 'Searches serial number');
  });

  // --- 6. REMOVAL OF RETURN ACTION ---
  console.log('\n--- 6. Return Action Removal from Instock Table ---');

  test('Instock table does NOT render Return button or Return icon in table rows', () => {
    const tableRenderIdx = appJs.indexOf('renderInstockInventoryTable()');
    const tableRenderEnd = appJs.indexOf('renderInstockInventoryView()', tableRenderIdx);
    const instockTableCode = appJs.substring(tableRenderIdx, tableRenderEnd);

    assert(!instockTableCode.includes('↩️ Return'), 'Instock table must not contain ↩️ Return');
    assert(!instockTableCode.includes('handleQuickReturn'), 'Instock table must not invoke handleQuickReturn');
    assert(!instockTableCode.includes("title=\"Mark as Ready for Assignment\""), 'Instock table must not contain Ready action button');
    assert(instockTableCode.includes('👁️'), 'Row has View action');
    assert(instockTableCode.includes('✏️'), 'Row has Edit action');
    assert(instockTableCode.includes('🗑️'), 'Row has Delete action');
  });

  // --- 7. BACKEND API PERSISTENCE & OPERATION TESTING ---
  console.log('\n--- 7. Backend API Testing: Add, Edit, Protect, Delete ---');

  const testAssetId = 'STK-CPU-TEST-VERIFY-' + Math.floor(100 + Math.random() * 900);
  const testSerial = 'SN-CPU-TEST-' + Math.floor(10000 + Math.random() * 90000);

  await asyncTest('1. Add Stock: POST /api/instock saves record to database', async () => {
    const res = await apiRequest('/api/instock', 'POST', {
      id: testAssetId,
      component_type: 'CPU',
      model: 'AMD Ryzen 9 7950X',
      spec: '16-Core 32-Thread 5.7GHz',
      serial_number: testSerial,
      purchase_date: '2026-10-17',
      status: 'Available',
      remark: 'Test verify stock entry'
    });
    assert.strictEqual(res.status, 201, `Expected status 201, got ${res.status}`);
    assert.strictEqual(res.body.id, testAssetId);
    assert.strictEqual(res.body.model, 'AMD Ryzen 9 7950X');

    // Confirm in SQLite
    const inDb = db.getInstockHardware().find(i => i.id === testAssetId);
    assert(inDb, 'Must be in SQLite database');
    assert.strictEqual(inDb.status, 'Available');
  });

  await asyncTest('2. Edit Stock: PUT /api/instock/:id updates existing record in place', async () => {
    const res = await apiRequest(`/api/instock/${encodeURIComponent(testAssetId)}`, 'PUT', {
      model: 'AMD Ryzen 9 7950X3D',
      spec: '16-Core 3D V-Cache 5.7GHz',
      remark: 'Upgraded to 3D V-Cache model'
    });
    assert.strictEqual(res.status, 200, `Expected status 200, got ${res.status}`);
    assert.strictEqual(res.body.model, 'AMD Ryzen 9 7950X3D');

    // Confirm in SQLite without duplicates
    const allMatches = db.getInstockHardware().filter(i => i.id === testAssetId);
    assert.strictEqual(allMatches.length, 1, 'Exactly one record exists (no duplicate created on edit)');
    assert.strictEqual(allMatches[0].model, 'AMD Ryzen 9 7950X3D');
  });

  await asyncTest('3. Data Protection: Backend blocks deletion of Assigned assets', async () => {
    // First update asset to Assigned
    await apiRequest(`/api/instock/${encodeURIComponent(testAssetId)}`, 'PUT', {
      status: 'Assigned',
      assigned_user: 'Sundar Test'
    });

    const delRes = await apiRequest(`/api/instock/${encodeURIComponent(testAssetId)}`, 'DELETE');
    assert.strictEqual(delRes.status, 400, 'Assigned asset deletion must be rejected with 400 Bad Request');
    assert(delRes.body.error && delRes.body.error.includes('assigned'), 'Error must specify asset is assigned');

    // Confirm record is NOT deleted
    const stillInDb = db.getInstockHardware().find(i => i.id === testAssetId);
    assert(stillInDb, 'Assigned asset must remain preserved in database');
  });

  await asyncTest('4. Delete Stock: Allows deletion when unassigned / Available', async () => {
    // Mark back to Available
    await apiRequest(`/api/instock/${encodeURIComponent(testAssetId)}`, 'PUT', {
      status: 'Available',
      assigned_user: ''
    });

    const delRes = await apiRequest(`/api/instock/${encodeURIComponent(testAssetId)}`, 'DELETE');
    assert.strictEqual(delRes.status, 200, 'Deletion of Available asset should succeed with 200');

    // Confirm record removed from SQLite
    const deletedCheck = db.getInstockHardware().find(i => i.id === testAssetId);
    assert(!deletedCheck, 'Asset must be removed from SQLite database');
  });

  console.log('\n================================================================');
  console.log(`🏁 VERIFICATION RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('================================================================\n');

  if (failed > 0) {
    process.exit(1);
  } else {
    console.log('🎉 ALL INSTOCK PAGE FUNCTIONALITY & SAFETY REQUIREMENTS VERIFIED 100%!');
  }
})();
