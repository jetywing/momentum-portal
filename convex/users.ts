import { query } from "./_generated/server";

export const clienteleList = query({
  args: {},
  handler: async (ctx) => {
    const clients = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("roles"), ["client"]))
      .collect();
    return clients;
  },
});
