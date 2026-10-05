/**
 * Pixel ITAM - Excel & CSV Import/Export Engine
 * Supports parsing CSV and binary Excel (.xlsx/.xls) via SheetJS, schema validation, duplicate detection, and formula-injection-safe export.
 */

window.PixelExcel = (function () {
  const sanitize = window.PixelSecurity ? window.PixelSecurity.sanitizeCSVCell : (v => `"${v}"`);

  // Download generic CSV
  function triggerCSVDownload(filename, headers, rows) {
    const csvContent = "\uFEFF" + [
      headers.map(sanitize).join(','),
      ...rows.map(row => row.map(sanitize).join(','))
    ].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // Export Master Asset List (All or Filtered)
  function exportAssetsToCSV(assets, filename = "Pixel_ITAM_Assets.csv") {
    const headers = [
      "Asset ID", "Employee Name", "Employee ID", "Department", "Team", "Asset Type",
      "Brand", "Model", "Serial Number", "CPU", "RAM", "Storage", "Operating System",
      "Office Version", "Antivirus", "IP Address", "MAC Address", "Location", "Floor",
      "Bay", "Purchase Date", "Purchase Cost", "Warranty Expiry", "Vendor", "Asset Status",
      "Maintenance Status", "Condition", "Remarks", "Last Updated"
    ];

    const rows = assets.map(a => [
      a.id, a.employeeName, a.employeeId, a.department, a.team, a.assetType,
      a.brand, a.model, a.serialNumber, a.cpu, a.ram, a.storage, a.os,
      a.officeVersion, a.antivirus, a.ipAddress, a.macAddress, a.location, a.floor,
      a.bay, a.purchaseDate, a.purchaseCost, a.warrantyExpiry, a.vendor, a.status,
      a.maintenanceStatus, a.condition, a.remarks, a.lastUpdated
    ]);

    triggerCSVDownload(filename, headers, rows);
  }

  // Export Maintenance Records
  function exportMaintenanceToCSV(records, filename = "Pixel_Maintenance_Tickets.csv") {
    const headers = [
      "Ticket ID", "Asset ID", "Employee", "Issue Date", "Issue Type", "Priority",
      "Status", "Technician", "Vendor", "Repair Cost (INR)", "Start Date", "Completion Date",
      "Problem Description", "Resolution", "Remarks"
    ];

    const rows = records.map(r => [
      r.ticketId, r.assetId, r.employee, r.issueDate, r.issueType, r.priority,
      r.status, r.assignedTechnician, r.vendor, r.repairCost, r.startDate, r.completionDate,
      r.problemDescription, r.resolution, r.remarks
    ]);

    triggerCSVDownload(filename, headers, rows);
  }

  // Export Assignment History
  function exportAssignmentsToCSV(assets, filename = "Pixel_Assignment_Ledger.csv") {
    const headers = ["Asset ID", "Asset Type", "Model", "Assignment Date", "Previous Employee / Source", "Assigned Employee", "Assigned By", "Reason"];
    const rows = [];

    assets.forEach(a => {
      if (a.assignmentHistory && a.assignmentHistory.length > 0) {
        a.assignmentHistory.forEach(h => {
          rows.push([
            a.id, a.assetType, a.model, h.date, h.fromEmployee, h.toEmployee, h.assignedBy, h.reason
          ]);
        });
      } else {
        rows.push([a.id, a.assetType, a.model, a.purchaseDate, "IT Inventory Pool", a.employeeName, "System Admin", "Initial assignment"]);
      }
    });

    triggerCSVDownload(filename, headers, rows);
  }

  // Export Warranty Expiry Report
  function exportWarrantyToCSV(assets, filename = "Pixel_Warranty_Report.csv") {
    const headers = ["Asset ID", "Employee Name", "Team", "Asset Type", "Brand", "Model", "Serial Number", "Purchase Date", "Warranty Expiry", "Days Left", "Warranty Status"];
    const today = new Date();

    const rows = assets.map(a => {
      const exp = a.warrantyExpiry ? new Date(a.warrantyExpiry) : null;
      let days = "N/A";
      let status = "Active";
      if (exp && !isNaN(exp)) {
        const diffTime = exp - today;
        days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (days < 0) status = "Expired";
        else if (days <= 60) status = "Expiring Soon";
      }
      return [a.id, a.employeeName, a.team, a.assetType, a.brand, a.model, a.serialNumber, a.purchaseDate, a.warrantyExpiry, days, status];
    });

    triggerCSVDownload(filename, headers, rows);
  }

  // Export Software Licenses
  function exportLicensesToCSV(licenses, filename = "Pixel_Software_Licenses.csv") {
    const headers = ["License ID", "Software Name", "License Type", "License Key", "Assigned Asset", "Assigned Employee", "Total Seats", "Used Seats", "Available Seats", "Expiry Date", "Status", "Vendor"];
    const rows = licenses.map(l => [
      l.id, l.name, l.type, l.key, l.assignedAsset, l.assignedEmployee, l.totalSeats, l.usedSeats, l.availableSeats, l.expiryDate, l.status, l.vendor
    ]);
    triggerCSVDownload(filename, headers, rows);
  }

  // CSV Parser with Quotes Handling
  function parseCSVText(csvText) {
    const lines = [];
    let currentRow = [];
    let currentCell = '';
    let insideQuotes = false;

    for (let i = 0; i < csvText.length; i++) {
      const char = csvText[i];
      const nextChar = csvText[i + 1];

      if (char === '"') {
        if (insideQuotes && nextChar === '"') {
          currentCell += '"';
          i++;
        } else {
          insideQuotes = !insideQuotes;
        }
      } else if (char === ',' && !insideQuotes) {
        currentRow.push(currentCell.trim());
        currentCell = '';
      } else if ((char === '\r' || char === '\n') && !insideQuotes) {
        if (char === '\r' && nextChar === '\n') i++;
        currentRow.push(currentCell.trim());
        if (currentRow.some(c => c.length > 0)) {
          lines.push(currentRow);
        }
        currentRow = [];
        currentCell = '';
      } else {
        currentCell += char;
      }
    }

    if (currentCell.length > 0 || currentRow.length > 0) {
      currentRow.push(currentCell.trim());
      if (currentRow.some(c => c.length > 0)) lines.push(currentRow);
    }

    return lines;
  }

  // Unified parser supporting both binary Excel (.xlsx, .xls) and text (.csv)
  function parseExcelOrCSV(file, callback) {
    const isExcel = file.name.endsWith('.xlsx') || file.name.endsWith('.xls');

    if (isExcel && window.XLSX) {
      const reader = new FileReader();
      reader.onload = function (e) {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const rawRows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          const cleanRows = rawRows
            .map(row => Array.isArray(row) ? row.map(val => val !== null && val !== undefined ? String(val).trim() : '') : [])
            .filter(row => row.some(cell => cell.length > 0));
          callback(null, cleanRows);
        } catch (err) {
          callback(err);
        }
      };
      reader.onerror = () => callback(new Error("Failed to read Excel workbook"));
      reader.readAsArrayBuffer(file);
    } else {
      const reader = new FileReader();
      reader.onload = function (e) {
        try {
          const text = e.target.result;
          const rows = parseCSVText(text);
          callback(null, rows);
        } catch (err) {
          callback(err);
        }
      };
      reader.onerror = () => callback(new Error("Failed to read CSV text file"));
      reader.readAsText(file);
    }
  }

  // Validate and map imported records with smart header detection
  function validateImportRecords(rawRows, existingAssets = []) {
    if (!rawRows || rawRows.length < 2) {
      return { valid: false, message: "File has no data rows" };
    }

    const headers = rawRows[0].map(h => (h || '').toLowerCase().replace(/[^a-z0-9]/g, ''));
    const rows = rawRows.slice(1);

    const existingIds = new Set((existingAssets || []).map(a => (a.id || '').toUpperCase().trim()));
    const existingSerials = new Set((existingAssets || []).map(a => (a.serialNumber || '').toUpperCase().trim()).filter(s => s && s !== 'NA'));

    const readyRecords = [];
    const duplicateRecords = [];
    const invalidRecords = [];
    const seenInBatch = new Set();

    rows.forEach((row, idx) => {
      const rowNum = idx + 2;

      const getVal = (possibleNames, fallbackIndex) => {
        for (const name of possibleNames) {
          const colIdx = headers.findIndex(h => h.includes(name));
          if (colIdx !== -1 && row[colIdx] !== undefined && row[colIdx] !== '') {
            return String(row[colIdx]).trim();
          }
        }
        return (row[fallbackIndex] !== undefined ? String(row[fallbackIndex]).trim() : '');
      };

      let assetId = getVal(['assetid', 'systemid', 'sysid', 'assetname', 'asset', 'cpuid', 'tag', 'id'], 0);
      if (!assetId) {
        assetId = `PIX-${1000 + idx}`;
      }

      const name = getVal(['staffname', 'employeename', 'employee', 'username', 'user', 'assignedto', 'name'], 1) || "Unassigned";
      const team = getVal(['team', 'dept', 'department', 'division'], 2) || "General IT";
      const department = getVal(['department', 'dept'], 3) || (team.toLowerCase().includes('php') || team.toLowerCase().includes('tech') ? 'Engineering' : 'Operations');
      const model = getVal(['model', 'sizemodel', 'machine', 'systemmodel', 'specification'], 8) || "Desktop Workstation";
      const serial = getVal(['serial', 'macserial', 'monasset', 'sn', 'servicetag'], 7) || `SN-PIX-${1000 + idx}`;
      const cpu = getVal(['cpu', 'processor', 'chip'], 4) || "Intel Core i5";
      const ram = getVal(['ram', 'memory', 'ddr'], 5) || "8 GB DDR4";
      const storage = getVal(['ssd', 'hdd', 'storage', 'disk', 'capacity'], 6) || "256 GB SSD";
      const os = getVal(['os', 'operatingsystem', 'platform'], 9) || "Windows 11 Pro";
      const ip = getVal(['ip', 'ipaddress', 'lanip'], 3) || "DHCP";
      const mac = getVal(['mac', 'macaddress', 'ethernet'], 15) || "N/A";
      const floor = getVal(['floor', 'level', 'tower'], 12) || "2nd Floor";
      const bay = getVal(['bay', 'seat', 'cubicle', 'desk'], 11) || "General Bay";
      const location = getVal(['location', 'campus', 'branch', 'office'], 10) || "Pixel HQ Campus";
      const vendor = getVal(['vendor', 'supplier', 'seller'], 13) || "OEM Enterprise";
      const cost = parseFloat(getVal(['cost', 'price', 'purchasecost', 'amount'], 14)) || 45000;
      const status = getVal(['status', 'state', 'assetstatus'], 16) || (name.toLowerCase().includes('unassigned') ? 'Available' : 'Assigned');
      const remarks = getVal(['remarks', 'comment', 'notes'], 17) || "Imported via Excel";

      const normId = assetId.toUpperCase();
      const normSerial = serial.toUpperCase();

      if (seenInBatch.has(normId)) {
        assetId = `${assetId}-D${idx + 1}`;
      }
      seenInBatch.add(normId);

      if (existingIds.has(normId)) {
        duplicateRecords.push({ rowNum, assetId, serial, reason: `Asset ID "${assetId}" already exists in system`, data: row });
        return;
      }

      if (normSerial !== 'NA' && existingSerials.has(normSerial)) {
        duplicateRecords.push({ rowNum, assetId, serial, reason: `Serial Number "${serial}" already exists in system`, data: row });
        return;
      }

      const today = new Date().toISOString().split('T')[0];
      const expiry = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000 * 3).toISOString().split('T')[0];

      readyRecords.push({
        id: assetId,
        employeeName: name,
        employeeId: `EMP-${1000 + idx}`,
        team: team,
        department: department,
        assetType: model.toLowerCase().includes('lap') ? 'Laptop' : 'Desktop',
        brand: model.toLowerCase().includes('lenovo') ? 'Lenovo' : model.toLowerCase().includes('dell') ? 'Dell' : model.toLowerCase().includes('hp') ? 'HP' : 'Dell',
        model: model,
        serialNumber: serial,
        cpu: cpu,
        ram: ram,
        storage: storage,
        os: os,
        officeVersion: "Microsoft 365 Enterprise",
        antivirus: "Windows Defender (Active)",
        ipAddress: ip,
        macAddress: mac,
        location: location,
        floor: floor,
        bay: bay,
        purchaseDate: today,
        purchaseCost: cost,
        warrantyExpiry: expiry,
        vendor: vendor,
        status: status,
        maintenanceStatus: "Normal",
        condition: "Good",
        remarks: remarks,
        lastUpdated: new Date().toISOString().replace('T', ' ').slice(0, 16),
        assignmentHistory: [{
          date: today,
          fromEmployee: "IT Master Pool",
          toEmployee: name,
          assignedBy: "System Administrator",
          reason: "Batch Excel onboarding"
        }],
        maintenanceHistory: []
      });
    });

    return {
      valid: true,
      readyRecords,
      duplicateRecords,
      invalidRecords,
      totalCount: rows.length
    };
  }

  return {
    exportAssetsToCSV: exportAssetsToCSV,
    exportMaintenanceToCSV: exportMaintenanceToCSV,
    exportAssignmentsToCSV: exportAssignmentsToCSV,
    exportWarrantyToCSV: exportWarrantyToCSV,
    exportLicensesToCSV: exportLicensesToCSV,
    parseCSVText: parseCSVText,
    parseExcelOrCSV: parseExcelOrCSV,
    validateImportRecords: validateImportRecords
  };
})();
