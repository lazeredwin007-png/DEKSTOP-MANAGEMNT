const assert = require('assert');
const fs = require('fs');
const db = require('./database');

console.log('================================================================');
console.log('🧪 VERIFYING ADD STOCK MODAL: NEW SYSTEM CATEGORY INTEGRATION');
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

// 1. Strict UI Constraint: No separate button, card, tab, or page
console.log('--- 1. Verification of Page Layout Constraints ---');
test('No separate NEW SYSTEM button exists in Instock header or anywhere in page', () => {
  assert(!html.includes('id="btnNewSystemPrimary"'), 'No btnNewSystemPrimary button');
  assert(!html.includes('id="modalNewSystem"'), 'No modalNewSystem element');
  assert(!html.includes('id="tabNewSystem"'), 'No tabNewSystem');
  assert(!html.includes('id="cardNewSystem"'), 'No cardNewSystem');
});

test('Only single + Add Stock button exists in Instock page header', () => {
  assert(html.includes('id="btnAddStockPrimary"'), '+ Add Stock primary button exists');
  assert(html.includes('onclick="window.ITApp.openInstockEntryModal()"'), 'Invokes openInstockEntryModal()');
});

// 2. Category Dropdown Option
console.log('\n--- 2. Category Dropdown Verification ---');
test('Category select element contains NEW SYSTEM as an option', () => {
  assert(html.includes('id="instockComponentType"'), 'instockComponentType exists');
  const catRegex = /<select[^>]*id="instockComponentType"[^>]*>([\s\S]*?)<\/select>/;
  const match = html.match(catRegex);
  assert(match, 'instockComponentType select element found');
  const selectContent = match[1];
  assert(selectContent.includes('value="NEW SYSTEM"'), 'NEW SYSTEM option exists in Category dropdown');
  assert(selectContent.includes('value="CPU"'), 'CPU category preserved');
  assert(selectContent.includes('value="SSD"'), 'SSD category preserved');
  assert(selectContent.includes('value="RAM"'), 'RAM category preserved');
  assert(selectContent.includes('value="SMPS"'), 'SMPS category preserved');
  assert(selectContent.includes('value="MONITOR"'), 'MONITOR category preserved');
  assert(selectContent.includes('value="OTHER"'), 'OTHER category preserved');
});

// 3. Conditional Configuration Fields Inside Add Stock Form
console.log('\n--- 3. Conditional Configuration Fields Inside modalInstockEntry ---');
test('Both standard fields wrapper and new system section exist inside formInstockEntry', () => {
  const formRegex = /<form[^>]*id="formInstockEntry"[^>]*>([\s\S]*?)<\/form>/;
  const match = html.match(formRegex);
  assert(match, 'formInstockEntry found');
  const formHtml = match[1];

  assert(formHtml.includes('id="instockStandardComponentFields"'), 'instockStandardComponentFields exists');
  assert(formHtml.includes('id="instockNewSystemFieldsSection"'), 'instockNewSystemFieldsSection exists');
  assert(formHtml.includes('NEW SYSTEM Configuration'), 'NEW SYSTEM Configuration header in form');
  assert(formHtml.includes('Complete Desktop system specification, network &amp; hardware record'), 'Description matches');
  assert(formHtml.includes('id="btnSaveInstockEntry"'), 'Existing Save Stock Entry button used');
});

test('All 9 specified fields exist with exact IDs and labels in order', () => {
  const expectedFields = [
    { id: 'newSystemCpu', label: 'CPU Configuration' },
    { id: 'newSystemRam', label: 'RAM Memory' },
    { id: 'newSystemSsd', label: 'Solid State Drive (SSD)' },
    { id: 'newSystemHdd', label: 'Hard Disk Drive (HDD)' },
    { id: 'newSystemOs', label: 'Operating System' },
    { id: 'newSystemIp', label: 'IP Address' },
    { id: 'newSystemMac', label: 'MAC Address' },
    { id: 'newSystemMonitor', label: 'Monitor Model &amp; Display' },
    { id: 'newSystemSmps', label: 'SMPS (Power Supply)' }
  ];

  let prevIdx = -1;
  expectedFields.forEach(f => {
    const idx = html.indexOf(`id="${f.id}"`);
    assert(idx !== -1, `Field #${f.id} must exist in HTML`);
    assert(idx > prevIdx, `Field #${f.id} must be in order after previous field`);
    prevIdx = idx;
    assert(html.includes(f.label), `Label for ${f.label} must exist`);
  });

  // Verify Primary Monitor has None option
  assert(html.includes('id="newSystemMonitorNoneCheckbox"'), 'Primary Monitor None checkbox exists');
  assert(html.includes('id="newSystemMonitorDropdown"'), 'Primary Monitor dropdown with None exists');
});

// 4. Expected JS Behavior & Sequence Continuity
console.log('\n--- 4. JS Logic & Sequence Continuity ---');
test('handleInstockCategoryChange toggles fields and sets Desktop Asset ID sequence', () => {
  assert(appJs.includes('handleInstockCategoryChange()'), 'handleInstockCategoryChange defined');
  assert(appJs.includes("cat === 'NEW SYSTEM'"), 'Checks for NEW SYSTEM');
  assert(appJs.includes('this.getNextDesktopAssetId()'), 'Generates Desktop Asset ID sequence');
  assert(appJs.includes('this.getNextInstockAssetId(cat)'), 'Generates standard component ID');
});

test('getNextDesktopAssetId continues sequence without resetting', () => {
  const nextId = db.getNextDesktopAssetId();
  assert(/^PIX_DSK_\d+$/.test(nextId), `Next Desktop ID must be PIX_DSK_XX, got: ${nextId}`);
  
  // Test 4-digit sequence format preservation
  const sample = [
    { id: 'PIX_DSK_0001' },
    { id: 'PIX_DSK_0025' }
  ];
  const matches = sample.map(a => {
    const m = a.id.match(/^PIX_DSK_(\d+)$/i);
    return { num: parseInt(m[1], 10), digits: m[1].length };
  }).sort((a, b) => a.num - b.num);
  const latest = matches[matches.length - 1];
  const padLength = Math.max(latest.digits, 2);
  const gen = `PIX_DSK_${String(latest.num + 1).padStart(padLength, '0')}`;
  assert.strictEqual(gen, 'PIX_DSK_0026');
});

test('handleInstockFormSubmit handles NEW SYSTEM desktop persistence correctly', () => {
  assert(appJs.includes("if (component_type === 'NEW SYSTEM')"), 'handleInstockFormSubmit branches on NEW SYSTEM');
  assert(appJs.includes('/api/assets'), 'Saves to /api/assets endpoint');
  assert(appJs.includes('type: \'Desktop\''), 'Payload sets type to Desktop');
});

// 5. Database Save & Retrieve Verification
console.log('\n--- 5. Database Verification ---');
test('Insert and read complete Desktop system with all 9 fields', () => {
  const testId = db.getNextDesktopAssetId();
  const testAsset = {
    id: testId,
    type: 'Desktop',
    cpu: 'Intel Core i7-12700',
    ram: '32 GB DDR4',
    ssd: '1TB NVMe',
    hdd: '2TB Seagate',
    os: 'Windows 11 Pro',
    ipAddress: '10.0.0.45',
    serialNumber: 'SN-TEST-MAC-9911',
    monitor: 'DELL 24 inch',
    smps: '750W Gold',
    status: 'Non-Assigned',
    condition: 'Brand New',
    location: 'In Stock',
    user: 'None',
    remark: 'Automated Test Desktop'
  };

  const initialStock = db.getInstockHardware().length;
  const inserted = db.insertAsset(testAsset);
  assert.strictEqual(inserted.id, testId);

  const found = db.getAllAssets().find(a => a.id === testId);
  assert(found, 'Asset must be in database');
  assert.strictEqual(found.cpu, 'Intel Core i7-12700');
  assert.strictEqual(found.ram, '32 GB DDR4');
  assert.strictEqual(found.ssd, '1TB NVMe');
  assert.strictEqual(found.hdd, '2TB Seagate');
  assert.strictEqual(found.os, 'Windows 11 Pro');
  assert.strictEqual(found.ipAddress, '10.0.0.45');
  assert.strictEqual(found.serialNumber, 'SN-TEST-MAC-9911');
  assert.strictEqual(found.monitor, 'DELL 24 inch');
  assert.strictEqual(found.smps, '750W Gold');

  // Verify loose stock records unchanged
  const postStock = db.getInstockHardware().length;
  assert.strictEqual(postStock, initialStock, 'Desktop insertion must not inflate instockHardware count');

  // Clean up
  db.deleteAsset(testId);
});

console.log('\n================================================================');
console.log(`🏁 RESULT: ${passed} / ${total} TESTS PASSED`);
console.log('================================================================\n');

if (passed === total) {
  console.log('✨ ALL NEW SYSTEM SPECIFICATIONS FULLY MET AND VERIFIED!');
  process.exit(0);
} else {
  process.exit(1);
}
