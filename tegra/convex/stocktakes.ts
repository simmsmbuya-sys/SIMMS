import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const list = query({
  args: { orgId: v.string() },
  handler: async (ctx, { orgId }) => {
    return await ctx.db
      .query("stocktakes")
      .withIndex("by_org", (q) => q.eq("orgId", orgId))
      .order("desc")
      .collect();
  },
});

export const create = mutation({
  args: {
    orgId: v.string(),
    locationId: v.id("locations"),
    startedBy: v.string(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const stocktakeId = await ctx.db.insert("stocktakes", {
      ...args,
      status: "draft",
      createdAt: Date.now(),
    });

    // Pre-populate items from current stock at location
    const stockLevels = await ctx.db
      .query("stockLevels")
      .withIndex("by_location", (q) => q.eq("orgId", args.orgId).eq("locationId", args.locationId))
      .collect();

    for (const sl of stockLevels) {
      await ctx.db.insert("stocktakeItems", {
        orgId: args.orgId,
        stocktakeId,
        productId: sl.productId,
        expectedQty: sl.quantity,
        countedQty: 0,
        discrepancy: 0,
      });
    }

    return stocktakeId;
  },
});

export const getItems = query({
  args: { stocktakeId: v.id("stocktakes") },
  handler: async (ctx, { stocktakeId }) => {
    return await ctx.db
      .query("stocktakeItems")
      .withIndex("by_stocktake", (q) => q.eq("stocktakeId", stocktakeId))
      .collect();
  },
});

export const updateCount = mutation({
  args: {
    id: v.id("stocktakeItems"),
    countedQty: v.number(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, { id, countedQty, notes }) => {
    const item = await ctx.db.get(id);
    if (!item) throw new Error("Stocktake item not found");
    await ctx.db.patch(id, {
      countedQty,
      discrepancy: countedQty - item.expectedQty,
      ...(notes ? { notes } : {}),
    });
  },
});

export const complete = mutation({
  args: { id: v.id("stocktakes"), applyAdjustments: v.boolean() },
  handler: async (ctx, { id, applyAdjustments }) => {
    const stocktake = await ctx.db.get(id);
    if (!stocktake) throw new Error("Stocktake not found");

    if (applyAdjustments) {
      const items = await ctx.db
        .query("stocktakeItems")
        .withIndex("by_stocktake", (q) => q.eq("stocktakeId", id))
        .collect();

      for (const item of items) {
        if (item.discrepancy !== 0) {
          const stockLevel = await ctx.db
            .query("stockLevels")
            .withIndex("by_product_location", (q) =>
              q.eq("orgId", stocktake.orgId).eq("productId", item.productId).eq("locationId", stocktake.locationId)
            )
            .first();
          if (stockLevel) {
            await ctx.db.patch(stockLevel._id, {
              quantity: item.countedQty,
              lastUpdated: Date.now(),
            });
          }
        }
      }
    }

    await ctx.db.patch(id, { status: "completed", completedAt: Date.now() });
  },
});
