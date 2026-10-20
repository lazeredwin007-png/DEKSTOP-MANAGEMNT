const fs = require('fs');
const assert = require('assert');

console.log('========================================================================');
console.log('🧪 VALIDATION: UI CARD ORDER & DUPLICATE EMPLOYEE NAME LOGIC');
console.log('========================================================================\n');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`✅ PASS: ${name}`);
    passed++;
  } catch (err) {
    console.error(`❌ FAIL: ${name} -> ${err.message}`);
    failed++;
  }
}

// -------------------------------------------------------------
// 1. Verify Card Order & Titles in index.html
// -------------------------------------------------------------
const htmlContent = fs.readFileSync('index.html', 'utf8');

test('Edit Asset Modal: First card is User Assignment & Allocation', () => {
  const modalIndex = htmlContent.indexOf('id="modalEditAsset"');
  assert(modalIndex !== -1, 'modalEditAsset not found in index.html');
  const modalChunk = htmlContent.substring(modalIndex, modalIndex + 12000);

  const userCardIndex = modalChunk.indexOf('👤 User Assignment &amp; Allocation');
  const hwCardIndex = modalChunk.indexOf('Hardware Specifications</span>');

  assert(userCardIndex !== -1, 'User Assignment & Allocation title not found in modal');
  assert(hwCardIndex !== -1, 'Hardware Specifications title not found in modal');
  assert(userCardIndex < hwCardIndex, 'User Assignment card must appear BEFORE Hardware Specifications card');

  // Verify titles and subtitles
  assert(modalChunk.includes('<span>👤 User Assignment &amp; Allocation</span>'), 'Exact title 👤 User Assignment & Allocation present');
  assert(modalChunk.includes('<span class="badge-tag">Employee • Team • Status</span>'), 'Exact subtitle Employee • Team • Status present');
  assert(modalChunk.includes('<span>Hardware Specifications</span>'), 'Exact title Hardware Specifications present');
  assert(modalChunk.includes('<span class="badge-tag">CPU • RAM • Storage • Display • Network &amp; OS</span>'), 'Exact subtitle CPU • RAM • Storage • Display • Network & OS present');
});

test('Edit Asset Modal: All fields preserved in both swapped cards', () => {
  const modalIndex = htmlContent.indexOf('id="modalEditAsset"');
  const modalChunk = htmlContent.substring(modalIndex, modalIndex + 12000);

  const requiredFields = [
    'editAssetUser',
    'editAssetTeam',
    'editAssetTl',
    'editAssetStatus',
    'editAssetWorkStatus',
    'editAssetLocation',
    'editAssetCondition',
    'editAssetOldUsername',
    'editAssetExitDate',
    'editAssetCpu',
    'editAssetRam',
    'editAssetSsd',
    'editAssetHdd',
    'editAssetMonitor',
    'editAssetType',
    'editAssetId',
    'editAssetSerialNumber',
    'editAssetIpAddress',
    'editAssetOs'
  ];

  for (const fieldId of requiredFields) {
    assert(modalChunk.includes(`id="${fieldId}"`), `Required field id="${fieldId}" must be present in modal`);
  }
});

// -------------------------------------------------------------
// 2. Validate Helper & Reassignment Logic
// -------------------------------------------------------------
const appCode = fs.readFileSync('app.js', 'utf8');

// Find getPreviousUserForAsset method in app.js
const funcDecl = 'getPreviousUserForAsset(asset, currentAssignedUser) {';
const startIdx = appCode.indexOf(funcDecl);
assert(startIdx !== -1, 'getPreviousUserForAsset declaration not found in app.js');

let depth = 0;
let endIdx = startIdx;
for (let i = startIdx; i < appCode.length; i++) {
  if (appCode[i] === '{') depth++;
  else if (appCode[i] === '}') {
    depth--;
    if (depth === 0) {
      endIdx = i + 1;
      break;
    }
  }
}

const methodBody = appCode.substring(startIdx + funcDecl.length, endIdx - 1);
const mockStore = {
  data: {
    assets: [],
    assignmentHistory: [],
    swapLogs: [],
    users: [],
    settings: { teams: ['SYSTEM ADMIN', 'PHP', 'MOBIL TEAM', 'AI', 'ADMIN', 'ACCOUNT', 'HR'] }
  }
};

const getPreviousUserForAsset = new Function('asset', 'currentAssignedUser', 'store', methodBody);

test('Validation Scenario 1: First assignment (Assigned Employee Name = Edwin; Previous User = —)', () => {
  const asset1 = {
    id: 'TEST-AST-01',
    user: 'Edwin',
    oldUsername: 'None',
    status: 'Assigned'
  };

  const prevUser = getPreviousUserForAsset(asset1, 'Edwin', mockStore);
  assert.strictEqual(prevUser, '—', `Previous user for first-time assignment should be '—', got: '${prevUser}'`);
  assert.notStrictEqual(prevUser, asset1.user, 'Assigned Employee Name and Previous User must not match');
});

test('Validation Scenario 2: Reassignment (Edwin → Benitta; Assigned Employee Name = Benitta; Previous User = Edwin)', () => {
  const asset2 = {
    id: 'TEST-AST-02',
    user: 'Benitta',
    oldUsername: 'Edwin',
    status: 'Assigned'
  };
  mockStore.data.assignmentHistory.push({
    id: 'HIST_1',
    assetId: 'TEST-AST-02',
    previousUser: 'Edwin',
    newUser: 'Benitta',
    timestamp: new Date().toISOString()
  });

  const prevUser = getPreviousUserForAsset(asset2, 'Benitta', mockStore);
  assert.strictEqual(prevUser, 'Edwin', `Previous user should be Edwin, got: '${prevUser}'`);
  assert.strictEqual(asset2.user, 'Benitta', 'Assigned employee name should be Benitta');
  assert.notStrictEqual(prevUser, asset2.user, 'Assigned Employee Name and Previous User must not match');
});

test('Validation Scenario 3: Reassignment again (Benitta → Charlie; Assigned Employee Name = Charlie; Previous User = Benitta)', () => {
  const asset3 = {
    id: 'TEST-AST-03',
    user: 'Charlie',
    oldUsername: 'Benitta',
    status: 'Assigned'
  };
  mockStore.data.assignmentHistory.unshift({
    id: 'HIST_2',
    assetId: 'TEST-AST-03',
    previousUser: 'Benitta',
    newUser: 'Charlie',
    timestamp: new Date().toISOString()
  });

  const prevUser = getPreviousUserForAsset(asset3, 'Charlie', mockStore);
  assert.strictEqual(prevUser, 'Benitta', `Previous user should be Benitta, got: '${prevUser}'`);
  assert.strictEqual(asset3.user, 'Charlie', 'Assigned employee name should be Charlie');
  assert.notStrictEqual(prevUser, asset3.user, 'Assigned Employee Name and Previous User must not match');
});

test('Fix Duplicate Employee Name on Existing Asset (PIX_DSK_02 with Siva Ganesh S)', () => {
  // PIX_DSK_02 has user: Siva Ganesh S and oldUsername: Siva Ganesh S
  const pixDsk02 = {
    id: 'PIX_DSK_02',
    user: 'Siva Ganesh S',
    oldUsername: 'Siva Ganesh S',
    status: 'Assigned'
  };

  const prevUser = getPreviousUserForAsset(pixDsk02, 'Siva Ganesh S', mockStore);
  assert.strictEqual(prevUser, '—', `Duplicate name must be resolved to '—', got: '${prevUser}'`);
  assert.notStrictEqual(prevUser, pixDsk02.user, 'Assigned Employee Name and Previous User must not match');
});

test('Reliable Previous User from actual assignmentHistory when oldUsername was corrupt', () => {
  // Asset has oldUsername corrupted to current user, but assignmentHistory has real former employee
  const assetWithHistory = {
    id: 'TEST-HIST-09',
    user: 'Benitta',
    oldUsername: 'Benitta',
    status: 'Assigned'
  };
  mockStore.data.assignmentHistory.unshift({
    id: 'HIST_9',
    assetId: 'TEST-HIST-09',
    previousUser: 'Edwin',
    newUser: 'Benitta',
    timestamp: new Date().toISOString()
  });

  const prevUser = getPreviousUserForAsset(assetWithHistory, 'Benitta', mockStore);
  assert.strictEqual(prevUser, 'Edwin', `Should retrieve former employee Edwin from assignmentHistory, got: '${prevUser}'`);
});

console.log('\n========================================================================');
console.log(`🏁 TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
console.log('========================================================================\n');

if (failed > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL VALIDATION SCENARIOS & UI CARD REQUIREMENTS PASSED 100%!');
}
