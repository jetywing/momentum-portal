import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

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

    const sortedClasses = classes.sort((a, b) => a.time - b.time);

    return sortedClasses;
  },
});

export const getAvailableClasses = query({
  args: { id: v.id("students") },
  handler: async (ctx, args) => {
    const studentClasses = await ctx.db
      .query("classStudents")
      .withIndex("by_studentId", (q) => q.eq("studentId", args.id))
      .collect();

    // find all students that are not in the class
    const allClasses = await ctx.db.query("classes").collect();
    const availableClassIds = allClasses.filter(
      (s) => !studentClasses.find((sc) => sc.classId === s._id),
    );

    const availableClasses = await Promise.all(
      availableClassIds.map(async (sc) => ctx.db.get(sc._id)),
    );

    return availableClasses;
  },
});

export const createClass = mutation({
  args: {
    name: v.string(),
    time: v.number(),
    duration: v.number(),
    season: v.optional(v.string()),
    capacity: v.optional(v.number()),
    room: v.optional(v.string()),
    description: v.optional(v.string()),
    type: v.optional(v.union(v.literal("team"), v.literal("rec"))),
    instructor: v.array(v.id("users")),
  },
  handler: async (ctx, args) => {
    const newClass = await ctx.db.insert("classes", {
      name: args.name,
      time: args.time,
      duration: args.duration,
      season: args.season,
      capacity: args.capacity,
      room: args.room,
      description: args.description,
      type: args.type,
      instructor: args.instructor,
    });
    return newClass;
  },
});
