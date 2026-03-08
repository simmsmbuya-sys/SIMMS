import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const listProducts = query({
  args: { orgId: v.string() },
  handler: async (ctx, { orgId }) => {
    return await ctx.db
      .query("products")
      .withIndex("by_org", (q) => q.eq("orgId", orgId))
      .collect();
  },
});

export const getProduct = query({
  args: { id: v.id("products") },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id);
  },
});

export const getStockLevels = query({
  args: { orgId: v.string(), productId: v.optional(v.id("products")) },
  handler: async (ctx, { orgId, productId }) => {
    if (productId) {
      return await ctx.db
        .query("stockLevels")
        .withIndex("by_product", (q) => q.eq("orgId", orgId).eq("productId", productId))
        .collect();
    }
    return await ctx.db
      .query("stockLevels")
      .withIndex("by_product", (q) => q.eq("orgId", orgId))
      .collect();
  },
});

export const createProduct = mutation({
  args: {
    orgId: v.string(),
    sku: v.string(),
    name: v.string(),
    description: v.optional(v.string()),
    categoryId: v.optional(v.id("categories")),
    costPrice: v.number(),
    sellingPrice: v.number(),
    taxRate: v.number(),
    unit: v.string(),
    reorderPoint: v.number(),
    reorderQty: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("products", {
      ...args,
      isActive: true,
      createdAt: Date.now(),
    });
  },
});

export const updateProduct = mutation({
  args: {
    id: v.id("products"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    costPrice: v.optional(v.number()),
    sellingPrice: v.optional(v.number()),
    taxRate: v.optional(v.number()),
    reorderPoint: v.optional(v.number()),
    reorderQty: v.optional(v.number()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, { id, ...updates }) => {
    const existing = await ctx.db.get(id);
    if (!existing) throw new Error("Product not found");
    const filtered = Object.fromEntries(
      Object.entries(updates).filter(([, val]) => val !== undefined)
    );
    await ctx.db.patch(id, filtered);
  },
});

export const adjustStock = mutation({
  args: {
    orgId: v.string(),
    productId: v.id("products"),
    locationId: v.id("locations"),
    quantityChange: v.number(),
  },
  handler: async (ctx, { orgId, productId, locationId, quantityChange }) => {
    const existing = await ctx.db
      .query("stockLevels")
      .withIndex("by_product_location", (q) =>
        q.eq("orgId", orgId).eq("productId", productId).eq("locationId", locationId)
      )
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        quantity: existing.quantity + quantityChange,
        lastUpdated: Date.now(),
      });
    } else {
      await ctx.db.insert("stockLevels", {
        orgId,
        productId,
        locationId,
        quantity: quantityChange,
        reservedQty: 0,
        lastUpdated: Date.now(),
      });
    }
  },
});

export const listCategories = query({
  args: { orgId: v.string() },
  handler: async (ctx, { orgId }) => {
    return await ctx.db
      .query("categories")
      .withIndex("by_org", (q) => q.eq("orgId", orgId))
      .collect();
  },
});

export const createCategory = mutation({
  args: {
    orgId: v.string(),
    name: v.string(),
    description: v.optional(v.string()),
    parentId: v.optional(v.id("categories")),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("categories", args);
  },
});

export const getLowStockAlerts = query({
  args: { orgId: v.string() },
  handler: async (ctx, { orgId }) => {
    const products = await ctx.db
      .query("products")
      .withIndex("by_org", (q) => q.eq("orgId", orgId))
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();

    const alerts = [];
    for (const product of products) {
      const stockLevels = await ctx.db
        .query("stockLevels")
        .withIndex("by_product", (q) => q.eq("orgId", orgId).eq("productId", product._id))
        .collect();
      const totalStock = stockLevels.reduce((sum, sl) => sum + sl.quantity, 0);
      if (totalStock <= product.reorderPoint) {
        alerts.push({ product, totalStock, stockLevels });
      }
    }
    return alerts;
  },
});
