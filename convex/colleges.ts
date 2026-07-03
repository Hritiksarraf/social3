import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("colleges").collect();
  },
});

export const getOrCreate = mutation({
  args: { name: v.string() },
  handler: async (ctx, { name }) => {
    const existing = await ctx.db
      .query("colleges")
      .withIndex("by_name", (q) => q.eq("name", name))
      .unique();
    if (existing) return existing;

    const id = await ctx.db.insert("colleges", { name, radioStations: [] });
    return await ctx.db.get(id);
  },
});

export const addRadioStation = mutation({
  args: {
    collegeName: v.string(),
    name: v.string(),
    lat: v.number(),
    lng: v.number(),
  },
  handler: async (ctx, { collegeName, name, lat, lng }) => {
    const college = await ctx.db
      .query("colleges")
      .withIndex("by_name", (q) => q.eq("name", collegeName))
      .unique();
    if (!college) throw new Error("College not found");

    const newRadioStation = {
      lat: lat + (Math.random() - 0.5) * 0.002,
      lng: lng + (Math.random() - 0.5) * 0.002,
      name,
    };

    await ctx.db.patch(college._id, {
      lat,
      lng,
      radioStations: [...college.radioStations, newRadioStation],
    });
  },
});
