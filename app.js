/**
 * ==========================================================================
 * ENTERPRISE IT ASSET MANAGEMENT SYSTEM - CORE APPLICATION ENGINE
 * Complete client-side database, state manager, interactive views,
 * CRUD operations, search/filtering, CSV export, and toast notifications.
 * ==========================================================================
 */


(function () {
  'use strict';

  // Storage Keys
  const DB_KEY = 'APEX_IT_ASSET_MANAGER_V5_TL_DOA';

  // Initial Seed Dataset (Realistic Demo Data)
  const emptyFreshDatabase = {
    settings: {
      companyName: 'Apex Global Technologies Ltd.',
      adminName: 'Sundar Pichai (SysAdmin)',
      adminRole: 'Senior IT Administrator',
      teams: ['SYSTEM ADMIN', 'PHP', 'MOBIL TEAM', 'AI', 'ADMIN', 'ACCOUNT', 'HR'],
      assetTypes: ['Desktop', 'Laptop'],
      hardwareCategories: ['Keyboard', 'Mouse', 'Monitor', 'Headset', 'HDMI Cable', 'Adapter', 'Docking Station', 'RAM', 'SSD', 'HDD', 'Charger', 'Other']
    },
    assets: [],
    users: [],
    requirements: [],
    nonItAssets: [],
    hardwareStock: [],
    assignedHardware: [],
    networkSwitches: [],
    bypassIps: [],
    antivirus: [],
    repairs: [],
    swapLogs: [],
    activityLogs: [],
    assignmentHistory: []
  };


  const defaultAssignmentHistory = [
    {
      id: 'HIST_101',
      assetId: 'PIX_DSK_18',
      assetType: 'Desktop',
      previousUser: 'Guruvarasu',
      newUser: 'Stock (Unassigned)',
      employeeId: 'EMP1008',
      team: 'PHP',
      assignedDate: '2025-01-15',
      returnedDate: '2026-10-07',
      workStatus: 'User Exit',
      remarks: 'Employee exited; system returned to IT inventory pool',
      timestamp: '2026-10-07T09:00:00Z'
    },
    {
      id: 'HIST_102',
      assetId: 'PIX_DSK_32',
      assetType: 'Desktop',
      previousUser: 'Vinoth',
      newUser: 'Stock (Unassigned)',
      employeeId: 'EMP1012',
      team: 'UI',
      assignedDate: '2025-01-15',
      returnedDate: '2026-10-07',
      workStatus: 'User Exit',
      remarks: 'Reallocated to stock pool',
      timestamp: '2026-10-07T09:15:00Z'
    },
    {
      id: 'HIST_103',
      assetId: 'PIX_DSK_34',
      assetType: 'Desktop',
      previousUser: 'Chandru Mouli',
      newUser: 'Stock (Unassigned)',
      employeeId: 'EMP1015',
      team: 'UI',
      assignedDate: '2025-01-15',
      returnedDate: '2026-10-07',
      workStatus: 'User Exit',
      remarks: 'Reallocated to stock pool',
      timestamp: '2026-10-07T09:30:00Z'
    }
  ];

  const defaultDatabase = {
    settings: {
      companyName: 'Apex Global Technologies Ltd.',
      adminName: 'Sundar Pichai (SysAdmin)',
      adminRole: 'Senior IT Administrator',
      teams: ['SYSTEM ADMIN', 'PHP', 'MOBIL TEAM', 'AI', 'ADMIN', 'ACCOUNT', 'HR'],
      assetTypes: ['Desktop', 'Laptop'],
      hardwareCategories: ['Keyboard', 'Mouse', 'Monitor', 'Headset', 'HDMI Cable', 'Adapter', 'Docking Station', 'RAM', 'SSD', 'HDD', 'Charger', 'Other']
    },
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
      },
      {
        id: 'REQ-104',
        name: 'Rohit Balan',
        team: 'AI',
        tl: 'Priya Sharma',
        issue: 'Dual 4K Monitor requirement for color grading & UI review',
        requirement: 'Dell UltraSharp U2723QE 27" 4K USB-C Monitor',
        priority: 'Low',
        requestDate: '2026-09-20',
        requiredDate: '2026-10-15',
        status: 'Completed',
        remark: 'Issued from hardware stock on Oct 1'
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
      },
      {
        id: 'NIT-004',
        name: 'Online Rackmount UPS 10kVA',
        category: 'UPS',
        brand: 'APC by Schneider Electric',
        model: 'Smart-UPS RT 10000VA',
        serialNumber: 'APC-UPS-7710',
        quantity: 2,
        location: 'Server Room Main Rack',
        assignedTo: 'IT Infrastructure',
        purchaseDate: '2023-01-20',
        purchaseCost: '$6,500',
        warranty: '5 Years (Active)',
        condition: 'Good',
        status: 'Assigned',
        remark: 'Battery health audited bi-annually'
      },
      {
        id: 'NIT-005',
        name: 'Enterprise Multi-Function Laser Printer',
        category: 'Printer',
        brand: 'HP',
        model: 'LaserJet Enterprise MFP M528dn',
        serialNumber: 'HP-MFP-1289',
        quantity: 3,
        location: 'Floor 1, 2, and 3 Printing Kiosks',
        assignedTo: 'General Office',
        purchaseDate: '2023-07-14',
        purchaseCost: '$2,400',
        warranty: '3 Years (Active)',
        condition: 'Good',
        status: 'Assigned',
        remark: 'Network print server integrated'
      }
    ],
    hardwareStock: [
      { id: 'HWS-01', name: 'Dell Pro Wireless Keyboard & Mouse KM5221W', category: 'Keyboard', brand: 'Dell', model: 'KM5221W', quantity: 45, available: 12, minStock: 10, status: 'In Stock' },
      { id: 'HWS-02', name: 'Logitech MX Master 3S Ergonomic Mouse', category: 'Mouse', brand: 'Logitech', model: 'MX Master 3S', quantity: 20, available: 4, minStock: 5, status: 'Low Stock' },
      { id: 'HWS-03', name: 'Dell P2422H 24" FHD IPS Monitor', category: 'Monitor', brand: 'Dell', model: 'P2422H', quantity: 30, available: 6, minStock: 5, status: 'In Stock' },
      { id: 'HWS-04', name: 'Jabra Evolve2 40 USB-C Wired Headset', category: 'Headset', brand: 'Jabra', model: 'Evolve2 40', quantity: 35, available: 3, minStock: 8, status: 'Low Stock' },
      { id: 'HWS-05', name: 'High-Speed 4K HDMI Cable 2.0 (2M)', category: 'HDMI Cable', brand: 'Belkin', model: 'UltraHD 2.0', quantity: 60, available: 28, minStock: 15, status: 'In Stock' },
      { id: 'HWS-06', name: 'Universal USB-C Dual 4K Docking Station', category: 'Docking Station', brand: 'Targus', model: 'DOCK182USZ', quantity: 18, available: 5, minStock: 4, status: 'In Stock' },
      { id: 'HWS-07', name: 'Kingston Fury 16GB DDR5 4800MHz Desktop RAM', category: 'RAM', brand: 'Kingston', model: 'KF548C38BB', quantity: 24, available: 2, minStock: 6, status: 'Low Stock' },
      { id: 'HWS-08', name: 'Samsung 980 Pro 1TB NVMe M.2 SSD', category: 'SSD', brand: 'Samsung', model: 'MZ-V8P1T0B', quantity: 20, available: 8, minStock: 5, status: 'In Stock' },
      { id: 'HWS-09', name: '65W USB-C Laptop Fast Charger Adapter', category: 'Charger', brand: 'Lenovo', model: '4X20M26268', quantity: 25, available: 11, minStock: 8, status: 'In Stock' }
    ],
    assignedHardware: [
      { id: 'AHW-01', user: 'Vikram Seth', team: 'Engineering', hardware: 'Dell KM5221W Combo', brand: 'Dell', model: 'KM5221W', serialNumber: 'DL-KM-9921', assignedDate: '2025-01-15', status: 'Active' },
      { id: 'AHW-02', user: 'Priya Sharma', team: 'Product Design', hardware: 'Logitech MX Master 3S', brand: 'Logitech', model: 'MX Master 3S', serialNumber: 'LG-MX-4412', assignedDate: '2025-02-10', status: 'Active' },
      { id: 'AHW-03', user: 'Meera Nambiar', team: 'DevOps & Cloud', hardware: 'Jabra Evolve2 40 Headset', brand: 'Jabra', model: 'Evolve2 40', serialNumber: 'JB-EV-8812', assignedDate: '2025-03-01', status: 'Active' }
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
      },
      {
        id: 'NET-MD-03',
        name: 'Primary Fiber Gateway / Router',
        type: 'Enterprise Gateway Modem',
        brand: 'Fortinet',
        model: 'FortiGate 100F',
        ipAddress: '192.168.1.1',
        macAddress: '90:6C:AC:44:90:EE',
        location: 'Server Room Rack 1',
        portCount: 16,
        usedPorts: 12,
        availablePorts: 4,
        status: 'Online',
        remark: 'Primary 1Gbps dedicated leased line'
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
      },
      {
        id: 'BYP-02',
        ipAddress: '192.168.10.225',
        user: 'Priya Sharma',
        system: 'DSG-MAC-02 (MacBook Pro)',
        macAddress: 'F0:18:98:33:B1:09',
        purpose: 'Adobe Creative Cloud high-res cloud asset streaming & Figma real-time websocket bypass',
        approvedBy: 'Sundar Pichai (SysAdmin)',
        startDate: '2026-02-15',
        expiryDate: '2026-08-15',
        status: 'Active',
        remark: 'Port 443 direct tunnel'
      }
    ],
    antivirus: [
      { id: 'AV-01', user: 'Vikram Seth', assetId: 'AST-DSK-1001', antivirus: 'CrowdStrike Falcon Sensor', version: 'v7.12.1810', installDate: '2025-01-15', expiryDate: '2027-01-15', status: 'Active' },
      { id: 'AV-02', user: 'Priya Sharma', assetId: 'AST-LPT-2002', antivirus: 'SentinelOne Complete Endpoint', version: 'v23.2.4', installDate: '2025-02-10', expiryDate: '2026-11-20', status: 'Active' },
      { id: 'AV-03', user: 'Karthik Raja', assetId: 'AST-DSK-1003', antivirus: 'Microsoft Defender for Endpoint', version: 'v4.18.2311', installDate: '2024-11-04', expiryDate: '2026-11-04', status: 'Active' },
      { id: 'AV-04', user: 'Sanjay Dutt', assetId: 'AST-DSK-1009', antivirus: 'Microsoft Defender for Endpoint', version: 'v4.18.2311', installDate: '2024-02-14', expiryDate: '2026-10-20', status: 'Expiring Soon' }
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
      },
      {
        id: 'REP-002',
        assetId: 'AST-DSK-1007',
        user: 'Arvind Swamy',
        issue: 'System BSOD 0x0000007E intermittently during boot',
        date: '2026-10-01',
        vendor: 'In-House Hardware Lab',
        cost: '$0.00',
        expectedReturn: '2026-10-04',
        actualReturn: '',
        status: 'In Progress',
        remark: 'Diagnostic memory test running, motherboard capacitors checked'
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
      { date: '2026-10-04 17:30', user: 'Sundar Pichai (SysAdmin)', asset: 'AST-LPT-2006', action: 'System Returned & Reformatted', status: 'Success' },
      { date: '2026-10-03 14:15', user: 'Arvind Swamy', asset: 'AST-DSK-1007', action: 'System Swap Ticket Raised', status: 'Pending' },
      { date: '2026-10-02 11:20', user: 'Naveen Kumar', asset: 'REQ-101', action: 'New Asset Requirement Filed', status: 'Under Review' },
      { date: '2026-09-30 09:45', user: 'Meera Nambiar', asset: 'AST-LPT-2004', action: 'Laptop Deployed & Enrolled', status: 'Success' },
      { date: '2026-09-27 16:10', user: 'Divya Krishnan', asset: 'AST-LPT-2008', action: 'Dispatched for Display Repair', status: 'In Repair' }
    ]
  };

  // State Management Store (with Dual-Mode SQLite & LocalStorage sync)
  class AssetStore {
    constructor() {
      this.isServerConnected = false;
      this.dbDriver = 'localStorage';
      this.data = this.load();
      if (!this.data.assignmentHistory || !Array.isArray(this.data.assignmentHistory)) {
        this.data.assignmentHistory = JSON.parse(JSON.stringify(defaultAssignmentHistory));
      }
      this.initApiSync();
    }

    async initApiSync() {
      if (window.location.protocol.startsWith('http')) {
        try {
          const statusRes = await fetch('/api/status');
          if (statusRes.ok) {
            const statusData = await statusRes.json();
            this.isServerConnected = true;
            this.dbDriver = statusData.driver || 'SQLite';

            // Update UI status pill in sidebar footer
            const statusEl = document.querySelector('.system-status .status-label');
            if (statusEl) {
              statusEl.textContent = `Node.js + SQLite (${this.dbDriver})`;
              statusEl.style.color = '#38bdf8';
            }

            // Sync latest SQLite data
            const dumpRes = await fetch('/api/database/dump');
            if (dumpRes.ok) {
              const remoteData = await dumpRes.json();
              if (remoteData.assets !== undefined) {
                this.data.assets = (remoteData.assets || []).sort((a, b) => (a.id || '').localeCompare(b.id || '', undefined, { numeric: true, sensitivity: 'base' }));
                this.data.users = remoteData.users;
                this.data.requirements = remoteData.requirements;
                this.data.nonItAssets = remoteData.nonItAssets;
                this.data.hardwareStock = remoteData.hardwareStock;
                this.data.assignedHardware = remoteData.assignedHardware;
                this.data.networkSwitches = remoteData.networkSwitches;
                this.data.bypassIps = remoteData.bypassIps;
                this.data.antivirus = remoteData.antivirus;
                this.data.repairs = remoteData.repairs;
                this.data.swapLogs = remoteData.swapLogs;
                this.data.activityLogs = remoteData.activityLogs;
                this.save(this.data);
                if (window.ITAppControllerInstance) {
                  window.ITAppControllerInstance.updateDashboardMetrics();
                  window.ITAppControllerInstance.renderCurrentView();
                }
              }
            }
          }
        } catch (e) {
          console.log('Running in client-side storage mode. (Start server via "node server.js" for SQLite).');
        }
      }
    }

    load() {
      const targetTeams = ['SYSTEM ADMIN', 'PHP', 'MOBIL TEAM', 'AI', 'ADMIN', 'ACCOUNT', 'HR'];
      try {
        const stored = localStorage.getItem(DB_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (!parsed.settings || !parsed.settings.teams || parsed.settings.teams.includes('Engineering')) {
            if (!parsed.settings) parsed.settings = {};
            parsed.settings.teams = targetTeams;
            if (parsed.assets) {
              parsed.assets.forEach(a => {
                if (a.team === 'Engineering') a.team = 'SYSTEM ADMIN';
                else if (a.team === 'Product Design') a.team = 'AI';
                else if (a.team === 'QA Automation') a.team = 'PHP';
                else if (a.team === 'DevOps & Cloud') a.team = 'SYSTEM ADMIN';
                else if (a.team === 'Finance') a.team = 'ACCOUNT';
                else if (a.team === 'Sales Ops') a.team = 'MOBIL TEAM';
                else if (a.team === 'Marketing') a.team = 'ADMIN';
                else if (a.team === 'Human Resources') a.team = 'HR';
              });
            }
            if (parsed.users) {
              parsed.users.forEach(u => {
                if (u.team === 'Engineering') u.team = 'SYSTEM ADMIN';
                else if (u.team === 'Product Design') u.team = 'AI';
                else if (u.team === 'QA Automation') u.team = 'PHP';
                else if (u.team === 'DevOps & Cloud') u.team = 'SYSTEM ADMIN';
                else if (u.team === 'Finance') u.team = 'ACCOUNT';
                else if (u.team === 'Sales Ops') u.team = 'MOBIL TEAM';
                else if (u.team === 'Marketing') u.team = 'ADMIN';
                else if (u.team === 'Human Resources') u.team = 'HR';
              });
            }
            if (parsed.requirements) {
              parsed.requirements.forEach(r => {
                if (r.team === 'Engineering') r.team = 'SYSTEM ADMIN';
                else if (r.team === 'Product Design') r.team = 'AI';
                else if (r.team === 'QA Automation') r.team = 'PHP';
                else if (r.team === 'DevOps & Cloud') r.team = 'SYSTEM ADMIN';
                else if (r.team === 'Finance') r.team = 'ACCOUNT';
                else if (r.team === 'Sales Ops') r.team = 'MOBIL TEAM';
                else if (r.team === 'Marketing') r.team = 'ADMIN';
                else if (r.team === 'Human Resources') r.team = 'HR';
              });
            }
            this.save(parsed);
          }
          return parsed;
        }
      } catch (e) {
        console.error('Failed to parse database from localStorage', e);
      }
      this.save(emptyFreshDatabase);
      return JSON.parse(JSON.stringify(emptyFreshDatabase));
    }

    save(data = this.data) {
      this.data = data;
      try {
        localStorage.setItem(DB_KEY, JSON.stringify(data));
      } catch (e) {
        console.error('Failed to persist database to localStorage', e);
      }
    }

    clearAllFresh() {
      localStorage.removeItem(DB_KEY);
      this.data = {
        settings: {
          companyName: 'Apex Global Technologies Ltd.',
          adminName: 'Sundar Pichai (SysAdmin)',
          adminRole: 'Senior IT Administrator',
          teams: ['SYSTEM ADMIN', 'PHP', 'MOBIL TEAM', 'AI', 'ADMIN', 'ACCOUNT', 'HR']
        },
        assets: [],
        users: [],
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
      this.save(this.data);
    }

    reset() {
      localStorage.removeItem(DB_KEY);
      this.data = JSON.parse(JSON.stringify(defaultDatabase));
      this.save();
    }

    addActivity(action, asset, user = 'Sundar Pichai (SysAdmin)', status = 'Success') {
      const now = new Date();
      const dateStr = now.toISOString().replace('T', ' ').substring(0, 16);
      this.data.activityLogs.unshift({
        date: dateStr,
        user,
        asset,
        action,
        status
      });
      if (this.data.activityLogs.length > 30) {
        this.data.activityLogs.pop();
      }
      this.save();

      // Async push to Node.js backend if active
      if (this.isServerConnected) {
        fetch('/api/activity-logs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action, asset, user, status, date: dateStr })
        }).catch(() => { });
      }
    }
  }

  const store = new AssetStore();

  // Helper Utility Functions
  const Utils = {
    formatDate(dateStr) {
      if (!dateStr) return '—';
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    },

    getDaysRemaining(endDateStr) {
      if (!endDateStr) return null;
      const end = new Date(endDateStr);
      const now = new Date();
      const diffTime = end - now;
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    },

    escapeHtml(str) {
      if (!str) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    },

    exportToCSV(filename, rows) {
      const processRow = (row) =>
        row
          .map((val) => {
            let inner = val === null || val === undefined ? '' : String(val);
            let result = inner.replace(/"/g, '""');
            if (result.search(/("|,|\n)/g) >= 0) result = `"${result}"`;
            return result;
          })
          .join(',');

      const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(processRow).join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `${filename}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },

    showToast(title, message, type = 'success') {
      const stack = document.getElementById('toastStack');
      if (!stack) return;

      const toast = document.createElement('div');
      toast.className = `toast toast-${type}`;

      const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : '⚠️';
      toast.innerHTML = `
        <span class="toast-icon">${icon}</span>
        <div class="toast-content">
          <div class="toast-title">${Utils.escapeHtml(title)}</div>
          <div class="toast-msg">${Utils.escapeHtml(message)}</div>
        </div>
      `;

      stack.appendChild(toast);
      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => toast.remove(), 250);
      }, 4000);
    }
  };

  /* ==========================================================================
     AUTHENTICATION & ROLE-BASED ACCESS CONTROL (RBAC) SERVICE
     ========================================================================== */
  const AuthService = {
    AUTH_TOKEN_KEY: 'it_asset_auth_active',
    USER_INFO_KEY: 'it_asset_auth_user',

    // Predefined accounts with passwords and permission matrix
    ACCOUNTS: {
      admin: {
        username: 'admin',
        password: ['admin', 'admin123'],
        displayName: 'Sundar Pichai',
        role: 'Admin',
        avatar: 'SP',
        permissions: {
          manageUsers: true,
          editAssets: true,
          deleteAssets: true,
          assignSystems: true,
          systemSwap: true,
          repairs: true,
          warranty: true,
          network: true,
          antivirus: true,
          reports: true,
          settings: true,
          exportImport: true
        }
      },
      support: {
        username: 'support',
        password: ['support', 'support123'],
        displayName: 'IT Support Engineer',
        role: 'IT Support',
        avatar: 'IT',
        permissions: {
          manageUsers: false,
          editAssets: true,
          deleteAssets: false,
          assignSystems: true,
          systemSwap: true,
          repairs: true,
          warranty: true,
          network: true,
          antivirus: true,
          reports: true,
          settings: false,
          exportImport: true
        }
      },
      itsupport: {
        username: 'itsupport',
        password: ['support', 'support123'],
        displayName: 'IT Support Engineer',
        role: 'IT Support',
        avatar: 'IT',
        permissions: {
          manageUsers: false,
          editAssets: true,
          deleteAssets: false,
          assignSystems: true,
          systemSwap: true,
          repairs: true,
          warranty: true,
          network: true,
          antivirus: true,
          reports: true,
          settings: false,
          exportImport: true
        }
      },
      viewer: {
        username: 'viewer',
        password: ['viewer', 'viewer123'],
        displayName: 'Asset Auditor / Viewer',
        role: 'Viewer',
        avatar: 'VW',
        permissions: {
          readOnly: true,
          manageUsers: false,
          editAssets: false,
          deleteAssets: false,
          assignSystems: false,
          systemSwap: false,
          repairs: false,
          warranty: false,
          network: false,
          antivirus: false,
          reports: true,
          settings: false,
          exportImport: false
        }
      }
    },

    isAuthenticated() {
      return true; // Always allow direct access
    },

    getCurrentUser() {
      const stored = localStorage.getItem(this.USER_INFO_KEY) || sessionStorage.getItem(this.USER_INFO_KEY);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) { }
      }
      return {
        username: 'admin',
        displayName: 'Sundar Pichai',
        role: 'Admin',
        avatar: 'SP',
        permissions: { manageUsers: true, editAssets: true, deleteAssets: true, assignSystems: true, systemSwap: true, repairs: true, warranty: true, network: true, antivirus: true, reports: true, settings: true, exportImport: true },
        loginTime: new Date().toISOString()
      };
    },

    login(username, password, remember = true) {
      const u = (username || 'admin').trim().toLowerCase();
      let accountKey = 'admin';
      if (['support', 'itsupport', 'tech'].includes(u)) {
        accountKey = 'support';
      } else if (['viewer', 'guest', 'audit'].includes(u)) {
        accountKey = 'viewer';
      }

      const account = this.ACCOUNTS[accountKey] || this.ACCOUNTS['admin'];
      const sessionData = {
        username: account.username,
        displayName: account.displayName,
        role: account.role,
        avatar: account.avatar,
        permissions: account.permissions,
        loginTime: new Date().toISOString()
      };

      try {
        localStorage.setItem(this.AUTH_TOKEN_KEY, 'true');
        localStorage.setItem(this.USER_INFO_KEY, JSON.stringify(sessionData));
      } catch (e) { }

      return { success: true, user: sessionData };
    },

    logout() {
      localStorage.removeItem(this.AUTH_TOKEN_KEY);
      localStorage.removeItem(this.USER_INFO_KEY);
      sessionStorage.removeItem(this.AUTH_TOKEN_KEY);
      sessionStorage.removeItem(this.USER_INFO_KEY);
    }
  };

  // View Controller & Navigation Manager
  class AppController {
    constructor() {
      this.currentView = 'dashboard';
      this.init();
    }

    init() {
      this.setupNavigation();
      this.setupGlobalHeader();
      this.setupForms();
      this.setupModals();
      this.populateTeamDropdowns();
      this.populateCpuDropdown();
      this.populateOldUsernamesList();

      // Check Authentication Guard before rendering dashboard
      this.initAuthGuard();
    }

    initAuthGuard() {
      const loginWrapper = document.getElementById('loginWrapper');
      const appContainer = document.getElementById('appContainer');

      // Direct Access Allowed: hide login screen, show dashboard
      if (loginWrapper) loginWrapper.style.display = 'none';
      if (appContainer) appContainer.style.display = 'flex';

      const user = AuthService.getCurrentUser();
      this.applyRole(user.role, user);

      this.renderCurrentView();
      this.updateDashboardMetrics();
    }

    applyRole(role, user = AuthService.getCurrentUser()) {
      this.currentRole = role || 'Admin';
      const body = document.body;
      body.classList.remove('role-admin', 'role-support', 'role-viewer');

      const roleClass = role === 'IT Support' ? 'role-support' : role === 'Viewer' ? 'role-viewer' : 'role-admin';
      body.classList.add(roleClass);

      // Update Header Widget
      const avatarEl = document.getElementById('headerUserAvatar');
      const nameEl = document.getElementById('headerUserName');
      const roleEl = document.getElementById('headerUserRole');

      if (avatarEl && user) avatarEl.textContent = user.avatar || (user.displayName ? user.displayName.substring(0, 2).toUpperCase() : 'SP');
      if (nameEl && user) nameEl.textContent = user.displayName || 'Sundar Pichai';
      if (roleEl) {
        roleEl.textContent = role;
        roleEl.className = 'admin-role ' + (role === 'Admin' ? 'role-badge-admin' : role === 'IT Support' ? 'role-badge-support' : 'role-badge-viewer');
      }

      // If restricted user lands on prohibited view, redirect to dashboard
      if (role === 'Viewer') {
        if (['new-user', 'settings'].includes(this.currentView)) {
          this.navigateTo('dashboard');
        }
      } else if (role === 'IT Support') {
        if (['settings', 'new-user'].includes(this.currentView)) {
          this.navigateTo('dashboard');
        }
      }
    }

    handleLoginSubmit(e) {
      if (e) e.preventDefault();
      const usernameInput = document.getElementById('loginUsername');
      const passwordInput = document.getElementById('loginPassword');
      const rememberInput = document.getElementById('loginRememberMe');
      const errorAlert = document.getElementById('loginErrorAlert');
      const errorMessage = document.getElementById('loginErrorMessage');
      const submitBtn = document.getElementById('loginSubmitBtn');

      const username = usernameInput ? usernameInput.value : '';
      const password = passwordInput ? passwordInput.value : '';
      const remember = rememberInput ? rememberInput.checked : true;

      const result = AuthService.login(username, password, remember);

      if (!result.success) {
        if (errorAlert && errorMessage) {
          errorMessage.textContent = result.message;
          errorAlert.style.display = 'flex';
        }
        if (passwordInput) {
          passwordInput.value = '';
          passwordInput.focus();
        }
        return;
      }

      // Valid Credentials: Animate sign in
      if (errorAlert) errorAlert.style.display = 'none';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Signing In...</span> <span class="spinner" style="display:inline-block; animation:spin 1s linear infinite;">⏳</span>';
      }

      setTimeout(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<span>Sign In to Dashboard</span> <span>→</span>';
        }

        const loginWrapper = document.getElementById('loginWrapper');
        const appContainer = document.getElementById('appContainer');

        if (loginWrapper) loginWrapper.style.display = 'none';
        if (appContainer) appContainer.style.display = 'flex';

        this.applyRole(result.user.role, result.user);
        store.addActivity('User Signed In', result.user.role, result.user.displayName, 'Success');

        Utils.showToast('Login Successful', `Welcome back, ${result.user.displayName}! Signed in as ${result.user.role}.`);
        this.navigateTo('dashboard');
        this.updateDashboardMetrics();
      }, 350);
    }

    togglePasswordVisibility() {
      const pwdInput = document.getElementById('loginPassword');
      const toggleBtn = document.getElementById('loginPwdToggle');
      if (!pwdInput) return;

      if (pwdInput.type === 'password') {
        pwdInput.type = 'text';
        if (toggleBtn) toggleBtn.textContent = '🙈';
      } else {
        pwdInput.type = 'password';
        if (toggleBtn) toggleBtn.textContent = '👁️';
      }
    }

    fillRolePreset(roleKey, autoSubmit = false) {
      const userInput = document.getElementById('loginUsername');
      const pwdInput = document.getElementById('loginPassword');
      const errorAlert = document.getElementById('loginErrorAlert');

      if (errorAlert) errorAlert.style.display = 'none';

      if (roleKey === 'admin') {
        if (userInput) userInput.value = 'admin';
        if (pwdInput) pwdInput.value = 'admin';
      } else if (roleKey === 'support') {
        if (userInput) userInput.value = 'support';
        if (pwdInput) pwdInput.value = 'support';
      } else if (roleKey === 'viewer') {
        if (userInput) userInput.value = 'viewer';
        if (pwdInput) pwdInput.value = 'viewer';
      }

      if (autoSubmit) {
        this.handleLoginSubmit();
      }
    }

    logout() {
      if (!confirm('Are you sure you want to sign out of the Asset Management Portal?')) {
        return;
      }

      const currentUser = AuthService.getCurrentUser();
      const name = currentUser ? currentUser.displayName : 'User';

      AuthService.logout();
      store.addActivity('User Signed Out', currentUser ? currentUser.role : 'Portal', name, 'Warning');

      document.body.classList.remove('role-admin', 'role-support', 'role-viewer');

      const loginWrapper = document.getElementById('loginWrapper');
      const appContainer = document.getElementById('appContainer');

      if (appContainer) appContainer.style.display = 'none';
      if (loginWrapper) {
        loginWrapper.style.display = 'flex';
        const pwdInput = document.getElementById('loginPassword');
        if (pwdInput) pwdInput.value = '';
        const userInput = document.getElementById('loginUsername');
        if (userInput) {
          userInput.value = '';
          userInput.focus();
        }
      }

      Utils.showToast('Signed Out', 'You have been safely logged out.', 'info');
    }

    setupGlobalHeader() {
      // Current Date
      const dateEl = document.getElementById('headerCurrentDate');
      if (dateEl) {
        const today = new Date();
        dateEl.textContent = today.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        });
      }

      // Sidebar Toggle (Desktop Collapse)
      const sidebarToggle = document.getElementById('sidebarToggleBtn');
      const sidebar = document.getElementById('sidebar');
      if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', () => {
          sidebar.classList.toggle('collapsed');
        });
      }

      // Mobile Menu Toggle
      const mobileNavToggle = document.getElementById('mobileNavToggle');
      if (mobileNavToggle && sidebar) {
        mobileNavToggle.addEventListener('click', () => {
          sidebar.classList.toggle('mobile-open');
        });
      }

      // Live Clock
      this.initLiveClock();

      // Keyboard Shortcut (Ctrl+K / Cmd+K)
      window.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
          e.preventDefault();
          const searchInput = document.getElementById('globalSearchInput');
          if (searchInput) {
            searchInput.focus();
            searchInput.select();
          }
        }
        if (e.key === 'Escape') {
          this.handleEscapeKeyPress();
        }
      });

      // Click outside listener to close popovers
      document.addEventListener('click', (e) => {
        const popover = document.getElementById('notificationPopover');
        const bell = document.getElementById('btnNotificationBell');
        if (popover && bell && !popover.contains(e.target) && !bell.contains(e.target)) {
          popover.classList.remove('active');
        }
        const spot = document.getElementById('spotlightResultsDropdown');
        const searchInput = document.getElementById('globalSearchInput');
        if (spot && searchInput && !spot.contains(e.target) && !searchInput.contains(e.target)) {
          spot.classList.remove('active');
        }
      });

      // Global Search Bar with Spotlight Dropdown
      const globalSearch = document.getElementById('globalSearchInput');
      if (globalSearch) {
        globalSearch.addEventListener('input', (e) => {
          const query = e.target.value.toLowerCase().trim();
          this.handleGlobalSearch(query);
        });
        globalSearch.addEventListener('focus', (e) => {
          const query = e.target.value.toLowerCase().trim();
          if (query.length >= 2) this.handleGlobalSearch(query);
        });
      }
    }

    initLiveClock() {
      const clockEl = document.getElementById('headerLiveClock');
      if (!clockEl) return;
      const updateClock = () => {
        const now = new Date();
        clockEl.textContent = now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        });
      };
      updateClock();
      setInterval(updateClock, 1000);
    }

    handleGlobalSearch(query) {
      const dropdown = document.getElementById('spotlightResultsDropdown');
      if (!dropdown) return;
      if (!query || query.length < 2) {
        dropdown.classList.remove('active');
        return;
      }
      const matchAsset = store.data.assets.find(
        a => (a.id && a.id.toLowerCase().includes(query)) ||
          (a.user && a.user.toLowerCase().includes(query)) ||
          (a.oldUsername && a.oldUsername.toLowerCase().includes(query)) ||
          (a.serialNumber && a.serialNumber.toLowerCase().includes(query))
      );

      if (matchAsset && this.currentView !== 'all-assets') {
        this.navigateTo('all-assets');
        const assetSearchInput = document.getElementById('assetsSearchInput');
        if (assetSearchInput) {
          assetSearchInput.value = query;
          this.renderAllAssetsTable();
        }
      }
    }

    setupNavigation() {
      // Browser Back & Forward button handler: always routes back cleanly to SPA view or dashboard
      window.addEventListener('popstate', (e) => {
        const targetView = (e.state && e.state.view) || (window.location.hash ? window.location.hash.substring(1) : 'dashboard');
        this.navigateTo(targetView || 'dashboard', false);
      });

      // Initialize starting history state on load
      const initialView = window.location.hash ? window.location.hash.substring(1) : 'dashboard';
      if (!history.state) {
        history.replaceState({ view: initialView || 'dashboard' }, '', '#' + (initialView || 'dashboard'));
      }

      // Direct Event Listeners for All Assets filter inputs (Instant live filtering)
      ['assetsSearchInput', 'assetsTypeFilter', 'assetsCpuFilter', 'assetsTeamFilter', 'assetsStatusFilter', 'assetsWorkStatusFilter'].forEach(id => {
        const inputEl = document.getElementById(id);
        if (inputEl) {
          inputEl.addEventListener('input', () => this.renderAllAssetsTable());
          inputEl.addEventListener('change', () => this.renderAllAssetsTable());
        }
      });

      // Sidebar parent item collapsibles
      document.querySelectorAll('.nav-item.has-submenu > .nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const parentItem = link.closest('.nav-item');
          parentItem.classList.toggle('open');
        });
      });

      // Navigation links
      document.querySelectorAll('[data-target-view]').forEach(elem => {
        elem.addEventListener('click', (e) => {
          e.preventDefault();
          const target = elem.getAttribute('data-target-view');
          if (target) {
            if (target === 'all-assets') {
              const typeFilter = document.getElementById('assetsTypeFilter');
              if (typeFilter) typeFilter.value = 'all';
              const statusFilter = document.getElementById('assetsStatusFilter');
              if (statusFilter) statusFilter.value = 'all';
            }
            this.navigateTo(target);

            // On mobile, close sidebar after clicking
            const sidebar = document.getElementById('sidebar');
            if (sidebar) sidebar.classList.remove('mobile-open');
          }
        });
      });
    }

    navigateTo(viewId, pushHistory = true) {
      this.previousView = this.currentView;
      this.currentView = viewId;

      // Sync browser history so clicking browser Back button returns to Dashboard
      if (pushHistory) {
        try {
          if (!history.state || history.state.view !== viewId) {
            history.pushState({ view: viewId }, '', '#' + viewId);
          }
        } catch (e) {
          console.warn('History pushState note:', e);
        }
      }

      // Sync header Back to Dashboard button
      const backBtn = document.getElementById('btnBackToDashboard');
      if (backBtn) {
        backBtn.style.display = (viewId === 'dashboard') ? 'none' : 'inline-flex';
      }

      // Smooth scroll to top when landing on Dashboard
      if (viewId === 'dashboard') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }

      // Update sidebar active highlights
      document.querySelectorAll('.nav-link, .submenu-link').forEach(el => el.classList.remove('active'));
      const activeLink = document.querySelector(`[data-target-view="${viewId}"]`);
      if (activeLink) {
        activeLink.classList.add('active');
        const parentSubmenu = activeLink.closest('.nav-item.has-submenu');
        if (parentSubmenu) {
          parentSubmenu.classList.add('open');
        }
      }

      // Update Header Breadcrumb and Title
      const titles = {
        'dashboard': 'Executive Dashboard',
        'all-assets': 'All IT Assets Inventory',
        'desktop': 'Desktop Workstations',
        'laptop': 'Laptops & MacBooks',
        'non-assigned': 'Non-Assigned (Available Pool)',
        'swap-system': 'System Swap Operations',
        'non-it-assets': 'Non-IT Assets Management',
        'all-users': 'All Organization Users',
        'assigned-users': 'Assigned Users Directory',
        'pending-users': 'Pending User Onboarding',
        'new-requirements': 'New Asset Requirements',
        'pending-requirements': 'Pending Approvals',
        'purchase-required': 'Purchase & Procurement',
        'assigned-hardware': 'Assigned Hardware Items',
        'hardware-stock': 'Hardware Stock & Accessories',
        'accessories': 'IT Accessories Inventory',
        'switch-modem': 'Network Switches & Gateways',
        'bypass-ip': 'Bypass IP Whitelist',
        'antivirus': 'Endpoint Security & Antivirus',
        'repairs': 'Hardware Maintenance & Repairs',
        'warranty': 'Warranty Lifecycle Tracking',
        'reports': 'System Intelligence & Reports',
        'settings': 'System Configuration & Backup',
        'new-user': 'Add New User & Assign System'
      };

      const pageTitle = titles[viewId] || 'IT Asset Management';
      const pageTitleEl = document.getElementById('currentPageTitle');
      const breadcrumbEl = document.getElementById('currentBreadcrumb');

      if (pageTitleEl) pageTitleEl.textContent = pageTitle;
      if (breadcrumbEl) {
        if (viewId === 'dashboard') {
          breadcrumbEl.innerHTML = `<span>Home</span> <span>/</span> <span>Executive Dashboard</span>`;
        } else {
          breadcrumbEl.innerHTML = `<a href="javascript:void(0)" onclick="window.ITApp.navTo('dashboard')" style="color:var(--primary); font-weight:700; text-decoration:none; cursor:pointer;" title="Go back to Dashboard">🏠 Dashboard</a> <span style="opacity:0.4;">/</span> <span>${pageTitle}</span>`;
        }
      }

      // Hide all panels, show targeted panel
      document.querySelectorAll('.view-panel').forEach(panel => panel.classList.remove('active'));
      const targetPanelId = (viewId === 'desktop' || viewId === 'laptop') ? 'view-all-assets' : `view-${viewId}`;
      const targetPanel = document.getElementById(targetPanelId);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }

      this.renderCurrentView();
    }

    renderCurrentView() {
      switch (this.currentView) {
        case 'dashboard':
          this.updateDashboardMetrics();
          this.renderRecentActivity();
          this.renderStatusBreakdown();
          this.renderDepartmentDistribution();
          this.renderWorkplaceMode();
          break;
        case 'all-assets':
          if (this.previousView === 'desktop' || this.previousView === 'laptop') {
            const typeFilter = document.getElementById('assetsTypeFilter');
            if (typeFilter) typeFilter.value = 'all';
            const statusFilter = document.getElementById('assetsStatusFilter');
            if (statusFilter) statusFilter.value = 'all';
          }
          this.renderAllAssetsTable();
          break;
        case 'desktop':
          this.renderFilteredAssetsTable('Desktop');
          break;
        case 'laptop':
          this.renderFilteredAssetsTable('Laptop');
          break;
        case 'assigned-users':
          this.renderAssignedUsersTable();
          break;
        case 'all-users':
          this.renderAllUsersTable();
          break;
        case 'pending-users':
          this.renderPendingUsersTable();
          break;
        case 'non-assigned':
          this.renderNonAssignedView();
          break;
        case 'swap-system':
          this.renderSwapSystemPage();
          break;
        case 'new-requirements':
        case 'pending-requirements':
        case 'purchase-required':
          this.renderRequirementsTable();
          break;
        case 'non-it-assets':
          this.renderNonItAssetsTable();
          break;
        case 'hardware-stock':
        case 'accessories':
          this.renderHardwareStockTable();
          break;
        case 'assigned-hardware':
          this.renderAssignedHardwareTable();
          break;
        case 'switch-modem':
          this.renderNetworkSwitchesTable();
          break;
        case 'bypass-ip':
          this.renderBypassIpTable();
          break;
        case 'antivirus':
          this.renderAntivirusTable();
          break;
        case 'repairs':
          this.renderRepairsTable();
          break;
        case 'warranty':
          this.renderWarrantyTable();
          break;
        case 'reports':
          this.renderReportsView();
          break;
        case 'settings':
          this.renderSettingsView();
          break;
        case 'new-user':
          this.populateOldUsernamesList();
          break;
      }
    }

    populateOldUsernamesList() {
      const datalist = document.getElementById('oldUsernamesList');
      if (!datalist) return;

      const exitUsersMap = new Map();

      // Collect ONLY users whose status is 'User Exit'
      (store.data.users || []).forEach(u => {
        if (u && u.name && (u.workStatus === 'User Exit' || u.status === 'User Exit')) {
          exitUsersMap.set(u.name.trim(), u.team || 'General');
        }
      });

      (store.data.assets || []).forEach(a => {
        if (a && a.user && a.user !== 'Unassigned' && (a.workStatus === 'User Exit' || a.status === 'User Exit')) {
          if (!exitUsersMap.has(a.user.trim())) {
            exitUsersMap.set(a.user.trim(), a.team || 'General');
          }
        }
        if (a && a.oldUsername && a.oldUsername !== 'None' && a.oldUsername.trim()) {
          if (!exitUsersMap.has(a.oldUsername.trim())) {
            exitUsersMap.set(a.oldUsername.trim(), a.team || 'General');
          }
        }
      });

      // Format as "Name [Team]" for clear visual identification
      const optionsHtml = Array.from(exitUsersMap.entries())
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([name, team]) => `<option value="${Utils.escapeHtml(name)} [${Utils.escapeHtml(team)}]">`)
        .join('');

      datalist.innerHTML = optionsHtml;
    }

    /* ==========================================================================
       DASHBOARD METRICS & WIDGETS
       ========================================================================== */
    updateDashboardMetrics() {
      const assets = store.data.assets || [];
      const users = store.data.users || [];
      const reqs = store.data.requirements || [];
      const nonIt = store.data.nonItAssets || [];
      const repairs = store.data.repairs || [];
      const swaps = store.data.swapLogs || [];

      const totalAssets = assets.length;
      const totalDesktops = assets.filter(a => a.type === 'Desktop').length;
      const totalLaptops = assets.filter(a => a.type === 'Laptop').length;

      const assignedAssets = assets.filter(a => a.status === 'Assigned');
      const assignedCount = assignedAssets.length;
      const assignedDesktops = assignedAssets.filter(a => a.type === 'Desktop').length;
      const assignedLaptops = assignedAssets.filter(a => a.type === 'Laptop').length;

      const stockAssets = assets.filter(a => a.status === 'Non-Assigned');
      const nonAssigned = stockAssets.length;
      const stockDesktops = stockAssets.filter(a => a.type === 'Desktop').length;
      const stockLaptops = stockAssets.filter(a => a.type === 'Laptop').length;

      const swapCount = swaps.length;
      const nonItCount = nonIt.length;
      const totalUsers = users.length;
      const pendingReqs = reqs.filter(r => r.status === 'Pending' || r.status === 'Purchase Required' || r.status === 'New').length;
      const repairCount = repairs.filter(r => r.status !== 'Completed' && r.status !== 'Repaired & Returned').length;

      // Calculate warranty expiring soon (< 30 days)
      const warrantyExpiring = assets.filter(a => {
        const days = Utils.getDaysRemaining(a.warrantyEnd);
        return days !== null && days <= 30 && days >= 0;
      }).length;

      // Update DOM Card Elements
      const setCard = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.textContent = val;
      };

      // 8 Core Cards (Card 1: Assigned Systems Pool, Card 2: Non-Assigned Systems Pool)
      setCard('cardTotalAssets', assignedCount);
      setCard('cardTotalAssigned', assignedCount);
      setCard('cardNonAssignedDesktop', stockDesktops);
      setCard('cardNonAssignedLaptop', stockLaptops);
      setCard('cardNonAssigned', nonAssigned);
      setCard('cardTotalSystems', totalAssets);
      setCard('cardAvailableSystems', nonAssigned);
      setCard('cardAssignedSystems', assignedCount);
      setCard('cardDesktops', totalDesktops);
      setCard('cardLaptops', totalLaptops);
      setCard('ribbonTotalSystems', totalAssets);
      setCard('ribbonAvailableSystems', nonAssigned);
      setCard('ribbonAssignedSystems', assignedCount);
      setCard('cardSwapSystem', swapCount);
      setCard('cardPendingRequirements', pendingReqs);
      setCard('cardWarrantyExpiring', warrantyExpiring);

      // Micro breakdown text inside Card 1 (Assigned Fleet Pool)
      const fleetPill = document.getElementById('cardFleetTypePill');
      if (fleetPill) {
        fleetPill.innerHTML = `
          <span class="fleet-pill-badge fleet-pill-dsk" onclick="event.stopPropagation(); window.ITApp.filterAssignedFleetByType('Desktop')" title="Click to view only Assigned Desktops">🖥️ ${assignedDesktops} Dsk</span>
          <span style="opacity:0.4; margin:0 2px;">•</span>
          <span class="fleet-pill-badge fleet-pill-lpt" onclick="event.stopPropagation(); window.ITApp.filterAssignedFleetByType('Laptop')" title="Click to view only Assigned Laptops">💻 ${assignedLaptops} Lpt</span>
        `;
      }

      // Card 2: Non-Assigned System Pill
      const nonAssignedPill = document.getElementById('cardNonAssignedPill');
      if (nonAssignedPill) {
        nonAssignedPill.innerHTML = `
          <span class="fleet-pill-badge fleet-pill-dsk" onclick="event.stopPropagation(); window.ITApp.navToNonAssigned('Desktop')" title="Click to view only Non-Assigned Desktops">🖥️ ${stockDesktops} Dsk</span>
          <span style="opacity:0.4; margin:0 2px;">•</span>
          <span class="fleet-pill-badge fleet-pill-lpt" onclick="event.stopPropagation(); window.ITApp.navToNonAssigned('Laptop')" title="Click to view only Non-Assigned Laptops">💻 ${stockLaptops} Lpt</span>
        `;
      }

      // Card 3: Assigned System Pill
      const assignedPill = document.getElementById('cardAssignedFleetPill');
      if (assignedPill) {
        assignedPill.innerHTML = `
          <span class="fleet-pill-badge fleet-pill-dsk" onclick="event.stopPropagation(); window.ITApp.filterAssignedByType('Desktop')" title="Click to view only Assigned Desktops">🖥️ ${assignedDesktops} Dsk</span>
          <span style="opacity:0.4; margin:0 2px;">•</span>
          <span class="fleet-pill-badge fleet-pill-lpt" onclick="event.stopPropagation(); window.ITApp.filterAssignedByType('Laptop')" title="Click to view only Assigned Laptops">💻 ${assignedLaptops} Lpt</span>
        `;
      }

      const maintPill = document.getElementById('cardMaintenancePill');
      if (maintPill) maintPill.textContent = `${warrantyExpiring} Expiring • ${repairCount} Repair`;

      // Meta Ribbon elements
      setCard('ribbonTotalUsers', totalUsers);
      setCard('ribbonNonItCount', nonItCount);
      setCard('ribbonTotalTeams', (store.data.settings?.teams || []).length || 7);

      // Legacy fallback IDs
      setCard('cardAssignedDesktop', assignedDesktops);
      setCard('cardAssignedLaptop', assignedLaptops);
      setCard('cardNonItAssets', nonItCount);
      setCard('cardRepairSystems', repairCount);
    }

    filterRecentActivity(filterType) {
      this.recentActivityFilter = filterType || 'all';
      document.querySelectorAll('.activity-filter-btn').forEach(btn => {
        if (btn.getAttribute('data-filter') === this.recentActivityFilter) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
      this.renderRecentActivity();
    }

    renderRecentActivity() {
      const tbody = document.getElementById('recentActivityTableBody');
      if (!tbody) return;

      let logs = store.data.activityLogs || [];
      const filter = this.recentActivityFilter || 'all';
      if (filter === 'swap') {
        logs = logs.filter(l => (l.action || '').toLowerCase().includes('swap'));
      } else if (filter === 'assign') {
        logs = logs.filter(l => (l.action || '').toLowerCase().includes('assign'));
      } else if (filter === 'spec') {
        logs = logs.filter(l => {
          const act = (l.action || '').toLowerCase();
          return act.includes('spec') || act.includes('save') || act.includes('update') || act.includes('edit');
        });
      }

      const displayLogs = logs.slice(0, 10);
      if (displayLogs.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="empty-state">No activity logs recorded matching "${filter}".</td></tr>`;
        return;
      }

      tbody.innerHTML = displayLogs.map(log => `
        <tr>
          <td><span style="font-family: var(--font-mono); font-size: 0.78rem; color: var(--text-muted);">${Utils.escapeHtml(log.date)}</span></td>
          <td><strong>${Utils.escapeHtml(log.user)}</strong></td>
          <td><span class="status-pill status-available">${Utils.escapeHtml(log.asset)}</span></td>
          <td>${Utils.escapeHtml(log.action)}</td>
          <td><span class="status-pill ${log.status === 'Success' ? 'status-assigned' : 'status-warning'}">${Utils.escapeHtml(log.status)}</span></td>
        </tr>
      `).join('');
    }

    renderStatusBreakdown() {
      const container = document.getElementById('statusBreakdownContainer');
      if (!container) return;

      const assets = store.data.assets || [];
      const total = assets.length || 1;

      const statuses = [
        { label: 'Assigned', count: assets.filter(a => a.status === 'Assigned').length, color: '#10b981' },
        { label: 'Available / Non-Assigned', count: assets.filter(a => a.status === 'Non-Assigned').length, color: '#3b82f6' },
        { label: 'In Repair', count: assets.filter(a => a.status === 'Repair').length, color: '#ef4444' },
        { label: 'Warranty Tracking', count: assets.filter(a => a.status === 'Warranty').length, color: '#8b5cf6' },
        { label: 'Swap Pool', count: assets.filter(a => a.status === 'Swap').length, color: '#f59e0b' }
      ];

      container.innerHTML = statuses.map(s => {
        const pct = Math.round((s.count / total) * 100);
        return `
          <div class="status-progress-item">
            <div class="status-progress-head">
              <span>${s.label} (${s.count})</span>
              <span style="font-weight: 700; color: ${s.color};">${pct}%</span>
            </div>
            <div class="status-bar-track">
              <div class="status-bar-fill" style="width: ${pct}%; background-color: ${s.color};"></div>
            </div>
          </div>
        `;
      }).join('');
    }

    renderDepartmentDistribution() {
      const container = document.getElementById('dashboardDeptFleetGrid');
      if (!container) return;

      const assets = store.data.assets || [];
      const assigned = assets.filter(a => a.status === 'Assigned' && a.team);
      const teamCounts = {};

      assigned.forEach(a => {
        const t = (a.team || '').trim();
        if (t) teamCounts[t] = (teamCounts[t] || 0) + 1;
      });

      const teams = Object.keys(teamCounts).sort((a, b) => teamCounts[b] - teamCounts[a]);

      if (teams.length === 0) {
        container.innerHTML = `<span style="font-size:0.78rem; color:var(--text-muted);">No assigned systems found by department.</span>`;
        return;
      }

      container.innerHTML = teams.map(team => `
        <div class="dept-fleet-pill" title="Click to view all assets in ${Utils.escapeHtml(team)}" onclick="window.ITApp.filterAssetsByTeam('${Utils.escapeHtml(team)}')">
          <span>${Utils.escapeHtml(team)}</span>
          <span class="dept-fleet-badge">${teamCounts[team]}</span>
        </div>
      `).join('');
    }

    renderWorkplaceMode() {
      const container = document.getElementById('dashboardWorkModeContainer');
      if (!container) return;

      const assets = store.data.assets || [];
      const assigned = assets.filter(a => a.status === 'Assigned');
      const total = assigned.length || 1;

      const wfhCount = assigned.filter(a => a.workStatus === 'Work From Home' || (a.location && a.location.toLowerCase().includes('remote'))).length;
      const officeCount = total - wfhCount;

      const officePct = Math.round((officeCount / total) * 100);
      const wfhPct = 100 - officePct;

      container.innerHTML = `
        <div style="margin-bottom: 12px;">
          <div style="display:flex; justify-content:space-between; margin-bottom: 4px; font-weight:600; font-size:0.78rem;">
            <span>🏢 On-Premise: <strong>${officeCount}</strong> (${officePct}%)</span>
            <span>🏠 WFH / Remote: <strong>${wfhCount}</strong> (${wfhPct}%)</span>
          </div>
          <div style="height: 8px; border-radius: 4px; display: flex; overflow: hidden; background: var(--bg-subtle);">
            <div style="width: ${officePct}%; background: #2563eb;" title="Office: ${officePct}%"></div>
            <div style="width: ${wfhPct}%; background: #8b5cf6;" title="Remote / WFH: ${wfhPct}%"></div>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 0.78rem; background: var(--bg-subtle); padding: 10px 12px; border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
          <div>
            <span style="color:var(--text-muted); display:block; font-size:0.72rem;">🛡️ EDR Security</span>
            <strong style="color:#16a34a;">100% Protected (10/10)</strong>
          </div>
          <div>
            <span style="color:var(--text-muted); display:block; font-size:0.72rem;">🔄 Latest Swap</span>
            <strong>Oct 5, 2026</strong>
          </div>
        </div>
      `;
    }

    exportActivityLogsCSV() {
      const logs = store.data.activityLogs || [];
      const headers = ['Timestamp', 'User', 'Asset ID', 'Operation / Action', 'Status'];
      const rows = [
        headers,
        ...logs.map(l => [l.date, l.user, l.asset, l.action, l.status])
      ];
      Utils.exportToCSV(`IT_Activity_Audit_Log_${new Date().toISOString().substring(0, 10)}`, rows);
      Utils.showToast('Activity Exported', 'Recent activity audit log downloaded to CSV.');
    }

    /* ==========================================================================
       ALL ASSETS & FILTERED ASSET TABLES
       ========================================================================== */
    getWorkStatusButton(assetId, workStatus, showLabel = false) {
      const ws = (workStatus || 'Currently Working').trim();
      const lower = ws.toLowerCase();

      let lightClass = 'workstatus-light-green';
      let label = 'Currently Working';
      let colorName = 'Green';
      let dot = '🟢';

      if (lower === 'user exit' || lower === 'exit') {
        lightClass = 'workstatus-light-red';
        label = 'User Exit';
        colorName = 'Red';
        dot = '🔴';
      } else if (lower === 'work from home' || lower === 'wfh' || lower === 'yellow') {
        lightClass = 'workstatus-light-blue';
        label = 'Work From Home';
        colorName = 'Blue';
        dot = '🔵';
      } else if (lower === 'in stock' || lower === 'stock' || lower === 'available') {
        lightClass = 'workstatus-light-amber';
        label = 'In Stock';
        colorName = 'Amber';
        dot = '📦';
      }

      const title = `${dot} ${label} (${colorName} Light Indicator)`;

      if (showLabel) {
        return `
          <div class="workstatus-light-pill ${lightClass}" style="cursor: default;" title="${Utils.escapeHtml(title)}">
            <span class="workstatus-led"></span>
            <span>${label}</span>
          </div>
        `;
      }

      return `
        <div class="workstatus-light-wrapper" style="cursor: default;" title="${Utils.escapeHtml(title)}">
          <div class="workstatus-light-btn ${lightClass}" style="cursor: default; pointer-events: none;" aria-label="${Utils.escapeHtml(label)}">
            <span class="workstatus-led"></span>
          </div>
        </div>
      `;
    }

    renderAllAssetsTable() {
      const tbody = document.getElementById('allAssetsTableBody');
      if (!tbody) return;

      this.populateCpuDropdown();

      const search = (document.getElementById('assetsSearchInput')?.value || '').toLowerCase().trim();
      const typeFilter = document.getElementById('assetsTypeFilter')?.value || 'all';
      const cpuFilter = document.getElementById('assetsCpuFilter')?.value || 'all';
      const teamFilter = document.getElementById('assetsTeamFilter')?.value || 'all';
      const statusFilter = document.getElementById('assetsStatusFilter')?.value || 'all';
      const workStatusFilter = document.getElementById('assetsWorkStatusFilter')?.value || 'all';

      const isDesktopOrLaptop = (typeFilter.toLowerCase() === 'desktop' || typeFilter.toLowerCase() === 'laptop' || this.currentView === 'desktop' || this.currentView === 'laptop');

      let list = store.data.assets.filter(item => {
        const matchesSearch = !search ||
          (item.id && item.id.toLowerCase().includes(search)) ||
          (item.user && item.user.toLowerCase().includes(search)) ||
          (item.oldUsername && item.oldUsername.toLowerCase().includes(search)) ||
          (item.serialNumber && item.serialNumber.toLowerCase().includes(search)) ||
          (item.cpu && item.cpu.toLowerCase().includes(search)) ||
          (item.ram && item.ram.toLowerCase().includes(search)) ||
          (item.hdd && item.hdd.toLowerCase().includes(search)) ||
          (item.ssd && item.ssd.toLowerCase().includes(search)) ||
          (item.monitor && item.monitor.toLowerCase().includes(search)) ||
          (item.team && item.team.toLowerCase().includes(search)) || (item.tl && item.tl.toLowerCase().includes(search)) ||
          (item.location && item.location.toLowerCase().includes(search)) ||
          (item.workStatus && item.workStatus.toLowerCase().includes(search)) ||
          (item.status && item.status.toLowerCase().includes(search));

        const matchesType = typeFilter === 'all' || (item.type && item.type.toLowerCase() === typeFilter.toLowerCase());
        const matchesCpu = cpuFilter === 'all' || (item.cpu && item.cpu.trim().toLowerCase() === cpuFilter.trim().toLowerCase());
        const matchesTeam = teamFilter === 'all' || (item.team && item.team.toLowerCase() === teamFilter.toLowerCase());

        // Requirement:
        // - All Assets: Non-Assigned assets SHOW
        // - Desktop: Non-Assigned assets MUST NOT SHOW (only assigned desktops show)
        // - Laptop: Non-Assigned assets MUST NOT SHOW (only assigned laptops show)
        const isNonAssigned = (item.status === 'Non-Assigned' || item.status === 'Available');
        if (isDesktopOrLaptop && isNonAssigned) {
          return false;
        }

        const matchesStatus = statusFilter === 'all' || (item.status && item.status.toLowerCase() === statusFilter.toLowerCase());
        const matchesWorkStatus = workStatusFilter === 'all' ||
          (item.workStatus && item.workStatus.toLowerCase() === workStatusFilter.toLowerCase()) ||
          (!item.workStatus && workStatusFilter === 'Currently Working' && item.status === 'Assigned');

        return matchesSearch && matchesType && matchesCpu && matchesTeam && matchesStatus && matchesWorkStatus;
      });

      // Natural alphanumeric sort by Asset ID
      const sortDir = app.assetSortDir || 'asc';
      list.sort((a, b) => {
        const idA = a.id || '';
        const idB = b.id || '';
        const comp = idA.localeCompare(idB, undefined, { numeric: true, sensitivity: 'base' });
        return sortDir === 'asc' ? comp : -comp;
      });

      const sortIndicator = document.getElementById('assetSortIndicator');
      if (sortIndicator) {
        sortIndicator.textContent = sortDir === 'asc' ? '▲' : '▼';
      }

      // Update Live Filter Count Badges
      const countBadge = document.getElementById('assetsFilterCountBadge');
      const breakdownText = document.getElementById('assetsFilterBreakdownText');
      const toolbarPill = document.getElementById('assetsToolbarCountPill');
      const resetBtn = document.getElementById('assetsResetFiltersBtn');
      const totalFleet = store.data.assets.length;

      if (countBadge) {
        countBadge.textContent = `${list.length} Total`;
      }
      if (toolbarPill) {
        toolbarPill.textContent = `${list.length} / ${totalFleet} Assets`;
      }
      if (breakdownText) {
        const activeFilters = [];
        if (typeFilter !== 'all') activeFilters.push(`Type: ${typeFilter}`);
        if (cpuFilter !== 'all') activeFilters.push(`CPU: ${cpuFilter}`);
        if (teamFilter !== 'all') activeFilters.push(`Dept: ${teamFilter}`);
        if (statusFilter !== 'all') activeFilters.push(`Status: ${statusFilter}`);
        if (workStatusFilter !== 'all') activeFilters.push(`Work: ${workStatusFilter}`);
        if (search) activeFilters.push(`Search: "${search}"`);

        if (activeFilters.length > 0) {
          breakdownText.textContent = `(Filtered: ${activeFilters.join(', ')} • Showing ${list.length} of ${totalFleet})`;
        } else {
          breakdownText.textContent = `(Showing all ${totalFleet} Fleet Items)`;
        }
      }

      const hasActive = search !== '' || typeFilter !== 'all' || cpuFilter !== 'all' || teamFilter !== 'all' || statusFilter !== 'all' || workStatusFilter !== 'all';
      if (resetBtn) {
        resetBtn.style.display = hasActive ? 'inline-flex' : 'none';
      }

      if (list.length === 0) {
        tbody.innerHTML = `<tr><td colspan="13" class="empty-state"><div class="empty-icon">💻</div><div class="empty-title">No assets found</div><div class="empty-desc">Try changing your search terms or filters.</div></td></tr>`;
        return;
      }

      tbody.innerHTML = list.map(a => {
        const statusClass = a.status === 'Assigned' ? 'status-assigned' :
          (a.status === 'Non-Assigned' || a.status === 'Available') ? 'status-non-assigned' :
            a.status === 'Swap' ? 'status-swap' :
              a.status === 'Repair' ? 'status-repair' : 'status-warranty';

        // HDD: display only HDD information or "-" if none
        const isNoHdd = !a.hdd || a.hdd === '-' || a.hdd === '—' || a.hdd.toLowerCase() === 'none' || a.hdd.toLowerCase() === 'nil';
        const hddText = isNoHdd ? '-' : a.hdd;

        // SSD: display only SSD information or "-" if none
        const isNoSsd = !a.ssd || a.ssd === '-' || a.ssd === '—' || a.ssd.toLowerCase() === 'none' || a.ssd.toLowerCase() === 'nil';
        const ssdText = isNoSsd ? '-' : a.ssd;

        // Monitor: display monitor information or "None" if none
        const isNoMon = !a.monitor || a.monitor === '-' || a.monitor === '—' || a.monitor.toLowerCase() === 'none' || a.monitor.toLowerCase() === 'nil';
        const monitorText = isNoMon ? 'None' : a.monitor;

        // MAC Address: display consistent uppercase MAC format (00:E0:4C:4D:7F:01)
        const rawMac = a.macAddress || a.serialNumber || '';
        const isNoMac = !rawMac || rawMac === '-' || rawMac === '—' || rawMac.toLowerCase() === 'none';
        const macText = isNoMac ? '-' : rawMac.toUpperCase();

        // CPU: actual CPU / processor information (never mixed with Team/TL)
        const cpuText = (a.cpu && a.cpu.trim() !== '' && a.cpu !== '-' && a.cpu !== '—') ? a.cpu : '-';

        // RAM: actual RAM information
        const ramText = (a.ram && a.ram.trim() !== '' && a.ram !== '-' && a.ram !== '—') ? a.ram : '-';

        // Team: display team values ("TEAM TL", "Admin", etc.) with subtle TL note if present
        const teamText = a.team || '—';
        const tlNote = (a.tl && a.tl !== '-' && a.tl !== a.team)
          ? `<div style="font-size:0.72rem; color:var(--text-muted); margin-top:2px;" title="Team Leader: ${Utils.escapeHtml(a.tl)}"><span style="color:var(--text-faint);">TL:</span> ${Utils.escapeHtml(a.tl)}</div>`
          : '';

        // Warranty: show warranty expiry date, "Expired", or "Non-Warranty"
        let warrantyHtml = '';
        const isNoWarranty = !a.warrantyEnd || a.warrantyEnd === '-' || a.warrantyEnd === '—' || a.warrantyEnd.toLowerCase() === 'none' || a.warrantyEnd.toLowerCase() === 'non-warranty' || a.warrantyEnd.toLowerCase() === 'nil';
        if (isNoWarranty) {
          warrantyHtml = `<span class="status-pill status-warning" style="font-size:0.72rem; padding:2px 8px; font-weight:600; background:#fef3c7; color:#b45309; border:1px solid #fde68a;">Non-Warranty</span>`;
        } else {
          const days = Utils.getDaysRemaining(a.warrantyEnd);
          if (days !== null && days <= 0) {
            warrantyHtml = `<span class="status-pill status-repair" style="font-size:0.72rem; padding:2px 8px; font-weight:600; background:#fee2e2; color:#b91c1c; border:1px solid #fecaca;">Expired</span>`;
          } else {
            warrantyHtml = `<span style="font-family:var(--font-mono); font-size:0.78rem; font-weight:600; color:var(--text-main);" title="${days !== null ? `${days} days remaining` : ''}">${Utils.formatDate(a.warrantyEnd)}</span>`;
          }
        }

        return `
          <tr data-asset-id="${Utils.escapeHtml(a.id)}" class="${a.isRecentlySaved ? 'row-saved-highlight' : ''}" title="Double-click to edit specifications (CPU, RAM, HDD, Monitor, etc.)" ondblclick="window.ITApp.editAsset('${a.id}')">
            <td class="asset-id-cell"><strong>${Utils.escapeHtml(a.id)}</strong></td>
            <td><span class="badge-device-type">${Utils.escapeHtml(a.type)}</span></td>
            <td>
              ${(a.user && a.user.trim() !== '' && a.user !== 'None' && a.user !== '—' && a.user !== 'Unassigned')
                ? `<strong style="color:#0f172a;">${Utils.escapeHtml(a.user)}</strong>`
                : (a.oldUsername && a.oldUsername.trim() !== '' && a.oldUsername !== 'None' && a.oldUsername !== '—' && a.oldUsername !== 'NEW SYSTEM')
                  ? `<strong title="Previous User: ${Utils.escapeHtml(a.oldUsername)}">${Utils.escapeHtml(a.oldUsername)}</strong>`
                  : '<em style="color:#94a3b8;">Unassigned</em>'}
            </td>
            <td class="cell-work-status">
              ${this.getWorkStatusButton(a.id, a.workStatus)}
            </td>
            <td>
              <span style="font-weight:600; color:#334155; font-size:0.82rem;">${Utils.escapeHtml(teamText)}</span>
              ${tlNote}
            </td>
            <td><span style="font-size:0.82rem; font-weight:600; color:#0f172a;">${Utils.escapeHtml(cpuText)}</span></td>
            <td><span class="badge-spec-ram">${Utils.escapeHtml(ramText)}</span></td>
            <td><span style="font-size:0.82rem; color:${isNoHdd ? '#94a3b8' : '#0f172a'};">${Utils.escapeHtml(hddText)}</span></td>
            <td><span style="font-size:0.82rem; color:${isNoSsd ? '#94a3b8' : '#0f172a'};">${Utils.escapeHtml(ssdText)}</span></td>
            <td><span style="font-size:0.82rem; color:${isNoMon ? '#94a3b8' : '#0f172a'};">${Utils.escapeHtml(monitorText)}</span></td>
            <td><span class="cell-mono-muted">${Utils.escapeHtml(macText)}</span></td>
            <td><span class="status-pill ${statusClass}"><span class="badge-dot"></span>${Utils.escapeHtml(a.status)}</span></td>
            <td>
              <div class="action-btn-group">
                <button class="action-icon-btn btn-action-view" title="View Full Specifications" onclick="window.ITApp.viewAsset('${a.id}')">👁️</button>
                <button class="action-icon-btn btn-action-edit" title="Edit Specifications (CPU, RAM, HDD, Monitor, User, etc.)" onclick="window.ITApp.editAsset('${a.id}')">✏️</button>
              </div>
            </td>
          </tr>
        `;
      }).join('');
    }

    renderFilteredAssetsTable(type) {
      // Re-use all assets view with preset filter
      const typeFilter = document.getElementById('assetsTypeFilter');
      if (typeFilter) {
        typeFilter.value = type;
      }
      const statusFilter = document.getElementById('assetsStatusFilter');
      if (statusFilter) {
        statusFilter.value = 'all';
      }
      this.renderAllAssetsTable();
    }

    /* ==========================================================================
       ASSIGNED USERS TABLE
       ========================================================================== */
    renderAssignedUsersTable() {
      const tbody = document.getElementById('assignedUsersTableBody');
      if (!tbody) return;

      const search = (document.getElementById('assignedUsersSearch')?.value || '').toLowerCase().trim();
      const teamFilter = document.getElementById('assignedUsersTeamFilter')?.value || 'all';
      const typeFilter = document.getElementById('assignedUsersTypeFilter')?.value || 'all';
      const workStatusFilter = document.getElementById('assignedUsersWorkStatusFilter')?.value || 'all';

      // Join assigned assets with user records
      const assignedAssets = store.data.assets.filter(a => a.status === 'Assigned' && a.user);

      let list = assignedAssets.filter(item => {
        const matchesSearch = !search ||
          item.user.toLowerCase().includes(search) ||
          item.id.toLowerCase().includes(search) ||
          item.team.toLowerCase().includes(search);

        const matchesTeam = teamFilter === 'all' || item.team === teamFilter;
        const matchesType = typeFilter === 'all' || item.type === typeFilter;
        const matchesWorkStatus = workStatusFilter === 'all' ||
          (item.workStatus && item.workStatus.toLowerCase() === workStatusFilter.toLowerCase()) ||
          (!item.workStatus && workStatusFilter === 'Currently Working');

        return matchesSearch && matchesTeam && matchesType && matchesWorkStatus;
      });

      if (list.length === 0) {
        tbody.innerHTML = `<tr><td colspan="15" class="empty-state"><div class="empty-icon">👥</div><div class="empty-title">No assigned users match filter</div></td></tr>`;
        return;
      }

      tbody.innerHTML = list.map((item, idx) => {
        const isNoHdd = !item.hdd || item.hdd === '-' || item.hdd === '—' || item.hdd.toLowerCase() === 'none' || item.hdd.toLowerCase() === 'nil';
        const isNoSsd = !item.ssd || item.ssd === '-' || item.ssd === '—' || item.ssd.toLowerCase() === 'none' || item.ssd.toLowerCase() === 'nil';
        const isNoMon = !item.monitor || item.monitor === '-' || item.monitor === '—' || item.monitor.toLowerCase() === 'none' || item.monitor.toLowerCase() === 'nil';
        const tlNote = (item.tl && item.tl !== '-' && item.tl !== item.team)
          ? `<div style="font-size:0.72rem; color:var(--text-muted); margin-top:2px;" title="Team Leader: ${Utils.escapeHtml(item.tl)}"><span style="color:var(--text-faint);">TL:</span> ${Utils.escapeHtml(item.tl)}</div>`
          : '';

        return `
        <tr>
          <td>${idx + 1}</td>
          <td>
            <strong>${Utils.escapeHtml(item.user)}</strong>
          </td>
          <td class="cell-work-status">
            ${this.getWorkStatusButton(item.id, item.workStatus)}
          </td>
          <td>
            <span class="status-pill status-available">${Utils.escapeHtml(item.team)}</span>
            ${tlNote}
          </td>
          <td>${Utils.escapeHtml(item.type)}</td>
          <td><span style="font-family:var(--font-mono); font-weight:600; color:var(--primary-700);">${Utils.escapeHtml(item.id)}</span></td>
          <td><span style="font-size:0.82rem; font-weight:600; color:var(--text-main);">${Utils.escapeHtml(item.cpu || '-')}</span></td>
          <td><span class="status-pill" style="font-size:0.75rem; background:rgba(37,99,235,0.08); color:var(--primary); font-weight:600;">${Utils.escapeHtml(item.ram || '-')}</span></td>
          <td><span style="font-size:0.82rem; color:${isNoHdd ? 'var(--text-faint)' : 'var(--text-main)'};">${isNoHdd ? '-' : Utils.escapeHtml(item.hdd)}</span></td>
          <td><span style="font-size:0.82rem; color:${isNoSsd ? 'var(--text-faint)' : 'var(--text-main)'};">${isNoSsd ? '-' : Utils.escapeHtml(item.ssd)}</span></td>
          <td><span style="font-size:0.82rem; color:${isNoMon ? 'var(--text-faint)' : 'var(--text-main)'};">${isNoMon ? 'None' : Utils.escapeHtml(item.monitor)}</span></td>
          <td>${Utils.escapeHtml(item.oldUsername || '—')}</td>
          <td>${Utils.formatDate(item.assignedDate)}</td>
          <td><span class="status-pill status-assigned">Assigned</span></td>
          <td>
            <div class="action-btn-group">
              <button class="action-icon-btn btn-action-view" title="View Full Specs" onclick="window.ITApp.viewAsset('${item.id}')">👁️</button>
              <button class="action-icon-btn btn-action-edit" title="Edit Assignment &amp; Specs" onclick="window.ITApp.editAsset('${item.id}')">✏️</button>
              <button class="action-icon-btn btn-action-swap" title="Swap System" onclick="window.ITApp.initiateSwapForAsset('${item.id}')">🔄</button>
              <button class="action-icon-btn btn-action-unassign" title="Unassign System" onclick="window.ITApp.unassignSystem('${item.id}')">↩️</button>
            </div>
          </td>
        </tr>
      `;
      }).join('');
    }

    renderAllUsersTable() {
      const tbody = document.getElementById('allUsersTableBody');
      if (!tbody) return;

      const list = store.data.users;
      tbody.innerHTML = list.map((u, i) => `
        <tr>
          <td>${i + 1}</td>
          <td><strong>${Utils.escapeHtml(u.name)}</strong></td>
          <td>${Utils.escapeHtml(u.email)}</td>
          <td>${Utils.escapeHtml(u.team)}</td>
          <td>${u.assetId ? `<span class="status-pill status-assigned">${Utils.escapeHtml(u.assetId)}</span>` : '<span class="status-pill status-warning">No Asset Assigned</span>'}</td>
          <td>${Utils.escapeHtml(u.assetType || '—')}</td>
          <td>${Utils.formatDate(u.joinDate)}</td>
          <td><span class="status-pill ${u.status === 'Assigned' ? 'status-assigned' : 'status-pending'}">${Utils.escapeHtml(u.status)}</span></td>
          <td>
            <div class="action-btn-group">
              ${u.status === 'Pending'
          ? `<button class="btn btn-primary btn-sm" onclick="window.ITApp.assignPendingUser('${u.name}', '${u.team}')">+ Assign System</button>`
          : `<button class="action-icon-btn btn-action-view" title="View User Details" onclick="window.ITApp.viewUser('${u.id}')">👁️</button>
                   ${u.assetId ? `<button class="action-icon-btn btn-action-edit" title="Edit Assigned Asset (${Utils.escapeHtml(u.assetId)})" onclick="window.ITApp.editAsset('${u.assetId}')">✏️</button>` : ''}`}
            </div>
          </td>
        </tr>
      `).join('');
    }

    renderPendingUsersTable() {
      const tbody = document.getElementById('pendingUsersTableBody');
      if (!tbody) return;

      const list = store.data.users.filter(u => u.status === 'Pending');
      if (list.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="empty-state">No pending users awaiting hardware assignment!</td></tr>`;
        return;
      }

      tbody.innerHTML = list.map((u, i) => `
        <tr>
          <td>${i + 1}</td>
          <td><strong>${Utils.escapeHtml(u.name)}</strong></td>
          <td>${Utils.escapeHtml(u.email)}</td>
          <td>${Utils.escapeHtml(u.team)}</td>
          <td>${Utils.escapeHtml(u.assetType)}</td>
          <td>${Utils.formatDate(u.joinDate)}</td>
          <td>
            <button class="btn btn-primary btn-sm" onclick="window.ITApp.assignPendingUser('${u.name}', '${u.team}')">
              + Assign System Now
            </button>
          </td>
        </tr>
      `).join('');
    }

    /* ==========================================================================
       NON-ASSIGNED (AVAILABLE INVENTORY)
       ========================================================================== */
    renderNonAssignedView() {
      const allNonAssigned = store.data.assets.filter(a => a.status === 'Non-Assigned');

      // Metric Summary Cards
      const dskCount = allNonAssigned.filter(a => a.type === 'Desktop').length;
      const lptCount = allNonAssigned.filter(a => a.type === 'Laptop').length;

      const setEl = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.textContent = val;
      };
      setEl('cardNonAssignedViewTotal', allNonAssigned.length);
      setEl('cardAvailDesktop', dskCount);
      setEl('cardAvailLaptop', lptCount);
      const dskPill = document.getElementById('cardAvailDesktopPill');
      if (dskPill) dskPill.textContent = `🖥️ ${dskCount} Dsk`;
      const lptPill = document.getElementById('cardAvailLaptopPill');
      if (lptPill) lptPill.textContent = `💻 ${lptCount} Lpt`;

      const filterType = this.nonAssignedTypeFilter || 'all';
      const searchVal = (document.getElementById('nonAssignedSearchInput')?.value || '').toLowerCase().trim();

      let nonAssigned = filterType === 'all'
        ? allNonAssigned
        : allNonAssigned.filter(a => a.type === filterType);

      if (searchVal) {
        nonAssigned = nonAssigned.filter(a =>
          (a.id && a.id.toLowerCase().includes(searchVal)) ||
          (a.oldUsername && a.oldUsername.toLowerCase().includes(searchVal)) ||
          (a.serialNumber && a.serialNumber.toLowerCase().includes(searchVal)) ||
          (a.cpu && a.cpu.toLowerCase().includes(searchVal)) ||
          (a.ram && a.ram.toLowerCase().includes(searchVal)) ||
          (a.team && a.team.toLowerCase().includes(searchVal))
        );
      }

      // Update active filter button tabs in UI
      document.querySelectorAll('.non-assigned-filter-btn').forEach(btn => {
        if (btn.getAttribute('data-filter') === filterType) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });

      const tbody = document.getElementById('nonAssignedTableBody');
      if (!tbody) return;

      if (nonAssigned.length === 0) {
        tbody.innerHTML = `<tr><td colspan="11" class="empty-state">No available non-assigned ${filterType !== 'all' ? filterType.toLowerCase() + 's' : 'systems'} in stock right now.</td></tr>`;
        return;
      }

      tbody.innerHTML = nonAssigned.map(a => {
        // Requirement: In Non-Assigned Available Pool table, display Current User (a.user)
        // under Previous User column while table heading remains 'Previous User'.
        const userDisplay = (a.user && a.user.trim() !== '' && a.user !== 'None' && a.user !== '—' && a.user !== 'Unassigned')
          ? a.user
          : (a.oldUsername || '—');

        return `
        <tr data-asset-id="${Utils.escapeHtml(a.id)}" class="${a.isRecentlySaved ? 'row-saved-highlight' : ''}" title="Double-click to edit hardware specifications" ondblclick="window.ITApp.editAsset('${a.id}')">
          <td><strong>${Utils.escapeHtml(a.id)}</strong></td>
          <td><span class="status-pill status-available">${Utils.escapeHtml(a.type)}</span></td>
          <td>${Utils.escapeHtml(userDisplay)}</td>
          <td><span style="font-size:0.8rem; font-weight:600; color:var(--text-main);">${Utils.escapeHtml(a.cpu)}</span></td>
          <td><span class="status-pill" style="font-size:0.75rem; background:rgba(37,99,235,0.08); color:var(--primary); font-weight:600;">${Utils.escapeHtml(a.ram)}</span></td>
          <td><span style="font-size:0.82rem; color:${(!a.hdd || a.hdd === '-' || a.hdd === '—' || a.hdd.toLowerCase() === 'none' || a.hdd.toLowerCase() === 'nil') ? 'var(--text-faint)' : 'var(--text-main)'};">${(!a.hdd || a.hdd === '-' || a.hdd === '—' || a.hdd.toLowerCase() === 'none' || a.hdd.toLowerCase() === 'nil') ? '-' : Utils.escapeHtml(a.hdd)}</span></td>
          <td><span style="font-size:0.82rem; color:${(!a.ssd || a.ssd === '-' || a.ssd === '—' || a.ssd.toLowerCase() === 'none' || a.ssd.toLowerCase() === 'nil') ? 'var(--text-faint)' : 'var(--text-main)'};">${(!a.ssd || a.ssd === '-' || a.ssd === '—' || a.ssd.toLowerCase() === 'none' || a.ssd.toLowerCase() === 'nil') ? '-' : Utils.escapeHtml(a.ssd)}</span></td>
          <td><span style="font-family:var(--font-mono); font-size:0.75rem;">${Utils.escapeHtml(a.serialNumber)}</span></td>
          <td>
            ${(() => {
              const ws = (a.workStatus || (a.userExitDate ? 'User Exit' : 'In Stock')).trim();
              const lower = ws.toLowerCase();
              let badgeStyle = '';
              let label = ws;

              if (lower === 'user exit' || lower === 'exit') {
                badgeStyle = 'color:#e11d48; background:#fff1f2; border:1px solid #fecdd3;';
                label = 'User Exit';
              } else if (lower === 'currently working' || lower === 'working' || lower === 'active') {
                badgeStyle = 'color:#059669; background:#ecfdf5; border:1px solid #a7f3d0;';
                label = 'Currently Working';
              } else if (lower === 'work from home' || lower === 'wfh' || lower === 'remote') {
                badgeStyle = 'color:#2563eb; background:#eff6ff; border:1px solid #bfdbfe;';
                label = 'Work From Home';
              } else if (lower.includes('stock') || lower.includes('available')) {
                badgeStyle = 'color:#d97706; background:#fffbeb; border:1px solid #fde68a;';
                label = 'In Stock';
              } else {
                badgeStyle = 'color:#475569; background:#f1f5f9; border:1px solid #cbd5e1;';
                label = ws;
              }

              const dateVal = a.userExitDate || a.availableDate || a.assignedDate;
              const dateFormatted = dateVal ? Utils.formatDate(dateVal) : '';

              return `
                <div style="display:flex; flex-direction:column; gap:2px;">
                  <span style="display:inline-block; font-size:0.68rem; font-weight:700; ${badgeStyle} padding:1px 6px; border-radius:4px; width:fit-content; line-height:1.2;">${Utils.escapeHtml(label)}</span>
                  ${(dateFormatted && dateFormatted !== '—') ? `<span style="font-size:0.82rem; font-weight:600; color:var(--text-main);">${dateFormatted}</span>` : ''}
                </div>
              `;
            })()}
          </td>
          <td><span class="status-pill status-assigned">${Utils.escapeHtml(a.condition || 'Good')}</span></td>
          <td>
            <div class="action-btn-group">
              <button class="btn btn-primary btn-sm" onclick="window.ITApp.quickAssignAsset('${a.id}')">
                ⚡ Quick Assign
              </button>
              <button class="action-icon-btn btn-action-view" title="View Specifications" onclick="window.ITApp.viewAsset('${a.id}')">👁️</button>
              <button class="action-icon-btn btn-action-edit" title="Edit Hardware Specs (CPU, RAM, HDD, Monitor)" onclick="window.ITApp.editAsset('${a.id}')">
                ✏️
              </button>
            </div>
          </td>
        </tr>
      `;
      // Auto-populate default In-Stock Asset ID if form is visible and empty
      this.refreshNextInStockAssetId(false);
    }

    /* ==========================================================================
       IN-STOCK SYSTEM ENTRY & HARDWARE SPECIFICATION METHODS
       ========================================================================== */
    generateNextInStockAssetId(type = 'Desktop') {
      const assets = (store && store.data && store.data.assets) || [];
      const isLap = (type === 'Laptop');
      const prefix = isLap ? 'PIX_LAP_' : 'PIX_DSK_';
      let maxNum = 0;

      assets.forEach(a => {
        if (a && a.id) {
          const idUpper = a.id.toUpperCase();
          if (idUpper.startsWith(prefix)) {
            const numPart = idUpper.replace(prefix, '');
            const n = parseInt(numPart, 10);
            if (!isNaN(n) && n > maxNum) {
              maxNum = n;
            }
          }
        }
      });

      const next = maxNum + 1;
      const formatted = next < 10 ? '0' + next : String(next);
      return `${prefix}${formatted}`;
    }

    refreshNextInStockAssetId(force = false) {
      const idInput = document.getElementById('inStockAssetId');
      if (!idInput) return;
      if (!force && idInput.value && idInput.value.trim() !== '') return;
      const type = document.getElementById('inStockType')?.value || 'Desktop';
      idInput.value = this.generateNextInStockAssetId(type);
    }

    onInStockTypeChange() {
      const typeSelect = document.getElementById('inStockType');
      const type = typeSelect ? typeSelect.value : 'Desktop';
      const idInput = document.getElementById('inStockAssetId');
      if (idInput) {
        idInput.value = this.generateNextInStockAssetId(type);
      }
      const monitorInput = document.getElementById('inStockMonitor');
      if (monitorInput) {
        if (type === 'Laptop') {
          monitorInput.value = 'Laptop Built-in Screen';
        } else if (monitorInput.value === 'Laptop Built-in Screen') {
          monitorInput.value = 'DELL 19.5 inch';
        }
      }
    }

    openInStockEntry() {
      this.navigateTo('non-assigned');
      setTimeout(() => {
        const card = document.getElementById('inStockSystemCard');
        if (card) {
          card.scrollIntoView({ behavior: 'smooth', block: 'start' });
          card.style.transition = 'box-shadow 0.3s ease, border-color 0.3s ease';
          card.style.boxShadow = '0 0 0 4px rgba(37,99,235,0.3)';
          card.style.borderColor = '#2563eb';
          setTimeout(() => {
            card.style.boxShadow = '';
            card.style.borderColor = '#bfdbfe';
          }, 2200);
        }
        const cpuInput = document.getElementById('inStockCpu');
        if (cpuInput) cpuInput.focus();
      }, 100);
    }

    toggleInStockFormCollapse() {
      const content = document.getElementById('inStockFormContent');
      const btn = document.getElementById('inStockCollapseBtn');
      if (!content) return;
      if (content.style.display === 'none') {
        content.style.display = 'block';
        if (btn) btn.textContent = 'Collapse ▴';
      } else {
        content.style.display = 'none';
        if (btn) btn.textContent = 'Expand ▾';
      }
    }

    resetInStockForm() {
      const form = document.getElementById('addInStockSystemForm');
      if (form) form.reset();
      const typeSelect = document.getElementById('inStockType');
      if (typeSelect) typeSelect.value = 'Desktop';
      this.refreshNextInStockAssetId(true);
      const ramInput = document.getElementById('inStockRam');
      if (ramInput) ramInput.value = '8 DDR3';
      const ssdInput = document.getElementById('inStockSsd');
      if (ssdInput) ssdInput.value = '240GB SSD';
      const hddInput = document.getElementById('inStockHdd');
      if (hddInput) hddInput.value = 'None';
      const monitorInput = document.getElementById('inStockMonitor');
      if (monitorInput) monitorInput.value = 'DELL 19.5 inch';
      const osInput = document.getElementById('inStockOs');
      if (osInput) osInput.value = 'Ubuntu 24.04';
      const locInput = document.getElementById('inStockLocation');
      if (locInput) locInput.value = '1ST FLOOR';
      const condSelect = document.getElementById('inStockCondition');
      if (condSelect) condSelect.value = 'Good';
    }

    saveInStockSystem(assignImmediately = false) {
      const type = document.getElementById('inStockType')?.value || 'Desktop';
      const assetId = document.getElementById('inStockAssetId')?.value?.trim();
      const serialNumber = document.getElementById('inStockSerial')?.value?.trim() || '';
      const cpu = document.getElementById('inStockCpu')?.value?.trim();
      const ram = document.getElementById('inStockRam')?.value?.trim();
      const ssd = document.getElementById('inStockSsd')?.value?.trim() || '';
      const hdd = document.getElementById('inStockHdd')?.value?.trim() || 'None';
      const monitor = document.getElementById('inStockMonitor')?.value?.trim() || '';
      const model = document.getElementById('inStockModel')?.value?.trim() || '';
      const os = document.getElementById('inStockOs')?.value?.trim() || (type === 'Desktop' ? 'Ubuntu 24.04' : 'Windows 11 Pro');
      const condition = document.getElementById('inStockCondition')?.value || 'Good';
      const location = document.getElementById('inStockLocation')?.value?.trim() || '1ST FLOOR';
      const ipAddress = document.getElementById('inStockIpAddress')?.value?.trim() || '';
      const warrantyEnd = document.getElementById('inStockWarrantyEnd')?.value || '';
      const remark = document.getElementById('inStockRemark')?.value?.trim() || '';

      if (!assetId) {
        Utils.showToast('Validation Error', 'Please specify an Asset ID for the In-Stock system.', 'error');
        document.getElementById('inStockAssetId')?.focus();
        return;
      }
      if (!cpu) {
        Utils.showToast('Validation Error', 'Please enter CPU configuration (e.g. i5 10th GEN, i7 13700).', 'error');
        document.getElementById('inStockCpu')?.focus();
        return;
      }
      if (!ram) {
        Utils.showToast('Validation Error', 'Please enter RAM memory (e.g. 8 DDR3, 16GB DDR4).', 'error');
        document.getElementById('inStockRam')?.focus();
        return;
      }

      const exists = (store.data.assets || []).some(a => a.id && a.id.toLowerCase() === assetId.toLowerCase());
      if (exists) {
        Utils.showToast('Duplicate Asset ID', `An asset with ID "${assetId}" already exists. Please pick a unique ID.`, 'error');
        document.getElementById('inStockAssetId')?.focus();
        return;
      }

      const defaultSerial = `00:e0:4c:d4:${Math.floor(10 + Math.random() * 89).toString(16)}:${Math.floor(10 + Math.random() * 89).toString(16)}`;
      const defaultHostname = `${type.substring(0, 3).toUpperCase()}-STOCK-${Math.floor(100 + Math.random() * 900)}`;

      const newAsset = {
        id: assetId,
        type: type,
        user: '',
        team: 'IT Stock',
        tl: 'Sundar Sir',
        doa: '-',
        workStatus: 'In Stock',
        status: 'Non-Assigned',
        cpu: cpu,
        ram: ram,
        hdd: hdd || 'None',
        ssd: ssd || 'None',
        monitor: monitor || (type === 'Laptop' ? 'Laptop Built-in Screen' : 'None'),
        serialNumber: serialNumber || defaultSerial,
        hostname: defaultHostname,
        ipAddress: ipAddress || 'DHCP',
        os: os,
        location: location,
        oldUsername: 'None',
        assignedDate: '',
        condition: condition,
        warrantyEnd: warrantyEnd || '',
        warrantyType: 'Full System',
        remark: (remark ? remark + ' | ' : '') + (model ? `Model: ${model}` : 'Registered directly into In-Stock inventory'),
        userExitDate: '',
        availableDate: new Date().toISOString().substring(0, 10),
        isRecentlySaved: true
      };

      store.data.assets.unshift(newAsset);
      store.addActivity(`Added In-Stock System: ${newAsset.id} (${newAsset.cpu})`, newAsset.id, 'IT Admin', 'Success');
      store.save();

      this.updateDashboardMetrics();
      this.renderNonAssignedView();
      if (this.currentView === 'all-assets') this.renderAllAssetsTable();
      this.renderSwapSystemPage();

      if (assignImmediately) {
        Utils.showToast('In-Stock System Registered', `${newAsset.id} added to Stock! Opening immediate assignment...`, 'info');
        this.resetInStockForm();
        this.openQuickAssignModal(newAsset.id);
      } else {
        Utils.showToast('In-Stock System Added', `${newAsset.id} (${newAsset.type}) successfully registered into Available Stock Pool!`, 'success');
        this.resetInStockForm();
      }
    }

    /* ==========================================================================
       SWAP SYSTEM OPERATIONS
       ========================================================================== */

    /* ==========================================================================
       SYSTEM ASSIGNMENT & RETURN WORKFLOW METHODS
       ========================================================================== */
    openQuickAssignModal(assetId) {
      const asset = store.data.assets.find(a => a.id === assetId);
      if (!asset) {
        Utils.showToast('Error', 'Asset not found', 'error');
        return;
      }

      // 1. Populate Preview Specs Card
      const setVal = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.textContent = val;
      };
      setVal('qaPreviewAssetId', asset.id);
      setVal('qaPreviewType', asset.type);
      setVal('qaPreviewCpu', asset.cpu || '—');
      setVal('qaPreviewRam', asset.ram || '—');
      setVal('qaPreviewHdd', asset.hdd || 'None');
      setVal('qaPreviewSsd', asset.ssd || 'None');
      setVal('qaPreviewSerial', (asset.serialNumber || '—').toUpperCase());
      setVal('qaPreviewPrevUser', (asset.user && asset.user.trim() !== '' && asset.user !== 'None' && asset.user !== '—' && asset.user !== 'Unassigned') ? asset.user : (asset.oldUsername || 'None'));
      setVal('qaPreviewCondition', (asset.condition || 'Good') + ' Condition');

      // 2. Set Target ID & Form Fields
      const targetInput = document.getElementById('qaTargetAssetId');
      if (targetInput) targetInput.value = asset.id;

      const userInput = document.getElementById('qaUserName');
      if (userInput) userInput.value = '';

      const empInput = document.getElementById('qaEmployeeId');
      if (empInput) empInput.value = '';

      const teamInput = document.getElementById('qaTeam');
      if (teamInput) teamInput.value = (asset.team && asset.team !== 'None') ? asset.team : '';

      const dateInput = document.getElementById('qaAssignedDate');
      if (dateInput) dateInput.value = new Date().toISOString().substring(0, 10);

      const statusSelect = document.getElementById('qaWorkStatus');
      if (statusSelect) statusSelect.value = 'Currently Working';

      const remarksInput = document.getElementById('qaRemarks');
      if (remarksInput) remarksInput.value = '';

      // 3. Open Modal
      const modal = document.getElementById('quickAssignModal');
      if (modal) {
        modal.style.display = 'flex';
        modal.classList.add('active');
        setTimeout(() => userInput?.focus(), 100);
      }
    }

    submitQuickAssign(event) {
      if (event) event.preventDefault();

      const assetId = document.getElementById('qaTargetAssetId')?.value;
      const userName = document.getElementById('qaUserName')?.value?.trim();
      const employeeId = document.getElementById('qaEmployeeId')?.value?.trim() || '—';
      const team = document.getElementById('qaTeam')?.value?.trim() || 'General';
      const assignedDate = document.getElementById('qaAssignedDate')?.value || new Date().toISOString().substring(0, 10);
      const workStatus = document.getElementById('qaWorkStatus')?.value || 'Currently Working';
      const remarks = document.getElementById('qaRemarks')?.value?.trim() || '';

      if (!assetId || !userName) {
        Utils.showToast('Validation Error', 'Please enter New User Name.', 'error');
        return;
      }

      const asset = store.data.assets.find(a => a.id === assetId);
      if (!asset) {
        Utils.showToast('Error', 'Target asset not found', 'error');
        return;
      }

      // Record Previous User before assignment (must NEVER be deleted)
      const prevUser = (asset.user && asset.user.trim() !== '' && asset.user !== 'None' && asset.user !== '—' && asset.user !== 'Unassigned') ? asset.user : (asset.oldUsername || 'Stock / Initial');

      // 1. Update Asset to Assigned
      asset.status = 'Assigned';
      asset.user = userName;
      asset.employeeId = employeeId;
      asset.empId = employeeId;
      asset.team = team;
      asset.assignedDate = assignedDate;
      asset.workStatus = workStatus;
      if (remarks) asset.remark = remarks;
      // Guarantee previous user is maintained
      if (!asset.oldUsername || asset.oldUsername === 'None') {
        asset.oldUsername = prevUser;
      }

      // 2. Append to Assignment History (Unlimited records per asset)
      if (!store.data.assignmentHistory) store.data.assignmentHistory = [];
      const historyEntry = {
        id: 'HIST_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
        assetId: asset.id,
        assetType: asset.type,
        previousUser: asset.oldUsername || 'Stock',
        newUser: userName,
        employeeId: employeeId,
        team: team,
        assignedDate: assignedDate,
        returnedDate: '—',
        workStatus: workStatus,
        remarks: remarks || ('Assigned to ' + userName),
        timestamp: new Date().toISOString()
      };
      store.data.assignmentHistory.unshift(historyEntry);

      // 3. Sync User Record in Users Table
      if (!store.data.users) store.data.users = [];
      let userObj = store.data.users.find(u => u.name && u.name.toLowerCase() === userName.toLowerCase());
      if (userObj) {
        userObj.status = 'Assigned';
        userObj.assetId = asset.id;
        userObj.assetType = asset.type;
        userObj.team = team;
        if (employeeId && employeeId !== '—') userObj.employeeId = employeeId;
      } else {
        store.data.users.unshift({
          id: 'USR_' + Date.now(),
          name: userName,
          email: userName.toLowerCase().replace(/\s+/g, '.') + '@company.com',
          employeeId: employeeId,
          team: team,
          assetId: asset.id,
          assetType: asset.type,
          status: 'Assigned',
          joinDate: assignedDate
        });
      }

      // 4. Activity Log & Persistence
      store.addActivity(`Assigned ${asset.type} to ${userName}`, asset.id, 'IT Admin', 'Success');
      store.save();

      // Close modal
      const modal = document.getElementById('quickAssignModal');
      if (modal) {
        modal.style.display = 'none';
        modal.classList.remove('active');
      }

      // 5. Toast & Live Refresh
      Utils.showToast('System Assigned', `${asset.id} successfully assigned to ${userName} (${team})`, 'success');
      this.updateDashboardMetrics();
      this.renderNonAssignedView();
      this.renderAssignedSystemsTable();
      if (this.currentView === 'all-assets') this.renderAllAssetsTable();
      if (this.currentView === 'users') this.renderAllUsersTable();
    }

    returnSystemToStock(assetId) {
      const asset = store.data.assets.find(a => a.id === assetId);
      if (!asset) return;

      this.pendingReturnAssetId = assetId;

      const modal = document.getElementById('modalConfirmReturnStock');
      if (modal) {
        const idEl = document.getElementById('confirmReturnAssetId');
        const userEl = document.getElementById('confirmReturnUserName');
        const teamEl = document.getElementById('confirmReturnTeam');
        const specsEl = document.getElementById('confirmReturnAssetSpecs');

        if (idEl) idEl.textContent = asset.id;
        if (userEl) userEl.textContent = asset.user || 'Assigned User';
        if (teamEl) teamEl.textContent = asset.team || '—';
        if (specsEl) {
          const parts = [
            asset.type || 'Hardware',
            asset.cpu,
            asset.ram,
            asset.ssd || asset.hdd
          ].filter(Boolean);
          specsEl.textContent = parts.join(' • ');
        }
        modal.classList.add('active');
      } else {
        // Fallback directly proceed
        this.confirmProceedReturnStock();
      }
    }

    cancelReturnSystemToStock() {
      const modal = document.getElementById('modalConfirmReturnStock');
      if (modal) modal.classList.remove('active');
      this.pendingReturnAssetId = null;
    }

    confirmProceedReturnStock() {
      const modal = document.getElementById('modalConfirmReturnStock');
      if (modal) modal.classList.remove('active');

      const assetId = this.pendingReturnAssetId;
      this.pendingReturnAssetId = null;
      if (!assetId) return;

      const asset = store.data.assets.find(a => a.id === assetId);
      if (!asset) return;

      const currentUser = asset.user || 'Assigned User';
      const returnDate = new Date().toISOString().substring(0, 10);

      // 1. Current user becomes Previous User
      asset.status = 'Non-Assigned';
      asset.oldUsername = currentUser; // Crucial requirement: Current User becomes Previous User!
      asset.user = ''; // Empty unassigned
      asset.availableDate = returnDate;
      asset.assignedDate = returnDate;
      asset.workStatus = 'In Stock';
      asset.remark = `Returned to stock from ${currentUser} on ${returnDate}`;

      // 2. Update Assignment History with Returned Date
      if (!store.data.assignmentHistory) store.data.assignmentHistory = [];
      const activeHist = store.data.assignmentHistory.find(h => h.assetId === asset.id && (h.returnedDate === '—' || !h.returnedDate));
      if (activeHist) {
        activeHist.returnedDate = returnDate;
      } else {
        store.data.assignmentHistory.unshift({
          id: 'HIST_' + Date.now(),
          assetId: asset.id,
          assetType: asset.type,
          previousUser: asset.oldUsername || '—',
          newUser: currentUser,
          employeeId: asset.employeeId || '—',
          team: asset.team || '—',
          assignedDate: asset.assignedDate || returnDate,
          returnedDate: returnDate,
          workStatus: 'Returned to Stock',
          remarks: 'Returned from ' + currentUser,
          timestamp: new Date().toISOString()
        });
      }

      // 3. Update User Status in Users list
      if (store.data.users) {
        const userObj = store.data.users.find(u => u.name && u.name.toLowerCase() === currentUser.toLowerCase());
        if (userObj) {
          userObj.status = 'Pending';
          userObj.assetId = '';
        }
      }

      // 4. Activity Log & Persistence
      store.addActivity(`Returned System to Stock from ${currentUser}`, asset.id, 'IT Admin', 'Success');
      store.save();

      // Async push to backend server
      if (store.isServerConnected) {
        fetch(`/api/assets/${encodeURIComponent(asset.id)}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            status: asset.status,
            user: asset.user,
            oldUsername: asset.oldUsername,
            workStatus: asset.workStatus,
            availableDate: asset.availableDate,
            assignedDate: asset.assignedDate,
            remark: asset.remark
          })
        }).catch(() => { });
      }

      Utils.showToast('System Returned', `${asset.id} returned to Stock. Previous User: ${currentUser}`, 'info');
      this.updateDashboardMetrics();
      this.renderNonAssignedView();
      this.renderAssignedSystemsTable();
      if (this.currentView === 'all-assets') this.renderAllAssetsTable();
      if (this.currentView === 'users') this.renderAllUsersTable();
    }

    filterAssignedSystems(type = 'all') {
      this.assignedSystemsTypeFilter = type;
      // Update UI active tab buttons
      document.querySelectorAll('.assigned-filter-btn').forEach(btn => {
        if (btn.getAttribute('data-filter') === type) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
      this.renderAssignedSystemsTable();
    }

    renderAssignedSystemsTable() {
      const tbody = document.getElementById('currentlyAssignedTableBody');
      if (!tbody) return;

      const typeFilter = this.assignedSystemsTypeFilter || 'all';
      const search = (document.getElementById('assignedSystemsSearch')?.value || '').toLowerCase().trim();

      // Only Desktop and Laptop currently assigned systems
      let list = (store.data.assets || []).filter(a => a.status === 'Assigned' && a.user && (a.type === 'Desktop' || a.type === 'Laptop'));

      if (typeFilter !== 'all') {
        list = list.filter(a => a.type === typeFilter);
      }

      if (search) {
        list = list.filter(a =>
          (a.id && a.id.toLowerCase().includes(search)) ||
          (a.user && a.user.toLowerCase().includes(search)) ||
          (a.employeeId && a.employeeId.toLowerCase().includes(search)) ||
          (a.empId && a.empId.toLowerCase().includes(search)) ||
          (a.team && a.team.toLowerCase().includes(search)) ||
          (a.cpu && a.cpu.toLowerCase().includes(search)) ||
          (a.ram && a.ram.toLowerCase().includes(search))
        );
      }

      if (list.length === 0) {
        tbody.innerHTML = '<tr><td colspan="11" class="empty-state">No currently assigned ' + (typeFilter !== 'all' ? typeFilter.toLowerCase() + 's' : 'systems') + ' found.</td></tr>';
        return;
      }

      tbody.innerHTML = list.map(a => {
        // Status colors: Currently Working = Green, Work From Home = Blue, User Exit = Red
        const ws = a.workStatus || 'Currently Working';
        let statusBadge = '';
        if (ws === 'Currently Working') {
          statusBadge = '<span class="status-pill status-assigned" style="background:#ecfdf5; color:#047857; border:1px solid #a7f3d0; font-weight:600;"><span style="width:6px; height:6px; border-radius:50%; background:#047857; display:inline-block; margin-right:5px;"></span>Currently Working</span>';
        } else if (ws === 'Work From Home') {
          statusBadge = '<span class="status-pill" style="background:#eff6ff; color:#1d4ed8; border:1px solid #bfdbfe; font-weight:600;"><span style="width:6px; height:6px; border-radius:50%; background:#1d4ed8; display:inline-block; margin-right:5px;"></span>Work From Home</span>';
        } else {
          statusBadge = '<span class="status-pill" style="background:#fff1f2; color:#e11d48; border:1px solid #fecdd3; font-weight:600;"><span style="width:6px; height:6px; border-radius:50%; background:#e11d48; display:inline-block; margin-right:5px;"></span>User Exit</span>';
        }

        const empId = a.employeeId || a.empId || '—';
        const ssdVal = a.ssd ? a.ssd : (a.hdd || '—');

        return `
          <tr data-asset-id="${Utils.escapeHtml(a.id)}">
            <td><strong>${Utils.escapeHtml(a.id)}</strong></td>
            <td><span class="status-pill status-available">${Utils.escapeHtml(a.type)}</span></td>
            <td><strong>${Utils.escapeHtml(a.user)}</strong></td>
            <td><span style="font-family:var(--font-mono); font-size:0.78rem; font-weight:600; color:var(--text-muted);">${Utils.escapeHtml(empId)}</span></td>
            <td><span class="badge badge-type" style="font-weight:600;">${Utils.escapeHtml(a.team || '—')}</span></td>
            <td><span style="font-size:0.8rem; font-weight:600; color:var(--text-main);">${Utils.escapeHtml(a.cpu || '—')}</span></td>
            <td><span class="status-pill" style="font-size:0.75rem; background:rgba(37,99,235,0.08); color:var(--primary); font-weight:600;">${Utils.escapeHtml(a.ram || '—')}</span></td>
            <td><span style="font-size:0.82rem; font-weight:600;">${Utils.escapeHtml(ssdVal)}</span></td>
            <td>${Utils.formatDate(a.assignedDate)}</td>
            <td>${statusBadge}</td>
            <td>
              <div class="action-btn-group">
                <button class="btn btn-sm" onclick="window.ITApp.returnSystemToStock('${a.id}')" style="background:#fef3c7; color:#92400e; border:1px solid #fde68a; font-weight:700; font-size:0.74rem; padding:3px 10px;" title="Return this system to stock inventory">
                  ↩ Return to Stock
                </button>
                <button class="action-icon-btn btn-action-view" onclick="window.ITApp.viewAsset('${a.id}')" title="View Full Asset Info">👁️</button>
                <button class="action-icon-btn btn-action-edit" onclick="window.ITApp.editAsset('${a.id}')" title="Edit System Specifications">✏️</button>
              </div>
            </td>
          </tr>
        `;
      }).join('');
    }

    openAssignmentHistoryModal() {
      const modal = document.getElementById('assignmentHistoryModal');
      if (modal) {
        modal.style.display = 'flex';
        modal.classList.add('active');
        this.renderAssignmentHistoryTable();
      }
    }

    renderAssignmentHistoryTable() {
      const tbody = document.getElementById('assignmentHistoryTableBody');
      if (!tbody) return;

      const query = (document.getElementById('historySearchInput')?.value || '').toLowerCase().trim();
      const typeFilter = document.getElementById('historyTypeFilter')?.value || 'all';

      let list = store.data.assignmentHistory || [];

      if (typeFilter !== 'all') {
        list = list.filter(h => h.assetType === typeFilter);
      }

      if (query) {
        list = list.filter(h =>
          (h.assetId && h.assetId.toLowerCase().includes(query)) ||
          (h.newUser && h.newUser.toLowerCase().includes(query)) ||
          (h.previousUser && h.previousUser.toLowerCase().includes(query)) ||
          (h.employeeId && h.employeeId.toLowerCase().includes(query)) ||
          (h.team && h.team.toLowerCase().includes(query)) ||
          (h.remarks && h.remarks.toLowerCase().includes(query))
        );
      }

      if (list.length === 0) {
        tbody.innerHTML = '<tr><td colspan="10" class="empty-state">No assignment history records match your search filter.</td></tr>';
        return;
      }

      tbody.innerHTML = list.map((h, i) => {
        const prev = h.previousUser || 'Stock';
        const curr = h.newUser || '—';
        const flowHtml = `<div style="display:flex; align-items:center; gap:6px;">
          <span style="color:#64748b; font-weight:600;">${Utils.escapeHtml(prev)}</span>
          <span style="color:#2563eb; font-weight:800;">➔</span>
          <strong style="color:#0f172a;">${Utils.escapeHtml(curr)}</strong>
        </div>`;

        return `
          <tr>
            <td>${i + 1}</td>
            <td><strong>${Utils.escapeHtml(h.assetId)}</strong></td>
            <td><span class="status-pill status-available">${Utils.escapeHtml(h.assetType || 'System')}</span></td>
            <td>${flowHtml}</td>
            <td><span style="font-family:var(--font-mono); font-size:0.78rem; font-weight:600;">${Utils.escapeHtml(h.employeeId || '—')}</span></td>
            <td><span class="badge badge-type">${Utils.escapeHtml(h.team || '—')}</span></td>
            <td>${Utils.formatDate(h.assignedDate)}</td>
            <td>${h.returnedDate && h.returnedDate !== '—' ? Utils.formatDate(h.returnedDate) : '<span style="color:#16a34a; font-weight:600;">Active (In Use)</span>'}</td>
            <td><span class="badge" style="background:#f1f5f9; color:#334155; font-size:0.75rem;">${Utils.escapeHtml(h.workStatus || 'Assigned')}</span></td>
            <td><span style="font-size:0.8rem; color:var(--text-muted);">${Utils.escapeHtml(h.remarks || '—')}</span></td>
          </tr>
        `;
      }).join('');
    }

    exportAssignmentHistoryCSV() {
      const list = store.data.assignmentHistory || [];
      const headers = ['#', 'Asset ID', 'Type', 'Previous User', 'New User', 'Employee ID', 'Team', 'Assigned Date', 'Returned Date', 'Work Status', 'Remarks'];
      const rows = [
        headers,
        ...list.map((h, idx) => [
          idx + 1,
          h.assetId,
          h.assetType || 'System',
          h.previousUser || '—',
          h.newUser || '—',
          h.employeeId || '—',
          h.team || '—',
          h.assignedDate || '—',
          h.returnedDate || '—',
          h.workStatus || '—',
          h.remarks || '—'
        ])
      ];
      Utils.exportToCSV('System_Assignment_History_Export', rows);
    }

    renderSwapSystemPage() {
      // 1. Populate Old User Dropdown ONLY with In Stock & User Exit systems
      const oldUserSelect = document.getElementById('swapOldUserSelect');
      if (oldUserSelect) {
        const targetAssets = (store.data.assets || []).filter(a => {
          const ws = (a.workStatus || '').trim().toLowerCase();
          const st = (a.status || '').trim().toLowerCase();
          return ws === 'in stock' || ws === 'user exit' || ws === 'instock' ||
                 st === 'in stock' || st === 'user exit' || st === 'instock' || st === 'non-assigned';
        });

        // Natural sort by ID
        targetAssets.sort((a, b) => (a.id || '').localeCompare(b.id || '', undefined, { numeric: true, sensitivity: 'base' }));

        oldUserSelect.innerHTML = `<option value="">-- Select In Stock / User Exit System to Swap --</option>` +
          targetAssets.map(a => {
            const userName = a.user || (a.oldUsername && a.oldUsername !== 'None' ? a.oldUsername : '') || 'In Stock Pool';
            const isUserExit = (a.workStatus === 'User Exit' || a.status === 'User Exit');
            const statusBadge = isUserExit ? 'User Exit' : 'In Stock';
            const statusIcon = isUserExit ? '🔴' : '📦';
            return `<option value="${Utils.escapeHtml(a.id)}">${statusIcon} ${Utils.escapeHtml(userName)} (${Utils.escapeHtml(a.id)} - ${Utils.escapeHtml(a.team || 'IT Storage')}) [${statusBadge}]</option>`;
          }).join('');
      }

      // 2. Render Swap History Table
      this.renderSwapHistoryTable();
    }

    renderSwapHistoryTable() {
      const tbody = document.getElementById('swapHistoryTableBody');
      if (!tbody) return;

      let list = store.data.swapLogs || [];
      const fromDate = document.getElementById('swapDateFilterFrom')?.value || '';
      const toDate = document.getElementById('swapDateFilterTo')?.value || '';
      const query = (document.getElementById('swapHistorySearch')?.value || '').toLowerCase().trim();

      list = list.filter(s => {
        const dateVal = s.swapDate || '';
        const matchesFrom = !fromDate || dateVal >= fromDate;
        const matchesTo = !toDate || dateVal <= toDate;
        const matchesQuery = !query ||
          (s.id && s.id.toLowerCase().includes(query)) ||
          (s.newUserId && s.newUserId.toLowerCase().includes(query)) ||
          (s.newTeam && s.newTeam.toLowerCase().includes(query)) ||
          (s.newAssetId && s.newAssetId.toLowerCase().includes(query)) ||
          (s.oldUserId && s.oldUserId.toLowerCase().includes(query)) ||
          (s.oldAssetId && s.oldAssetId.toLowerCase().includes(query)) ||
          (s.reason && s.reason.toLowerCase().includes(query)) ||
          (s.status && s.status.toLowerCase().includes(query));
        return matchesFrom && matchesTo && matchesQuery;
      });

      const countEl = document.getElementById('swapRecordCount');
      if (countEl) {
        countEl.textContent = `Showing ${list.length} transaction${list.length === 1 ? '' : 's'}`;
      }

      if (list.length === 0) {
        tbody.innerHTML = `<tr><td colspan="9" class="empty-state">No swap transactions found for selected date/filter criteria.</td></tr>`;
        return;
      }

      tbody.innerHTML = list.map(s => `
        <tr data-swap-id="${Utils.escapeHtml(s.id)}" title="Double-click to edit in System Swap Facility" ondblclick="window.ITApp.editSwapInFacility('${s.id}')">
          <td><strong>${Utils.escapeHtml(s.id)}</strong></td>
          <td><strong>${Utils.escapeHtml(s.newUserId)}</strong> <span style="font-size:0.75rem; color:var(--text-muted);">(${Utils.escapeHtml(s.newTeam)})</span></td>
          <td><span class="status-pill status-assigned">${Utils.escapeHtml(s.newAssetId)}</span></td>
          <td>${Utils.escapeHtml(s.oldUserId)}</td>
          <td><span class="status-pill status-warning">${Utils.escapeHtml(s.oldAssetId)}</span></td>
          <td>${Utils.escapeHtml(s.reason)}</td>
          <td><strong style="color:var(--text-main); font-size:0.82rem;">${Utils.formatDate(s.swapDate)}</strong></td>
          <td><span class="status-pill status-assigned">${Utils.escapeHtml(s.status || 'Completed')}</span></td>
          <td>
            <div style="display:flex; align-items:center; gap:6px;">
              <button type="button" class="btn btn-outline-primary btn-sm" style="padding:2px 8px; font-size:0.75rem; display:inline-flex; align-items:center; gap:4px;" onclick="window.ITApp.viewSwapExtract('${s.id}')" title="View Full Transaction Extract">
                👁️ Extract
              </button>
              <button type="button" class="btn btn-primary btn-sm" style="padding:2px 10px; font-size:0.75rem; display:inline-flex; align-items:center; gap:4px;" onclick="window.ITApp.editSwapInFacility('${s.id}')" title="Edit in System Swap Facility">
                ✏️ Edit
              </button>
            </div>
          </td>
        </tr>
      `).join('');
    }

    /* ==========================================================================
       REQUIREMENTS MANAGEMENT
       ========================================================================== */
    renderRequirementsTable() {
      const tbody = document.getElementById('requirementsTableBody');
      if (!tbody) return;

      const search = (document.getElementById('reqSearchInput')?.value || '').toLowerCase().trim();
      const statusFilter = document.getElementById('reqStatusFilter')?.value || 'all';
      const priorityFilter = document.getElementById('reqPriorityFilter')?.value || 'all';

      let list = store.data.requirements.filter(r => {
        const matchesSearch = !search ||
          r.id.toLowerCase().includes(search) ||
          r.name.toLowerCase().includes(search) ||
          r.requirement.toLowerCase().includes(search);

        const matchesStatus = statusFilter === 'all' || r.status.toLowerCase() === statusFilter.toLowerCase();
        const matchesPriority = priorityFilter === 'all' || r.priority.toLowerCase() === priorityFilter.toLowerCase();

        return matchesSearch && matchesStatus && matchesPriority;
      });

      if (list.length === 0) {
        tbody.innerHTML = `<tr><td colspan="11" class="empty-state">No requirements match current filter.</td></tr>`;
        return;
      }

      tbody.innerHTML = list.map(r => {
        const prioClass = r.priority === 'Urgent' ? 'priority-urgent' :
          r.priority === 'High' ? 'priority-high' :
            r.priority === 'Medium' ? 'priority-medium' : 'priority-low';

        const statusClass = r.status === 'Completed' ? 'status-assigned' :
          r.status === 'Purchase Required' ? 'status-repair' :
            r.status === 'Approved' ? 'status-info' : 'status-warning';

        return `
          <tr>
            <td><strong>${Utils.escapeHtml(r.id)}</strong></td>
            <td><strong>${Utils.escapeHtml(r.name)}</strong></td>
            <td>${Utils.escapeHtml(r.team)}</td>
            <td>${Utils.escapeHtml(r.tl)}</td>
            <td><span style="font-size:0.8rem; color:var(--text-secondary);">${Utils.escapeHtml(r.issue)}</span></td>
            <td><strong>${Utils.escapeHtml(r.requirement)}</strong></td>
            <td><span class="status-pill ${prioClass}">${Utils.escapeHtml(r.priority)}</span></td>
            <td>${Utils.formatDate(r.requestDate)}</td>
            <td>${Utils.formatDate(r.requiredDate)}</td>
            <td><span class="status-pill ${statusClass}">${Utils.escapeHtml(r.status)}</span></td>
            <td>
              <div class="action-btn-group">
                <button class="action-icon-btn" title="Update Status" onclick="window.ITApp.updateReqStatus('${r.id}')">🔄</button>
                <button class="action-icon-btn btn-action-edit" title="Edit Requirement" onclick="window.ITApp.editReq('${r.id}')">✏️</button>
                <button class="action-icon-btn btn-action-delete" title="Delete Requirement" onclick="window.ITApp.deleteReq('${r.id}')">🗑️</button>
              </div>
            </td>
          </tr>
        `;
      }).join('');
    }

    /* ==========================================================================
       NON-IT ASSETS
       ========================================================================== */
    renderNonItAssetsTable() {
      const tbody = document.getElementById('nonItAssetsTableBody');
      if (!tbody) return;

      const search = (document.getElementById('nonItSearchInput')?.value || '').toLowerCase().trim();
      const catFilter = document.getElementById('nonItCatFilter')?.value || 'all';

      let list = store.data.nonItAssets.filter(n => {
        const matchesSearch = !search ||
          n.id.toLowerCase().includes(search) ||
          n.name.toLowerCase().includes(search) ||
          n.location.toLowerCase().includes(search);

        const matchesCat = catFilter === 'all' || n.category === catFilter;
        return matchesSearch && matchesCat;
      });

      if (list.length === 0) {
        tbody.innerHTML = `<tr><td colspan="9" class="empty-state">No Non-IT assets recorded matching filters.</td></tr>`;
        return;
      }

      tbody.innerHTML = list.map(n => `
        <tr>
          <td><strong>${Utils.escapeHtml(n.id)}</strong></td>
          <td><strong>${Utils.escapeHtml(n.name)}</strong></td>
          <td><span class="status-pill status-available">${Utils.escapeHtml(n.category)}</span></td>
          <td>${Utils.escapeHtml(n.brand)}</td>
          <td>${Utils.escapeHtml(n.model)}</td>
          <td>${Utils.escapeHtml(n.location)}</td>
          <td>${Utils.escapeHtml(n.assignedTo)}</td>
          <td><span class="status-pill status-assigned">${Utils.escapeHtml(n.status)}</span></td>
          <td>
            <div class="action-btn-group">
              <button class="action-icon-btn btn-action-view" title="View Details" onclick="window.ITApp.viewNonItAsset('${n.id}')">👁️</button>
              <button class="action-icon-btn btn-action-edit" title="Edit Details" onclick="window.ITApp.editNonItAsset('${n.id}')">✏️</button>
              <button class="action-icon-btn btn-action-delete" title="Delete Asset" onclick="window.ITApp.deleteNonItAsset('${n.id}')">🗑️</button>
            </div>
          </td>
        </tr>
      `).join('');
    }

    /* ==========================================================================
       HARDWARE STOCK & ASSIGNED HARDWARE
       ========================================================================== */
    renderHardwareStockTable() {
      const tbody = document.getElementById('hardwareStockTableBody');
      if (!tbody) return;

      const list = store.data.hardwareStock;
      tbody.innerHTML = list.map(h => {
        const isLow = h.available <= h.minStock;
        return `
          <tr>
            <td><strong>${Utils.escapeHtml(h.name)}</strong></td>
            <td><span class="status-pill status-available">${Utils.escapeHtml(h.category)}</span></td>
            <td>${Utils.escapeHtml(h.brand)}</td>
            <td>${Utils.escapeHtml(h.model)}</td>
            <td><strong>${h.quantity}</strong></td>
            <td><strong style="color: ${isLow ? '#ef4444' : '#10b981'}; font-size:1.05rem;">${h.available}</strong></td>
            <td>${h.minStock}</td>
            <td><span class="status-pill ${isLow ? 'status-repair' : 'status-assigned'}">${isLow ? 'Low Stock' : 'In Stock'}</span></td>
            <td>
              <div class="action-btn-group">
                <button class="btn btn-secondary btn-sm" onclick="window.ITApp.openIssueHardwareModal('${h.id}')">Issue</button>
                <button class="btn btn-outline-primary btn-sm" onclick="window.ITApp.addHardwareStockQty('${h.id}')">+ Stock</button>
              </div>
            </td>
          </tr>
        `;
      }).join('');
    }

    renderAssignedHardwareTable() {
      const tbody = document.getElementById('assignedHardwareTableBody');
      if (!tbody) return;

      const list = store.data.assignedHardware;
      tbody.innerHTML = list.map(a => `
        <tr>
          <td><strong>${Utils.escapeHtml(a.user)}</strong></td>
          <td>${Utils.escapeHtml(a.team)}</td>
          <td><strong>${Utils.escapeHtml(a.hardware)}</strong></td>
          <td>${Utils.escapeHtml(a.brand)}</td>
          <td>${Utils.escapeHtml(a.model)}</td>
          <td><span style="font-family:var(--font-mono); font-size:0.75rem;">${Utils.escapeHtml(a.serialNumber)}</span></td>
          <td>${Utils.formatDate(a.assignedDate)}</td>
          <td><span class="status-pill status-assigned">${Utils.escapeHtml(a.status)}</span></td>
          <td>
            <button class="btn btn-secondary btn-sm" onclick="window.ITApp.returnHardware('${a.id}')">Return</button>
          </td>
        </tr>
      `).join('');
    }

    /* ==========================================================================
       NETWORK (SWITCH / MODEM & BYPASS IP)
       ========================================================================== */
    renderNetworkSwitchesTable() {
      const tbody = document.getElementById('switchModemTableBody');
      if (!tbody) return;

      const switches = store.data.networkSwitches || [];
      if (switches.length === 0) {
        tbody.innerHTML = `<tr><td colspan="12" style="text-align:center; padding:32px; color:var(--text-muted); font-size:0.9rem;">No network switches or gateway modems found. Click <strong>+ Add Switch / Modem</strong> above to register a new device.</td></tr>`;
        return;
      }

      tbody.innerHTML = switches.map(s => `
        <tr>
          <td><strong>${Utils.escapeHtml(s.name)}</strong></td>
          <td><span class="status-pill status-available">${Utils.escapeHtml(s.type)}</span></td>
          <td>${Utils.escapeHtml(s.brand)} ${Utils.escapeHtml(s.model)}</td>
          <td><span style="font-family:var(--font-mono); font-weight:600; color:var(--primary-700);">${Utils.escapeHtml(s.ipAddress)}</span></td>
          <td><span style="font-family:var(--font-mono); font-size:0.75rem;">${Utils.escapeHtml(s.macAddress)}</span></td>
          <td>${Utils.escapeHtml(s.location)}</td>
          <td><strong>${s.portCount}</strong></td>
          <td><span style="color:#ef4444; font-weight:700;">${s.usedPorts}</span></td>
          <td><span style="color:#10b981; font-weight:700;">${s.availablePorts}</span></td>
          <td><span class="status-pill ${s.status === 'Operational' || s.status === 'Online' ? 'status-assigned' : s.status === 'Maintenance' ? 'status-warning' : 'status-danger'}">${Utils.escapeHtml(s.status)}</span></td>
          <td>${Utils.escapeHtml(s.remark)}</td>
          <td>
            <div class="action-btn-group">
              <button class="action-icon-btn btn-action-view" title="View Device Details" onclick="window.ITApp.viewSwitch('${s.id}')">👁️</button>
              <button class="action-icon-btn btn-action-edit" title="Edit Switch" onclick="window.ITApp.editSwitch('${s.id}')">✏️</button>
              <button class="action-icon-btn btn-action-delete" title="Delete Switch" onclick="window.ITApp.deleteSwitch('${s.id}')">🗑️</button>
            </div>
          </td>
        </tr>
      `).join('');
    }

    renderBypassIpTable() {
      const tbody = document.getElementById('bypassIpTableBody');
      if (!tbody) return;

      const bypassList = store.data.bypassIps || [];
      if (bypassList.length === 0) {
        tbody.innerHTML = `<tr><td colspan="11" style="text-align:center; padding:32px; color:var(--text-muted);">No IP whitelist bypass rules configured. Click <strong>+ Add Bypass IP</strong> above to add one.</td></tr>`;
        return;
      }

      tbody.innerHTML = bypassList.map(b => `
        <tr>
          <td><span style="font-family:var(--font-mono); font-weight:700; color:var(--primary-700);">${Utils.escapeHtml(b.ipAddress)}</span></td>
          <td><strong>${Utils.escapeHtml(b.user)}</strong></td>
          <td>${Utils.escapeHtml(b.system || '—')}</td>
          <td><span style="font-family:var(--font-mono); font-size:0.75rem;">${Utils.escapeHtml(b.macAddress || '—')}</span></td>
          <td><span style="font-size:0.8rem;">${Utils.escapeHtml(b.purpose)}</span></td>
          <td>${Utils.escapeHtml(b.approvedBy)}</td>
          <td>${Utils.formatDate(b.startDate)}</td>
          <td>${Utils.formatDate(b.expiryDate)}</td>
          <td><span class="status-pill ${b.status === 'Active' ? 'status-assigned' : b.status === 'Temporary' ? 'status-warning' : 'status-danger'}">${Utils.escapeHtml(b.status)}</span></td>
          <td>${Utils.escapeHtml(b.remark || '—')}</td>
          <td>
            <div class="action-btn-group">
              <button class="action-icon-btn btn-action-view" title="View Bypass Rule" onclick="window.ITApp.viewBypassIp('${b.id}')">👁️</button>
              <button class="action-icon-btn btn-action-edit" title="Edit Bypass Rule" onclick="window.ITApp.editBypassIp('${b.id}')">✏️</button>
              <button class="action-icon-btn btn-action-delete" title="Delete Rule" onclick="window.ITApp.deleteBypassIp('${b.id}')">🗑️</button>
            </div>
          </td>
        </tr>
      `).join('');
    }

    /* ==========================================================================
       MAINTENANCE (ANTIVIRUS, REPAIRS, WARRANTY)
       ========================================================================== */
    renderAntivirusTable() {
      const tbody = document.getElementById('antivirusTableBody');
      if (!tbody) return;

      const avList = store.data.antivirus || [];
      if (avList.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:32px; color:var(--text-muted);">No endpoint antivirus enrollments recorded. Click <strong>+ Enroll Antivirus / EDR</strong> to enroll an endpoint.</td></tr>`;
        return;
      }

      tbody.innerHTML = avList.map(av => `
        <tr>
          <td><strong>${Utils.escapeHtml(av.user)}</strong></td>
          <td><span class="status-pill status-available">${Utils.escapeHtml(av.assetId)}</span></td>
          <td><strong>${Utils.escapeHtml(av.antivirus)}</strong></td>
          <td><span style="font-family:var(--font-mono); font-size:0.75rem;">${Utils.escapeHtml(av.version || 'Latest')}</span></td>
          <td>${Utils.formatDate(av.installDate)}</td>
          <td>${Utils.formatDate(av.expiryDate)}</td>
          <td><span class="status-pill ${av.status === 'Active' ? 'status-assigned' : av.status === 'Expiring Soon' ? 'status-warning' : 'status-danger'}">${Utils.escapeHtml(av.status)}</span></td>
          <td>
            <div class="action-btn-group">
              <button class="action-icon-btn btn-action-view" title="View Antivirus Details" onclick="window.ITApp.viewAntivirus('${av.id}')">👁️</button>
              <button class="action-icon-btn btn-action-edit" title="Edit Enrollment" onclick="window.ITApp.editAntivirus('${av.id}')">✏️</button>
              <button class="action-icon-btn btn-action-delete" title="Delete Enrollment" onclick="window.ITApp.deleteAntivirus('${av.id}')">🗑️</button>
            </div>
          </td>
        </tr>
      `).join('');
    }

    renderRepairsTable() {
      const tbody = document.getElementById('repairsTableBody');
      if (!tbody) return;

      const repList = store.data.repairs || [];
      if (repList.length === 0) {
        tbody.innerHTML = `<tr><td colspan="11" style="text-align:center; padding:32px; color:var(--text-muted);">No hardware repairs or RMA tickets in progress. Click <strong>+ Log Repair Ticket</strong> to open a ticket.</td></tr>`;
        return;
      }

      tbody.innerHTML = repList.map(r => `
        <tr>
          <td><strong>${Utils.escapeHtml(r.assetId)}</strong></td>
          <td>${Utils.escapeHtml(r.user)}</td>
          <td><span style="color:#ef4444; font-weight:600;">${Utils.escapeHtml(r.issue)}</span></td>
          <td>${Utils.formatDate(r.date)}</td>
          <td>${Utils.escapeHtml(r.vendor)}</td>
          <td><strong>${Utils.escapeHtml(r.cost || '$0')}</strong></td>
          <td>${Utils.formatDate(r.expectedReturn)}</td>
          <td>${r.actualReturn ? Utils.formatDate(r.actualReturn) : '<em style="color:var(--text-faint);">In Service</em>'}</td>
          <td><span class="status-pill ${r.status === 'Repaired & Returned' ? 'status-assigned' : r.status === 'Under Repair' ? 'status-repair' : 'status-warning'}">${Utils.escapeHtml(r.status)}</span></td>
          <td>${Utils.escapeHtml(r.remark || '—')}</td>
          <td>
            <div class="action-btn-group">
              <button class="action-icon-btn btn-action-view" title="View Ticket Details" onclick="window.ITApp.viewRepair('${r.id}')">👁️</button>
              <button class="action-icon-btn btn-action-edit" title="Edit Ticket" onclick="window.ITApp.editRepair('${r.id}')">✏️</button>
              ${r.status !== 'Repaired & Returned' ? `<button class="btn btn-primary btn-sm" style="padding:2px 8px; font-size:0.75rem;" title="Mark as Repaired & Return to Pool" onclick="window.ITApp.markRepaired('${r.id}')">Return to Pool</button>` : ''}
              <button class="action-icon-btn btn-action-delete" title="Delete Ticket" onclick="window.ITApp.deleteRepair('${r.id}')">🗑️</button>
            </div>
          </td>
        </tr>
      `).join('');
    }

    renderWarrantyTable() {
      const tbody = document.getElementById('warrantyTableBody');
      if (!tbody) return;

      tbody.innerHTML = (store.data.assets || []).map(a => {
        const days = Utils.getDaysRemaining(a.warrantyEnd);
        let badgeClass = 'status-assigned';
        let statusText = 'Active Warranty';

        if (days === null) {
          statusText = 'No Record';
          badgeClass = 'status-warning';
        } else if (days < 0) {
          statusText = 'Warranty Expired';
          badgeClass = 'status-repair';
        } else if (days <= 30) {
          statusText = 'Expiring Soon (< 30d)';
          badgeClass = 'status-warning';
        }

        return `
          <tr style="${days !== null && days <= 30 ? 'background-color: #fffbeb;' : ''}">
            <td><strong>${Utils.escapeHtml(a.id)}</strong></td>
            <td>${a.user ? `<strong>${Utils.escapeHtml(a.user)}</strong>` : '<em style="color:var(--text-faint);">Inventory</em>'}</td>
            <td><span class="status-pill status-available">${Utils.escapeHtml(a.type)}</span></td>
            <td>${Utils.formatDate(a.assignedDate || '2024-01-01')}</td>
            <td>${Utils.formatDate(a.assignedDate || '2024-01-01')}</td>
            <td><strong>${Utils.formatDate(a.warrantyEnd)}</strong></td>
            <td><strong style="color: ${days <= 30 ? '#ef4444' : '#10b981'};">${days !== null ? `${days} Days` : '—'}</strong></td>
            <td><span class="status-pill ${badgeClass}">${statusText}</span></td>
            <td>
              <div class="action-btn-group">
                <button class="action-icon-btn btn-action-view" title="View Asset Spec" onclick="window.ITApp.viewAsset('${a.id}')">👁️</button>
                <button class="action-icon-btn btn-action-edit" title="Extend / Update Warranty" onclick="window.ITApp.openEditWarrantyModal('${a.id}')">✏️</button>
              </div>
            </td>
          </tr>
        `;
      }).join('');
    }

    /* ==========================================================================
       REPORTS ENGINE (CSV EXPORT & PRINT)
       ========================================================================== */
    renderReportsView() {
      const select = document.getElementById('reportTypeSelect');
      if (select) {
        this.generateReportPreview(select.value);
      }
    }

    generateReportPreview(reportType) {
      const container = document.getElementById('reportResultsContainer');
      if (!container) return;

      let title = '';
      let headers = [];
      let rows = [];

      if (reportType === 'total-asset') {
        title = 'Total Asset Summary Report';
        headers = ['Asset ID', 'Type', 'User', 'Team', 'CPU', 'RAM', 'Serial No', 'Status'];
        rows = store.data.assets.map(a => [a.id, a.type, a.user || 'None', a.team, a.cpu, a.ram, a.serialNumber, a.status]);
      } else if (reportType === 'assigned-asset') {
        title = 'Assigned Asset Allocation Report';
        headers = ['Asset ID', 'User', 'Team', 'Type', 'Assigned Date', 'Monitor', 'Location'];
        rows = store.data.assets.filter(a => a.status === 'Assigned').map(a => [a.id, a.user, a.team, a.type, a.assignedDate, a.monitor, a.location]);
      } else if (reportType === 'non-assigned') {
        title = 'Available Non-Assigned Inventory Report';
        headers = ['Asset ID', 'Type', 'CPU', 'RAM', 'Storage', 'Condition', 'Location'];
        rows = store.data.assets.filter(a => a.status === 'Non-Assigned').map(a => [a.id, a.type, a.cpu, a.ram, a.ssd || a.hdd, a.condition, a.location]);
      } else if (reportType === 'requirements') {
        title = 'Hardware Requirements & Procurement Status';
        headers = ['Req ID', 'Requester', 'Team', 'Requirement', 'Priority', 'Status'];
        rows = store.data.requirements.map(r => [r.id, r.name, r.team, r.requirement, r.priority, r.status]);
      } else if (reportType === 'repairs') {
        title = 'Repair & Maintenance Log Report';
        headers = ['Asset ID', 'User', 'Issue', 'Vendor', 'Cost', 'Status'];
        rows = store.data.repairs.map(r => [r.assetId, r.user, r.issue, r.vendor, r.cost, r.status]);
      } else {
        title = 'Warranty Status Report';
        headers = ['Asset ID', 'User', 'Type', 'Warranty End', 'Days Remaining'];
        rows = store.data.assets.map(a => [a.id, a.user || 'None', a.type, a.warrantyEnd, Utils.getDaysRemaining(a.warrantyEnd)]);
      }

      container.innerHTML = `
        <div style="margin-bottom: 16px; display:flex; justify-content:space-between; align-items:center;">
          <h3 style="font-size:1.1rem; font-weight:700;">${title} (${rows.length} records)</h3>
          <div style="display:flex; gap:10px;">
            <button class="btn btn-secondary btn-sm" onclick="window.print()">🖨️ Print Report</button>
            <button class="btn btn-primary btn-sm" onclick="window.ITApp.exportCurrentReport('${reportType}')">📥 Export CSV</button>
          </div>
        </div>
        <div class="table-container">
          <table class="data-table">
            <thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead>
            <tbody>${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody>
          </table>
        </div>
      `;
    }

    /* ==========================================================================
       SETTINGS & BACKUP / RESTORE
       ========================================================================== */
    renderSettingsView() {
      const companyInput = document.getElementById('settingsCompanyName');
      if (companyInput) companyInput.value = store.data.settings.companyName;

      const adminInput = document.getElementById('settingsAdminName');
      if (adminInput) adminInput.value = store.data.settings.adminName;

      this.renderSettingsTeamList();
    }

    populateCpuDropdown() {
      const cpuFilter = document.getElementById('assetsCpuFilter');
      if (!cpuFilter) return;

      const currentVal = cpuFilter.value || 'all';
      const cpus = Array.from(new Set(
        (store.data.assets || [])
          .map(a => a.cpu ? a.cpu.trim() : '')
          .filter(Boolean)
      )).sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));

      // Only rebuild options if options have changed or only 1 option exists
      const existingOptions = Array.from(cpuFilter.options).map(o => o.value).filter(v => v !== 'all');
      const hasSameOptions = existingOptions.length === cpus.length && existingOptions.every((v, i) => v === cpus[i]);

      if (!hasSameOptions || cpuFilter.options.length <= 1) {
        cpuFilter.innerHTML = `<option value="all">All CPUs</option>` +
          cpus.map(cpu => `<option value="${Utils.escapeHtml(cpu)}">${Utils.escapeHtml(cpu)}</option>`).join('');
        if (currentVal && (currentVal === 'all' || cpus.includes(currentVal))) {
          cpuFilter.value = currentVal;
        }
      }
    }

    populateTeamDropdowns() {
      const teams = store.data.settings.teams || ['SYSTEM ADMIN', 'PHP', 'MOBIL TEAM', 'AI', 'ADMIN', 'ACCOUNT', 'HR'];

      // 1. Populate teamsDatalist for manual entry with suggestions
      const datalist = document.getElementById('teamsDatalist');
      if (datalist) {
        datalist.innerHTML = teams.map(t => `<option value="${t}">`).join('');
      }

      // If newUserTeamInput is a select (fallback), update it
      const newUserTeam = document.getElementById('newUserTeamInput');
      if (newUserTeam && newUserTeam.tagName === 'SELECT') {
        const val = newUserTeam.value;
        newUserTeam.innerHTML = teams.map(t => `<option value="${t}">${t}</option>`).join('');
        if (teams.includes(val)) newUserTeam.value = val;
      }

      // 2. Assigned Users Filter & All Assets Team Filter
      const userFilter = document.getElementById('assignedUsersTeamFilter');
      if (userFilter) {
        const val = userFilter.value;
        userFilter.innerHTML = `<option value="all">All Departments</option>` + teams.map(t => `<option value="${t}">${t}</option>`).join('');
        if (val) userFilter.value = val;
      }

      const assetsTeamFilter = document.getElementById('assetsTeamFilter');
      if (assetsTeamFilter) {
        const curVal = assetsTeamFilter.value || 'all';
        const allAssetTeams = Array.from(new Set([
          ...teams,
          ...(store.data.assets || []).map(a => a.team ? a.team.trim() : '').filter(Boolean)
        ])).sort((a, b) => a.localeCompare(b));
        assetsTeamFilter.innerHTML = `<option value="all">All Departments</option>` + allAssetTeams.map(t => `<option value="${t}">${t}</option>`).join('');
        if (curVal && (curVal === 'all' || allAssetTeams.includes(curVal))) {
          assetsTeamFilter.value = curVal;
        }
      }

      // 3. Swap Form New Team
      const swapTeam = document.querySelector('select[name="swapNewTeam"]');
      if (swapTeam) {
        const val = swapTeam.value;
        swapTeam.innerHTML = teams.map(t => `<option value="${t}">${t}</option>`).join('');
        if (teams.includes(val)) swapTeam.value = val;
      }

      // 4. Requirements Form Team
      const reqTeam = document.querySelector('select[name="reqTeam"]');
      if (reqTeam) {
        const val = reqTeam.value;
        reqTeam.innerHTML = teams.map(t => `<option value="${t}">${t}</option>`).join('');
        if (teams.includes(val)) reqTeam.value = val;
      }

      // 5. Reports Department Filter
      const reportsTeam = document.getElementById('reportsTeamFilter');
      if (reportsTeam) {
        const val = reportsTeam.value;
        reportsTeam.innerHTML = `<option value="all">All Departments</option>` + teams.map(t => `<option value="${t}">${t}</option>`).join('');
        if (val) reportsTeam.value = val;
      }

      // 6. Edit Asset Modal Team Select
      const editTeam = document.getElementById('editAssetTeam');
      if (editTeam) {
        const val = editTeam.value;
        editTeam.innerHTML = teams.map(t => `<option value="${t}">${t}</option>`).join('');
        if (val && teams.includes(val)) editTeam.value = val;
      }

      // 7. All Assets Inventory Team Filter
      const assetsTeam = document.getElementById('assetsTeamFilter');
      if (assetsTeam) {
        const val = assetsTeam.value;
        assetsTeam.innerHTML = `<option value="all">All Departments</option>` + teams.map(t => `<option value="${t}">${t}</option>`).join('');
        if (val) assetsTeam.value = val;
      }

      // 8. Settings Team Badge List
      this.renderSettingsTeamList();
    }

    renderSettingsTeamList() {
      const container = document.getElementById('settingsTeamsBadgeList');
      if (!container) return;
      const teams = store.data.settings.teams || [];
      container.innerHTML = teams.map(t => `
        <span class="status-pill" style="font-size:0.86rem; padding: 6px 12px; display:inline-flex; align-items:center; gap:8px; border:1px solid var(--primary-200); background:var(--primary-50); color:var(--primary-900);">
          <strong>${Utils.escapeHtml(t)}</strong>
          <button type="button" style="background:none; border:none; cursor:pointer; color:#ef4444; font-weight:700; font-size:1rem; padding:0 2px; line-height:1;" title="Remove ${t}" onclick="window.ITApp.deleteTeam('${t}')">✕</button>
        </span>
      `).join('');
    }

    /* ==========================================================================
       FORM HANDLERS
       ========================================================================== */
    setupForms() {
      // Automatic Serial Number / MAC Address Formatter (- to : and lowercase)
      const attachMacSerialFormatter = (inputEl) => {
        if (!inputEl) return;
        const formatVal = () => {
          const start = inputEl.selectionStart;
          const end = inputEl.selectionEnd;
          const formatted = inputEl.value.replace(/-/g, ':').toLowerCase();
          if (inputEl.value !== formatted) {
            inputEl.value = formatted;
            if (start !== null && end !== null) {
              inputEl.setSelectionRange(start, end);
            }
          }
        };
        inputEl.addEventListener('input', formatVal);
        inputEl.addEventListener('paste', () => setTimeout(formatVal, 0));
        inputEl.addEventListener('blur', () => {
          inputEl.value = inputEl.value.replace(/-/g, ':').toLowerCase().trim();
        });
      };

      attachMacSerialFormatter(document.getElementById('newUserSerialNumber'));
      attachMacSerialFormatter(document.getElementById('editAssetSerialNumber'));

      // 1. Add New User Form
      const newUserForm = document.getElementById('addNewUserForm');
      const newUserNameInput = document.getElementById('newUserNameInput');
      const newUserNameError = document.getElementById('newUserNameError');

      if (newUserNameInput && newUserNameError) {
        const checkUserDuplicate = () => {
          const val = newUserNameInput.value.trim();
          if (!val) {
            newUserNameInput.classList.remove('is-invalid');
            newUserNameError.style.display = 'none';
            newUserNameError.innerHTML = '';
            return false;
          }
          const existsInUsers = store.data.users && store.data.users.some(u => u.name && u.name.trim().toLowerCase() === val.toLowerCase());
          const existsInAssets = store.data.assets && store.data.assets.some(a => a.user && a.user.trim().toLowerCase() === val.toLowerCase());

          if (existsInUsers || existsInAssets) {
            newUserNameInput.classList.add('is-invalid');
            newUserNameError.style.display = 'flex';
            newUserNameError.innerHTML = `<span>⚠️</span> <span>User "<strong>${Utils.escapeHtml(val)}</strong>" already exists! Entry not allowed. Please enter a unique name.</span>`;
            return true;
          } else {
            newUserNameInput.classList.remove('is-invalid');
            newUserNameError.style.display = 'none';
            newUserNameError.innerHTML = '';
            return false;
          }
        };

        newUserNameInput.addEventListener('input', checkUserDuplicate);
        newUserNameInput.addEventListener('blur', checkUserDuplicate);
      }

      // 1.b Old Username auto-fill for Add New User / Add Asset form
      const oldUserInput = document.getElementById('newUserOldUsername');
      const oldUserNotice = document.getElementById('newUserOldUsernameNotice');

      if (oldUserInput) {
        const handleOldUserLookup = () => {
          const rawVal = oldUserInput.value.trim();
          // Extract clean user name if entered as "Name [Team]" or "Name (Team)"
          const val = rawVal.replace(/\s*\[.*?\]/g, '').replace(/\s*\(.*?\)/g, '').trim().toLowerCase();
          if (!val) {
            if (oldUserNotice) {
              oldUserNotice.style.display = 'none';
              oldUserNotice.innerHTML = '';
            }
            return;
          }

          // Search in assets first (by user name)
          let asset = (store.data.assets || []).find(a => a.user && a.user.trim().toLowerCase() === val);

          // If not found, check previous user field in assets
          if (!asset) {
            asset = (store.data.assets || []).find(a => a.oldUsername && a.oldUsername.trim().toLowerCase() === val);
          }

          // If not found, check users table for assetId
          if (!asset) {
            const userObj = (store.data.users || []).find(u => u.name && u.name.trim().toLowerCase() === val);
            if (userObj && userObj.assetId) {
              asset = (store.data.assets || []).find(a => a.id && a.id.toLowerCase() === userObj.assetId.toLowerCase());
            }
          }

          // Also check swap logs if needed
          if (!asset) {
            const swap = (store.data.swapLogs || []).find(s => s.oldUserId && s.oldUserId.trim().toLowerCase() === val);
            if (swap && swap.oldAssetId) {
              asset = (store.data.assets || []).find(a => a.id && a.id.toLowerCase() === swap.oldAssetId.toLowerCase());
            }
          }

          if (asset) {
            // Auto-fill all specifications & system details
            const cpuEl = document.getElementById('newUserCpu');
            if (cpuEl) cpuEl.value = asset.cpu || '';

            const ramEl = document.getElementById('newUserRam');
            if (ramEl) ramEl.value = asset.ram || '';

            const hddEl = document.getElementById('newUserHdd');
            if (hddEl) hddEl.value = asset.hdd || 'None';

            const ssdEl = document.getElementById('newUserSsd');
            if (ssdEl) ssdEl.value = asset.ssd || '';

            const monitorEl = document.getElementById('newUserMonitor');
            if (monitorEl) monitorEl.value = asset.monitor || '';

            const assetIdEl = document.getElementById('newUserAssetId');
            if (assetIdEl) assetIdEl.value = asset.id || '';

            const serialEl = document.getElementById('newUserSerialNumber');
            if (serialEl) serialEl.value = asset.serialNumber || '';

            const osEl = document.getElementById('newUserOs');
            if (osEl) osEl.value = asset.os || 'Windows 11 Pro';

            const ipEl = document.getElementById('newUserIpAddress');
            if (ipEl) ipEl.value = asset.ipAddress || '';

            const hostnameEl = document.getElementById('newUserHostname');
            if (hostnameEl) hostnameEl.value = asset.hostname || '';

            const typeEl = document.getElementById('newUserAssetType');
            if (typeEl && asset.type) typeEl.value = asset.type;

            const locationEl = document.getElementById('newUserOfficeLocation');
            if (locationEl && asset.location) locationEl.value = asset.location;

            const teamEl = document.getElementById('newUserTeamInput');
            if (teamEl && asset.team) teamEl.value = asset.team;

            const workStatusEl = document.getElementById('newUserWorkStatus');
            if (workStatusEl) workStatusEl.value = 'Currently Working';

            if (oldUserNotice) {
              oldUserNotice.style.display = 'block';
              oldUserNotice.style.background = 'var(--primary-50)';
              oldUserNotice.style.border = '1px solid var(--primary-200)';
              oldUserNotice.style.borderRadius = 'var(--radius-sm)';
              oldUserNotice.style.padding = '8px 12px';
              oldUserNotice.style.marginTop = '6px';
              oldUserNotice.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:center;">
                  <strong style="color:var(--primary-800); font-size:0.8rem;">⚡ Auto-Filled from Previous User: ${Utils.escapeHtml(asset.user || val)}</strong>
                  <span class="status-pill status-available" style="font-size:0.7rem;">${Utils.escapeHtml(asset.id)}</span>
                </div>
                <div style="font-size:0.76rem; color:var(--text-secondary); margin-top:2px;">
                  ${Utils.escapeHtml(asset.type || 'Desktop')} • ${Utils.escapeHtml(asset.cpu || '')} • ${Utils.escapeHtml(asset.ram || '')} • ${Utils.escapeHtml(asset.ssd || asset.hdd || '')} • ${Utils.escapeHtml(asset.os || '')}
                </div>
                <div style="font-size:0.72rem; color:var(--success); font-weight:600; margin-top:3px;">
                  ✓ All fields auto-filled! You can still edit or type any field manually.
                </div>
              `;
            }
          } else {
            if (oldUserNotice) {
              oldUserNotice.style.display = 'none';
              oldUserNotice.innerHTML = '';
            }
          }
        };

        oldUserInput.addEventListener('input', handleOldUserLookup);
        oldUserInput.addEventListener('change', handleOldUserLookup);
      }

      if (newUserForm) {
        newUserForm.addEventListener('reset', () => {
          if (newUserNameInput) newUserNameInput.classList.remove('is-invalid');
          if (newUserNameError) {
            newUserNameError.style.display = 'none';
            newUserNameError.innerHTML = '';
          }
          if (oldUserNotice) {
            oldUserNotice.style.display = 'none';
            oldUserNotice.innerHTML = '';
          }
        });

        newUserForm.addEventListener('submit', (e) => {
          e.preventDefault();
          this.handleCreateNewUser(new FormData(newUserForm));
        });
      }

      // 2. Swap System Form
      const swapForm = document.getElementById('swapSystemForm');
      if (swapForm) {
        swapForm.addEventListener('submit', (e) => {
          e.preventDefault();
          this.handleConfirmSwap(new FormData(swapForm));
        });

        swapForm.addEventListener('reset', () => {
          setTimeout(() => {
            const autoBanner = document.getElementById('swapAutoFillBanner');
            if (autoBanner) autoBanner.style.display = 'none';
          }, 50);
        });

        // Auto populate old system details AND auto-apply specs to Replacement System
        const oldUserSelect = document.getElementById('swapOldUserSelect');
        if (oldUserSelect) {
          oldUserSelect.addEventListener('change', (e) => {
            const assetId = e.target.value;
            const asset = store.data.assets.find(a => a.id === assetId);
            if (asset) {
              const oldUserDisplay = asset.user || (asset.oldUsername && asset.oldUsername !== 'None' ? asset.oldUsername : '') || 'In Stock Pool';
              // 1. Populate Left Column (OLD USER / CURRENT SYSTEM)
              document.getElementById('swapOldTeam').value = asset.team || 'IT Storage';
              document.getElementById('swapOldAssetId').value = asset.id || '';
              document.getElementById('swapOldDetails').value = `${asset.type} • ${asset.cpu} • ${asset.ram} • ${asset.ssd || asset.hdd}`;
              document.getElementById('swapOldUsername').value = oldUserDisplay;

              // 2. Auto-apply to Right Column (NEW REPLACEMENT SYSTEM ALLOCATION)
              // Auto-populate New Asset ID with Old Asset ID
              const newAssetIdInput = document.getElementById('swapNewAssetId');
              if (newAssetIdInput) {
                newAssetIdInput.value = asset.id || '';
              }

              // User Name (Default to previous user name if available)
              const newUserInput = document.getElementById('swapNewUserInput');
              if (newUserInput && oldUserDisplay !== 'In Stock Pool') {
                newUserInput.value = oldUserDisplay;
              }

              // Team
              const newTeamSelect = document.getElementById('swapNewTeamSelect');
              if (newTeamSelect && asset.team) {
                newTeamSelect.value = asset.team;
              }

              // Replacement Asset Type (Desktop or Laptop)
              const assetTypeSelect = document.getElementById('swapAssetTypeSelect');
              if (assetTypeSelect && asset.type) {
                assetTypeSelect.value = asset.type;
              }

              // CPU Configuration (Auto-apply old CPU)
              const cpuInput = document.getElementById('swapCpuInput');
              if (cpuInput) {
                cpuInput.value = asset.cpu || '';
              }

              // RAM (Auto-apply old RAM)
              const ramSelect = document.getElementById('swapRamSelect');
              if (ramSelect && asset.ram) {
                let found = false;
                for (let i = 0; i < ramSelect.options.length; i++) {
                  if (ramSelect.options[i].value.toLowerCase() === asset.ram.toLowerCase()) {
                    ramSelect.selectedIndex = i;
                    found = true;
                    break;
                  }
                }
                if (!found) {
                  const opt = new Option(asset.ram, asset.ram, true, true);
                  ramSelect.add(opt);
                }
              }

              // SSD (Auto-apply old SSD)
              const ssdSelect = document.getElementById('swapSsdSelect');
              if (ssdSelect && asset.ssd) {
                let found = false;
                for (let i = 0; i < ssdSelect.options.length; i++) {
                  if (ssdSelect.options[i].value.toLowerCase() === asset.ssd.toLowerCase()) {
                    ssdSelect.selectedIndex = i;
                    found = true;
                    break;
                  }
                }
                if (!found && asset.ssd !== 'None') {
                  const opt = new Option(asset.ssd, asset.ssd, true, true);
                  ssdSelect.add(opt);
                }
              }

              // HDD (Auto-apply old HDD)
              const hddSelect = document.getElementById('swapHddSelect');
              if (hddSelect && asset.hdd) {
                let found = false;
                for (let i = 0; i < hddSelect.options.length; i++) {
                  if (hddSelect.options[i].value.toLowerCase() === asset.hdd.toLowerCase()) {
                    hddSelect.selectedIndex = i;
                    found = true;
                    break;
                  }
                }
                if (!found && asset.hdd !== 'None') {
                  const opt = new Option(asset.hdd, asset.hdd, true, true);
                  hddSelect.add(opt);
                }
              }

              // Monitor Model (Auto-apply old Monitor)
              const monitorInput = document.getElementById('swapMonitorInput');
              if (monitorInput) {
                monitorInput.value = asset.monitor || '';
              }

              // Assigned Date
              const assignedDateInput = document.getElementById('swapAssignedDateInput');
              if (assignedDateInput && !assignedDateInput.value) {
                assignedDateInput.value = new Date().toISOString().substring(0, 10);
              }

              // Display visual auto-applied banner
              const autoBanner = document.getElementById('swapAutoFillBanner');
              if (autoBanner) {
                autoBanner.style.display = 'flex';
              }

              Utils.showToast('Specs Auto-Applied', `Applied ${asset.user || asset.id}'s CPU (${asset.cpu}) & RAM (${asset.ram}) to Replacement System.`);
            } else {
              document.getElementById('swapOldTeam').value = '';
              document.getElementById('swapOldAssetId').value = '';
              document.getElementById('swapOldDetails').value = '';
              document.getElementById('swapOldUsername').value = '';

              const newAssetIdInput = document.getElementById('swapNewAssetId');
              if (newAssetIdInput) newAssetIdInput.value = '';

              const autoBanner = document.getElementById('swapAutoFillBanner');
              if (autoBanner) autoBanner.style.display = 'none';
            }
          });
        }
      }

      // 3. New Requirement Form
      const reqForm = document.getElementById('newRequirementForm');
      if (reqForm) {
        reqForm.addEventListener('submit', (e) => {
          e.preventDefault();
          this.handleCreateRequirement(new FormData(reqForm));
        });
      }

      // 4. Add Non-IT Asset Form
      const nonItForm = document.getElementById('addNonItAssetForm');
      if (nonItForm) {
        nonItForm.addEventListener('submit', (e) => {
          e.preventDefault();
          this.handleCreateNonItAsset(new FormData(nonItForm));
        });
      }

      // Switch & Modem Form
      const addSwitchForm = document.getElementById('addSwitchForm');
      if (addSwitchForm) {
        addSwitchForm.addEventListener('submit', (e) => {
          e.preventDefault();
          this.handleSaveSwitch(new FormData(addSwitchForm));
        });
      }

      // Bypass IP Form
      const addBypassIpForm = document.getElementById('addBypassIpForm');
      if (addBypassIpForm) {
        addBypassIpForm.addEventListener('submit', (e) => {
          e.preventDefault();
          this.handleSaveBypassIp(new FormData(addBypassIpForm));
        });
      }

      // Antivirus Form
      const addAntivirusForm = document.getElementById('addAntivirusForm');
      if (addAntivirusForm) {
        addAntivirusForm.addEventListener('submit', (e) => {
          e.preventDefault();
          this.handleSaveAntivirus(new FormData(addAntivirusForm));
        });
      }

      // Repairs Form
      const addRepairForm = document.getElementById('addRepairForm');
      if (addRepairForm) {
        addRepairForm.addEventListener('submit', (e) => {
          e.preventDefault();
          this.handleSaveRepair(new FormData(addRepairForm));
        });
      }

      // Edit Warranty Form
      const editWarrantyForm = document.getElementById('editWarrantyForm');
      if (editWarrantyForm) {
        editWarrantyForm.addEventListener('submit', (e) => {
          e.preventDefault();
          this.handleSaveWarranty(new FormData(editWarrantyForm));
        });
      }

      // 5. Settings Save
      const settingsForm = document.getElementById('systemSettingsForm');
      if (settingsForm) {
        settingsForm.addEventListener('submit', (e) => {
          e.preventDefault();
          const comp = document.getElementById('settingsCompanyName').value.trim();
          const admin = document.getElementById('settingsAdminName').value.trim();
          if (comp) store.data.settings.companyName = comp;
          if (admin) store.data.settings.adminName = admin;
          store.save();
          Utils.showToast('Settings Saved', 'System configuration updated successfully.');
        });
      }

      // 6. Edit Asset Specifications & Details Form
      const editAssetForm = document.getElementById('editAssetForm');
      if (editAssetForm) {
        editAssetForm.addEventListener('submit', (e) => {
          e.preventDefault();
          this.executeSaveAssetEdit(new FormData(editAssetForm));
        });
      }

      // 7. View Asset Modal Edit Button
      const viewModalEditBtn = document.getElementById('viewAssetEditModalBtn');
      if (viewModalEditBtn) {
        viewModalEditBtn.addEventListener('click', () => {
          if (this.currentViewAssetId) {
            this.closeModal('modalViewAsset');
            window.ITApp.editAsset(this.currentViewAssetId);
          }
        });
      }
    }

    handleCreateNewUser(formData) {
      const name = formData.get('userName')?.trim();
      const team = formData.get('userTeam');
      const tl = formData.get('userTl')?.trim() || '-';
      const assetType = formData.get('assetType');
      const workStatus = formData.get('workStatus') || 'Currently Working';
      const cpu = formData.get('userCpu')?.trim();
      const ram = formData.get('userRam');
      const hdd = formData.get('userHdd');
      const ssd = formData.get('userSsd');
      const monitor = formData.get('userMonitor')?.trim();
      const rawOldUser = formData.get('oldUsername')?.trim() || 'None';
      const oldUsername = rawOldUser.replace(/\s*\[.*?\]/g, '').replace(/\s*\(.*?\)/g, '').trim() || 'None';
      const assignedDate = formData.get('assignedDate') || new Date().toISOString().substring(0, 10);
      const typeCode = (assetType || '').toLowerCase().includes('lap') ? 'LPT' : (assetType || '').toLowerCase().includes('desk') ? 'DSK' : (assetType || 'AST').substring(0, 3).toUpperCase();
      const assetId = formData.get('assetId')?.trim() || `AST-${typeCode}-${Math.floor(1000 + Math.random() * 9000)}`;
      const serialNumber = formData.get('serialNumber')?.trim() || `SN-${Math.floor(10000 + Math.random() * 90000)}`;
      const hostname = formData.get('hostname')?.trim() || `${team.substring(0, 3).toUpperCase()}-${assetType.substring(0, 3).toUpperCase()}-${Math.floor(10 + Math.random() * 90)}`;
      const ipAddress = formData.get('ipAddress')?.trim() || `192.168.10.${Math.floor(20 + Math.random() * 200)}`;
      const os = formData.get('operatingSystem') || 'Windows 11 Pro';
      const location = formData.get('officeLocation')?.trim() || 'Floor 3 - Bay A';
      const status = formData.get('assetStatus') || 'Assigned';
      const remark = formData.get('userRemark')?.trim() || 'Newly provisioned asset';

      // Validation
      if (!name || !cpu || !ram || !status || !workStatus) {
        Utils.showToast('Validation Error', 'Please fill in all required fields (Name, CPU, RAM, Status, Work Status).', 'error');
        return;
      }

      // Check if user name already exists - Prevent Duplicate Entry
      const userExistsInUsers = store.data.users && store.data.users.some(u => u.name && u.name.trim().toLowerCase() === name.toLowerCase());
      const userExistsInAssets = store.data.assets && store.data.assets.some(a => a.user && a.user.trim().toLowerCase() === name.toLowerCase());

      if (userExistsInUsers || userExistsInAssets) {
        Utils.showToast('User Already Exists', `An employee named "${name}" already exists! Entry not allowed.`, 'error');
        const nameInput = document.getElementById('newUserNameInput');
        const nameError = document.getElementById('newUserNameError');
        if (nameInput) {
          nameInput.classList.add('is-invalid');
          nameInput.focus();
        }
        if (nameError) {
          nameError.style.display = 'flex';
          nameError.innerHTML = `<span>⚠️</span> <span>User "<strong>${Utils.escapeHtml(name)}</strong>" already exists! Entry not allowed. Please enter a unique name.</span>`;
        }
        return;
      }

      // Check if asset ID already exists
      const existingAsset = store.data.assets.find(a => a.id.toLowerCase() === assetId.toLowerCase());
      if (existingAsset) {
        if (oldUsername && oldUsername.toLowerCase() !== 'none') {
          // Reassign existing asset to new user
          existingAsset.user = name;
          existingAsset.team = team;
          existingAsset.workStatus = workStatus;
          existingAsset.type = assetType;
          existingAsset.cpu = cpu;
          existingAsset.ram = ram;
          existingAsset.hdd = hdd || existingAsset.hdd;
          existingAsset.ssd = ssd || existingAsset.ssd;
          existingAsset.monitor = monitor || existingAsset.monitor;
          existingAsset.serialNumber = serialNumber || existingAsset.serialNumber;
          existingAsset.hostname = hostname || existingAsset.hostname;
          existingAsset.ipAddress = ipAddress || existingAsset.ipAddress;
          existingAsset.os = os || existingAsset.os;
          existingAsset.location = location || existingAsset.location;
          existingAsset.oldUsername = oldUsername;
          existingAsset.assignedDate = assignedDate;
          existingAsset.status = status;
          if (remark) existingAsset.remark = remark;
        } else {
          Utils.showToast('Duplicate Asset ID', 'This Asset ID already exists. Please choose a unique ID or specify Old Username if reassigning.', 'error');
          return;
        }
      } else {
        // Create Asset record
        const newAsset = {
          id: assetId,
          type: assetType,
          user: name,
          team,
          workStatus,
          cpu,
          ram,
          hdd: hdd || 'None',
          ssd: ssd || '',
          monitor: monitor || '',
          serialNumber,
          hostname,
          ipAddress,
          os: os || 'Windows 11 Pro',
          location,
          oldUsername,
          assignedDate,
          status,
          condition: 'Brand New',
          warrantyEnd: new Date(new Date().setFullYear(new Date().getFullYear() + 3)).toISOString().substring(0, 10),
          remark
        };
        store.data.assets.unshift(newAsset);
      }

      // Create / Update User record
      store.data.users.unshift({
        id: `USR-${Math.floor(100 + Math.random() * 900)}`,
        name,
        email: `${name.toLowerCase().replace(/\s+/g, '.')}@apextech.com`,
        team,
        workStatus,
        assetId: assetId,
        assetType,
        status: 'Assigned',
        joinDate: assignedDate
      });

      // Add to Endpoint Security (Antivirus)
      store.data.antivirus.unshift({
        id: `AV-${Math.floor(10 + Math.random() * 90)}`,
        user: name,
        assetId: newAsset.id,
        antivirus: 'CrowdStrike Falcon Sensor',
        version: 'v7.12.1810',
        installDate: assignedDate,
        expiryDate: newAsset.warrantyEnd,
        status: 'Active'
      });

      // Log activity
      store.addActivity('Assigned New System', newAsset.id, name, 'Success');

      // Persist
      store.save();

      // Clear form
      document.getElementById('addNewUserForm').reset();

      // Show toast
      Utils.showToast('User & System Created', `Successfully assigned ${newAsset.id} to ${name}!`);

      // Update metrics & navigate to Assigned Users
      this.updateDashboardMetrics();
      this.navigateTo('assigned-users');
    }

    handleConfirmSwap(formData) {
      const editingSwapId = formData.get('editingSwapId')?.trim();
      const oldAssetId = formData.get('swapOldAssetId');
      const oldUser = formData.get('swapOldUsername');
      const newUserName = formData.get('swapNewUser')?.trim();
      const newTeam = formData.get('swapNewTeam');
      const assetType = formData.get('swapAssetType') || 'Desktop';
      const newAssetId = formData.get('swapNewAssetId')?.trim() || `AST-${assetType === 'Laptop' ? 'LPT' : 'DSK'}-${Math.floor(1000 + Math.random() * 9000)}`;
      const cpu = formData.get('swapCpu')?.trim();
      const ram = formData.get('swapRam');
      const hdd = formData.get('swapHdd') || 'None';
      const ssd = formData.get('swapSsd') || 'None';
      const monitor = formData.get('swapMonitor')?.trim() || 'None';
      const assignedDate = formData.get('swapAssignedDate') || new Date().toISOString().substring(0, 10);
      const reason = formData.get('swapReason') || 'Routine Hardware Upgrade';
      const swapDate = formData.get('swapDate') || new Date().toISOString().substring(0, 10);
      const swapStatus = formData.get('swapStatus') || 'Completed';
      const remark = formData.get('swapRemark')?.trim() || '';

      if (!oldAssetId || !newUserName || !cpu) {
        Utils.showToast('Validation Error', 'Please select old user system and provide new user/CPU specs.', 'error');
        return;
      }

      if (editingSwapId) {
        // UPDATE EXISTING SWAP RECORD IN SYSTEM SWAP FACILITY
        const swap = (store.data.swapLogs || []).find(s => s.id === editingSwapId);
        if (swap) {
          swap.newUserId = newUserName;
          swap.newTeam = newTeam;
          swap.newAssetId = newAssetId;
          swap.reason = reason;
          swap.swapDate = swapDate;
          swap.status = swapStatus;
          swap.remark = remark;
        }

        // Update replacement asset if exists
        const asset = (store.data.assets || []).find(a => a.id === newAssetId);
        if (asset) {
          asset.user = newUserName;
          asset.team = newTeam;
          asset.type = assetType;
          asset.cpu = cpu;
          asset.ram = ram;
          asset.ssd = ssd;
          asset.hdd = hdd;
          asset.monitor = monitor;
          asset.assignedDate = assignedDate;
          asset.remark = remark;
        }

        // Update user mapping if exists
        const userObj = (store.data.users || []).find(u => u.name.toLowerCase() === newUserName.toLowerCase());
        if (userObj) {
          userObj.assetId = newAssetId;
          userObj.assetType = assetType;
          userObj.team = newTeam;
          userObj.status = 'Assigned';
        }

        store.addActivity(`Updated Swap Record ${editingSwapId} in System Swap Facility`, newAssetId, newUserName, 'Success');
        store.save();

        this.cancelFacilitySwapEdit();
        Utils.showToast('Swap Record Updated', `Successfully updated swap record ${editingSwapId} in System Swap Facility!`);
        this.updateDashboardMetrics();
        this.renderSwapSystemPage();

        // Highlight updated row
        setTimeout(() => {
          const row = document.querySelector(`tr[data-swap-id="${editingSwapId}"]`);
          if (row) {
            row.classList.add('row-saved-highlight');
            row.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        }, 100);
        return;
      }

      const oldAsset = store.data.assets.find(a => a.id === oldAssetId);

      if (newAssetId === oldAssetId) {
        // Reallocating the same asset with new assignment details
        if (oldAsset) {
          oldAsset.user = newUserName;
          oldAsset.team = newTeam;
          oldAsset.type = assetType;
          oldAsset.cpu = cpu;
          oldAsset.ram = ram;
          oldAsset.ssd = ssd;
          oldAsset.hdd = hdd;
          oldAsset.monitor = monitor;
          oldAsset.status = 'Assigned';
          oldAsset.workStatus = 'Currently Working';
          oldAsset.oldUsername = oldUser;
          oldAsset.assignedDate = assignedDate;
          oldAsset.remark = remark || `Reallocated via System Swap to ${newUserName}`;
        }
      } else {
        // 1. Update Old Asset to "Swap" pool and unassign from user
        if (oldAsset) {
          oldAsset.status = 'Swap';
          oldAsset.user = '';
          oldAsset.remark = `De-commissioned via system swap. Reason: ${reason}`;
        }

        // 2. Create / Assign New Replacement Asset
        const newAsset = {
          id: newAssetId,
          type: assetType,
          user: newUserName,
          team: newTeam,
          cpu,
          ram,
          hdd,
          ssd,
          monitor,
          serialNumber: `SN-SWP-${Math.floor(10000 + Math.random() * 90000)}`,
          hostname: `${newTeam.substring(0, 3).toUpperCase()}-SWP-${Math.floor(10 + Math.random() * 90)}`,
          ipAddress: `192.168.10.${Math.floor(20 + Math.random() * 200)}`,
          os: oldAsset?.os || 'Windows 11 Pro',
          location: oldAsset?.location || 'Floor 3 - Workstation Area',
          oldUsername: oldUser,
          assignedDate,
          status: 'Assigned',
          condition: 'Brand New',
          warrantyEnd: new Date(new Date().setFullYear(new Date().getFullYear() + 3)).toISOString().substring(0, 10),
          remark
        };

        store.data.assets.unshift(newAsset);
      }

      // Sync user assignment
      const userObj = store.data.users.find(u => u.name.toLowerCase() === newUserName.toLowerCase());
      if (userObj) {
        userObj.assetId = newAsset.id;
        userObj.assetType = newAsset.type;
        userObj.team = newTeam;
        userObj.status = 'Assigned';
      } else {
        store.data.users.unshift({
          id: `USR-${Math.floor(100 + Math.random() * 900)}`,
          name: newUserName,
          email: `${newUserName.toLowerCase().replace(/\s+/g, '.')}@apextech.com`,
          team: newTeam,
          assetId: newAsset.id,
          assetType: newAsset.type,
          status: 'Assigned',
          joinDate: assignedDate
        });
      }

      // If old user was different and has no other asset, update status
      if (oldUser && oldUser !== newUserName) {
        const oldUserObj = store.data.users.find(u => u.name.toLowerCase() === oldUser.toLowerCase());
        if (oldUserObj && oldUserObj.assetId === oldAssetId) {
          oldUserObj.assetId = '';
          oldUserObj.status = 'Pending';
        }
      }

      // 3. Record Swap Log
      store.data.swapLogs.unshift({
        id: `SWP-${Math.floor(100 + Math.random() * 900)}`,
        newUserId: newUserName,
        newTeam,
        newAssetId: newAsset.id,
        oldUserId: oldUser,
        oldTeam: oldAsset?.team || '—',
        oldAssetId,
        reason,
        swapDate: assignedDate,
        remark
      });

      // 4. Log Activity
      store.addActivity(`System Swap (${oldAssetId} ➔ ${newAsset.id})`, newAsset.id, newUserName, 'Success');

      store.save();

      document.getElementById('swapSystemForm').reset();
      const autoBanner = document.getElementById('swapAutoFillBanner');
      if (autoBanner) autoBanner.style.display = 'none';

      Utils.showToast('Swap Confirmed', `System ${newAsset.id} assigned to ${newUserName}. ${oldAssetId} moved to Swap pool.`);

      this.updateDashboardMetrics();
      this.renderSwapSystemPage();
    }

    handleCreateRequirement(formData) {
      const name = formData.get('reqName')?.trim();
      const team = formData.get('reqTeam');
      const tl = formData.get('reqTl')?.trim();
      const issue = formData.get('reqIssue')?.trim();
      const requirement = formData.get('reqRequirement')?.trim();
      const priority = formData.get('reqPriority');
      const requiredDate = formData.get('reqRequiredDate');
      const remark = formData.get('reqRemark')?.trim() || '';

      if (!name || !requirement) {
        Utils.showToast('Validation Error', 'Requester name and requirement description are mandatory.', 'error');
        return;
      }

      const newReq = {
        id: `REQ-${Math.floor(100 + Math.random() * 900)}`,
        name,
        team,
        tl: tl || 'Team Lead',
        issue: issue || 'New asset provisioning',
        requirement,
        priority: priority || 'Medium',
        requestDate: new Date().toISOString().substring(0, 10),
        requiredDate: requiredDate || new Date(Date.now() + 7 * 86400000).toISOString().substring(0, 10),
        status: 'Pending',
        remark
      };

      store.data.requirements.unshift(newReq);
      store.addActivity('Filed Hardware Requirement', newReq.id, name, 'Pending');
      store.save();

      this.closeModal('modalNewRequirement');
      document.getElementById('newRequirementForm').reset();

      Utils.showToast('Requirement Logged', `Requirement ${newReq.id} recorded successfully.`);
      this.updateDashboardMetrics();
      this.renderRequirementsTable();
    }

    handleCreateNonItAsset(formData) {
      const name = formData.get('nonItName')?.trim();
      const category = formData.get('nonItCategory');
      const brand = formData.get('nonItBrand')?.trim();
      const model = formData.get('nonItModel')?.trim();
      const serialNumber = formData.get('nonItSerial')?.trim() || `NIT-${Math.floor(1000 + Math.random() * 9000)}`;
      const quantity = parseInt(formData.get('nonItQty')) || 1;
      const location = formData.get('nonItLocation')?.trim() || 'Main Office';
      const assignedTo = formData.get('nonItAssignedTo')?.trim() || 'General Admin';
      const purchaseDate = formData.get('nonItPurchaseDate') || new Date().toISOString().substring(0, 10);
      const purchaseCost = formData.get('nonItCost')?.trim() || '$0';
      const warranty = formData.get('nonItWarranty')?.trim() || '1 Year';
      const condition = formData.get('nonItCondition') || 'Good';
      const status = formData.get('nonItStatus') || 'Assigned';
      const remark = formData.get('nonItRemark')?.trim() || '';

      if (!name || !category) {
        Utils.showToast('Validation Error', 'Asset Name and Category are required.', 'error');
        return;
      }

      const newNonIt = {
        id: `NIT-${Math.floor(100 + Math.random() * 900)}`,
        name,
        category,
        brand: brand || 'Standard',
        model: model || 'Commercial',
        serialNumber,
        quantity,
        location,
        assignedTo,
        purchaseDate,
        purchaseCost,
        warranty,
        condition,
        status,
        remark
      };

      store.data.nonItAssets.unshift(newNonIt);
      store.addActivity('Added Non-IT Asset', newNonIt.id, 'Sundar Pichai (SysAdmin)', 'Success');
      store.save();

      this.closeModal('modalAddNonItAsset');
      document.getElementById('addNonItAssetForm').reset();

      Utils.showToast('Non-IT Asset Saved', `${newNonIt.name} has been added.`);
      this.updateDashboardMetrics();
      this.renderNonItAssetsTable();
    }

    openAddSwitchModal() {
      const form = document.getElementById('addSwitchForm');
      if (form) form.reset();
      const idInput = document.getElementById('switchOriginalId');
      if (idInput) idInput.value = '';
      const title = document.getElementById('switchModalTitle');
      if (title) title.textContent = 'Add Network Switch & Gateway Modem';
      this.openModal('modalAddSwitch');
    }

    editSwitch(id) {
      const s = (store.data.networkSwitches || []).find(item => item.id === id);
      if (!s) {
        Utils.showToast('Error', 'Switch not found', 'error');
        return;
      }
      const title = document.getElementById('switchModalTitle');
      if (title) title.textContent = `Edit Switch: ${s.name}`;

      const idInput = document.getElementById('switchOriginalId');
      if (idInput) idInput.value = s.id;

      const nameInput = document.getElementById('switchNameInput');
      if (nameInput) nameInput.value = s.name || '';

      const typeSelect = document.getElementById('switchTypeSelect');
      if (typeSelect) typeSelect.value = s.type || 'Managed L3 Switch';

      const brandInput = document.getElementById('switchBrandInput');
      if (brandInput) brandInput.value = s.brand || '';

      const modelInput = document.getElementById('switchModelInput');
      if (modelInput) modelInput.value = s.model || '';

      const ipInput = document.getElementById('switchIpInput');
      if (ipInput) ipInput.value = s.ipAddress || '';

      const macInput = document.getElementById('switchMacInput');
      if (macInput) macInput.value = s.macAddress || '';

      const locInput = document.getElementById('switchLocationInput');
      if (locInput) locInput.value = s.location || '';

      const portCountInput = document.getElementById('switchPortCountInput');
      if (portCountInput) portCountInput.value = s.portCount ?? 24;

      const usedPortsInput = document.getElementById('switchUsedPortsInput');
      if (usedPortsInput) usedPortsInput.value = s.usedPorts ?? 0;

      const statusSelect = document.getElementById('switchStatusSelect');
      if (statusSelect) statusSelect.value = s.status || 'Operational';

      const remarkInput = document.getElementById('switchRemarkInput');
      if (remarkInput) remarkInput.value = s.remark || '';

      this.openModal('modalAddSwitch');
    }

    async deleteSwitch(id) {
      if (this.currentRole === 'Viewer' || this.currentRole === 'IT Support') {
        Utils.showToast('Access Denied', `${this.currentRole} role cannot delete network devices.`, 'error');
        return;
      }
      const s = (store.data.networkSwitches || []).find(item => item.id === id);
      const name = s ? s.name : id;
      if (!confirm(`Are you sure you want to delete switch "${name}" (${id})?`)) {
        return;
      }

      store.data.networkSwitches = (store.data.networkSwitches || []).filter(item => item.id !== id);
      store.addActivity('Deleted Network Switch', id, 'Sundar Pichai (SysAdmin)', 'Warning');
      store.save();

      if (store.isServerConnected) {
        try {
          await fetch(`/api/network/switches/${encodeURIComponent(id)}`, { method: 'DELETE' });
        } catch (e) {
          console.warn('Backend DELETE /api/network/switches failed', e);
        }
      }

      Utils.showToast('Switch Deleted', `${name} has been removed.`, 'warning');
      this.renderNetworkSwitchesTable();
    }

    viewSwitch(id) {
      const s = (store.data.networkSwitches || []).find(item => item.id === id);
      if (!s) return;
      alert(`🌐 Network Switch Details:
----------------------------------------
Device Name: ${s.name}
ID: ${s.id}
Type: ${s.type}
Brand / Model: ${s.brand} ${s.model}
Management IP: ${s.ipAddress}
MAC Address: ${s.macAddress || '—'}
Location: ${s.location}
Ports: ${s.portCount} Total (${s.usedPorts} In Use, ${s.availablePorts} Free)
Status: ${s.status}
Remarks: ${s.remark || 'None'}`);
    }

    async handleSaveSwitch(formData) {
      const originalId = formData.get('switchOriginalId')?.trim();
      const name = formData.get('switchName')?.trim();
      const type = formData.get('switchType') || 'Managed L3 Switch';
      const brand = formData.get('switchBrand')?.trim() || '';
      const model = formData.get('switchModel')?.trim() || '';
      const ipAddress = formData.get('switchIp')?.trim();
      const macAddress = formData.get('switchMac')?.trim() || '';
      const location = formData.get('switchLocation')?.trim() || 'Server Room';
      const portCount = parseInt(formData.get('switchPortCount'), 10) || 24;
      const usedPorts = parseInt(formData.get('switchUsedPorts'), 10) || 0;
      const availablePorts = Math.max(0, portCount - usedPorts);
      const status = formData.get('switchStatus') || 'Operational';
      const remark = formData.get('switchRemark')?.trim() || '';

      if (!name) {
        Utils.showToast('Validation Error', 'Please enter a device name.', 'error');
        return;
      }
      if (!ipAddress) {
        Utils.showToast('Validation Error', 'Please enter a management IP address.', 'error');
        return;
      }
      if (usedPorts > portCount) {
        Utils.showToast('Validation Error', 'Used ports cannot exceed total port count.', 'error');
        return;
      }

      if (originalId) {
        const idx = (store.data.networkSwitches || []).findIndex(s => s.id === originalId);
        if (idx !== -1) {
          const updated = {
            ...store.data.networkSwitches[idx],
            name,
            type,
            brand,
            model,
            ipAddress,
            macAddress,
            location,
            portCount,
            usedPorts,
            availablePorts,
            status,
            remark
          };
          store.data.networkSwitches[idx] = updated;
          store.addActivity('Updated Switch', originalId, 'Sundar Pichai (SysAdmin)', 'Success');
          store.save();

          if (store.isServerConnected) {
            try {
              await fetch(`/api/network/switches/${encodeURIComponent(originalId)}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updated)
              });
            } catch (e) {
              console.warn('Backend PUT /api/network/switches failed', e);
            }
          }

          Utils.showToast('Switch Updated', `${name} details have been updated.`);
        }
      } else {
        const newId = `NET-SW-${Math.floor(100 + Math.random() * 900)}`;
        const newSwitch = {
          id: newId,
          name,
          type,
          brand,
          model,
          ipAddress,
          macAddress,
          location,
          portCount,
          usedPorts,
          availablePorts,
          status,
          remark
        };

        if (!store.data.networkSwitches) store.data.networkSwitches = [];
        store.data.networkSwitches.unshift(newSwitch);
        store.addActivity('Added Network Switch', newId, 'Sundar Pichai (SysAdmin)', 'Success');
        store.save();

        if (store.isServerConnected) {
          try {
            await fetch('/api/network/switches', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(newSwitch)
            });
          } catch (e) {
            console.warn('Backend POST /api/network/switches failed', e);
          }
        }

        Utils.showToast('Switch Registered', `${name} successfully added to network inventory.`);
      }

      this.closeModal('modalAddSwitch');
      const form = document.getElementById('addSwitchForm');
      if (form) form.reset();
      this.renderNetworkSwitchesTable();
    }

    /* -------------------------------------------------------------
       BYPASS IP WHITELIST CONTROLLER METHODS
       ------------------------------------------------------------- */
    openAddBypassIpModal() {
      const form = document.getElementById('addBypassIpForm');
      if (form) form.reset();
      const idInput = document.getElementById('bypassOriginalId');
      if (idInput) idInput.value = '';
      const title = document.getElementById('bypassModalTitle');
      if (title) title.textContent = 'Add Bypass IP Whitelist Rule';
      const startInput = document.getElementById('bypassStartDateInput');
      if (startInput) startInput.value = new Date().toISOString().substring(0, 10);
      this.openModal('modalAddBypassIp');
    }

    editBypassIp(id) {
      const b = (store.data.bypassIps || []).find(item => item.id === id);
      if (!b) return;

      const title = document.getElementById('bypassModalTitle');
      if (title) title.textContent = `Edit Bypass Rule: ${b.ipAddress}`;

      const idInput = document.getElementById('bypassOriginalId');
      if (idInput) idInput.value = b.id;

      const ipInput = document.getElementById('bypassIpInput');
      if (ipInput) ipInput.value = b.ipAddress || '';

      const userInput = document.getElementById('bypassUserInput');
      if (userInput) userInput.value = b.user || '';

      const sysInput = document.getElementById('bypassSystemInput');
      if (sysInput) sysInput.value = b.system || '';

      const macInput = document.getElementById('bypassMacInput');
      if (macInput) macInput.value = b.macAddress || '';

      const purposeInput = document.getElementById('bypassPurposeInput');
      if (purposeInput) purposeInput.value = b.purpose || '';

      const appInput = document.getElementById('bypassApprovedByInput');
      if (appInput) appInput.value = b.approvedBy || 'Sundar Pichai (SysAdmin)';

      const statusSelect = document.getElementById('bypassStatusSelect');
      if (statusSelect) statusSelect.value = b.status || 'Active';

      const startInput = document.getElementById('bypassStartDateInput');
      if (startInput) startInput.value = b.startDate || '';

      const expInput = document.getElementById('bypassExpiryDateInput');
      if (expInput) expInput.value = b.expiryDate || '';

      const remarkInput = document.getElementById('bypassRemarkInput');
      if (remarkInput) remarkInput.value = b.remark || '';

      this.openModal('modalAddBypassIp');
    }

    async deleteBypassIp(id) {
      if (this.currentRole === 'Viewer' || this.currentRole === 'IT Support') {
        Utils.showToast('Access Denied', `${this.currentRole} role cannot delete whitelist rules.`, 'error');
        return;
      }
      const b = (store.data.bypassIps || []).find(item => item.id === id);
      const ip = b ? b.ipAddress : id;
      if (!confirm(`Are you sure you want to delete whitelist bypass rule for "${ip}"?`)) return;

      store.data.bypassIps = (store.data.bypassIps || []).filter(item => item.id !== id);
      store.addActivity('Deleted Bypass IP', id, 'Sundar Pichai (SysAdmin)', 'Warning');
      store.save();

      if (store.isServerConnected) {
        try {
          await fetch(`/api/network/bypass-ips/${encodeURIComponent(id)}`, { method: 'DELETE' });
        } catch (e) {
          console.warn('Backend DELETE bypass-ips failed', e);
        }
      }

      Utils.showToast('Rule Deleted', `Bypass IP ${ip} removed from policy.`, 'warning');
      this.renderBypassIpTable();
    }

    viewBypassIp(id) {
      const b = (store.data.bypassIps || []).find(item => item.id === id);
      if (!b) return;
      alert(`🛡️ Bypass IP Whitelist Details:
----------------------------------------
IP Address: ${b.ipAddress}
User / Owner: ${b.user}
Machine: ${b.system || '—'}
MAC Address: ${b.macAddress || '—'}
Purpose: ${b.purpose}
Approved By: ${b.approvedBy}
Start Date: ${b.startDate}
Expiry Date: ${b.expiryDate || 'Permanent / None'}
Status: ${b.status}
Remark: ${b.remark || 'None'}`);
    }

    async handleSaveBypassIp(formData) {
      const originalId = formData.get('bypassOriginalId')?.trim();
      const ipAddress = formData.get('bypassIp')?.trim();
      const user = formData.get('bypassUser')?.trim();
      const system = formData.get('bypassSystem')?.trim() || '';
      const macAddress = formData.get('bypassMac')?.trim() || '';
      const purpose = formData.get('bypassPurpose')?.trim();
      const approvedBy = formData.get('bypassApprovedBy')?.trim() || 'Sundar Pichai (SysAdmin)';
      const status = formData.get('bypassStatus') || 'Active';
      const startDate = formData.get('bypassStartDate') || new Date().toISOString().substring(0, 10);
      const expiryDate = formData.get('bypassExpiryDate') || '';
      const remark = formData.get('bypassRemark')?.trim() || '';

      if (!ipAddress) {
        Utils.showToast('Validation Error', 'Please enter a valid IP address.', 'error');
        return;
      }
      if (!user) {
        Utils.showToast('Validation Error', 'Please specify the user / owner.', 'error');
        return;
      }

      if (originalId) {
        const idx = (store.data.bypassIps || []).findIndex(b => b.id === originalId);
        if (idx !== -1) {
          const updated = {
            ...store.data.bypassIps[idx],
            ipAddress, user, system, macAddress, purpose, approvedBy, status, startDate, expiryDate, remark
          };
          store.data.bypassIps[idx] = updated;
          store.addActivity('Updated Bypass IP', ipAddress, 'Sundar Pichai (SysAdmin)', 'Success');
          store.save();

          if (store.isServerConnected) {
            try {
              await fetch(`/api/network/bypass-ips/${encodeURIComponent(originalId)}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updated)
              });
            } catch (e) {
              console.warn('Backend PUT bypass-ips failed', e);
            }
          }
          Utils.showToast('Bypass Updated', `Rule for ${ipAddress} updated.`);
        }
      } else {
        const newId = `BP-${Math.floor(100 + Math.random() * 900)}`;
        const newRule = { id: newId, ipAddress, user, system, macAddress, purpose, approvedBy, status, startDate, expiryDate, remark };
        if (!store.data.bypassIps) store.data.bypassIps = [];
        store.data.bypassIps.unshift(newRule);
        store.addActivity('Added Bypass IP Rule', ipAddress, 'Sundar Pichai (SysAdmin)', 'Success');
        store.save();

        if (store.isServerConnected) {
          try {
            await fetch('/api/network/bypass-ips', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(newRule)
            });
          } catch (e) {
            console.warn('Backend POST bypass-ips failed', e);
          }
        }
        Utils.showToast('Rule Saved', `Bypass rule for ${ipAddress} registered.`);
      }

      this.closeModal('modalAddBypassIp');
      document.getElementById('addBypassIpForm')?.reset();
      this.renderBypassIpTable();
    }

    /* -------------------------------------------------------------
       ANTIVIRUS & EDR AUDIT CONTROLLER METHODS
       ------------------------------------------------------------- */
    openAddAntivirusModal() {
      const form = document.getElementById('addAntivirusForm');
      if (form) form.reset();
      const idInput = document.getElementById('antivirusOriginalId');
      if (idInput) idInput.value = '';
      const title = document.getElementById('antivirusModalTitle');
      if (title) title.textContent = 'Enroll Antivirus & EDR Endpoint';
      const instInput = document.getElementById('antivirusInstallDateInput');
      if (instInput) instInput.value = new Date().toISOString().substring(0, 10);
      this.openModal('modalAddAntivirus');
    }

    editAntivirus(id) {
      const av = (store.data.antivirus || []).find(item => item.id === id);
      if (!av) return;

      const title = document.getElementById('antivirusModalTitle');
      if (title) title.textContent = `Edit Antivirus: ${av.user} (${av.assetId})`;

      const idInput = document.getElementById('antivirusOriginalId');
      if (idInput) idInput.value = av.id;

      const userInput = document.getElementById('antivirusUserInput');
      if (userInput) userInput.value = av.user || '';

      const assetInput = document.getElementById('antivirusAssetIdInput');
      if (assetInput) assetInput.value = av.assetId || '';

      const solSelect = document.getElementById('antivirusSolutionSelect');
      if (solSelect) solSelect.value = av.antivirus || 'CrowdStrike Falcon Sensor';

      const verInput = document.getElementById('antivirusVersionInput');
      if (verInput) verInput.value = av.version || '';

      const statusSelect = document.getElementById('antivirusStatusSelect');
      if (statusSelect) statusSelect.value = av.status || 'Active';

      const instInput = document.getElementById('antivirusInstallDateInput');
      if (instInput) instInput.value = av.installDate || '';

      const expInput = document.getElementById('antivirusExpiryDateInput');
      if (expInput) expInput.value = av.expiryDate || '';

      this.openModal('modalAddAntivirus');
    }

    async deleteAntivirus(id) {
      if (this.currentRole === 'Viewer' || this.currentRole === 'IT Support') {
        Utils.showToast('Access Denied', `${this.currentRole} role cannot remove antivirus records.`, 'error');
        return;
      }
      const av = (store.data.antivirus || []).find(item => item.id === id);
      const label = av ? `${av.user} (${av.assetId})` : id;
      if (!confirm(`Delete endpoint antivirus record for ${label}?`)) return;

      store.data.antivirus = (store.data.antivirus || []).filter(item => item.id !== id);
      store.addActivity('Removed Antivirus Enrollment', id, 'Sundar Pichai (SysAdmin)', 'Warning');
      store.save();

      if (store.isServerConnected) {
        try {
          await fetch(`/api/maintenance/antivirus/${encodeURIComponent(id)}`, { method: 'DELETE' });
        } catch (e) {
          console.warn('Backend DELETE antivirus failed', e);
        }
      }

      Utils.showToast('Record Removed', `Antivirus enrollment for ${label} removed.`, 'warning');
      this.renderAntivirusTable();
    }

    viewAntivirus(id) {
      const av = (store.data.antivirus || []).find(item => item.id === id);
      if (!av) return;
      alert(`🛡️ Endpoint Antivirus & EDR Audit:
----------------------------------------
Employee: ${av.user}
Asset ID: ${av.assetId}
EDR Solution: ${av.antivirus}
Agent Version: ${av.version || 'v7.12'}
Enrolled Date: ${av.installDate}
License Expiry: ${av.expiryDate}
Sensor Status: ${av.status}`);
    }

    async handleSaveAntivirus(formData) {
      const originalId = formData.get('antivirusOriginalId')?.trim();
      const user = formData.get('antivirusUser')?.trim();
      const assetId = formData.get('antivirusAssetId')?.trim();
      const antivirus = formData.get('antivirusSolution') || 'CrowdStrike Falcon Sensor';
      const version = formData.get('antivirusVersion')?.trim() || 'v7.12.1810';
      const status = formData.get('antivirusStatus') || 'Active';
      const installDate = formData.get('antivirusInstallDate') || new Date().toISOString().substring(0, 10);
      const expiryDate = formData.get('antivirusExpiryDate')?.trim();

      if (!user || !assetId) {
        Utils.showToast('Validation Error', 'Please specify both User and Asset ID.', 'error');
        return;
      }
      if (!expiryDate) {
        Utils.showToast('Validation Error', 'Please specify a license expiration date.', 'error');
        return;
      }

      if (originalId) {
        const idx = (store.data.antivirus || []).findIndex(a => a.id === originalId);
        if (idx !== -1) {
          const updated = {
            ...store.data.antivirus[idx],
            user, assetId, antivirus, version, status, installDate, expiryDate
          };
          store.data.antivirus[idx] = updated;
          store.addActivity('Updated Antivirus', `${user} (${assetId})`, 'Sundar Pichai (SysAdmin)', 'Success');
          store.save();

          if (store.isServerConnected) {
            try {
              await fetch(`/api/maintenance/antivirus/${encodeURIComponent(originalId)}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updated)
              });
            } catch (e) {
              console.warn('Backend PUT antivirus failed', e);
            }
          }
          Utils.showToast('Enrollment Updated', `Antivirus record for ${user} updated.`);
        }
      } else {
        const newId = `AV-${Math.floor(100 + Math.random() * 900)}`;
        const newAv = { id: newId, user, assetId, antivirus, version, status, installDate, expiryDate };
        if (!store.data.antivirus) store.data.antivirus = [];
        store.data.antivirus.unshift(newAv);
        store.addActivity('Enrolled Endpoint Antivirus', `${user} (${assetId})`, 'Sundar Pichai (SysAdmin)', 'Success');
        store.save();

        if (store.isServerConnected) {
          try {
            await fetch('/api/maintenance/antivirus', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(newAv)
            });
          } catch (e) {
            console.warn('Backend POST antivirus failed', e);
          }
        }
        Utils.showToast('Endpoint Enrolled', `${user} (${assetId}) enrolled in ${antivirus}.`);
      }

      this.closeModal('modalAddAntivirus');
      document.getElementById('addAntivirusForm')?.reset();
      this.renderAntivirusTable();
    }

    /* -------------------------------------------------------------
       HARDWARE REPAIRS CONTROLLER METHODS
       ------------------------------------------------------------- */
    openAddRepairModal() {
      const form = document.getElementById('addRepairForm');
      if (form) form.reset();
      const idInput = document.getElementById('repairOriginalId');
      if (idInput) idInput.value = '';
      const title = document.getElementById('repairModalTitle');
      if (title) title.textContent = 'Log Hardware Repair / Service Ticket';
      const dateInput = document.getElementById('repairDateInput');
      if (dateInput) dateInput.value = new Date().toISOString().substring(0, 10);
      this.openModal('modalAddRepair');
    }

    editRepair(id) {
      const r = (store.data.repairs || []).find(item => item.id === id);
      if (!r) return;

      const title = document.getElementById('repairModalTitle');
      if (title) title.textContent = `Edit Repair Ticket: ${r.assetId}`;

      const idInput = document.getElementById('repairOriginalId');
      if (idInput) idInput.value = r.id;

      const assetInput = document.getElementById('repairAssetIdInput');
      if (assetInput) assetInput.value = r.assetId || '';

      const userInput = document.getElementById('repairUserInput');
      if (userInput) userInput.value = r.user || '';

      const issueInput = document.getElementById('repairIssueInput');
      if (issueInput) issueInput.value = r.issue || '';

      const dateInput = document.getElementById('repairDateInput');
      if (dateInput) dateInput.value = r.date || '';

      const vendorInput = document.getElementById('repairVendorInput');
      if (vendorInput) vendorInput.value = r.vendor || '';

      const costInput = document.getElementById('repairCostInput');
      if (costInput) costInput.value = r.cost || '';

      const statusSelect = document.getElementById('repairStatusSelect');
      if (statusSelect) statusSelect.value = r.status || 'Under Repair';

      const expInput = document.getElementById('repairExpectedReturnInput');
      if (expInput) expInput.value = r.expectedReturn || '';

      const actInput = document.getElementById('repairActualReturnInput');
      if (actInput) actInput.value = r.actualReturn || '';

      const remarkInput = document.getElementById('repairRemarkInput');
      if (remarkInput) remarkInput.value = r.remark || '';

      this.openModal('modalAddRepair');
    }

    async deleteRepair(id) {
      if (this.currentRole === 'Viewer' || this.currentRole === 'IT Support') {
        Utils.showToast('Access Denied', `${this.currentRole} role cannot delete repair tickets.`, 'error');
        return;
      }
      const r = (store.data.repairs || []).find(item => item.id === id);
      const tag = r ? `${r.assetId} (${r.issue})` : id;
      if (!confirm(`Delete repair ticket for ${tag}?`)) return;

      store.data.repairs = (store.data.repairs || []).filter(item => item.id !== id);
      store.addActivity('Deleted Repair Ticket', id, 'Sundar Pichai (SysAdmin)', 'Warning');
      store.save();

      if (store.isServerConnected) {
        try {
          await fetch(`/api/maintenance/repairs/${encodeURIComponent(id)}`, { method: 'DELETE' });
        } catch (e) {
          console.warn('Backend DELETE repairs failed', e);
        }
      }

      Utils.showToast('Ticket Deleted', `Repair ticket ${id} deleted.`, 'warning');
      this.renderRepairsTable();
      this.updateDashboardMetrics();
    }

    viewRepair(id) {
      const r = (store.data.repairs || []).find(item => item.id === id);
      if (!r) return;
      alert(`🔧 Repair Ticket Details:
----------------------------------------
Ticket ID: ${r.id}
Asset ID: ${r.assetId}
Custodian: ${r.user}
Reported Issue: ${r.issue}
Date Sent: ${r.date}
Service Vendor: ${r.vendor}
Repair Cost: ${r.cost || '$0'}
Expected Return: ${r.expectedReturn || 'TBD'}
Actual Return: ${r.actualReturn || 'Still In Service'}
Status: ${r.status}
Remarks: ${r.remark || 'None'}`);
    }

    async handleSaveRepair(formData) {
      const originalId = formData.get('repairOriginalId')?.trim();
      const assetId = formData.get('repairAssetId')?.trim();
      const user = formData.get('repairUser')?.trim();
      const issue = formData.get('repairIssue')?.trim();
      const date = formData.get('repairDate') || new Date().toISOString().substring(0, 10);
      const vendor = formData.get('repairVendor')?.trim() || 'Authorized Service Center';
      const cost = formData.get('repairCost')?.trim() || '$0';
      const status = formData.get('repairStatus') || 'Under Repair';
      const expectedReturn = formData.get('repairExpectedReturn') || '';
      const actualReturn = formData.get('repairActualReturn') || '';
      const remark = formData.get('repairRemark')?.trim() || '';

      if (!assetId || !issue) {
        Utils.showToast('Validation Error', 'Please enter Asset ID and Reported Issue.', 'error');
        return;
      }

      if (originalId) {
        const idx = (store.data.repairs || []).findIndex(r => r.id === originalId);
        if (idx !== -1) {
          const updated = {
            ...store.data.repairs[idx],
            assetId, user, issue, date, vendor, cost, status, expectedReturn, actualReturn, remark
          };
          store.data.repairs[idx] = updated;
          store.addActivity('Updated Repair Ticket', assetId, 'Sundar Pichai (SysAdmin)', 'Success');
          store.save();

          if (store.isServerConnected) {
            try {
              await fetch(`/api/maintenance/repairs/${encodeURIComponent(originalId)}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updated)
              });
            } catch (e) {
              console.warn('Backend PUT repairs failed', e);
            }
          }
          Utils.showToast('Ticket Updated', `Repair ticket for ${assetId} updated.`);
        }
      } else {
        const newId = `REP-${Math.floor(100 + Math.random() * 900)}`;
        const newRep = { id: newId, assetId, user, issue, date, vendor, cost, status, expectedReturn, actualReturn, remark };
        if (!store.data.repairs) store.data.repairs = [];
        store.data.repairs.unshift(newRep);
        store.addActivity('Logged Maintenance Ticket', newId, 'Sundar Pichai (SysAdmin)', 'Warning');
        store.save();

        if (store.isServerConnected) {
          try {
            await fetch('/api/maintenance/repairs', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(newRep)
            });
          } catch (e) {
            console.warn('Backend POST repairs failed', e);
          }
        }
        Utils.showToast('Ticket Logged', `Repair ticket ${newId} for ${assetId} logged.`);
      }

      this.closeModal('modalAddRepair');
      document.getElementById('addRepairForm')?.reset();
      this.renderRepairsTable();
      this.updateDashboardMetrics();
    }

    /* -------------------------------------------------------------
       WARRANTY LIFECYCLE CONTROLLER METHODS
       ------------------------------------------------------------- */
    openEditWarrantyModal(assetId) {
      const asset = (store.data.assets || []).find(a => a.id === assetId);
      if (!asset) return;

      const idInput = document.getElementById('warrantyAssetId');
      if (idInput) idInput.value = asset.id;

      const idDisp = document.getElementById('warrantyAssetDisplay');
      if (idDisp) idDisp.value = `${asset.id} (${asset.type})`;

      const userDisp = document.getElementById('warrantyUserDisplay');
      if (userDisp) userDisp.value = asset.user || 'Unassigned / Inventory';

      const isNonW = !asset.warrantyEnd || asset.warrantyEnd === 'Non-Warranty' || asset.warrantyEnd === 'None' || asset.warrantyType === 'Non-Warranty';
      const typeInput = document.getElementById('warrantyTypeInput');
      if (typeInput) typeInput.value = asset.warrantyType || (isNonW ? 'Non-Warranty' : 'Full System');

      const coverageSelect = document.getElementById('warrantyCoverageStatus');
      if (coverageSelect) coverageSelect.value = isNonW ? 'non-warranty' : 'date';

      const endInput = document.getElementById('warrantyEndDateInput');
      if (endInput) {
        endInput.value = isNonW ? '' : (asset.warrantyEnd || '');
        endInput.disabled = isNonW;
        endInput.style.opacity = isNonW ? '0.45' : '1';
      }

      const remarkInput = document.getElementById('warrantyRemarkInput');
      if (remarkInput) remarkInput.value = asset.remark || '';

      this.openModal('modalEditWarranty');
    }

    extendWarrantyPreset(years) {
      const endInput = document.getElementById('warrantyEndDateInput');
      if (!endInput) return;

      const currentVal = endInput.value;
      const baseDate = (currentVal && !isNaN(new Date(currentVal).getTime())) ? new Date(currentVal) : new Date();
      baseDate.setFullYear(baseDate.getFullYear() + years);
      endInput.value = baseDate.toISOString().substring(0, 10);
      Utils.showToast('Preset Applied', `Added +${years} year(s) to warranty expiration.`);
    }

    async handleSaveWarranty(formData) {
      const assetId = formData.get('warrantyAssetId')?.trim();
      const warrantyType = formData.get('warrantyType') || 'Full System';
      const coverageMode = document.getElementById('warrantyCoverageStatus')?.value || 'date';
      const isNonW = (coverageMode === 'non-warranty' || warrantyType === 'Non-Warranty');
      const rawEnd = formData.get('warrantyEndDate')?.trim();
      const warrantyEnd = (isNonW || !rawEnd) ? 'Non-Warranty' : rawEnd;
      const remark = formData.get('warrantyRemark')?.trim();

      if (!assetId) {
        Utils.showToast('Validation Error', 'Asset ID missing.', 'error');
        return;
      }
      if (!isNonW && !rawEnd) {
        Utils.showToast('Validation Error', 'Please select a valid warranty expiration date.', 'error');
        return;
      }

      const asset = (store.data.assets || []).find(a => a.id === assetId);
      if (asset) {
        asset.warrantyType = warrantyType;
        asset.warrantyEnd = warrantyEnd;
        if (remark) asset.remark = remark;
        store.addActivity('Extended Warranty', asset.id, 'Sundar Pichai (SysAdmin)', 'Success');
        store.save();

        if (store.isServerConnected) {
          try {
            await fetch(`/api/assets/${encodeURIComponent(assetId)}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ warrantyEnd, warrantyType: asset.warrantyType, remark: asset.remark })
            });
          } catch (e) {
            console.warn('Backend PUT asset warranty failed', e);
          }
        }
        Utils.showToast('Warranty Updated', `Warranty for ${asset.id} extended to ${Utils.formatDate(warrantyEnd)}.`);
      }

      this.closeModal('modalEditWarranty');
      document.getElementById('editWarrantyForm')?.reset();
      this.renderWarrantyTable();
      this.renderAllAssetsTable();
      this.updateDashboardMetrics();
    }

    /* ==========================================================================
       MODAL CONTROLLER
       ========================================================================== */
    setupModals() {
      // Close button handlers
      document.querySelectorAll('.modal-close-btn, [data-close-modal]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const overlay = btn.closest('.modal-overlay, .modal-backdrop');
          if (overlay) {
            overlay.classList.remove('active');
            overlay.style.display = 'none';
          }
        });
      });

      // Click outside to close
      document.querySelectorAll('.modal-overlay, .modal-backdrop').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
          if (e.target === overlay) {
            overlay.classList.remove('active');
            overlay.style.display = 'none';
            if (overlay.id === 'modalConfirmSaveAsset') {
              this.pendingEditFormData = null;
            }
            if (overlay.id === 'modalConfirmReturnStock') {
              this.pendingReturnAssetId = null;
            }
          }
        });
      });
    }

    openModal(modalId) {
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.classList.add('active');
        modal.style.display = 'flex';
      }
    }

    closeModal(modalId) {
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.classList.remove('active');
        modal.style.display = 'none';
        if (modalId === 'modalConfirmSaveAsset') {
          this.pendingEditFormData = null;
        }
        if (modalId === 'modalConfirmReturnStock') {
          this.pendingReturnAssetId = null;
        }
      }
    }

    handleEscapeKeyPress() {
      // 1. Popovers and spotlight dropdowns
      const pop = document.getElementById('notificationPopover');
      if (pop && pop.classList.contains('active')) {
        pop.classList.remove('active');
        return;
      }
      const spot = document.getElementById('spotlightResultsDropdown');
      if (spot && spot.classList.contains('active')) {
        spot.classList.remove('active');
        return;
      }

      // 2. High-priority confirmation modals first
      const delModal = document.getElementById('modalConfirmDeleteComponent');
      if (delModal && (delModal.classList.contains('active') || delModal.style.display === 'flex' || delModal.style.display === 'block')) {
        this.cancelDeleteWarrantyComponent();
        return;
      }
      const confirmSave = document.getElementById('modalConfirmSaveAsset');
      if (confirmSave && (confirmSave.classList.contains('active') || confirmSave.style.display === 'flex' || confirmSave.style.display === 'block')) {
        this.cancelSaveAssetEdit();
        return;
      }
      const confirmReturn = document.getElementById('modalConfirmReturnStock');
      if (confirmReturn && (confirmReturn.classList.contains('active') || confirmReturn.style.display === 'flex' || confirmReturn.style.display === 'block')) {
        this.cancelReturnSystemToStock();
        return;
      }

      // 3. Find any open modal overlays and close the topmost one
      const openOverlays = Array.from(document.querySelectorAll('.modal-overlay, .modal-backdrop')).filter(m => {
        return m.classList.contains('active') || (m.style.display && m.style.display !== 'none');
      });

      if (openOverlays.length > 0) {
        const topModal = openOverlays[openOverlays.length - 1];
        this.closeModal(topModal.id);
      }
    }

    populateEditAssetModal(asset) {
      // 1. Hidden original ID for lookup
      const originalIdInput = document.getElementById('editAssetOriginalId');
      if (originalIdInput) originalIdInput.value = asset.id;

      // 2. Summary Banner
      const typeBadge = document.getElementById('editAssetTypeBadge');
      if (typeBadge) typeBadge.textContent = asset.type || 'Desktop';
      const idBadge = document.getElementById('editAssetIdBadge');
      if (idBadge) idBadge.textContent = asset.id;
      const userBadge = document.getElementById('editAssetUserBadge');
      if (userBadge) userBadge.textContent = asset.user ? `• Assigned to ${asset.user}` : '• Unassigned (In Inventory)';
      const statusBadge = document.getElementById('editAssetStatusBadge');
      if (statusBadge) {
        statusBadge.textContent = asset.status || 'Assigned';
        statusBadge.className = `status-pill ${asset.status === 'Assigned' ? 'status-assigned' :
            asset.status === 'Non-Assigned' ? 'status-non-assigned' :
              asset.status === 'Swap' ? 'status-swap' :
                asset.status === 'Repair' ? 'status-repair' : 'status-warranty'
          }`;
      }

      // 3. Hardware Specs
      const cpuInput = document.getElementById('editAssetCpu');
      if (cpuInput) cpuInput.value = asset.cpu || '';

      const ramInput = document.getElementById('editAssetRam');
      if (ramInput) ramInput.value = asset.ram || '';

      const ssdInput = document.getElementById('editAssetSsd');
      if (ssdInput) ssdInput.value = asset.ssd || 'None';

      const hddInput = document.getElementById('editAssetHdd');
      if (hddInput) hddInput.value = asset.hdd || 'None';

      const monitorInput = document.getElementById('editAssetMonitor');
      if (monitorInput) monitorInput.value = asset.monitor || '';

      const typeSelect = document.getElementById('editAssetType');
      if (typeSelect) typeSelect.value = asset.type || 'Desktop';

      // 4. User Assignment & Team
      const userInput = document.getElementById('editAssetUser');
      if (userInput) userInput.value = asset.user || (asset.status !== 'Non-Assigned' && asset.oldUsername && asset.oldUsername !== 'None' ? asset.oldUsername : '');

      const tlInput = document.getElementById('editAssetTl');
      if (tlInput) tlInput.value = asset.tl || '-';


      const teamSelect = document.getElementById('editAssetTeam');
      if (teamSelect) {
        const teams = store.data.settings.teams || ['SYSTEM ADMIN', 'PHP', 'MOBIL TEAM', 'AI', 'ADMIN', 'ACCOUNT', 'HR'];
        teamSelect.innerHTML = teams.map(t => `<option value="${t}">${t}</option>`).join('');
        if (asset.team && teams.includes(asset.team)) {
          teamSelect.value = asset.team;
        } else if (asset.team) {
          teamSelect.innerHTML += `<option value="${asset.team}">${asset.team}</option>`;
          teamSelect.value = asset.team;
        }
      }

      const statusSelect = document.getElementById('editAssetStatus');
      const workStatusSelect = document.getElementById('editAssetWorkStatus');

      // 1. Populate System Status
      if (statusSelect) {
        const rawStatus = (asset.status || '').trim();
        statusSelect.value = rawStatus || 'Assigned';
        if (!statusSelect.value && rawStatus) {
          const opt = document.createElement('option');
          opt.value = rawStatus;
          opt.textContent = rawStatus;
          statusSelect.appendChild(opt);
          statusSelect.value = rawStatus;
        }
        statusSelect.onchange = (e) => this.handleSystemStatusChange(e.target.value);
        this.updateSystemStatusBadge(statusSelect.value);
      }

      // 2. Populate Employee Work Status
      if (workStatusSelect) {
        let rawWorkStatus = (asset.workStatus || '').trim();
        // Fallback if empty so the box is never blank
        if (!rawWorkStatus) {
          if (asset.status === 'Non-Assigned') rawWorkStatus = 'In Stock';
          else if (asset.status === 'WFH') rawWorkStatus = 'Work From Home';
          else rawWorkStatus = 'Currently Working';
        }
        workStatusSelect.value = rawWorkStatus;
        if (!workStatusSelect.value && rawWorkStatus) {
          for (let i = 0; i < workStatusSelect.options.length; i++) {
            if (workStatusSelect.options[i].value.toLowerCase() === rawWorkStatus.toLowerCase()) {
              workStatusSelect.selectedIndex = i;
              break;
            }
          }
          if (!workStatusSelect.value) {
            const opt = document.createElement('option');
            opt.value = rawWorkStatus;
            opt.textContent = rawWorkStatus;
            workStatusSelect.appendChild(opt);
            workStatusSelect.value = rawWorkStatus;
          }
        }
        workStatusSelect.onchange = (e) => this.handleWorkStatusChange(e.target.value);
      }

      const locationInput = document.getElementById('editAssetLocation');
      if (locationInput) locationInput.value = asset.location || '';

      const conditionSelect = document.getElementById('editAssetCondition');
      if (conditionSelect) conditionSelect.value = asset.condition || 'Good';

      const oldUserInput = document.getElementById('editAssetOldUsername');
      if (oldUserInput) oldUserInput.value = asset.oldUsername || '';

      const exitDateInput = document.getElementById('editAssetExitDate');
      if (exitDateInput) {
        exitDateInput.value = asset.userExitDate || (asset.workStatus === 'User Exit' ? (asset.availableDate || new Date().toISOString().substring(0, 10)) : '');
      }

      const availDateInput = document.getElementById('editAssetAvailableDate');
      if (availDateInput) {
        availDateInput.value = asset.availableDate || (asset.workStatus === 'In Stock' || asset.status === 'Non-Assigned' ? (asset.userExitDate || new Date().toISOString().substring(0, 10)) : '');
      }

      // 5. System Identifiers & Dates
      const idInput = document.getElementById('editAssetId');
      if (idInput) idInput.value = asset.id;

      const serialInput = document.getElementById('editAssetSerialNumber');
      if (serialInput) serialInput.value = asset.serialNumber || '';

      const ipInput = document.getElementById('editAssetIpAddress');
      if (ipInput) ipInput.value = asset.ipAddress || '';

      const osSelect = document.getElementById('editAssetOs');
      if (osSelect) {
        const rawOs = (asset.os || 'Windows 11 Pro').trim();
        let matched = false;
        for (let i = 0; i < osSelect.options.length; i++) {
          const optVal = osSelect.options[i].value.trim();
          if (optVal.toLowerCase() === rawOs.toLowerCase() ||
            optVal.replace(/\s*lts/i, '').trim().toLowerCase() === rawOs.replace(/\s*lts/i, '').trim().toLowerCase() ||
            optVal.replace(/\s*pro/i, '').trim().toLowerCase() === rawOs.replace(/\s*pro/i, '').trim().toLowerCase()) {
            osSelect.selectedIndex = i;
            matched = true;
            break;
          }
        }
        if (!matched) {
          if (rawOs) {
            const opt = document.createElement('option');
            opt.value = rawOs;
            opt.textContent = rawOs;
            osSelect.appendChild(opt);
            osSelect.value = rawOs;
          } else {
            osSelect.value = 'Windows 11 Pro';
          }
        }
      }

      const assignedDateInput = document.getElementById('editAssetAssignedDate');
      if (assignedDateInput) assignedDateInput.value = asset.assignedDate || '';

      const isNonWarranty = !asset.warrantyEnd || asset.warrantyEnd === 'Non-Warranty' || asset.warrantyEnd === 'None' || asset.warrantyType === 'Non-Warranty';
      const warrantyTypeSelect = document.getElementById('editAssetWarrantyType');
      if (warrantyTypeSelect) warrantyTypeSelect.value = asset.warrantyType || (isNonWarranty ? 'Non-Warranty' : 'Full System');

      const warrantyStatusSelect = document.getElementById('editAssetWarrantyStatus');
      if (warrantyStatusSelect) {
        warrantyStatusSelect.value = isNonWarranty ? 'non-warranty' : 'date';
      }

      const warrantyEndInput = document.getElementById('editAssetWarrantyEnd');
      if (warrantyEndInput) {
        warrantyEndInput.value = isNonWarranty ? '' : (asset.warrantyEnd || '');
        warrantyEndInput.disabled = isNonWarranty;
        warrantyEndInput.style.opacity = isNonWarranty ? '0.45' : '1';
      }

      const remarkInput = document.getElementById('editAssetRemark');
      if (remarkInput) remarkInput.value = asset.remark || '';

      // Initialize dynamic repeatable warranty component tracker
      let components = [];
      if (Array.isArray(asset.warrantyComponents) && asset.warrantyComponents.length > 0) {
        components = JSON.parse(JSON.stringify(asset.warrantyComponents));
      } else if (typeof asset.warrantyComponents === 'string' && asset.warrantyComponents.trim()) {
        try {
          const parsed = JSON.parse(asset.warrantyComponents);
          if (Array.isArray(parsed) && parsed.length > 0) components = parsed;
        } catch (e) {}
      }

      if (components.length === 0) {
        const defaultAssigned = asset.assignedDate || new Date().toISOString().substring(0, 10);
        const defaultExpiry = isNonWarranty ? '' : (asset.warrantyEnd && asset.warrantyEnd !== 'Non-Warranty' && asset.warrantyEnd !== 'None' ? asset.warrantyEnd : '');

        // Prepopulate individual hardware components from specs if available
        if (asset.ram && asset.ram.toLowerCase() !== 'none') {
          components.push({
            id: 'wc-' + Date.now() + '-ram',
            type: 'RAM',
            assignedDate: defaultAssigned,
            expiryDate: defaultExpiry
          });
        }
        if (asset.ssd && asset.ssd.toLowerCase() !== 'none') {
          components.push({
            id: 'wc-' + (Date.now() + 1) + '-ssd',
            type: 'SSD',
            assignedDate: defaultAssigned,
            expiryDate: defaultExpiry
          });
        }
        if (asset.hdd && asset.hdd.toLowerCase() !== 'none') {
          components.push({
            id: 'wc-' + (Date.now() + 2) + '-hdd',
            type: 'HDD',
            assignedDate: defaultAssigned,
            expiryDate: defaultExpiry
          });
        }
        if (asset.monitor && asset.monitor.toLowerCase() !== 'none') {
          components.push({
            id: 'wc-' + (Date.now() + 3) + '-mon',
            type: 'Monitor',
            assignedDate: defaultAssigned,
            expiryDate: defaultExpiry
          });
        }

        // Fallback to Full System if no individual component specs
        if (components.length === 0) {
          components.push({
            id: 'wc-init-' + Date.now(),
            type: asset.warrantyType || (isNonWarranty ? 'Non-Warranty' : 'Full System'),
            assignedDate: defaultAssigned,
            expiryDate: defaultExpiry
          });
        }
      }

      this.renderWarrantyComponentRows(components);

      // Reset Save Data Buttons & Badges
      const headerBtn = document.getElementById('btnHeaderSaveAsset');
      const footerBtn = document.getElementById('btnSaveAssetEdit');
      if (headerBtn) {
        headerBtn.innerHTML = '💾 Save Data';
        headerBtn.classList.remove('btn-saved-success');
      }
      if (footerBtn) {
        footerBtn.innerHTML = '💾 Save Data';
        footerBtn.classList.remove('btn-saved-success');
      }
      const savedTag = document.getElementById('editAssetSavedTag');
      const stateBadge = document.getElementById('editAssetSaveStateBadge');
      const feedbackEl = document.getElementById('editModalSavedFeedback');
      if (feedbackEl) feedbackEl.style.display = 'none';

      if (asset.isRecentlySaved) {
        if (savedTag) {
          savedTag.style.display = 'inline-flex';
          savedTag.textContent = '✓ Saved Data';
        }
        if (stateBadge) {
          stateBadge.style.display = 'inline-flex';
          stateBadge.className = 'save-state-pill saved';
          stateBadge.textContent = `✓ Saved Data (${asset.lastSavedAt || 'Recently'})`;
        }
      } else {
        if (savedTag) savedTag.style.display = 'none';
        if (stateBadge) stateBadge.style.display = 'none';
      }

      // Track input changes to show unsaved changes indicator
      const editForm = document.getElementById('editAssetForm');
      if (editForm && !editForm.dataset.changeBound) {
        editForm.dataset.changeBound = 'true';
        editForm.addEventListener('input', () => {
          const b = document.getElementById('editAssetSaveStateBadge');
          if (b) {
            b.textContent = '● Unsaved Changes (Click Save Data)';
            b.className = 'save-state-pill unsaved';
            b.style.display = 'inline-flex';
          }
          const st = document.getElementById('editAssetSavedTag');
          if (st) st.style.display = 'none';
        });
      }
    }

    validateEditAssetForm(formData) {
      const originalId = formData.get('editOriginalAssetId')?.trim();
      const newId = formData.get('editAssetId')?.trim();
      const cpu = formData.get('editCpu')?.trim();
      const ram = formData.get('editRam')?.trim();
      const type = formData.get('editType')?.trim();
      const team = formData.get('editTeam')?.trim();
      const status = formData.get('editStatus')?.trim();
      const workStatus = formData.get('editWorkStatus')?.trim();

      const requiredFields = [
        { id: 'editAssetId', val: newId, label: 'Asset ID / Tag' },
        { id: 'editCpu', val: cpu, label: 'CPU Configuration' },
        { id: 'editRam', val: ram, label: 'RAM Memory' },
        { id: 'editType', val: type, label: 'Asset Type' },
        { id: 'editTeam', val: team, label: 'Department / Team' },
        { id: 'editAssetStatus', val: status, label: 'System Status' },
        { id: 'editAssetWorkStatus', val: workStatus, label: 'Employee Work Status' }
      ];

      const emptyFields = [];
      requiredFields.forEach(f => {
        const el = document.getElementById(f.id);
        if (el) el.classList.remove('is-invalid');
        if (!f.val || !f.val.toString().trim()) {
          emptyFields.push(f);
          if (el) {
            el.classList.add('is-invalid');
            const clearInvalid = () => el.classList.remove('is-invalid');
            el.addEventListener('input', clearInvalid, { once: true });
            el.addEventListener('change', clearInvalid, { once: true });
          }
        }
      });

      if (emptyFields.length > 0) {
        const headerBtn = document.getElementById('btnHeaderSaveAsset');
        const footerBtn = document.getElementById('btnSaveAssetEdit');
        if (headerBtn) headerBtn.innerHTML = '💾 Save Data';
        if (footerBtn) footerBtn.innerHTML = '💾 Save Data';

        const firstEl = document.getElementById(emptyFields[0].id);
        if (firstEl) {
          firstEl.focus();
          if (firstEl.scrollIntoView) {
            firstEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }

        const isStatusEmpty = emptyFields.some(f => f.id === 'editAssetStatus');
        const isWorkStatusEmpty = emptyFields.some(f => f.id === 'editAssetWorkStatus');

        if (isStatusEmpty && isWorkStatusEmpty) {
          Utils.showToast('Validation Error', 'System Status & Employee Work Status boxes are empty! Fill both before saving.', 'error');
        } else if (isStatusEmpty) {
          Utils.showToast('Validation Error', 'System Status column cannot be empty! Please select a valid System Status.', 'error');
        } else if (isWorkStatusEmpty) {
          Utils.showToast('Validation Error', 'Employee Work Status column cannot be empty! Please select an Employee Work Status.', 'error');
        } else {
          Utils.showToast('Validation Error', `Please fill in all required boxes: ${emptyFields.map(f => f.label).join(', ')}.`, 'error');
        }

        return false;
      }

      // Check for ID collision if ID was renamed
      if (newId && originalId && newId.toLowerCase() !== originalId.toLowerCase()) {
        const exists = store.data.assets.some(a => a.id.toLowerCase() === newId.toLowerCase());
        if (exists) {
          Utils.showToast('Duplicate Asset ID', `An asset with ID "${newId}" already exists.`, 'error');
          const idEl = document.getElementById('editAssetId');
          if (idEl) {
            idEl.classList.add('is-invalid');
            idEl.focus();
          }
          return false;
        }
      }

      return true;
    }

    promptConfirmSaveAsset(formData) {
      if (!this.validateEditAssetForm(formData)) {
        return;
      }

      const newId = formData.get('editAssetId')?.trim();

      // Store pending formData
      this.pendingEditFormData = formData;

      // Update confirmation message
      const msgEl = document.getElementById('confirmSaveAssetMessage');
      if (msgEl) {
        msgEl.innerHTML = `Are you sure you want to save and confirm the changes for <strong>${Utils.escapeHtml(newId)}</strong>?`;
      }

      // Open custom confirmation modal
      const confirmModal = document.getElementById('modalConfirmSaveAsset');
      if (confirmModal) {
        confirmModal.classList.add('active');
      } else {
        this.executeSaveAssetEdit(formData);
      }
    }

    confirmProceedSaveAsset() {
      const confirmModal = document.getElementById('modalConfirmSaveAsset');
      if (confirmModal) confirmModal.classList.remove('active');

      if (this.pendingEditFormData) {
        const data = this.pendingEditFormData;
        this.pendingEditFormData = null;
        this.executeSaveAssetEdit(data);
      }
    }

    cancelSaveAssetEdit() {
      const confirmModal = document.getElementById('modalConfirmSaveAsset');
      if (confirmModal) confirmModal.classList.remove('active');
      this.pendingEditFormData = null;
    }

    updateSystemStatusBadge(systemStatus) {
      const statusBadge = document.getElementById('editAssetStatusBadge');
      if (statusBadge) {
        statusBadge.textContent = systemStatus || 'Status';
        statusBadge.className = 'status-pill ' + (
          systemStatus === 'Assigned' ? 'status-assigned' :
            systemStatus === 'Non-Assigned' ? 'status-non-assigned' :
              systemStatus === 'WFH' ? 'status-wfh' :
                systemStatus === 'Spare' ? 'status-spare' :
                  systemStatus === 'Maintenance' ? 'status-maintenance' :
                    systemStatus === 'Swap' ? 'status-swap' :
                      systemStatus === 'Repair' ? 'status-repair' : 'status-warranty'
        );
      }
    }

    handleWorkStatusChange(workStatus) {
      const statusSelect = document.getElementById('editAssetStatus');
      if (!statusSelect) return;

      if (workStatus === 'User Exit') {
        statusSelect.value = 'Non-Assigned';
        this.updateSystemStatusBadge('Non-Assigned');
        const exitDateEl = document.getElementById('editAssetExitDate');
        if (exitDateEl && !exitDateEl.value) {
          exitDateEl.value = new Date().toISOString().substring(0, 10);
        }
      } else if (workStatus === 'In Stock') {
        if (statusSelect.value !== 'Non-Assigned') {
          statusSelect.value = 'Non-Assigned';
          this.updateSystemStatusBadge('Non-Assigned');
        }
        const availDateEl = document.getElementById('editAssetAvailableDate');
        if (availDateEl && !availDateEl.value) {
          availDateEl.value = new Date().toISOString().substring(0, 10);
        }
      }
    }

    handleSystemStatusChange(systemStatus) {
      this.updateSystemStatusBadge(systemStatus);

      const workStatusSelect = document.getElementById('editAssetWorkStatus');
      if (workStatusSelect) {
        if (systemStatus === 'Non-Assigned') {
          if (workStatusSelect.value !== 'User Exit') {
            workStatusSelect.value = 'In Stock';
          }
        } else if (systemStatus === 'WFH') {
          workStatusSelect.value = 'Work From Home';
        } else if (systemStatus === 'Assigned') {
          if (workStatusSelect.value === 'In Stock' || !workStatusSelect.value) {
            workStatusSelect.value = 'Currently Working';
          }
        }
      }
    }

    executeSaveAssetEdit(formData) {
      try {
        if (!this.validateEditAssetForm(formData)) {
          return;
        }

        const originalId = formData.get('editOriginalAssetId')?.trim();
        const newId = formData.get('editAssetId')?.trim();
        const cpu = formData.get('editCpu')?.trim();
        const ram = formData.get('editRam')?.trim();
        const ssd = formData.get('editSsd')?.trim() || 'None';
        const hdd = formData.get('editHdd')?.trim() || 'None';
        const monitor = formData.get('editMonitor')?.trim() || 'None';
        const type = formData.get('editType')?.trim();
        const user = formData.get('editUser')?.trim() || '';
        const team = formData.get('editTeam')?.trim();
        const tl = formData.get('editTl')?.trim() || '-';
        let status = formData.get('editStatus')?.trim();
        let workStatus = formData.get('editWorkStatus')?.trim();
        if (workStatus === 'User Exit') {
          status = 'Non-Assigned';
        }
        const rawExitDate = formData.get('editExitDate')?.trim();
        const rawAvailableDate = formData.get('editAvailableDate')?.trim();
        const location = formData.get('editLocation')?.trim() || '';
        const condition = formData.get('editCondition');
        const oldUsername = formData.get('editOldUsername')?.trim() || 'None';
        const serialNumber = formData.get('editSerialNumber')?.trim() || '';
        const hostname = '';
        const ipAddress = formData.get('editIpAddress')?.trim() || '';
        const os = formData.get('editOs');
        const assignedDate = formData.get('editAssignedDate') || new Date().toISOString().substring(0, 10);
        const warrantyType = formData.get('editWarrantyType') || 'Full System';
        const warrantyMode = document.getElementById('editAssetWarrantyStatus')?.value || 'date';
        const isNonWarranty = (warrantyMode === 'non-warranty' || warrantyType === 'Non-Warranty');
        const rawWarrantyEnd = formData.get('editWarrantyEnd') || '';
        const warrantyEnd = (isNonWarranty || !rawWarrantyEnd) ? 'Non-Warranty' : rawWarrantyEnd;
        const remark = formData.get('editRemark')?.trim() || '';

        const asset = store.data.assets.find(a => a.id === originalId);
        if (!asset) {
          Utils.showToast('Error', 'Original asset not found in database.', 'error');
          return;
        }

        const userExitDate = rawExitDate || (workStatus === 'User Exit' ? (asset.userExitDate || new Date().toISOString().substring(0, 10)) : '');

        // Visual button saving state
        const headerBtn = document.getElementById('btnHeaderSaveAsset');
        const footerBtn = document.getElementById('btnSaveAssetEdit');
        if (headerBtn) headerBtn.innerHTML = '⏳ Saving...';
        if (footerBtn) footerBtn.innerHTML = '⏳ Saving...';

        const prevUser = asset.user;
        const prevCpu = asset.cpu;
        const prevRam = asset.ram;
        const prevHdd = asset.hdd;
        const prevMonitor = asset.monitor;

        // Update asset properties
        asset.id = newId;
        asset.type = type;
        asset.cpu = cpu;
        asset.ram = ram;
        asset.ssd = ssd;
        asset.hdd = hdd;
        asset.monitor = monitor;
        asset.team = team;
        asset.tl = tl;

        const isMarkedNonAssigned = (status === 'Non-Assigned' || workStatus === 'User Exit' || workStatus === 'In Stock');
        if (isMarkedNonAssigned) {
          asset.status = 'Non-Assigned';
          asset.workStatus = workStatus || 'In Stock';
          const defaultToday = new Date().toISOString().substring(0, 10);
          const exitDate = rawExitDate || (workStatus === 'User Exit' ? (asset.userExitDate || defaultToday) : (asset.userExitDate || ''));
          const availDate = rawAvailableDate || (workStatus === 'In Stock' ? (asset.availableDate || defaultToday) : (asset.availableDate || exitDate || defaultToday));
          asset.userExitDate = exitDate;
          asset.availableDate = availDate;
          const departingUser = prevUser || user;
          if (departingUser && departingUser !== 'None' && departingUser !== 'NEW SYSTEM' && departingUser !== 'Unassigned') {
            asset.oldUsername = departingUser;
          } else if (oldUsername && oldUsername !== 'None') {
            asset.oldUsername = oldUsername;
          }
          if (workStatus === 'User Exit' || workStatus === 'In Stock') {
            asset.user = ''; // System is in stock / exited
          } else {
            asset.user = user || prevUser || (oldUsername && oldUsername !== 'None' ? oldUsername : '');
          }
        } else {
          asset.status = status || 'Assigned';
          asset.workStatus = workStatus || 'Currently Working';
          asset.user = user || prevUser || (oldUsername && oldUsername !== 'None' ? oldUsername : '');
          asset.oldUsername = oldUsername;
          if (rawExitDate !== undefined) asset.userExitDate = rawExitDate;
          if (rawAvailableDate !== undefined) asset.availableDate = rawAvailableDate;
        }
        asset.serialNumber = serialNumber;
        asset.hostname = hostname;
        asset.ipAddress = ipAddress;
        asset.os = os;
        asset.assignedDate = assignedDate;

        // Collect dynamic warranty components
        const warrantyComponents = this.collectWarrantyComponentsFromForm();
        asset.warrantyComponents = warrantyComponents;

        let finalWarrantyType = warrantyType;
        let finalWarrantyEnd = warrantyEnd;

        if (warrantyComponents.length > 0) {
          const firstComp = warrantyComponents[0];
          finalWarrantyType = firstComp.type || warrantyType;
          const validExpiries = warrantyComponents
            .filter(c => c.expiryDate && c.expiryDate !== 'Non-Warranty' && c.type !== 'Non-Warranty')
            .map(c => c.expiryDate);
          if (validExpiries.length > 0) {
            finalWarrantyEnd = validExpiries[0];
          } else {
            finalWarrantyEnd = 'Non-Warranty';
          }
        }

        asset.warrantyType = finalWarrantyType;
        asset.warrantyEnd = finalWarrantyEnd;
        asset.remark = remark;
        asset.isRecentlySaved = true;
        asset.lastSavedAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        asset.savedStatus = 'Saved Data';

        // Sync with users list
        if (user && user !== prevUser) {
          const existingUser = store.data.users.find(u => u.name.toLowerCase() === user.toLowerCase());
          if (existingUser) {
            existingUser.assetId = newId;
            existingUser.assetType = type;
            existingUser.team = team;
            existingUser.status = 'Assigned';
          } else {
            store.data.users.unshift({
              id: `USR-${Math.floor(100 + Math.random() * 900)}`,
              name: user,
              email: `${user.toLowerCase().replace(/\s+/g, '.')}@apextech.com`,
              team,
              assetId: newId,
              assetType: type,
              status: 'Assigned',
              joinDate: assignedDate
            });
          }
        }

        // If asset was reassigned away from prevUser
        if (prevUser && prevUser !== user) {
          const oldUserObj = store.data.users.find(u => u.name.toLowerCase() === prevUser.toLowerCase());
          if (oldUserObj && oldUserObj.assetId === originalId) {
            oldUserObj.assetId = '';
            oldUserObj.status = 'Pending';
          }
        }

        // Sync with antivirus table if asset ID changed
        if (originalId !== newId) {
          store.data.antivirus.forEach(av => {
            if (av.assetId === originalId) av.assetId = newId;
          });
        }

        // Log activity
        const specDiff = [];
        if (prevCpu !== cpu) specDiff.push(`CPU: ${cpu}`);
        if (prevRam !== ram) specDiff.push(`RAM: ${ram}`);
        if (prevHdd !== hdd) specDiff.push(`HDD: ${hdd}`);
        if (prevMonitor !== monitor) specDiff.push(`Monitor: ${monitor}`);
        const changeSummary = specDiff.length > 0 ? specDiff.join(', ') : 'Specifications Updated';

        store.addActivity(`Saved Data for ${newId} (${changeSummary})`, newId, 'Sundar Pichai (SysAdmin)', 'Success');

        // Persist to store
        store.save();

        // Async push to backend server if connected
        if (store.isServerConnected) {
          fetch(`/api/assets/${encodeURIComponent(originalId)}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(asset)
          }).catch(() => { });
        }

        // Update feedback elements in the modal
        if (headerBtn) {
          headerBtn.innerHTML = '✅ Saved Data!';
          headerBtn.classList.add('btn-saved-success');
        }
        if (footerBtn) {
          footerBtn.innerHTML = '✅ Saved Data!';
          footerBtn.classList.add('btn-saved-success');
        }
        const savedTag = document.getElementById('editAssetSavedTag');
        if (savedTag) {
          savedTag.textContent = '✓ Saved Data';
          savedTag.style.display = 'inline-flex';
        }
        const stateBadge = document.getElementById('editAssetSaveStateBadge');
        if (stateBadge) {
          stateBadge.textContent = '✅ Saved Data';
          stateBadge.className = 'save-state-pill saved';
          stateBadge.style.display = 'inline-flex';
        }
        const feedbackEl = document.getElementById('editModalSavedFeedback');
        if (feedbackEl) {
          feedbackEl.textContent = '✓ Saved Data Successfully!';
          feedbackEl.style.display = 'inline-flex';
        }

        // Show Toast Notification: "Saved Data"
        Utils.showToast('Saved Data', `Saved data successfully for asset ${newId}.`);

        // Briefly wait so user sees the "Saved Data" state before closing modal
        setTimeout(() => {
          this.closeModal('modalEditAsset');
          this.updateDashboardMetrics();
          this.renderNonAssignedView();
          this.renderAssignedSystemsTable();
          this.renderCurrentView();

          // Highlight newly saved row and scroll to it
          setTimeout(() => {
            const row = document.querySelector(`tr[data-asset-id="${newId}"]`);
            if (row) {
              row.classList.add('row-saved-highlight');
              row.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
          }, 80);
        }, 400);
      } catch (err) {
        console.error('Error during asset save:', err);
        Utils.showToast('Save Error', 'Error saving asset: ' + (err.message || err), 'error');
        const headerBtn = document.getElementById('btnHeaderSaveAsset');
        const footerBtn = document.getElementById('btnSaveAssetEdit');
        if (headerBtn) {
          headerBtn.innerHTML = '💾 Save Data';
          headerBtn.classList.remove('btn-saved-success');
        }
        if (footerBtn) {
          footerBtn.innerHTML = '💾 Save Data';
          footerBtn.classList.remove('btn-saved-success');
        }
      }
    }

    viewSwapExtract(swapId) {
      const swap = (store.data.swapLogs || []).find(s => s.id === swapId);
      if (!swap) {
        Utils.showToast('Record Not Found', `Swap record ${swapId} was not found.`, 'error');
        return;
      }

      const oldAsset = (store.data.assets || []).find(a => a.id === swap.oldAssetId);
      const newAsset = (store.data.assets || []).find(a => a.id === swap.newAssetId);

      const titleEl = document.getElementById('swapExtractModalTitle');
      if (titleEl) titleEl.textContent = `Swap Transaction Extract: ${swap.id}`;

      const footerDate = document.getElementById('swapExtractFooterDate');
      if (footerDate) footerDate.textContent = `Transaction Date: ${Utils.formatDate(swap.swapDate)}`;

      const editBtn = document.getElementById('btnExtractModalEditInFacility');
      if (editBtn) {
        editBtn.onclick = () => {
          this.closeModal('modalViewSwapExtract');
          this.editSwapInFacility(swap.id);
        };
      }

      const body = document.getElementById('viewSwapExtractModalBody');
      if (body) {
        body.innerHTML = `
          <div style="background:var(--bg-subtle); padding:14px 18px; border-radius:var(--radius-md); border:1px solid var(--border-color); margin-bottom:18px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
            <div>
              <span class="status-pill status-assigned" style="font-weight:700;">TRANSACTION: ${Utils.escapeHtml(swap.id)}</span>
              <h3 style="font-size:1.15rem; font-weight:700; margin:6px 0 2px 0;">Handover Extract: ${Utils.escapeHtml(swap.oldUserId)} ➔ ${Utils.escapeHtml(swap.newUserId)}</h3>
              <span style="font-size:0.8rem; color:var(--text-muted);">Swap Date: <strong>${Utils.formatDate(swap.swapDate)}</strong> • Team: <strong>${Utils.escapeHtml(swap.newTeam)}</strong></span>
            </div>
            <span class="status-pill status-assigned" style="font-size:0.85rem; padding:6px 14px;">${Utils.escapeHtml(swap.status || 'Completed')}</span>
          </div>

          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px; margin-bottom:18px;">
            <!-- Old De-commissioned System -->
            <div style="background:#fff7ed; border:1px solid #fed7aa; border-radius:var(--radius-md); padding:16px;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                <h4 style="font-size:0.88rem; font-weight:700; color:#c2410c; margin:0; display:flex; align-items:center; gap:6px;">
                  <span>📦</span> OLD DE-COMMISSIONED SYSTEM
                </h4>
                <span class="status-pill status-warning" style="font-size:0.7rem;">In Swap Pool</span>
              </div>
              <div style="font-size:0.84rem; line-height:1.75;">
                <div>Old User: <strong>${Utils.escapeHtml(swap.oldUserId)}</strong></div>
                <div>Old Department: <strong>${Utils.escapeHtml(swap.oldTeam || oldAsset?.team || '—')}</strong></div>
                <div>Old Asset ID: <strong style="font-family:var(--font-mono); color:var(--primary);">${Utils.escapeHtml(swap.oldAssetId)}</strong></div>
                <div>System Type: <strong>${oldAsset?.type || 'Workstation'}</strong></div>
                <div>CPU: <strong>${oldAsset?.cpu || '—'}</strong></div>
                <div>RAM: <strong>${oldAsset?.ram || '—'}</strong></div>
                <div>Storage: <strong>${oldAsset?.ssd ? `${oldAsset.ssd} (SSD)` : (oldAsset?.hdd || '—')}</strong></div>
                <div>Monitor: <strong>${oldAsset?.monitor || 'None'}</strong></div>
              </div>
            </div>

            <!-- New Replacement System -->
            <div style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:var(--radius-md); padding:16px;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                <h4 style="font-size:0.88rem; font-weight:700; color:#15803d; margin:0; display:flex; align-items:center; gap:6px;">
                  <span>⚡</span> NEW REPLACEMENT SYSTEM
                </h4>
                <span class="status-pill status-assigned" style="font-size:0.7rem;">Active Assigned</span>
              </div>
              <div style="font-size:0.84rem; line-height:1.75;">
                <div>New User: <strong>${Utils.escapeHtml(swap.newUserId)}</strong></div>
                <div>New Department: <strong>${Utils.escapeHtml(swap.newTeam)}</strong></div>
                <div>New Asset ID: <strong style="font-family:var(--font-mono); color:#16a34a;">${Utils.escapeHtml(swap.newAssetId)}</strong></div>
                <div>System Type: <strong>${newAsset?.type || 'Workstation'}</strong></div>
                <div>CPU: <strong>${newAsset?.cpu || '—'}</strong></div>
                <div>RAM: <strong>${newAsset?.ram || '—'}</strong></div>
                <div>Storage: <strong>${newAsset?.ssd ? `${newAsset.ssd} (SSD)` : (newAsset?.hdd || '—')}</strong></div>
                <div>Monitor: <strong>${newAsset?.monitor || 'None'}</strong></div>
              </div>
            </div>
          </div>

          <div style="background:var(--bg-subtle); border:1px solid var(--border-color); border-radius:var(--radius-md); padding:14px 16px; font-size:0.86rem; line-height:1.6;">
            <div style="margin-bottom:8px;">
              <span style="color:var(--text-muted); font-weight:600;">Handover / Swap Reason:</span>
              <strong style="color:var(--text-main); margin-left:6px; background:#ffffff; border:1px solid var(--border-color); padding:3px 10px; border-radius:var(--radius-sm);">${Utils.escapeHtml(swap.reason || 'Routine Hardware Upgrade')}</strong>
            </div>
            <div>
              <span style="color:var(--text-muted); font-weight:600;">Admin Remarks &amp; Notes:</span>
              <span style="margin-left:6px;">${Utils.escapeHtml(swap.remark || 'Hardware handover and deployment completed.')}</span>
            </div>
          </div>
        `;
      }

      this.openModal('modalViewSwapExtract');
    }

    editSwapInFacility(swapId) {
      const swap = (store.data.swapLogs || []).find(s => s.id === swapId);
      if (!swap) {
        Utils.showToast('Record Not Found', `Swap record ${swapId} was not found.`, 'error');
        return;
      }

      this.currentEditingSwapId = swapId;
      const oldAsset = (store.data.assets || []).find(a => a.id === swap.oldAssetId);
      const newAsset = (store.data.assets || []).find(a => a.id === swap.newAssetId);

      // Hidden ID
      const editInput = document.getElementById('editingSwapId');
      if (editInput) editInput.value = swap.id;

      // Banner
      const banner = document.getElementById('swapEditingFacilityBanner');
      const bannerTitle = document.getElementById('editingSwapRecordTitle');
      if (bannerTitle) {
        bannerTitle.innerHTML = `✏️ Editing Swap Record: <strong>${Utils.escapeHtml(swap.id)}</strong> (${Utils.escapeHtml(swap.oldUserId)} ➔ ${Utils.escapeHtml(swap.newUserId)})`;
      }
      if (banner) banner.style.display = 'flex';

      // Old System Fields
      const oldUserSelect = document.getElementById('swapOldUserSelect');
      if (oldUserSelect) {
        let opt = Array.from(oldUserSelect.options).find(o => o.value === swap.oldAssetId);
        if (!opt) {
          const newOpt = document.createElement('option');
          newOpt.value = swap.oldAssetId;
          newOpt.textContent = `${swap.oldUserId} (${swap.oldAssetId} - ${swap.oldTeam || ''})`;
          oldUserSelect.appendChild(newOpt);
        }
        oldUserSelect.value = swap.oldAssetId;
      }

      const oldTeamInput = document.getElementById('swapOldTeam');
      if (oldTeamInput) oldTeamInput.value = swap.oldTeam || oldAsset?.team || '';

      const oldAssetIdInput = document.getElementById('swapOldAssetId');
      if (oldAssetIdInput) oldAssetIdInput.value = swap.oldAssetId;

      const oldDetailsInput = document.getElementById('swapOldDetails');
      if (oldDetailsInput) {
        oldDetailsInput.value = oldAsset ? `${oldAsset.type} • ${oldAsset.cpu} • ${oldAsset.ram} • ${oldAsset.ssd || oldAsset.hdd}` : `${swap.oldAssetId} (De-commissioned System)`;
      }

      const oldUsernameInput = document.getElementById('swapOldUsername');
      if (oldUsernameInput) oldUsernameInput.value = swap.oldUserId;

      // New System Fields
      const newUserInput = document.getElementById('swapNewUserInput');
      if (newUserInput) newUserInput.value = swap.newUserId;

      const newTeamSelect = document.getElementById('swapNewTeamSelect');
      if (newTeamSelect) newTeamSelect.value = swap.newTeam;

      const assetTypeSelect = document.getElementById('swapAssetTypeSelect');
      if (assetTypeSelect) assetTypeSelect.value = newAsset?.type || (swap.newAssetId.includes('LPT') ? 'Laptop' : 'Desktop');

      const newAssetIdInput = document.getElementById('swapNewAssetId');
      if (newAssetIdInput) newAssetIdInput.value = swap.newAssetId;

      const cpuInput = document.getElementById('swapCpuInput');
      if (cpuInput) cpuInput.value = newAsset?.cpu || 'Intel Core i7-13700 3.4GHz';

      const ramSelect = document.getElementById('swapRamSelect');
      if (ramSelect) ramSelect.value = newAsset?.ram || '32GB DDR5';

      const ssdSelect = document.getElementById('swapSsdSelect');
      if (ssdSelect) ssdSelect.value = newAsset?.ssd || '1TB NVMe M.2';

      const hddSelect = document.getElementById('swapHddSelect');
      if (hddSelect) hddSelect.value = newAsset?.hdd || 'None';

      const monitorInput = document.getElementById('swapMonitorInput');
      if (monitorInput) monitorInput.value = newAsset?.monitor || '';

      const assignedDateInput = document.getElementById('swapAssignedDateInput');
      if (assignedDateInput) assignedDateInput.value = newAsset?.assignedDate || swap.swapDate || '';

      // Parameters
      const reasonInput = document.getElementById('swapReasonInput');
      if (reasonInput) reasonInput.value = swap.reason || '';

      const swapDateInput = document.querySelector('[name="swapDate"]');
      if (swapDateInput) swapDateInput.value = swap.swapDate || '';

      const swapStatusSelect = document.querySelector('[name="swapStatus"]');
      if (swapStatusSelect) swapStatusSelect.value = swap.status || 'Completed';

      const swapRemarkInput = document.querySelector('[name="swapRemark"]');
      if (swapRemarkInput) swapRemarkInput.value = swap.remark || '';

      // Submit Button
      const submitBtn = document.getElementById('btnSubmitSwapFacility');
      if (submitBtn) {
        submitBtn.innerHTML = '💾 Update Swap Facility Transaction';
      }

      const statusText = document.getElementById('swapFacilityStatusText');
      if (statusText) {
        statusText.innerHTML = `<strong>Editing ${swap.id}:</strong> Modify specifications above and click Update.`;
      }

      // Smooth scroll up to facility
      const facilityCard = document.getElementById('systemSwapFacilityCard');
      if (facilityCard) {
        facilityCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }

      Utils.showToast('Loaded into Facility', `Transaction ${swap.id} loaded into System Swap Facility. You can now edit all specs.`);
    }

    cancelFacilitySwapEdit() {
      this.currentEditingSwapId = null;
      const editInput = document.getElementById('editingSwapId');
      if (editInput) editInput.value = '';

      const banner = document.getElementById('swapEditingFacilityBanner');
      if (banner) banner.style.display = 'none';

      const form = document.getElementById('swapSystemForm');
      if (form) form.reset();

      const submitBtn = document.getElementById('btnSubmitSwapFacility');
      if (submitBtn) {
        submitBtn.innerHTML = 'Confirm System Swap';
      }

      const statusText = document.getElementById('swapFacilityStatusText');
      if (statusText) {
        statusText.innerHTML = '💡 Select an active user system to swap, or edit existing records from the transaction history below.';
      }
    }

    resetSwapFacilityForm() {
      this.cancelFacilitySwapEdit();
    }

    filterSwapHistory() {
      this.renderSwapHistoryTable();
    }

    resetSwapDateFilter() {
      const f = document.getElementById('swapDateFilterFrom');
      const t = document.getElementById('swapDateFilterTo');
      const s = document.getElementById('swapHistorySearch');
      if (f) f.value = '';
      if (t) t.value = '';
      if (s) s.value = '';
      this.renderSwapHistoryTable();
    }

    extractSwapDataCSV() {
      let list = store.data.swapLogs || [];
      const fromDate = document.getElementById('swapDateFilterFrom')?.value || '';
      const toDate = document.getElementById('swapDateFilterTo')?.value || '';
      const query = (document.getElementById('swapHistorySearch')?.value || '').toLowerCase().trim();

      list = list.filter(s => {
        const dateVal = s.swapDate || '';
        const matchesFrom = !fromDate || dateVal >= fromDate;
        const matchesTo = !toDate || dateVal <= toDate;
        const matchesQuery = !query ||
          (s.id && s.id.toLowerCase().includes(query)) ||
          (s.newUserId && s.newUserId.toLowerCase().includes(query)) ||
          (s.newTeam && s.newTeam.toLowerCase().includes(query)) ||
          (s.newAssetId && s.newAssetId.toLowerCase().includes(query)) ||
          (s.oldUserId && s.oldUserId.toLowerCase().includes(query)) ||
          (s.oldAssetId && s.oldAssetId.toLowerCase().includes(query)) ||
          (s.reason && s.reason.toLowerCase().includes(query)) ||
          (s.status && s.status.toLowerCase().includes(query));
        return matchesFrom && matchesTo && matchesQuery;
      });

      const headers = ['Swap ID', 'New User', 'New Team', 'New Asset ID', 'Old User', 'Old Team', 'Old Asset ID', 'Swap Reason', 'Date', 'Status', 'Remarks'];
      const rows = [headers];
      list.forEach(s => {
        rows.push([
          s.id,
          s.newUserId,
          s.newTeam,
          s.newAssetId,
          s.oldUserId,
          s.oldTeam || '',
          s.oldAssetId,
          s.reason,
          s.swapDate,
          s.status || 'Completed',
          s.remark || ''
        ]);
      });

      Utils.exportToCSV(`System_Swap_Transactions_Extract_${new Date().toISOString().substring(0, 10)}`, rows);
      Utils.showToast('Extract Exported', `Extracted ${list.length} swap records to CSV successfully.`);
    }

    /* ==========================================================================
       DYNAMIC REPEATABLE WARRANTY COMPONENTS & SMART STATUS ENGINE
       ========================================================================== */
    calculateWarrantyStatus(assignedDate, expiryDate, componentType) {
      if (!componentType || componentType === 'Non-Warranty' || !expiryDate || expiryDate === 'Non-Warranty' || expiryDate === 'None' || expiryDate === '-') {
        return {
          status: 'nowarranty',
          badgeClass: 'badge-status-nowarranty',
          label: 'No Warranty',
          text: 'No Warranty',
          daysRemaining: null,
          isValid: true
        };
      }

      // Check date ordering: Expiry date cannot be earlier than Assigned date
      if (assignedDate && expiryDate && expiryDate < assignedDate) {
        return {
          status: 'invalid',
          badgeClass: 'badge-status-invalid',
          label: 'Date Range Error: Expiry date is before assigned date',
          text: '⚠️ Expiry < Assigned',
          daysRemaining: null,
          isValid: false
        };
      }

      const expParts = String(expiryDate).match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
      if (!expParts) {
        return {
          status: 'nowarranty',
          badgeClass: 'badge-status-nowarranty',
          label: 'No Warranty',
          text: 'No Warranty',
          daysRemaining: null,
          isValid: true
        };
      }

      const expYear = parseInt(expParts[1], 10);
      const expMonth = parseInt(expParts[2], 10) - 1;
      const expDay = parseInt(expParts[3], 10);

      const now = new Date();
      const todayUtc = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
      const expUtc = Date.UTC(expYear, expMonth, expDay);

      const diffDays = Math.round((expUtc - todayUtc) / (1000 * 60 * 60 * 24));

      if (diffDays > 30) {
        const unit = diffDays === 1 ? 'day' : 'days';
        return {
          status: 'active',
          badgeClass: 'badge-status-active',
          label: `${diffDays} ${unit} left (${expiryDate})`,
          text: `${diffDays} ${unit} left`,
          daysRemaining: diffDays,
          isValid: true
        };
      } else if (diffDays >= 0 && diffDays <= 30) {
        const unit = diffDays === 1 ? 'day' : 'days';
        const labelText = diffDays === 0 ? 'Today' : `${diffDays} ${unit} left`;
        return {
          status: 'expiring',
          badgeClass: 'badge-status-expiring',
          label: diffDays === 0 ? `Warranty Expires Today (${expiryDate})` : `${diffDays} ${unit} left (${expiryDate})`,
          text: labelText,
          daysRemaining: diffDays,
          isValid: true
        };
      } else {
        const absDays = Math.abs(diffDays);
        const unit = absDays === 1 ? 'day' : 'days';
        return {
          status: 'expired',
          badgeClass: 'badge-status-expired',
          label: `Warranty Expired ${absDays} ${unit} ago (${expiryDate})`,
          text: `Warranty Expired (${absDays} ${unit} ago)`,
          daysRemaining: diffDays,
          isValid: true
        };
      }
    }

    renderWarrantyComponentRows(components = []) {
      const container = document.getElementById('warrantyComponentsContainer');
      const countBadge = document.getElementById('warrantyComponentsCountBadge');
      if (!container) return;

      container.innerHTML = '';

      if (!components || components.length === 0) {
        if (countBadge) countBadge.textContent = '0 Components';
        container.innerHTML = `
          <div class="warranty-empty-state" id="warrantyEmptyState">
            <span class="warranty-empty-icon">🛡️</span>
            <div class="warranty-empty-text">No hardware component warranty rows added yet.</div>
            <div class="warranty-empty-sub">Click "+ Add Component" above to begin tracking component warranties.</div>
            <button type="button" class="btn btn-secondary btn-sm" onclick="window.ITApp.addWarrantyComponentRow()" style="margin-top:6px;">
              + Add First Component
            </button>
          </div>
        `;
        this.updateWarrantyKpis();
        return;
      }

      components.forEach((comp) => {
        this.appendWarrantyComponentCard(comp, container);
      });

      this.updateWarrantyCountBadge();
      this.updateWarrantyKpis();
    }

    appendWarrantyComponentCard(comp, container) {
      if (!container) container = document.getElementById('warrantyComponentsContainer');
      if (!container) return;

      const emptyState = document.getElementById('warrantyEmptyState');
      if (emptyState) emptyState.remove();

      const rowId = comp.id || ('wc-' + Date.now() + '-' + Math.floor(Math.random() * 10000));
      const type = (comp.type === 'Non-Warranty') ? 'RAM' : (comp.type || 'RAM');
      const assignedDate = comp.assignedDate || document.getElementById('editAssetAssignedDate')?.value || new Date().toISOString().substring(0, 10);
      
      const isExplicitNonWarranty = comp.coverage === 'non-warranty' || comp.type === 'Non-Warranty' || (!comp.expiryDate && comp.expiryDate !== undefined && comp.coverage !== 'warranty') || comp.expiryDate === 'Non-Warranty' || comp.expiryDate === 'None';
      const coverage = isExplicitNonWarranty ? 'non-warranty' : 'warranty';

      let expiryDate = (coverage === 'non-warranty' || !comp.expiryDate || comp.expiryDate === 'Non-Warranty' || comp.expiryDate === 'None') ? '' : comp.expiryDate;
      if (coverage === 'warranty' && !expiryDate) {
        const d = new Date(assignedDate);
        if (!isNaN(d.getTime())) {
          d.setFullYear(d.getFullYear() + 2);
          expiryDate = d.toISOString().substring(0, 10);
        }
      }

      const statusInfo = this.calculateWarrantyStatus(assignedDate, expiryDate, coverage === 'non-warranty' ? 'Non-Warranty' : type);

      const card = document.createElement('div');
      card.className = 'warranty-component-card';
      card.id = rowId;
      card.dataset.rowId = rowId;

      const typeOptions = [
        'RAM',
        'SSD',
        'HDD',
        'Monitor',
        'Motherboard',
        'SMPS',
        'CPU / Processor',
        'Graphics Card (GPU)',
        'Keyboard / Mouse',
        'UPS',
        'Full System',
        'Other'
      ];

      if (type && !typeOptions.some(t => t.toLowerCase() === type.toLowerCase())) {
        typeOptions.unshift(type);
      }

      const optionsHtml = typeOptions.map(opt => {
        const isSel = (opt.toLowerCase() === type.toLowerCase() || (opt === 'CPU / Processor' && type.toLowerCase().includes('cpu')));
        return `<option value="${opt}" ${isSel ? 'selected' : ''}>${opt}</option>`;
      }).join('');

      card.innerHTML = `
        <div class="warranty-card-grid">
          <!-- 1. Component Type Dropdown -->
          <div class="warranty-field-group">
            <label class="warranty-field-label">Component / Type</label>
            <select class="form-control wc-type-select" data-row-id="${rowId}" aria-label="Component Type">
              ${optionsHtml}
            </select>
          </div>

          <!-- 2. Warranty Coverage (Under Warranty / Non-Warranty) -->
          <div class="warranty-field-group">
            <label class="warranty-field-label">Warranty Coverage</label>
            <select class="form-control wc-coverage-select" data-row-id="${rowId}" aria-label="Warranty Coverage">
              <option value="warranty" ${coverage === 'warranty' ? 'selected' : ''}>🟢 Under Warranty</option>
              <option value="non-warranty" ${coverage === 'non-warranty' ? 'selected' : ''}>⚪ Non-Warranty</option>
            </select>
          </div>

          <!-- 3. Assigned Date -->
          <div class="warranty-field-group">
            <label class="warranty-field-label">Assigned Date</label>
            <input type="date" class="form-control wc-assigned-date" data-row-id="${rowId}" value="${assignedDate}" aria-label="Assigned Date">
          </div>

          <!-- 4. Expiry Date -->
          <div class="warranty-field-group">
            <label class="warranty-field-label">Warranty Expiry Date</label>
            <input type="date" class="form-control wc-expiry-date ${statusInfo.isValid ? '' : 'wc-date-invalid'}" data-row-id="${rowId}" value="${expiryDate}" min="${assignedDate}" ${coverage === 'non-warranty' ? 'disabled' : ''} aria-label="Warranty Expiry Date" placeholder="dd - mm - yyyy">
          </div>

          <!-- 5. Smart Warranty Status Badge -->
          <div class="warranty-field-group warranty-field-group-status">
            <label class="warranty-field-label">Smart Warranty Status</label>
            <div class="wc-badge-slot" data-row-id="${rowId}">
              <span class="smart-warranty-badge ${statusInfo.badgeClass}" title="${Utils.escapeHtml(statusInfo.label)}" role="status" aria-live="polite">
                <span class="badge-dot"></span>
                <span>${Utils.escapeHtml(statusInfo.text)}</span>
              </span>
            </div>
          </div>

          <!-- 6. Delete Action Button with SVG Trash Can -->
          <div class="warranty-field-group warranty-field-group-actions" style="align-items: center; justify-content: flex-end;">
            <label class="warranty-field-label" style="opacity:0;" aria-hidden="true">&nbsp;</label>
            <button type="button" class="btn-delete-component-row" title="Delete ${type} component" onclick="window.ITApp.removeWarrantyComponentRow('${rowId}')" aria-label="Delete ${type} component row">
              <svg class="delete-icon-svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                <line x1="10" y1="11" x2="10" y2="17"></line>
                <line x1="14" y1="11" x2="14" y2="17"></line>
              </svg>
            </button>
          </div>
        </div>
      `;

      container.appendChild(card);

      const coverageSelect = card.querySelector('.wc-coverage-select');
      const typeSelect = card.querySelector('.wc-type-select');
      const assignedInput = card.querySelector('.wc-assigned-date');
      const expiryInput = card.querySelector('.wc-expiry-date');

      const updateRowStatus = () => {
        const curCoverage = coverageSelect.value;
        const currentType = typeSelect.value;
        const curAssigned = assignedInput.value;
        let curExpiry = expiryInput.value;

        // Update delete button title / aria-label
        const delBtn = card.querySelector('.btn-delete-component-row');
        if (delBtn) {
          delBtn.title = `Delete ${currentType} component`;
          delBtn.setAttribute('aria-label', `Delete ${currentType} component`);
        }

        if (curCoverage === 'non-warranty') {
          expiryInput.value = '';
          expiryInput.disabled = true;
          expiryInput.classList.remove('wc-date-invalid');
          curExpiry = '';
        } else {
          expiryInput.disabled = false;
          if (!curExpiry && curAssigned) {
            const d = new Date(curAssigned);
            if (!isNaN(d.getTime())) {
              d.setFullYear(d.getFullYear() + 2);
              expiryInput.value = d.toISOString().substring(0, 10);
              curExpiry = expiryInput.value;
            }
          }
        }

        if (curAssigned) {
          expiryInput.min = curAssigned;
        }

        const newStatus = this.calculateWarrantyStatus(curAssigned, curExpiry, curCoverage === 'non-warranty' ? 'Non-Warranty' : currentType);
        const badgeSlot = card.querySelector('.wc-badge-slot');
        if (badgeSlot) {
          badgeSlot.innerHTML = `
            <span class="smart-warranty-badge ${newStatus.badgeClass}" title="${Utils.escapeHtml(newStatus.label)}" role="status" aria-live="polite">
              <span class="badge-dot"></span>
              <span>${Utils.escapeHtml(newStatus.text)}</span>
            </span>
          `;
        }

        if (!newStatus.isValid) {
          expiryInput.classList.add('wc-date-invalid');
        } else {
          expiryInput.classList.remove('wc-date-invalid');
        }

        this.updateWarrantyKpis();
        this.syncMasterWarrantyFields();
      };

      coverageSelect.addEventListener('change', updateRowStatus);
      typeSelect.addEventListener('change', updateRowStatus);
      assignedInput.addEventListener('change', updateRowStatus);
      assignedInput.addEventListener('input', updateRowStatus);
      expiryInput.addEventListener('change', updateRowStatus);
      expiryInput.addEventListener('input', updateRowStatus);

      this.updateWarrantyCountBadge();
      this.updateWarrantyKpis();
    }

    addWarrantyComponentRow(compData = {}) {
      const defaultAssigned = document.getElementById('editAssetAssignedDate')?.value || new Date().toISOString().substring(0, 10);
      let defaultExpiry = document.getElementById('editAssetWarrantyEnd')?.value || '';
      const isNonW = compData.coverage === 'non-warranty' || compData.type === 'Non-Warranty';
      if (!defaultExpiry && !isNonW) {
        const nextYr = new Date();
        nextYr.setFullYear(nextYr.getFullYear() + 2);
        defaultExpiry = nextYr.toISOString().substring(0, 10);
      }

      const rowData = {
        id: 'wc-' + Date.now() + '-' + Math.floor(Math.random() * 10000),
        type: compData.type || 'RAM',
        coverage: isNonW ? 'non-warranty' : 'warranty',
        assignedDate: compData.assignedDate || defaultAssigned,
        expiryDate: isNonW ? '' : (compData.expiryDate || defaultExpiry)
      };

      this.appendWarrantyComponentCard(rowData);
      this.updateWarrantyKpis();
      this.syncMasterWarrantyFields();
    }

    removeWarrantyComponentRow(rowId) {
      const card = document.getElementById(rowId);
      if (!card) return;

      const typeSelect = card.querySelector('.wc-type-select');
      const compType = typeSelect ? typeSelect.value : 'Component';

      card.style.transition = 'opacity 0.16s ease, transform 0.16s ease';
      card.style.opacity = '0';
      card.style.transform = 'translateY(-6px)';

      setTimeout(() => {
        card.remove();
        this.updateWarrantyCountBadge();
        this.updateWarrantyKpis();
        this.syncMasterWarrantyFields();

        const container = document.getElementById('warrantyComponentsContainer');
        if (container && container.querySelectorAll('.warranty-component-card').length === 0) {
          container.innerHTML = `
            <div class="warranty-empty-state" id="warrantyEmptyState">
              <span class="warranty-empty-icon">🛡️</span>
              <div class="warranty-empty-text">No hardware component warranty rows added yet.</div>
              <div class="warranty-empty-sub">Click "+ Add Component" above to begin tracking component warranties.</div>
              <button type="button" class="btn btn-secondary btn-sm" onclick="window.ITApp.addWarrantyComponentRow()" style="margin-top:6px;">
                + Add First Component
              </button>
            </div>
          `;
        }
        Utils.showToast('Component Removed', `${compType} removed from list.`);
      }, 160);
    }

    requestDeleteWarrantyComponent(rowId) {
      const card = document.getElementById(rowId);
      if (!card) return;

      this.pendingDeleteRowId = rowId;
      const typeSelect = card.querySelector('.wc-type-select');
      const compType = typeSelect ? typeSelect.value : 'Component';

      const modal = document.getElementById('modalConfirmDeleteComponent');
      const msg = document.getElementById('deleteComponentModalMessage');
      if (msg) {
        msg.innerHTML = `Are you sure you want to remove the <strong>${Utils.escapeHtml(compType)}</strong> component from lifecycle tracking?`;
      }

      if (modal) {
        modal.style.display = 'flex';
        const confirmBtn = document.getElementById('btnConfirmDeleteComponentAction');
        if (confirmBtn) confirmBtn.focus();
      }
    }

    confirmDeleteWarrantyComponent() {
      const rowId = this.pendingDeleteRowId;
      const modal = document.getElementById('modalConfirmDeleteComponent');
      if (modal) modal.style.display = 'none';

      if (!rowId) return;

      const card = document.getElementById(rowId);
      const typeSelect = card ? card.querySelector('.wc-type-select') : null;
      const compType = typeSelect ? typeSelect.value : 'Component';

      if (card) {
        card.style.transition = 'opacity 0.18s ease, transform 0.18s ease';
        card.style.opacity = '0';
        card.style.transform = 'translateY(-6px)';
        setTimeout(() => {
          card.remove();
          this.updateWarrantyCountBadge();
          this.updateWarrantyKpis();
          this.syncMasterWarrantyFields();

          const container = document.getElementById('warrantyComponentsContainer');
          if (container && container.querySelectorAll('.warranty-component-card').length === 0) {
            container.innerHTML = `
              <div class="warranty-empty-state" id="warrantyEmptyState">
                <span class="warranty-empty-icon">🛡️</span>
                <div class="warranty-empty-text">No hardware component warranty rows added yet.</div>
                <div class="warranty-empty-sub">Click "+ Add Component" above to begin tracking component warranties.</div>
                <button type="button" class="btn btn-secondary btn-sm" onclick="window.ITApp.addWarrantyComponentRow()" style="margin-top:6px;">
                  + Add First Component
                </button>
              </div>
            `;
          }
          Utils.showToast('Component Removed', `${compType} was removed from the list.`);
        }, 180);
      }
      this.pendingDeleteRowId = null;
    }

    cancelDeleteWarrantyComponent() {
      const modal = document.getElementById('modalConfirmDeleteComponent');
      if (modal) modal.style.display = 'none';
      this.pendingDeleteRowId = null;
    }

    updateWarrantyKpis() {
      const container = document.getElementById('warrantyComponentsContainer');
      if (!container) return;

      const cards = container.querySelectorAll('.warranty-component-card');
      const total = cards.length;
      let underWarranty = 0;
      let expiringSoon = 0;
      let expiredOrNoWarranty = 0;

      cards.forEach((card) => {
        const coverageSelect = card.querySelector('.wc-coverage-select');
        const typeSelect = card.querySelector('.wc-type-select');
        const assignedInput = card.querySelector('.wc-assigned-date');
        const expiryInput = card.querySelector('.wc-expiry-date');

        const coverage = coverageSelect ? coverageSelect.value : 'warranty';
        const type = typeSelect ? typeSelect.value : 'RAM';
        const assignedDate = assignedInput ? assignedInput.value : '';
        const expiryDate = expiryInput ? expiryInput.value : '';

        if (coverage === 'non-warranty' || !expiryDate) {
          expiredOrNoWarranty++;
        } else {
          const statusObj = this.calculateWarrantyStatus(assignedDate, expiryDate, type);
          if (!statusObj.isValid || statusObj.status === 'expired' || statusObj.status === 'nowarranty') {
            expiredOrNoWarranty++;
          } else if (statusObj.status === 'expiring' || statusObj.status === 'today') {
            expiringSoon++;
          } else if (statusObj.status === 'active') {
            underWarranty++;
          }
        }
      });

      const elTotal = document.getElementById('kpiTotalComponents');
      const elActive = document.getElementById('kpiActiveWarranty');
      const elExpiring = document.getElementById('kpiExpiringSoon');
      const elExpired = document.getElementById('kpiExpiredWarranty');
      const countBadge = document.getElementById('warrantyComponentsCountBadge');

      if (elTotal) elTotal.textContent = total;
      if (elActive) elActive.textContent = underWarranty;
      if (elExpiring) elExpiring.textContent = expiringSoon;
      if (elExpired) elExpired.textContent = expiredOrNoWarranty;
      if (countBadge) {
        countBadge.textContent = total === 1 ? '1 Component' : `${total} Components`;
      }
    }

    updateWarrantyCountBadge() {
      const countBadge = document.getElementById('warrantyComponentsCountBadge');
      const container = document.getElementById('warrantyComponentsContainer');
      if (!countBadge || !container) return;
      const count = container.querySelectorAll('.warranty-component-card').length;
      countBadge.textContent = count === 1 ? '1 Component' : `${count} Components`;
    }

    syncMasterWarrantyFields() {
      const components = this.collectWarrantyComponentsFromForm();
      const masterTypeInput = document.getElementById('editAssetWarrantyType');
      const masterEndInput = document.getElementById('editAssetWarrantyEnd');
      const masterStatusSelect = document.getElementById('editAssetWarrantyStatus');

      if (components.length === 0) return;

      const firstComp = components[0];
      if (masterTypeInput) {
        masterTypeInput.value = firstComp.type || 'Full System';
      }

      const allNonWarranty = components.every(c => c.coverage === 'non-warranty' || c.type === 'Non-Warranty' || !c.expiryDate || c.expiryDate === 'Non-Warranty');
      if (allNonWarranty) {
        if (masterStatusSelect) masterStatusSelect.value = 'non-warranty';
        if (masterEndInput) {
          masterEndInput.value = '';
          masterEndInput.disabled = true;
          masterEndInput.style.opacity = '0.45';
        }
      } else {
        if (masterStatusSelect) masterStatusSelect.value = 'date';
        if (masterEndInput) {
          masterEndInput.disabled = false;
          masterEndInput.style.opacity = '1';
          const validExpiries = components.filter(c => c.coverage !== 'non-warranty' && c.expiryDate && c.expiryDate !== 'Non-Warranty' && c.type !== 'Non-Warranty').map(c => c.expiryDate);
          if (validExpiries.length > 0) {
            masterEndInput.value = validExpiries[0];
          }
        }
      }
    }

    collectWarrantyComponentsFromForm() {
      const container = document.getElementById('warrantyComponentsContainer');
      if (!container) return [];
      const cards = container.querySelectorAll('.warranty-component-card');
      const components = [];
      cards.forEach(card => {
        const rowId = card.dataset.rowId;
        const typeSelect = card.querySelector('.wc-type-select');
        const coverageSelect = card.querySelector('.wc-coverage-select');
        const assignedInput = card.querySelector('.wc-assigned-date');
        const expiryInput = card.querySelector('.wc-expiry-date');

        if (typeSelect && assignedInput && expiryInput) {
          const type = typeSelect.value || 'RAM';
          const coverage = coverageSelect ? coverageSelect.value : (expiryInput.value ? 'warranty' : 'non-warranty');
          const assignedDate = assignedInput.value || '';
          const expiryDate = (coverage === 'non-warranty') ? '' : (expiryInput.value || '');
          const statusObj = this.calculateWarrantyStatus(assignedDate, expiryDate, coverage === 'non-warranty' ? 'Non-Warranty' : type);
          components.push({
            id: rowId,
            type,
            coverage,
            assignedDate,
            expiryDate: (coverage === 'non-warranty' || !expiryDate) ? 'Non-Warranty' : expiryDate,
            status: statusObj.text,
            statusCode: statusObj.status,
            daysRemaining: statusObj.daysRemaining
          });
        }
      });
      return components;
    }

    handleAssignedDateSync(newDate) {
      if (!newDate) return;
      const container = document.getElementById('warrantyComponentsContainer');
      if (!container) return;
      const assignedInputs = container.querySelectorAll('.wc-assigned-date');
      assignedInputs.forEach(input => {
        if (!input.value) {
          input.value = newDate;
          input.dispatchEvent(new Event('change'));
        }
      });
    }

    handleMasterWarrantyEndSync(newDate) {
      if (!newDate) return;
      const container = document.getElementById('warrantyComponentsContainer');
      if (!container) return;
      const firstExpiryInput = container.querySelector('.wc-expiry-date');
      if (firstExpiryInput && (!firstExpiryInput.value || firstExpiryInput.value === 'Non-Warranty')) {
        firstExpiryInput.value = newDate;
        firstExpiryInput.dispatchEvent(new Event('change'));
      }
    }
  }

  // Instantiate application controller
  const app = new AppController();
  window.ITAppControllerInstance = app;

  // Expose global methods for inline HTML onclick handlers
  window.ITApp = {
    handleWorkStatusChange: (v) => app.handleWorkStatusChange(v),
    handleSystemStatusChange: (v) => app.handleSystemStatusChange(v),
    renderAllAssetsTable() {
      app.renderAllAssetsTable();
    },

    async cycleWorkStatus(assetId) {
      const asset = (store.data.assets || []).find(a => a.id === assetId);
      if (!asset) return;

      const current = (asset.workStatus || 'Currently Working').trim().toLowerCase();
      let nextStatus = 'Work From Home';
      if (current === 'currently working' || current === 'working') {
        nextStatus = 'Work From Home'; // 2. Blue Light
      } else if (current === 'work from home' || current === 'wfh' || current === 'yellow') {
        nextStatus = 'User Exit'; // 3. Red Light
      } else if (current === 'user exit' || current === 'exit') {
        nextStatus = 'In Stock'; // 4. Amber Light
      } else {
        nextStatus = 'Currently Working'; // 1. Green Light
      }

      // Update in local store
      asset.workStatus = nextStatus;
      if (nextStatus === 'User Exit' || nextStatus === 'In Stock') {
        asset.status = 'Non-Assigned';
        const departing = asset.user;
        if (departing && departing !== 'None' && departing !== 'NEW SYSTEM') {
          asset.oldUsername = departing;
        }
        asset.user = ''; // Cleared from active assignment, moved to stock
        if (nextStatus === 'User Exit') {
          asset.userExitDate = new Date().toISOString().substring(0, 10);
          asset.availableDate = asset.userExitDate;
        }
      } else if (asset.status === 'Non-Assigned') {
        asset.status = nextStatus === 'Work From Home' ? 'WFH' : 'Assigned';
        if (asset.oldUsername && asset.oldUsername !== 'None') {
          asset.user = asset.oldUsername;
        }
      }
      store.save(store.data);

      // Re-render table & counts across both pools
      app.updateDashboardMetrics();
      app.renderAllAssetsTable();
      app.renderNonAssignedView();
      app.renderAssignedSystemsTable();
      if (app.currentView === 'assigned-users') {
        app.renderAssignedUsersTable();
      }
      if (document.getElementById('viewAssetModal')?.classList.contains('active')) {
        app.viewAsset(assetId);
      }

      // Persist to SQLite backend
      try {
        await fetch(`/api/assets/${encodeURIComponent(assetId)}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            workStatus: asset.workStatus,
            status: asset.status,
            user: asset.user,
            oldUsername: asset.oldUsername,
            userExitDate: asset.userExitDate,
            availableDate: asset.availableDate
          })
        });
      } catch (err) {
        console.warn('Backend update note:', err);
      }

      const lightBadge = nextStatus === 'Currently Working' ? '🟢 Green Light' : (nextStatus === 'Work From Home' ? '🔵 Blue Light' : '🔴 Red Light');
      Utils.showToast('Work Status Changed', `${lightBadge}: ${assetId} (${asset.user || 'Asset'}) is now set to "${nextStatus}"`);
    },
    toggleNotificationPopover() {
      app.toggleNotificationPopover();
    },
    filterRecentActivity(filterType) {
      app.filterRecentActivity(filterType);
    },
    showQuickTip(title, message) {
      app.showQuickTip(title, message);
    },
    viewUser(userId) {
      app.viewUser(userId);
    },
    editNonItAsset(id) {
      app.editNonItAsset(id);
    },
    editReq(id) {
      app.editReq(id);
    },

    resetAllAssetFilters() {
      const search = document.getElementById('assetsSearchInput');
      if (search) search.value = '';
      const type = document.getElementById('assetsTypeFilter');
      if (type) type.value = 'all';
      const cpu = document.getElementById('assetsCpuFilter');
      if (cpu) cpu.value = 'all';
      const team = document.getElementById('assetsTeamFilter');
      if (team) team.value = 'all';
      const status = document.getElementById('assetsStatusFilter');
      if (status) status.value = 'all';
      const work = document.getElementById('assetsWorkStatusFilter');
      if (work) work.value = 'all';
      app.renderAllAssetsTable();
    },

    // Navigation
    navTo(viewId) {
      if (viewId !== 'non-assigned') {
        app.nonAssignedTypeFilter = 'all';
      }
      app.navigateTo(viewId);
    },

    navToNonAssigned(type = 'all') {
      app.nonAssignedTypeFilter = type;
      app.navigateTo('non-assigned');
    },

    navToAssignedFleet(type = 'all') {
      app.currentView = 'all-assets';
      app.navigateTo('all-assets');
      const statusFilter = document.getElementById('assetsStatusFilter');
      if (statusFilter) statusFilter.value = 'Assigned';
      const typeFilter = document.getElementById('assetsTypeFilter');
      if (typeFilter) typeFilter.value = type;
      app.renderAllAssetsTable();
    },

    filterAssignedFleetByType(type) {
      this.navToAssignedFleet(type);
    },


    openQuickAssignModal(assetId) {
      app.openQuickAssignModal(assetId);
    },
    quickAssignAsset(assetId) {
      app.openQuickAssignModal(assetId);
    },
    submitQuickAssign(event) {
      app.submitQuickAssign(event);
    },
    returnSystemToStock(assetId) {
      app.returnSystemToStock(assetId);
    },
    confirmProceedReturnStock() {
      app.confirmProceedReturnStock();
    },
    cancelReturnSystemToStock() {
      app.cancelReturnSystemToStock();
    },
    filterAssignedSystems(type) {
      app.filterAssignedSystems(type);
    },
    renderAssignedSystemsTable() {
      app.renderAssignedSystemsTable();
    },
    openAssignmentHistoryModal() {
      app.openAssignmentHistoryModal();
    },
    renderAssignmentHistoryTable() {
      app.renderAssignmentHistoryTable();
    },
    exportAssignmentHistoryCSV() {
      app.exportAssignmentHistoryCSV();
    },
    filterNonAssigned(type = 'all') {
      app.nonAssignedTypeFilter = type;
      app.renderNonAssignedView();
    },

    openInStockEntry() {
      app.openInStockEntry();
    },
    refreshNextInStockAssetId(force = false) {
      app.refreshNextInStockAssetId(force);
    },
    onInStockTypeChange() {
      app.onInStockTypeChange();
    },
    saveInStockSystem(assignImmediately = false) {
      app.saveInStockSystem(assignImmediately);
    },
    resetInStockForm() {
      app.resetInStockForm();
    },
    toggleInStockFormCollapse() {
      app.toggleInStockFormCollapse();
    },

    // Modal Control
    closeModal(modalId) {
      app.closeModal(modalId);
    },

    confirmProceedSaveAsset() {
      app.confirmProceedSaveAsset();
    },

    cancelSaveAssetEdit() {
      app.cancelSaveAssetEdit();
    },

    // System Swap Facility & History Methods
    viewSwapExtract(swapId) {
      app.viewSwapExtract(swapId);
    },

    editSwapInFacility(swapId) {
      app.editSwapInFacility(swapId);
    },

    cancelFacilitySwapEdit() {
      app.cancelFacilitySwapEdit();
    },

    resetSwapFacilityForm() {
      app.resetSwapFacilityForm();
    },

    filterSwapHistory() {
      app.filterSwapHistory();
    },

    resetSwapDateFilter() {
      app.resetSwapDateFilter();
    },

    extractSwapDataCSV() {
      app.extractSwapDataCSV();
    },

    exportActivityLogsCSV() {
      app.exportActivityLogsCSV();
    },

    toggleWarrantyMode(mode) {
      const dateInput = document.getElementById('editAssetWarrantyEnd');
      if (!dateInput) return;
      if (mode === 'non-warranty') {
        dateInput.value = '';
        dateInput.disabled = true;
        dateInput.style.opacity = '0.45';
      } else {
        dateInput.disabled = false;
        dateInput.style.opacity = '1';
        if (!dateInput.value) {
          const d = new Date();
          d.setFullYear(d.getFullYear() + 1);
          dateInput.value = d.toISOString().substring(0, 10);
        }
        const typeSelect = document.getElementById('editAssetWarrantyType');
        if (typeSelect && typeSelect.value === 'Non-Warranty') {
          typeSelect.value = 'Full System';
        }
      }
    },
    handleWarrantyTypeChange(type) {
      if (type === 'Non-Warranty') {
        const statusSelect = document.getElementById('editAssetWarrantyStatus');
        if (statusSelect) {
          statusSelect.value = 'non-warranty';
          this.toggleWarrantyMode('non-warranty');
        }
      }
    },
    addWarrantyComponentRow(compData) {
      app.addWarrantyComponentRow(compData);
    },
    removeWarrantyComponentRow(rowId) {
      app.removeWarrantyComponentRow(rowId);
    },
    confirmDeleteWarrantyComponent() {
      app.confirmDeleteWarrantyComponent();
    },
    cancelDeleteWarrantyComponent() {
      app.cancelDeleteWarrantyComponent();
    },
    focusEditWarrantyComponentRow(rowId) {
      if (app.focusEditWarrantyComponentRow) app.focusEditWarrantyComponentRow(rowId);
    },
    handleAssignedDateSync(newDate) {
      app.handleAssignedDateSync(newDate);
    },
    handleMasterWarrantyEndSync(newDate) {
      app.handleMasterWarrantyEndSync(newDate);
    },
    toggleDedicatedWarrantyMode(mode) {
      const dateInput = document.getElementById('warrantyEndDateInput');
      const presetsWrap = document.getElementById('dedicatedWarrantyDateGroup');
      if (!dateInput) return;
      if (mode === 'non-warranty') {
        dateInput.value = '';
        dateInput.disabled = true;
        dateInput.style.opacity = '0.45';
        dateInput.removeAttribute('required');
      } else {
        dateInput.disabled = false;
        dateInput.style.opacity = '1';
        if (!dateInput.value) {
          const d = new Date();
          d.setFullYear(d.getFullYear() + 1);
          dateInput.value = d.toISOString().substring(0, 10);
        }
        const typeSelect = document.getElementById('warrantyTypeInput');
        if (typeSelect && typeSelect.value === 'Non-Warranty') {
          typeSelect.value = 'Full System';
        }
      }
    },
    handleDedicatedWarrantyTypeChange(type) {
      if (type === 'Non-Warranty') {
        const statusSelect = document.getElementById('warrantyCoverageStatus');
        if (statusSelect) {
          statusSelect.value = 'non-warranty';
          this.toggleDedicatedWarrantyMode('non-warranty');
        }
      }
    },

    toggleAssetIdSort() {
      app.assetSortDir = (app.assetSortDir === 'desc') ? 'asc' : 'desc';
      app.renderAllAssetsTable();
    },

    filterAssetsByCpu(cpu) {
      app.navigateTo('all-assets');
      const cpuFilter = document.getElementById('assetsCpuFilter');
      if (cpuFilter) {
        cpuFilter.value = cpu;
      }
      app.renderAllAssetsTable();
    },

    filterAssetsByType(type) {
      app.navigateTo('all-assets');
      const typeFilter = document.getElementById('assetsTypeFilter');
      if (typeFilter) {
        typeFilter.value = type;
      }
      const statusFilter = document.getElementById('assetsStatusFilter');
      if (statusFilter) {
        statusFilter.value = 'all';
      }
      const searchInput = document.getElementById('assetsSearchInput');
      if (searchInput) {
        searchInput.value = '';
      }
      app.renderAllAssetsTable();
      const el = document.getElementById('view-all-assets');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    },

    filterAssignedByType(type = 'all') {
      app.navigateTo('all-assets');
      const typeFilter = document.getElementById('assetsTypeFilter');
      if (typeFilter) {
        typeFilter.value = type;
      }
      const statusFilter = document.getElementById('assetsStatusFilter');
      if (statusFilter) {
        statusFilter.value = 'Assigned';
      }
      const searchInput = document.getElementById('assetsSearchInput');
      if (searchInput) {
        searchInput.value = '';
      }
      app.renderAllAssetsTable();
      const el = document.getElementById('view-all-assets');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    },

    filterAssetsByTeam(team) {
      app.navigateTo('all-assets');
      const teamFilter = document.getElementById('assetsTeamFilter');
      if (teamFilter) {
        teamFilter.value = team;
        app.renderAllAssetsTable();
      }
    },

    // View Modal
    viewAsset(assetId) {
      const asset = store.data.assets.find(a => a.id === assetId);
      if (!asset) return;

      app.currentViewAssetId = assetId;

      // Status class calculation
      const statusClass = asset.status === 'Assigned' ? 'status-assigned' :
        (asset.status === 'Non-Assigned' || asset.status === 'Available') ? 'status-non-assigned' :
          asset.status === 'Swap' ? 'status-swap' :
            asset.status === 'Repair' ? 'status-repair' : 'status-warranty';

      // 1. HEADER META (Asset ID, Device Type badge, Status badge)
      const metaContainer = document.getElementById('viewAssetModalMeta');
      if (metaContainer) {
        metaContainer.innerHTML = `
          <span class="spec-asset-id-pill" title="Asset ID">${Utils.escapeHtml(asset.id)}</span>
          <span class="badge-device-type">💻 ${Utils.escapeHtml(asset.type || 'Hardware')}</span>
          <span class="status-pill ${statusClass}"><span class="badge-dot"></span>${Utils.escapeHtml(asset.status || 'Active')}</span>
        `;
      }

      // History records lookup
      const swapRecord = (store.data.swapLogs || []).find(s => s.newAssetId === asset.id || s.oldAssetId === asset.id);
      const hasPreviousUser = !!(asset.oldUsername && asset.oldUsername !== 'None' && asset.oldUsername.trim() !== '');
      const previousUserName = hasPreviousUser ? asset.oldUsername : (swapRecord?.oldUserId || 'None');
      const prevUserObj = (previousUserName && previousUserName !== 'None') ? (store.data.users || []).find(u => u.name.toLowerCase() === previousUserName.toLowerCase()) : null;
      const prevTeam = prevUserObj?.team || swapRecord?.oldTeam || '—';

      // Format date helper: DD-MM-YYYY
      const formatDDMMYYYY = (dateStr) => {
        if (!dateStr || dateStr === '—' || dateStr === '-' || dateStr === 'Non-Warranty' || dateStr === 'None' || dateStr === 'Nil') return '—';
        const m = String(dateStr).match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
        if (m) {
          return `${m[3].padStart(2, '0')}-${m[2].padStart(2, '0')}-${m[1]}`;
        }
        if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) return dateStr;
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return dateStr;
        return `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`;
      };

      // Raw components parse
      let rawComponents = [];
      if (Array.isArray(asset.warrantyComponents) && asset.warrantyComponents.length > 0) {
        rawComponents = JSON.parse(JSON.stringify(asset.warrantyComponents));
      } else if (typeof asset.warrantyComponents === 'string' && asset.warrantyComponents.trim()) {
        try {
          const parsed = JSON.parse(asset.warrantyComponents);
          if (Array.isArray(parsed) && parsed.length > 0) rawComponents = parsed;
        } catch (e) {}
      }

      // Check asset-level warranty
      const isAssetNoWarranty = !asset.warrantyEnd || asset.warrantyEnd === '-' || asset.warrantyEnd === '—' ||
        asset.warrantyEnd.toLowerCase() === 'none' || asset.warrantyEnd.toLowerCase() === 'non-warranty' ||
        asset.warrantyEnd.toLowerCase() === 'nil' || (asset.warrantyType && asset.warrantyType.toLowerCase() === 'non-warranty');

      // If no explicit components array yet, automatically derive from hardware specs (RAM, SSD, HDD, Monitor) if under warranty
      if (rawComponents.length === 0 && !isAssetNoWarranty) {
        const defaultAssigned = asset.assignedDate || '2025-01-15';
        const defaultExpiry = asset.warrantyEnd;
        if (asset.ram && asset.ram.toLowerCase() !== 'none' && asset.ram.toLowerCase() !== 'nil') {
          rawComponents.push({
            id: 'wc-auto-ram',
            type: 'RAM',
            coverage: 'warranty',
            assignedDate: defaultAssigned,
            expiryDate: defaultExpiry
          });
        }
        if (asset.ssd && asset.ssd.toLowerCase() !== 'none' && asset.ssd.toLowerCase() !== 'nil') {
          rawComponents.push({
            id: 'wc-auto-ssd',
            type: 'SSD',
            coverage: 'warranty',
            assignedDate: defaultAssigned,
            expiryDate: defaultExpiry
          });
        }
        if (asset.hdd && asset.hdd.toLowerCase() !== 'none' && asset.hdd.toLowerCase() !== 'nil') {
          rawComponents.push({
            id: 'wc-auto-hdd',
            type: 'HDD',
            coverage: 'warranty',
            assignedDate: defaultAssigned,
            expiryDate: defaultExpiry
          });
        }
        if (asset.monitor && asset.monitor.toLowerCase() !== 'none' && asset.monitor.toLowerCase() !== 'nil') {
          rawComponents.push({
            id: 'wc-auto-mon',
            type: 'Monitor',
            coverage: 'warranty',
            assignedDate: defaultAssigned,
            expiryDate: defaultExpiry
          });
        }
        if (rawComponents.length === 0) {
          rawComponents.push({
            id: 'wc-auto-sys',
            type: asset.warrantyType || 'Full System',
            coverage: 'warranty',
            assignedDate: defaultAssigned,
            expiryDate: defaultExpiry
          });
        }
      }

      // Filter for active items under warranty (omit non-warranty components completely)
      const warrantedComponents = rawComponents.filter(c => {
        if (!c) return false;
        if (c.coverage === 'non-warranty') return false;
        const exp = c.expiryDate;
        if (!exp || exp === 'Non-Warranty' || exp === 'None' || exp === '-' || exp === '—' || exp === 'Nil') return false;
        const statusObj = app.calculateWarrantyStatus(c.assignedDate, exp, c.type);
        return statusObj && statusObj.status !== 'nowarranty';
      });

      // Build active warranted items list
      let activeWarrantedItems = [];
      if (warrantedComponents.length > 0) {
        activeWarrantedItems = warrantedComponents.map(c => {
          const statusObj = app.calculateWarrantyStatus(c.assignedDate, c.expiryDate, c.type);
          return {
            type: c.type || 'Component',
            assignedDate: c.assignedDate || asset.assignedDate || '',
            expiryDate: c.expiryDate || '',
            statusObj: statusObj || { badgeClass: 'badge-status-active', text: 'Under Warranty' }
          };
        });
      } else if (!isAssetNoWarranty) {
        const compType = asset.warrantyType || 'Full System';
        const statusObj = app.calculateWarrantyStatus(asset.assignedDate, asset.warrantyEnd, compType);
        if (statusObj && statusObj.status !== 'nowarranty') {
          activeWarrantedItems.push({
            type: compType,
            assignedDate: asset.assignedDate || '',
            expiryDate: asset.warrantyEnd || '',
            statusObj: statusObj
          });
        }
      }

      // "non warrnaty show aga vendam"
      // If there are NO items under warranty, do NOT show warranty card at all!
      let warrantyCardHtml = '';
      if (activeWarrantedItems.length > 0) {
        const isComponentWarranty = (asset.warrantyType && asset.warrantyType.toLowerCase().includes('component')) || (activeWarrantedItems.length > 1) || (activeWarrantedItems[0].type !== 'Full System');
        const headerBadgeLabel = isComponentWarranty ? 'Component Lifecycle' : 'Full System';
        const headerBadgeHtml = `<span class="warranty-badge badge-active">${headerBadgeLabel}</span>`;

        warrantyCardHtml = `
          <!-- 3. WARRANTY & HARDWARE LIFECYCLE -->
          <div class="spec-card">
            <div class="spec-card-header" style="display: flex; align-items: center; justify-content: space-between; padding: 14px 20px;">
              <div class="spec-card-title" style="display: flex; align-items: center; gap: 8px;">
                <span style="color: #2563eb;">🛡️</span>
                <span style="font-size: 0.98rem; font-weight: 700; color: #0f172a;">Warranty &amp; Hardware Lifecycle</span>
                <span style="font-size: 0.78rem; font-weight: 500; color: #64748b; margin-left: 4px;">Component Lifecycle Tracking</span>
              </div>
              <div>${headerBadgeHtml}</div>
            </div>
            <div class="spec-card-body" style="padding: 16px 20px;">
              <div style="display: flex; flex-direction: column; gap: 12px;">
                ${activeWarrantedItems.map(item => `
                  <div class="warranty-component-row" style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px 18px;">
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 16px; align-items: flex-start;">
                      <!-- 1. Component / Type -->
                      <div class="spec-item">
                        <span class="spec-label" style="font-size: 0.68rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; margin-bottom: 4px; display: block;">Component / Type</span>
                        <span class="spec-value spec-value-strong" style="font-size: 0.95rem; font-weight: 700; color: #0f172a;">${Utils.escapeHtml(item.type)}</span>
                      </div>

                      <!-- 2. Warranty Coverage -->
                      <div class="spec-item">
                        <span class="spec-label" style="font-size: 0.68rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; margin-bottom: 4px; display: block;">Warranty Coverage</span>
                        <span class="spec-value" style="font-size: 0.88rem; font-weight: 600; color: #16a34a; display: inline-flex; align-items: center; gap: 4px;">
                          🟢 Under Warranty
                        </span>
                      </div>

                      <!-- 3. Assigned Date -->
                      <div class="spec-item">
                        <span class="spec-label" style="font-size: 0.68rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; margin-bottom: 4px; display: block;">Assigned Date</span>
                        <span class="spec-value font-mono" style="font-size: 0.9rem; font-weight: 600; color: #0f172a;">${Utils.escapeHtml(formatDDMMYYYY(item.assignedDate))}</span>
                      </div>

                      <!-- 4. Warranty Expiry Date -->
                      <div class="spec-item">
                        <span class="spec-label" style="font-size: 0.68rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; margin-bottom: 4px; display: block;">Warranty Expiry Date</span>
                        <span class="spec-value font-mono" style="font-size: 0.9rem; font-weight: 600; color: #0f172a;">${Utils.escapeHtml(formatDDMMYYYY(item.expiryDate))}</span>
                      </div>

                      <!-- 5. Smart Warranty Status -->
                      <div class="spec-item">
                        <span class="spec-label" style="font-size: 0.68rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; margin-bottom: 4px; display: block;">Smart Warranty Status</span>
                        <div class="spec-value" style="margin-top: 2px;">
                          <span class="smart-warranty-badge ${item.statusObj.badgeClass}" style="width: auto; height: 26px; padding: 3px 12px; font-size: 0.76rem; font-weight: 700; display: inline-flex; align-items: center; gap: 6px;">
                            <span class="badge-dot"></span>
                            <span>${Utils.escapeHtml(item.statusObj.text)}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        `;
      }

      const body = document.getElementById('viewAssetModalBody');
      if (body) {
        body.innerHTML = `
          <!-- 1. ASSET & USER INFORMATION -->
          <div class="spec-card">
            <div class="spec-card-header" style="display: flex; align-items: center; justify-content: space-between; padding: 12px 18px;">
              <div style="display: flex; align-items: center; gap: 10px;">
                <div style="width: 32px; height: 32px; border-radius: 8px; background: #eff6ff; border: 1px solid #bfdbfe; display: flex; align-items: center; justify-content: center; color: #2563eb; font-size: 1rem;">
                  👤
                </div>
                <span class="spec-card-title">Asset &amp; User Information</span>
              </div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 0.68rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b;">WORK STATUS:</span>
                <span class="status-pill ${asset.workStatus === 'User Exit' ? 'status-non-assigned' : asset.workStatus === 'Work From Home' ? 'status-swap' : 'status-assigned'}">
                  <span class="badge-dot"></span>
                  <span>${Utils.escapeHtml(asset.workStatus || 'Currently Working')}</span>
                </span>
              </div>
            </div>
            <div class="spec-card-body">
              <div class="spec-grid-2col">
                <!-- LEFT COLUMN -->
                <div class="spec-col">
                  <!-- ASSIGNED USER -->
                  <div class="spec-item">
                    <span class="spec-label">ASSIGNED USER</span>
                    <div style="display: flex; align-items: center; gap: 10px; margin-top: 3px;">
                      <div style="width: 32px; height: 32px; border-radius: 50%; background: #eff6ff; border: 1px solid #bfdbfe; display: flex; align-items: center; justify-content: center; color: #2563eb; flex-shrink: 0;">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                      </div>
                      <span style="font-size: 1.02rem; font-weight: 700; color: #0f172a; letter-spacing: -0.2px;">${asset.user ? Utils.escapeHtml(asset.user) : '<em style="color:#94a3b8; font-weight:500;">Unassigned</em>'}</span>
                    </div>
                  </div>

                  <!-- ASSIGNED DATE -->
                  <div class="spec-item">
                    <span class="spec-label">ASSIGNED DATE</span>
                    <div style="display: flex; align-items: center; gap: 8px; margin-top: 3px;">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                      <span style="font-size: 0.88rem; font-weight: 600; color: #0f172a;">${Utils.formatDate(asset.assignedDate)}</span>
                    </div>
                  </div>
                </div>

                <!-- RIGHT COLUMN -->
                <div class="spec-col">
                  <!-- DEPARTMENT / TEAM -->
                  <div class="spec-item">
                    <span class="spec-label">DEPARTMENT / TEAM</span>
                    <div style="margin-top: 3px;">
                      <span style="display: inline-block; background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; padding: 2px 12px; border-radius: 9999px; font-size: 0.8rem; font-weight: 700;">${Utils.escapeHtml(asset.team || '—')}</span>
                    </div>
                  </div>

                  <!-- OFFICE LOCATION -->
                  <div class="spec-item">
                    <span class="spec-label">OFFICE LOCATION</span>
                    <div style="display: flex; align-items: center; gap: 8px; margin-top: 3px;">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg>
                      <span style="font-size: 0.88rem; font-weight: 600; color: #0f172a;">${Utils.escapeHtml(asset.location || '—')}</span>
                    </div>
                  </div>

                  <!-- TEAM LEADER (TL) -->
                  <div class="spec-item">
                    <span class="spec-label">TEAM LEADER (TL)</span>
                    <div style="display: flex; align-items: center; gap: 8px; margin-top: 3px;">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                      <span style="font-size: 0.88rem; font-weight: 600; color: #0f172a;">${Utils.escapeHtml(asset.tl || '—')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 2. HARDWARE SPECIFICATIONS -->
          <div class="spec-card">
            <div class="spec-card-header">
              <div class="spec-card-title">
                <span>⚙️</span>
                <span>Hardware Specifications</span>
              </div>
              <button class="btn btn-outline-primary btn-sm" type="button" style="padding: 4px 12px; font-size: 0.78rem; font-weight: 600;" onclick="window.ITApp.closeModal('modalViewAsset'); window.ITApp.editAsset('${asset.id}')">
                ✏️ Edit Specs
              </button>
            </div>
            <div class="spec-card-body">
              <!-- 5 Primary Hardware Component Cards (CPU, RAM, SSD, HDD, Monitor) -->
              <div class="hw-spec-cards-grid">
                <!-- CPU -->
                <div class="hw-spec-card">
                  <div class="hw-spec-card-header">
                    <span class="hw-spec-icon">⚡</span>
                    <span class="hw-spec-label">CPU</span>
                  </div>
                  <span class="hw-spec-value">${Utils.escapeHtml(asset.cpu || '—')}</span>
                </div>

                <!-- RAM -->
                <div class="hw-spec-card">
                  <div class="hw-spec-card-header">
                    <span class="hw-spec-icon">🧠</span>
                    <span class="hw-spec-label">RAM</span>
                  </div>
                  <span class="hw-spec-value">${Utils.escapeHtml(asset.ram || '—')}</span>
                </div>

                <!-- SSD -->
                <div class="hw-spec-card">
                  <div class="hw-spec-card-header">
                    <span class="hw-spec-icon">⚡</span>
                    <span class="hw-spec-label">SSD</span>
                  </div>
                  <span class="hw-spec-value ${(!asset.ssd || asset.ssd === 'None' || asset.ssd === 'Nil' || asset.ssd === '-') ? 'is-none' : ''}">${Utils.escapeHtml((asset.ssd && asset.ssd !== 'None' && asset.ssd !== 'Nil' && asset.ssd !== '-') ? asset.ssd : 'None')}</span>
                </div>

                <!-- HDD -->
                <div class="hw-spec-card">
                  <div class="hw-spec-card-header">
                    <span class="hw-spec-icon">💾</span>
                    <span class="hw-spec-label">HDD</span>
                  </div>
                  <span class="hw-spec-value ${(!asset.hdd || asset.hdd === 'None' || asset.hdd === 'Nil' || asset.hdd === '-') ? 'is-none' : ''}">${Utils.escapeHtml((asset.hdd && asset.hdd !== 'None' && asset.hdd !== 'Nil' && asset.hdd !== '-') ? asset.hdd : 'None')}</span>
                </div>

                <!-- Monitor -->
                <div class="hw-spec-card">
                  <div class="hw-spec-card-header">
                    <span class="hw-spec-icon">🖥️</span>
                    <span class="hw-spec-label">Monitor</span>
                  </div>
                  <span class="hw-spec-value ${(!asset.monitor || asset.monitor === '-' || asset.monitor.toLowerCase() === 'none') ? 'is-none' : ''}">${Utils.escapeHtml((asset.monitor && asset.monitor !== '-' && asset.monitor.toLowerCase() !== 'none') ? asset.monitor : 'None')}</span>
                </div>
              </div>

              <!-- System Connectivity & OS Environment Strip -->
              <div class="hw-system-strip">
                <div class="hw-sys-item">
                  <span class="hw-sys-label"><span>💿</span> Operating System</span>
                  <span class="hw-sys-value">${Utils.escapeHtml(asset.os || 'Windows 11 Pro')}</span>
                </div>
                <div class="hw-sys-item">
                  <span class="hw-sys-label"><span>🌐</span> IP Address</span>
                  <span class="hw-sys-value is-ip">${Utils.escapeHtml(asset.ipAddress || '—')}</span>
                </div>
                <div class="hw-sys-item">
                  <span class="hw-sys-label"><span>🔒</span> MAC Address</span>
                  <span class="hw-sys-value is-mac">${Utils.escapeHtml((asset.serialNumber || asset.macAddress || '—').toUpperCase())}</span>
                </div>
              </div>
            </div>
          </div>

          ${warrantyCardHtml}

          <!-- 4. PREVIOUS USER & ALLOCATION HISTORY -->
          <div class="spec-card">
            <div class="spec-card-header">
              <div class="spec-card-title">
                <span>🔄</span>
                <span>Previous User &amp; Allocation History</span>
              </div>
              <div>
                ${(hasPreviousUser || (swapRecord && swapRecord.oldUserId)) ?
            `<span class="badge" style="background:#fef3c7; color:#b45309; border:1px solid #fde68a; font-size:0.75rem; padding:3px 10px; border-radius:12px; font-weight:600;">Reallocated Asset</span>` :
            `<span class="badge" style="background:#eff6ff; color:#1d4ed8; border:1px solid #bfdbfe; font-size:0.75rem; padding:3px 10px; border-radius:12px; font-weight:600;">First Allocation</span>`
          }
              </div>
            </div>
            <div class="spec-card-body">
              <div class="allocation-transition-box">
                <div class="transition-user-node">
                  <span class="transition-node-label">Previous User</span>
                  <span class="transition-node-name">${(hasPreviousUser || (swapRecord && swapRecord.oldUserId)) ? Utils.escapeHtml(previousUserName) : '<span style="color:#94a3b8; font-weight:500;">None</span>'}</span>
                  <span class="transition-node-sub">${(hasPreviousUser || (swapRecord && swapRecord.oldUserId)) ? (prevTeam !== '—' ? prevTeam : 'Prior Department') : 'Initial Asset Allocation'}</span>
                </div>
                <div class="transition-arrow-divider" aria-hidden="true">
                  <span class="transition-arrow">➔</span>
                </div>
                <div class="transition-user-node is-current">
                  <span class="transition-node-label">Current User</span>
                  <span class="transition-node-name">${asset.user ? Utils.escapeHtml(asset.user) : 'Unassigned (In Stock)'}</span>
                  <span class="transition-node-sub">${asset.team ? Utils.escapeHtml(asset.team) : 'IT Storage'}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 5. ADMIN REMARKS -->
          <div class="spec-card">
            <div class="spec-card-header">
              <div class="spec-card-title">
                <span>📝</span>
                <span>Admin Remarks</span>
              </div>
            </div>
            <div class="spec-card-body" style="padding: 14px 18px; display: flex; flex-direction: column; gap: 10px;">
              <div class="spec-item">
                <span class="spec-label">Admin Remark</span>
                <span class="spec-value" style="color: ${asset.remark ? '#0f172a' : '#64748b'}; font-weight: ${asset.remark ? '600' : '400'}; font-style: ${asset.remark ? 'normal' : 'italic'};">${asset.remark ? Utils.escapeHtml(asset.remark) : 'None'}</span>
              </div>
              <div class="spec-item">
                <span class="spec-label">Additional Notes</span>
                <span class="spec-value" style="color: #475569; font-size: 0.84rem;">
                  ${asset.condition ? `Hardware Condition: <strong>${Utils.escapeHtml(asset.condition)}</strong> • Asset active and operational in enterprise registry.` : 'Standard asset deployment • Verified in corporate inventory.'}
                </span>
              </div>
            </div>
          </div>
        `;
      }
      app.openModal('modalViewAsset');
    },
    editAsset(assetId) {
      if (this.currentRole === 'Viewer') {
        Utils.showToast('Access Denied', 'Viewer role has read-only access.', 'error');
        return;
      }
      const asset = store.data.assets.find(a => a.id === assetId);
      if (!asset) {
        Utils.showToast('Asset Not Found', `Record for ${assetId} could not be found.`, 'error');
        return;
      }

      app.populateEditAssetModal(asset);
      app.openModal('modalEditAsset');
    },

    deleteAsset(assetId) {
      const role = this.currentRole || (window.ITAppControllerInstance ? window.ITAppControllerInstance.currentRole : 'Admin');
      if (role === 'Viewer' || role === 'IT Support') {
        Utils.showToast('Access Denied', `${role} role cannot delete assets. Only Admin has deletion rights.`, 'error');
        return;
      }
      if (confirm(`Are you sure you want to permanently delete asset ${assetId}?`)) {
        store.data.assets = store.data.assets.filter(a => a.id !== assetId);
        store.addActivity('Deleted Asset Record', assetId, 'Sundar Pichai (SysAdmin)', 'Warning');
        store.save();
        Utils.showToast('Asset Deleted', `Record ${assetId} has been removed.`);
        app.updateDashboardMetrics();
        app.renderCurrentView();
      }
    },

    unassignSystem(assetId) {
      app.returnSystemToStock(assetId);
    },

    initiateSwapForAsset(assetId) {
      app.navigateTo('swap-system');
      const select = document.getElementById('swapOldUserSelect');
      if (select) {
        let opt = Array.from(select.options).find(o => o.value === assetId);
        if (!opt) {
          const asset = (store.data.assets || []).find(a => a.id === assetId);
          if (asset) {
            const userName = asset.user || asset.oldUsername || 'Available System';
            const statusLabel = asset.workStatus || asset.status || 'Asset';
            const newOpt = new Option(`${userName} (${asset.id} - ${asset.team || ''}) [${statusLabel}]`, asset.id);
            select.add(newOpt);
          }
        }
        select.value = assetId;
        select.dispatchEvent(new Event('change'));
      }
    },

    quickAssignAsset(assetId) {
      const asset = store.data.assets.find(a => a.id === assetId);
      if (!asset) return;

      const userName = prompt(`Assign ${asset.id} (${asset.type}) to user name:`);
      if (userName && userName.trim()) {
        const team = prompt(`Enter department/team for ${userName}:`, 'Engineering') || 'Engineering';
        if (asset.user && asset.user !== userName.trim()) {
          asset.oldUsername = asset.user;
        }
        asset.user = userName.trim();
        asset.team = team;
        asset.status = 'Assigned';
        asset.assignedDate = new Date().toISOString().substring(0, 10);

        store.addActivity(`Quick Assigned System to ${userName}`, asset.id, 'Sundar Pichai (SysAdmin)', 'Success');
        store.save();

        Utils.showToast('Asset Assigned', `${asset.id} assigned to ${userName}!`);
        app.updateDashboardMetrics();
        app.renderCurrentView();
      }
    },

    assignPendingUser(userName, team) {
      app.navigateTo('new-user');
      const nameInput = document.getElementById('newUserNameInput');
      const teamInput = document.getElementById('newUserTeamInput');
      if (nameInput) nameInput.value = userName;
      if (teamInput) teamInput.value = team;
    },

    updateReqStatus(reqId) {
      const req = store.data.requirements.find(r => r.id === reqId);
      if (!req) return;

      const newStatus = prompt(`Update status for ${req.id} (New, Pending, Approved, Purchase Required, Processing, Completed, Rejected):`, req.status);
      if (newStatus && newStatus.trim()) {
        req.status = newStatus.trim();
        store.save();
        Utils.showToast('Status Updated', `Requirement ${req.id} is now marked as ${req.status}.`);
        app.updateDashboardMetrics();
        app.renderRequirementsTable();
      }
    },

    deleteReq(reqId) {
      if (confirm(`Delete requirement ${reqId}?`)) {
        store.data.requirements = store.data.requirements.filter(r => r.id !== reqId);
        store.save();
        Utils.showToast('Deleted', `Requirement ${reqId} deleted.`);
        app.updateDashboardMetrics();
        app.renderRequirementsTable();
      }
    },

    deleteNonItAsset(id) {
      const role = this.currentRole || (window.ITAppControllerInstance ? window.ITAppControllerInstance.currentRole : 'Admin');
      if (role === 'Viewer' || role === 'IT Support') {
        Utils.showToast('Access Denied', `${role} role cannot delete non-IT assets.`, 'error');
        return;
      }
      if (confirm(`Delete Non-IT asset ${id}?`)) {
        store.data.nonItAssets = store.data.nonItAssets.filter(n => n.id !== id);
        store.save();
        Utils.showToast('Deleted', `Non-IT Asset ${id} deleted.`);
        app.updateDashboardMetrics();
        app.renderNonItAssetsTable();
      }
    },

    viewNonItAsset(id) {
      const item = store.data.nonItAssets.find(n => n.id === id);
      if (!item) return;
      alert(`Asset: ${item.name}\nCategory: ${item.category}\nBrand/Model: ${item.brand} ${item.model}\nLocation: ${item.location}\nCost: ${item.purchaseCost}\nWarranty: ${item.warranty}`);
    },

    addHardwareStockQty(id) {
      const item = store.data.hardwareStock.find(h => h.id === id);
      if (!item) return;

      const qty = parseInt(prompt(`Add quantity for ${item.name}:`, '5'));
      if (!isNaN(qty) && qty > 0) {
        item.quantity += qty;
        item.available += qty;
        item.status = item.available <= item.minStock ? 'Low Stock' : 'In Stock';
        store.save();
        Utils.showToast('Stock Added', `Added ${qty} units to ${item.name}.`);
        app.renderHardwareStockTable();
      }
    },

    openIssueHardwareModal(id) {
      const item = store.data.hardwareStock.find(h => h.id === id);
      if (!item) return;

      if (item.available <= 0) {
        Utils.showToast('Out of Stock', `No available units for ${item.name}.`, 'error');
        return;
      }

      const user = prompt(`Issue ${item.name} to employee name:`);
      if (user && user.trim()) {
        const team = prompt('Department/Team:', 'Engineering') || 'Engineering';
        item.available -= 1;
        item.status = item.available <= item.minStock ? 'Low Stock' : 'In Stock';

        store.data.assignedHardware.unshift({
          id: `AHW-${Math.floor(100 + Math.random() * 900)}`,
          user: user.trim(),
          team,
          hardware: item.name,
          brand: item.brand,
          model: item.model,
          serialNumber: `SN-${Math.floor(1000 + Math.random() * 9000)}`,
          assignedDate: new Date().toISOString().substring(0, 10),
          status: 'Active'
        });

        store.addActivity(`Issued ${item.name} to ${user}`, item.id, 'Sundar Pichai (SysAdmin)', 'Success');
        store.save();

        Utils.showToast('Hardware Issued', `1 unit of ${item.name} assigned to ${user}.`);
        app.renderHardwareStockTable();
      }
    },

    returnHardware(id) {
      const item = store.data.assignedHardware.find(a => a.id === id);
      if (!item) return;

      if (confirm(`Return ${item.hardware} from ${item.user} back into stock?`)) {
        store.data.assignedHardware = store.data.assignedHardware.filter(a => a.id !== id);

        // Replenish in stock if match found
        const stockItem = store.data.hardwareStock.find(h => h.name.includes(item.brand) || h.name.includes(item.model));
        if (stockItem) {
          stockItem.available += 1;
          stockItem.status = stockItem.available <= stockItem.minStock ? 'Low Stock' : 'In Stock';
        }

        store.addActivity(`Hardware Returned from ${item.user}`, item.hardware, 'Sundar Pichai (SysAdmin)', 'Success');
        store.save();

        Utils.showToast('Hardware Returned', `${item.hardware} returned to inventory.`);
        app.renderAssignedHardwareTable();
      }
    },

    markRepaired(repairId) {
      const rep = store.data.repairs.find(r => r.id === repairId);
      if (!rep) return;

      rep.status = 'Repaired & Returned';
      rep.actualReturn = new Date().toISOString().substring(0, 10);

      // Update asset back to Non-Assigned
      const asset = store.data.assets.find(a => a.id === rep.assetId);
      if (asset) {
        asset.status = 'Non-Assigned';
        asset.remark = `Repaired on ${rep.actualReturn} by ${rep.vendor}. Tested and working.`;
      }

      store.addActivity(`System Repaired & Returned (${rep.assetId})`, rep.assetId, 'Sundar Pichai (SysAdmin)', 'Success');
      store.save();

      Utils.showToast('Repair Completed', `${rep.assetId} is restored and moved to Available Non-Assigned pool.`);
      app.updateDashboardMetrics();
      app.renderRepairsTable();
    },

    exportAssignedUsersCSV() {
      const headers = ['S.No', 'Name', 'Team', 'Asset Type', 'Asset ID', 'CPU', 'RAM', 'HDD', 'SSD', 'Monitor', 'Old Username', 'Assigned Date', 'Status'];
      const assigned = store.data.assets.filter(a => a.status === 'Assigned' && a.user);
      const rows = [
        headers,
        ...assigned.map((a, i) => [
          i + 1,
          a.user,
          a.team,
          a.type,
          a.id,
          a.cpu,
          a.ram,
          a.hdd,
          a.ssd,
          a.monitor,
          a.oldUsername || 'None',
          a.assignedDate,
          a.status
        ])
      ];
      Utils.exportToCSV('Assigned_Users_Export', rows);
    },

    exportAllAssetsCSV() {
      const headers = ['Asset ID', 'Type', 'User', 'Work Status', 'Team', 'TL', 'CPU', 'RAM', 'HDD', 'SSD', 'Monitor', 'MAC Address', 'Assigned Date', 'Status', 'Warranty'];
      const rows = [
        headers,
        ...store.data.assets.map(a => [
          a.id,
          a.type,
          (a.user && a.user.trim() !== '' && a.user !== 'None' && a.user !== '—' && a.user !== 'Unassigned')
            ? a.user
            : (a.oldUsername && a.oldUsername.trim() !== '' && a.oldUsername !== 'None' && a.oldUsername !== '—' && a.oldUsername !== 'NEW SYSTEM')
              ? a.oldUsername
              : 'Unassigned',
          a.workStatus || 'Currently Working',
          a.team || 'None',
          a.tl || '-',
          a.cpu || '-',
          a.ram || '-',
          (!a.hdd || a.hdd.toLowerCase() === 'none' || a.hdd.toLowerCase() === 'nil') ? '-' : a.hdd,
          (!a.ssd || a.ssd.toLowerCase() === 'none' || a.ssd.toLowerCase() === 'nil') ? '-' : a.ssd,
          (!a.monitor || a.monitor === '-' || a.monitor.toLowerCase() === 'none') ? 'None' : a.monitor,
          (a.macAddress || a.serialNumber || '-').toUpperCase(),
          a.assignedDate || '-',
          a.status,
          a.warrantyEnd || 'Non-Warranty'
        ])
      ];
      Utils.exportToCSV('All_Assets_Inventory_Export', rows);
    },

    exportCurrentReport(type) {
      const select = document.getElementById('reportTypeSelect');
      const val = select ? select.value : type;
      Utils.exportToCSV(`IT_Asset_Report_${val}`, [
        ['Report Type', val],
        ['Exported Date', new Date().toISOString()],
        ...store.data.assets.map(a => [a.id, a.type, a.user, a.team, a.status])
      ]);
      Utils.showToast('Report Exported', 'CSV report downloaded successfully.');
    },

    backupDatabase() {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(store.data, null, 2));
      const dl = document.createElement('a');
      dl.setAttribute('href', dataStr);
      dl.setAttribute('download', `IT_Asset_Manager_Backup_${new Date().toISOString().substring(0, 10)}.json`);
      document.body.appendChild(dl);
      dl.click();
      dl.remove();
      Utils.showToast('Backup Created', 'System database JSON file downloaded.');
    },

    restoreDatabase(event) {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const parsed = JSON.parse(e.target.result);
          if (parsed && parsed.assets && parsed.users) {
            store.save(parsed);
            Utils.showToast('Restore Complete', 'Database restored successfully from backup.');
            app.updateDashboardMetrics();
            app.renderCurrentView();
          } else {
            throw new Error('Invalid schema');
          }
        } catch (err) {
          Utils.showToast('Restore Failed', 'Invalid JSON backup file provided.', 'error');
        }
      };
      reader.readAsText(file);
    },

    addNewTeam(name) {
      if (!name || !name.trim()) return;
      const teamName = name.trim().toUpperCase();
      if (!store.data.settings.teams) store.data.settings.teams = [];
      if (store.data.settings.teams.includes(teamName)) {
        Utils.showToast('Already Exists', `Department "${teamName}" is already in the list!`, 'warning');
        return;
      }
      store.data.settings.teams.push(teamName);
      store.save();
      app.populateTeamDropdowns();
      Utils.showToast('Department Added', `"${teamName}" has been added to all dropdowns!`, 'success');
    },

    deleteTeam(name) {
      if (confirm(`Remove department "${name}" from the active list?`)) {
        store.data.settings.teams = store.data.settings.teams.filter(t => t !== name);
        store.save();
        app.populateTeamDropdowns();
        Utils.showToast('Department Removed', `"${name}" removed from dropdowns.`);
      }
    },

    promptAddNewTeam(targetSelectId) {
      const newTeam = prompt('Enter New Department / Team Name:');
      if (newTeam && newTeam.trim()) {
        const teamName = newTeam.trim().toUpperCase();
        window.ITApp.addNewTeam(teamName);
        if (targetSelectId) {
          const selectEl = document.getElementById(targetSelectId);
          if (selectEl) selectEl.value = teamName;
        }
      }
    },

    // Authentication & RBAC Methods
    handleLoginSubmit(e) {
      app.handleLoginSubmit(e);
    },
    togglePasswordVisibility() {
      app.togglePasswordVisibility();
    },
    fillRolePreset(roleKey, autoSubmit = false) {
      app.fillRolePreset(roleKey, autoSubmit);
    },
    logout() {
      app.logout();
    },

    openAddSwitchModal() {
      app.openAddSwitchModal();
    },
    editSwitch(id) {
      app.editSwitch(id);
    },
    deleteSwitch(id) {
      app.deleteSwitch(id);
    },
    viewSwitch(id) {
      app.viewSwitch(id);
    },

    // Bypass IP Methods
    openAddBypassIpModal() {
      app.openAddBypassIpModal();
    },
    editBypassIp(id) {
      app.editBypassIp(id);
    },
    deleteBypassIp(id) {
      app.deleteBypassIp(id);
    },
    viewBypassIp(id) {
      app.viewBypassIp(id);
    },

    // Antivirus Methods
    openAddAntivirusModal() {
      app.openAddAntivirusModal();
    },
    editAntivirus(id) {
      app.editAntivirus(id);
    },
    deleteAntivirus(id) {
      app.deleteAntivirus(id);
    },
    viewAntivirus(id) {
      app.viewAntivirus(id);
    },

    // Repairs Methods
    openAddRepairModal() {
      app.openAddRepairModal();
    },
    editRepair(id) {
      app.editRepair(id);
    },
    deleteRepair(id) {
      app.deleteRepair(id);
    },
    viewRepair(id) {
      app.viewRepair(id);
    },

    // Warranty Methods
    openEditWarrantyModal(assetId) {
      app.openEditWarrantyModal(assetId);
    },
    extendWarrantyPreset(years) {
      app.extendWarrantyPreset(years);
    },

    async clearAllDataFresh() {
      if (!confirm('Are you sure you want to clear all existing data (assets, users, repairs, network, logs)? This will make the site completely fresh and clean for real use.')) {
        return;
      }
      try {
        await fetch('/api/database/fresh', { method: 'POST' });
      } catch (e) { }
      store.clearAllFresh();
      Utils.showToast('Fresh Start', 'All existing data cleared! The portal is now 100% clean and fresh.', 'success');
      setTimeout(() => location.reload(), 800);
    },

    async resetToFactoryDemoData() {
      if (!confirm('Reset entire system database to default demo data? All custom records will be replaced.')) {
        return;
      }
      try {
        await fetch('/api/database/restore', { method: 'POST' });
      } catch (e) { }
      store.reset();
      Utils.showToast('Database Reset', 'Demo data loaded successfully.', 'success');
      setTimeout(() => location.reload(), 800);
    }
  };

  // Global Escape key accessibility is unified in app.handleEscapeKeyPress()
})();
