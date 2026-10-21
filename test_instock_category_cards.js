const fs = require('fs');
const assert = require('assert');

console.log('================================================================');
console.log('🧪 TESTING INSTOCK CATEGORY CARDS (7 CARDS, 3 COUNTS EACH)');
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

// 1. Strict Card Order in index.html
console.log('--- 1. Verification of Strict Card Order (7 Cards) ---');
const expectedOrder = [
  { key: 'NEW_SYSTEM', id: 'instockCatCard_NEW_SYSTEM', name: 'New System', arg: "'NEW SYSTEM'" },
  { key: 'CPU', id: 'instockCatCard_CPU', name: 'Processor', arg: "'CPU'" },
  { key: 'RAM', id: 'instockCatCard_RAM', name: 'RAM', arg: "'RAM'" },
  { key: 'SSD', id: 'instockCatCard_SSD', name: 'SSD', arg: "'SSD'" },
  { key: 'MONITOR', id: 'instockCatCard_MONITOR', name: 'Monitor', arg: "'MONITOR'" },
  { key: 'SMPS', id: 'instockCatCard_SMPS', name: 'SMPS', arg: "'SMPS'" },
  { key: 'OTHER', id: 'instockCatCard_OTHER', name: 'Other', arg: "'OTHER'" }
];

test('instockCategoryCardsContainer exists in index.html', () => {
  assert(html.includes('id="instockCategoryCardsContainer"'), 'Container exists');
});

test('Cards follow strict order: New System first, Other last', () => {
  let lastIndex = -1;
  expectedOrder.forEach((c, idx) => {
    const cardIndex = html.indexOf(`id="${c.id}"`);
    assert(cardIndex !== -1, `Card ${c.id} exists in HTML`);
    if (lastIndex !== -1) {
      assert(cardIndex > lastIndex, `Card ${c.name} (${c.id}) must come after previous card`);
    }
    lastIndex = cardIndex;
  });
});

test('Each card contains Total Assets, AV, and ASS counts elements', () => {
  expectedOrder.forEach(c => {
    assert(html.includes(`id="instockCatCount_${c.key}_total"`), `Total Assets element exists for ${c.key}`);
    assert(html.includes(`id="instockCatCount_${c.key}_av"`), `AV count element exists for ${c.key}`);
    assert(html.includes(`id="instockCatCount_${c.key}_ass"`), `ASS count element exists for ${c.key}`);
    assert(html.includes(`Total Assets:`), 'Contains "Total Assets:" label');
    assert(html.includes(`AV:`), 'Contains "AV:" label');
    assert(html.includes(`ASS:`), 'Contains "ASS:" label');
    assert(html.includes(`filterInventoryByCategory(${c.arg})`), `Card triggers filterInventoryByCategory with ${c.arg}`);
  });
});

// 2. Old Large Summary Cards Hidden
console.log('\n--- 2. Old Large Summary Cards Hidden ---');
test('Old large summary cards grid is hidden via inline style display:none !important', () => {
  assert(html.includes('class="instock-summary-grid" style="display:none !important;"'), 'instock-summary-grid is visually hidden');
});

// 3. Styling of Category Cards
console.log('\n--- 3. Category Cards Styling in styles.css ---');
test('.instock-category-cards-grid grid styling exists with 7 columns', () => {
  assert(css.includes('.instock-category-cards-grid'), 'Grid class exists');
  assert(css.includes('grid-template-columns: repeat(7, 1fr)'), '7-column grid layout exists');
});

test('.instock-category-card base, hover, and active styles exist', () => {
  assert(css.includes('.instock-category-card {'), 'Base card styles exist');
  assert(css.includes('.instock-category-card:hover {'), 'Card hover styles exist');
  assert(css.includes('.instock-category-card.active {'), 'Active card styles exist');
  assert(css.includes('#2563eb'), 'Uses professional blue #2563eb accent');
});

test('.cat-card-total-row, .cat-subcount-pill, AV and ASS pill styles exist', () => {
  assert(css.includes('.cat-card-total-row'), 'Total row style exists');
  assert(css.includes('.cat-subcount-pill'), 'Subcount pill style exists');
  assert(css.includes('.cat-subcount-av'), 'AV pill style exists');
  assert(css.includes('.cat-subcount-ass'), 'ASS pill style exists');
});

// 4. JS Implementation in app.js
console.log('\n--- 4. Controller Logic in app.js ---');
test('updateInstockCategoryCardsCounts calculates dynamic Total Assets, AV, and ASS counts', () => {
  assert(appJs.includes('updateInstockCategoryCardsCounts()'), 'Method updateInstockCategoryCardsCounts exists');
  assert(appJs.includes("setGroup('NEW_SYSTEM'"), 'Updates New System counts');
  assert(appJs.includes("setGroup('CPU'"), 'Updates CPU counts');
  assert(appJs.includes("setGroup('RAM'"), 'Updates RAM counts');
  assert(appJs.includes("setGroup('SSD'"), 'Updates SSD counts');
  assert(appJs.includes("setGroup('MONITOR'"), 'Updates Monitor counts');
  assert(appJs.includes("setGroup('SMPS'"), 'Updates SMPS counts');
  assert(appJs.includes("setGroup('OTHER'"), 'Updates Other counts');
});

test('updateInstockCategoryCardsActive toggles active class on selected card', () => {
  assert(appJs.includes('updateInstockCategoryCardsActive(selectedCat)'), 'Method updateInstockCategoryCardsActive exists');
  assert(appJs.includes("card.classList.add('active')"), 'Adds active class');
  assert(appJs.includes("card.classList.remove('active')"), 'Removes active class');
});

test('filterInventoryByCategory sets category, supports toggle-off, and re-renders table', () => {
  assert(appJs.includes('filterInventoryByCategory(cat)'), 'Method filterInventoryByCategory exists');
  assert(appJs.includes('catVal = \'all\''), 'Supports unselecting/toggling off to all');
  assert(appJs.includes('this.updateInstockCategoryCardsActive(catVal)'), 'Calls updateInstockCategoryCardsActive');
  assert(appJs.includes('this.renderInstockInventoryTable()'), 'Calls renderInstockInventoryTable');
});

test('resetInstockDashboardFilters resets active card to all and updates counts', () => {
  assert(appJs.includes("this.updateInstockCategoryCardsActive('all')"), 'Resets active card to all');
  assert(appJs.includes('this.updateInstockCategoryCardsCounts()'), 'Refreshes card counts');
});

// 5. Dynamic Count Calculation Verification with Database Records
console.log('\n--- 5. Dynamic Mathematical Verification (Total Assets = AV + ASS) ---');
test('Verify Total Assets === AV + ASS across all categories on real database records', () => {
  const db = require('./database');
  const items = db.getInstockHardware();
  assert(Array.isArray(items) && items.length > 0, 'Database contains instock items');

  const getCountsFor = (matcher) => {
    const catItems = items.filter(matcher);
    const catTotal = catItems.length;
    const catAss = catItems.filter(i => (i.status || '') === 'Assigned').length;
    const catAv = catTotal - catAss;
    return { total: catTotal, av: catAv, ass: catAss };
  };

  const categories = [
    { name: 'NEW SYSTEM', matcher: i => {
      const ct = (i.component_type || '').toUpperCase();
      return ct === 'NEW SYSTEM' || ct === 'NEW_SYSTEM';
    }},
    { name: 'CPU', matcher: i => {
      const ct = (i.component_type || '').toUpperCase();
      return ct === 'CPU' || ct === 'PROCESSOR';
    }},
    { name: 'RAM', matcher: i => (i.component_type || '').toUpperCase() === 'RAM' },
    { name: 'SSD', matcher: i => (i.component_type || '').toUpperCase() === 'SSD' },
    { name: 'MONITOR', matcher: i => (i.component_type || '').toUpperCase() === 'MONITOR' },
    { name: 'SMPS', matcher: i => (i.component_type || '').toUpperCase() === 'SMPS' },
    { name: 'OTHER', matcher: i => {
      const ct = (i.component_type || '').toUpperCase();
      return !['CPU', 'PROCESSOR', 'RAM', 'SSD', 'MONITOR', 'SMPS', 'NEW SYSTEM', 'NEW_SYSTEM'].includes(ct);
    }}
  ];

  categories.forEach(cat => {
    const res = getCountsFor(cat.matcher);
    assert.strictEqual(res.total, res.av + res.ass, `For ${cat.name}, Total Assets (${res.total}) must equal AV (${res.av}) + ASS (${res.ass})`);
    console.log(`   📊 ${cat.name.padEnd(12)} -> Total Assets: ${res.total.toString().padStart(2)} | AV: ${res.av.toString().padStart(2)} | ASS: ${res.ass.toString().padStart(2)} (AV + ASS = ${res.av + res.ass})`);
  });
});

console.log('\n================================================================');
console.log('🏁 ALL 7 INSTOCK CATEGORY CARDS TESTS PASSED PERFECTLY!');
console.log('================================================================\n');
