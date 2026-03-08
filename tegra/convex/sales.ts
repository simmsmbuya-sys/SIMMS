import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const listTransactions = query({
  args: { orgId: v.string(), locationId: v.optional(v.id("locations")) },
  handler: async (ctx, { orgId, locationId }) => {
    if (locationId) {
      return await ctx.db
        .query("transactions")
        .withIndex("by_location", (q) => q.eq("orgId", orgId).eq("locationId", locationId))
        .order("desc")
        .collect();
    }
    return await ctx.db
      .query("transactions")
      .withIndex("by_org", (q) => q.eq("orgId", orgId))
      .order("desc")
      .collect();
  },
});

export const createTransaction = mutation({
  args: {
    orgId: v.string(),
    locationId: v.id("locations"),
    customerId: v.optional(v.id("customers")),
    type: v.union(v.literal("sale"), v.literal("refund"), v.literal("exchange")),
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
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const receiptNumber = `REC-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

    const txId = await ctx.db.insert("transactions", {
      ...args,
      status: "completed",
      receiptNumber,
      createdAt: Date.now(),
    });

    // Adjust stock levels for each item
    for (const item of args.items) {
      const multiplier = args.type === "sale" ? -1 : 1;
      const existing = await ctx.db
        .query("stockLevels")
        .withIndex("by_product_location", (q) =>
          q.eq("orgId", args.orgId).eq("productId", item.productId).eq("locationId", args.locationId)
        )
        .first();

      if (existing) {
        await ctx.db.patch(existing._id, {
          quantity: existing.quantity + (item.quantity * multiplier),
          lastUpdated: Date.now(),
        });
      }
    }

    // Update customer total spend
    if (args.customerId && args.type === "sale") {
      const customer = await ctx.db.get(args.customerId);
      if (customer) {
        await ctx.db.patch(args.customerId, {
          totalSpend: customer.totalSpend + args.total,
        });
      }
    }

    return txId;
  },
});

export const voidTransaction = mutation({
  args: { id: v.id("transactions") },
  handler: async (ctx, { id }) => {
    await ctx.db.patch(id, { status: "voided" });
  },
});

export const getSalesStats = query({
  args: { orgId: v.string(), startDate: v.number(), endDate: v.number() },
  handler: async (ctx, { orgId, startDate, endDate }) => {
    const transactions = await ctx.db
      .query("transactions")
      .withIndex("by_date", (q) =>
        q.eq("orgId", orgId).gte("createdAt", startDate).lte("createdAt", endDate)
      )
      .collect();

    const sales = transactions.filter((t) => t.type === "sale" && t.status === "completed");
    const refunds = transactions.filter((t) => t.type === "refund" && t.status === "completed");

    return {
      totalSales: sales.reduce((sum, t) => sum + t.total, 0),
      totalRefunds: refunds.reduce((sum, t) => sum + t.total, 0),
      transactionCount: sales.length,
      averageOrderValue: sales.length > 0 ? sales.reduce((sum, t) => sum + t.total, 0) / sales.length : 0,
    };
  },
});
