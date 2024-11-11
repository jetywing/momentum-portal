import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getAllStudents = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("students").collect();
  },
});

export const addStudent = mutation({
  args: {
    firstName: v.string(),
    lastName: v.string(),
    birthday: v.string(),
    account: v.id("users"),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("students", {
      firstName: args.firstName,
      lastName: args.firstName,
      status: true,
      birthday: args.birthday,
      isAccHolder: false,
    });
  },
});
