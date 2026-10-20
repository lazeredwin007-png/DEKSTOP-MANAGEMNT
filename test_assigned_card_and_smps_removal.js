const assert = require('assert');
const fs = require('fs');
const http = require('http');

function httpGet(path) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:3000${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    }).on('error', reject);
  });
}

async function runTests() {
  console.log('--- RUNNING VERIFICATION FOR ASSIGNED CARD & SMPS-404 REMOVAL ---');

  // 1. Check index.html
  console.log('\n1. Checking index.html...');
  const html = fs.readFileSync('./index.html', 'utf8');

  // Summary cards: Total Stock, Available, Assigned
  assert(!html.includes('id="instockReadyCount"'), 'instockReadyCount must be removed');
  assert(html.includes('id="instockAssignedCount"'), 'instockAssignedCount must exist in Assigned card');
  assert(html.includes('class="instock-summary-card assigned"'), 'instock-summary-card assigned card must exist');
  assert(html.includes("window.ITApp.filterDashboardByStatus('Assigned')"), 'Assigned card click handler must filter by Assigned');
  console.log('✓ Summary card has been updated to Assigned');

  // Status Filter in Instock Table
  assert(!html.includes('<option value="Ready for Assignment">⚡ Ready for Assignment</option>'), 'Ready for Assignment option removed from instockInventoryStatusFilter');
  assert(html.includes('<option value="Available">🔴 Non-Assigned (Available in Stock)</option>'), 'Available option exists');
  assert(html.includes('<option value="Assigned">🟢 Assigned</option>'), 'Assigned option exists');
  console.log('✓ Status filter dropdown properly updated');

  // Status Filter in modalInstockEntry
  assert(!html.includes('<option value="Ready for Assignment">⚡ Ready for Assignment (Non-Assigned)</option>'), 'Ready for Assignment removed from entry modal');
  console.log('✓ Entry modal status dropdown properly updated');

  // 2. Check server API responses
  console.log('\n2. Checking Server API responses...');
  const instockRes = await httpGet('/api/instock');
  assert.strictEqual(instockRes.status, 200, '/api/instock should return 200');
  const items = instockRes.body;
  const smps404 = items.find(i => (i.id || '').toUpperCase() === 'STK-SMPS-404');
  assert.strictEqual(smps404, undefined, 'STK-SMPS-404 must not exist in /api/instock');
  const serial50859 = items.find(i => (i.serial_number || '').includes('50859'));
  assert.strictEqual(serial50859, undefined, 'SN: 50859 must not exist in /api/instock');
  console.log(`✓ /api/instock returned ${items.length} items without STK-SMPS-404`);

  const readyItems = items.filter(i => i.status === 'Ready for Assignment' || i.status === 'Ready');
  assert.strictEqual(readyItems.length, 0, 'No items should have Ready for Assignment status');
  console.log('✓ No items in /api/instock have Ready for Assignment status');

  // Check history endpoint
  const historyRes = await httpGet('/api/instock/history');
  assert.strictEqual(historyRes.status, 200, '/api/instock/history should return 200');
  const historyItems = historyRes.body;
  const smps404History = historyItems.find(h => (h.asset_id || '').toUpperCase() === 'STK-SMPS-404');
  assert.strictEqual(smps404History, undefined, 'STK-SMPS-404 must not exist in history');
  console.log('✓ STK-SMPS-404 is completely absent from /api/instock/history');

  // Check database dump
  const dumpRes = await httpGet('/api/database/dump');
  assert.strictEqual(dumpRes.status, 200, '/api/database/dump should return 200');
  const dumpStr = JSON.stringify(dumpRes.body);
  assert(!dumpStr.includes('STK-SMPS-404'), 'Database dump must not include STK-SMPS-404');
  assert(!dumpStr.includes('50859'), 'Database dump must not include 50859');
  console.log('✓ Database dump has no trace of STK-SMPS-404 or serial 50859');

  console.log('\n ALL TESTS PASSED SUCCESSFULLY! ');
}

runTests().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
