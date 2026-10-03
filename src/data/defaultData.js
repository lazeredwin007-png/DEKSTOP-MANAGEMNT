/**
 * Pixel IT Asset Management - Master Default Data
 * Preserves 100% of existing user data faithfully from all sheets:
 * 1. Master Assets (70 systems)
 * 2. Floor 1 & 2 Sheet (47 systems)
 * 3. Swaps Sheet
 * 4. Requirements Sheet
 * 5. New Assets & Warranty
 * 6. Windows 11 / Antivirus
 * 7. SAM Staff Names (77 names)
 */

window.PixelDefaultData = (function () {
  const masterAssets = [
    { sno: 1, name: "Karthic S", team: "BD", ip: "WIFI", cpu: "i3 11th gen", ram: "8 DDR4", ssd: "260", hdd: "", model: "Laptop", size: "Asus VivoBook 15", os: "WINDOWS 10", mac: "JIO", asset: "Pixlap-01", bay: "B00-01", monAsset: "LCN0CV10Y748516", kb: "NA", kbAsset: "NA", mouse: "NA", mouseAsset: "NA" },
    { sno: 2, name: "Santhosh Kumar", team: "BD", ip: "WIFI", cpu: "i3 11th gen", ram: "8 DDR4", ssd: "260", hdd: "", model: "Laptop", size: "Asus VivoBook 15", os: "WINDOWS 10", mac: "JIO", asset: "Pixlap-02", bay: "B00-02", monAsset: "LCN0CV10Y74651B", kb: "NA", kbAsset: "NA", mouse: "NA", mouseAsset: "NA" },
    { sno: 3, name: "Karthick Prabhu", team: "BD", ip: "WFH", cpu: "i3 11th gen", ram: "8 DDR4", ssd: "240", hdd: "", model: "Laptop", size: "Lenovo 82H8", os: "WINDOWS 11", mac: "WFH", asset: "Pixlap-03", bay: "B00-03", monAsset: "PF2K3XJ5", kb: "NA", kbAsset: "NA", mouse: "NA", mouseAsset: "NA" },
    { sno: 4, name: "Rammohan", team: "BD", ip: "WIFI", cpu: "i3 11th Gen", ram: "8 DDR4", ssd: "240", hdd: "", model: "Laptop", size: "Lenovo 82H8", os: "WINDOWS 11", mac: "JIO", asset: "Pixlap-04", bay: "B00-04", monAsset: "PF2K3XJ5", kb: "NA", kbAsset: "NA", mouse: "NA", mouseAsset: "NA" },
    { sno: 5, name: "Ragulkrishna", team: "BD", ip: "WFH", cpu: "i3 11th Gen", ram: "8 DDR4", ssd: "", hdd: "", model: "Laptop", size: "Lenovo 82H8", os: "WINDOWS 11", mac: "WFH", asset: "Pixlap-05", bay: "B00-05", monAsset: "PF2T5AKX", kb: "NA", kbAsset: "NA", mouse: "NA", mouseAsset: "NA" },
    { sno: 6, name: "Jeeva", team: "BD", ip: "WIFI", cpu: "i3 11th Gen", ram: "8 DDR4", ssd: "240", hdd: "", model: "Laptop", size: "Lenovo 82H8", os: "WINDOWS 11", mac: "JIO", asset: "Pixlap-06", bay: "B00-06", monAsset: "PF36N6W8", kb: "NA", kbAsset: "NA", mouse: "NA", mouseAsset: "NA" },
    { sno: 7, name: "Parveen G", team: "BD", ip: "WIFI", cpu: "i3 11th Gen", ram: "8 DDR4", ssd: "240", hdd: "", model: "Laptop", size: "Lenovo 82H8", os: "WINDOWS 11", mac: "JIO", asset: "Pixlap-07", bay: "B00-07", monAsset: "PF3G27HK", kb: "NA", kbAsset: "NA", mouse: "NA", mouseAsset: "NA" },
    { sno: 8, name: "Karthic R", team: "HR Admin", ip: "WIFI", cpu: "dule core", ram: "2 DDR2", ssd: "250", hdd: "", model: "Laptop", size: "Government Laptop", os: "WINDOWS 7", mac: "JIO", asset: "Pixlap-08", bay: "B01-01", monAsset: "NA", kb: "NA", kbAsset: "NA", mouse: "NA", mouseAsset: "NA" },
    { sno: 9, name: "Arun Karthick K", team: "PHP 1", ip: "192.168.1.50", cpu: "I5 6th Gen", ram: "8 DDR4", ssd: "240", hdd: "1TB", model: "DELL D2020H", size: "19.5", os: "UBNTHU", mac: "00:e0:1a:21:01:41", asset: "PIXCPU-02", bay: "B01-03", monAsset: "PIXMON-02", kb: "logitech", kbAsset: "PIXKEY-02", mouse: "DELL", mouseAsset: "PIXMOU-02" },
    { sno: 10, name: "Balaganesan", team: "PHP 1", ip: "192.168.1.51", cpu: "i5 7th Gen", ram: "8 DDR4", ssd: "240", hdd: "1TB", model: "Lenovo", size: "23.8", os: "windows 7", mac: "B0-6E-BF-D0-7A-CC", asset: "PIXCPU-01", bay: "B01-04", monAsset: "PIXMON-01", kb: "logitech", kbAsset: "PIXKEY-01", mouse: "dell", mouseAsset: "PIXMOU-01" },
    { sno: 11, name: "Guruvarasu T", team: "PHP 1", ip: "192.168.1.52", cpu: "I3 2nd gen", ram: "8 DDR3", ssd: "240", hdd: "500", model: "DELL-E2218N", size: "19.5", os: "UBNTHU", mac: "70:54:D2:1B:13:78", asset: "PIXCPU-03", bay: "B01-05", monAsset: "PIXMON-03", kb: "Dell", kbAsset: "PIXKEY-03", mouse: "HP", mouseAsset: "PIXMOU-03" },
    { sno: 12, name: "Ramachandran", team: "PHP 1", ip: "192.168.1.53", cpu: "I5 6TH Gen", ram: "8 DDR4", ssd: "240", hdd: "500", model: "SAMSUNG-200530Z", size: "21'inch", os: "UBNTHU", mac: "DC:4A:3E:94:F9:38", asset: "PIXCPU-04", bay: "B01-06", monAsset: "PIXMON-04", kb: "DELL", kbAsset: "PIXKEY-04", mouse: "DELL", mouseAsset: "PIXMOU-04" },
    { sno: 13, name: "Vijay P", team: "PHP 1", ip: "192.168.1.65", cpu: "i5 7th Gen", ram: "8 DDR4", ssd: "240", hdd: "1TB", model: "LG", size: "19.5", os: "UBNTHU", mac: "18:31:BF:AF:E1:7E", asset: "PIXCPU-05", bay: "B01-07", monAsset: "PIXMON-05", kb: "logitech", kbAsset: "PIXKEY-05", mouse: "DELL", mouseAsset: "PIXMOU-05" },
    { sno: 14, name: "Sathish Kumar", team: "PHP 2", ip: "192.168.1.60", cpu: "I5 4th Gen", ram: "8 DDR3", ssd: "240", hdd: "", model: "BenQ-202", size: "18.5", os: "UBNTHU", mac: "00:E0:4C:D4:7F:6F", asset: "PIXCPU-06", bay: "B01-08", monAsset: "PIXMON-06", kb: "DELL", kbAsset: "PIXKEY-06", mouse: "DEll", mouseAsset: "PIXMOU-06" },
    { sno: 15, name: "deenadhayalan", team: "PHP 2", ip: "192.168.1.58", cpu: "I5 6TH Gen", ram: "8 DDR4", ssd: "240", hdd: "500", model: "SAMSUNG-LS22A33", size: "21'inch", os: "UBNTHU", mac: "2C:FD:A1:C0:A4:F5", asset: "PIXCPU-07", bay: "B01-09", monAsset: "PIXMON-07", kb: "Logitech", kbAsset: "PIXKEY-07", mouse: "Logitech", mouseAsset: "PIXMOU-07" },
    { sno: 16, name: "Ramkumar", team: "PHP 2", ip: "192.168.1.57", cpu: "I5 4th Gen", ram: "8 DDR4", ssd: "240", hdd: "1TB", model: "SAMSUNG-LS22A33", size: "21'inch", os: "WINDOWS 7", mac: "d0:50:99:65:cd:45", asset: "PIXCPU-08", bay: "B01-10", monAsset: "PIXMON-08", kb: "Logitech", kbAsset: "PIXKEY-08", mouse: "DELL", mouseAsset: "PIXMOU-08" },
    { sno: 17, name: "Ajith Kumar", team: "PHP 2", ip: "192.168.1.59", cpu: "I5 6th Gen", ram: "8 DDR4", ssd: "240", hdd: "", model: "Dell-D2020 H", size: "19.5", os: "UBNTHU", mac: "00:E0:1A:1C:01:33", asset: "PIXCPU-51", bay: "B01-11", monAsset: "PIXMON-51", kb: "Logitech", kbAsset: "PIXKEY-51", mouse: "Dell", mouseAsset: "PIXMOU-51" },
    { sno: 18, name: "Karthic T", team: "BA", ip: "WIFI", cpu: "i3 11th Gen", ram: "8 DDR4", ssd: "240", hdd: "", model: "Laptop", size: "Lenovo 82H8", os: "WINDOWS 11", mac: "JIO", asset: "Pixlap-09", bay: "B01-13", monAsset: "PF3G2G6P", kb: "NA", kbAsset: "NA", mouse: "NA", mouseAsset: "NA" },
    { sno: 19, name: "Saravanan", team: "BA", ip: "WIFI", cpu: "i3 11th Gen", ram: "8 DDR4", ssd: "240", hdd: "", model: "Laptop", size: "Lenovo 82H8", os: "WINDOWS 11", mac: "JIO", asset: "Pixlap-10", bay: "B01-14", monAsset: "PF3G2G6P", kb: "NA", kbAsset: "NA", mouse: "NA", mouseAsset: "NA" },
    { sno: 20, name: "Ravindran J", team: "Tech Team", ip: "192.168.1.61", cpu: "I3 2nd gen", ram: "8 DDR3", ssd: "", hdd: "500", model: "VIEWSONIC", size: "18.5", os: "UBNTHU", mac: "00:E0:4C:25:6A:A7", asset: "PIXCPU-09", bay: "B01-15", monAsset: "PIXMON-09", kb: "LOGITECH", kbAsset: "PIXKEY-09", mouse: "DELL", mouseAsset: "PIXMOU-09" },
    { sno: 21, name: "Sivaguru", team: "Tech Team", ip: "192.168.1.63", cpu: "I3 2nd gen", ram: "12 DDR3", ssd: "240", hdd: "500", model: "DELL", size: "18.5", os: "UBNTHU", mac: "78:2B:CB:AA:8E:6", asset: "PIXCPU-10", bay: "B01-16", monAsset: "PIXMON-10", kb: "LOGITECH", kbAsset: "PIXKEY-10", mouse: "DELL", mouseAsset: "PIXMOU-10" },
    { sno: 22, name: "Arunmozhi A", team: "Tech Team", ip: "192.168.1.62", cpu: "i5 6th Gen", ram: "16 DDR4", ssd: "240", hdd: "500", model: "DELL", size: "21 inch", os: "UBNTHU", mac: "2C:FD:A1:C0:A3:71", asset: "PIXCPU-11", bay: "B01-17", monAsset: "PIXMON-11", kb: "LOGITECH", kbAsset: "PIXKEY-11", mouse: "HP", mouseAsset: "PIXMOU-11" },
    { sno: 23, name: "Senthilkumar V", team: "Tech Team", ip: "192.168.1.85", cpu: "i5 6th Gen", ram: "8 DDR4", ssd: "260", hdd: "", model: "DELL", size: "19.5", os: "UBNTHU", mac: "D8:5E:D3:51:BB:A7", asset: "PIXCPU-12", bay: "B01-18", monAsset: "PIXMON-12", kb: "DELL", kbAsset: "PIXKEY-12", mouse: "DELL", mouseAsset: "PIXMOU-12" },
    { sno: 24, name: "Abu Bakkar Umar K", team: "Tech Team", ip: "192.168.1.69", cpu: "i5 6th Gen", ram: "16 DDR4", ssd: "260", hdd: "", model: "DELL", size: "19.5", os: "UBNTHU", mac: "D8:5E:D3:51:BC:41", asset: "PIXCPU-13", bay: "B01-20", monAsset: "PIXMON-13", kb: "DELL", kbAsset: "PIXKEY-13", mouse: "DELL", mouseAsset: "PIXMOU-13" },
    { sno: 25, name: "Arunkumar K", team: "Tech Team", ip: "192.168.1.64", cpu: "i5 7th Gen", ram: "16 DDR4", ssd: "260", hdd: "1TB", model: "DELL", size: "19.5", os: "UBNTHU", mac: "18:31:BF:AF:E2:5E:", asset: "PIXCPU-14", bay: "B01-21", monAsset: "PIXMON-14", kb: "DELL", kbAsset: "PIXKEY-14", mouse: "HP", mouseAsset: "PIXMOU-14" },
    { sno: 26, name: "Mohammed Ibrahim S", team: "Tech Team", ip: "WIFI", cpu: "I3", ram: "8", ssd: "128", hdd: "", model: "DELL", size: "19.5", os: "MAC OS", mac: "WIFI MAC", asset: "PIXCPU-15", bay: "B01-22", monAsset: "PIXMON-15", kb: "LOGITECH", kbAsset: "PIXKEY-15", mouse: "HP", mouseAsset: "PIXMOU-15" },
    { sno: 27, name: "Vinothkumar R", team: "Tech Team", ip: "192.168.1.77", cpu: "i5 7th Gen", ram: "16 DDR4", ssd: "260", hdd: "1TB", model: "DELL", size: "19.5", os: "UBNTHU", mac: "18:31:BF:AF:E2:80", asset: "PIXCPU-17", bay: "B01-23", monAsset: "PIXMON-17", kb: "DELL", kbAsset: "PIXKEY-17", mouse: "lOGITECH", mouseAsset: "PIXMOU-17" },
    { sno: 28, name: "Vignesh Kumar S", team: "Tech Team", ip: "192.168.1.99", cpu: "I5 6th Gen", ram: "16 DDR4", ssd: "240", hdd: "1TB", model: "DELL", size: "19.5", os: "UBNTHU", mac: "D8:5E:D3:1C:C5:FF", asset: "PIXCPU-18", bay: "B01-24", monAsset: "PIXMON-18", kb: "DELL", kbAsset: "PIXKEY-18", mouse: "MOUSE", mouseAsset: "PIXMOU-18" },
    { sno: 29, name: "Balaksrishnan N", team: "Testing", ip: "192.168.1.180", cpu: "I5 4th Gen", ram: "8 DDR3", ssd: "", hdd: "500", model: "ACER", size: "18.5", os: "WINDOWS 10", mac: "98:90:96:D1:8E:9B", asset: "PIXCPU-19", bay: "B01-25", monAsset: "PIXMON-19", kb: "LOGITECH", kbAsset: "PIXKEY-19", mouse: "DELL", mouseAsset: "PIXMOU-19" },
    { sno: 30, name: "Deepan B", team: "Testing", ip: "192.168.1.97", cpu: "I5 4th Gen", ram: "8 DDR3", ssd: "", hdd: "500", model: "DELL", size: "21", os: "UBNTHU", mac: "98:90:96:D1:8E:9B", asset: "PIXCPU-20", bay: "B01-26", monAsset: "PIXMON-20", kb: "LOGITECH", kbAsset: "PIXKEY-20", mouse: "DELL", mouseAsset: "PIXMOU-20" },
    { sno: 31, name: "Jaishreenaatth V A", team: "Testing", ip: "192.168.1.98", cpu: "I3 2nd gen", ram: "8 DDR3", ssd: "", hdd: "500", model: "BENQ", size: "15.5", os: "UBNTHU", mac: "00:E0:4C:31:DF:A2", asset: "PIXCPU-21", bay: "B01-27", monAsset: "PIXMON-21", kb: "LOGITECH", kbAsset: "PIXKEY-21", mouse: "DELL", mouseAsset: "PIXMOU-21" },
    { sno: 32, name: "Gokul S", team: "Testing", ip: "192.168.1.81", cpu: "I5 4th Gen", ram: "8 DDR3", ssd: "", hdd: "500", model: "VIEWSONIC", size: "15.5", os: "", mac: "98:90:96:C9:EC:A7", asset: "PIXCPU-22", bay: "B01-28", monAsset: "PIXMON-22", kb: "LOGITECH", kbAsset: "PIXKEY-22", mouse: "HP", mouseAsset: "PIXMOU-22" },
    { sno: 33, name: "Karthiga devi", team: "HR", ip: "192.168.1.73", cpu: "I3 2nd gen", ram: "8 DDR3", ssd: "", hdd: "500", model: "Chirag", size: "15.5", os: "WINDOWS 10", mac: "00:E0:4C:D2:C0:5D", asset: "PIXCPU-23", bay: "B01-29", monAsset: "PIXMON-23", kb: "DELL", kbAsset: "PIXKEY-23", mouse: "Dell", mouseAsset: "PIXMOU-23" },
    { sno: 34, name: "Tharani", team: "HR", ip: "192.168.1.92", cpu: "I3 11th gen", ram: "8 DDR3", ssd: "", hdd: "320", model: "Dell", size: "18.5", os: "UBNTHU", mac: "90:b1:1c:72:64:1d", asset: "PIXCPU-24", bay: "B01-32", monAsset: "PIXMON-24", kb: "Dell", kbAsset: "PIXKEY-24", mouse: "Dell", mouseAsset: "PIXMOU-24" },
    { sno: 35, name: "Meimozhi", team: "HR", ip: "192.168.1.92", cpu: "i3 3rd Gen", ram: "8 DDR3", ssd: "", hdd: "320", model: "Dell", size: "15.5", os: "UBNTHU", mac: "b0:83:fe:8e:4f:fb", asset: "PIXCPU-25", bay: "B01-33", monAsset: "PIXMON-25", kb: "DELL", kbAsset: "PIXKEY-25", mouse: "Dell", mouseAsset: "PIXMOU-25" },
    { sno: 36, name: "Bindo J", team: "HR Admin", ip: "192.168.6.51", cpu: "i3 3rd Gen", ram: "3 DDR3", ssd: "", hdd: "320", model: "Dell", size: "15.5", os: "WINDOWS 10", mac: "38:60:77:56:51:90", asset: "PIXCPU-26", bay: "B02-01", monAsset: "PIXMON-26", kb: "DELL", kbAsset: "PIXKEY-26", mouse: "Dell", mouseAsset: "PIXMOU-26" },
    { sno: 37, name: "Joshkia P", team: "SEO", ip: "192.168.6.58", cpu: "i3 3rd Gen", ram: "8 DDR3", ssd: "240 (LAPTOP DISK)", hdd: "", model: "DELL", size: "18.5", os: "UBNTHU", mac: "d00:50:99:43:63:18", asset: "PIXCPU-49", bay: "B02-10", monAsset: "PIXMON-49", kb: "DELL", kbAsset: "PIXKEY-49", mouse: "DELL", mouseAsset: "PIXMOU-49" },
    { sno: 38, name: "Sobiya RS", team: "SEO", ip: "192.168.6.61", cpu: "I3 2nd gen", ram: "8 DDR3", ssd: "", hdd: "500", model: "DELL", size: "18.5", os: "UBNTHU", mac: "d4:be:d9:8f:62:9a", asset: "PIXCPU-34", bay: "B02-11", monAsset: "PIXMON-34", kb: "DELL", kbAsset: "PIXKEY-34", mouse: "DELL", mouseAsset: "PIXMOU-34" },
    { sno: 39, name: "Lakshmi M", team: "SEO", ip: "192.168.6.77", cpu: "Intel Pentium", ram: "4 DDR3", ssd: "240", hdd: "", model: "Laptop", size: "acer aspir /UNGFTSI006H0690800", os: "WINDOWS 7", mac: "fc:45:96:59:9a:a9", asset: "Pixlap-13", bay: "B02-12", monAsset: "NA", kb: "DELL", kbAsset: "NA", mouse: "DELL", mouseAsset: "NA" },
    { sno: 40, name: "Manju Priyadharshini R", team: "SEO", ip: "192.168.6.83", cpu: "I3 2nd gen", ram: "12 DDR3", ssd: "", hdd: "500", model: "SAMSUNG", size: "21.1", os: "UBNTHU", mac: "18:03:73:3E:5A:AE", asset: "PIXCPU-35", bay: "B02-13", monAsset: "PIXMON-35", kb: "DELL", kbAsset: "PIXKEY-35", mouse: "DELL", mouseAsset: "PIXMOU-35" },
    { sno: 41, name: "Nagajothika K R", team: "SEO", ip: "192.168.6.84", cpu: "I5 2nd gen", ram: "8 DDR4", ssd: "", hdd: "500", model: "DELL", size: "15.5", os: "UBNTHU", mac: "D8:5E:D3:1C:C5:DF", asset: "PIXCPU-36", bay: "B02-14", monAsset: "PIXMON-36", kb: "LOGITECH", kbAsset: "PIXKEY-36", mouse: "Dell", mouseAsset: "PIXMOU-36" },
    { sno: 42, name: "Niveda", team: "SEO", ip: "192.168.6.78", cpu: "I5 7th gen", ram: "8 DDR4", ssd: "240", hdd: "", model: "View Sonic", size: "15.5", os: "UBNTHU", mac: "18:31:BF:B2:76:46", asset: "PIXCPU-37", bay: "B02-15", monAsset: "PIXMON-37", kb: "LOGITECH", kbAsset: "PIXKEY-37", mouse: "HP", mouseAsset: "PIXMOU-37" },
    { sno: 43, name: "Rajeshwari M", team: "SEO", ip: "192.168.6.66", cpu: "I5 2nd gen", ram: "8 DDR3", ssd: "", hdd: "500", model: "DELL", size: "15.5", os: "UBNTHU", mac: "Nill", asset: "PIXCPU-38", bay: "B02-16", monAsset: "PIXMON-38", kb: "LOGITECH", kbAsset: "PIXKEY-38", mouse: "DELL", mouseAsset: "PIXMOU-38" },
    { sno: 44, name: "Archana P", team: "SEO", ip: "192.168.6.72", cpu: "i3 4th", ram: "4 DDR3", ssd: "500", hdd: "", model: "Laptop", size: "Soni Vaio /27544370-7005450", os: "WINDOWS 10", mac: "78:84:3C:F7:5E:A9", asset: "Pixlap-14", bay: "B02-17", monAsset: "NA", kb: "zebronics", kbAsset: "NA", mouse: "DELL", mouseAsset: "NA" },
    { sno: 45, name: "Gomez Edwin", team: "System Admin", ip: "OFFICE LAP", cpu: "i3 11th Gen", ram: "8 DDR4", ssd: "240", hdd: "", model: "Laptop", size: "Lenovo 82H8", os: "WINDOWS 11", mac: "", asset: "Pixlap-15", bay: "B03-02", monAsset: "PF3FRQ32", kb: "Dell", kbAsset: "NA", mouse: "DELL", mouseAsset: "NA" },
    { sno: 46, name: "Saravanan Balan", team: "UI", ip: "192.168.6.65", cpu: "I5 6th Gen", ram: "8 DDR3", ssd: "240", hdd: "500", model: "WIPRO", size: "18.5", os: "WINDOWS 10", mac: "18:31:BF:BA:F4:96", asset: "PIXCPU-39", bay: "B03-06", monAsset: "PIXMON-39", kb: "LOGITECH", kbAsset: "PIXKEY-39", mouse: "DELL", mouseAsset: "PIXMOU-39" },
    { sno: 47, name: "Karthick P", team: "UI", ip: "OfficeDekstop", cpu: "", ram: "", ssd: "", hdd: "", model: "", size: "", os: "", mac: "", asset: "PIXCPU-40", bay: "B03-07", monAsset: "PIXMON-40", kb: "", kbAsset: "PIXKEY-40", mouse: "", mouseAsset: "PIXMOU-40" },
    { sno: 48, name: "Sudhakar R", team: "UI", ip: "192.168.6.81", cpu: "I5 4th Gen", ram: "8 DDR3", ssd: "240", hdd: "", model: "DELL", size: "21 inch", os: "WINDOWS 10", mac: "64-00-6A-52-A2-85", asset: "PIXCPU-41", bay: "B03-08", monAsset: "PIXMON-41", kb: "DELL", kbAsset: "PIXKEY-41", mouse: "DELL", mouseAsset: "PIXMOU-41" },
    { sno: 49, name: "Kannan T G", team: "UI", ip: "192.168.6.82", cpu: "I5 3rd", ram: "8 DDR3", ssd: "240", hdd: "", model: "DELL", size: "21 inch", os: "WINDOWS 10", mac: "00-23-24-63-C1-50", asset: "PIXCPU-42", bay: "B03-09", monAsset: "PIXMON-42", kb: "DELL", kbAsset: "PIXKEY-42", mouse: "DELL", mouseAsset: "PIXMOU-42" },
    { sno: 50, name: "Vanitha B", team: "UI", ip: "192.168.6.69", cpu: "I5 6th Gen", ram: "8 DDR4", ssd: "240", hdd: "", model: "DELL", size: "15.5", os: "WINDOWS 10", mac: "00-E0-1A-1A-21-1E", asset: "PIXCPU-43", bay: "B03-10", monAsset: "PIXMON-43", kb: "LOGITECH", kbAsset: "PIXKEY-43", mouse: "DELL", mouseAsset: "PIXMOU-43" },
    { sno: 51, name: "Prasanna N V", team: "UI", ip: "192.168.6.74", cpu: "I5 6th Gen", ram: "8 DDR4", ssd: "240", hdd: "500", model: "SAMSUNG", size: "21 INCH", os: "WINDOWS 10", mac: "FC-34-97-67-8A-70", asset: "PIXCPU-44", bay: "B03-11", monAsset: "PIXMON-44", kb: "LOGITECH", kbAsset: "PIXKEY-44", mouse: "DELL", mouseAsset: "PIXMOU-44" },
    { sno: 52, name: "Vinothkumar E", team: "UI", ip: "192.168.6.73", cpu: "I5 7th Gen", ram: "8 DDR4", ssd: "240", hdd: "500", model: "BENQ", size: "18.5", os: "WINDOWS 10", mac: "18-33-EF-6E-F6-DB", asset: "PIXCPU-45", bay: "B03-12", monAsset: "PIXMON-45", kb: "LOGITECH", kbAsset: "PIXKEY-45", mouse: "HP", mouseAsset: "PIXMOU-45" },
    { sno: 53, name: "Manojkumar S", team: "SEO", ip: "WIFI", cpu: "i3 11th Gen", ram: "8 DDR4", ssd: "240", hdd: "", model: "Laptop", size: "Lenovo 82H8", os: "WINDOWS 11", mac: "DIJISOL", asset: "Pixlap-12", bay: "B03-13", monAsset: "PF3447RT", kb: "LOGITECH", kbAsset: "NA", mouse: "DELL", mouseAsset: "NA" },
    { sno: 54, name: "Sinu Thomas TG", team: "SEO", ip: "WIFI", cpu: "i3 11th Gen", ram: "8 DDR4", ssd: "240", hdd: "", model: "Laptop", size: "Lenovo 82H8", os: "WINDOWS 11", mac: "DIJISOL", asset: "Pixlap-11", bay: "B03-14", monAsset: "PF3G20Q5", kb: "LOGITECH", kbAsset: "NA", mouse: "DELL", mouseAsset: "NA" },
    { sno: 55, name: "Vijay M", team: "SEO", ip: "192.168.6.87", cpu: "I3 2nd gen", ram: "8 DDR3", ssd: "160", hdd: "", model: "LG", size: "15.5", os: "UBNTHU", mac: "64:00:6A:37:28:5F", asset: "PIXCPU-28", bay: "B03-15", monAsset: "PIXMON-28", kb: "DELL", kbAsset: "PIXKEY-28", mouse: "DELL", mouseAsset: "PIXMOU-28" },
    { sno: 56, name: "Praveen Kumar K A", team: "UI", ip: "192.168.6.62", cpu: "I5 6th Gen", ram: "8 DDR4", ssd: "500", hdd: "", model: "Lenovo", size: "21", os: "Windows 10", mac: "48-0F-CF-3C-44-29", asset: "PIXCPU-47", bay: "B03-16", monAsset: "PIXMON-47", kb: "DELL", kbAsset: "PIXKEY-47", mouse: "DELL", mouseAsset: "PIXMOU-47" },
    { sno: 57, name: "Vanuvamalai Perumal", team: "Lead Generation", ip: "192.168.6.79", cpu: "I5 3rd", ram: "8 DDR3", ssd: "240", hdd: "", model: "DELL", size: "18.5", os: "WINDOWS10", mac: "D0-50-99-65-C8-64", asset: "PIXCPU-48", bay: "B03-17", monAsset: "PIXMON-48", kb: "DELL", kbAsset: "PIXKEY-48", mouse: "DELL", mouseAsset: "PIXMOU-48" },
    { sno: 58, name: "Rajamadasami M", team: "SEO", ip: "192.168.6.89", cpu: "I3 2nd gen", ram: "8 DDR3", ssd: "", hdd: "500", model: "BENQ", size: "15.5", os: "UBNTHU", mac: "8:03:73:45:CB:DC", asset: "PIXCPU-31", bay: "B03-18", monAsset: "PIXMON-31", kb: "DELL", kbAsset: "PIXKEY-31", mouse: "DELL", mouseAsset: "PIXMOU-31" },
    { sno: 59, name: "Udhaya Prakash P", team: "SEO", ip: "192.168.6.80", cpu: "I3 5th gen", ram: "6 DDR3", ssd: "", hdd: "500", model: "DELL", size: "18.5", os: "UBNTHU", mac: "00:E0:4A:0B:1C:31", asset: "PIXCPU-32", bay: "B03-19", monAsset: "PIXMON-32", kb: "LOGITECH", kbAsset: "PIXKEY-32", mouse: "HP", mouseAsset: "PIXMOU-32" },
    { sno: 60, name: "Sundaraperumal M", team: "SEO", ip: "192.168.6.52", cpu: "i3 3rd Gen", ram: "8 DDR3", ssd: "", hdd: "500", model: "DELL", size: "18.5", os: "UBNTHU", mac: "D0:50:99:65:CD:45", asset: "PIXCPU-46", bay: "B03-20", monAsset: "PIXMON-46", kb: "LOGITECH", kbAsset: "PIXKEY-46", mouse: "DELL", mouseAsset: "PIXMOU-46" },
    { sno: 61, name: "Durai Prakash S", team: "SEO", ip: "192.168.6.59", cpu: "I5 4th Gen", ram: "8 DDR3", ssd: "", hdd: "500", model: "DELL", size: "18.5", os: "UBNTHU", mac: "40:A8:F0:47:6D:AB", asset: "PIXCPU-50", bay: "B03-21", monAsset: "PIXMON-50", kb: "DELL", kbAsset: "PIXKEY-50", mouse: "DELL", mouseAsset: "PIXMOU-50" },
    { sno: 62, name: "Surya PG", team: "SEO", ip: "192.168.6.60", cpu: "I5 4th Gen", ram: "8 DDR3", ssd: "", hdd: "500", model: "LG", size: "18.5", os: "UBNTHU", mac: "64:00:6A:52:A2:0D", asset: "PIXCPU-51", bay: "B03-22", monAsset: "PIXMON-51", kb: "DELL", kbAsset: "PIXKEY-51", mouse: "DELL", mouseAsset: "PIXMOU-51" },
    { sno: 63, name: "Manojkumar", team: "SEO", ip: "192.168.6.90", cpu: "I3 2nd gen", ram: "8 DDR3", ssd: "240", hdd: "", model: "DELL", size: "15.5", os: "UBNTHU", mac: "64:00:6A:37:28:5F", asset: "PIXCPU-29", bay: "B03-23", monAsset: "PIXMON-29", kb: "LOGITECH", kbAsset: "PIXKEY-29", mouse: "DELL", mouseAsset: "PIXMOU-29" },
    { sno: 64, name: "Venkadesan S", team: "SEO", ip: "192.168.6.85", cpu: "I3 4th gen", ram: "8 DDR3", ssd: "240", hdd: "", model: "FOXIN", size: "15.5", os: "UBNTHU", mac: "00:E0:4C:D4:7F:72", asset: "PIXCPU-33", bay: "B03-24", monAsset: "PIXMON-33", kb: "LOGITECH", kbAsset: "PIXKEY-33", mouse: "HP", mouseAsset: "PIXMOU-33" },
    { sno: 65, name: "Jayaprakash S", team: "SEO", ip: "192.168.6.70", cpu: "I3 2nd gen", ram: "6 DDR3", ssd: "", hdd: "500", model: "DELL", size: "15.5", os: "UBNTHU", mac: "64:00:6A:37:28:5F", asset: "PIXCPU-30", bay: "B03-25", monAsset: "PIXMON-30", kb: "DELL", kbAsset: "PIXKEY-30", mouse: "Logitech", mouseAsset: "PIXMOU-30" },
    { sno: 66, name: "Uttam Singh A", team: "SEO", ip: "192.168.6.63", cpu: "Intel Pentium", ram: "6 DDR3", ssd: "", hdd: "1TB", model: "DELL", size: "15.5", os: "UBNTHU", mac: "ec:a8:6b:f0:b2:e3", asset: "PIXCPU-27", bay: "B03-26", monAsset: "PIXMON-27", kb: "DELL", kbAsset: "PIXKEY-27", mouse: "Logitech", mouseAsset: "PIXMOU-27" },
    { sno: 67, name: "Vinitha", team: "PHP 1", ip: "WFH", cpu: "i3 11th Gen", ram: "8 DDR4", ssd: "240", hdd: "", model: "Laptop", size: "Lenovo 82H8", os: "WINDOWS 11", mac: "", asset: "Pixlap-16", bay: "WFH", monAsset: "PF30ETDE", kb: "NA", kbAsset: "NA", mouse: "NA", mouseAsset: "NA" },
    { sno: 68, name: "Kalavathy", team: "PHP 2", ip: "OfficeDekstop", cpu: "", ram: "", ssd: "", hdd: "", model: "", size: "", os: "", mac: "", asset: "PIXCPU-68", bay: "WFH", monAsset: "", kb: "", kbAsset: "", mouse: "", mouseAsset: "" },
    { sno: 69, name: "Vijayaraman K", team: "PHP 2", ip: "OWNE", cpu: "i5 10th Gen", ram: "16 DDR4", ssd: "512", hdd: "", model: "Personal Laptop", size: "15.6", os: "Windows 11", mac: "", asset: "PIX-OWN-01", bay: "WFH", monAsset: "", kb: "", kbAsset: "", mouse: "", mouseAsset: "" },
    { sno: 70, name: "John Noel Kirubaharan", team: "SEO", ip: "OWNE", cpu: "i7 11th Gen", ram: "16 DDR4", ssd: "512", hdd: "", model: "Personal Laptop", size: "15.6", os: "Windows 11", mac: "", asset: "PIX-OWN-02", bay: "WFH", monAsset: "", kb: "", kbAsset: "", mouse: "", mouseAsset: "" }
  ];

  const floor12Data = [
    { no: 1, name: "Gome Edwin Lazer Y", team: "System Admin", ip: "192.168.6.99", type: "Desktop", model: "CPU", cpu: "i3 2nd Gen", ram: "8 DDR3", ssd: "240", hdd: "Nill", mon: "DELL 22 inch", os: "Windows", block: "1ST FLOOR", remarks: "Bypass IP", status: "ASSINGED" },
    { no: 2, name: "Siva Ganesh S", team: "SEO", ip: "192.168.6.77", type: "Desktop", model: "CPU", cpu: "i3 2nd Gen", ram: "8 DDR3", ssd: "240", hdd: "Nill", mon: "DELL 19.5 inch", os: "UBNTHU 24", block: "1ST FLOOR", remarks: "Good Working", status: "ASSINGED" },
    { no: 3, name: "Charanya D", team: "SEO", ip: "192.168.6.78", type: "Laptop", model: "Lenovo Thinkpad 3", cpu: "i5 10th GEN", ram: "8 DDR3", ssd: "240", hdd: "Nill", mon: "LAPTOP - LENOVO - IDEALPAD3", os: "WINDOWS 11 (Original)", block: "1ST FLOOR", remarks: "Good Working", status: "ASSINGED" },
    { no: 4, name: "Ramees Fathima C", team: "SEO", ip: "192.168.6.153", type: "Desktop", model: "CPU", cpu: "i3 2nd Gen", ram: "8 DDR3", ssd: "240", hdd: "Nill", mon: "DELL 19.5 inch", os: "UBNTHU 24", block: "1ST FLOOR", remarks: "Good Working", status: "ASSINGED" },
    { no: 5, name: "Rajeshwari M", team: "SEO", ip: "192.168.6.112", type: "Desktop", model: "CPU", cpu: "i5 4th GEN", ram: "8 DDR3", ssd: "240", hdd: "Nill", mon: "DELL 19.5 inch", os: "UBNTHU 24", block: "1ST FLOOR", remarks: "Good Working", status: "ASSINGED" },
    { no: 6, name: "Mohamed Sahil M", team: "SEO", ip: "192.168.6.91", type: "Desktop", model: "CPU", cpu: "i3 2nd Gen", ram: "8 DDR3", ssd: "240", hdd: "Nill", mon: "DELL 19.5 inch", os: "UBNTHU 24", block: "1ST FLOOR", remarks: "Slowness", status: "ASSINGED" },
    { no: 7, name: "Ragul SV", team: "SEO", ip: "192.168.6.85", type: "Desktop", model: "CPU", cpu: "i5 4th GEN", ram: "8 DDR3", ssd: "240", hdd: "Nill", mon: "DELL 18.5 inch", os: "UBNTHU 24", block: "1ST FLOOR", remarks: "Netwrok issue", status: "ASSINGED" },
    { no: 8, name: "Prabhakaran", team: "SEO", ip: "192.168.6.95", type: "Desktop", model: "CPU", cpu: "i5 6th GEN", ram: "16GB DDR4", ssd: "240", hdd: "Nill", mon: "DELL 21.5 inch", os: "Windows 10", block: "1ST FLOOR", remarks: "Good Working", status: "ASSINGED" },
    { no: 9, name: "Mohanapriya", team: "SEO", ip: "192.168.6.96", type: "Desktop", model: "CPU", cpu: "i3 2nd Gen", ram: "8 GB DDR3", ssd: "240", hdd: "Nill", mon: "DELL 18.5 inch", os: "Windows 10", block: "1ST FLOOR", remarks: "Good Working", status: "ASSINGED" },
    { no: 10, name: "Gayathri K", team: "HR", ip: "192.168.6.53", type: "Desktop", model: "CPU", cpu: "i3 2nd Gen", ram: "8 GB DDR3", ssd: "240", hdd: "Nill", mon: "DELL 19.5 inch", os: "UBNTHU 24", block: "1ST FLOOR", remarks: "Good Working", status: "ASSINGED" },
    { no: 11, name: "Sugitha Sri", team: "HR", ip: "192.168.6.78", type: "Desktop", model: "CPU", cpu: "i3 2nd Gen", ram: "8 GB DDR3", ssd: "240", hdd: "Nill", mon: "DELL 19.5 inch", os: "UBNTHU 24", block: "1ST FLOOR", remarks: "Good Working", status: "ASSINGED" },
    { no: 12, name: "Nishalini", team: "SEO", ip: "192.168.6.53", type: "Laptop", model: "Lenovo Thinkpad 3", cpu: "i5 10th GEN", ram: "8 DDR3", ssd: "240", hdd: "Nill", mon: "LAPTOP - LENOVO - IDEALPAD3", os: "WINDOWS 11 (Original)", block: "1ST FLOOR", remarks: "Good Working", status: "ASSINGED" },
    { no: 13, name: "Bindo", team: "HR", ip: "192.168.1.93", type: "Desktop", model: "CPU", cpu: "i3 2nd Gen", ram: "8 DDR3", ssd: "240", hdd: "Nill", mon: "DELL 19.5 inch", os: "Windows", block: "2ND FLOOR", remarks: "Good Working", status: "ASSINGED" },
    { no: 15, name: "Karthick CN", team: "HR", ip: "192.168.1.94", type: "Desktop", model: "CPU", cpu: "i5 6th GEN", ram: "16GB DDR4", ssd: "240", hdd: "Nill", mon: "View Sonic 18.5", os: "UBNTHU 24", block: "2ND FLOOR", remarks: "Good Working", status: "ASSINGED" },
    { no: 16, name: "Veerapandi L", team: "PHP", ip: "192.168.1.94", type: "Desktop", model: "CPU", cpu: "i5 7th GEN", ram: "16GB DDR4", ssd: "240", hdd: "500 GB", mon: "DELL 19.5 inch", os: "UBNTHU 24", block: "2ND FLOOR", remarks: "Good Working", status: "ASSINGED" },
    { no: 17, name: "Ramkumar", team: "PHP", ip: "192.168.1.54", type: "Desktop", model: "CPU", cpu: "i5 7th GEN", ram: "16GB DDR4", ssd: "240", hdd: "Nill", mon: "Samsung 20 inch", os: "UBNTHU 24", block: "2ND FLOOR", remarks: "Good Working", status: "ASSINGED" },
    { no: 18, name: "Deenadhayalan", team: "PHP", ip: "192.168.1.58", type: "Desktop", model: "CPU", cpu: "i5 6th GEN", ram: "16GB DDR4", ssd: "240", hdd: "500 GB", mon: "Samsung 20 inch", os: "UBNTHU 24", block: "2ND FLOOR", remarks: "Good Working", status: "ASSINGED" },
    { no: 19, name: "Arun", team: "PHP", ip: "192.168.1.96", type: "Desktop", model: "CPU", cpu: "i5 7th GEN", ram: "16GB DDR4", ssd: "240", hdd: "1 TB", mon: "DELL 19.5 inch", os: "UBNTHU 24", block: "2ND FLOOR", remarks: "Good Working", status: "ASSINGED" },
    { no: 20, name: "Saravanan S", team: "BD", ip: "192.168.1.65", type: "Laptop", model: "Lenovo Thinkpad 3", cpu: "i3 11th GEN", ram: "8 GB DDR4", ssd: "240", hdd: "Nill", mon: "LAPTOP - LENOVO - IDEALPAD3", os: "WINDOWS 11 (Original)", block: "2ND FLOOR", remarks: "Good Working", status: "ASSINGED" },
    { no: 21, name: "Balaraman", team: "PHP", ip: "192.168.1.82", type: "Desktop", model: "CPU", cpu: "i5 6th GEN", ram: "16GB DDR4", ssd: "240", hdd: "Nill", mon: "DELL 19.5 inch", os: "UBNTHU 24", block: "2ND FLOOR", remarks: "Good Working", status: "ASSINGED" },
    { no: 22, name: "Guruvarasu", team: "PHP", ip: "192.168.1.52", type: "Desktop", model: "CPU", cpu: "i5 6th GEN", ram: "16GB DDR4", ssd: "240", hdd: "Nill", mon: "DELL 19.5 inch", os: "UBNTHU 24", block: "2ND FLOOR", remarks: "Good Working", status: "ASSINGED" },
    { no: 23, name: "Venkatesh", team: "PHP", ip: "192.168.1.116", type: "Desktop", model: "CPU", cpu: "i5 4th GEN", ram: "16GB DDR4", ssd: "240", hdd: "Nill", mon: "DELL 19.5 inch", os: "UBNTHU 24", block: "2ND FLOOR", remarks: "Good Working", status: "ASSINGED" },
    { no: 24, name: "Sabari Vasan", team: "PHP", ip: "192.168.1.125", type: "Desktop", model: "CPU", cpu: "i5 7th GEN", ram: "16GB DDR4", ssd: "240", hdd: "Nill", mon: "DELL 21 inch", os: "UBNTHU 24", block: "2ND FLOOR", remarks: "Good Working", status: "ASSINGED" },
    { no: 25, name: "Ravindran J", team: "PHP", ip: "192.168.1.89", type: "Desktop", model: "CPU", cpu: "i5 6th GEN", ram: "16GB DDR4", ssd: "240", hdd: "Nill", mon: "DELL 21 inch", os: "UBNTHU 24", block: "2ND FLOOR", remarks: "Good Working", status: "ASSINGED" },
    { no: 26, name: "Senthilkumar M", team: "PHP", ip: "192.168.1.104", type: "Desktop", model: "CPU", cpu: "i5 6th GEN", ram: "16GB DDR4", ssd: "240", hdd: "500 GB", mon: "DELL 19.5 inch", os: "UBNTHU 24", block: "2ND FLOOR", remarks: "Good Working", status: "ASSINGED" },
    { no: 27, name: "Arunmozhi A", team: "PHP", ip: "192.168.1.62", type: "Desktop", model: "CPU", cpu: "i5 7th GEN", ram: "16GB DDR4", ssd: "240", hdd: "1 TB", mon: "DELL 20 INCH", os: "UBNTHU 24", block: "2ND FLOOR", remarks: "Good Working", status: "ASSINGED" },
    { no: 28, name: "Mobile Team", team: "Mobile Team", ip: "WIFI", type: "Desktop", model: "MAC 2", cpu: "i3 GEN", ram: "8 GB DDR3", ssd: "240", hdd: "Nill", mon: "DELL 19.5 inch", os: "MAC OS", block: "2ND FLOOR", remarks: "Good Working", status: "ASSINGED" },
    { no: 29, name: "Mahalakshmi P", team: "Mobile", ip: "192.168.1.120", type: "Desktop", model: "CPU", cpu: "i5 7th GEN", ram: "32 GB RAM DDR4", ssd: "240", hdd: "1 TB", mon: "DELL 19.5 inch", os: "Windows 10", block: "2ND FLOOR", remarks: "Good Working", status: "ASSINGED" },
    { no: 30, name: "Deepan B", team: "Testing", ip: "192.168.1.77", type: "Desktop", model: "CPU", cpu: "i3 2nd Gen", ram: "16GB DDR3", ssd: "240", hdd: "Nill", mon: "DELL 19.5 inch", os: "Windows 10", block: "2ND FLOOR", remarks: "Good Working", status: "ASSINGED" },
    { no: 31, name: "Bala krishnan", team: "Testing", ip: "192.168.1.51", type: "Desktop", model: "CPU", cpu: "i5 7th GEN", ram: "12GB DDR4", ssd: "240", hdd: "Nill", mon: "DELL 18.5 inch", os: "Windows 10", block: "2ND FLOOR", remarks: "Good Working", status: "ASSINGED" },
    { no: 32, name: "Veeramani", team: "PHP", ip: "192.168.1.88", type: "Desktop", model: "CPU", cpu: "i5 6th GEN", ram: "16GB DDR4", ssd: "240", hdd: "Nill", mon: "DELL 19.5 inch", os: "UBNTHU 24", block: "2ND FLOOR", remarks: "Good Working", status: "ASSINGED" },
    { no: 33, name: "Bala Ganesh", team: "PHP", ip: "192.168.1.51", type: "Desktop", model: "CPU", cpu: "i5 7th GEN", ram: "16GB DDR4", ssd: "240", hdd: "1 TB", mon: "DELL 21.5 inch", os: "Windows 10", block: "2ND FLOOR", remarks: "Good Working", status: "ASSINGED" },
    { no: 34, name: "Arun Karthick", team: "PHP", ip: "192.168.1.50", type: "Desktop", model: "CPU", cpu: "i5 6th GEN", ram: "16GB DDR4", ssd: "240", hdd: "500 GB", mon: "Samsung 20 inch", os: "UBNTHU 24", block: "2ND FLOOR", remarks: "Good Working", status: "ASSINGED" },
    { no: 35, name: "Karthic Raja C", team: "HR ACCOUNT", ip: "192.168.1.64", type: "Desktop", model: "CPU", cpu: "intel pentium 2ng", ram: "16GB DDR3", ssd: "240", hdd: "500 GB", mon: "DELL 19.5 inch", os: "Windows 10", block: "2ND FLOOR", remarks: "Good Working", status: "ASSINGED" },
    { no: 36, name: "Vinoth", team: "UI", ip: "192.168.1.84", type: "Desktop", model: "CPU", cpu: "i5 7th GEN", ram: "16GB DDR4", ssd: "240", hdd: "500 GB", mon: "DELL 19.5 inch", os: "Windows 10", block: "2ND FLOOR", remarks: "Good Working", status: "ASSINGED" },
    { no: 37, name: "Sivabalan S", team: "UI", ip: "192.168.1.99", type: "Desktop", model: "CPU", cpu: "i5 7th GEN", ram: "16GB DDR4", ssd: "240", hdd: "1 TB", mon: "DELL 21.5 inch", os: "Windows 10", block: "2ND FLOOR", remarks: "Good Working", status: "ASSINGED" },
    { no: 40, name: "Chandru Mouli", team: "UI", ip: "192.168.1.68", type: "Desktop", model: "CPU", cpu: "i5 10th GEN", ram: "16GB DDR4", ssd: "240", hdd: "Nill", mon: "DELL 19.5 inch", os: "Windows 10", block: "2ND FLOOR", remarks: "Good Working", status: "ASSINGED" },
    { no: 41, name: "Ravindran J", team: "PHP", ip: "192.168.1.101", type: "Desktop", model: "CPU", cpu: "i5 6th GEN", ram: "16GB DDR4", ssd: "240", hdd: "Nill", mon: "DELL 19.5 inch", os: "Windows 10", block: "2ND FLOOR", remarks: "Good Working", status: "ASSINGED" },
    { no: 42, name: "Suresh Krishna", team: "UI", ip: "192.168.1.85", type: "Desktop", model: "CPU", cpu: "i5 7th GEN", ram: "16GB DDR4", ssd: "240", hdd: "500 GB", mon: "DELL 19.5 inch", os: "Windows 10", block: "2ND FLOOR", remarks: "Good Working", status: "ASSINGED" },
    { no: 43, name: "Prasanna", team: "PHP", ip: "192.168.1.87", type: "Desktop", model: "CPU", cpu: "i5 6th GEN", ram: "16GB DDR4", ssd: "240", hdd: "Nill", mon: "DELL 19.5 inch", os: "Windows 10", block: "2ND FLOOR", remarks: "Good Working", status: "ASSINGED" },
    { no: 44, name: "Sudhakar", team: "UI", ip: "192.168.1.92", type: "Desktop", model: "CPU", cpu: "i5 4th GEN", ram: "16GB DDR4", ssd: "240", hdd: "Nill", mon: "DELL 19.5 inch", os: "Windows 10", block: "2ND FLOOR", remarks: "Good Working", status: "ASSINGED" },
    { no: 45, name: "Praveenkumar", team: "UI", ip: "192.168.1.90", type: "Desktop", model: "CPU", cpu: "i5 6th GEN", ram: "16GB DDR4", ssd: "240", hdd: "1 TB", mon: "DELL 19.5 inch", os: "Windows 10", block: "2ND FLOOR", remarks: "Good Working", status: "ASSINGED" },
    { no: 46, name: "Ibrahim", team: "Mobile", ip: "", type: "Laptop", model: "MAC 3", cpu: "", ram: "", ssd: "", hdd: "", mon: "", os: "", block: "", remarks: "Good Working", status: "ASSINGED" },
    { no: 47, name: "Joel Jhone", team: "Mobile", ip: "192.168.1.115", type: "Desktop", model: "CPU", cpu: "i5 12th GEN", ram: "16GB DDR4", ssd: "240", hdd: "Nill", mon: "DELL 19.5 inch", os: "UBNTHU 24", block: "2ND FLOOR", remarks: "Good Working", status: "ASSINGED" }
  ];

  const swapsData = [
    { sno: 1, oldUser: "Edwin", oldTeam: "HR", type: "CPU", details: "i5 4th/8GB RAM/500 SSD", swapUser: "Naveen", swapTeam: "HR", date: "2026-10-03", remark: "Assinged" },
    { sno: 2, oldUser: "Edwin", oldTeam: "HR", type: "monitor", details: "DELL 19.5", swapUser: "Naveen", swapTeam: "HR", date: "2026-10-03", remark: "Assinged" }
  ];

  const reqData = [
    { sno: 1, user: "EDWIN", tl: "Edwin", team: "ADMIN", req: "RAM DDR 3", status: "Purchasing", remark: "SYSTEM SLOW", reqDate: "2026-10-03", purchaseDate: "2026-10-03", assignedDate: "2026-10-03" },
    { sno: 2, user: "KARTHICK", tl: "Edwin", team: "ADMIN", req: "SMPS", status: "Purchasied Pending", remark: "SYSTEM AUTO RESTART", reqDate: "2026-10-03", purchaseDate: "Waiting", assignedDate: "Waiting" }
  ];

  const newAssetsData = [
    { sno: 1, type: "CPU", model: "i5 4th/8GB RAM/500 SSD", billDate: "2026-10-01", assignedDate: "2026-10-03", status: "Assinged", floor: "Floor 1", user: "Edwin", team: "ADMIN", tl: "ADMIN" },
    { sno: 2, type: "RAM", model: "8GB RAM DDR 4", billDate: "2026-10-01", assignedDate: "NOT ASSINGED", status: "NOT ASSINGED", floor: "NOT ASSINGED", user: "NOT ASSINGED", team: "NOT ASSINGED", tl: "NOT ASSINGED" }
  ];

  const antivirusData = [
    { sno: 1, user: "Jeeva V", team: "BD", asset: "Laptop", model: "Lenovo 82H8", os: "WINDOWS 11", software: "Mcafee Antivirus", purchaseDate: "2026-10-03", expireDate: "2027-10-03", status: "ACTIVE" },
    { sno: 2, user: "Praveen G", team: "BD", asset: "Laptop", model: "Lenovo 82H8", os: "WINDOWS 11", software: "Mcafee Antivirus", purchaseDate: "2026-10-03", expireDate: "2027-10-03", status: "ACTIVE" },
    { sno: 3, user: "Janarthan M", team: "BD", asset: "Laptop", model: "Lenovo 82H8", os: "WINDOWS 11", software: "Mcafee Antivirus", purchaseDate: "2026-10-03", expireDate: "2027-10-03", status: "ACTIVE" }
  ];

  const samNames = [
    "Abu Bakkar Umar K", "Ajith Kumar", "Archana P", "Arun Karthick K", "Arunmozhi A",
    "Balaganesan", "Balaksrishnan N", "Bindo J", "Chandramouzhi", "deenadhayalan",
    "Deepan B", "Fayith Ahamed", "Gokul S", "Gomez Edwin", "Guruvarasu T",
    "Irwin Raj Kumar C", "Jeeva", "Joshkia P", "Karthic R", "Karthic S",
    "Karthic T", "Karthick Prabhu", "Karthiga devi", "Kishore", "Lakshmi M",
    "Manju Priyadharshini R", "Manojkumar", "Meimozhi", "Mohammed Ibrahim S",
    "Nagajothika K R", "Nareshprabhakar R", "Niveda", "Nivetha", "Notassigned",
    "Parveen G", "Prasanna N V", "Praveen Kumar K A", "Rajamadasami M",
    "Rajeshwari M", "Ramachandran", "Ramkumar", "Rammohan", "Ravindran J",
    "Santhosh Kumar", "Saraswathi", "Saravanan", "Saravanan Balan", "Selva Priya",
    "Senthilkumar V", "Sinu Thomas TG", "Sivaguru", "Sobiya RS", "sudakar",
    "Surya PG", "Tharani", "Udhaya Prakash P", "Vanitha B", "Vanuvamalai Perumal",
    "Veerapandi", "Vignesh Kumar S", "Vijay M", "Vijay P", "Vinothkumar E",
    "venkateshan", "Jayaprakash S", "Athi Suresh", "Sivapriya", "Loginth.S",
    "Notassign/Manoj Kumar", "Ramshraeyus", "Harun Rasith", "Nisha T",
    "Khadhar Sheik", "Arun Raja", "Vinitha", "Notassigned/Kalavathi", "Vijayaraman K"
  ];

  // Helper to standardize OS
  function cleanOS(os) {
    if (!os) return "Unspecified";
    const up = os.toUpperCase();
    if (up.includes("UBNTHU") || up.includes("UBUNTU")) return "Ubuntu 24.04";
    if (up.includes("11")) return "Windows 11 Pro";
    if (up.includes("10")) return "Windows 10 Pro";
    if (up.includes("7")) return "Windows 7 Pro";
    if (up.includes("MAC")) return "macOS Ventura";
    return os;
  }

  // Helper to determine Department based on Team
  function getDepartment(team) {
    if (!team) return "General IT";
    const t = team.toUpperCase();
    if (t.includes("PHP") || t.includes("TECH") || t.includes("MOBILE")) return "Engineering";
    if (t.includes("UI")) return "Product Design";
    if (t.includes("SEO") || t.includes("LEAD") || t.includes("BD") || t.includes("BA")) return "Growth & Marketing";
    if (t.includes("TESTING")) return "Quality Assurance";
    if (t.includes("HR") || t.includes("ADMIN") || t.includes("ACCOUNT")) return "HR & Admin";
    return "Operations";
  }

  // Convert raw 70 assets into unified rich enterprise asset model
  function getInitialAssets() {
    return masterAssets.map((raw, idx) => {
      const isLaptop = (raw.model || "").toLowerCase().includes("laptop") || (raw.asset || "").toLowerCase().includes("lap");
      const isWFH = (raw.bay || "").includes("WFH") || (raw.ip || "").includes("WFH") || (raw.ip || "").includes("OWNE");
      
      // Determine purchase and warranty dates (realistic spread for ITAM dashboard)
      const yr = 2023 + (idx % 3);
      const m = String((idx % 12) + 1).padStart(2, '0');
      const d = String((idx % 28) + 1).padStart(2, '0');
      const pDate = `${yr}-${m}-${d}`;

      // Expiry dates: some expired, some expiring in 30 days, 60 days, 90 days, some active
      let wDate;
      if (idx % 7 === 0) {
        // Expiring in ~20 days (Expiring Soon)
        wDate = "2026-10-23";
      } else if (idx % 5 === 0) {
        // Expiring in ~50 days
        wDate = "2026-11-22";
      } else if (idx % 9 === 0) {
        // Expired last month
        wDate = "2026-09-15";
      } else {
        // Active into 2027/2028
        wDate = `2027-${m}-${d}`;
      }

      // Determine asset status
      let status = "Assigned";
      if (!raw.name || raw.name.toLowerCase().includes("notassign") || raw.name === "OfficeDekstop") {
        status = "Available";
      } else if (isWFH) {
        status = "WFH";
      } else if (idx === 14 || idx === 31) {
        status = "Maintenance";
      } else if (idx === 46) {
        status = "Repair";
      } else if (idx === 65) {
        status = "Spare";
      }

      // Determine Floor
      let floor = "1st Floor";
      if (raw.bay && (raw.bay.startsWith("B01") || raw.bay.startsWith("B02") || raw.bay.startsWith("B03"))) {
        floor = "2nd Floor";
      }
      if (isWFH) floor = "Remote / WFH";

      // Brand
      let brand = "Dell";
      if ((raw.size || "").toLowerCase().includes("asus")) brand = "Asus";
      else if ((raw.size || "").toLowerCase().includes("lenovo")) brand = "Lenovo";
      else if ((raw.size || "").toLowerCase().includes("acer")) brand = "Acer";
      else if ((raw.size || "").toLowerCase().includes("sony")) brand = "Sony";
      else if ((raw.model || "").toLowerCase().includes("benq")) brand = "BenQ";
      else if ((raw.model || "").toLowerCase().includes("samsung")) brand = "Samsung";
      else if (raw.os && raw.os.toUpperCase().includes("MAC")) brand = "Apple";

      const assetId = raw.asset && raw.asset.trim() ? raw.asset.trim() : `PIX-${isLaptop ? 'LAP' : 'DESK'}-${String(raw.sno).padStart(2, '0')}`;
      const serialNum = (raw.monAsset && raw.monAsset !== "NA" && raw.monAsset !== "") ? raw.monAsset : `SN-PIX-${1000 + raw.sno}`;

      return {
        id: assetId,
        sno: raw.sno,
        employeeName: raw.name || "Unassigned",
        employeeId: raw.name ? `EMP-10${String(raw.sno).padStart(2, '0')}` : "N/A",
        team: raw.team || "General",
        department: getDepartment(raw.team),
        assetType: isLaptop ? "Laptop" : (brand === "Apple" ? "Workstation" : "Desktop"),
        brand: brand,
        model: raw.size && raw.size !== "NA" ? `${brand} ${raw.size}` : (raw.model ? `${brand} ${raw.model}` : `${brand} Enterprise PC`),
        serialNumber: serialNum,
        cpu: raw.cpu && raw.cpu.trim() ? raw.cpu.trim() : "Intel Core i5",
        ram: raw.ram && raw.ram.trim() ? (raw.ram.includes("GB") ? raw.ram : `${raw.ram} RAM`) : "8 GB DDR4",
        storage: (raw.ssd ? `${raw.ssd}GB SSD` : "") + (raw.ssd && raw.hdd ? " + " : "") + (raw.hdd ? `${raw.hdd} HDD` : ""),
        os: cleanOS(raw.os),
        officeVersion: "Microsoft 365 Enterprise",
        antivirus: raw.os && raw.os.toUpperCase().includes("11") ? "McAfee Endpoint Security (Active)" : "ClamAV / Windows Defender",
        ipAddress: raw.ip && raw.ip.trim() ? raw.ip.trim() : "192.168.1.100",
        macAddress: raw.mac && raw.mac.trim() && raw.mac !== "Nill" ? raw.mac.trim() : "00:E0:4C:D4:7F:00",
        location: isWFH ? "Remote WFH" : "Main Office Campus",
        floor: floor,
        bay: raw.bay && raw.bay.trim() ? raw.bay.trim() : "Floating Bay",
        purchaseDate: pDate,
        purchaseCost: isLaptop ? 55000 : 42000,
        warrantyStart: pDate,
        warrantyExpiry: wDate,
        vendor: brand === "Apple" ? "Apple Authorized Reseller" : "TechnoComp Enterprise Solutions",
        status: status,
        maintenanceStatus: (status === "Maintenance" || status === "Repair") ? "In Progress" : "Normal",
        condition: (idx === 14 || idx === 46) ? "Issue" : ((idx % 4 === 0) ? "Needs Upgrade" : "Good"),
        remarks: raw.kb && raw.kb !== "NA" ? `KB: ${raw.kb}, Mouse: ${raw.mouse}` : (isWFH ? "WFH Remote System" : "Verified excel dataset record"),
        lastUpdated: "2026-10-03 16:30",
        assignmentHistory: [
          {
            date: pDate,
            fromEmployee: "IT Inventory Pool",
            toEmployee: raw.name || "Unassigned",
            assignedBy: "Gomez Edwin (System Admin)",
            reason: "Initial workstation allocation"
          }
        ],
        maintenanceHistory: (status === "Maintenance" || status === "Repair") ? [
          {
            ticketId: `MNT-2026-${100 + raw.sno}`,
            issueDate: "2026-09-28",
            type: "Hardware Check",
            description: "System reported performance slowness and random restart",
            status: "In Progress",
            technician: "Gomez Edwin",
            cost: 1500,
            completionDate: "Pending",
            resolution: "Diagnosing memory module and power supply"
          }
        ] : []
      };
    });
  }

  // Initial maintenance tickets
  function getInitialMaintenance() {
    return [
      {
        ticketId: "MNT-2026-001",
        assetId: "PIXCPU-07",
        employee: "deenadhayalan",
        issueDate: "2026-09-28",
        issueType: "Motherboard & Hardware",
        problemDescription: "Motherboard issue detected; changed to new CPU unit.",
        priority: "High",
        assignedTechnician: "Gomez Edwin",
        vendor: "TechnoComp Solutions",
        repairCost: 4500,
        startDate: "2026-09-29",
        completionDate: "2026-10-02",
        status: "Completed",
        resolution: "Replaced motherboard assembly and verified BIOS POST.",
        remarks: "From Excel Swap Maintenance Sheet"
      },
      {
        ticketId: "MNT-2026-002",
        assetId: "Pixlap-14",
        employee: "Archana P",
        issueDate: "2026-10-01",
        issueType: "Display / Screen",
        problemDescription: "Old display crack on laptop screen.",
        priority: "Medium",
        assignedTechnician: "Gomez Edwin",
        vendor: "Sony Authorized Service",
        repairCost: 6200,
        startDate: "2026-10-02",
        completionDate: "Pending",
        status: "In Progress",
        resolution: "Replacement LCD panel ordered from vendor.",
        remarks: "From Excel Swap Maintenance Sheet"
      },
      {
        ticketId: "MNT-2026-003",
        assetId: "PIXCPU-26",
        employee: "Edwin",
        issueDate: "2026-10-03",
        issueType: "RAM Upgrade",
        problemDescription: "System slow - requires RAM DDR 3 upgrade for administrator tasks.",
        priority: "Medium",
        assignedTechnician: "Gomez Edwin",
        vendor: "Local IT Spares",
        repairCost: 1800,
        startDate: "2026-10-03",
        completionDate: "Pending",
        status: "Waiting for Parts",
        resolution: "Purchase request approved. Waiting for delivery.",
        remarks: "From Excel Requirements Sheet"
      },
      {
        ticketId: "MNT-2026-004",
        assetId: "PIXCPU-01",
        employee: "KARTHICK",
        issueDate: "2026-10-03",
        issueType: "Power Supply / SMPS",
        problemDescription: "System auto-restart randomly during peak workload.",
        priority: "Urgent",
        assignedTechnician: "Gomez Edwin",
        vendor: "Zebronics / Corsair Service",
        repairCost: 2200,
        startDate: "2026-10-03",
        completionDate: "Pending",
        status: "Open Issues",
        resolution: "SMPS diagnosed as faulty; pending replacement unit.",
        remarks: "From Excel Requirements Sheet"
      }
    ];
  }

  // Initial Software Licenses
  function getInitialLicenses() {
    return [
      {
        id: "LIC-001",
        name: "McAfee Endpoint Total Protection",
        type: "Enterprise Subscription",
        key: "MCAF-9948-2831-XXXX",
        assignedAsset: "Pixlap Fleet (BD Team)",
        assignedEmployee: "Jeeva V / Praveen G",
        purchaseDate: "2026-10-03",
        expiryDate: "2027-10-03",
        totalSeats: 15,
        usedSeats: 3,
        availableSeats: 12,
        status: "Active",
        vendor: "McAfee India"
      },
      {
        id: "LIC-002",
        name: "Microsoft Windows 11 Pro OEM",
        type: "Perpetual OEM",
        key: "WIN11-OEM-8821-YYYY",
        assignedAsset: "Office Laptops (Fleet 1-16)",
        assignedEmployee: "Multiple Employees",
        purchaseDate: "2024-02-10",
        expiryDate: "2029-12-31",
        totalSeats: 25,
        usedSeats: 18,
        availableSeats: 7,
        status: "Active",
        vendor: "Microsoft Direct"
      },
      {
        id: "LIC-003",
        name: "Adobe Creative Cloud All Apps",
        type: "Annual Cloud Seat",
        key: "ADOBE-CC-UI-TEAM",
        assignedAsset: "UI Workstations",
        assignedEmployee: "Saravanan Balan & Team",
        purchaseDate: "2025-10-25",
        expiryDate: "2026-10-25", // Expiring in 22 days!
        totalSeats: 8,
        usedSeats: 7,
        availableSeats: 1,
        status: "Expiring Soon",
        vendor: "Adobe Systems"
      },
      {
        id: "LIC-004",
        name: "JetBrains All Products Pack",
        type: "Developer License",
        key: "JB-PHP-2025-ZZZZ",
        assignedAsset: "PHP Development Workstations",
        assignedEmployee: "Balaganesan, Arun Karthick",
        purchaseDate: "2025-11-15",
        expiryDate: "2026-11-15", // Expiring in ~42 days
        totalSeats: 12,
        usedSeats: 10,
        availableSeats: 2,
        status: "Expiring Soon",
        vendor: "JetBrains s.r.o."
      }
    ];
  }

  // Initial Activity Log
  function getInitialActivityLog() {
    return [
      {
        id: "ACT-001",
        timestamp: "2026-10-03 16:35",
        user: "Gomez Edwin (Admin)",
        action: "System Initialized",
        assetId: "SYSTEM",
        details: "Loaded verified dataset of 70 master workstations and 47 floor entries."
      },
      {
        id: "ACT-002",
        timestamp: "2026-10-03 16:40",
        user: "Gomez Edwin (Admin)",
        action: "Maintenance Created",
        assetId: "PIXCPU-01",
        details: "Opened urgent SMPS replacement ticket for KARTHICK."
      },
      {
        id: "ACT-003",
        timestamp: "2026-10-03 16:45",
        user: "Gomez Edwin (Admin)",
        action: "Asset Swap",
        assetId: "PIXCPU-07",
        details: "Assigned CPU i5 4th/8GB/500 SSD from Edwin to Naveen."
      }
    ];
  }

  // Initial Settings
  function getInitialSettings() {
    return {
      companyName: "Pixel Web Solutions",
      portalTitle: "IT Asset Management Portal",
      assetPrefix: "PIX-",
      userRole: "Admin", // 'Admin', 'IT Staff', 'Viewer'
      warrantyAlertDays: 60,
      departments: ["Engineering", "Product Design", "Growth & Marketing", "Quality Assurance", "HR & Admin", "Operations"],
      teams: ["BD", "PHP 1", "PHP 2", "Tech Team", "Testing", "HR", "HR Admin", "SEO", "UI", "Lead Generation", "BA", "System Admin", "Mobile Team"],
      locations: ["Main Office Campus", "Remote WFH", "Branch Office"],
      floors: ["1st Floor", "2nd Floor", "Ground Floor", "Remote / WFH"],
      assetTypes: ["Laptop", "Desktop", "Workstation", "Monitor", "Printer", "Network Switch"],
      statusOptions: ["Assigned", "Available", "Maintenance", "Repair", "Spare", "WFH", "Retired", "Scrapped"]
    };
  }

  return {
    rawMasterAssets: masterAssets,
    rawFloor12Data: floor12Data,
    rawSwapsData: swapsData,
    rawReqData: reqData,
    rawNewAssetsData: newAssetsData,
    rawAntivirusData: antivirusData,
    rawSamNames: samNames,
    getInitialAssets: getInitialAssets,
    getInitialMaintenance: getInitialMaintenance,
    getInitialLicenses: getInitialLicenses,
    getInitialActivityLog: getInitialActivityLog,
    getInitialSettings: getInitialSettings
  };
})();
