const db = require('../../../src/server/db');

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const asset = await db.getAssetById(id);
      if (!asset) return res.status(404).json({ success: false, message: 'Asset not found' });
      return res.status(200).json({ success: true, data: asset });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ success: false, error: e.message });
    }
  }

  if (req.method === 'PUT') {
    try {
      const updated = await db.upsertAsset({ ...req.body, id });
      return res.status(200).json({ success: true, data: updated });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ success: false, error: e.message });
    }
  }

  if (req.method === 'DELETE') {
    try {
      await db.deleteAsset(id);
      return res.status(200).json({ success: true, message: `Asset ${id} deleted` });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ success: false, error: e.message });
    }
  }

  return res.status(405).json({ message: 'Method Not Allowed' });
}
