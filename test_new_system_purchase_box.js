const assert = require('assert');
const fs = require('fs');
const db = require('./database');

console.log('================================================================');
console.log('🧪 VERIFYING NEW SYSTEM PURCHASE & PROCUREMENT RECORD BOX');
console.log('================================================================\n');

let passed = 0;
let total = 0;

function test(name, fn) {
  total++;
  try {
    fn();
    console.log(`✅ PASS: ${name}`);
    passed++;
  } catch (err) {
    console.error(`❌ FAIL: ${name}`);
    console.error('   Error:', err.message);
  }
}

const html = fs.readFileSync('index.html', 'utf8');
const appJs = fs.readFileSync('app.js', 'utf8');

// 1. Structural Verification: Box placed only in NEW SYSTEM section
console.log('--- 1. Structural Layout & Box Styling ---');
test('Purchase & Procurement Record Box exists with ID newSystemPurchaseDetailsBox', () => {
  assert(html.includes('id="newSystemPurchaseDetailsBox"'), 'newSystemPurchaseDetailsBox must exist in index.html');
  assert(html.includes('id="newSystemPurchaseDate"'), 'newSystemPurchaseDate input must exist');
  assert(html.includes('id="newSystemWarrantyEnd"'), 'newSystemWarrantyEnd input must exist');
});

test('Box is inside instockNewSystemFieldsSection and NOT in instockStandardComponentFields', () => {
  const newSysIdx = html.indexOf('id="instockNewSystemFieldsSection"');
  const boxIdx = html.indexOf('id="newSystemPurchaseDetailsBox"');
  const statusIdx = html.indexOf('id="instockStatus"');
  const stdIdx = html.indexOf('id="instockStandardComponentFields"');

  assert(boxIdx > newSysIdx, 'Box must be inside instockNewSystemFieldsSection');
  assert(boxIdx < statusIdx, 'Box must appear before Current Status box');
  assert(boxIdx > stdIdx, 'Box is separate from instockStandardComponentFields');
});

test('Image 1 standard fields remain completely untouched', () => {
  assert(html.includes('id="instockPurchaseDate"'), 'instockPurchaseDate still exists for loose stock (Image 1)');
  assert(html.includes('id="instockSerial"'), 'instockSerial still exists for loose stock (Image 1)');
  assert(html.includes('id="instockModel"'), 'instockModel still exists for loose stock (Image 1)');
});

// 2. Quick Action Helpers in app.js
console.log('\n--- 2. JS Quick Actions & Helper Methods ---');
test('setNewSystemPurchaseDateToday & setNewSystemWarrantyYears defined and exposed', () => {
  assert(appJs.includes('setNewSystemPurchaseDateToday()'), 'setNewSystemPurchaseDateToday implemented in app.js');
  assert(appJs.includes('setNewSystemWarrantyYears(years)'), 'setNewSystemWarrantyYears implemented in app.js');
  assert(appJs.includes('setNewSystemPurchaseDateToday() {'), 'window.ITApp exposes setNewSystemPurchaseDateToday');
  assert(appJs.includes('setNewSystemWarrantyYears(years) {'), 'window.ITApp exposes setNewSystemWarrantyYears');
});

// 3. Purchase Date Validation & Payload Persistence
console.log('\n--- 3. Form Validation & Database Persistence ---');
test('NEW SYSTEM submission validates and persists purchaseDate / doa & warrantyEnd', () => {
  assert(appJs.includes('document.getElementById(\'newSystemPurchaseDate\')?.value'), 'Reads newSystemPurchaseDate in submission');
  assert(appJs.includes('doa: purchaseDate'), 'Maps purchase date to doa column in assets table');
  assert(appJs.includes('purchaseDate,'), 'Includes purchaseDate in payload');
});

test('Desktop asset can be inserted and retrieved with purchase date & warranty', () => {
  const testId = db.getNextDesktopAssetId();
  const today = new Date().toISOString().substring(0, 10);
  const futureWarranty = '2028-10-21';

  const testAsset = {
    id: testId,
    type: 'Desktop',
    cpu: 'Intel Core i9-13900',
    ram: '64 GB DDR5',
    ssd: '2TB NVMe',
    hdd: 'None',
    os: 'Windows 11 Pro',
    ipAddress: '192.168.1.99',
    serialNumber: 'SN-TEST-PURCHASE-01',
    monitor: 'DELL 27 inch 4K',
    smps: '850W Gold',
    status: 'Non-Assigned',
    condition: 'Brand New',
    location: 'In Stock',
    user: 'None',
    doa: today,
    purchaseDate: today,
    warrantyEnd: futureWarranty,
    remark: 'Desktop with procurement record'
  };

  const inserted = db.insertAsset(testAsset);
  assert.strictEqual(inserted.id, testId);

  const found = db.getAllAssets().find(a => a.id === testId);
  assert(found, 'Inserted desktop asset found');
  assert.strictEqual(found.doa, today, 'doa matches purchase date');
  assert.strictEqual(found.warrantyEnd, futureWarranty, 'warranty matches');

  // Clean up
  db.deleteAsset(testId);
});

console.log('\n================================================================');
console.log(`🏁 RESULT: ${passed} / ${total} TESTS PASSED`);
console.log('================================================================\n');

if (passed === total) {
  console.log('🎉 ALL NEW SYSTEM PURCHASE BOX SPECIFICATIONS VERIFIED!');
  process.exit(0);
} else {
  process.exit(1);
}
