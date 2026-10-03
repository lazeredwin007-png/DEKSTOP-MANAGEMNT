export default async function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json({
      success: true,
      data: {
        companyName: "Pixel Web Solutions",
        assetTagPrefix: "PIXCPU",
        defaultCurrency: "INR",
        defaultWarrantyMonths: 36,
        userRole: "Admin",
        maintenanceAlertThresholdDays: 30,
        enableAuditLogging: true
      }
    });
  }

  if (req.method === 'POST') {
    return res.status(200).json({ success: true, message: "Settings saved", data: req.body });
  }

  return res.status(405).json({ message: 'Method Not Allowed' });
}
