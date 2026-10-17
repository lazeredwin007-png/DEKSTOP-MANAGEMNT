const fs = require('fs');
const assert = require('assert');
const http = require('http');
const db = require('./database.js');

console.log('================================================================');
console.log('🧪 TESTING INSTOCK ADD/EDIT FORMS & STOCK HISTORY FUNCTIONALITY');
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

  // --- STEP 1: ADD STOCK FORM VERIFICATION ---
  console.log('--- 1. Add Stock Form Verification ---');

  test('Form contains all required fields: Category, Spec/Model, Serial, Purchase Date, Current Status', () => {
    assert(html.includes('id="instockComponentType"'), 'Must have Category select');
    assert(html.includes('id="instockModel"'), 'Must have Hardware Item / Model input');
    assert(html.includes('id="instockSpec"'), 'Must have Specification input');
    assert(html.includes('id="instockSerial"'), 'Must have Serial Number input');
    assert(html.includes('id="instockPurchaseDate"'), 'Must have Purchase Date input');
    assert(html.includes('id="instockStatus"'), 'Must have Current Status select');
    assert(html.includes('Non-Assigned (Available in Stock)'), 'Status dropdown must include Non-Assigned');
    assert(html.includes('value="Assigned"'), 'Status dropdown must include Assigned');
    assert(!html.includes('Under Maintenance (Non-Assigned)'), 'Under Maintenance (Non-Assigned) must be removed');
  });

  test('Required validation enforces mandatory fields and duplicates', () => {
    assert(appJs.includes('Asset ID is required.'), 'Validates Asset ID');
    assert(appJs.includes('Hardware Category is required.'), 'Validates Category');
    assert(appJs.includes('Specification / Model is required.'), 'Validates Spec/Model');
    assert(appJs.includes('Serial Number is required.'), 'Validates Serial Number');
    assert(appJs.includes('Purchase Date is required.'), 'Validates Purchase Date');
    assert(appJs.includes('Current Status is required.'), 'Validates Status');
    assert(appJs.includes('Duplicate Asset ID'), 'Validates duplicate Asset ID');
    assert(appJs.includes('Duplicate Serial Number'), 'Validates duplicate Serial Number');
  });

  // --- STEP 2: EDIT STOCK FORM & STATUS-DEPENDENT BEHAVIOR ---
  console.log('\n--- 2. Edit Stock Form & Status-Dependent Behavior ---');

  test('Edit form removes Assigned User Name, Assigned Date, and Remarks fields', () => {
    assert(!html.includes('Assigned User Name (yaruku)'), 'Assigned User Name (yaruku) must be removed');
    assert(!html.includes('Assigned Date (yapo)'), 'Assigned Date (yapo) must be removed');
    assert(!html.includes('id="instockRemark"'), 'Remarks field (instockRemark) must be removed from Edit form');
  });

  test('Form does not require removed fields to save', () => {
    assert(!appJs.includes('Assigned User Name is required when status is Assigned.'), 'Assigned User Name is not required');
    assert(!appJs.includes('Assigned Date is required when status is Assigned.'), 'Assigned Date is not required');
  });

  test('Status badges display Non-Assigned in red and Assigned in green', () => {
    assert(appJs.includes('🔴 Non-Assigned (Available in Stock)'), 'Non-Assigned displays red indicator and exact label');
    assert(appJs.includes('🟢 Assigned'), 'Assigned displays green indicator and exact label');
    assert(appJs.includes('#fef2f2'), 'Non-Assigned uses light red background');
    assert(appJs.includes('#991b1b'), 'Non-Assigned uses dark red text');
    assert(appJs.includes('#f0fdf4'), 'Assigned uses light green background');
    assert(appJs.includes('#166534'), 'Assigned uses dark green text');
  });

  // --- STEP 3: STOCK & ASSIGNMENT HISTORY ACTION & MODAL ---
  console.log('\n--- 3. Stock & Assignment History Action & Modal ---');

  test('History modal exists in index.html with timeline container and badge', () => {
    assert(html.includes('id="modalInstockHistory"'), 'modalInstockHistory must exist');
    assert(html.includes('id="instockHistoryContainer"'), 'instockHistoryContainer must exist');
    assert(html.includes('id="instockHistoryAssetIdBadge"'), 'instockHistoryAssetIdBadge must exist');
    assert(html.includes('Stock &amp; Assignment History'), 'Modal title reflects Stock & Assignment History');
  });

  test('Instock inventory table rows have 📜 History action button', () => {
    assert(appJs.includes('openInstockHistoryModal(\'${item.id}\')'), 'Table row has openInstockHistoryModal call');
    assert(appJs.includes('title="Stock & Assignment History"'), 'Has Stock & Assignment History title');
  });

  test('View Asset Specification modal includes 📜 View History button', () => {
    assert(html.includes('id="viewAssetHistoryModalBtn"'), 'viewAssetHistoryModalBtn exists in specification modal');
    assert(appJs.includes('openInstockHistoryModal(item.id)'), 'viewAssetHistoryModalBtn calls openInstockHistoryModal');
  });

  test('openInstockHistoryModal displays all required event fields and proper action tags', () => {
    assert(appJs.includes('ev.action_type'), 'Displays action type');
    assert(appJs.includes('ev.prev_status'), 'Displays previous status');
    assert(appJs.includes('ev.new_status'), 'Displays new status');
    assert(appJs.includes('ev.employee_name'), 'Displays employee name');
    assert(appJs.includes('ev.team'), 'Displays team');
    assert(appJs.includes('ev.tl'), 'Displays TL');
    assert(appJs.includes('ev.event_date'), 'Displays event date');
    assert(appJs.includes('ev.reason'), 'Displays reason / notes');
    assert(appJs.includes('ev.performed_by'), 'Displays performed by user');
  });

  // --- STEP 4: BACKEND ENDPOINTS & PERSISTENCE VERIFICATION ---
  console.log('\n--- 4. Backend Endpoints & History Persistence Testing ---');

  const testAssetId = 'STK-CPU-HIST-TEST-' + Math.floor(100 + Math.random() * 900);
  const testSerial = 'SN-CPU-HIST-' + Math.floor(10000 + Math.random() * 90000);

  await asyncTest('1. Add Stock: POST /api/instock saves record and logs Purchase / Stock In event', async () => {
    const res = await apiRequest('/api/instock', 'POST', {
      id: testAssetId,
      component_type: 'CPU',
      model: 'Intel Core i9-13900K',
      spec: '24-Core 32-Thread 5.8GHz',
      serial_number: testSerial,
      purchase_date: '2026-10-17',
      status: 'Available',
      remark: 'New CPU purchased for high-perf rendering pool'
    });
    assert.strictEqual(res.status, 201, `Expected status 201, got ${res.status}`);
    assert.strictEqual(res.body.id, testAssetId);

    // Verify history recorded in SQLite
    const hist = db.getInstockHistory(testAssetId);
    assert(hist.length >= 1, 'At least 1 history event must exist');
    const stockInEv = hist.find(h => h.action_type === 'Purchase / Stock In');
    assert(stockInEv, 'Purchase / Stock In event must be recorded');
    assert.strictEqual(stockInEv.new_status, 'Available');
  });

  await asyncTest('2. Edit Stock to Assigned: PUT /api/instock/:id logs Assignment event and preserves history', async () => {
    const res = await apiRequest(`/api/instock/${encodeURIComponent(testAssetId)}`, 'PUT', {
      status: 'Assigned',
      assigned_user: 'Dinesh Kumar',
      team: 'AI',
      tl: 'Sundar Pichai',
      assigned_date: '2026-10-17',
      changing_reason: 'Assigned for LLM training server',
      remark: 'Allocated to AI Team'
    });
    assert.strictEqual(res.status, 200, `Expected status 200, got ${res.status}`);
    assert.strictEqual(res.body.status, 'Assigned');
    assert.strictEqual(res.body.assigned_user, 'Dinesh Kumar');

    // Verify history now contains Assignment event
    const hist = db.getInstockHistory(testAssetId);
    assert(hist.length >= 2, 'History must contain at least 2 events');
    const assignEv = hist.find(h => h.action_type === 'Assignment');
    assert(assignEv, 'Assignment event must be recorded');
    assert.strictEqual(assignEv.employee_name, 'Dinesh Kumar');
    assert.strictEqual(assignEv.team, 'AI');
    assert.strictEqual(assignEv.tl, 'Sundar Pichai');
  });

  await asyncTest('3. Edit Stock to Non-Assigned: PUT /api/instock/:id logs Unassignment and preserves past allocation', async () => {
    const res = await apiRequest(`/api/instock/${encodeURIComponent(testAssetId)}`, 'PUT', {
      status: 'Available',
      assigned_user: '',
      team: '',
      tl: '',
      assigned_date: '',
      remark: 'Returned from Dinesh Kumar, benchmark complete'
    });
    assert.strictEqual(res.status, 200, `Expected status 200, got ${res.status}`);
    assert.strictEqual(res.body.status, 'Available');
    assert.strictEqual(res.body.assigned_user, '');

    // Verify history now contains Unassignment event
    const hist = db.getInstockHistory(testAssetId);
    const unassignEv = hist.find(h => h.action_type === 'Unassignment');
    assert(unassignEv, 'Unassignment event must be recorded');
    assert.strictEqual(unassignEv.employee_name, 'Dinesh Kumar', 'Records the user who unassigned');
    assert.strictEqual(unassignEv.prev_status, 'Assigned');
    assert.strictEqual(unassignEv.new_status, 'Available');

    // Check past allocation is preserved as Returned, not deleted
    const allocs = db.getInstockAllocations().filter(a => a.asset_id === testAssetId);
    assert(allocs.length >= 1, 'Past allocation must be preserved in allocations table');
    assert.strictEqual(allocs[0].status, 'Returned', 'Allocation status marked Returned');
  });

  await asyncTest('4. History API: GET /api/instock/:id/history returns all persisted events', async () => {
    const res = await apiRequest(`/api/instock/${encodeURIComponent(testAssetId)}/history`);
    assert.strictEqual(res.status, 200, `Expected status 200, got ${res.status}`);
    assert(Array.isArray(res.body), 'Response must be an array of events');
    assert(res.body.length >= 3, `Expected at least 3 events, got ${res.body.length}`);
    const types = res.body.map(e => e.action_type);
    assert(types.includes('Purchase / Stock In'), 'Contains Purchase / Stock In');
    assert(types.includes('Assignment'), 'Contains Assignment');
    assert(types.includes('Unassignment'), 'Contains Unassignment');
  });

  await asyncTest('5. Cleanup: Delete test asset and verify records', async () => {
    const delRes = await apiRequest(`/api/instock/${encodeURIComponent(testAssetId)}`, 'DELETE');
    assert.strictEqual(delRes.status, 200);
    const inDb = db.getInstockHardware().find(i => i.id === testAssetId);
    assert(!inDb, 'Test asset deleted cleanly');
  });

  console.log('\n================================================================');
  console.log(`🏁 VERIFICATION RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('================================================================\n');

  if (failed > 0) {
    process.exit(1);
  } else {
    console.log('🎉 ALL INSTOCK FORMS & STOCK HISTORY REQUIREMENTS VERIFIED 100%!');
  }
})();
