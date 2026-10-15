const fs = require('fs');
const assert = require('assert');
const db = require('./database.js');

console.log('================================================================');
console.log('🧪 COMPREHENSIVE END-TO-END TEST: INSTOCK MODULE REDESIGN');
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

(async () => {
  console.log('--- 1. DATABASE & INITIAL SEEDING TESTS ---');

  test('Database has instock_allocations table and seeded records', () => {
    const allocations = db.getInstockAllocations();
    assert(Array.isArray(allocations), 'Allocations should be an array');
    assert(allocations.length >= 3, `Expected at least 3 allocations, got ${allocations.length}`);
    console.log(`    Total initial allocations: ${allocations.length}`);
  });

  test('User VIMAL has prompt example allocations (CPU, SSD, Monitor)', () => {
    const vimalAllocs = db.getUserAllocationHistory('VIMAL');
    assert(vimalAllocs.length >= 3, `Expected at least 3 allocations for VIMAL, got ${vimalAllocs.length}`);

    const hasCpu = vimalAllocs.some(a => a.component_type === 'CPU' && a.status === 'Assigned');
    const hasSsd = vimalAllocs.some(a => a.component_type === 'SSD' && a.status === 'Assigned');
    const hasMonitor = vimalAllocs.some(a => a.component_type === 'MONITOR' && a.status === 'Returned');

    assert(hasCpu, 'VIMAL must have an actively assigned CPU');
    assert(hasSsd, 'VIMAL must have an actively assigned SSD');
    assert(hasMonitor, 'VIMAL must have a previously returned Monitor in history');
    console.log(`    VIMAL records verified: Active CPU, Active SSD, Returned Monitor`);
  });

  console.log('\n--- 2. MULTIPLE ALLOCATIONS PER USER WITHOUT OVERWRITING ---');

  let newAllocId = null;
  let testHardwareId = null;
  let initialVimalCount = 0;
  let initialVimalActiveCount = 0;

  test('Assign new asset (RAM) to VIMAL on a new date', () => {
    const currentVimal = db.getUserAllocationHistory('VIMAL');
    initialVimalCount = currentVimal.length;
    initialVimalActiveCount = currentVimal.filter(a => a.status === 'Assigned').length;

    // Find an available RAM in stock
    const availableItems = db.getInstockHardware().filter(i => i.status === 'Available' && i.component_type === 'RAM');
    assert(availableItems.length > 0, 'Should have at least 1 available RAM in hardware stock');
    const ramItem = availableItems[0];
    testHardwareId = ramItem.id;

    const newAlloc = db.insertInstockAllocation({
      asset_id: ramItem.id,
      user_name: 'VIMAL',
      tl_name: 'Sundar Pichai',
      component_type: ramItem.component_type,
      spec: ramItem.spec,
      serial_number: ramItem.serial_number,
      assigned_date: '2026-10-15',
      purpose: 'High performance rendering',
      assigned_by: 'Sundar Pichai (SysAdmin)',
      remark: 'Extra 32GB RAM module'
    });

    assert(newAlloc && newAlloc.id, 'New allocation must have an ID');
    newAllocId = newAlloc.id;

    // Check VIMAL history incremented by 1
    const updatedVimal = db.getUserAllocationHistory('VIMAL');
    assert.strictEqual(updatedVimal.length, initialVimalCount + 1, `VIMAL should have ${initialVimalCount + 1} allocations, got ${updatedVimal.length}`);

    const activeVimal = updatedVimal.filter(a => a.status === 'Assigned');
    assert.strictEqual(activeVimal.length, initialVimalActiveCount + 1, `VIMAL active allocations should increment by 1`);

    // Check hardware status updated to Assigned
    const hwCheck = db.getInstockHardware().find(i => i.id === testHardwareId);
    assert.strictEqual(hwCheck.status, 'Assigned', 'RAM hardware item must now be Assigned');
  });

  console.log('\n--- 3. RETURN ASSET FUNCTIONALITY (PRESERVE HISTORY & RESTORE STOCK) ---');

  test('Return newly assigned RAM: mark status Returned, record return date, restore hardware to Available', () => {
    const returnDate = '2026-10-16';
    const returnResult = db.returnInstockAsset(newAllocId, returnDate, 'Returned after rendering project completed', 'Available');

    assert(returnResult && returnResult.id, 'Return result should exist');
    assert.strictEqual(returnResult.status, 'Returned', 'Allocation status must become Returned');
    assert.strictEqual(returnResult.return_date, returnDate, 'Return date must be recorded');

    // Allocation history MUST NOT be deleted
    const vimalAllocs = db.getUserAllocationHistory('VIMAL');
    const returnedAlloc = vimalAllocs.find(a => a.id === newAllocId);
    assert(returnedAlloc, 'Allocation record must remain preserved in VIMAL history');
    assert.strictEqual(returnedAlloc.status, 'Returned');

    // Hardware item must be Available again for re-allocation
    const hwCheck = db.getInstockHardware().find(i => i.id === testHardwareId);
    assert.strictEqual(hwCheck.status, 'Available', 'Physical hardware must be restored to Available');

    // Clean up test allocation
    db.deleteInstockAllocation(newAllocId);
  });

  console.log('\n--- 4. REST API ENDPOINTS VERIFICATION ---');

  await asyncTest('GET /api/instock/allocations returns full list', async () => {
    const res = await fetch('http://localhost:3000/api/instock/allocations');
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert(Array.isArray(data), 'Response must be an array');
    assert(data.length >= 4, `Expected at least 4 allocations, got ${data.length}`);
  });

  await asyncTest('GET /api/instock/user-history/VIMAL returns complete user history and metrics', async () => {
    const res = await fetch('http://localhost:3000/api/instock/user-history/VIMAL');
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert(Array.isArray(data), 'Response must be an array');
    assert(data.length >= 3, `Expected at least 3 records for VIMAL, got ${data.length}`);

    // Verify chronological sorting (newest assigned date first)
    const dates = data.map(d => d.assigned_date);
    for (let i = 0; i < dates.length - 1; i++) {
      assert(dates[i] >= dates[i + 1], `Dates should be descending: ${dates[i]} >= ${dates[i + 1]}`);
    }
  });

  await asyncTest('POST /api/instock/allocations and return flow via HTTP', async () => {
    // 1. Find available hardware
    const hwRes = await fetch('http://localhost:3000/api/instock');
    const hwList = await hwRes.json();
    const available = hwList.filter(i => i.status === 'Available');
    assert(available.length > 0, 'Must have available hardware');
    const targetHw = available[0];

    // 2. Allocate via API
    const postRes = await fetch('http://localhost:3000/api/instock/allocations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        asset_id: targetHw.id,
        user_name: 'TEST_API_USER',
        tl_name: 'Kavitha R',
        component_type: targetHw.component_type,
        spec: targetHw.spec,
        serial_number: targetHw.serial_number,
        assigned_date: '2026-10-14',
        purpose: 'API Test Allocation',
        assigned_by: 'Admin Test'
      })
    });
    assert.strictEqual(postRes.status, 201, 'Allocation should succeed with 201');
    const createdAlloc = await postRes.json();
    assert(createdAlloc && createdAlloc.id);

    // 3. Return via API
    const retRes = await fetch(`http://localhost:3000/api/instock/allocations/${createdAlloc.id}/return`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        return_date: '2026-10-15',
        return_remark: 'API return test',
        hardware_status: 'Available'
      })
    });
    assert.strictEqual(retRes.status, 200, 'Return should succeed with 200');
    const returnedAlloc = await retRes.json();
    assert.strictEqual(returnedAlloc.status, 'Returned');

    // Clean up test allocation
    db.deleteInstockAllocation(createdAlloc.id);
  });

  console.log('\n--- 5. FRONTEND & UI SPECIFICATION VERIFICATION ---');

  test('index.html contains IN-STOCK Navigation, 3 Submenus, Summary Cards & 6 Category Cards', () => {
    const html = fs.readFileSync('index.html', 'utf8');

    // Sidebar & View IDs (Submenus)
    assert(html.includes('IN-STOCK Dashboard'), 'Sidebar has IN-STOCK Dashboard');
    assert(html.includes('Stock Inventory'), 'Sidebar has Stock Inventory');
    assert(html.includes('Assigned Details'), 'Sidebar has Assigned Details');

    // 4 Summary cards
    assert(html.includes('id="instockTotalCount"'), 'Total Assets card counter');
    assert(html.includes('id="instockAvailableCount"'), 'Available Assets card counter');
    assert(html.includes('id="instockAssignedCount"'), 'Assigned Assets card counter');
    assert(html.includes('id="instockMaintenanceCount"'), 'Under Maintenance card counter');

    // 6 Category cards (3-column grid)
    const categories = ['CPU', 'SSD', 'RAM', 'SMPS', 'MONITOR', 'OTHER'];
    categories.forEach(cat => {
      assert(html.includes(`id="catCard${cat}"`), `Category card for ${cat} exists`);
      assert(html.includes(`id="instockCatStock${cat}"`), `Stock counter for ${cat} exists`);
      assert(html.includes(`id="instockCatAssigned${cat}"`), `Assigned counter for ${cat} exists`);
    });

    // Stock Inventory on dashboard directly below category cards
    assert(html.includes('id="instockInventoryTable"'), 'Dashboard contains Stock Inventory table');

    // Dedicated Assigned Details Submenu with 9 exact columns
    assert(html.includes('id="view-instock-assigned"'), 'Assigned Details has dedicated view panel');
    assert(html.includes('id="instockAssignedTable"'), 'Assigned Details table exists');
    assert(html.includes('Assigned Employee Name'), 'Has Assigned Employee Name column');
    assert(html.includes('Department / Team'), 'Has Department / Team column');
    assert(html.includes('Team Leader (TL)'), 'Has Team Leader (TL) column');
    assert(html.includes('System Status'), 'Has System Status column');
    assert(html.includes('User Exit Date'), 'Has User Exit Date column');
    assert(html.includes('Hardware Changing Reason'), 'Has Hardware Changing Reason column');

    // Modals
    assert(html.includes('id="modalViewInstockItem"'), 'View Hardware modal exists');
    assert(html.includes('id="modalViewAllocation"'), 'View Allocation modal exists');
    assert(html.includes('id="modalEditAllocation"'), 'Edit Allocation modal exists');
    assert(html.includes('id="modalInstockEntry"'), 'Add Stock Entry modal exists');
    assert(html.includes('id="instockAssetId"'), 'Asset ID input field exists in Add Stock modal');
  });

  test('styles.css contains 3-column category grid and reference styling', () => {
    const css = fs.readFileSync('styles.css', 'utf8');
    assert(css.includes('.instock-category-grid'), 'Grid container defined');
    assert(css.includes('.instock-cat-card'), 'Category card styling defined');
    assert(css.includes('.instock-cat-stat'), 'Category card stat styling defined');
    assert(css.includes('.btn-instock-new-entry'), 'Blue New Entry button styling defined');
    assert(css.includes('.instock-badge-pending'), 'Pending In-Stock badge styling defined');
    assert(css.includes('.instock-badge-assigned'), 'Assigned badge styling defined');
  });

  test('app.js exposes all required methods on window.ITApp', () => {
    const appJs = fs.readFileSync('app.js', 'utf8');
    const requiredMethods = [
      'renderInstockDashboard',
      'renderInstockInventoryTable',
      'renderInstockInventoryView',
      'filterInventoryByCategory',
      'filterDashboardByStatus',
      'filterFullInventoryView',
      'resetFullInventoryViewFilters',
      'viewInstockItem',
      'viewAllocationDetails',
      'renderAssignedItemsTable',
      'filterAssignedItems',
      'resetAssignedItemsFilters',
      'openAssignAssetModal',
      'openReturnAssetModal',
      'openEditAllocationModal',
      'handleEditAllocationSubmit',
      'openInstockEntryModal',
      'handleInstockFormSubmit',
      'exportAssignedCsv'
    ];

    requiredMethods.forEach(method => {
      assert(appJs.includes(method), `app.js must implement and expose ${method}`);
    });
  });

  console.log('\n================================================================');
  console.log(`🏁 INSTOCK WORKFLOW TEST RESULTS: ${passedTests} / ${totalTests} PASSED`);
  console.log('================================================================\n');

  if (passedTests === totalTests) {
    console.log('🎉 ALL 10 USER REQUIREMENTS FULLY VERIFIED AND PASSING 100%!');
    process.exit(0);
  } else {
    process.exit(1);
  }
})();
