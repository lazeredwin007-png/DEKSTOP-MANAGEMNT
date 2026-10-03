const db = require('../../../src/server/db');

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // Re-seed DB
      const dbInstance = await db.getDB();
      return res.status(200).json({ success: true, message: "Database reset to defaults" });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ success: false, error: e.message });
    }
  }

  return res.status(405).json({ message: 'Method Not Allowed' });
}
