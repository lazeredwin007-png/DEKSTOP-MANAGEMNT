const http = require('http');
const fs = require('fs');
const assert = require('assert');
const db = require('./database.js');

console.log('================================================================');
console.log('🧪 VERIFYING IN-STOCK DASHBOARD: + NEW ENTRY & + ADD STOCK FIX');
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
let total = 0;

function test(name, fn) {
  total++;
  try {
    fn();
    console.log(`✅ PASS: ${name}`);
    passed++;
  } catch (err) {
    console.error(`❌ FAIL: ${name} -> ${err.message}`);
    process.exitCode = 1;
  }
}

async function asyncTest(name, fn) {
  total++;
  try {
    await fn();
    console.log(`✅ PASS: ${name}`);
    passed++;
  } catch (err) {
    console.error(`❌ FAIL: ${name} -> ${err.message}`);
    process.exitCode = 1;
  }
}

(async () => {
  const html = fs.readFileSync('index.html', 'utf8');
  const appJs = fs.readFileSync('app.js', 'utf8');

  console.log('--- 1. MODAL STRUCTURE & FIELD COMPLETENESS ---');

  test('modalInstockEntry has single unique modal ID in index.html', () => {
    const matches = html.match(/id="modalInstockEntry"/g) || [];
    assert.strictEqual(matches.length, 1, 'There must be exactly one modalInstockEntry ID');
  });

  test('formInstockEntry contains all required fields: Asset ID, Category, Spec, Serial, Purchase Date, Current Status', () => {
    assert(html.includes('id="instockAssetId"'), 'Modal must have instockAssetId input');
    assert(html.includes('id="instockComponentType"'), 'Modal must have instockComponentType select');
    assert(html.includes('id="instockSpec"'), 'Modal must have instockSpec input');
    assert(html.includes('id="instockSerial"'), 'Modal must have instockSerial input');
    assert(html.includes('id="instockPurchaseDate"'), 'Modal must have instockPurchaseDate input');
    assert(html.includes('id="instockStatus"'), 'Modal must have instockStatus select');
    assert(html.includes('id="instockAssignedFieldsSection"'), 'Modal must have dynamic assignment fields');
    assert(html.includes('id="btnSaveInstockEntry"'), 'Modal must have Save button');
    assert(html.includes('id="btnCancelInstockEntry"'), 'Modal must have Cancel button');
  });

  test('Dashboard contains both + Add Stock Item and category + New Entry buttons with correct bindings', () => {
    assert(html.includes('id="btnAddStockItemDashboard"'), 'Dashboard has + Add Stock Item button');
    assert(html.includes('window.ITApp.openInstockEntryModal()'), 'Add stock item button invokes openInstockEntryModal()');
    assert(html.includes('id="btnNewEntryCPU"'), 'CPU card has btnNewEntryCPU');
    assert(html.includes("window.ITApp.openInstockEntryModal('CPU')"), 'CPU New Entry button opens modal with CPU pre-selected');
    assert(html.includes('id="btnNewEntrySSD"'), 'SSD card has btnNewEntrySSD');
    assert(html.includes('id="btnNewEntryRAM"'), 'RAM card has btnNewEntryRAM');
    assert(html.includes('id="btnNewEntrySMPS"'), 'SMPS card has btnNewEntrySMPS');
    assert(html.includes('id="btnNewEntryMONITOR"'), 'MONITOR card has btnNewEntryMONITOR');
    assert(html.includes('id="btnNewEntryOTHER"'), 'OTHER card has btnNewEntryOTHER');
  });

  test('Dashboard contains Live Stock Inventory Table (#instockInventoryTable and #instockInventoryTableBody)', () => {
    assert(html.includes('id="instockInventoryTable"'), 'Dashboard must contain instockInventoryTable');
    assert(html.includes('id="instockInventoryTableBody"'), 'Dashboard must contain instockInventoryTableBody');
    assert(html.includes('id="instockInventorySearch"'), 'Dashboard must contain search input');
    assert(html.includes('id="instockInventoryCategoryFilter"'), 'Dashboard must contain category filter');
    assert(html.includes('id="instockInventoryStatusFilter"'), 'Dashboard must contain status filter');
  });

  console.log('\n--- 2. JS CONTROLLER LOGIC & CONNECTION ---');

  test('app.js exposes unified entry and category handling methods on window.ITApp', () => {
    assert(appJs.includes('openInstockEntryModal('), 'app.js implements openInstockEntryModal');
    assert(appJs.includes('handleInstockFormSubmit('), 'app.js implements handleInstockFormSubmit');
    assert(appJs.includes('handleInstockCategoryChange('), 'app.js implements handleInstockCategoryChange');
    assert(appJs.includes('getNextInstockAssetId('), 'app.js implements getNextInstockAssetId');
    assert(appJs.includes('toggleInstockAssignmentFields('), 'app.js implements toggleInstockAssignmentFields');
  });

  console.log('\n--- 3. BACKEND API & DATA PERSISTENCE VERIFICATION ---');

  const initialItems = db.getInstockHardware();
  const initialTotal = initialItems.length;
  const initialCpuStock = initialItems.filter(i => (i.component_type || '').toUpperCase() === 'CPU' && (i.status || 'Available') === 'Available').length;
  const initialSsdStock = initialItems.filter(i => (i.component_type || '').toUpperCase() === 'SSD' && (i.status || 'Available') === 'Available').length;

  console.log(`    Current SQLite instock hardware records: ${initialTotal}`);
  console.log(`    Current CPU Available stock: ${initialCpuStock}`);
  console.log(`    Current SSD Available stock: ${initialSsdStock}`);

  // Test Asset 1: + New Entry (CPU)
  const testCpuId = 'STK-CPU-TEST-991';
  const testCpuSerial = 'SN-CPU-TEST-88191';

  await asyncTest('+ New Entry: Save a test CPU asset to SQLite database via /api/instock', async () => {
    const res = await apiRequest('/api/instock', 'POST', {
      id: testCpuId,
      component_type: 'CPU',
      spec: 'Intel Core i9-14900K 24-Core 6.0GHz Boxed',
      serial_number: testCpuSerial,
      purchase_date: '2026-10-16',
      status: 'Available',
      remark: 'Test entry from + New Entry button'
    });

    assert.strictEqual(res.status, 201, `Expected status 201 Created, got ${res.status}`);
    assert.strictEqual(res.body.id, testCpuId);
    assert.strictEqual(res.body.component_type, 'CPU');
    assert.strictEqual(res.body.status, 'Available');

    // Confirm persisted in SQLite database
    const dbItem = db.getInstockHardware().find(i => i.id === testCpuId);
    assert(dbItem, 'Record must exist in SQLite instock_hardware table');
    assert.strictEqual(dbItem.spec, 'Intel Core i9-14900K 24-Core 6.0GHz Boxed');
  });

  // Test Asset 2: + Add Stock Item (SSD)
  const testSsdId = 'STK-SSD-TEST-992';
  const testSsdSerial = 'SN-SSD-TEST-88192';

  await asyncTest('+ Add Stock Item: Save a test SSD asset using same endpoint and data source', async () => {
    const res = await apiRequest('/api/instock', 'POST', {
      id: testSsdId,
      component_type: 'SSD',
      spec: 'Samsung 990 Pro 2TB PCIe 4.0 NVMe SSD',
      serial_number: testSsdSerial,
      purchase_date: '2026-10-16',
      status: 'Available',
      remark: 'Test entry from + Add Stock Item button'
    });

    assert.strictEqual(res.status, 201, `Expected status 201 Created, got ${res.status}`);
    assert.strictEqual(res.body.id, testSsdId);
    assert.strictEqual(res.body.component_type, 'SSD');

    // Confirm persisted in SQLite database
    const dbItem = db.getInstockHardware().find(i => i.id === testSsdId);
    assert(dbItem, 'Record must exist in SQLite instock_hardware table');
  });

  console.log('\n--- 4. DUPLICATE ASSET ID & SERIAL NUMBER HANDLING ---');

  await asyncTest('Prevent duplicate Asset ID: rejects duplicate ID with 409 status', async () => {
    const res = await apiRequest('/api/instock', 'POST', {
      id: testCpuId, // Duplicate
      component_type: 'CPU',
      spec: 'Another CPU',
      serial_number: 'SN-CPU-UNIQUE-777',
      purchase_date: '2026-10-16',
      status: 'Available'
    });

    assert.strictEqual(res.status, 409, `Expected 409 Conflict, got ${res.status}`);
    assert(res.body.error && res.body.error.includes('Duplicate Asset ID'), 'Error response must specify Duplicate Asset ID');
  });

  await asyncTest('Prevent duplicate Serial Number: rejects duplicate serial with 409 status', async () => {
    const res = await apiRequest('/api/instock', 'POST', {
      id: 'STK-CPU-ANOTHER-999',
      component_type: 'CPU',
      spec: 'Another CPU with same serial',
      serial_number: testCpuSerial, // Duplicate serial
      purchase_date: '2026-10-16',
      status: 'Available'
    });

    assert.strictEqual(res.status, 409, `Expected 409 Conflict, got ${res.status}`);
    assert(res.body.error && res.body.error.includes('Duplicate Serial Number'), 'Error response must specify Duplicate Serial Number');
  });

  await asyncTest('Validation: rejects request with missing required fields with 400 status', async () => {
    const res = await apiRequest('/api/instock', 'POST', {
      id: 'STK-CPU-INCOMPLETE',
      component_type: 'CPU'
      // missing spec, serial_number, purchase_date
    });

    assert.strictEqual(res.status, 400, `Expected 400 Bad Request, got ${res.status}`);
    assert(res.body.error, 'Error response must provide explanation of missing fields');
  });

  console.log('\n--- 5. PERSISTENCE AFTER RELOAD & METRIC REFRESH ---');

  await asyncTest('Both records persist across server read / dump (authoritative data source)', async () => {
    const dumpRes = await apiRequest('/api/database/dump');
    assert.strictEqual(dumpRes.status, 200);
    const dumpHw = dumpRes.body.instockHardware || [];

    const foundCpu = dumpHw.find(i => i.id === testCpuId);
    const foundSsd = dumpHw.find(i => i.id === testSsdId);

    assert(foundCpu, 'Test CPU item must persist in /api/database/dump');
    assert(foundSsd, 'Test SSD item must persist in /api/database/dump');

    // Verify updated category counts
    const updatedCpuStock = dumpHw.filter(i => (i.component_type || '').toUpperCase() === 'CPU' && (i.status || 'Available') === 'Available').length;
    const updatedSsdStock = dumpHw.filter(i => (i.component_type || '').toUpperCase() === 'SSD' && (i.status || 'Available') === 'Available').length;

    assert.strictEqual(updatedCpuStock, initialCpuStock + 1, 'CPU stock count must increment by 1');
    assert.strictEqual(updatedSsdStock, initialSsdStock + 1, 'SSD stock count must increment by 1');
    assert.strictEqual(dumpHw.length, initialTotal + 2, 'Total stock count must increment by 2');
  });

  // Clean up test records
  db.deleteInstockHardware(testCpuId);
  db.deleteInstockHardware(testSsdId);

  const cleanTotal = db.getInstockHardware().length;
  assert.strictEqual(cleanTotal, initialTotal, 'Database restored to initial state without altering existing operational records');

  console.log('\n================================================================');
  console.log(`🏁 IN-STOCK DASHBOARD VERIFICATION: ${passed} / ${total} PASSED`);
  console.log('================================================================\n');

  if (passed === total) {
    console.log('🎉 ALL REQUIREMENTS FOR + NEW ENTRY & + ADD STOCK ITEM FIX VERIFIED!');
    process.exit(0);
  } else {
    process.exit(1);
  }
})();
