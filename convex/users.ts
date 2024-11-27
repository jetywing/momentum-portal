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

export const staffList = query({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();

    // filter out users with either admin or staff in roles
    const staff = users.filter((user) => {
      return user.roles?.includes("staff") || user.roles?.includes("admin");
    });

    return staff;
  },
});

export const getUserById = query({
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    const user = ctx.db.get(args.id);
    return user;
  },
});

export const getUsersByFromArray = query({
  args: { idArray: v.optional(v.array(v.id("users"))) },
  handler: async (ctx, args) => {
    return args.idArray?.map((id) => ctx.db.get(id));
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
