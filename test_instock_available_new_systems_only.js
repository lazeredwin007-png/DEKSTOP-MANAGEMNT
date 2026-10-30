/**
 * test_instock_available_new_systems_only.js
 * Comprehensive automated verification for:
 * PROMPT — SHOW ONLY NEW SYSTEMS IN INSTOCK AVAILABLE LIST
 */

const assert = require('assert');
const fs = require('fs');

console.log('================================================================');
console.log('🧪 TESTING INSTOCK AVAILABLE LIST: SHOW ONLY NEW SYSTEMS');
console.log('================================================================\n');

// 1. Setup DOM and ITApp environment mock
const elements = {};
function createMockElement(id, tagName = 'div') {
  const el = {
    id,
    tagName: tagName.toUpperCase(),
    value: '',
    style: {},
    _innerHTML: '',
    textContent: '',
    children: [],
    dataset: {},
    options: [],
    querySelectorAll: () => [],
    querySelector: () => null,
    addEventListener: () => {},
    removeEventListener: () => {},
    closest: () => null,
    focus: () => {},
    classList: { add: () => {}, remove: () => {}, contains: () => false, toggle: () => {} }
  };
  Object.defineProperty(el, 'innerHTML', {
    get() { return this._innerHTML; },
    set(html) {
      this._innerHTML = html;
      if (html && typeof html === 'string' && html.includes('<option')) {
        const re = /value=["']([^"']*)["']/g;
        let m;
        this.options = [];
        while ((m = re.exec(html)) !== null) {
          this.options.push({ value: m[1] });
        }
      }
    }
  });
  return el;
}

const mockIds = [
  'instockTotalCount', 'instockAvailableCount', 'instockNonAssignedCount',
  'instockReadyCount', 'instockAssignedCount', 'instockMaintenanceCount',
  'instockRequestsCount', 'instockCategoryCardsContainer',
  'instockCatCard_all', 'instockCatCount_all',
  'instockCatCard_NEW_SYSTEM', 'instockCatCount_NEW_SYSTEM_total', 'instockCatCount_NEW_SYSTEM', 'instockCatCount_NEW_SYSTEM_av', 'instockCatCount_NEW_SYSTEM_ass',
  'instockCatCard_CPU', 'instockCatCount_CPU_total', 'instockCatCount_CPU', 'instockCatCount_CPU_av', 'instockCatCount_CPU_ass',
  'instockCatCard_RAM', 'instockCatCount_RAM_total', 'instockCatCount_RAM', 'instockCatCount_RAM_av', 'instockCatCount_RAM_ass',
  'instockCatCard_SSD', 'instockCatCount_SSD_total', 'instockCatCount_SSD', 'instockCatCount_SSD_av', 'instockCatCount_SSD_ass',
  'instockCatCard_MONITOR', 'instockCatCount_MONITOR_total', 'instockCatCount_MONITOR', 'instockCatCount_MONITOR_av', 'instockCatCount_MONITOR_ass',
  'instockCatCard_SMPS', 'instockCatCount_SMPS_total', 'instockCatCount_SMPS', 'instockCatCount_SMPS_av', 'instockCatCount_SMPS_ass',
  'instockCatCard_OTHER', 'instockCatCount_OTHER_total', 'instockCatCount_OTHER', 'instockCatCount_OTHER_av', 'instockCatCount_OTHER_ass',
  'instockCatCard_MOUSE', 'instockCatCount_MOUSE_total', 'instockCatCount_MOUSE', 'instockCatCount_MOUSE_av', 'instockCatCount_MOUSE_ass',
  'instockCatCard_KEYBOARD', 'instockCatCount_KEYBOARD_total', 'instockCatCount_KEYBOARD', 'instockCatCount_KEYBOARD_av', 'instockCatCount_KEYBOARD_ass',
  'instockInventorySearch', 'instockInventoryStatusFilter', 'instockInventoryCategoryFilter',
  'instockFilterDateFrom', 'instockFilterDateTo', 'instockInventoryTable', 'instockInventoryTableBody',
  'instockInventoryCountBadge', 'instockPaginationInfo', 'instockPaginationControls', 'instockPageSizeSelect',
  'instockInventoryFullSearch', 'instockInventoryFullCategoryFilter', 'instockInventoryFullStatusFilter',
  'instockInventoryFullCountBadge', 'instockInventoryFullTableBody',
  'swapOldUserSelect', 'swapOldAssetDatalist',
  'btnFilterSwapPoolAll', 'btnFilterSwapPoolInStock', 'btnFilterSwapPoolUserExit',
  'themeToggleBtn', 'headerThemeToggle', 'toggleDarkModeBtn',
  'nonAssignedTableBody', 'cardNonAssignedViewTotal', 'cardAvailDesktop', 'cardAvailLaptop'
];

mockIds.forEach(id => {
  elements[id] = createMockElement(id, id.includes('Filter') || id.includes('Select') ? 'select' : id.includes('Search') || id.includes('Input') ? 'input' : 'div');
});

global.document = {
  getElementById: (id) => {
    if (!elements[id]) {
      elements[id] = createMockElement(id);
    }
    return elements[id];
  },
  querySelector: (sel) => createMockElement(`sel_${Math.random()}`),
  querySelectorAll: (sel) => [],
  createElement: (tag) => createMockElement(`dyn_${Math.random()}`, tag),
  addEventListener: () => {},
  removeEventListener: () => {}
};

global.window = {
  ITApp: {},
  location: { hash: '#instock', pathname: '/', protocol: 'http:', origin: 'http://localhost:3000' },
  history: { pushState: () => {}, replaceState: () => {}, state: { view: 'instock' } },
  addEventListener: () => {},
  removeEventListener: () => {}
};

global.sessionStorage = {
  getItem: (k) => k === 'apexit_auth_user' ? JSON.stringify({ username: 'admin', role: 'admin' }) : null,
  setItem: () => {},
  removeItem: () => {}
};

global.localStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {}
};

// Mock fetch
global.fetch = async (url, options = {}) => {
  if (options.method === 'DELETE') {
    return { ok: true, status: 200, json: async () => ({ success: true }) };
  }
  return { ok: true, status: 200, json: async () => ([]) };
};

// Load app.js in sandbox
const appCode = fs.readFileSync('app.js', 'utf8');
eval(appCode);

const app = window.ITAppControllerInstance || window.ITApp;
const store = window.ITAssetStoreInstance;

// Setup mock store data
store.data = {
  instockHardware: [
    // 1. Available New System (SHOULD BE SHOWN under Available)
    {
      id: 'PIX_NEW_SYS_01',
      component_type: 'NEW SYSTEM',
      model: 'Intel i7-13700 • 16GB DDR5',
      spec: 'SSD: 512GB SSD | HDD: None | Mon: Dell 24" | SMPS: 650W | IP: 192.168.1.50',
      serial_number: 'SN-NEW-01',
      purchase_date: '2026-10-25',
      status: 'Available',
      assigned_user: '',
      assigned_date: '',
      team: '',
      tl: '',
      remark: 'New System Configuration'
    },
    // 2. Assigned New System (SHOULD NOT BE SHOWN under Available)
    {
      id: 'PIX_NEW_SYS_02',
      component_type: 'NEW SYSTEM',
      model: 'Intel i5-12400 • 16GB DDR4',
      spec: 'SSD: 256GB SSD | HDD: None | Mon: None | SMPS: 550W | IP: 192.168.1.51',
      serial_number: 'SN-NEW-02',
      purchase_date: '2026-10-20',
      status: 'Assigned',
      assigned_user: 'Karthik Raja',
      assigned_date: '2026-10-22',
      team: 'DevOps',
      tl: 'Sundar Sir',
      remark: 'New System Configuration'
    },
    // 3. Spare CPU Component (Available in stock, BUT MUST NOT be shown under Available in Stock list)
    {
      id: 'STK-CPU-101',
      component_type: 'CPU',
      model: 'Intel Core i5-11400',
      spec: 'Intel Core i5-11400 11th Gen',
      serial_number: 'SN-CPU-101',
      purchase_date: '2025-01-05',
      status: 'Available',
      assigned_user: '',
      assigned_date: '',
      team: '',
      tl: '',
      remark: 'Spare processor component'
    },
    // 4. Spare RAM Component (Available in stock, MUST NOT be shown under Available list)
    {
      id: 'STK-RAM-201',
      component_type: 'RAM',
      model: 'Crucial 16GB DDR4 3200MHz',
      spec: '16GB DDR4 3200MHz',
      serial_number: 'SN-RAM-201',
      purchase_date: '2025-02-10',
      status: 'Available',
      assigned_user: '',
      assigned_date: '',
      team: '',
      tl: '',
      remark: 'Spare memory'
    },
    // 5. Spare SSD Component (Available in stock, MUST NOT be shown under Available list)
    {
      id: 'STK-SSD-301',
      component_type: 'SSD',
      model: 'Samsung 980 1TB NVMe',
      spec: '1TB NVMe M.2 SSD',
      serial_number: 'SN-SSD-301',
      purchase_date: '2025-03-01',
      status: 'Available',
      assigned_user: '',
      assigned_date: '',
      team: '',
      tl: '',
      remark: 'Spare SSD'
    },
    // 6. Spare SMPS Component (Available in stock, MUST NOT be shown under Available list)
    {
      id: 'STK-SMPS-401',
      component_type: 'SMPS',
      model: 'Corsair CV550 550W',
      spec: '550W Bronze PSU',
      serial_number: 'SN-PSU-401',
      purchase_date: '2025-01-15',
      status: 'Available',
      assigned_user: '',
      assigned_date: '',
      team: '',
      tl: '',
      remark: 'Spare power supply'
    },
    // 7. Spare Monitor Component (Available in stock, MUST NOT be shown under Available list)
    {
      id: 'STK-MON-501',
      component_type: 'MONITOR',
      model: 'Dell 24" P2419H',
      spec: '24 inch Full HD IPS Monitor',
      serial_number: 'SN-MON-501',
      purchase_date: '2025-04-12',
      status: 'Available',
      assigned_user: '',
      assigned_date: '',
      team: '',
      tl: '',
      remark: 'Spare monitor'
    },
    // 8. Spare Mouse Component (Available in stock, MUST NOT be shown under Available list)
    {
      id: 'STK-MOU-601',
      component_type: 'MOUSE',
      model: 'Logitech B100 USB Optical Mouse',
      spec: 'USB Optical Mouse',
      serial_number: 'SN-MOU-601',
      purchase_date: '2025-05-01',
      status: 'Available',
      assigned_user: '',
      assigned_date: '',
      team: '',
      tl: '',
      remark: 'Spare peripheral'
    },
    // 9. Spare Keyboard Component (Available in stock, MUST NOT be shown under Available list)
    {
      id: 'STK-KB-701',
      component_type: 'KEYBOARD',
      model: 'Dell KB216 Wired Keyboard',
      spec: 'Wired Multimedia Keyboard',
      serial_number: 'SN-KB-701',
      purchase_date: '2025-05-01',
      status: 'Available',
      assigned_user: '',
      assigned_date: '',
      team: '',
      tl: '',
      remark: 'Spare keyboard'
    },
    // 10. Spare Other Component (Available in stock, MUST NOT be shown under Available list)
    {
      id: 'STK-OTH-801',
      component_type: 'OTHER',
      model: 'HDMI to VGA Adapter Cable',
      spec: 'Display adapter cable',
      serial_number: 'SN-OTH-801',
      purchase_date: '2025-06-01',
      status: 'Available',
      assigned_user: '',
      assigned_date: '',
      team: '',
      tl: '',
      remark: 'Spare accessory'
    },
    // 11. Old Returned / User Exit System in instock (MUST NOT be shown under Available New System list)
    {
      id: 'PIX_DSK_OLD_09',
      component_type: 'Desktop',
      model: 'Dell OptiPlex 3020 • i3 2nd Gen',
      spec: 'i3 2nd Gen | 8 DDR3 | 240GB SSD',
      serial_number: 'SN-OLD-09',
      purchase_date: '2023-01-10',
      status: 'Available',
      assigned_user: '',
      assigned_date: '',
      user_exit_date: '2026-09-15',
      team: '',
      tl: '',
      remark: 'Returned from exited employee'
    }
  ],
  assets: [
    {
      id: 'PIX_NEW_SYS_01',
      type: 'Desktop',
      component_type: 'NEW SYSTEM',
      status: 'Non-Assigned',
      condition: 'Brand New',
      remark: 'New System Configuration',
      user: '',
      oldUsername: '',
      purchaseDate: '2026-10-25'
    },
    {
      id: 'PIX_NEW_SYS_02',
      type: 'Desktop',
      component_type: 'NEW SYSTEM',
      status: 'Assigned',
      condition: 'Brand New',
      user: 'Karthik Raja',
      assignedDate: '2026-10-22'
    },
    {
      id: 'PIX_DSK_OLD_09',
      type: 'Desktop',
      status: 'Non-Assigned',
      user: '',
      oldUsername: 'Exited Employee',
      userExitDate: '2026-09-15',
      workStatus: 'User Exit'
    },
    {
      id: 'PIX_DSK_SWAP_EXIT_01',
      type: 'Desktop',
      status: 'Non-Assigned',
      user: '',
      oldUsername: 'Ramesh K',
      userExitDate: '2026-10-01',
      workStatus: 'User Exit'
    }
  ],
  instockAllocations: []
};

// -------------------------------------------------------------
// Test 1: instockAvailableCount metric update
// -------------------------------------------------------------
console.log('--- Test 1: Available count reflects filtered New System records only ---');
app.renderInstockDashboard();

const totalEl = document.getElementById('instockTotalCount');
const availEl = document.getElementById('instockAvailableCount');
const nonAssignedEl = document.getElementById('instockNonAssignedCount');

console.log('Total Assets displayed:', totalEl.textContent);
console.log('Available Assets displayed:', availEl.textContent);

assert.strictEqual(parseInt(totalEl.textContent, 10), 11, 'Total assets must reflect all 11 items in stock');
assert.strictEqual(parseInt(availEl.textContent, 10), 1, 'instockAvailableCount must equal 1 (only the available New System)');
assert.strictEqual(parseInt(nonAssignedEl.textContent, 10), 1, 'instockNonAssignedCount must equal 1 (only the available New System)');
console.log('✅ PASS: instockAvailableCount correctly matches 1 available New System, excluding spare components.\n');

// -------------------------------------------------------------
// Test 2: Hardware Inventory Records filtering under Available
// -------------------------------------------------------------
console.log('--- Test 2: Hardware Inventory Records under Available in Stock shows New Systems only ---');

// Set status filter to 'Available'
document.getElementById('instockInventoryStatusFilter').value = 'Available';
document.getElementById('instockInventoryCategoryFilter').value = 'all';

app.renderInstockInventoryTable();

const tbody = document.getElementById('instockInventoryTableBody');
const html = tbody.innerHTML;

// Must include PIX_NEW_SYS_01
assert(html.includes('PIX_NEW_SYS_01'), 'Must display the available New System (PIX_NEW_SYS_01)');

// Must NOT include assigned New System
assert(!html.includes('PIX_NEW_SYS_02'), 'Must NOT display assigned New System (PIX_NEW_SYS_02)');

// Must NOT include spare components
assert(!html.includes('STK-CPU-101'), 'Must NOT display Processor (STK-CPU-101)');
assert(!html.includes('STK-RAM-201'), 'Must NOT display RAM (STK-RAM-201)');
assert(!html.includes('STK-SSD-301'), 'Must NOT display SSD (STK-SSD-301)');
assert(!html.includes('STK-SMPS-401'), 'Must NOT display SMPS (STK-SMPS-401)');
assert(!html.includes('STK-MON-501'), 'Must NOT display Monitor (STK-MON-501)');
assert(!html.includes('STK-MOU-601'), 'Must NOT display Mouse (STK-MOU-601)');
assert(!html.includes('STK-KB-701'), 'Must NOT display Keyboard (STK-KB-701)');
assert(!html.includes('STK-OTH-801'), 'Must NOT display Other component (STK-OTH-801)');

// Must NOT include old returned / user exit systems
assert(!html.includes('PIX_DSK_OLD_09'), 'Must NOT display Old / User Exit system (PIX_DSK_OLD_09)');

console.log('✅ PASS: Only PIX_NEW_SYS_01 is displayed under Available; all 8 components and old systems are excluded.\n');

// -------------------------------------------------------------
// Test 3: Existing Actions (Eye View, Edit, Delete) preserved
// -------------------------------------------------------------
console.log('--- Test 3: Eye View, Edit, and Delete action buttons preserved ---');
assert(html.includes('instock-action-view'), 'Must contain Eye View action button');
assert(html.includes('instock-action-edit'), 'Must contain Edit action button');
assert(html.includes('instock-action-delete'), 'Must contain Delete action button');
assert(html.includes("window.ITApp.viewInstockItem('PIX_NEW_SYS_01')"), 'Eye View button wired to viewInstockItem');
assert(html.includes("window.ITApp.openInstockEntryModal(null, 'PIX_NEW_SYS_01')"), 'Edit button wired to openInstockEntryModal');
assert(html.includes("window.ITApp.deleteInstockEntry('PIX_NEW_SYS_01')"), 'Delete button wired to deleteInstockEntry');
console.log('✅ PASS: Eye View, Edit, and Delete action buttons are present and correctly wired.\n');

// -------------------------------------------------------------
// Test 4: Preserving hardware records in other categories and views
// -------------------------------------------------------------
console.log('--- Test 4: Hardware records remain preserved when viewing All or Category ---');

// Set status filter to 'all'
document.getElementById('instockInventoryStatusFilter').value = 'all';
document.getElementById('instockInventoryCategoryFilter').value = 'all';
app.renderInstockInventoryTable();

const allHtml = document.getElementById('instockInventoryTableBody').innerHTML;
assert(allHtml.includes('STK-CPU-101'), 'Processor component must remain preserved in All inventory');
assert(allHtml.includes('STK-SSD-301'), 'SSD component must remain preserved in All inventory');
assert(allHtml.includes('STK-SMPS-401'), 'SMPS component must remain preserved in All inventory');
assert(allHtml.includes('PIX_NEW_SYS_01'), 'New System must remain preserved in All inventory');

// Filter by Processor category
document.getElementById('instockInventoryCategoryFilter').value = 'CPU';
app.renderInstockInventoryTable();
const cpuHtml = document.getElementById('instockInventoryTableBody').innerHTML;
assert(cpuHtml.includes('STK-CPU-101'), 'Processor record must be displayed when filtering by CPU category');
assert(!cpuHtml.includes('PIX_NEW_SYS_01'), 'New System must not be shown under CPU category');
console.log('✅ PASS: Excluded hardware records are not deleted; they remain in their respective categories and views.\n');

// -------------------------------------------------------------
// Test 5: System Swap Facility Dropdown Kept Separate & Functional
// -------------------------------------------------------------
console.log('--- Test 5: System Swap Facility dropdown kept separate & not restricted to New System ---');

const swapSelect = elements['swapOldUserSelect'];

// Test 'all' pool
app.populateSwapOldUserSelect('all');
console.log('Swap dropdown HTML (sample):', swapSelect.innerHTML.substring(0, 160));

assert(swapSelect.innerHTML.includes('PIX_DSK_OLD_09'), 'Swap dropdown must include old user exit system PIX_DSK_OLD_09');
assert(swapSelect.innerHTML.includes('PIX_DSK_SWAP_EXIT_01'), 'Swap dropdown must include user exit system PIX_DSK_SWAP_EXIT_01');

// Test 'userexit' filter
app.populateSwapOldUserSelect('userexit');
assert(swapSelect.innerHTML.includes('PIX_DSK_OLD_09'), 'Swap User Exit filter must include PIX_DSK_OLD_09');

console.log('✅ PASS: System Swap Facility dropdown preserves old systems and User Exit pool, completely separate from Instock available list.\n');

console.log('================================================================');
console.log('🏁 RESULT: ALL 5 TEST SUITES PASSED SUCCESSFULLY!');
console.log('================================================================');
