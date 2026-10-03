/**
 * Pixel ITAM - Main Application Controller
 * Orchestrates navigation, reactive state, charts, tables, search, filters, and modal workflows.
 */

window.PixelApp = (function () {
  // Application State
  const state = {
    currentTab: 'dashboard',
    assets: [],
    maintenance: [],
    licenses: [],
    activityLog: [],
    settings: {},
    searchTerm: '',
    filters: {
      department: '',
      team: '',
      assetType: '',
      os: '',
      status: '',
      maintenanceStatus: '',
      floor: '',
      location: '',
      warrantyStatus: ''
    },
    pagination: {
      currentPage: 1,
      pageSize: 15,
      totalCount: 0
    },
    sortColumn: 'sno',
    sortDirection: 'asc',
    visibleColumns: {
      id: true,
      employeeName: true,
      team: true,
      assetType: true,
      brand: true,
      model: true,
      serialNumber: true,
      cpu: true,
      ram: true,
      storage: true,
      os: true,
      ipAddress: true,
      macAddress: true,
      location: true,
      floor: false,
      bay: true,
      purchaseDate: false,
      warrantyExpiry: true,
      status: true,
      maintenanceStatus: true,
      antivirus: false,
      remarks: false,
      actions: true
    },
    selectedAssetId: null,
    activeMaintenanceFilter: 'all',
    activeReportType: 'inventory',
    charts: {}
  };

  const esc = window.PixelSecurity.escapeHTML;

  // Initialize
  function init() {
    loadStateFromStorage();
    initTheme();
    initEventListeners();
    window.PixelStorage.subscribe(onStorageUpdate);
    switchTab('dashboard');
    lucide.createIcons();
    showToast("IT Asset Management Portal loaded successfully.", "info");
  }

  function loadStateFromStorage() {
    state.assets = window.PixelStorage.getAssets();
    state.maintenance = window.PixelStorage.getMaintenance();
    state.licenses = window.PixelStorage.getLicenses();
    state.activityLog = window.PixelStorage.getActivityLog();
    state.settings = window.PixelStorage.getSettings();
    updateRoleBadge();
  }

  function onStorageUpdate(event) {
    loadStateFromStorage();
    if (state.currentTab === 'dashboard') renderDashboard();
    else if (state.currentTab === 'inventory') renderInventoryTable();
    else if (state.currentTab === 'maintenance') renderMaintenanceView();
    else if (state.currentTab === 'warranty') renderWarrantyView();
    else if (state.currentTab === 'licenses') renderLicensesView();
    else if (state.currentTab === 'activity') renderActivityLogView();
    else if (state.currentTab === 'validation') renderDataValidationView();
    else if (state.currentTab === 'reports') renderReportsView();
  }

  // Navigation
  function switchTab(tabId) {
    state.currentTab = tabId;

    // Update Sidebar Active state
    document.querySelectorAll('.nav-link').forEach(btn => {
      btn.classList.remove('bg-blue-600', 'text-white', 'shadow-md', 'shadow-blue-500/20');
      btn.classList.add('text-slate-600', 'dark:text-slate-400', 'hover:bg-slate-100', 'dark:hover:bg-slate-800');
    });

    const activeBtn = document.getElementById(`nav-${tabId}`);
    if (activeBtn) {
      activeBtn.classList.remove('text-slate-600', 'dark:text-slate-400', 'hover:bg-slate-100', 'dark:hover:bg-slate-800');
      activeBtn.classList.add('bg-blue-600', 'text-white', 'shadow-md', 'shadow-blue-500/20');
    }

    // Hide all view sections
    document.querySelectorAll('.portal-view').forEach(view => view.classList.add('hidden'));

    // Show Target View
    const targetView = document.getElementById(`view-${tabId}`);
    if (targetView) targetView.classList.remove('hidden');

    // Update Header Breadcrumb
    const breadcrumb = document.getElementById('headerBreadcrumb');
    if (breadcrumb) {
      const titles = {
        dashboard: 'Dashboard & KPI Metrics',
        inventory: 'Master Asset Inventory',
        addAsset: 'Register New Asset',
        maintenance: 'Maintenance & Repairs',
        assignments: 'Assignments & Transfers',
        warranty: 'Warranty Lifecycle Management',
        licenses: 'Software & License Tracking',
        reports: 'Analytics & Export Reports',
        validation: 'Data Quality & Validation Center',
        activity: 'Audit Trail & Activity Log',
        settings: 'Portal Configuration & IT Admin Settings'
      };
      breadcrumb.textContent = titles[tabId] || 'Asset Portal';
    }

    // Trigger tab-specific renders
    if (tabId === 'dashboard') renderDashboard();
    else if (tabId === 'inventory') renderInventoryTable();
    else if (tabId === 'maintenance') renderMaintenanceView();
    else if (tabId === 'assignments') renderAssignmentsView();
    else if (tabId === 'warranty') renderWarrantyView();
    else if (tabId === 'licenses') renderLicensesView();
    else if (tabId === 'reports') renderReportsView();
    else if (tabId === 'validation') renderDataValidationView();
    else if (tabId === 'activity') renderActivityLogView();
    else if (tabId === 'settings') renderSettingsView();

    lucide.createIcons();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Theme & Role Controls
  function initTheme() {
    const isDark = localStorage.getItem('pixel_theme') === 'dark' || 
      (!('pixel_theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.classList.toggle('dark', isDark);
    updateThemeIcon(isDark);
  }

  function toggleDarkMode() {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('pixel_theme', isDark ? 'dark' : 'light');
    updateThemeIcon(isDark);
    if (state.currentTab === 'dashboard') renderDashboardCharts();
  }

  function updateThemeIcon(isDark) {
    const icon = document.getElementById('themeToggleBtn');
    if (icon) {
      icon.innerHTML = isDark ? '<i data-lucide="sun" class="w-4 h-4 text-amber-400"></i>' : '<i data-lucide="moon" class="w-4 h-4 text-slate-600"></i>';
      lucide.createIcons();
    }
  }

  function changeRole(newRole) {
    state.settings.userRole = newRole;
    window.PixelStorage.saveSettings(state.settings);
    updateRoleBadge();
    showToast(`Active role switched to: ${newRole}`, "info");
    // Re-render current view with new masking rules
    switchTab(state.currentTab);
  }

  function updateRoleBadge() {
    const badge = document.getElementById('currentRoleBadge');
    const role = state.settings.userRole || 'Admin';
    if (badge) {
      badge.textContent = role;
      badge.className = `px-2.5 py-1 text-xs font-bold rounded-full border ${
        role === 'Admin' ? 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800' :
        role === 'IT Staff' ? 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800' :
        'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
      }`;
    }
    const roleSelect = document.getElementById('headerRoleSelect');
    if (roleSelect) roleSelect.value = role;
  }

  // =========================================================================
  // 1. DASHBOARD & KPIS
  // =========================================================================
  function renderDashboard() {
    const assets = state.assets;
    const total = assets.length;

    const assigned = assets.filter(a => a.status === 'Assigned').length;
    const available = assets.filter(a => a.status === 'Available').length;
    const maintenance = assets.filter(a => a.status === 'Maintenance').length;
    const repair = assets.filter(a => a.status === 'Repair').length;
    const spare = assets.filter(a => a.status === 'Spare').length;
    const wfh = assets.filter(a => a.status === 'WFH').length;
    const retired = assets.filter(a => a.status === 'Retired' || a.status === 'Scrapped').length;

    // Check Warranty Expiring Soon (<60 days)
    const today = new Date();
    const alertDays = state.settings.warrantyAlertDays || 60;
    const expiringSoon = assets.filter(a => {
      if (!a.warrantyExpiry) return false;
      const exp = new Date(a.warrantyExpiry);
      const diff = (exp - today) / (1000 * 60 * 60 * 24);
      return diff >= 0 && diff <= alertDays;
    }).length;

    // Warranty Banner
    const warnBanner = document.getElementById('dashWarrantyAlert');
    if (warnBanner) {
      if (expiringSoon > 0) {
        warnBanner.classList.remove('hidden');
        document.getElementById('dashWarrantyAlertCount').textContent = expiringSoon;
      } else {
        warnBanner.classList.add('hidden');
      }
    }

    // Set KPI Values
    document.getElementById('kpiTotalAssets').textContent = total;
    document.getElementById('kpiAssignedAssets').textContent = assigned;
    document.getElementById('kpiAssignedPct').textContent = `${total ? Math.round((assigned / total) * 100) : 0}% fleet`;
    document.getElementById('kpiAvailableAssets').textContent = available;
    document.getElementById('kpiAvailablePct').textContent = `${total ? Math.round((available / total) * 100) : 0}% buffer`;
    document.getElementById('kpiMaintenanceAssets').textContent = maintenance;
    document.getElementById('kpiRepairAssets').textContent = repair;
    document.getElementById('kpiSpareAssets').textContent = spare;
    document.getElementById('kpiWfhAssets').textContent = wfh;
    document.getElementById('kpiWfhPct').textContent = `${total ? Math.round((wfh / total) * 100) : 0}% remote`;
    document.getElementById('kpiRetiredAssets').textContent = retired;

    // If breakdown section is currently open, refresh its data
    const breakdownSection = document.getElementById('totalAssetsBreakdownSection');
    if (breakdownSection && !breakdownSection.classList.contains('hidden')) {
      renderTotalAssetsBreakdown();
    }

    renderDashboardCharts();
    renderRecentActivitiesFeed();
  }

  function toggleTotalAssetsBreakdown(forceState) {
    const section = document.getElementById('totalAssetsBreakdownSection');
    const chevron = document.getElementById('totalAssetsChevron');
    if (!section) return;

    const isCurrentlyHidden = section.classList.contains('hidden');
    const shouldShow = forceState !== undefined ? forceState : isCurrentlyHidden;

    if (shouldShow) {
      renderTotalAssetsBreakdown();
      section.classList.remove('hidden');
      if (chevron) chevron.classList.add('rotate-180');
      section.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      lucide.createIcons();
    } else {
      section.classList.add('hidden');
      if (chevron) chevron.classList.remove('rotate-180');
    }
  }

  function renderTotalAssetsBreakdown() {
    const assets = state.assets;
    const total = assets.length;

    const totalBadge = document.getElementById('breakdownTotalBadge');
    if (totalBadge) totalBadge.textContent = `${total} Systems Preserved`;

    // 1. Group by Floor
    const floorMap = {};
    assets.forEach(a => {
      const f = (a.floor || 'Unspecified Floor').trim();
      if (!floorMap[f]) {
        floorMap[f] = {
          count: 0,
          location: a.location || 'Pixel HQ Campus',
          systems: []
        };
      }
      floorMap[f].count++;
      floorMap[f].systems.push(a);
    });

    const floorKeys = Object.keys(floorMap).sort((a, b) => floorMap[b].count - floorMap[a].count);
    const floorCountEl = document.getElementById('breakdownFloorCount');
    if (floorCountEl) floorCountEl.textContent = `${floorKeys.length} Locations`;

    const floorListContainer = document.getElementById('breakdownFloorList');
    if (floorListContainer) {
      floorListContainer.innerHTML = floorKeys.map((floor, idx) => {
        const item = floorMap[floor];
        const pct = total ? Math.round((item.count / total) * 100) : 0;
        const previewSystems = item.systems.slice(0, 6);
        const remainingCount = item.systems.length - previewSystems.length;

        return `
          <div class="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700 transition space-y-2">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <span class="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-xs flex items-center justify-center">
                  ${idx + 1}
                </span>
                <div>
                  <h5 class="font-bold text-xs text-slate-800 dark:text-slate-100">${esc(floor)}</h5>
                  <p class="text-[10px] text-slate-500">${esc(item.location)}</p>
                </div>
              </div>
              <div class="flex items-center space-x-2">
                <span class="px-2 py-0.5 text-xs font-bold rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  ${item.count} Systems (${pct}%)
                </span>
                <button onclick="window.PixelApp.filterInventoryByFloor('${esc(floor)}')" title="Filter Master Inventory by this Floor" class="px-2 py-1 text-[10px] font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition flex items-center space-x-1">
                  <span>Filter</span>
                  <i data-lucide="arrow-right" class="w-2.5 h-2.5"></i>
                </button>
              </div>
            </div>

            <!-- Progress bar -->
            <div class="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
              <div class="bg-gradient-to-r from-emerald-500 to-teal-500 h-1.5 rounded-full transition-all duration-500" style="width: ${pct}%"></div>
            </div>

            <!-- Systems Preview Tag List -->
            <div class="pt-1 flex flex-wrap gap-1.5">
              ${previewSystems.map(sys => `
                <span onclick="window.PixelApp.openAssetDetails('${esc(sys.id)}')" class="inline-flex items-center px-2 py-0.5 text-[10px] font-medium rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 cursor-pointer hover:border-blue-500 hover:text-blue-600 transition" title="${esc(sys.brand)} ${esc(sys.model)} - Assigned to ${esc(sys.employeeName)} (${esc(sys.team)})">
                  <span class="font-bold text-blue-600 dark:text-blue-400 mr-1">${esc(sys.id)}</span>
                  <span class="truncate max-w-[90px] text-slate-500">${esc(sys.employeeName)}</span>
                </span>
              `).join('')}
              ${remainingCount > 0 ? `
                <button onclick="window.PixelApp.filterInventoryByFloor('${esc(floor)}')" class="inline-flex items-center px-2 py-0.5 text-[10px] font-bold rounded-md bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900 hover:bg-blue-100 transition">
                  +${remainingCount} more in ${esc(floor)}
                </button>
              ` : ''}
            </div>
          </div>
        `;
      }).join('');
    }

    // 2. Group by Team
    const teamMap = {};
    assets.forEach(a => {
      const t = (a.team || 'Unassigned').trim();
      if (!teamMap[t]) {
        teamMap[t] = {
          count: 0,
          department: a.department || 'Operations',
          systems: []
        };
      }
      teamMap[t].count++;
      teamMap[t].systems.push(a);
    });

    const teamKeys = Object.keys(teamMap).sort((a, b) => teamMap[b].count - teamMap[a].count);
    const teamCountEl = document.getElementById('breakdownTeamCount');
    if (teamCountEl) teamCountEl.textContent = `${teamKeys.length} Teams`;

    const teamListContainer = document.getElementById('breakdownTeamList');
    if (teamListContainer) {
      teamListContainer.innerHTML = teamKeys.map((team, idx) => {
        const item = teamMap[team];
        const pct = total ? Math.round((item.count / total) * 100) : 0;
        const previewSystems = item.systems.slice(0, 6);
        const remainingCount = item.systems.length - previewSystems.length;

        return `
          <div class="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 transition space-y-2">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <span class="w-6 h-6 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-xs flex items-center justify-center">
                  ${idx + 1}
                </span>
                <div>
                  <h5 class="font-bold text-xs text-slate-800 dark:text-slate-100">${esc(team)}</h5>
                  <p class="text-[10px] text-slate-500">${esc(item.department)}</p>
                </div>
              </div>
              <div class="flex items-center space-x-2">
                <span class="px-2 py-0.5 text-xs font-bold rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  ${item.count} Systems (${pct}%)
                </span>
                <button onclick="window.PixelApp.filterInventoryByTeam('${esc(team)}')" title="Filter Master Inventory by this Team" class="px-2 py-1 text-[10px] font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition flex items-center space-x-1">
                  <span>Filter</span>
                  <i data-lucide="arrow-right" class="w-2.5 h-2.5"></i>
                </button>
              </div>
            </div>

            <!-- Progress bar -->
            <div class="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
              <div class="bg-gradient-to-r from-indigo-500 to-purple-500 h-1.5 rounded-full transition-all duration-500" style="width: ${pct}%"></div>
            </div>

            <!-- Systems Preview Tag List -->
            <div class="pt-1 flex flex-wrap gap-1.5">
              ${previewSystems.map(sys => `
                <span onclick="window.PixelApp.openAssetDetails('${esc(sys.id)}')" class="inline-flex items-center px-2 py-0.5 text-[10px] font-medium rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 cursor-pointer hover:border-blue-500 hover:text-blue-600 transition" title="${esc(sys.brand)} ${esc(sys.model)} - ${esc(sys.employeeName)} (${esc(sys.floor || 'Floor')})">
                  <span class="font-bold text-blue-600 dark:text-blue-400 mr-1">${esc(sys.id)}</span>
                  <span class="truncate max-w-[90px] text-slate-500">${esc(sys.employeeName)}</span>
                </span>
              `).join('')}
              ${remainingCount > 0 ? `
                <button onclick="window.PixelApp.filterInventoryByTeam('${esc(team)}')" class="inline-flex items-center px-2 py-0.5 text-[10px] font-bold rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900 hover:bg-indigo-100 transition">
                  +${remainingCount} more in ${esc(team)}
                </button>
              ` : ''}
            </div>
          </div>
        `;
      }).join('');
    }

    lucide.createIcons();
  }

  function filterInventoryByFloor(floorName) {
    state.filters.floor = floorName;
    const floorSelect = document.getElementById('filterFloor');
    if (floorSelect) floorSelect.value = floorName;
    switchTab('inventory');
    showToast(`Filtered Inventory by Floor: ${floorName}`, "info");
  }

  function filterInventoryByTeam(teamName) {
    state.filters.team = teamName;
    const teamSelect = document.getElementById('filterTeam');
    if (teamSelect) teamSelect.value = teamName;
    switchTab('inventory');
    showToast(`Filtered Inventory by Team: ${teamName}`, "info");
  }

  function renderDashboardCharts() {
    const isDark = document.documentElement.classList.contains('dark');
    const textColor = isDark ? '#94a3b8' : '#475569';
    const gridColor = isDark ? '#1e293b' : '#f1f5f9';
    const assets = state.assets;

    // Destroy existing charts to avoid memory leaks
    Object.values(state.charts).forEach(c => {
      try { if (c) c.destroy(); } catch (e) {}
    });
    state.charts = {};

    // 1. Asset Status Distribution (Doughnut)
    const statusMap = {};
    assets.forEach(a => { statusMap[a.status] = (statusMap[a.status] || 0) + 1; });
    const ctxStatus = document.getElementById('chartAssetStatus');
    if (ctxStatus) {
      state.charts.status = new Chart(ctxStatus, {
        type: 'doughnut',
        data: {
          labels: Object.keys(statusMap),
          datasets: [{
            data: Object.values(statusMap),
            backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#64748b']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'bottom', labels: { color: textColor, font: { size: 10 } } } }
        }
      });
    }

    // 2. OS Distribution (Doughnut)
    const osMap = {};
    assets.forEach(a => {
      const os = a.os || 'Other';
      osMap[os] = (osMap[os] || 0) + 1;
    });
    const ctxOS = document.getElementById('chartOS');
    if (ctxOS) {
      state.charts.os = new Chart(ctxOS, {
        type: 'doughnut',
        data: {
          labels: Object.keys(osMap),
          datasets: [{
            data: Object.values(osMap),
            backgroundColor: ['#f97316', '#0284c7', '#0d9488', '#6366f1', '#a855f7', '#64748b']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'bottom', labels: { color: textColor, font: { size: 10 } } } }
        }
      });
    }

    // 3. Department / Team Distribution (Horizontal Bar)
    const deptMap = {};
    assets.forEach(a => {
      const d = a.department || 'General IT';
      deptMap[d] = (deptMap[d] || 0) + 1;
    });
    const ctxDept = document.getElementById('chartDepartment');
    if (ctxDept) {
      state.charts.dept = new Chart(ctxDept, {
        type: 'bar',
        data: {
          labels: Object.keys(deptMap),
          datasets: [{
            label: 'Assets',
            data: Object.values(deptMap),
            backgroundColor: '#4f46e5',
            borderRadius: 6
          }]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { ticks: { color: textColor, stepSize: 5 }, grid: { color: gridColor } },
            y: { ticks: { color: textColor, font: { size: 10 } }, grid: { display: false } }
          }
        }
      });
    }

    // 4. Asset Type Distribution (Doughnut)
    const typeMap = {};
    assets.forEach(a => { typeMap[a.assetType || 'Desktop'] = (typeMap[a.assetType || 'Desktop'] || 0) + 1; });
    const ctxType = document.getElementById('chartAssetType');
    if (ctxType) {
      state.charts.type = new Chart(ctxType, {
        type: 'doughnut',
        data: {
          labels: Object.keys(typeMap),
          datasets: [{
            data: Object.values(typeMap),
            backgroundColor: ['#06b6d4', '#3b82f6', '#8b5cf6', '#10b981']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'bottom', labels: { color: textColor, font: { size: 10 } } } }
        }
      });
    }

    // 5. Floor & Location Distribution (Bar)
    const locMap = {};
    assets.forEach(a => {
      const l = a.floor || '1st Floor';
      locMap[l] = (locMap[l] || 0) + 1;
    });
    const ctxLoc = document.getElementById('chartLocation');
    if (ctxLoc) {
      state.charts.loc = new Chart(ctxLoc, {
        type: 'bar',
        data: {
          labels: Object.keys(locMap),
          datasets: [{
            label: 'Assets',
            data: Object.values(locMap),
            backgroundColor: '#0d9488',
            borderRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { ticks: { color: textColor, font: { size: 10 } }, grid: { display: false } },
            y: { ticks: { color: textColor, stepSize: 5 }, grid: { color: gridColor } }
          }
        }
      });
    }

    // 6. Maintenance Status (Doughnut)
    const maintMap = {
      'Normal / Operational': assets.filter(a => a.maintenanceStatus === 'Normal').length,
      'In Progress': assets.filter(a => a.maintenanceStatus === 'In Progress').length,
      'Needs Attention / Repair': assets.filter(a => a.status === 'Repair' || a.condition === 'Issue').length
    };
    const ctxMaint = document.getElementById('chartMaintenance');
    if (ctxMaint) {
      state.charts.maint = new Chart(ctxMaint, {
        type: 'doughnut',
        data: {
          labels: Object.keys(maintMap),
          datasets: [{
            data: Object.values(maintMap),
            backgroundColor: ['#10b981', '#f59e0b', '#ef4444']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'bottom', labels: { color: textColor, font: { size: 10 } } } }
        }
      });
    }

    // 7. Purchase Year / Fleet Age (Bar)
    const yrMap = {};
    assets.forEach(a => {
      const yr = a.purchaseDate ? a.purchaseDate.substring(0, 4) : '2024';
      yrMap[yr] = (yrMap[yr] || 0) + 1;
    });
    const ctxYear = document.getElementById('chartYear');
    if (ctxYear) {
      state.charts.year = new Chart(ctxYear, {
        type: 'bar',
        data: {
          labels: Object.keys(yrMap).sort(),
          datasets: [{
            label: 'Acquisitions',
            data: Object.keys(yrMap).sort().map(k => yrMap[k]),
            backgroundColor: '#8b5cf6',
            borderRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { ticks: { color: textColor, font: { size: 10 } }, grid: { display: false } },
            y: { ticks: { color: textColor, stepSize: 5 }, grid: { color: gridColor } }
          }
        }
      });
    }
  }

  function renderRecentActivitiesFeed() {
    const list = document.getElementById('dashRecentActivities');
    if (!list) return;

    const logs = state.activityLog.slice(0, 6);
    if (logs.length === 0) {
      list.innerHTML = `<p class="text-xs text-slate-400 py-3 text-center">No recent activities logged.</p>`;
      return;
    }

    list.innerHTML = logs.map(l => `
      <div class="flex items-start space-x-3 p-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
        <div class="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 text-xs font-bold">
          <i data-lucide="clock" class="w-3.5 h-3.5"></i>
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-slate-900 dark:text-white truncate">${esc(l.action)}</span>
            <span class="text-[10px] text-slate-400 shrink-0 font-mono">${esc(l.timestamp)}</span>
          </div>
          <p class="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 truncate">${esc(l.details)}</p>
          <span class="text-[10px] text-indigo-600 dark:text-indigo-400 font-mono font-medium">${esc(l.assetId)} • ${esc(l.user)}</span>
        </div>
      </div>
    `).join('');
    lucide.createIcons();
  }

  // =========================================================================
  // 2. ASSET INVENTORY TABLE & ADVANCED FILTERS
  // =========================================================================
  function getFilteredAssets() {
    const q = (state.searchTerm || '').toLowerCase().trim();
    const f = state.filters;
    const today = new Date();

    return state.assets.filter(a => {
      // Global Search matching
      if (q) {
        const matchesQuery = 
          (a.employeeName || '').toLowerCase().includes(q) ||
          (a.id || '').toLowerCase().includes(q) ||
          (a.serialNumber || '').toLowerCase().includes(q) ||
          (a.model || '').toLowerCase().includes(q) ||
          (a.team || '').toLowerCase().includes(q) ||
          (a.department || '').toLowerCase().includes(q) ||
          (a.ipAddress || '').toLowerCase().includes(q) ||
          (a.macAddress || '').toLowerCase().includes(q) ||
          (a.location || '').toLowerCase().includes(q) ||
          (a.bay || '').toLowerCase().includes(q) ||
          (a.status || '').toLowerCase().includes(q) ||
          (a.cpu || '').toLowerCase().includes(q);
        if (!matchesQuery) return false;
      }

      // Advanced Filters
      if (f.department && a.department !== f.department) return false;
      if (f.team && a.team !== f.team) return false;
      if (f.assetType && a.assetType !== f.assetType) return false;
      if (f.os && !(a.os || '').toLowerCase().includes(f.os.toLowerCase())) return false;
      if (f.status && a.status !== f.status) return false;
      if (f.maintenanceStatus && a.maintenanceStatus !== f.maintenanceStatus) return false;
      if (f.floor && a.floor !== f.floor) return false;
      if (f.location && a.location !== f.location) return false;

      // Warranty Status filter
      if (f.warrantyStatus) {
        const exp = a.warrantyExpiry ? new Date(a.warrantyExpiry) : null;
        if (!exp) return false;
        const diff = (exp - today) / (1000 * 60 * 60 * 24);
        if (f.warrantyStatus === 'expired' && diff >= 0) return false;
        if (f.warrantyStatus === 'expiring' && (diff < 0 || diff > 60)) return false;
        if (f.warrantyStatus === 'active' && diff <= 60) return false;
      }

      return true;
    });
  }

  function renderInventoryTable() {
    const filtered = getFilteredAssets();

    // Sorting
    filtered.sort((a, b) => {
      let valA = a[state.sortColumn] || '';
      let valB = b[state.sortColumn] || '';
      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();
      if (valA < valB) return state.sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return state.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    state.pagination.totalCount = filtered.length;
    const totalPages = Math.ceil(filtered.length / state.pagination.pageSize) || 1;
    if (state.pagination.currentPage > totalPages) state.pagination.currentPage = 1;

    const startIdx = (state.pagination.currentPage - 1) * state.pagination.pageSize;
    const pageItems = filtered.slice(startIdx, startIdx + state.pagination.pageSize);

    // Update Counter
    document.getElementById('inventoryFilterCount').textContent = filtered.length;
    document.getElementById('inventoryTotalCount').textContent = state.assets.length;

    // Render Table Header according to Column Visibility
    renderInventoryHeader();

    // Render Table Body
    const tbody = document.getElementById('inventoryTableBody');
    const cols = state.visibleColumns;
    const role = state.settings.userRole || 'Admin';

    if (pageItems.length === 0) {
      tbody.innerHTML = `<tr><td colspan="20" class="text-center py-8 text-slate-400">No assets match your search and filter criteria. <button onclick="window.PixelApp.resetFilters()" class="text-blue-600 underline font-semibold ml-2">Reset Filters</button></td></tr>`;
      renderPaginationControls(totalPages);
      return;
    }

    tbody.innerHTML = pageItems.map(a => {
      const isAssigned = a.status === 'Assigned';
      const isMaint = a.status === 'Maintenance' || a.status === 'Repair';

      const statusBadge = `
        <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
          a.status === 'Assigned' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300' :
          a.status === 'Available' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' :
          a.status === 'Maintenance' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300' :
          a.status === 'Repair' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300' :
          a.status === 'WFH' ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300' :
          'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
        }">${esc(a.status)}</span>
      `;

      return `
        <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800/80 transition cursor-pointer" onclick="window.PixelApp.openAssetDetails('${esc(a.id)}')">
          ${cols.id ? `<td class="py-2.5 px-3 font-mono font-bold text-blue-600 dark:text-blue-400">${esc(a.id)}</td>` : ''}
          ${cols.employeeName ? `<td class="py-2.5 px-3 font-bold text-slate-900 dark:text-white">${esc(a.employeeName)}</td>` : ''}
          ${cols.team ? `<td class="py-2.5 px-3"><span class="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-medium">${esc(a.team)}</span></td>` : ''}
          ${cols.assetType ? `<td class="py-2.5 px-3">${esc(a.assetType)}</td>` : ''}
          ${cols.brand ? `<td class="py-2.5 px-3">${esc(a.brand)}</td>` : ''}
          ${cols.model ? `<td class="py-2.5 px-3 text-slate-700 dark:text-slate-200">${esc(a.model)}</td>` : ''}
          ${cols.serialNumber ? `<td class="py-2.5 px-3 font-mono text-slate-500">${esc(a.serialNumber)}</td>` : ''}
          ${cols.cpu ? `<td class="py-2.5 px-3">${esc(a.cpu)}</td>` : ''}
          ${cols.ram ? `<td class="py-2.5 px-3 font-semibold">${esc(a.ram)}</td>` : ''}
          ${cols.storage ? `<td class="py-2.5 px-3 text-slate-500">${esc(a.storage || '-')}</td>` : ''}
          ${cols.os ? `<td class="py-2.5 px-3 text-indigo-600 dark:text-indigo-400 font-medium">${esc(a.os)}</td>` : ''}
          ${cols.ipAddress ? `<td class="py-2.5 px-3">${window.PixelSecurity.formatIP(a.ipAddress, role)}</td>` : ''}
          ${cols.macAddress ? `<td class="py-2.5 px-3">${window.PixelSecurity.formatMAC(a.macAddress, role)}</td>` : ''}
          ${cols.location ? `<td class="py-2.5 px-3">${esc(a.location)}</td>` : ''}
          ${cols.floor ? `<td class="py-2.5 px-3">${esc(a.floor)}</td>` : ''}
          ${cols.bay ? `<td class="py-2.5 px-3 font-mono text-slate-600 dark:text-slate-300">${esc(a.bay)}</td>` : ''}
          ${cols.purchaseDate ? `<td class="py-2.5 px-3 font-mono text-[11px]">${esc(a.purchaseDate)}</td>` : ''}
          ${cols.warrantyExpiry ? `<td class="py-2.5 px-3 font-mono text-[11px]">${esc(a.warrantyExpiry)}</td>` : ''}
          ${cols.status ? `<td class="py-2.5 px-3">${statusBadge}</td>` : ''}
          ${cols.maintenanceStatus ? `<td class="py-2.5 px-3"><span class="text-[11px] font-medium ${isMaint ? 'text-amber-600 font-bold' : 'text-emerald-600'}">${esc(a.maintenanceStatus || 'Normal')}</span></td>` : ''}
          ${cols.antivirus ? `<td class="py-2.5 px-3 text-[11px]">${esc(a.antivirus)}</td>` : ''}
          ${cols.remarks ? `<td class="py-2.5 px-3 text-slate-400 truncate max-w-xs">${esc(a.remarks)}</td>` : ''}
          ${cols.actions ? `
            <td class="py-2.5 px-3 text-right" onclick="event.stopPropagation()">
              <div class="flex items-center justify-end space-x-1">
                <button onclick="window.PixelApp.openAssetDetails('${esc(a.id)}')" title="View Details" class="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400">
                  <i data-lucide="eye" class="w-3.5 h-3.5"></i>
                </button>
                <button onclick="window.PixelApp.openEditAssetModal('${esc(a.id)}')" title="Edit" class="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-blue-600 dark:text-blue-400">
                  <i data-lucide="edit-2" class="w-3.5 h-3.5"></i>
                </button>
                <button onclick="window.PixelApp.openTransferModal('${esc(a.id)}')" title="Transfer / Assign" class="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-purple-600 dark:text-purple-400">
                  <i data-lucide="user-check" class="w-3.5 h-3.5"></i>
                </button>
              </div>
            </td>
          ` : ''}
        </tr>
      `;
    }).join('');

    renderPaginationControls(totalPages);
    lucide.createIcons();
  }

  function renderInventoryHeader() {
    const thead = document.getElementById('inventoryTableHead');
    const cols = state.visibleColumns;

    const th = (key, label) => {
      if (!cols[key]) return '';
      const isSorted = state.sortColumn === key;
      const arrow = isSorted ? (state.sortDirection === 'asc' ? '▲' : '▼') : '';
      return `
        <th onclick="window.PixelApp.handleSort('${key}')" class="py-3 px-3 cursor-pointer select-none hover:text-blue-600 transition">
          <div class="flex items-center space-x-1">
            <span>${label}</span>
            <span class="text-[9px] text-blue-500 font-mono">${arrow}</span>
          </div>
        </th>
      `;
    };

    thead.innerHTML = `
      <tr>
        ${th('id', 'Asset ID')}
        ${th('employeeName', 'Employee Name')}
        ${th('team', 'Team')}
        ${th('assetType', 'Type')}
        ${th('brand', 'Brand')}
        ${th('model', 'Model')}
        ${th('serialNumber', 'Serial Number')}
        ${th('cpu', 'CPU')}
        ${th('ram', 'RAM')}
        ${th('storage', 'Storage')}
        ${th('os', 'OS')}
        ${th('ipAddress', 'IP Address')}
        ${th('macAddress', 'MAC Address')}
        ${th('location', 'Location')}
        ${th('floor', 'Floor')}
        ${th('bay', 'Bay')}
        ${th('purchaseDate', 'Purchase Date')}
        ${th('warrantyExpiry', 'Warranty Exp')}
        ${th('status', 'Status')}
        ${th('maintenanceStatus', 'Maint Status')}
        ${th('antivirus', 'Antivirus')}
        ${th('remarks', 'Remarks')}
        ${cols.actions ? `<th class="py-3 px-3 text-right">Actions</th>` : ''}
      </tr>
    `;
  }

  function handleSort(column) {
    if (state.sortColumn === column) {
      state.sortDirection = state.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      state.sortColumn = column;
      state.sortDirection = 'asc';
    }
    renderInventoryTable();
  }

  function renderPaginationControls(totalPages) {
    const container = document.getElementById('inventoryPagination');
    if (!container) return;

    const curr = state.pagination.currentPage;
    container.innerHTML = `
      <div class="flex items-center justify-between text-xs text-slate-500 w-full">
        <div>Page <span class="font-bold text-slate-900 dark:text-white">${curr}</span> of ${totalPages}</div>
        <div class="flex items-center space-x-2">
          <button onclick="window.PixelApp.changePage(${curr - 1})" ${curr <= 1 ? 'disabled' : ''} class="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800">Previous</button>
          <button onclick="window.PixelApp.changePage(${curr + 1})" ${curr >= totalPages ? 'disabled' : ''} class="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800">Next</button>
        </div>
      </div>
    `;
  }

  function changePage(page) {
    const totalPages = Math.ceil(getFilteredAssets().length / state.pagination.pageSize) || 1;
    if (page < 1 || page > totalPages) return;
    state.pagination.currentPage = page;
    renderInventoryTable();
  }

  function changePageSize(size) {
    state.pagination.pageSize = parseInt(size, 10) || 15;
    state.pagination.currentPage = 1;
    renderInventoryTable();
  }

  function handleSearch(val) {
    state.searchTerm = val;
    state.pagination.currentPage = 1;
    renderInventoryTable();
  }

  function handleGlobalSearch(val) {
    state.searchTerm = val;
    const localInput = document.getElementById('inventorySearchInput');
    if (localInput) localInput.value = val;
    switchTab('inventory');
  }

  function handleFilterChange(key, value) {
    state.filters[key] = value;
    state.pagination.currentPage = 1;
    renderInventoryTable();
  }

  function resetFilters() {
    state.searchTerm = '';
    state.filters = {
      department: '',
      team: '',
      assetType: '',
      os: '',
      status: '',
      maintenanceStatus: '',
      floor: '',
      location: '',
      warrantyStatus: ''
    };
    const searchInput = document.getElementById('inventorySearchInput');
    if (searchInput) searchInput.value = '';
    const globalSearch = document.getElementById('globalSearchInput');
    if (globalSearch) globalSearch.value = '';

    ['filterDept', 'filterTeam', 'filterType', 'filterOS', 'filterStatus', 'filterMaint', 'filterFloor', 'filterWarranty'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });

    state.pagination.currentPage = 1;
    renderInventoryTable();
    showToast("Filters reset to default view.", "info");
  }

  function toggleColumnVisibilityModal() {
    const modal = document.getElementById('columnVisibilityModal');
    if (!modal) return;
    const isHidden = modal.classList.contains('hidden');

    if (isHidden) {
      const container = document.getElementById('columnCheckboxContainer');
      const labels = {
        id: 'Asset ID',
        employeeName: 'Employee Name',
        team: 'Team',
        assetType: 'Asset Type',
        brand: 'Brand',
        model: 'Model',
        serialNumber: 'Serial Number',
        cpu: 'CPU',
        ram: 'RAM',
        storage: 'Storage',
        os: 'Operating System',
        ipAddress: 'IP Address',
        macAddress: 'MAC Address',
        location: 'Location',
        floor: 'Floor',
        bay: 'Bay',
        purchaseDate: 'Purchase Date',
        warrantyExpiry: 'Warranty Expiry',
        status: 'Asset Status',
        maintenanceStatus: 'Maintenance Status',
        antivirus: 'Antivirus',
        remarks: 'Remarks'
      };

      container.innerHTML = Object.keys(state.visibleColumns).map(key => {
        if (key === 'actions') return '';
        const checked = state.visibleColumns[key] ? 'checked' : '';
        return `
          <label class="flex items-center space-x-2 text-xs p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
            <input type="checkbox" onchange="window.PixelApp.setColumnVisible('${key}', this.checked)" ${checked} class="rounded text-blue-600 focus:ring-blue-500">
            <span>${labels[key] || key}</span>
          </label>
        `;
      }).join('');
      modal.classList.remove('hidden');
    } else {
      modal.classList.add('hidden');
    }
  }

  function setColumnVisible(key, isVisible) {
    state.visibleColumns[key] = isVisible;
    renderInventoryTable();
  }

  // =========================================================================
  // 3. ASSET DETAILS MODAL (VIEW / PRINT / QR CODE)
  // =========================================================================
  function openAssetDetails(assetId) {
    const asset = window.PixelStorage.getAssetById(assetId);
    if (!asset) return;

    state.selectedAssetId = asset.id;
    const modal = document.getElementById('assetDetailsModal');
    if (!modal) return;

    // Header Details
    document.getElementById('detailsModalAssetId').textContent = asset.id;
    document.getElementById('detailsModalTitle').textContent = `${asset.brand} ${asset.model}`;
    document.getElementById('detailsModalStatus').textContent = asset.status;
    document.getElementById('detailsModalEmployee').textContent = asset.employeeName;

    // QR Code Container
    const qrContainer = document.getElementById('detailsModalQRContainer');
    if (qrContainer) {
      qrContainer.innerHTML = window.PixelQR.generateQRCodeSVG(asset.id, 140);
    }

    // Specifications Grid
    const role = state.settings.userRole || 'Admin';
    document.getElementById('specGridContainer').innerHTML = `
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
        <div class="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
          <span class="text-[10px] text-slate-400 font-semibold uppercase">Brand & Model</span>
          <p class="font-bold text-slate-800 dark:text-slate-100 mt-0.5">${esc(asset.brand)} ${esc(asset.model)}</p>
        </div>
        <div class="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
          <span class="text-[10px] text-slate-400 font-semibold uppercase">Serial Number</span>
          <p class="font-mono font-bold text-slate-800 dark:text-slate-100 mt-0.5">${esc(asset.serialNumber)}</p>
        </div>
        <div class="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
          <span class="text-[10px] text-slate-400 font-semibold uppercase">Processor (CPU)</span>
          <p class="font-semibold text-slate-800 dark:text-slate-100 mt-0.5">${esc(asset.cpu)}</p>
        </div>
        <div class="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
          <span class="text-[10px] text-slate-400 font-semibold uppercase">RAM Memory</span>
          <p class="font-semibold text-slate-800 dark:text-slate-100 mt-0.5">${esc(asset.ram)}</p>
        </div>
        <div class="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
          <span class="text-[10px] text-slate-400 font-semibold uppercase">Storage Disks</span>
          <p class="font-semibold text-slate-800 dark:text-slate-100 mt-0.5">${esc(asset.storage || 'None')}</p>
        </div>
        <div class="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
          <span class="text-[10px] text-slate-400 font-semibold uppercase">Operating System</span>
          <p class="font-bold text-blue-600 dark:text-blue-400 mt-0.5">${esc(asset.os)}</p>
        </div>
        <div class="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
          <span class="text-[10px] text-slate-400 font-semibold uppercase">IP Address</span>
          <p class="mt-0.5">${window.PixelSecurity.formatIP(asset.ipAddress, role)}</p>
        </div>
        <div class="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
          <span class="text-[10px] text-slate-400 font-semibold uppercase">MAC Address</span>
          <p class="mt-0.5">${window.PixelSecurity.formatMAC(asset.macAddress, role)}</p>
        </div>
        <div class="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
          <span class="text-[10px] text-slate-400 font-semibold uppercase">Floor & Bay</span>
          <p class="font-semibold text-slate-800 dark:text-slate-100 mt-0.5">${esc(asset.floor)} • ${esc(asset.bay)}</p>
        </div>
        <div class="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
          <span class="text-[10px] text-slate-400 font-semibold uppercase">Purchase & Warranty</span>
          <p class="font-mono text-slate-700 dark:text-slate-300 mt-0.5">${esc(asset.purchaseDate)} ➔ ${esc(asset.warrantyExpiry)}</p>
        </div>
        <div class="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
          <span class="text-[10px] text-slate-400 font-semibold uppercase">Antivirus Software</span>
          <p class="font-medium text-emerald-600 dark:text-emerald-400 mt-0.5">${esc(asset.antivirus)}</p>
        </div>
        <div class="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
          <span class="text-[10px] text-slate-400 font-semibold uppercase">Last Updated</span>
          <p class="font-mono text-[11px] text-slate-500 mt-0.5">${esc(asset.lastUpdated)}</p>
        </div>
      </div>
    `;

    // Assignment History Ledger
    const histContainer = document.getElementById('detailsAssignmentHistory');
    if (histContainer) {
      const history = asset.assignmentHistory || [];
      if (history.length === 0) {
        histContainer.innerHTML = `<p class="text-slate-400 text-xs py-2">No previous transfer history.</p>`;
      } else {
        histContainer.innerHTML = history.map(h => `
          <div class="flex items-start space-x-3 text-xs p-2 rounded border-l-2 border-blue-500 bg-slate-50 dark:bg-slate-800/40">
            <span class="font-mono text-[11px] text-slate-400 shrink-0">${esc(h.date)}</span>
            <div class="flex-1">
              <span class="font-bold text-slate-800 dark:text-slate-100">${esc(h.fromEmployee)} ➔ ${esc(h.toEmployee)}</span>
              <p class="text-slate-500 text-[11px] mt-0.5">${esc(h.reason)} (Assigned by: ${esc(h.assignedBy)})</p>
            </div>
          </div>
        `).join('');
      }
    }

    // Maintenance History Ledger
    const maintContainer = document.getElementById('detailsMaintenanceHistory');
    if (maintContainer) {
      const mHistory = asset.maintenanceHistory || [];
      if (mHistory.length === 0) {
        maintContainer.innerHTML = `<p class="text-slate-400 text-xs py-2">No maintenance records recorded for this system.</p>`;
      } else {
        maintContainer.innerHTML = mHistory.map(m => `
          <div class="flex items-start space-x-3 text-xs p-2 rounded border-l-2 border-amber-500 bg-slate-50 dark:bg-slate-800/40">
            <span class="font-mono text-[11px] text-slate-400 shrink-0">${esc(m.issueDate)}</span>
            <div class="flex-1">
              <div class="flex items-center justify-between">
                <span class="font-bold text-slate-800 dark:text-slate-100">${esc(m.ticketId)}: ${esc(m.type)}</span>
                <span class="text-[10px] px-1.5 py-0.5 rounded font-bold bg-amber-100 text-amber-800">${esc(m.status)}</span>
              </div>
              <p class="text-slate-600 dark:text-slate-300 text-[11px] mt-0.5">${esc(m.description)}</p>
              <p class="text-slate-400 text-[10px]">Resolution: ${esc(m.resolution || 'In diagnosis')}</p>
            </div>
          </div>
        `).join('');
      }
    }

    modal.classList.remove('hidden');
    lucide.createIcons();
  }

  function closeAssetDetails() {
    const modal = document.getElementById('assetDetailsModal');
    if (modal) modal.classList.add('hidden');
    state.selectedAssetId = null;
  }

  function printAssetDetails() {
    window.print();
  }

  // =========================================================================
  // 4. ADD / EDIT ASSET FORM & VALIDATION
  // =========================================================================
  function openAddAssetModal() {
    state.selectedAssetId = null;
    document.getElementById('assetFormModalTitle').textContent = "Register New Asset";
    const form = document.getElementById('assetUpsertForm');
    if (form) form.reset();

    // Populate dropdowns from settings
    populateFormDropdowns();
    document.getElementById('inputAssetId').removeAttribute('readonly');
    document.getElementById('assetFormModal').classList.remove('hidden');
  }

  function openEditAssetModal(assetId) {
    const asset = window.PixelStorage.getAssetById(assetId);
    if (!asset) return;

    state.selectedAssetId = asset.id;
    document.getElementById('assetFormModalTitle').textContent = `Edit Asset: ${asset.id}`;
    populateFormDropdowns();

    // Fill form fields
    const f = document.getElementById('assetUpsertForm');
    f.assetId.value = asset.id;
    f.assetId.setAttribute('readonly', 'true');
    f.employeeName.value = asset.employeeName || '';
    f.employeeId.value = asset.employeeId || '';
    f.department.value = asset.department || '';
    f.team.value = asset.team || '';
    f.assetType.value = asset.assetType || 'Desktop';
    f.brand.value = asset.brand || '';
    f.model.value = asset.model || '';
    f.serialNumber.value = asset.serialNumber || '';
    f.cpu.value = asset.cpu || '';
    f.ram.value = asset.ram || '';
    f.storage.value = asset.storage || '';
    f.os.value = asset.os || '';
    f.ipAddress.value = asset.ipAddress || '';
    f.macAddress.value = asset.macAddress || '';
    f.location.value = asset.location || '';
    f.floor.value = asset.floor || '';
    f.bay.value = asset.bay || '';
    f.purchaseDate.value = asset.purchaseDate || '';
    f.purchaseCost.value = asset.purchaseCost || 0;
    f.warrantyExpiry.value = asset.warrantyExpiry || '';
    f.status.value = asset.status || 'Assigned';
    f.maintenanceStatus.value = asset.maintenanceStatus || 'Normal';
    f.antivirus.value = asset.antivirus || '';
    f.remarks.value = asset.remarks || '';

    document.getElementById('assetFormModal').classList.remove('hidden');
  }

  function populateFormDropdowns() {
    const s = state.settings;
    const populate = (id, items) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.innerHTML = items.map(item => `<option value="${esc(item)}">${esc(item)}</option>`).join('');
    };

    populate('inputDepartment', s.departments || []);
    populate('inputTeam', s.teams || []);
    populate('inputFloor', s.floors || []);
    populate('inputLocation', s.locations || []);
    populate('inputAssetType', s.assetTypes || []);
    populate('inputStatus', s.statusOptions || []);
  }

  function handleAssetFormSubmit(e) {
    e.preventDefault();
    const f = e.target;

    const id = f.assetId.value.trim();
    const serial = f.serialNumber.value.trim();

    if (!id) {
      showToast("Asset ID is required.", "error");
      return;
    }

    // Duplicate Check
    const assets = window.PixelStorage.getAssets();
    const isEdit = !!state.selectedAssetId;

    if (!isEdit) {
      const dupId = assets.find(a => (a.id || '').toUpperCase() === id.toUpperCase());
      if (dupId) {
        showToast(`Duplicate Asset ID detected: "${id}" already exists.`, "error");
        return;
      }
      if (serial && serial !== 'NA') {
        const dupSerial = assets.find(a => (a.serialNumber || '').toUpperCase() === serial.toUpperCase());
        if (dupSerial) {
          showToast(`Duplicate Serial Number detected: "${serial}" is registered to ${dupSerial.id}.`, "error");
          return;
        }
      }
    }

    const assetData = {
      id: id,
      employeeName: f.employeeName.value.trim() || 'Unassigned',
      employeeId: f.employeeId.value.trim() || 'N/A',
      department: f.department.value,
      team: f.team.value,
      assetType: f.assetType.value,
      brand: f.brand.value.trim() || 'Dell',
      model: f.model.value.trim() || 'Standard PC',
      serialNumber: serial || `SN-${id}`,
      cpu: f.cpu.value.trim() || 'Intel Core i5',
      ram: f.ram.value.trim() || '8 GB',
      storage: f.storage.value.trim() || '256 GB SSD',
      os: f.os.value.trim() || 'Windows 11 Pro',
      ipAddress: f.ipAddress.value.trim() || '192.168.1.100',
      macAddress: f.macAddress.value.trim() || '',
      location: f.location.value,
      floor: f.floor.value,
      bay: f.bay.value.trim() || 'Floating',
      purchaseDate: f.purchaseDate.value || new Date().toISOString().split('T')[0],
      purchaseCost: parseFloat(f.purchaseCost.value) || 0,
      warrantyExpiry: f.warrantyExpiry.value || new Date(Date.now() + 365*24*60*60*1000).toISOString().split('T')[0],
      status: f.status.value,
      maintenanceStatus: f.maintenanceStatus.value,
      antivirus: f.antivirus.value.trim() || 'Standard Endpoint',
      remarks: f.remarks.value.trim()
    };

    window.PixelStorage.upsertAsset(assetData);
    closeAssetFormModal();
    showToast(`Asset "${id}" saved successfully!`, "success");
    if (state.currentTab === 'inventory') renderInventoryTable();
    else if (state.currentTab === 'dashboard') renderDashboard();
  }

  function closeAssetFormModal() {
    document.getElementById('assetFormModal').classList.add('hidden');
    state.selectedAssetId = null;
  }

  // =========================================================================
  // 5. ASSET ASSIGNMENT & TRANSFER
  // =========================================================================
  function renderAssignmentsView() {
    const assets = state.assets;
    const tbody = document.getElementById('assignmentsTableBody');
    if (!tbody) return;

    const assignedAssets = assets.filter(a => a.assignmentHistory && a.assignmentHistory.length > 0);

    tbody.innerHTML = assignedAssets.map(a => {
      const latest = a.assignmentHistory[0] || {};
      return `
        <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-xs">
          <td class="py-2.5 px-3 font-mono font-bold text-blue-600">${esc(a.id)}</td>
          <td class="py-2.5 px-3 font-bold">${esc(a.employeeName)}</td>
          <td class="py-2.5 px-3">${esc(a.team)}</td>
          <td class="py-2.5 px-3">${esc(a.assetType)} (${esc(a.brand)})</td>
          <td class="py-2.5 px-3 font-mono">${esc(latest.date || a.purchaseDate)}</td>
          <td class="py-2.5 px-3 text-slate-500">${esc(latest.fromEmployee || 'IT Pool')}</td>
          <td class="py-2.5 px-3 text-slate-600 dark:text-slate-300 font-medium">${esc(latest.reason || 'Workstation setup')}</td>
          <td class="py-2.5 px-3 text-right">
            <button onclick="window.PixelApp.openTransferModal('${esc(a.id)}')" class="px-2.5 py-1 text-xs rounded-lg bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300 font-semibold border border-purple-200 dark:border-purple-800 hover:bg-purple-100 transition">
              Transfer Asset
            </button>
          </td>
        </tr>
      `;
    }).join('');
    lucide.createIcons();
  }

  function openTransferModal(assetId) {
    const asset = window.PixelStorage.getAssetById(assetId);
    if (!asset) return;

    state.selectedAssetId = asset.id;
    document.getElementById('transferAssetId').textContent = `${asset.id} (${asset.brand} ${asset.model})`;
    document.getElementById('transferCurrentEmployee').textContent = asset.employeeName || 'Unassigned';
    document.getElementById('transferNewEmployee').value = '';
    document.getElementById('transferReason').value = 'Workstation reallocation';

    // Populate employee suggestions from SAM names
    const datalist = document.getElementById('transferEmployeeSuggestions');
    if (datalist && window.PixelDefaultData.rawSamNames) {
      datalist.innerHTML = window.PixelDefaultData.rawSamNames.map(name => `<option value="${esc(name)}">`).join('');
    }

    document.getElementById('transferModal').classList.remove('hidden');
  }

  function handleTransferSubmit(e) {
    e.preventDefault();
    if (!state.selectedAssetId) return;

    const newEmp = document.getElementById('transferNewEmployee').value.trim();
    const reason = document.getElementById('transferReason').value.trim() || 'Team Reallocation';

    if (!newEmp) {
      showToast("Please specify the recipient employee name.", "error");
      return;
    }

    const res = window.PixelStorage.transferAsset(state.selectedAssetId, newEmp, reason);
    if (res.success) {
      closeTransferModal();
      showToast(`Asset "${state.selectedAssetId}" transferred to ${newEmp}`, "success");
      if (state.currentTab === 'assignments') renderAssignmentsView();
      else if (state.currentTab === 'inventory') renderInventoryTable();
      else if (state.currentTab === 'dashboard') renderDashboard();
    }
  }

  function closeTransferModal() {
    document.getElementById('transferModal').classList.add('hidden');
    state.selectedAssetId = null;
  }

  // =========================================================================
  // 6. MAINTENANCE MANAGEMENT
  // =========================================================================
  function renderMaintenanceView() {
    const list = state.maintenance;
    const filter = state.activeMaintenanceFilter;

    const filtered = filter === 'all' ? list : list.filter(r => r.status.toLowerCase() === filter.toLowerCase());

    const tbody = document.getElementById('maintTableBody');
    if (!tbody) return;

    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="10" class="text-center py-6 text-slate-400">No maintenance tickets matching "${filter}".</td></tr>`;
      return;
    }

    tbody.innerHTML = filtered.map(t => {
      const isComplete = t.status === 'Completed';
      return `
        <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-xs">
          <td class="py-2.5 px-3 font-mono font-bold text-slate-900 dark:text-white">${esc(t.ticketId)}</td>
          <td class="py-2.5 px-3 font-mono font-bold text-blue-600">${esc(t.assetId)}</td>
          <td class="py-2.5 px-3 font-medium">${esc(t.employee)}</td>
          <td class="py-2.5 px-3 font-semibold">${esc(t.issueType)}</td>
          <td class="py-2.5 px-3 max-w-xs truncate text-slate-600 dark:text-slate-300" title="${esc(t.problemDescription)}">${esc(t.problemDescription)}</td>
          <td class="py-2.5 px-3">
            <span class="px-2 py-0.5 rounded text-[10px] font-bold ${
              t.priority === 'Urgent' ? 'bg-red-100 text-red-800' :
              t.priority === 'High' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
            }">${esc(t.priority)}</span>
          </td>
          <td class="py-2.5 px-3 font-mono">${esc(t.issueDate)}</td>
          <td class="py-2.5 px-3">
            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${
              isComplete ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
            }">${esc(t.status)}</span>
          </td>
          <td class="py-2.5 px-3 font-mono">₹${esc(t.repairCost || 0)}</td>
          <td class="py-2.5 px-3 text-right">
            ${!isComplete ? `
              <button onclick="window.PixelApp.openResolveTicketModal('${esc(t.ticketId)}')" class="px-2 py-1 text-xs rounded bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition">
                Resolve
              </button>
            ` : `<span class="text-[11px] text-slate-400 font-mono">Closed</span>`}
          </td>
        </tr>
      `;
    }).join('');
    lucide.createIcons();
  }

  function setMaintenanceFilter(filter) {
    state.activeMaintenanceFilter = filter;
    document.querySelectorAll('.maint-tab-btn').forEach(btn => {
      btn.classList.remove('bg-blue-600', 'text-white');
      btn.classList.add('bg-slate-100', 'dark:bg-slate-800', 'text-slate-600');
    });
    const activeBtn = document.getElementById(`maintTab-${filter}`);
    if (activeBtn) {
      activeBtn.classList.remove('bg-slate-100', 'dark:bg-slate-800', 'text-slate-600');
      activeBtn.classList.add('bg-blue-600', 'text-white');
    }
    renderMaintenanceView();
  }

  function openCreateTicketModal() {
    const form = document.getElementById('newTicketForm');
    if (form) form.reset();
    document.getElementById('newTicketModal').classList.remove('hidden');
  }

  function closeCreateTicketModal() {
    document.getElementById('newTicketModal').classList.add('hidden');
  }

  function handleCreateTicketSubmit(e) {
    e.preventDefault();
    const f = e.target;
    const ticket = {
      assetId: f.assetId.value.trim(),
      employee: f.employee.value.trim() || 'IT Staff',
      issueType: f.issueType.value,
      problemDescription: f.problemDescription.value.trim(),
      priority: f.priority.value,
      assignedTechnician: f.technician.value.trim() || 'Gomez Edwin',
      vendor: f.vendor.value.trim() || 'Local Spares',
      repairCost: parseFloat(f.repairCost.value) || 0,
      status: 'Open Issues',
      startDate: new Date().toISOString().split('T')[0]
    };

    window.PixelStorage.createMaintenanceTicket(ticket);
    closeCreateTicketModal();
    showToast(`Maintenance Ticket opened for ${ticket.assetId}`, "success");
    renderMaintenanceView();
  }

  function openResolveTicketModal(ticketId) {
    confirmAction(
      "Resolve Maintenance Ticket",
      `Are you sure you want to mark ticket "${ticketId}" as Completed and return the asset to normal operational fleet?`,
      () => {
        window.PixelStorage.updateMaintenanceTicket(ticketId, {
          status: 'Completed',
          resolution: 'Hardware verified & repaired by system administrator.',
          completionDate: new Date().toISOString().split('T')[0]
        });
        showToast(`Ticket ${ticketId} resolved successfully.`, "success");
        renderMaintenanceView();
      }
    );
  }

  // =========================================================================
  // 7. WARRANTY LIFECYCLE MANAGEMENT
  // =========================================================================
  function renderWarrantyView() {
    const assets = state.assets;
    const today = new Date();
    const alertDays = state.settings.warrantyAlertDays || 60;

    let activeCount = 0;
    let soonCount = 0;
    let expiredCount = 0;

    const list = assets.map(a => {
      const exp = a.warrantyExpiry ? new Date(a.warrantyExpiry) : null;
      let days = -9999;
      let status = "Expired";

      if (exp && !isNaN(exp)) {
        days = Math.ceil((exp - today) / (1000 * 60 * 60 * 24));
        if (days < 0) {
          status = "Expired";
          expiredCount++;
        } else if (days <= alertDays) {
          status = "Expiring Soon";
          soonCount++;
        } else {
          status = "Active";
          activeCount++;
        }
      } else {
        expiredCount++;
      }

      return { ...a, daysLeft: days, warrantyStatusBadge: status };
    });

    // KPI stats
    document.getElementById('warrantyActiveCount').textContent = activeCount;
    document.getElementById('warrantySoonCount').textContent = soonCount;
    document.getElementById('warrantyExpiredCount').textContent = expiredCount;

    // Table
    const tbody = document.getElementById('warrantyTableBody');
    if (!tbody) return;

    tbody.innerHTML = list.map(a => `
      <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-xs">
        <td class="py-2.5 px-3 font-mono font-bold text-blue-600">${esc(a.id)}</td>
        <td class="py-2.5 px-3 font-bold">${esc(a.employeeName)}</td>
        <td class="py-2.5 px-3">${esc(a.team)}</td>
        <td class="py-2.5 px-3">${esc(a.brand)} ${esc(a.model)}</td>
        <td class="py-2.5 px-3 font-mono text-[11px]">${esc(a.purchaseDate)}</td>
        <td class="py-2.5 px-3 font-mono text-[11px] font-bold">${esc(a.warrantyExpiry)}</td>
        <td class="py-2.5 px-3 font-mono font-bold ${a.daysLeft < 0 ? 'text-rose-600' : (a.daysLeft <= 60 ? 'text-amber-600' : 'text-emerald-600')}">
          ${a.daysLeft < 0 ? `${Math.abs(a.daysLeft)} days ago` : `${a.daysLeft} days`}
        </td>
        <td class="py-2.5 px-3">
          <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${
            a.warrantyStatusBadge === 'Active' ? 'bg-emerald-100 text-emerald-800' :
            a.warrantyStatusBadge === 'Expiring Soon' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
          }">${esc(a.warrantyStatusBadge)}</span>
        </td>
        <td class="py-2.5 px-3 text-slate-500">${esc(a.vendor || 'Authorized Reseller')}</td>
      </tr>
    `).join('');
    lucide.createIcons();
  }

  // =========================================================================
  // 8. SOFTWARE & LICENSE TRACKING
  // =========================================================================
  function renderLicensesView() {
    const list = state.licenses;
    const tbody = document.getElementById('licensesTableBody');
    if (!tbody) return;

    tbody.innerHTML = list.map(l => `
      <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-xs">
        <td class="py-2.5 px-3 font-mono font-bold text-blue-600">${esc(l.id)}</td>
        <td class="py-2.5 px-3 font-bold">${esc(l.name)}</td>
        <td class="py-2.5 px-3">${esc(l.type)}</td>
        <td class="py-2.5 px-3 font-mono text-slate-400">${esc(l.key)}</td>
        <td class="py-2.5 px-3">${esc(l.assignedEmployee)}</td>
        <td class="py-2.5 px-3 font-semibold">${l.usedSeats} / ${l.totalSeats} seats</td>
        <td class="py-2.5 px-3 font-mono text-emerald-600 font-bold">${l.availableSeats} available</td>
        <td class="py-2.5 px-3 font-mono font-bold">${esc(l.expiryDate)}</td>
        <td class="py-2.5 px-3">
          <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${
            l.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
          }">${esc(l.status)}</span>
        </td>
      </tr>
    `).join('');
    lucide.createIcons();
  }

  // =========================================================================
  // 9. DATA VALIDATION & CLEANUP CENTER
  // =========================================================================
  function renderDataValidationView() {
    const assets = state.assets;
    const issues = [];

    assets.forEach((a, idx) => {
      const upOS = (a.os || '').toUpperCase();
      if (upOS.includes('UBNTHU')) {
        issues.push({ id: a.id, field: 'Operating System', current: a.os, suggested: 'Ubuntu 24.04 LTS', type: 'Typo' });
      }
      if ((a.remarks || '').toLowerCase().includes('mother borad')) {
        issues.push({ id: a.id, field: 'Remarks', current: a.remarks, suggested: a.remarks.replace(/mother borad/gi, 'motherboard'), type: 'Typo' });
      }
      if ((a.remarks || '').toLowerCase().includes('netwrok')) {
        issues.push({ id: a.id, field: 'Remarks', current: a.remarks, suggested: a.remarks.replace(/netwrok/gi, 'network'), type: 'Typo' });
      }
      if (a.bay === 'OfficeDekstop') {
        issues.push({ id: a.id, field: 'Bay / Location', current: a.bay, suggested: 'Office Desktop', type: 'Formatting' });
      }
      if (a.cpu && a.cpu.toLowerCase().includes('dule core')) {
        issues.push({ id: a.id, field: 'CPU Spec', current: a.cpu, suggested: 'Dual Core Intel', type: 'Formatting' });
      }
    });

    document.getElementById('validationIssueCount').textContent = issues.length;
    const tbody = document.getElementById('validationTableBody');
    if (!tbody) return;

    if (issues.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" class="text-center py-8 text-emerald-600 font-bold"><i data-lucide="check-circle" class="w-5 h-5 inline mr-1"></i> All asset data conforms to enterprise normalization standards!</td></tr>`;
      lucide.createIcons();
      return;
    }

    tbody.innerHTML = issues.map((iss, i) => `
      <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-xs">
        <td class="py-2.5 px-3 font-mono font-bold text-blue-600">${esc(iss.id)}</td>
        <td class="py-2.5 px-3 font-semibold">${esc(iss.field)}</td>
        <td class="py-2.5 px-3 font-mono text-rose-600 bg-rose-50 dark:bg-rose-950/40 rounded">${esc(iss.current)}</td>
        <td class="py-2.5 px-3 font-mono text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950/40 rounded">${esc(iss.suggested)}</td>
        <td class="py-2.5 px-3"><span class="px-2 py-0.5 rounded text-[10px] bg-amber-100 text-amber-800 font-bold">${esc(iss.type)}</span></td>
        <td class="py-2.5 px-3 text-right">
          <button onclick="window.PixelApp.fixSingleDataIssue('${esc(iss.id)}', '${esc(iss.field)}', '${esc(iss.suggested)}')" class="px-2.5 py-1 text-xs rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">
            Apply Fix
          </button>
        </td>
      </tr>
    `).join('');
    lucide.createIcons();
  }

  function fixSingleDataIssue(assetId, field, suggested) {
    const assets = window.PixelStorage.getAssets();
    const asset = assets.find(a => a.id === assetId);
    if (!asset) return;

    if (field === 'Operating System') asset.os = suggested;
    else if (field === 'Remarks') asset.remarks = suggested;
    else if (field === 'Bay / Location') asset.bay = suggested;
    else if (field === 'CPU Spec') asset.cpu = suggested;

    window.PixelStorage.saveAssets(assets);
    showToast(`Normalized ${field} for ${assetId}`, "success");
    renderDataValidationView();
  }

  function fixAllDataIssues() {
    confirmAction(
      "Batch Data Normalization",
      "Are you sure you want to automatically clean and standardize all flagged typography, OS names, and formatting discrepancies across the asset inventory?",
      () => {
        const assets = window.PixelStorage.getAssets();
        assets.forEach(a => {
          if ((a.os || '').toUpperCase().includes('UBNTHU')) a.os = 'Ubuntu 24.04 LTS';
          if ((a.remarks || '').toLowerCase().includes('mother borad')) a.remarks = a.remarks.replace(/mother borad/gi, 'motherboard');
          if ((a.remarks || '').toLowerCase().includes('netwrok')) a.remarks = a.remarks.replace(/netwrok/gi, 'network');
          if (a.bay === 'OfficeDekstop') a.bay = 'Office Desktop';
          if (a.cpu && a.cpu.toLowerCase().includes('dule core')) a.cpu = 'Dual Core Intel';
        });
        window.PixelStorage.saveAssets(assets);
        showToast("All data quality issues successfully resolved!", "success");
        renderDataValidationView();
      }
    );
  }

  // =========================================================================
  // 10. ACTIVITY LOG VIEW
  // =========================================================================
  function renderActivityLogView() {
    const logs = state.activityLog;
    const tbody = document.getElementById('activityTableBody');
    if (!tbody) return;

    tbody.innerHTML = logs.map(l => `
      <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-xs">
        <td class="py-2.5 px-3 font-mono text-slate-500">${esc(l.timestamp)}</td>
        <td class="py-2.5 px-3 font-bold text-slate-900 dark:text-white">${esc(l.user)}</td>
        <td class="py-2.5 px-3"><span class="px-2 py-0.5 rounded font-bold bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 text-[11px]">${esc(l.action)}</span></td>
        <td class="py-2.5 px-3 font-mono font-bold text-indigo-600">${esc(l.assetId)}</td>
        <td class="py-2.5 px-3 text-slate-600 dark:text-slate-300">${esc(l.details)}</td>
      </tr>
    `).join('');
    lucide.createIcons();
  }

  // =========================================================================
  // 11. REPORTS CENTER
  // =========================================================================
  function renderReportsView() {
    const reportType = state.activeReportType || 'inventory';
    const container = document.getElementById('reportOutputContainer');
    if (!container) return;

    const assets = state.assets;
    let html = '';

    if (reportType === 'inventory') {
      html = `
        <div class="flex items-center justify-between mb-4">
          <h4 class="font-bold text-sm">Full Fleet Asset Inventory Report (${assets.length} items)</h4>
          <button onclick="window.PixelExcel.exportAssetsToCSV(window.PixelApp.getAssets())" class="px-3 py-1.5 text-xs font-semibold rounded bg-emerald-600 text-white flex items-center space-x-1.5">
            <i data-lucide="download" class="w-3.5 h-3.5"></i>
            <span>Export to Excel</span>
          </button>
        </div>
        <div class="overflow-x-auto custom-scrollbar">
          <table class="w-full text-left text-xs whitespace-nowrap">
            <thead class="bg-slate-50 dark:bg-slate-800 text-slate-500 font-semibold">
              <tr>
                <th class="py-2 px-3">Asset ID</th>
                <th class="py-2 px-3">Employee</th>
                <th class="py-2 px-3">Department</th>
                <th class="py-2 px-3">Model</th>
                <th class="py-2 px-3">OS</th>
                <th class="py-2 px-3">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
              ${assets.map(a => `
                <tr>
                  <td class="py-2 px-3 font-mono font-bold">${esc(a.id)}</td>
                  <td class="py-2 px-3 font-bold">${esc(a.employeeName)}</td>
                  <td class="py-2 px-3">${esc(a.department)}</td>
                  <td class="py-2 px-3">${esc(a.brand)} ${esc(a.model)}</td>
                  <td class="py-2 px-3">${esc(a.os)}</td>
                  <td class="py-2 px-3">${esc(a.status)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    } else if (reportType === 'maintenance') {
      const records = state.maintenance;
      html = `
        <div class="flex items-center justify-between mb-4">
          <h4 class="font-bold text-sm">Maintenance Operations Report (${records.length} Tickets)</h4>
          <button onclick="window.PixelExcel.exportMaintenanceToCSV(window.PixelStorage.getMaintenance())" class="px-3 py-1.5 text-xs font-semibold rounded bg-emerald-600 text-white flex items-center space-x-1.5">
            <i data-lucide="download" class="w-3.5 h-3.5"></i>
            <span>Export to Excel</span>
          </button>
        </div>
        <div class="overflow-x-auto custom-scrollbar">
          <table class="w-full text-left text-xs whitespace-nowrap">
            <thead class="bg-slate-50 dark:bg-slate-800 text-slate-500 font-semibold">
              <tr>
                <th class="py-2 px-3">Ticket ID</th>
                <th class="py-2 px-3">Asset</th>
                <th class="py-2 px-3">User</th>
                <th class="py-2 px-3">Issue</th>
                <th class="py-2 px-3">Cost</th>
                <th class="py-2 px-3">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
              ${records.map(r => `
                <tr>
                  <td class="py-2 px-3 font-mono font-bold">${esc(r.ticketId)}</td>
                  <td class="py-2 px-3 font-mono text-blue-600">${esc(r.assetId)}</td>
                  <td class="py-2 px-3">${esc(r.employee)}</td>
                  <td class="py-2 px-3">${esc(r.problemDescription)}</td>
                  <td class="py-2 px-3 font-mono">₹${r.repairCost}</td>
                  <td class="py-2 px-3 font-bold">${esc(r.status)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    } else if (reportType === 'warranty') {
      html = `
        <div class="flex items-center justify-between mb-4">
          <h4 class="font-bold text-sm">Warranty Expiration Analysis Report</h4>
          <button onclick="window.PixelExcel.exportWarrantyToCSV(window.PixelApp.getAssets())" class="px-3 py-1.5 text-xs font-semibold rounded bg-emerald-600 text-white flex items-center space-x-1.5">
            <i data-lucide="download" class="w-3.5 h-3.5"></i>
            <span>Export to Excel</span>
          </button>
        </div>
        <p class="text-xs text-slate-500 mb-3">Download comprehensive CSV report with automated 30, 60, and 90-day countdowns.</p>
      `;
    }

    container.innerHTML = html;
    lucide.createIcons();
  }

  function selectReport(type) {
    state.activeReportType = type;
    document.querySelectorAll('.report-type-btn').forEach(btn => {
      btn.classList.remove('bg-blue-50', 'text-blue-700', 'font-bold');
      btn.classList.add('text-slate-600');
    });
    const active = document.getElementById(`repBtn-${type}`);
    if (active) {
      active.classList.remove('text-slate-600');
      active.classList.add('bg-blue-50', 'text-blue-700', 'font-bold');
    }
    renderReportsView();
  }

  // =========================================================================
  // 12. EXCEL & CSV IMPORT MODAL
  // =========================================================================
  let parsedImportPayload = null;

  function openImportModal() {
    parsedImportPayload = null;
    document.getElementById('importFileSummary').classList.add('hidden');
    document.getElementById('importFileSelect').value = '';
    document.getElementById('importConfirmBtn').disabled = true;
    document.getElementById('importModal').classList.remove('hidden');
  }

  function closeImportModal() {
    document.getElementById('importModal').classList.add('hidden');
    parsedImportPayload = null;
  }

  function handleFileSelected(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (evt) {
      const text = evt.target.result;
      const rows = window.PixelExcel.parseCSVText(text);
      parsedImportPayload = window.PixelExcel.validateImportRecords(rows, state.assets);

      document.getElementById('importReadyCount').textContent = parsedImportPayload.readyRecords.length;
      document.getElementById('importDuplicateCount').textContent = parsedImportPayload.duplicateRecords.length;
      document.getElementById('importInvalidCount').textContent = parsedImportPayload.invalidRecords.length;
      document.getElementById('importFileSummary').classList.remove('hidden');

      const btn = document.getElementById('importConfirmBtn');
      btn.disabled = parsedImportPayload.readyRecords.length === 0;

      // Preview Table
      const previewTbody = document.getElementById('importPreviewTableBody');
      if (previewTbody) {
        const previewRows = [...parsedImportPayload.readyRecords.slice(0, 5)];
        previewTbody.innerHTML = previewRows.map(r => `
          <tr class="hover:bg-slate-50 text-[11px]">
            <td class="py-1 px-2 font-mono font-bold">${esc(r.id)}</td>
            <td class="py-1 px-2 font-bold">${esc(r.employeeName)}</td>
            <td class="py-1 px-2">${esc(r.team)}</td>
            <td class="py-1 px-2">${esc(r.model)}</td>
            <td class="py-1 px-2 font-mono">${esc(r.ipAddress)}</td>
            <td class="py-1 px-2"><span class="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">Valid</span></td>
          </tr>
        `).join('');
      }
    };
    reader.readAsText(file);
  }

  function commitImport() {
    if (!parsedImportPayload || parsedImportPayload.readyRecords.length === 0) return;

    const newRecords = parsedImportPayload.readyRecords;
    const current = window.PixelStorage.getAssets();
    const updated = [...newRecords, ...current];
    window.PixelStorage.saveAssets(updated);

    showToast(`Successfully imported ${newRecords.length} asset records!`, "success");
    closeImportModal();
    if (state.currentTab === 'inventory') renderInventoryTable();
    else if (state.currentTab === 'dashboard') renderDashboard();
  }

  // =========================================================================
  // 13. SETTINGS VIEW
  // =========================================================================
  function renderSettingsView() {
    const s = state.settings;
    document.getElementById('settingCompanyName').value = s.companyName || 'Pixel Web Solutions';
    document.getElementById('settingAssetPrefix').value = s.assetPrefix || 'PIX-';
    document.getElementById('settingWarrantyDays').value = s.warrantyAlertDays || 60;
  }

  function handleSettingsSubmit(e) {
    e.preventDefault();
    state.settings.companyName = document.getElementById('settingCompanyName').value.trim();
    state.settings.assetPrefix = document.getElementById('settingAssetPrefix').value.trim();
    state.settings.warrantyAlertDays = parseInt(document.getElementById('settingWarrantyDays').value, 10) || 60;

    window.PixelStorage.saveSettings(state.settings);
    showToast("Settings updated successfully!", "success");
    renderDashboard();
  }

  function factoryResetData() {
    confirmAction(
      "Factory Reset Confirmation",
      "WARNING: This will reset all assets, maintenance tickets, and assignment history back to the original verified Excel dataset. Are you sure you want to proceed?",
      () => {
        window.PixelStorage.resetAllData();
        showToast("System restored to original verified dataset.", "info");
        switchTab('dashboard');
      }
    );
  }

  // =========================================================================
  // 14. MODAL DIALOG & TOAST NOTIFICATION HELPERS
  // =========================================================================
  let confirmCallback = null;
  function confirmAction(title, message, onConfirm) {
    confirmCallback = onConfirm;
    document.getElementById('confirmModalTitle').textContent = title;
    document.getElementById('confirmModalMessage').textContent = message;
    document.getElementById('confirmModal').classList.remove('hidden');
  }

  function closeConfirmModal(proceed = false) {
    document.getElementById('confirmModal').classList.add('hidden');
    if (proceed && confirmCallback) {
      confirmCallback();
    }
    confirmCallback = null;
  }

  function showToast(message, type = "info") {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    const colors = {
      success: 'bg-emerald-600 text-white shadow-emerald-500/20',
      error: 'bg-rose-600 text-white shadow-rose-500/20',
      info: 'bg-slate-900 text-white dark:bg-slate-800 shadow-slate-900/20',
      warning: 'bg-amber-500 text-white shadow-amber-500/20'
    };

    toast.className = `p-3.5 rounded-xl shadow-lg flex items-center space-x-3 text-xs font-semibold animate-fade-in ${colors[type] || colors.info}`;
    toast.innerHTML = `<span>${esc(message)}</span>`;

    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  function initEventListeners() {
    // Escape key closes modals
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.portal-modal').forEach(m => m.classList.add('hidden'));
      }
    });
  }

  return {
    init: init,
    switchTab: switchTab,
    toggleDarkMode: toggleDarkMode,
    changeRole: changeRole,
    handleSearch: handleSearch,
    handleGlobalSearch: handleGlobalSearch,
    handleFilterChange: handleFilterChange,
    resetFilters: resetFilters,
    handleSort: handleSort,
    changePage: changePage,
    changePageSize: changePageSize,
    toggleColumnVisibilityModal: toggleColumnVisibilityModal,
    setColumnVisible: setColumnVisible,
    openAssetDetails: openAssetDetails,
    closeAssetDetails: closeAssetDetails,
    printAssetDetails: printAssetDetails,
    openAddAssetModal: openAddAssetModal,
    openEditAssetModal: openEditAssetModal,
    closeAssetFormModal: closeAssetFormModal,
    handleAssetFormSubmit: handleAssetFormSubmit,
    openTransferModal: openTransferModal,
    closeTransferModal: closeTransferModal,
    handleTransferSubmit: handleTransferSubmit,
    setMaintenanceFilter: setMaintenanceFilter,
    openCreateTicketModal: openCreateTicketModal,
    closeCreateTicketModal: closeCreateTicketModal,
    handleCreateTicketSubmit: handleCreateTicketSubmit,
    openResolveTicketModal: openResolveTicketModal,
    selectReport: selectReport,
    openImportModal: openImportModal,
    closeImportModal: closeImportModal,
    handleFileSelected: handleFileSelected,
    commitImport: commitImport,
    handleSettingsSubmit: handleSettingsSubmit,
    factoryResetData: factoryResetData,
    fixSingleDataIssue: fixSingleDataIssue,
    fixAllDataIssues: fixAllDataIssues,
    closeConfirmModal: closeConfirmModal,
    toggleTotalAssetsBreakdown: toggleTotalAssetsBreakdown,
    renderTotalAssetsBreakdown: renderTotalAssetsBreakdown,
    filterInventoryByFloor: filterInventoryByFloor,
    filterInventoryByTeam: filterInventoryByTeam,
    getAssets: () => state.assets
  };
})();

// Auto-run on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.PixelApp.init();
});
