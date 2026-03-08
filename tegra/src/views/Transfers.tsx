import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeftRight,
  Plus,
  X,
  Check,
  Search,
  Warehouse,
  Store,
  Truck,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  ChevronDown,
  ChevronRight,
  Package,
  User,
  Calendar,
  MapPin,
  Trash2,
} from 'lucide-react';

interface TransferItem {
  id: string;
  productName: string;
  sku: string;
  qty: number;
  status: 'packed' | 'in-transit' | 'received' | 'pending';
}

interface Transfer {
  id: string;
  transferId: string;
  fromLocation: string;
  toLocation: string;
  itemsCount: number;
  status: 'draft' | 'pending' | 'in-transit' | 'received' | 'cancelled';
  requestedBy: string;
  date: string;
  items: TransferItem[];
}

const demoTransfers: Transfer[] = [
  {
    id: '1',
    transferId: 'TRF-2026-0147',
    fromLocation: 'Main Warehouse',
    toLocation: 'Downtown Store',
    itemsCount: 5,
    status: 'in-transit',
    requestedBy: 'James Mwangi',
    date: '2026-03-07',
    items: [
      { id: '1', productName: 'Wireless Bluetooth Headphones', sku: 'ELC-001', qty: 20, status: 'in-transit' },
      { id: '2', productName: 'USB-C Fast Charging Cable 2m', sku: 'ELC-014', qty: 50, status: 'in-transit' },
      { id: '3', productName: 'Dark Chocolate Bar 85% Cocoa', sku: 'FD-041', qty: 100, status: 'in-transit' },
      { id: '4', productName: 'Yoga Mat 6mm Non-Slip', sku: 'SPT-005', qty: 15, status: 'in-transit' },
      { id: '5', productName: 'Insulated Water Bottle 750ml', sku: 'SPT-029', qty: 30, status: 'in-transit' },
    ],
  },
  {
    id: '2',
    transferId: 'TRF-2026-0146',
    fromLocation: 'Main Warehouse',
    toLocation: 'Mall Outlet',
    itemsCount: 3,
    status: 'pending',
    requestedBy: 'Sarah Kimani',
    date: '2026-03-07',
    items: [
      { id: '1', productName: 'Men\'s Cotton Crew T-Shirt', sku: 'CLT-015', qty: 40, status: 'pending' },
      { id: '2', productName: 'Unisex Waterproof Jacket', sku: 'CLT-048', qty: 10, status: 'pending' },
      { id: '3', productName: 'Women\'s Running Leggings', sku: 'CLT-032', qty: 25, status: 'pending' },
    ],
  },
  {
    id: '3',
    transferId: 'TRF-2026-0145',
    fromLocation: 'Downtown Store',
    toLocation: 'Main Warehouse',
    itemsCount: 2,
    status: 'received',
    requestedBy: 'Peter Ochieng',
    date: '2026-03-06',
    items: [
      { id: '1', productName: 'Adjustable Dumbbell Set 20kg', sku: 'SPT-018', qty: 3, status: 'received' },
      { id: '2', productName: 'Stainless Steel Kitchen Scale', sku: 'HM-007', qty: 5, status: 'received' },
    ],
  },
  {
    id: '4',
    transferId: 'TRF-2026-0144',
    fromLocation: 'Main Warehouse',
    toLocation: 'East Side Branch',
    itemsCount: 4,
    status: 'in-transit',
    requestedBy: 'Grace Wambui',
    date: '2026-03-06',
    items: [
      { id: '1', productName: 'Organic Extra Virgin Olive Oil 1L', sku: 'FD-003', qty: 30, status: 'in-transit' },
      { id: '2', productName: 'Premium Basmati Rice 5kg', sku: 'FD-019', qty: 50, status: 'in-transit' },
      { id: '3', productName: 'Dark Chocolate Bar 85% Cocoa', sku: 'FD-041', qty: 80, status: 'in-transit' },
      { id: '4', productName: 'Memory Foam Pillow Set (2pc)', sku: 'HM-022', qty: 12, status: 'in-transit' },
    ],
  },
  {
    id: '5',
    transferId: 'TRF-2026-0143',
    fromLocation: 'Mall Outlet',
    toLocation: 'Downtown Store',
    itemsCount: 2,
    status: 'received',
    requestedBy: 'Daniel Njoroge',
    date: '2026-03-05',
    items: [
      { id: '1', productName: 'Portable Power Bank 20000mAh', sku: 'ELC-027', qty: 8, status: 'received' },
      { id: '2', productName: 'LED Desk Lamp with USB Port', sku: 'HM-038', qty: 6, status: 'received' },
    ],
  },
  {
    id: '6',
    transferId: 'TRF-2026-0142',
    fromLocation: 'Main Warehouse',
    toLocation: 'Airport Road Store',
    itemsCount: 6,
    status: 'received',
    requestedBy: 'James Mwangi',
    date: '2026-03-04',
    items: [
      { id: '1', productName: 'Wireless Bluetooth Headphones', sku: 'ELC-001', qty: 15, status: 'received' },
      { id: '2', productName: 'USB-C Fast Charging Cable 2m', sku: 'ELC-014', qty: 40, status: 'received' },
      { id: '3', productName: 'Men\'s Cotton Crew T-Shirt', sku: 'CLT-015', qty: 30, status: 'received' },
      { id: '4', productName: 'Yoga Mat 6mm Non-Slip', sku: 'SPT-005', qty: 20, status: 'received' },
      { id: '5', productName: 'Insulated Water Bottle 750ml', sku: 'SPT-029', qty: 25, status: 'received' },
      { id: '6', productName: 'Dark Chocolate Bar 85% Cocoa', sku: 'FD-041', qty: 60, status: 'received' },
    ],
  },
  {
    id: '7',
    transferId: 'TRF-2026-0141',
    fromLocation: 'East Side Branch',
    toLocation: 'Main Warehouse',
    itemsCount: 3,
    status: 'pending',
    requestedBy: 'Sarah Kimani',
    date: '2026-03-08',
    items: [
      { id: '1', productName: 'Unisex Waterproof Jacket', sku: 'CLT-048', qty: 5, status: 'pending' },
      { id: '2', productName: 'Adjustable Dumbbell Set 20kg', sku: 'SPT-018', qty: 2, status: 'pending' },
      { id: '3', productName: 'Stainless Steel Kitchen Scale', sku: 'HM-007', qty: 4, status: 'pending' },
    ],
  },
  {
    id: '8',
    transferId: 'TRF-2026-0140',
    fromLocation: 'Main Warehouse',
    toLocation: 'Mall Outlet',
    itemsCount: 4,
    status: 'cancelled',
    requestedBy: 'Peter Ochieng',
    date: '2026-03-03',
    items: [
      { id: '1', productName: 'Organic Extra Virgin Olive Oil 1L', sku: 'FD-003', qty: 20, status: 'pending' },
      { id: '2', productName: 'Premium Basmati Rice 5kg', sku: 'FD-019', qty: 30, status: 'pending' },
      { id: '3', productName: 'Memory Foam Pillow Set (2pc)', sku: 'HM-022', qty: 8, status: 'pending' },
      { id: '4', productName: 'LED Desk Lamp with USB Port', sku: 'HM-038', qty: 10, status: 'pending' },
    ],
  },
  {
    id: '9',
    transferId: 'TRF-2026-0139',
    fromLocation: 'Downtown Store',
    toLocation: 'Airport Road Store',
    itemsCount: 2,
    status: 'draft',
    requestedBy: 'Grace Wambui',
    date: '2026-03-08',
    items: [
      { id: '1', productName: 'Wireless Bluetooth Headphones', sku: 'ELC-001', qty: 10, status: 'pending' },
      { id: '2', productName: 'Portable Power Bank 20000mAh', sku: 'ELC-027', qty: 5, status: 'pending' },
    ],
  },
  {
    id: '10',
    transferId: 'TRF-2026-0138',
    fromLocation: 'Airport Road Store',
    toLocation: 'Mall Outlet',
    itemsCount: 3,
    status: 'received',
    requestedBy: 'Daniel Njoroge',
    date: '2026-03-02',
    items: [
      { id: '1', productName: 'Women\'s Running Leggings', sku: 'CLT-032', qty: 15, status: 'received' },
      { id: '2', productName: 'Men\'s Cotton Crew T-Shirt', sku: 'CLT-015', qty: 20, status: 'received' },
      { id: '3', productName: 'Unisex Waterproof Jacket', sku: 'CLT-048', qty: 8, status: 'received' },
    ],
  },
];

const locations = ['Main Warehouse', 'Downtown Store', 'Mall Outlet', 'East Side Branch', 'Airport Road Store'];

const statusBadge = (status: string) => {
  switch (status) {
    case 'draft': return <span className="badge badge-gray">Draft</span>;
    case 'pending': return <span className="badge badge-yellow">Pending</span>;
    case 'in-transit': return <span className="badge badge-blue">In Transit</span>;
    case 'received': return <span className="badge badge-green">Received</span>;
    case 'cancelled': return <span className="badge badge-red">Cancelled</span>;
    default: return null;
  }
};

const itemStatusBadge = (status: string) => {
  switch (status) {
    case 'packed': return <span className="badge badge-blue">Packed</span>;
    case 'in-transit': return <span className="badge badge-blue">In Transit</span>;
    case 'received': return <span className="badge badge-green">Received</span>;
    case 'pending': return <span className="badge badge-yellow">Pending</span>;
    default: return null;
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

interface NewTransferItem {
  productName: string;
  sku: string;
  qty: number;
}

export default function Transfers() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [fromLocation, setFromLocation] = useState(locations[0]);
  const [toLocation, setToLocation] = useState(locations[1]);
  const [newItems, setNewItems] = useState<NewTransferItem[]>([
    { productName: '', sku: '', qty: 1 },
  ]);
  const [notes, setNotes] = useState('');

  const stats = [
    { title: 'Total Transfers', value: '156', icon: ArrowLeftRight, color: '#3b82f6', bg: '#eff6ff' },
    { title: 'In Transit', value: '12', icon: Truck, color: '#8b5cf6', bg: '#f5f3ff' },
    { title: 'Pending', value: '8', icon: Clock, color: '#f59e0b', bg: '#fffbeb' },
    { title: 'Completed (Month)', value: '136', icon: CheckCircle2, color: '#10b981', bg: '#ecfdf5' },
  ];

  const addNewItem = () => {
    setNewItems([...newItems, { productName: '', sku: '', qty: 1 }]);
  };

  const removeNewItem = (index: number) => {
    setNewItems(newItems.filter((_, i) => i !== index));
  };

  const updateNewItem = (index: number, field: keyof NewTransferItem, value: string | number) => {
    setNewItems(newItems.map((item, i) => i === index ? { ...item, [field]: value } : item));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Transfers</h1>
          <p style={{ color: '#64748b', fontSize: 14, margin: '4px 0 0' }}>
            Manage inter-location inventory transfers
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => { setNewItems([{ productName: '', sku: '', qty: 1 }]); setNotes(''); setShowNewModal(true); }}>
          <Plus size={16} /> New Transfer
        </button>
      </div>

      {/* Stats */}
      <div className="grid-4 mb-6">
        {stats.map((stat, i) => {
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
                <div style={{ width: 40, height: 40, borderRadius: 10, background: stat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={20} color={stat.color} />
                </div>
              </div>
              <div className="value">{stat.value}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Transfers Table */}
      <motion.div className="card" custom={4} initial="hidden" animate="visible" variants={cardVariants}>
        <div className="flex items-center justify-between mb-4">
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Recent Transfers</h3>
          <span style={{ fontSize: 13, color: '#64748b' }}>{demoTransfers.length} transfers</span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th style={{ width: 40 }}></th>
                <th>Transfer ID</th>
                <th>From Location</th>
                <th>To Location</th>
                <th style={{ textAlign: 'right' }}>Items</th>
                <th>Status</th>
                <th>Requested By</th>
                <th>Date</th>
                <th style={{ width: 80 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {demoTransfers.map((transfer) => (
                <>
                  <tr
                    key={transfer.id}
                    onClick={() => setExpandedId(expandedId === transfer.id ? null : transfer.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td>
                      <motion.div
                        animate={{ rotate: expandedId === transfer.id ? 90 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronRight size={16} color="#94a3b8" />
                      </motion.div>
                    </td>
                    <td style={{ fontWeight: 600, fontFamily: 'monospace', fontSize: 13 }}>
                      {transfer.transferId}
                    </td>
                    <td>
                      <span className="flex items-center gap-2">
                        <Warehouse size={14} color="#64748b" />
                        {transfer.fromLocation}
                      </span>
                    </td>
                    <td>
                      <span className="flex items-center gap-2">
                        <Store size={14} color="#64748b" />
                        {transfer.toLocation}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: 500 }}>{transfer.itemsCount}</td>
                    <td>{statusBadge(transfer.status)}</td>
                    <td>{transfer.requestedBy}</td>
                    <td style={{ color: '#64748b', fontSize: 13 }}>{transfer.date}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        {transfer.status === 'pending' && (
                          <button className="btn btn-success" style={{ padding: '4px 8px', fontSize: 12 }} title="Approve">
                            <Check size={13} />
                          </button>
                        )}
                        {transfer.status === 'in-transit' && (
                          <button className="btn btn-primary" style={{ padding: '4px 8px', fontSize: 12 }} title="Mark Received">
                            <Package size={13} />
                          </button>
                        )}
                        {(transfer.status === 'draft' || transfer.status === 'pending') && (
                          <button className="btn btn-danger" style={{ padding: '4px 8px', fontSize: 12 }} title="Cancel">
                            <X size={13} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>

                  {/* Expanded Detail */}
                  <AnimatePresence>
                    {expandedId === transfer.id && (
                      <tr key={`${transfer.id}-detail`}>
                        <td colSpan={9} style={{ padding: 0, border: 'none' }}>
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.25 }}
                            style={{ overflow: 'hidden' }}
                          >
                            <div style={{ background: '#f8fafc', padding: '16px 24px', borderBottom: '1px solid #e2e8f0' }}>
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-4" style={{ fontSize: 13, color: '#64748b' }}>
                                  <span className="flex items-center gap-2">
                                    <MapPin size={14} />
                                    {transfer.fromLocation} &rarr; {transfer.toLocation}
                                  </span>
                                  <span className="flex items-center gap-2">
                                    <User size={14} /> {transfer.requestedBy}
                                  </span>
                                  <span className="flex items-center gap-2">
                                    <Calendar size={14} /> {transfer.date}
                                  </span>
                                </div>
                              </div>
                              <table>
                                <thead>
                                  <tr>
                                    <th>Product</th>
                                    <th>SKU</th>
                                    <th style={{ textAlign: 'right' }}>Quantity</th>
                                    <th>Status</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {transfer.items.map((item) => (
                                    <tr key={item.id}>
                                      <td style={{ fontWeight: 500 }}>{item.productName}</td>
                                      <td style={{ fontFamily: 'monospace', fontSize: 13 }}>{item.sku}</td>
                                      <td style={{ textAlign: 'right', fontWeight: 600 }}>{item.qty}</td>
                                      <td>{itemStatusBadge(item.status)}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </motion.div>
                        </td>
                      </tr>
                    )}
                  </AnimatePresence>
                </>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* New Transfer Modal */}
      <AnimatePresence>
        {showNewModal && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowNewModal(false)}
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
                <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>New Transfer</h2>
                <button className="btn btn-secondary" style={{ padding: '4px 8px' }} onClick={() => setShowNewModal(false)}>
                  <X size={16} />
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label>From Location</label>
                  <select className="select" value={fromLocation} onChange={(e) => setFromLocation(e.target.value)} style={{ width: '100%' }}>
                    {locations.map(l => <option key={l}>{l}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>To Location</label>
                  <select className="select" value={toLocation} onChange={(e) => setToLocation(e.target.value)} style={{ width: '100%' }}>
                    {locations.filter(l => l !== fromLocation).map(l => <option key={l}>{l}</option>)}
                  </select>
                </div>
              </div>

              {fromLocation === toLocation && (
                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: 12, marginTop: 8, fontSize: 13, color: '#dc2626' }}>
                  Source and destination locations must be different.
                </div>
              )}

              <div style={{ marginTop: 20 }}>
                <div className="flex items-center justify-between mb-4">
                  <label style={{ fontWeight: 600, fontSize: 14 }}>Transfer Items</label>
                  <button className="btn btn-secondary" style={{ fontSize: 12 }} onClick={addNewItem}>
                    <Plus size={14} /> Add Item
                  </button>
                </div>

                {newItems.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 mb-4" style={{ padding: 12, background: '#f8fafc', borderRadius: 8 }}>
                    <div style={{ flex: 2 }}>
                      <input
                        className="input"
                        placeholder="Search product..."
                        value={item.productName}
                        onChange={(e) => updateNewItem(idx, 'productName', e.target.value)}
                        style={{ fontSize: 13 }}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <input
                        className="input"
                        placeholder="SKU"
                        value={item.sku}
                        onChange={(e) => updateNewItem(idx, 'sku', e.target.value)}
                        style={{ fontSize: 13 }}
                      />
                    </div>
                    <div style={{ width: 80 }}>
                      <input
                        className="input"
                        type="number"
                        min="1"
                        value={item.qty}
                        onChange={(e) => updateNewItem(idx, 'qty', Number(e.target.value))}
                        style={{ fontSize: 13, textAlign: 'right' }}
                      />
                    </div>
                    <button
                      className="btn btn-secondary"
                      style={{ padding: '6px 8px' }}
                      onClick={() => removeNewItem(idx)}
                      disabled={newItems.length <= 1}
                    >
                      <Trash2 size={14} color={newItems.length <= 1 ? '#cbd5e1' : '#ef4444'} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="form-group" style={{ marginTop: 8 }}>
                <label>Notes (optional)</label>
                <input
                  className="input"
                  placeholder="e.g. Urgent restock for weekend sale"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <div className="flex justify-between" style={{ marginTop: 24, gap: 12 }}>
                <button className="btn btn-secondary" onClick={() => setShowNewModal(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={() => setShowNewModal(false)}>
                  <ArrowLeftRight size={16} /> Create Transfer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
