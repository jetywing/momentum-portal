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
    const classes = await ctx.db.query("classes").collect();
    const orderedClasses = classes.sort((a, b) => a.time - b.time);
    return orderedClasses;
  },
});
