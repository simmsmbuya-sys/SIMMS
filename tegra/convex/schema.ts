import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // ── Organizations & Users ──
  organizations: defineTable({
    name: v.string(),
    slug: v.string(),
    plan: v.union(v.literal("free"), v.literal("pro"), v.literal("enterprise")),
    settings: v.optional(v.object({
      currency: v.string(),
      timezone: v.string(),
      taxRate: v.number(),
    })),
    createdAt: v.number(),
  }).index("by_slug", ["slug"]),

  users: defineTable({
    clerkId: v.string(),
    orgId: v.string(),
    email: v.string(),
    name: v.string(),
    role: v.union(
      v.literal("business_owner"),
      v.literal("store_manager"),
      v.literal("warehouse_manager")
    ),
    avatar: v.optional(v.string()),
    lastLogin: v.optional(v.number()),
  })
    .index("by_clerkId", ["clerkId"])
    .index("by_org", ["orgId"]),

  // ── Locations ──
  locations: defineTable({
    orgId: v.string(),
    name: v.string(),
    type: v.union(v.literal("store"), v.literal("warehouse")),
    address: v.optional(v.string()),
    phone: v.optional(v.string()),
    isActive: v.boolean(),
    createdAt: v.number(),
  }).index("by_org", ["orgId"]),

  // ── Inventory ──
  categories: defineTable({
    orgId: v.string(),
    name: v.string(),
    description: v.optional(v.string()),
    parentId: v.optional(v.id("categories")),
  }).index("by_org", ["orgId"]),

  products: defineTable({
    orgId: v.string(),
    sku: v.string(),
    name: v.string(),
    description: v.optional(v.string()),
    categoryId: v.optional(v.id("categories")),
    costPrice: v.number(),
    sellingPrice: v.number(),
    taxRate: v.number(),
    unit: v.string(),
    imageUrl: v.optional(v.string()),
    rfidTagId: v.optional(v.string()),
    barcode: v.optional(v.string()),
    reorderPoint: v.number(),
    reorderQty: v.number(),
    isActive: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_org", ["orgId"])
    .index("by_sku", ["orgId", "sku"])
    .index("by_category", ["orgId", "categoryId"]),

  stockLevels: defineTable({
    orgId: v.string(),
    productId: v.id("products"),
    locationId: v.id("locations"),
    quantity: v.number(),
    reservedQty: v.number(),
    lastUpdated: v.number(),
  })
    .index("by_product", ["orgId", "productId"])
    .index("by_location", ["orgId", "locationId"])
    .index("by_product_location", ["orgId", "productId", "locationId"]),

  // ── Sales / POS ──
  customers: defineTable({
    orgId: v.string(),
    name: v.string(),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    type: v.union(v.literal("retail"), v.literal("wholesale"), v.literal("b2b")),
    company: v.optional(v.string()),
    address: v.optional(v.string()),
    totalSpend: v.number(),
    notes: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_org", ["orgId"])
    .index("by_type", ["orgId", "type"]),

  transactions: defineTable({
    orgId: v.string(),
    locationId: v.id("locations"),
    customerId: v.optional(v.id("customers")),
    type: v.union(v.literal("sale"), v.literal("refund"), v.literal("exchange")),
    status: v.union(v.literal("completed"), v.literal("voided"), v.literal("pending")),
    items: v.array(v.object({
      productId: v.id("products"),
      name: v.string(),
      sku: v.string(),
      quantity: v.number(),
      unitPrice: v.number(),
      discount: v.number(),
      total: v.number(),
    })),
    subtotal: v.number(),
    taxAmount: v.number(),
    discount: v.number(),
    total: v.number(),
    paymentMethod: v.union(v.literal("cash"), v.literal("card"), v.literal("mixed")),
    cashierId: v.string(),
    receiptNumber: v.string(),
    notes: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_org", ["orgId"])
    .index("by_location", ["orgId", "locationId"])
    .index("by_customer", ["orgId", "customerId"])
    .index("by_date", ["orgId", "createdAt"]),

  // ── Stocktakes ──
  stocktakes: defineTable({
    orgId: v.string(),
    locationId: v.id("locations"),
    status: v.union(v.literal("draft"), v.literal("in_progress"), v.literal("completed"), v.literal("cancelled")),
    startedBy: v.string(),
    completedAt: v.optional(v.number()),
    notes: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_org", ["orgId"])
    .index("by_location", ["orgId", "locationId"]),

  stocktakeItems: defineTable({
    orgId: v.string(),
    stocktakeId: v.id("stocktakes"),
    productId: v.id("products"),
    expectedQty: v.number(),
    countedQty: v.number(),
    discrepancy: v.number(),
    notes: v.optional(v.string()),
  })
    .index("by_stocktake", ["stocktakeId"])
    .index("by_org", ["orgId"]),

  // ── Transfers ──
  transfers: defineTable({
    orgId: v.string(),
    fromLocationId: v.id("locations"),
    toLocationId: v.id("locations"),
    status: v.union(
      v.literal("draft"),
      v.literal("pending"),
      v.literal("in_transit"),
      v.literal("received"),
      v.literal("cancelled")
    ),
    items: v.array(v.object({
      productId: v.id("products"),
      name: v.string(),
      sku: v.string(),
      quantity: v.number(),
    })),
    requestedBy: v.string(),
    approvedBy: v.optional(v.string()),
    shippedAt: v.optional(v.number()),
    receivedAt: v.optional(v.number()),
    notes: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_org", ["orgId"])
    .index("by_status", ["orgId", "status"]),

  // ── RFID ──
  rfidDevices: defineTable({
    orgId: v.string(),
    name: v.string(),
    type: v.union(
      v.literal("usb"),
      v.literal("fixed"),
      v.literal("handheld"),
      v.literal("gateway")
    ),
    locationId: v.id("locations"),
    serialNumber: v.string(),
    status: v.union(v.literal("active"), v.literal("inactive"), v.literal("maintenance")),
    lastSeen: v.optional(v.number()),
    firmware: v.optional(v.string()),
    config: v.optional(v.object({
      power: v.optional(v.number()),
      frequency: v.optional(v.string()),
      antennaCount: v.optional(v.number()),
    })),
    createdAt: v.number(),
  })
    .index("by_org", ["orgId"])
    .index("by_location", ["orgId", "locationId"]),

  rfidScans: defineTable({
    orgId: v.string(),
    deviceId: v.id("rfidDevices"),
    tagId: v.string(),
    productId: v.optional(v.id("products")),
    locationId: v.id("locations"),
    signalStrength: v.optional(v.number()),
    scannedAt: v.number(),
  })
    .index("by_org", ["orgId"])
    .index("by_tag", ["orgId", "tagId"])
    .index("by_device", ["orgId", "deviceId"])
    .index("by_date", ["orgId", "scannedAt"]),

  // ── Suppliers ──
  suppliers: defineTable({
    orgId: v.string(),
    name: v.string(),
    contactName: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    address: v.optional(v.string()),
    paymentTerms: v.union(
      v.literal("net15"),
      v.literal("net30"),
      v.literal("net60"),
      v.literal("net90"),
      v.literal("cod")
    ),
    leadTimeDays: v.number(),
    rating: v.optional(v.number()),
    isActive: v.boolean(),
    notes: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_org", ["orgId"]),

  // ── Purchase Orders ──
  purchaseOrders: defineTable({
    orgId: v.string(),
    supplierId: v.id("suppliers"),
    locationId: v.id("locations"),
    poNumber: v.string(),
    status: v.union(
      v.literal("draft"),
      v.literal("submitted"),
      v.literal("confirmed"),
      v.literal("partially_received"),
      v.literal("received"),
      v.literal("cancelled")
    ),
    items: v.array(v.object({
      productId: v.id("products"),
      name: v.string(),
      sku: v.string(),
      quantity: v.number(),
      unitCost: v.number(),
      receivedQty: v.number(),
      total: v.number(),
    })),
    subtotal: v.number(),
    tax: v.number(),
    total: v.number(),
    expectedDate: v.optional(v.number()),
    receivedDate: v.optional(v.number()),
    notes: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_org", ["orgId"])
    .index("by_supplier", ["orgId", "supplierId"])
    .index("by_status", ["orgId", "status"]),

  // ── Shipping ──
  shipments: defineTable({
    orgId: v.string(),
    type: v.union(v.literal("outbound"), v.literal("inbound"), v.literal("transfer")),
    referenceId: v.optional(v.string()),
    carrier: v.optional(v.string()),
    trackingNumber: v.optional(v.string()),
    status: v.union(
      v.literal("preparing"),
      v.literal("shipped"),
      v.literal("in_transit"),
      v.literal("delivered"),
      v.literal("returned")
    ),
    fromAddress: v.optional(v.string()),
    toAddress: v.optional(v.string()),
    weight: v.optional(v.number()),
    cost: v.optional(v.number()),
    estimatedDelivery: v.optional(v.number()),
    actualDelivery: v.optional(v.number()),
    notes: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_org", ["orgId"])
    .index("by_status", ["orgId", "status"]),

  // ── Invoices ──
  invoices: defineTable({
    orgId: v.string(),
    customerId: v.id("customers"),
    invoiceNumber: v.string(),
    status: v.union(
      v.literal("draft"),
      v.literal("sent"),
      v.literal("paid"),
      v.literal("partially_paid"),
      v.literal("overdue"),
      v.literal("cancelled")
    ),
    items: v.array(v.object({
      productId: v.id("products"),
      name: v.string(),
      sku: v.string(),
      quantity: v.number(),
      unitPrice: v.number(),
      total: v.number(),
    })),
    subtotal: v.number(),
    tax: v.number(),
    total: v.number(),
    paidAmount: v.number(),
    dueDate: v.number(),
    paidAt: v.optional(v.number()),
    notes: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_org", ["orgId"])
    .index("by_customer", ["orgId", "customerId"])
    .index("by_status", ["orgId", "status"]),

  // ── Accounting ──
  accounts: defineTable({
    orgId: v.string(),
    code: v.string(),
    name: v.string(),
    type: v.union(
      v.literal("asset"),
      v.literal("liability"),
      v.literal("equity"),
      v.literal("revenue"),
      v.literal("expense")
    ),
    parentId: v.optional(v.id("accounts")),
    balance: v.number(),
    isActive: v.boolean(),
    description: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_org", ["orgId"])
    .index("by_code", ["orgId", "code"])
    .index("by_type", ["orgId", "type"]),

  journalEntries: defineTable({
    orgId: v.string(),
    entryNumber: v.string(),
    date: v.number(),
    description: v.string(),
    source: v.union(
      v.literal("manual"),
      v.literal("sale"),
      v.literal("purchase"),
      v.literal("refund"),
      v.literal("adjustment")
    ),
    referenceId: v.optional(v.string()),
    lines: v.array(v.object({
      accountId: v.id("accounts"),
      accountName: v.string(),
      debit: v.number(),
      credit: v.number(),
      memo: v.optional(v.string()),
    })),
    isPosted: v.boolean(),
    createdBy: v.string(),
    createdAt: v.number(),
  })
    .index("by_org", ["orgId"])
    .index("by_date", ["orgId", "date"])
    .index("by_source", ["orgId", "source"]),
});
