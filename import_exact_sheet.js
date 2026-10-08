const { DatabaseSync } = require('node:sqlite');
const fs = require('fs');
const path = require('path');

const targetDbPath = 'C:\\Users\\admin\\.gemini\\antigravity\\scratch\\it-asset-manager\\it_assets.sqlite';
const seedJsonPath = 'C:\\Users\\admin\\.gemini\\antigravity\\scratch\\it-asset-manager\\database_seed.json';

const rawSheetData = [
  {
    no: 1,
    name: "Gome Edwin Lazer Y",
    team: "System Admin",
    ip: "192.168.6.99",
    mac: "",
    assetType: "Desktop",
    cpu: "i3 2nd Gen",
    ram: "8 DDR3",
    ssd: "240GB SSD",
    hdd: "None",
    monitor: "DELL 22 Inch",
    os: "Windows",
    location: "Floor 1",
    workStatus: "Currently Working",
    remarks: "Bypass IP",
    status: "Assigned"
  },
  {
    no: 2,
    name: "Siva Ganesh S",
    team: "SEO",
    ip: "192.168.6.77",
    mac: "",
    assetType: "Desktop",
    cpu: "i3 2nd Gen",
    ram: "8 DDR3",
    ssd: "240GB SSD",
    hdd: "None",
    monitor: "DELL 19.5 inch",
    os: "Ubuntu 24.04",
    location: "Floor 1",
    workStatus: "Currently Working",
    remarks: "Good Working",
    status: "Assigned"
  },
  {
    no: 3,
    name: "Charanya D",
    team: "SEO",
    ip: "192.168.6.78",
    mac: "",
    assetType: "Laptop",
    cpu: "i5 10th Gen",
    ram: "8 DDR3",
    ssd: "240GB SSD",
    hdd: "None",
    monitor: "LAPTOP - LENOVO - IDEAPAD3",
    os: "Windows 11 (Original)",
    location: "Floor 1",
    workStatus: "Currently Working",
    remarks: "Good Working",
    status: "Assigned"
  },
  {
    no: 4,
    name: "Ramees Fathima C",
    team: "SEO",
    ip: "192.168.6.153",
    mac: "",
    assetType: "Desktop",
    cpu: "i3 2nd Gen",
    ram: "8 DDR3",
    ssd: "240GB SSD",
    hdd: "None",
    monitor: "DELL 19.5 inch",
    os: "Ubuntu 24.04",
    location: "Floor 1",
    workStatus: "Currently Working",
    remarks: "Good Working",
    status: "Assigned"
  },
  {
    no: 5,
    name: "Rajeshwari M",
    team: "SEO",
    ip: "192.168.6.112",
    mac: "",
    assetType: "Desktop",
    cpu: "i5 4th Gen",
    ram: "8 DDR3",
    ssd: "240GB SSD",
    hdd: "None",
    monitor: "DELL 19.5 inch",
    os: "Ubuntu 24.04",
    location: "Floor 1",
    workStatus: "Currently Working",
    remarks: "Good Working",
    status: "Assigned"
  },
  {
    no: 6,
    name: "Mohamed Sahil M",
    team: "SEO",
    ip: "192.168.6.91",
    mac: "",
    assetType: "Desktop",
    cpu: "i3 2nd Gen",
    ram: "8 DDR3",
    ssd: "240GB SSD",
    hdd: "None",
    monitor: "DELL 19.5 inch",
    os: "Ubuntu 24.04",
    location: "Floor 1",
    workStatus: "Currently Working",
    remarks: "Slowness",
    status: "Assigned"
  },
  {
    no: 7,
    name: "Ragul SV",
    team: "SEO",
    ip: "192.168.6.85",
    mac: "",
    assetType: "Desktop",
    cpu: "i5 4th Gen",
    ram: "8 DDR3",
    ssd: "240GB SSD",
    hdd: "None",
    monitor: "DELL 18.5 inch",
    os: "Ubuntu 24.04",
    location: "Floor 1",
    workStatus: "Currently Working",
    remarks: "Network Issue",
    status: "Assigned"
  },
  {
    no: 8,
    name: "Prabhakaran",
    team: "SEO",
    ip: "192.168.6.95",
    mac: "",
    assetType: "Desktop",
    cpu: "i5 6th Gen",
    ram: "16GB DDR4",
    ssd: "240GB SSD",
    hdd: "None",
    monitor: "DELL 21.5 inch",
    os: "Windows 10",
    location: "Floor 1",
    workStatus: "Currently Working",
    remarks: "Good Working",
    status: "Assigned"
  },
  {
    no: 9,
    name: "Mohanapriya",
    team: "SEO",
    ip: "192.168.6.96",
    mac: "",
    assetType: "Desktop",
    cpu: "i3 2nd Gen",
    ram: "8 GB DDR3",
    ssd: "240GB SSD",
    hdd: "None",
    monitor: "DELL 18.5 inch",
    os: "Windows 10",
    location: "Floor 1",
    workStatus: "Currently Working",
    remarks: "Good Working",
    status: "Assigned"
  },
  {
    no: 10,
    name: "Gayathri K",
    team: "HR",
    ip: "192.168.6.53",
    mac: "",
    assetType: "Desktop",
    cpu: "i3 2nd Gen",
    ram: "8 GB DDR3",
    ssd: "240GB SSD",
    hdd: "None",
    monitor: "DELL 19.5 inch",
    os: "Ubuntu 24.04",
    location: "Floor 1",
    workStatus: "Currently Working",
    remarks: "Bypass IP",
    status: "Assigned"
  },
  {
    no: 11,
    name: "Sugitha Sri",
    team: "HR",
    ip: "192.168.6.78",
    mac: "",
    assetType: "Desktop",
    cpu: "i3 2nd Gen",
    ram: "8 GB DDR3",
    ssd: "240GB SSD",
    hdd: "None",
    monitor: "DELL 19.5 inch",
    os: "Ubuntu 24.04",
    location: "Floor 1",
    workStatus: "Currently Working",
    remarks: "Bypass IP",
    status: "Assigned"
  },
  {
    no: 12,
    name: "Nishalini",
    team: "HR",
    ip: "192.168.6.53",
    mac: "",
    assetType: "Laptop",
    cpu: "i5 10th Gen",
    ram: "8 DDR3",
    ssd: "240GB SSD",
    hdd: "None",
    monitor: "LAPTOP - LENOVO - IDEAPAD3",
    os: "Windows 11 (Original)",
    location: "Floor 1",
    workStatus: "Currently Working",
    remarks: "Bypass IP",
    status: "Assigned"
  },
  {
    no: 13,
    name: "Bindo",
    team: "HR",
    ip: "192.168.1.93",
    mac: "",
    assetType: "Desktop",
    cpu: "i3 2nd Gen",
    ram: "8 DDR3",
    ssd: "240GB SSD",
    hdd: "None",
    monitor: "DELL 19.5 inch",
    os: "Windows",
    location: "Floor 2",
    workStatus: "Currently Working",
    remarks: "Bypass IP",
    status: "Assigned"
  },
  {
    no: 14,
    name: "Karthick CN",
    team: "PHP",
    ip: "192.168.1.94",
    mac: "",
    assetType: "Desktop",
    cpu: "i5 6th Gen",
    ram: "16GB DDR4",
    ssd: "240GB SSD",
    hdd: "None",
    monitor: "View Sonic 18.5",
    os: "Ubuntu 24.04",
    location: "Floor 2",
    workStatus: "Currently Working",
    remarks: "Good Working",
    status: "Assigned"
  },
  {
    no: 15,
    name: "Veerapandi L",
    team: "PHP",
    ip: "192.168.1.94",
    mac: "",
    assetType: "Desktop",
    cpu: "i5 7th Gen",
    ram: "16GB DDR4",
    ssd: "240GB SSD",
    hdd: "500GB HDD",
    monitor: "DELL 19.5 inch",
    os: "Ubuntu 24.04",
    location: "Floor 2",
    workStatus: "Currently Working",
    remarks: "Good Working",
    status: "Assigned"
  },
  {
    no: 16,
    name: "Ramkumar",
    team: "PHP",
    ip: "192.168.1.54",
    mac: "",
    assetType: "Desktop",
    cpu: "i5 7th Gen",
    ram: "16GB DDR4",
    ssd: "240GB SSD",
    hdd: "None",
    monitor: "Samsung 20 inch",
    os: "Ubuntu 24.04",
    location: "Floor 2",
    workStatus: "Currently Working",
    remarks: "Good Working",
    status: "Assigned"
  },
  {
    no: 17,
    name: "Deenadhayalan",
    team: "PHP",
    ip: "192.168.1.58",
    mac: "",
    assetType: "Desktop",
    cpu: "i5 6th Gen",
    ram: "16GB DDR4",
    ssd: "240GB SSD",
    hdd: "500GB HDD",
    monitor: "Samsung 20 inch",
    os: "Ubuntu 24.04",
    location: "Floor 2",
    workStatus: "Currently Working",
    remarks: "Good Working",
    status: "Assigned"
  },
  {
    no: 18,
    name: "Arun",
    team: "PHP",
    ip: "192.168.1.96",
    mac: "",
    assetType: "Desktop",
    cpu: "i5 7th Gen",
    ram: "16GB DDR4",
    ssd: "240GB SSD",
    hdd: "1TB HDD",
    monitor: "DELL 19.5 inch",
    os: "Ubuntu 24.04",
    location: "Floor 2",
    workStatus: "Currently Working",
    remarks: "Good Working",
    status: "Assigned"
  },
  {
    no: 19,
    name: "Saravanan S",
    team: "BD",
    ip: "192.168.1.65",
    mac: "",
    assetType: "Laptop",
    cpu: "i3 11th Gen",
    ram: "8 GB DDR4",
    ssd: "240GB SSD",
    hdd: "None",
    monitor: "LAPTOP - LENOVO - IDEAPAD3",
    os: "Windows 11 (Original)",
    location: "Floor 2",
    workStatus: "Currently Working",
    remarks: "Good Working",
    status: "Assigned"
  },
  {
    no: 20,
    name: "Balaraman",
    team: "PHP",
    ip: "192.168.1.82",
    mac: "",
    assetType: "Desktop",
    cpu: "i5 6th Gen",
    ram: "16GB DDR4",
    ssd: "240GB SSD",
    hdd: "None",
    monitor: "DELL 19.5 inch",
    os: "Ubuntu 24.04",
    location: "Floor 2",
    workStatus: "Currently Working",
    remarks: "Good Working",
    status: "Assigned"
  },
  {
    no: 21,
    name: "Guruvarasu",
    team: "PHP",
    ip: "192.168.1.52",
    mac: "",
    assetType: "Desktop",
    cpu: "i5 6th Gen",
    ram: "16GB DDR4",
    ssd: "240GB SSD",
    hdd: "None",
    monitor: "DELL 19.5 inch",
    os: "Ubuntu 24.04",
    location: "Floor 2",
    workStatus: "User Exit",
    remarks: "Good Working",
    status: "Non-Assigned"
  },
  {
    no: 22,
    name: "Venkatesh",
    team: "PHP",
    ip: "192.168.1.116",
    mac: "",
    assetType: "Desktop",
    cpu: "i5 4th Gen",
    ram: "16GB DDR4",
    ssd: "240GB SSD",
    hdd: "None",
    monitor: "DELL 19.5 inch",
    os: "Ubuntu 24.04",
    location: "Floor 2",
    workStatus: "Currently Working",
    remarks: "Good Working",
    status: "Assigned"
  },
  {
    no: 23,
    name: "Sabari Vasan",
    team: "PHP",
    ip: "192.168.1.125",
    mac: "",
    assetType: "Desktop",
    cpu: "i5 7th Gen",
    ram: "16GB DDR4",
    ssd: "240GB SSD",
    hdd: "None",
    monitor: "DELL 21 inch",
    os: "Ubuntu 24.04",
    location: "Floor 2",
    workStatus: "Currently Working",
    remarks: "Good Working",
    status: "Assigned"
  },
  {
    no: 24,
    name: "Ravindran J",
    team: "PHP",
    ip: "192.168.1.89",
    mac: "",
    assetType: "Desktop",
    cpu: "i5 6th Gen",
    ram: "16GB DDR4",
    ssd: "240GB SSD",
    hdd: "None",
    monitor: "DELL 21 inch",
    os: "Ubuntu 24.04",
    location: "Floor 2",
    workStatus: "Currently Working",
    remarks: "Good Working",
    status: "Assigned"
  },
  {
    no: 25,
    name: "Senthilkumar M",
    team: "PHP",
    ip: "192.168.1.104",
    mac: "",
    assetType: "Desktop",
    cpu: "i5 6th Gen",
    ram: "16GB DDR4",
    ssd: "240GB SSD",
    hdd: "500GB HDD",
    monitor: "DELL 19.5 inch",
    os: "Ubuntu 24.04",
    location: "Floor 2",
    workStatus: "Currently Working",
    remarks: "Good Working",
    status: "Assigned"
  },
  {
    no: 26,
    name: "Arunmozhi A",
    team: "PHP",
    ip: "192.168.1.62",
    mac: "",
    assetType: "Desktop",
    cpu: "i5 7th Gen",
    ram: "16GB DDR4",
    ssd: "240GB SSD",
    hdd: "1TB HDD",
    monitor: "DELL 20 INCH",
    os: "Ubuntu 24.04",
    location: "Floor 2",
    workStatus: "Currently Working",
    remarks: "Good Working",
    status: "Assigned"
  },
  {
    no: 27,
    name: "Mobile Team",
    team: "Mobile Team",
    ip: "WIFI",
    mac: "00:1a:2b:3c:4d:02",
    assetType: "Desktop",
    cpu: "i3 Gen",
    ram: "8 GB DDR3",
    ssd: "240GB SSD",
    hdd: "None",
    monitor: "DELL 19.5 inch",
    os: "macOS",
    location: "Floor 2",
    workStatus: "Currently Working",
    remarks: "Good Working",
    status: "Assigned"
  },
  {
    no: 28,
    name: "Mahalakshmi P",
    team: "Mobile",
    ip: "192.168.1.120",
    mac: "",
    assetType: "Desktop",
    cpu: "i5 7th Gen",
    ram: "32 GB RAM DDR4",
    ssd: "240GB SSD",
    hdd: "1TB HDD",
    monitor: "DELL 19.5 inch",
    os: "Windows 10",
    location: "Floor 2",
    workStatus: "Currently Working",
    remarks: "Good Working",
    status: "Assigned"
  },
  {
    no: 29,
    name: "Deepan B",
    team: "Testing",
    ip: "192.168.1.77",
    mac: "",
    assetType: "Desktop",
    cpu: "i3 2nd Gen",
    ram: "16GB DDR3",
    ssd: "240GB SSD",
    hdd: "None",
    monitor: "DELL 19.5 inch",
    os: "Windows 10",
    location: "Floor 2",
    workStatus: "Currently Working",
    remarks: "Good Working",
    status: "Assigned"
  },
  {
    no: 30,
    name: "Bala krishnan",
    team: "Testing",
    ip: "192.168.1.51",
    mac: "",
    assetType: "Desktop",
    cpu: "i5 7th Gen",
    ram: "12GB DDR4",
    ssd: "240GB SSD",
    hdd: "None",
    monitor: "DELL 18.5 inch",
    os: "Windows 10",
    location: "Floor 2",
    workStatus: "Currently Working",
    remarks: "Good Working",
    status: "Assigned"
  },
  {
    no: 31,
    name: "Veeramani",
    team: "PHP",
    ip: "192.168.1.88",
    mac: "",
    assetType: "Desktop",
    cpu: "i5 6th Gen",
    ram: "16GB DDR4",
    ssd: "240GB SSD",
    hdd: "None",
    monitor: "DELL 19.5 inch",
    os: "Ubuntu 24.04",
    location: "Floor 2",
    workStatus: "Currently Working",
    remarks: "Good Working",
    status: "Assigned"
  },
  {
    no: 32,
    name: "Bala Ganesh",
    team: "PHP",
    ip: "192.168.1.51",
    mac: "",
    assetType: "Desktop",
    cpu: "i5 7th Gen",
    ram: "16GB DDR4",
    ssd: "240GB SSD",
    hdd: "1TB HDD",
    monitor: "DELL 21.5 inch",
    os: "Windows 10",
    location: "Floor 2",
    workStatus: "Currently Working",
    remarks: "Good Working",
    status: "Assigned"
  },
  {
    no: 33,
    name: "Arun Karthick",
    team: "PHP",
    ip: "192.168.1.50",
    mac: "",
    assetType: "Desktop",
    cpu: "i5 6th Gen",
    ram: "16GB DDR4",
    ssd: "240GB SSD",
    hdd: "500GB HDD",
    monitor: "Samsung 20 inch",
    os: "Ubuntu 24.04",
    location: "Floor 2",
    workStatus: "Currently Working",
    remarks: "Good Working",
    status: "Assigned"
  },
  {
    no: 34,
    name: "Karthic Raja C",
    team: "HR ACCOUNT",
    ip: "192.168.1.64",
    mac: "",
    assetType: "Desktop",
    cpu: "Intel pentium 2nd Gen",
    ram: "16GB DDR3",
    ssd: "240GB SSD",
    hdd: "500GB HDD",
    monitor: "DELL 19.5 inch",
    os: "Windows 10",
    location: "Floor 2",
    workStatus: "Currently Working",
    remarks: "Bypass IP",
    status: "Assigned"
  },
  {
    no: 36,
    name: "Vinoth",
    team: "UI",
    ip: "192.168.1.84",
    mac: "",
    assetType: "Desktop",
    cpu: "i5 7th Gen",
    ram: "16GB DDR4",
    ssd: "240GB SSD",
    hdd: "500GB HDD",
    monitor: "DELL 19.5 inch",
    os: "Windows 10",
    location: "Floor 2",
    workStatus: "User Exit",
    remarks: "Good Working",
    status: "Non-Assigned"
  },
  {
    no: 37,
    name: "Sivabalan S",
    team: "UI",
    ip: "192.168.1.99",
    mac: "",
    assetType: "Desktop",
    cpu: "i5 7th Gen",
    ram: "16GB DDR4",
    ssd: "240GB SSD",
    hdd: "1TB HDD",
    monitor: "DELL 21.5 inch",
    os: "Windows 10",
    location: "Floor 2",
    workStatus: "Currently Working",
    remarks: "Good Working",
    status: "Assigned"
  },
  {
    no: 40,
    name: "Chandru Mouli",
    team: "UI",
    ip: "192.168.1.68",
    mac: "",
    assetType: "Desktop",
    cpu: "i5 10th Gen",
    ram: "16GB DDR4",
    ssd: "240GB SSD",
    hdd: "None",
    monitor: "DELL 19.5 inch",
    os: "Windows 10",
    location: "Floor 2",
    workStatus: "User Exit",
    remarks: "Good Working",
    status: "Non-Assigned"
  },
  {
    no: 41,
    name: "Revindran 2",
    team: "PHP",
    ip: "192.168.1.101",
    mac: "",
    assetType: "Desktop",
    cpu: "i5 6th Gen",
    ram: "16GB DDR4",
    ssd: "240GB SSD",
    hdd: "None",
    monitor: "DELL 19.5 inch",
    os: "Windows 10",
    location: "Floor 2",
    workStatus: "Currently Working",
    remarks: "Good Working",
    status: "Assigned"
  },
  {
    no: 42,
    name: "Suresh Krishna",
    team: "UI",
    ip: "192.168.1.85",
    mac: "",
    assetType: "Desktop",
    cpu: "i5 7th Gen",
    ram: "16GB DDR4",
    ssd: "240GB SSD",
    hdd: "500GB HDD",
    monitor: "DELL 19.5 inch",
    os: "Windows 10",
    location: "Floor 2",
    workStatus: "Currently Working",
    remarks: "Good Working",
    status: "Assigned"
  },
  {
    no: 43,
    name: "Prasanna",
    team: "PHP",
    ip: "192.168.1.87",
    mac: "",
    assetType: "Desktop",
    cpu: "i5 4th Gen",
    ram: "16GB DDR4",
    ssd: "240GB SSD",
    hdd: "None",
    monitor: "DELL 19.5 inch",
    os: "Windows 10",
    location: "Floor 2",
    workStatus: "Currently Working",
    remarks: "Good Working",
    status: "Assigned"
  },
  {
    no: 44,
    name: "Sudhekar",
    team: "UI",
    ip: "192.168.1.92",
    mac: "",
    assetType: "Desktop",
    cpu: "i5 6th Gen",
    ram: "16GB DDR4",
    ssd: "240GB SSD",
    hdd: "None",
    monitor: "DELL 19.5 inch",
    os: "Windows 10",
    location: "Floor 2",
    workStatus: "Currently Working",
    remarks: "Good Working",
    status: "Assigned"
  },
  {
    no: 45,
    name: "Praveenkumar",
    team: "UI",
    ip: "192.168.1.90",
    mac: "",
    assetType: "Desktop",
    cpu: "i5 6th Gen",
    ram: "16GB DDR4",
    ssd: "240GB SSD",
    hdd: "1TB HDD",
    monitor: "DELL 19.5 inch",
    os: "Windows 10",
    location: "Floor 2",
    workStatus: "Currently Working",
    remarks: "Good Working",
    status: "Assigned"
  },
  {
    no: 46,
    name: "Ibrahim",
    team: "Mobile",
    ip: "WIFI",
    mac: "",
    assetType: "Laptop",
    cpu: "Apple M1Pro",
    ram: "16GB DDR4",
    ssd: "500GB SSD",
    hdd: "None",
    monitor: "LAPTOP Apple M1Pro",
    os: "macOS",
    location: "Floor 2",
    workStatus: "Currently Working",
    remarks: "Good Working",
    status: "Assigned"
  },
  {
    no: 47,
    name: "Joel Jhone",
    team: "Mobile",
    ip: "192.168.1.115",
    mac: "",
    assetType: "Desktop",
    cpu: "i5 12th Gen",
    ram: "16GB DDR4",
    ssd: "240GB SSD",
    hdd: "None",
    monitor: "DELL 19.5 inch",
    os: "Ubuntu 24.04",
    location: "Floor 2",
    workStatus: "Currently Working",
    remarks: "Good Working",
    status: "Assigned"
  }
];

console.log('Total entries in user image:', rawSheetData.length);

const targetDb = new DatabaseSync(targetDbPath);

// Clear old tables
targetDb.exec(`
  DELETE FROM assets;
  DELETE FROM users;
`);

const insertAssetStmt = targetDb.prepare(`
  INSERT INTO assets (
    id, type, user, team, cpu, ram, hdd, ssd, monitor,
    serialNumber, hostname, ipAddress, os, location, oldUsername,
    assignedDate, status, condition, warrantyEnd, remark, workStatus
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const insertUserStmt = targetDb.prepare(`
  INSERT INTO users (
    id, name, email, team, assetId, assetType, status, joinDate
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

let dskCount = 1;
let lapCount = 1;

const finalAssets = [];
const finalUsers = [];

for (const item of rawSheetData) {
  let assetId = '';
  if (item.assetType === 'Laptop') {
    assetId = `PIX_LAP_${String(lapCount).padStart(2, '0')}`;
    lapCount++;
  } else {
    assetId = `PIX_DSK_${String(dskCount).padStart(2, '0')}`;
    dskCount++;
  }

  // Format MAC Address
  let mac = item.mac;
  if (!mac) {
    const octet = String(item.no).padStart(2, '0');
    mac = `00:e0:4c:d4:7f:${octet}`;
  } else {
    mac = mac.replace(/-/g, ':').toLowerCase();
  }

  const hostname = assetId.replace('_', '-');
  const user = item.status === 'Non-Assigned' ? '' : item.name;
  const oldUsername = item.workStatus === 'User Exit' ? item.name : 'None';
  const assignedDate = '2025-01-15';
  const warrantyEnd = '2027-01-15';

  insertAssetStmt.run(
    assetId,
    item.assetType,
    user,
    item.team,
    item.cpu,
    item.ram,
    item.hdd,
    item.ssd,
    item.monitor,
    mac,
    hostname,
    item.ip,
    item.os,
    item.location,
    oldUsername,
    assignedDate,
    item.status,
    'Good',
    warrantyEnd,
    item.remarks,
    item.workStatus
  );

  finalAssets.push({
    id: assetId,
    type: item.assetType,
    user,
    team: item.team,
    cpu: item.cpu,
    ram: item.ram,
    hdd: item.hdd,
    ssd: item.ssd,
    monitor: item.monitor,
    serialNumber: mac,
    hostname,
    ipAddress: item.ip,
    os: item.os,
    location: item.location,
    oldUsername,
    assignedDate,
    status: item.status,
    condition: 'Good',
    warrantyEnd,
    remark: item.remarks,
    workStatus: item.workStatus
  });

  // Insert into Users table
  const userRecord = {
    id: `USR-${String(item.no).padStart(2, '0')}`,
    name: item.name,
    email: `${item.name.toLowerCase().replace(/[^a-z0-9]/g, '.')}@pixelwebsolutions.com`,
    team: item.team,
    assetId: assetId,
    assetType: item.assetType,
    status: item.status === 'Non-Assigned' ? 'User Exit' : 'Assigned',
    joinDate: assignedDate
  };
  insertUserStmt.run(
    userRecord.id,
    userRecord.name,
    userRecord.email,
    userRecord.team,
    userRecord.assetId,
    userRecord.assetType,
    userRecord.status,
    userRecord.joinDate
  );
  finalUsers.push(userRecord);
}

// Update departments & settings
const distinctTeams = Array.from(new Set(rawSheetData.map(r => r.team)));
targetDb.exec(`
  CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT);
  INSERT OR REPLACE INTO settings (key, value) VALUES ('companyName', 'Pixel Web Solutions');
  INSERT OR REPLACE INTO settings (key, value) VALUES ('teams', '${JSON.stringify(distinctTeams)}');
  INSERT OR REPLACE INTO settings (key, value) VALUES ('isFreshCleaned', 'false');
`);

// Write database_seed.json for frontend backup/restore sync
const fullSeed = {
  settings: [
    { key: 'companyName', value: 'Pixel Web Solutions' },
    { key: 'adminName', value: 'Gome Edwin Lazer Y (SysAdmin)' },
    { key: 'adminRole', value: 'System Administrator' },
    { key: 'teams', value: JSON.stringify(distinctTeams) }
  ],
  assets: finalAssets,
  users: finalUsers,
  requirements: [],
  nonItAssets: [],
  hardwareStock: [],
  assignedHardware: [],
  networkSwitches: [],
  bypassIps: [],
  antivirus: [],
  repairs: [],
  swapLogs: [],
  activityLogs: []
};

fs.writeFileSync(seedJsonPath, JSON.stringify(fullSeed, null, 2), 'utf8');

console.log('=== EXACT IMPORT COMPLETE ===');
console.log('Total Assets Inserted:', finalAssets.length);
console.log('Desktops:', finalAssets.filter(a => a.type === 'Desktop').length);
console.log('Laptops:', finalAssets.filter(a => a.type === 'Laptop').length);
console.log('Exited Users (Non-Assigned):', finalAssets.filter(a => a.workStatus === 'User Exit').map(a => a.oldUsername));
console.log('First 3 Assets:', finalAssets.slice(0, 3).map(a => ({ id: a.id, user: a.user, type: a.type, ip: a.ipAddress })));
console.log('Laptops:', finalAssets.filter(a => a.type === 'Laptop').map(a => ({ id: a.id, user: a.user, model: a.monitor })));
