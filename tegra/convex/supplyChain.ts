import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// ── Suppliers ──
export const listSuppliers = query({
  args: { orgId: v.string() },
  handler: async (ctx, { orgId }) => {
    return await ctx.db
      .query("suppliers")
      .withIndex("by_org", (q) => q.eq("orgId", orgId))
      .collect();
  },
});

export const createSupplier = mutation({
  args: {
    orgId: v.string(),
    name: v.string(),
    contactName: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    address: v.optional(v.string()),
    paymentTerms: v.union(v.literal("net15"), v.literal("net30"), v.literal("net60"), v.literal("net90"), v.literal("cod")),
    leadTimeDays: v.number(),
    rating: v.optional(v.number()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("suppliers", {
      ...args,
      isActive: true,
      createdAt: Date.now(),
    });
  },
});

// ── Purchase Orders ──
export const listPurchaseOrders = query({
  args: { orgId: v.string(), status: v.optional(v.string()) },
  handler: async (ctx, { orgId }) => {
    return await ctx.db
      .query("purchaseOrders")
      .withIndex("by_org", (q) => q.eq("orgId", orgId))
      .order("desc")
      .collect();
  },
});

export const createPurchaseOrder = mutation({
  args: {
    orgId: v.string(),
    supplierId: v.id("suppliers"),
    locationId: v.id("locations"),
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
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const poNumber = `PO-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    return await ctx.db.insert("purchaseOrders", {
      ...args,
      poNumber,
      status: "draft",
      createdAt: Date.now(),
    });
  },
});

export const updatePOStatus = mutation({
  args: {
    id: v.id("purchaseOrders"),
    status: v.union(
      v.literal("draft"), v.literal("submitted"), v.literal("confirmed"),
      v.literal("partially_received"), v.literal("received"), v.literal("cancelled")
    ),
  },
  handler: async (ctx, { id, status }) => {
    const updates: Record<string, unknown> = { status };
    if (status === "received") updates.receivedDate = Date.now();
    await ctx.db.patch(id, updates);
  },
});

// ── Shipments ──
export const listShipments = query({
  args: { orgId: v.string() },
  handler: async (ctx, { orgId }) => {
    return await ctx.db
      .query("shipments")
      .withIndex("by_org", (q) => q.eq("orgId", orgId))
      .order("desc")
      .collect();
  },
});

export const createShipment = mutation({
  args: {
    orgId: v.string(),
    type: v.union(v.literal("outbound"), v.literal("inbound"), v.literal("transfer")),
    referenceId: v.optional(v.string()),
    carrier: v.optional(v.string()),
    trackingNumber: v.optional(v.string()),
    fromAddress: v.optional(v.string()),
    toAddress: v.optional(v.string()),
    weight: v.optional(v.number()),
    cost: v.optional(v.number()),
    estimatedDelivery: v.optional(v.number()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("shipments", {
      ...args,
      status: "preparing",
      createdAt: Date.now(),
    });
  },
});

export const updateShipmentStatus = mutation({
  args: {
    id: v.id("shipments"),
    status: v.union(
      v.literal("preparing"), v.literal("shipped"), v.literal("in_transit"),
      v.literal("delivered"), v.literal("returned")
    ),
  },
  handler: async (ctx, { id, status }) => {
    const updates: Record<string, unknown> = { status };
    if (status === "delivered") updates.actualDelivery = Date.now();
    await ctx.db.patch(id, updates);
  },
});

// ── Invoices ──
export const listInvoices = query({
  args: { orgId: v.string() },
  handler: async (ctx, { orgId }) => {
    return await ctx.db
      .query("invoices")
      .withIndex("by_org", (q) => q.eq("orgId", orgId))
      .order("desc")
      .collect();
  },
});

export const createInvoice = mutation({
  args: {
    orgId: v.string(),
    customerId: v.id("customers"),
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
    dueDate: v.number(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const invoiceNumber = `INV-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    return await ctx.db.insert("invoices", {
      ...args,
      invoiceNumber,
      status: "draft",
      paidAmount: 0,
      createdAt: Date.now(),
    });
  },
});

export const recordPayment = mutation({
  args: { id: v.id("invoices"), amount: v.number() },
  handler: async (ctx, { id, amount }) => {
    const invoice = await ctx.db.get(id);
    if (!invoice) throw new Error("Invoice not found");
    const newPaid = invoice.paidAmount + amount;
    const status = newPaid >= invoice.total ? "paid" : "partially_paid";
    await ctx.db.patch(id, {
      paidAmount: newPaid,
      status,
      ...(status === "paid" ? { paidAt: Date.now() } : {}),
    });
  },
});
