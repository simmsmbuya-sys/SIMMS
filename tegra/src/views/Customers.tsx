import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  UserPlus,
  Search,
  Mail,
  Phone,
  Building2,
  ChevronDown,
  ChevronRight,
  X,
  Edit,
  Trash2,
  ShoppingBag,
  DollarSign,
} from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────────────────

interface Transaction {
  id: string;
  date: string;
  items: string;
  amount: number;
  status: string;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: 'Retail' | 'Wholesale' | 'B2B';
  company: string;
  totalSpend: number;
  lastPurchase: string;
  address: string;
  notes: string;
  transactions: Transaction[];
}

// ── Demo Customers ─────────────────────────────────────────────────────────────

const demoCustomers: Customer[] = [
  {
    id: 'c1',
    name: 'James Okonkwo',
    email: 'james.okonkwo@greenfieldhw.com',
    phone: '+234 801 234 5678',
    type: 'Wholesale',
    company: 'Greenfield Hardware Ltd',
    totalSpend: 284500.00,
    lastPurchase: '2024-03-06',
    address: '15 Industrial Ave, Lagos',
    notes: 'Preferred customer, net-30 terms',
    transactions: [
      { id: 'RCT-2024-4782', date: '2024-03-06', items: 'Portland Cement x40, Rebar x120', amount: 12450.00, status: 'completed' },
      { id: 'RCT-2024-4690', date: '2024-02-28', items: 'Roofing Sheets x25, Nails x10', amount: 8320.50, status: 'completed' },
      { id: 'RCT-2024-4585', date: '2024-02-15', items: 'PVC Pipes x200, Elbows x80', amount: 5640.00, status: 'completed' },
    ],
  },
  {
    id: 'c2',
    name: 'Sarah Chen',
    email: 'sarah.chen@metroconstruction.co',
    phone: '+1 415 555 0192',
    type: 'B2B',
    company: 'Metro Construction Co.',
    totalSpend: 562340.00,
    lastPurchase: '2024-03-05',
    address: '480 Market St, San Francisco, CA',
    notes: 'Large volume buyer, quarterly contracts',
    transactions: [
      { id: 'RCT-2024-4781', date: '2024-03-05', items: 'Steel Rebar x500, Cement x200', amount: 34200.50, status: 'completed' },
      { id: 'RCT-2024-4650', date: '2024-02-20', items: 'Safety Equipment Bundle', amount: 15800.00, status: 'completed' },
      { id: 'RCT-2024-4520', date: '2024-02-02', items: 'Electrical Supplies Bulk Order', amount: 28750.00, status: 'completed' },
    ],
  },
  {
    id: 'c3',
    name: 'David Mensah',
    email: 'david@sunriseplumbing.gh',
    phone: '+233 20 987 6543',
    type: 'Wholesale',
    company: 'Sunrise Plumbing Supplies',
    totalSpend: 87650.00,
    lastPurchase: '2024-03-06',
    address: '8 Kwame Nkrumah Circle, Accra',
    notes: 'Plumbing specialist, reliable payments',
    transactions: [
      { id: 'RCT-2024-4780', date: '2024-03-06', items: '32mm PVC Pipe x100', amount: 2875.00, status: 'pending' },
      { id: 'RCT-2024-4700', date: '2024-03-01', items: 'Copper Fittings Assorted', amount: 4200.00, status: 'completed' },
      { id: 'RCT-2024-4610', date: '2024-02-18', items: 'Water Tanks x5, Pumps x3', amount: 12500.00, status: 'completed' },
    ],
  },
  {
    id: 'c4',
    name: 'Amara Diallo',
    email: 'amara.diallo@apexelec.com',
    phone: '+221 77 456 7890',
    type: 'B2B',
    company: 'Apex Electrical Distributors',
    totalSpend: 435200.00,
    lastPurchase: '2024-03-06',
    address: '22 Route de Ouakam, Dakar',
    notes: 'Electrical wholesale, net-45 terms',
    transactions: [
      { id: 'RCT-2024-4779', date: '2024-03-06', items: 'Cable Bulk Order, Circuit Breakers', amount: 56780.00, status: 'completed' },
      { id: 'RCT-2024-4660', date: '2024-02-22', items: 'LED Panel Lights x200', amount: 18400.00, status: 'completed' },
      { id: 'RCT-2024-4550', date: '2024-02-05', items: 'Distribution Boards x50', amount: 32100.00, status: 'completed' },
    ],
  },
  {
    id: 'c5',
    name: 'Rachel Thompson',
    email: 'rachel.t@valleyfarm.com',
    phone: '+1 503 555 0147',
    type: 'Retail',
    company: 'Valley Farm Equipment',
    totalSpend: 42890.00,
    lastPurchase: '2024-03-05',
    address: '1200 Valley Rd, Portland, OR',
    notes: 'Seasonal buyer, peak in spring/summer',
    transactions: [
      { id: 'RCT-2024-4778', date: '2024-03-05', items: 'Wheelbarrow x2, Tools Assorted', amount: 8340.75, status: 'completed' },
      { id: 'RCT-2024-4620', date: '2024-02-19', items: 'Fencing Wire x20 rolls', amount: 3200.00, status: 'completed' },
      { id: 'RCT-2024-4480', date: '2024-01-28', items: 'Hardware Misc', amount: 1250.50, status: 'completed' },
    ],
  },
  {
    id: 'c6',
    name: 'Michael Adebayo',
    email: 'michael@pinnaclebuilders.ng',
    phone: '+234 803 765 4321',
    type: 'B2B',
    company: 'Pinnacle Builders Inc.',
    totalSpend: 198750.00,
    lastPurchase: '2024-03-04',
    address: '45 Victoria Island, Lagos',
    notes: 'Government contractor, purchase orders required',
    transactions: [
      { id: 'RCT-2024-4776', date: '2024-03-04', items: 'Cement x100, Sand x50 tons', amount: 4215.25, status: 'refunded' },
      { id: 'RCT-2024-4640', date: '2024-02-21', items: 'Roofing Materials Bulk', amount: 45600.00, status: 'completed' },
      { id: 'RCT-2024-4510', date: '2024-02-03', items: 'Paint x200L, Primer x100L', amount: 22400.00, status: 'completed' },
    ],
  },
  {
    id: 'c7',
    name: 'Fatima Al-Rashid',
    email: 'fatima@homecraftdxb.ae',
    phone: '+971 50 123 4567',
    type: 'Wholesale',
    company: 'HomeCraft Trading LLC',
    totalSpend: 156300.00,
    lastPurchase: '2024-03-03',
    address: '12 Al Quoz Industrial, Dubai',
    notes: 'Import/export, prefers bulk shipments',
    transactions: [
      { id: 'RCT-2024-4760', date: '2024-03-03', items: 'Paint Collection x150 cans', amount: 9870.00, status: 'completed' },
      { id: 'RCT-2024-4630', date: '2024-02-20', items: 'Hardware Tools Assortment', amount: 14500.00, status: 'completed' },
      { id: 'RCT-2024-4500', date: '2024-02-01', items: 'Safety Equipment Bulk', amount: 8900.00, status: 'completed' },
    ],
  },
  {
    id: 'c8',
    name: 'Luis Hernandez',
    email: 'luis.h@casaconstruct.mx',
    phone: '+52 55 4567 8901',
    type: 'Retail',
    company: 'Casa Construct',
    totalSpend: 23450.00,
    lastPurchase: '2024-03-02',
    address: '78 Av. Reforma, Mexico City',
    notes: 'Small contractor, cash preferred',
    transactions: [
      { id: 'RCT-2024-4740', date: '2024-03-02', items: 'Cement x20, Rebar x40', amount: 2380.00, status: 'completed' },
      { id: 'RCT-2024-4590', date: '2024-02-14', items: 'Plumbing Kit x5', amount: 1875.00, status: 'completed' },
      { id: 'RCT-2024-4460', date: '2024-01-25', items: 'Electrical Supplies', amount: 950.00, status: 'completed' },
    ],
  },
  {
    id: 'c9',
    name: 'Priya Sharma',
    email: 'priya@bharatbuild.in',
    phone: '+91 98765 43210',
    type: 'Wholesale',
    company: 'Bharat Build Solutions',
    totalSpend: 312800.00,
    lastPurchase: '2024-03-01',
    address: '56 MG Road, Bengaluru',
    notes: 'Large wholesale account, monthly orders',
    transactions: [
      { id: 'RCT-2024-4720', date: '2024-03-01', items: 'Steel Products Bulk', amount: 67500.00, status: 'completed' },
      { id: 'RCT-2024-4580', date: '2024-02-12', items: 'Cement x500, Sand x100 tons', amount: 48200.00, status: 'completed' },
      { id: 'RCT-2024-4440', date: '2024-01-22', items: 'Roofing + Waterproofing', amount: 35600.00, status: 'completed' },
    ],
  },
  {
    id: 'c10',
    name: 'Emma Johansson',
    email: 'emma.j@nordicfix.se',
    phone: '+46 70 123 4567',
    type: 'Retail',
    company: 'Nordic Fix & Supply',
    totalSpend: 18920.00,
    lastPurchase: '2024-02-28',
    address: '14 Storgatan, Stockholm',
    notes: 'New customer, first order in Feb',
    transactions: [
      { id: 'RCT-2024-4680', date: '2024-02-28', items: 'Tools Starter Kit', amount: 4250.00, status: 'completed' },
      { id: 'RCT-2024-4560', date: '2024-02-10', items: 'Safety Gear x10 sets', amount: 2800.00, status: 'completed' },
      { id: 'RCT-2024-4430', date: '2024-01-20', items: 'Hardware Fasteners Bulk', amount: 1650.00, status: 'completed' },
    ],
  },
];

// ── Stats ──────────────────────────────────────────────────────────────────────

const customerStats = [
  { title: 'Total Customers', value: '342', icon: Users, color: '#3b82f6', bg: '#eff6ff' },
  { title: 'Retail', value: '215', icon: ShoppingBag, color: '#10b981', bg: '#ecfdf5' },
  { title: 'Wholesale', value: '89', icon: Building2, color: '#8b5cf6', bg: '#f5f3ff' },
  { title: 'B2B', value: '38', icon: DollarSign, color: '#f59e0b', bg: '#fffbeb' },
];

// ── Animation ──────────────────────────────────────────────────────────────────

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  }),
};

const typeBadge = (type: string) => {
  switch (type) {
    case 'Retail': return 'badge-green';
    case 'Wholesale': return 'badge-purple';
    case 'B2B': return 'badge-blue';
    default: return 'badge-gray';
  }
};

const statusBadge = (status: string) => {
  switch (status) {
    case 'completed': return 'badge-green';
    case 'pending': return 'badge-yellow';
    case 'refunded': return 'badge-red';
    default: return 'badge-gray';
  }
};

const customerTypes = ['All', 'Retail', 'Wholesale', 'B2B'] as const;

// ── Component ──────────────────────────────────────────────────────────────────

export default function Customers() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Form state
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formType, setFormType] = useState<'Retail' | 'Wholesale' | 'B2B'>('Retail');
  const [formCompany, setFormCompany] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [formNotes, setFormNotes] = useState('');

  const resetForm = () => {
    setFormName('');
    setFormEmail('');
    setFormPhone('');
    setFormType('Retail');
    setFormCompany('');
    setFormAddress('');
    setFormNotes('');
  };

  // Filter customers
  const filteredCustomers = demoCustomers.filter((c) => {
    const matchType = typeFilter === 'All' || c.type === typeFilter;
    const matchSearch =
      search === '' ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.company.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search);
    return matchType && matchSearch;
  });

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Customers</h1>
          <p style={{ color: '#64748b', fontSize: 14, margin: '4px 0 0' }}>
            Manage your customer relationships and accounts
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <UserPlus size={16} /> Add Customer
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid-4 mb-6">
        {customerStats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              className="stat-card"
              custom={i}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
            >
              <div className="flex items-center justify-between" style={{ marginBottom: 12 }}>
                <h3>{stat.title}</h3>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: stat.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon size={20} color={stat.color} />
                </div>
              </div>
              <div className="value">{stat.value}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Filters + Search */}
      <motion.div
        className="card mb-6"
        custom={4}
        initial="hidden"
        animate="visible"
        variants={cardVariants}
      >
        {/* Type Tabs */}
        <div className="tabs" style={{ marginBottom: 16 }}>
          {customerTypes.map((t) => (
            <button
              key={t}
              className={`tab ${typeFilter === t ? 'active' : ''}`}
              onClick={() => setTypeFilter(t)}
            >
              {t}
              {t !== 'All' && (
                <span
                  style={{
                    marginLeft: 6,
                    fontSize: 11,
                    background: '#f1f5f9',
                    padding: '2px 6px',
                    borderRadius: 8,
                    color: '#64748b',
                  }}
                >
                  {demoCustomers.filter((c) => c.type === t).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Search */}
        <div style={{ position: 'relative', maxWidth: 400 }}>
          <Search
            size={16}
            style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}
          />
          <input
            className="input"
            placeholder="Search by name, email, company, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: 36 }}
          />
        </div>
      </motion.div>

      {/* Customer Table */}
      <motion.div
        className="card"
        custom={5}
        initial="hidden"
        animate="visible"
        variants={cardVariants}
      >
        <table>
          <thead>
            <tr>
              <th style={{ width: 30 }}></th>
              <th>Customer</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Type</th>
              <th>Company</th>
              <th>Total Spend</th>
              <th>Last Purchase</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map((customer) => (
              <>
                <tr
                  key={customer.id}
                  onClick={() => setExpandedRow(expandedRow === customer.id ? null : customer.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <td style={{ padding: '12px 8px 12px 16px' }}>
                    {expandedRow === customer.id ? (
                      <ChevronDown size={14} color="#94a3b8" />
                    ) : (
                      <ChevronRight size={14} color="#94a3b8" />
                    )}
                  </td>
                  <td>
                    <div className="flex items-center gap-3">
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: '50%',
                          background: '#eff6ff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 600,
                          fontSize: 13,
                          color: '#3b82f6',
                          flexShrink: 0,
                        }}
                      >
                        {customer.name.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <span style={{ fontWeight: 500 }}>{customer.name}</span>
                    </div>
                  </td>
                  <td>
                    <span className="flex items-center gap-2" style={{ fontSize: 13, color: '#64748b' }}>
                      <Mail size={13} /> {customer.email}
                    </span>
                  </td>
                  <td>
                    <span className="flex items-center gap-2" style={{ fontSize: 13, color: '#64748b' }}>
                      <Phone size={13} /> {customer.phone}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${typeBadge(customer.type)}`}>{customer.type}</span>
                  </td>
                  <td style={{ fontSize: 13 }}>{customer.company}</td>
                  <td style={{ fontWeight: 600 }}>
                    ${customer.totalSpend.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td style={{ fontSize: 13, color: '#64748b' }}>{customer.lastPurchase}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <button
                        className="btn btn-secondary"
                        style={{ padding: '4px 8px' }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        className="btn btn-secondary"
                        style={{ padding: '4px 8px', color: '#ef4444' }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
                {/* Expanded Purchase History */}
                {expandedRow === customer.id && (
                  <tr key={`${customer.id}-details`}>
                    <td colSpan={9} style={{ padding: 0, background: '#f8fafc' }}>
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        style={{ padding: '16px 24px 16px 60px', overflow: 'hidden' }}
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <h4 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#475569' }}>
                            Purchase History
                          </h4>
                          <span className="badge badge-gray">{customer.transactions.length} transactions</span>
                        </div>
                        <div style={{ fontSize: 13, color: '#64748b', marginBottom: 8 }}>
                          <span style={{ marginRight: 16 }}>
                            <strong>Address:</strong> {customer.address}
                          </span>
                          <span>
                            <strong>Notes:</strong> {customer.notes}
                          </span>
                        </div>
                        <table>
                          <thead>
                            <tr>
                              <th style={{ fontSize: 11 }}>Receipt #</th>
                              <th style={{ fontSize: 11 }}>Date</th>
                              <th style={{ fontSize: 11 }}>Items</th>
                              <th style={{ fontSize: 11 }}>Amount</th>
                              <th style={{ fontSize: 11 }}>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {customer.transactions.map((tx) => (
                              <tr key={tx.id}>
                                <td style={{ fontFamily: 'monospace', fontSize: 12 }}>{tx.id}</td>
                                <td style={{ fontSize: 13 }}>{tx.date}</td>
                                <td style={{ fontSize: 13, maxWidth: 240 }}>{tx.items}</td>
                                <td style={{ fontWeight: 600, fontSize: 13 }}>
                                  ${tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                </td>
                                <td>
                                  <span className={`badge ${statusBadge(tx.status)}`}>{tx.status}</span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </motion.div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>

        {filteredCustomers.length === 0 && (
          <div className="empty-state">
            <Users size={40} style={{ marginBottom: 12, opacity: 0.4 }} />
            <h3>No customers found</h3>
            <p>Try adjusting your search or filter</p>
          </div>
        )}
      </motion.div>

      {/* ── Add Customer Modal ────────────────────────────────────────────── */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => { setShowModal(false); resetForm(); }}
          >
            <motion.div
              className="modal"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 style={{ margin: 0 }}>Add New Customer</h2>
                <button
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
                  onClick={() => { setShowModal(false); resetForm(); }}
                >
                  <X size={20} />
                </button>
              </div>

              <div className="form-group">
                <label>Full Name *</label>
                <input
                  className="input"
                  placeholder="Enter customer name"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    className="input"
                    type="email"
                    placeholder="email@example.com"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    className="input"
                    placeholder="+1 234 567 8900"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label>Customer Type *</label>
                  <select
                    className="select"
                    style={{ width: '100%' }}
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as 'Retail' | 'Wholesale' | 'B2B')}
                  >
                    <option value="Retail">Retail</option>
                    <option value="Wholesale">Wholesale</option>
                    <option value="B2B">B2B</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Company</label>
                  <input
                    className="input"
                    placeholder="Company name"
                    value={formCompany}
                    onChange={(e) => setFormCompany(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Address</label>
                <input
                  className="input"
                  placeholder="Full address"
                  value={formAddress}
                  onChange={(e) => setFormAddress(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Notes</label>
                <textarea
                  className="input"
                  placeholder="Additional notes about this customer..."
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  rows={3}
                  style={{ resize: 'vertical' }}
                />
              </div>

              <div className="flex items-center justify-between" style={{ marginTop: 24 }}>
                <button
                  className="btn btn-secondary"
                  onClick={() => { setShowModal(false); resetForm(); }}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => { setShowModal(false); resetForm(); }}
                >
                  <UserPlus size={16} /> Add Customer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
