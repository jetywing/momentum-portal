import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const schema = defineSchema({
  ...authTables,
  users: defineTable({
    userId: v.optional(v.string()),
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
    roles: v.optional(
      v.array(
        v.union(v.literal("client"), v.literal("staff"), v.literal("admin")),
      ),
    ),
    students: v.optional(v.array(v.id("students"))),
    // other "users" fields...
  }).index("email", ["email"]),
  students: defineTable({
    // idx is short for index here.
    idx: v.optional(v.number()),
    firstName: v.string(),
    lastName: v.string(),
    image: v.optional(v.string()),
    status: v.boolean(),
    birthday: v.optional(v.string()),
    team: v.optional(
      v.array(v.union(v.literal("mdp"), v.literal("mdp2"), v.literal("club"))),
    ),
    classes: v.optional(v.array(v.id("classes"))),
    account: v.optional(v.array(v.id("users"))),
    isAccHolder: v.boolean(),
  }),
  classes: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    type: v.optional(v.union(v.literal("team"), v.literal("rec"))),
    room: v.optional(v.string()),
    day: v.union(
      v.literal("Monday"),
      v.literal("Tuesday"),
      v.literal("Wednesday"),
      v.literal("Thursday"),
      v.literal("Friday"),
      v.literal("Saturday"),
      v.literal("Sunday"),
    ),
    time: v.number(),
    duration: v.number(),
    season: v.optional(v.string()),
    capacity: v.optional(v.number()),
    students: v.optional(v.array(v.id("students"))),
    instructor: v.array(v.id("users")),
  }),
  classStudents: defineTable({
    studentId: v.id("students"),
    classId: v.id("classes"),
  })
    .index("by_studentId", ["studentId"])
    .index("by_classId", ["classId"])
    .index("by_studentId_classId", ["studentId", "classId"]),
  logs: defineTable({
    message: v.string(),
    userId: v.optional(v.id("users")),
    studentId: v.optional(v.id("students")),
    classId: v.optional(v.id("classes")),
  }),
  tasks: defineTable({
    isCompleted: v.boolean(),
    text: v.string(),
    due: v.optional(v.string()),
    userId: v.optional(v.id("users")),
  }),
});

export default schema;
