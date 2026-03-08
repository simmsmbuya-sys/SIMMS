import { mutation } from "./_generated/server";

// Run this once to populate your Convex database with demo data.
// Call from the Convex dashboard: Dashboard > Functions > seed:run

export const run = mutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const ORG = "tegra-default";

    // ── Check if already seeded ──
    const existing = await ctx.db.query("locations").first();
    if (existing) {
      return "Already seeded. Delete data first if you want to re-seed.";
    }

    // ── Locations ──
    const loc1 = await ctx.db.insert("locations", {
      orgId: ORG, name: "Main Street Store", type: "store",
      address: "142 Main Street, Springfield, IL 62701", phone: "(217) 555-0142",
      isActive: true, createdAt: now,
    });
    const loc2 = await ctx.db.insert("locations", {
      orgId: ORG, name: "Central Warehouse", type: "warehouse",
      address: "890 Industrial Blvd, Springfield, IL 62703", phone: "(217) 555-0890",
      isActive: true, createdAt: now,
    });
    const loc3 = await ctx.db.insert("locations", {
      orgId: ORG, name: "Eastside Branch", type: "store",
      address: "2415 East Grand Ave, Springfield, IL 62702", phone: "(217) 555-2415",
      isActive: true, createdAt: now,
    });

    // ── Categories ──
    const catBuilding = await ctx.db.insert("categories", { orgId: ORG, name: "Building Materials", description: "Cement, rebar, roofing" });
    const catElectrical = await ctx.db.insert("categories", { orgId: ORG, name: "Electrical", description: "Cables, breakers, lights" });
    const catPlumbing = await ctx.db.insert("categories", { orgId: ORG, name: "Plumbing", description: "Pipes, fittings, taps" });
    const catPaint = await ctx.db.insert("categories", { orgId: ORG, name: "Paint", description: "Emulsion, gloss, primer" });
    const catHardware = await ctx.db.insert("categories", { orgId: ORG, name: "Hardware", description: "Tools, fasteners, accessories" });
    const catSafety = await ctx.db.insert("categories", { orgId: ORG, name: "Safety", description: "PPE, helmets, gloves" });

    // ── Products ──
    const products = [
      { sku: "BM-CEM-050", name: "Portland Cement 50kg", categoryId: catBuilding, costPrice: 28.00, sellingPrice: 49.99, taxRate: 7.5, unit: "bag", reorderPoint: 100, reorderQty: 200 },
      { sku: "BM-SHT-003", name: "Roofing Sheet 3m", categoryId: catBuilding, costPrice: 38.00, sellingPrice: 65.00, taxRate: 7.5, unit: "sheet", reorderPoint: 50, reorderQty: 100 },
      { sku: "BM-REB-012", name: "Steel Rebar 12mm (6m)", categoryId: catBuilding, costPrice: 10.00, sellingPrice: 18.50, taxRate: 7.5, unit: "bar", reorderPoint: 200, reorderQty: 500 },
      { sku: "BM-SND-001", name: "Sand per Ton", categoryId: catBuilding, costPrice: 20.00, sellingPrice: 35.00, taxRate: 7.5, unit: "ton", reorderPoint: 50, reorderQty: 100 },
      { sku: "EL-CBL-214", name: "2.5mm Twin Cable 100m", categoryId: catElectrical, costPrice: 30.00, sellingPrice: 52.00, taxRate: 7.5, unit: "roll", reorderPoint: 25, reorderQty: 50 },
      { sku: "EL-LED-060", name: "LED Panel Light 60x60", categoryId: catElectrical, costPrice: 18.00, sellingPrice: 34.99, taxRate: 7.5, unit: "unit", reorderPoint: 30, reorderQty: 60 },
      { sku: "EL-BRK-032", name: "Circuit Breaker 32A", categoryId: catElectrical, costPrice: 6.00, sellingPrice: 12.75, taxRate: 7.5, unit: "unit", reorderPoint: 50, reorderQty: 100 },
      { sku: "PL-PVC-032", name: "32mm PVC Pipe 6m", categoryId: catPlumbing, costPrice: 4.50, sellingPrice: 8.99, taxRate: 7.5, unit: "length", reorderPoint: 100, reorderQty: 200 },
      { sku: "PL-CPR-015", name: "15mm Copper Elbow", categoryId: catPlumbing, costPrice: 1.50, sellingPrice: 3.25, taxRate: 7.5, unit: "unit", reorderPoint: 100, reorderQty: 200 },
      { sku: "PT-EMU-001", name: "Emulsion Paint 20L White", categoryId: catPaint, costPrice: 48.00, sellingPrice: 89.99, taxRate: 7.5, unit: "bucket", reorderPoint: 40, reorderQty: 80 },
      { sku: "PT-GLS-005", name: "Gloss Paint 5L Black", categoryId: catPaint, costPrice: 22.00, sellingPrice: 42.50, taxRate: 7.5, unit: "tin", reorderPoint: 30, reorderQty: 60 },
      { sku: "HW-BLT-M10", name: "M10 Hex Bolts Box/100", categoryId: catHardware, costPrice: 7.00, sellingPrice: 14.00, taxRate: 7.5, unit: "box", reorderPoint: 50, reorderQty: 100 },
      { sku: "HW-TAP-005", name: "Tape Measure 5m", categoryId: catHardware, costPrice: 3.50, sellingPrice: 7.25, taxRate: 7.5, unit: "unit", reorderPoint: 50, reorderQty: 100 },
      { sku: "HW-WBR-001", name: "Wheelbarrow Heavy Duty", categoryId: catHardware, costPrice: 65.00, sellingPrice: 125.00, taxRate: 7.5, unit: "unit", reorderPoint: 10, reorderQty: 20 },
      { sku: "SF-HLM-YEL", name: "Safety Helmet Yellow", categoryId: catSafety, costPrice: 4.50, sellingPrice: 9.50, taxRate: 7.5, unit: "unit", reorderPoint: 40, reorderQty: 80 },
      { sku: "SF-GLV-001", name: "Work Gloves Pair", categoryId: catSafety, costPrice: 3.00, sellingPrice: 6.99, taxRate: 7.5, unit: "pair", reorderPoint: 60, reorderQty: 120 },
    ];

    const productIds: string[] = [];
    for (const p of products) {
      const id = await ctx.db.insert("products", {
        orgId: ORG,
        ...p,
        isActive: true,
        createdAt: now,
      });
      productIds.push(id as string);
    }

    // ── Stock Levels (across locations) ──
    const stockData = [
      [340, 12], [128, 5], [560, 20], [999, 0],
      [22, 3], [85, 4], [200, 8],
      [310, 15], [450, 10],
      [47, 6], [63, 2],
      [175, 5], [150, 3], [18, 1],
      [90, 4], [220, 8],
    ];

    for (let i = 0; i < productIds.length; i++) {
      const [qty, reserved] = stockData[i];
      // Main store stock
      await ctx.db.insert("stockLevels", {
        orgId: ORG,
        productId: productIds[i] as any,
        locationId: loc1 as any,
        quantity: Math.floor(qty * 0.4),
        reservedQty: Math.floor(reserved * 0.5),
        lastUpdated: now,
      });
      // Warehouse stock (bulk)
      await ctx.db.insert("stockLevels", {
        orgId: ORG,
        productId: productIds[i] as any,
        locationId: loc2 as any,
        quantity: Math.floor(qty * 0.5),
        reservedQty: Math.floor(reserved * 0.3),
        lastUpdated: now,
      });
      // Branch stock
      await ctx.db.insert("stockLevels", {
        orgId: ORG,
        productId: productIds[i] as any,
        locationId: loc3 as any,
        quantity: Math.floor(qty * 0.1),
        reservedQty: Math.floor(reserved * 0.2),
        lastUpdated: now,
      });
    }

    // ── Customers ──
    const customers = [
      { name: "James Okonkwo", email: "james.okonkwo@greenfieldhw.com", phone: "+234 801 234 5678", type: "wholesale" as const, company: "Greenfield Hardware Ltd", totalSpend: 284500.00, notes: "Preferred customer, net-30 terms" },
      { name: "Sarah Chen", email: "sarah.chen@metroconstruction.co", phone: "+1 415 555 0192", type: "b2b" as const, company: "Metro Construction Co.", totalSpend: 562340.00, notes: "Large volume buyer, quarterly contracts" },
      { name: "David Mensah", email: "david@sunriseplumbing.gh", phone: "+233 20 987 6543", type: "wholesale" as const, company: "Sunrise Plumbing Supplies", totalSpend: 87650.00, notes: "Plumbing specialist, reliable payments" },
      { name: "Amara Diallo", email: "amara.diallo@apexelec.com", phone: "+221 77 456 7890", type: "b2b" as const, company: "Apex Electrical Distributors", totalSpend: 435200.00, notes: "Electrical wholesale, net-45 terms" },
      { name: "Rachel Thompson", email: "rachel.t@valleyfarm.com", phone: "+1 503 555 0147", type: "retail" as const, company: "Valley Farm Equipment", totalSpend: 42890.00, notes: "Seasonal buyer, peak in spring/summer" },
      { name: "Michael Adebayo", email: "michael@pinnaclebuilders.ng", phone: "+234 803 765 4321", type: "b2b" as const, company: "Pinnacle Builders Inc.", totalSpend: 198750.00, notes: "Government contractor, purchase orders required" },
      { name: "Fatima Al-Rashid", email: "fatima@homecraftdxb.ae", phone: "+971 50 123 4567", type: "wholesale" as const, company: "HomeCraft Trading LLC", totalSpend: 156300.00, notes: "Import/export, prefers bulk shipments" },
      { name: "Priya Sharma", email: "priya@bharatbuild.in", phone: "+91 98765 43210", type: "wholesale" as const, company: "Bharat Build Solutions", totalSpend: 312800.00, notes: "Large wholesale account, monthly orders" },
    ];

    for (const c of customers) {
      await ctx.db.insert("customers", {
        orgId: ORG, ...c, createdAt: now,
      });
    }

    // ── Suppliers ──
    const suppliers = [
      { name: "AfriCement Industries", contactName: "Ibrahim Yakubu", email: "sales@africement.com", phone: "+234 802 111 2222", paymentTerms: "net30" as const, leadTimeDays: 7, rating: 4.5, notes: "Primary cement supplier" },
      { name: "SteelMax Trading", contactName: "Wei Zhang", email: "orders@steelmax.cn", phone: "+86 21 5555 6666", paymentTerms: "net60" as const, leadTimeDays: 21, rating: 4.2, notes: "Steel and rebar supplier" },
      { name: "ElectroPro Distributors", contactName: "John Kamau", email: "john@electropro.ke", phone: "+254 722 333 444", paymentTerms: "net30" as const, leadTimeDays: 10, rating: 4.8, notes: "Electrical supplies" },
      { name: "PaintWorks International", contactName: "Maria Santos", email: "maria@paintworks.com", phone: "+1 555 777 8888", paymentTerms: "net30" as const, leadTimeDays: 14, rating: 4.0, notes: "Paint and coatings" },
      { name: "Global Plumbing Supply", contactName: "Ahmed Hassan", email: "ahmed@gps-supply.com", phone: "+20 100 999 8888", paymentTerms: "net15" as const, leadTimeDays: 5, rating: 4.6, notes: "Fast delivery, quality fittings" },
    ];

    for (const s of suppliers) {
      await ctx.db.insert("suppliers", {
        orgId: ORG, ...s, isActive: true, createdAt: now,
      });
    }

    // ── Accounting: Default Chart of Accounts ──
    const accounts = [
      { code: "1000", name: "Cash", type: "asset" as const, balance: 145200.00 },
      { code: "1100", name: "Accounts Receivable", type: "asset" as const, balance: 87340.00 },
      { code: "1200", name: "Inventory", type: "asset" as const, balance: 1247500.00 },
      { code: "1300", name: "Equipment", type: "asset" as const, balance: 85000.00 },
      { code: "2000", name: "Accounts Payable", type: "liability" as const, balance: 124500.00 },
      { code: "2100", name: "Sales Tax Payable", type: "liability" as const, balance: 18750.00 },
      { code: "3000", name: "Owner's Equity", type: "equity" as const, balance: 500000.00 },
      { code: "3100", name: "Retained Earnings", type: "equity" as const, balance: 284520.00 },
      { code: "4000", name: "Sales Revenue", type: "revenue" as const, balance: 847300.00 },
      { code: "4100", name: "Service Revenue", type: "revenue" as const, balance: 12400.00 },
      { code: "5000", name: "Cost of Goods Sold", type: "expense" as const, balance: 523400.00 },
      { code: "5100", name: "Salaries & Wages", type: "expense" as const, balance: 156000.00 },
      { code: "5200", name: "Rent Expense", type: "expense" as const, balance: 48000.00 },
      { code: "5300", name: "Utilities", type: "expense" as const, balance: 12800.00 },
      { code: "5400", name: "Marketing", type: "expense" as const, balance: 8500.00 },
    ];

    for (const a of accounts) {
      await ctx.db.insert("accounts", {
        orgId: ORG, ...a, isActive: true, createdAt: now,
      });
    }

    return `Seeded successfully: 3 locations, 6 categories, ${products.length} products, ${stockData.length * 3} stock levels, ${customers.length} customers, ${suppliers.length} suppliers, ${accounts.length} accounts`;
  },
});
