/**
 * Pixel ITAM - Security & Sanitization Utilities
 * Implements strict HTML escaping, CSV Formula Injection defense, and Role-Based Access Control (RBAC).
 */

window.PixelSecurity = (function () {
  // Strict HTML Entity Escaper for DOM rendering to eliminate XSS
  function escapeHTML(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // Prevent CSV / Excel Formula Injection (DDE Attack)
  function sanitizeCSVCell(value) {
    if (value === null || value === undefined) return '""';
    let str = String(value).trim();
    // If string begins with dangerous spreadsheet execution symbols, prepend with single quote
    if (/^[=+@-]/i.test(str)) {
      str = "'" + str;
    }
    // Escape internal quotes
    str = str.replace(/"/g, '""');
    return `"${str}"`;
  }

  // RBAC Role Hierarchy
  const ROLES = {
    ADMIN: 'Admin',
    IT_STAFF: 'IT Staff',
    VIEWER: 'Viewer'
  };

  // Mask IP Address for restricted roles (e.g. Viewer)
  function formatIP(ip, currentRole) {
    if (!ip || ip === "Nill" || ip === "NA") return '<span class="text-slate-400">N/A</span>';
    if (currentRole === ROLES.VIEWER) {
      return '<span class="font-mono text-slate-400" title="Masked for Viewer Role">192.168.•••.•••</span>';
    }
    return `<span class="font-mono text-slate-700 dark:text-slate-300">${escapeHTML(ip)}</span>`;
  }

  // Mask MAC Address for restricted roles
  function formatMAC(mac, currentRole) {
    if (!mac || mac === "Nill" || mac === "NA" || mac === "") return '<span class="text-slate-400">N/A</span>';
    if (currentRole === ROLES.VIEWER) {
      return '<span class="font-mono text-slate-400" title="Masked for Viewer Role">••:••:••:••:••:••</span>';
    }
    return `<span class="font-mono text-[11px] text-slate-600 dark:text-slate-400">${escapeHTML(mac)}</span>`;
  }

  // Check if current user has permission
  function canEdit(role) {
    return role === ROLES.ADMIN || role === ROLES.IT_STAFF;
  }

  function canManageSettings(role) {
    return role === ROLES.ADMIN;
  }

  return {
    escapeHTML: escapeHTML,
    sanitizeCSVCell: sanitizeCSVCell,
    formatIP: formatIP,
    formatMAC: formatMAC,
    canEdit: canEdit,
    canManageSettings: canManageSettings,
    ROLES: ROLES
  };
})();
