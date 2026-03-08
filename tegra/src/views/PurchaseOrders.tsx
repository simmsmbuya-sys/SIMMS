import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Clock,
  DollarSign,
  AlertTriangle,
  Plus,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  X,
  Trash2,
  Eye,
  Edit,
} from 'lucide-react';

type POStatus = 'Draft' | 'Submitted' | 'Confirmed' | 'Partially Received' | 'Received' | 'Cancelled';

interface LineItem {
  id: string;
  product: string;
  sku: string;
  qtyOrdered: number;
  qtyReceived: number;
  unitCost: number;
  total: number;
}

interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplier: string;
  location: string;
  items: number;
  total: number;
  status: POStatus;
  expectedDate: string;
  createdDate: string;
  notes: string;
  lineItems: LineItem[];
}

const purchaseOrders: PurchaseOrder[] = [
  {
    id: 'PO-001',
    poNumber: 'PO-2024-0147',
    supplier: 'BuildRight Materials Co',
    location: 'Main Warehouse',
    items: 5,
    total: 34250.00,
    status: 'Confirmed',
    expectedDate: '2024-03-25',
    createdDate: '2024-03-10',
    notes: 'Urgent order for Q1 restock',
    lineItems: [
      { id: 'LI-001', product: 'Portland Cement 50kg', sku: 'BM-CEM-050', qtyOrdered: 200, qtyReceived: 0, unitCost: 12.50, total: 2500.00 },
      { id: 'LI-002', product: 'Roofing Sheet 3m', sku: 'RF-SHT-3MC', qtyOrdered: 150, qtyReceived: 0, unitCost: 65.00, total: 9750.00 },
      { id: 'LI-003', product: 'Concrete Block 200mm', sku: 'BM-BLK-200', qtyOrdered: 500, qtyReceived: 0, unitCost: 3.80, total: 1900.00 },
      { id: 'LI-004', product: 'Tile Adhesive 25kg', sku: 'BM-TIL-025', qtyOrdered: 100, qtyReceived: 0, unitCost: 18.00, total: 1800.00 },
      { id: 'LI-005', product: 'Sand (per ton)', sku: 'BM-SND-TON', qtyOrdered: 50, qtyReceived: 0, unitCost: 366.00, total: 18300.00 },
    ],
  },
  {
    id: 'PO-002',
    poNumber: 'PO-2024-0148',
    supplier: 'Apex Electrical Wholesale',
    location: 'North Branch',
    items: 4,
    total: 18720.00,
    status: 'Partially Received',
    expectedDate: '2024-03-18',
    createdDate: '2024-03-05',
    notes: 'Electrical supplies for March',
    lineItems: [
      { id: 'LI-006', product: 'Copper Wire 2.5mm (100m)', sku: 'EL-CPR-025', qtyOrdered: 80, qtyReceived: 50, unitCost: 48.00, total: 3840.00 },
      { id: 'LI-007', product: 'Circuit Breaker 30A', sku: 'EL-CBR-030', qtyOrdered: 200, qtyReceived: 200, unitCost: 24.00, total: 4800.00 },
      { id: 'LI-008', product: 'LED Panel Light 60W', sku: 'EL-LED-060', qtyOrdered: 100, qtyReceived: 60, unitCost: 85.00, total: 8500.00 },
      { id: 'LI-009', product: 'Extension Cord 10m', sku: 'EL-EXT-010', qtyOrdered: 120, qtyReceived: 120, unitCost: 13.17, total: 1580.00 },
    ],
  },
  {
    id: 'PO-003',
    poNumber: 'PO-2024-0149',
    supplier: 'Pacific Steel Industries',
    location: 'Main Warehouse',
    items: 3,
    total: 52800.00,
    status: 'Submitted',
    expectedDate: '2024-04-05',
    createdDate: '2024-03-12',
    notes: 'Steel order for construction project',
    lineItems: [
      { id: 'LI-010', product: 'Steel Rebar 12mm', sku: 'MT-REB-012', qtyOrdered: 1000, qtyReceived: 0, unitCost: 20.00, total: 20000.00 },
      { id: 'LI-011', product: 'Steel Rebar 16mm', sku: 'MT-REB-016', qtyOrdered: 500, qtyReceived: 0, unitCost: 35.00, total: 17500.00 },
      { id: 'LI-012', product: 'Binding Wire (25kg)', sku: 'MT-BDW-025', qtyOrdered: 60, qtyReceived: 0, unitCost: 255.00, total: 15300.00 },
    ],
  },
  {
    id: 'PO-004',
    poNumber: 'PO-2024-0150',
    supplier: 'Atlas Plumbing Supply',
    location: 'South Branch',
    items: 6,
    total: 8460.00,
    status: 'Received',
    expectedDate: '2024-03-12',
    createdDate: '2024-02-28',
    notes: 'Monthly plumbing restock',
    lineItems: [
      { id: 'LI-013', product: 'PVC Pipe 32mm (6m)', sku: 'PL-PVC-032', qtyOrdered: 100, qtyReceived: 100, unitCost: 14.00, total: 1400.00 },
      { id: 'LI-014', product: '15mm Copper Elbow', sku: 'PL-CPR-015', qtyOrdered: 200, qtyReceived: 200, unitCost: 4.50, total: 900.00 },
      { id: 'LI-015', product: 'Gate Valve 25mm', sku: 'PL-GTV-025', qtyOrdered: 50, qtyReceived: 50, unitCost: 32.00, total: 1600.00 },
      { id: 'LI-016', product: 'Pipe Sealant Tape', sku: 'PL-TPE-012', qtyOrdered: 300, qtyReceived: 300, unitCost: 2.20, total: 660.00 },
      { id: 'LI-017', product: 'Galvanized Pipe 25mm', sku: 'PL-GAL-025', qtyOrdered: 80, qtyReceived: 80, unitCost: 42.00, total: 3360.00 },
      { id: 'LI-018', product: 'Pipe Cutter 42mm', sku: 'PL-CUT-042', qtyOrdered: 10, qtyReceived: 10, unitCost: 54.00, total: 540.00 },
    ],
  },
  {
    id: 'PO-005',
    poNumber: 'PO-2024-0151',
    supplier: 'Summit Paint & Coatings',
    location: 'Main Warehouse',
    items: 3,
    total: 12600.00,
    status: 'Draft',
    expectedDate: '2024-04-10',
    createdDate: '2024-03-15',
    notes: 'Paint supplies Q2 order',
    lineItems: [
      { id: 'LI-019', product: 'Emulsion Paint 20L White', sku: 'PT-EMU-020', qtyOrdered: 80, qtyReceived: 0, unitCost: 90.00, total: 7200.00 },
      { id: 'LI-020', product: 'Gloss Paint 5L Black', sku: 'PT-GLS-005', qtyOrdered: 60, qtyReceived: 0, unitCost: 45.00, total: 2700.00 },
      { id: 'LI-021', product: 'Wood Varnish 5L', sku: 'PT-VRN-005', qtyOrdered: 40, qtyReceived: 0, unitCost: 67.50, total: 2700.00 },
    ],
  },
  {
    id: 'PO-006',
    poNumber: 'PO-2024-0152',
    supplier: 'Precision Fasteners Ltd',
    location: 'North Branch',
    items: 4,
    total: 5640.00,
    status: 'Confirmed',
    expectedDate: '2024-03-28',
    createdDate: '2024-03-08',
    notes: '',
    lineItems: [
      { id: 'LI-022', product: 'M10 Hex Bolts Box/100', sku: 'HW-BLT-M10', qtyOrdered: 50, qtyReceived: 0, unitCost: 28.00, total: 1400.00 },
      { id: 'LI-023', product: 'Wood Screw 4x50mm Box', sku: 'HW-SCR-450', qtyOrdered: 80, qtyReceived: 0, unitCost: 18.00, total: 1440.00 },
      { id: 'LI-024', product: 'Anchor Bolt M12', sku: 'HW-ANC-M12', qtyOrdered: 100, qtyReceived: 0, unitCost: 14.00, total: 1400.00 },
      { id: 'LI-025', product: 'Nail 4 inch (5kg)', sku: 'HW-NAL-004', qtyOrdered: 40, qtyReceived: 0, unitCost: 35.00, total: 1400.00 },
    ],
  },
  {
    id: 'PO-007',
    poNumber: 'PO-2024-0153',
    supplier: 'Fresh Farms Distribution',
    location: 'South Branch',
    items: 2,
    total: 3200.00,
    status: 'Cancelled',
    expectedDate: '2024-03-14',
    createdDate: '2024-03-01',
    notes: 'Cancelled - incorrect pricing',
    lineItems: [
      { id: 'LI-026', product: 'Garden Fertilizer 25kg', sku: 'AG-FRT-025', qtyOrdered: 100, qtyReceived: 0, unitCost: 22.00, total: 2200.00 },
      { id: 'LI-027', product: 'Potting Soil 50L', sku: 'AG-SOL-050', qtyOrdered: 100, qtyReceived: 0, unitCost: 10.00, total: 1000.00 },
    ],
  },
  {
    id: 'PO-008',
    poNumber: 'PO-2024-0154',
    supplier: 'SafeGuard Equipment Inc',
    location: 'Main Warehouse',
    items: 5,
    total: 7850.00,
    status: 'Submitted',
    expectedDate: '2024-03-22',
    createdDate: '2024-03-13',
    notes: 'Safety equipment replenishment',
    lineItems: [
      { id: 'LI-028', product: 'Safety Helmet Yellow', sku: 'SF-HLM-YLW', qtyOrdered: 50, qtyReceived: 0, unitCost: 25.00, total: 1250.00 },
      { id: 'LI-029', product: 'Safety Goggles', sku: 'SF-GOG-001', qtyOrdered: 100, qtyReceived: 0, unitCost: 12.00, total: 1200.00 },
      { id: 'LI-030', product: 'Hi-Vis Vest Orange', sku: 'SF-VST-ORG', qtyOrdered: 80, qtyReceived: 0, unitCost: 18.00, total: 1440.00 },
      { id: 'LI-031', product: 'Work Gloves (pair)', sku: 'SF-GLV-001', qtyOrdered: 200, qtyReceived: 0, unitCost: 8.00, total: 1600.00 },
      { id: 'LI-032', product: 'Steel Toe Boots', sku: 'SF-BTS-STL', qtyOrdered: 30, qtyReceived: 0, unitCost: 78.67, total: 2360.00 },
    ],
  },
  {
    id: 'PO-009',
    poNumber: 'PO-2024-0155',
    supplier: 'Global Electronics Corp',
    location: 'North Branch',
    items: 3,
    total: 14500.00,
    status: 'Draft',
    expectedDate: '2024-04-15',
    createdDate: '2024-03-15',
    notes: 'Electronics for new display area',
    lineItems: [
      { id: 'LI-033', product: 'Smart Thermostat', sku: 'EL-SMT-001', qtyOrdered: 25, qtyReceived: 0, unitCost: 180.00, total: 4500.00 },
      { id: 'LI-034', product: 'Security Camera Kit', sku: 'EL-CAM-004', qtyOrdered: 20, qtyReceived: 0, unitCost: 350.00, total: 7000.00 },
      { id: 'LI-035', product: 'Motion Sensor Light', sku: 'EL-MSL-002', qtyOrdered: 50, qtyReceived: 0, unitCost: 60.00, total: 3000.00 },
    ],
  },
  {
    id: 'PO-010',
    poNumber: 'PO-2024-0156',
    supplier: 'Northern Timber Group',
    location: 'Main Warehouse',
    items: 3,
    total: 22400.00,
    status: 'Confirmed',
    expectedDate: '2024-04-02',
    createdDate: '2024-03-09',
    notes: 'Timber order for March/April',
    lineItems: [
      { id: 'LI-036', product: 'Pine Plank 2x4 (3m)', sku: 'TM-PLK-243', qtyOrdered: 300, qtyReceived: 0, unitCost: 28.00, total: 8400.00 },
      { id: 'LI-037', product: 'Plywood 18mm (4x8)', sku: 'TM-PLY-018', qtyOrdered: 100, qtyReceived: 0, unitCost: 85.00, total: 8500.00 },
      { id: 'LI-038', product: 'Hardwood Decking (3m)', sku: 'TM-DCK-003', qtyOrdered: 50, qtyReceived: 0, unitCost: 110.00, total: 5500.00 },
    ],
  },
];

const statCards = [
  { title: 'Open POs', value: '23', icon: FileText, color: '#3b82f6', bg: '#eff6ff' },
  { title: 'Pending Approval', value: '5', icon: Clock, color: '#f59e0b', bg: '#fffbeb' },
  { title: 'Total Value', value: '$145,000', icon: DollarSign, color: '#10b981', bg: '#ecfdf5' },
  { title: 'Overdue', value: '3', icon: AlertTriangle, color: '#ef4444', bg: '#fef2f2' },
];

const statusBadgeClass = (status: POStatus): string => {
  const map: Record<POStatus, string> = {
    Draft: 'badge-gray',
    Submitted: 'badge-blue',
    Confirmed: 'badge-purple',
    'Partially Received': 'badge-yellow',
    Received: 'badge-green',
    Cancelled: 'badge-red',
  };
  return map[status];
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  }),
};

const supplierNames = [
  'BuildRight Materials Co',
  'Apex Electrical Wholesale',
  'Pacific Steel Industries',
  'Atlas Plumbing Supply',
  'Summit Paint & Coatings',
  'Precision Fasteners Ltd',
  'Fresh Farms Distribution',
  'SafeGuard Equipment Inc',
  'Global Electronics Corp',
  'Northern Timber Group',
];

const locationOptions = ['Main Warehouse', 'North Branch', 'South Branch', 'East Distribution Center'];

export default function PurchaseOrders() {
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedPO, setExpandedPO] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    supplier: '',
    location: '',
    notes: '',
    lineItems: [{ product: '', qty: '', unitCost: '' }],
  });

  const filtered = purchaseOrders.filter((po) => {
    const matchesSearch =
      po.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      po.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || po.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const addLineItem = () => {
    setFormData({
      ...formData,
      lineItems: [...formData.lineItems, { product: '', qty: '', unitCost: '' }],
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

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Purchase Orders</h1>
          <p style={{ color: '#64748b', fontSize: 14, margin: '4px 0 0' }}>
            Create and manage purchase orders with suppliers.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={16} /> Create PO
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
              placeholder="Search PO number or supplier..."
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
              style={{ minWidth: 160 }}
            >
              <option value="all">All Statuses</option>
              <option value="Draft">Draft</option>
              <option value="Submitted">Submitted</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Partially Received">Partially Received</option>
              <option value="Received">Received</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* PO Table */}
      <motion.div className="card" custom={4} initial="hidden" animate="visible" variants={cardVariants}>
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th style={{ width: 30 }}></th>
                <th>PO Number</th>
                <th>Supplier</th>
                <th>Location</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Expected Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((po) => (
                <>
                  <tr key={po.id} style={{ cursor: 'pointer' }} onClick={() => setExpandedPO(expandedPO === po.id ? null : po.id)}>
                    <td>
                      {expandedPO === po.id ? (
                        <ChevronUp size={16} color="#64748b" />
                      ) : (
                        <ChevronDown size={16} color="#64748b" />
                      )}
                    </td>
                    <td style={{ fontWeight: 600, fontFamily: 'monospace', fontSize: 13 }}>{po.poNumber}</td>
                    <td style={{ fontWeight: 500 }}>{po.supplier}</td>
                    <td style={{ fontSize: 13 }}>{po.location}</td>
                    <td>{po.items}</td>
                    <td style={{ fontWeight: 600 }}>${po.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                    <td>
                      <span className={`badge ${statusBadgeClass(po.status)}`}>{po.status}</span>
                    </td>
                    <td style={{ fontSize: 13 }}>{po.expectedDate}</td>
                    <td>
                      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <button className="btn btn-secondary" style={{ padding: 6 }}>
                          <Eye size={14} />
                        </button>
                        <button className="btn btn-secondary" style={{ padding: 6 }}>
                          <Edit size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                  {expandedPO === po.id && (
                    <tr key={`${po.id}-detail`}>
                      <td colSpan={9} style={{ padding: 0 }}>
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          style={{ background: '#f8fafc', padding: '16px 24px' }}
                        >
                          <div className="flex items-center justify-between mb-4">
                            <h4 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#334155' }}>Line Items</h4>
                            {po.notes && (
                              <span style={{ fontSize: 12, color: '#64748b', fontStyle: 'italic' }}>Note: {po.notes}</span>
                            )}
                          </div>
                          <table>
                            <thead>
                              <tr>
                                <th>Product</th>
                                <th>SKU</th>
                                <th>Qty Ordered</th>
                                <th>Qty Received</th>
                                <th>Unit Cost</th>
                                <th>Total</th>
                              </tr>
                            </thead>
                            <tbody>
                              {po.lineItems.map((item) => (
                                <tr key={item.id}>
                                  <td style={{ fontWeight: 500 }}>{item.product}</td>
                                  <td style={{ fontFamily: 'monospace', fontSize: 12 }}>{item.sku}</td>
                                  <td>{item.qtyOrdered}</td>
                                  <td>
                                    <span style={{ color: item.qtyReceived === item.qtyOrdered ? '#10b981' : item.qtyReceived > 0 ? '#f59e0b' : '#94a3b8', fontWeight: 500 }}>
                                      {item.qtyReceived}
                                    </span>
                                  </td>
                                  <td>${item.unitCost.toFixed(2)}</td>
                                  <td style={{ fontWeight: 600 }}>${item.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
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
        </div>
      </motion.div>

      {/* Create PO Modal */}
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
              style={{ maxWidth: 640 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Create Purchase Order</h2>
                <button className="btn btn-secondary" onClick={() => setShowModal(false)} style={{ padding: 6 }}>
                  <X size={18} />
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label>Supplier</label>
                  <select
                    className="select"
                    value={formData.supplier}
                    onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                  >
                    <option value="">Select supplier...</option>
                    {supplierNames.map((name) => (
                      <option key={name} value={name}>{name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Delivery Location</label>
                  <select
                    className="select"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  >
                    <option value="">Select location...</option>
                    {locationOptions.map((loc) => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
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
                      placeholder="Product name"
                      value={item.product}
                      onChange={(e) => updateLineItem(index, 'product', e.target.value)}
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
                      placeholder="Unit Cost"
                      type="number"
                      step="0.01"
                      value={item.unitCost}
                      onChange={(e) => updateLineItem(index, 'unitCost', e.target.value)}
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
                  placeholder="Additional notes..."
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  style={{ resize: 'vertical' }}
                />
              </div>

              <div className="flex gap-3" style={{ marginTop: 24 }}>
                <button className="btn btn-secondary" onClick={() => setShowModal(false)} style={{ flex: 1 }}>
                  Cancel
                </button>
                <button className="btn btn-secondary" onClick={() => setShowModal(false)} style={{ flex: 1 }}>
                  Save as Draft
                </button>
                <button className="btn btn-primary" onClick={() => setShowModal(false)} style={{ flex: 1 }}>
                  Submit PO
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
