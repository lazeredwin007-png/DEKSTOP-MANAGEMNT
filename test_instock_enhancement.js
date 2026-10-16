const fs = require('fs');
const http = require('http');

async function runTests() {
  console.log('====================================================');
  console.log('🧪 VERIFYING ENHANCED INSTOCK MODULE & DATA FLOW');
  console.log('====================================================');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${message}`);
      failed++;
    }
  }

  // Helper HTTP request
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

  // --- 1. INSPECT index.html MENU STRUCTURE & SUBPAGES ---
  const html = fs.readFileSync('index.html', 'utf8');

  assert(html.includes('href="#instock-dashboard"'), 'Submenu includes "Instock Dashboard" link');
  assert(html.includes('href="#instock-entry"'), 'Submenu includes "Instock Entry" link');
  assert(html.includes('href="#instock-asset-details"'), 'Submenu includes "Asset Details" link');
  assert(html.includes('href="#instock-requests"'), 'Submenu includes "Request" link');
  assert(html.includes('id="view-instock-entry"'), 'Panel #view-instock-entry exists');
  assert(html.includes('id="view-instock-asset-details"'), 'Panel #view-instock-asset-details exists');
  assert(html.includes('id="view-instock-requests"'), 'Panel #view-instock-requests exists');

  // Verify Instock Entry Form fields
  assert(html.includes('id="entryPageAssetId"'), 'Instock Entry form has Asset ID field');
  assert(html.includes('id="entryPageComponentType"'), 'Instock Entry form has Category field');
  assert(html.includes('id="entryPageSpec"'), 'Instock Entry form has Specification / Model field');
  assert(html.includes('id="entryPageSerial"'), 'Instock Entry form has Serial Number field');
  assert(html.includes('id="entryPagePurchaseDate"'), 'Instock Entry form has Purchase Date field');
  assert(html.includes('id="entryPageStatus"'), 'Instock Entry form has Current Status field');

  // Verify Asset Details 7 columns
  assert(html.includes('id="instockInventoryFullTable"'), 'Asset Details has full inventory data table');

  // Verify Request 10 columns
  assert(html.includes('id="instockRequestsTable"'), 'Request subpage has dedicated 10-column table');
  assert(html.includes('id="modalAssignHardwareToReq"'), 'Modal to assign hardware to request exists');
  assert(html.includes('id="modalUpdateReqStatus"'), 'Modal to update request status exists');
  assert(html.includes('id="modalViewRequest"'), 'Modal to view request details exists');
  assert(html.includes('id="modalNewRequest"'), 'Modal to create new request exists');

  // --- 2. BACKEND API PERSISTENCE & WORKFLOWS ---
  console.log('\n--- TESTING BACKEND API & DATA PERSISTENCE ---');

  // A. Create new stock item through backend API
  const testStockId = 'STK-TEST-' + Math.floor(1000 + Math.random() * 9000);
  const testSerial = 'SN-TEST-' + Math.floor(10000 + Math.random() * 90000);
  const createStockRes = await apiRequest('/api/instock', 'POST', {
    id: testStockId,
    component_type: 'SSD',
    spec: 'Kingston 1TB NVMe PCIe 4.0 Test',
    serial_number: testSerial,
    purchase_date: '2026-10-15',
    status: 'Available',
    remark: 'Automated test item'
  });

  assert(createStockRes.status === 200 || createStockRes.status === 201, `Created new stock item (${testStockId}) via API`);
  assert(createStockRes.body.id === testStockId, 'Created stock item has correct ID');

  // Verify fetch returns the new stock item
  const getStockRes = await apiRequest('/api/instock');
  const foundItem = (getStockRes.body || []).find(i => i.id === testStockId);
  assert(foundItem && foundItem.status === 'Available', 'Stock item persisted in SQLite as Available');

  // B. Update the stock item (Edit in-place, prevent duplicates)
  const updateStockRes = await apiRequest(`/api/instock/${encodeURIComponent(testStockId)}`, 'PUT', {
    id: testStockId,
    component_type: 'SSD',
    spec: 'Kingston 2TB NVMe PCIe 4.0 Updated Spec',
    serial_number: testSerial,
    purchase_date: '2026-10-15',
    status: 'Available',
    remark: 'Updated spec without duplicating'
  });
  assert(updateStockRes.status === 200, 'Successfully updated hardware record');
  
  const getStockAfterUpdate = await apiRequest('/api/instock');
  const matchingItems = (getStockAfterUpdate.body || []).filter(i => i.id === testStockId);
  assert(matchingItems.length === 1, 'Edit does NOT create duplicate records (exactly 1 record exists)');
  assert(matchingItems[0].spec === 'Kingston 2TB NVMe PCIe 4.0 Updated Spec', 'Record reflects updated specification');

  // C. Test Requirements API & Separate Status Fields
  console.log('\n--- TESTING REQUEST & HARDWARE ALLOCATION WORKFLOW ---');
  const reqCreateRes = await apiRequest('/api/requirements', 'POST', {
    employee_name: 'Test Employee Automation',
    team: 'AI',
    tl: 'Sundar Pichai',
    priority: 'Urgent',
    hardware_item: '2TB NVMe SSD Fast Drive',
    reason: 'Model training dataset caching',
    date: '2026-10-15',
    status: 'Pending',
    asset_assignment_status: 'Non-Assigned',
    remark: 'Automated request test'
  });

  assert(reqCreateRes.status === 200 || reqCreateRes.status === 201, 'Created hardware request via API');
  const testReqId = reqCreateRes.body.id;
  assert(reqCreateRes.body.status === 'Pending', 'Request Status is Pending');
  assert(reqCreateRes.body.asset_assignment_status === 'Non-Assigned', 'Asset Assignment Status is Non-Assigned (distinct from Request Status)');

  // D. Update Request Status to Approved
  const reqUpdateRes = await apiRequest(`/api/requirements/${encodeURIComponent(testReqId)}`, 'PUT', {
    status: 'Approved',
    remark: 'Approved by lead'
  });
  assert(reqUpdateRes.status === 200, 'Successfully updated request status to Approved');

  // Verify status is Approved but assignment is STILL Non-Assigned (separate fields!)
  const getReqsRes = await apiRequest('/api/requirements');
  const foundReq = (getReqsRes.body || []).find(r => r.id === testReqId);
  assert(foundReq && foundReq.status === 'Approved', 'Request status is Approved');
  assert(foundReq && (foundReq.asset_assignment_status === 'Non-Assigned' || !foundReq.assigned_asset_id), 'Approved request is NOT falsely counted as already assigned');

  // E. Assign In-Stock Hardware to Request
  const assignHwRes = await apiRequest(`/api/requirements/${encodeURIComponent(testReqId)}/assign-hardware`, 'POST', {
    asset_id: testStockId,
    assigned_date: '2026-10-15'
  });
  assert(assignHwRes.status === 200 && assignHwRes.body.success === true, 'Successfully assigned in-stock hardware to requirement via API');

  // Verify requirement is now Assigned
  const getReqsAfterAssign = await apiRequest('/api/requirements');
  const assignedReq = (getReqsAfterAssign.body || []).find(r => r.id === testReqId);
  assert(assignedReq && assignedReq.asset_assignment_status === 'Assigned', 'Requirement asset_assignment_status updated to Assigned');
  assert(assignedReq && assignedReq.assigned_asset_id === testStockId, `Requirement linked to asset ID ${testStockId}`);

  // Verify hardware stock item is now Assigned and NOT available
  const getStockAfterAssign = await apiRequest('/api/instock');
  const assignedHw = (getStockAfterAssign.body || []).find(i => i.id === testStockId);
  assert(assignedHw && assignedHw.status === 'Assigned', 'Hardware item status updated to Assigned');
  assert(assignedHw && assignedHw.assigned_user === 'Test Employee Automation', 'Hardware item stores assigned employee name');

  // Verify instock allocations audit table has an allocation record
  const getAllocsRes = await apiRequest('/api/instock/allocations');
  const allocRecord = (getAllocsRes.body || []).find(a => a.asset_id === testStockId);
  assert(allocRecord && allocRecord.user_name === 'Test Employee Automation', 'Allocation audit trail recorded with correct employee');
  assert(allocRecord && allocRecord.tl_name === 'Sundar Pichai', 'Allocation audit trail recorded with correct TL');

  // Clean up test records
  await apiRequest(`/api/requirements/${encodeURIComponent(testReqId)}`, 'DELETE');
  await apiRequest(`/api/instock/${encodeURIComponent(testStockId)}`, 'DELETE');
  console.log('Cleaned up test records');

  // --- 3. VERIFY SYSTEM SWAP DROPDOWN FILTER RULE ---
  console.log('\n--- TESTING SYSTEM SWAP ACTIVE USER DROPDOWN EXCLUSION ---');
  const appJs = fs.readFileSync('app.js', 'utf8');

  // Verify populateSwapOldUserSelect excludes Currently Working users
  assert(appJs.includes("workStatus === 'Currently Working'"), 'app.js checks and excludes workStatus === Currently Working');
  assert(appJs.includes("status === 'Currently Working'"), 'app.js checks and excludes status === Currently Working');
  assert(appJs.includes("populateSwapOldUserSelect"), 'app.js contains populateSwapOldUserSelect');

  // Verify CSS contains badges and drawers
  const css = fs.readFileSync('styles.css', 'utf8');
  assert(css.includes('.assignment-drawer-row'), 'styles.css defines .assignment-drawer-row');
  assert(css.includes('.assignment-drawer-card'), 'styles.css defines .assignment-drawer-card');
  assert(css.includes('.badge-req-pending'), 'styles.css defines .badge-req-pending');
  assert(css.includes('.badge-assign-status-assigned'), 'styles.css defines .badge-assign-status-assigned');

  console.log('\n====================================================');
  console.log(`🏁 ENHANCEMENT TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================');

  if (failed > 0) process.exit(1);
}

runTests().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
