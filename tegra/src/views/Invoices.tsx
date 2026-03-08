import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Search,
  Filter,
  X,
  Trash2,
  Eye,
  Edit,
  Send,
  Download,
  CreditCard,
  MoreHorizontal,
  Calendar,
} from 'lucide-react';

type InvoiceStatus = 'Draft' | 'Sent' | 'Paid' | 'Partially Paid' | 'Overdue';

interface InvoiceLineItem {
  id: string;
  description: string;
  qty: number;
  unitPrice: number;
  total: number;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  customer: string;
  customerEmail: string;
  items: number;
  subtotal: number;
  tax: number;
  total: number;
  paid: number;
  balance: number;
  status: InvoiceStatus;
  dueDate: string;
  issuedDate: string;
  lineItems: InvoiceLineItem[];
}

const invoices: Invoice[] = [
  {
    id: 'INV-001',
    invoiceNumber: 'INV-2024-0312',
    customer: 'Greenfield Hardware Ltd',
    customerEmail: 'accounts@greenfield.com',
    items: 8,
    subtotal: 12450.00,
    tax: 1245.00,
    total: 13695.00,
    paid: 13695.00,
    balance: 0,
    status: 'Paid',
    dueDate: '2024-03-30',
    issuedDate: '2024-03-01',
    lineItems: [
      { id: 'LI-001', description: 'Portland Cement 50kg', qty: 100, unitPrice: 12.50, total: 1250.00 },
      { id: 'LI-002', description: 'Steel Rebar 12mm (6m)', qty: 200, unitPrice: 20.00, total: 4000.00 },
      { id: 'LI-003', description: 'Roofing Sheet 3m Charcoal', qty: 50, unitPrice: 65.00, total: 3250.00 },
    ],
  },
  {
    id: 'INV-002',
    invoiceNumber: 'INV-2024-0313',
    customer: 'Metro Construction Co.',
    customerEmail: 'billing@metroconst.com',
    items: 15,
    subtotal: 34200.50,
    tax: 3420.05,
    total: 37620.55,
    paid: 20000.00,
    balance: 17620.55,
    status: 'Partially Paid',
    dueDate: '2024-03-25',
    issuedDate: '2024-02-25',
    lineItems: [
      { id: 'LI-004', description: 'Concrete Block 200mm', qty: 500, unitPrice: 3.80, total: 1900.00 },
      { id: 'LI-005', description: 'Sand (per ton)', qty: 25, unitPrice: 366.00, total: 9150.00 },
      { id: 'LI-006', description: 'Tile Adhesive 25kg', qty: 200, unitPrice: 18.00, total: 3600.00 },
    ],
  },
  {
    id: 'INV-003',
    invoiceNumber: 'INV-2024-0314',
    customer: 'Sunrise Plumbing Supplies',
    customerEmail: 'payments@sunriseplumb.com',
    items: 3,
    subtotal: 2875.00,
    tax: 287.50,
    total: 3162.50,
    paid: 0,
    balance: 3162.50,
    status: 'Overdue',
    dueDate: '2024-03-10',
    issuedDate: '2024-02-10',
    lineItems: [
      { id: 'LI-007', description: 'PVC Pipe 32mm (6m)', qty: 50, unitPrice: 14.00, total: 700.00 },
      { id: 'LI-008', description: 'Gate Valve 25mm', qty: 25, unitPrice: 32.00, total: 800.00 },
      { id: 'LI-009', description: 'Galvanized Pipe 25mm', qty: 25, unitPrice: 55.00, total: 1375.00 },
    ],
  },
  {
    id: 'INV-004',
    invoiceNumber: 'INV-2024-0315',
    customer: 'Apex Electrical Distributors',
    customerEmail: 'ap@apexelec.com',
    items: 22,
    subtotal: 56780.00,
    tax: 5678.00,
    total: 62458.00,
    paid: 62458.00,
    balance: 0,
    status: 'Paid',
    dueDate: '2024-04-05',
    issuedDate: '2024-03-05',
    lineItems: [
      { id: 'LI-010', description: 'Copper Wire 2.5mm (100m)', qty: 150, unitPrice: 48.00, total: 7200.00 },
      { id: 'LI-011', description: 'LED Panel Light 60W', qty: 200, unitPrice: 85.00, total: 17000.00 },
      { id: 'LI-012', description: 'Circuit Breaker 30A', qty: 400, unitPrice: 24.00, total: 9600.00 },
    ],
  },
  {
    id: 'INV-005',
    invoiceNumber: 'INV-2024-0316',
    customer: 'Valley Farm Equipment',
    customerEmail: 'finance@valleyfarm.com',
    items: 5,
    subtotal: 8340.75,
    tax: 834.08,
    total: 9174.83,
    paid: 0,
    balance: 9174.83,
    status: 'Sent',
    dueDate: '2024-04-15',
    issuedDate: '2024-03-15',
    lineItems: [
      { id: 'LI-013', description: 'Wheelbarrow 65L', qty: 10, unitPrice: 120.00, total: 1200.00 },
      { id: 'LI-014', description: 'Garden Fertilizer 25kg', qty: 50, unitPrice: 22.00, total: 1100.00 },
      { id: 'LI-015', description: 'Measuring Tape 8m', qty: 25, unitPrice: 18.00, total: 450.00 },
    ],
  },
  {
    id: 'INV-006',
    invoiceNumber: 'INV-2024-0317',
    customer: 'BuildMax Contractors',
    customerEmail: 'invoices@buildmax.com',
    items: 12,
    subtotal: 24680.00,
    tax: 2468.00,
    total: 27148.00,
    paid: 0,
    balance: 27148.00,
    status: 'Draft',
    dueDate: '2024-04-20',
    issuedDate: '2024-03-16',
    lineItems: [
      { id: 'LI-016', description: 'Pine Plank 2x4 (3m)', qty: 200, unitPrice: 28.00, total: 5600.00 },
      { id: 'LI-017', description: 'Plywood 18mm (4x8)', qty: 50, unitPrice: 85.00, total: 4250.00 },
      { id: 'LI-018', description: 'Hardwood Decking (3m)', qty: 80, unitPrice: 110.00, total: 8800.00 },
    ],
  },
  {
    id: 'INV-007',
    invoiceNumber: 'INV-2024-0318',
    customer: 'HomeBuilder Direct',
    customerEmail: 'pay@homebuilder.com',
    items: 7,
    subtotal: 5420.00,
    tax: 542.00,
    total: 5962.00,
    paid: 0,
    balance: 5962.00,
    status: 'Overdue',
    dueDate: '2024-03-08',
    issuedDate: '2024-02-08',
    lineItems: [
      { id: 'LI-019', description: 'Safety Helmet Yellow', qty: 30, unitPrice: 25.00, total: 750.00 },
      { id: 'LI-020', description: 'Hi-Vis Vest Orange', qty: 50, unitPrice: 18.00, total: 900.00 },
      { id: 'LI-021', description: 'Work Gloves (pair)', qty: 100, unitPrice: 8.00, total: 800.00 },
    ],
  },
  {
    id: 'INV-008',
    invoiceNumber: 'INV-2024-0319',
    customer: 'Elite Interiors Studio',
    customerEmail: 'accounts@eliteinteriors.com',
    items: 4,
    subtotal: 14250.00,
    tax: 1425.00,
    total: 15675.00,
    paid: 15675.00,
    balance: 0,
    status: 'Paid',
    dueDate: '2024-03-28',
    issuedDate: '2024-02-28',
    lineItems: [
      { id: 'LI-022', description: 'Emulsion Paint 20L White', qty: 60, unitPrice: 90.00, total: 5400.00 },
      { id: 'LI-023', description: 'Gloss Paint 5L Black', qty: 40, unitPrice: 45.00, total: 1800.00 },
      { id: 'LI-024', description: 'Wood Varnish 5L', qty: 30, unitPrice: 67.50, total: 2025.00 },
    ],
  },
  {
    id: 'INV-009',
    invoiceNumber: 'INV-2024-0320',
    customer: 'CityWide Maintenance Corp',
    customerEmail: 'billing@citywide.com',
    items: 9,
    subtotal: 18975.00,
    tax: 1897.50,
    total: 20872.50,
    paid: 0,
    balance: 20872.50,
    status: 'Sent',
    dueDate: '2024-04-10',
    issuedDate: '2024-03-10',
    lineItems: [
      { id: 'LI-025', description: 'Angle Grinder 115mm', qty: 15, unitPrice: 165.00, total: 2475.00 },
      { id: 'LI-026', description: 'Extension Cord 10m', qty: 30, unitPrice: 18.00, total: 540.00 },
      { id: 'LI-027', description: 'Smart Thermostat', qty: 10, unitPrice: 180.00, total: 1800.00 },
    ],
  },
  {
    id: 'INV-010',
    invoiceNumber: 'INV-2024-0321',
    customer: 'Riverside Development LLC',
    customerEmail: 'finance@riversidedev.com',
    items: 18,
    subtotal: 42500.00,
    tax: 4250.00,
    total: 46750.00,
    paid: 30000.00,
    balance: 16750.00,
    status: 'Partially Paid',
    dueDate: '2024-03-30',
    issuedDate: '2024-03-01',
    lineItems: [
      { id: 'LI-028', description: 'Steel Rebar 16mm (6m)', qty: 300, unitPrice: 35.00, total: 10500.00 },
      { id: 'LI-029', description: 'Binding Wire 25kg', qty: 20, unitPrice: 255.00, total: 5100.00 },
      { id: 'LI-030', description: 'Concrete Block 200mm', qty: 1000, unitPrice: 3.80, total: 3800.00 },
    ],
  },
];

const statCards = [
  { title: 'Total Invoices', value: '189', icon: FileText, color: '#3b82f6', bg: '#eff6ff' },
  { title: 'Outstanding', value: '$67,400', icon: DollarSign, color: '#f59e0b', bg: '#fffbeb' },
  { title: 'Overdue', value: '$12,300', icon: AlertTriangle, color: '#ef4444', bg: '#fef2f2' },
  { title: 'Paid This Month', value: '$145,200', icon: CheckCircle2, color: '#10b981', bg: '#ecfdf5' },
];

const statusBadgeClass = (status: InvoiceStatus): string => {
  const map: Record<InvoiceStatus, string> = {
    Draft: 'badge-gray',
    Sent: 'badge-blue',
    Paid: 'badge-green',
    'Partially Paid': 'badge-yellow',
    Overdue: 'badge-red',
  };
  return map[status];
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const customerNames = [
  'Greenfield Hardware Ltd',
  'Metro Construction Co.',
  'Sunrise Plumbing Supplies',
  'Apex Electrical Distributors',
  'Valley Farm Equipment',
  'BuildMax Contractors',
  'HomeBuilder Direct',
  'Elite Interiors Studio',
  'CityWide Maintenance Corp',
  'Riverside Development LLC',
];

export default function Invoices() {
  const [activeTab, setActiveTab] = useState<'All' | 'Draft' | 'Sent' | 'Paid' | 'Overdue'>('All');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [formData, setFormData] = useState({
    customer: '',
    dueDate: '',
    notes: '',
    lineItems: [{ description: '', qty: '', unitPrice: '' }],
  });

  const tabs = ['All', 'Draft', 'Sent', 'Paid', 'Overdue'] as const;

  const filtered = invoices.filter((inv) => {
    const matchesTab =
      activeTab === 'All' || inv.status === activeTab || (activeTab === 'Paid' && inv.status === 'Partially Paid');
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.customer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const addLineItem = () => {
    setFormData({
      ...formData,
      lineItems: [...formData.lineItems, { description: '', qty: '', unitPrice: '' }],
    });
  };

  const removeLineItem = (index: number) => {
    setFormData({
      ...formData,
      lineItems: formData.lineItems.filter((_, i) => i !== index),
    });
  };

  const updateLineItem = (index: number, field: string, value: string) => {
    const updated = [...formData.lineItems];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, lineItems: updated });
  };

  const paymentInvoice = invoices.find((inv) => inv.id === showPaymentModal);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Invoices</h1>
          <p style={{ color: '#64748b', fontSize: 14, margin: '4px 0 0' }}>
            Create, send, and track invoices and payments.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
          <Plus size={16} /> Create Invoice
        </button>
      </div>

      {/* Stats */}
      <div className="grid-4 mb-6">
        {statCards.map((stat, i) => {
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

      {/* Filter Tabs */}
      <div className="tabs mb-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
            {tab !== 'All' && (
              <span
                style={{
                  background: '#e2e8f0',
                  borderRadius: 10,
                  padding: '2px 8px',
                  fontSize: 11,
                  fontWeight: 600,
                  marginLeft: 6,
                }}
              >
                {tab === 'Overdue'
                  ? invoices.filter((i) => i.status === 'Overdue').length
                  : tab === 'Paid'
                  ? invoices.filter((i) => i.status === 'Paid' || i.status === 'Partially Paid').length
                  : invoices.filter((i) => i.status === tab).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="card mb-4" style={{ padding: '12px 16px' }}>
        <div style={{ position: 'relative', maxWidth: 400 }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            className="input"
            placeholder="Search invoices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: 36, width: '100%' }}
          />
        </div>
      </div>

      {/* Invoice Table */}
      <motion.div className="card" custom={4} initial="hidden" animate="visible" variants={cardVariants}>
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Subtotal</th>
                <th>Tax</th>
                <th>Total</th>
                <th>Paid</th>
                <th>Balance</th>
                <th>Status</th>
                <th>Due Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((invoice) => (
                <tr key={invoice.id}>
                  <td style={{ fontWeight: 600, fontFamily: 'monospace', fontSize: 13 }}>{invoice.invoiceNumber}</td>
                  <td>
                    <div style={{ fontWeight: 500 }}>{invoice.customer}</div>
                    <div style={{ fontSize: 11, color: '#94a3b8' }}>{invoice.customerEmail}</div>
                  </td>
                  <td>{invoice.items}</td>
                  <td style={{ fontSize: 13 }}>${invoice.subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  <td style={{ fontSize: 13, color: '#64748b' }}>${invoice.tax.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  <td style={{ fontWeight: 600 }}>${invoice.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  <td style={{ color: invoice.paid > 0 ? '#10b981' : '#94a3b8', fontWeight: 500 }}>
                    ${invoice.paid.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td style={{ fontWeight: 600, color: invoice.balance > 0 ? '#ef4444' : '#10b981' }}>
                    ${invoice.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td>
                    <span className={`badge ${statusBadgeClass(invoice.status)}`}>{invoice.status}</span>
                  </td>
                  <td style={{ fontSize: 13 }}>{invoice.dueDate}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      {invoice.balance > 0 && invoice.status !== 'Draft' && (
                        <button
                          className="btn btn-success"
                          style={{ padding: '4px 10px', fontSize: 12 }}
                          onClick={() => {
                            setShowPaymentModal(invoice.id);
                            setPaymentAmount(invoice.balance.toFixed(2));
                          }}
                        >
                          <CreditCard size={12} /> Pay
                        </button>
                      )}
                      <div style={{ position: 'relative' }}>
                        <button
                          className="btn btn-secondary"
                          style={{ padding: 6 }}
                          onClick={() => setActiveMenu(activeMenu === invoice.id ? null : invoice.id)}
                        >
                          <MoreHorizontal size={14} />
                        </button>
                        {activeMenu === invoice.id && (
                          <div
                            style={{
                              position: 'absolute',
                              right: 0,
                              top: '100%',
                              background: 'white',
                              border: '1px solid #e2e8f0',
                              borderRadius: 8,
                              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                              zIndex: 10,
                              minWidth: 160,
                              padding: 4,
                            }}
                          >
                            <button
                              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', width: '100%', border: 'none', background: 'none', cursor: 'pointer', borderRadius: 4, fontSize: 13 }}
                              onMouseEnter={(e) => (e.currentTarget.style.background = '#f8fafc')}
                              onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                              onClick={() => setActiveMenu(null)}
                            >
                              <Eye size={14} /> View Details
                            </button>
                            <button
                              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', width: '100%', border: 'none', background: 'none', cursor: 'pointer', borderRadius: 4, fontSize: 13 }}
                              onMouseEnter={(e) => (e.currentTarget.style.background = '#f8fafc')}
                              onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                              onClick={() => setActiveMenu(null)}
                            >
                              <Edit size={14} /> Edit
                            </button>
                            {invoice.status === 'Draft' && (
                              <button
                                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', width: '100%', border: 'none', background: 'none', cursor: 'pointer', borderRadius: 4, fontSize: 13, color: '#3b82f6' }}
                                onMouseEnter={(e) => (e.currentTarget.style.background = '#eff6ff')}
                                onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                                onClick={() => setActiveMenu(null)}
                              >
                                <Send size={14} /> Send Invoice
                              </button>
                            )}
                            <button
                              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', width: '100%', border: 'none', background: 'none', cursor: 'pointer', borderRadius: 4, fontSize: 13 }}
                              onMouseEnter={(e) => (e.currentTarget.style.background = '#f8fafc')}
                              onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                              onClick={() => setActiveMenu(null)}
                            >
                              <Download size={14} /> Download PDF
                            </button>
                            <button
                              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', width: '100%', border: 'none', background: 'none', cursor: 'pointer', borderRadius: 4, fontSize: 13, color: '#ef4444' }}
                              onMouseEnter={(e) => (e.currentTarget.style.background = '#fef2f2')}
                              onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                              onClick={() => setActiveMenu(null)}
                            >
                              <Trash2 size={14} /> Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Record Payment Modal */}
      <AnimatePresence>
        {showPaymentModal && paymentInvoice && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowPaymentModal(null)}
          >
            <motion.div
              className="modal"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: 420 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Record Payment</h2>
                <button className="btn btn-secondary" onClick={() => setShowPaymentModal(null)} style={{ padding: 6 }}>
                  <X size={18} />
                </button>
              </div>

              <div style={{ background: '#f8fafc', borderRadius: 8, padding: 16, marginBottom: 20 }}>
                <div style={{ fontSize: 13, color: '#64748b', marginBottom: 4 }}>
                  Invoice {paymentInvoice.invoiceNumber}
                </div>
                <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 8 }}>{paymentInvoice.customer}</div>
                <div className="flex items-center justify-between" style={{ fontSize: 13 }}>
                  <span style={{ color: '#64748b' }}>Invoice Total</span>
                  <span style={{ fontWeight: 600 }}>${paymentInvoice.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex items-center justify-between" style={{ fontSize: 13 }}>
                  <span style={{ color: '#64748b' }}>Already Paid</span>
                  <span style={{ color: '#10b981', fontWeight: 500 }}>${paymentInvoice.paid.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex items-center justify-between" style={{ fontSize: 13, borderTop: '1px solid #e2e8f0', paddingTop: 8, marginTop: 8 }}>
                  <span style={{ fontWeight: 600 }}>Balance Due</span>
                  <span style={{ fontWeight: 700, color: '#ef4444' }}>${paymentInvoice.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>

              <div className="form-group">
                <label>Payment Amount</label>
                <div style={{ position: 'relative' }}>
                  <DollarSign size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input
                    className="input"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    style={{ paddingLeft: 36 }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Payment Method</label>
                <select className="select">
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="credit_card">Credit Card</option>
                  <option value="cash">Cash</option>
                  <option value="check">Check</option>
                  <option value="mobile_money">Mobile Money</option>
                </select>
              </div>

              <div className="form-group">
                <label>Payment Date</label>
                <input className="input" type="date" defaultValue="2024-03-16" />
              </div>

              <div className="flex gap-3" style={{ marginTop: 24 }}>
                <button className="btn btn-secondary" onClick={() => setShowPaymentModal(null)} style={{ flex: 1 }}>
                  Cancel
                </button>
                <button className="btn btn-success" onClick={() => setShowPaymentModal(null)} style={{ flex: 1 }}>
                  <CreditCard size={16} /> Record Payment
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Invoice Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              className="modal"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: 640 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Create Invoice</h2>
                <button className="btn btn-secondary" onClick={() => setShowCreateModal(false)} style={{ padding: 6 }}>
                  <X size={18} />
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label>Customer</label>
                  <select
                    className="select"
                    value={formData.customer}
                    onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                  >
                    <option value="">Select customer...</option>
                    {customerNames.map((name) => (
                      <option key={name} value={name}>{name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Due Date</label>
                  <input
                    className="input"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ marginTop: 20 }}>
                <div className="flex items-center justify-between mb-4">
                  <label style={{ fontWeight: 600, fontSize: 14 }}>Line Items</label>
                  <button className="btn btn-secondary" onClick={addLineItem} style={{ fontSize: 12 }}>
                    <Plus size={14} /> Add Item
                  </button>
                </div>

                {formData.lineItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 mb-4">
                    <input
                      className="input"
                      placeholder="Description"
                      value={item.description}
                      onChange={(e) => updateLineItem(index, 'description', e.target.value)}
                      style={{ flex: 2 }}
                    />
                    <input
                      className="input"
                      placeholder="Qty"
                      type="number"
                      value={item.qty}
                      onChange={(e) => updateLineItem(index, 'qty', e.target.value)}
                      style={{ flex: 0.7 }}
                    />
                    <input
                      className="input"
                      placeholder="Unit Price"
                      type="number"
                      step="0.01"
                      value={item.unitPrice}
                      onChange={(e) => updateLineItem(index, 'unitPrice', e.target.value)}
                      style={{ flex: 0.8 }}
                    />
                    {formData.lineItems.length > 1 && (
                      <button
                        className="btn btn-danger"
                        onClick={() => removeLineItem(index)}
                        style={{ padding: 6, flexShrink: 0 }}
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="form-group" style={{ marginTop: 8 }}>
                <label>Notes</label>
                <textarea
                  className="input"
                  placeholder="Additional notes for the customer..."
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  style={{ resize: 'vertical' }}
                />
              </div>

              <div className="flex gap-3" style={{ marginTop: 24 }}>
                <button className="btn btn-secondary" onClick={() => setShowCreateModal(false)} style={{ flex: 1 }}>
                  Cancel
                </button>
                <button className="btn btn-secondary" onClick={() => setShowCreateModal(false)} style={{ flex: 1 }}>
                  Save as Draft
                </button>
                <button className="btn btn-primary" onClick={() => setShowCreateModal(false)} style={{ flex: 1 }}>
                  <Send size={16} /> Send Invoice
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
