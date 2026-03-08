import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// ── Chart of Accounts ──
export const listAccounts = query({
  args: {
    orgId: v.string(),
    type: v.optional(v.union(
      v.literal("asset"), v.literal("liability"), v.literal("equity"),
      v.literal("revenue"), v.literal("expense")
    )),
  },
  handler: async (ctx, { orgId, type }) => {
    const accounts = await ctx.db
      .query("accounts")
      .withIndex("by_org", (q) => q.eq("orgId", orgId))
      .collect();
    if (type) return accounts.filter((a) => a.type === type);
    return accounts;
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
    // Enforce unique account code per org
    const existing = await ctx.db
      .query("accounts")
      .withIndex("by_code", (q) => q.eq("orgId", args.orgId).eq("code", args.code))
      .first();
    if (existing) throw new Error(`Account code ${args.code} already exists`);

    return await ctx.db.insert("accounts", {
      ...args,
      balance: 0,
      isActive: true,
      createdAt: Date.now(),
    });
  },
});

export const updateAccount = mutation({
  args: {
    id: v.id("accounts"),
    orgId: v.string(),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, { id, orgId, ...updates }) => {
    const account = await ctx.db.get(id);
    if (!account) throw new Error("Account not found");
    if (account.orgId !== orgId) throw new Error("Access denied");
    const filtered = Object.fromEntries(
      Object.entries(updates).filter(([, val]) => val !== undefined)
    );
    await ctx.db.patch(id, filtered);
  },
});

// ── Journal Entries ──
export const listJournalEntries = query({
  args: {
    orgId: v.string(),
    source: v.optional(v.union(
      v.literal("manual"), v.literal("sale"), v.literal("purchase"),
      v.literal("refund"), v.literal("adjustment")
    )),
  },
  handler: async (ctx, { orgId, source }) => {
    const entries = await ctx.db
      .query("journalEntries")
      .withIndex("by_org", (q) => q.eq("orgId", orgId))
      .order("desc")
      .collect();
    if (source) return entries.filter((e) => e.source === source);
    return entries;
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
    if (args.lines.length === 0) {
      throw new Error("Journal entry must have at least one line");
    }

    // Validate each line has either debit or credit (not both non-zero)
    for (const line of args.lines) {
      if (line.debit < 0 || line.credit < 0) {
        throw new Error("Debit and credit amounts must be non-negative");
      }
      if (line.debit > 0 && line.credit > 0) {
        throw new Error("A line cannot have both debit and credit amounts");
      }
      if (line.debit === 0 && line.credit === 0) {
        throw new Error("Each line must have either a debit or credit amount");
      }
    }

    // Validate debits = credits
    const totalDebits = args.lines.reduce((sum, l) => sum + Math.round(l.debit * 100), 0);
    const totalCredits = args.lines.reduce((sum, l) => sum + Math.round(l.credit * 100), 0);
    if (totalDebits !== totalCredits) {
      throw new Error(`Debits ($${(totalDebits / 100).toFixed(2)}) must equal credits ($${(totalCredits / 100).toFixed(2)})`);
    }

    // Verify all accounts exist and belong to the same org
    for (const line of args.lines) {
      const account = await ctx.db.get(line.accountId);
      if (!account) throw new Error(`Account ${line.accountName} not found`);
      if (account.orgId !== args.orgId) throw new Error(`Account ${line.accountName} belongs to a different organization`);
    }

    const entryNumber = `JE-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

    return await ctx.db.insert("journalEntries", {
      ...args,
      entryNumber,
      date: Date.now(),
      isPosted: false,
      createdAt: Date.now(),
    });
  },
});

export const postJournalEntry = mutation({
  args: { id: v.id("journalEntries"), orgId: v.string() },
  handler: async (ctx, { id, orgId }) => {
    const entry = await ctx.db.get(id);
    if (!entry) throw new Error("Journal entry not found");
    if (entry.orgId !== orgId) throw new Error("Access denied");
    if (entry.isPosted) throw new Error("Already posted");

    // Verify ALL accounts exist before applying any changes
    const accounts = [];
    for (const line of entry.lines) {
      const account = await ctx.db.get(line.accountId);
      if (!account) {
        throw new Error(`Account "${line.accountName}" (${line.accountId}) no longer exists. Cannot post entry.`);
      }
      if (account.orgId !== orgId) {
        throw new Error(`Account "${line.accountName}" belongs to a different organization`);
      }
      accounts.push(account);
    }

    // Apply balance changes using integer cents to avoid float errors
    for (let i = 0; i < entry.lines.length; i++) {
      const line = entry.lines[i];
      const account = accounts[i];

      const debitCents = Math.round(line.debit * 100);
      const creditCents = Math.round(line.credit * 100);
      let balanceChangeCents = debitCents - creditCents;

      // For liability, equity, revenue: credits increase the balance
      if (["liability", "equity", "revenue"].includes(account.type)) {
        balanceChangeCents = creditCents - debitCents;
      }

      const currentBalanceCents = Math.round(account.balance * 100);
      await ctx.db.patch(line.accountId, {
        balance: (currentBalanceCents + balanceChangeCents) / 100,
      });
    }

    await ctx.db.patch(id, { isPosted: true });
  },
});

export const voidJournalEntry = mutation({
  args: { id: v.id("journalEntries"), orgId: v.string() },
  handler: async (ctx, { id, orgId }) => {
    const entry = await ctx.db.get(id);
    if (!entry) throw new Error("Journal entry not found");
    if (entry.orgId !== orgId) throw new Error("Access denied");

    if (!entry.isPosted) {
      // If not posted, just delete it
      await ctx.db.delete(id);
      return;
    }

    // Reverse the posted balances
    for (const line of entry.lines) {
      const account = await ctx.db.get(line.accountId);
      if (!account) continue; // Account deleted — nothing to reverse

      const debitCents = Math.round(line.debit * 100);
      const creditCents = Math.round(line.credit * 100);
      let balanceChangeCents = debitCents - creditCents;
      if (["liability", "equity", "revenue"].includes(account.type)) {
        balanceChangeCents = creditCents - debitCents;
      }

      // Reverse the change
      const currentBalanceCents = Math.round(account.balance * 100);
      await ctx.db.patch(line.accountId, {
        balance: (currentBalanceCents - balanceChangeCents) / 100,
      });
    }

    await ctx.db.delete(id);
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
      let debit = 0;
      let credit = 0;

      if (isDebitNormal) {
        if (acc.balance >= 0) debit = acc.balance;
        else credit = Math.abs(acc.balance);
      } else {
        if (acc.balance >= 0) credit = acc.balance;
        else debit = Math.abs(acc.balance);
      }

      totalDebits += debit;
      totalCredits += credit;
      return { ...acc, debit, credit };
    });

    return {
      rows,
      totalDebits: Math.round(totalDebits * 100) / 100,
      totalCredits: Math.round(totalCredits * 100) / 100,
      balanced: Math.abs(totalDebits - totalCredits) < 0.01,
    };
  },
});

// ── Initialize default Chart of Accounts (idempotent) ──
export const initializeDefaultAccounts = mutation({
  args: { orgId: v.string() },
  handler: async (ctx, { orgId }) => {
    // Check if already initialized
    const existing = await ctx.db
      .query("accounts")
      .withIndex("by_org", (q) => q.eq("orgId", orgId))
      .first();
    if (existing) return; // Already initialized

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
