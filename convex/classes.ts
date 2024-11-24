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

export const getClassesByStudent = query({
  args: { id: v.id("students") },
  handler: async (ctx, args) => {
    const studentClasses = await ctx.db
      .query("classStudents")
      .withIndex("by_studentId", (q) => q.eq("studentId", args.id))
      .collect();

    const classes = await Promise.all(
      studentClasses.map(async (sc) => ctx.db.get(sc.classId)),
    );

    return classes;
  },
});
