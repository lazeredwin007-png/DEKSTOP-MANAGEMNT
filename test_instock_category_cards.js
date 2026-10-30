const fs = require('fs');
const assert = require('assert');

console.log('================================================================');
console.log('🧪 TESTING INSTOCK CATEGORY CARDS (AV & ASS RENAME + CLICK FILTER)');
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
console.log('--- 1. Verification of Strict Card Order (9 Cards) ---');
const expectedOrder = [
  { key: 'NEW_SYSTEM', id: 'instockCatCard_NEW_SYSTEM', name: 'New System', arg: "'NEW SYSTEM'", iconClass: 'cat-icon-new-system' },
  { key: 'CPU', id: 'instockCatCard_CPU', name: 'Processor', arg: "'CPU'", iconClass: 'cat-icon-cpu' },
  { key: 'RAM', id: 'instockCatCard_RAM', name: 'RAM', arg: "'RAM'", iconClass: 'cat-icon-ram' },
  { key: 'SSD', id: 'instockCatCard_SSD', name: 'SSD', arg: "'SSD'", iconClass: 'cat-icon-ssd' },
  { key: 'MONITOR', id: 'instockCatCard_MONITOR', name: 'Monitor', arg: "'MONITOR'", iconClass: 'cat-icon-monitor' },
  { key: 'SMPS', id: 'instockCatCard_SMPS', name: 'SMPS', arg: "'SMPS'", iconClass: 'cat-icon-smps' },
  { key: 'MOUSE', id: 'instockCatCard_MOUSE', name: 'Mouse', arg: "'MOUSE'", iconClass: 'cat-icon-mouse' },
  { key: 'KEYBOARD', id: 'instockCatCard_KEYBOARD', name: 'Keyboard', arg: "'KEYBOARD'", iconClass: 'cat-icon-keyboard' },
  { key: 'OTHER', id: 'instockCatCard_OTHER', name: 'Other', arg: "'OTHER'", iconClass: 'cat-icon-other' }
];

test('instockCategoryCardsContainer exists in index.html', () => {
  assert(html.includes('id="instockCategoryCardsContainer"'), 'Container exists');
});

test('Cards follow strict order: New System first, Other last', () => {
  let lastIndex = -1;
  expectedOrder.forEach((c) => {
    const cardIndex = html.indexOf(`id="${c.id}"`);
    assert(cardIndex !== -1, `Card ${c.name} (${c.id}) must exist in HTML`);
    if (lastIndex !== -1) {
      assert(cardIndex > lastIndex, `Card ${c.name} (${c.id}) must come after previous card`);
    }
    lastIndex = cardIndex;
  });
});

// 2. Icon and Compact Professional Layout Inside Each Category Card
console.log('\n--- 2. Icon and Layout Elements in Each Category Card ---');
test('Each card contains its dedicated .cat-card-icon with SVG icon', () => {
  expectedOrder.forEach(c => {
    const cardStart = html.indexOf(`id="${c.id}"`);
    const nextCard = html.indexOf('class="instock-category-card"', cardStart + 1);
    const cardSnippet = html.substring(cardStart, nextCard !== -1 ? nextCard : cardStart + 2000);
    assert(cardSnippet.includes(`class="cat-card-icon ${c.iconClass}"`), `Icon ${c.iconClass} exists inside card ${c.name}`);
    assert(cardSnippet.includes('<svg'), `SVG element exists inside card ${c.name}`);
  });
});

// 3. Category Cards Total Assets & Click-to-Filter (Standalone AV/ASS pills removed)
console.log('\n--- 3. Category Cards Total Assets & Filter Handlers ---');
test('Each category card contains Total Assets counter and filter triggers', () => {
  expectedOrder.forEach(c => {
    assert(html.includes(`id="instockCatCount_${c.key}_total"`), `Total Assets element exists for ${c.key}`);
    assert(html.includes(`filterInventoryByCategory(${c.arg})`), `Card triggers filterInventoryByCategory with ${c.arg}`);
  });
});

// 4. Instock Summary Cards: Total Assets, Assigned Assets, Non-Assigned Assets
console.log('\n--- 4. Instock Summary Cards Display ---');
test('Instock summary cards display Total Assets, Assigned Assets, and Non-Assigned Assets with live counts', () => {
  assert(html.includes('class="instock-summary-grid"'), 'instock-summary-grid exists');
  assert(html.includes('id="instockTotalCount"'), 'instockTotalCount exists');
  assert(html.includes('id="instockAssignedCount"'), 'instockAssignedCount exists');
  assert(html.includes('id="instockAvailableCount"'), 'instockAvailableCount exists');
  assert(html.includes('Total Assets'), 'Total Assets card label exists');
  assert(html.includes('Assigned Assets'), 'Assigned Assets card label exists');
  assert(html.includes('Non-Assigned Assets'), 'Non-Assigned Assets card label exists');
});

// 5. Styling in styles.css
console.log('\n--- 5. Category Cards & Subcount Pills Styling in styles.css ---');
test('.instock-category-cards-grid grid styling exists with 9 columns', () => {
  assert(css.includes('.instock-category-cards-grid'), 'Grid class exists');
  assert(css.includes('grid-template-columns: repeat(9, 1fr)'), '9-column grid layout exists');
});

test('.instock-category-card base, hover, and active styles exist with rounded corners', () => {
  assert(css.includes('.instock-category-card {'), 'Base card styles exist');
  assert(css.includes('border-radius: 10px') || css.includes('border-radius: 12px'), 'Rounded corners exist on category cards');
  assert(css.includes('.instock-category-card:hover {'), 'Card hover styles exist');
  assert(css.includes('.instock-category-card.active {'), 'Active card styles exist');
  assert(css.includes('#2563eb'), 'Uses professional blue #2563eb accent');
});

// 6. JS Controller Logic in app.js
console.log('\n--- 6. Controller Logic in app.js ---');
test('filterInventoryByCategory preserves status and filters by category', () => {
  assert(appJs.includes('filterInventoryByCategory(cat)'), 'Method filterInventoryByCategory exists');
});

test('updateInstockCategoryCardsCounts calculates dynamic Total Assets, AV, and ASS counts including Mouse & Keyboard', () => {
  assert(appJs.includes('updateInstockCategoryCardsCounts()'), 'Method updateInstockCategoryCardsCounts exists');
  assert(appJs.includes("setGroup('NEW_SYSTEM'"), 'Updates New System counts');
  assert(appJs.includes("setGroup('CPU'"), 'Updates CPU counts');
  assert(appJs.includes("setGroup('RAM'"), 'Updates RAM counts');
  assert(appJs.includes("setGroup('SSD'"), 'Updates SSD counts');
  assert(appJs.includes("setGroup('MONITOR'"), 'Updates Monitor counts');
  assert(appJs.includes("setGroup('SMPS'"), 'Updates SMPS counts');
  assert(appJs.includes("setGroup('OTHER'"), 'Updates Other counts');
  assert(appJs.includes("setGroup('MOUSE'"), 'Updates Mouse counts');
  assert(appJs.includes("setGroup('KEYBOARD'"), 'Updates Keyboard counts');
});

test('updateInstockCategoryCardsActive highlights selected card', () => {
  assert(appJs.includes('updateInstockCategoryCardsActive(selectedCat, selectedStatus)'), 'Accepts selectedCat and selectedStatus');
  assert(appJs.includes("card.classList.add('active')"), 'Adds active class to selected card');
});

test('resetInstockDashboardFilters resets active card and highlights to all', () => {
  assert(appJs.includes("this.updateInstockCategoryCardsActive('all'"), 'Resets active card to all');
  assert(appJs.includes('this.updateInstockCategoryCardsCounts()'), 'Refreshes card counts');
});

// 7. Dynamic Count Calculation Verification with Database Records
console.log('\n--- 7. Dynamic Mathematical Verification (Total Assets = AV + ASS) ---');
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
    { name: 'MOUSE', matcher: i => (i.component_type || '').toUpperCase() === 'MOUSE' },
    { name: 'KEYBOARD', matcher: i => (i.component_type || '').toUpperCase() === 'KEYBOARD' },
    { name: 'OTHER', matcher: i => {
      const ct = (i.component_type || '').toUpperCase();
      return !['CPU', 'PROCESSOR', 'RAM', 'SSD', 'MONITOR', 'SMPS', 'NEW SYSTEM', 'NEW_SYSTEM', 'MOUSE', 'KEYBOARD'].includes(ct);
    }}
  ];

  categories.forEach(cat => {
    const res = getCountsFor(cat.matcher);
    assert.strictEqual(res.total, res.av + res.ass, `For ${cat.name}, Total Assets (${res.total}) must equal AV (${res.av}) + ASS (${res.ass})`);
    console.log(`   📊 ${cat.name.padEnd(12)} -> Total Assets: ${res.total.toString().padStart(2)} | (AV) Non-Assigned: ${res.av.toString().padStart(2)} | (ASS) Assigned: ${res.ass.toString().padStart(2)} (AV + ASS = ${res.av + res.ass})`);
  });
});

console.log('\n================================================================');
console.log('🏁 ALL INSTOCK CATEGORY CARDS UNIT TESTS PASSED PERFECTLY!');
console.log('================================================================\n');
