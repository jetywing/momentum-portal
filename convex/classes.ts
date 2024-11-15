import { v } from "convex/values";
import { query } from "./_generated/server";

export const getClassById = query({
  args: { id: v.id("classes") },
  handler: async (ctx, args) => {
    const thisClass = ctx.db.get(args.id);
    return thisClass;
  },
});

export const getAllClasses = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("classes").order("desc").collect();
  },
});
