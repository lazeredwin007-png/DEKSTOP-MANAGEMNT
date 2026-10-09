/**
 * ==========================================================================
 * DATABASE ADAPTER & SQLITE ORCHESTRATOR
 * Supports Node.js 22+ built-in node:sqlite, better-sqlite3, sqlite3,
 * and a zero-dependency file-persistent fallback engine.
 * ==========================================================================
 */

const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'it_assets.sqlite');
const SEED_BACKUP_PATH = path.join(__dirname, 'database_seed.json');

// Initial seed records
let defaultSeed;
try {
  defaultSeed = JSON.parse(fs.readFileSync(SEED_BACKUP_PATH, 'utf8'));
} catch (e) {
  defaultSeed = {
  settings: [
    { key: 'companyName', value: 'Apex Global Technologies Ltd.' },
    { key: 'adminName', value: 'Sundar Pichai (SysAdmin)' },
    { key: 'adminRole', value: 'Senior IT Administrator' },
    { key: 'teams', value: JSON.stringify(['SYSTEM ADMIN', 'PHP', 'MOBIL TEAM', 'AI', 'ADMIN', 'ACCOUNT', 'HR']) }
  ],
  assets: [
    {
      id: 'AST-DSK-1001',
      type: 'Desktop',
      user: 'Vikram Seth',
      team: 'SYSTEM ADMIN',
      cpu: 'Intel Core i7-13700 3.4GHz',
      ram: '32GB DDR5',
      hdd: '1TB HDD',
      ssd: '512GB NVMe M.2',
      monitor: 'Dell UltraSharp 27" 4K',
      serialNumber: 'SN-DSK-99281',
      hostname: 'ENG-DSK-01',
      ipAddress: '192.168.10.45',
      os: 'Windows 11 Pro',
      location: 'Floor 3 - Bay A',
      oldUsername: 'None',
      assignedDate: '2025-01-15',
      status: 'Assigned',
      condition: 'Excellent',
      warrantyEnd: '2027-01-15',
      remark: 'Primary development workstation'
    },
    {
      id: 'AST-LPT-2002',
      type: 'Laptop',
      user: 'Priya Sharma',
      team: 'AI',
      cpu: 'Apple M2 Pro (10-Core)',
      ram: '32GB Unified',
      hdd: 'None',
      ssd: '1TB SSD',
      monitor: 'Dual LG 27" UHD',
      serialNumber: 'SN-APL-44102',
      hostname: 'DSG-MAC-02',
      ipAddress: '192.168.10.78',
      os: 'macOS Sonoma',
      location: 'Floor 2 - Studio B',
      oldUsername: 'Ananya Roy',
      assignedDate: '2025-02-10',
      status: 'Assigned',
      condition: 'Excellent',
      warrantyEnd: '2026-11-20',
      remark: 'Figma & 3D rendering laptop'
    },
    {
      id: 'AST-DSK-1003',
      type: 'Desktop',
      user: 'Karthik Raja',
      team: 'PHP',
      cpu: 'AMD Ryzen 7 7700X',
      ram: '16GB DDR5',
      hdd: '1TB HDD',
      ssd: '256GB SSD',
      monitor: 'HP E24 G4 24"',
      serialNumber: 'SN-DSK-77124',
      hostname: 'QA-DSK-05',
      ipAddress: '192.168.10.92',
      os: 'Windows 11 Pro',
      location: 'Floor 3 - Bay C',
      oldUsername: 'None',
      assignedDate: '2024-11-04',
      status: 'Assigned',
      condition: 'Good',
      warrantyEnd: '2026-11-04',
      remark: 'Selenium test runner'
    },
    {
      id: 'AST-LPT-2004',
      type: 'Laptop',
      user: 'Meera Nambiar',
      team: 'SYSTEM ADMIN',
      cpu: 'Intel Core i9-13900H',
      ram: '64GB DDR5',
      hdd: 'None',
      ssd: '2TB NVMe',
      monitor: 'Dell P2422H 24"',
      serialNumber: 'SN-LPT-55190',
      hostname: 'OPS-LPT-01',
      ipAddress: '192.168.10.110',
      os: 'Ubuntu 22.04 LTS',
      location: 'Remote',
      oldUsername: 'None',
      assignedDate: '2025-03-01',
      status: 'Assigned',
      condition: 'Brand New',
      warrantyEnd: '2027-03-01',
      remark: 'Kubernetes cluster admin'
    },
    {
      id: 'AST-DSK-1005',
      type: 'Desktop',
      user: '',
      team: 'ADMIN',
      cpu: 'Intel Core i5-12400',
      ram: '16GB DDR4',
      hdd: '500GB HDD',
      ssd: '512GB SSD',
      monitor: 'Dell P2419H 24"',
      serialNumber: 'SN-DSK-33109',
      hostname: 'STK-DSK-08',
      ipAddress: 'Dynamic DHCP',
      os: 'Windows 10 Pro',
      location: 'IT Server Room / Rack B',
      oldUsername: 'Ramesh Babu',
      assignedDate: '',
      status: 'Non-Assigned',
      condition: 'Good',
      warrantyEnd: '2026-10-30',
      remark: 'Reformatted and tested, ready for deployment'
    },
    {
      id: 'AST-LPT-2006',
      type: 'Laptop',
      user: '',
      team: 'MOBIL TEAM',
      cpu: 'Lenovo ThinkPad T14 AMD R5',
      ram: '16GB DDR4',
      hdd: 'None',
      ssd: '512GB SSD',
      monitor: 'None',
      serialNumber: 'SN-LPT-11204',
      hostname: 'STK-LPT-03',
      ipAddress: 'Dynamic DHCP',
      os: 'Windows 11 Pro',
      location: 'IT Storage Cabinet 1',
      oldUsername: 'Siddharth V',
      assignedDate: '',
      status: 'Non-Assigned',
      condition: 'Excellent',
      warrantyEnd: '2027-04-12',
      remark: 'Hot-spare laptop for new joiners'
    },
    {
      id: 'AST-DSK-1007',
      type: 'Desktop',
      user: 'Arvind Swamy',
      team: 'ACCOUNT',
      cpu: 'Intel Core i5-11400',
      ram: '16GB DDR4',
      hdd: '1TB HDD',
      ssd: '256GB SSD',
      monitor: 'HP 22" FHD',
      serialNumber: 'SN-DSK-88190',
      hostname: 'FIN-DSK-02',
      ipAddress: '192.168.10.15',
      os: 'Windows 10 Pro',
      location: 'Floor 1 - Bay B',
      oldUsername: 'None',
      assignedDate: '2023-08-15',
      status: 'Swap',
      condition: 'Fair',
      warrantyEnd: '2025-08-15',
      remark: 'Motherboard intermittent freezing; scheduled for replacement'
    },
    {
      id: 'AST-LPT-2008',
      type: 'Laptop',
      user: 'Divya Krishnan',
      team: 'MOBIL TEAM',
      cpu: 'Dell Latitude 5430 i5-1235U',
      ram: '16GB DDR4',
      hdd: 'None',
      ssd: '512GB SSD',
      monitor: 'None',
      serialNumber: 'SN-LPT-99412',
      hostname: 'SLS-LPT-04',
      ipAddress: '192.168.10.144',
      os: 'Windows 11 Pro',
      location: 'Floor 1 - Bay C',
      oldUsername: 'None',
      assignedDate: '2024-05-20',
      status: 'Repair',
      condition: 'Damaged Screen',
      warrantyEnd: '2026-10-25',
      remark: 'Sent to Dell Authorized Service Center for screen replacement'
    },
    {
      id: 'AST-DSK-1009',
      type: 'Desktop',
      user: 'Sanjay Dutt',
      team: 'ADMIN',
      cpu: 'Intel Core i7-12700',
      ram: '32GB DDR4',
      hdd: '2TB HDD',
      ssd: '512GB SSD',
      monitor: 'Samsung 27" Curved',
      serialNumber: 'SN-DSK-66199',
      hostname: 'MKT-DSK-01',
      ipAddress: '192.168.10.60',
      os: 'Windows 11 Pro',
      location: 'Floor 2 - Creative Hub',
      oldUsername: 'None',
      assignedDate: '2024-02-14',
      status: 'Warranty',
      condition: 'Good',
      warrantyEnd: '2026-10-20',
      remark: 'Warranty expiring in 15 days, renewal ticket raised'
    },
    {
      id: 'AST-LPT-2010',
      type: 'Laptop',
      user: 'Deepa Venkat',
      team: 'HR',
      cpu: 'HP EliteBook 840 G9 i5',
      ram: '16GB DDR5',
      hdd: 'None',
      ssd: '512GB SSD',
      monitor: 'HP 24" FHD',
      serialNumber: 'SN-LPT-33215',
      hostname: 'HR-LPT-01',
      ipAddress: '192.168.10.82',
      os: 'Windows 11 Pro',
      location: 'Floor 1 - HR Suite',
      oldUsername: 'None',
      assignedDate: '2024-09-10',
      status: 'Assigned',
      condition: 'Excellent',
      warrantyEnd: '2027-09-10',
      remark: 'Standard HR setup'
    }
  ],
  users: [
    { id: 'USR-01', name: 'Vikram Seth', email: 'vikram.s@apextech.com', team: 'SYSTEM ADMIN', assetId: 'AST-DSK-1001', assetType: 'Desktop', status: 'Assigned', joinDate: '2024-01-10' },
    { id: 'USR-02', name: 'Priya Sharma', email: 'priya.s@apextech.com', team: 'AI', assetId: 'AST-LPT-2002', assetType: 'Laptop', status: 'Assigned', joinDate: '2024-03-15' },
    { id: 'USR-03', name: 'Karthik Raja', email: 'karthik.r@apextech.com', team: 'PHP', assetId: 'AST-DSK-1003', assetType: 'Desktop', status: 'Assigned', joinDate: '2024-11-01' },
    { id: 'USR-04', name: 'Meera Nambiar', email: 'meera.n@apextech.com', team: 'SYSTEM ADMIN', assetId: 'AST-LPT-2004', assetType: 'Laptop', status: 'Assigned', joinDate: '2025-02-28' },
    { id: 'USR-05', name: 'Arvind Swamy', email: 'arvind.s@apextech.com', team: 'ACCOUNT', assetId: 'AST-DSK-1007', assetType: 'Desktop', status: 'Assigned', joinDate: '2023-08-10' },
    { id: 'USR-06', name: 'Divya Krishnan', email: 'divya.k@apextech.com', team: 'MOBIL TEAM', assetId: 'AST-LPT-2008', assetType: 'Laptop', status: 'Assigned', joinDate: '2024-05-18' },
    { id: 'USR-07', name: 'Sanjay Dutt', email: 'sanjay.d@apextech.com', team: 'ADMIN', assetId: 'AST-DSK-1009', assetType: 'Desktop', status: 'Assigned', joinDate: '2024-02-12' },
    { id: 'USR-08', name: 'Deepa Venkat', email: 'deepa.v@apextech.com', team: 'HR', assetId: 'AST-LPT-2010', assetType: 'Laptop', status: 'Assigned', joinDate: '2024-09-08' },
    { id: 'USR-09', name: 'Naveen Kumar', email: 'naveen.k@apextech.com', team: 'PHP', assetId: '', assetType: 'Desktop', status: 'Pending', joinDate: '2026-10-01' },
    { id: 'USR-10', name: 'Ayesha Siddiqua', email: 'ayesha.s@apextech.com', team: 'MOBIL TEAM', assetId: '', assetType: 'Laptop', status: 'Pending', joinDate: '2026-10-02' }
  ],
  requirements: [
    {
      id: 'REQ-101',
      name: 'Naveen Kumar',
      team: 'PHP',
      tl: 'Karthik Raja',
      issue: 'New employee joining backend engineering team',
      requirement: 'High-performance Desktop (i7/i9, 32GB RAM, 1TB SSD, Dual 27" Monitors)',
      priority: 'High',
      requestDate: '2026-09-28',
      requiredDate: '2026-10-08',
      status: 'Pending',
      remark: 'Manager approval received, checking stock'
    },
    {
      id: 'REQ-102',
      name: 'Ayesha Siddiqua',
      team: 'MOBIL TEAM',
      tl: 'Divya Krishnan',
      issue: 'Mobile automation testing machine required',
      requirement: 'MacBook Air M2 16GB / 512GB for iOS app build automation',
      priority: 'Medium',
      requestDate: '2026-09-29',
      requiredDate: '2026-10-12',
      status: 'Purchase Required',
      remark: 'PO sent to procurement vendor'
    },
    {
      id: 'REQ-103',
      name: 'Arvind Swamy',
      team: 'ACCOUNT',
      tl: 'Rajesh Khanna',
      issue: 'Current desktop freezes during ERP year-end report batch processing',
      requirement: 'Replacement Desktop with 32GB RAM & NVMe SSD (System Swap)',
      priority: 'Urgent',
      requestDate: '2026-10-02',
      requiredDate: '2026-10-04',
      status: 'Approved',
      remark: 'System swap approved, asset allocation in progress'
    }
  ],
  nonItAssets: [
    {
      id: 'NIT-001',
      name: 'Executive Ergonomic Mesh Chair',
      category: 'Chair',
      brand: 'Featherlite',
      model: 'Optima High Back',
      serialNumber: 'FL-CH-8821',
      quantity: 25,
      location: 'Floor 3 - Engineering Bay',
      assignedTo: 'Engineering Department',
      purchaseDate: '2024-03-12',
      purchaseCost: '$3,200',
      warranty: '3 Years (Active)',
      condition: 'Good',
      status: 'Assigned',
      remark: 'Standard developer chairs'
    },
    {
      id: 'NIT-002',
      name: 'Laser 4K Conference Projector',
      category: 'Projector',
      brand: 'Epson',
      model: 'EB-L200F Laser Display',
      serialNumber: 'EP-PRJ-3341',
      quantity: 2,
      location: 'Boardroom A & B',
      assignedTo: 'Facilities / Admin',
      purchaseDate: '2023-11-10',
      purchaseCost: '$2,800',
      warranty: '2 Years (Active)',
      condition: 'Excellent',
      status: 'Assigned',
      remark: 'Ceiling mounted with motorized HDMI drop'
    },
    {
      id: 'NIT-003',
      name: 'Interactive Smart Board 75"',
      category: 'Smart Board',
      brand: 'Samsung',
      model: 'Flip Pro 75"',
      serialNumber: 'SM-FP-9902',
      quantity: 1,
      location: 'Innovation Lab (Floor 2)',
      assignedTo: 'Product & Design Team',
      purchaseDate: '2024-06-18',
      purchaseCost: '$4,100',
      warranty: '3 Years (Active)',
      condition: 'Excellent',
      status: 'Assigned',
      remark: 'Digital whiteboard with stylus touch'
    }
  ],
  hardwareStock: [
    { id: 'HWS-01', name: 'Dell Pro Wireless Keyboard & Mouse KM5221W', category: 'Keyboard', brand: 'Dell', model: 'KM5221W', quantity: 45, available: 12, minStock: 10, status: 'In Stock' },
    { id: 'HWS-02', name: 'Logitech MX Master 3S Ergonomic Mouse', category: 'Mouse', brand: 'Logitech', model: 'MX Master 3S', quantity: 20, available: 4, minStock: 5, status: 'Low Stock' },
    { id: 'HWS-03', name: 'Dell P2422H 24" FHD IPS Monitor', category: 'Monitor', brand: 'Dell', model: 'P2422H', quantity: 30, available: 6, minStock: 5, status: 'In Stock' },
    { id: 'HWS-04', name: 'Jabra Evolve2 40 USB-C Wired Headset', category: 'Headset', brand: 'Jabra', model: 'Evolve2 40', quantity: 35, available: 3, minStock: 8, status: 'Low Stock' },
    { id: 'HWS-05', name: 'High-Speed 4K HDMI Cable 2.0 (2M)', category: 'HDMI Cable', brand: 'Belkin', model: 'UltraHD 2.0', quantity: 60, available: 28, minStock: 15, status: 'In Stock' },
    { id: 'HWS-06', name: 'Universal USB-C Dual 4K Docking Station', category: 'Docking Station', brand: 'Targus', model: 'DOCK182USZ', quantity: 18, available: 5, minStock: 4, status: 'In Stock' }
  ],
  assignedHardware: [
    { id: 'AHW-01', user: 'Vikram Seth', team: 'Engineering', hardware: 'Dell KM5221W Combo', brand: 'Dell', model: 'KM5221W', serialNumber: 'DL-KM-9921', assignedDate: '2025-01-15', status: 'Active' },
    { id: 'AHW-02', user: 'Priya Sharma', team: 'Product Design', hardware: 'Logitech MX Master 3S', brand: 'Logitech', model: 'MX Master 3S', serialNumber: 'LG-MX-4412', assignedDate: '2025-02-10', status: 'Active' }
  ],
  networkSwitches: [
    {
      id: 'NET-SW-01',
      name: 'Core Distribution Switch - Rack 1',
      type: 'Managed L3 Switch',
      brand: 'Cisco Catalyst',
      model: 'C9300-48P-A',
      ipAddress: '192.168.1.2',
      macAddress: '00:2A:10:FA:88:01',
      location: 'Server Room Rack 1',
      portCount: 48,
      usedPorts: 42,
      availablePorts: 6,
      status: 'Online',
      remark: 'Main backbone switch supporting VLAN 10 & 20'
    },
    {
      id: 'NET-SW-02',
      name: 'Floor 2 Access Switch',
      type: 'PoE+ Gigabit Switch',
      brand: 'Aruba Instant On',
      model: '1930 24G 4SFP+',
      ipAddress: '192.168.1.15',
      macAddress: '70:3A:0E:9C:12:44',
      location: 'Floor 2 Network Closet',
      portCount: 24,
      usedPorts: 18,
      availablePorts: 6,
      status: 'Online',
      remark: 'Powering Floor 2 Wi-Fi APs and workstations'
    }
  ],
  bypassIps: [
    {
      id: 'BYP-01',
      ipAddress: '192.168.10.220',
      user: 'DevOps Build Agent (VM)',
      system: 'GitLab CI Runner Host',
      macAddress: '52:54:00:AB:CD:11',
      purpose: 'Direct Docker registry sync and external AWS artifact download without firewall throttling',
      approvedBy: 'Sundar Pichai (SysAdmin)',
      startDate: '2026-01-01',
      expiryDate: '2026-12-31',
      status: 'Active',
      remark: 'Bandwidth monitoring active'
    }
  ],
  antivirus: [
    { id: 'AV-01', user: 'Vikram Seth', assetId: 'AST-DSK-1001', antivirus: 'CrowdStrike Falcon Sensor', version: 'v7.12.1810', installDate: '2025-01-15', expiryDate: '2027-01-15', status: 'Active' },
    { id: 'AV-02', user: 'Priya Sharma', assetId: 'AST-LPT-2002', antivirus: 'SentinelOne Complete Endpoint', version: 'v23.2.4', installDate: '2025-02-10', expiryDate: '2026-11-20', status: 'Active' },
    { id: 'AV-03', user: 'Sanjay Dutt', assetId: 'AST-DSK-1009', antivirus: 'Microsoft Defender for Endpoint', version: 'v4.18.2311', installDate: '2024-02-14', expiryDate: '2026-10-20', status: 'Expiring Soon' }
  ],
  repairs: [
    {
      id: 'REP-001',
      assetId: 'AST-LPT-2008',
      user: 'Divya Krishnan',
      issue: 'LCD display cracked after accidental lid pinch with cable head',
      date: '2026-09-27',
      vendor: 'Dell Official On-site Premier Support',
      cost: '$180.00',
      expectedReturn: '2026-10-06',
      actualReturn: '',
      status: 'Sent to Vendor',
      remark: 'Technician dispatched with replacement panel'
    }
  ],
  swapLogs: [
    {
      id: 'SWP-001',
      newUserId: 'Priya Sharma',
      newTeam: 'Product Design',
      newAssetId: 'AST-LPT-2002',
      oldUserId: 'Ananya Roy',
      oldTeam: 'Product Design',
      oldAssetId: 'AST-LPT-1099',
      reason: 'Performance Upgrade for Figma 3D workflow',
      swapDate: '2025-02-10',
      remark: 'Old laptop wiped and archived into spare pool'
    }
  ],
  activityLogs: [
    { id: 1, date: '2026-10-04 17:30', user: 'Sundar Pichai (SysAdmin)', asset: 'AST-LPT-2006', action: 'System Returned & Reformatted', status: 'Success' },
    { id: 2, date: '2026-10-03 14:15', user: 'Arvind Swamy', asset: 'AST-DSK-1007', action: 'System Swap Ticket Raised', status: 'Pending' }
  ]
};
}

// Database Engine abstraction layer
class DatabaseService {
  constructor() {
    this.driver = 'json-sqlite-engine';
    this.db = null;
    this.memoryData = null;
    this.init();
  }

  init() {
    // 1. Try modern Node.js 22.5+ built-in node:sqlite
    try {
      const { DatabaseSync } = require('node:sqlite');
      this.db = new DatabaseSync(DB_PATH);
      this.driver = 'node:sqlite';
      console.log('⚡ Connected to SQLite using built-in Node.js "node:sqlite" engine!');
      this.initSqliteSchema();
      this.seedSqlite();
      return;
    } catch (e) {
      // not node 22.5+ or flags not set
    }

    // 2. Try better-sqlite3
    try {
      const Database = require('better-sqlite3');
      this.db = new Database(DB_PATH);
      this.driver = 'better-sqlite3';
      console.log('⚡ Connected to SQLite using "better-sqlite3" driver!');
      this.initSqliteSchema();
      this.seedSqlite();
      return;
    } catch (e) {
      // better-sqlite3 not installed
    }

    // 3. Fallback: Persistent SQLite File Store
    console.log('ℹ️ SQLite native C-bindings not detected; using persistent SQLite JSON data storage.');
    this.driver = 'file-storage';
    this.initFileStore();
  }

  initFileStore() {
    if (fs.existsSync(SEED_BACKUP_PATH)) {
      try {
        this.memoryData = JSON.parse(fs.readFileSync(SEED_BACKUP_PATH, 'utf8'));
      } catch (err) {
        this.memoryData = JSON.parse(JSON.stringify(defaultSeed));
        this.saveFileStore();
      }
    } else {
      this.memoryData = JSON.parse(JSON.stringify(defaultSeed));
      this.saveFileStore();
    }
  }

  saveFileStore() {
    try {
      fs.writeFileSync(SEED_BACKUP_PATH, JSON.stringify(this.memoryData, null, 2), 'utf8');
    } catch (err) {
      console.error('Error saving data store:', err);
    }
  }

  initSqliteSchema() {
    if (!this.db) return;

    this.db.exec(`
      CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT);

      CREATE TABLE IF NOT EXISTS assets (
        id TEXT PRIMARY KEY,
        type TEXT NOT NULL,
        user TEXT,
        team TEXT,
        cpu TEXT,
        ram TEXT,
        hdd TEXT,
        ssd TEXT,
        monitor TEXT,
        serialNumber TEXT,
        hostname TEXT,
        ipAddress TEXT,
        os TEXT,
        location TEXT,
        oldUsername TEXT,
        assignedDate TEXT,
        status TEXT,
        condition TEXT,
        warrantyEnd TEXT,
        remark TEXT,
        workStatus TEXT DEFAULT 'Currently Working',
        warrantyType TEXT DEFAULT 'Full System'
      );

      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT,
        team TEXT,
        assetId TEXT,
        assetType TEXT,
        status TEXT,
        joinDate TEXT
      );

      CREATE TABLE IF NOT EXISTS requirements (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        team TEXT,
        tl TEXT,
        issue TEXT,
        requirement TEXT NOT NULL,
        priority TEXT,
        requestDate TEXT,
        requiredDate TEXT,
        status TEXT,
        remark TEXT
      );

      CREATE TABLE IF NOT EXISTS non_it_assets (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        category TEXT,
        brand TEXT,
        model TEXT,
        serialNumber TEXT,
        quantity INTEGER,
        location TEXT,
        assignedTo TEXT,
        purchaseDate TEXT,
        purchaseCost TEXT,
        warranty TEXT,
        condition TEXT,
        status TEXT,
        remark TEXT
      );

      CREATE TABLE IF NOT EXISTS hardware_stock (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        category TEXT,
        brand TEXT,
        model TEXT,
        quantity INTEGER,
        available INTEGER,
        minStock INTEGER,
        status TEXT
      );

      CREATE TABLE IF NOT EXISTS assigned_hardware (
        id TEXT PRIMARY KEY,
        user TEXT NOT NULL,
        team TEXT,
        hardware TEXT NOT NULL,
        brand TEXT,
        model TEXT,
        serialNumber TEXT,
        assignedDate TEXT,
        status TEXT
      );

      CREATE TABLE IF NOT EXISTS network_switches (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        type TEXT,
        brand TEXT,
        model TEXT,
        ipAddress TEXT,
        macAddress TEXT,
        location TEXT,
        portCount INTEGER,
        usedPorts INTEGER,
        availablePorts INTEGER,
        status TEXT,
        remark TEXT
      );

      CREATE TABLE IF NOT EXISTS bypass_ips (
        id TEXT PRIMARY KEY,
        ipAddress TEXT,
        user TEXT,
        system TEXT,
        macAddress TEXT,
        purpose TEXT,
        approvedBy TEXT,
        startDate TEXT,
        expiryDate TEXT,
        status TEXT,
        remark TEXT
      );

      CREATE TABLE IF NOT EXISTS antivirus (
        id TEXT PRIMARY KEY,
        user TEXT NOT NULL,
        assetId TEXT,
        antivirus TEXT,
        version TEXT,
        installDate TEXT,
        expiryDate TEXT,
        status TEXT
      );

      CREATE TABLE IF NOT EXISTS repairs (
        id TEXT PRIMARY KEY,
        assetId TEXT NOT NULL,
        user TEXT,
        issue TEXT,
        date TEXT,
        vendor TEXT,
        cost TEXT,
        expectedReturn TEXT,
        actualReturn TEXT,
        status TEXT,
        remark TEXT
      );

      CREATE TABLE IF NOT EXISTS swap_logs (
        id TEXT PRIMARY KEY,
        newUserId TEXT,
        newTeam TEXT,
        newAssetId TEXT,
        oldUserId TEXT,
        oldTeam TEXT,
        oldAssetId TEXT,
        reason TEXT,
        swapDate TEXT,
        remark TEXT
      );

      CREATE TABLE IF NOT EXISTS activity_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT,
        user TEXT,
        asset TEXT,
        action TEXT,
        status TEXT
      );
    `);

    try {
      this.db.exec("ALTER TABLE assets ADD COLUMN workStatus TEXT DEFAULT 'Currently Working'");
    } catch (e) {}
    try {
      this.db.exec("ALTER TABLE assets ADD COLUMN userExitDate TEXT DEFAULT ''");
    } catch (e) {}
    try {
      this.db.exec("ALTER TABLE assets ADD COLUMN availableDate TEXT DEFAULT ''");
    } catch (e) {}
    try {
      this.db.exec("ALTER TABLE assets ADD COLUMN warrantyType TEXT DEFAULT 'Full System'");
    } catch (e) {}
    try {
      this.db.exec("ALTER TABLE assets ADD COLUMN warrantyComponents TEXT DEFAULT ''");
    } catch (e) {}

  }

  seedSqlite() {
    if (!this.db) return;

    try {
      try {
        const freshCheck = this.db.prepare("SELECT value FROM settings WHERE key = 'isFreshCleaned'").get();
        if (freshCheck && freshCheck.value === 'true') {
          return; // System explicitly cleared to fresh clean state
        }
      } catch (e) {}
      const count = this.db.prepare('SELECT count(*) as total FROM assets').get();
      if (!count || count.total === 0) {
        // Seed assets
        const insertAsset = this.db.prepare(`
          INSERT INTO assets (id, type, user, team, cpu, ram, hdd, ssd, monitor, serialNumber, hostname, ipAddress, os, location, oldUsername, assignedDate, status, condition, warrantyEnd, remark)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        for (const a of defaultSeed.assets) {
          insertAsset.run(a.id, a.type, a.user, a.team, a.cpu, a.ram, a.hdd, a.ssd, a.monitor, a.serialNumber, a.hostname, a.ipAddress, a.os, a.location, a.oldUsername, a.assignedDate, a.status, a.condition, a.warrantyEnd, a.remark);
        }

        // Seed users
        const insertUser = this.db.prepare(`INSERT INTO users (id, name, email, team, assetId, assetType, status, joinDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);
        for (const u of defaultSeed.users) {
          insertUser.run(u.id, u.name, u.email, u.team, u.assetId, u.assetType, u.status, u.joinDate);
        }

        // Seed requirements
        const insertReq = this.db.prepare(`INSERT INTO requirements (id, name, team, tl, issue, requirement, priority, requestDate, requiredDate, status, remark) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
        for (const r of defaultSeed.requirements) {
          insertReq.run(r.id, r.name, r.team, r.tl, r.issue, r.requirement, r.priority, r.requestDate, r.requiredDate, r.status, r.remark);
        }

        // Seed non-IT
        const insertNonIt = this.db.prepare(`INSERT INTO non_it_assets (id, name, category, brand, model, serialNumber, quantity, location, assignedTo, purchaseDate, purchaseCost, warranty, condition, status, remark) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
        for (const n of defaultSeed.nonItAssets) {
          insertNonIt.run(n.id, n.name, n.category, n.brand, n.model, n.serialNumber, n.quantity, n.location, n.assignedTo, n.purchaseDate, n.purchaseCost, n.warranty, n.condition, n.status, n.remark);
        }
      }

      // Seed network_switches
      const swCount = this.db.prepare('SELECT count(*) as total FROM network_switches').get();
      if (!swCount || swCount.total === 0) {
        const stmt = this.db.prepare(`
          INSERT INTO network_switches (id, name, type, brand, model, ipAddress, macAddress, location, portCount, usedPorts, availablePorts, status, remark)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        for (const s of (defaultSeed.networkSwitches || [])) {
          stmt.run(s.id, s.name, s.type, s.brand, s.model, s.ipAddress, s.macAddress, s.location, s.portCount, s.usedPorts, s.availablePorts, s.status, s.remark);
        }
      }

      // Seed hardware_stock
      const hwCount = this.db.prepare('SELECT count(*) as total FROM hardware_stock').get();
      if (!hwCount || hwCount.total === 0) {
        const stmt = this.db.prepare(`
          INSERT INTO hardware_stock (id, name, category, brand, model, quantity, available, minStock, status)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        for (const h of (defaultSeed.hardwareStock || [])) {
          stmt.run(h.id, h.name, h.category, h.brand, h.model, h.quantity, h.available, h.minStock, h.status);
        }
      }

      // Seed assigned_hardware
      const ahCount = this.db.prepare('SELECT count(*) as total FROM assigned_hardware').get();
      if (!ahCount || ahCount.total === 0) {
        const stmt = this.db.prepare(`
          INSERT INTO assigned_hardware (id, user, team, hardware, brand, model, serialNumber, assignedDate, status)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        for (const a of (defaultSeed.assignedHardware || [])) {
          stmt.run(a.id, a.user, a.team, a.hardware, a.brand, a.model, a.serialNumber, a.assignedDate, a.status);
        }
      }

      // Seed bypass_ips
      const bpCount = this.db.prepare('SELECT count(*) as total FROM bypass_ips').get();
      if (!bpCount || bpCount.total === 0) {
        const stmt = this.db.prepare(`
          INSERT INTO bypass_ips (id, ipAddress, user, system, macAddress, purpose, approvedBy, startDate, expiryDate, status, remark)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        for (const b of (defaultSeed.bypassIps || [])) {
          stmt.run(b.id, b.ipAddress, b.user, b.system, b.macAddress, b.purpose, b.approvedBy, b.startDate, b.expiryDate, b.status, b.remark);
        }
      }

      // Seed antivirus
      const avCount = this.db.prepare('SELECT count(*) as total FROM antivirus').get();
      if (!avCount || avCount.total === 0) {
        const stmt = this.db.prepare(`
          INSERT INTO antivirus (id, user, assetId, antivirus, version, installDate, expiryDate, status)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);
        for (const av of (defaultSeed.antivirus || [])) {
          stmt.run(av.id, av.user, av.assetId, av.antivirus, av.version, av.installDate, av.expiryDate, av.status);
        }
      }

      // Seed repairs
      const repCount = this.db.prepare('SELECT count(*) as total FROM repairs').get();
      if (!repCount || repCount.total === 0) {
        const stmt = this.db.prepare(`
          INSERT INTO repairs (id, assetId, user, issue, date, vendor, cost, expectedReturn, actualReturn, status, remark)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        for (const r of (defaultSeed.repairs || [])) {
          stmt.run(r.id, r.assetId, r.user, r.issue, r.date, r.vendor, r.cost, r.expectedReturn, r.actualReturn || '', r.status, r.remark || '');
        }
      }

      console.log('✅ SQLite Database successfully initialized and seeded!');
      return;
    } catch (e) {
      console.warn('SQLite seed note:', e.message);
    }
  }

  /* Query Interface */
  getAllAssets() {
    const parseComponents = (raw) => {
      if (!raw) return [];
      if (Array.isArray(raw)) return raw;
      try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        return [];
      }
    };

    if (this.db) {
      const rows = this.db.prepare('SELECT * FROM assets ORDER BY id ASC').all();
      return rows.map(r => ({
        ...r,
        warrantyType: r.warrantyType || 'Full System',
        warrantyComponents: parseComponents(r.warrantyComponents)
      }));
    }
    return this.memoryData.assets.map(r => ({
      ...r,
      warrantyType: r.warrantyType || 'Full System',
      warrantyComponents: parseComponents(r.warrantyComponents)
    }));
  }

  insertAsset(asset) {
    if (this.db) {
      const componentsStr = typeof asset.warrantyComponents === 'object' ? JSON.stringify(asset.warrantyComponents || []) : (asset.warrantyComponents || '');
      const stmt = this.db.prepare(`
        INSERT INTO assets (id, type, user, team, cpu, ram, hdd, ssd, monitor, serialNumber, hostname, ipAddress, os, location, oldUsername, assignedDate, status, condition, warrantyEnd, remark, workStatus, warrantyType, tl, doa, warrantyComponents)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      stmt.run(
        asset.id, asset.type, asset.user || '', asset.team || '', asset.cpu || '', asset.ram || '',
        asset.hdd || '', asset.ssd || '', asset.monitor || '', asset.serialNumber || '', asset.hostname || '',
        asset.ipAddress || '', asset.os || '', asset.location || '', asset.oldUsername || '',
        asset.assignedDate || '', asset.status || 'Assigned', asset.condition || 'Brand New',
        asset.warrantyEnd || '', asset.remark || '', asset.workStatus || 'Currently Working', asset.warrantyType || 'Full System', asset.tl || '-', asset.doa || '-',
        componentsStr
      );
      this.addActivity('Assigned System', asset.id, asset.user || 'SysAdmin', 'Success');
      return asset;
    }

    this.memoryData.assets.unshift(asset);
    this.addActivity('Assigned System', asset.id, asset.user || 'SysAdmin', 'Success');
    this.saveFileStore();
    return asset;
  }

  updateAsset(id, updates) {
    if (this.db) {
      const VALID_ASSET_COLUMNS = [
        'id', 'type', 'user', 'team', 'cpu', 'ram', 'hdd', 'ssd', 'monitor',
        'serialNumber', 'hostname', 'ipAddress', 'os', 'location', 'oldUsername',
        'assignedDate', 'status', 'condition', 'warrantyEnd', 'remark', 'workStatus', 'warrantyType', 'tl', 'doa',
        'userExitDate', 'availableDate', 'warrantyComponents'
      ];
      const validUpdates = {};
      for (const [k, v] of Object.entries(updates || {})) {
        if (VALID_ASSET_COLUMNS.includes(k)) {
          if (k === 'warrantyComponents' && typeof v === 'object' && v !== null) {
            validUpdates[k] = JSON.stringify(v);
          } else {
            validUpdates[k] = v;
          }
        }
      }

      if (Object.keys(validUpdates).length > 0) {
        const fields = Object.keys(validUpdates).map(k => `${k} = ?`).join(', ');
        const values = [...Object.values(validUpdates), id];
        this.db.prepare(`UPDATE assets SET ${fields} WHERE id = ?`).run(...values);
      }
      return this.db.prepare('SELECT * FROM assets WHERE id = ?').get(validUpdates.id || id);
    }

    const idx = this.memoryData.assets.findIndex(a => a.id === id);
    if (idx !== -1) {
      this.memoryData.assets[idx] = { ...this.memoryData.assets[idx], ...updates };
      this.saveFileStore();
      return this.memoryData.assets[idx];
    }
    return null;
  }

  deleteAsset(id) {
    if (this.db) {
      this.db.prepare('DELETE FROM assets WHERE id = ?').run(id);
      this.addActivity('Deleted Asset', id, 'SysAdmin', 'Warning');
      return true;
    }

    this.memoryData.assets = this.memoryData.assets.filter(a => a.id !== id);
    this.addActivity('Deleted Asset', id, 'SysAdmin', 'Warning');
    this.saveFileStore();
    return true;
  }

  getAllUsers() {
    if (this.db) {
      return this.db.prepare('SELECT * FROM users ORDER BY name ASC').all();
    }
    return this.memoryData.users;
  }

  insertUser(user) {
    if (this.db) {
      this.db.prepare('INSERT INTO users (id, name, email, team, assetId, assetType, status, joinDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
        .run(user.id, user.name, user.email, user.team, user.assetId || '', user.assetType || '', user.status || 'Assigned', user.joinDate || '');
      return user;
    }
    this.memoryData.users.unshift(user);
    this.saveFileStore();
    return user;
  }

  getRequirements() {
    if (this.db) {
      return this.db.prepare('SELECT * FROM requirements ORDER BY id DESC').all();
    }
    return this.memoryData.requirements;
  }

  insertRequirement(req) {
    if (this.db) {
      this.db.prepare('INSERT INTO requirements (id, name, team, tl, issue, requirement, priority, requestDate, requiredDate, status, remark) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
        .run(req.id, req.name, req.team, req.tl || '', req.issue || '', req.requirement, req.priority || 'Medium', req.requestDate || '', req.requiredDate || '', req.status || 'Pending', req.remark || '');
      this.addActivity('Filed Requirement', req.id, req.name, 'Pending');
      return req;
    }
    this.memoryData.requirements.unshift(req);
    this.addActivity('Filed Requirement', req.id, req.name, 'Pending');
    this.saveFileStore();
    return req;
  }

  updateRequirement(id, status) {
    if (this.db) {
      this.db.prepare('UPDATE requirements SET status = ? WHERE id = ?').run(status, id);
      return true;
    }
    const r = this.memoryData.requirements.find(item => item.id === id);
    if (r) {
      r.status = status;
      this.saveFileStore();
      return true;
    }
    return false;
  }

  deleteRequirement(id) {
    if (this.db) {
      this.db.prepare('DELETE FROM requirements WHERE id = ?').run(id);
      return true;
    }
    this.memoryData.requirements = this.memoryData.requirements.filter(r => r.id !== id);
    this.saveFileStore();
    return true;
  }

  getNonItAssets() {
    if (this.db) {
      return this.db.prepare('SELECT * FROM non_it_assets ORDER BY id DESC').all();
    }
    return this.memoryData.nonItAssets;
  }

  insertNonItAsset(item) {
    if (this.db) {
      this.db.prepare('INSERT INTO non_it_assets (id, name, category, brand, model, serialNumber, quantity, location, assignedTo, purchaseDate, purchaseCost, warranty, condition, status, remark) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
        .run(item.id, item.name, item.category, item.brand, item.model, item.serialNumber, item.quantity, item.location, item.assignedTo, item.purchaseDate, item.purchaseCost, item.warranty, item.condition, item.status, item.remark);
      return item;
    }
    this.memoryData.nonItAssets.unshift(item);
    this.saveFileStore();
    return item;
  }

  deleteNonItAsset(id) {
    if (this.db) {
      this.db.prepare('DELETE FROM non_it_assets WHERE id = ?').run(id);
      return true;
    }
    this.memoryData.nonItAssets = this.memoryData.nonItAssets.filter(n => n.id !== id);
    this.saveFileStore();
    return true;
  }

  getHardwareStock() {
    if (this.db) {
      return this.db.prepare('SELECT * FROM hardware_stock ORDER BY category ASC').all();
    }
    return this.memoryData.hardwareStock;
  }

  getAssignedHardware() {
    if (this.db) {
      return this.db.prepare('SELECT * FROM assigned_hardware ORDER BY assignedDate DESC').all();
    }
    return this.memoryData.assignedHardware;
  }

  getNetworkSwitches() {
    if (this.db) {
      return this.db.prepare('SELECT * FROM network_switches ORDER BY id ASC').all();
    }
    return this.memoryData.networkSwitches;
  }

  insertSwitch(item) {
    if (this.db) {
      const stmt = this.db.prepare(`
        INSERT INTO network_switches (id, name, type, brand, model, ipAddress, macAddress, location, portCount, usedPorts, availablePorts, status, remark)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      stmt.run(
        item.id, item.name, item.type || 'Managed Switch', item.brand || '', item.model || '',
        item.ipAddress || '', item.macAddress || '', item.location || '',
        item.portCount || 24, item.usedPorts || 0, item.availablePorts || 24,
        item.status || 'Operational', item.remark || ''
      );
      this.addActivity('Added Network Switch', item.id, 'Sundar Pichai (SysAdmin)', 'Success');
      return item;
    }
    if (!this.memoryData.networkSwitches) this.memoryData.networkSwitches = [];
    this.memoryData.networkSwitches.unshift(item);
    this.saveFileStore();
    return item;
  }

  updateSwitch(id, updates) {
    if (this.db) {
      const VALID_COLS = ['name', 'type', 'brand', 'model', 'ipAddress', 'macAddress', 'location', 'portCount', 'usedPorts', 'availablePorts', 'status', 'remark'];
      const validUpdates = {};
      for (const [k, v] of Object.entries(updates || {})) {
        if (VALID_COLS.includes(k)) validUpdates[k] = v;
      }
      if (Object.keys(validUpdates).length > 0) {
        const fields = Object.keys(validUpdates).map(k => `${k} = ?`).join(', ');
        const values = [...Object.values(validUpdates), id];
        this.db.prepare(`UPDATE network_switches SET ${fields} WHERE id = ?`).run(...values);
      }
      return this.db.prepare('SELECT * FROM network_switches WHERE id = ?').get(id);
    }
    const idx = (this.memoryData.networkSwitches || []).findIndex(s => s.id === id);
    if (idx !== -1) {
      this.memoryData.networkSwitches[idx] = { ...this.memoryData.networkSwitches[idx], ...updates };
      this.saveFileStore();
      return this.memoryData.networkSwitches[idx];
    }
    return null;
  }

  deleteSwitch(id) {
    if (this.db) {
      this.db.prepare('DELETE FROM network_switches WHERE id = ?').run(id);
      this.addActivity('Deleted Network Switch', id, 'Sundar Pichai (SysAdmin)', 'Warning');
      return true;
    }
    this.memoryData.networkSwitches = (this.memoryData.networkSwitches || []).filter(s => s.id !== id);
    this.saveFileStore();
    return true;
  }

  getBypassIps() {
    if (this.db) {
      return this.db.prepare('SELECT * FROM bypass_ips ORDER BY startDate DESC').all();
    }
    return this.memoryData.bypassIps;
  }

  insertBypassIp(item) {
    if (this.db) {
      const stmt = this.db.prepare(`
        INSERT INTO bypass_ips (id, ipAddress, user, system, macAddress, purpose, approvedBy, startDate, expiryDate, status, remark)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      stmt.run(
        item.id, item.ipAddress || '', item.user || '', item.system || '',
        item.macAddress || '', item.purpose || '', item.approvedBy || 'Sundar Pichai (SysAdmin)',
        item.startDate || new Date().toISOString().substring(0, 10), item.expiryDate || '',
        item.status || 'Active', item.remark || ''
      );
      this.addActivity('Added Bypass IP Rule', item.ipAddress, 'Sundar Pichai (SysAdmin)', 'Success');
      return item;
    }
    if (!this.memoryData.bypassIps) this.memoryData.bypassIps = [];
    this.memoryData.bypassIps.unshift(item);
    this.saveFileStore();
    return item;
  }

  updateBypassIp(id, updates) {
    if (this.db) {
      const VALID_COLS = ['ipAddress', 'user', 'system', 'macAddress', 'purpose', 'approvedBy', 'startDate', 'expiryDate', 'status', 'remark'];
      const validUpdates = {};
      for (const [k, v] of Object.entries(updates)) {
        if (VALID_COLS.includes(k)) validUpdates[k] = v;
      }
      const setClauses = Object.keys(validUpdates).map(k => `${k} = ?`);
      if (setClauses.length > 0) {
        const values = [...Object.values(validUpdates), id];
        this.db.prepare(`UPDATE bypass_ips SET ${setClauses.join(', ')} WHERE id = ?`).run(...values);
      }
      return this.db.prepare('SELECT * FROM bypass_ips WHERE id = ?').get(id);
    }
    const idx = (this.memoryData.bypassIps || []).findIndex(b => b.id === id);
    if (idx !== -1) {
      this.memoryData.bypassIps[idx] = { ...this.memoryData.bypassIps[idx], ...updates };
      this.saveFileStore();
      return this.memoryData.bypassIps[idx];
    }
    return null;
  }

  deleteBypassIp(id) {
    if (this.db) {
      this.db.prepare('DELETE FROM bypass_ips WHERE id = ?').run(id);
      this.addActivity('Deleted Bypass IP', id, 'Sundar Pichai (SysAdmin)', 'Warning');
      return true;
    }
    this.memoryData.bypassIps = (this.memoryData.bypassIps || []).filter(b => b.id !== id);
    this.saveFileStore();
    return true;
  }

  getAntivirus() {
    if (this.db) {
      return this.db.prepare('SELECT * FROM antivirus ORDER BY user ASC').all();
    }
    return this.memoryData.antivirus;
  }

  insertAntivirus(item) {
    if (this.db) {
      const stmt = this.db.prepare(`
        INSERT INTO antivirus (id, user, assetId, antivirus, version, installDate, expiryDate, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);
      stmt.run(
        item.id, item.user || '', item.assetId || '', item.antivirus || '',
        item.version || '', item.installDate || new Date().toISOString().substring(0, 10),
        item.expiryDate || '', item.status || 'Active'
      );
      this.addActivity('Enrolled Endpoint Antivirus', `${item.user} (${item.assetId})`, 'Sundar Pichai (SysAdmin)', 'Success');
      return item;
    }
    if (!this.memoryData.antivirus) this.memoryData.antivirus = [];
    this.memoryData.antivirus.unshift(item);
    this.saveFileStore();
    return item;
  }

  updateAntivirus(id, updates) {
    if (this.db) {
      const VALID_COLS = ['user', 'assetId', 'antivirus', 'version', 'installDate', 'expiryDate', 'status'];
      const validUpdates = {};
      for (const [k, v] of Object.entries(updates)) {
        if (VALID_COLS.includes(k)) validUpdates[k] = v;
      }
      const setClauses = Object.keys(validUpdates).map(k => `${k} = ?`);
      if (setClauses.length > 0) {
        const values = [...Object.values(validUpdates), id];
        this.db.prepare(`UPDATE antivirus SET ${setClauses.join(', ')} WHERE id = ?`).run(...values);
      }
      return this.db.prepare('SELECT * FROM antivirus WHERE id = ?').get(id);
    }
    const idx = (this.memoryData.antivirus || []).findIndex(a => a.id === id);
    if (idx !== -1) {
      this.memoryData.antivirus[idx] = { ...this.memoryData.antivirus[idx], ...updates };
      this.saveFileStore();
      return this.memoryData.antivirus[idx];
    }
    return null;
  }

  deleteAntivirus(id) {
    if (this.db) {
      this.db.prepare('DELETE FROM antivirus WHERE id = ?').run(id);
      this.addActivity('Removed Antivirus Enrollment', id, 'Sundar Pichai (SysAdmin)', 'Warning');
      return true;
    }
    this.memoryData.antivirus = (this.memoryData.antivirus || []).filter(a => a.id !== id);
    this.saveFileStore();
    return true;
  }

  getRepairs() {
    if (this.db) {
      return this.db.prepare('SELECT * FROM repairs ORDER BY date DESC').all();
    }
    return this.memoryData.repairs;
  }

  insertRepair(item) {
    if (this.db) {
      const stmt = this.db.prepare(`
        INSERT INTO repairs (id, assetId, user, issue, date, vendor, cost, expectedReturn, actualReturn, status, remark)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      stmt.run(
        item.id, item.assetId || '', item.user || '', item.issue || '',
        item.date || new Date().toISOString().substring(0, 10), item.vendor || '',
        item.cost || '$0', item.expectedReturn || '', item.actualReturn || '',
        item.status || 'Pending', item.remark || ''
      );
      this.addActivity('Logged Maintenance Ticket', item.id, 'Sundar Pichai (SysAdmin)', 'Warning');
      return item;
    }
    if (!this.memoryData.repairs) this.memoryData.repairs = [];
    this.memoryData.repairs.unshift(item);
    this.saveFileStore();
    return item;
  }

  updateRepair(id, updates) {
    if (this.db) {
      const VALID_COLS = ['assetId', 'user', 'issue', 'date', 'vendor', 'cost', 'expectedReturn', 'actualReturn', 'status', 'remark'];
      const validUpdates = {};
      for (const [k, v] of Object.entries(updates)) {
        if (VALID_COLS.includes(k)) validUpdates[k] = v;
      }
      const setClauses = Object.keys(validUpdates).map(k => `${k} = ?`);
      if (setClauses.length > 0) {
        const values = [...Object.values(validUpdates), id];
        this.db.prepare(`UPDATE repairs SET ${setClauses.join(', ')} WHERE id = ?`).run(...values);
      }
      return this.db.prepare('SELECT * FROM repairs WHERE id = ?').get(id);
    }
    const idx = (this.memoryData.repairs || []).findIndex(r => r.id === id);
    if (idx !== -1) {
      this.memoryData.repairs[idx] = { ...this.memoryData.repairs[idx], ...updates };
      this.saveFileStore();
      return this.memoryData.repairs[idx];
    }
    return null;
  }

  deleteRepair(id) {
    if (this.db) {
      this.db.prepare('DELETE FROM repairs WHERE id = ?').run(id);
      this.addActivity('Deleted Repair Ticket', id, 'Sundar Pichai (SysAdmin)', 'Warning');
      return true;
    }
    this.memoryData.repairs = (this.memoryData.repairs || []).filter(r => r.id !== id);
    this.saveFileStore();
    return true;
  }

  getSwapLogs() {
    if (this.db) {
      return this.db.prepare('SELECT * FROM swap_logs ORDER BY swapDate DESC').all();
    }
    return this.memoryData.swapLogs;
  }

  getActivityLogs() {
    if (this.db) {
      return this.db.prepare('SELECT * FROM activity_logs ORDER BY id DESC LIMIT 20').all();
    }
    return this.memoryData.activityLogs.slice(0, 20);
  }

  addActivity(action, asset, user = 'SysAdmin', status = 'Success') {
    const date = new Date().toISOString().replace('T', ' ').substring(0, 16);
    if (this.db) {
      try {
        this.db.prepare('INSERT INTO activity_logs (date, user, asset, action, status) VALUES (?, ?, ?, ?, ?)')
          .run(date, user, asset, action, status);
      } catch (e) {}
      return;
    }
    this.memoryData.activityLogs.unshift({
      id: Date.now(),
      date,
      user,
      asset,
      action,
      status
    });
    this.saveFileStore();
  }

  getDashboardStats() {
    const assets = this.getAllAssets();
    const users = this.getAllUsers();
    const requirements = this.getRequirements();
    const nonIt = this.getNonItAssets();
    const repairs = this.getRepairs();

    const now = new Date();
    const warrantyExpiring = assets.filter(a => {
      if (!a.warrantyEnd) return false;
      const end = new Date(a.warrantyEnd);
      const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
      return diff <= 30 && diff >= 0;
    }).length;

    return {
      totalAssets: assets.length,
      assignedDesktop: assets.filter(a => a.type === 'Desktop' && a.status === 'Assigned').length,
      assignedLaptop: assets.filter(a => a.type === 'Laptop' && a.status === 'Assigned').length,
      nonAssigned: assets.filter(a => a.status === 'Non-Assigned').length,
      swapSystem: assets.filter(a => a.status === 'Swap').length,
      nonItAssets: nonIt.length,
      totalUsers: users.length,
      pendingRequirements: requirements.filter(r => r.status === 'Pending' || r.status === 'Purchase Required' || r.status === 'New').length,
      repairSystems: repairs.filter(r => r.status !== 'Completed' && r.status !== 'Repaired & Returned').length,
      warrantyExpiring
    };
  }

  clearAllData() {
    if (this.db) {
      try {
        this.db.exec(`
          CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT);
          DELETE FROM assets;
          DELETE FROM users;
          DELETE FROM requirements;
          DELETE FROM non_it_assets;
          DELETE FROM hardware_stock;
          DELETE FROM assigned_hardware;
          DELETE FROM network_switches;
          DELETE FROM bypass_ips;
          DELETE FROM antivirus;
          DELETE FROM repairs;
          DELETE FROM swap_logs;
          DELETE FROM activity_logs;
        `);
        this.db.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES ('isFreshCleaned', 'true')").run();
      } catch (err) {
        console.error('Error clearing SQLite tables:', err);
      }
    }
    if (this.memoryData) {
      this.memoryData.assets = [];
      this.memoryData.users = [];
      this.memoryData.requirements = [];
      this.memoryData.nonItAssets = [];
      this.memoryData.hardwareStock = [];
      this.memoryData.assignedHardware = [];
      this.memoryData.networkSwitches = [];
      this.memoryData.bypassIps = [];
      this.memoryData.antivirus = [];
      this.memoryData.repairs = [];
      this.memoryData.swapLogs = [];
      this.memoryData.activityLogs = [];
      this.saveFileStore();
    }
    return { success: true, message: 'All operational & user data cleared. System is now completely fresh.' };
  }

  restoreDemoData() {
    if (this.db) {
      try {
        this.db.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES ('isFreshCleaned', 'false')").run();
      } catch (err) {}
    }
    this.seedSqlite();
    return { success: true, message: 'Default demo data restored.' };
  }

  getEntireDatabase() {
    return {
      driver: this.driver,
      assets: this.getAllAssets(),
      users: this.getAllUsers(),
      requirements: this.getRequirements(),
      nonItAssets: this.getNonItAssets(),
      hardwareStock: this.getHardwareStock(),
      assignedHardware: this.getAssignedHardware(),
      networkSwitches: this.getNetworkSwitches(),
      bypassIps: this.getBypassIps(),
      antivirus: this.getAntivirus(),
      repairs: this.getRepairs(),
      swapLogs: this.getSwapLogs(),
      activityLogs: this.getActivityLogs()
    };
  }
}

module.exports = new DatabaseService();
