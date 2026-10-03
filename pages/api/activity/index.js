const db = require('../../../src/server/db');

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const logs = await db.getActivityLog();
      return res.status(200).json({ success: true, count: logs.length, data: logs });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ success: false, error: e.message });
    }
  }

  return res.status(405).json({ message: 'Method Not Allowed' });
}
