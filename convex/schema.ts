import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const schema = defineSchema({
  ...authTables,
  users: defineTable({
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
    // other "users" fields...
  }).index("email", ["email"]),
  tasks: defineTable({
    isCompleted: v.boolean(),
    text: v.string(),
  }),
});

export default schema;
