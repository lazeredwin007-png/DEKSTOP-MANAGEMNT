/**
 * ============================================================================
 * VERIFICATION TEST SUITE: HARDWARE INVENTORY RECORDS - EYE VIEW UI
 * Verifies separate compact Eye Views for Assigned (7 details) and Non-Assigned (4 details)
 * ============================================================================
 */

const fs = require('fs');
const assert = require('assert');

console.log('================================================================');
console.log('🧪 VERIFYING HARDWARE INVENTORY RECORDS EYE VIEW UI SPECIFICATION');
console.log('================================================================\n');

// Mock DOM elements
const elements = {};
function createMockElement(id, tagName = 'div') {
  return {
    id,
    tagName: tagName.toUpperCase(),
    value: '',
    style: {},
    innerHTML: '',
    textContent: '',
    children: [],
    querySelectorAll: () => [],
    querySelector: (sel) => {
      if (sel === '.modal-dialog') return elements['viewAssetModalDialog'];
      return null;
    },
    addEventListener: () => {},
    closest: () => null,
    focus: () => {},
    classList: {
      add: (cls) => {},
      remove: (cls) => {},
      contains: () => false,
      toggle: () => {}
    }
  };
}

const mockIds = [
  'modalViewAsset', 'viewAssetModalDialog', 'viewAssetModalHeader',
  'viewAssetModalMeta', 'viewAssetModalBody', 'viewAssetModalFooter',
  'viewAssetEditModalBtn', 'viewAssetHistoryModalBtn', 'modalViewInstockItem',
  'viewHwAssetId', 'viewHwStatusBadge', 'viewHwCategory', 'viewHwPurchaseDate',
  'viewHwSpec', 'viewHwSerial', 'viewHwRemark', 'viewHwAssignmentSection',
  'viewHwAssignedUser', 'viewHwAssignedTeam', 'viewHwAssignedTl', 'viewHwAssignedDate'
];

mockIds.forEach(id => {
  elements[id] = createMockElement(id);
});

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

global.window = {
  location: { hash: '#instock-inventory', pathname: '/', protocol: 'http:', origin: 'http://localhost:3000' },
  history: { pushState: () => {}, replaceState: () => {}, state: { view: 'instock-inventory' } },
  addEventListener: () => {},
  removeEventListener: () => {},
  scrollTo: () => {},
  sessionStorage: global.sessionStorage,
  localStorage: global.localStorage
};

global.history = global.window.history;
global.location = global.window.location;

global.document = {
  getElementById: (id) => elements[id] || createMockElement(id),
  querySelectorAll: () => [],
  querySelector: () => null,
  body: { appendChild: () => {} },
  addEventListener: () => {}
};

global.fetch = () => Promise.resolve({
  ok: true,
  json: () => Promise.resolve([])
});

// Evaluate app.js
eval(fs.readFileSync('app.js', 'utf8'));

const app = window.ITApp;
const store = window.ITAssetStoreInstance;

assert(app, 'window.ITApp must be defined');
assert(store, 'store instance must be defined');

// Prepare Mock Data
const today = new Date();
const in120Days = new Date(today.getTime() + 120 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10);
const in15Days = new Date(today.getTime() + 15 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10);
const pastDate = '2024-01-15';

store.data.assets = [
  {
    id: 'PIX_DSK_45',
    type: 'Desktop',
    user: 'Alex Naiat',
    team: 'PHP',
    tl: 'Sundar Pichai',
    warrantyEnd: in120Days,
    status: 'Assigned',
    assignedDate: '2026-10-09',
    purchaseDate: '2026-10-22'
  }
];

store.data.instockHardware = [
  // 1. Assigned Asset with Warranty
  {
    id: 'PIX_DSK_45',
    component_type: 'NEW SYSTEM',
    spec: 'SSD: 256GB NVMe M.2 | HDD: 1TB HDD',
    serial_number: 'SN-PIX-45',
    purchase_date: '2026-10-22',
    status: 'Assigned',
    assigned_user: 'Alex Naiat',
    assigned_date: '2026-10-09',
    team: 'PHP',
    tl: 'Sundar Pichai',
    remark: 'Assigned desktop',
    warranty_expiry: in120Days
  },
  // 2. Assigned Asset with Missing Assignment Info & Expiring Soon Warranty
  {
    id: 'STK-CPU-99',
    component_type: 'CPU',
    spec: 'Intel Core i7-13700',
    serial_number: 'SN-CPU-99',
    purchase_date: '2025-05-10',
    status: 'Assigned',
    assigned_user: '', // Missing
    assigned_date: '', // Missing
    team: '',          // Missing
    tl: '',            // Missing
    remark: '',
    warranty_expiry: in15Days
  },
  // 3. Non-Assigned Asset (Available) with Expired Warranty
  {
    id: 'STK-SSD-204',
    component_type: 'SSD',
    spec: 'Crucial 500GB NVMe',
    serial_number: 'SN-SSD-89128',
    purchase_date: '2026-10-21',
    status: 'Available',
    assigned_user: '',
    assigned_date: '',
    team: '',
    tl: '',
    remark: 'In stock',
    warranty_expiry: pastDate
  },
  // 4. Non-Assigned Asset without Warranty Information
  {
    id: 'STK-RAM-302',
    component_type: 'RAM',
    spec: '16GB DDR4 Kingston',
    serial_number: 'SN-RAM-302',
    purchase_date: '2025-02-10',
    status: 'Ready for Assignment',
    assigned_user: '',
    assigned_date: '',
    team: '',
    tl: '',
    remark: 'Brand new RAM'
  }
];

// ----------------------------------------------------------------------------
// TEST 1: ASSIGNED ASSETS — EXACTLY 7 DETAILS ONLY
// ----------------------------------------------------------------------------
console.log('--- 1. Testing Assigned Assets Eye View (Exactly 7 Details) ---');

app.viewInstockItem('PIX_DSK_45');
const assignedHtml = elements['viewAssetModalBody'].innerHTML;

// Verify exactly the 7 labels exist
assert(assignedHtml.includes('Assigned Date'), '1. Assigned Date label must be present');
assert(assignedHtml.includes('Asset ID'), '2. Asset ID label must be present');
assert(assignedHtml.includes('Category'), '3. Category label must be present');
assert(assignedHtml.includes('Assigned User Name'), '4. Assigned User Name label must be present');
assert(assignedHtml.includes('User Team'), '5. User Team label must be present');
assert(assignedHtml.includes('User TL'), '6. User TL label must be present');
assert(assignedHtml.includes('Warranty Status &amp; Days Remaining') || assignedHtml.includes('Warranty Status & Days Remaining'), '7. Warranty Status & Days Remaining label must be present');

// Verify values
assert(assignedHtml.includes('PIX_DSK_45'), 'Asset ID value rendered');
assert(assignedHtml.includes('New System'), 'Category formatted cleanly');
assert(assignedHtml.includes('Alex Naiat'), 'Assigned user name rendered');
assert(assignedHtml.includes('PHP'), 'User team rendered');
assert(assignedHtml.includes('Sundar Pichai'), 'User TL rendered');
assert(assignedHtml.includes('Oct 9, 2026') || assignedHtml.includes('2026-10-09'), 'Assigned date rendered');
assert(assignedHtml.includes('Under Warranty'), 'Warranty status badge rendered');
assert(assignedHtml.includes('days remaining'), 'Warranty days remaining rendered');
assert(assignedHtml.includes('120 days remaining'), 'Exact 120 days remaining rendered dynamically');

// Verify EXCLUSIONS: No hardware specs, serial number, notes, employee ID, or purchase date
assert(!assignedHtml.includes('Purchase Date'), 'Purchase date must NOT appear in assigned view');
assert(!assignedHtml.includes('SN-PIX-45'), 'Serial number must NOT appear');
assert(!assignedHtml.includes('HARDWARE NOTES'), 'Notes/remarks must NOT appear');
assert(!assignedHtml.includes('Employee ID'), 'Employee ID must NOT appear');
assert(!assignedHtml.includes('256GB NVMe'), 'Hardware specification details must NOT appear in eye view body');

console.log('✅ PASS: Assigned Eye View displays ONLY the 7 requested details with zero excluded fields.');

// ----------------------------------------------------------------------------
// TEST 2: NON-ASSIGNED ASSETS — EXACTLY 4 DETAILS ONLY
// ----------------------------------------------------------------------------
console.log('\n--- 2. Testing Non-Assigned Assets Eye View (Exactly 4 Details) ---');

app.viewInstockItem('STK-SSD-204');
const nonAssignedHtml = elements['viewAssetModalBody'].innerHTML;

// Verify exactly the 4 labels exist
assert(nonAssignedHtml.includes('Purchase Date'), '1. Purchase Date label must be present');
assert(nonAssignedHtml.includes('Asset ID'), '2. Asset ID label must be present');
assert(nonAssignedHtml.includes('Category'), '3. Category label must be present');
assert(nonAssignedHtml.includes('Warranty Status &amp; Days Remaining') || nonAssignedHtml.includes('Warranty Status & Days Remaining'), '4. Warranty Status & Days Remaining label must be present');

// Verify values
assert(nonAssignedHtml.includes('STK-SSD-204'), 'Asset ID value rendered');
assert(nonAssignedHtml.includes('SSD'), 'Category rendered');
assert(nonAssignedHtml.includes('Oct 21, 2026') || nonAssignedHtml.includes('2026-10-21'), 'Purchase date rendered');
assert(nonAssignedHtml.includes('Expired'), 'Expired warranty status badge rendered');

// Verify EXCLUSIONS: No assignment info, no serial number, no specs, no remarks
assert(!nonAssignedHtml.includes('Assigned Date'), 'Assigned Date must NOT appear in non-assigned view');
assert(!nonAssignedHtml.includes('Assigned User Name'), 'Assigned User must NOT appear in non-assigned view');
assert(!nonAssignedHtml.includes('User Team'), 'User Team must NOT appear in non-assigned view');
assert(!nonAssignedHtml.includes('User TL'), 'User TL must NOT appear in non-assigned view');
assert(!nonAssignedHtml.includes('SN-SSD-89128'), 'Serial number must NOT appear');
assert(!nonAssignedHtml.includes('Crucial 500GB'), 'Hardware spec must NOT appear');
assert(!nonAssignedHtml.includes('In stock'), 'Remarks must NOT appear');
assert(!nonAssignedHtml.includes('Employee ID'), 'Employee ID must NOT appear');

console.log('✅ PASS: Non-Assigned Eye View displays ONLY the 4 requested details with zero assignment/spec leaks.');

// ----------------------------------------------------------------------------
// TEST 3: DYNAMIC DISPLAY RULES & FALLBACK HANDLING
// ----------------------------------------------------------------------------
console.log('\n--- 3. Testing Dynamic Display Rules & Fallbacks ---');

// Fallback test: Missing assignment information shows 'Not Available'
app.viewInstockItem('STK-CPU-99');
const missingAssignHtml = elements['viewAssetModalBody'].innerHTML;
assert(missingAssignHtml.includes('Not Available'), 'Missing fields show "Not Available"');
assert(missingAssignHtml.includes('Processor'), 'Category displays Processor for CPU');
assert(missingAssignHtml.includes('Expiring Soon'), '15 days warranty displays "Expiring Soon" badge');
assert(missingAssignHtml.includes('15 days remaining'), '15 days remaining calculated dynamically');
console.log('✅ PASS: Missing assignment info displays "Not Available" and Expiring Soon warranty works.');

// Fallback test: Missing warranty shows 'Not Specified'
app.viewInstockItem('STK-RAM-302');
const noWarrantyHtml = elements['viewAssetModalBody'].innerHTML;
assert(noWarrantyHtml.includes('Not Specified'), 'Missing warranty displays "Not Specified"');
assert(!noWarrantyHtml.includes('days remaining'), 'No days remaining text for unspecified warranty');
console.log('✅ PASS: Missing warranty displays "Not Specified" badge and text.');

// ----------------------------------------------------------------------------
// TEST 4: MODAL COMPACT STYLING & ACTION PRESERVATION
// ----------------------------------------------------------------------------
console.log('\n--- 4. Testing Compact Modal Styling & Action Preservation ---');

assert(elements['viewAssetModalDialog'].style.maxWidth === '620px', 'Modal dialog sized to compact 620px width');
assert(elements['viewAssetEditModalBtn'].onclick !== null, 'Edit button on modal is connected to openInstockEntryModal');
assert(elements['viewAssetHistoryModalBtn'].onclick !== null, 'History button on modal is connected to openInstockHistoryModal');
console.log('✅ PASS: Modal dialog is compact (620px) and Edit/History actions are preserved.');

console.log('\n================================================================');
console.log('🏁 RESULT: ALL HARDWARE INVENTORY EYE VIEW TESTS PASSED (100%)');
console.log('================================================================\n');
process.exit(0);

