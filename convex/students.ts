import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getAllStudents = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("students").order("desc").collect();
  },
});

export const getStudentById = query({
  args: { id: v.id("students") },
  handler: async (ctx, args) => {
    const student = ctx.db.get(args.id);
    return student;
  },
});

export const getStudentsByAccount = query({
  args: { id: v.array(v.id("users")) },
  handler: async (ctx, args) => {
    return ctx.db
      .query("students")
      .filter((q) => q.eq(q.field("account"), args.id))
      .collect();
  },
});

export const getStudentsByClass = query({
  args: { id: v.id("classes") },
  handler: async (ctx, args) => {
    const studentClasses = await ctx.db
      .query("classStudents")
      .withIndex("by_classId", (q) => q.eq("classId", args.id))
      .collect();

    const students = await Promise.all(
      studentClasses.map(async (sc) => ctx.db.get(sc.studentId)),
    );

    return students;
  },
});

export const createStudent = mutation({
  args: {
    firstName: v.string(),
    lastName: v.string(),
    birthday: v.string(),
    account: v.id("users"),
  },
  handler: async (ctx, args) => {
    const account = ctx.db.get(args.account);
    if (!account) {
      return null;
    }

    const accStudents = account.students || [];

    const newStudent = await ctx.db.insert("students", {
      firstName: args.firstName,
      lastName: args.lastName,
      status: true,
      birthday: args.birthday,
      isAccHolder: false,
      account: [args.account],
    });

    const updatedStudents = [...accStudents, newStudent];

    await ctx.db.patch(args.account, { students: updatedStudents });
  },
});
