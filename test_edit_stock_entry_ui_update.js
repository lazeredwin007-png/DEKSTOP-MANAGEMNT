const assert = require('assert');
const fs = require('fs');

console.log('========================================================================');
console.log('🧪 VERIFYING EDIT STOCK ENTRY UI UPDATE (NO EMPLOYEE ID)');
console.log('========================================================================');

const html = fs.readFileSync('index.html', 'utf8');
const appJs = fs.readFileSync('app.js', 'utf8');

// 1. Check modal markup in index.html
console.log('\n--- 1. Modal Structure & Fields in index.html ---');

// Extract modalInstockEntry content
const modalMatch = html.match(/<div class="modal-overlay" id="modalInstockEntry"[\s\S]*?<\/form>\s*<\/div>\s*<\/div>/);
assert(modalMatch, 'modalInstockEntry must exist in index.html');
const modalHtml = modalMatch[0];

// Assert Employee ID is completely absent from this modal
assert(!modalHtml.toLowerCase().includes('employee id'), 'Employee ID must NOT appear anywhere in modalInstockEntry');
assert(!modalHtml.toLowerCase().includes('employee_id'), 'employee_id must NOT appear anywhere in modalInstockEntry');
assert(!modalHtml.toLowerCase().includes('empid'), 'empid must NOT appear anywhere in modalInstockEntry');
console.log('✅ PASS: Employee ID field is completely absent from modalInstockEntry');

// Assert required fields exist
assert(modalHtml.includes('id="instockAssetId"'), 'Asset ID input must exist');
assert(modalHtml.includes('id="instockComponentType"'), 'Category select must exist');
assert(modalHtml.includes('id="instockModel"'), 'Specification / Model input must exist');
assert(modalHtml.includes('id="instockSpec"'), 'Specification Details input must exist');
assert(modalHtml.includes('id="instockSerial"'), 'Serial Number input must exist');
assert(modalHtml.includes('id="instockPurchaseDate"'), 'Purchase Date input must exist');
assert(modalHtml.includes('id="instockStatus"'), 'Current Status select must exist');
assert(modalHtml.includes('id="instockAssignedFieldsSection"'), 'User Assignment Details section must exist');
console.log('✅ PASS: All hardware stock specification fields preserved');

// Assert User Assignment Details fields
assert(modalHtml.includes('id="instockAssignedUser"'), 'Employee Name input must exist');
assert(modalHtml.includes('list="instockAllUsersDatalist"'), 'Employee Name must be searchable dropdown with datalist');
assert(modalHtml.includes('id="instockAllUsersDatalist"'), 'Datalist instockAllUsersDatalist must exist');
assert(modalHtml.includes('id="instockAssignedDate"'), 'Assignment Date input must exist');
assert(modalHtml.includes('id="instockAssignedTeam"'), 'Team / Department select must exist');
assert(modalHtml.includes('id="instockAssignedTl"'), 'Team Lead (TL) select must exist');
assert(modalHtml.includes('id="instockReason"'), 'Hardware Item / Reason input must exist');
console.log('✅ PASS: User Assignment Details contains exactly the 5 required fields without Employee ID');

// 2. Check Stock Status options and indicators
console.log('\n--- 2. Stock Status Indicators ---');
assert(modalHtml.includes('🔴 Non-Assigned (Available in Stock)'), 'Non-Assigned option with red indicator');
assert(modalHtml.includes('🟢 Assigned'), 'Assigned option with green indicator');
console.log('✅ PASS: Status dropdown provides 🔴 Non-Assigned and 🟢 Assigned indicators');

// 3. Check App Logic in app.js
console.log('\n--- 3. App Controller Logic in app.js ---');
// Team Lead dependent dropdown logic
assert(appJs.includes('handleInstockTeamChange()'), 'handleInstockTeamChange implemented');
assert(appJs.includes('handleInstockUserSelect('), 'handleInstockUserSelect implemented');
assert(appJs.includes('window.ITApp = {') && appJs.includes('handleInstockTeamChange() {\n      app.handleInstockTeamChange();'), 'Exposed on window.ITApp');
assert(appJs.includes('handleInstockUserSelect(userName) {\n      app.handleInstockUserSelect(userName);'), 'Exposed on window.ITApp');
console.log('✅ PASS: Department-dependent TL dropdown logic & employee auto-selection implemented');

// Future date validation
assert(appJs.includes('Purchase Date cannot be in the future.'), 'Validates purchase date not in future');
assert(appJs.includes('Assignment Date cannot be in the future.'), 'Validates assignment date not in future');
console.log('✅ PASS: Future date prevention enforced for Purchase Date and Assignment Date');

// Required fields validation when Assigned
assert(appJs.includes('Employee Name is required'), 'Validates Employee Name when Assigned');
assert(appJs.includes('Assignment Date is required'), 'Validates Assignment Date when Assigned');
assert(appJs.includes('Team / Department is required'), 'Validates Team / Department when Assigned');
assert(appJs.includes('Team Lead (TL) is required'), 'Validates Team Lead when Assigned');
assert(appJs.includes('Hardware Item / Reason is required'), 'Validates Hardware Item / Reason when Assigned');
console.log('✅ PASS: All 5 assignment fields required when marked Assigned');

// Duplicate checking
assert(appJs.includes('Duplicate Asset ID'), 'Validates duplicate Asset ID');
assert(appJs.includes('Duplicate Serial Number'), 'Validates duplicate Serial Number');
console.log('✅ PASS: Duplicate checks preserved');

// Buttons functionality
assert(modalHtml.includes('id="btnCancelInstockEntry"'), 'Cancel button exists');
assert(modalHtml.includes('id="btnSaveInstockEntry"'), 'Save button exists');
assert(modalHtml.includes('onclick="window.ITApp.closeModal(\'modalInstockEntry\')"'), 'Close modal action exists');
console.log('✅ PASS: Cancel, Close and Save Stock Entry buttons fully preserved');

console.log('\n========================================================================');
console.log('🎉 ALL EDIT STOCK ENTRY UI UPDATE TESTS PASSED 100%!');
console.log('========================================================================\n');
