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

export const getStudentsByClient = query({
  args: { id: v.id("clientele") },
  handler: async (ctx, args) => {
    const students = await ctx.db.query("students").collect();

    return students.filter((s) => s.account?.includes(args.id));
  },
});

export const getStudentsNotFromClient = query({
  args: { id: v.id("clientele") },
  handler: async (ctx, args) => {
    const students = await ctx.db.query("students").collect();

    return students.filter((s) => !s.account?.includes(args.id));
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

export const getUnenrolledStudents = query({
  args: { id: v.id("classes") },
  handler: async (ctx, args) => {
    const studentClasses = await ctx.db
      .query("classStudents")
      .withIndex("by_classId", (q) => q.eq("classId", args.id))
      .collect();

    // find all students that are not in the class
    const allStudents = await ctx.db.query("students").collect();
    const studentsOutsideClass = allStudents.filter(
      (s) => !studentClasses.find((sc) => sc.studentId === s._id),
    );

    const unenrolledStudents = await Promise.all(
      studentsOutsideClass.map(async (sc) => ctx.db.get(sc._id)),
    );

    return unenrolledStudents;
  },
});

export const createStudent = mutation({
  args: {
    firstName: v.string(),
    lastName: v.string(),
    birthday: v.string(),
    account: v.id("clientele"),
  },
  handler: async (ctx, args) => {
    const account = await ctx.db.get(args.account);
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

    await ctx.db.insert("logs", {
      message: `${account.firstName} ${account.lastName} created student: ${args.firstName} ${args.lastName}`,
    });

    return newStudent;
  },
});

export const editStudent = mutation({
  args: {
    id: v.id("students"),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    birthday: v.optional(v.string()),
    account: v.optional(v.array(v.id("clientele"))),
  },
  handler: async (ctx, args) => {
    const student = await ctx.db.get(args.id);
    if (!student) {
      return null;
    }

    const existingAccount = student?.account || [];

    const accounts = args.account || [];

    accounts.map(async (a) => {
      const account = await ctx.db.get(a);
      if (!account) {
        return null;
      }
      // need Symbol.iterator to make this work

      if (!account.students) {
        account.students = [];
      }

      await ctx.db.patch(a, { students: [...account.students, args.id] });
    });

    if (args.account) {
      const newAccounts = existingAccount.concat(args.account);
      await ctx.db.patch(args.id, {
        firstName: args.firstName,
        lastName: args.lastName,
        birthday: args.birthday,
        account: newAccounts,
      });

      await ctx.db.insert("logs", {
        message: `Account: ${args.account} added to student: ${args.firstName} ${args.lastName}`,
      });
    }

    if (!args.account) {
      await ctx.db.patch(args.id, {
        firstName: args.firstName,
        lastName: args.lastName,
        birthday: args.birthday,
      });
    }
  },
});
