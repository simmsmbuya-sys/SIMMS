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
  args: { id: v.id("products"), orgId: v.string() },
  handler: async (ctx, { id, orgId }) => {
    const product = await ctx.db.get(id);
    if (!product || product.orgId !== orgId) return null;
    return product;
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
    imageUrl: v.optional(v.string()),
    rfidTagId: v.optional(v.string()),
    barcode: v.optional(v.string()),
    reorderPoint: v.number(),
    reorderQty: v.number(),
  },
  handler: async (ctx, args) => {
    // Validate prices
    if (args.costPrice < 0) throw new Error("Cost price must be non-negative");
    if (args.sellingPrice < 0) throw new Error("Selling price must be non-negative");
    if (args.taxRate < 0) throw new Error("Tax rate must be non-negative");
    if (args.reorderPoint < 0) throw new Error("Reorder point must be non-negative");
    if (args.reorderQty < 0) throw new Error("Reorder quantity must be non-negative");

    // Check SKU uniqueness per org
    const existing = await ctx.db
      .query("products")
      .withIndex("by_sku", (q) => q.eq("orgId", args.orgId).eq("sku", args.sku))
      .first();
    if (existing) throw new Error(`SKU ${args.sku} already exists`);

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
    orgId: v.string(),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    categoryId: v.optional(v.id("categories")),
    costPrice: v.optional(v.number()),
    sellingPrice: v.optional(v.number()),
    taxRate: v.optional(v.number()),
    unit: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    rfidTagId: v.optional(v.string()),
    barcode: v.optional(v.string()),
    reorderPoint: v.optional(v.number()),
    reorderQty: v.optional(v.number()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, { id, orgId, ...updates }) => {
    const existing = await ctx.db.get(id);
    if (!existing) throw new Error("Product not found");
    if (existing.orgId !== orgId) throw new Error("Access denied");
    const filtered = Object.fromEntries(
      Object.entries(updates).filter(([, val]) => val !== undefined)
    );
    await ctx.db.patch(id, filtered);
  },
});

export const deleteProduct = mutation({
  args: { id: v.id("products"), orgId: v.string() },
  handler: async (ctx, { id, orgId }) => {
    const product = await ctx.db.get(id);
    if (!product) throw new Error("Product not found");
    if (product.orgId !== orgId) throw new Error("Access denied");
    // Soft-delete
    await ctx.db.patch(id, { isActive: false });
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
      const newQty = existing.quantity + quantityChange;
      if (newQty < 0) throw new Error("Stock cannot go below zero");
      await ctx.db.patch(existing._id, {
        quantity: newQty,
        lastUpdated: Date.now(),
      });
    } else {
      if (quantityChange < 0) throw new Error("Stock cannot go below zero");
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

export const deleteCategory = mutation({
  args: { id: v.id("categories"), orgId: v.string() },
  handler: async (ctx, { id, orgId }) => {
    const cat = await ctx.db.get(id);
    if (!cat) throw new Error("Category not found");
    if (cat.orgId !== orgId) throw new Error("Access denied");
    await ctx.db.delete(id);
  },
});

export const getLowStockAlerts = query({
  args: { orgId: v.string() },
  handler: async (ctx, { orgId }) => {
    // Fetch all stock levels in one query instead of N+1
    const allStockLevels = await ctx.db
      .query("stockLevels")
      .withIndex("by_product", (q) => q.eq("orgId", orgId))
      .collect();

    // Group stock by product
    const stockByProduct = new Map<string, number>();
    for (const sl of allStockLevels) {
      const current = stockByProduct.get(sl.productId) || 0;
      stockByProduct.set(sl.productId, current + sl.quantity);
    }

    const products = await ctx.db
      .query("products")
      .withIndex("by_org", (q) => q.eq("orgId", orgId))
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();

    const alerts = [];
    for (const product of products) {
      const totalStock = stockByProduct.get(product._id) || 0;
      if (totalStock <= product.reorderPoint) {
        const stockLevels = allStockLevels.filter((sl) => sl.productId === product._id);
        alerts.push({ product, totalStock, stockLevels });
      }
    }
    return alerts;
  },
});
