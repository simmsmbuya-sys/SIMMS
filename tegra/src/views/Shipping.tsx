import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Truck,
  ArrowUpRight,
  ArrowDownLeft,
  ArrowLeftRight,
  Package,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Search,
  Filter,
  X,
  MapPin,
  Calendar,
  DollarSign,
} from 'lucide-react';

type ShipmentType = 'Outbound' | 'Inbound' | 'Transfer';
type ShipmentStatus = 'Preparing' | 'Shipped' | 'In Transit' | 'Out for Delivery' | 'Delivered' | 'Delayed' | 'Cancelled';

interface Shipment {
  id: string;
  trackingNumber: string;
  type: ShipmentType;
  carrier: string;
  from: string;
  to: string;
  status: ShipmentStatus;
  estimatedDelivery: string;
  cost: number;
  weight: string;
  items: number;
  createdDate: string;
}

const shipments: Shipment[] = [
  {
    id: 'SHP-001',
    trackingNumber: 'FX-7842931056',
    type: 'Outbound',
    carrier: 'FedEx',
    from: 'Main Warehouse',
    to: 'Greenfield Hardware Ltd, Chicago, IL',
    status: 'In Transit',
    estimatedDelivery: '2024-03-20',
    cost: 245.50,
    weight: '128 kg',
    items: 8,
    createdDate: '2024-03-15',
  },
  {
    id: 'SHP-002',
    trackingNumber: 'UP-1Z9X84R20392847',
    type: 'Inbound',
    carrier: 'UPS',
    from: 'Pacific Steel Industries, Portland, OR',
    to: 'Main Warehouse',
    status: 'Shipped',
    estimatedDelivery: '2024-03-22',
    cost: 890.00,
    weight: '2,450 kg',
    items: 3,
    createdDate: '2024-03-14',
  },
  {
    id: 'SHP-003',
    trackingNumber: 'DH-4829301847562',
    type: 'Outbound',
    carrier: 'DHL',
    from: 'Main Warehouse',
    to: 'Metro Construction Co., Denver, CO',
    status: 'Delivered',
    estimatedDelivery: '2024-03-16',
    cost: 512.75,
    weight: '340 kg',
    items: 15,
    createdDate: '2024-03-12',
  },
  {
    id: 'SHP-004',
    trackingNumber: 'US-9402109206839471852',
    type: 'Outbound',
    carrier: 'USPS',
    from: 'North Branch',
    to: 'Valley Farm Equipment, Sacramento, CA',
    status: 'Out for Delivery',
    estimatedDelivery: '2024-03-17',
    cost: 38.90,
    weight: '12 kg',
    items: 5,
    createdDate: '2024-03-14',
  },
  {
    id: 'SHP-005',
    trackingNumber: 'FX-7842931089',
    type: 'Inbound',
    carrier: 'FedEx',
    from: 'Global Electronics Corp, San Jose, CA',
    to: 'North Branch',
    status: 'In Transit',
    estimatedDelivery: '2024-03-19',
    cost: 185.00,
    weight: '45 kg',
    items: 25,
    createdDate: '2024-03-13',
  },
  {
    id: 'SHP-006',
    trackingNumber: 'UP-1Z9X84R20392901',
    type: 'Transfer',
    carrier: 'Internal Fleet',
    from: 'Main Warehouse',
    to: 'South Branch',
    status: 'Preparing',
    estimatedDelivery: '2024-03-18',
    cost: 120.00,
    weight: '560 kg',
    items: 42,
    createdDate: '2024-03-16',
  },
  {
    id: 'SHP-007',
    trackingNumber: 'DH-4829301847601',
    type: 'Outbound',
    carrier: 'DHL',
    from: 'Main Warehouse',
    to: 'Apex Electrical Distributors, Phoenix, AZ',
    status: 'Delayed',
    estimatedDelivery: '2024-03-15',
    cost: 324.00,
    weight: '198 kg',
    items: 22,
    createdDate: '2024-03-10',
  },
  {
    id: 'SHP-008',
    trackingNumber: 'FX-7842931102',
    type: 'Inbound',
    carrier: 'FedEx',
    from: 'SafeGuard Equipment Inc, Denver, CO',
    to: 'Main Warehouse',
    status: 'Delivered',
    estimatedDelivery: '2024-03-16',
    cost: 156.25,
    weight: '78 kg',
    items: 5,
    createdDate: '2024-03-11',
  },
  {
    id: 'SHP-009',
    trackingNumber: 'UP-1Z9X84R20392955',
    type: 'Outbound',
    carrier: 'UPS',
    from: 'South Branch',
    to: 'Sunrise Plumbing Supplies, Houston, TX',
    status: 'In Transit',
    estimatedDelivery: '2024-03-21',
    cost: 278.50,
    weight: '215 kg',
    items: 3,
    createdDate: '2024-03-15',
  },
  {
    id: 'SHP-010',
    trackingNumber: 'TRF-INT-20240317-001',
    type: 'Transfer',
    carrier: 'Internal Fleet',
    from: 'North Branch',
    to: 'Main Warehouse',
    status: 'In Transit',
    estimatedDelivery: '2024-03-17',
    cost: 85.00,
    weight: '310 kg',
    items: 18,
    createdDate: '2024-03-16',
  },
  {
    id: 'SHP-011',
    trackingNumber: 'DH-4829301847655',
    type: 'Inbound',
    carrier: 'DHL',
    from: 'Summit Paint & Coatings, Charlotte, NC',
    to: 'Main Warehouse',
    status: 'Delayed',
    estimatedDelivery: '2024-03-14',
    cost: 420.00,
    weight: '890 kg',
    items: 3,
    createdDate: '2024-03-08',
  },
  {
    id: 'SHP-012',
    trackingNumber: 'US-9402109206839471920',
    type: 'Outbound',
    carrier: 'USPS',
    from: 'Main Warehouse',
    to: 'HomeBuilder Direct, Atlanta, GA',
    status: 'Delivered',
    estimatedDelivery: '2024-03-16',
    cost: 52.30,
    weight: '18 kg',
    items: 2,
    createdDate: '2024-03-13',
  },
];

const statCards = [
  { title: 'Active Shipments', value: '34', icon: Truck, color: '#3b82f6', bg: '#eff6ff' },
  { title: 'In Transit', value: '18', icon: Package, color: '#8b5cf6', bg: '#f5f3ff' },
  { title: 'Delivered Today', value: '7', icon: CheckCircle2, color: '#10b981', bg: '#ecfdf5' },
  { title: 'Delayed', value: '3', icon: AlertTriangle, color: '#ef4444', bg: '#fef2f2' },
];

const typeBadge = (type: ShipmentType) => {
  const map: Record<ShipmentType, { cls: string; icon: React.ReactNode }> = {
    Outbound: { cls: 'badge-blue', icon: <ArrowUpRight size={12} /> },
    Inbound: { cls: 'badge-green', icon: <ArrowDownLeft size={12} /> },
    Transfer: { cls: 'badge-purple', icon: <ArrowLeftRight size={12} /> },
  };
  const { cls, icon } = map[type];
  return (
    <span className={`badge ${cls}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
      {icon} {type}
    </span>
  );
};

const statusBadge = (status: ShipmentStatus) => {
  const map: Record<ShipmentStatus, string> = {
    Preparing: 'badge-gray',
    Shipped: 'badge-blue',
    'In Transit': 'badge-purple',
    'Out for Delivery': 'badge-yellow',
    Delivered: 'badge-green',
    Delayed: 'badge-red',
    Cancelled: 'badge-gray',
  };
  return <span className={`badge ${map[status]}`}>{status}</span>;
};

const timelineSteps = ['Preparing', 'Shipped', 'In Transit', 'Delivered'];

const StatusTimeline = ({ currentStatus }: { currentStatus: ShipmentStatus }) => {
  const activeIndex = currentStatus === 'Delayed'
    ? 2
    : currentStatus === 'Out for Delivery'
    ? 2
    : timelineSteps.indexOf(currentStatus);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0, padding: '16px 0' }}>
      {timelineSteps.map((step, i) => {
        const isCompleted = i <= activeIndex;
        const isActive = i === activeIndex;
        const isDelayed = currentStatus === 'Delayed' && i === activeIndex;
        return (
          <div key={step} style={{ display: 'flex', alignItems: 'center', flex: i < timelineSteps.length - 1 ? 1 : 'none' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: isDelayed ? '#fef2f2' : isCompleted ? '#ecfdf5' : '#f1f5f9',
                  border: `2px solid ${isDelayed ? '#ef4444' : isCompleted ? '#10b981' : '#cbd5e1'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {isDelayed ? (
                  <AlertTriangle size={12} color="#ef4444" />
                ) : isCompleted ? (
                  <CheckCircle2 size={12} color="#10b981" />
                ) : (
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#cbd5e1' }} />
                )}
              </div>
              <span style={{ fontSize: 11, color: isActive ? (isDelayed ? '#ef4444' : '#10b981') : '#94a3b8', fontWeight: isActive ? 600 : 400, whiteSpace: 'nowrap' }}>
                {isDelayed ? 'Delayed' : step}
              </span>
            </div>
            {i < timelineSteps.length - 1 && (
              <div
                style={{
                  flex: 1,
                  height: 2,
                  background: i < activeIndex ? '#10b981' : '#e2e8f0',
                  marginBottom: 22,
                  minWidth: 40,
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  }),
};

const carrierOptions = ['FedEx', 'UPS', 'DHL', 'USPS', 'Internal Fleet'];
const locationOptions = ['Main Warehouse', 'North Branch', 'South Branch', 'East Distribution Center'];

export default function Shipping() {
  const [activeTab, setActiveTab] = useState<'All' | 'Outbound' | 'Inbound' | 'Transfers'>('All');
  const [showModal, setShowModal] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    type: 'Outbound' as ShipmentType,
    carrier: '',
    from: '',
    to: '',
    estimatedDelivery: '',
    notes: '',
  });

  const tabs = ['All', 'Outbound', 'Inbound', 'Transfers'] as const;

  const filtered = shipments.filter((s) => {
    const matchesTab =
      activeTab === 'All' ||
      (activeTab === 'Transfers' ? s.type === 'Transfer' : s.type === activeTab);
    const matchesSearch =
      s.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.carrier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.to.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.from.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const selected = shipments.find((s) => s.id === selectedShipment);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Shipping</h1>
          <p style={{ color: '#64748b', fontSize: 14, margin: '4px 0 0' }}>
            Track and manage all shipments and deliveries.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={16} /> Create Shipment
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

      {/* Tabs */}
      <div className="tabs mb-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'Outbound' && <ArrowUpRight size={16} />}
            {tab === 'Inbound' && <ArrowDownLeft size={16} />}
            {tab === 'Transfers' && <ArrowLeftRight size={16} />}
            {tab === 'All' && <Package size={16} />}
            {tab}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="card mb-4" style={{ padding: '12px 16px' }}>
        <div style={{ position: 'relative', maxWidth: 400 }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            className="input"
            placeholder="Search tracking number, carrier, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: 36, width: '100%' }}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selectedShipment ? '1fr 380px' : '1fr', gap: 20 }}>
        {/* Shipment Table */}
        <motion.div className="card" custom={4} initial="hidden" animate="visible" variants={cardVariants}>
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>Tracking #</th>
                  <th>Type</th>
                  <th>Carrier</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Status</th>
                  <th>Est. Delivery</th>
                  <th>Cost</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((shipment) => (
                  <tr
                    key={shipment.id}
                    style={{
                      cursor: 'pointer',
                      background: selectedShipment === shipment.id ? '#f8fafc' : undefined,
                    }}
                    onClick={() => setSelectedShipment(selectedShipment === shipment.id ? null : shipment.id)}
                  >
                    <td style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 600 }}>{shipment.trackingNumber}</td>
                    <td>{typeBadge(shipment.type)}</td>
                    <td style={{ fontWeight: 500 }}>{shipment.carrier}</td>
                    <td style={{ fontSize: 13, maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {shipment.from}
                    </td>
                    <td style={{ fontSize: 13, maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {shipment.to}
                    </td>
                    <td>{statusBadge(shipment.status)}</td>
                    <td style={{ fontSize: 13 }}>{shipment.estimatedDelivery}</td>
                    <td style={{ fontWeight: 600 }}>${shipment.cost.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Selected Shipment Detail */}
        <AnimatePresence>
          {selected && (
            <motion.div
              className="card"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              style={{ padding: 24, alignSelf: 'start' }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Shipment Details</h3>
                <button
                  className="btn btn-secondary"
                  style={{ padding: 4 }}
                  onClick={() => setSelectedShipment(null)}
                >
                  <X size={16} />
                </button>
              </div>

              <div style={{ marginBottom: 16 }}>
                {typeBadge(selected.type)}
                <span style={{ marginLeft: 8 }}>{statusBadge(selected.status)}</span>
              </div>

              <StatusTimeline currentStatus={selected.status} />

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, fontSize: 13, marginTop: 8 }}>
                <div className="flex items-center gap-2">
                  <Truck size={14} color="#64748b" />
                  <span style={{ color: '#64748b', minWidth: 80 }}>Carrier</span>
                  <span style={{ fontWeight: 500 }}>{selected.carrier}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={14} color="#64748b" />
                  <span style={{ color: '#64748b', minWidth: 80 }}>From</span>
                  <span style={{ fontWeight: 500, fontSize: 12 }}>{selected.from}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={14} color="#64748b" />
                  <span style={{ color: '#64748b', minWidth: 80 }}>To</span>
                  <span style={{ fontWeight: 500, fontSize: 12 }}>{selected.to}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={14} color="#64748b" />
                  <span style={{ color: '#64748b', minWidth: 80 }}>Est. Delivery</span>
                  <span style={{ fontWeight: 500 }}>{selected.estimatedDelivery}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Package size={14} color="#64748b" />
                  <span style={{ color: '#64748b', minWidth: 80 }}>Items</span>
                  <span style={{ fontWeight: 500 }}>{selected.items} items ({selected.weight})</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign size={14} color="#64748b" />
                  <span style={{ color: '#64748b', minWidth: 80 }}>Cost</span>
                  <span style={{ fontWeight: 600 }}>${selected.cost.toFixed(2)}</span>
                </div>
              </div>

              <div style={{ borderTop: '1px solid #e2e8f0', marginTop: 20, paddingTop: 16 }}>
                <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#94a3b8', wordBreak: 'break-all' }}>
                  Tracking: {selected.trackingNumber}
                </div>
                <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>
                  Created: {selected.createdDate}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Create Shipment Modal */}
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
                <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Create Shipment</h2>
                <button className="btn btn-secondary" onClick={() => setShowModal(false)} style={{ padding: 6 }}>
                  <X size={18} />
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label>Shipment Type</label>
                  <select
                    className="select"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as ShipmentType })}
                  >
                    <option value="Outbound">Outbound</option>
                    <option value="Inbound">Inbound</option>
                    <option value="Transfer">Transfer</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Carrier</label>
                  <select
                    className="select"
                    value={formData.carrier}
                    onChange={(e) => setFormData({ ...formData, carrier: e.target.value })}
                  >
                    <option value="">Select carrier...</option>
                    {carrierOptions.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Ship From</label>
                  <select
                    className="select"
                    value={formData.from}
                    onChange={(e) => setFormData({ ...formData, from: e.target.value })}
                  >
                    <option value="">Select origin...</option>
                    {locationOptions.map((l) => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Ship To</label>
                  <input
                    className="input"
                    placeholder="Destination address or location"
                    value={formData.to}
                    onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Estimated Delivery</label>
                  <input
                    className="input"
                    type="date"
                    value={formData.estimatedDelivery}
                    onChange={(e) => setFormData({ ...formData, estimatedDelivery: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginTop: 8 }}>
                <label>Notes</label>
                <textarea
                  className="input"
                  placeholder="Additional shipping instructions..."
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
                <button className="btn btn-primary" onClick={() => setShowModal(false)} style={{ flex: 1 }}>
                  Create Shipment
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
