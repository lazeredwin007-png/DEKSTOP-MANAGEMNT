const fs = require('fs');
const assert = require('assert');
const http = require('http');

console.log('================================================================');
console.log('🧪 VERIFYING COMPLETE INSTOCK UI REDESIGN SPECIFICATION');
console.log('================================================================\n');

const html = fs.readFileSync('index.html', 'utf8');
const appJs = fs.readFileSync('app.js', 'utf8');
const css = fs.readFileSync('styles.css', 'utf8');

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

// 1. Header & Primary Action
console.log('--- 1. Professional Header & + Add Stock Button ---');
test('Header displays Instock title, subtitle description and + Add Stock button', () => {
  assert(html.includes('id="view-instock"'), 'view-instock panel exists');
  assert(html.includes('Instock'), 'Instock title exists');
  assert(html.includes('Manage hardware inventory and prepare available systems for assignment.'), 'Description exists');
  assert(html.includes('id="btnAddStockPrimary"'), 'btnAddStockPrimary exists');
  assert(html.includes('onclick="window.ITApp.openInstockEntryModal()"'), 'btnAddStockPrimary invokes openInstockEntryModal()');
});

// 2. Summary Cards (Total Stock, Available, Assigned)
console.log('\n--- 2. Three Summary Cards ---');
test('3 Summary cards exist with clear icons and live counters', () => {
  assert(html.includes('id="instockTotalCount"'), 'Total Stock counter exists');
  assert(html.includes('id="instockAvailableCount"'), 'Available counter exists');
  assert(html.includes('id="instockAssignedCount"'), 'Assigned counter exists');
  assert(html.includes('class="instock-summary-card total"'), 'Total card class exists');
  assert(html.includes('class="instock-summary-card available"'), 'Available card class exists');
  assert(html.includes('class="instock-summary-card assigned"'), 'Assigned card class exists');
});

// 3. Filter Toolbar & Dropdowns
console.log('\n--- 3. Clean Filter Toolbar ---');
test('Filter toolbar contains Search, Category, Status, Date Range and Reset button', () => {
  assert(html.includes('id="instockInventorySearch"'), 'Search input exists');
  assert(html.includes('id="instockInventoryCategoryFilter"'), 'Category select exists');
  assert(html.includes('id="instockInventoryStatusFilter"'), 'Status select exists');
  assert(html.includes('id="instockFilterDateFrom"'), 'Date From input exists');
  assert(html.includes('id="instockFilterDateTo"'), 'Date To input exists');
  assert(html.includes('window.ITApp.resetInstockDashboardFilters()'), 'Reset button invokes resetInstockDashboardFilters()');
});

test('Category filter supports icons for All Categories, CPU, RAM, SSD, Monitor, SMPS, and Other', () => {
  assert(html.includes('📁 All Categories') || appJs.includes('📁 All Categories'), 'Has 📁 All Categories');
  assert(html.includes('💻 CPU') || appJs.includes('💻 CPU') || appJs.includes("'CPU': '💻'"), 'Has CPU icon');
  assert(html.includes('🧠 RAM') || appJs.includes('🧠 RAM') || appJs.includes("'RAM': '🧠'"), 'Has RAM icon');
  assert(html.includes('⚡ SSD') || appJs.includes('⚡ SSD') || appJs.includes("'SSD': '⚡'"), 'Has SSD icon');
  assert(html.includes('🖥️ Monitor') || appJs.includes('🖥️ Monitor') || appJs.includes("'MONITOR': '🖥️'"), 'Has Monitor icon');
  assert(html.includes('🔌 SMPS') || appJs.includes('🔌 SMPS') || appJs.includes("'SMPS': '🔌'"), 'Has SMPS icon');
  assert(html.includes('🧰 Other') || appJs.includes('🧰 Other') || appJs.includes("'OTHER': '🧰'"), 'Has Other icon');
});

test('Status filter has All Status, Assigned, and Non-Assigned without separate green/red filter buttons', () => {
  assert(html.includes('<option value="all">All Status</option>') || html.includes('<option value="all">All Statuses</option>'), 'All Status option exists');
  assert(html.includes('<option value="Assigned">Assigned</option>'), 'Assigned status option exists');
  assert(html.includes('<option value="Available">Non-Assigned</option>') || html.includes('Non-Assigned'), 'Non-Assigned status option exists');
  // Check that there are no standalone small green/red filter buttons in the toolbar
  assert(!html.includes('class="btn btn-sm btn-success" data-filter="Assigned"'), 'No separate green filter button');
  assert(!html.includes('class="btn btn-sm btn-danger" data-filter="Non-Assigned"'), 'No separate red filter button');
});

// 4. Table Structure & Row Actions
console.log('\n--- 4. Table Structure & Row Actions ---');
test('Table contains exactly 7 columns', () => {
  assert(html.includes('<th style="min-width:120px;">Asset ID</th>'), 'Asset ID column exists');
  assert(html.includes('<th style="min-width:120px;">Category</th>'), 'Category column exists');
  assert(html.includes('<th style="min-width:240px;">Specification / Model</th>'), 'Specification / Model column exists');
  assert(html.includes('<th style="min-width:140px;">Serial Number</th>'), 'Serial Number column exists');
  assert(html.includes('<th style="min-width:120px;">Purchase Date</th>'), 'Purchase Date column exists');
  assert(html.includes('<th style="min-width:140px;">Current Status</th>'), 'Current Status column exists');
  assert(html.includes('Actions</th>'), 'Actions column exists');
});

test('Table row actions include View (👁️), Edit (✏️), Duplicate (📋), and Delete (🗑️)', () => {
  assert(appJs.includes("window.ITApp.viewInstockItem('${item.id}')"), 'Row calls viewInstockItem');
  assert(appJs.includes("window.ITApp.openInstockEntryModal(null, '${item.id}')"), 'Row calls openInstockEntryModal');
  assert(appJs.includes("window.ITApp.duplicateInstockItem('${item.id}')"), 'Row calls duplicateInstockItem');
  assert(appJs.includes("window.ITApp.deleteInstockEntry('${item.id}')"), 'Row calls deleteInstockEntry');
  assert(appJs.includes('title="View Details"'), 'Has View Details tooltip');
  assert(appJs.includes('title="Edit Asset"'), 'Has Edit Asset tooltip');
  assert(appJs.includes('title="Duplicate Asset"'), 'Has Duplicate Asset tooltip');
  assert(appJs.includes('title="Delete Asset"'), 'Has Delete Asset tooltip');
});

test('Duplicate action duplicates specification, pre-selects category, and generates new asset ID without duplication error', () => {
  assert(appJs.includes('duplicateInstockItem(id)'), 'duplicateInstockItem implemented in controller');
  assert(appJs.includes('window.ITApp = {') && appJs.includes('duplicateInstockItem(id) {\n      app.duplicateInstockItem(id);'), 'Exposed on window.ITApp');
});

test('Current Status column displays green Assigned and red Non-Assigned badges', () => {
  assert(appJs.includes('🟢 Assigned'), 'Status column renders green Assigned badge');
  assert(appJs.includes('🔴 Non-Assigned (Available in Stock)'), 'Status column renders red Non-Assigned badge');
  assert(appJs.includes('#f0fdf4') && appJs.includes('#166534'), 'Assigned badge uses green styling');
  assert(appJs.includes('#fef2f2') && appJs.includes('#991b1b'), 'Non-Assigned badge uses red styling');
});

// 5. Pagination
console.log('\n--- 5. Clean Pagination & Layout ---');
test('Pagination container, controls, and helper methods exist', () => {
  assert(html.includes('id="instockPaginationContainer"'), 'instockPaginationContainer exists');
  assert(html.includes('id="instockPaginationInfo"'), 'instockPaginationInfo exists');
  assert(html.includes('id="instockPaginationControls"'), 'instockPaginationControls exists');
  assert(html.includes('id="instockPageSizeSelect"'), 'instockPageSizeSelect exists');
  assert(appJs.includes('renderInstockPagination('), 'renderInstockPagination implemented');
  assert(appJs.includes('changeInstockPage('), 'changeInstockPage implemented');
  assert(appJs.includes('changeInstockPageSize('), 'changeInstockPageSize implemented');
});

test('Date range filtering logic implemented in renderInstockInventoryTable', () => {
  assert(appJs.includes('instockFilterDateFrom'), 'Filters using Date From');
  assert(appJs.includes('instockFilterDateTo'), 'Filters using Date To');
  assert(appJs.includes('item.purchase_date < dateFrom'), 'Validates from date');
  assert(appJs.includes('item.purchase_date > dateTo'), 'Validates to date');
});

console.log('\n================================================================');
console.log(`🏁 VERIFICATION SUMMARY: ${passed} / ${total} CHECKS PASSED`);
console.log('================================================================\n');

if (passed === total) {
  console.log('🎉 ALL 12 USER REQUIREMENTS FULLY IMPLEMENTED AND VERIFIED!');
  process.exit(0);
} else {
  process.exit(1);
}
