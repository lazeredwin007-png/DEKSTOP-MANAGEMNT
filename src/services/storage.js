/**
 * Pixel ITAM - Enterprise Data Storage Service
 * Dual-layer persistence: Next.js + SQLite REST API with LocalStorage caching.
 * Real-time synchronization with fallback to offline local mode.
 */

window.PixelStorage = (function () {
  const STORAGE_KEYS = {
    ASSETS: 'pixel_itam_assets_v2',
    MAINTENANCE: 'pixel_itam_maintenance_v2',
    LICENSES: 'pixel_itam_licenses_v2',
    ACTIVITY_LOG: 'pixel_itam_activity_v2',
    SETTINGS: 'pixel_itam_settings_v2'
  };

  const listeners = [];
  let isBackendOnline = false;

  function subscribe(fn) {
    listeners.push(fn);
    return () => {
      const idx = listeners.indexOf(fn);
      if (idx !== -1) listeners.splice(idx, 1);
    };
  }

  function notify(event, payload) {
    listeners.forEach(fn => {
      try { fn(event, payload); } catch (e) { console.error("Storage listener error:", e); }
    });
  }

  // Assets Management
  function getAssets() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ASSETS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn("Could not read assets from localStorage, falling back to defaults", e);
    }
    const defaults = window.PixelDefaultData.getInitialAssets();
    saveAssets(defaults, false);
    return defaults;
  }

  function saveAssets(assets, shouldNotify = true) {
    try {
      localStorage.setItem(STORAGE_KEYS.ASSETS, JSON.stringify(assets));
      if (shouldNotify) notify('assets_changed', assets);
    } catch (e) {
      console.error("Failed to save assets to localStorage", e);
    }
  }

  function getAssetById(id) {
    if (!id) return null;
    const assets = getAssets();
    return assets.find(a => (a.id || '').toUpperCase() === id.toUpperCase()) || null;
  }

  function upsertAsset(assetData) {
    const assets = getAssets();
    const existingIdx = assets.findIndex(a => (a.id || '').toUpperCase() === (assetData.id || '').toUpperCase());
    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 16);
    assetData.lastUpdated = timestamp;

    let result;
    if (existingIdx !== -1) {
      const old = assets[existingIdx];
      assets[existingIdx] = { ...old, ...assetData };
      saveAssets(assets);
      logActivity("Asset Updated", assetData.id, `Updated details for ${assetData.brand} ${assetData.model}`);
      result = { success: true, isNew: false, asset: assets[existingIdx] };
    } else {
      if (!assetData.assignmentHistory) assetData.assignmentHistory = [];
      assetData.assignmentHistory.push({
        date: assetData.purchaseDate || new Date().toISOString().split('T')[0],
        fromEmployee: "IT Inventory Pool",
        toEmployee: assetData.employeeName || "Unassigned",
        assignedBy: getSettings().userRole || "System Admin",
        reason: "Initial asset registration"
      });
      assets.unshift(assetData);
      saveAssets(assets);
      logActivity("Asset Added", assetData.id, `Registered new asset ${assetData.id} (${assetData.brand} ${assetData.model})`);
      result = { success: true, isNew: true, asset: assetData };
    }

    // Sync with SQLite backend asynchronously
    fetch('/api/assets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(assetData)
    }).catch(err => console.debug("SQLite sync note:", err.message));

    return result;
  }

  function deleteAsset(id) {
    let assets = getAssets();
    const target = assets.find(a => (a.id || '').toUpperCase() === id.toUpperCase());
    if (!target) return false;

    assets = assets.filter(a => (a.id || '').toUpperCase() !== id.toUpperCase());
    saveAssets(assets);
    logActivity("Asset Retired / Removed", id, `Removed ${target.brand} ${target.model} from active inventory`);

    // Sync with SQLite backend
    fetch(`/api/assets/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    }).catch(err => console.debug("SQLite delete note:", err.message));

    return true;
  }

  // Asset Assignment & Transfer
  function transferAsset(assetId, newEmployee, reason = "Department Reassignment") {
    const assets = getAssets();
    const asset = assets.find(a => (a.id || '').toUpperCase() === assetId.toUpperCase());
    if (!asset) return { success: false, message: "Asset not found" };

    const oldEmployee = asset.employeeName || "Unassigned";
    const today = new Date().toISOString().split('T')[0];

    if (!asset.assignmentHistory) asset.assignmentHistory = [];
    asset.assignmentHistory.unshift({
      date: today,
      fromEmployee: oldEmployee,
      toEmployee: newEmployee,
      assignedBy: getSettings().userRole || "IT Administrator",
      reason: reason
    });

    asset.employeeName = newEmployee;
    asset.status = newEmployee && newEmployee !== "Unassigned" ? "Assigned" : "Available";
    asset.lastUpdated = new Date().toISOString().replace('T', ' ').slice(0, 16);

    saveAssets(assets);
    logActivity("Asset Reassigned", assetId, `Transferred from "${oldEmployee}" to "${newEmployee}" (Reason: ${reason})`);

    // Sync with SQLite backend
    fetch(`/api/assets/${encodeURIComponent(assetId)}/transfer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newEmployee, reason })
    }).catch(err => console.debug("SQLite transfer note:", err.message));

    return { success: true, asset };
  }

  // Maintenance Management
  function getMaintenance() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MAINTENANCE);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn("Could not read maintenance records", e);
    }
    const defaults = window.PixelDefaultData.getInitialMaintenance();
    saveMaintenance(defaults, false);
    return defaults;
  }

  function saveMaintenance(records, shouldNotify = true) {
    try {
      localStorage.setItem(STORAGE_KEYS.MAINTENANCE, JSON.stringify(records));
      if (shouldNotify) notify('maintenance_changed', records);
    } catch (e) {
      console.error("Failed to save maintenance records", e);
    }
  }

  function createMaintenanceTicket(ticket) {
    const records = getMaintenance();
    if (!ticket.ticketId) {
      ticket.ticketId = `MNT-2026-${String(records.length + 1).padStart(3, '0')}`;
    }
    ticket.issueDate = ticket.issueDate || new Date().toISOString().split('T')[0];
    records.unshift(ticket);
    saveMaintenance(records);

    // Update corresponding asset status
    const assets = getAssets();
    const asset = assets.find(a => (a.id || '').toUpperCase() === (ticket.assetId || '').toUpperCase());
    if (asset) {
      asset.status = 'Maintenance';
      asset.maintenanceStatus = 'In Progress';
      asset.lastUpdated = new Date().toISOString().replace('T', ' ').slice(0, 16);
      saveAssets(assets);
    }

    logActivity("Maintenance Ticket Created", ticket.assetId, `Ticket #${ticket.ticketId} opened for ${ticket.issueType} (${ticket.problemDescription})`);

    // Sync with SQLite backend
    fetch('/api/maintenance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ticket)
    }).catch(err => console.debug("SQLite maintenance note:", err.message));

    return ticket;
  }

  function updateMaintenanceTicket(ticketId, updates) {
    const records = getMaintenance();
    const idx = records.findIndex(r => (r.ticketId || '').toUpperCase() === ticketId.toUpperCase());
    if (idx === -1) return false;

    records[idx] = { ...records[idx], ...updates };
    saveMaintenance(records);

    if (updates.status === 'Completed' || updates.status === 'Resolved') {
      const assetId = records[idx].assetId;
      const assets = getAssets();
      const asset = assets.find(a => (a.id || '').toUpperCase() === (assetId || '').toUpperCase());
      if (asset) {
        asset.status = asset.employeeName && asset.employeeName !== 'Unassigned' ? 'Assigned' : 'Available';
        asset.maintenanceStatus = 'Normal';
        asset.lastUpdated = new Date().toISOString().replace('T', ' ').slice(0, 16);
        saveAssets(assets);
      }
      logActivity("Maintenance Resolved", assetId, `Ticket #${ticketId} resolved: ${updates.resolution || 'Service Completed'}`);
    }

    // Sync with SQLite backend
    fetch(`/api/maintenance/${encodeURIComponent(ticketId)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    }).catch(err => console.debug("SQLite ticket update note:", err.message));

    return true;
  }

  // Licenses
  function getLicenses() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LICENSES);
      if (data) return JSON.parse(data);
    } catch (e) {}
    const defaults = window.PixelDefaultData.getInitialLicenses();
    saveLicenses(defaults, false);
    return defaults;
  }

  function saveLicenses(licenses, shouldNotify = true) {
    try {
      localStorage.setItem(STORAGE_KEYS.LICENSES, JSON.stringify(licenses));
      if (shouldNotify) notify('licenses_changed', licenses);
    } catch (e) {
      console.error("Failed to save licenses", e);
    }
  }

  function upsertLicense(licenseData) {
    const licenses = getLicenses();
    const idx = licenses.findIndex(l => (l.id || '').toUpperCase() === (licenseData.id || '').toUpperCase());
    if (idx !== -1) {
      licenses[idx] = { ...licenses[idx], ...licenseData };
    } else {
      licenses.push(licenseData);
    }
    saveLicenses(licenses);
    logActivity("License Updated", licenseData.assignedAsset, `Updated software license: ${licenseData.name}`);
    return licenseData;
  }

  // Activity Log
  function getActivityLog() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACTIVITY_LOG);
      if (data) return JSON.parse(data);
    } catch (e) {}
    const defaults = window.PixelDefaultData.getInitialActivityLog();
    localStorage.setItem(STORAGE_KEYS.ACTIVITY_LOG, JSON.stringify(defaults));
    return defaults;
  }

  function logActivity(action, assetId, details) {
    try {
      const logs = getActivityLog();
      const currentRole = getSettings().userRole || "Administrator";
      logs.unshift({
        id: `ACT-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
        user: `${currentRole}`,
        action: action,
        assetId: assetId || "GENERAL",
        details: details || ""
      });
      if (logs.length > 200) logs.pop();
      localStorage.setItem(STORAGE_KEYS.ACTIVITY_LOG, JSON.stringify(logs));
      notify('activity_logged', logs);
    } catch (e) {
      console.error("Error logging activity", e);
    }
  }

  // Settings
  function getSettings() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (data) return JSON.parse(data);
    } catch (e) {}
    const defaults = window.PixelDefaultData.getInitialSettings();
    saveSettings(defaults);
    return defaults;
  }

  function saveSettings(settings) {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
      notify('settings_changed', settings);
    } catch (e) {
      console.error("Failed to save settings", e);
    }
  }

  // Factory Reset
  function resetAllData() {
    localStorage.removeItem(STORAGE_KEYS.ASSETS);
    localStorage.removeItem(STORAGE_KEYS.MAINTENANCE);
    localStorage.removeItem(STORAGE_KEYS.LICENSES);
    localStorage.removeItem(STORAGE_KEYS.ACTIVITY_LOG);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    
    // Call SQLite reset
    fetch('/api/reset', { method: 'POST' }).catch(() => {});
    
    notify('data_reset', {});
  }

  // Asynchronous sync with SQLite Backend
  async function syncWithSQLite() {
    try {
      const res = await fetch('/api/assets');
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          isBackendOnline = true;
          // Map snake_case SQLite fields to camelCase client models if necessary
          const mapped = json.data.map(row => ({
            id: row.id,
            employeeName: row.employee_name || row.employeeName || 'Unassigned',
            employeeId: row.employee_id || row.employeeId || 'N/A',
            team: row.team || 'Unassigned',
            department: row.department || 'Operations',
            assetType: row.asset_type || row.assetType || 'Desktop',
            brand: row.brand || 'Dell',
            model: row.model || 'OptiPlex',
            serialNumber: row.serial_number || row.serialNumber || 'N/A',
            cpu: row.cpu || 'Core i5',
            ram: row.ram || '16GB',
            storage: row.storage || '512GB SSD',
            os: row.os || 'Windows 11 Pro',
            officeVersion: row.office_version || row.officeVersion || 'MS Office 2021',
            antivirus: row.antivirus || 'Windows Defender',
            ipAddress: row.ip_address || row.ipAddress || 'DHCP',
            macAddress: row.mac_address || row.macAddress || 'N/A',
            location: row.location || 'Pixel HQ - Floor 2',
            floor: row.floor || '2nd Floor',
            bay: row.bay || 'General Bay',
            purchaseDate: row.purchase_date || row.purchaseDate || '2023-01-15',
            purchaseCost: row.purchase_cost || row.purchaseCost || 45000,
            warrantyExpiry: row.warranty_expiry || row.warrantyExpiry || '2026-01-15',
            vendor: row.vendor || 'Dell Technologies',
            status: row.status || 'Assigned',
            maintenanceStatus: row.maintenance_status || row.maintenanceStatus || 'Normal',
            condition: row.condition || 'Good',
            remarks: row.remarks || '',
            lastUpdated: row.last_updated || row.lastUpdated || '2026-10-03 12:00'
          }));

          saveAssets(mapped, true);
          console.info(`[Pixel ITAM] SQLite Database synced: ${mapped.length} assets loaded.`);
        }
      }
    } catch (e) {
      console.debug("[Pixel ITAM] Operating in local storage mode:", e.message);
    }
  }

  // Auto-sync on startup
  if (typeof window !== 'undefined') {
    setTimeout(syncWithSQLite, 300);
  }

  return {
    getAssets: getAssets,
    saveAssets: saveAssets,
    getAssetById: getAssetById,
    upsertAsset: upsertAsset,
    deleteAsset: deleteAsset,
    transferAsset: transferAsset,
    getMaintenance: getMaintenance,
    saveMaintenance: saveMaintenance,
    createMaintenanceTicket: createMaintenanceTicket,
    updateMaintenanceTicket: updateMaintenanceTicket,
    getLicenses: getLicenses,
    saveLicenses: saveLicenses,
    upsertLicense: upsertLicense,
    getActivityLog: getActivityLog,
    logActivity: logActivity,
    getSettings: getSettings,
    saveSettings: saveSettings,
    resetAllData: resetAllData,
    subscribe: subscribe,
    syncWithSQLite: syncWithSQLite,
    isBackendOnline: () => isBackendOnline
  };
})();
