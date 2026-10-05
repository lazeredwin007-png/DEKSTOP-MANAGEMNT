const db = require('../../../src/server/db');

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const assetList = req.body;
      if (!Array.isArray(assetList)) {
        return res.status(400).json({ success: false, message: "Expected an array of assets" });
      }
      const result = await db.importBatchAssets(assetList);
      return res.status(200).json({ success: true, count: result.count, message: `Imported ${result.count} assets into SQLite` });
    } catch (e) {
      console.error("Batch import error:", e);
      return res.status(500).json({ success: false, error: e.message });
    }
  }

  return res.status(405).json({ message: 'Method Not Allowed' });
}
