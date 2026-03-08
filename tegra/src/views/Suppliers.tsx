import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  UserCheck,
  Star,
  Clock,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  X,
  Phone,
  Mail,
  Building2,
} from 'lucide-react';

interface Supplier {
  id: string;
  name: string;
  contact: string;
  email: string;
  phone: string;
  paymentTerms: string;
  leadTime: number;
  rating: number;
  status: 'active' | 'inactive' | 'pending';
  category: string;
  address: string;
  totalOrders: number;
  totalSpent: number;
}

const suppliers: Supplier[] = [
  {
    id: 'SUP-001',
    name: 'Global Electronics Corp',
    contact: 'James Whitfield',
    email: 'j.whitfield@globalelec.com',
    phone: '+1 (555) 234-5678',
    paymentTerms: 'Net 30',
    leadTime: 12,
    rating: 5,
    status: 'active',
    category: 'Electronics',
    address: '450 Innovation Drive, San Jose, CA 95134',
    totalOrders: 142,
    totalSpent: 487500,
  },
  {
    id: 'SUP-002',
    name: 'Fresh Farms Distribution',
    contact: 'Maria Gonzalez',
    email: 'm.gonzalez@freshfarms.com',
    phone: '+1 (555) 345-6789',
    paymentTerms: 'Net 15',
    leadTime: 3,
    rating: 4,
    status: 'active',
    category: 'Agriculture',
    address: '820 Harvest Lane, Salinas, CA 93901',
    totalOrders: 256,
    totalSpent: 312000,
  },
  {
    id: 'SUP-003',
    name: 'Pacific Steel Industries',
    contact: 'Robert Chen',
    email: 'r.chen@pacificsteel.com',
    phone: '+1 (555) 456-7890',
    paymentTerms: 'Net 45',
    leadTime: 21,
    rating: 4,
    status: 'active',
    category: 'Metals & Steel',
    address: '1200 Industrial Blvd, Portland, OR 97201',
    totalOrders: 89,
    totalSpent: 925000,
  },
  {
    id: 'SUP-004',
    name: 'BuildRight Materials Co',
    contact: 'Sarah Thompson',
    email: 's.thompson@buildright.com',
    phone: '+1 (555) 567-8901',
    paymentTerms: 'Net 30',
    leadTime: 7,
    rating: 5,
    status: 'active',
    category: 'Building Materials',
    address: '3400 Commerce Park, Dallas, TX 75201',
    totalOrders: 198,
    totalSpent: 1245000,
  },
  {
    id: 'SUP-005',
    name: 'Summit Paint & Coatings',
    contact: 'David Park',
    email: 'd.park@summitpaint.com',
    phone: '+1 (555) 678-9012',
    paymentTerms: 'Net 30',
    leadTime: 10,
    rating: 3,
    status: 'active',
    category: 'Paint & Coatings',
    address: '780 Color Way, Charlotte, NC 28202',
    totalOrders: 67,
    totalSpent: 189000,
  },
  {
    id: 'SUP-006',
    name: 'Precision Fasteners Ltd',
    contact: 'Emily Watson',
    email: 'e.watson@precfast.com',
    phone: '+1 (555) 789-0123',
    paymentTerms: 'Net 60',
    leadTime: 18,
    rating: 4,
    status: 'active',
    category: 'Fasteners & Hardware',
    address: '550 Bolt Street, Detroit, MI 48201',
    totalOrders: 124,
    totalSpent: 156000,
  },
  {
    id: 'SUP-007',
    name: 'Atlas Plumbing Supply',
    contact: 'Michael Brown',
    email: 'm.brown@atlasplumb.com',
    phone: '+1 (555) 890-1234',
    paymentTerms: 'Net 30',
    leadTime: 14,
    rating: 5,
    status: 'active',
    category: 'Plumbing',
    address: '920 Flow Avenue, Houston, TX 77001',
    totalOrders: 176,
    totalSpent: 534000,
  },
  {
    id: 'SUP-008',
    name: 'Northern Timber Group',
    contact: 'Karen Fisher',
    email: 'k.fisher@ntimber.com',
    phone: '+1 (555) 901-2345',
    paymentTerms: 'Net 45',
    leadTime: 25,
    rating: 3,
    status: 'inactive',
    category: 'Timber & Wood',
    address: '1450 Forest Road, Seattle, WA 98101',
    totalOrders: 43,
    totalSpent: 278000,
  },
  {
    id: 'SUP-009',
    name: 'Apex Electrical Wholesale',
    contact: 'Daniel Kim',
    email: 'd.kim@apexelec.com',
    phone: '+1 (555) 012-3456',
    paymentTerms: 'Net 30',
    leadTime: 8,
    rating: 4,
    status: 'active',
    category: 'Electrical',
    address: '670 Volt Circle, Phoenix, AZ 85001',
    totalOrders: 211,
    totalSpent: 672000,
  },
  {
    id: 'SUP-010',
    name: 'SafeGuard Equipment Inc',
    contact: 'Lisa Martinez',
    email: 'l.martinez@safeguard.com',
    phone: '+1 (555) 123-4567',
    paymentTerms: 'Net 15',
    leadTime: 5,
    rating: 5,
    status: 'active',
    category: 'Safety Equipment',
    address: '310 Shield Lane, Denver, CO 80201',
    totalOrders: 93,
    totalSpent: 145000,
  },
];

const statCards = [
  { title: 'Total Suppliers', value: '48', icon: Building2, color: '#3b82f6', bg: '#eff6ff' },
  { title: 'Active', value: '42', icon: UserCheck, color: '#10b981', bg: '#ecfdf5' },
  { title: 'Preferred', value: '12', icon: Star, color: '#f59e0b', bg: '#fffbeb' },
  { title: 'Avg Lead Time', value: '14 days', icon: Clock, color: '#8b5cf6', bg: '#f5f3ff' },
];

const paymentTermsBadge = (terms: string) => {
  const map: Record<string, string> = {
    'Net 15': 'badge-green',
    'Net 30': 'badge-blue',
    'Net 45': 'badge-yellow',
    'Net 60': 'badge-purple',
  };
  return <span className={`badge ${map[terms] || 'badge-gray'}`}>{terms}</span>;
};

const statusBadge = (status: string) => {
  const map: Record<string, { cls: string; label: string }> = {
    active: { cls: 'badge-green', label: 'Active' },
    inactive: { cls: 'badge-gray', label: 'Inactive' },
    pending: { cls: 'badge-yellow', label: 'Pending' },
  };
  const { cls, label } = map[status] || { cls: 'badge-gray', label: status };
  return <span className={`badge ${cls}`}>{label}</span>;
};

const RatingStars = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        size={14}
        fill={star <= rating ? '#f59e0b' : 'none'}
        color={star <= rating ? '#f59e0b' : '#d1d5db'}
        strokeWidth={star <= rating ? 0 : 1.5}
      />
    ))}
  </div>
);

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

export default function Suppliers() {
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    email: '',
    phone: '',
    paymentTerms: 'Net 30',
    leadTime: '',
    category: '',
    address: '',
  });

  const filtered = suppliers.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Suppliers</h1>
          <p style={{ color: '#64748b', fontSize: 14, margin: '4px 0 0' }}>
            Manage your supplier relationships and contacts.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={16} /> Add Supplier
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

      {/* Search & Filters */}
      <div className="card mb-4" style={{ padding: '12px 16px' }}>
        <div className="flex items-center gap-3">
          <div style={{ position: 'relative', flex: 1, maxWidth: 360 }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              className="input"
              placeholder="Search suppliers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: 36, width: '100%' }}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={16} color="#64748b" />
            <select
              className="select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ minWidth: 130 }}
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Supplier Table */}
      <motion.div className="card" custom={4} initial="hidden" animate="visible" variants={cardVariants}>
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>Supplier</th>
                <th>Contact</th>
                <th>Payment Terms</th>
                <th>Lead Time</th>
                <th>Rating</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((supplier) => (
                <tr key={supplier.id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{supplier.name}</div>
                    <div style={{ fontSize: 12, color: '#94a3b8' }}>{supplier.category}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 500 }}>{supplier.contact}</div>
                    <div className="flex items-center gap-2" style={{ fontSize: 12, color: '#94a3b8' }}>
                      <Mail size={11} /> {supplier.email}
                    </div>
                    <div className="flex items-center gap-2" style={{ fontSize: 12, color: '#94a3b8' }}>
                      <Phone size={11} /> {supplier.phone}
                    </div>
                  </td>
                  <td>{paymentTermsBadge(supplier.paymentTerms)}</td>
                  <td style={{ fontWeight: 500 }}>{supplier.leadTime} days</td>
                  <td>
                    <RatingStars rating={supplier.rating} />
                  </td>
                  <td>{statusBadge(supplier.status)}</td>
                  <td>
                    <div style={{ position: 'relative' }}>
                      <button
                        className="btn btn-secondary"
                        style={{ padding: 6 }}
                        onClick={() => setActiveMenu(activeMenu === supplier.id ? null : supplier.id)}
                      >
                        <MoreHorizontal size={16} />
                      </button>
                      {activeMenu === supplier.id && (
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
                            minWidth: 150,
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Add Supplier Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              className="modal"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Add Supplier</h2>
                <button className="btn btn-secondary" onClick={() => setShowModal(false)} style={{ padding: 6 }}>
                  <X size={18} />
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Company Name</label>
                  <input
                    className="input"
                    placeholder="e.g., Acme Supplies Inc"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Contact Person</label>
                  <input
                    className="input"
                    placeholder="Full name"
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Category</label>
                  <select
                    className="select"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="">Select category...</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Building Materials">Building Materials</option>
                    <option value="Metals & Steel">Metals & Steel</option>
                    <option value="Plumbing">Plumbing</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Paint & Coatings">Paint & Coatings</option>
                    <option value="Fasteners & Hardware">Fasteners & Hardware</option>
                    <option value="Timber & Wood">Timber & Wood</option>
                    <option value="Safety Equipment">Safety Equipment</option>
                    <option value="Agriculture">Agriculture</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input
                    className="input"
                    type="email"
                    placeholder="email@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Phone</label>
                  <input
                    className="input"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Payment Terms</label>
                  <select
                    className="select"
                    value={formData.paymentTerms}
                    onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
                  >
                    <option value="Net 15">Net 15</option>
                    <option value="Net 30">Net 30</option>
                    <option value="Net 45">Net 45</option>
                    <option value="Net 60">Net 60</option>
                    <option value="COD">COD</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Lead Time (days)</label>
                  <input
                    className="input"
                    type="number"
                    placeholder="e.g., 14"
                    value={formData.leadTime}
                    onChange={(e) => setFormData({ ...formData, leadTime: e.target.value })}
                  />
                </div>

                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Address</label>
                  <input
                    className="input"
                    placeholder="Full address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex gap-3" style={{ marginTop: 24 }}>
                <button className="btn btn-secondary" onClick={() => setShowModal(false)} style={{ flex: 1 }}>
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={() => setShowModal(false)} style={{ flex: 1 }}>
                  Add Supplier
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
