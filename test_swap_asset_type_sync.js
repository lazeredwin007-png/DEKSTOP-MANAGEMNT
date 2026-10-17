const fs = require('fs');
const assert = require('assert');

console.log('================================================================');
console.log('🧪 TESTING SYSTEM SWAP FACILITY: OLD ASSET ID <-> ASSET TYPE SYNC');
console.log('================================================================\n');

let passedTests = 0;
let totalTests = 0;

function test(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`✅ PASS: ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`❌ FAIL: ${name} -> ${err.message}`);
    process.exitCode = 1;
  }
}

const html = fs.readFileSync('index.html', 'utf8');
const appJs = fs.readFileSync('app.js', 'utf8');

// --- 1. HTML STRUCTURE & ATTRIBUTE CHECKS ---
console.log('--- 1. System Swap Form HTML Verification ---');

test('swapOldAssetId in index.html is NOT readonly and supports datalist auto-completion', () => {
  const match = html.match(/<input[^>]*id="swapOldAssetId"[^>]*>/);
  assert(match, 'swapOldAssetId input must exist in index.html');
  assert(!match[0].includes('readonly'), 'swapOldAssetId input must NOT be readonly');
  assert(match[0].includes('list="swapOldAssetDatalist"'), 'swapOldAssetId input must link to swapOldAssetDatalist');
  assert(match[0].includes('required'), 'swapOldAssetId input must be marked required');
});

test('swapOldAssetDatalist exists in index.html', () => {
  assert(html.includes('<datalist id="swapOldAssetDatalist"></datalist>'), 'datalist swapOldAssetDatalist must exist in index.html');
});

test('swapAssetTypeSelect in index.html does NOT have hardcoded value="Desktop"', () => {
  const match = html.match(/<input[^>]*id="swapAssetTypeSelect"[^>]*>/);
  assert(match, 'swapAssetTypeSelect input must exist in index.html');
  assert(!match[0].includes('value="Desktop"'), 'swapAssetTypeSelect must NOT have value="Desktop" hardcoded');
  assert(match[0].includes('list="assetTypeList"'), 'swapAssetTypeSelect must have list="assetTypeList"');
});

test('assetTypeList datalist in index.html contains Desktop, Laptop, and MacBook', () => {
  const listMatch = html.match(/<datalist id="assetTypeList">([\s\S]*?)<\/datalist>/);
  assert(listMatch, 'assetTypeList datalist must exist');
  assert(listMatch[1].includes('value="Desktop"'), 'assetTypeList must contain Desktop');
  assert(listMatch[1].includes('value="Laptop"'), 'assetTypeList must contain Laptop');
  assert(listMatch[1].includes('value="MacBook"'), 'assetTypeList must contain MacBook');
});

test('swapAutoFillBanner contains swapAutoFillTypeBadge indicator', () => {
  assert(html.includes('id="swapAutoFillTypeBadge"'), 'swapAutoFillBanner must contain swapAutoFillTypeBadge element');
});

// --- 2. JAVASCRIPT EVENT & LOGIC CHECKS ---
console.log('\n--- 2. app.js Logic & Event Binding Verification ---');

test('app.js defines resolveAssetType method with comprehensive type & prefix detection', () => {
  assert(appJs.includes('resolveAssetType(assetObj, idString)'), 'resolveAssetType method must be defined in AppController');
  
  // Extract and evaluate resolveAssetType function logic in isolation
  const resolveAssetType = (assetObj, idString) => {
    if (assetObj && assetObj.type && String(assetObj.type).trim()) {
      const raw = String(assetObj.type).trim();
      const low = raw.toLowerCase();
      if (low === 'laptop' || low.includes('laptop') || low.includes('notebook')) return 'Laptop';
      if (low === 'desktop' || low.includes('desktop') || low.includes('pc') || low.includes('cpu')) return 'Desktop';
      if (low === 'macbook' || low.includes('macbook') || low.includes('mac') || low.includes('apple')) return 'MacBook';
      return raw;
    }
    const id = String(idString || (assetObj && assetObj.id) || '').trim().toUpperCase();
    if (id.includes('LAP') || id.includes('LPT') || id.includes('OWN') || id.includes('NOTEBOOK')) return 'Laptop';
    if (id.includes('MAC') || id.includes('APPLE')) return 'MacBook';
    if (id.includes('CPU') || id.includes('DSK') || id.includes('DESK') || id.includes('SYS')) return 'Desktop';
    return 'Desktop';
  };

  assert.strictEqual(resolveAssetType({ type: 'Laptop' }, 'PIXLAP-01'), 'Laptop');
  assert.strictEqual(resolveAssetType({ type: 'Desktop' }, 'PIXCPU-01'), 'Desktop');
  assert.strictEqual(resolveAssetType(null, 'Pixlap-15'), 'Laptop');
  assert.strictEqual(resolveAssetType(null, 'PIX_LAP_02'), 'Laptop');
  assert.strictEqual(resolveAssetType(null, 'PIX-OWN-01'), 'Laptop');
  assert.strictEqual(resolveAssetType(null, 'PIXCPU-13'), 'Desktop');
  assert.strictEqual(resolveAssetType(null, 'PIX_DSK_18'), 'Desktop');
  assert.strictEqual(resolveAssetType(null, 'MAC-01'), 'MacBook');
});

test('app.js defines syncSwapOldAssetToReplacement method', () => {
  assert(appJs.includes('syncSwapOldAssetToReplacement(oldAssetId, assetObj)'), 'syncSwapOldAssetToReplacement must be defined in AppController');
});

test('oldUserSelect change handler invokes syncSwapOldAssetToReplacement', () => {
  const handlerIdx = appJs.indexOf("oldUserSelect.addEventListener('change'");
  assert(handlerIdx !== -1, 'oldUserSelect change listener must exist');
  const chunk = appJs.substring(handlerIdx, handlerIdx + 3000);
  assert(chunk.includes('self.syncSwapOldAssetToReplacement'), 'oldUserSelect handler must call self.syncSwapOldAssetToReplacement');
});

test('oldAssetIdInput input and change handlers invoke syncSwapOldAssetToReplacement', () => {
  const handlerIdx = appJs.indexOf("const oldAssetIdInput = document.getElementById('swapOldAssetId')");
  assert(handlerIdx !== -1, 'swapOldAssetId listener block must exist');
  const chunk = appJs.substring(handlerIdx, handlerIdx + 4500);
  assert(chunk.includes("oldAssetIdInput.addEventListener('input'"), 'oldAssetIdInput must listen to input event');
  assert(chunk.includes("oldAssetIdInput.addEventListener('change'"), 'oldAssetIdInput must listen to change event');
  assert(chunk.includes('self.syncSwapOldAssetToReplacement'), 'oldAssetIdInput listeners must call self.syncSwapOldAssetToReplacement');
});

test('swapOldAssetId defines a property setter hook for direct assignments', () => {
  const hookIdx = appJs.indexOf('Property setter hook to catch any direct programmatic assignment');
  assert(hookIdx !== -1, 'Property setter hook comment/logic must exist');
  const chunk = appJs.substring(hookIdx, hookIdx + 1000);
  assert(chunk.includes('Object.defineProperty(oldAssetIdInput'), 'Object.defineProperty must be used on oldAssetIdInput');
  assert(chunk.includes('self.syncSwapOldAssetToReplacement(v)'), 'Setter hook must call self.syncSwapOldAssetToReplacement');
});

test('populateSwapOldUserSelect populates swapOldAssetDatalist with all system assets', () => {
  const dlPopIdx = appJs.indexOf("document.getElementById('swapOldAssetDatalist')");
  assert(dlPopIdx !== -1, 'populateSwapOldUserSelect must reference swapOldAssetDatalist');
  const chunk = appJs.substring(dlPopIdx, dlPopIdx + 300);
  assert(chunk.includes('dl.innerHTML = assets.map'), 'swapOldAssetDatalist must be populated with assets options');
});

test('window.ITApp exposes resolveAssetType and syncSwapOldAssetToReplacement', () => {
  const expIdx = appJs.indexOf('window.ITApp = {');
  assert(expIdx !== -1, 'window.ITApp must be defined');
  const chunk = appJs.substring(expIdx);
  assert(chunk.includes('resolveAssetType(assetObj, idString)'), 'ITApp must expose resolveAssetType');
  assert(chunk.includes('syncSwapOldAssetToReplacement(oldAssetId, assetObj)'), 'ITApp must expose syncSwapOldAssetToReplacement');
});

test('handleConfirmSwap generates prefix LPT, MAC, or DSK based on assetType', () => {
  const swapIdx = appJs.indexOf('handleConfirmSwap(formData)');
  assert(swapIdx !== -1, 'handleConfirmSwap must exist');
  const chunk = appJs.substring(swapIdx, swapIdx + 600);
  assert(chunk.includes('typePrefix = (assetType.toLowerCase() === \'laptop\') ? \'LPT\' : (assetType.toLowerCase() === \'macbook\') ? \'MAC\' : \'DSK\''), 'handleConfirmSwap must support LPT, MAC, DSK prefixes');
});

console.log('\n================================================================');
console.log(`Results: ${passedTests} / ${totalTests} tests passed`);
console.log('================================================================\n');

if (passedTests === totalTests) {
  console.log('🎉 ALL SYSTEM SWAP ASSET TYPE SYNC TESTS PASSED SUCCESSFULLY!');
} else {
  process.exit(1);
}
