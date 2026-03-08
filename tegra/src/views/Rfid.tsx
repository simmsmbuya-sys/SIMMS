import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Radio,
  Wifi,
  Smartphone,
  Router,
  Plus,
  Search,
  Signal,
  SignalHigh,
  SignalMedium,
  SignalLow,
  Activity,
  AlertCircle,
  CheckCircle2,
  Wrench,
  X,
  RefreshCw,
} from 'lucide-react';

type DeviceType = 'USB Reader' | 'Fixed Reader' | 'Handheld' | 'Gateway';
type DeviceStatus = 'active' | 'inactive' | 'maintenance';

interface RfidDevice {
  id: string;
  name: string;
  type: DeviceType;
  serialNumber: string;
  location: string;
  status: DeviceStatus;
  lastSeen: string;
  signalStrength: number;
  firmwareVersion: string;
  tagsRead: number;
}

interface ScanEntry {
  id: string;
  timestamp: string;
  device: string;
  tagId: string;
  product: string | null;
  sku: string | null;
  location: string;
  signalStrength: number;
}

const devices: RfidDevice[] = [
  {
    id: 'RFID-001',
    name: 'Warehouse Gate A',
    type: 'Fixed Reader',
    serialNumber: 'IMP-R700-2024-00147',
    location: 'Main Warehouse - Entry',
    status: 'active',
    lastSeen: '2 min ago',
    signalStrength: 95,
    firmwareVersion: 'v3.4.1',
    tagsRead: 14832,
  },
  {
    id: 'RFID-002',
    name: 'Dock Scanner B3',
    type: 'Fixed Reader',
    serialNumber: 'IMP-R700-2024-00163',
    location: 'Loading Dock B',
    status: 'active',
    lastSeen: '1 min ago',
    signalStrength: 88,
    firmwareVersion: 'v3.4.1',
    tagsRead: 9241,
  },
  {
    id: 'RFID-003',
    name: 'Handheld Unit #5',
    type: 'Handheld',
    serialNumber: 'ZBR-MC33-2023-08412',
    location: 'Aisle 4 - Electronics',
    status: 'active',
    lastSeen: '5 min ago',
    signalStrength: 72,
    firmwareVersion: 'v2.8.0',
    tagsRead: 3567,
  },
  {
    id: 'RFID-004',
    name: 'Desktop Reader #2',
    type: 'USB Reader',
    serialNumber: 'TSL-1128-2024-03291',
    location: 'Receiving Office',
    status: 'active',
    lastSeen: 'Just now',
    signalStrength: 100,
    firmwareVersion: 'v1.2.4',
    tagsRead: 6218,
  },
  {
    id: 'RFID-005',
    name: 'IoT Gateway North',
    type: 'Gateway',
    serialNumber: 'IMP-GW-2024-00058',
    location: 'North Wing Hub',
    status: 'active',
    lastSeen: 'Just now',
    signalStrength: 98,
    firmwareVersion: 'v4.1.0',
    tagsRead: 28493,
  },
  {
    id: 'RFID-006',
    name: 'Checkout Scanner #1',
    type: 'Fixed Reader',
    serialNumber: 'IMP-R420-2023-11087',
    location: 'Retail - Counter 1',
    status: 'inactive',
    lastSeen: '3 hours ago',
    signalStrength: 0,
    firmwareVersion: 'v3.2.0',
    tagsRead: 18724,
  },
  {
    id: 'RFID-007',
    name: 'Handheld Unit #8',
    type: 'Handheld',
    serialNumber: 'ZBR-MC33-2023-08419',
    location: 'Returns Dept',
    status: 'maintenance',
    lastSeen: '1 day ago',
    signalStrength: 0,
    firmwareVersion: 'v2.7.3',
    tagsRead: 2104,
  },
  {
    id: 'RFID-008',
    name: 'IoT Gateway South',
    type: 'Gateway',
    serialNumber: 'IMP-GW-2024-00061',
    location: 'South Wing Hub',
    status: 'inactive',
    lastSeen: '6 hours ago',
    signalStrength: 0,
    firmwareVersion: 'v4.0.2',
    tagsRead: 15302,
  },
];

const scanLog: ScanEntry[] = [
  { id: 'SCN-001', timestamp: '14:58:32', device: 'Warehouse Gate A', tagId: 'E2801170000002145A38B2C1', product: 'Portland Cement 50kg', sku: 'BM-CEM-050', location: 'Main Warehouse - Entry', signalStrength: 92 },
  { id: 'SCN-002', timestamp: '14:58:18', device: 'Dock Scanner B3', tagId: 'E2801170000002145A38B3D4', product: 'Steel Rebar 12mm', sku: 'MT-REB-012', location: 'Loading Dock B', signalStrength: 85 },
  { id: 'SCN-003', timestamp: '14:57:45', device: 'Handheld Unit #5', tagId: 'E2801170000002145A38B4E7', product: 'LED Panel Light 60W', sku: 'EL-LED-060', location: 'Aisle 4 - Electronics', signalStrength: 68 },
  { id: 'SCN-004', timestamp: '14:57:22', device: 'Warehouse Gate A', tagId: 'E2801170000002145A38B5FA', product: 'PVC Pipe 32mm (6m)', sku: 'PL-PVC-032', location: 'Main Warehouse - Entry', signalStrength: 94 },
  { id: 'SCN-005', timestamp: '14:56:58', device: 'Desktop Reader #2', tagId: 'E2801170000002145A38B60D', product: 'Emulsion Paint 20L White', sku: 'PT-EMU-020', location: 'Receiving Office', signalStrength: 100 },
  { id: 'SCN-006', timestamp: '14:56:31', device: 'IoT Gateway North', tagId: 'E2801170000002145A38B720', product: null, sku: null, location: 'North Wing Hub', signalStrength: 76 },
  { id: 'SCN-007', timestamp: '14:55:47', device: 'Warehouse Gate A', tagId: 'E2801170000002145A38B833', product: 'Roofing Sheet 3m Charcoal', sku: 'RF-SHT-3MC', location: 'Main Warehouse - Entry', signalStrength: 89 },
  { id: 'SCN-008', timestamp: '14:55:12', device: 'Dock Scanner B3', tagId: 'E2801170000002145A38B946', product: 'Copper Wire 2.5mm (100m)', sku: 'EL-CPR-025', location: 'Loading Dock B', signalStrength: 91 },
  { id: 'SCN-009', timestamp: '14:54:38', device: 'Handheld Unit #5', tagId: 'E2801170000002145A38BA59', product: 'Circuit Breaker 30A', sku: 'EL-CBR-030', location: 'Aisle 4 - Electronics', signalStrength: 55 },
  { id: 'SCN-010', timestamp: '14:54:05', device: 'IoT Gateway North', tagId: 'E2801170000002145A38BB6C', product: 'M10 Hex Bolts Box/100', sku: 'HW-BLT-M10', location: 'North Wing Hub', signalStrength: 82 },
  { id: 'SCN-011', timestamp: '14:53:22', device: 'Warehouse Gate A', tagId: 'E2801170000002145A38BC7F', product: 'Tile Adhesive 25kg', sku: 'BM-TIL-025', location: 'Main Warehouse - Entry', signalStrength: 97 },
  { id: 'SCN-012', timestamp: '14:52:48', device: 'Desktop Reader #2', tagId: 'E2801170000002145A38BD92', product: 'Safety Helmet Yellow', sku: 'SF-HLM-YLW', location: 'Receiving Office', signalStrength: 100 },
  { id: 'SCN-013', timestamp: '14:52:15', device: 'Dock Scanner B3', tagId: 'E2801170000002145A38BEA5', product: 'Angle Grinder 115mm', sku: 'TL-ANG-115', location: 'Loading Dock B', signalStrength: 78 },
  { id: 'SCN-014', timestamp: '14:51:33', device: 'Handheld Unit #5', tagId: 'E2801170000002145A38BFB8', product: null, sku: null, location: 'Aisle 4 - Electronics', signalStrength: 44 },
  { id: 'SCN-015', timestamp: '14:50:57', device: 'IoT Gateway North', tagId: 'E2801170000002145A38C0CB', product: 'Wheelbarrow 65L', sku: 'TL-WBR-065', location: 'North Wing Hub', signalStrength: 71 },
  { id: 'SCN-016', timestamp: '14:50:21', device: 'Warehouse Gate A', tagId: 'E2801170000002145A38C1DE', product: 'Concrete Block 200mm', sku: 'BM-BLK-200', location: 'Main Warehouse - Entry', signalStrength: 93 },
  { id: 'SCN-017', timestamp: '14:49:44', device: 'Desktop Reader #2', tagId: 'E2801170000002145A38C2F1', product: 'Measuring Tape 8m', sku: 'TL-MSR-008', location: 'Receiving Office', signalStrength: 100 },
  { id: 'SCN-018', timestamp: '14:48:58', device: 'Dock Scanner B3', tagId: 'E2801170000002145A38C304', product: 'Galvanized Pipe 25mm', sku: 'PL-GAL-025', location: 'Loading Dock B', signalStrength: 86 },
  { id: 'SCN-019', timestamp: '14:48:12', device: 'Handheld Unit #5', tagId: 'E2801170000002145A38C417', product: 'Extension Cord 10m', sku: 'EL-EXT-010', location: 'Aisle 4 - Electronics', signalStrength: 62 },
  { id: 'SCN-020', timestamp: '14:47:35', device: 'Warehouse Gate A', tagId: 'E2801170000002145A38C52A', product: 'Wood Screw Box 4x50mm', sku: 'HW-SCR-450', location: 'Main Warehouse - Entry', signalStrength: 90 },
];

const statCards = [
  { title: 'Total Devices', value: '24', icon: Radio, color: '#3b82f6', bg: '#eff6ff' },
  { title: 'Active', value: '18', icon: CheckCircle2, color: '#10b981', bg: '#ecfdf5' },
  { title: 'Inactive', value: '4', icon: AlertCircle, color: '#f59e0b', bg: '#fffbeb' },
  { title: 'Maintenance', value: '2', icon: Wrench, color: '#8b5cf6', bg: '#f5f3ff' },
];

const deviceTypeIcon = (type: DeviceType) => {
  switch (type) {
    case 'USB Reader': return <Radio size={20} />;
    case 'Fixed Reader': return <Wifi size={20} />;
    case 'Handheld': return <Smartphone size={20} />;
    case 'Gateway': return <Router size={20} />;
  }
};

const statusBadge = (status: DeviceStatus) => {
  const map: Record<DeviceStatus, { cls: string; label: string }> = {
    active: { cls: 'badge-green', label: 'Active' },
    inactive: { cls: 'badge-red', label: 'Inactive' },
    maintenance: { cls: 'badge-yellow', label: 'Maintenance' },
  };
  const { cls, label } = map[status];
  return <span className={`badge ${cls}`}>{label}</span>;
};

const SignalIndicator = ({ strength }: { strength: number }) => {
  if (strength === 0) return <SignalLow size={16} color="#94a3b8" />;
  if (strength < 60) return <SignalLow size={16} color="#f59e0b" />;
  if (strength < 85) return <SignalMedium size={16} color="#3b82f6" />;
  return <SignalHigh size={16} color="#10b981" />;
};

const SignalBar = ({ strength }: { strength: number }) => {
  const color = strength >= 85 ? '#10b981' : strength >= 60 ? '#3b82f6' : strength >= 40 ? '#f59e0b' : '#ef4444';
  return (
    <div className="flex items-center gap-2">
      <div style={{ width: 60, height: 6, borderRadius: 3, background: '#e2e8f0' }}>
        <div style={{ width: `${strength}%`, height: '100%', borderRadius: 3, background: color, transition: 'width 0.3s' }} />
      </div>
      <span style={{ fontSize: 12, color: '#64748b', minWidth: 32 }}>{strength}%</span>
    </div>
  );
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const locations = [
  'Main Warehouse - Entry',
  'Main Warehouse - Exit',
  'Loading Dock A',
  'Loading Dock B',
  'North Wing Hub',
  'South Wing Hub',
  'Retail - Counter 1',
  'Retail - Counter 2',
  'Receiving Office',
  'Returns Dept',
  'Aisle 4 - Electronics',
];

export default function Rfid() {
  const [activeTab, setActiveTab] = useState<'devices' | 'scanlog'>('devices');
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    type: 'Fixed Reader',
    location: '',
    serialNumber: '',
    firmwareVersion: '',
  });

  const filteredDevices = devices.filter(
    (d) =>
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>RFID Device Management</h1>
          <p style={{ color: '#64748b', fontSize: 14, margin: '4px 0 0' }}>
            Monitor and manage RFID readers, scanners, and gateways.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-secondary">
            <RefreshCw size={16} /> Refresh
          </button>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={16} /> Register Device
          </button>
        </div>
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
        <button className={`tab ${activeTab === 'devices' ? 'active' : ''}`} onClick={() => setActiveTab('devices')}>
          <Radio size={16} /> Devices
        </button>
        <button className={`tab ${activeTab === 'scanlog' ? 'active' : ''}`} onClick={() => setActiveTab('scanlog')}>
          <Activity size={16} /> Scan Log
        </button>
      </div>

      {/* Devices Tab */}
      {activeTab === 'devices' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
          <div className="flex items-center gap-3 mb-4">
            <div style={{ position: 'relative', flex: 1, maxWidth: 360 }}>
              <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                className="input"
                placeholder="Search devices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ paddingLeft: 36, width: '100%' }}
              />
            </div>
          </div>

          <div className="grid-3">
            {filteredDevices.map((device, i) => (
              <motion.div
                key={device.id}
                className="card"
                custom={i}
                initial="hidden"
                animate="visible"
                variants={cardVariants}
                style={{ padding: 20 }}
              >
                <div className="flex items-center justify-between" style={{ marginBottom: 16 }}>
                  <div className="flex items-center gap-3">
                    <div
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: 10,
                        background: device.status === 'active' ? '#ecfdf5' : device.status === 'maintenance' ? '#fffbeb' : '#fef2f2',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: device.status === 'active' ? '#10b981' : device.status === 'maintenance' ? '#f59e0b' : '#ef4444',
                      }}
                    >
                      {deviceTypeIcon(device.type)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{device.name}</div>
                      <div style={{ fontSize: 12, color: '#94a3b8' }}>{device.type}</div>
                    </div>
                  </div>
                  {statusBadge(device.status)}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13 }}>
                  <div className="flex items-center justify-between">
                    <span style={{ color: '#64748b' }}>Serial</span>
                    <span style={{ fontFamily: 'monospace', fontSize: 11, fontWeight: 500 }}>{device.serialNumber}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span style={{ color: '#64748b' }}>Location</span>
                    <span style={{ fontWeight: 500 }}>{device.location}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span style={{ color: '#64748b' }}>Last Seen</span>
                    <span style={{ fontWeight: 500 }}>{device.lastSeen}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span style={{ color: '#64748b' }}>Signal</span>
                    <div className="flex items-center gap-2">
                      <SignalIndicator strength={device.signalStrength} />
                      <span style={{ fontWeight: 500 }}>{device.signalStrength}%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span style={{ color: '#64748b' }}>Tags Read</span>
                    <span style={{ fontWeight: 500 }}>{device.tagsRead.toLocaleString()}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Scan Log Tab */}
      {activeTab === 'scanlog' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', animation: 'pulse 2s infinite' }} />
                <span style={{ fontSize: 14, fontWeight: 600 }}>Live Scan Feed</span>
                <span style={{ fontSize: 12, color: '#64748b' }}>({scanLog.length} recent scans)</span>
              </div>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table>
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>Device</th>
                    <th>Tag ID</th>
                    <th>Product</th>
                    <th>Location</th>
                    <th>Signal</th>
                  </tr>
                </thead>
                <tbody>
                  {scanLog.map((scan) => (
                    <tr key={scan.id}>
                      <td style={{ fontFamily: 'monospace', fontSize: 13, fontWeight: 500 }}>{scan.timestamp}</td>
                      <td style={{ fontWeight: 500 }}>{scan.device}</td>
                      <td style={{ fontFamily: 'monospace', fontSize: 11 }}>{scan.tagId}</td>
                      <td>
                        {scan.product ? (
                          <div>
                            <div style={{ fontWeight: 500 }}>{scan.product}</div>
                            <div style={{ fontSize: 11, color: '#94a3b8' }}>{scan.sku}</div>
                          </div>
                        ) : (
                          <span style={{ color: '#94a3b8', fontStyle: 'italic', fontSize: 13 }}>Unmatched</span>
                        )}
                      </td>
                      <td style={{ fontSize: 13 }}>{scan.location}</td>
                      <td>
                        <SignalBar strength={scan.signalStrength} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}

      {/* Register Device Modal */}
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
                <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Register Device</h2>
                <button className="btn btn-secondary" onClick={() => setShowModal(false)} style={{ padding: 6 }}>
                  <X size={18} />
                </button>
              </div>

              <div className="form-group">
                <label>Device Name</label>
                <input
                  className="input"
                  placeholder="e.g., Warehouse Gate C"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Device Type</label>
                <select
                  className="select"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                >
                  <option value="Fixed Reader">Fixed Reader</option>
                  <option value="USB Reader">USB Reader</option>
                  <option value="Handheld">Handheld</option>
                  <option value="Gateway">Gateway</option>
                </select>
              </div>

              <div className="form-group">
                <label>Location</label>
                <select
                  className="select"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                >
                  <option value="">Select location...</option>
                  {locations.map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Serial Number</label>
                <input
                  className="input"
                  placeholder="e.g., IMP-R700-2024-00200"
                  value={formData.serialNumber}
                  onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Firmware Version</label>
                <input
                  className="input"
                  placeholder="e.g., v3.4.1"
                  value={formData.firmwareVersion}
                  onChange={(e) => setFormData({ ...formData, firmwareVersion: e.target.value })}
                />
              </div>

              <div className="flex gap-3" style={{ marginTop: 24 }}>
                <button className="btn btn-secondary" onClick={() => setShowModal(false)} style={{ flex: 1 }}>
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={() => setShowModal(false)} style={{ flex: 1 }}>
                  Register Device
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
