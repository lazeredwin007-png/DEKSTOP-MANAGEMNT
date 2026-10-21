/**
 * ==========================================================================
 * APEXIT ASSET MANAGEMENT - NODE.JS & SQLITE BACKEND SERVER
 * Serves the responsive frontend dashboard and exposes full RESTful APIs.
 * Runs zero-dependency using native Node.js HTTP or Express if installed.
 * ==========================================================================
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const db = require('./database');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = __dirname;

// MIME Types for Static File Serving
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf'
};

function parseJsonBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        resolve({});
      }
    });
  });
}

function extractAuthToken(req) {
  const authHeader = req.headers['authorization'] || '';
  if (authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7).trim();
  }
  return req.headers['x-auth-token'] || '';
}

const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'SAMEORIGIN',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://fonts.googleapis.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob:; connect-src 'self' http://localhost:* ws://localhost:*; frame-ancestors 'self';"
};

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=UTF-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-auth-token',
    ...SECURITY_HEADERS
  });
  res.end(JSON.stringify(data));
}

// HTTP Server
const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;
  const method = req.method.toUpperCase();

  // CORS pre-flight
  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-auth-token'
    });
    res.end();
    return;
  }

  // =========================================================================
  // REST API ROUTING
  // =========================================================================
  if (pathname.startsWith('/api/')) {
    try {
      // 0. Authentication Endpoints (PBKDF2 SHA-512 validated against SQLite)
      if ((pathname === '/api/auth/login' || pathname === '/api/login') && method === 'POST') {
        const body = await parseJsonBody(req);
        const { username, password } = body;
        const result = db.verifyUser(username, password);
        if (result.success) {
          db.addActivity('Admin Sign-In', 'Auth', result.user.displayName || result.user.username, 'Success');
          return sendJson(res, 200, result);
        } else {
          return sendJson(res, 401, result);
        }
      }

      if ((pathname === '/api/auth/me' || pathname === '/api/me') && method === 'GET') {
        const token = extractAuthToken(req);
        const user = db.validateSession(token);
        if (user) {
          return sendJson(res, 200, { success: true, user });
        }
        return sendJson(res, 401, { success: false, message: 'Invalid or expired session token.' });
      }

      if ((pathname === '/api/auth/logout' || pathname === '/api/logout') && method === 'POST') {
        const token = extractAuthToken(req);
        db.deleteSession(token);
        return sendJson(res, 200, { success: true, message: 'Successfully logged out.' });
      }

      // 1. System Health & Database Driver Info
      if (pathname === '/api/status' && method === 'GET') {
        return sendJson(res, 200, {
          status: 'online',
          engine: 'Node.js',
          database: 'SQLite',
          driver: db.driver,
          timestamp: new Date().toISOString()
        });
      }

      // 2. Dashboard KPIs
      if (pathname === '/api/dashboard/stats' && method === 'GET') {
        return sendJson(res, 200, db.getDashboardStats());
      }

      // 3. Activity Logs
      if (pathname === '/api/activity-logs') {
        if (method === 'GET') {
          return sendJson(res, 200, db.getActivityLogs());
        }
        if (method === 'POST') {
          const body = await parseJsonBody(req);
          db.addActivity(body.action || 'Updated Asset', body.asset || '', body.user || 'SysAdmin', body.status || 'Success');
          return sendJson(res, 201, { success: true });
        }
      }

      // 4. Assets API & Component Lifecycle Management
      if (pathname === '/api/assets/next-desktop-id' && method === 'GET') {
        const nextId = db.getNextDesktopAssetId ? db.getNextDesktopAssetId() : 'PIX_DSK_41';
        return sendJson(res, 200, { nextId });
      }

      if (pathname === '/api/assets') {
        if (method === 'GET') {
          return sendJson(res, 200, db.getAllAssets());
        }
        if (method === 'POST') {
          const body = await parseJsonBody(req);
          if (!body.id) {
            if (body.type === 'Desktop') {
              body.id = db.getNextDesktopAssetId ? db.getNextDesktopAssetId() : 'PIX_DSK_41';
            } else {
              body.id = `AST-${body.type === 'Laptop' ? 'LPT' : 'DSK'}-${Math.floor(1000 + Math.random() * 9000)}`;
            }
          }
          const saved = db.insertAsset(body);
          return sendJson(res, 201, saved);
        }
      }

      if (pathname.startsWith('/api/assets/')) {
        const sub = pathname.replace('/api/assets/', '');
        const parts = sub.split('/');
        const assetId = decodeURIComponent(parts[0]);

        // Lifecycle Events for Asset: GET /api/assets/:id/lifecycle-events
        if (parts.length === 2 && parts[1] === 'lifecycle-events' && method === 'GET') {
          const events = db.getAssetComponentEvents(assetId);
          return sendJson(res, 200, events);
        }

        // Component endpoints: /api/assets/:id/components...
        if (parts[1] === 'components') {
          // GET /api/assets/:id/components
          if (parts.length === 2 && method === 'GET') {
            const comps = db.getAssetComponents(assetId);
            return sendJson(res, 200, comps);
          }
          // POST /api/assets/:id/components
          if (parts.length === 2 && method === 'POST') {
            const body = await parseJsonBody(req);
            const token = extractAuthToken(req);
            const sessionUser = db.validateSession(token);
            const created = db.insertAssetComponent({
              ...body,
              asset_id: assetId,
              created_by: sessionUser ? sessionUser.username : (body.created_by || 'admin')
            });
            db.addActivity(`Added Component (${created.component_type})`, assetId, sessionUser ? sessionUser.displayName : 'Admin', 'Success');
            return sendJson(res, 201, created);
          }

          // Component operations with componentId
          if (parts.length >= 3) {
            const componentId = decodeURIComponent(parts[2]);

            // POST /api/assets/:id/components/:componentId/replace
            if (parts.length === 4 && parts[3] === 'replace' && method === 'POST') {
              const body = await parseJsonBody(req);
              const token = extractAuthToken(req);
              const sessionUser = db.validateSession(token);
              const adminUser = sessionUser ? sessionUser.username : (body.admin_user || 'admin');
              const replaceRes = db.replaceAssetComponent(componentId, body, adminUser);
              if (replaceRes) {
                db.addActivity(`Replaced Component (${body.component_type || 'Hardware'})`, assetId, sessionUser ? sessionUser.displayName : adminUser, 'Success');
                return sendJson(res, 200, { success: true, ...replaceRes });
              }
              return sendJson(res, 404, { error: `Component ${componentId} not found` });
            }

            // GET single component: /api/assets/:id/components/:componentId
            if (parts.length === 3 && method === 'GET') {
              const comp = db.getAssetComponent(componentId);
              if (comp) return sendJson(res, 200, comp);
              return sendJson(res, 404, { error: `Component ${componentId} not found` });
            }

            // PUT /api/assets/:id/components/:componentId
            if (parts.length === 3 && method === 'PUT') {
              const body = await parseJsonBody(req);
              const token = extractAuthToken(req);
              const sessionUser = db.validateSession(token);
              const updated = db.updateAssetComponent(componentId, {
                ...body,
                admin_user: sessionUser ? sessionUser.username : (body.admin_user || 'admin')
              });
              if (updated) {
                db.addActivity(`Updated Component (${updated.component_type})`, assetId, sessionUser ? sessionUser.displayName : 'Admin', 'Success');
                return sendJson(res, 200, updated);
              }
              return sendJson(res, 404, { error: `Component ${componentId} not found` });
            }

            // DELETE /api/assets/:id/components/:componentId
            if (parts.length === 3 && method === 'DELETE') {
              const token = extractAuthToken(req);
              const sessionUser = db.validateSession(token);
              const ok = db.deleteAssetComponent(componentId, sessionUser ? sessionUser.username : 'admin');
              if (ok) {
                db.addActivity(`Deleted Component (${componentId})`, assetId, sessionUser ? sessionUser.displayName : 'Admin', 'Success');
                return sendJson(res, 200, { success: true, message: `Component ${componentId} deleted` });
              }
              return sendJson(res, 404, { error: `Component ${componentId} not found` });
            }
          }
        }

        // Standard Asset CRUD: /api/assets/:id
        if (parts.length === 1) {
          if (method === 'GET') {
            const all = db.getAllAssets();
            const asset = all.find(a => a.id === assetId);
            if (asset) {
              return sendJson(res, 200, asset);
            }
            return sendJson(res, 404, { error: `Asset ${assetId} not found` });
          }
          if (method === 'PUT') {
            const body = await parseJsonBody(req);
            const updated = db.updateAsset(assetId, body);
            return sendJson(res, 200, updated);
          }
          if (method === 'DELETE') {
            db.deleteAsset(assetId);
            return sendJson(res, 200, { success: true, message: `Asset ${assetId} deleted` });
          }
        }
      }

      // 5. Users API
      if (pathname === '/api/users') {
        if (method === 'GET') {
          return sendJson(res, 200, db.getAllUsers());
        }
        if (method === 'POST') {
          const body = await parseJsonBody(req);
          if (!body.id) body.id = `USR-${Math.floor(100 + Math.random() * 900)}`;
          const user = db.insertUser(body);
          return sendJson(res, 201, user);
        }
      }

      // 6. System Swap API
      if (pathname === '/api/swap' && method === 'POST') {
        const body = await parseJsonBody(req);
        const { oldAssetId, newUserName, newTeam, newCpu, newRam, newSsd, reason, oldUser } = body;

        // Update old system
        db.updateAsset(oldAssetId, {
          status: 'Swap',
          remark: `Swapped out for ${newUserName}. Reason: ${reason || 'Hardware Upgrade'}`
        });

        // Insert new system
        const newAssetId = body.newAssetId || `AST-DSK-${Math.floor(1000 + Math.random() * 9000)}`;
        const newAsset = db.insertAsset({
          id: newAssetId,
          type: 'Desktop',
          user: newUserName,
          team: newTeam,
          cpu: newCpu,
          ram: newRam || '32GB DDR5',
          ssd: newSsd || '1TB NVMe M.2',
          hdd: 'None',
          monitor: body.newMonitor || 'Dell 24" FHD',
          serialNumber: `SN-SWP-${Math.floor(10000 + Math.random() * 90000)}`,
          assignedDate: new Date().toISOString().substring(0, 10),
          status: 'Assigned',
          warrantyEnd: new Date(Date.now() + 3 * 365 * 86400000).toISOString().substring(0, 10)
        });

        db.addActivity(`System Swap (${oldAssetId} ➔ ${newAssetId})`, newAssetId, newUserName, 'Success');

        return sendJson(res, 200, {
          success: true,
          message: `Swap completed: ${oldAssetId} replaced by ${newAssetId}`,
          newAsset
        });
      }

      // 7. Requirements API
      if (pathname === '/api/requirements') {
        if (method === 'GET') {
          return sendJson(res, 200, db.getRequirements());
        }
        if (method === 'POST') {
          const body = await parseJsonBody(req);
          if (!body.id) body.id = `REQ-${Math.floor(100 + Math.random() * 900)}`;
          body.requestDate = new Date().toISOString().substring(0, 10);
          body.status = body.status || 'Pending';
          const reqItem = db.insertRequirement(body);
          return sendJson(res, 201, reqItem);
        }
      }

      if (pathname.startsWith('/api/requirements/') && pathname.endsWith('/assign-hardware') && method === 'POST') {
        const id = decodeURIComponent(pathname.replace('/api/requirements/', '').replace('/assign-hardware', ''));
        const body = await parseJsonBody(req);
        try {
          const hardwareId = body.hardwareId || body.asset_id;
          const assignedDate = body.assignedDate || body.assigned_date;
          const result = db.assignHardwareToRequirement(id, hardwareId, assignedDate);
          return sendJson(res, 200, { success: true, ...result });
        } catch (err) {
          return sendJson(res, 400, { success: false, error: err.message });
        }
      }

      if (pathname.startsWith('/api/requirements/')) {
        const id = decodeURIComponent(pathname.replace('/api/requirements/', ''));
        if (method === 'PUT') {
          const body = await parseJsonBody(req);
          const updated = db.updateRequirement(id, body);
          return sendJson(res, 200, { success: true, requirement: updated });
        }
        if (method === 'DELETE') {
          db.deleteRequirement(id);
          return sendJson(res, 200, { success: true, message: `Requirement ${id} deleted` });
        }
      }

      // 8. Non-IT Assets API
      if (pathname === '/api/non-it-assets') {
        if (method === 'GET') {
          return sendJson(res, 200, db.getNonItAssets());
        }
        if (method === 'POST') {
          const body = await parseJsonBody(req);
          if (!body.id) body.id = `NIT-${Math.floor(100 + Math.random() * 900)}`;
          const nonIt = db.insertNonItAsset(body);
          return sendJson(res, 201, nonIt);
        }
      }

      if (pathname.startsWith('/api/non-it-assets/') && method === 'DELETE') {
        const id = decodeURIComponent(pathname.replace('/api/non-it-assets/', ''));
        db.deleteNonItAsset(id);
        return sendJson(res, 200, { success: true });
      }

      // 9. Hardware & Stock API
      if (pathname === '/api/hardware/stock' && method === 'GET') {
        return sendJson(res, 200, db.getHardwareStock());
      }

      if (pathname === '/api/hardware/assigned' && method === 'GET') {
        return sendJson(res, 200, db.getAssignedHardware());
      }

      // 9b. INSTOCK Hardware Management API
      // 9b. INSTOCK Hardware Management & Allocations API
      if (pathname === '/api/instock/allocations' && method === 'GET') {
        return sendJson(res, 200, db.getInstockAllocations());
      }
      if (pathname === '/api/instock/allocations' && method === 'POST') {
        const body = await parseJsonBody(req);
        const saved = db.insertInstockAllocation(body);
        return sendJson(res, 201, saved);
      }
      if (pathname.startsWith('/api/instock/allocations/') && pathname.endsWith('/return') && method === 'POST') {
        const allocId = decodeURIComponent(pathname.replace('/api/instock/allocations/', '').replace('/return', ''));
        const body = await parseJsonBody(req);
        const result = db.returnInstockAsset(allocId, body.return_date, body.remark);
        return sendJson(res, 200, result);
      }
      if (pathname.startsWith('/api/instock/allocations/') && method === 'PUT') {
        const allocId = decodeURIComponent(pathname.replace('/api/instock/allocations/', ''));
        const body = await parseJsonBody(req);
        const result = db.updateInstockAllocation(allocId, body);
        return sendJson(res, 200, result);
      }
      if (pathname.startsWith('/api/instock/allocations/') && method === 'DELETE') {
        const allocId = decodeURIComponent(pathname.replace('/api/instock/allocations/', ''));
        db.deleteInstockAllocation(allocId);
        return sendJson(res, 200, { success: true });
      }
      if (pathname.startsWith('/api/instock/user-history/')) {
        const userName = decodeURIComponent(pathname.replace('/api/instock/user-history/', ''));
        return sendJson(res, 200, db.getUserAllocationHistory(userName));
      }

      if (pathname === '/api/instock') {
        if (method === 'GET') {
          return sendJson(res, 200, db.getInstockHardware());
        }
        if (method === 'POST') {
          const body = await parseJsonBody(req);
          // Required fields validation
          if (!body.component_type || (!body.spec && !body.model) || !body.serial_number || !body.purchase_date) {
            return sendJson(res, 400, { error: 'Category, Specification / Model, Serial Number, and Purchase Date are required.' });
          }
          if (!body.spec && body.model) body.spec = body.model;

          const targetId = body.id ? body.id.trim() : null;
          const allItems = db.getInstockHardware() || [];

          // Validate duplicate Asset ID
          if (targetId) {
            const exists = allItems.some(i => (i.id || '').toLowerCase() === targetId.toLowerCase());
            if (exists) {
              return sendJson(res, 409, { error: `Duplicate Asset ID: An asset with ID "${targetId}" already exists in stock.` });
            }
          }

          // Validate duplicate Serial Number
          if (body.serial_number) {
            const dupSerial = allItems.find(i => (i.serial_number || '').toLowerCase() === body.serial_number.trim().toLowerCase());
            if (dupSerial) {
              return sendJson(res, 409, { error: `Duplicate Serial Number: Serial number "${body.serial_number}" is already registered on asset ${dupSerial.id}.` });
            }
          }

          const item = db.insertInstockHardware(body);
          return sendJson(res, 201, item);
        }
      }

      // Instock History endpoints
      if (pathname === '/api/instock/history') {
        if (method === 'GET') {
          return sendJson(res, 200, db.getInstockHistory());
        }
        if (method === 'POST') {
          const body = await parseJsonBody(req);
          const saved = db.insertInstockHistory(body);
          return sendJson(res, 201, saved);
        }
      }

      if (pathname.startsWith('/api/instock/') && pathname.endsWith('/history')) {
        const id = decodeURIComponent(pathname.replace('/api/instock/', '').replace(/\/history$/, ''));
        if (method === 'GET') {
          return sendJson(res, 200, db.getInstockHistory(id));
        }
      }

      if (pathname.startsWith('/api/instock/')) {
        const id = decodeURIComponent(pathname.replace('/api/instock/', ''));
        if (method === 'GET') {
          const item = db.getInstockHardwareById(id);
          if (item) return sendJson(res, 200, item);
          return sendJson(res, 404, { error: `Asset "${id}" not found in stock.` });
        }
        if (method === 'PUT') {
          const body = await parseJsonBody(req);
          if (body.serial_number) {
            const allItems = db.getInstockHardware() || [];
            const dupSerial = allItems.find(i => i.id !== id && (i.serial_number || '').toLowerCase() === body.serial_number.trim().toLowerCase());
            if (dupSerial) {
              return sendJson(res, 409, { error: `Duplicate Serial Number: Serial number "${body.serial_number}" is already registered on asset ${dupSerial.id}.` });
            }
          }
          const updated = db.updateInstockHardware(id, body);
          return sendJson(res, 200, updated);
        }
        if (method === 'DELETE') {
          const allItems = db.getInstockHardware() || [];
          const target = allItems.find(i => (i.id || '').toLowerCase() === id.toLowerCase());
          if (target && target.status === 'Assigned') {
            return sendJson(res, 400, { error: `Cannot delete asset "${id}" because it is currently assigned to ${target.assigned_user || 'a user'}. Please return or unassign it first.` });
          }
          db.deleteInstockHardware(id);
          return sendJson(res, 200, { success: true });
        }
      }

      // 10. Network & Maintenance
      if (pathname === '/api/network/switches') {
        if (method === 'GET') {
          return sendJson(res, 200, db.getNetworkSwitches());
        }
        if (method === 'POST') {
          const body = await parseJsonBody(req);
          if (!body.id) body.id = `NET-SW-${Math.floor(10 + Math.random() * 90)}`;
          const saved = db.insertSwitch(body);
          return sendJson(res, 201, saved);
        }
      }

      if (pathname.startsWith('/api/network/switches/')) {
        const id = decodeURIComponent(pathname.replace('/api/network/switches/', ''));
        if (method === 'PUT') {
          const body = await parseJsonBody(req);
          const updated = db.updateSwitch(id, body);
          return sendJson(res, 200, updated);
        }
        if (method === 'DELETE') {
          db.deleteSwitch(id);
          return sendJson(res, 200, { success: true, message: `Switch ${id} deleted` });
        }
      }

      // Bypass IPs CRUD
      if (pathname === '/api/network/bypass-ips') {
        if (method === 'GET') {
          return sendJson(res, 200, db.getBypassIps());
        }
        if (method === 'POST') {
          const body = await parseJsonBody(req);
          if (!body.id) body.id = `BP-${Math.floor(100 + Math.random() * 900)}`;
          const saved = db.insertBypassIp(body);
          return sendJson(res, 201, saved);
        }
      }

      if (pathname.startsWith('/api/network/bypass-ips/')) {
        const id = decodeURIComponent(pathname.replace('/api/network/bypass-ips/', ''));
        if (method === 'PUT') {
          const body = await parseJsonBody(req);
          const updated = db.updateBypassIp(id, body);
          return sendJson(res, 200, updated);
        }
        if (method === 'DELETE') {
          db.deleteBypassIp(id);
          return sendJson(res, 200, { success: true, message: `Bypass IP ${id} deleted` });
        }
      }

      // Antivirus & EDR Audit CRUD
      if (pathname === '/api/maintenance/antivirus') {
        if (method === 'GET') {
          return sendJson(res, 200, db.getAntivirus());
        }
        if (method === 'POST') {
          const body = await parseJsonBody(req);
          if (!body.id) body.id = `AV-${Math.floor(100 + Math.random() * 900)}`;
          const saved = db.insertAntivirus(body);
          return sendJson(res, 201, saved);
        }
      }

      if (pathname.startsWith('/api/maintenance/antivirus/')) {
        const id = decodeURIComponent(pathname.replace('/api/maintenance/antivirus/', ''));
        if (method === 'PUT') {
          const body = await parseJsonBody(req);
          const updated = db.updateAntivirus(id, body);
          return sendJson(res, 200, updated);
        }
        if (method === 'DELETE') {
          db.deleteAntivirus(id);
          return sendJson(res, 200, { success: true, message: `Antivirus record ${id} deleted` });
        }
      }

      // Hardware Maintenance & Repairs CRUD
      if (pathname === '/api/maintenance/repairs') {
        if (method === 'GET') {
          return sendJson(res, 200, db.getRepairs());
        }
        if (method === 'POST') {
          const body = await parseJsonBody(req);
          if (!body.id) body.id = `REP-${Math.floor(100 + Math.random() * 900)}`;
          const saved = db.insertRepair(body);
          return sendJson(res, 201, saved);
        }
      }

      if (pathname.startsWith('/api/maintenance/repairs/')) {
        const id = decodeURIComponent(pathname.replace('/api/maintenance/repairs/', ''));
        if (method === 'PUT') {
          const body = await parseJsonBody(req);
          const updated = db.updateRepair(id, body);
          return sendJson(res, 200, updated);
        }
        if (method === 'DELETE') {
          db.deleteRepair(id);
          return sendJson(res, 200, { success: true, message: `Repair record ${id} deleted` });
        }
      }

      // 11. Full Database Dump / Backup
      if (pathname === '/api/database/dump' && method === 'GET') {
        return sendJson(res, 200, db.getEntireDatabase());
      }

      // 12. Fresh Database Reset & Restore
      if ((pathname === '/api/database/fresh' || pathname === '/api/database/clear') && (method === 'POST' || method === 'GET')) {
        const result = db.clearAllData();
        return sendJson(res, 200, result);
      }
      if (pathname === '/api/database/restore' && (method === 'POST' || method === 'GET')) {
        const result = db.restoreDemoData();
        return sendJson(res, 200, result);
      }

      // 404 for unknown API
      return sendJson(res, 404, { error: 'API route not found' });
    } catch (apiErr) {
      console.error('API Error:', apiErr);
      return sendJson(res, 500, { error: 'Internal Server Error', details: apiErr.message });
    }
  }

  // =========================================================================
  // STATIC FILE SERVING
  // =========================================================================
  let relativePath = pathname === '/' ? '/index.html' : pathname;
  let safePath = path.normalize(path.join(PUBLIC_DIR, relativePath));

  // Security guard against directory traversal
  if (!safePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Access Denied');
    return;
  }

  // Check file existence
  fs.stat(safePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Only fallback to index.html for clean navigation routes (no file extension or .html)
      const reqExt = path.extname(safePath).toLowerCase();
      if (!reqExt || reqExt === '.html') {
        const indexPath = path.join(PUBLIC_DIR, 'index.html');
        if (fs.existsSync(indexPath)) {
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          return fs.createReadStream(indexPath).pipe(res);
        }
      }
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end(`404 Not Found: ${pathname}`);
      return;
    }

    const ext = path.extname(safePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      ...SECURITY_HEADERS
    });
    fs.createReadStream(safePath).pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 ApexIT Asset Management Server is ACTIVE`);
  console.log(`🌐 Local URL:  http://localhost:${PORT}`);
  console.log(`💾 Database:   SQLite (${db.driver})`);
  console.log(`=======================================================`);
});
