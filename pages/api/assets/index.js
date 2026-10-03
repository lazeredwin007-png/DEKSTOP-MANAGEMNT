const db = require('../../../src/server/db');

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const assets = await db.getAllAssets(req.query);
      return res.status(200).json({ success: true, count: assets.length, data: assets });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ success: false, error: e.message });
    }
  }

  if (req.method === 'POST') {
    try {
      const asset = await db.upsertAsset(req.body);
      return res.status(201).json({ success: true, data: asset });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ success: false, error: e.message });
    }
  }

  return res.status(405).json({ message: 'Method Not Allowed' });
}
