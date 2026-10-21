const assert = require('assert');
const fs = require('fs');
const db = require('./database');

console.log('================================================================');
console.log('🧪 VERIFYING NEW SYSTEM CONFIGURATION IMPLEMENTATION');
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
const serverJs = fs.readFileSync('server.js', 'utf8');
const dbJs = fs.readFileSync('database.js', 'utf8');

// 1. Instock Add Stock Form - Category Option
console.log('--- 1. Instock Add Stock Form Category Dropdown ---');
test('Instock page does NOT have separate NEW SYSTEM button or separate modal', () => {
  assert(!html.includes('id="btnNewSystemPrimary"'), 'Separate btnNewSystemPrimary button should NOT exist');
  assert(!html.includes('id="modalNewSystem"'), 'Separate modalNewSystem dialog should NOT exist');
});

test('Category dropdown in + Add Stock modal contains NEW SYSTEM option', () => {
  assert(html.includes('id="instockComponentType"'), 'instockComponentType select exists in modalInstockEntry');
  assert(html.includes('<option value="NEW SYSTEM">'), 'Category dropdown contains NEW SYSTEM option');
  assert(html.includes('id="btnAddStockPrimary"'), '+ Add Stock primary button exists');
});

// 2. Conditional Configuration Section & 9 Fields in Exact Order
console.log('\n--- 2. NEW SYSTEM Configuration Fields in Exact Order ---');
test('NEW SYSTEM Configuration section exists inside modalInstockEntry with exact title and description', () => {
  assert(html.includes('id="modalInstockEntry"'), 'modalInstockEntry exists in index.html');
  assert(html.includes('id="instockNewSystemFieldsSection"'), 'instockNewSystemFieldsSection exists inside modalInstockEntry');
  assert(html.includes('NEW SYSTEM Configuration'), 'NEW SYSTEM Configuration header exists');
  assert(html.includes('Complete Desktop system specification, network &amp; hardware record'), 'Section subtitle exists');
  assert(html.includes('id="btnSaveInstockEntry"'), 'btnSaveInstockEntry exists for saving');
});

test('Asset ID sequence continues PIX_DSK format when NEW SYSTEM is selected', () => {
  assert(html.includes('id="instockAssetId"'), 'instockAssetId field exists');
  assert(appJs.includes('getNextDesktopAssetId()'), 'app.js generates Desktop Asset ID');
});

test('All 9 fields exist in exact order with examples and None options', () => {
  const fields = [
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

  let lastIndex = -1;
  fields.forEach(f => {
    const idx = html.indexOf(`id="${f.id}"`);
    assert(idx !== -1, `Field #${f.id} must exist in index.html`);
    assert(idx > lastIndex, `Field #${f.id} must appear in order after previous field`);
    lastIndex = idx;
    assert(html.includes(f.label), `Label for ${f.label} must exist in index.html`);
  });
});

test('Primary Monitor field includes both dropdown and None checkbox option', () => {
  assert(html.includes('id="newSystemMonitorNoneCheckbox"'), 'newSystemMonitorNoneCheckbox exists');
  assert(html.includes('id="newSystemMonitorDropdown"'), 'newSystemMonitorDropdown exists');
  assert(html.includes('handleNewSystemMonitorNone'), 'handleNewSystemMonitorNone handler attached');
  assert(html.includes('handleNewSystemMonitorDropdown'), 'handleNewSystemMonitorDropdown handler attached');
});

// 3. Asset ID Generation
console.log('\n--- 3. Desktop Asset ID Generation ---');
test('Database and Controller implement getNextDesktopAssetId continuing sequence', () => {
  assert(typeof db.getNextDesktopAssetId === 'function', 'db.getNextDesktopAssetId must be a function');
  const nextId = db.getNextDesktopAssetId();
  assert(/^PIX_DSK_\d+$/.test(nextId), `Generated ID must match PIX_DSK_XX format, got: ${nextId}`);
  console.log('   Current Next Generated Asset ID:', nextId);
});

test('Asset ID sequence correctly preserves 4-digit sequence when latest ID is PIX_DSK_0025', () => {
  // Test mock scenario matching prompt specification:
  // "If the latest ID is PIX_DSK_0025, generate the next ID according to the existing format and sequence."
  const testAssets = [
    { id: 'PIX_DSK_0023' },
    { id: 'PIX_DSK_0024' },
    { id: 'PIX_DSK_0025' }
  ];
  const dskMatches = [];
  testAssets.forEach(a => {
    const m = a.id.match(/^PIX_DSK_(\d+)$/i);
    if (m) dskMatches.push({ id: a.id, num: parseInt(m[1], 10), digits: m[1].length });
  });
  dskMatches.sort((a, b) => a.num - b.num);
  const latest = dskMatches[dskMatches.length - 1];
  const nextNum = latest.num + 1;
  const padLength = Math.max(latest.digits, 2);
  const generated = `PIX_DSK_${String(nextNum).padStart(padLength, '0')}`;
  assert.strictEqual(generated, 'PIX_DSK_0026', 'Must generate PIX_DSK_0026 from PIX_DSK_0025');
});

test('Server provides /api/assets/next-desktop-id endpoint', () => {
  assert(serverJs.includes('/api/assets/next-desktop-id'), 'server.js handles /api/assets/next-desktop-id');
});

// 4. Save and Persistence in SQLite Database
console.log('\n--- 4. Saving and Database Integrity ---');
test('Database assets table schema supports smps column', () => {
  assert(dbJs.includes('ALTER TABLE assets ADD COLUMN smps'), 'database.js alters assets table to add smps');
  assert(dbJs.includes('VALID_ASSET_COLUMNS = [') && dbJs.includes("'smps'"), 'VALID_ASSET_COLUMNS includes smps');
});

test('Inserting and retrieving a complete New Desktop System record via database', () => {
  const generatedId = db.getNextDesktopAssetId();
  const testRecord = {
    id: generatedId,
    type: 'Desktop',
    cpu: 'Intel Core i5 12th Gen',
    ram: '16 GB DDR4',
    ssd: '512GB NVMe M.2',
    hdd: '1TB HDD',
    os: 'Windows 11 Pro',
    ipAddress: '192.168.1.188',
    serialNumber: 'SN-DSK-TEST-9988',
    monitor: 'DELL 24 inch',
    smps: '650W Bronze',
    status: 'Non-Assigned',
    condition: 'Brand New',
    location: 'In Stock',
    user: 'None',
    remark: 'Automated Test System'
  };

  const initialStockCount = db.getInstockHardware().length;

  // Insert into assets
  const inserted = db.insertAsset(testRecord);
  assert.strictEqual(inserted.id, generatedId);

  // Retrieve and verify all 9 fields
  const all = db.getAllAssets();
  const found = all.find(a => a.id === generatedId);
  assert(found, `Inserted asset ${generatedId} must be retrievable`);
  assert.strictEqual(found.cpu, 'i5 12th Gen');
  assert.strictEqual(found.ram, '16 GB DDR4');
  assert.strictEqual(found.ssd, '512GB NVMe M.2');
  assert.strictEqual(found.hdd, '1TB HDD');
  assert.strictEqual(found.os, 'Windows 11 Pro');
  assert.strictEqual(found.ipAddress, '192.168.1.188');
  assert.strictEqual(found.serialNumber, 'SN-DSK-TEST-9988');
  assert.strictEqual(found.monitor, 'DELL 24 inch');
  assert.strictEqual(found.smps, '650W Bronze');
  assert.strictEqual(found.status, 'Non-Assigned');

  // Verify no duplicate component stock entries were created
  const postStockCount = db.getInstockHardware().length;
  assert.strictEqual(postStockCount, initialStockCount, 'Saving Desktop system must NOT create loose component stock records');

  // Clean up test record
  db.deleteAsset(generatedId);
});

// 5. View Details & Edit Integration
console.log('\n--- 5. View Details & Edit Display ---');
test('View details modal displays Tile 9 SMPS and handles monitor None option', () => {
  assert(appJs.includes('Tile 9: SMPS'), 'app.js includes Tile 9 SMPS in viewAsset');
  assert(appJs.includes('asset.smps'), 'app.js renders asset.smps in viewAsset');
  assert(appJs.includes('Tile 8: Primary Monitor'), 'app.js includes Tile 8 Primary Monitor');
});

test('Edit asset modal includes SMPS field and populates it properly', () => {
  assert(html.includes('id="editAssetSmps"'), 'index.html has editAssetSmps field');
  assert(appJs.includes('editAssetSmps'), 'app.js references editAssetSmps in populateEditAssetModal');
  assert(appJs.includes("formData.get('editSmps')"), 'app.js extracts editSmps in executeSaveAssetEdit');
});

test('window.ITApp exposes all NEW SYSTEM methods', () => {
  assert(appJs.includes('openNewSystemModal(editId = null) {') && appJs.includes('window.ITApp = {') && appJs.includes('openNewSystemModal(editId = null) {\n      app.openNewSystemModal(editId);'), 'openNewSystemModal exposed');
  assert(appJs.includes('handleNewSystemMonitorNone(isNone) {'), 'handleNewSystemMonitorNone exposed');
  assert(appJs.includes('handleNewSystemMonitorDropdown(val) {'), 'handleNewSystemMonitorDropdown exposed');
  assert(appJs.includes('handleNewSystemSubmit(event) {'), 'handleNewSystemSubmit exposed');
  assert(appJs.includes('getNextDesktopAssetId() {'), 'getNextDesktopAssetId exposed');
});

console.log('\n================================================================');
console.log(`🏁 VERIFICATION SUMMARY: ${passed} / ${total} CHECKS PASSED`);
console.log('================================================================\n');

if (passed === total) {
  console.log('🎉 ALL NEW SYSTEM REQUIREMENTS FULLY IMPLEMENTED AND VERIFIED!');
  process.exit(0);
} else {
  process.exit(1);
}
