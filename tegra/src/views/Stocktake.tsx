import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ClipboardList,
  Plus,
  X,
  Check,
  AlertTriangle,
  ChevronRight,
  ChevronDown,
  Warehouse,
  Calendar,
  User,
  BarChart3,
  ArrowLeft,
  Ban,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
} from 'lucide-react';

interface StocktakeItem {
  id: string;
  productName: string;
  sku: string;
  expectedQty: number;
  countedQty: number | null;
  discrepancy: number | null;
  notes: string;
}

interface Stocktake {
  id: string;
  reference: string;
  location: string;
  status: 'draft' | 'in-progress' | 'completed' | 'cancelled';
  startedBy: string;
  startDate: string;
  completedDate: string | null;
  totalItems: number;
  countedItems: number;
  discrepancies: number;
  items: StocktakeItem[];
}

const makeItems = (seed: number): StocktakeItem[] => {
  const allItems: StocktakeItem[][] = [
    [
      { id: '1', productName: 'Wireless Bluetooth Headphones', sku: 'ELC-001', expectedQty: 245, countedQty: 242, discrepancy: -3, notes: '3 units damaged on shelf B4' },
      { id: '2', productName: 'USB-C Fast Charging Cable 2m', sku: 'ELC-014', expectedQty: 520, countedQty: 525, discrepancy: 5, notes: 'Found extra units in back storage' },
      { id: '3', productName: 'Men\'s Cotton Crew T-Shirt', sku: 'CLT-015', expectedQty: 380, countedQty: 380, discrepancy: 0, notes: '' },
      { id: '4', productName: 'Organic Extra Virgin Olive Oil 1L', sku: 'FD-003', expectedQty: 165, countedQty: 158, discrepancy: -7, notes: '4 expired, 3 unaccounted' },
      { id: '5', productName: 'Dark Chocolate Bar 85% Cocoa', sku: 'FD-041', expectedQty: 430, countedQty: 432, discrepancy: 2, notes: '' },
      { id: '6', productName: 'Stainless Steel Kitchen Scale', sku: 'HM-007', expectedQty: 6, countedQty: 6, discrepancy: 0, notes: '' },
      { id: '7', productName: 'Yoga Mat 6mm Non-Slip', sku: 'SPT-005', expectedQty: 175, countedQty: 170, discrepancy: -5, notes: 'Possible theft - notified security' },
      { id: '8', productName: 'Insulated Water Bottle 750ml', sku: 'SPT-029', expectedQty: 310, countedQty: 312, discrepancy: 2, notes: 'Returns not logged in system' },
    ],
    [
      { id: '1', productName: 'Portable Power Bank 20000mAh', sku: 'ELC-027', expectedQty: 12, countedQty: 10, discrepancy: -2, notes: 'Missing from display unit' },
      { id: '2', productName: 'Women\'s Running Leggings', sku: 'CLT-032', expectedQty: 0, countedQty: 0, discrepancy: 0, notes: 'Confirmed out of stock' },
      { id: '3', productName: 'Unisex Waterproof Jacket', sku: 'CLT-048', expectedQty: 8, countedQty: 7, discrepancy: -1, notes: 'One sent as sample' },
      { id: '4', productName: 'Premium Basmati Rice 5kg', sku: 'FD-019', expectedQty: 0, countedQty: 3, discrepancy: 3, notes: 'Late delivery received but not logged' },
      { id: '5', productName: 'Memory Foam Pillow Set (2pc)', sku: 'HM-022', expectedQty: 92, countedQty: 90, discrepancy: -2, notes: '' },
      { id: '6', productName: 'LED Desk Lamp with USB Port', sku: 'HM-038', expectedQty: 0, countedQty: 0, discrepancy: 0, notes: 'Confirmed out of stock' },
      { id: '7', productName: 'Adjustable Dumbbell Set 20kg', sku: 'SPT-018', expectedQty: 4, countedQty: 4, discrepancy: 0, notes: '' },
      { id: '8', productName: 'USB-C Fast Charging Cable 2m', sku: 'ELC-014', expectedQty: 85, countedQty: 88, discrepancy: 3, notes: 'Unreturned demo units found' },
    ],
    [
      { id: '1', productName: 'Wireless Bluetooth Headphones', sku: 'ELC-001', expectedQty: 30, countedQty: null, discrepancy: null, notes: '' },
      { id: '2', productName: 'Men\'s Cotton Crew T-Shirt', sku: 'CLT-015', expectedQty: 55, countedQty: null, discrepancy: null, notes: '' },
      { id: '3', productName: 'Dark Chocolate Bar 85% Cocoa', sku: 'FD-041', expectedQty: 120, countedQty: 118, discrepancy: -2, notes: '' },
      { id: '4', productName: 'Yoga Mat 6mm Non-Slip', sku: 'SPT-005', expectedQty: 45, countedQty: 45, discrepancy: 0, notes: '' },
      { id: '5', productName: 'Organic Extra Virgin Olive Oil 1L', sku: 'FD-003', expectedQty: 28, countedQty: null, discrepancy: null, notes: '' },
      { id: '6', productName: 'Stainless Steel Kitchen Scale', sku: 'HM-007', expectedQty: 12, countedQty: 14, discrepancy: 2, notes: '' },
      { id: '7', productName: 'Portable Power Bank 20000mAh', sku: 'ELC-027', expectedQty: 18, countedQty: null, discrepancy: null, notes: '' },
      { id: '8', productName: 'Insulated Water Bottle 750ml', sku: 'SPT-029', expectedQty: 65, countedQty: null, discrepancy: null, notes: '' },
    ],
    [
      { id: '1', productName: 'USB-C Fast Charging Cable 2m', sku: 'ELC-014', expectedQty: 200, countedQty: 198, discrepancy: -2, notes: '' },
      { id: '2', productName: 'Memory Foam Pillow Set (2pc)', sku: 'HM-022', expectedQty: 35, countedQty: 35, discrepancy: 0, notes: '' },
      { id: '3', productName: 'Women\'s Running Leggings', sku: 'CLT-032', expectedQty: 40, countedQty: 38, discrepancy: -2, notes: 'Size mismatch found' },
      { id: '4', productName: 'Premium Basmati Rice 5kg', sku: 'FD-019', expectedQty: 90, countedQty: 92, discrepancy: 2, notes: '' },
      { id: '5', productName: 'Unisex Waterproof Jacket', sku: 'CLT-048', expectedQty: 15, countedQty: 15, discrepancy: 0, notes: '' },
      { id: '6', productName: 'LED Desk Lamp with USB Port', sku: 'HM-038', expectedQty: 22, countedQty: 20, discrepancy: -2, notes: '2 units returned to vendor' },
      { id: '7', productName: 'Adjustable Dumbbell Set 20kg', sku: 'SPT-018', expectedQty: 8, countedQty: 8, discrepancy: 0, notes: '' },
      { id: '8', productName: 'Dark Chocolate Bar 85% Cocoa', sku: 'FD-041', expectedQty: 150, countedQty: 147, discrepancy: -3, notes: 'Near-expiry items removed' },
    ],
    [
      { id: '1', productName: 'Wireless Bluetooth Headphones', sku: 'ELC-001', expectedQty: 50, countedQty: null, discrepancy: null, notes: '' },
      { id: '2', productName: 'Organic Extra Virgin Olive Oil 1L', sku: 'FD-003', expectedQty: 75, countedQty: null, discrepancy: null, notes: '' },
      { id: '3', productName: 'Yoga Mat 6mm Non-Slip', sku: 'SPT-005', expectedQty: 30, countedQty: null, discrepancy: null, notes: '' },
      { id: '4', productName: 'Men\'s Cotton Crew T-Shirt', sku: 'CLT-015', expectedQty: 100, countedQty: null, discrepancy: null, notes: '' },
      { id: '5', productName: 'Portable Power Bank 20000mAh', sku: 'ELC-027', expectedQty: 20, countedQty: null, discrepancy: null, notes: '' },
      { id: '6', productName: 'Stainless Steel Kitchen Scale', sku: 'HM-007', expectedQty: 10, countedQty: null, discrepancy: null, notes: '' },
      { id: '7', productName: 'Insulated Water Bottle 750ml', sku: 'SPT-029', expectedQty: 40, countedQty: null, discrepancy: null, notes: '' },
      { id: '8', productName: 'Memory Foam Pillow Set (2pc)', sku: 'HM-022', expectedQty: 25, countedQty: null, discrepancy: null, notes: '' },
    ],
  ];
  return allItems[seed] || allItems[0];
};

const demoStocktakes: Stocktake[] = [
  {
    id: '1',
    reference: 'ST-2026-001',
    location: 'Main Warehouse',
    status: 'completed',
    startedBy: 'James Mwangi',
    startDate: '2026-02-15',
    completedDate: '2026-02-16',
    totalItems: 8,
    countedItems: 8,
    discrepancies: 4,
    items: makeItems(0),
  },
  {
    id: '2',
    reference: 'ST-2026-002',
    location: 'Downtown Store',
    status: 'in-progress',
    startedBy: 'Sarah Kimani',
    startDate: '2026-03-05',
    completedDate: null,
    totalItems: 8,
    countedItems: 5,
    discrepancies: 2,
    items: makeItems(1),
  },
  {
    id: '3',
    reference: 'ST-2026-003',
    location: 'Mall Outlet',
    status: 'in-progress',
    startedBy: 'Peter Ochieng',
    startDate: '2026-03-07',
    completedDate: null,
    totalItems: 8,
    countedItems: 3,
    discrepancies: 1,
    items: makeItems(2),
  },
  {
    id: '4',
    reference: 'ST-2026-004',
    location: 'Main Warehouse',
    status: 'cancelled',
    startedBy: 'Grace Wambui',
    startDate: '2026-01-20',
    completedDate: null,
    totalItems: 8,
    countedItems: 8,
    discrepancies: 4,
    items: makeItems(3),
  },
  {
    id: '5',
    reference: 'ST-2026-005',
    location: 'East Side Branch',
    status: 'draft',
    startedBy: 'Daniel Njoroge',
    startDate: '2026-03-08',
    completedDate: null,
    totalItems: 8,
    countedItems: 0,
    discrepancies: 0,
    items: makeItems(4),
  },
];

const locations = ['Main Warehouse', 'Downtown Store', 'Mall Outlet', 'East Side Branch', 'Airport Road Store'];

const statusBadge = (status: string) => {
  switch (status) {
    case 'draft': return <span className="badge badge-gray">Draft</span>;
    case 'in-progress': return <span className="badge badge-blue">In Progress</span>;
    case 'completed': return <span className="badge badge-green">Completed</span>;
    case 'cancelled': return <span className="badge badge-red">Cancelled</span>;
    default: return null;
  }
};

const statusIcon = (status: string) => {
  switch (status) {
    case 'draft': return <FileText size={16} color="#64748b" />;
    case 'in-progress': return <Clock size={16} color="#3b82f6" />;
    case 'completed': return <CheckCircle2 size={16} color="#10b981" />;
    case 'cancelled': return <XCircle size={16} color="#ef4444" />;
    default: return null;
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  }),
};

export default function Stocktake() {
  const [selectedStocktake, setSelectedStocktake] = useState<Stocktake | null>(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [newLocation, setNewLocation] = useState(locations[0]);

  const getAccuracy = (st: Stocktake) => {
    if (st.countedItems === 0) return 0;
    const itemsWithoutDiscrepancy = st.items.filter(i => i.countedQty !== null && i.discrepancy === 0).length;
    return Math.round((itemsWithoutDiscrepancy / st.countedItems) * 100);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Stocktake</h1>
          <p style={{ color: '#64748b', fontSize: 14, margin: '4px 0 0' }}>
            Physical inventory counts and reconciliation
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowNewModal(true)}>
          <Plus size={16} /> New Stocktake
        </button>
      </div>

      {/* Detail View */}
      <AnimatePresence mode="wait">
        {selectedStocktake ? (
          <motion.div
            key="detail"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
          >
            <button
              className="btn btn-secondary mb-4"
              onClick={() => setSelectedStocktake(null)}
            >
              <ArrowLeft size={16} /> Back to Stocktakes
            </button>

            {/* Stocktake Header */}
            <motion.div className="card mb-4" custom={0} initial="hidden" animate="visible" variants={cardVariants}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>{selectedStocktake.reference}</h2>
                    {statusBadge(selectedStocktake.status)}
                  </div>
                  <div className="flex items-center gap-4" style={{ marginTop: 8, fontSize: 13, color: '#64748b' }}>
                    <span className="flex items-center gap-2"><Warehouse size={14} /> {selectedStocktake.location}</span>
                    <span className="flex items-center gap-2"><User size={14} /> {selectedStocktake.startedBy}</span>
                    <span className="flex items-center gap-2"><Calendar size={14} /> {selectedStocktake.startDate}</span>
                  </div>
                </div>
                {selectedStocktake.status === 'in-progress' && (
                  <div className="flex gap-2">
                    <button className="btn btn-danger">
                      <X size={16} /> Cancel
                    </button>
                    <button className="btn btn-success">
                      <Check size={16} /> Apply Adjustments
                    </button>
                  </div>
                )}
                {selectedStocktake.status === 'completed' && (
                  <div className="flex gap-2">
                    <button className="btn btn-secondary">
                      <BarChart3 size={16} /> Export Report
                    </button>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Summary Stats */}
            <div className="grid-4 mb-4">
              {[
                { title: 'Total Items', value: selectedStocktake.totalItems, icon: ClipboardList, color: '#3b82f6', bg: '#eff6ff' },
                { title: 'Counted', value: selectedStocktake.countedItems, icon: Check, color: '#10b981', bg: '#ecfdf5' },
                { title: 'Discrepancies', value: selectedStocktake.discrepancies, icon: AlertTriangle, color: '#f59e0b', bg: '#fffbeb' },
                { title: 'Accuracy', value: `${getAccuracy(selectedStocktake)}%`, icon: BarChart3, color: '#8b5cf6', bg: '#f5f3ff' },
              ].map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <motion.div key={stat.title} className="stat-card" custom={i + 1} initial="hidden" animate="visible" variants={cardVariants}>
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

            {/* Items Table */}
            <motion.div className="card" custom={5} initial="hidden" animate="visible" variants={cardVariants}>
              <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 600 }}>Count Items</h3>
              <div style={{ overflowX: 'auto' }}>
                <table>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>SKU</th>
                      <th style={{ textAlign: 'right' }}>Expected Qty</th>
                      <th style={{ textAlign: 'right' }}>Counted Qty</th>
                      <th style={{ textAlign: 'right' }}>Discrepancy</th>
                      <th>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedStocktake.items.map((item) => (
                      <tr key={item.id}>
                        <td style={{ fontWeight: 500 }}>{item.productName}</td>
                        <td style={{ fontFamily: 'monospace', fontSize: 13 }}>{item.sku}</td>
                        <td style={{ textAlign: 'right' }}>{item.expectedQty}</td>
                        <td style={{ textAlign: 'right', fontWeight: 600 }}>
                          {item.countedQty !== null ? item.countedQty : (
                            <span style={{ color: '#94a3b8', fontWeight: 400, fontStyle: 'italic' }}>Pending</span>
                          )}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          {item.discrepancy !== null ? (
                            <span style={{
                              fontWeight: 600,
                              color: item.discrepancy === 0 ? '#64748b' : item.discrepancy < 0 ? '#dc2626' : '#16a34a',
                            }}>
                              {item.discrepancy === 0 ? '0' : item.discrepancy > 0 ? `+${item.discrepancy}` : item.discrepancy}
                            </span>
                          ) : (
                            <span style={{ color: '#94a3b8' }}>&mdash;</span>
                          )}
                        </td>
                        <td style={{ fontSize: 13, color: '#64748b', maxWidth: 250 }}>{item.notes || <span style={{ color: '#cbd5e1' }}>&mdash;</span>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ duration: 0.3 }}
          >
            {/* Stocktake List */}
            <motion.div className="card" custom={0} initial="hidden" animate="visible" variants={cardVariants}>
              <div className="flex items-center justify-between mb-4">
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>All Stocktakes</h3>
                <span style={{ fontSize: 13, color: '#64748b' }}>{demoStocktakes.length} stocktakes</span>
              </div>

              <table>
                <thead>
                  <tr>
                    <th>Reference</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th>Started By</th>
                    <th>Start Date</th>
                    <th style={{ textAlign: 'right' }}>Items</th>
                    <th style={{ textAlign: 'right' }}>Counted</th>
                    <th style={{ textAlign: 'right' }}>Discrepancies</th>
                    <th style={{ width: 40 }}></th>
                  </tr>
                </thead>
                <tbody>
                  {demoStocktakes.map((st) => (
                    <tr
                      key={st.id}
                      onClick={() => setSelectedStocktake(st)}
                      style={{ cursor: 'pointer' }}
                    >
                      <td>
                        <div className="flex items-center gap-2">
                          {statusIcon(st.status)}
                          <span style={{ fontWeight: 600, fontFamily: 'monospace', fontSize: 13 }}>{st.reference}</span>
                        </div>
                      </td>
                      <td>
                        <span className="flex items-center gap-2">
                          <Warehouse size={14} color="#64748b" /> {st.location}
                        </span>
                      </td>
                      <td>{statusBadge(st.status)}</td>
                      <td>{st.startedBy}</td>
                      <td style={{ color: '#64748b', fontSize: 13 }}>{st.startDate}</td>
                      <td style={{ textAlign: 'right' }}>{st.totalItems}</td>
                      <td style={{ textAlign: 'right', fontWeight: 500 }}>{st.countedItems}</td>
                      <td style={{ textAlign: 'right' }}>
                        {st.discrepancies > 0 ? (
                          <span style={{ color: '#f59e0b', fontWeight: 600 }}>{st.discrepancies}</span>
                        ) : (
                          <span style={{ color: '#94a3b8' }}>0</span>
                        )}
                      </td>
                      <td>
                        <ChevronRight size={16} color="#94a3b8" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* New Stocktake Modal */}
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
              style={{ maxWidth: 480 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>New Stocktake</h2>
                <button className="btn btn-secondary" style={{ padding: '4px 8px' }} onClick={() => setShowNewModal(false)}>
                  <X size={16} />
                </button>
              </div>

              <div className="form-group">
                <label>Location</label>
                <select className="select" value={newLocation} onChange={(e) => setNewLocation(e.target.value)} style={{ width: '100%' }}>
                  {locations.map(l => <option key={l}>{l}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label>Date</label>
                <input className="input" type="date" defaultValue="2026-03-08" />
              </div>

              <div className="form-group">
                <label>Notes (optional)</label>
                <input className="input" placeholder="e.g. Quarterly cycle count" />
              </div>

              <div style={{ background: '#f8fafc', borderRadius: 8, padding: 16, marginTop: 16, fontSize: 13, color: '#64748b' }}>
                <div className="flex items-center gap-2" style={{ marginBottom: 8 }}>
                  <AlertTriangle size={14} color="#f59e0b" />
                  <strong style={{ color: '#0f172a' }}>Note</strong>
                </div>
                All products at the selected location will be included in the stocktake. You can start counting immediately after creation.
              </div>

              <div className="flex justify-between" style={{ marginTop: 24, gap: 12 }}>
                <button className="btn btn-secondary" onClick={() => setShowNewModal(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={() => setShowNewModal(false)}>
                  <Plus size={16} /> Create Stocktake
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
