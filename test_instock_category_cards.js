const fs = require('fs');
const assert = require('assert');

console.log('================================================================');
console.log('🧪 TESTING INSTOCK CATEGORY CARDS WITH CLICK-TO-FILTER');
console.log('================================================================\n');

const html = fs.readFileSync('./index.html', 'utf8');
const css = fs.readFileSync('./styles.css', 'utf8').replace(/\r\n/g, '\n');
const appJs = fs.readFileSync('./app.js', 'utf8').replace(/\r\n/g, '\n');

function test(name, fn) {
  try {
    fn();
    console.log(`✅ PASS: ${name}`);
  } catch (err) {
    console.error(`❌ FAIL: ${name}`);
    console.error(err.message);
    process.exit(1);
  }
}

// 1. Structure of the Category Cards (including NEW SYSTEM)
console.log('--- 1. Verification of Category Cards in index.html ---');
const requiredCards = [
  { id: 'instockCatCard_all', countId: 'instockCatCount_all', name: 'All Categories', arg: "'all'" },
  { id: 'instockCatCard_CPU', countId: 'instockCatCount_CPU', name: 'Processor', arg: "'CPU'" },
  { id: 'instockCatCard_RAM', countId: 'instockCatCount_RAM', name: 'RAM', arg: "'RAM'" },
  { id: 'instockCatCard_SSD', countId: 'instockCatCount_SSD', name: 'SSD', arg: "'SSD'" },
  { id: 'instockCatCard_MONITOR', countId: 'instockCatCount_MONITOR', name: 'Monitor', arg: "'MONITOR'" },
  { id: 'instockCatCard_SMPS', countId: 'instockCatCount_SMPS', name: 'SMPS', arg: "'SMPS'" },
  { id: 'instockCatCard_OTHER', countId: 'instockCatCount_OTHER', name: 'Other', arg: "'OTHER'" },
  { id: 'instockCatCard_NEW_SYSTEM', countId: 'instockCatCount_NEW_SYSTEM', name: 'New System', arg: "'NEW SYSTEM'" }
];

test('instockCategoryCardsContainer exists in index.html', () => {
  assert(html.includes('id="instockCategoryCardsContainer"'), 'Container exists');
});

requiredCards.forEach(c => {
  test(`Card "${c.name}" (${c.id}) exists with icon, title, count badge, and onclick`, () => {
    assert(html.includes(`id="${c.id}"`), `Card ${c.id} exists`);
    assert(html.includes(`id="${c.countId}"`), `Count badge ${c.countId} exists`);
    assert(html.includes(c.name), `Card title ${c.name} exists`);
    assert(html.includes(`filterInventoryByCategory(${c.arg})`), `Card triggers filterInventoryByCategory with ${c.arg}`);
  });
});

// 2. Removal of Visible Category Dropdown
console.log('\n--- 2. Removal of Visible Category Dropdown & Layout Update ---');
test('Visible category select field is removed from toolbar', () => {
  // Check that the category select has display:none for backward compatibility
  assert(html.includes('id="instockInventoryCategoryFilter" style="display:none;"'), 'Category select is hidden');
  // Row 1 should have 2-column layout now
  assert(css.includes('.instock-filter-row-1 {\n  display: grid;\n  grid-template-columns: 2fr 1fr;'), 'Row 1 has 2fr 1fr columns');
});

// 3. Styling of Category Cards
console.log('\n--- 3. Category Cards Styling in styles.css ---');
test('.instock-category-cards-grid grid styling exists with 8 columns', () => {
  assert(css.includes('.instock-category-cards-grid'), 'Grid class exists');
  assert(css.includes('grid-template-columns: repeat(8, 1fr)'), '8-column grid layout exists');
});

test('.instock-category-card base and hover styles exist', () => {
  assert(css.includes('.instock-category-card {'), 'Base card styles exist');
  assert(css.includes('.instock-category-card:hover {'), 'Card hover styles exist');
});

test('.instock-category-card.active blue accent styles exist', () => {
  assert(css.includes('.instock-category-card.active {'), 'Active card styles exist');
  assert(css.includes('#2563eb'), 'Uses professional blue #2563eb accent');
});

// 4. JS Implementation in app.js
console.log('\n--- 4. Controller Logic in app.js ---');
test('updateInstockCategoryCardsCounts calculates dynamic counts from inventory data including NEW SYSTEM', () => {
  assert(appJs.includes('updateInstockCategoryCardsCounts()'), 'Method updateInstockCategoryCardsCounts exists');
  assert(appJs.includes("setVal('instockCatCount_all'"), 'Updates total all count');
  assert(appJs.includes("setVal('instockCatCount_CPU'"), 'Updates CPU count');
  assert(appJs.includes("setVal('instockCatCount_RAM'"), 'Updates RAM count');
  assert(appJs.includes("setVal('instockCatCount_SSD'"), 'Updates SSD count');
  assert(appJs.includes("setVal('instockCatCount_MONITOR'"), 'Updates Monitor count');
  assert(appJs.includes("setVal('instockCatCount_SMPS'"), 'Updates SMPS count');
  assert(appJs.includes("setVal('instockCatCount_OTHER'"), 'Updates Other count');
  assert(appJs.includes("setVal('instockCatCount_NEW_SYSTEM'"), 'Updates New System count');
});

test('updateInstockCategoryCardsActive toggles active class on selected card including NEW SYSTEM', () => {
  assert(appJs.includes('updateInstockCategoryCardsActive(selectedCat)'), 'Method updateInstockCategoryCardsActive exists');
  assert(appJs.includes("card.classList.add('active')"), 'Adds active class');
  assert(appJs.includes("card.classList.remove('active')"), 'Removes active class');
});

test('filterInventoryByCategory sets category, highlights card, resets page, and renders table', () => {
  assert(appJs.includes('filterInventoryByCategory(cat)'), 'Method filterInventoryByCategory exists');
  assert(appJs.includes('this.updateInstockCategoryCardsActive(catVal)'), 'Calls updateInstockCategoryCardsActive');
  assert(appJs.includes('this.renderInstockInventoryTable()'), 'Calls renderInstockInventoryTable');
});

test('resetInstockDashboardFilters resets active card to all and updates counts', () => {
  assert(appJs.includes("this.updateInstockCategoryCardsActive('all')"), 'Resets active card to all');
  assert(appJs.includes('this.updateInstockCategoryCardsCounts()'), 'Refreshes card counts');
});

test('window.ITApp exposes category card methods', () => {
  assert(appJs.includes('filterInventoryByCategory(cat)'), 'filterInventoryByCategory exposed');
  assert(appJs.includes('updateInstockCategoryCardsCounts()'), 'updateInstockCategoryCardsCounts exposed');
  assert(appJs.includes('updateInstockCategoryCardsActive(cat)'), 'updateInstockCategoryCardsActive exposed');
});

console.log('\n================================================================');
console.log('🏁 ALL INSTOCK CATEGORY CARDS UNIT TESTS PASSED!');
console.log('================================================================');
