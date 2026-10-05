const db = require('../../../src/server/db');

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      await db.clearDatabase();
      return res.status(200).json({ success: true, message: "All database tables cleared successfully" });
    } catch (e) {
      console.error("Clear DB error:", e);
      return res.status(500).json({ success: false, error: e.message });
    }
  }

  return res.status(405).json({ message: 'Method Not Allowed' });
}
