import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const list = query({
  args: { orgId: v.string(), type: v.optional(v.union(v.literal("retail"), v.literal("wholesale"), v.literal("b2b"))) },
  handler: async (ctx, { orgId, type }) => {
    if (type) {
      return await ctx.db
        .query("customers")
        .withIndex("by_type", (q) => q.eq("orgId", orgId).eq("type", type))
        .collect();
    }
    return await ctx.db
      .query("customers")
      .withIndex("by_org", (q) => q.eq("orgId", orgId))
      .collect();
  },
});

export const create = mutation({
  args: {
    orgId: v.string(),
    name: v.string(),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    type: v.union(v.literal("retail"), v.literal("wholesale"), v.literal("b2b")),
    company: v.optional(v.string()),
    address: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("customers", {
      ...args,
      totalSpend: 0,
      createdAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("customers"),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    type: v.optional(v.union(v.literal("retail"), v.literal("wholesale"), v.literal("b2b"))),
    company: v.optional(v.string()),
    address: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, { id, ...updates }) => {
    const filtered = Object.fromEntries(
      Object.entries(updates).filter(([, val]) => val !== undefined)
    );
    await ctx.db.patch(id, filtered);
  },
});

export const getHistory = query({
  args: { orgId: v.string(), customerId: v.id("customers") },
  handler: async (ctx, { orgId, customerId }) => {
    return await ctx.db
      .query("transactions")
      .withIndex("by_customer", (q) => q.eq("orgId", orgId).eq("customerId", customerId))
      .order("desc")
      .collect();
  },
});
