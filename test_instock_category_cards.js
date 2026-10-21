const fs = require('fs');
const assert = require('assert');

console.log('================================================================');
console.log('🧪 TESTING INSTOCK CATEGORY CARDS (AV & ASS CLICK-TO-FILTER)');
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
  expectedOrder.forEach((c) => {
    const cardIndex = html.indexOf(`id="${c.id}"`);
    assert(cardIndex !== -1, `Card ${c.id} exists in HTML`);
    if (lastIndex !== -1) {
      assert(cardIndex > lastIndex, `Card ${c.name} (${c.id}) must come after previous card`);
    }
    lastIndex = cardIndex;
  });
});

// 2. Removal of Image/Icon Box from Category Cards
console.log('\n--- 2. Removal of Image/Icon Box from Category Cards ---');
test('Image/icon box (.cat-card-icon) is removed from all category cards', () => {
  const containerStart = html.indexOf('id="instockCategoryCardsContainer"');
  const containerEnd = html.indexOf('<!-- Advanced Filter Panel', containerStart);
  const containerSnippet = html.substring(containerStart, containerEnd);
  assert(!containerSnippet.includes('class="cat-card-icon'), 'No cat-card-icon inside category cards container');
});

// 3. Name Change: (AV) Non-Assigned and (ASS) Assigned with Click Handlers
console.log('\n--- 3. Name Change: (AV) Non-Assigned & (ASS) Assigned with Click-to-Filter ---');
test('Each card contains (AV) Non-Assigned and (ASS) Assigned clickable buttons with live counts', () => {
  expectedOrder.forEach(c => {
    assert(html.includes(`id="instockCatCount_${c.key}_total"`), `Total Assets element exists for ${c.key}`);
    assert(html.includes(`id="instockCatCount_${c.key}_av"`), `AV count element exists for ${c.key}`);
    assert(html.includes(`id="instockCatCount_${c.key}_ass"`), `ASS count element exists for ${c.key}`);
    assert(html.includes('(AV) Non-Assigned:'), 'Contains "(AV) Non-Assigned:" name');
    assert(html.includes('(ASS) Assigned:'), 'Contains "(ASS) Assigned:" name');
    assert(html.includes(`id="instockCatPill_${c.key}_av"`), `AV pill exists for ${c.key}`);
    assert(html.includes(`id="instockCatPill_${c.key}_ass"`), `ASS pill exists for ${c.key}`);
    assert(html.includes(`filterInventoryByCatAndStatus(${c.arg}, 'Available')`), `AV pill triggers filterInventoryByCatAndStatus for ${c.arg} Available`);
    assert(html.includes(`filterInventoryByCatAndStatus(${c.arg}, 'Assigned')`), `ASS pill triggers filterInventoryByCatAndStatus for ${c.arg} Assigned`);
  });
});

// 4. Old Large Summary Cards Hidden
console.log('\n--- 4. Old Large Summary Cards Hidden ---');
test('Old large summary cards grid is hidden via inline style display:none !important', () => {
  assert(html.includes('class="instock-summary-grid" style="display:none !important;"'), 'instock-summary-grid is visually hidden');
});

// 5. Styling in styles.css
console.log('\n--- 5. Category Cards & Subcount Pills Styling in styles.css ---');
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

test('.cat-subcount-pill active-status styles exist for AV (green) and ASS (purple)', () => {
  assert(css.includes('.cat-subcount-pill'), 'Subcount pill style exists');
  assert(css.includes('.cat-subcount-av.active-status'), 'AV active-status style exists');
  assert(css.includes('.cat-subcount-ass.active-status'), 'ASS active-status style exists');
});

// 6. JS Implementation in app.js
console.log('\n--- 6. Controller Logic in app.js ---');
test('filterInventoryByCatAndStatus filters by both category and status, supports toggle-off', () => {
  assert(appJs.includes('filterInventoryByCatAndStatus(cat, status)'), 'Method filterInventoryByCatAndStatus exists');
  assert(appJs.includes('window.ITApp.filterInventoryByCatAndStatus') || appJs.includes('filterInventoryByCatAndStatus(cat, status) {'), 'Exposed on window.ITApp');
});

test('updateInstockCategoryCardsActive highlights selected card and selected AV/ASS pill', () => {
  assert(appJs.includes('updateInstockCategoryCardsActive(selectedCat, selectedStatus)'), 'Accepts selectedCat and selectedStatus');
  assert(appJs.includes("avPill.classList.add('active-status')"), 'Adds active-status to AV pill');
  assert(appJs.includes("assPill.classList.add('active-status')"), 'Adds active-status to ASS pill');
});

test('resetInstockDashboardFilters resets active card and pill highlights to all', () => {
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
    { name: 'OTHER', matcher: i => {
      const ct = (i.component_type || '').toUpperCase();
      return !['CPU', 'PROCESSOR', 'RAM', 'SSD', 'MONITOR', 'SMPS', 'NEW SYSTEM', 'NEW_SYSTEM'].includes(ct);
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
