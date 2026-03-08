import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const listDevices = query({
  args: { orgId: v.string() },
  handler: async (ctx, { orgId }) => {
    return await ctx.db
      .query("rfidDevices")
      .withIndex("by_org", (q) => q.eq("orgId", orgId))
      .collect();
  },
});

export const registerDevice = mutation({
  args: {
    orgId: v.string(),
    name: v.string(),
    type: v.union(v.literal("usb"), v.literal("fixed"), v.literal("handheld"), v.literal("gateway")),
    locationId: v.id("locations"),
    serialNumber: v.string(),
    firmware: v.optional(v.string()),
    config: v.optional(v.object({
      power: v.optional(v.number()),
      frequency: v.optional(v.string()),
      antennaCount: v.optional(v.number()),
    })),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("rfidDevices", {
      ...args,
      status: "active",
      createdAt: Date.now(),
    });
  },
});

export const updateDeviceStatus = mutation({
  args: {
    id: v.id("rfidDevices"),
    status: v.union(v.literal("active"), v.literal("inactive"), v.literal("maintenance")),
  },
  handler: async (ctx, { id, status }) => {
    await ctx.db.patch(id, { status });
  },
});

export const recordScan = mutation({
  args: {
    orgId: v.string(),
    deviceId: v.id("rfidDevices"),
    tagId: v.string(),
    productId: v.optional(v.id("products")),
    locationId: v.id("locations"),
    signalStrength: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Update device last seen
    await ctx.db.patch(args.deviceId, { lastSeen: Date.now() });

    return await ctx.db.insert("rfidScans", {
      ...args,
      scannedAt: Date.now(),
    });
  },
});

export const listScans = query({
  args: { orgId: v.string(), deviceId: v.optional(v.id("rfidDevices")), limit: v.optional(v.number()) },
  handler: async (ctx, { orgId, deviceId, limit }) => {
    let q;
    if (deviceId) {
      q = ctx.db
        .query("rfidScans")
        .withIndex("by_device", (qi) => qi.eq("orgId", orgId).eq("deviceId", deviceId));
    } else {
      q = ctx.db
        .query("rfidScans")
        .withIndex("by_org", (qi) => qi.eq("orgId", orgId));
    }
    const results = await q.order("desc").collect();
    return limit ? results.slice(0, limit) : results;
  },
});

export const lookupTag = query({
  args: { orgId: v.string(), tagId: v.string() },
  handler: async (ctx, { orgId, tagId }) => {
    return await ctx.db
      .query("rfidScans")
      .withIndex("by_tag", (q) => q.eq("orgId", orgId).eq("tagId", tagId))
      .order("desc")
      .collect();
  },
});
