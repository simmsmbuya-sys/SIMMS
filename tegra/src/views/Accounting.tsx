import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Calculator,
  FileText,
  Plus,
  ChevronDown,
  ChevronRight,
  Edit2,
  Trash2,
  Eye,
  CheckCircle,
  AlertCircle,
  X,
  Search,
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

type AccountType = 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense';

interface Account {
  code: string;
  name: string;
  type: AccountType;
  balance: number;
  status: 'active' | 'inactive';
  parent?: string;
  description?: string;
}

interface JournalLineItem {
  accountCode: string;
  accountName: string;
  debit: number;
  credit: number;
  memo: string;
}

interface JournalEntry {
  id: string;
  date: string;
  description: string;
  source: 'Manual' | 'Sale' | 'Purchase' | 'Refund' | 'Adjustment';
  lineItems: JournalLineItem[];
  posted: boolean;
}

// ─── Demo Data ───────────────────────────────────────────────────────────────

const demoAccounts: Account[] = [
  { code: '1000', name: 'Cash', type: 'Asset', balance: 148320.50, status: 'active', description: 'Cash on hand and in bank' },
  { code: '1100', name: 'Accounts Receivable', type: 'Asset', balance: 67840.25, status: 'active', description: 'Amounts owed by customers' },
  { code: '1200', name: 'Inventory', type: 'Asset', balance: 234560.00, status: 'active', description: 'Merchandise and raw materials' },
  { code: '1300', name: 'Equipment', type: 'Asset', balance: 85000.00, status: 'active', description: 'Office and warehouse equipment' },
  { code: '2000', name: 'Accounts Payable', type: 'Liability', balance: 42150.75, status: 'active', description: 'Amounts owed to suppliers' },
  { code: '2100', name: 'Sales Tax Payable', type: 'Liability', balance: 8932.40, status: 'active', description: 'Collected sales tax awaiting remittance' },
  { code: '2200', name: 'Accrued Expenses', type: 'Liability', balance: 12480.00, status: 'active', description: 'Expenses incurred but not yet paid' },
  { code: '3000', name: "Owner's Equity", type: 'Equity', balance: 350000.00, status: 'active', description: 'Initial capital contribution' },
  { code: '3100', name: 'Retained Earnings', type: 'Equity', balance: 67420.60, status: 'active', description: 'Accumulated undistributed profits' },
  { code: '4000', name: 'Sales Revenue', type: 'Revenue', balance: 312450.80, status: 'active', description: 'Revenue from product sales' },
  { code: '4100', name: 'Service Revenue', type: 'Revenue', balance: 45680.20, status: 'active', description: 'Revenue from services rendered' },
  { code: '5000', name: 'Cost of Goods Sold', type: 'Expense', balance: 156780.40, status: 'active', description: 'Direct cost of merchandise sold' },
  { code: '5100', name: 'Shipping Expense', type: 'Expense', balance: 12340.50, status: 'active', description: 'Freight and shipping costs' },
  { code: '6000', name: 'Rent Expense', type: 'Expense', balance: 36000.00, status: 'active', description: 'Monthly facility rent' },
  { code: '6100', name: 'Utilities Expense', type: 'Expense', balance: 8450.10, status: 'active', description: 'Electricity, water, internet' },
  { code: '6200', name: 'Payroll Expense', type: 'Expense', balance: 89162.00, status: 'active', description: 'Employee wages and salaries' },
];

const demoJournalEntries: JournalEntry[] = [
  {
    id: 'JE-001',
    date: '2026-03-08',
    description: 'Record daily POS sales - Main Store',
    source: 'Sale',
    posted: true,
    lineItems: [
      { accountCode: '1000', accountName: 'Cash', debit: 8450.00, credit: 0, memo: 'Cash sales' },
      { accountCode: '1100', accountName: 'Accounts Receivable', debit: 3200.00, credit: 0, memo: 'Credit sales' },
      { accountCode: '4000', accountName: 'Sales Revenue', debit: 0, credit: 11650.00, memo: 'Daily sales total' },
    ],
  },
  {
    id: 'JE-002',
    date: '2026-03-07',
    description: 'Purchase inventory from BuildRight Suppliers',
    source: 'Purchase',
    posted: true,
    lineItems: [
      { accountCode: '1200', accountName: 'Inventory', debit: 24500.00, credit: 0, memo: 'Cement & steel rebar' },
      { accountCode: '2000', accountName: 'Accounts Payable', debit: 0, credit: 24500.00, memo: 'Net 30 terms' },
    ],
  },
  {
    id: 'JE-003',
    date: '2026-03-07',
    description: 'Customer refund - Damaged roofing sheets',
    source: 'Refund',
    posted: true,
    lineItems: [
      { accountCode: '4000', accountName: 'Sales Revenue', debit: 1875.00, credit: 0, memo: 'Reverse sale' },
      { accountCode: '1000', accountName: 'Cash', debit: 0, credit: 1875.00, memo: 'Cash refund issued' },
    ],
  },
  {
    id: 'JE-004',
    date: '2026-03-06',
    description: 'Monthly rent payment - Warehouse & storefront',
    source: 'Manual',
    posted: true,
    lineItems: [
      { accountCode: '6000', accountName: 'Rent Expense', debit: 6000.00, credit: 0, memo: 'March 2026 rent' },
      { accountCode: '1000', accountName: 'Cash', debit: 0, credit: 6000.00, memo: 'Bank transfer' },
    ],
  },
  {
    id: 'JE-005',
    date: '2026-03-06',
    description: 'Record COGS for weekly shipments',
    source: 'Adjustment',
    posted: true,
    lineItems: [
      { accountCode: '5000', accountName: 'Cost of Goods Sold', debit: 15420.00, credit: 0, memo: 'Weekly COGS adjustment' },
      { accountCode: '1200', accountName: 'Inventory', debit: 0, credit: 15420.00, memo: 'Reduce inventory' },
    ],
  },
  {
    id: 'JE-006',
    date: '2026-03-05',
    description: 'Collect payment from Metro Construction Co.',
    source: 'Manual',
    posted: true,
    lineItems: [
      { accountCode: '1000', accountName: 'Cash', debit: 34200.50, credit: 0, memo: 'Invoice #INV-4781' },
      { accountCode: '1100', accountName: 'Accounts Receivable', debit: 0, credit: 34200.50, memo: 'Clear receivable' },
    ],
  },
  {
    id: 'JE-007',
    date: '2026-03-05',
    description: 'Payroll processing - Bi-weekly pay period',
    source: 'Manual',
    posted: true,
    lineItems: [
      { accountCode: '6200', accountName: 'Payroll Expense', debit: 18450.00, credit: 0, memo: 'Gross wages' },
      { accountCode: '2100', accountName: 'Sales Tax Payable', debit: 0, credit: 2767.50, memo: 'PAYE withholding' },
      { accountCode: '1000', accountName: 'Cash', debit: 0, credit: 15682.50, memo: 'Net pay disbursed' },
    ],
  },
  {
    id: 'JE-008',
    date: '2026-03-04',
    description: 'Service revenue - Installation fees collected',
    source: 'Sale',
    posted: true,
    lineItems: [
      { accountCode: '1000', accountName: 'Cash', debit: 4500.00, credit: 0, memo: 'Installation payments' },
      { accountCode: '4100', accountName: 'Service Revenue', debit: 0, credit: 4500.00, memo: 'Plumbing installation' },
    ],
  },
  {
    id: 'JE-009',
    date: '2026-03-03',
    description: 'Utility bill payment - February 2026',
    source: 'Manual',
    posted: true,
    lineItems: [
      { accountCode: '6100', accountName: 'Utilities Expense', debit: 2840.10, credit: 0, memo: 'Electricity & water' },
      { accountCode: '1000', accountName: 'Cash', debit: 0, credit: 2840.10, memo: 'Auto-debit payment' },
    ],
  },
  {
    id: 'JE-010',
    date: '2026-03-03',
    description: 'Inventory write-down - Damaged paint stock',
    source: 'Adjustment',
    posted: false,
    lineItems: [
      { accountCode: '5000', accountName: 'Cost of Goods Sold', debit: 3200.00, credit: 0, memo: 'Damaged inventory' },
      { accountCode: '1200', accountName: 'Inventory', debit: 0, credit: 3200.00, memo: 'Write off 40 cans paint' },
    ],
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

const typeBadgeClass: Record<AccountType, string> = {
  Asset: 'badge-blue',
  Liability: 'badge-red',
  Equity: 'badge-purple',
  Revenue: 'badge-green',
  Expense: 'badge-yellow',
};

const sourceBadgeClass: Record<string, string> = {
  Manual: 'badge-gray',
  Sale: 'badge-green',
  Purchase: 'badge-blue',
  Refund: 'badge-red',
  Adjustment: 'badge-yellow',
};

const accountTypeGroups: AccountType[] = ['Asset', 'Liability', 'Equity', 'Revenue', 'Expense'];

const fmt = (n: number) =>
  n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function Accounting() {
  const [activeTab, setActiveTab] = useState<'chart' | 'journal' | 'trial'>('chart');
  const [accounts, setAccounts] = useState<Account[]>(demoAccounts);
  const [journalEntries] = useState<JournalEntry[]>(demoJournalEntries);

  // Chart of Accounts state
  const [expandedGroups, setExpandedGroups] = useState<Set<AccountType>>(new Set(accountTypeGroups));
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [newAccount, setNewAccount] = useState<Partial<Account>>({ type: 'Asset', status: 'active' });

  // Journal Entries state
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null);
  const [newEntry, setNewEntry] = useState({
    description: '',
    source: 'Manual' as JournalEntry['source'],
    lineItems: [
      { accountCode: '', accountName: '', debit: 0, credit: 0, memo: '' },
      { accountCode: '', accountName: '', debit: 0, credit: 0, memo: '' },
    ],
  });

  const [searchQuery, setSearchQuery] = useState('');

  const toggleGroup = (type: AccountType) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next;
    });
  };

  const handleAddAccount = () => {
    if (!newAccount.code || !newAccount.name || !newAccount.type) return;
    const account: Account = {
      code: newAccount.code!,
      name: newAccount.name!,
      type: newAccount.type!,
      balance: 0,
      status: 'active',
      parent: newAccount.parent,
      description: newAccount.description,
    };
    setAccounts((prev) => [...prev, account]);
    setShowAddAccount(false);
    setNewAccount({ type: 'Asset', status: 'active' });
  };

  const addLineItem = () => {
    setNewEntry((prev) => ({
      ...prev,
      lineItems: [...prev.lineItems, { accountCode: '', accountName: '', debit: 0, credit: 0, memo: '' }],
    }));
  };

  const updateLineItem = (index: number, field: string, value: string | number) => {
    setNewEntry((prev) => ({
      ...prev,
      lineItems: prev.lineItems.map((li, i) => (i === index ? { ...li, [field]: value } : li)),
    }));
  };

  const removeLineItem = (index: number) => {
    if (newEntry.lineItems.length <= 2) return;
    setNewEntry((prev) => ({
      ...prev,
      lineItems: prev.lineItems.filter((_, i) => i !== index),
    }));
  };

  const entryDebitTotal = newEntry.lineItems.reduce((sum, li) => sum + (Number(li.debit) || 0), 0);
  const entryCreditTotal = newEntry.lineItems.reduce((sum, li) => sum + (Number(li.credit) || 0), 0);
  const entryBalanced = Math.abs(entryDebitTotal - entryCreditTotal) < 0.01;

  // Trial Balance data
  const trialBalanceAccounts = accounts.filter((a) => a.balance > 0);
  const totalDebits = trialBalanceAccounts
    .filter((a) => ['Asset', 'Expense'].includes(a.type))
    .reduce((sum, a) => sum + a.balance, 0);
  const totalCredits = trialBalanceAccounts
    .filter((a) => ['Liability', 'Equity', 'Revenue'].includes(a.type))
    .reduce((sum, a) => sum + a.balance, 0);
  const isBalanced = Math.abs(totalDebits - totalCredits) < 0.01;

  const tabs = [
    { key: 'chart' as const, label: 'Chart of Accounts', icon: BookOpen },
    { key: 'journal' as const, label: 'Journal Entries', icon: FileText },
    { key: 'trial' as const, label: 'Trial Balance', icon: Calculator },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Accounting</h1>
          <p style={{ color: '#64748b', fontSize: 14, margin: '4px 0 0' }}>
            Double-entry bookkeeping and financial records
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs mb-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              className={`tab ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ── Chart of Accounts ─────────────────────────────────────────────── */}
      {activeTab === 'chart' && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div style={{ position: 'relative' }}>
                <Search size={16} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  className="input"
                  placeholder="Search accounts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ paddingLeft: 34, width: 260 }}
                />
              </div>
              <span style={{ fontSize: 13, color: '#64748b' }}>{accounts.length} accounts</span>
            </div>
            <button className="btn btn-primary" onClick={() => setShowAddAccount(true)}>
              <Plus size={16} /> Add Account
            </button>
          </div>

          {accountTypeGroups.map((type) => {
            const groupAccounts = accounts.filter(
              (a) =>
                a.type === type &&
                (searchQuery === '' ||
                  a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  a.code.includes(searchQuery))
            );
            if (groupAccounts.length === 0 && searchQuery) return null;
            const isExpanded = expandedGroups.has(type);
            const groupTotal = groupAccounts.reduce((sum, a) => sum + a.balance, 0);

            return (
              <motion.div
                key={type}
                className="card"
                style={{ marginBottom: 16 }}
                custom={accountTypeGroups.indexOf(type)}
                initial="hidden"
                animate="visible"
                variants={cardVariants}
              >
                <div
                  className="flex items-center justify-between"
                  style={{ cursor: 'pointer', padding: '4px 0' }}
                  onClick={() => toggleGroup(type)}
                >
                  <div className="flex items-center gap-3">
                    {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                    <span className={`badge ${typeBadgeClass[type]}`}>{type}</span>
                    <span style={{ fontWeight: 600, fontSize: 15 }}>
                      {type === 'Asset'
                        ? 'Assets'
                        : type === 'Liability'
                          ? 'Liabilities'
                          : type === 'Equity'
                            ? 'Equity'
                            : type === 'Revenue'
                              ? 'Revenue'
                              : 'Expenses'}
                    </span>
                    <span style={{ fontSize: 13, color: '#94a3b8' }}>({groupAccounts.length})</span>
                  </div>
                  <span style={{ fontWeight: 600, fontSize: 15 }}>${fmt(groupTotal)}</span>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      style={{ overflow: 'hidden' }}
                    >
                      <table style={{ marginTop: 12 }}>
                        <thead>
                          <tr>
                            <th>Code</th>
                            <th>Account Name</th>
                            <th>Type</th>
                            <th>Balance</th>
                            <th>Status</th>
                            <th style={{ textAlign: 'right' }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {groupAccounts.map((account) => (
                            <tr key={account.code}>
                              <td style={{ fontFamily: 'monospace', fontWeight: 500, fontSize: 13 }}>
                                {account.code}
                              </td>
                              <td>
                                <div style={{ fontWeight: 500 }}>{account.name}</div>
                                {account.description && (
                                  <div style={{ fontSize: 12, color: '#94a3b8' }}>{account.description}</div>
                                )}
                              </td>
                              <td>
                                <span className={`badge ${typeBadgeClass[account.type]}`}>{account.type}</span>
                              </td>
                              <td style={{ fontWeight: 600 }}>${fmt(account.balance)}</td>
                              <td>
                                <span
                                  className={`badge ${account.status === 'active' ? 'badge-green' : 'badge-gray'}`}
                                >
                                  {account.status}
                                </span>
                              </td>
                              <td style={{ textAlign: 'right' }}>
                                <div className="flex items-center gap-2" style={{ justifyContent: 'flex-end' }}>
                                  <button className="btn btn-secondary" style={{ padding: '4px 8px' }}>
                                    <Eye size={14} />
                                  </button>
                                  <button className="btn btn-secondary" style={{ padding: '4px 8px' }}>
                                    <Edit2 size={14} />
                                  </button>
                                  <button className="btn btn-secondary" style={{ padding: '4px 8px' }}>
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}

          {/* Add Account Modal */}
          <AnimatePresence>
            {showAddAccount && (
              <motion.div
                className="modal-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowAddAccount(false)}
              >
                <motion.div
                  className="modal"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>Add New Account</h2>
                    <button
                      className="btn btn-secondary"
                      style={{ padding: '4px 8px' }}
                      onClick={() => setShowAddAccount(false)}
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <div className="form-group">
                    <label>Account Code</label>
                    <input
                      className="input"
                      placeholder="e.g., 1400"
                      value={newAccount.code || ''}
                      onChange={(e) => setNewAccount({ ...newAccount, code: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Account Name</label>
                    <input
                      className="input"
                      placeholder="e.g., Prepaid Insurance"
                      value={newAccount.name || ''}
                      onChange={(e) => setNewAccount({ ...newAccount, name: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Account Type</label>
                    <select
                      className="select"
                      value={newAccount.type || 'Asset'}
                      onChange={(e) => setNewAccount({ ...newAccount, type: e.target.value as AccountType })}
                    >
                      {accountTypeGroups.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Parent Account (optional)</label>
                    <select
                      className="select"
                      value={newAccount.parent || ''}
                      onChange={(e) => setNewAccount({ ...newAccount, parent: e.target.value })}
                    >
                      <option value="">None</option>
                      {accounts.map((a) => (
                        <option key={a.code} value={a.code}>
                          {a.code} - {a.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <input
                      className="input"
                      placeholder="Brief description of this account"
                      value={newAccount.description || ''}
                      onChange={(e) => setNewAccount({ ...newAccount, description: e.target.value })}
                    />
                  </div>

                  <div className="flex items-center gap-3" style={{ marginTop: 20 }}>
                    <button className="btn btn-primary" onClick={handleAddAccount}>
                      <Plus size={16} /> Create Account
                    </button>
                    <button className="btn btn-secondary" onClick={() => setShowAddAccount(false)}>
                      Cancel
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* ── Journal Entries ────────────────────────────────────────────────── */}
      {activeTab === 'journal' && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <div className="flex items-center justify-between mb-4">
            <span style={{ fontSize: 13, color: '#64748b' }}>{journalEntries.length} entries</span>
            <button className="btn btn-primary" onClick={() => setShowNewEntry(true)}>
              <Plus size={16} /> New Entry
            </button>
          </div>

          <motion.div className="card" custom={0} initial="hidden" animate="visible" variants={cardVariants}>
            <table>
              <thead>
                <tr>
                  <th style={{ width: 30 }} />
                  <th>Entry #</th>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Source</th>
                  <th>Debit Total</th>
                  <th>Credit Total</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {journalEntries.map((entry) => {
                  const debitTotal = entry.lineItems.reduce((s, li) => s + li.debit, 0);
                  const creditTotal = entry.lineItems.reduce((s, li) => s + li.credit, 0);
                  const isOpen = expandedEntry === entry.id;

                  return (
                    <AnimatePresence key={entry.id}>
                      <tr
                        style={{ cursor: 'pointer' }}
                        onClick={() => setExpandedEntry(isOpen ? null : entry.id)}
                      >
                        <td>
                          {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                        </td>
                        <td style={{ fontFamily: 'monospace', fontWeight: 500, fontSize: 13 }}>{entry.id}</td>
                        <td style={{ fontSize: 13, color: '#64748b' }}>{entry.date}</td>
                        <td style={{ fontWeight: 500 }}>{entry.description}</td>
                        <td>
                          <span className={`badge ${sourceBadgeClass[entry.source]}`}>{entry.source}</span>
                        </td>
                        <td style={{ fontWeight: 600 }}>${fmt(debitTotal)}</td>
                        <td style={{ fontWeight: 600 }}>${fmt(creditTotal)}</td>
                        <td>
                          <span className={`badge ${entry.posted ? 'badge-green' : 'badge-yellow'}`}>
                            {entry.posted ? 'Posted' : 'Draft'}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div
                            className="flex items-center gap-2"
                            style={{ justifyContent: 'flex-end' }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button className="btn btn-secondary" style={{ padding: '4px 8px' }}>
                              <Eye size={14} />
                            </button>
                            <button className="btn btn-secondary" style={{ padding: '4px 8px' }}>
                              <Edit2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                      {isOpen && (
                        <tr key={`${entry.id}-detail`}>
                          <td colSpan={9} style={{ padding: 0 }}>
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              style={{ overflow: 'hidden', background: '#f8fafc', padding: '12px 24px' }}
                            >
                              <table>
                                <thead>
                                  <tr>
                                    <th>Account</th>
                                    <th>Memo</th>
                                    <th style={{ textAlign: 'right' }}>Debit</th>
                                    <th style={{ textAlign: 'right' }}>Credit</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {entry.lineItems.map((li, idx) => (
                                    <tr key={idx}>
                                      <td>
                                        <span style={{ fontFamily: 'monospace', fontSize: 12, color: '#64748b' }}>
                                          {li.accountCode}
                                        </span>{' '}
                                        {li.accountName}
                                      </td>
                                      <td style={{ color: '#64748b', fontSize: 13 }}>{li.memo}</td>
                                      <td style={{ textAlign: 'right', fontWeight: li.debit > 0 ? 600 : 400 }}>
                                        {li.debit > 0 ? `$${fmt(li.debit)}` : '—'}
                                      </td>
                                      <td style={{ textAlign: 'right', fontWeight: li.credit > 0 ? 600 : 400 }}>
                                        {li.credit > 0 ? `$${fmt(li.credit)}` : '—'}
                                      </td>
                                    </tr>
                                  ))}
                                  <tr style={{ borderTop: '2px solid #e2e8f0' }}>
                                    <td colSpan={2} style={{ fontWeight: 600 }}>
                                      Totals
                                    </td>
                                    <td style={{ textAlign: 'right', fontWeight: 700 }}>${fmt(debitTotal)}</td>
                                    <td style={{ textAlign: 'right', fontWeight: 700 }}>${fmt(creditTotal)}</td>
                                  </tr>
                                </tbody>
                              </table>
                            </motion.div>
                          </td>
                        </tr>
                      )}
                    </AnimatePresence>
                  );
                })}
              </tbody>
            </table>
          </motion.div>

          {/* New Entry Modal */}
          <AnimatePresence>
            {showNewEntry && (
              <motion.div
                className="modal-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowNewEntry(false)}
              >
                <motion.div
                  className="modal"
                  style={{ maxWidth: 720 }}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>New Journal Entry</h2>
                    <button
                      className="btn btn-secondary"
                      style={{ padding: '4px 8px' }}
                      onClick={() => setShowNewEntry(false)}
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <div className="grid-2 mb-4">
                    <div className="form-group">
                      <label>Description</label>
                      <input
                        className="input"
                        placeholder="Entry description"
                        value={newEntry.description}
                        onChange={(e) => setNewEntry({ ...newEntry, description: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Source</label>
                      <select
                        className="select"
                        value={newEntry.source}
                        onChange={(e) =>
                          setNewEntry({ ...newEntry, source: e.target.value as JournalEntry['source'] })
                        }
                      >
                        <option value="Manual">Manual</option>
                        <option value="Sale">Sale</option>
                        <option value="Purchase">Purchase</option>
                        <option value="Refund">Refund</option>
                        <option value="Adjustment">Adjustment</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ marginBottom: 16 }}>
                    <div className="flex items-center justify-between mb-4">
                      <label style={{ fontWeight: 600, fontSize: 14 }}>Line Items</label>
                      <button className="btn btn-secondary" onClick={addLineItem} style={{ fontSize: 12 }}>
                        <Plus size={14} /> Add Line
                      </button>
                    </div>

                    {newEntry.lineItems.map((li, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2"
                        style={{ marginBottom: 8 }}
                      >
                        <select
                          className="select"
                          style={{ flex: 2 }}
                          value={li.accountCode}
                          onChange={(e) => {
                            const acct = accounts.find((a) => a.code === e.target.value);
                            updateLineItem(idx, 'accountCode', e.target.value);
                            if (acct) updateLineItem(idx, 'accountName', acct.name);
                          }}
                        >
                          <option value="">Select Account</option>
                          {accounts.map((a) => (
                            <option key={a.code} value={a.code}>
                              {a.code} - {a.name}
                            </option>
                          ))}
                        </select>
                        <input
                          className="input"
                          style={{ flex: 1 }}
                          type="number"
                          placeholder="Debit"
                          value={li.debit || ''}
                          onChange={(e) => updateLineItem(idx, 'debit', parseFloat(e.target.value) || 0)}
                        />
                        <input
                          className="input"
                          style={{ flex: 1 }}
                          type="number"
                          placeholder="Credit"
                          value={li.credit || ''}
                          onChange={(e) => updateLineItem(idx, 'credit', parseFloat(e.target.value) || 0)}
                        />
                        <input
                          className="input"
                          style={{ flex: 1.5 }}
                          placeholder="Memo"
                          value={li.memo}
                          onChange={(e) => updateLineItem(idx, 'memo', e.target.value)}
                        />
                        <button
                          className="btn btn-secondary"
                          style={{ padding: '4px 8px' }}
                          onClick={() => removeLineItem(idx)}
                          disabled={newEntry.lineItems.length <= 2}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Running totals */}
                  <div
                    className="flex items-center justify-between"
                    style={{
                      padding: '12px 16px',
                      background: entryBalanced ? '#f0fdf4' : '#fef2f2',
                      borderRadius: 8,
                      marginBottom: 16,
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <span style={{ fontSize: 13 }}>
                        <strong>Debits:</strong> ${fmt(entryDebitTotal)}
                      </span>
                      <span style={{ fontSize: 13 }}>
                        <strong>Credits:</strong> ${fmt(entryCreditTotal)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {entryBalanced ? (
                        <>
                          <CheckCircle size={16} color="#16a34a" />
                          <span style={{ fontSize: 13, color: '#16a34a', fontWeight: 600 }}>Balanced</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle size={16} color="#dc2626" />
                          <span style={{ fontSize: 13, color: '#dc2626', fontWeight: 600 }}>
                            Difference: ${fmt(Math.abs(entryDebitTotal - entryCreditTotal))}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button className="btn btn-primary" disabled={!entryBalanced || entryDebitTotal === 0}>
                      <CheckCircle size={16} /> Post Entry
                    </button>
                    <button className="btn btn-secondary">Save as Draft</button>
                    <button className="btn btn-secondary" onClick={() => setShowNewEntry(false)}>
                      Cancel
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* ── Trial Balance ──────────────────────────────────────────────────── */}
      {activeTab === 'trial' && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          {/* Summary Cards */}
          <div className="grid-3 mb-6">
            <motion.div className="stat-card" custom={0} initial="hidden" animate="visible" variants={cardVariants}>
              <h3>Total Debits</h3>
              <div className="value">${fmt(totalDebits)}</div>
              <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>
                {trialBalanceAccounts.filter((a) => ['Asset', 'Expense'].includes(a.type)).length} accounts
              </div>
            </motion.div>
            <motion.div className="stat-card" custom={1} initial="hidden" animate="visible" variants={cardVariants}>
              <h3>Total Credits</h3>
              <div className="value">${fmt(totalCredits)}</div>
              <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>
                {trialBalanceAccounts.filter((a) => ['Liability', 'Equity', 'Revenue'].includes(a.type)).length}{' '}
                accounts
              </div>
            </motion.div>
            <motion.div className="stat-card" custom={2} initial="hidden" animate="visible" variants={cardVariants}>
              <h3>Balance Status</h3>
              <div style={{ marginTop: 8 }}>
                {isBalanced ? (
                  <span
                    className="badge badge-green"
                    style={{ fontSize: 16, padding: '8px 16px' }}
                  >
                    <CheckCircle size={18} style={{ marginRight: 6, verticalAlign: 'middle' }} />
                    Balanced
                  </span>
                ) : (
                  <span
                    className="badge badge-red"
                    style={{ fontSize: 16, padding: '8px 16px' }}
                  >
                    <AlertCircle size={18} style={{ marginRight: 6, verticalAlign: 'middle' }} />
                    Unbalanced
                  </span>
                )}
              </div>
              <div style={{ fontSize: 13, color: '#64748b', marginTop: 8 }}>
                Difference: ${fmt(Math.abs(totalDebits - totalCredits))}
              </div>
            </motion.div>
          </div>

          <motion.div className="card" custom={3} initial="hidden" animate="visible" variants={cardVariants}>
            <div className="flex items-center justify-between mb-4">
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Trial Balance Report</h3>
              <span style={{ fontSize: 13, color: '#64748b' }}>As of March 8, 2026</span>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Account</th>
                  <th>Type</th>
                  <th style={{ textAlign: 'right' }}>Debit</th>
                  <th style={{ textAlign: 'right' }}>Credit</th>
                </tr>
              </thead>
              <tbody>
                {trialBalanceAccounts.map((account) => {
                  const isDebit = ['Asset', 'Expense'].includes(account.type);
                  return (
                    <tr key={account.code}>
                      <td style={{ fontFamily: 'monospace', fontWeight: 500, fontSize: 13 }}>{account.code}</td>
                      <td style={{ fontWeight: 500 }}>{account.name}</td>
                      <td>
                        <span className={`badge ${typeBadgeClass[account.type]}`}>{account.type}</span>
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: isDebit ? 600 : 400 }}>
                        {isDebit ? `$${fmt(account.balance)}` : '—'}
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: !isDebit ? 600 : 400 }}>
                        {!isDebit ? `$${fmt(account.balance)}` : '—'}
                      </td>
                    </tr>
                  );
                })}
                <tr
                  style={{
                    borderTop: '3px double #cbd5e1',
                    fontWeight: 700,
                    fontSize: 15,
                  }}
                >
                  <td colSpan={3}>Totals</td>
                  <td style={{ textAlign: 'right' }}>${fmt(totalDebits)}</td>
                  <td style={{ textAlign: 'right' }}>${fmt(totalCredits)}</td>
                </tr>
              </tbody>
            </table>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
