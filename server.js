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

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=UTF-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
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
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end();
    return;
  }

  // =========================================================================
  // REST API ROUTING
  // =========================================================================
  if (pathname.startsWith('/api/')) {
    try {
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

      // 4. Assets API
      if (pathname === '/api/assets') {
        if (method === 'GET') {
          return sendJson(res, 200, db.getAllAssets());
        }
        if (method === 'POST') {
          const body = await parseJsonBody(req);
          if (!body.id) {
            body.id = `AST-${body.type === 'Laptop' ? 'LPT' : 'DSK'}-${Math.floor(1000 + Math.random() * 9000)}`;
          }
          const saved = db.insertAsset(body);
          return sendJson(res, 201, saved);
        }
      }

      if (pathname.startsWith('/api/assets/')) {
        const id = decodeURIComponent(pathname.replace('/api/assets/', ''));
        if (method === 'GET') {
          const all = db.getAllAssets();
          const asset = all.find(a => a.id === id);
          if (asset) {
            return sendJson(res, 200, asset);
          }
          return sendJson(res, 404, { error: `Asset ${id} not found` });
        }
        if (method === 'PUT') {
          const body = await parseJsonBody(req);
          const updated = db.updateAsset(id, body);
          return sendJson(res, 200, updated);
        }
        if (method === 'DELETE') {
          db.deleteAsset(id);
          return sendJson(res, 200, { success: true, message: `Asset ${id} deleted` });
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

      if (pathname.startsWith('/api/requirements/')) {
        const id = decodeURIComponent(pathname.replace('/api/requirements/', ''));
        if (method === 'PUT') {
          const body = await parseJsonBody(req);
          db.updateRequirement(id, body.status);
          return sendJson(res, 200, { success: true });
        }
        if (method === 'DELETE') {
          db.deleteRequirement(id);
          return sendJson(res, 200, { success: true });
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

    res.writeHead(200, { 'Content-Type': contentType });
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
