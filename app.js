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
    ],
    instockHardware: [
      { id: 'STK-CPU-101', component_type: 'CPU', spec: 'Intel Core i7-12700 12th Gen', serial_number: 'SN-CPU-99481', purchase_date: '2025-01-10', status: 'Assigned', remark: 'High performance processor for system upgrade' },
      { id: 'STK-CPU-102', component_type: 'CPU', spec: 'Intel Core i5-11400 11th Gen', serial_number: 'SN-CPU-99482', purchase_date: '2025-02-14', status: 'Available', remark: 'Brand new in stock ready for allotment' },
      { id: 'STK-SSD-201', component_type: 'SSD', spec: 'Samsung 980 1TB NVMe M.2', serial_number: 'SN-SSD-44821', purchase_date: '2025-01-08', status: 'Assigned', remark: 'High speed storage upgrade' },
      { id: 'STK-SSD-202', component_type: 'SSD', spec: 'Crucial MX500 500GB 2.5" SATA', serial_number: 'SN-SSD-44822', purchase_date: '2025-02-01', status: 'Available', remark: 'In store cabinet A2' },
      { id: 'STK-RAM-301', component_type: 'RAM', spec: 'Corsair Vengeance 16GB DDR4 3200MHz', serial_number: 'SN-RAM-33101', purchase_date: '2025-01-20', status: 'Assigned', remark: 'App development workstation' },
      { id: 'STK-RAM-302', component_type: 'RAM', spec: 'Kingston Fury 32GB DDR5 5600MHz', serial_number: 'SN-RAM-33102', purchase_date: '2025-02-10', status: 'Available', remark: 'Spare memory for LLM system' },
      { id: 'STK-SMPS-401', component_type: 'SMPS', spec: 'Corsair CV650 650W 80 Plus Bronze', serial_number: 'SN-PSU-77201', purchase_date: '2025-01-05', status: 'Assigned', remark: 'Server rack support PSU' },
      { id: 'STK-SMPS-402', component_type: 'SMPS', spec: 'Cooler Master MWE 550W', serial_number: 'SN-PSU-77202', purchase_date: '2025-02-18', status: 'Available', remark: 'Tested and verified working' },
      { id: 'STK-MON-501', component_type: 'MONITOR', spec: 'Dell 24" IPS FHD P2419H', serial_number: 'SN-MON-66101', purchase_date: '2025-01-15', status: 'Available', remark: 'Returned to stock after project completion' },
      { id: 'STK-MON-502', component_type: 'MONITOR', spec: 'LG UltraWide 29" IPS HDR', serial_number: 'SN-MON-66102', purchase_date: '2025-02-05', status: 'Available', remark: 'In Stock Box 4' },
      { id: 'STK-OTH-601', component_type: 'OTHER', spec: 'Logitech MK295 Silent Wireless Combo', serial_number: 'SN-PER-11001', purchase_date: '2025-01-12', status: 'Assigned', remark: 'Finance desk peripheral set' },
      { id: 'STK-OTH-602', component_type: 'OTHER', spec: 'APC Back-UPS 1100VA / 660W', serial_number: 'SN-UPS-88001', purchase_date: '2025-02-12', status: 'Under Maintenance', remark: 'Battery cell service in progress' }
    ],
    instockAllocations: [
      { id: 'ALC-1001', asset_id: 'STK-CPU-101', user_name: 'VIMAL', tl_name: 'Sundar Pichai', component_type: 'CPU', spec: 'Intel Core i7-12700 12th Gen', serial_number: 'SN-CPU-99481', assigned_date: '2026-10-12', return_date: null, purpose: 'Development work', status: 'Assigned', assigned_by: 'Sundar Pichai (SysAdmin)', remark: 'High performance processor for system upgrade' },
      { id: 'ALC-1002', asset_id: 'STK-SSD-201', user_name: 'VIMAL', tl_name: 'Sundar Pichai', component_type: 'SSD', spec: 'Samsung 980 1TB NVMe M.2', serial_number: 'SN-SSD-44821', assigned_date: '2026-10-14', return_date: null, purpose: 'Storage upgrade', status: 'Assigned', assigned_by: 'Sundar Pichai (SysAdmin)', remark: 'Secondary NVMe SSD for fast model loading' },
      { id: 'ALC-1003', asset_id: 'STK-MON-501', user_name: 'VIMAL', tl_name: 'Sundar Pichai', component_type: 'MONITOR', spec: 'Dell 24" IPS FHD P2419H', serial_number: 'SN-MON-66101', assigned_date: '2026-08-20', return_date: '2026-09-30', purpose: 'Office use', status: 'Returned', assigned_by: 'Sundar Pichai (SysAdmin)', remark: 'Returned in good working condition' },
      { id: 'ALC-1004', asset_id: 'STK-RAM-301', user_name: 'Rahul V', tl_name: 'Anand Kumar', component_type: 'RAM', spec: 'Corsair Vengeance 16GB DDR4 3200MHz', serial_number: 'SN-RAM-33101', assigned_date: '2025-01-25', return_date: null, purpose: 'Development work', status: 'Assigned', assigned_by: 'Sundar Pichai (SysAdmin)', remark: 'App development workstation' },
      { id: 'ALC-1005', asset_id: 'STK-SMPS-401', user_name: 'Vignesh K', tl_name: 'Sundar Pichai', component_type: 'SMPS', spec: 'Corsair CV650 650W 80 Plus Bronze', serial_number: 'SN-PSU-77201', assigned_date: '2025-01-18', return_date: null, purpose: 'Replacement of faulty hardware', status: 'Assigned', assigned_by: 'Sundar Pichai (SysAdmin)', remark: 'Server rack support PSU' },
      { id: 'ALC-1006', asset_id: 'STK-OTH-601', user_name: 'Karthik N', tl_name: 'Ramesh B', component_type: 'OTHER', spec: 'Logitech MK295 Silent Wireless Combo', serial_number: 'SN-PER-11001', assigned_date: '2025-01-16', return_date: null, purpose: 'Office use', status: 'Assigned', assigned_by: 'Sundar Pichai (SysAdmin)', remark: 'Finance desk peripheral set' }
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
                this.data.instockHardware = remoteData.instockHardware || [];
                this.data.instockAllocations = remoteData.instockAllocations || [];
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
  window.ITAssetStoreInstance = store;

  // Helper Utility Functions
  // Expose Utils globally
  const Utils = {
    normalizeCpu(cpu) {
      if (!cpu) return '';
      return String(cpu).trim();
    },
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
    SESSION_TOKEN_KEY: 'it_asset_session_token',

    isAuthenticated() {
      const isAuth = localStorage.getItem(this.AUTH_TOKEN_KEY) === 'true' ||
        sessionStorage.getItem(this.AUTH_TOKEN_KEY) === 'true';
      const token = this.getToken();
      return !!(isAuth && token);
    },

    getToken() {
      return localStorage.getItem(this.SESSION_TOKEN_KEY) || sessionStorage.getItem(this.SESSION_TOKEN_KEY) || '';
    },

    getCurrentUser() {
      const stored = localStorage.getItem(this.USER_INFO_KEY) || sessionStorage.getItem(this.USER_INFO_KEY);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) { }
      }
      return null;
    },

    async login(username, password, remember = true) {
      const u = (username || '').trim();
      const p = (password || '').trim();

      if (!u || !p) {
        return { success: false, message: 'Username and password are required.' };
      }

      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username: u,
            password: p,
            rememberMe: remember
          })
        });

        const data = await response.json();

        if (response.ok && data.success) {
          const sessionUser = {
            id: data.user.id,
            username: data.user.username,
            displayName: data.user.displayName || data.user.username,
            role: data.user.role || 'Admin',
            avatar: data.user.avatar || 'SP',
            permissions: data.user.permissions || {},
            loginTime: new Date().toISOString()
          };

          const targetStorage = remember ? localStorage : sessionStorage;
          const otherStorage = remember ? sessionStorage : localStorage;

          targetStorage.setItem(this.AUTH_TOKEN_KEY, 'true');
          targetStorage.setItem(this.SESSION_TOKEN_KEY, data.token);
          targetStorage.setItem(this.USER_INFO_KEY, JSON.stringify(sessionUser));

          otherStorage.removeItem(this.AUTH_TOKEN_KEY);
          otherStorage.removeItem(this.SESSION_TOKEN_KEY);
          otherStorage.removeItem(this.USER_INFO_KEY);

          return { success: true, user: sessionUser, token: data.token };
        } else {
          return {
            success: false,
            message: data.message || 'Invalid username or password. Please verify credentials.'
          };
        }
      } catch (err) {
        console.error('Login network error:', err);
        return {
          success: false,
          message: 'Unable to connect to the authentication server. Please ensure the backend is running.'
        };
      }
    },

    async logout() {
      const token = this.getToken();
      if (token) {
        try {
          await fetch('/api/auth/logout', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });
        } catch (e) { }
      }
      localStorage.removeItem(this.AUTH_TOKEN_KEY);
      localStorage.removeItem(this.SESSION_TOKEN_KEY);
      localStorage.removeItem(this.USER_INFO_KEY);
      sessionStorage.removeItem(this.AUTH_TOKEN_KEY);
      sessionStorage.removeItem(this.SESSION_TOKEN_KEY);
      sessionStorage.removeItem(this.USER_INFO_KEY);
    }
  };

  // View Controller & Navigation Manager
  class AppController {
    constructor() {
      this.currentView = 'dashboard';
      this.lastNonAssignedFilterChanged = null;
      this.lastReqFilterChanged = null;
      this.assetSortDir = 'asc';
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

      if (!AuthService.isAuthenticated()) {
        // Not authenticated: hide dashboard, display login screen
        if (appContainer) appContainer.style.display = 'none';
        if (loginWrapper) {
          loginWrapper.style.display = 'flex';
          const userInput = document.getElementById('loginUsername');
          if (userInput) setTimeout(() => userInput.focus(), 150);
        }
        return;
      }

      // User is authenticated: hide login screen, show dashboard
      if (loginWrapper) loginWrapper.style.display = 'none';
      if (appContainer) appContainer.style.display = 'flex';

      const user = AuthService.getCurrentUser() || { displayName: 'Sundar Pichai', role: 'Admin', avatar: 'SP' };
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

    async handleLoginSubmit(e) {
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

      if (!username.trim() || !password.trim()) {
        if (errorAlert && errorMessage) {
          errorMessage.textContent = 'Please enter both username and password.';
          errorAlert.style.display = 'flex';
        }
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Verifying credentials...</span> <span class="spinner" style="display:inline-block; animation:spin 1s linear infinite;">⏳</span>';
      }

      try {
        const result = await AuthService.login(username, password, remember);

        if (!result.success) {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<span>Sign In to Dashboard</span> <span>→</span>';
          }
          if (errorAlert && errorMessage) {
            errorMessage.textContent = result.message || 'Invalid username or password.';
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
      } catch (err) {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<span>Sign In to Dashboard</span> <span>→</span>';
        }
        if (errorAlert && errorMessage) {
          errorMessage.textContent = 'Authentication error. Please check server connection.';
          errorAlert.style.display = 'flex';
        }
      }
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

    fillRolePreset(roleKey) {
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
    }

    async logout() {
      if (!confirm('Are you sure you want to sign out of the Asset Management Portal?')) {
        return;
      }

      const currentUser = AuthService.getCurrentUser();
      const name = currentUser ? currentUser.displayName : 'User';

      await AuthService.logout();
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
          const pop = document.getElementById('notificationPopover');
          if (pop) pop.classList.remove('active');
          const spot = document.getElementById('spotlightResultsDropdown');
          if (spot) spot.classList.remove('active');
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
        'instock': 'IN-STOCK Dashboard',
        'instock-dashboard': 'IN-STOCK Dashboard',
        'instock-inventory': 'Stock Inventory',
        'instock-assigned': 'Assigned Details',
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
        case 'instock':
        case 'instock-dashboard':
          this.renderInstockDashboard();
          break;
        case 'instock-inventory':
          this.renderInstockInventoryView();
          break;
        case 'instock-assigned':
          this.renderAssignedItemsTable();
          break;
        case 'employee-asset-history':
          this.renderEmployeeAssetHistory();
          break;
        case 'asset-lifecycle-history':
          this.renderAssetLifecycleHistory();
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

    /* ==========================================================================
       DYNAMIC DEPENDENT ASSET FILTERS & INVENTORY TABLE
       ========================================================================== */
    updateDependentAssetFilters(changedFilter) {
      const searchEl = document.getElementById('assetsSearchInput');
      const typeEl = document.getElementById('assetsTypeFilter');
      const cpuEl = document.getElementById('assetsCpuFilter');
      const teamEl = document.getElementById('assetsTeamFilter');
      const statusEl = document.getElementById('assetsStatusFilter');
      const workStatusEl = document.getElementById('assetsWorkStatusFilter');

      const search = (searchEl?.value || '').toLowerCase().trim();
      let typeVal = typeEl?.value || 'all';
      let cpuVal = cpuEl?.value || 'all';
      let teamVal = teamEl?.value || 'all';
      let statusVal = statusEl?.value || 'all';
      let workStatusVal = workStatusEl?.value || 'all';

      const assets = store.data.assets || [];

      // Helper to match an asset against current filter criteria
      const matchesCriteria = (a, excludeField) => {
        if (search) {
          const matchSearch =
            (a.id && a.id.toLowerCase().includes(search)) ||
            (a.user && a.user.toLowerCase().includes(search)) ||
            (a.oldUsername && a.oldUsername.toLowerCase().includes(search)) ||
            (a.serialNumber && a.serialNumber.toLowerCase().includes(search)) ||
            (a.cpu && a.cpu.toLowerCase().includes(search)) ||
            (a.ram && a.ram.toLowerCase().includes(search)) ||
            (a.hdd && a.hdd.toLowerCase().includes(search)) ||
            (a.ssd && a.ssd.toLowerCase().includes(search)) ||
            (a.monitor && a.monitor.toLowerCase().includes(search)) ||
            (a.team && a.team.toLowerCase().includes(search)) ||
            (a.tl && a.tl.toLowerCase().includes(search)) ||
            (a.location && a.location.toLowerCase().includes(search)) ||
            (a.workStatus && a.workStatus.toLowerCase().includes(search)) ||
            (a.status && a.status.toLowerCase().includes(search));
          if (!matchSearch) return false;
        }

        if (excludeField !== 'type' && typeVal !== 'all') {
          if (!a.type || a.type.toLowerCase() !== typeVal.toLowerCase()) return false;
        }
        if (excludeField !== 'cpu' && cpuVal !== 'all') {
          if (!a.cpu || a.cpu.trim().toLowerCase() !== cpuVal.trim().toLowerCase()) return false;
        }
        if (excludeField !== 'team' && teamVal !== 'all') {
          if (!a.team || a.team.trim().toLowerCase() !== teamVal.trim().toLowerCase()) return false;
        }
        if (excludeField !== 'status' && statusVal !== 'all') {
          if (!a.status || a.status.toLowerCase() !== statusVal.toLowerCase()) return false;
        }
        if (excludeField !== 'workStatus' && workStatusVal !== 'all') {
          const ws = a.workStatus || (a.status === 'Assigned' ? 'Currently Working' : '');
          if (!ws || ws.toLowerCase() !== workStatusVal.toLowerCase()) return false;
        }
        return true;
      };

      // 1. Invalidation Check when parent filter changes:
      // If Type changed, check if current CPU/Team/Status/WorkStatus are still valid for this Type
      if (changedFilter === 'type') {
        const allowedAssetsForType = assets.filter(a => matchesCriteria(a, 'cpu'));
        const allowedCpus = new Set(allowedAssetsForType.map(a => a.cpu ? a.cpu.trim().toLowerCase() : '').filter(Boolean));
        if (cpuVal !== 'all' && !allowedCpus.has(cpuVal.toLowerCase())) {
          cpuVal = 'all';
          if (cpuEl) cpuEl.value = 'all';
        }
      }

      // If CPU changed, check if Type is compatible with this CPU
      if (changedFilter === 'cpu') {
        const allowedAssetsForCpu = assets.filter(a => matchesCriteria(a, 'type'));
        const allowedTypes = new Set(allowedAssetsForCpu.map(a => a.type ? a.type.toLowerCase() : '').filter(Boolean));
        if (typeVal !== 'all' && !allowedTypes.has(typeVal.toLowerCase())) {
          typeVal = 'all';
          if (typeEl) typeEl.value = 'all';
        }
      }

      // 2. Compute available options for each dropdown
      // For TYPE:
      const typeMatches = assets.filter(a => matchesCriteria(a, 'type'));
      const validTypes = Array.from(new Set(typeMatches.map(a => a.type).filter(Boolean))).sort();
      if (typeVal !== 'all' && !validTypes.some(t => t.toLowerCase() === typeVal.toLowerCase())) {
        typeVal = 'all';
        if (typeEl) typeEl.value = 'all';
      }

      // For CPU:
      const cpuMatches = assets.filter(a => matchesCriteria(a, 'cpu'));
      const validCpus = Array.from(new Set(cpuMatches.map(a => a.cpu ? a.cpu.trim() : '').filter(Boolean)))
        .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));
      if (cpuVal !== 'all' && !validCpus.some(c => c.toLowerCase() === cpuVal.toLowerCase())) {
        cpuVal = 'all';
        if (cpuEl) cpuEl.value = 'all';
      }

      // For TEAM (Department) with case-insensitive deduplication:
      const teamMatches = assets.filter(a => matchesCriteria(a, 'team'));
      const teamMap = new Map();
      teamMatches.forEach(a => {
        if (a.team && a.team.trim()) {
          const trimmed = a.team.trim();
          const key = trimmed.toLowerCase();
          if (!teamMap.has(key)) {
            teamMap.set(key, trimmed);
          }
        }
      });
      const validTeams = Array.from(teamMap.values()).sort((a, b) => a.localeCompare(b));
      if (teamVal !== 'all' && !teamMap.has(teamVal.toLowerCase())) {
        teamVal = 'all';
        if (teamEl) teamEl.value = 'all';
      }

      // For STATUS:
      const statusMatches = assets.filter(a => matchesCriteria(a, 'status'));
      const validStatuses = Array.from(new Set(statusMatches.map(a => a.status).filter(Boolean))).sort();
      if (statusVal !== 'all' && !validStatuses.some(s => s.toLowerCase() === statusVal.toLowerCase())) {
        statusVal = 'all';
        if (statusEl) statusEl.value = 'all';
      }

      // For WORK STATUS:
      const workStatusMatches = assets.filter(a => matchesCriteria(a, 'workStatus'));
      const validWorkStatuses = Array.from(new Set(workStatusMatches.map(a => a.workStatus || (a.status === 'Assigned' ? 'Currently Working' : '')).filter(Boolean))).sort();
      if (workStatusVal !== 'all' && !validWorkStatuses.some(w => w.toLowerCase() === workStatusVal.toLowerCase())) {
        workStatusVal = 'all';
        if (workStatusEl) workStatusEl.value = 'all';
      }

      // Re-populate dropdown HTML options
      if (typeEl) {
        let typeHtml = '<option value="all">All Types</option>';
        validTypes.forEach(t => {
          typeHtml += `<option value="${Utils.escapeHtml(t)}">${Utils.escapeHtml(t)}</option>`;
        });
        typeEl.innerHTML = typeHtml;
        typeEl.value = typeVal;
      }

      if (cpuEl) {
        let cpuHtml = '<option value="all">All CPUs</option>';
        validCpus.forEach(c => {
          cpuHtml += `<option value="${Utils.escapeHtml(c)}">${Utils.escapeHtml(c)}</option>`;
        });
        cpuEl.innerHTML = cpuHtml;
        cpuEl.value = cpuVal;
      }

      if (teamEl) {
        let teamHtml = '<option value="all">All Departments</option>';
        validTeams.forEach(t => {
          teamHtml += `<option value="${Utils.escapeHtml(t)}">${Utils.escapeHtml(t)}</option>`;
        });
        teamEl.innerHTML = teamHtml;
        teamEl.value = teamVal;
      }

      if (statusEl) {
        let statusHtml = '<option value="all">All Statuses</option>';
        validStatuses.forEach(s => {
          statusHtml += `<option value="${Utils.escapeHtml(s)}">${Utils.escapeHtml(s)}</option>`;
        });
        statusEl.innerHTML = statusHtml;
        statusEl.value = statusVal;
      }

      if (workStatusEl) {
        let wsHtml = '<option value="all">All Work Statuses</option>';
        validWorkStatuses.forEach(w => {
          const prefix = w === 'Currently Working' ? '🟢 ' : (w === 'Work From Home' ? '🔵 ' : (w === 'User Exit' ? '🔴 ' : ''));
          wsHtml += `<option value="${Utils.escapeHtml(w)}">${prefix}${Utils.escapeHtml(w)}</option>`;
        });
        workStatusEl.innerHTML = wsHtml;
        workStatusEl.value = workStatusVal;
      }

      // Final filtered list with all active filters combined
      const finalFilteredList = assets.filter(a => matchesCriteria(a, null));

      return {
        finalFilteredList,
        validTypes,
        validCpus,
        validTeams,
        validStatuses,
        validWorkStatuses
      };
    }

    handleAssetFilterChange(changedFilter) {
      const result = this.updateDependentAssetFilters(changedFilter);
      this.renderAllAssetsTable(result.finalFilteredList);
    }

    renderAllAssetsTable(providedList = null) {
      const tbody = document.getElementById('allAssetsTableBody');
      if (!tbody) return;

      let list = providedList;
      if (!list) {
        const result = this.updateDependentAssetFilters();
        list = result.finalFilteredList;
      }

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
      const totalFleet = (store.data.assets || []).length;

      const search = (document.getElementById('assetsSearchInput')?.value || '').trim();
      const typeFilter = document.getElementById('assetsTypeFilter')?.value || 'all';
      const cpuFilter = document.getElementById('assetsCpuFilter')?.value || 'all';
      const teamFilter = document.getElementById('assetsTeamFilter')?.value || 'all';
      const statusFilter = document.getElementById('assetsStatusFilter')?.value || 'all';
      const workStatusFilter = document.getElementById('assetsWorkStatusFilter')?.value || 'all';

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

        const isNoHdd = !a.hdd || a.hdd === '-' || a.hdd === '—' || a.hdd.toLowerCase() === 'none' || a.hdd.toLowerCase() === 'nil';
        const hddText = isNoHdd ? '-' : a.hdd;

        const isNoSsd = !a.ssd || a.ssd === '-' || a.ssd === '—' || a.ssd.toLowerCase() === 'none' || a.ssd.toLowerCase() === 'nil';
        const ssdText = isNoSsd ? '-' : a.ssd;

        const isNoMon = !a.monitor || a.monitor === '-' || a.monitor === '—' || a.monitor.toLowerCase() === 'none' || a.monitor.toLowerCase() === 'nil';
        const monitorText = isNoMon ? 'None' : a.monitor;

        const isUnassigned = !a.user || a.user.trim() === '' || a.user === 'None' || a.user === '—' || a.user === 'Unassigned';
        const userDisplay = isUnassigned
          ? '<span style="color:var(--text-faint); font-style:italic;">Unassigned</span>'
          : `<strong>${Utils.escapeHtml(a.user)}</strong>`;

        const prevUserDisplay = (a.oldUsername && a.oldUsername.trim() !== '' && a.oldUsername !== 'None' && a.oldUsername !== '—' && a.oldUsername !== 'NEW SYSTEM')
          ? `<div style="font-size:0.75rem; color:var(--text-muted); margin-top:2px;" title="Previous User: ${Utils.escapeHtml(a.oldUsername)}"><span style="color:var(--text-faint);">Prev:</span> ${Utils.escapeHtml(a.oldUsername)}</div>`
          : '';

        const macOrSerial = (a.macAddress || a.serialNumber || '-').toUpperCase();
        const tlNote = (a.tl && a.tl !== '-' && a.tl !== a.team)
          ? `<div style="font-size:0.72rem; color:var(--text-muted); margin-top:2px;" title="Team Leader: ${Utils.escapeHtml(a.tl)}"><span style="color:var(--text-faint);">TL:</span> ${Utils.escapeHtml(a.tl)}</div>`
          : '';

        return `
          <tr data-asset-id="${Utils.escapeHtml(a.id)}" class="${a.isRecentlySaved ? 'row-saved-highlight' : ''}" title="Double-click to view full specifications" ondblclick="window.ITApp.viewAsset('${a.id}')">
            <td><span class="cell-asset-id" style="cursor:pointer;" onclick="window.ITApp.viewAsset('${a.id}')">${Utils.escapeHtml(a.id)}</span></td>
            <td><span class="status-pill status-available">${Utils.escapeHtml(a.type)}</span></td>
            <td>
              ${userDisplay}
              ${prevUserDisplay}
            </td>
            <td class="cell-work-status">
              ${this.getWorkStatusButton(a.id, a.workStatus)}
            </td>
            <td>
              <span class="status-pill" style="font-size:0.75rem; background:rgba(37,99,235,0.08); color:var(--primary); font-weight:600;">${Utils.escapeHtml(a.team || 'None')}</span>
              ${tlNote}
            </td>
            <td><span style="font-size:0.82rem; font-weight:600; color:var(--text-main);">${Utils.escapeHtml(a.cpu || '-')}</span></td>
            <td><span class="status-pill" style="font-size:0.75rem; background:rgba(37,99,235,0.08); color:var(--primary); font-weight:600;">${Utils.escapeHtml(a.ram || '-')}</span></td>
            <td><span style="font-size:0.82rem; color:${isNoHdd ? 'var(--text-faint)' : 'var(--text-main)'};">${Utils.escapeHtml(hddText)}</span></td>
            <td><span style="font-size:0.82rem; color:${isNoSsd ? 'var(--text-faint)' : 'var(--text-main)'};">${Utils.escapeHtml(ssdText)}</span></td>
            <td><span style="font-size:0.82rem; color:${isNoMon ? 'var(--text-faint)' : 'var(--text-main)'};">${Utils.escapeHtml(monitorText)}</span></td>
            <td><span class="font-mono" style="font-size:0.75rem;">${Utils.escapeHtml(macOrSerial)}</span></td>
            <td><span class="status-pill ${statusClass}">${Utils.escapeHtml(a.status)}</span></td>
            <td>
              <div class="action-btn-group">
                <button class="action-icon-btn btn-action-view" title="View Full Specs" onclick="window.ITApp.viewAsset('${a.id}')">👁️</button>
                <button class="action-icon-btn btn-action-edit" title="Edit Hardware Specification" onclick="window.ITApp.editAsset('${a.id}')">✏️</button>
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

    /* ==========================================================================
       ASSIGNED USERS DIRECTORY DYNAMIC FILTERS
       ========================================================================== */
    updateDependentAssignedUsersFilters(changedField) {
      const searchEl = document.getElementById('assignedUsersSearch');
      const typeEl = document.getElementById('assignedUsersTypeFilter');
      const teamEl = document.getElementById('assignedUsersTeamFilter');
      const workStatusEl = document.getElementById('assignedUsersWorkStatusFilter');

      const search = (searchEl?.value || '').toLowerCase().trim();
      let typeVal = typeEl?.value || 'all';
      let teamVal = teamEl?.value || 'all';
      let workStatusVal = workStatusEl?.value || 'all';

      const assignedAssets = (store.data.assets || []).filter(a => a.status === 'Assigned' && a.user);

      const matchesCriteria = (a, excludeField) => {
        if (search) {
          const matchSearch =
            (a.user && a.user.toLowerCase().includes(search)) ||
            (a.id && a.id.toLowerCase().includes(search)) ||
            (a.team && a.team.toLowerCase().includes(search)) ||
            (a.cpu && a.cpu.toLowerCase().includes(search)) ||
            (a.ram && a.ram.toLowerCase().includes(search));
          if (!matchSearch) return false;
        }
        if (excludeField !== 'type' && typeVal !== 'all') {
          if (!a.type || a.type.toLowerCase() !== typeVal.toLowerCase()) return false;
        }
        if (excludeField !== 'team' && teamVal !== 'all') {
          if (!a.team || a.team.trim().toLowerCase() !== teamVal.trim().toLowerCase()) return false;
        }
        if (excludeField !== 'workStatus' && workStatusVal !== 'all') {
          const ws = a.workStatus || 'Currently Working';
          if (!ws || ws.toLowerCase() !== workStatusVal.toLowerCase()) return false;
        }
        return true;
      };

      // Invalidation check
      if (changedField === 'type' && teamVal !== 'all') {
        const allowedAssets = assignedAssets.filter(a => matchesCriteria(a, 'team'));
        const allowedTeams = new Set(allowedAssets.map(a => a.team ? a.team.trim().toLowerCase() : '').filter(Boolean));
        if (!allowedTeams.has(teamVal.toLowerCase())) {
          teamVal = 'all';
          if (teamEl) teamEl.value = 'all';
        }
      }

      // Valid Types
      const typeMatches = assignedAssets.filter(a => matchesCriteria(a, 'type'));
      const availableTypes = Array.from(new Set(typeMatches.map(a => a.type).filter(Boolean))).sort();
      if (typeVal !== 'all' && !availableTypes.some(t => t.toLowerCase() === typeVal.toLowerCase())) {
        typeVal = 'all';
        if (typeEl) typeEl.value = 'all';
      }

      // Valid Teams (case-insensitively deduplicated)
      const teamMatches = assignedAssets.filter(a => matchesCriteria(a, 'team'));
      const teamMap = new Map();
      teamMatches.forEach(a => {
        if (a.team && a.team.trim()) {
          const trimmed = a.team.trim();
          const key = trimmed.toLowerCase();
          if (!teamMap.has(key)) teamMap.set(key, trimmed);
        }
      });
      const availableTeams = Array.from(teamMap.values()).sort((a, b) => a.localeCompare(b));
      if (teamVal !== 'all' && !teamMap.has(teamVal.toLowerCase())) {
        teamVal = 'all';
        if (teamEl) teamEl.value = 'all';
      }

      // Valid Work Statuses
      const workStatusMatches = assignedAssets.filter(a => matchesCriteria(a, 'workStatus'));
      const availableWorkStatuses = Array.from(new Set(workStatusMatches.map(a => a.workStatus || 'Currently Working').filter(Boolean))).sort();
      if (workStatusVal !== 'all' && !availableWorkStatuses.some(w => w.toLowerCase() === workStatusVal.toLowerCase())) {
        workStatusVal = 'all';
        if (workStatusEl) workStatusEl.value = 'all';
      }

      // Rebuild Type options
      if (typeEl) {
        let typeHtml = '<option value="all">All Asset Types</option>';
        availableTypes.forEach(t => {
          typeHtml += `<option value="${Utils.escapeHtml(t)}">${Utils.escapeHtml(t)}</option>`;
        });
        typeEl.innerHTML = typeHtml;
        typeEl.value = typeVal;
      }

      // Rebuild Team options
      if (teamEl) {
        let teamHtml = '<option value="all">All Departments</option>';
        availableTeams.forEach(t => {
          teamHtml += `<option value="${Utils.escapeHtml(t)}">${Utils.escapeHtml(t)}</option>`;
        });
        teamEl.innerHTML = teamHtml;
        teamEl.value = teamVal;
      }

      // Rebuild WorkStatus options
      if (workStatusEl) {
        let wsHtml = '<option value="all">All Work Statuses</option>';
        availableWorkStatuses.forEach(w => {
          const prefix = w === 'Currently Working' ? '🟢 ' : (w === 'Work From Home' ? '🔵 ' : (w === 'User Exit' ? '🔴 ' : ''));
          wsHtml += `<option value="${Utils.escapeHtml(w)}">${prefix}${Utils.escapeHtml(w)}</option>`;
        });
        workStatusEl.innerHTML = wsHtml;
        workStatusEl.value = workStatusVal;
      }

      const finalFilteredList = assignedAssets.filter(a => matchesCriteria(a, null));

      // Update Toolbar count & reset button
      const countPill = document.getElementById('assignedUsersCountPill');
      if (countPill) countPill.textContent = `${finalFilteredList.length} Users`;

      const resetBtn = document.getElementById('assignedUsersResetFiltersBtn');
      const hasActive = search !== '' || typeVal !== 'all' || teamVal !== 'all' || workStatusVal !== 'all';
      if (resetBtn) resetBtn.style.display = hasActive ? 'inline-flex' : 'none';

      return {
        finalFilteredList,
        availableTypes,
        availableTeams,
        availableWorkStatuses
      };
    }

    handleAssignedUsersFilterChange(field) {
      const result = this.updateDependentAssignedUsersFilters(field);
      this.renderAssignedUsersTable(result.finalFilteredList);
    }

    renderAssignedUsersTable(providedList = null) {
      const tbody = document.getElementById('assignedUsersTableBody');
      if (!tbody) return;
      let list = providedList;
      if (!list) {
        const filterRes = this.updateDependentAssignedUsersFilters();
        list = filterRes.finalFilteredList;
      }

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

    /* ==========================================================================
       NON-ASSIGNED AVAILABLE POOL DYNAMIC FILTERS
       ========================================================================== */
    updateDependentNonAssignedFilters(changedField) {
      const searchEl = document.getElementById('nonAssignedSearchInput');
      const typeEl = document.getElementById('nonAssignedTypeFilter');
      const cpuEl = document.getElementById('nonAssignedCpuFilter');
      const teamEl = document.getElementById('nonAssignedTeamFilter');
      const conditionEl = document.getElementById('nonAssignedConditionFilter');

      const search = (searchEl?.value || '').toLowerCase().trim();
      let typeVal = typeEl?.value || 'all';
      let cpuVal = cpuEl?.value || 'all';
      let teamVal = teamEl?.value || 'all';
      let conditionVal = conditionEl?.value || 'all';

      const unassignedAssets = (store.data.assets || []).filter(a =>
        (a.status === 'Non-Assigned' || a.status === 'Available') &&
        a.status !== 'Assigned' &&
        a.status !== 'Retired'
      );

      const matchesCriteria = (a, excludeField) => {
        if (search) {
          const matchSearch =
            (a.id && a.id.toLowerCase().includes(search)) ||
            (a.user && a.user.toLowerCase().includes(search)) ||
            (a.oldUsername && a.oldUsername.toLowerCase().includes(search)) ||
            (a.serialNumber && a.serialNumber.toLowerCase().includes(search)) ||
            (a.cpu && a.cpu.toLowerCase().includes(search)) ||
            (a.ram && a.ram.toLowerCase().includes(search)) ||
            (a.team && a.team.toLowerCase().includes(search));
          if (!matchSearch) return false;
        }

        if (excludeField !== 'type' && typeVal !== 'all') {
          const aType = (a.type || '').toLowerCase();
          const targetType = typeVal.toLowerCase();
          if (targetType === 'laptop') {
            if (aType !== 'laptop' && aType !== 'macbook') return false;
          } else if (aType !== targetType) {
            return false;
          }
        }
        if (excludeField !== 'cpu' && cpuVal !== 'all') {
          const normCpu = Utils.normalizeCpu(a.cpu).toLowerCase();
          if (normCpu !== cpuVal.toLowerCase()) return false;
        }
        if (excludeField !== 'team' && teamVal !== 'all') {
          if (!a.team || a.team.trim().toLowerCase() !== teamVal.trim().toLowerCase()) return false;
        }
        if (excludeField !== 'condition' && conditionVal !== 'all') {
          if (!a.condition || a.condition.toLowerCase() !== conditionVal.toLowerCase()) return false;
        }
        return true;
      };

      // Invalidation check
      if (changedField === 'type' && cpuVal !== 'all') {
        const allowedAssets = unassignedAssets.filter(a => matchesCriteria(a, 'cpu'));
        const allowedCpus = new Set(allowedAssets.map(a => Utils.normalizeCpu(a.cpu).toLowerCase()).filter(Boolean));
        if (!allowedCpus.has(cpuVal.toLowerCase())) {
          cpuVal = 'all';
          if (cpuEl) cpuEl.value = 'all';
        }
      }

      // Valid Types
      const typeMatches = unassignedAssets.filter(a => matchesCriteria(a, 'type'));
      const availableTypes = Array.from(new Set(typeMatches.map(a => a.type).filter(Boolean))).sort();
      if (typeVal !== 'all' && !availableTypes.some(t => t.toLowerCase() === typeVal.toLowerCase())) {
        typeVal = 'all';
        if (typeEl) typeEl.value = 'all';
      }

      // Valid CPUs (normalized)
      const cpuMatches = unassignedAssets.filter(a => matchesCriteria(a, 'cpu'));
      const cpuMap = new Map();
      cpuMatches.forEach(a => {
        const norm = Utils.normalizeCpu(a.cpu);
        if (norm) {
          const key = norm.toLowerCase();
          if (!cpuMap.has(key)) cpuMap.set(key, norm);
        }
      });
      const availableCpus = Array.from(cpuMap.values()).sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));
      if (cpuVal !== 'all' && !cpuMap.has(cpuVal.toLowerCase())) {
        cpuVal = 'all';
        if (cpuEl) cpuEl.value = 'all';
      }

      // Valid Teams
      const teamMatches = unassignedAssets.filter(a => matchesCriteria(a, 'team'));
      const teamMap = new Map();
      teamMatches.forEach(a => {
        if (a.team && a.team.trim()) {
          const trimmed = a.team.trim();
          const key = trimmed.toLowerCase();
          if (!teamMap.has(key)) teamMap.set(key, trimmed);
        }
      });
      const availableTeams = Array.from(teamMap.values()).sort((a, b) => a.localeCompare(b));
      if (teamVal !== 'all' && !teamMap.has(teamVal.toLowerCase())) {
        teamVal = 'all';
        if (teamEl) teamEl.value = 'all';
      }

      // Valid Conditions
      const condMatches = unassignedAssets.filter(a => matchesCriteria(a, 'condition'));
      const availableConditions = Array.from(new Set(condMatches.map(a => a.condition).filter(Boolean))).sort();
      if (conditionVal !== 'all' && !availableConditions.some(c => c.toLowerCase() === conditionVal.toLowerCase())) {
        conditionVal = 'all';
        if (conditionEl) conditionEl.value = 'all';
      }

      // Rebuild Dropdowns
      if (typeEl) {
        let typeHtml = '<option value="all">All Types</option>';
        availableTypes.forEach(t => {
          typeHtml += `<option value="${Utils.escapeHtml(t)}">${Utils.escapeHtml(t)}</option>`;
        });
        typeEl.innerHTML = typeHtml;
        typeEl.value = typeVal;
      }

      if (cpuEl) {
        let cpuHtml = '<option value="all">All CPUs</option>';
        availableCpus.forEach(c => {
          cpuHtml += `<option value="${Utils.escapeHtml(c)}">${Utils.escapeHtml(c)}</option>`;
        });
        cpuEl.innerHTML = cpuHtml;
        cpuEl.value = cpuVal;
      }

      if (teamEl) {
        let teamHtml = '<option value="all">All Departments</option>';
        availableTeams.forEach(t => {
          teamHtml += `<option value="${Utils.escapeHtml(t)}">${Utils.escapeHtml(t)}</option>`;
        });
        teamEl.innerHTML = teamHtml;
        teamEl.value = teamVal;
      }

      if (conditionEl) {
        let condHtml = '<option value="all">All Conditions</option>';
        availableConditions.forEach(c => {
          condHtml += `<option value="${Utils.escapeHtml(c)}">${Utils.escapeHtml(c)}</option>`;
        });
        conditionEl.innerHTML = condHtml;
        conditionEl.value = conditionVal;
      }

      const finalFilteredList = unassignedAssets.filter(a => matchesCriteria(a, null));

      // Update counters & buttons
      const filteredPill = document.getElementById('nonAssignedFilteredCountPill');
      if (filteredPill) filteredPill.textContent = `${finalFilteredList.length} Items Found`;

      const badge = document.getElementById('nonAssignedCountBadge');
      if (badge) badge.textContent = `${finalFilteredList.length} Available`;

      const resetBtn = document.getElementById('nonAssignedResetBtn');
      const hasActive = search !== '' || typeVal !== 'all' || cpuVal !== 'all' || teamVal !== 'all' || conditionVal !== 'all';
      if (resetBtn) resetBtn.style.display = hasActive ? 'inline-flex' : 'none';

      return {
        finalFilteredList,
        availableTypes,
        availableCpus,
        availableTeams,
        availableConditions
      };
    }

    handleNonAssignedFilterChange(field) {
      this.lastNonAssignedFilterChanged = field;
      const res = this.updateDependentNonAssignedFilters(field);
      this.renderNonAssignedView(res.finalFilteredList);
    }

    renderNonAssignedView(providedList = null) {
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
      }).join('');
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
      // 1. Populate Old User Dropdown with currently assigned users
      const oldUserSelect = document.getElementById('swapOldUserSelect');
      if (oldUserSelect) {
        const assignedAssets = store.data.assets.filter(a => a.status === 'Assigned' && a.user);
        oldUserSelect.innerHTML = `<option value="">-- Select Assigned User to Swap --</option>` +
          assignedAssets.map(a => `<option value="${Utils.escapeHtml(a.id)}">${Utils.escapeHtml(a.user)} (${Utils.escapeHtml(a.id)} - ${Utils.escapeHtml(a.team)})</option>`).join('');
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

    /* ==========================================================================
       REQUIREMENTS DYNAMIC DEPENDENT FILTERS
       ========================================================================== */
    updateDependentRequirementsFilters(changedField) {
      const searchEl = document.getElementById('reqSearchInput');
      const statEl = document.getElementById('reqStatusFilter');
      const prioEl = document.getElementById('reqPriorityFilter');

      const search = (searchEl?.value || '').toLowerCase().trim();
      let statVal = statEl?.value || 'all';
      let prioVal = prioEl?.value || 'all';

      const reqs = store.data.requirements || [];

      const matchesCriteria = (r, excludeField) => {
        if (search) {
          const matchSearch =
            (r.id && r.id.toLowerCase().includes(search)) ||
            (r.name && r.name.toLowerCase().includes(search)) ||
            (r.team && r.team.toLowerCase().includes(search)) ||
            (r.tl && r.tl.toLowerCase().includes(search)) ||
            (r.issue && r.issue.toLowerCase().includes(search)) ||
            (r.requirement && r.requirement.toLowerCase().includes(search));
          if (!matchSearch) return false;
        }
        if (excludeField !== 'status' && statVal !== 'all') {
          if (!r.status || r.status.toLowerCase() !== statVal.toLowerCase()) return false;
        }
        if (excludeField !== 'priority' && prioVal !== 'all') {
          if (!r.priority || r.priority.toLowerCase() !== prioVal.toLowerCase()) return false;
        }
        return true;
      };

      // Invalidation check when filter changes:
      if (changedField === 'status' && prioVal !== 'all') {
        const allowedReqs = reqs.filter(r => matchesCriteria(r, 'priority'));
        const allowedPrios = new Set(allowedReqs.map(r => r.priority ? r.priority.toLowerCase() : '').filter(Boolean));
        if (!allowedPrios.has(prioVal.toLowerCase())) {
          prioVal = 'all';
          if (prioEl) prioEl.value = 'all';
        }
      } else if (changedField === 'priority' && statVal !== 'all') {
        const allowedReqs = reqs.filter(r => matchesCriteria(r, 'status'));
        const allowedStats = new Set(allowedReqs.map(r => r.status ? r.status.toLowerCase() : '').filter(Boolean));
        if (!allowedStats.has(statVal.toLowerCase())) {
          statVal = 'all';
          if (statEl) statEl.value = 'all';
        }
      }

      // Status options
      const statMatches = reqs.filter(r => matchesCriteria(r, 'status'));
      const availableStatuses = Array.from(new Set(statMatches.map(r => r.status).filter(Boolean))).sort();
      if (!changedField && statVal !== 'all' && !availableStatuses.some(s => s.toLowerCase() === statVal.toLowerCase())) {
        statVal = 'all';
        if (statEl) statEl.value = 'all';
      }

      // Priority options
      const prioMatches = reqs.filter(r => matchesCriteria(r, 'priority'));
      const availablePriorities = Array.from(new Set(prioMatches.map(r => r.priority).filter(Boolean))).sort();
      if (!changedField && prioVal !== 'all' && !availablePriorities.some(p => p.toLowerCase() === prioVal.toLowerCase())) {
        prioVal = 'all';
        if (prioEl) prioEl.value = 'all';
      }

      // Rebuild dropdown options
      if (statEl) {
        let statHtml = '<option value="all">All Statuses</option>';
        availableStatuses.forEach(s => {
          statHtml += `<option value="${Utils.escapeHtml(s)}">${Utils.escapeHtml(s)}</option>`;
        });
        statEl.innerHTML = statHtml;
        statEl.value = statVal;
      }

      if (prioEl) {
        let prioHtml = '<option value="all">All Priorities</option>';
        availablePriorities.forEach(p => {
          prioHtml += `<option value="${Utils.escapeHtml(p)}">${Utils.escapeHtml(p)}</option>`;
        });
        prioEl.innerHTML = prioHtml;
        prioEl.value = prioVal;
      }

      const finalFilteredList = reqs.filter(r => matchesCriteria(r, null));

      // Counters & Reset button
      const countPill = document.getElementById('reqCountPill');
      if (countPill) countPill.textContent = `${finalFilteredList.length} Requirements`;

      const resetBtn = document.getElementById('reqResetFiltersBtn');
      const hasActive = search !== '' || statVal !== 'all' || prioVal !== 'all';
      if (resetBtn) resetBtn.style.display = hasActive ? 'inline-flex' : 'none';

      return {
        finalFilteredList,
        availableStatuses,
        availablePriorities
      };
    }

    handleRequirementsFilterChange(field) {
      this.lastReqFilterChanged = field;
      const res = this.updateDependentRequirementsFilters(field);
      this.renderRequirementsTable(res.finalFilteredList);
    }

    renderRequirementsTable(providedList = null) {
      const tbody = document.getElementById('requirementsTableBody');
      if (!tbody) return;
      let list = providedList;
      if (!list) {
        const res = this.updateDependentRequirementsFilters();
        list = res.finalFilteredList;
      }

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
      const existingOptions = Array.from(cpuFilter.options || []).map(o => o.value).filter(v => v !== 'all');
      const hasSameOptions = existingOptions.length === cpus.length && existingOptions.every((v, i) => v === cpus[i]);

      if (!hasSameOptions || (cpuFilter.options ? cpuFilter.options.length : 0) <= 1) {
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
              // 1. Populate Left Column (OLD USER / CURRENT SYSTEM)
              document.getElementById('swapOldTeam').value = asset.team || '';
              document.getElementById('swapOldAssetId').value = asset.id || '';
              document.getElementById('swapOldDetails').value = `${asset.type} • ${asset.cpu} • ${asset.ram} • ${asset.ssd || asset.hdd}`;
              document.getElementById('swapOldUsername').value = asset.user || '';

              // 2. Auto-apply to Right Column (NEW REPLACEMENT SYSTEM ALLOCATION)
              // User Name (Default to same user, editable)
              const newUserInput = document.getElementById('swapNewUserInput');
              if (newUserInput) newUserInput.value = asset.user || '';

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

      // 1. Update Old Asset to "Swap" pool and unassign from user
      const oldAsset = store.data.assets.find(a => a.id === oldAssetId);
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

    /* -------------------------------------------------------------
       COMPONENT LIFECYCLE CONTROLLER METHODS (API-BACKED)
       ------------------------------------------------------------- */
    calculateComponentWarranty(assignedDate, expiryDate) {
      if (!expiryDate || expiryDate === 'Non-Warranty' || expiryDate === 'None' || expiryDate === 'Nil' || expiryDate === '—') {
        return {
          status: 'Not Available',
          badgeClass: 'badge-muted',
          badgeColor: '#64748b',
          badgeBg: '#f1f5f9',
          badgeBorder: '#cbd5e1',
          daysText: 'No Warranty Registered',
          daysRemaining: null
        };
      }

      const exp = new Date(expiryDate);
      if (isNaN(exp.getTime())) {
        return {
          status: 'Not Available',
          badgeClass: 'badge-muted',
          badgeColor: '#64748b',
          badgeBg: '#f1f5f9',
          badgeBorder: '#cbd5e1',
          daysText: 'Invalid Date',
          daysRemaining: null
        };
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      exp.setHours(0, 0, 0, 0);

      const diffTime = exp.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays <= 0) {
        const expiredAgo = Math.abs(diffDays);
        return {
          status: 'Expired',
          badgeClass: 'badge-expired',
          badgeColor: '#dc2626',
          badgeBg: '#fef2f2',
          badgeBorder: '#fecaca',
          daysText: expiredAgo === 0 ? 'Expired today' : `Expired ${expiredAgo} day${expiredAgo === 1 ? '' : 's'} ago`,
          daysRemaining: diffDays
        };
      } else if (diffDays <= 30) {
        return {
          status: 'Expiring Soon',
          badgeClass: 'badge-warning',
          badgeColor: '#b45309',
          badgeBg: '#fffbeb',
          badgeBorder: '#fde68a',
          daysText: `${diffDays} day${diffDays === 1 ? '' : 's'} left (Expiring Soon)`,
          daysRemaining: diffDays
        };
      } else {
        const years = Math.floor(diffDays / 365);
        const months = Math.floor((diffDays % 365) / 30);
        let readablePeriod = '';
        if (years > 0) {
          readablePeriod = `${years} yr${years > 1 ? 's' : ''} ${months > 0 ? months + ' mo' : ''} (${diffDays} days left)`.trim();
        } else if (months > 0) {
          readablePeriod = `${months} mo (${diffDays} days left)`;
        } else {
          readablePeriod = `${diffDays} days remaining`;
        }

        return {
          status: 'Active',
          badgeClass: 'badge-active',
          badgeColor: '#16a34a',
          badgeBg: '#f0fdf4',
          badgeBorder: '#bbf7d0',
          daysText: readablePeriod,
          daysRemaining: diffDays
        };
      }
    }

    getComponentIcon(type) {
      const t = (type || '').toLowerCase();
      if (t.includes('ram')) return '🧠';
      if (t.includes('ssd')) return '💾';
      if (t.includes('hdd') || t.includes('hard')) return '💽';
      if (t.includes('cpu') || t.includes('processor')) return '⚡';
      if (t.includes('motherboard') || t.includes('board')) return '🖲️';
      if (t.includes('monitor') || t.includes('display')) return '🖥️';
      if (t.includes('keyboard')) return '⌨️';
      if (t.includes('mouse')) return '🖱️';
      if (t.includes('battery')) return '🔋';
      if (t.includes('gpu') || t.includes('graphic')) return '🎮';
      if (t.includes('psu') || t.includes('smps') || t.includes('power')) return '🔌';
      return '📦';
    }

    openAddComponentModal(assetId) {
      if (this.currentRole === 'Viewer') {
        Utils.showToast('Access Denied', 'Viewer role has read-only access.', 'error');
        return;
      }
      const asset = store.data.assets.find(a => a.id === assetId);
      if (!asset) return;

      const form = document.getElementById('formAddComponent');
      if (form) form.reset();

      document.getElementById('addComponentAssetId').value = assetId;
      document.getElementById('addComponentAssignedDate').value = new Date().toISOString().substring(0, 10);
      document.getElementById('addComponentWarrantyStart').value = new Date().toISOString().substring(0, 10);
      const defaultExp = new Date();
      defaultExp.setFullYear(defaultExp.getFullYear() + 2);
      document.getElementById('addComponentWarrantyExpiry').value = defaultExp.toISOString().substring(0, 10);

      this.openModal('modalAddComponent');
    }

    handleAddComponentTypeChange(type) {
      const modelInput = document.getElementById('addComponentModel');
      if (!modelInput) return;
      if (!modelInput.value) {
        if (type === 'RAM') modelInput.placeholder = 'e.g. 16GB DDR4 3200MHz';
        else if (type === 'SSD') modelInput.placeholder = 'e.g. 512GB NVMe M.2';
        else if (type === 'HDD') modelInput.placeholder = 'e.g. 1TB 7200RPM SATA';
        else if (type === 'CPU') modelInput.placeholder = 'e.g. Intel Core i5-12400F';
        else if (type === 'Monitor') modelInput.placeholder = 'e.g. Dell 24" FHD IPS';
        else if (type === 'Keyboard') modelInput.placeholder = 'e.g. Dell Pro Wireless KM5221W';
        else if (type === 'Mouse') modelInput.placeholder = 'e.g. Logitech B100 USB Optical';
        else if (type === 'Battery') modelInput.placeholder = 'e.g. 4-Cell 56Wh Lithium-Ion';
      }
    }

    toggleAddComponentWarrantyDate(mode) {
      const row = document.getElementById('addComponentWarrantyDatesRow');
      if (!row) return;
      row.style.display = mode === 'non-warranty' ? 'none' : 'grid';
    }

    async handleSaveNewComponent(e) {
      if (e) e.preventDefault();
      const assetId = document.getElementById('addComponentAssetId').value;
      const type = document.getElementById('addComponentType').value;
      const model = document.getElementById('addComponentModel').value.trim();
      const manufacturer = document.getElementById('addComponentManufacturer').value.trim();
      const serial = document.getElementById('addComponentSerial').value.trim();
      const assignedDate = document.getElementById('addComponentAssignedDate').value;
      const warrantyStatus = document.getElementById('addComponentWarrantyStatusSelect').value;
      const warrantyStart = document.getElementById('addComponentWarrantyStart').value;
      const warrantyExpiry = warrantyStatus === 'non-warranty' ? 'Non-Warranty' : document.getElementById('addComponentWarrantyExpiry').value;
      const notes = document.getElementById('addComponentNotes').value.trim();

      if (!type || !model || !assignedDate) {
        alert('Please fill in Component Type, Model / Specification, and Installation Date.');
        return;
      }

      const compData = {
        asset_id: assetId,
        component_type: type,
        component_name: `${type} (${model})`,
        model,
        manufacturer: manufacturer || 'Enterprise OEM',
        serial_number: serial || `SN-${type.substring(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
        assigned_date: assignedDate,
        warranty_start: warrantyStart || assignedDate,
        warranty_expiry: warrantyExpiry,
        status: 'Active',
        notes
      };

      try {
        const res = await fetch(`/api/assets/${encodeURIComponent(assetId)}/components`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${AuthService.getToken()}`
          },
          body: JSON.stringify(compData)
        });

        if (res.ok) {
          this.closeModal('modalAddComponent');
          Utils.showToast('Component Added', `${type} (${model}) registered to ${assetId}.`, 'success');
          await store.initApiSync();
          await this.viewAsset(assetId);
        } else {
          const err = await res.json();
          alert('Failed to save component: ' + (err.error || 'Server error'));
        }
      } catch (err) {
        alert('Connection error saving component.');
      }
    }

    async openEditComponentModal(componentId, assetId) {
      if (this.currentRole === 'Viewer') {
        Utils.showToast('Access Denied', 'Viewer role has read-only access.', 'error');
        return;
      }

      try {
        const res = await fetch(`/api/assets/${encodeURIComponent(assetId)}/components/${encodeURIComponent(componentId)}`);
        if (!res.ok) {
          alert('Component not found');
          return;
        }
        const comp = await res.json();

        document.getElementById('editComponentId').value = comp.id;
        document.getElementById('editComponentAssetId').value = assetId;
        document.getElementById('editComponentType').value = comp.component_type;
        document.getElementById('editComponentModel').value = comp.model || comp.component_name || '';
        document.getElementById('editComponentManufacturer').value = comp.manufacturer || '';
        document.getElementById('editComponentSerial').value = comp.serial_number || '';
        document.getElementById('editComponentAssignedDate').value = comp.assigned_date || '';
        document.getElementById('editComponentStatus').value = comp.status || 'Active';
        document.getElementById('editComponentWarrantyStart').value = comp.warranty_start || '';
        document.getElementById('editComponentWarrantyExpiry').value = comp.warranty_expiry || '';
        document.getElementById('editComponentNotes').value = comp.notes || '';

        this.openModal('modalEditComponent');
      } catch (e) {
        alert('Error loading component details');
      }
    }

    async handleSaveEditComponent(e) {
      if (e) e.preventDefault();
      const componentId = document.getElementById('editComponentId').value;
      const assetId = document.getElementById('editComponentAssetId').value;
      const model = document.getElementById('editComponentModel').value.trim();
      const manufacturer = document.getElementById('editComponentManufacturer').value.trim();
      const serial = document.getElementById('editComponentSerial').value.trim();
      const assignedDate = document.getElementById('editComponentAssignedDate').value;
      const status = document.getElementById('editComponentStatus').value;
      const warrantyStart = document.getElementById('editComponentWarrantyStart').value;
      const warrantyExpiry = document.getElementById('editComponentWarrantyExpiry').value;
      const notes = document.getElementById('editComponentNotes').value.trim();

      const updates = {
        model,
        component_name: model,
        manufacturer,
        serial_number: serial,
        assigned_date: assignedDate,
        status,
        warranty_start: warrantyStart,
        warranty_expiry: warrantyExpiry,
        notes
      };

      try {
        const res = await fetch(`/api/assets/${encodeURIComponent(assetId)}/components/${encodeURIComponent(componentId)}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${AuthService.getToken()}`
          },
          body: JSON.stringify(updates)
        });

        if (res.ok) {
          this.closeModal('modalEditComponent');
          Utils.showToast('Component Updated', `Specifications updated successfully.`, 'success');
          await store.initApiSync();
          await this.viewAsset(assetId);
        } else {
          alert('Failed to update component');
        }
      } catch (err) {
        alert('Network error updating component.');
      }
    }

    async openReplaceComponentModal(componentId, assetId) {
      if (this.currentRole === 'Viewer') {
        Utils.showToast('Access Denied', 'Viewer role has read-only access.', 'error');
        return;
      }

      try {
        const res = await fetch(`/api/assets/${encodeURIComponent(assetId)}/components/${encodeURIComponent(componentId)}`);
        if (!res.ok) {
          alert('Component not found');
          return;
        }
        const comp = await res.json();

        document.getElementById('replaceOldComponentId').value = comp.id;
        document.getElementById('replaceAssetId').value = assetId;

        document.getElementById('replaceOldCompTypeLabel').textContent = comp.component_type;
        document.getElementById('replaceOldCompModelLabel').textContent = comp.model || comp.component_name || '';
        document.getElementById('replaceOldCompSerialLabel').textContent = comp.serial_number || 'N/A';

        // Clear and prefill new fields
        document.getElementById('replaceNewModel').value = '';
        document.getElementById('replaceNewSerial').value = '';
        document.getElementById('replaceNewManufacturer').value = comp.manufacturer || '';
        document.getElementById('replaceDateInput').value = new Date().toISOString().substring(0, 10);

        const expDate = new Date();
        expDate.setFullYear(expDate.getFullYear() + 2);
        document.getElementById('replaceNewWarrantyExpiry').value = expDate.toISOString().substring(0, 10);
        document.getElementById('replaceNotes').value = '';

        this.openModal('modalReplaceComponent');
      } catch (e) {
        alert('Error loading component for replacement');
      }
    }

    async handleSaveReplaceComponent(e) {
      if (e) e.preventDefault();
      const oldCompId = document.getElementById('replaceOldComponentId').value;
      const assetId = document.getElementById('replaceAssetId').value;
      const model = document.getElementById('replaceNewModel').value.trim();
      const serial = document.getElementById('replaceNewSerial').value.trim();
      const manufacturer = document.getElementById('replaceNewManufacturer').value.trim();
      const replaceDate = document.getElementById('replaceDateInput').value;
      const reason = document.getElementById('replaceReasonSelect').value;
      const warrantyExpiry = document.getElementById('replaceNewWarrantyExpiry').value;
      const notes = document.getElementById('replaceNotes').value.trim();

      if (!model || !serial || !replaceDate) {
        alert('Please fill in Model, Serial Number, and Replacement Date.');
        return;
      }

      const payload = {
        model,
        component_name: model,
        serial_number: serial,
        manufacturer: manufacturer || 'Enterprise OEM',
        assigned_date: replaceDate,
        replacement_reason: reason,
        warranty_start: replaceDate,
        warranty_expiry: warrantyExpiry,
        notes
      };

      try {
        const res = await fetch(`/api/assets/${encodeURIComponent(assetId)}/components/${encodeURIComponent(oldCompId)}/replace`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${AuthService.getToken()}`
          },
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          this.closeModal('modalReplaceComponent');
          Utils.showToast('Component Replaced', `Replaced component. Previous record preserved in lifecycle history.`, 'success');
          await store.initApiSync();
          await this.viewAsset(assetId);
        } else {
          alert('Failed to execute replacement');
        }
      } catch (err) {
        alert('Connection error replacing component.');
      }
    }

    async openLifecycleHistoryModal(assetId) {
      try {
        const res = await fetch(`/api/assets/${encodeURIComponent(assetId)}/lifecycle-events`);
        const events = res.ok ? await res.json() : [];

        const container = document.getElementById('lifecycleHistoryContent');
        const subtitle = document.getElementById('lifecycleHistoryAssetSubtitle');
        if (subtitle) subtitle.textContent = `Asset ${assetId} • Complete chronological event log`;

        if (!container) return;

        if (events.length === 0) {
          container.innerHTML = `
            <div style="text-align:center; padding:32px 20px; color:#64748b; font-size:0.9rem;">
              <span style="font-size:2rem; display:block; margin-bottom:8px;">📜</span>
              No lifecycle events recorded for asset ${assetId} yet.
            </div>
          `;
        } else {
          container.innerHTML = `
            <div class="timeline-feed" style="display:flex; flex-direction:column; gap:14px;">
              ${events.map(ev => {
                let badgeBg = '#eff6ff';
                let badgeColor = '#1d4ed8';
                let badgeBorder = '#bfdbfe';
                let icon = '🔹';

                if (ev.event_type === 'Installed') {
                  badgeBg = '#ecfdf5'; badgeColor = '#065f46'; badgeBorder = '#a7f3d0'; icon = '🟢';
                } else if (ev.event_type === 'Replaced') {
                  badgeBg = '#fef3c7'; badgeColor = '#92400e'; badgeBorder = '#fde68a'; icon = '🔄';
                } else if (ev.event_type === 'Repaired') {
                  badgeBg = '#eff6ff'; badgeColor = '#1e40af'; badgeBorder = '#bfdbfe'; icon = '🔧';
                } else if (ev.event_type === 'Retired') {
                  badgeBg = '#fef2f2'; badgeColor = '#991b1b'; badgeBorder = '#fecaca'; icon = '🔴';
                } else if (ev.event_type === 'Updated') {
                  badgeBg = '#f8fafc'; badgeColor = '#334155'; badgeBorder = '#cbd5e1'; icon = '✏️';
                }

                return `
                  <div style="display:flex; gap:14px; background:#ffffff; border:1px solid #e2e8f0; border-radius:10px; padding:14px 16px; box-shadow:0 1px 2px rgba(0,0,0,0.03);">
                    <div style="width:36px; height:36px; border-radius:8px; background:${badgeBg}; border:1px solid ${badgeBorder}; display:flex; align-items:center; justify-content:center; font-size:1.1rem; flex-shrink:0;">
                      ${icon}
                    </div>
                    <div style="flex:1;">
                      <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:6px; margin-bottom:4px;">
                        <span style="font-size:0.75rem; font-weight:700; color:${badgeColor}; background:${badgeBg}; border:1px solid ${badgeBorder}; padding:2px 8px; border-radius:999px;">
                          ${Utils.escapeHtml(ev.event_type)}
                        </span>
                        <span class="font-mono" style="font-size:0.75rem; color:#64748b;">
                          📅 ${Utils.formatDate(ev.event_date)} · 👤 ${Utils.escapeHtml(ev.admin_user || 'admin')}
                        </span>
                      </div>
                      <p style="margin:4px 0 0 0; font-size:0.86rem; color:#1e293b; line-height:1.4;">
                        ${Utils.escapeHtml(ev.description)}
                      </p>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          `;
        }

        this.openModal('modalLifecycleHistory');
      } catch (e) {
        alert('Error loading lifecycle events');
      }
    }

    filterComponentsList(query) {
      const q = (query || '').toLowerCase().trim();
      const cards = document.querySelectorAll('.component-lifecycle-row-item');
      let visibleCount = 0;
      cards.forEach(card => {
        const text = (card.getAttribute('data-search-text') || '').toLowerCase();
        if (!q || text.includes(q)) {
          card.style.display = 'flex';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });
      const emptySearchEl = document.getElementById('componentSearchEmptyState');
      if (emptySearchEl) {
        emptySearchEl.style.display = visibleCount === 0 ? 'block' : 'none';
      }
    }

    promptDeleteComponent(componentId, assetId) {
      if (this.currentRole === 'Viewer') {
        Utils.showToast('Access Denied', 'Viewer role has read-only access.', 'error');
        return;
      }
      this.pendingDeleteComponentId = componentId;
      this.pendingDeleteAssetId = assetId;
      const modal = document.getElementById('modalConfirmDeleteComponent');
      if (modal) modal.style.display = 'flex';
    }

    cancelDeleteWarrantyComponent() {
      this.pendingDeleteComponentId = null;
      this.pendingDeleteAssetId = null;
      const modal = document.getElementById('modalConfirmDeleteComponent');
      if (modal) modal.style.display = 'none';
    }

    async confirmDeleteWarrantyComponent() {
      const compId = this.pendingDeleteComponentId;
      const assetId = this.pendingDeleteAssetId;
      if (!compId || !assetId) return;

      try {
        const res = await fetch(`/api/assets/${encodeURIComponent(assetId)}/components/${encodeURIComponent(compId)}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${AuthService.getToken()}`
          }
        });
        if (res.ok) {
          this.cancelDeleteWarrantyComponent();
          Utils.showToast('Component Removed', 'Hardware component deleted from lifecycle tracking.', 'info');
          await store.initApiSync();
          await this.viewAsset(assetId);
        } else {
          alert('Failed to delete component');
        }
      } catch (e) {
        alert('Network error deleting component.');
      }
    }

    async viewAsset(assetId) {
      if (window.ITApp && typeof window.ITApp.viewAsset === 'function') {
        return window.ITApp.viewAsset(assetId);
      }
    }

    /* ==========================================================================
       MODAL CONTROLLER
       ========================================================================== */
    setupModals() {
      // Close button handlers
      document.querySelectorAll('.modal-close-btn, [data-close-modal]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const overlay = btn.closest('.modal-overlay');
          if (overlay) {
            overlay.classList.remove('active');
            overlay.style.display = 'none';
          }
        });
      });

      // Click outside to close
      document.querySelectorAll('.modal-overlay').forEach(overlay => {
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
        modal.style.display = 'flex';
        modal.classList.add('active');
      }
    }

    closeModal(modalId) {
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.classList.remove('active');
        modal.style.display = 'none';
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
      const components = this.getWarrantyComponentsForAsset(asset);

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
          const exitDate = userExitDate || rawExitDate || asset.userExitDate || asset.availableDate || asset.assignedDate || new Date().toISOString().substring(0, 10);
          asset.userExitDate = exitDate;
          asset.availableDate = exitDate;
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
          const hasActiveWarranty = warrantyComponents.some(c => c.coverage === 'warranty' && c.expiryDate && c.expiryDate !== 'Non-Warranty');
          finalWarrantyType = hasActiveWarranty ? 'Component Lifecycle Tracking' : 'Non-Warranty';
          const validExpiries = warrantyComponents
            .filter(c => c.coverage === 'warranty' && c.expiryDate && c.expiryDate !== 'Non-Warranty' && c.type !== 'Non-Warranty')
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
    getWarrantyComponentsForAsset(asset) {
      if (!asset) return [];
      let components = [];
      if (Array.isArray(asset.warrantyComponents) && asset.warrantyComponents.length > 0) {
        components = JSON.parse(JSON.stringify(asset.warrantyComponents));
      } else if (typeof asset.warrantyComponents === 'string' && asset.warrantyComponents.trim()) {
        try {
          const parsed = JSON.parse(asset.warrantyComponents);
          if (Array.isArray(parsed) && parsed.length > 0) components = parsed;
        } catch (e) {}
      }

      const isNonWarranty = !asset.warrantyEnd ||
        asset.warrantyEnd === '-' ||
        asset.warrantyEnd === '—' ||
        asset.warrantyEnd.toLowerCase() === 'none' ||
        asset.warrantyEnd.toLowerCase() === 'non-warranty' ||
        asset.warrantyEnd.toLowerCase() === 'nil' ||
        (asset.warrantyType && asset.warrantyType.toLowerCase() === 'non-warranty');

      if (components.length === 0 && !isNonWarranty) {
        const defaultAssigned = asset.assignedDate || new Date().toISOString().substring(0, 10);
        const defaultExpiry = (asset.warrantyEnd && asset.warrantyEnd !== 'Non-Warranty' && asset.warrantyEnd !== 'None') ? asset.warrantyEnd : '';

        // Prepopulate individual hardware components from specs if available
        if (asset.cpu && asset.cpu.toLowerCase() !== 'none' && asset.cpu.toLowerCase() !== 'nil') {
          components.push({
            id: 'wc-' + asset.id + '-cpu',
            type: 'CPU / Processor',
            coverage: 'warranty',
            assignedDate: defaultAssigned,
            expiryDate: defaultExpiry
          });
        }
        if (asset.ram && asset.ram.toLowerCase() !== 'none' && asset.ram.toLowerCase() !== 'nil') {
          components.push({
            id: 'wc-' + asset.id + '-ram',
            type: 'RAM',
            coverage: 'warranty',
            assignedDate: defaultAssigned,
            expiryDate: defaultExpiry
          });
        }
        if (asset.ssd && asset.ssd.toLowerCase() !== 'none' && asset.ssd.toLowerCase() !== 'nil') {
          components.push({
            id: 'wc-' + asset.id + '-ssd',
            type: 'SSD',
            coverage: 'warranty',
            assignedDate: defaultAssigned,
            expiryDate: defaultExpiry
          });
        }
        if (asset.hdd && asset.hdd.toLowerCase() !== 'none' && asset.hdd.toLowerCase() !== 'nil') {
          components.push({
            id: 'wc-' + asset.id + '-hdd',
            type: 'HDD',
            coverage: 'warranty',
            assignedDate: defaultAssigned,
            expiryDate: defaultExpiry
          });
        }
        if (asset.monitor && asset.monitor.toLowerCase() !== 'none' && asset.monitor.toLowerCase() !== 'nil' && asset.monitor !== '-') {
          components.push({
            id: 'wc-' + asset.id + '-mon',
            type: 'Monitor',
            coverage: 'warranty',
            assignedDate: defaultAssigned,
            expiryDate: defaultExpiry
          });
        }
      }

      // Attach spec property to each component if not already present
      components.forEach(c => {
        if (!c.spec) {
          c.spec = (this && this.getComponentSpecText) ? this.getComponentSpecText(asset, c.type) : (typeof app !== "undefined" && app.getComponentSpecText ? app.getComponentSpecText(asset, c.type) : "");
        }
      });

      return components;
    }

    getComponentIcon(type) {
      const t = (type || '').toLowerCase();
      if (t.includes('ram')) return '💾';
      if (t.includes('ssd')) return '⚡';
      if (t.includes('hdd') || t.includes('hard disk')) return '💽';
      if (t.includes('mon') || t.includes('screen') || t.includes('display')) return '🖥️';
      if (t.includes('cpu') || t.includes('processor')) return '⚙️';
      if (t.includes('motherboard') || t.includes('board')) return '🖲️';
      if (t.includes('smps') || t.includes('power')) return '🔌';
      if (t.includes('gpu') || t.includes('graphics')) return '🎮';
      if (t.includes('key') || t.includes('mouse')) return '⌨️';
      if (t.includes('ups')) return '🔋';
      return '🛡️';
    }

    getComponentSpecText(asset, type) {
      if (!asset) return '';
      const t = (type || '').toLowerCase();
      if (t.includes('cpu') || t.includes('processor')) return (asset.cpu && asset.cpu !== 'None' && asset.cpu !== 'Nil') ? asset.cpu : '';
      if (t.includes('ram')) return (asset.ram && asset.ram !== 'None' && asset.ram !== 'Nil') ? asset.ram : '';
      if (t.includes('ssd')) return (asset.ssd && asset.ssd !== 'None' && asset.ssd !== 'Nil') ? asset.ssd : '';
      if (t.includes('hdd')) return (asset.hdd && asset.hdd !== 'None' && asset.hdd !== 'Nil') ? asset.hdd : '';
      if (t.includes('mon')) return (asset.monitor && asset.monitor !== 'None' && asset.monitor !== '-' && asset.monitor !== 'Nil') ? asset.monitor : '';
      if (t.includes('cpu')) return (asset.cpu && asset.cpu !== 'None' && asset.cpu !== 'Nil') ? asset.cpu : '';
      return '';
    }

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
      if (!compData || typeof compData !== 'object' || compData instanceof Event || compData.target) {
        compData = {};
      }
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
        type: (compData.type && compData.type !== 'click') ? compData.type : 'RAM',
        coverage: isNonW ? 'non-warranty' : 'warranty',
        assignedDate: compData.assignedDate || defaultAssigned,
        expiryDate: isNonW ? '' : (compData.expiryDate || defaultExpiry)
      };

      this.appendWarrantyComponentCard(rowData);
      this.updateWarrantyCountBadge();
      this.updateWarrantyKpis();
      this.syncMasterWarrantyFields();
    }

    removeWarrantyComponentRow(rowId) {
      if (!rowId) return;
      const card = document.getElementById(rowId);
      if (!card) return;

      const typeSelect = card.querySelector('.wc-type-select');
      const compType = typeSelect ? typeSelect.value : 'Component';

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

    requestDeleteWarrantyComponent(rowId) {
      this.removeWarrantyComponentRow(rowId);
    }

    confirmDeleteWarrantyComponent() {
      if (this.pendingDeleteRowId) {
        this.removeWarrantyComponentRow(this.pendingDeleteRowId);
        this.pendingDeleteRowId = null;
      }
      if (this.pendingDeleteComponentId) {
        const compId = this.pendingDeleteComponentId;
        const assetId = this.pendingDeleteAssetId;
        fetch(`/api/assets/${encodeURIComponent(assetId)}/components/${encodeURIComponent(compId)}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${AuthService.getToken()}` }
        }).catch(() => {});
        this.pendingDeleteComponentId = null;
        this.pendingDeleteAssetId = null;
      }
      const modal = document.getElementById('modalConfirmDeleteComponent');
      if (modal) modal.style.display = 'none';
    }

    cancelDeleteWarrantyComponent() {
      const modal = document.getElementById('modalConfirmDeleteComponent');
      if (modal) modal.style.display = 'none';
      this.pendingDeleteRowId = null;
      this.pendingDeleteComponentId = null;
      this.pendingDeleteAssetId = null;
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

    // ========================================================================
    // INSTOCK HARDWARE MANAGEMENT & USER-WISE ASSET TRACKING CONTROLLER
    // ========================================================================
    getInstockItems() {
      return store.data.instockHardware || [];
    }

    getInstockAllocations() {
      return store.data.instockAllocations || [];
    }

    renderInstockDashboard() {
      const items = this.getInstockItems();
      const total = items.length;
      const availableCount = items.filter(i => (i.status || 'Available') === 'Available').length;
      const assignedCount = items.filter(i => i.status === 'Assigned').length;
      const maintenanceCount = items.filter(i => i.status === 'Under Maintenance').length;

      // Update the 4 top summary cards with live database counts
      const totalEl = document.getElementById('instockTotalCount');
      const availEl = document.getElementById('instockAvailableCount');
      const assignedEl = document.getElementById('instockAssignedCount');
      const maintEl = document.getElementById('instockMaintenanceCount');

      if (totalEl) totalEl.textContent = total;
      if (availEl) availEl.textContent = availableCount;
      if (assignedEl) assignedEl.textContent = assignedCount;
      if (maintEl) maintEl.textContent = maintenanceCount;

      // Calculate live Stock & Assigned counts for the 6 Category Cards (Follow Reference Image)
      const categories = ['CPU', 'SSD', 'RAM', 'SMPS', 'MONITOR', 'OTHER'];
      categories.forEach(cat => {
        const catItems = items.filter(i => (i.component_type || 'OTHER').toUpperCase() === cat);
        const catStock = catItems.length;
        const catAssigned = catItems.filter(i => i.status === 'Assigned').length;

        const stockEl = document.getElementById(`instockCatStock${cat}`);
        const assignedEl = document.getElementById(`instockCatAssigned${cat}`);
        if (stockEl) stockEl.textContent = catStock;
        if (assignedEl) assignedEl.textContent = catAssigned;
      });

      // Render the hardware stock inventory overview table below the category cards
      this.renderInstockInventoryTable();
    }

    filterInventoryByCategory(cat) {
      const catSelect = document.getElementById('instockInventoryCategoryFilter');
      if (catSelect) {
        if (catSelect.value === cat) {
          catSelect.value = 'all';
        } else {
          catSelect.value = cat;
        }
      }

      // Toggle active class visually on category cards
      const categories = ['CPU', 'SSD', 'RAM', 'SMPS', 'MONITOR', 'OTHER'];
      categories.forEach(c => {
        const card = document.getElementById(`catCard${c}`);
        if (card) {
          if (catSelect && catSelect.value === c) {
            card.classList.add('active-cat');
          } else {
            card.classList.remove('active-cat');
          }
        }
      });

      this.renderInstockInventoryTable();
    }

    renderInstockInventoryTable() {
      const items = this.getInstockItems();
      const searchInput = document.getElementById('instockInventorySearch');
      const catSelect = document.getElementById('instockInventoryCategoryFilter');
      const statSelect = document.getElementById('instockInventoryStatusFilter');

      const searchVal = (searchInput?.value || '').toLowerCase().trim();
      const catVal = catSelect?.value || 'all';
      const statVal = statSelect?.value || 'all';

      const filtered = items.filter(item => {
        if (catVal !== 'all' && (item.component_type || '').toUpperCase() !== catVal) {
          return false;
        }
        if (statVal !== 'all' && (item.status || 'Available') !== statVal) {
          return false;
        }
        if (searchVal) {
          const match =
            (item.id || '').toLowerCase().includes(searchVal) ||
            (item.component_type || '').toLowerCase().includes(searchVal) ||
            (item.spec || '').toLowerCase().includes(searchVal) ||
            (item.serial_number || '').toLowerCase().includes(searchVal) ||
            (item.remark || '').toLowerCase().includes(searchVal);
          if (!match) return false;
        }
        return true;
      });

      const badge = document.getElementById('instockInventoryCountBadge');
      if (badge) {
        badge.textContent = `Showing ${filtered.length} of ${items.length} Items`;
      }

      const tbody = document.getElementById('instockInventoryTableBody');
      if (!tbody) return;

      if (filtered.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="7" style="text-align:center; padding:36px; color:#64748b; font-size:0.9rem;">
              <div style="font-size:2rem; margin-bottom:8px;">🔍</div>
              <strong>No hardware items match the selected filters.</strong>
              <div style="font-size:0.8rem; margin-top:4px;">Try clearing filters or click "+ Add Stock" to add new inventory.</div>
            </td>
          </tr>
        `;
        return;
      }

      const iconMap = {
        'CPU': '💻',
        'SSD': '⚡',
        'RAM': '🧠',
        'SMPS': '🔌',
        'MONITOR': '🖥️',
        'OTHER': '🧰'
      };

      tbody.innerHTML = filtered.map(item => {
        const type = (item.component_type || 'OTHER').toUpperCase();
        const icon = iconMap[type] || '📦';
        const st = item.status || 'Available';

        let statusBadge = '';
        if (st === 'Available') {
          statusBadge = `<span class="instock-badge instock-badge-available">🟢 Available</span>`;
        } else if (st === 'Assigned') {
          statusBadge = `<span class="instock-badge instock-badge-assigned">👤 Assigned</span>`;
        } else {
          statusBadge = `<span class="instock-badge instock-badge-maintenance">🛠️ Maintenance</span>`;
        }

        let actionBtns = '';
        if (st === 'Available') {
          actionBtns = `
            <button type="button" class="btn btn-sm btn-primary" onclick="window.ITApp.openAssignAssetModal('${item.id}')" title="Assign this asset to a user" style="padding:4px 9px; border-radius:6px; font-size:0.75rem; font-weight:700;">
              👤 Assign
            </button>
            <button type="button" class="btn btn-sm btn-secondary" onclick="window.ITApp.setHardwareMaintenance('${item.id}')" title="Mark Under Maintenance" style="padding:4px 8px; border-radius:6px; font-size:0.75rem;">
              🛠️
            </button>
          `;
        } else if (st === 'Assigned') {
          actionBtns = `
            <button type="button" class="btn btn-sm btn-secondary" onclick="window.ITApp.handleQuickReturn('${item.id}')" title="Return asset back to stock" style="padding:4px 9px; border-radius:6px; font-size:0.75rem; font-weight:700; color:#ea580c;">
              ↩️ Return
            </button>
          `;
        } else {
          actionBtns = `
            <button type="button" class="btn btn-sm btn-secondary" onclick="window.ITApp.markHardwareAvailable('${item.id}')" title="Repair completed, mark Available" style="padding:4px 9px; border-radius:6px; font-size:0.75rem; font-weight:700; color:#16a34a;">
              🟢 Restore
            </button>
          `;
        }

        return `
          <tr style="border-bottom:1px solid #f1f5f9;">
            <td>
              <span class="font-mono" style="font-weight:700; color:#2563eb; font-size:0.84rem;">${Utils.escapeHtml(item.id)}</span>
            </td>
            <td>
              <span class="badge" style="background:rgba(37,99,235,0.08); color:var(--primary); font-weight:700; font-size:0.75rem; padding:4px 8px; border-radius:6px; display:inline-flex; align-items:center; gap:4px;">
                <span>${icon}</span> <span>${type}</span>
              </span>
            </td>
            <td>
              <strong style="color:#0f172a; font-size:0.86rem;">${Utils.escapeHtml(item.spec || '—')}</strong>
              ${item.remark ? `<div style="font-size:0.73rem; color:#64748b; margin-top:2px;">${Utils.escapeHtml(item.remark)}</div>` : ''}
            </td>
            <td>
              <code style="background:#f8fafc; border:1px solid #e2e8f0; padding:2px 6px; border-radius:4px; font-size:0.78rem; color:#334155;">
                ${Utils.escapeHtml(item.serial_number || '—')}
              </code>
            </td>
            <td style="font-size:0.82rem; color:#475569;">
              ${Utils.escapeHtml(item.purchase_date || '—')}
            </td>
            <td>${statusBadge}</td>
            <td style="text-align:center; white-space:nowrap;">
              <div style="display:inline-flex; gap:6px; align-items:center;">
                <button type="button" class="btn btn-sm btn-secondary" onclick="window.ITApp.viewInstockItem('${item.id}')" title="View Hardware Details" style="padding:4px 8px; border-radius:6px; font-size:0.75rem;">
                  👁️
                </button>
                ${actionBtns}
                <button type="button" class="btn btn-sm btn-secondary" onclick="window.ITApp.openInstockEntryModal(null, '${item.id}')" title="Edit Hardware Record" style="padding:4px 8px; border-radius:6px; font-size:0.75rem;">
                  ✏️
                </button>
                <button type="button" class="btn btn-sm btn-secondary" onclick="window.ITApp.deleteInstockEntry('${item.id}')" title="Delete Hardware Record" style="padding:4px 8px; border-radius:6px; font-size:0.75rem; color:#ef4444;">
                  🗑️
                </button>
              </div>
            </td>
          </tr>
        `;
      }).join('');
    }

    // ========================================================================
    // STOCK INVENTORY VIEW CONTROLLER (DEDICATED FULL SUBMENU PAGE)
    // ========================================================================
    renderInstockInventoryView() {
      const items = this.getInstockItems();
      const searchInput = document.getElementById('instockInventoryFullSearch');
      const catSelect = document.getElementById('instockInventoryFullCategoryFilter');
      const statSelect = document.getElementById('instockInventoryFullStatusFilter');

      const searchVal = (searchInput?.value || '').toLowerCase().trim();
      const catVal = catSelect?.value || 'all';
      const statVal = statSelect?.value || 'all';

      const filtered = items.filter(item => {
        if (catVal !== 'all' && (item.component_type || '').toUpperCase() !== catVal) {
          return false;
        }
        if (statVal !== 'all' && (item.status || 'Available') !== statVal) {
          return false;
        }
        if (searchVal) {
          const match =
            (item.id || '').toLowerCase().includes(searchVal) ||
            (item.component_type || '').toLowerCase().includes(searchVal) ||
            (item.spec || '').toLowerCase().includes(searchVal) ||
            (item.serial_number || '').toLowerCase().includes(searchVal) ||
            (item.remark || '').toLowerCase().includes(searchVal);
          if (!match) return false;
        }
        return true;
      });

      const badge = document.getElementById('instockInventoryFullCountBadge');
      if (badge) {
        badge.textContent = `Showing ${filtered.length} of ${items.length} Items`;
      }

      const tbody = document.getElementById('instockInventoryFullTableBody');
      if (!tbody) return;

      if (filtered.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="7" style="text-align:center; padding:36px; color:#64748b; font-size:0.9rem;">
              <div style="font-size:2rem; margin-bottom:8px;">🔍</div>
              <strong>No hardware items match the selected filters.</strong>
              <div style="font-size:0.8rem; margin-top:4px;">Try clearing filters or click "+ Add Stock Item" to add new inventory.</div>
            </td>
          </tr>
        `;
        return;
      }

      const iconMap = {
        'CPU': '💻',
        'SSD': '⚡',
        'RAM': '🧠',
        'SMPS': '🔌',
        'MONITOR': '🖥️',
        'OTHER': '🧰'
      };

      tbody.innerHTML = filtered.map(item => {
        const type = (item.component_type || 'OTHER').toUpperCase();
        const icon = iconMap[type] || '📦';
        const st = item.status || 'Available';

        let statusBadge = '';
        if (st === 'Available') {
          statusBadge = `<span class="instock-badge instock-badge-available">🟢 Available</span>`;
        } else if (st === 'Assigned') {
          statusBadge = `<span class="instock-badge instock-badge-assigned">👤 Assigned</span>`;
        } else {
          statusBadge = `<span class="instock-badge instock-badge-maintenance">🛠️ Maintenance</span>`;
        }

        let actionBtns = '';
        if (st === 'Available') {
          actionBtns = `
            <button type="button" class="btn btn-sm btn-primary" onclick="window.ITApp.openAssignAssetModal('${item.id}')" title="Assign this asset" style="padding:4px 9px; border-radius:6px; font-size:0.75rem; font-weight:700;">
              👤 Assign
            </button>
          `;
        } else if (st === 'Assigned') {
          actionBtns = `
            <button type="button" class="btn btn-sm btn-secondary" onclick="window.ITApp.handleQuickReturn('${item.id}')" title="Return asset back to stock" style="padding:4px 9px; border-radius:6px; font-size:0.75rem; font-weight:700; color:#ea580c;">
              ↩️ Return
            </button>
          `;
        }

        return `
          <tr style="border-bottom:1px solid #f1f5f9;">
            <td>
              <span class="font-mono" style="font-weight:700; color:#2563eb; font-size:0.84rem;">${Utils.escapeHtml(item.id)}</span>
            </td>
            <td>
              <span class="badge" style="background:rgba(37,99,235,0.08); color:var(--primary); font-weight:700; font-size:0.75rem; padding:4px 8px; border-radius:6px; display:inline-flex; align-items:center; gap:4px;">
                <span>${icon}</span> <span>${type}</span>
              </span>
            </td>
            <td>
              <strong style="color:#0f172a; font-size:0.86rem;">${Utils.escapeHtml(item.spec || '—')}</strong>
              ${item.remark ? `<div style="font-size:0.73rem; color:#64748b; margin-top:2px;">${Utils.escapeHtml(item.remark)}</div>` : ''}
            </td>
            <td>
              <code style="background:#f8fafc; border:1px solid #e2e8f0; padding:2px 6px; border-radius:4px; font-size:0.78rem; color:#334155;">
                ${Utils.escapeHtml(item.serial_number || '—')}
              </code>
            </td>
            <td style="font-size:0.82rem; color:#475569;">
              ${Utils.escapeHtml(item.purchase_date || '—')}
            </td>
            <td>${statusBadge}</td>
            <td style="text-align:center; white-space:nowrap;">
              <div style="display:inline-flex; gap:6px; align-items:center;">
                <button type="button" class="btn btn-sm btn-secondary" onclick="window.ITApp.viewInstockItem('${item.id}')" title="View Hardware Details" style="padding:4px 8px; border-radius:6px; font-size:0.75rem;">
                  👁️
                </button>
                ${actionBtns}
                <button type="button" class="btn btn-sm btn-secondary" onclick="window.ITApp.openInstockEntryModal(null, '${item.id}')" title="Edit Hardware Record" style="padding:4px 8px; border-radius:6px; font-size:0.75rem;">
                  ✏️
                </button>
                <button type="button" class="btn btn-sm btn-secondary" onclick="window.ITApp.deleteInstockEntry('${item.id}')" title="Delete Hardware Record" style="padding:4px 8px; border-radius:6px; font-size:0.75rem; color:#ef4444;">
                  🗑️
                </button>
              </div>
            </td>
          </tr>
        `;
      }).join('');
    }

    filterFullInventoryView() {
      this.renderInstockInventoryView();
    }

    resetFullInventoryViewFilters() {
      const searchInput = document.getElementById('instockInventoryFullSearch');
      const catSelect = document.getElementById('instockInventoryFullCategoryFilter');
      const statSelect = document.getElementById('instockInventoryFullStatusFilter');

      if (searchInput) searchInput.value = '';
      if (catSelect) catSelect.value = 'all';
      if (statSelect) statSelect.value = 'all';

      this.renderInstockInventoryView();
    }

    // ========================================================================
    // VIEW HARDWARE ITEM MODAL
    // ========================================================================
    viewInstockItem(id) {
      const item = (store.data.instockHardware || []).find(i => i.id === id);
      if (!item) return;

      this.currentViewingHwId = id;
      const assetIdEl = document.getElementById('viewHwAssetId');
      const statusBadgeEl = document.getElementById('viewHwStatusBadge');
      const catEl = document.getElementById('viewHwCategory');
      const purchaseDateEl = document.getElementById('viewHwPurchaseDate');
      const specEl = document.getElementById('viewHwSpec');
      const serialEl = document.getElementById('viewHwSerial');
      const remarkEl = document.getElementById('viewHwRemark');
      const assignSection = document.getElementById('viewHwAssignmentSection');
      const userEl = document.getElementById('viewHwAssignedUser');
      const teamEl = document.getElementById('viewHwAssignedTeam');
      const tlEl = document.getElementById('viewHwAssignedTl');
      const dateEl = document.getElementById('viewHwAssignedDate');

      if (assetIdEl) assetIdEl.textContent = item.id;
      if (catEl) catEl.textContent = item.component_type || 'Hardware';
      if (purchaseDateEl) purchaseDateEl.textContent = item.purchase_date || '—';
      if (specEl) specEl.textContent = item.spec || '—';
      if (serialEl) serialEl.textContent = item.serial_number || '—';
      if (remarkEl) remarkEl.textContent = item.remark || 'None';

      const st = item.status || 'Available';
      if (statusBadgeEl) {
        if (st === 'Available') {
          statusBadgeEl.className = 'badge badge-success';
          statusBadgeEl.textContent = '🟢 Available';
        } else if (st === 'Assigned') {
          statusBadgeEl.className = 'badge badge-primary';
          statusBadgeEl.textContent = '👤 Assigned';
        } else {
          statusBadgeEl.className = 'badge badge-warning';
          statusBadgeEl.textContent = '🛠️ Under Maintenance';
        }
      }

      if (assignSection) {
        if (st === 'Assigned' && (item.assigned_user || item.team || item.tl)) {
          assignSection.style.display = 'flex';
          if (userEl) userEl.textContent = item.assigned_user || '—';
          if (teamEl) teamEl.textContent = item.team || '—';
          if (tlEl) tlEl.textContent = item.tl || '—';
          if (dateEl) dateEl.textContent = item.assigned_date || '—';
        } else {
          assignSection.style.display = 'none';
        }
      }

      this.openModal('modalViewInstockItem');
    }

    openInstockEntryModalFromView() {
      const id = this.currentViewingHwId;
      this.closeModal('modalViewInstockItem');
      if (id) {
        this.openInstockEntryModal(null, id);
      }
    }

    filterDashboardByStatus(status) {
      const statSelect = document.getElementById('instockInventoryStatusFilter');
      if (statSelect) {
        statSelect.value = status;
      }
      document.querySelectorAll('.instock-summary-card').forEach(c => c.classList.remove('active-filter'));
      if (status === 'all') {
        document.querySelector('.instock-summary-card.total')?.classList.add('active-filter');
      } else if (status === 'Available') {
        document.querySelector('.instock-summary-card.available')?.classList.add('active-filter');
      } else if (status === 'Assigned') {
        document.querySelector('.instock-summary-card.assigned')?.classList.add('active-filter');
      } else if (status === 'Under Maintenance') {
        document.querySelector('.instock-summary-card.maintenance')?.classList.add('active-filter');
      }
      this.renderInstockInventoryTable();
    }

    navToAssignedWithFilter(status) {
      this.navigateTo('instock-assigned');
      const statusSelect = document.getElementById('instockFilterStatus');
      if (statusSelect) {
        statusSelect.value = status;
      }
      this.renderAssignedItemsTable();
    }

    filterInstockDashboard() {
      this.renderInstockInventoryTable();
    }

    resetInstockDashboardFilters() {
      const searchInput = document.getElementById('instockInventorySearch');
      const catSelect = document.getElementById('instockInventoryCategoryFilter');
      const statSelect = document.getElementById('instockInventoryStatusFilter');

      if (searchInput) searchInput.value = '';
      if (catSelect) catSelect.value = 'all';
      if (statSelect) statSelect.value = 'all';

      document.querySelectorAll('.instock-summary-card').forEach(c => c.classList.remove('active-filter'));
      const categories = ['CPU', 'SSD', 'RAM', 'SMPS', 'MONITOR', 'OTHER'];
      categories.forEach(c => {
        document.getElementById(`catCard${c}`)?.classList.remove('active-cat');
      });

      this.renderInstockInventoryTable();
    }

    // ========================================================================
    // ASSIGNED DETAILS CONTROLLER (SEPARATE SUBMENU & ALLOCATIONS AUDIT)
    // ========================================================================
    populateAssignedFilterDropdowns() {
      const userSelect = document.getElementById('instockFilterUser');
      const deptSelect = document.getElementById('instockFilterDepartment');
      const tlSelect = document.getElementById('instockFilterTl');
      const catSelect = document.getElementById('instockFilterCategory');

      if (!userSelect) return;

      const currentSelectedUser = userSelect.value || 'all';
      const currentSelectedDept = deptSelect ? (deptSelect.value || 'all') : 'all';
      const currentSelectedTl = tlSelect ? (tlSelect.value || 'all') : 'all';
      const currentSelectedCat = catSelect ? (catSelect.value || 'all') : 'all';

      const allocations = this.getInstockAllocations();

      // 1. Departments filtered by user and category
      const deptMatches = allocations.filter(a => {
        if (currentSelectedUser !== 'all' && (a.user_name || '').toLowerCase() !== currentSelectedUser.toLowerCase()) return false;
        if (currentSelectedCat !== 'all' && (a.component_type || '').toUpperCase() !== currentSelectedCat.toUpperCase()) return false;
        return true;
      });
      const validDepts = Array.from(new Set(deptMatches.map(a => a.team ? a.team.trim() : '').filter(Boolean))).sort((a, b) => a.localeCompare(b));

      let selectedDept = currentSelectedDept;
      if (selectedDept !== 'all' && !validDepts.some(d => d.toLowerCase() === selectedDept.toLowerCase())) {
        selectedDept = 'all';
        if (deptSelect) deptSelect.value = 'all';
      }

      // 2. Users filtered by department and category
      const userMatches = allocations.filter(a => {
        if (selectedDept !== 'all' && (a.team || '').toLowerCase() !== selectedDept.toLowerCase()) return false;
        if (currentSelectedCat !== 'all' && (a.component_type || '').toUpperCase() !== currentSelectedCat.toUpperCase()) return false;
        return true;
      });
      const validUsers = Array.from(new Set(userMatches.map(a => a.user_name ? a.user_name.trim() : '').filter(Boolean))).sort((a, b) => a.localeCompare(b));

      let selectedUser = currentSelectedUser;
      if (selectedUser !== 'all' && !validUsers.some(u => u.toLowerCase() === selectedUser.toLowerCase())) {
        selectedUser = 'all';
        if (userSelect) userSelect.value = 'all';
      }

      // 3. TLs filtered by department and user
      const tlMatches = allocations.filter(a => {
        if (selectedDept !== 'all' && (a.team || '').toLowerCase() !== selectedDept.toLowerCase()) return false;
        if (selectedUser !== 'all' && (a.user_name || '').toLowerCase() !== selectedUser.toLowerCase()) return false;
        return true;
      });
      const validTls = Array.from(new Set(tlMatches.map(a => a.tl_name ? a.tl_name.trim() : '').filter(Boolean))).sort((a, b) => a.localeCompare(b));

      let selectedTl = currentSelectedTl;
      if (selectedTl !== 'all' && !validTls.some(t => t.toLowerCase() === selectedTl.toLowerCase())) {
        selectedTl = 'all';
        if (tlSelect) tlSelect.value = 'all';
      }

      // 4. Categories filtered by user and department
      const catMatches = allocations.filter(a => {
        if (selectedDept !== 'all' && (a.team || '').toLowerCase() !== selectedDept.toLowerCase()) return false;
        if (selectedUser !== 'all' && (a.user_name || '').toLowerCase() !== selectedUser.toLowerCase()) return false;
        return true;
      });
      const validCats = Array.from(new Set(catMatches.map(a => a.component_type ? a.component_type.trim().toUpperCase() : '').filter(Boolean))).sort((a, b) => a.localeCompare(b));

      let selectedCat = currentSelectedCat;
      if (selectedCat !== 'all' && !validCats.some(c => c.toUpperCase() === selectedCat.toUpperCase())) {
        selectedCat = 'all';
        if (catSelect) catSelect.value = 'all';
      }

      // Rebuild options strictly from real records
      let userOptionsHtml = '<option value="all">All Employees</option>';
      validUsers.forEach(u => {
        const sel = (u.toLowerCase() === selectedUser.toLowerCase()) ? 'selected' : '';
        userOptionsHtml += `<option value="${Utils.escapeHtml(u)}" ${sel}>${Utils.escapeHtml(u)}</option>`;
      });
      userSelect.innerHTML = userOptionsHtml;

      if (deptSelect) {
        let deptOptionsHtml = '<option value="all">All Departments</option>';
        validDepts.forEach(d => {
          const sel = (d.toLowerCase() === selectedDept.toLowerCase()) ? 'selected' : '';
          deptOptionsHtml += `<option value="${Utils.escapeHtml(d)}" ${sel}>${Utils.escapeHtml(d)}</option>`;
        });
        deptSelect.innerHTML = deptOptionsHtml;
      }

      if (tlSelect) {
        let tlOptionsHtml = '<option value="all">All Team Leads</option>';
        validTls.forEach(t => {
          const sel = (t.toLowerCase() === selectedTl.toLowerCase()) ? 'selected' : '';
          tlOptionsHtml += `<option value="${Utils.escapeHtml(t)}" ${sel}>${Utils.escapeHtml(t)}</option>`;
        });
        tlSelect.innerHTML = tlOptionsHtml;
      }

      if (catSelect) {
        let catOptionsHtml = '<option value="all">All Categories</option>';
        validCats.forEach(c => {
          const sel = (c.toUpperCase() === selectedCat.toUpperCase()) ? 'selected' : '';
          catOptionsHtml += `<option value="${Utils.escapeHtml(c)}" ${sel}>${Utils.escapeHtml(c)}</option>`;
        });
        catSelect.innerHTML = catOptionsHtml;
      }
    }
    
    renderAssignedItemsTable() {
      // Ensure filter dropdowns are populated dynamically from the database
      this.populateAssignedFilterDropdowns();

      const allocations = this.getInstockAllocations();
      const searchInput = document.getElementById('instockAssignedSearch');
      const userSelect = document.getElementById('instockFilterUser');
      const deptSelect = document.getElementById('instockFilterDepartment');
      const tlSelect = document.getElementById('instockFilterTl');
      const catSelect = document.getElementById('instockFilterCategory');
      const statSelect = document.getElementById('instockFilterStatus');
      const dateInput = document.getElementById('instockFilterDate');

      const searchVal = (searchInput?.value || '').toLowerCase().trim();
      const userVal = (userSelect?.value || 'all').toLowerCase();
      const deptVal = (deptSelect?.value || 'all').toLowerCase();
      const tlVal = (tlSelect?.value || 'all').toLowerCase();
      const catVal = (catSelect?.value || 'all').toUpperCase();
      const statVal = statSelect?.value || 'all';
      const dateVal = dateInput?.value || '';

      // CRITICAL: Combined AND Logic across all filters
      const filtered = allocations.filter(alloc => {
        // User filter
        if (userVal !== 'all' && (alloc.user_name || '').toLowerCase() !== userVal) {
          return false;
        }
        // Department / Team filter
        if (deptVal !== 'all' && (alloc.team || '').toLowerCase() !== deptVal) {
          return false;
        }
        // TL filter
        if (tlVal !== 'all' && (alloc.tl_name || '').toLowerCase() !== tlVal) {
          return false;
        }
        // Category filter
        if (catVal !== 'all' && (alloc.component_type || '').toUpperCase() !== catVal) {
          return false;
        }
        // Status filter (Assigned / Pending In-Stock / Returned)
        if (statVal !== 'all') {
          if (statVal === 'Assigned' && alloc.status !== 'Assigned') return false;
          if (statVal === 'Pending In-Stock' && alloc.status !== 'Pending In-Stock') return false;
          if (statVal === 'Returned' && alloc.status !== 'Returned') return false;
        }
        // Assigned Date filter
        if (dateVal && (alloc.assigned_date || '') !== dateVal) {
          return false;
        }
        // Multi-field search
        if (searchVal) {
          const match =
            (alloc.id || '').toLowerCase().includes(searchVal) ||
            (alloc.asset_id || '').toLowerCase().includes(searchVal) ||
            (alloc.user_name || '').toLowerCase().includes(searchVal) ||
            (alloc.team || '').toLowerCase().includes(searchVal) ||
            (alloc.tl_name || '').toLowerCase().includes(searchVal) ||
            (alloc.component_type || '').toLowerCase().includes(searchVal) ||
            (alloc.spec || '').toLowerCase().includes(searchVal) ||
            (alloc.serial_number || '').toLowerCase().includes(searchVal) ||
            (alloc.changing_reason || '').toLowerCase().includes(searchVal) ||
            (alloc.purpose || '').toLowerCase().includes(searchVal);
          if (!match) return false;
        }
        return true;
      });

      // Update badge count
      const badge = document.getElementById('instockAssignedCountBadge');
      if (badge) {
        badge.textContent = `Showing ${filtered.length} of ${allocations.length} Records`;
      }

      const tbody = document.getElementById('instockAssignedTableBody');
      if (!tbody) return;

      if (filtered.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="9" style="text-align:center; padding:36px; color:#64748b; font-size:0.9rem;">
              <div style="font-size:2rem; margin-bottom:8px;">🔍</div>
              <strong>No assigned details match the current filter selection.</strong>
              <div style="font-size:0.8rem; margin-top:4px;">Try clicking "↺ Clear All" to reset filters.</div>
            </td>
          </tr>
        `;
        return;
      }

      tbody.innerHTML = filtered.map(alloc => {
        const isAssigned = (alloc.status === 'Assigned');
        const isPending = (alloc.status === 'Pending In-Stock');

        let statusBadge = '';
        if (isAssigned) {
          statusBadge = `<span class="instock-badge instock-badge-assigned">🟢 Assigned</span>`;
        } else if (isPending) {
          statusBadge = `<span class="instock-badge instock-badge-pending">🟠 Pending In-Stock</span>`;
        } else {
          statusBadge = `<span class="instock-badge instock-badge-returned">⚪ Returned</span>`;
        }

        return `
          <tr style="border-bottom:1px solid #f1f5f9;">
            <td>
              <span class="font-mono" style="font-weight:700; color:#2563eb; font-size:0.84rem;">${Utils.escapeHtml(alloc.asset_id || alloc.id)}</span>
            </td>
            <td>
              <strong style="color:#0f172a; font-size:0.86rem;">${Utils.escapeHtml(alloc.spec || '—')}</strong>
              <div style="font-size:0.72rem; color:#64748b; font-family:var(--font-mono, monospace);">S/N: ${Utils.escapeHtml(alloc.serial_number || '—')}</div>
            </td>
            <td>
              <div style="display:flex; align-items:center; gap:8px;">
                <div style="width:28px; height:28px; border-radius:50%; background:#eff6ff; color:#2563eb; font-weight:700; font-size:0.75rem; display:flex; align-items:center; justify-content:center; border:1px solid #bfdbfe; flex-shrink:0;">
                  ${Utils.escapeHtml((alloc.user_name || 'U').substring(0, 2).toUpperCase())}
                </div>
                <strong style="color:#0f172a; font-size:0.86rem; cursor:pointer;" onclick="window.ITApp.openUserAssetHistoryModal('${Utils.escapeHtml(alloc.user_name)}')" title="Click to view full user history">
                  ${Utils.escapeHtml(alloc.user_name || '—')}
                </strong>
              </div>
            </td>
            <td>
              <span class="badge" style="background:#f1f5f9; color:#334155; font-weight:600; font-size:0.76rem; border:1px solid #e2e8f0; padding:3px 8px; border-radius:6px;">
                ${Utils.escapeHtml(alloc.team || '—')}
              </span>
            </td>
            <td style="font-size:0.84rem; font-weight:600; color:#334155;">
              ${Utils.escapeHtml(alloc.tl_name || '—')}
            </td>
            <td>${statusBadge}</td>
            <td style="font-size:0.82rem; color:#64748b; font-weight:500;">
              ${Utils.escapeHtml(alloc.user_exit_date || '—')}
            </td>
            <td>
              <span style="font-size:0.8rem; color:#1e40af; background:#eff6ff; border:1px solid #bfdbfe; padding:2px 8px; border-radius:6px; display:inline-block; font-weight:500;">
                ${Utils.escapeHtml(alloc.changing_reason || alloc.purpose || '—')}
              </span>
            </td>
            <td style="text-align:center; white-space:nowrap;">
              <div style="display:inline-flex; gap:6px; align-items:center;">
                <button type="button" class="btn btn-sm btn-secondary" onclick="window.ITApp.viewAllocationDetails('${alloc.id}')" title="View Assignment Details" style="padding:4px 8px; border-radius:6px; font-size:0.75rem;">
                  👁️
                </button>
                <button type="button" class="btn btn-sm btn-secondary" onclick="window.ITApp.openEditAllocationModal('${alloc.id}')" title="Edit Details" style="padding:4px 8px; border-radius:6px; font-size:0.75rem;">
                  ✏️ Edit
                </button>
                ${isAssigned ? `
                  <button type="button" class="btn btn-sm btn-secondary" onclick="window.ITApp.openReturnAssetModal('${alloc.id}')" title="Return Asset" style="padding:4px 8px; border-radius:6px; font-size:0.75rem; font-weight:700; color:#ea580c;">
                    ↩️ Return
                  </button>
                ` : ''}
              </div>
            </td>
          </tr>
        `;
      }).join('');
    }

    renderInstockAssignedTable() {
      this.renderAssignedItemsTable();
    }

    filterAssignedItems() {
      this.renderAssignedItemsTable();
    }

    resetAssignedItemsFilters() {
      const searchInput = document.getElementById('instockAssignedSearch');
      const userSelect = document.getElementById('instockFilterUser');
      const deptSelect = document.getElementById('instockFilterDepartment');
      const tlSelect = document.getElementById('instockFilterTl');
      const catSelect = document.getElementById('instockFilterCategory');
      const statSelect = document.getElementById('instockFilterStatus');
      const dateInput = document.getElementById('instockFilterDate');

      if (searchInput) searchInput.value = '';
      if (userSelect) userSelect.value = 'all';
      if (deptSelect) deptSelect.value = 'all';
      if (tlSelect) tlSelect.value = 'all';
      if (catSelect) catSelect.value = 'all';
      if (statSelect) statSelect.value = 'all';
      if (dateInput) dateInput.value = '';

      this.renderAssignedItemsTable();
    }

    viewAllocationDetails(allocId) {
      const alloc = (store.data.instockAllocations || []).find(a => a.id === allocId);
      if (!alloc) return;

      this.currentViewingAllocId = allocId;
      const assetIdEl = document.getElementById('viewAllocAssetId');
      const allocIdEl = document.getElementById('viewAllocId');
      const statusBadgeEl = document.getElementById('viewAllocStatusBadge');
      const userEl = document.getElementById('viewAllocUser');
      const teamEl = document.getElementById('viewAllocTeam');
      const tlEl = document.getElementById('viewAllocTl');
      const specEl = document.getElementById('viewAllocSpec');
      const serialEl = document.getElementById('viewAllocSerial');
      const assignedDateEl = document.getElementById('viewAllocAssignedDate');
      const exitDateEl = document.getElementById('viewAllocExitDate');
      const reasonEl = document.getElementById('viewAllocReason');
      const remarkEl = document.getElementById('viewAllocRemark');

      if (assetIdEl) assetIdEl.textContent = alloc.asset_id || alloc.id;
      if (allocIdEl) allocIdEl.textContent = alloc.id;
      if (userEl) userEl.textContent = alloc.user_name || '—';
      if (teamEl) teamEl.textContent = alloc.team || '—';
      if (tlEl) tlEl.textContent = alloc.tl_name || '—';
      if (specEl) specEl.textContent = alloc.spec || '—';
      if (serialEl) serialEl.textContent = alloc.serial_number || '—';
      if (assignedDateEl) assignedDateEl.textContent = alloc.assigned_date || '—';
      if (exitDateEl) exitDateEl.textContent = alloc.user_exit_date || '—';
      if (reasonEl) reasonEl.textContent = alloc.changing_reason || alloc.purpose || 'General Allocation';
      if (remarkEl) remarkEl.textContent = alloc.remark || 'None';

      if (statusBadgeEl) {
        if (alloc.status === 'Assigned') {
          statusBadgeEl.className = 'badge badge-success';
          statusBadgeEl.textContent = '🟢 Assigned';
        } else if (alloc.status === 'Pending In-Stock') {
          statusBadgeEl.className = 'badge badge-warning';
          statusBadgeEl.textContent = '🟠 Pending In-Stock';
        } else {
          statusBadgeEl.className = 'badge badge-secondary';
          statusBadgeEl.textContent = '⚪ Returned';
        }
      }

      this.openModal('modalViewAllocation');
    }

    openEditAllocationFromView() {
      const id = this.currentViewingAllocId;
      this.closeModal('modalViewAllocation');
      if (id) {
        this.openEditAllocationModal(id);
      }
    }

    exportAssignedCsv() {
      const allocations = this.getInstockAllocations();
      if (!allocations || allocations.length === 0) {
        Utils.showToast('Export Empty', 'No allocation records to export.', 'warning');
        return;
      }
      const headers = ['Asset ID', 'Specification', 'Serial Number', 'Assigned Employee Name', 'Department / Team', 'Team Leader (TL)', 'System Status', 'User Exit Date', 'Hardware Changing Reason', 'Assigned Date', 'Remarks'];
      const rows = allocations.map(a => [
        `"${a.asset_id || a.id || ''}"`,
        `"${(a.spec || '').replace(/"/g, '""')}"`,
        `"${a.serial_number || ''}"`,
        `"${(a.user_name || '').replace(/"/g, '""')}"`,
        `"${(a.team || '').replace(/"/g, '""')}"`,
        `"${(a.tl_name || '').replace(/"/g, '""')}"`,
        `"${a.status || ''}"`,
        `"${a.user_exit_date || ''}"`,
        `"${(a.changing_reason || a.purpose || '').replace(/"/g, '""')}"`,
        `"${a.assigned_date || ''}"`,
        `"${(a.remark || '').replace(/"/g, '""')}"`
      ]);

      const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `INSTOCK_Assigned_Details_${new Date().toISOString().substring(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      Utils.showToast('CSV Exported', `Exported ${allocations.length} records.`, 'success');
    }

    // ========================================================================
    // ASSET ASSIGNMENT FORM (REQUIREMENT 4)
    // ========================================================================
    openAssignAssetModal(preselectedAssetId = null) {
      const userList = document.getElementById('assignAssetUserList');
      const userInput = document.getElementById('assignAssetUser');
      const tlSelect = document.getElementById('assignAssetTl');
      const hwSelect = document.getElementById('assignAssetHardware');
      const dateInput = document.getElementById('assignAssetDate');
      const purposeSelect = document.getElementById('assignAssetPurposeSelect');
      const purposeCustom = document.getElementById('assignAssetPurposeCustom');

      // Populate User Datalist from existing users & history
      if (userList) {
        const userSet = new Set();
        (store.data.users || []).forEach(u => { if (u.name) userSet.add(u.name.trim()); });
        (store.data.instockAllocations || []).forEach(a => { if (a.user_name) userSet.add(a.user_name.trim()); });
        userSet.add('VIMAL');
        userList.innerHTML = Array.from(userSet).sort().map(name => `<option value="${Utils.escapeHtml(name)}">${Utils.escapeHtml(name)}</option>`).join('');
      }

      // Populate TL Select from system team leads
      if (tlSelect) {
        const tlList = ['Sundar Pichai', 'Kavitha R', 'Mohan K', 'Divya S', 'Anand Kumar', 'Ramesh B'];
        tlSelect.innerHTML = `<option value="">Select Team Lead...</option>` +
          tlList.map(tl => `<option value="${Utils.escapeHtml(tl)}">${Utils.escapeHtml(tl)}</option>`).join('');
      }

      // Populate Available Assets ONLY (from instockHardware where status === 'Available')
      if (hwSelect) {
        const availableItems = (store.data.instockHardware || []).filter(i => (i.status || 'Available') === 'Available');
        if (availableItems.length === 0) {
          hwSelect.innerHTML = `<option value="" disabled selected>⚠️ No available hardware items currently in stock</option>`;
        } else {
          hwSelect.innerHTML = `<option value="">Select available hardware item (${availableItems.length} available)...</option>` +
            availableItems.map(item => `
              <option value="${item.id}" ${preselectedAssetId === item.id ? 'selected' : ''}>
                [${item.component_type}] ${item.spec} — S/N: ${item.serial_number} (${item.id})
              </option>
            `).join('');
        }
      }

      if (userInput) userInput.value = '';
      if (dateInput) dateInput.value = new Date().toISOString().substring(0, 10);
      if (purposeSelect) purposeSelect.value = 'Development work';
      if (purposeCustom) purposeCustom.value = '';

      const adminLabel = document.getElementById('assignLoggedAdminLabel');
      if (adminLabel) adminLabel.textContent = 'Sundar Pichai (SysAdmin)';

      const timeLabel = document.getElementById('assignTimestampLabel');
      if (timeLabel) timeLabel.textContent = new Date().toLocaleString();

      this.openModal('modalAssignAsset');
    }

    autoSelectUserTl(userName) {
      if (!userName) return;
      const cleanName = userName.trim().toLowerCase();
      const existingAlloc = (store.data.instockAllocations || []).find(a => (a.user_name || '').toLowerCase() === cleanName);
      const existingUser = (store.data.users || []).find(u => (u.name || '').toLowerCase() === cleanName);

      const targetTl = existingAlloc?.tl_name || existingUser?.teamLead || 'Sundar Pichai';
      const tlSelect = document.getElementById('assignAssetTl');
      if (tlSelect && targetTl) {
        let found = false;
        for (let opt of (tlSelect.options || [])) {
          if ((opt.value || '').toLowerCase() === targetTl.toLowerCase()) {
            opt.selected = true;
            found = true;
            break;
          }
        }
        if (!found && typeof Option !== 'undefined') {
          const newOpt = new Option(targetTl, targetTl, true, true);
          tlSelect.add(newOpt);
        }
      }
    }

    handlePurposeChange() {
      const select = document.getElementById('assignAssetPurposeSelect');
      const customInput = document.getElementById('assignAssetPurposeCustom');
      if (select && select.value === 'Custom Purpose') {
        customInput?.focus();
      }
    }

    async handleAssignAssetSubmit(event) {
      if (event && event.preventDefault) event.preventDefault();

      const userName = document.getElementById('assignAssetUser')?.value?.trim();
      const tlName = document.getElementById('assignAssetTl')?.value;
      const assetId = document.getElementById('assignAssetHardware')?.value;
      const assignedDate = document.getElementById('assignAssetDate')?.value;
      const purposeSelect = document.getElementById('assignAssetPurposeSelect')?.value;
      const purposeCustom = document.getElementById('assignAssetPurposeCustom')?.value?.trim();

      // Validation
      if (!userName) {
        Utils.showToast('Validation Error', 'Please specify a User Name for allocation.', 'error');
        return;
      }
      if (!tlName) {
        Utils.showToast('Validation Error', 'Please select a Team Lead (TL).', 'error');
        return;
      }
      if (!assetId) {
        Utils.showToast('Validation Error', 'Please select an Available hardware item.', 'error');
        return;
      }
      if (!assignedDate) {
        Utils.showToast('Validation Error', 'Please select the assignment date.', 'error');
        return;
      }

      // Check asset is still available
      const hwItem = (store.data.instockHardware || []).find(i => i.id === assetId);
      if (!hwItem || hwItem.status === 'Assigned') {
        Utils.showToast('Asset Unavailable', 'The selected asset is already allocated or unavailable.', 'error');
        return;
      }

      // Extract existing user team if available
      const existingUser = (store.data.users || []).find(u => (u.name || '').toLowerCase() === userName.toLowerCase());
      const team = hwItem.team || existingUser?.team || 'Staff';

      let finalPurpose = purposeSelect;
      if (purposeSelect === 'Custom Purpose') {
        finalPurpose = purposeCustom || 'Custom Purpose';
      } else if (purposeCustom) {
        finalPurpose = `${purposeSelect} (${purposeCustom})`;
      }

      const payload = {
        asset_id: assetId,
        user_name: userName,
        team,
        tl_name: tlName,
        component_type: hwItem.component_type || 'OTHER',
        spec: hwItem.spec || '',
        serial_number: hwItem.serial_number || '',
        assigned_date: assignedDate,
        purpose: finalPurpose,
        status: 'Assigned',
        assigned_by: 'Sundar Pichai (SysAdmin)',
        remark: ''
      };

      try {
        const res = await fetch('/api/instock/allocations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          const newAlloc = await res.json();
          if (!store.data.instockAllocations) store.data.instockAllocations = [];
          store.data.instockAllocations.unshift(newAlloc);

          hwItem.status = 'Assigned';
          hwItem.assigned_user = userName;
          hwItem.assigned_date = assignedDate;
          hwItem.team = team;
          hwItem.tl = tlName;
          store.save();

          Utils.showToast('Asset Assigned', `Successfully assigned ${hwItem.spec} to ${userName}.`, 'success');
        } else {
          const err = await res.json();
          throw new Error(err.error || 'Server rejected allocation');
        }
      } catch (err) {
        console.warn('API error, falling back to local state:', err);
        const newAllocId = `ALC-${Math.floor(1000 + Math.random() * 9000)}`;
        const localAlloc = {
          id: newAllocId,
          ...payload,
          return_date: null,
          created_at: new Date().toISOString()
        };
        if (!store.data.instockAllocations) store.data.instockAllocations = [];
        store.data.instockAllocations.unshift(localAlloc);

        hwItem.status = 'Assigned';
        hwItem.assigned_user = userName;
        hwItem.assigned_date = assignedDate;
        hwItem.team = team;
        hwItem.tl = tlName;
        store.save();

        Utils.showToast('Asset Assigned', `Assigned ${hwItem.spec} to ${userName}.`, 'success');
      }

      this.closeModal('modalAssignAsset');
      this.renderInstockDashboard();
      this.renderAssignedItemsTable();
    }

    // ========================================================================
    // RETURN ASSET FUNCTIONALITY (PRESERVES HISTORY)
    // ========================================================================
    openReturnAssetModal(allocId) {
      const alloc = (store.data.instockAllocations || []).find(a => a.id === allocId);
      if (!alloc) {
        Utils.showToast('Error', 'Allocation record not found.', 'error');
        return;
      }

      document.getElementById('returnAllocId').value = alloc.id;
      document.getElementById('returnAllocUser').textContent = alloc.user_name || '—';
      document.getElementById('returnAllocIdLabel').textContent = alloc.id;
      document.getElementById('returnAllocSpec').textContent = alloc.spec || '—';
      document.getElementById('returnAllocSerial').textContent = alloc.serial_number || '—';
      document.getElementById('returnAssetDate').value = new Date().toISOString().substring(0, 10);
      document.getElementById('returnHardwareNextStatus').value = 'Available';
      document.getElementById('returnAssetRemark').value = '';

      this.openModal('modalReturnAsset');
    }

    async handleReturnAssetSubmit(event) {
      if (event && event.preventDefault) event.preventDefault();

      const allocId = document.getElementById('returnAllocId')?.value;
      const returnDate = document.getElementById('returnAssetDate')?.value;
      const nextStatus = document.getElementById('returnHardwareNextStatus')?.value || 'Available';
      const returnRemark = document.getElementById('returnAssetRemark')?.value?.trim() || '';

      if (!allocId || !returnDate) {
        Utils.showToast('Validation Error', 'Return Date is required.', 'error');
        return;
      }

      const alloc = (store.data.instockAllocations || []).find(a => a.id === allocId);

      try {
        const res = await fetch(`/api/instock/allocations/${encodeURIComponent(allocId)}/return`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            return_date: returnDate,
            return_remark: returnRemark,
            hardware_status: nextStatus
          })
        });

        if (res.ok) {
          const updatedAlloc = await res.json();
          if (alloc) {
            Object.assign(alloc, updatedAlloc);
          }
          if (alloc && alloc.asset_id) {
            const hw = (store.data.instockHardware || []).find(i => i.id === alloc.asset_id);
            if (hw) {
              hw.status = nextStatus;
              hw.assigned_user = '';
              hw.assigned_date = '';
              hw.tl = '';
            }
          }
          store.save();
          Utils.showToast('Asset Returned', `Asset returned successfully and status updated to ${nextStatus}.`, 'success');
        } else {
          throw new Error('Return endpoint failed');
        }
      } catch (e) {
        console.warn('Fallback local return handling:', e);
        if (alloc) {
          alloc.status = 'Returned';
          alloc.return_date = returnDate;
          if (returnRemark) alloc.remark = `${alloc.remark ? alloc.remark + ' | ' : ''}Return: ${returnRemark}`;
          const hw = (store.data.instockHardware || []).find(i => i.id === alloc.asset_id);
          if (hw) {
            hw.status = nextStatus;
            hw.assigned_user = '';
            hw.assigned_date = '';
            hw.tl = '';
          }
          store.save();
        }
        Utils.showToast('Asset Returned', 'Return recorded in history.', 'info');
      }

      this.closeModal('modalReturnAsset');
      this.renderInstockDashboard();
      this.renderAssignedItemsTable();
    }

    handleQuickReturn(hardwareId) {
      const activeAlloc = (store.data.instockAllocations || []).find(a => a.asset_id === hardwareId && a.status === 'Assigned');
      if (activeAlloc) {
        this.openReturnAssetModal(activeAlloc.id);
      } else {
        this.toggleInstockStatus(hardwareId);
      }
    }

    // ========================================================================
    // USER-WISE ASSET TRACKING VIEW (REQUIREMENT 5 - MAIN REQUIREMENT)
    // ========================================================================
    openUserAssetHistoryModal(userName) {
      if (!userName) return;
      this.activeHistoryUser = userName;

      const allocations = this.getInstockAllocations();
      const userAllocs = allocations.filter(a => (a.user_name || '').toLowerCase() === userName.toLowerCase());

      const activeCount = userAllocs.filter(a => a.status === 'Assigned').length;
      const totalCount = userAllocs.length;
      const latestTl = userAllocs[0]?.tl_name || 'Sundar Pichai';

      const nameEl = document.getElementById('userHistoryName');
      const avatarEl = document.getElementById('userHistoryAvatar');
      const tlEl = document.getElementById('userHistoryTl');
      const activeEl = document.getElementById('userHistoryActiveCount');
      const totalEl = document.getElementById('userHistoryTotalCount');

      if (nameEl) nameEl.textContent = userName;
      if (avatarEl) avatarEl.textContent = userName.substring(0, 2).toUpperCase();
      if (tlEl) tlEl.textContent = latestTl;
      if (activeEl) activeEl.textContent = `${activeCount} Assets Active`;
      if (totalEl) totalEl.textContent = `${totalCount} Total Allocations`;

      const tbody = document.getElementById('userHistoryTableBody');
      if (tbody) {
        if (userAllocs.length === 0) {
          tbody.innerHTML = `
            <tr>
              <td colspan="8" style="text-align:center; padding:28px; color:#64748b;">
                No historical allocation records found for <strong>${Utils.escapeHtml(userName)}</strong>.
              </td>
            </tr>
          `;
        } else {
          const iconMap = {
            'CPU': '💻',
            'SSD': '⚡',
            'RAM': '🧠',
            'SMPS': '🔌',
            'MONITOR': '🖥️',
            'OTHER': '🧰'
          };

          tbody.innerHTML = userAllocs.map(alloc => {
            const type = (alloc.component_type || 'OTHER').toUpperCase();
            const icon = iconMap[type] || '📦';
            const isAssigned = (alloc.status === 'Assigned');
            const statusBadge = isAssigned
              ? `<span class="instock-badge instock-badge-assigned">👤 Assigned</span>`
              : `<span class="instock-badge instock-badge-returned">↩️ Returned</span>`;

            const returnDisplay = alloc.return_date
              ? `<span style="font-weight:600; color:#475569; font-size:0.82rem;">${Utils.escapeHtml(alloc.return_date)}</span>`
              : `<span class="badge" style="background:#dcfce7; color:#15803d; font-size:0.75rem; font-weight:700;">🟢 Active (In Use)</span>`;

            return `
              <tr style="border-bottom:1px solid #f1f5f9;">
                <td>
                  <span class="badge" style="background:rgba(37,99,235,0.08); color:var(--primary); font-weight:700; font-size:0.75rem; padding:4px 8px; border-radius:6px; display:inline-flex; align-items:center; gap:4px;">
                    <span>${icon}</span> <span>${type}</span>
                  </span>
                </td>
                <td>
                  <strong style="color:#0f172a; font-size:0.86rem;">${Utils.escapeHtml(alloc.spec || '—')}</strong>
                </td>
                <td>
                  <code style="background:#f8fafc; border:1px solid #e2e8f0; padding:2px 6px; border-radius:4px; font-size:0.78rem; color:#334155;">
                    ${Utils.escapeHtml(alloc.serial_number || '—')}
                  </code>
                </td>
                <td style="font-size:0.82rem; font-weight:600; color:#1e293b;">
                  ${Utils.escapeHtml(alloc.assigned_date || '—')}
                </td>
                <td>${returnDisplay}</td>
                <td>
                  <span style="font-size:0.82rem; color:#334155; background:#f8fafc; border:1px solid #e2e8f0; padding:3px 8px; border-radius:6px; display:inline-block;">
                    ${Utils.escapeHtml(alloc.purpose || 'Office use')}
                  </span>
                </td>
                <td>${statusBadge}</td>
                <td style="text-align:center;">
                  ${isAssigned ? `
                    <button type="button" class="btn btn-sm btn-secondary" onclick="window.ITApp.closeModal('modalUserAssetHistory'); window.ITApp.openReturnAssetModal('${alloc.id}')" title="Return this asset" style="padding:3px 8px; border-radius:6px; font-size:0.75rem; font-weight:700; color:#ea580c;">
                      ↩️ Return
                    </button>
                  ` : `
                    <span style="font-size:0.75rem; color:#94a3b8;">Archived</span>
                  `}
                </td>
              </tr>
            `;
          }).join('');
        }
      }

      this.openModal('modalUserAssetHistory');
    }

    openAssignAssetForUser() {
      const user = this.activeHistoryUser;
      this.closeModal('modalUserAssetHistory');
      this.openAssignAssetModal();
      const userInput = document.getElementById('assignAssetUser');
      if (userInput && user) {
        userInput.value = user;
        this.autoSelectUserTl(user);
      }
    }

    // ========================================================================
    // EDIT ALLOCATION MODAL (UPGRADED WITH ALL FIELDS)
    // ========================================================================
    openEditAllocationModal(allocId) {
      const alloc = (store.data.instockAllocations || []).find(a => a.id === allocId);
      if (!alloc) return;

      document.getElementById('editAllocId').value = alloc.id;
      const specDisplay = document.getElementById('editAllocSpecDisplay');
      if (specDisplay) specDisplay.textContent = alloc.spec || '—';
      const assetIdDisplay = document.getElementById('editAllocAssetIdDisplay');
      if (assetIdDisplay) assetIdDisplay.textContent = alloc.asset_id || alloc.id;

      const userEl = document.getElementById('editAllocUser');
      if (userEl) userEl.value = alloc.user_name || '';

      const teamEl = document.getElementById('editAllocTeam');
      if (teamEl) teamEl.value = alloc.team || '';

      const tlEl = document.getElementById('editAllocTl');
      if (tlEl) tlEl.value = alloc.tl_name || '';

      const statusEl = document.getElementById('editAllocStatus');
      if (statusEl) statusEl.value = alloc.status || 'Assigned';

      const exitDateEl = document.getElementById('editAllocExitDate');
      if (exitDateEl) exitDateEl.value = alloc.user_exit_date || '';

      const reasonEl = document.getElementById('editAllocReason');
      if (reasonEl) reasonEl.value = alloc.changing_reason || '';

      const purposeEl = document.getElementById('editAllocPurpose');
      if (purposeEl) purposeEl.value = alloc.purpose || '';

      const remarkEl = document.getElementById('editAllocRemark');
      if (remarkEl) remarkEl.value = alloc.remark || '';

      this.openModal('modalEditAllocation');
    }

    async handleEditAllocationSubmit(event) {
      if (event && event.preventDefault) event.preventDefault();

      const allocId = document.getElementById('editAllocId')?.value;
      const userName = document.getElementById('editAllocUser')?.value?.trim();
      const team = document.getElementById('editAllocTeam')?.value?.trim();
      const tlName = document.getElementById('editAllocTl')?.value?.trim();
      const status = document.getElementById('editAllocStatus')?.value || 'Assigned';
      const userExitDate = document.getElementById('editAllocExitDate')?.value || '';
      const changingReason = document.getElementById('editAllocReason')?.value?.trim() || '';
      const purpose = document.getElementById('editAllocPurpose')?.value?.trim() || '';
      const remark = document.getElementById('editAllocRemark')?.value?.trim() || '';

      if (!userName) {
        Utils.showToast('Validation Error', 'Assigned employee name is required.', 'error');
        return;
      }

      const alloc = (store.data.instockAllocations || []).find(a => a.id === allocId);
      if (!alloc) return;

      const updates = {
        user_name: userName,
        team,
        tl_name: tlName,
        status,
        user_exit_date: userExitDate,
        changing_reason: changingReason,
        purpose,
        remark
      };

      try {
        const res = await fetch(`/api/instock/allocations/${encodeURIComponent(allocId)}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates)
        });
        if (res.ok) {
          const updated = await res.json();
          Object.assign(alloc, updated);
        } else {
          Object.assign(alloc, updates);
        }
      } catch (e) {
        Object.assign(alloc, updates);
      }

      // Sync user and team with physical hardware item
      if (alloc.asset_id) {
        const hw = (store.data.instockHardware || []).find(i => i.id === alloc.asset_id);
        if (hw) {
          if (status === 'Assigned') {
            hw.status = 'Assigned';
            hw.assigned_user = userName;
            hw.team = team;
            hw.tl = tlName;
          } else if (status === 'Returned') {
            hw.status = 'Available';
            hw.assigned_user = '';
            hw.team = '';
            hw.tl = '';
          }
        }
      }

      store.save();
      Utils.showToast('Updated', `Assignment record ${allocId} updated successfully.`, 'success');

      this.closeModal('modalEditAllocation');
      this.renderAssignedItemsTable();
      this.renderInstockDashboard();
    }

    // Maintenance helper methods
    async setHardwareMaintenance(id) {
      const item = (store.data.instockHardware || []).find(i => i.id === id);
      if (!item) return;

      item.status = 'Under Maintenance';
      try {
        await fetch(`/api/instock/${encodeURIComponent(id)}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'Under Maintenance' })
        });
      } catch (e) {}
      store.save();
      Utils.showToast('Maintenance', `${item.id} sent for maintenance.`, 'info');
      this.renderInstockDashboard();
    }

    async markHardwareAvailable(id) {
      const item = (store.data.instockHardware || []).find(i => i.id === id);
      if (!item) return;

      item.status = 'Available';
      try {
        await fetch(`/api/instock/${encodeURIComponent(id)}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'Available' })
        });
      } catch (e) {}
      store.save();
      Utils.showToast('Restored', `${item.id} restored to Available stock.`, 'success');
      this.renderInstockDashboard();
    }

    // ========================================================================
    // HARDWARE STOCK ENTRY (CREATION OF RAW INVENTORY)
    // ========================================================================
    openInstockEntryModal(defaultType = null, editId = null) {
      const modal = document.getElementById('modalInstockEntry');
      if (!modal) return;

      const editIdInput = document.getElementById('instockEditId');
      const assetIdInput = document.getElementById('instockAssetId');
      const titleEl = document.getElementById('instockModalTitle');
      const typeSelect = document.getElementById('instockComponentType');
      const specInput = document.getElementById('instockSpec');
      const serialInput = document.getElementById('instockSerial');
      const purchaseDateInput = document.getElementById('instockPurchaseDate');
      const radioPending = document.getElementById('instockStatusPending');
      const radioAssigned = document.getElementById('instockStatusAssigned');
      const userInput = document.getElementById('instockAssignedUser');
      const assignedDateInput = document.getElementById('instockAssignedDate');
      const teamSelect = document.getElementById('instockAssignedTeam');
      const tlInput = document.getElementById('instockAssignedTl');
      const remarkInput = document.getElementById('instockRemark');

      // Populate User Datalist
      const userDatalist = document.getElementById('instockAllUsersDatalist');
      if (userDatalist) {
        userDatalist.innerHTML = (store.data.users || []).map(u => `<option value="${Utils.escapeHtml(u.name)}">${Utils.escapeHtml(u.name)} (${Utils.escapeHtml(u.team || 'Staff')})</option>`).join('');
      }

      if (editId) {
        const item = (store.data.instockHardware || []).find(i => i.id === editId);
        if (item) {
          if (editIdInput) editIdInput.value = item.id;
          if (assetIdInput) {
            assetIdInput.value = item.id;
            assetIdInput.disabled = true;
          }
          if (titleEl) titleEl.textContent = `Edit Hardware Entry (${item.id})`;
          if (typeSelect) typeSelect.value = item.component_type || 'CPU';
          if (specInput) specInput.value = item.spec || '';
          if (serialInput) serialInput.value = item.serial_number || '';
          if (purchaseDateInput) purchaseDateInput.value = item.purchase_date || '';
          if (item.status === 'Assigned') {
            if (radioAssigned) radioAssigned.checked = true;
          } else {
            if (radioPending) radioPending.checked = true;
          }
          if (userInput) userInput.value = item.assigned_user || '';
          if (assignedDateInput) assignedDateInput.value = item.assigned_date || '';
          if (teamSelect && item.team) teamSelect.value = item.team;
          if (tlInput) tlInput.value = item.tl || '';
          if (remarkInput) remarkInput.value = item.remark || '';
        }
      } else {
        if (editIdInput) editIdInput.value = '';
        if (assetIdInput) {
          assetIdInput.value = '';
          assetIdInput.disabled = false;
        }
        if (titleEl) titleEl.textContent = 'Add Hardware Item to In-Stock Inventory';
        if (typeSelect && defaultType) typeSelect.value = defaultType.toUpperCase();
        if (specInput) specInput.value = '';
        if (serialInput) serialInput.value = `SN-${defaultType ? defaultType.toUpperCase() : 'HW'}-${Math.floor(10000 + Math.random() * 90000)}`;
        if (purchaseDateInput) purchaseDateInput.value = new Date().toISOString().substring(0, 10);
        if (radioPending) radioPending.checked = true;
        if (userInput) userInput.value = '';
        if (assignedDateInput) assignedDateInput.value = new Date().toISOString().substring(0, 10);
        if (tlInput) tlInput.value = '';
        if (remarkInput) remarkInput.value = '';
      }

      this.toggleInstockAssignmentFields();
      this.openModal('modalInstockEntry');
    }

    toggleInstockAssignmentFields() {
      const radioAssigned = document.getElementById('instockStatusAssigned');
      const section = document.getElementById('instockAssignedFieldsSection');
      const helpText = document.getElementById('instockPendingHelpText');
      const isAssigned = radioAssigned && radioAssigned.checked;

      if (section) section.style.display = isAssigned ? 'flex' : 'none';
      if (helpText) helpText.style.display = isAssigned ? 'none' : 'block';
    }

    async handleInstockFormSubmit(event) {
      if (event && event.preventDefault) event.preventDefault();

      const editId = document.getElementById('instockEditId')?.value;
      const customAssetId = document.getElementById('instockAssetId')?.value?.trim();
      const component_type = document.getElementById('instockComponentType')?.value || 'OTHER';
      const spec = document.getElementById('instockSpec')?.value?.trim() || '';
      const serial_number = document.getElementById('instockSerial')?.value?.trim() || '';
      const purchase_date = document.getElementById('instockPurchaseDate')?.value || '';
      const isAssigned = document.getElementById('instockStatusAssigned')?.checked;
      const status = isAssigned ? 'Assigned' : 'Available';
      const assigned_user = isAssigned ? (document.getElementById('instockAssignedUser')?.value?.trim() || '') : '';
      const assigned_date = isAssigned ? (document.getElementById('instockAssignedDate')?.value || '') : '';
      const team = isAssigned ? (document.getElementById('instockAssignedTeam')?.value || '') : '';
      const tl = isAssigned ? (document.getElementById('instockAssignedTl')?.value?.trim() || '') : '';
      const remark = document.getElementById('instockRemark')?.value?.trim() || '';

      // Required field validation
      if (!spec) {
        Utils.showToast('Validation Error', 'Hardware Specification / Model is required.', 'error');
        return;
      }
      if (!serial_number) {
        Utils.showToast('Validation Error', 'Serial Number is required.', 'error');
        return;
      }
      if (!purchase_date) {
        Utils.showToast('Validation Error', 'Purchasing Date is required.', 'error');
        return;
      }

      const allItems = store.data.instockHardware || [];

      // Validate duplicate Asset ID when creating new
      if (!editId && customAssetId) {
        const dupId = allItems.find(i => i.id.toLowerCase() === customAssetId.toLowerCase());
        if (dupId) {
          Utils.showToast('Duplicate Asset ID', `Asset ID "${customAssetId}" already exists in stock. Please specify a unique ID.`, 'error');
          return;
        }
      }

      // Validate duplicate Serial Number (excluding currently editing item)
      const dupSerial = allItems.find(i =>
        i.serial_number &&
        i.serial_number.toLowerCase() === serial_number.toLowerCase() &&
        i.id !== editId
      );
      if (dupSerial) {
        Utils.showToast('Duplicate Serial Number', `Serial Number "${serial_number}" is already registered on asset ${dupSerial.id}. Serial numbers must be unique.`, 'error');
        return;
      }

      const payload = {
        component_type,
        spec,
        serial_number,
        purchase_date,
        status,
        assigned_user,
        assigned_date,
        team,
        tl,
        remark
      };

      if (!editId && customAssetId) {
        payload.id = customAssetId;
      }

      try {
        if (editId) {
          const res = await fetch(`/api/instock/${encodeURIComponent(editId)}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          if (res.ok) {
            const updated = await res.json();
            const idx = (store.data.instockHardware || []).findIndex(i => i.id === editId);
            if (idx !== -1) {
              store.data.instockHardware[idx] = updated;
            }
            store.save();
            Utils.showToast('Record Updated', `Hardware item ${editId} updated successfully.`, 'success');
          }
        } else {
          const res = await fetch('/api/instock', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          if (res.ok) {
            const saved = await res.json();
            if (!store.data.instockHardware) store.data.instockHardware = [];
            store.data.instockHardware.unshift(saved);
            store.save();
            Utils.showToast('Hardware Added', `${component_type} (${spec}) added to stock!`, 'success');
          }
        }
      } catch (err) {
        console.error('Failed to sync instock hardware with server:', err);
        if (editId) {
          const item = (store.data.instockHardware || []).find(i => i.id === editId);
          if (item) Object.assign(item, payload);
        } else {
          const newId = customAssetId || `STK-${component_type}-${Math.floor(100 + Math.random() * 900)}`;
          const newRecord = {
            id: newId,
            ...payload,
            created_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
          };
          if (!store.data.instockHardware) store.data.instockHardware = [];
          store.data.instockHardware.unshift(newRecord);
        }
        store.save();
        Utils.showToast('Saved Locally', 'Hardware saved to store.', 'info');
      }

      this.closeModal('modalInstockEntry');
      this.renderInstockDashboard();
      this.renderAssignedItemsTable();
    }

    async toggleInstockStatus(id) {
      const item = (store.data.instockHardware || []).find(i => i.id === id);
      if (!item) return;

      if (item.status === 'Assigned') {
        this.handleQuickReturn(id);
      } else {
        this.openAssignAssetModal(id);
      }
    }

    async deleteInstockEntry(id) {
      if (confirm(`Permanently delete hardware stock entry ${id}?`)) {
        try {
          await fetch(`/api/instock/${encodeURIComponent(id)}`, { method: 'DELETE' });
        } catch (e) {}
        store.data.instockHardware = (store.data.instockHardware || []).filter(i => i.id !== id);
        store.save();
        Utils.showToast('Deleted', `Hardware record ${id} removed.`, 'warning');
        this.renderInstockDashboard();
        this.renderAssignedItemsTable();
      }
    }

    /* ==========================================================================
       EMPLOYEE ASSET HISTORY & PERSONNEL CUSTODY TRACKER
       ========================================================================== */
    getEmployeeDirectoryList() {
      const assets = store.data.assets || [];
      const users = store.data.users || [];
      const history = store.data.assignmentHistory || [];
      const allocations = (typeof this.getInstockAllocations === 'function' ? this.getInstockAllocations() : null) || store.data.instockAllocations || [];

      const empMap = new Map();

      // Helper to add or retrieve employee
      const getOrCreate = (name, defaultTeam = 'SYSTEM ADMIN', empId = null) => {
        if (!name || name.trim() === '' || name.toLowerCase() === 'unassigned' || name.toLowerCase() === 'none') return null;
        const key = name.trim().toLowerCase();
        if (!empMap.has(key)) {
          empMap.set(key, {
            name: name.trim(),
            id: empId || 'EMP-' + Math.abs(key.split('').reduce((acc, char) => (acc << 5) - acc + char.charCodeAt(0), 0) % 9000 + 1000),
            team: defaultTeam,
            status: 'Currently Working',
            workStatus: 'Currently Working',
            activeAssets: [],
            historicalAssets: [],
            peripherals: []
          });
        }
        return empMap.get(key);
      };

      // 1. Register users from store
      users.forEach(u => {
        const emp = getOrCreate(u.name, u.team, u.id);
        if (emp && u.status) {
          emp.status = u.status;
          emp.workStatus = u.status;
        }
      });

      // 2. Register from active assets
      assets.forEach(a => {
        if (a.user) {
          const emp = getOrCreate(a.user, a.team || 'SYSTEM ADMIN');
          if (emp) {
            if (a.status === 'Assigned') {
              emp.activeAssets.push(a);
            } else {
              emp.historicalAssets.push({
                assetId: a.id,
                type: a.type,
                date: a.assignedDate || 'Historical',
                status: a.status,
                action: 'Previous Custody'
              });
            }
            if (a.workStatus && (a.workStatus.toLowerCase().includes('exit') || a.workStatus.toLowerCase().includes('resigned'))) {
              emp.status = 'Exit User';
              emp.workStatus = 'Exit User';
            }
          }
        }
      });

      // 3. Register from assignment history
      history.forEach(h => {
        if (h.newUser && h.newUser !== 'Stock (Unassigned)') {
          const emp = getOrCreate(h.newUser, h.team || 'SYSTEM ADMIN', h.employeeId);
          if (emp) {
            emp.historicalAssets.push({
              assetId: h.assetId,
              type: h.assetType,
              date: h.date,
              action: h.action || 'Assigned'
            });
          }
        }
        if (h.previousUser && h.previousUser !== 'Stock (Unassigned)') {
          const emp = getOrCreate(h.previousUser, h.team || 'SYSTEM ADMIN');
          if (emp) {
            emp.historicalAssets.push({
              assetId: h.assetId,
              type: h.assetType,
              date: h.date,
              action: 'Transferred / Returned'
            });
          }
        }
      });

      // 4. Register hardware allocations
      allocations.forEach(al => {
        if (al.user_name) {
          const emp = getOrCreate(al.user_name, al.team || 'SYSTEM ADMIN');
          if (emp) {
            emp.peripherals.push(al);
          }
        }
      });

      return Array.from(empMap.values()).sort((a, b) => a.name.localeCompare(b.name));
    }

    renderEmployeeAssetHistory() {
      const listContainer = document.getElementById('empHistoryListContainer');
      const detailContainer = document.getElementById('empHistoryDetailContainer');
      const countPill = document.getElementById('empHistoryCountPill');
      const summaryText = document.getElementById('empHistoryListSummary');
      const resetBtn = document.getElementById('empHistoryResetBtn');
      if (!listContainer || !detailContainer) return;

      const allEmps = this.getEmployeeDirectoryList();

      const search = (document.getElementById('empHistorySearchInput')?.value || '').toLowerCase().trim();
      const dept = document.getElementById('empHistoryDeptFilter')?.value || 'all';
      const status = document.getElementById('empHistoryStatusFilter')?.value || 'all';
      const custody = document.getElementById('empHistoryCustodyFilter')?.value || 'all';

      // Check active filters for reset button
      const hasFilters = search !== '' || dept !== 'all' || status !== 'all' || custody !== 'all';
      if (resetBtn) resetBtn.style.display = hasFilters ? 'inline-flex' : 'none';

      // Apply filtering
      const filtered = allEmps.filter(e => {
        if (search) {
          const matchSearch = e.name.toLowerCase().includes(search) ||
                              e.id.toLowerCase().includes(search) ||
                              e.team.toLowerCase().includes(search);
          if (!matchSearch) return false;
        }
        if (dept !== 'all' && e.team.toLowerCase() !== dept.toLowerCase()) {
          return false;
        }
        if (status !== 'all') {
          if (status === 'Exit User' && !e.status.toLowerCase().includes('exit')) return false;
          if (status === 'Currently Working' && e.status.toLowerCase().includes('exit')) return false;
        }
        if (custody !== 'all') {
          if (custody === 'has_current' && e.activeAssets.length === 0) return false;
          if (custody === 'has_history' && (e.activeAssets.length > 0 || (e.historicalAssets.length === 0 && e.peripherals.length === 0))) return false;
          if (custody === 'unassigned' && e.activeAssets.length > 0) return false;
        }
        return true;
      });

      if (countPill) countPill.textContent = `${filtered.length} Employee${filtered.length === 1 ? '' : 's'}`;
      if (summaryText) summaryText.textContent = `Showing ${filtered.length} of ${allEmps.length}`;

      if (filtered.length === 0) {
        listContainer.innerHTML = '<div style="padding:24px 16px; text-align:center; color:#64748b; font-size:0.85rem;">No employees match the filter criteria.</div>';
        detailContainer.innerHTML = '<div style="padding:48px 24px; text-align:center; color:#64748b;"><div style="font-size:2rem; margin-bottom:8px;">👥</div><h4>No Employee Selected</h4><p style="font-size:0.85rem;">Adjust search filters or clear filters to view personnel custody details.</p></div>';
        return;
      }

      // Default selection
      if (!this.selectedEmpHistoryId || !filtered.some(e => e.id === this.selectedEmpHistoryId)) {
        this.selectedEmpHistoryId = filtered[0].id;
      }

      listContainer.innerHTML = filtered.map(e => {
        const isActive = e.id === this.selectedEmpHistoryId;
        const isExit = e.status.toLowerCase().includes('exit');
        const activeCount = e.activeAssets.length;
        const periCount = e.peripherals.filter(p => p.status === 'Assigned' || p.status === 'Active').length;

        return `
          <div class="history-item-card ${isActive ? 'is-active' : ''}" onclick="window.ITApp.selectEmployeeHistory('${Utils.escapeHtml(e.id)}')" style="cursor:pointer;">
            <div style="display:flex; align-items:center; justify-content:space-between;">
              <strong style="font-size:0.88rem; color:#0f172a;">${Utils.escapeHtml(e.name)}</strong>
              <span class="badge" style="font-size:0.7rem; font-weight:700; background:${isExit ? '#fee2e2' : '#ecfdf5'}; color:${isExit ? '#dc2626' : '#16a34a'}; border:1px solid ${isExit ? '#fecaca' : '#bbf7d0'};">
                ${isExit ? 'Exit User' : 'Active'}
              </span>
            </div>
            <div style="display:flex; align-items:center; justify-content:space-between; font-size:0.78rem; color:#64748b;">
              <span>${Utils.escapeHtml(e.team)} • ${Utils.escapeHtml(e.id)}</span>
              <span style="font-weight:600; color:${activeCount > 0 ? '#2563eb' : '#94a3b8'};">
                ${activeCount > 0 ? '💻 ' + activeCount + ' System' : (periCount > 0 ? '📦 ' + periCount + ' Parts' : 'Unassigned')}
              </span>
            </div>
          </div>
        `;
      }).join('');

      const selectedEmp = filtered.find(e => e.id === this.selectedEmpHistoryId) || filtered[0];
      this.renderEmployeeHistoryDetail(selectedEmp);
    }

    selectEmployeeHistory(empId) {
      this.selectedEmpHistoryId = empId;
      this.renderEmployeeAssetHistory();
    }

    handleEmpHistoryFilterChange() {
      this.renderEmployeeAssetHistory();
    }

    resetEmpHistoryFilters() {
      const s = document.getElementById('empHistorySearchInput');
      const d = document.getElementById('empHistoryDeptFilter');
      const st = document.getElementById('empHistoryStatusFilter');
      const c = document.getElementById('empHistoryCustodyFilter');
      if (s) s.value = '';
      if (d) d.value = 'all';
      if (st) st.value = 'all';
      if (c) c.value = 'all';
      this.renderEmployeeAssetHistory();
    }

    renderEmployeeHistoryDetail(emp) {
      const container = document.getElementById('empHistoryDetailContainer');
      if (!container || !emp) return;

      const isExit = emp.status.toLowerCase().includes('exit');
      const initials = emp.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();

      let activeAssetsHtml = '';
      if (emp.activeAssets.length > 0) {
        activeAssetsHtml = emp.activeAssets.map(a => `
          <div class="custody-card-current" style="margin-bottom:12px;">
            <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;">
              <div style="display:flex; align-items:center; gap:8px;">
                <span style="font-size:1.2rem;">${a.type === 'Laptop' ? '💻' : '🖥️'}</span>
                <div>
                  <strong style="font-size:0.95rem; color:#0f172a;">${Utils.escapeHtml(a.id)}</strong>
                  <span style="font-size:0.75rem; color:#64748b; margin-left:6px;">(${Utils.escapeHtml(a.type)})</span>
                </div>
              </div>
              <span class="badge" style="background:#ecfdf5; color:#065f46; border:1px solid #a7f3d0; font-weight:700; font-size:0.75rem;">
                🟢 Active Workstation
              </span>
            </div>
            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(180px, 1fr)); gap:8px; font-size:0.8rem; background:#f8fafc; padding:10px; border-radius:6px; margin-top:6px;">
              <div><span style="color:#64748b;">CPU:</span> <strong>${Utils.escapeHtml(a.cpu || 'N/A')}</strong></div>
              <div><span style="color:#64748b;">RAM:</span> <strong>${Utils.escapeHtml(a.ram || 'N/A')}</strong></div>
              <div><span style="color:#64748b;">Storage:</span> <strong>${Utils.escapeHtml(a.ssd || a.hdd || 'N/A')}</strong></div>
              <div><span style="color:#64748b;">OS:</span> <strong>${Utils.escapeHtml(a.os || 'N/A')}</strong></div>
              <div><span style="color:#64748b;">Assigned Date:</span> <strong>${Utils.escapeHtml(a.assignedDate || 'N/A')}</strong></div>
              <div><span style="color:#64748b;">Location:</span> <strong>${Utils.escapeHtml(a.location || 'Office Bay')}</strong></div>
            </div>
          </div>
        `).join('');
      } else {
        activeAssetsHtml = `
          <div style="background:#f8fafc; border:1px dashed #cbd5e1; border-radius:8px; padding:16px; text-align:center; color:#64748b; font-size:0.84rem; margin-bottom:14px;">
            ℹ️ No primary workstation currently assigned (Unassigned / Floating Personnel)
          </div>
        `;
      }

      let peripheralsHtml = '';
      if (emp.peripherals && emp.peripherals.length > 0) {
        peripheralsHtml = `
          <div style="margin-top:16px; margin-bottom:14px;">
            <h4 style="font-size:0.92rem; font-weight:700; color:#0f172a; margin-bottom:10px; display:flex; align-items:center; gap:6px;">
              <span>📦</span> Assigned Hardware Peripherals & Components (${emp.peripherals.length})
            </h4>
            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:10px;">
              ${emp.peripherals.map(p => {
                const isRet = p.status === 'Returned';
                return `
                  <div style="border:1px solid #e2e8f0; border-radius:8px; padding:10px 12px; background:#fff;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                      <span style="font-weight:700; font-size:0.8rem; color:#2563eb;">${Utils.escapeHtml(p.component_type || 'Hardware')}</span>
                      <span class="badge" style="font-size:0.68rem; font-weight:700; background:${isRet ? '#f1f5f9' : '#ecfdf5'}; color:${isRet ? '#64748b' : '#16a34a'};">
                        ${isRet ? 'Returned' : 'Assigned'}
                      </span>
                    </div>
                    <div style="font-size:0.82rem; font-weight:600; color:#0f172a; margin-bottom:2px;">${Utils.escapeHtml(p.spec || 'Hardware Spec')}</div>
                    <div style="font-size:0.74rem; color:#64748b;">SN: ${Utils.escapeHtml(p.serial_number || 'N/A')} • Assigned: ${Utils.escapeHtml(p.assigned_date || 'N/A')}</div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        `;
      }

      let timelineHtml = '';
      const allEvents = [
        ...emp.activeAssets.map(a => ({
          date: a.assignedDate || 'Current',
          title: 'Primary Workstation Assigned: ' + a.id,
          detail: `${a.type} allocated to ${emp.name} in ${emp.team} (${a.location || 'Office Bay'}).`,
          type: 'current'
        })),
        ...(emp.historicalAssets || []).map(h => ({
          date: h.date || 'Previous',
          title: (h.action || 'Custody Event') + ': ' + h.assetId,
          detail: `Historical custody record for ${h.assetId} (${h.type || 'System'}).`,
          type: 'past'
        })),
        ...(emp.peripherals || []).map(p => ({
          date: p.assigned_date || 'Previous',
          title: 'Peripheral Allocation: ' + (p.component_type || 'Component'),
          detail: `${p.spec || 'Item'} (SN: ${p.serial_number || 'N/A'}) - Status: ${p.status || 'Assigned'}.`,
          type: p.status === 'Returned' ? 'past' : 'current'
        }))
      ].sort((a, b) => (b.date || '').localeCompare(a.date || ''));

      if (allEvents.length > 0) {
        timelineHtml = `
          <div style="margin-top:18px;">
            <h4 style="font-size:0.92rem; font-weight:700; color:#0f172a; margin-bottom:12px; display:flex; align-items:center; gap:6px;">
              <span>📜</span> Chronological Custody & Handover Trail
            </h4>
            <div class="timeline-v2">
              ${allEvents.map(ev => `
                <div class="timeline-v2-node">
                  <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:2px;">
                    <strong style="font-size:0.84rem; color:#0f172a;">${Utils.escapeHtml(ev.title)}</strong>
                    <span style="font-size:0.75rem; color:#64748b;">${Utils.escapeHtml(ev.date)}</span>
                  </div>
                  <div style="font-size:0.8rem; color:#475569;">${Utils.escapeHtml(ev.detail)}</div>
                </div>
              `).join('')}
            </div>
          </div>
        `;
      }

      container.innerHTML = `
        <!-- Employee Profile Header -->
        <div style="display:flex; align-items:center; justify-content:space-between; padding-bottom:16px; border-bottom:1px solid #e2e8f0; flex-wrap:wrap; gap:12px;">
          <div style="display:flex; align-items:center; gap:14px;">
            <div style="width:48px; height:48px; border-radius:12px; background:linear-gradient(135deg, #2563eb, #1d4ed8); color:#fff; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:1.15rem; box-shadow:0 4px 10px rgba(37,99,235,0.25);">
              ${initials}
            </div>
            <div>
              <div style="display:flex; align-items:center; gap:8px;">
                <h3 style="font-size:1.2rem; font-weight:800; color:#0f172a; margin:0;">${Utils.escapeHtml(emp.name)}</h3>
                <span class="badge" style="font-size:0.72rem; font-weight:700; background:${isExit ? '#fee2e2' : '#ecfdf5'}; color:${isExit ? '#dc2626' : '#16a34a'}; border:1px solid ${isExit ? '#fecaca' : '#bbf7d0'};">
                  ${isExit ? 'Exit User' : 'Currently Working'}
                </span>
              </div>
              <div style="font-size:0.82rem; color:#64748b; margin-top:2px;">
                Department: <strong style="color:#0f172a;">${Utils.escapeHtml(emp.team)}</strong> • ID: <span style="font-family:monospace; font-weight:600;">${Utils.escapeHtml(emp.id)}</span>
              </div>
            </div>
          </div>
          <div style="display:flex; gap:8px;">
            <button type="button" class="btn btn-sm btn-secondary" onclick="window.ITApp.openAssignAssetForUser('${Utils.escapeHtml(emp.name)}')" style="display:inline-flex; align-items:center; gap:4px; font-weight:600; border-radius:6px;">
              <span>+</span> Assign Asset
            </button>
          </div>
        </div>

        <!-- Active Workstation Card -->
        <div style="margin-top:16px;">
          <h4 style="font-size:0.92rem; font-weight:700; color:#0f172a; margin-bottom:10px; display:flex; align-items:center; gap:6px;">
            <span>💻</span> Current Assigned Workstation
          </h4>
          ${activeAssetsHtml}
        </div>

        <!-- Peripherals -->
        ${peripheralsHtml}

        <!-- Timeline -->
        ${timelineHtml}
      `;
    }

    exportEmployeeHistoryCSV() {
      const allEmps = this.getEmployeeDirectoryList();
      if (!allEmps || allEmps.length === 0) {
        Utils.showToast('Export Empty', 'No employee custody records to export.', 'warning');
        return;
      }
      const headers = ['Employee ID', 'Name', 'Department', 'Status', 'Active Workstations', 'Peripherals Count', 'Historical Assets Count'];
      const rows = allEmps.map(e => [
        `"${e.id}"`,
        `"${(e.name || '').replace(/"/g, '""')}"`,
        `"${(e.team || '').replace(/"/g, '""')}"`,
        `"${e.status || 'Active'}"`,
        `"${e.activeAssets.map(a => a.id).join('; ')}"`,
        `"${e.peripherals.length}"`,
        `"${e.historicalAssets.length}"`
      ]);
      const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `Pixel_ITAM_Employee_Asset_History_${new Date().toISOString().substring(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      Utils.showToast('CSV Exported', `Exported ${allEmps.length} employee history records.`, 'success');
    }

    /* ==========================================================================
       ASSET LIFECYCLE HISTORY & HARDWARE AUDIT TRAIL
       ========================================================================== */
    renderAssetLifecycleHistory() {
      const listContainer = document.getElementById('assetLifecycleListContainer');
      const detailContainer = document.getElementById('assetLifecycleDetailContainer');
      const countPill = document.getElementById('assetLifecycleCountPill');
      const summaryText = document.getElementById('assetLifecycleListSummary');
      const resetBtn = document.getElementById('assetLifecycleResetBtn');
      if (!listContainer || !detailContainer) return;

      const assets = store.data.assets || [];

      const search = (document.getElementById('assetLifecycleSearchInput')?.value || '').toLowerCase().trim();
      const type = document.getElementById('assetLifecycleTypeFilter')?.value || 'all';
      const status = document.getElementById('assetLifecycleStatusFilter')?.value || 'all';
      const dept = document.getElementById('assetLifecycleDeptFilter')?.value || 'all';

      const hasFilters = search !== '' || type !== 'all' || status !== 'all' || dept !== 'all';
      if (resetBtn) resetBtn.style.display = hasFilters ? 'inline-flex' : 'none';

      const filtered = assets.filter(a => {
        if (search) {
          const match = (a.id && a.id.toLowerCase().includes(search)) ||
                        (a.user && a.user.toLowerCase().includes(search)) ||
                        (a.serialNumber && a.serialNumber.toLowerCase().includes(search)) ||
                        (a.ipAddress && a.ipAddress.toLowerCase().includes(search));
          if (!match) return false;
        }
        if (type !== 'all' && a.type && a.type.toLowerCase() !== type.toLowerCase()) return false;
        if (status !== 'all' && a.status && a.status.toLowerCase() !== status.toLowerCase()) return false;
        if (dept !== 'all' && a.team && a.team.toLowerCase() !== dept.toLowerCase()) return false;
        return true;
      });

      if (countPill) countPill.textContent = `${filtered.length} Asset${filtered.length === 1 ? '' : 's'}`;
      if (summaryText) summaryText.textContent = `Showing ${filtered.length} of ${assets.length}`;

      if (filtered.length === 0) {
        listContainer.innerHTML = '<div style="padding:24px 16px; text-align:center; color:#64748b; font-size:0.85rem;">No hardware assets match the filter criteria.</div>';
        detailContainer.innerHTML = '<div style="padding:48px 24px; text-align:center; color:#64748b;"><div style="font-size:2rem; margin-bottom:8px;">💻</div><h4>No Asset Selected</h4><p style="font-size:0.85rem;">Adjust filters to audit hardware assets.</p></div>';
        return;
      }

      if (!this.selectedAssetLifecycleId || !filtered.some(a => a.id === this.selectedAssetLifecycleId)) {
        this.selectedAssetLifecycleId = filtered[0].id;
      }

      listContainer.innerHTML = filtered.map(a => {
        const isActive = a.id === this.selectedAssetLifecycleId;
        const isAssigned = a.status === 'Assigned';
        return `
          <div class="history-item-card ${isActive ? 'is-active' : ''}" onclick="window.ITApp.selectAssetLifecycle('${Utils.escapeHtml(a.id)}')" style="cursor:pointer;">
            <div style="display:flex; align-items:center; justify-content:space-between;">
              <strong style="font-size:0.88rem; color:#0f172a;">${Utils.escapeHtml(a.id)}</strong>
              <span class="badge" style="font-size:0.7rem; font-weight:700; background:${isAssigned ? '#ecfdf5' : '#f8fafc'}; color:${isAssigned ? '#16a34a' : '#64748b'}; border:1px solid #e2e8f0;">
                ${Utils.escapeHtml(a.status || 'Available')}
              </span>
            </div>
            <div style="font-size:0.8rem; color:#0f172a; font-weight:600;">
              ${Utils.escapeHtml(a.user || 'Unassigned / In Stock')}
            </div>
            <div style="display:flex; align-items:center; justify-content:space-between; font-size:0.75rem; color:#64748b;">
              <span>${Utils.escapeHtml(a.type)} • ${Utils.escapeHtml(a.team || 'No Dept')}</span>
              <span>${Utils.escapeHtml(a.location || 'Bay')}</span>
            </div>
          </div>
        `;
      }).join('');

      const selectedAsset = filtered.find(a => a.id === this.selectedAssetLifecycleId) || filtered[0];
      this.renderAssetLifecycleDetail(selectedAsset);
    }

    selectAssetLifecycle(assetId) {
      this.selectedAssetLifecycleId = assetId;
      this.renderAssetLifecycleHistory();
    }

    handleAssetLifecycleFilterChange() {
      this.renderAssetLifecycleHistory();
    }

    resetAssetLifecycleFilters() {
      const s = document.getElementById('assetLifecycleSearchInput');
      const t = document.getElementById('assetLifecycleTypeFilter');
      const st = document.getElementById('assetLifecycleStatusFilter');
      const d = document.getElementById('assetLifecycleDeptFilter');
      if (s) s.value = '';
      if (t) t.value = 'all';
      if (st) st.value = 'all';
      if (d) d.value = 'all';
      this.renderAssetLifecycleHistory();
    }

    renderAssetLifecycleDetail(asset) {
      const container = document.getElementById('assetLifecycleDetailContainer');
      if (!container || !asset) return;

      const isAssigned = asset.status === 'Assigned';
      const timelineEvents = [
        {
          date: asset.assignedDate || '2025-01-15',
          title: 'Commissioned & Deployed',
          detail: `Workstation commissioned and designated ${asset.id} (${asset.type}) in ${asset.team || 'IT Fleet'}.`,
          icon: '🚀'
        }
      ];

      if (asset.oldUsername && asset.oldUsername !== 'None' && asset.oldUsername !== asset.user) {
        timelineEvents.push({
          date: 'Previous Handover',
          title: 'Reallocated from ' + asset.oldUsername,
          detail: `Asset custody transitioned from previous user ${asset.oldUsername} to ${asset.user || 'Stock'}.`,
          icon: '🔄'
        });
      }

      if (asset.user && isAssigned) {
        timelineEvents.push({
          date: asset.assignedDate || 'Active',
          title: 'Current Active Custody: ' + asset.user,
          detail: `Allocated to ${asset.user} in ${asset.team} (${asset.location || 'Office Bay'}).`,
          icon: '👤'
        });
      }

      container.innerHTML = `
        <!-- Header -->
        <div style="display:flex; align-items:center; justify-content:space-between; padding-bottom:16px; border-bottom:1px solid #e2e8f0; flex-wrap:wrap; gap:12px;">
          <div style="display:flex; align-items:center; gap:14px;">
            <div style="width:48px; height:48px; border-radius:12px; background:linear-gradient(135deg, #059669, #047857); color:#fff; display:flex; align-items:center; justify-content:center; font-size:1.4rem; box-shadow:0 4px 10px rgba(5,150,105,0.25);">
              ${asset.type === 'Laptop' ? '💻' : '🖥️'}
            </div>
            <div>
              <div style="display:flex; align-items:center; gap:8px;">
                <h3 style="font-size:1.2rem; font-weight:800; color:#0f172a; margin:0;">${Utils.escapeHtml(asset.id)}</h3>
                <span class="badge" style="font-size:0.72rem; font-weight:700; background:${isAssigned ? '#ecfdf5' : '#f8fafc'}; color:${isAssigned ? '#16a34a' : '#64748b'}; border:1px solid #e2e8f0;">
                  ${Utils.escapeHtml(asset.status || 'Available')}
                </span>
                <span class="badge" style="font-size:0.72rem; font-weight:700; background:#eff6ff; color:#2563eb; border:1px solid #bfdbfe;">
                  ${Utils.escapeHtml(asset.type)}
                </span>
              </div>
              <div style="font-size:0.82rem; color:#64748b; margin-top:2px;">
                Serial: <span style="font-family:monospace; font-weight:600; color:#0f172a;">${Utils.escapeHtml(asset.serialNumber || 'SN-UNKNOWN')}</span> • Bay: ${Utils.escapeHtml(asset.location || 'N/A')}
              </div>
            </div>
          </div>
          <div style="display:flex; gap:8px;">
            <button type="button" class="btn btn-sm btn-primary" onclick="window.ITApp.viewAssetDetails('${Utils.escapeHtml(asset.id)}')" style="display:inline-flex; align-items:center; gap:5px; font-weight:600; border-radius:6px;">
              <span>👁️</span> Full Specification
            </button>
          </div>
        </div>

        <!-- Specifications Grid -->
        <div style="margin-top:16px;">
          <h4 style="font-size:0.92rem; font-weight:700; color:#0f172a; margin-bottom:10px; display:flex; align-items:center; gap:6px;">
            <span>⚙️</span> Core Hardware Configuration
          </h4>
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:10px; font-size:0.82rem; background:#f8fafc; border:1px solid #e2e8f0; padding:14px; border-radius:8px;">
            <div><span style="color:#64748b; display:block; font-size:0.75rem;">PROCESSOR (CPU)</span><strong style="color:#0f172a;">${Utils.escapeHtml(asset.cpu || 'N/A')}</strong></div>
            <div><span style="color:#64748b; display:block; font-size:0.75rem;">MEMORY (RAM)</span><strong style="color:#0f172a;">${Utils.escapeHtml(asset.ram || 'N/A')}</strong></div>
            <div><span style="color:#64748b; display:block; font-size:0.75rem;">STORAGE (SSD / HDD)</span><strong style="color:#0f172a;">${Utils.escapeHtml(asset.ssd || asset.hdd || 'N/A')}</strong></div>
            <div><span style="color:#64748b; display:block; font-size:0.75rem;">DISPLAY / MONITOR</span><strong style="color:#0f172a;">${Utils.escapeHtml(asset.monitor || 'N/A')}</strong></div>
            <div><span style="color:#64748b; display:block; font-size:0.75rem;">OPERATING SYSTEM</span><strong style="color:#0f172a;">${Utils.escapeHtml(asset.os || 'N/A')}</strong></div>
            <div><span style="color:#64748b; display:block; font-size:0.75rem;">IP ADDRESS</span><strong style="color:#0f172a;">${Utils.escapeHtml(asset.ipAddress || 'DHCP')}</strong></div>
          </div>
        </div>

        <!-- Current Custody Card -->
        <div style="margin-top:16px;">
          <h4 style="font-size:0.92rem; font-weight:700; color:#0f172a; margin-bottom:10px; display:flex; align-items:center; gap:6px;">
            <span>👤</span> Active Custody & Allocation
          </h4>
          <div class="custody-card-current">
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
              <div>
                <strong style="font-size:0.95rem; color:#0f172a;">${Utils.escapeHtml(asset.user || 'In Store Pool (Available)')}</strong>
                <span style="font-size:0.8rem; color:#64748b; margin-left:6px;">• Department: ${Utils.escapeHtml(asset.team || 'System Admin')}</span>
              </div>
              <span class="badge" style="font-size:0.75rem; font-weight:700; background:#ecfdf5; color:#065f46; border:1px solid #a7f3d0;">
                ${isAssigned ? 'Active Custody' : 'In Store Pool'}
              </span>
            </div>
            <div style="font-size:0.8rem; color:#475569; margin-top:4px;">
              Assigned Date: <strong>${Utils.escapeHtml(asset.assignedDate || 'N/A')}</strong> • Team Lead: <strong>${Utils.escapeHtml(asset.tl || 'IT Management')}</strong> • Work Status: <strong>${Utils.escapeHtml(asset.workStatus || 'Currently Working')}</strong>
            </div>
          </div>
        </div>

        <!-- Lifecycle Timeline -->
        <div style="margin-top:18px;">
          <h4 style="font-size:0.92rem; font-weight:700; color:#0f172a; margin-bottom:12px; display:flex; align-items:center; gap:6px;">
            <span>📜</span> Chronological Hardware Lifecycle & Custody Trail
          </h4>
          <div class="timeline-v2">
            ${timelineEvents.map(ev => `
              <div class="timeline-v2-node">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:2px;">
                  <strong style="font-size:0.84rem; color:#0f172a;">${ev.icon} ${Utils.escapeHtml(ev.title)}</strong>
                  <span style="font-size:0.75rem; color:#64748b;">${Utils.escapeHtml(ev.date)}</span>
                </div>
                <div style="font-size:0.8rem; color:#475569;">${Utils.escapeHtml(ev.detail)}</div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    exportAssetLifecycleCSV() {
      const assets = store.data.assets || [];
      if (!assets || assets.length === 0) {
        Utils.showToast('Export Empty', 'No hardware assets to export.', 'warning');
        return;
      }
      const headers = ['Asset ID', 'Device Type', 'Serial Number', 'Current Status', 'Assigned User', 'Department', 'Location', 'CPU', 'RAM', 'Storage', 'OS', 'Assigned Date'];
      const rows = assets.map(a => [
        `"${a.id}"`,
        `"${a.type || ''}"`,
        `"${a.serialNumber || ''}"`,
        `"${a.status || ''}"`,
        `"${(a.user || '').replace(/"/g, '""')}"`,
        `"${(a.team || '').replace(/"/g, '""')}"`,
        `"${(a.location || '').replace(/"/g, '""')}"`,
        `"${(a.cpu || '').replace(/"/g, '""')}"`,
        `"${(a.ram || '').replace(/"/g, '""')}"`,
        `"${(a.ssd || a.hdd || '').replace(/"/g, '""')}"`,
        `"${(a.os || '').replace(/"/g, '""')}"`,
        `"${a.assignedDate || ''}"`
      ]);
      const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `Pixel_ITAM_Asset_Lifecycle_Timeline_${new Date().toISOString().substring(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      Utils.showToast('CSV Exported', `Exported ${assets.length} asset lifecycle records.`, 'success');
    }

    /* ==========================================================================
       SWAP SYSTEM OLD POOL FILTERING
       ========================================================================== */
    filterSwapOldSystems(filterType = 'all') {
      ['btnFilterSwapPoolAll', 'btnFilterSwapPoolInStock', 'btnFilterSwapPoolUserExit'].forEach(id => {
        const btn = document.getElementById(id);
        if (btn) {
          btn.classList.remove('is-active');
          btn.style.background = 'transparent';
          btn.style.color = '#475569';
        }
      });
      const activeBtnId = filterType === 'instock' ? 'btnFilterSwapPoolInStock' :
                          filterType === 'userexit' ? 'btnFilterSwapPoolUserExit' : 'btnFilterSwapPoolAll';
      const activeBtn = document.getElementById(activeBtnId);
      if (activeBtn) {
        activeBtn.classList.add('is-active');
        activeBtn.style.background = '#2563eb';
        activeBtn.style.color = '#ffffff';
      }

      const select = document.getElementById('swapOldUserSelect');
      if (!select) return;

      const assets = store.data.assets || [];
      let filtered = [];
      if (filterType === 'instock') {
        filtered = assets.filter(a => (a.status === 'Non-Assigned' || a.status === 'Available' || a.status === 'Spare') && a.id);
      } else if (filterType === 'userexit') {
        filtered = assets.filter(a => (a.workStatus && (a.workStatus.toLowerCase().includes('exit') || a.workStatus.toLowerCase().includes('resigned'))) || a.status === 'User Exit');
      } else {
        filtered = assets.filter(a => a.status === 'Assigned' && a.user);
      }

      if (filtered.length === 0) {
        select.innerHTML = '<option value="">-- No matching systems in selected pool --</option>';
      } else {
        select.innerHTML = '<option value="">-- Select System to Swap --</option>' +
          filtered.map(a => `<option value="${Utils.escapeHtml(a.id)}">${Utils.escapeHtml(a.user || 'Unassigned')} (${Utils.escapeHtml(a.id)} - ${Utils.escapeHtml(a.team || 'No Team')})</option>`).join('');
      }
    }

    navToRequirementsFromInstock() {
      this.navigateTo('new-requirements');
    }

    exportInstockCsv() {
      const items = (typeof this.getInstockHardwareList === 'function' ? this.getInstockHardwareList() : null) || store.data.instockHardware || store.data.hardwareStock || [];
      if (!items || items.length === 0) {
        Utils.showToast('Export Empty', 'No instock hardware items to export.', 'warning');
        return;
      }
      const headers = ['ID', 'Category', 'Specification', 'Serial Number', 'Purchase Date', 'Status', 'Assigned To', 'Assigned Date', 'Team', 'TL', 'Remarks'];
      const rows = items.map(i => [
        `"${i.id || ''}"`,
        `"${i.component_type || i.category || ''}"`,
        `"${(i.spec || '').replace(/"/g, '""')}"`,
        `"${i.serial_number || ''}"`,
        `"${i.purchase_date || ''}"`,
        `"${i.status || 'Available'}"`,
        `"${(i.assigned_user || '').replace(/"/g, '""')}"`,
        `"${i.assigned_date || ''}"`,
        `"${(i.team || '').replace(/"/g, '""')}"`,
        `"${(i.tl || '').replace(/"/g, '""')}"`,
        `"${(i.remark || '').replace(/"/g, '""')}"`
      ]);

      const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `Pixel_ITAM_Instock_Hardware_Inventory_${new Date().toISOString().substring(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      Utils.showToast('CSV Exported', `Exported ${items.length} instock items.`, 'success');
    }
  }

  // Instantiate application controller
  const app = new AppController();
  window.Utils = Utils;
  window.ITAppControllerInstance = app;

  // Expose global methods for inline HTML onclick handlers
  window.ITApp = {
    // Assigned Users
    handleAssignedUsersFilterChange(field) {
      app.handleAssignedUsersFilterChange(field);
    },
    updateDependentAssignedUsersFilters() {
      return app.updateDependentAssignedUsersFilters();
    },
    resetAssignedUsersFilters() {
      const search = document.getElementById('assignedUsersSearch');
      if (search) search.value = '';
      const type = document.getElementById('assignedUsersTypeFilter');
      if (type) type.value = 'all';
      const team = document.getElementById('assignedUsersTeamFilter');
      if (team) team.value = 'all';
      const work = document.getElementById('assignedUsersWorkStatusFilter');
      if (work) work.value = 'all';
      const res = app.updateDependentAssignedUsersFilters();
      app.renderAssignedUsersTable(res.finalFilteredList);
    },

    // Non-Assigned Available Pool
    handleNonAssignedFilterChange(field) {
      app.handleNonAssignedFilterChange(field);
    },
    updateDependentNonAssignedFilters() {
      return app.updateDependentNonAssignedFilters();
    },
    resetNonAssignedFilters() {
      app.lastNonAssignedFilterChanged = null;
      const search = document.getElementById('nonAssignedSearchInput');
      if (search) search.value = '';
      const type = document.getElementById('nonAssignedTypeFilter');
      if (type) type.value = 'all';
      const cpu = document.getElementById('nonAssignedCpuFilter');
      if (cpu) cpu.value = 'all';
      const team = document.getElementById('nonAssignedTeamFilter');
      if (team) team.value = 'all';
      const cond = document.getElementById('nonAssignedConditionFilter');
      if (cond) cond.value = 'all';
      const res = app.updateDependentNonAssignedFilters();
      app.renderNonAssignedView(res.finalFilteredList);
    },

    // Requirements
    handleRequirementsFilterChange(field) {
      app.handleRequirementsFilterChange(field);
    },
    updateDependentRequirementsFilters() {
      return app.updateDependentRequirementsFilters();
    },
    resetRequirementsFilters() {
      app.lastReqFilterChanged = null;
      const search = document.getElementById('reqSearchInput');
      if (search) search.value = '';
      const stat = document.getElementById('reqStatusFilter');
      if (stat) stat.value = 'all';
      const prio = document.getElementById('reqPriorityFilter');
      if (prio) prio.value = 'all';
      const res = app.updateDependentRequirementsFilters();
      app.renderRequirementsTable(res.finalFilteredList);
    },

    renderRequirementsTable() {
      app.renderRequirementsTable();
    },
    renderAssignedUsersTable() {
      app.renderAssignedUsersTable();
    },

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

    handleAssetFilterChange(filterName) {
      app.handleAssetFilterChange(filterName);
    },
    updateDependentAssetFilters(filterName) {
      return app.updateDependentAssetFilters(filterName);
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
      app.handleAssetFilterChange();
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
    async viewAsset(assetId) {
      let asset = (store.data.assets || []).find(a => a.id === assetId || (a.id && a.id.toLowerCase() === (assetId || '').toLowerCase()));
      if (!asset) {
        try {
          const res = await fetch(`/api/assets/${encodeURIComponent(assetId)}`);
          if (res.ok) {
            asset = await res.json();
          }
        } catch (e) {}
      }
      if (!asset) {
        Utils.showToast('Asset Not Found', `Record for ${assetId} could not be found.`, 'error');
        return;
      }

      app.currentViewAssetId = asset.id;

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
          <span class="status-pill status-available" style="font-size:0.75rem; font-weight:600;">💻 ${Utils.escapeHtml(asset.type || 'Hardware')}</span>
          <span class="status-pill ${statusClass}" style="font-size:0.75rem; font-weight:600;">● ${Utils.escapeHtml(asset.status || 'Active')}</span>
        `;
      }

      // History records lookup
      const swapRecord = (store.data.swapLogs || []).find(s => s.newAssetId === asset.id || s.oldAssetId === asset.id);
      const hasPreviousUser = !!(asset.oldUsername && asset.oldUsername !== 'None' && asset.oldUsername.trim() !== '');
      const previousUserName = hasPreviousUser ? asset.oldUsername : (swapRecord?.oldUserId || 'None');
      const prevUserObj = (previousUserName && previousUserName !== 'None') ? (store.data.users || []).find(u => u.name.toLowerCase() === previousUserName.toLowerCase()) : null;
      const prevTeam = prevUserObj?.team || swapRecord?.oldTeam || '—';

      // Warranty status logic & Component Lifecycle Tracking
      let components = [];
      try {
        const compRes = await fetch(`/api/assets/${encodeURIComponent(asset.id)}/components`);
        if (compRes.ok) {
          components = await compRes.json();
        }
      } catch (e) {
        components = [];
      }

      // Normalize components from asset.warrantyComponents or backend or getWarrantyComponentsForAsset
      if (asset.warrantyComponents && Array.isArray(asset.warrantyComponents) && asset.warrantyComponents.length > 0) {
        components = asset.warrantyComponents.map(c => ({
          id: c.id || ('clc-' + asset.id + '-' + (c.type || 'RAM').toLowerCase()),
          asset_id: asset.id,
          component_type: c.type || 'Hardware',
          component_name: c.spec ? `${c.type} (${c.spec})` : (c.type || 'Hardware'),
          model: c.spec || c.type || '',
          serial_number: c.serialNumber || 'SN-OEM',
          manufacturer: c.manufacturer || 'Enterprise OEM',
          assigned_date: c.assignedDate || asset.assignedDate || '',
          warranty_start: c.assignedDate || asset.assignedDate || '',
          warranty_expiry: c.expiryDate || asset.warrantyEnd || '',
          status: c.status || 'Active',
          coverage: c.coverage || 'warranty',
          spec: c.spec || (app.getComponentSpecText ? app.getComponentSpecText(asset, c.type) : '')
        }));
      } else if (components.length === 0) {
        const getCompsFn = (typeof app !== "undefined" && app.getWarrantyComponentsForAsset) ? app.getWarrantyComponentsForAsset.bind(app) : this.getWarrantyComponentsForAsset.bind(this);
        components = getCompsFn(asset).map(c => ({
          id: c.id,
          asset_id: asset.id,
          component_type: c.type || 'Hardware',
          component_name: c.spec ? `${c.type} (${c.spec})` : (c.type || 'Hardware'),
          model: c.spec || c.type || '',
          serial_number: c.serialNumber || 'SN-OEM',
          manufacturer: c.manufacturer || 'Enterprise OEM',
          assigned_date: c.assignedDate || asset.assignedDate || '',
          warranty_start: c.assignedDate || asset.assignedDate || '',
          warranty_expiry: c.expiryDate || asset.warrantyEnd || '',
          status: c.status || 'Active',
          coverage: c.coverage || 'warranty',
          spec: c.spec || (app.getComponentSpecText ? app.getComponentSpecText(asset, c.type) : '')
        }));
      } else {
        components = components.map(c => ({
          ...c,
          component_type: c.component_type || c.type || 'Hardware',
          coverage: c.coverage || (c.warranty_expiry && c.warranty_expiry !== 'Non-Warranty' ? 'warranty' : 'non-warranty'),
          spec: c.spec || c.model || (app.getComponentSpecText ? app.getComponentSpecText(asset, c.component_type || c.type) : '')
        }));
      }

      // Filter to items actively under warranty (Active or Expiring Soon, exclude expired, non-warranty, and replaced/retired)
      const underWarrantyItems = components.filter(c => {
        if (c.status === 'Retired' || c.status === 'Replaced') return false;
        if (c.coverage === 'non-warranty' || c.component_type === 'Non-Warranty' || c.type === 'Non-Warranty') return false;
        const expiry = c.warranty_expiry || c.expiryDate;
        if (!expiry || expiry === 'Non-Warranty' || expiry === 'None' || expiry === '-') return false;
        const assigned = c.assigned_date || c.assignedDate || '';
        const w = (app.calculateComponentWarranty || this.calculateComponentWarranty)(assigned, expiry);
        return w.status === 'Active' || w.status === 'Expiring Soon';
      });

      const underWarrantyCount = underWarrantyItems.length;

      const body = document.getElementById('viewAssetModalBody');
      if (body) {
        body.innerHTML = `
          <!-- 1. ASSET & USER INFORMATION -->
          <div class="spec-card">
            <div class="spec-card-header" style="padding: 14px 20px; background: #ffffff; border-bottom: 1px solid #f1f5f9; display: flex; align-items: center; justify-content: space-between;">
              <div style="display: flex; align-items: center; gap: 12px;">
                <div style="width: 34px; height: 34px; border-radius: 8px; background: #eff6ff; display: flex; align-items: center; justify-content: center; color: #2563eb;">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </div>
                <span style="font-size: 1.02rem; font-weight: 700; color: #0f172a; letter-spacing: -0.2px;">Asset &amp; User Information</span>
              </div>
              <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 3px;">
                <div class="pill-user-exit" style="background: #fff1f2; color: #e11d48; border: 1px solid #fecdd3; padding: 3px 12px; border-radius: 9999px; font-size: 0.76rem; font-weight: 700; display: inline-flex; align-items: center; gap: 6px;">
                  <span style="width: 7px; height: 7px; border-radius: 50%; background: #e11d48; display: inline-block;"></span>
                  <span>${Utils.escapeHtml(asset.workStatus || 'User Exit')}</span>
                </div>
                <span style="font-size: 0.65rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b;">EMPLOYEE WORK STATUS</span>
              </div>
            </div>
            <div class="spec-card-body" style="padding: 20px 22px;">
              <div class="spec-grid-2col" style="gap: 20px 32px;">
                <!-- LEFT COLUMN -->
                <div class="spec-col" style="gap: 18px;">
                  <!-- ASSIGNED USER -->
                  <div class="spec-item">
                    <span class="spec-label" style="font-size: 0.68rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; margin-bottom: 6px;">SYSTEM ALLOTTED USER</span>
                    <div style="display: flex; align-items: center; gap: 10px;">
                      <div style="width: 32px; height: 32px; border-radius: 50%; background: #eff6ff; display: flex; align-items: center; justify-content: center; color: #2563eb; flex-shrink: 0;">
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                      </div>
                      <span style="font-size: 1.08rem; font-weight: 700; color: #0f172a; letter-spacing: -0.2px;">${asset.user ? Utils.escapeHtml(asset.user) : 'Unassigned'}</span>
                    </div>
                  </div>

                  <!-- ASSIGNED DATE -->
                  <div class="spec-item">
                    <span class="spec-label" style="font-size: 0.68rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; margin-bottom: 6px;">ASSIGNED DATE</span>
                    <div style="display: flex; align-items: center; gap: 8px;">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                      <span style="font-size: 0.9rem; font-weight: 600; color: #0f172a;">${Utils.formatDate(asset.assignedDate)}</span>
                    </div>
                  </div>
                </div>

                <!-- RIGHT COLUMN -->
                <div class="spec-col" style="gap: 18px;">
                  <!-- DEPARTMENT / TEAM -->
                  <div class="spec-item">
                    <span class="spec-label" style="font-size: 0.68rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; margin-bottom: 6px;">DEPARTMENT / TEAM</span>
                    <div>
                      <span style="display: inline-block; background: #eff6ff; color: #2563eb; border: 1px solid #bfdbfe; padding: 3px 14px; border-radius: 9999px; font-size: 0.8rem; font-weight: 600;">${Utils.escapeHtml(asset.team || '—')}</span>
                    </div>
                  </div>

                  <!-- OFFICE LOCATION -->
                  <div class="spec-item">
                    <span class="spec-label" style="font-size: 0.68rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; margin-bottom: 6px;">OFFICE LOCATION</span>
                    <div style="display: flex; align-items: center; gap: 8px;">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg>
                      <span style="font-size: 0.9rem; font-weight: 600; color: #0f172a;">${Utils.escapeHtml(asset.location || '—')}</span>
                    </div>
                  </div>

                  <!-- TEAM LEADER (TL) -->
                  <div class="spec-item">
                    <span class="spec-label" style="font-size: 0.68rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; margin-bottom: 6px;">TEAM LEADER (TL)</span>
                    <div style="display: flex; align-items: center; gap: 8px;">
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                      <span style="font-size: 0.9rem; font-weight: 600; color: #0f172a;">${Utils.escapeHtml(asset.tl || '—')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 2. HARDWARE SPECIFICATIONS -->
          <div class="spec-card spec-card-highlight">
            <div class="spec-card-header">
              <div class="spec-card-title">
                <span>⚙️</span>
                <span>Hardware Specifications</span>
              </div>
              <button class="btn btn-outline-primary btn-sm" type="button" style="padding: 3px 12px; font-size: 0.76rem; font-weight: 600;" onclick="window.ITApp.closeModal('modalViewAsset'); window.ITApp.editAsset('${asset.id}')">
                ✏️ Edit Specs
              </button>
            </div>
            <div class="spec-card-body">
              <div class="hw-panels-grid">
                <!-- PANEL 1: SYSTEM CONFIGURATION -->
                <div class="hw-panel">
                  <div class="hw-panel-title">SYSTEM CONFIGURATION</div>
                  <div class="hw-panel-grid">
                    <!-- Row 1 -->
                    <div class="spec-item">
                      <span class="spec-label">PROCESSOR (CPU)</span>
                      <span class="spec-value spec-value-strong">${Utils.escapeHtml(asset.cpu || '—')}</span>
                    </div>
                    <div class="spec-item">
                      <span class="spec-label">SYSTEM RAM</span>
                      <span class="spec-value spec-value-strong">${Utils.escapeHtml(asset.ram || '—')}</span>
                    </div>

                    <!-- Row 2 -->
                    <div class="spec-item">
                      <span class="spec-label">SSD STORAGE</span>
                      <span class="spec-value">${Utils.escapeHtml((asset.ssd && asset.ssd !== 'None' && asset.ssd !== 'Nil') ? asset.ssd : 'None')}</span>
                    </div>
                    <div class="spec-item">
                      <span class="spec-label">HDD STORAGE</span>
                      <span class="spec-value">${Utils.escapeHtml((asset.hdd && asset.hdd !== 'None' && asset.hdd !== 'Nil') ? asset.hdd : 'None')}</span>
                    </div>

                    <!-- Row 3 -->
                    <div class="spec-item">
                      <span class="spec-label">OPERATING SYSTEM</span>
                      <span class="spec-value">${Utils.escapeHtml(asset.os || 'Windows 11 Pro')}</span>
                    </div>
                    <div class="spec-item">
                      <span class="spec-label">IP ADDRESS</span>
                      <span class="spec-value font-mono" style="color:var(--primary); font-weight:600;">${Utils.escapeHtml(asset.ipAddress || '—')}</span>
                    </div>

                    <!-- Row 4 -->
                    <div class="spec-item" style="grid-column: 1 / -1;">
                      <span class="spec-label">MAC ADDRESS / SERIAL NO</span>
                      <span class="spec-value" style="font-family:var(--font-mono); letter-spacing:0.4px;">${Utils.escapeHtml((asset.serialNumber || asset.macAddress || '—').toUpperCase())}</span>
                    </div>
                  </div>
                </div>

                <!-- PANEL 2: DISPLAY & PERIPHERALS -->
                <div class="hw-panel">
                  <div class="hw-panel-title">DISPLAY & PERIPHERALS</div>
                  <div class="hw-panel-grid-single">
                    <div class="spec-item">
                      <span class="spec-label">PRIMARY MONITOR</span>
                      <span class="spec-value">${Utils.escapeHtml((asset.monitor && asset.monitor !== '-' && asset.monitor.toLowerCase() !== 'none') ? asset.monitor : 'None')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 3. WARRANTY & HARDWARE LIFECYCLE (ACTIVE WARRANTY ITEMS ONLY) -->
          <div class="spec-card">
            <div class="spec-card-header" style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; padding: 14px 20px; border-bottom: 1px solid #f1f5f9;">
              <div class="warranty-brand-group" style="display: flex; align-items: center; gap: 10px;">
                <svg class="warranty-brand-shield-svg" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#2563EB" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  <path d="M12 22V2c-4 0-8 3-8 3v7c0 6 8 10 8 10z" fill="rgba(37,99,235,0.18)"/>
                </svg>
                <div style="display: flex; flex-direction: column;">
                  <span class="warranty-brand-title" style="font-size: 1.02rem; font-weight: 700; color: #0f172a; line-height: 1.2;">Warranty &amp; Hardware Lifecycle</span>
                  <span class="warranty-brand-sub" style="font-size: 0.75rem; color: #64748b; font-weight: 500;">Active Component Warranty Registry</span>
                </div>
              </div>
              <div style="display:flex; align-items:center; gap:8px;">
                ${underWarrantyCount > 0 ? `
                  <span class="warranty-badge badge-active" style="background:#ecfdf5; color:#065f46; border:1px solid #a7f3d0; padding:4px 12px; border-radius:9999px; font-weight:700; font-size:0.75rem; display:inline-flex; align-items:center; gap:6px;">
                    <span class="badge-dot" style="background:#10b981; width:7px; height:7px; border-radius:50%; display:inline-block;"></span>
                    <span>${underWarrantyCount} Active Warranty Item${underWarrantyCount === 1 ? '' : 's'}</span>
                  </span>
                ` : `
                  <span class="badge-non-warranty" style="background:#fef3c7; color:#92400e; border:1px solid #fde68a; font-weight:700; padding:4px 12px; border-radius:9999px; font-size:0.75rem;">
                    0 Items Under Warranty
                  </span>
                `}
              </div>
            </div>

            <div class="spec-card-body" style="padding: 18px 20px;">
              ${underWarrantyCount === 0 ? `
                <div style="padding:28px 20px; text-align:center; color:#64748b; background:#f8fafc; border-radius:8px; border:1px dashed #cbd5e1;">
                  <span style="font-size:1.8rem; display:block; margin-bottom:6px;">🛡️</span>
                  <strong style="color:#334155; font-size:0.95rem;">No Components Under Active Warranty</strong>
                  <p style="margin:4px 0 0; font-size:0.8rem; color:#94a3b8;">All components for this asset are either non-warranty, expired, or retired.</p>
                </div>
              ` : `
                <div class="itam-table-wrapper">
                  <table class="itam-table">
                    <thead>
                      <tr style="background:#f8fafc; border-bottom:1px solid #e2e8f0;">
                        <th style="padding:10px 14px; font-size:0.7rem; font-weight:700; text-transform:uppercase; color:#475569; width:38%;">Component / Specification</th>
                        <th style="padding:10px 14px; font-size:0.7rem; font-weight:700; text-transform:uppercase; color:#475569; width:20%;">Assigned / Installed</th>
                        <th style="padding:10px 14px; font-size:0.7rem; font-weight:700; text-transform:uppercase; color:#475569; width:20%;">Warranty Expiry</th>
                        <th style="padding:10px 14px; font-size:0.7rem; font-weight:700; text-transform:uppercase; color:#475569; width:22%;">Status &amp; Period</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${underWarrantyItems.map(c => {
                        const compType = c.component_type || c.type || 'Hardware';
                        const specText = c.spec || c.model || (app.getComponentSpecText ? app.getComponentSpecText(asset, compType) : '');
                        const icon = (app.getComponentIcon || this.getComponentIcon)(compType);
                        const assigned = c.assigned_date || c.assignedDate || '';
                        const expiry = c.warranty_expiry || c.expiryDate || '';
                        const w = (app.calculateComponentWarranty || this.calculateComponentWarranty)(assigned, expiry);

                        return `
                          <tr style="border-bottom:1px solid #f1f5f9;">
                            <td style="padding:10px 14px;">
                              <div style="display:flex; align-items:center; gap:10px;">
                                <div style="width:34px; height:34px; border-radius:6px; background:#eff6ff; display:flex; align-items:center; justify-content:center; font-size:1.15rem; flex-shrink:0; border:1px solid #dbeafe;">
                                  ${icon}
                                </div>
                                <div>
                                  <strong style="color:#0f172a; font-size:0.88rem; display:block;">${Utils.escapeHtml(compType)}</strong>
                                  ${specText ? `<span style="font-size:0.78rem; color:#475569; font-weight:600;">${Utils.escapeHtml(specText)}</span>` : ''}
                                  ${c.serial_number && c.serial_number !== 'SN-OEM' ? `<div style="font-size:0.7rem; color:#94a3b8; font-family:monospace;">SN: ${Utils.escapeHtml(c.serial_number)}</div>` : ''}
                                </div>
                              </div>
                            </td>
                            <td style="padding:10px 14px; font-family:monospace; color:#334155; font-size:0.82rem;">
                              ${Utils.formatDate(assigned)}
                            </td>
                            <td style="padding:10px 14px; font-family:monospace; color:#334155; font-size:0.82rem; font-weight:600;">
                              ${Utils.formatDate(expiry)}
                            </td>
                            <td style="padding:10px 14px;">
                              <div style="display:flex; flex-direction:column; gap:4px;">
                                <span class="smart-warranty-badge ${w.badgeClass}" style="height:24px; padding:2px 8px; font-size:0.72rem; width:fit-content; border-radius:9999px; background:${w.badgeBg}; color:${w.badgeColor}; border:1px solid ${w.badgeBorder}; font-weight:700; display:inline-flex; align-items:center; gap:4px;">
                                  <span class="badge-dot" style="background:${w.badgeColor}; width:6px; height:6px; border-radius:50%; display:inline-block;"></span>
                                  <span>${Utils.escapeHtml(w.status)}</span>
                                </span>
                                <span style="font-size:0.72rem; color:${w.badgeColor}; font-weight:600;">⏱️ ${Utils.escapeHtml(w.daysText)}</span>
                              </div>
                            </td>
                          </tr>
                        `;
                      }).join('')}
                    </tbody>
                  </table>
                </div>
              `}
            </div>
          </div>

          <!-- 4. PREVIOUS USER & ALLOCATION HISTORY (BEFORE ADMIN REMARKS) -->
          <div class="spec-card">
            <div class="spec-card-header">
              <div class="spec-card-title">
                <span>🔄</span>
                <span>Previous User &amp; Allocation History</span>
              </div>
              <div>
                ${(hasPreviousUser || (swapRecord && swapRecord.oldUserId)) ?
            `<span class="badge" style="background:#fef3c7; color:#b45309; border:1px solid #fde68a; font-size:0.75rem; padding:3px 10px; border-radius:12px; font-weight:600;">Reallocated Asset</span>` :
            `<span class="badge" style="background:#e0f2fe; color:#0369a1; border:1px solid #bae6fd; font-size:0.75rem; padding:3px 10px; border-radius:12px; font-weight:600;">First Allocation</span>`
          }
              </div>
            </div>
            <div class="spec-card-body">
              <div class="allocation-transition-box">
                <div class="transition-user-node">
                  <span class="transition-node-label">OLD USER NAME</span>
                  <span class="transition-node-name">${(hasPreviousUser || (swapRecord && swapRecord.oldUserId)) ? Utils.escapeHtml(previousUserName) : '<span style="color:var(--text-faint);">None</span>'}</span>
                  <span class="transition-node-sub">${(hasPreviousUser || (swapRecord && swapRecord.oldUserId)) ? (prevTeam !== '—' ? prevTeam : 'Prior Department') : 'Initial Asset Allocation'}</span>
                </div>
                <div class="transition-arrow-divider">
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

          <!-- 5. ADMIN REMARKS (AFTER ALLOCATION HISTORY) -->
          <div class="spec-card spec-card-compact">
            <div class="spec-card-header">
              <div class="spec-card-title">
                <span>📝</span>
                <span>Admin Remarks</span>
              </div>
            </div>
            <div class="spec-card-body" style="padding: 14px 18px; display: flex; flex-direction: column; gap: 10px;">
              <div class="spec-item">
                <span class="spec-label">Admin Remark</span>
                <span class="spec-value" style="color: ${asset.remark ? 'var(--text-main)' : 'var(--text-muted)'}; font-style: ${asset.remark ? 'normal' : 'italic'};">${asset.remark ? Utils.escapeHtml(asset.remark) : 'None'}</span>
              </div>
              <div class="spec-item">
                <span class="spec-label">Additional Notes</span>
                <span class="spec-value" style="color: var(--text-secondary); font-size: 0.84rem;">
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
    fillRolePreset(roleKey) {
      app.fillRolePreset(roleKey);
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

    // Component Lifecycle Tracking Methods
    openAddComponentModal(assetId) {
      app.openAddComponentModal(assetId);
    },
    handleAddComponentTypeChange(type) {
      app.handleAddComponentTypeChange(type);
    },
    toggleAddComponentWarrantyDate(mode) {
      app.toggleAddComponentWarrantyDate(mode);
    },
    handleSaveNewComponent(e) {
      app.handleSaveNewComponent(e);
    },
    openEditComponentModal(componentId, assetId) {
      app.openEditComponentModal(componentId, assetId);
    },
    handleSaveEditComponent(e) {
      app.handleSaveEditComponent(e);
    },
    openReplaceComponentModal(componentId, assetId) {
      app.openReplaceComponentModal(componentId, assetId);
    },
    handleSaveReplaceComponent(e) {
      app.handleSaveReplaceComponent(e);
    },
    promptDeleteComponent(componentId, assetId) {
      app.promptDeleteComponent(componentId, assetId);
    },
    cancelDeleteWarrantyComponent() {
      app.cancelDeleteWarrantyComponent();
    },
    confirmDeleteWarrantyComponent() {
      app.confirmDeleteWarrantyComponent();
    },
    openLifecycleHistoryModal(assetId) {
      app.openLifecycleHistoryModal(assetId);
    },
    filterComponentsList(query) {
      app.filterComponentsList(query);
    },
    calculateComponentWarranty(assignedDate, expiryDate) {
      return app.calculateComponentWarranty(assignedDate, expiryDate);
    },
    getComponentIcon(type) {
      return app.getComponentIcon(type);
    },

    // INSTOCK Module Global Methods
    navigateTo(viewId, pushHistory) {
      app.navigateTo(viewId, pushHistory);
    },
    renderInstockDashboard() {
      app.renderInstockDashboard();
    },
    renderInstockInventoryTable() {
      app.renderInstockInventoryTable();
    },
    filterDashboardByStatus(status) {
      app.filterDashboardByStatus(status);
    },
    navToAssignedWithFilter(status) {
      app.navToAssignedWithFilter(status);
    },
    filterInstockDashboard() {
      app.filterInstockDashboard();
    },
    resetInstockDashboardFilters() {
      app.resetInstockDashboardFilters();
    },
    openInstockEntryModal(defaultType = null, editId = null) {
      app.openInstockEntryModal(defaultType, editId);
    },
    toggleInstockAssignmentFields() {
      app.toggleInstockAssignmentFields();
    },
    handleInstockFormSubmit(event) {
      return app.handleInstockFormSubmit(event);
    },
    toggleInstockStatus(id) {
      app.toggleInstockStatus(id);
    },
    deleteInstockEntry(id) {
      app.deleteInstockEntry(id);
    },
    setHardwareMaintenance(id) {
      app.setHardwareMaintenance(id);
    },
    markHardwareAvailable(id) {
      app.markHardwareAvailable(id);
    },
    openAssignAssetModal(preselectedAssetId = null) {
      app.openAssignAssetModal(preselectedAssetId);
    },
    autoSelectUserTl(userName) {
      app.autoSelectUserTl(userName);
    },
    handlePurposeChange() {
      app.handlePurposeChange();
    },
    handleAssignAssetSubmit(event) {
      return app.handleAssignAssetSubmit(event);
    },
    openReturnAssetModal(allocId) {
      app.openReturnAssetModal(allocId);
    },
    handleReturnAssetSubmit(event) {
      return app.handleReturnAssetSubmit(event);
    },
    handleQuickReturn(hardwareId) {
      app.handleQuickReturn(hardwareId);
    },
    openUserAssetHistoryModal(userName) {
      app.openUserAssetHistoryModal(userName);
    },
    openAssignAssetForUser() {
      app.openAssignAssetForUser();
    },
    openEditAllocationModal(allocId) {
      app.openEditAllocationModal(allocId);
    },
    handleEditAllocationSubmit(event) {
      return app.handleEditAllocationSubmit(event);
    },
    renderAssignedItemsTable() {
      app.renderAssignedItemsTable();
    },
    renderInstockAssignedTable() {
      app.renderInstockAssignedTable();
    },
    filterAssignedItems() {
      app.filterAssignedItems();
    },
    resetAssignedItemsFilters() {
      app.resetAssignedItemsFilters();
    },
    exportAssignedCsv() {
      app.exportAssignedCsv();
    },
    filterInventoryByCategory(cat) {
      app.filterInventoryByCategory(cat);
    },
    renderInstockInventoryView() {
      app.renderInstockInventoryView();
    },
    filterFullInventoryView() {
      app.filterFullInventoryView();
    },
    resetFullInventoryViewFilters() {
      app.resetFullInventoryViewFilters();
    },
    viewInstockItem(id) {
      app.viewInstockItem(id);
    },
    openInstockEntryModalFromView() {
      app.openInstockEntryModalFromView();
    },
    viewAllocationDetails(allocId) {
      app.viewAllocationDetails(allocId);
    },
    openEditAllocationFromView() {
      app.openEditAllocationFromView();
    },


    // Instock CSV Export & Quick Navigation
    exportInstockCsv() {
      app.exportInstockCsv();
    },
    navToRequirementsFromInstock() {
      app.navToRequirementsFromInstock();
    },
    filterSwapOldSystems(filterType) {
      app.filterSwapOldSystems(filterType);
    },

    // Employee Asset History
    renderEmployeeAssetHistory() {
      app.renderEmployeeAssetHistory();
    },
    selectEmployeeHistory(empId) {
      app.selectEmployeeHistory(empId);
    },
    handleEmpHistoryFilterChange() {
      app.handleEmpHistoryFilterChange();
    },
    resetEmpHistoryFilters() {
      app.resetEmpHistoryFilters();
    },
    exportEmployeeHistoryCSV() {
      app.exportEmployeeHistoryCSV();
    },

    // Asset Lifecycle History
    renderAssetLifecycleHistory() {
      app.renderAssetLifecycleHistory();
    },
    selectAssetLifecycle(assetId) {
      app.selectAssetLifecycle(assetId);
    },
    handleAssetLifecycleFilterChange() {
      app.handleAssetLifecycleFilterChange();
    },
    resetAssetLifecycleFilters() {
      app.resetAssetLifecycleFilters();
    },
    exportAssetLifecycleCSV() {
      app.exportAssetLifecycleCSV();
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

  // Keyboard accessibility: Escape key closes delete confirmation modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const delModal = document.getElementById('modalConfirmDeleteComponent');
      if (delModal && delModal.style.display !== 'none') {
        app.cancelDeleteWarrantyComponent();
      }
    }
  });
})();
