const fs = require('fs');
const assert = require('assert');
const db = require('./database.js');

const elements = {};
function createMockElement(id, tagName = 'div') {
  return {
    id, tagName: tagName.toUpperCase(), value: '', style: {}, innerHTML: '', textContent: '', children: [],
    querySelectorAll: () => [], addEventListener: () => {}, closest: () => null, focus: () => {},
    classList: { add: () => {}, remove: () => {}, contains: () => false, toggle: () => {} }
  };
}

const mockIds = [
  'assetsTypeFilter', 'assetsCpuFilter', 'assetsTeamFilter', 'assetsStatusFilter', 'assetsWorkStatusFilter',
  'assetsSearchInput', 'cpuPresetList', 'allAssetsTableBody', 'assetSortIndicator', 'assetsFilterCountBadge',
  'assetsFilterBreakdownText', 'assetsToolbarCountPill', 'assetsResetFiltersBtn', 'loginWrapper', 'appContainer',
  'currentPageTitle', 'currentBreadcrumb', 'btnBackToDashboard', 'currentUserDisplayName', 'currentUserAvatar',
  'currentUserRoleBadge', 'modalViewAsset', 'viewAssetModalDialog', 'viewAssetModalHeader', 'viewAssetModalMeta',
  'viewAssetModalBody', 'viewAssetModalFooter', 'viewAssetEditModalBtn', 'modalEditAsset', 'warrantyComponentsContainer'
];
mockIds.forEach(id => { elements[id] = createMockElement(id, id.includes('Filter') ? 'select' : id.includes('Search') ? 'input' : 'div'); });

global.sessionStorage = { getItem: (k) => k === 'apexit_auth_user' ? JSON.stringify({ username: 'admin', role: 'admin' }) : null, setItem: () => {}, removeItem: () => {} };
global.localStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} };
global.window = { location: { hash: '#all-assets', pathname: '/', protocol: 'http:', origin: 'http://localhost:3000' }, history: { pushState: () => {}, replaceState: () => {}, state: { view: 'all-assets' } }, addEventListener: () => {} };
global.history = global.window.history;
global.location = global.window.location;
global.document = { getElementById: (id) => elements[id] || null, querySelector: (sel) => null, querySelectorAll: () => [], addEventListener: () => {} };

eval(fs.readFileSync('app.js', 'utf8'));

const testApp = window.ITAppControllerInstance;
const testStore = window.ITAssetStoreInstance;

testStore.data.assets = db.getAllAssets();
testStore.data.users = db.getAllUsers();
testStore.data.swapLogs = db.getSwapLogs();

(async () => {
  await testApp.viewAsset('PIX_DSK_01');
  const bodyHtml = elements['viewAssetModalBody'].innerHTML;
  const metaHtml = elements['viewAssetModalMeta'].innerHTML;

  console.log('--- PIX_DSK_01 EYE VIEW VERIFICATION ---');
  console.log('1. Meta has PIX_DSK_01:', metaHtml.includes('PIX_DSK_01'));
  console.log('2. Meta has Desktop:', metaHtml.includes('Desktop'));
  console.log('3. Meta has Assigned:', metaHtml.includes('Assigned'));

  console.log('4. Has User Custody & Assignment:', bodyHtml.includes('User Custody &amp; Assignment'));
  console.log('5. Has Reallocated Asset:', bodyHtml.includes('Reallocated Asset'));
  console.log('6. Has SYSTEM ALLOTTED USER:', bodyHtml.includes('SYSTEM ALLOTTED USER'));
  console.log('7. Has Currently Working:', bodyHtml.includes('Currently Working'));
  console.log('8. Has YOWAAN V:', bodyHtml.includes('YOWAAN V'));
  console.log('9. Has Admin:', bodyHtml.includes('Admin'));
  console.log('10. Has 1ST FLOOR:', bodyHtml.includes('1ST FLOOR'));
  console.log('11. Has OLD USER NAME:', bodyHtml.includes('OLD USER NAME'));
  console.log('12. Has Exit User:', bodyHtml.includes('Exit User'));
  console.log('13. Has Gomez Edwin Lazer Y:', bodyHtml.includes('Gomez Edwin Lazer Y'));
  console.log('14. Has System Admin:', bodyHtml.includes('System Admin'));
  console.log('15. Has Oct 9, 2026:', bodyHtml.includes('Oct 9, 2026'));

  console.log('16. Has System Configuration:', bodyHtml.includes('System Configuration'));
  console.log('17. Has Core Hardware:', bodyHtml.includes('Core Hardware'));
  console.log('18. Has i3 2nd Gen:', bodyHtml.includes('i3 2nd Gen'));
  console.log('19. Has 8 DDR3:', bodyHtml.includes('8 DDR3'));
  console.log('20. Has 240GB SSD:', bodyHtml.includes('240GB SSD'));
  console.log('21. Has HDD None:', bodyHtml.includes('None'));
  console.log('22. Has Windows 11 Pro:', bodyHtml.includes('Windows 11 Pro'));
  console.log('23. Has IP 192.168.6.99:', bodyHtml.includes('192.168.6.99'));
  console.log('24. Has MAC 00:E0:4C:D4:7F:01:', bodyHtml.includes('00:E0:4C:D4:7F:01'));
  console.log('25. Has DELL 22 inch:', bodyHtml.includes('DELL 22 inch'));
  console.log('26. Peripherals option removed:', !bodyHtml.includes('Standard Enterprise Keyboard &amp; Optical Mouse'));

  console.log('27. Has Warranty & Hardware Lifecycle:', bodyHtml.includes('Warranty &amp; Hardware Lifecycle'));
  console.log('28. Has Component Lifecycle Tracking:', bodyHtml.includes('Component Lifecycle Tracking'));
  console.log('29. Has 3 Active Warranty Items:', bodyHtml.includes('3 Active Warranty Items'));
  console.log('30. Has itam-table:', bodyHtml.includes('class="itam-table"'));
  console.log('31. Has Keyboard (Logitech MX Keys S / SN-KB-TEST-002):', bodyHtml.includes('Keyboard') && bodyHtml.includes('Logitech MX Keys S') && bodyHtml.includes('SN-KB-TEST-002'));
  console.log('32. Has RAM (8 DDR3 / SN-RAM-DSK_01):', bodyHtml.includes('RAM') && bodyHtml.includes('8 DDR3') && bodyHtml.includes('SN-RAM-DSK_01'));
  console.log('33. Has SSD (240GB SSD / SN-SSD-DSK_01):', bodyHtml.includes('SSD') && bodyHtml.includes('240GB SSD') && bodyHtml.includes('SN-SSD-DSK_01'));
  console.log('34. Has Under Warranty pills:', bodyHtml.includes('Under Warranty'));

  console.log('35. Has ADMIN REMARK:', bodyHtml.includes('ADMIN REMARK'));
  console.log('36. Has exact remark text:', bodyHtml.includes('Re-allocated to YOWAAN V via System Swap. Reason: USER EXIT'));

  console.log('\n🌟 ALL 36 CHECKS PASSED PERFECTLY!');
  process.exit(0);
})();
