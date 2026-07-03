import { v } from "convex/values";
import { mutation, query, QueryCtx } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

async function resolveUsers(ctx: QueryCtx, ids: Id<"users">[]) {
  const docs = await Promise.all(ids.map((id) => ctx.db.get(id)));
  return docs.filter((d): d is Doc<"users"> => d !== null);
}

async function resolvePosts(ctx: QueryCtx, ids: Id<"posts">[]) {
  const docs = await Promise.all(ids.map((id) => ctx.db.get(id)));
  return docs.filter((d): d is Doc<"posts"> => d !== null);
}

async function withCreator(ctx: QueryCtx, posts: Doc<"posts">[]) {
  return Promise.all(
    posts.map(async (post) => ({ ...post, creator: await ctx.db.get(post.creator) }))
  );
}

export const getBySupabaseId = query({
  args: { supabaseUserId: v.string() },
  handler: async (ctx, { supabaseUserId }) => {
    return await ctx.db
      .query("users")
      .withIndex("by_supabaseUserId", (q) => q.eq("supabaseUserId", supabaseUserId))
      .unique();
  },
});

export const ensureUser = mutation({
  args: {
    supabaseUserId: v.string(),
    email: v.string(),
    firstName: v.string(),
    lastName: v.string(),
    userName: v.string(),
    collageName: v.string(),
    pinCode: v.number(),
    address: v.string(),
    profilePhoto: v.optional(v.string()),
    homeClub: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_supabaseUserId", (q) => q.eq("supabaseUserId", args.supabaseUserId))
      .unique();
    if (existing) return existing._id;

    const userNameTaken = await ctx.db
      .query("users")
      .withIndex("by_userName", (q) => q.eq("userName", args.userName))
      .unique();
    if (userNameTaken) throw new Error("Username already taken");

    return await ctx.db.insert("users", {
      ...args,
      profilePhoto: args.profilePhoto ?? "",
      posts: [],
      savedPosts: [],
      likedPosts: [],
      followers: [],
      following: [],
      pinsCount: 100,
      createdAt: Date.now(),
    });
  },
});

export const setHomeClub = mutation({
  args: { userId: v.id("users"), homeClub: v.string() },
  handler: async (ctx, { userId, homeClub }) => {
    await ctx.db.patch(userId, { homeClub });
  },
});

export const getProfile = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    const user = await ctx.db.get(userId);
    if (!user) return null;

    const [posts, savedPosts, likedPosts, followers, following] = await Promise.all([
      resolvePosts(ctx, user.posts).then((p) => withCreator(ctx, p)),
      resolvePosts(ctx, user.savedPosts).then((p) => withCreator(ctx, p)),
      resolvePosts(ctx, user.likedPosts).then((p) => withCreator(ctx, p)),
      resolveUsers(ctx, user.followers),
      resolveUsers(ctx, user.following),
    ]);

    return { ...user, posts, savedPosts, likedPosts, followers, following };
  },
});

export const searchUsers = query({
  args: { queryText: v.string() },
  handler: async (ctx, { queryText }) => {
    const users = await ctx.db
      .query("users")
      .withSearchIndex("search_userName", (q) => q.search("userName", queryText))
      .collect();

    const lower = queryText.toLowerCase();
    const all = await ctx.db.query("users").collect();
    const nameMatches = all.filter(
      (u) =>
        u.firstName.toLowerCase().includes(lower) || u.lastName.toLowerCase().includes(lower)
    );

    const merged = new Map<Id<"users">, Doc<"users">>();
    for (const u of [...users, ...nameMatches]) merged.set(u._id, u);
    return Array.from(merged.values());
  },
});

export const toggleFollow = mutation({
  args: { userId: v.id("users"), followId: v.id("users") },
  handler: async (ctx, { userId, followId }) => {
    const user = await ctx.db.get(userId);
    const personToFollow = await ctx.db.get(followId);
    if (!user || !personToFollow) throw new Error("User not found");

    const isFollowing = user.following.includes(followId);

    if (isFollowing) {
      await ctx.db.patch(userId, { following: user.following.filter((id) => id !== followId) });
      await ctx.db.patch(followId, {
        followers: personToFollow.followers.filter((id) => id !== userId),
      });
    } else {
      await ctx.db.patch(userId, { following: [...user.following, followId] });
      await ctx.db.patch(followId, { followers: [...personToFollow.followers, userId] });
    }
  },
});

export const toggleLike = mutation({
  args: { userId: v.id("users"), postId: v.id("posts") },
  handler: async (ctx, { userId, postId }) => {
    const user = await ctx.db.get(userId);
    const post = await ctx.db.get(postId);
    if (!user || !post) throw new Error("Not found");

    const isLiked = user.likedPosts.includes(postId);

    if (isLiked) {
      await ctx.db.patch(userId, {
        likedPosts: user.likedPosts.filter((id) => id !== postId),
        pinsCount: user.pinsCount + 1,
      });
      await ctx.db.patch(postId, { likes: post.likes.filter((id) => id !== userId) });
    } else if (user.pinsCount > 0) {
      await ctx.db.patch(userId, {
        likedPosts: [...user.likedPosts, postId],
        pinsCount: user.pinsCount - 1,
      });
      await ctx.db.patch(postId, { likes: [...post.likes, userId] });
    }
  },
});

export const toggleSave = mutation({
  args: { userId: v.id("users"), postId: v.id("posts") },
  handler: async (ctx, { userId, postId }) => {
    const user = await ctx.db.get(userId);
    const post = await ctx.db.get(postId);
    if (!user || !post) throw new Error("Not found");

    const isSaved = user.savedPosts.includes(postId);

    if (isSaved) {
      await ctx.db.patch(userId, {
        savedPosts: user.savedPosts.filter((id) => id !== postId),
      });
      await ctx.db.patch(postId, { tape: post.tape.filter((id) => id !== userId) });
    } else {
      await ctx.db.patch(userId, { savedPosts: [...user.savedPosts, postId] });
      await ctx.db.patch(postId, { tape: [...post.tape, userId] });
    }
  },
});

export const updateCollege = mutation({
  args: { userId: v.id("users"), collageName: v.string() },
  handler: async (ctx, { userId, collageName }) => {
    await ctx.db.patch(userId, { collageName });
  },
});
