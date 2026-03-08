import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

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
    status: v.union(
      v.literal("draft"), v.literal("pending"), v.literal("in_transit"),
      v.literal("received"), v.literal("cancelled")
    ),
    approvedBy: v.optional(v.string()),
  },
  handler: async (ctx, { id, status, approvedBy }) => {
    const transfer = await ctx.db.get(id);
    if (!transfer) throw new Error("Transfer not found");

    const updates: Record<string, unknown> = { status };
    if (approvedBy) updates.approvedBy = approvedBy;
    if (status === "in_transit") updates.shippedAt = Date.now();
    if (status === "received") {
      updates.receivedAt = Date.now();
      // Move stock between locations
      for (const item of transfer.items) {
        // Decrease from source
        const fromStock = await ctx.db
          .query("stockLevels")
          .withIndex("by_product_location", (q) =>
            q.eq("orgId", transfer.orgId).eq("productId", item.productId).eq("locationId", transfer.fromLocationId)
          )
          .first();
        if (fromStock) {
          await ctx.db.patch(fromStock._id, {
            quantity: fromStock.quantity - item.quantity,
            lastUpdated: Date.now(),
          });
        }

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
