import { query } from "./_generated/server";

export const getAllLogs = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("logs").order("desc").collect();
  },
});
