const db = require('../../../../src/server/db');

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'POST') {
    const { newEmployee, reason, assignedBy } = req.body;
    try {
      const result = await db.transferAsset(id, newEmployee, reason, assignedBy);
      if (!result.success) return res.status(400).json(result);
      return res.status(200).json({ success: true, message: `Transferred asset ${id} to ${newEmployee}` });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ success: false, error: e.message });
    }
  }

  return res.status(405).json({ message: 'Method Not Allowed' });
}
