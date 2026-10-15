const fs = require('fs');
const db = require('./database.js');

console.log('====================================================');
console.log('🧪 VERIFYING INSTOCK HARDWARE MANAGEMENT SYSTEM');
console.log('====================================================\n');

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`✅ PASS: ${message}`);
    passedTests++;
  } else {
    console.error(`❌ FAIL: ${message}`);
    process.exitCode = 1;
  }
}

// 1. Database tests
const items = db.getInstockHardware();
assert(Array.isArray(items) && items.length >= 12, `Database has at least 12 seeded instock hardware items (Got: ${items.length})`);

const first = items[0];
assert(first && first.component_type && first.spec && first.serial_number && first.purchase_date && first.status, 'Record has all required hardware fields');

// Test Categories
const types = new Set(items.map(i => i.component_type));
['CPU', 'SSD', 'RAM', 'SMPS', 'MONITOR', 'OTHER'].forEach(t => {
  assert(types.has(t), `Category "${t}" exists in database`);
});

// Test Insert
const testItem = {
  component_type: 'RAM',
  spec: 'TeamGroup 32GB DDR4 3200MHz',
  serial_number: 'SN-RAM-TEST-999',
  purchase_date: '2025-03-01',
  status: 'Assigned',
  assigned_user: 'Kavitha R',
  assigned_date: '2025-03-05',
  team: 'PHP',
  tl: 'Sundar Pichai',
  remark: 'Test RAM Module'
};
const inserted = db.insertInstockHardware(testItem);
assert(inserted && inserted.id && inserted.spec === testItem.spec, `Successfully inserted new instock item (${inserted ? inserted.id : 'none'})`);

// Test Update
const updated = db.updateInstockHardware(inserted.id, { remark: 'Updated Remark Test' });
assert(updated && updated.remark === 'Updated Remark Test', 'Successfully updated instock item');

// Test Delete
db.deleteInstockHardware(inserted.id);
const recheck = db.getInstockHardware().find(i => i.id === inserted.id);
assert(!recheck, 'Successfully deleted test instock item');

// 2. HTML Verification
const html = fs.readFileSync('index.html', 'utf8');
assert(html.includes('id="navItemInstock"'), 'index.html contains INSTOCK sidebar menu item');
assert(html.includes('href="#instock-dashboard"'), 'index.html contains DASH BOARD submenu link');
assert(html.includes('href="#instock-assigned"'), 'index.html contains Assigned Detailed submenu link');
assert(html.includes('id="view-instock-dashboard"'), 'index.html contains view-instock-dashboard panel');
assert(html.includes('id="view-instock-assigned"'), 'index.html contains view-instock-assigned panel');
assert(html.includes('id="modalInstockEntry"'), 'index.html contains modalInstockEntry modal');
assert(html.includes('id="instockCardsContainer"'), 'index.html contains 6 Cards grid container');

// 3. CSS Verification
const css = fs.readFileSync('styles.css', 'utf8');
assert(css.includes('.instock-cards-grid'), 'styles.css contains .instock-cards-grid');
assert(css.includes('.instock-card'), 'styles.css contains .instock-card');
assert(css.includes('.instock-icon-cpu'), 'styles.css contains .instock-icon-cpu');

// 4. App Controller Verification
const appCode = fs.readFileSync('app.js', 'utf8');
assert(appCode.includes('renderInstockDashboard'), 'app.js implements renderInstockDashboard');
assert(appCode.includes('renderInstockAssignedTable'), 'app.js implements renderInstockAssignedTable');
assert(appCode.includes('openInstockEntryModal'), 'app.js implements openInstockEntryModal');
assert(appCode.includes('handleInstockFormSubmit'), 'app.js implements handleInstockFormSubmit');
assert(appCode.includes('toggleInstockStatus'), 'app.js implements toggleInstockStatus');
assert(appCode.includes('exportInstockCsv'), 'app.js implements exportInstockCsv');

console.log('\n====================================================');
console.log(`🏁 INSTOCK FEATURE TEST RESULTS: ${passedTests} / ${totalTests} PASSED`);
console.log('====================================================\n');
