import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    supabaseUserId: v.string(),
    firstName: v.string(),
    lastName: v.string(),
    userName: v.string(),
    email: v.string(),
    profilePhoto: v.optional(v.string()),
    homeClub: v.optional(v.string()),
    collageName: v.string(),
    pinCode: v.number(),
    address: v.string(),
    posts: v.array(v.id("posts")),
    savedPosts: v.array(v.id("posts")),
    likedPosts: v.array(v.id("posts")),
    followers: v.array(v.id("users")),
    following: v.array(v.id("users")),
    pinsCount: v.number(),
    createdAt: v.number(),
  })
    .index("by_supabaseUserId", ["supabaseUserId"])
    .index("by_userName", ["userName"])
    .index("by_email", ["email"])
    .searchIndex("search_userName", { searchField: "userName" }),

  posts: defineTable({
    creator: v.id("users"),
    caption: v.string(),
    postPhoto: v.string(),
    postAudio: v.string(),
    tag: v.string(),
    likes: v.array(v.id("users")),
    tape: v.array(v.id("users")),
    createdAt: v.number(),
  })
    .index("by_creator", ["creator"])
    .searchIndex("search_caption", { searchField: "caption" }),

  colleges: defineTable({
    name: v.string(),
    lat: v.optional(v.number()),
    lng: v.optional(v.number()),
    radioStations: v.array(
      v.object({ lat: v.number(), lng: v.number(), name: v.string() })
    ),
  }).index("by_name", ["name"]),
});
