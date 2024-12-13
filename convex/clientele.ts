import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getClientele = query({
  handler: async (ctx) => {
    return await ctx.db.query("clientele").collect();
  },
});

export const getClientById = query({
  args: { id: v.id("clientele") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const createClient = mutation({
  args: {
    firstName: v.string(),
    lastName: v.string(),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    image: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const client = await ctx.db.insert("clientele", {
      firstName: args.firstName,
      lastName: args.lastName,
      email: args.email,
      phone: args.phone,
      image: args.image,
    });

    await ctx.db.insert("logs", {
      message: `Client: ${args.firstName} ${args.lastName} was created.`,
    });

    return client;
  },
});

export const editClient = mutation({
  args: {
    id: v.id("clientele"),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    image: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.id, {
      firstName: args.firstName,
      lastName: args.lastName,
      email: args.email,
      phone: args.phone,
      image: args.image,
    });
  },
});
