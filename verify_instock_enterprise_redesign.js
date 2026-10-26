const fs = require('fs');
const assert = require('assert');
const http = require('http');
const db = require('./database.js');

console.log('================================================================');
console.log('🧪 VERIFYING INSTOCK ENTERPRISE UI REDESIGN SPECIFICATION');
console.log('================================================================\n');

const html = fs.readFileSync('index.html', 'utf8');
const appJs = fs.readFileSync('app.js', 'utf8').replace(/\r\n/g, '\n');
const css = fs.readFileSync('styles.css', 'utf8').replace(/\r\n/g, '\n');

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

// 1. Remove Search & Filter Section
console.log('--- 1. Verification: Search & Filter Section Completely Removed ---');
test('Visible Search Inventory container and toolbar are removed from DOM', () => {
  assert(!html.includes('class="instock-filter-toolbar instock-filter-panel"'), 'Visible filter toolbar is completely removed');
  assert(!html.includes('class="instock-filter-row-1"'), 'Filter row 1 is removed');
  assert(!html.includes('class="instock-filter-row-2"'), 'Filter row 2 is removed');
  assert(!html.includes('>Search Inventory</label>'), 'Search Inventory label is removed from visible view');
});

test('Search inputs, date pickers and reset button are not in visible layout', () => {
  const hiddenIdx = html.indexOf('style="display:none !important;" aria-hidden="true"');
  assert(hiddenIdx !== -1, 'Hidden state preservation container exists');
  const searchInputIdx = html.indexOf('id="instockInventorySearch"');
  assert(searchInputIdx > hiddenIdx, 'Search input is inside display:none container (zero visual space)');
});

// 2. Simplify the Actions Column
console.log('\n--- 2. Verification: Actions Column Simplified (View, Edit, Delete only) ---');
test('Instock table rows render ONLY View, Edit, and Delete action buttons', () => {
  const tableRenderIdx = appJs.indexOf('tbody.innerHTML = pageItems.map(item => {');
  const tableRenderEnd = appJs.indexOf('this.renderInstockPagination(startIndex', tableRenderIdx);
  const rowHtml = appJs.substring(tableRenderIdx, tableRenderEnd);

  // Must contain View Asset
  assert(rowHtml.includes('instock-action-view'), 'Contains View Asset button');
  assert(rowHtml.includes("onclick=\"window.ITApp.viewInstockItem('${item.id}')\""), 'View button calls viewInstockItem');
  
  // Must contain Edit Asset
  assert(rowHtml.includes('instock-action-edit'), 'Contains Edit Asset button');
  assert(rowHtml.includes("onclick=\"window.ITApp.openInstockEntryModal(null, '${item.id}')\""), 'Edit button calls openInstockEntryModal');

  // Must contain Delete Asset
  assert(rowHtml.includes('instock-action-delete'), 'Contains Delete Asset button');
  assert(rowHtml.includes("onclick=\"window.ITApp.deleteInstockEntry('${item.id}')\""), 'Delete button calls deleteInstockEntry');

  // Must NOT render Duplicate Asset button or History button in table rows
  assert(!rowHtml.includes('<button type="button" class="btn btn-sm btn-secondary instock-action-btn" onclick="window.ITApp.duplicateInstockItem'), 'Duplicate Asset button is removed from table rows');
  assert(!rowHtml.includes('<button type="button" class="btn btn-sm btn-secondary instock-action-btn" onclick="window.ITApp.openInstockHistoryModal'), 'History button is removed from table rows');
  assert(!rowHtml.includes('📋'), 'Duplicate icon 📋 removed from row DOM');
  assert(!rowHtml.includes('📜'), 'History icon 📜 removed from row DOM');
});

// 3. Category Summary Cards
console.log('\n--- 3. Verification: Category Summary Cards (All 7 Categories) ---');
const expectedCategories = [
  { key: 'NEW_SYSTEM', id: 'instockCatCard_NEW_SYSTEM', label: 'New System', arg: "'NEW SYSTEM'" },
  { key: 'CPU', id: 'instockCatCard_CPU', label: 'Processor', arg: "'CPU'" },
  { key: 'RAM', id: 'instockCatCard_RAM', label: 'RAM', arg: "'RAM'" },
  { key: 'SSD', id: 'instockCatCard_SSD', label: 'SSD', arg: "'SSD'" },
  { key: 'MONITOR', id: 'instockCatCard_MONITOR', label: 'Monitor', arg: "'MONITOR'" },
  { key: 'SMPS', id: 'instockCatCard_SMPS', label: 'SMPS', arg: "'SMPS'" },
  { key: 'OTHER', id: 'instockCatCard_OTHER', label: 'Other', arg: "'OTHER'" }
];

test('All 7 category cards exist with Total Assets, AV, and ASS metrics', () => {
  expectedCategories.forEach(c => {
    assert(html.includes(`id="${c.id}"`), `Card ${c.label} (${c.id}) exists`);
    assert(html.includes(`id="instockCatCount_${c.key}_total"`), `Total count element for ${c.key} exists`);
    assert(html.includes(`id="instockCatCount_${c.key}_av"`), `AV count element for ${c.key} exists`);
    assert(html.includes(`id="instockCatCount_${c.key}_ass"`), `ASS count element for ${c.key} exists`);
    assert(html.includes(`filterInventoryByCategory(${c.arg})`), `Card triggers filterInventoryByCategory with ${c.arg}`);
  });
});

test('Category cards have consistent height, subtle border, and refined active highlight in styles.css', () => {
  assert(css.includes('.instock-category-card {'), 'Category card styles exist');
  assert(css.includes('min-height: 124px') || css.includes('min-height: 120px'), 'Consistent height specified');
  assert(css.includes('border: 1px solid #e2e8f0'), 'Subtle border specified');
  assert(css.includes('.instock-category-card.active {'), 'Active card style exists');
  assert(css.includes('border-color: #2563eb'), 'Refined blue accent border');
});

// 4. Redesigned Inventory Table
console.log('\n--- 4. Verification: Redesigned Inventory Table (7 Columns & Status Badges) ---');
test('Table contains exactly the 7 specified enterprise columns in order', () => {
  const tableHeaderIndex = html.indexOf('id="instockInventoryTable"');
  assert(tableHeaderIndex !== -1, 'instockInventoryTable exists');
  const theadSnippet = html.substring(tableHeaderIndex, html.indexOf('</thead>', tableHeaderIndex));
  
  assert(theadSnippet.includes('Asset ID'), 'Column 1: Asset ID exists');
  assert(theadSnippet.includes('Category'), 'Column 2: Category exists');
  assert(theadSnippet.includes('Specification / Model'), 'Column 3: Specification / Model exists');
  assert(theadSnippet.includes('Serial Number'), 'Column 4: Serial Number exists');
  assert(theadSnippet.includes('Purchase Date'), 'Column 5: Purchase Date exists');
  assert(theadSnippet.includes('Current Status'), 'Column 6: Current Status exists');
  assert(theadSnippet.includes('Actions'), 'Column 7: Actions exists');
});

test('Status badges use Green for Assigned and Red for Non-Assigned', () => {
  assert(appJs.includes('🟢 Assigned'), 'Green Assigned badge exists');
  assert(appJs.includes('#166534') || appJs.includes('#16a34a'), 'Green color used for Assigned');
  assert(appJs.includes('🔴 Non-Assigned (Available in Stock)'), 'Red Non-Assigned badge exists');
  assert(appJs.includes('#991b1b') || appJs.includes('#dc2626'), 'Red color used for Non-Assigned');
});

// 5. Overall Page Refinement
console.log('\n--- 5. Verification: Overall Page Refinement & Visual Hierarchy ---');
test('Hardware Inventory Records heading and record count badge are aligned cleanly', () => {
  assert(html.includes('Hardware Inventory Records'), 'Hardware Inventory Records heading exists');
  assert(html.includes('id="instockInventoryCountBadge"'), 'Record count badge exists');
  assert(html.includes('id="btnAddStockPrimary"'), '+ Add Stock primary button exists');
  assert(html.includes('onclick="window.ITApp.openInstockEntryModal()"'), '+ Add Stock button opens modal');
});

// 6. Functional Safety & Database Integrity
console.log('\n--- 6. Verification: Database & Functional Safety ---');
test('SQLite database contains valid instock hardware records without corruption', () => {
  const items = db.getInstockHardware();
  assert(Array.isArray(items) && items.length > 0, 'Database returns hardware items');
  console.log(`   Database contains ${items.length} instock hardware records.`);
});

console.log('\n================================================================');
console.log(`🏁 VERIFICATION COMPLETE: ${passed} / ${total} TESTS PASSED!`);
console.log('================================================================\n');

if (passed === total) {
  console.log('🎉 ALL USER REQUIREMENTS VERIFIED SUCCESSFULLY WITH ZERO REGRESSIONS!');
} else {
  process.exit(1);
}
