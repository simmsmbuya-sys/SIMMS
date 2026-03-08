import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// ── Chart of Accounts ──
export const listAccounts = query({
  args: { orgId: v.string(), type: v.optional(v.string()) },
  handler: async (ctx, { orgId }) => {
    return await ctx.db
      .query("accounts")
      .withIndex("by_org", (q) => q.eq("orgId", orgId))
      .collect();
  },
});

export const createAccount = mutation({
  args: {
    orgId: v.string(),
    code: v.string(),
    name: v.string(),
    type: v.union(
      v.literal("asset"), v.literal("liability"), v.literal("equity"),
      v.literal("revenue"), v.literal("expense")
    ),
    parentId: v.optional(v.id("accounts")),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("accounts", {
      ...args,
      balance: 0,
      isActive: true,
      createdAt: Date.now(),
    });
  },
});

// ── Journal Entries ──
export const listJournalEntries = query({
  args: { orgId: v.string(), source: v.optional(v.string()) },
  handler: async (ctx, { orgId }) => {
    return await ctx.db
      .query("journalEntries")
      .withIndex("by_org", (q) => q.eq("orgId", orgId))
      .order("desc")
      .collect();
  },
});

export const createJournalEntry = mutation({
  args: {
    orgId: v.string(),
    description: v.string(),
    source: v.union(
      v.literal("manual"), v.literal("sale"), v.literal("purchase"),
      v.literal("refund"), v.literal("adjustment")
    ),
    referenceId: v.optional(v.string()),
    lines: v.array(v.object({
      accountId: v.id("accounts"),
      accountName: v.string(),
      debit: v.number(),
      credit: v.number(),
      memo: v.optional(v.string()),
    })),
    createdBy: v.string(),
  },
  handler: async (ctx, args) => {
    // Validate debits = credits
    const totalDebits = args.lines.reduce((sum, l) => sum + l.debit, 0);
    const totalCredits = args.lines.reduce((sum, l) => sum + l.credit, 0);
    if (Math.abs(totalDebits - totalCredits) > 0.01) {
      throw new Error(`Debits ($${totalDebits}) must equal credits ($${totalCredits})`);
    }

    const entryNumber = `JE-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

    const entryId = await ctx.db.insert("journalEntries", {
      ...args,
      entryNumber,
      date: Date.now(),
      isPosted: false,
      createdAt: Date.now(),
    });

    return entryId;
  },
});

export const postJournalEntry = mutation({
  args: { id: v.id("journalEntries") },
  handler: async (ctx, { id }) => {
    const entry = await ctx.db.get(id);
    if (!entry) throw new Error("Journal entry not found");
    if (entry.isPosted) throw new Error("Already posted");

    // Update account balances
    for (const line of entry.lines) {
      const account = await ctx.db.get(line.accountId);
      if (!account) continue;

      let balanceChange = line.debit - line.credit;
      // For liability, equity, revenue: credits increase the balance
      if (["liability", "equity", "revenue"].includes(account.type)) {
        balanceChange = line.credit - line.debit;
      }

      await ctx.db.patch(line.accountId, {
        balance: account.balance + balanceChange,
      });
    }

    await ctx.db.patch(id, { isPosted: true });
  },
});

export const getTrialBalance = query({
  args: { orgId: v.string() },
  handler: async (ctx, { orgId }) => {
    const accounts = await ctx.db
      .query("accounts")
      .withIndex("by_org", (q) => q.eq("orgId", orgId))
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();

    let totalDebits = 0;
    let totalCredits = 0;
    const rows = accounts.map((acc) => {
      const isDebitNormal = ["asset", "expense"].includes(acc.type);
      const debit = isDebitNormal && acc.balance > 0 ? acc.balance : (!isDebitNormal && acc.balance < 0 ? Math.abs(acc.balance) : 0);
      const credit = !isDebitNormal && acc.balance > 0 ? acc.balance : (isDebitNormal && acc.balance < 0 ? Math.abs(acc.balance) : 0);
      totalDebits += debit;
      totalCredits += credit;
      return { ...acc, debit, credit };
    });

    return { rows, totalDebits, totalCredits, balanced: Math.abs(totalDebits - totalCredits) < 0.01 };
  },
});

// ── Initialize default Chart of Accounts ──
export const initializeDefaultAccounts = mutation({
  args: { orgId: v.string() },
  handler: async (ctx, { orgId }) => {
    const defaults = [
      { code: "1000", name: "Cash", type: "asset" as const },
      { code: "1100", name: "Accounts Receivable", type: "asset" as const },
      { code: "1200", name: "Inventory", type: "asset" as const },
      { code: "1300", name: "Equipment", type: "asset" as const },
      { code: "2000", name: "Accounts Payable", type: "liability" as const },
      { code: "2100", name: "Sales Tax Payable", type: "liability" as const },
      { code: "2200", name: "Accrued Expenses", type: "liability" as const },
      { code: "3000", name: "Owner's Equity", type: "equity" as const },
      { code: "3100", name: "Retained Earnings", type: "equity" as const },
      { code: "4000", name: "Sales Revenue", type: "revenue" as const },
      { code: "4100", name: "Service Revenue", type: "revenue" as const },
      { code: "5000", name: "Cost of Goods Sold", type: "expense" as const },
      { code: "5100", name: "Shipping Expense", type: "expense" as const },
      { code: "6000", name: "Rent Expense", type: "expense" as const },
      { code: "6100", name: "Utilities Expense", type: "expense" as const },
      { code: "6200", name: "Payroll Expense", type: "expense" as const },
    ];

    for (const acc of defaults) {
      await ctx.db.insert("accounts", {
        orgId,
        ...acc,
        balance: 0,
        isActive: true,
        createdAt: Date.now(),
      });
    }
  },
});
