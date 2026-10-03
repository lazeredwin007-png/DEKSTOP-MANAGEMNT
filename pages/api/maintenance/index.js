const db = require('../../../src/server/db');

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const tickets = await db.getAllMaintenance();
      return res.status(200).json({ success: true, count: tickets.length, data: tickets });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ success: false, error: e.message });
    }
  }

  if (req.method === 'POST') {
    try {
      const ticket = await db.createMaintenance(req.body);
      return res.status(201).json({ success: true, data: ticket });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ success: false, error: e.message });
    }
  }

  return res.status(405).json({ message: 'Method Not Allowed' });
}
