import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const list = query({
  args: { orgId: v.string() },
  handler: async (ctx, { orgId }) => {
    return await ctx.db
      .query("locations")
      .withIndex("by_org", (q) => q.eq("orgId", orgId))
      .collect();
  },
});

export const getById = query({
  args: { id: v.id("locations"), orgId: v.string() },
  handler: async (ctx, { id, orgId }) => {
    const location = await ctx.db.get(id);
    if (!location || location.orgId !== orgId) return null;
    return location;
  },
});

export const create = mutation({
  args: {
    orgId: v.string(),
    name: v.string(),
    type: v.union(v.literal("store"), v.literal("warehouse")),
    address: v.optional(v.string()),
    phone: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("locations", {
      ...args,
      isActive: true,
      createdAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("locations"),
    orgId: v.string(),
    name: v.optional(v.string()),
    address: v.optional(v.string()),
    phone: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, { id, orgId, ...updates }) => {
    const location = await ctx.db.get(id);
    if (!location) throw new Error("Location not found");
    if (location.orgId !== orgId) throw new Error("Access denied");
    const filtered = Object.fromEntries(
      Object.entries(updates).filter(([, val]) => val !== undefined)
    );
    await ctx.db.patch(id, filtered);
  },
});

export const deleteLocation = mutation({
  args: { id: v.id("locations"), orgId: v.string() },
  handler: async (ctx, { id, orgId }) => {
    const location = await ctx.db.get(id);
    if (!location) throw new Error("Location not found");
    if (location.orgId !== orgId) throw new Error("Access denied");
    // Soft-delete
    await ctx.db.patch(id, { isActive: false });
  },
});
