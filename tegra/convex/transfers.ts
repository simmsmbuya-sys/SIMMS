import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

const TRANSFER_TRANSITIONS: Record<string, string[]> = {
  draft: ["pending", "cancelled"],
  pending: ["in_transit", "cancelled"],
  in_transit: ["received", "cancelled"],
  received: [],
  cancelled: [],
};

export const list = query({
  args: { orgId: v.string() },
  handler: async (ctx, { orgId }) => {
    return await ctx.db
      .query("transfers")
      .withIndex("by_org", (q) => q.eq("orgId", orgId))
      .order("desc")
      .collect();
  },
});

export const create = mutation({
  args: {
    orgId: v.string(),
    fromLocationId: v.id("locations"),
    toLocationId: v.id("locations"),
    items: v.array(v.object({
      productId: v.id("products"),
      name: v.string(),
      sku: v.string(),
      quantity: v.number(),
    })),
    requestedBy: v.string(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (args.fromLocationId === args.toLocationId) {
      throw new Error("Source and destination locations must be different");
    }
    for (const item of args.items) {
      if (item.quantity <= 0) throw new Error(`Quantity must be positive for ${item.name}`);
    }
    return await ctx.db.insert("transfers", {
      ...args,
      status: "pending",
      createdAt: Date.now(),
    });
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("transfers"),
    orgId: v.string(),
    status: v.union(
      v.literal("draft"), v.literal("pending"), v.literal("in_transit"),
      v.literal("received"), v.literal("cancelled")
    ),
    approvedBy: v.optional(v.string()),
  },
  handler: async (ctx, { id, orgId, status, approvedBy }) => {
    const transfer = await ctx.db.get(id);
    if (!transfer) throw new Error("Transfer not found");
    if (transfer.orgId !== orgId) throw new Error("Access denied");

    // Validate status transition
    const allowed = TRANSFER_TRANSITIONS[transfer.status];
    if (!allowed || !allowed.includes(status)) {
      throw new Error(`Cannot transition from "${transfer.status}" to "${status}"`);
    }

    const updates: Record<string, unknown> = { status };
    if (approvedBy) updates.approvedBy = approvedBy;
    if (status === "in_transit") updates.shippedAt = Date.now();
    if (status === "received") {
      updates.receivedAt = Date.now();
      // Move stock between locations
      for (const item of transfer.items) {
        // Verify source has sufficient stock
        const fromStock = await ctx.db
          .query("stockLevels")
          .withIndex("by_product_location", (q) =>
            q.eq("orgId", transfer.orgId).eq("productId", item.productId).eq("locationId", transfer.fromLocationId)
          )
          .first();

        if (!fromStock || fromStock.quantity < item.quantity) {
          throw new Error(`Insufficient stock for ${item.name} at source location`);
        }

        // Decrease from source
        await ctx.db.patch(fromStock._id, {
          quantity: fromStock.quantity - item.quantity,
          lastUpdated: Date.now(),
        });

        // Increase at destination
        const toStock = await ctx.db
          .query("stockLevels")
          .withIndex("by_product_location", (q) =>
            q.eq("orgId", transfer.orgId).eq("productId", item.productId).eq("locationId", transfer.toLocationId)
          )
          .first();
        if (toStock) {
          await ctx.db.patch(toStock._id, {
            quantity: toStock.quantity + item.quantity,
            lastUpdated: Date.now(),
          });
        } else {
          await ctx.db.insert("stockLevels", {
            orgId: transfer.orgId,
            productId: item.productId,
            locationId: transfer.toLocationId,
            quantity: item.quantity,
            reservedQty: 0,
            lastUpdated: Date.now(),
          });
        }
      }
    }

    await ctx.db.patch(id, updates);
  },
});

export const deleteTransfer = mutation({
  args: { id: v.id("transfers"), orgId: v.string() },
  handler: async (ctx, { id, orgId }) => {
    const transfer = await ctx.db.get(id);
    if (!transfer) throw new Error("Transfer not found");
    if (transfer.orgId !== orgId) throw new Error("Access denied");
    if (!["draft", "pending"].includes(transfer.status)) {
      throw new Error("Can only delete draft or pending transfers");
    }
    await ctx.db.delete(id);
  },
});
