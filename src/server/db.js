/**
 * Pixel ITAM - SQLite Enterprise Database Engine
 * Powered by sql.js (official SQLite WebAssembly) with zero native dependencies.
 * Persists directly to disk at `data/itam.sqlite`.
 */

const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(process.cwd(), 'data', 'itam.sqlite');

let dbInstance = null;

async function getDB() {
  if (dbInstance) return dbInstance;

  const SQL = await initSqlJs();

  if (fs.existsSync(DB_PATH)) {
    try {
      const fileBuffer = fs.readFileSync(DB_PATH);
      dbInstance = new SQL.Database(fileBuffer);
      return dbInstance;
    } catch (e) {
      console.error("Failed to load existing SQLite database, creating new one:", e);
    }
  }

  // Create new database
  dbInstance = new SQL.Database();
  initSchema(dbInstance);
  seedInitialData(dbInstance);
  saveDB();
  return dbInstance;
}

function saveDB() {
  if (!dbInstance) return;
  try {
    const data = dbInstance.export();
    const buffer = Buffer.from(data);
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(DB_PATH, buffer);
  } catch (e) {
    console.error("Failed to persist SQLite database to disk:", e);
  }
}

function initSchema(db) {
  db.run(`
    CREATE TABLE IF NOT EXISTS assets (
      id TEXT PRIMARY KEY,
      employee_name TEXT,
      employee_id TEXT,
      team TEXT,
      department TEXT,
      asset_type TEXT,
      brand TEXT,
      model TEXT,
      serial_number TEXT,
      cpu TEXT,
      ram TEXT,
      storage TEXT,
      os TEXT,
      office_version TEXT,
      antivirus TEXT,
      ip_address TEXT,
      mac_address TEXT,
      location TEXT,
      floor TEXT,
      bay TEXT,
      purchase_date TEXT,
      purchase_cost REAL,
      warranty_expiry TEXT,
      vendor TEXT,
      status TEXT,
      maintenance_status TEXT,
      condition TEXT,
      remarks TEXT,
      last_updated TEXT
    );

    CREATE TABLE IF NOT EXISTS assignments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      asset_id TEXT,
      date TEXT,
      from_employee TEXT,
      to_employee TEXT,
      assigned_by TEXT,
      reason TEXT
    );

    CREATE TABLE IF NOT EXISTS maintenance (
      ticket_id TEXT PRIMARY KEY,
      asset_id TEXT,
      employee TEXT,
      issue_date TEXT,
      issue_type TEXT,
      problem_description TEXT,
      priority TEXT,
      assigned_technician TEXT,
      vendor TEXT,
      repair_cost REAL,
      start_date TEXT,
      completion_date TEXT,
      status TEXT,
      resolution TEXT,
      remarks TEXT
    );

    CREATE TABLE IF NOT EXISTS licenses (
      id TEXT PRIMARY KEY,
      name TEXT,
      type TEXT,
      key TEXT,
      assigned_asset TEXT,
      assigned_employee TEXT,
      purchase_date TEXT,
      expiry_date TEXT,
      total_seats INTEGER,
      used_seats INTEGER,
      available_seats INTEGER,
      status TEXT,
      vendor TEXT
    );

    CREATE TABLE IF NOT EXISTS activity_log (
      id TEXT PRIMARY KEY,
      timestamp TEXT,
      user TEXT,
      action TEXT,
      asset_id TEXT,
      details TEXT
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT
    );
  `);
}

function seedInitialData(db) {
  // Read default assets from defaultData.js
  let defaultDataModule;
  try {
    const defaultDataPath = path.join(process.cwd(), 'src', 'data', 'defaultData.js');
    if (fs.existsSync(defaultDataPath)) {
      const content = fs.readFileSync(defaultDataPath, 'utf8');
      const fakeWindow = {};
      const runFn = new Function('window', content);
      runFn(fakeWindow);
      defaultDataModule = fakeWindow.PixelDefaultData;
    }
  } catch (e) {
    console.warn("Could not read defaultData.js for SQLite seed:", e);
  }

  if (defaultDataModule) {
    const assets = defaultDataModule.getInitialAssets();
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO assets VALUES (
        $id, $employee_name, $employee_id, $team, $department, $asset_type,
        $brand, $model, $serial_number, $cpu, $ram, $storage, $os,
        $office_version, $antivirus, $ip_address, $mac_address, $location, $floor,
        $bay, $purchase_date, $purchase_cost, $warranty_expiry, $vendor, $status,
        $maintenance_status, $condition, $remarks, $last_updated
      )
    `);

    const assignStmt = db.prepare(`
      INSERT INTO assignments (asset_id, date, from_employee, to_employee, assigned_by, reason)
      VALUES ($asset_id, $date, $from_employee, $to_employee, $assigned_by, $reason)
    `);

    const seenIds = new Set();
    assets.forEach(a => {
      let uniqueId = a.id;
      if (seenIds.has(uniqueId)) {
        uniqueId = `${a.id}-S${a.sno}`;
      }
      seenIds.add(uniqueId);

      stmt.run({
        $id: uniqueId,
        $employee_name: a.employeeName,
        $employee_id: a.employeeId,
        $team: a.team,
        $department: a.department,
        $asset_type: a.assetType,
        $brand: a.brand,
        $model: a.model,
        $serial_number: a.serialNumber,
        $cpu: a.cpu,
        $ram: a.ram,
        $storage: a.storage,
        $os: a.os,
        $office_version: a.officeVersion || 'Office 365',
        $antivirus: a.antivirus || 'Standard Endpoint',
        $ip_address: a.ipAddress,
        $mac_address: a.macAddress,
        $location: a.location,
        $floor: a.floor,
        $bay: a.bay,
        $purchase_date: a.purchaseDate,
        $purchase_cost: a.purchaseCost || 0,
        $warranty_expiry: a.warrantyExpiry,
        $vendor: a.vendor || 'Authorized Reseller',
        $status: a.status,
        $maintenance_status: a.maintenanceStatus || 'Normal',
        $condition: a.condition || 'Good',
        $remarks: a.remarks || '',
        $last_updated: a.lastUpdated || '2026-10-03'
      });

      if (a.assignmentHistory && a.assignmentHistory.length > 0) {
        a.assignmentHistory.forEach(h => {
          assignStmt.run({
            $asset_id: a.id,
            $date: h.date,
            $from_employee: h.fromEmployee,
            $to_employee: h.toEmployee,
            $assigned_by: h.assignedBy,
            $reason: h.reason
          });
        });
      }
    });

    stmt.free();
    assignStmt.free();

    // Seed Maintenance Tickets
    const maintList = defaultDataModule.getInitialMaintenance();
    const maintStmt = db.prepare(`
      INSERT OR REPLACE INTO maintenance VALUES (
        $ticket_id, $asset_id, $employee, $issue_date, $issue_type, $problem_description,
        $priority, $assigned_technician, $vendor, $repair_cost, $start_date, $completion_date,
        $status, $resolution, $remarks
      )
    `);

    maintList.forEach(m => {
      maintStmt.run({
        $ticket_id: m.ticketId,
        $asset_id: m.assetId,
        $employee: m.employee,
        $issue_date: m.issueDate,
        $issue_type: m.issueType,
        $problem_description: m.problemDescription,
        $priority: m.priority,
        $assigned_technician: m.assignedTechnician,
        $vendor: m.vendor,
        $repair_cost: m.repairCost,
        $start_date: m.startDate,
        $completion_date: m.completionDate,
        $status: m.status,
        $resolution: m.resolution,
        $remarks: m.remarks
      });
    });
    maintStmt.free();

    // Seed Licenses
    const licList = defaultDataModule.getInitialLicenses();
    const licStmt = db.prepare(`
      INSERT OR REPLACE INTO licenses VALUES (
        $id, $name, $type, $key, $assigned_asset, $assigned_employee,
        $purchase_date, $expiry_date, $total_seats, $used_seats, $available_seats,
        $status, $vendor
      )
    `);
    licList.forEach(l => {
      licStmt.run({
        $id: l.id,
        $name: l.name,
        $type: l.type,
        $key: l.key,
        $assigned_asset: l.assignedAsset,
        $assigned_employee: l.assignedEmployee,
        $purchase_date: l.purchaseDate,
        $expiry_date: l.expiryDate,
        $total_seats: l.totalSeats,
        $used_seats: l.usedSeats,
        $available_seats: l.availableSeats,
        $status: l.status,
        $vendor: l.vendor
      });
    });
    licStmt.free();

    // Activity log
    logActivity('System Seeded', 'SYSTEM', 'SQLite database initialized with 70 verified master assets and 47 floor entries.');
  }
}

// Queries Helper
function execSelect(db, sql, params = {}) {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const rows = [];
  while (stmt.step()) {
    rows.push(stmt.getAsObject());
  }
  stmt.free();
  return rows;
}

// Assets API Operations
async function getAllAssets(query = {}) {
  const db = await getDB();
  let sql = 'SELECT * FROM assets WHERE 1=1';
  const params = {};

  if (query.search) {
    sql += ` AND (
      LOWER(id) LIKE $search OR
      LOWER(employee_name) LIKE $search OR
      LOWER(serial_number) LIKE $search OR
      LOWER(model) LIKE $search OR
      LOWER(team) LIKE $search OR
      LOWER(department) LIKE $search OR
      LOWER(ip_address) LIKE $search OR
      LOWER(mac_address) LIKE $search OR
      LOWER(bay) LIKE $search OR
      LOWER(status) LIKE $search
    )`;
    params['$search'] = `%${query.search.toLowerCase()}%`;
  }

  if (query.department) {
    sql += ' AND department = $dept';
    params['$dept'] = query.department;
  }
  if (query.team) {
    sql += ' AND team = $team';
    params['$team'] = query.team;
  }
  if (query.status) {
    sql += ' AND status = $status';
    params['$status'] = query.status;
  }
  if (query.assetType) {
    sql += ' AND asset_type = $assetType';
    params['$assetType'] = query.assetType;
  }

  // Sorting
  const sortCol = query.sort || 'id';
  const sortDir = (query.order || 'ASC').toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
  sql += ` ORDER BY ${sortCol} ${sortDir}`;

  const rows = execSelect(db, sql, params);

  // Map snake_case to camelCase
  return rows.map(r => ({
    id: r.id,
    employeeName: r.employee_name,
    employeeId: r.employee_id,
    team: r.team,
    department: r.department,
    assetType: r.asset_type,
    brand: r.brand,
    model: r.model,
    serialNumber: r.serial_number,
    cpu: r.cpu,
    ram: r.ram,
    storage: r.storage,
    os: r.os,
    officeVersion: r.office_version,
    antivirus: r.antivirus,
    ipAddress: r.ip_address,
    macAddress: r.mac_address,
    location: r.location,
    floor: r.floor,
    bay: r.bay,
    purchaseDate: r.purchase_date,
    purchaseCost: r.purchase_cost,
    warrantyExpiry: r.warranty_expiry,
    vendor: r.vendor,
    status: r.status,
    maintenanceStatus: r.maintenance_status,
    condition: r.condition,
    remarks: r.remarks,
    lastUpdated: r.last_updated
  }));
}

async function getAssetById(id) {
  const db = await getDB();
  const rows = execSelect(db, 'SELECT * FROM assets WHERE id = $id', { $id: id });
  if (rows.length === 0) return null;
  const r = rows[0];

  const assignments = execSelect(db, 'SELECT * FROM assignments WHERE asset_id = $id ORDER BY id DESC', { $id: id });
  const maintenance = execSelect(db, 'SELECT * FROM maintenance WHERE asset_id = $id ORDER BY issue_date DESC', { $id: id });

  return {
    id: r.id,
    employeeName: r.employee_name,
    employeeId: r.employee_id,
    team: r.team,
    department: r.department,
    assetType: r.asset_type,
    brand: r.brand,
    model: r.model,
    serialNumber: r.serial_number,
    cpu: r.cpu,
    ram: r.ram,
    storage: r.storage,
    os: r.os,
    officeVersion: r.office_version,
    antivirus: r.antivirus,
    ipAddress: r.ip_address,
    macAddress: r.mac_address,
    location: r.location,
    floor: r.floor,
    bay: r.bay,
    purchaseDate: r.purchase_date,
    purchaseCost: r.purchase_cost,
    warrantyExpiry: r.warranty_expiry,
    vendor: r.vendor,
    status: r.status,
    maintenanceStatus: r.maintenance_status,
    condition: r.condition,
    remarks: r.remarks,
    lastUpdated: r.last_updated,
    assignmentHistory: assignments.map(a => ({
      date: a.date,
      fromEmployee: a.from_employee,
      toEmployee: a.to_employee,
      assignedBy: a.assigned_by,
      reason: a.reason
    })),
    maintenanceHistory: maintenance.map(m => ({
      ticketId: m.ticket_id,
      issueDate: m.issue_date,
      type: m.issue_type,
      description: m.problem_description,
      status: m.status,
      technician: m.assigned_technician,
      cost: m.repair_cost,
      completionDate: m.completion_date,
      resolution: m.resolution
    }))
  };
}

async function upsertAsset(a) {
  const db = await getDB();
  const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 16);

  db.run(`
    INSERT OR REPLACE INTO assets VALUES (
      $id, $employee_name, $employee_id, $team, $department, $asset_type,
      $brand, $model, $serial_number, $cpu, $ram, $storage, $os,
      $office_version, $antivirus, $ip_address, $mac_address, $location, $floor,
      $bay, $purchase_date, $purchase_cost, $warranty_expiry, $vendor, $status,
      $maintenance_status, $condition, $remarks, $last_updated
    )
  `, {
    $id: a.id,
    $employee_name: a.employeeName || 'Unassigned',
    $employee_id: a.employeeId || 'N/A',
    $team: a.team || 'General',
    $department: a.department || 'General IT',
    $asset_type: a.assetType || 'Desktop',
    $brand: a.brand || 'Dell',
    $model: a.model || 'Enterprise PC',
    $serial_number: a.serialNumber || `SN-${a.id}`,
    $cpu: a.cpu || 'Intel Core i5',
    $ram: a.ram || '8 GB',
    $storage: a.storage || '256 GB SSD',
    $os: a.os || 'Windows 11 Pro',
    $office_version: a.officeVersion || 'Microsoft 365',
    $antivirus: a.antivirus || 'Standard Endpoint',
    $ip_address: a.ipAddress || '',
    $mac_address: a.macAddress || '',
    $location: a.location || 'Main Office Campus',
    $floor: a.floor || '1st Floor',
    $bay: a.bay || 'Floating',
    $purchase_date: a.purchaseDate || new Date().toISOString().split('T')[0],
    $purchase_cost: parseFloat(a.purchaseCost) || 0,
    $warranty_expiry: a.warrantyExpiry || new Date(Date.now() + 365*24*60*60*1000).toISOString().split('T')[0],
    $vendor: a.vendor || 'Authorized Reseller',
    $status: a.status || 'Assigned',
    $maintenance_status: a.maintenanceStatus || 'Normal',
    $condition: a.condition || 'Good',
    $remarks: a.remarks || '',
    $last_updated: timestamp
  });

  saveDB();
  logActivity('Asset Saved', a.id, `Upserted ${a.brand} ${a.model} in SQLite`);
  return a;
}

async function transferAsset(assetId, newEmployee, reason, assignedBy = 'IT Admin') {
  const db = await getDB();
  const asset = await getAssetById(assetId);
  if (!asset) return { success: false, message: 'Asset not found' };

  const oldEmp = asset.employeeName || 'Unassigned';
  const today = new Date().toISOString().split('T')[0];

  db.run(`
    INSERT INTO assignments (asset_id, date, from_employee, to_employee, assigned_by, reason)
    VALUES ($asset_id, $date, $from_employee, $to_employee, $assigned_by, $reason)
  `, {
    $asset_id: assetId,
    $date: today,
    $from_employee: oldEmp,
    $to_employee: newEmployee,
    $assigned_by: assignedBy,
    $reason: reason || 'Reassignment'
  });

  db.run(`
    UPDATE assets SET employee_name = $newEmp, status = 'Assigned', last_updated = $ts WHERE id = $id
  `, {
    $newEmp: newEmployee,
    $ts: new Date().toISOString().replace('T', ' ').slice(0, 16),
    $id: assetId
  });

  saveDB();
  logActivity('Asset Transferred', assetId, `Custody transferred from "${oldEmp}" to "${newEmployee}" in SQLite`);
  return { success: true };
}

async function deleteAsset(id) {
  const db = await getDB();
  db.run('DELETE FROM assets WHERE id = $id', { $id: id });
  saveDB();
  logActivity('Asset Deleted', id, 'Deleted asset record from SQLite database');
  return true;
}

// Maintenance
async function getAllMaintenance() {
  const db = await getDB();
  return execSelect(db, 'SELECT * FROM maintenance ORDER BY issue_date DESC');
}

async function createMaintenance(ticket) {
  const db = await getDB();
  if (!ticket.ticketId) {
    ticket.ticketId = `MNT-2026-${Date.now().toString().slice(-4)}`;
  }
  db.run(`
    INSERT INTO maintenance VALUES (
      $ticket_id, $asset_id, $employee, $issue_date, $issue_type, $problem_description,
      $priority, $assigned_technician, $vendor, $repair_cost, $start_date, $completion_date,
      $status, $resolution, $remarks
    )
  `, {
    $ticket_id: ticket.ticketId,
    $asset_id: ticket.assetId,
    $employee: ticket.employee,
    $issue_date: ticket.issueDate || new Date().toISOString().split('T')[0],
    $issue_type: ticket.issueType,
    $problem_description: ticket.problemDescription,
    $priority: ticket.priority,
    $assigned_technician: ticket.assignedTechnician,
    $vendor: ticket.vendor,
    $repair_cost: ticket.repairCost || 0,
    $start_date: ticket.startDate || new Date().toISOString().split('T')[0],
    $completion_date: 'Pending',
    $status: ticket.status || 'Open Issues',
    $resolution: ticket.resolution || '',
    $remarks: ticket.remarks || ''
  });

  db.run(`UPDATE assets SET status = 'Maintenance', maintenance_status = 'In Progress' WHERE id = $id`, {
    $id: ticket.assetId
  });

  saveDB();
  logActivity('Maintenance Opened', ticket.assetId, `Ticket ${ticket.ticketId} created in SQLite`);
  return ticket;
}

async function resolveMaintenance(ticketId, resolution) {
  const db = await getDB();
  const today = new Date().toISOString().split('T')[0];
  db.run(`
    UPDATE maintenance SET status = 'Completed', completion_date = $cd, resolution = $res WHERE ticket_id = $id
  `, {
    $cd: today,
    $res: resolution || 'Resolved and tested',
    $id: ticketId
  });

  const mRows = execSelect(db, 'SELECT asset_id FROM maintenance WHERE ticket_id = $id', { $id: ticketId });
  if (mRows.length > 0) {
    db.run(`UPDATE assets SET status = 'Assigned', maintenance_status = 'Normal' WHERE id = $id`, {
      $id: mRows[0].asset_id
    });
  }

  saveDB();
  return true;
}

// Licenses
async function getAllLicenses() {
  const db = await getDB();
  return execSelect(db, 'SELECT * FROM licenses ORDER BY id ASC');
}

// Activity Log
function logActivity(action, assetId, details, user = 'Admin') {
  if (!dbInstance) return;
  const id = `ACT-${Date.now()}`;
  const ts = new Date().toISOString().replace('T', ' ').slice(0, 16);
  dbInstance.run(`
    INSERT INTO activity_log VALUES ($id, $ts, $user, $action, $asset_id, $details)
  `, {
    $id: id,
    $ts: ts,
    $user: user,
    $action: action,
    $asset_id: assetId || 'SYSTEM',
    $details: details || ''
  });
}

async function getActivityLog() {
  const db = await getDB();
  return execSelect(db, 'SELECT * FROM activity_log ORDER BY timestamp DESC LIMIT 100');
}

// Dashboard Summary Stats
async function getDashboardStats() {
  const db = await getDB();
  const assets = await getAllAssets();
  const total = assets.length;
  const assigned = assets.filter(a => a.status === 'Assigned').length;
  const available = assets.filter(a => a.status === 'Available').length;
  const maintenance = assets.filter(a => a.status === 'Maintenance').length;
  const repair = assets.filter(a => a.status === 'Repair').length;
  const wfh = assets.filter(a => a.status === 'WFH').length;
  const spare = assets.filter(a => a.status === 'Spare').length;

  return {
    total,
    assigned,
    available,
    maintenance,
    repair,
    wfh,
    spare,
    assignedPct: total ? Math.round((assigned / total) * 100) : 0,
    availablePct: total ? Math.round((available / total) * 100) : 0
  };
}

module.exports = {
  getDB,
  getAllAssets,
  getAssetById,
  upsertAsset,
  transferAsset,
  deleteAsset,
  getAllMaintenance,
  createMaintenance,
  resolveMaintenance,
  getAllLicenses,
  getActivityLog,
  logActivity,
  getDashboardStats,
  saveDB
};
