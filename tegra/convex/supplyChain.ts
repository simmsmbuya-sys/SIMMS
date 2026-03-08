import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Valid status transitions
const PO_TRANSITIONS: Record<string, string[]> = {
  draft: ["submitted", "cancelled"],
  submitted: ["confirmed", "cancelled"],
  confirmed: ["partially_received", "received", "cancelled"],
  partially_received: ["received", "cancelled"],
  received: [],
  cancelled: [],
};

const SHIPMENT_TRANSITIONS: Record<string, string[]> = {
  preparing: ["shipped", "returned"],
  shipped: ["in_transit", "returned"],
  in_transit: ["delivered", "returned"],
  delivered: [],
  returned: [],
};

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
    if (args.leadTimeDays < 0) throw new Error("Lead time must be non-negative");
    if (args.rating !== undefined && (args.rating < 0 || args.rating > 5)) {
      throw new Error("Rating must be between 0 and 5");
    }
    return await ctx.db.insert("suppliers", {
      ...args,
      isActive: true,
      createdAt: Date.now(),
    });
  },
});

export const updateSupplier = mutation({
  args: {
    id: v.id("suppliers"),
    orgId: v.string(),
    name: v.optional(v.string()),
    contactName: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    address: v.optional(v.string()),
    paymentTerms: v.optional(v.union(v.literal("net15"), v.literal("net30"), v.literal("net60"), v.literal("net90"), v.literal("cod"))),
    leadTimeDays: v.optional(v.number()),
    rating: v.optional(v.number()),
    isActive: v.optional(v.boolean()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, { id, orgId, ...updates }) => {
    const supplier = await ctx.db.get(id);
    if (!supplier) throw new Error("Supplier not found");
    if (supplier.orgId !== orgId) throw new Error("Access denied");
    const filtered = Object.fromEntries(
      Object.entries(updates).filter(([, val]) => val !== undefined)
    );
    await ctx.db.patch(id, filtered);
  },
});

export const deleteSupplier = mutation({
  args: { id: v.id("suppliers"), orgId: v.string() },
  handler: async (ctx, { id, orgId }) => {
    const supplier = await ctx.db.get(id);
    if (!supplier) throw new Error("Supplier not found");
    if (supplier.orgId !== orgId) throw new Error("Access denied");
    // Soft-delete by deactivating
    await ctx.db.patch(id, { isActive: false });
  },
});

// ── Purchase Orders ──
export const listPurchaseOrders = query({
  args: {
    orgId: v.string(),
    status: v.optional(v.union(
      v.literal("draft"), v.literal("submitted"), v.literal("confirmed"),
      v.literal("partially_received"), v.literal("received"), v.literal("cancelled")
    )),
  },
  handler: async (ctx, { orgId, status }) => {
    const pos = await ctx.db
      .query("purchaseOrders")
      .withIndex("by_org", (q) => q.eq("orgId", orgId))
      .order("desc")
      .collect();
    if (status) return pos.filter((po) => po.status === status);
    return pos;
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
    for (const item of args.items) {
      if (item.quantity <= 0) throw new Error(`Quantity must be positive for ${item.name}`);
      if (item.unitCost < 0) throw new Error(`Unit cost must be non-negative for ${item.name}`);
    }
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
    orgId: v.string(),
    status: v.union(
      v.literal("draft"), v.literal("submitted"), v.literal("confirmed"),
      v.literal("partially_received"), v.literal("received"), v.literal("cancelled")
    ),
  },
  handler: async (ctx, { id, orgId, status }) => {
    const po = await ctx.db.get(id);
    if (!po) throw new Error("Purchase order not found");
    if (po.orgId !== orgId) throw new Error("Access denied");

    // Validate status transition
    const allowed = PO_TRANSITIONS[po.status];
    if (!allowed || !allowed.includes(status)) {
      throw new Error(`Cannot transition from "${po.status}" to "${status}"`);
    }

    const updates: Record<string, unknown> = { status };
    if (status === "received") {
      updates.receivedDate = Date.now();

      // Increase stock levels when PO is fully received
      for (const item of po.items) {
        const existing = await ctx.db
          .query("stockLevels")
          .withIndex("by_product_location", (q) =>
            q.eq("orgId", orgId).eq("productId", item.productId).eq("locationId", po.locationId)
          )
          .first();

        const qtyToAdd = item.quantity - item.receivedQty; // Only add unreceived qty
        if (qtyToAdd > 0) {
          if (existing) {
            await ctx.db.patch(existing._id, {
              quantity: existing.quantity + qtyToAdd,
              lastUpdated: Date.now(),
            });
          } else {
            await ctx.db.insert("stockLevels", {
              orgId,
              productId: item.productId,
              locationId: po.locationId,
              quantity: qtyToAdd,
              reservedQty: 0,
              lastUpdated: Date.now(),
            });
          }
        }
      }
    }

    await ctx.db.patch(id, updates);
  },
});

export const deletePurchaseOrder = mutation({
  args: { id: v.id("purchaseOrders"), orgId: v.string() },
  handler: async (ctx, { id, orgId }) => {
    const po = await ctx.db.get(id);
    if (!po) throw new Error("PO not found");
    if (po.orgId !== orgId) throw new Error("Access denied");
    if (po.status !== "draft") throw new Error("Can only delete draft POs");
    await ctx.db.delete(id);
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
    orgId: v.string(),
    status: v.union(
      v.literal("preparing"), v.literal("shipped"), v.literal("in_transit"),
      v.literal("delivered"), v.literal("returned")
    ),
  },
  handler: async (ctx, { id, orgId, status }) => {
    const shipment = await ctx.db.get(id);
    if (!shipment) throw new Error("Shipment not found");
    if (shipment.orgId !== orgId) throw new Error("Access denied");

    const allowed = SHIPMENT_TRANSITIONS[shipment.status];
    if (!allowed || !allowed.includes(status)) {
      throw new Error(`Cannot transition from "${shipment.status}" to "${status}"`);
    }

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
    for (const item of args.items) {
      if (item.quantity <= 0) throw new Error(`Quantity must be positive for ${item.name}`);
      if (item.unitPrice < 0) throw new Error(`Price must be non-negative for ${item.name}`);
    }
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

export const updateInvoiceStatus = mutation({
  args: {
    id: v.id("invoices"),
    orgId: v.string(),
    status: v.union(
      v.literal("draft"), v.literal("sent"), v.literal("cancelled")
    ),
  },
  handler: async (ctx, { id, orgId, status }) => {
    const invoice = await ctx.db.get(id);
    if (!invoice) throw new Error("Invoice not found");
    if (invoice.orgId !== orgId) throw new Error("Access denied");
    if (invoice.status === "paid") throw new Error("Cannot change status of paid invoice");
    await ctx.db.patch(id, { status });
  },
});

export const recordPayment = mutation({
  args: { id: v.id("invoices"), orgId: v.string(), amount: v.number() },
  handler: async (ctx, { id, orgId, amount }) => {
    const invoice = await ctx.db.get(id);
    if (!invoice) throw new Error("Invoice not found");
    if (invoice.orgId !== orgId) throw new Error("Access denied");
    if (invoice.status === "draft") throw new Error("Cannot record payment on a draft invoice");
    if (invoice.status === "cancelled") throw new Error("Cannot record payment on a cancelled invoice");
    if (amount <= 0) throw new Error("Payment amount must be positive");

    const balance = invoice.total - invoice.paidAmount;
    if (amount > balance + 0.01) throw new Error(`Payment ($${amount}) exceeds balance ($${balance.toFixed(2)})`);

    const newPaid = Math.min(invoice.paidAmount + amount, invoice.total);
    const status = newPaid >= invoice.total ? "paid" : "partially_paid";
    await ctx.db.patch(id, {
      paidAmount: Math.round(newPaid * 100) / 100,
      status,
      ...(status === "paid" ? { paidAt: Date.now() } : {}),
    });
  },
});

export const deleteInvoice = mutation({
  args: { id: v.id("invoices"), orgId: v.string() },
  handler: async (ctx, { id, orgId }) => {
    const invoice = await ctx.db.get(id);
    if (!invoice) throw new Error("Invoice not found");
    if (invoice.orgId !== orgId) throw new Error("Access denied");
    if (invoice.status !== "draft") throw new Error("Can only delete draft invoices");
    await ctx.db.delete(id);
  },
});
