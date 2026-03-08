import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building,
  MapPin,
  Users,
  Link,
  Save,
  Plus,
  Edit2,
  Trash2,
  Check,
  AlertCircle,
  X,
  Shield,
  Warehouse,
  Store,
  Phone,
  Mail,
  Clock,
  Globe,
  CreditCard,
  Radio,
  Database,
  Lock,
  UserPlus,
  ToggleLeft,
  ToggleRight,
  Settings as SettingsIcon,
  ExternalLink,
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

type PlanTier = 'Free' | 'Pro' | 'Enterprise';
type LocationType = 'Store' | 'Warehouse';
type UserRole = 'Business Owner' | 'Store Manager' | 'Warehouse Manager';
type IntegrationStatus = 'connected' | 'configure' | 'not_connected';

interface OrgSettings {
  companyName: string;
  slug: string;
  plan: PlanTier;
  currency: string;
  timezone: string;
  taxRate: number;
}

interface Location {
  id: string;
  name: string;
  type: LocationType;
  address: string;
  phone: string;
  active: boolean;
}

interface TeamUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  lastLogin: string;
  status: 'active' | 'inactive' | 'invited';
  avatar?: string;
}

interface Integration {
  id: string;
  name: string;
  description: string;
  status: IntegrationStatus;
  icon: React.ElementType;
  color: string;
  lastSync?: string;
}

// ─── Demo Data ───────────────────────────────────────────────────────────────

const defaultOrg: OrgSettings = {
  companyName: 'Tegra Hardware & Building Supplies',
  slug: 'tegra-hardware',
  plan: 'Pro',
  currency: 'USD',
  timezone: 'America/New_York',
  taxRate: 7.5,
};

const demoLocations: Location[] = [
  {
    id: 'LOC-001',
    name: 'Main Street Store',
    type: 'Store',
    address: '142 Main Street, Springfield, IL 62701',
    phone: '(217) 555-0142',
    active: true,
  },
  {
    id: 'LOC-002',
    name: 'Central Warehouse',
    type: 'Warehouse',
    address: '890 Industrial Blvd, Springfield, IL 62703',
    phone: '(217) 555-0890',
    active: true,
  },
  {
    id: 'LOC-003',
    name: 'Eastside Branch',
    type: 'Store',
    address: '2415 East Grand Ave, Springfield, IL 62702',
    phone: '(217) 555-2415',
    active: true,
  },
  {
    id: 'LOC-004',
    name: 'Overflow Storage',
    type: 'Warehouse',
    address: '67 Commerce Park Dr, Springfield, IL 62704',
    phone: '(217) 555-0067',
    active: false,
  },
];

const demoUsers: TeamUser[] = [
  {
    id: 'USR-001',
    name: 'James Okonkwo',
    email: 'james@tegrahardware.com',
    role: 'Business Owner',
    lastLogin: '2026-03-08 09:14',
    status: 'active',
  },
  {
    id: 'USR-002',
    name: 'Sarah Chen',
    email: 'sarah.chen@tegrahardware.com',
    role: 'Store Manager',
    lastLogin: '2026-03-08 08:32',
    status: 'active',
  },
  {
    id: 'USR-003',
    name: 'Michael Adebayo',
    email: 'm.adebayo@tegrahardware.com',
    role: 'Warehouse Manager',
    lastLogin: '2026-03-07 17:45',
    status: 'active',
  },
  {
    id: 'USR-004',
    name: 'Elena Rodriguez',
    email: 'elena.r@tegrahardware.com',
    role: 'Store Manager',
    lastLogin: '2026-03-08 07:58',
    status: 'active',
  },
  {
    id: 'USR-005',
    name: 'David Kimani',
    email: 'd.kimani@tegrahardware.com',
    role: 'Warehouse Manager',
    lastLogin: '2026-03-06 16:20',
    status: 'inactive',
  },
  {
    id: 'USR-006',
    name: 'Aisha Patel',
    email: 'aisha.p@tegrahardware.com',
    role: 'Store Manager',
    lastLogin: '—',
    status: 'invited',
  },
];

const demoIntegrations: Integration[] = [
  {
    id: 'INT-001',
    name: 'Clerk Auth',
    description: 'Authentication and user management. SSO, MFA, and session handling.',
    status: 'connected',
    icon: Lock,
    color: '#6366f1',
    lastSync: '2026-03-08 09:00',
  },
  {
    id: 'INT-002',
    name: 'Convex DB',
    description: 'Real-time database backend. Syncs inventory and transactions automatically.',
    status: 'connected',
    icon: Database,
    color: '#f97316',
    lastSync: '2026-03-08 09:14',
  },
  {
    id: 'INT-003',
    name: 'RFID Hub',
    description: 'RFID scanner integration for warehouse receiving and cycle counts.',
    status: 'configure',
    icon: Radio,
    color: '#14b8a6',
  },
  {
    id: 'INT-004',
    name: 'Payment Gateway',
    description: 'Process credit cards, mobile money, and bank transfers at POS.',
    status: 'configure',
    icon: CreditCard,
    color: '#8b5cf6',
  },
  {
    id: 'INT-005',
    name: 'Accounting Sync',
    description: 'Sync journal entries and invoices with external accounting software.',
    status: 'not_connected',
    icon: Link,
    color: '#64748b',
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

const planBadge: Record<PlanTier, string> = {
  Free: 'badge-gray',
  Pro: 'badge-blue',
  Enterprise: 'badge-purple',
};

const roleBadge: Record<UserRole, string> = {
  'Business Owner': 'badge-purple',
  'Store Manager': 'badge-blue',
  'Warehouse Manager': 'badge-yellow',
};

const statusBadge: Record<string, string> = {
  active: 'badge-green',
  inactive: 'badge-gray',
  invited: 'badge-yellow',
};

const integrationStatusConfig: Record<IntegrationStatus, { label: string; badge: string; action: string }> = {
  connected: { label: 'Connected', badge: 'badge-green', action: 'Configure' },
  configure: { label: 'Ready', badge: 'badge-yellow', action: 'Configure' },
  not_connected: { label: 'Not Connected', badge: 'badge-gray', action: 'Connect' },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function Settings() {
  const [activeTab, setActiveTab] = useState<'org' | 'locations' | 'users' | 'integrations'>('org');

  // Organization state
  const [org, setOrg] = useState<OrgSettings>(defaultOrg);
  const [orgSaved, setOrgSaved] = useState(false);

  // Locations state
  const [locations, setLocations] = useState<Location[]>(demoLocations);

  // Users state
  const [showInviteUser, setShowInviteUser] = useState(false);
  const [inviteForm, setInviteForm] = useState({ name: '', email: '', role: 'Store Manager' as UserRole });

  const handleSaveOrg = () => {
    setOrgSaved(true);
    setTimeout(() => setOrgSaved(false), 2500);
  };

  const toggleLocationActive = (id: string) => {
    setLocations((prev) =>
      prev.map((loc) => (loc.id === id ? { ...loc, active: !loc.active } : loc))
    );
  };

  const tabs = [
    { key: 'org' as const, label: 'Organization', icon: Building },
    { key: 'locations' as const, label: 'Locations', icon: MapPin },
    { key: 'users' as const, label: 'Users & Roles', icon: Users },
    { key: 'integrations' as const, label: 'Integrations', icon: Link },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Settings</h1>
          <p style={{ color: '#64748b', fontSize: 14, margin: '4px 0 0' }}>
            Manage your organization, locations, team, and integrations
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

      {/* ── Organization ──────────────────────────────────────────────────── */}
      {activeTab === 'org' && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <motion.div className="card" custom={0} initial="hidden" animate="visible" variants={cardVariants}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Organization Details</h3>
                <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b' }}>
                  Core settings for your business
                </p>
              </div>
              <span className={`badge ${planBadge[org.plan]}`} style={{ fontSize: 13, padding: '4px 12px' }}>
                {org.plan} Plan
              </span>
            </div>

            <div className="grid-2 mb-4">
              <div className="form-group">
                <label>Company Name</label>
                <input
                  className="input"
                  value={org.companyName}
                  onChange={(e) => setOrg({ ...org, companyName: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Organization Slug</label>
                <div className="flex items-center gap-2">
                  <span style={{ fontSize: 13, color: '#94a3b8' }}>app.tegra.io/</span>
                  <input
                    className="input"
                    value={org.slug}
                    onChange={(e) => setOrg({ ...org, slug: e.target.value })}
                    style={{ flex: 1 }}
                  />
                </div>
              </div>
            </div>

            <div className="grid-3 mb-4">
              <div className="form-group">
                <label>
                  <Globe size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} />
                  Currency
                </label>
                <select
                  className="select"
                  value={org.currency}
                  onChange={(e) => setOrg({ ...org, currency: e.target.value })}
                >
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="KES">KES - Kenyan Shilling</option>
                  <option value="NGN">NGN - Nigerian Naira</option>
                  <option value="ZAR">ZAR - South African Rand</option>
                </select>
              </div>
              <div className="form-group">
                <label>
                  <Clock size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} />
                  Timezone
                </label>
                <select
                  className="select"
                  value={org.timezone}
                  onChange={(e) => setOrg({ ...org, timezone: e.target.value })}
                >
                  <option value="America/New_York">Eastern (UTC-5)</option>
                  <option value="America/Chicago">Central (UTC-6)</option>
                  <option value="America/Denver">Mountain (UTC-7)</option>
                  <option value="America/Los_Angeles">Pacific (UTC-8)</option>
                  <option value="Africa/Nairobi">East Africa (UTC+3)</option>
                  <option value="Africa/Lagos">West Africa (UTC+1)</option>
                  <option value="Europe/London">GMT (UTC+0)</option>
                </select>
              </div>
              <div className="form-group">
                <label>Default Tax Rate (%)</label>
                <input
                  className="input"
                  type="number"
                  step="0.1"
                  value={org.taxRate}
                  onChange={(e) => setOrg({ ...org, taxRate: parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div className="flex items-center gap-3" style={{ marginTop: 20 }}>
              <button className="btn btn-primary" onClick={handleSaveOrg}>
                <Save size={16} /> Save Changes
              </button>
              <AnimatePresence>
                {orgSaved && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                    style={{ color: '#16a34a', fontSize: 13, fontWeight: 500 }}
                  >
                    <Check size={16} /> Changes saved successfully
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* ── Locations ─────────────────────────────────────────────────────── */}
      {activeTab === 'locations' && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <div className="flex items-center justify-between mb-4">
            <span style={{ fontSize: 13, color: '#64748b' }}>
              {locations.length} locations &middot; {locations.filter((l) => l.active).length} active
            </span>
            <button className="btn btn-primary">
              <Plus size={16} /> Add Location
            </button>
          </div>

          <div className="grid-2">
            {locations.map((loc, i) => {
              const TypeIcon = loc.type === 'Store' ? Store : Warehouse;
              return (
                <motion.div
                  key={loc.id}
                  className="card"
                  custom={i}
                  initial="hidden"
                  animate="visible"
                  variants={cardVariants}
                  style={{ opacity: loc.active ? 1 : 0.6 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 10,
                          background: loc.type === 'Store' ? '#eff6ff' : '#f0fdf4',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <TypeIcon
                          size={20}
                          color={loc.type === 'Store' ? '#3b82f6' : '#16a34a'}
                        />
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 15 }}>{loc.name}</div>
                        <span className={`badge ${loc.type === 'Store' ? 'badge-blue' : 'badge-green'}`}>
                          {loc.type}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleLocationActive(loc.id)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                      title={loc.active ? 'Deactivate' : 'Activate'}
                    >
                      {loc.active ? (
                        <ToggleRight size={28} color="#16a34a" />
                      ) : (
                        <ToggleLeft size={28} color="#94a3b8" />
                      )}
                    </button>
                  </div>

                  <div style={{ marginBottom: 12, fontSize: 13, color: '#475569' }}>
                    <div className="flex items-center gap-2" style={{ marginBottom: 6 }}>
                      <MapPin size={14} color="#94a3b8" />
                      {loc.address}
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone size={14} color="#94a3b8" />
                      {loc.phone}
                    </div>
                  </div>

                  <div
                    className="flex items-center justify-between"
                    style={{ borderTop: '1px solid #f1f5f9', paddingTop: 12 }}
                  >
                    <span
                      className={`badge ${loc.active ? 'badge-green' : 'badge-gray'}`}
                    >
                      {loc.active ? 'Active' : 'Inactive'}
                    </span>
                    <div className="flex items-center gap-2">
                      <button className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: 12 }}>
                        <Edit2 size={13} /> Edit
                      </button>
                      <button className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: 12 }}>
                        <Trash2 size={13} /> Delete
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* ── Users & Roles ─────────────────────────────────────────────────── */}
      {activeTab === 'users' && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <div className="flex items-center justify-between mb-4">
            <span style={{ fontSize: 13, color: '#64748b' }}>
              {demoUsers.length} team members
            </span>
            <button className="btn btn-primary" onClick={() => setShowInviteUser(true)}>
              <UserPlus size={16} /> Invite User
            </button>
          </div>

          <motion.div className="card" custom={0} initial="hidden" animate="visible" variants={cardVariants}>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Last Login</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {demoUsers.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div
                          style={{
                            width: 34,
                            height: 34,
                            borderRadius: '50%',
                            background: '#f1f5f9',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 600,
                            fontSize: 13,
                            color: '#475569',
                          }}
                        >
                          {user.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </div>
                        <span style={{ fontWeight: 500 }}>{user.name}</span>
                      </div>
                    </td>
                    <td>
                      <span className="flex items-center gap-2" style={{ fontSize: 13, color: '#64748b' }}>
                        <Mail size={13} /> {user.email}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${roleBadge[user.role]}`}>
                        {user.role === 'Business Owner' && <Shield size={12} style={{ marginRight: 4 }} />}
                        {user.role}
                      </span>
                    </td>
                    <td style={{ fontSize: 13, color: '#64748b' }}>{user.lastLogin}</td>
                    <td>
                      <span className={`badge ${statusBadge[user.status]}`}>{user.status}</span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="flex items-center gap-2" style={{ justifyContent: 'flex-end' }}>
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

          {/* Invite User Modal */}
          <AnimatePresence>
            {showInviteUser && (
              <motion.div
                className="modal-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowInviteUser(false)}
              >
                <motion.div
                  className="modal"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>Invite Team Member</h2>
                    <button
                      className="btn btn-secondary"
                      style={{ padding: '4px 8px' }}
                      onClick={() => setShowInviteUser(false)}
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <div className="form-group">
                    <label>Full Name</label>
                    <input
                      className="input"
                      placeholder="e.g., John Smith"
                      value={inviteForm.name}
                      onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Email Address</label>
                    <input
                      className="input"
                      type="email"
                      placeholder="e.g., john@tegrahardware.com"
                      value={inviteForm.email}
                      onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Role</label>
                    <select
                      className="select"
                      value={inviteForm.role}
                      onChange={(e) => setInviteForm({ ...inviteForm, role: e.target.value as UserRole })}
                    >
                      <option value="Store Manager">Store Manager</option>
                      <option value="Warehouse Manager">Warehouse Manager</option>
                      <option value="Business Owner">Business Owner</option>
                    </select>
                  </div>

                  <div
                    style={{
                      background: '#f8fafc',
                      borderRadius: 8,
                      padding: 12,
                      marginBottom: 16,
                      fontSize: 13,
                      color: '#64748b',
                    }}
                  >
                    <div className="flex items-center gap-2" style={{ marginBottom: 4 }}>
                      <AlertCircle size={14} />
                      <strong>Role Permissions</strong>
                    </div>
                    {inviteForm.role === 'Business Owner' && (
                      <p style={{ margin: 0 }}>Full access to all settings, reports, and management features.</p>
                    )}
                    {inviteForm.role === 'Store Manager' && (
                      <p style={{ margin: 0 }}>
                        Manage POS, customers, and view store-level reports. Cannot modify organization settings.
                      </p>
                    )}
                    {inviteForm.role === 'Warehouse Manager' && (
                      <p style={{ margin: 0 }}>
                        Manage inventory, receiving, transfers, and warehouse operations. Cannot access financial data.
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <button className="btn btn-primary">
                      <Mail size={16} /> Send Invitation
                    </button>
                    <button className="btn btn-secondary" onClick={() => setShowInviteUser(false)}>
                      Cancel
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* ── Integrations ──────────────────────────────────────────────────── */}
      {activeTab === 'integrations' && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <div className="mb-4">
            <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>
              Connect external services to extend your ERP capabilities.
            </p>
          </div>

          <div className="grid-2">
            {demoIntegrations.map((integration, i) => {
              const Icon = integration.icon;
              const config = integrationStatusConfig[integration.status];
              return (
                <motion.div
                  key={integration.id}
                  className="card"
                  custom={i}
                  initial="hidden"
                  animate="visible"
                  variants={cardVariants}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: 10,
                          background: `${integration.color}15`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Icon size={22} color={integration.color} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 15 }}>{integration.name}</div>
                        <span className={`badge ${config.badge}`}>
                          {integration.status === 'connected' && (
                            <Check size={11} style={{ marginRight: 4 }} />
                          )}
                          {config.label}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 16px' }}>
                    {integration.description}
                  </p>

                  {integration.lastSync && (
                    <div
                      style={{ fontSize: 12, color: '#94a3b8', marginBottom: 12 }}
                      className="flex items-center gap-2"
                    >
                      <Clock size={12} />
                      Last synced: {integration.lastSync}
                    </div>
                  )}

                  <div
                    className="flex items-center justify-between"
                    style={{ borderTop: '1px solid #f1f5f9', paddingTop: 12 }}
                  >
                    <button
                      className={`btn ${integration.status === 'not_connected' ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ fontSize: 13 }}
                    >
                      {integration.status === 'connected' ? (
                        <>
                          <SettingsIcon size={14} /> {config.action}
                        </>
                      ) : integration.status === 'configure' ? (
                        <>
                          <SettingsIcon size={14} /> {config.action}
                        </>
                      ) : (
                        <>
                          <Link size={14} /> {config.action}
                        </>
                      )}
                    </button>
                    {integration.status === 'connected' && (
                      <button className="btn btn-secondary" style={{ fontSize: 12 }}>
                        <ExternalLink size={13} /> Docs
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}
