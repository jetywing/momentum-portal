import { v } from "convex/values";
import { query } from "./_generated/server";

export const clienteleList = query({
  args: {},
  handler: async (ctx) => {
    const clients = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("roles"), ["client"]))
      .collect();
    return clients;
  },
});

export const getUserById = query({
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    const user = ctx.db.get(args.id);
    return user;
  },
});

export const userIdQuery = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const user = ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .unique();
    return user;
  },
});
