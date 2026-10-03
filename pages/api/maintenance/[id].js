const db = require('../../../src/server/db');

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'PUT') {
    const { resolution } = req.body;
    try {
      await db.resolveMaintenance(id, resolution);
      return res.status(200).json({ success: true, message: `Ticket ${id} marked as resolved` });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ success: false, error: e.message });
    }
  }

  return res.status(405).json({ message: 'Method Not Allowed' });
}
