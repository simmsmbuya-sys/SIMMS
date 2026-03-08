// Shared demo data constants used across views

export const LOCATIONS = [
  { id: "loc_1", name: "Main Warehouse", type: "warehouse" as const, address: "1200 Industrial Blvd, Suite A" },
  { id: "loc_2", name: "Downtown Store", type: "store" as const, address: "450 Main Street" },
  { id: "loc_3", name: "Mall Outlet", type: "store" as const, address: "Westfield Mall, Unit 234" },
  { id: "loc_4", name: "Distribution Center", type: "warehouse" as const, address: "8800 Logistics Parkway" },
];

export const CATEGORIES = [
  { id: "cat_1", name: "Electronics" },
  { id: "cat_2", name: "Clothing" },
  { id: "cat_3", name: "Food & Beverage" },
  { id: "cat_4", name: "Home & Garden" },
  { id: "cat_5", name: "Sports & Outdoors" },
  { id: "cat_6", name: "Office Supplies" },
];

export const DEMO_PRODUCTS = [
  { id: "p1", sku: "ELC-001", name: "Wireless Bluetooth Headphones", category: "Electronics", costPrice: 24.99, sellingPrice: 49.99, stock: 156, reserved: 12, reorderPoint: 50 },
  { id: "p2", sku: "ELC-002", name: "USB-C Charging Hub 7-Port", category: "Electronics", costPrice: 18.50, sellingPrice: 39.99, stock: 89, reserved: 5, reorderPoint: 30 },
  { id: "p3", sku: "ELC-003", name: "Smart LED Desk Lamp", category: "Electronics", costPrice: 22.00, sellingPrice: 44.99, stock: 67, reserved: 3, reorderPoint: 25 },
  { id: "p4", sku: "CLT-001", name: "Premium Cotton T-Shirt (Black)", category: "Clothing", costPrice: 8.50, sellingPrice: 24.99, stock: 342, reserved: 20, reorderPoint: 100 },
  { id: "p5", sku: "CLT-002", name: "Slim Fit Denim Jeans", category: "Clothing", costPrice: 22.00, sellingPrice: 59.99, stock: 178, reserved: 8, reorderPoint: 60 },
  { id: "p6", sku: "CLT-003", name: "Waterproof Winter Jacket", category: "Clothing", costPrice: 45.00, sellingPrice: 119.99, stock: 45, reserved: 2, reorderPoint: 20 },
  { id: "p7", sku: "FNB-001", name: "Organic Coffee Beans 1kg", category: "Food & Beverage", costPrice: 12.00, sellingPrice: 24.99, stock: 234, reserved: 15, reorderPoint: 80 },
  { id: "p8", sku: "FNB-002", name: "Artisan Chocolate Box (12pc)", category: "Food & Beverage", costPrice: 8.00, sellingPrice: 19.99, stock: 12, reserved: 0, reorderPoint: 40 },
  { id: "p9", sku: "HMG-001", name: "Stainless Steel Water Bottle", category: "Home & Garden", costPrice: 6.50, sellingPrice: 18.99, stock: 445, reserved: 30, reorderPoint: 100 },
  { id: "p10", sku: "HMG-002", name: "Bamboo Cutting Board Set", category: "Home & Garden", costPrice: 14.00, sellingPrice: 34.99, stock: 78, reserved: 4, reorderPoint: 25 },
  { id: "p11", sku: "SPT-001", name: "Yoga Mat Premium 6mm", category: "Sports & Outdoors", costPrice: 15.00, sellingPrice: 39.99, stock: 124, reserved: 7, reorderPoint: 40 },
  { id: "p12", sku: "SPT-002", name: "Resistance Bands Set (5pc)", category: "Sports & Outdoors", costPrice: 8.00, sellingPrice: 22.99, stock: 3, reserved: 0, reorderPoint: 30 },
  { id: "p13", sku: "OFC-001", name: "Ergonomic Wireless Mouse", category: "Office Supplies", costPrice: 12.00, sellingPrice: 29.99, stock: 201, reserved: 10, reorderPoint: 50 },
  { id: "p14", sku: "OFC-002", name: "Standing Desk Converter", category: "Office Supplies", costPrice: 85.00, sellingPrice: 199.99, stock: 0, reserved: 0, reorderPoint: 10 },
  { id: "p15", sku: "ELC-004", name: "Portable Power Bank 20000mAh", category: "Electronics", costPrice: 15.00, sellingPrice: 34.99, stock: 8, reserved: 2, reorderPoint: 25 },
];

export const DEMO_CUSTOMERS = [
  { id: "c1", name: "Sarah Johnson", email: "sarah.johnson@email.com", phone: "+1 (555) 234-5678", type: "retail" as const, company: null, totalSpend: 1247.50, lastPurchase: "2026-03-06" },
  { id: "c2", name: "TechCorp Solutions", email: "procurement@techcorp.com", phone: "+1 (555) 345-6789", type: "b2b" as const, company: "TechCorp Solutions", totalSpend: 45890.00, lastPurchase: "2026-03-07" },
  { id: "c3", name: "Maria Garcia", email: "m.garcia@email.com", phone: "+1 (555) 456-7890", type: "retail" as const, company: null, totalSpend: 892.25, lastPurchase: "2026-03-05" },
  { id: "c4", name: "Wholesale Mart Inc", email: "orders@wholesalemart.com", phone: "+1 (555) 567-8901", type: "wholesale" as const, company: "Wholesale Mart Inc", totalSpend: 127450.00, lastPurchase: "2026-03-08" },
  { id: "c5", name: "James Chen", email: "j.chen@email.com", phone: "+1 (555) 678-9012", type: "retail" as const, company: null, totalSpend: 3456.75, lastPurchase: "2026-03-04" },
  { id: "c6", name: "Metro Retailers Group", email: "supply@metroretailers.com", phone: "+1 (555) 789-0123", type: "wholesale" as const, company: "Metro Retailers Group", totalSpend: 89340.00, lastPurchase: "2026-03-07" },
  { id: "c7", name: "Emily Watson", email: "e.watson@email.com", phone: "+1 (555) 890-1234", type: "retail" as const, company: null, totalSpend: 567.00, lastPurchase: "2026-02-28" },
  { id: "c8", name: "BuildRight Construction", email: "purchasing@buildright.com", phone: "+1 (555) 901-2345", type: "b2b" as const, company: "BuildRight Construction", totalSpend: 23780.00, lastPurchase: "2026-03-03" },
  { id: "c9", name: "Alex Thompson", email: "alex.t@email.com", phone: "+1 (555) 012-3456", type: "retail" as const, company: null, totalSpend: 2134.50, lastPurchase: "2026-03-06" },
  { id: "c10", name: "Pacific Trade Co", email: "info@pacifictrade.com", phone: "+1 (555) 123-4567", type: "b2b" as const, company: "Pacific Trade Co", totalSpend: 67890.00, lastPurchase: "2026-03-08" },
];

export const DEMO_SUPPLIERS = [
  { id: "s1", name: "Global Electronics Corp", contact: "David Park", email: "d.park@globalelec.com", phone: "+1 (555) 111-2222", terms: "net30", leadTime: 14, rating: 4.5 },
  { id: "s2", name: "Fresh Farms Distribution", contact: "Maria Santos", email: "m.santos@freshfarms.com", phone: "+1 (555) 222-3333", terms: "net15", leadTime: 3, rating: 4.8 },
  { id: "s3", name: "TextileWorld Manufacturing", contact: "John Kim", email: "j.kim@textileworld.com", phone: "+1 (555) 333-4444", terms: "net60", leadTime: 21, rating: 4.2 },
  { id: "s4", name: "HomeGoods Wholesale", contact: "Lisa Brown", email: "l.brown@homegoods-ws.com", phone: "+1 (555) 444-5555", terms: "net30", leadTime: 7, rating: 4.0 },
  { id: "s5", name: "SportTech Supplies", contact: "Mike Rivera", email: "m.rivera@sporttech.com", phone: "+1 (555) 555-6666", terms: "net30", leadTime: 10, rating: 4.6 },
  { id: "s6", name: "OfficeMax Direct", contact: "Karen Wu", email: "k.wu@officemax-direct.com", phone: "+1 (555) 666-7777", terms: "cod", leadTime: 2, rating: 3.9 },
  { id: "s7", name: "PacRim Import Co", contact: "Tony Zhang", email: "t.zhang@pacrim.com", phone: "+1 (555) 777-8888", terms: "net90", leadTime: 45, rating: 3.7 },
  { id: "s8", name: "Nordic Design Group", contact: "Erik Lindqvist", email: "e.lindqvist@nordicdesign.com", phone: "+46 8 555-9999", terms: "net60", leadTime: 28, rating: 4.4 },
];

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
}

export function formatDate(date: string | number): string {
  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function formatDateTime(date: string | number): string {
  return new Date(date).toLocaleString("en-US", {
    month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
  });
}
