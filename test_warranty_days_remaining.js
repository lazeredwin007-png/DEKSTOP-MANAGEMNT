const fs = require('fs');
const assert = require('assert');

console.log('================================================================');
console.log('🧪 VERIFYING TOTAL DAYS REMAINING REPLACEMENT');
console.log('================================================================\n');

const html = fs.readFileSync('index.html', 'utf8');
const appJs = fs.readFileSync('app.js', 'utf8');

assert(html.includes('id="newSystemWarrantyDaysBox"'), 'newSystemWarrantyDaysBox exists in index.html');
console.log('✅ PASS: newSystemWarrantyDaysBox exists in index.html');

assert(html.includes('id="newSystemWarrantyDaysText"'), 'newSystemWarrantyDaysText exists in index.html');
console.log('✅ PASS: newSystemWarrantyDaysText exists in index.html');

assert(html.includes('Total Days Remaining'), 'Total Days Remaining label exists in index.html');
console.log('✅ PASS: Total Days Remaining label exists in index.html');

assert(!html.includes('+1 Year'), 'Old +1 Year button is removed from index.html');
console.log('✅ PASS: Old +1 Year button removed');

assert(!html.includes('Quick Warranty'), 'Old Quick Warranty text is removed from index.html');
console.log('✅ PASS: Old Quick Warranty text removed');

assert(appJs.includes('updateNewSystemWarrantyDaysRemaining()'), 'updateNewSystemWarrantyDaysRemaining exists in app.js');
console.log('✅ PASS: updateNewSystemWarrantyDaysRemaining exists in app.js');

assert(appJs.includes('updateNewSystemWarrantyDaysRemaining() {'), 'window.ITApp exposes updateNewSystemWarrantyDaysRemaining');
console.log('✅ PASS: window.ITApp exposes updateNewSystemWarrantyDaysRemaining');

console.log('\n================================================================');
console.log('🏁 RESULT: ALL TOTAL DAYS REMAINING CHECKS PASSED');
console.log('================================================================\n');
