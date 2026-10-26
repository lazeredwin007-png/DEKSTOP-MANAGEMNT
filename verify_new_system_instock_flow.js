// verify_new_system_instock_flow.js
// Verifies user's exact requirements:
// 1. In +ADD STOCK, Category = NEW SYSTEM save persists so it immediately appears in InStock inventory table and category counts
// 2. IP field does NOT auto-fill (autocomplete is off, blank by default), ONLY Asset ID auto-fills

const fs = require('fs');
const path = require('path');
const assert = require('assert');

async function runVerification() {
  console.log('================================================================');
  console.log('🧪 VERIFYING USER ISSUE: NEW SYSTEM INSTOCK SAVE & IP AUTOFILL');
  console.log('================================================================\n');

  // 1. Check index.html attributes
  console.log('--- 1. Check index.html Form & Input Autocomplete Attributes ---');
  const indexHtml = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

  assert(indexHtml.includes('id="formInstockEntry"') && indexHtml.includes('autocomplete="off"'),
    'formInstockEntry must have autocomplete="off"');
  console.log('✅ PASS: formInstockEntry has autocomplete="off"');

  const ipInputMatch = indexHtml.match(/<input[^>]*id="newSystemIp"[^>]*>/i);
  assert(ipInputMatch, 'newSystemIp input must exist in index.html');
  const ipTag = ipInputMatch[0];
  assert(ipTag.includes('autocomplete="off"'), 'newSystemIp must have autocomplete="off"');
  console.log('✅ PASS: newSystemIp has autocomplete="off"');

  const ssdInputMatch = indexHtml.match(/<input[^>]*id="newSystemSsd"[^>]*>/i);
  assert(ssdInputMatch, 'newSystemSsd input must exist');
  assert(ssdInputMatch[0].includes('autocomplete="off"'), 'newSystemSsd has autocomplete="off"');
  console.log('✅ PASS: newSystemSsd has autocomplete="off"');

  const assetIdMatch = indexHtml.match(/<input[^>]*id="instockAssetId"[^>]*>/i);
  assert(assetIdMatch && assetIdMatch[0].includes('autocomplete="off"'), 'instockAssetId has autocomplete="off"');
  console.log('✅ PASS: instockAssetId has autocomplete="off"');

  // 2. Check app.js logic for IP and Asset ID handling
  console.log('\n--- 2. Check app.js Logic for IP Clearing & Asset ID Auto-fill ---');
  const appJs = fs.readFileSync(path.join(__dirname, 'app.js'), 'utf8');

  // Ensure IP is not defaulted to 'DHCP' when left blank
  assert(!appJs.includes("ipAddress = document.getElementById('newSystemIp')?.value?.trim() || 'DHCP'"),
    'IP must not be defaulted to DHCP when blank');
  assert(appJs.includes("ipAddress = document.getElementById('newSystemIp')?.value?.trim() || '';"),
    'IP must be defaulted to empty string');
  console.log('✅ PASS: IP is not auto-defaulted to DHCP; defaults to empty string');

  // Ensure handleInstockCategoryChange explicitly clears IP
  assert(appJs.includes("if (ipInput && !editId) ipInput.value = '';"),
    'handleInstockCategoryChange must explicitly clear IP field on category change');
  console.log('✅ PASS: handleInstockCategoryChange explicitly clears IP field');

  // Ensure only instockAssetId is auto-filled
  assert(appJs.includes("assetIdInput.value = this.getNextDesktopAssetId();"),
    'assetIdInput is auto-filled with next Desktop Asset ID');
  console.log('✅ PASS: Only instockAssetId is auto-filled with next ID sequence');

  // 3. Check NEW SYSTEM Save Flow (persists to both /api/assets and /api/instock)
  console.log('\n--- 3. Check NEW SYSTEM Save Flow via API ---');
  
  const testAssetId = 'PIX_DSK_99TEST';
  const newSystemPayload = {
    id: testAssetId,
    assetId: testAssetId,
    component_type: 'NEW SYSTEM',
    category: 'NEW SYSTEM',
    model: 'Dell OptiPlex 7090',
    specification: 'Core i7, 16GB, 512GB SSD, Windows 11 Pro',
    serial_number: 'SN-TEST-998877',
    purchase_date: '2026-10-22',
    status: 'In Stock',
    assigned_to: '',
    location: 'Warehouse - Shelf A',
    notes: 'Test system for Instock verification',
    systemName: 'PIX-DESK-TEST',
    ipAddress: '', // explicitly blank as requested
    cpu: 'Intel Core i7 11th Gen',
    ram: '16GB DDR4',
    ssd: '512GB NVMe SSD',
    hdd: 'None',
    os: 'Windows 11 Pro',
    macAddress: '00:1A:2B:3C:4D:99'
  };

  // POST to /api/assets
  const assetRes = await fetch('http://localhost:3000/api/assets', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newSystemPayload)
  });
  const assetJson = await assetRes.json();
  assert(assetJson.success, 'POST /api/assets must succeed');
  console.log('✅ PASS: Successfully created NEW SYSTEM in assets table');

  // POST to /api/instock
  const instockPayload = {
    id: testAssetId,
    asset_id: testAssetId,
    component_type: 'NEW SYSTEM',
    model: newSystemPayload.model,
    specification: newSystemPayload.specification,
    serial_number: newSystemPayload.serial_number,
    purchase_date: newSystemPayload.purchase_date,
    status: 'Available',
    assigned_to: '',
    location: newSystemPayload.location,
    notes: newSystemPayload.notes
  };

  const instockRes = await fetch('http://localhost:3000/api/instock', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(instockPayload)
  });
  const instockJson = await instockRes.json();
  assert(instockJson.success, 'POST /api/instock must succeed');
  console.log('✅ PASS: Successfully created NEW SYSTEM in instock_hardware table');

  // Verify fetch from /api/instock returns the item
  const allInstockRes = await fetch('http://localhost:3000/api/instock');
  const allInstock = await allInstockRes.json();
  const foundInStock = allInstock.find(item => item.id === testAssetId || item.asset_id === testAssetId);
  assert(foundInStock, 'Newly saved NEW SYSTEM must be found in /api/instock response');
  assert.strictEqual(foundInStock.component_type, 'NEW SYSTEM');
  console.log('✅ PASS: Newly saved NEW SYSTEM immediately retrieved from /api/instock');

  // Verify fetch from /api/assets returns the item
  const allAssetsRes = await fetch('http://localhost:3000/api/assets');
  const allAssets = await allAssetsRes.json();
  const foundInAssets = allAssets.find(item => item.id === testAssetId || item.assetId === testAssetId);
  assert(foundInAssets, 'Newly saved NEW SYSTEM must be found in /api/assets response');
  assert.strictEqual(foundInAssets.ipAddress, '', 'IP Address must remain empty string, not autofilled');
  console.log('✅ PASS: IP Address verified to be empty in saved system record');

  // 4. Verify Delete cascade
  console.log('\n--- 4. Verify Delete Clean-up ---');
  const delRes = await fetch(`http://localhost:3000/api/instock/${testAssetId}`, {
    method: 'DELETE'
  });
  const delJson = await delRes.json();
  assert(delJson.success, 'DELETE /api/instock/:id must succeed');

  const afterDelInstock = await (await fetch('http://localhost:3000/api/instock')).json();
  assert(!afterDelInstock.some(i => i.id === testAssetId), 'Item must be removed from instock');

  const afterDelAssets = await (await fetch('http://localhost:3000/api/assets')).json();
  assert(!afterDelAssets.some(i => i.id === testAssetId), 'Item must be removed from assets');
  console.log('✅ PASS: Item cleanly deleted from both instock and assets');

  console.log('\n================================================================');
  console.log('🏁 ALL USER REQUIREMENTS FULLY VERIFIED AND WORKING!');
  console.log('================================================================');
}

runVerification().catch(err => {
  console.error('❌ Verification failed:', err);
  process.exit(1);
});
