import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { dayTimeFormat } from "@/lib/utils";
import { Id } from "./_generated/dataModel";

export const currentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return null;
    }
    return await ctx.db.get(userId);
  },
});

export const getUser = query({
  args: { id: v.id("tasks") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.id);
    return user;
  },
});

export const addStudentToClass = mutation({
  args: { studentId: v.id("students"), classId: v.id("classes") },
  handler: async (ctx, args) => {
    const student = await ctx.db.get(args.studentId);
    const thisClass = await ctx.db.get(args.classId);

    if (student === null || thisClass === null) {
      return;
    }

    const classTime = dayTimeFormat(thisClass.time);

    await ctx.db.insert("classStudents", {
      studentId: args.studentId,
      classId: args.classId,
    });
    await ctx.db.insert("logs", {
      studentId: args.studentId,
      classId: args.classId,
      message: `${student.firstName} ${student.lastName} was added to ${thisClass.name} | ${classTime}.`,
    });
  },
});

export const removeStudentFromClass = mutation({
  args: { studentId: v.id("students"), classId: v.id("classes") },
  handler: async (ctx, args) => {
    const student = await ctx.db.get(args.studentId);
    const thisClass = await ctx.db.get(args.classId);

    if (student === null || thisClass === null) {
      return;
    }

    const classTime = dayTimeFormat(thisClass.time);

    const classStudent = await ctx.db
      .query("classStudents")
      .withIndex("by_studentId_classId", (q) =>
        q.eq("studentId", args.studentId).eq("classId", args.classId),
      )
      .unique();

    if (classStudent === null) {
      return;
    }

    await ctx.db.delete(classStudent?._id);

    await ctx.db.insert("logs", {
      studentId: args.studentId,
      classId: args.classId,
      message: `${student.firstName} ${student.lastName} was removed from ${thisClass.name} | ${classTime}.`,
    });
  },
});
