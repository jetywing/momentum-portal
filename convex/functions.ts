import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

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
    const { classId } = args;
    const classData = await ctx.db.get(classId);
    if (!classData) {
      return null;
    }

    const students = classData.students || [];
    const updatedStudents = [...students, args.studentId];
    const studentData = await ctx.db.get(args.studentId);

    if (!studentData) {
      return null;
    }

    const studentClasses = studentData.classes || [];
    const updatedStudentClasses = [...studentClasses, classId];

    await ctx.db.patch(classId, { students: updatedStudents });
    await ctx.db.patch(args.studentId, { classes: updatedStudentClasses });

    return;
  },
});
