import { v } from "convex/values";
import { paginationOptsValidator } from "convex/server";
import { mutation, query, QueryCtx } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

async function resolveUsers(ctx: QueryCtx, ids: Id<"users">[]) {
  const docs = await Promise.all(ids.map((id) => ctx.db.get(id)));
  return docs.filter((d): d is Doc<"users"> => d !== null);
}

async function expand(ctx: QueryCtx, post: Doc<"posts">) {
  const [creator, likes, tape] = await Promise.all([
    ctx.db.get(post.creator),
    resolveUsers(ctx, post.likes),
    resolveUsers(ctx, post.tape),
  ]);
  return { ...post, creator, likes, tape };
}

async function expandForFeed(ctx: QueryCtx, post: Doc<"posts">) {
  const creator = await ctx.db.get(post.creator);
  const { likes, tape, ...rest } = post;
  return { ...rest, creator, likesCount: likes.length, tapeCount: tape.length };
}

export const getFeed = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    const result = await ctx.db.query("posts").order("desc").paginate(args.paginationOpts);
    const page = await Promise.all(result.page.map((post) => expandForFeed(ctx, post)));
    return { ...result, page };
  },
});

export const getById = query({
  args: { postId: v.id("posts") },
  handler: async (ctx, { postId }) => {
    const post = await ctx.db.get(postId);
    if (!post) return null;
    return expand(ctx, post);
  },
});

export const search = query({
  args: { queryText: v.string() },
  handler: async (ctx, { queryText }) => {
    const byCaption = await ctx.db
      .query("posts")
      .withSearchIndex("search_caption", (q) => q.search("caption", queryText))
      .collect();

    const lower = queryText.toLowerCase();
    const all = await ctx.db.query("posts").collect();
    const tagMatches = all.filter((p) => p.tag.toLowerCase().includes(lower));

    const merged = new Map<Id<"posts">, Doc<"posts">>();
    for (const p of [...byCaption, ...tagMatches]) merged.set(p._id, p);
    return Promise.all(Array.from(merged.values()).map((post) => expand(ctx, post)));
  },
});

export const create = mutation({
  args: {
    creatorId: v.id("users"),
    caption: v.string(),
    tag: v.string(),
    postPhoto: v.string(),
    postAudio: v.string(),
  },
  handler: async (ctx, { creatorId, caption, tag, postPhoto, postAudio }) => {
    const creator = await ctx.db.get(creatorId);
    if (!creator) throw new Error("Creator not found");

    const postId = await ctx.db.insert("posts", {
      creator: creatorId,
      caption,
      tag,
      postPhoto,
      postAudio,
      likes: [],
      tape: [],
      createdAt: Date.now(),
    });

    await ctx.db.patch(creatorId, { posts: [...creator.posts, postId] });

    return postId;
  },
});

export const update = mutation({
  args: {
    postId: v.id("posts"),
    caption: v.string(),
    tag: v.string(),
    postPhoto: v.optional(v.string()),
  },
  handler: async (ctx, { postId, caption, tag, postPhoto }) => {
    await ctx.db.patch(postId, {
      caption,
      tag,
      ...(postPhoto ? { postPhoto } : {}),
    });
  },
});

export const remove = mutation({
  args: { postId: v.id("posts"), creatorId: v.id("users") },
  handler: async (ctx, { postId, creatorId }) => {
    const post = await ctx.db.get(postId);
    if (!post) return;

    const creator = await ctx.db.get(creatorId);
    if (creator) {
      await ctx.db.patch(creatorId, { posts: creator.posts.filter((id) => id !== postId) });
    }

    for (const userId of [...post.likes, ...post.tape]) {
      const user = await ctx.db.get(userId);
      if (!user) continue;
      await ctx.db.patch(userId, {
        likedPosts: user.likedPosts.filter((id) => id !== postId),
        savedPosts: user.savedPosts.filter((id) => id !== postId),
      });
    }

    await ctx.db.delete(postId);
  },
});
