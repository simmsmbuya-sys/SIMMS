import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  Download,
  Calendar,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  ShoppingCart,
  FileText,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
} from 'lucide-react';

// ──────────────────────────────── SALES DATA ────────────────────────────────

const monthlyRevenue = [
  { month: 'Jan', revenue: 218400, orders: 312 },
  { month: 'Feb', revenue: 195600, orders: 287 },
  { month: 'Mar', revenue: 247800, orders: 356 },
  { month: 'Apr', revenue: 231200, orders: 334 },
  { month: 'May', revenue: 268900, orders: 389 },
  { month: 'Jun', revenue: 254300, orders: 367 },
  { month: 'Jul', revenue: 289100, orders: 412 },
  { month: 'Aug', revenue: 276400, orders: 398 },
  { month: 'Sep', revenue: 302500, orders: 431 },
  { month: 'Oct', revenue: 315800, orders: 448 },
  { month: 'Nov', revenue: 341200, orders: 487 },
  { month: 'Dec', revenue: 284520, orders: 402 },
];

const salesByCategory = [
  { name: 'Building Materials', value: 842300, color: '#3b82f6' },
  { name: 'Electrical', value: 524100, color: '#8b5cf6' },
  { name: 'Plumbing', value: 398700, color: '#10b981' },
  { name: 'Paint & Finishes', value: 312500, color: '#f59e0b' },
  { name: 'Hardware & Tools', value: 287400, color: '#ef4444' },
  { name: 'Safety Equipment', value: 160700, color: '#06b6d4' },
];

const topCustomers = [
  { rank: 1, name: 'Metro Construction Co.', totalSpent: 487200, orders: 124, lastOrder: '2026-03-06', trend: 18.4 },
  { rank: 2, name: 'Greenfield Hardware Ltd', totalSpent: 352800, orders: 98, lastOrder: '2026-03-07', trend: 12.1 },
  { rank: 3, name: 'Apex Electrical Distributors', totalSpent: 298450, orders: 87, lastOrder: '2026-03-05', trend: 9.6 },
  { rank: 4, name: 'Valley Farm Equipment', totalSpent: 245700, orders: 76, lastOrder: '2026-03-04', trend: -3.2 },
  { rank: 5, name: 'Sunrise Plumbing Supplies', totalSpent: 218300, orders: 65, lastOrder: '2026-03-07', trend: 22.7 },
  { rank: 6, name: 'Highland Builders Corp', totalSpent: 198500, orders: 58, lastOrder: '2026-03-03', trend: 7.5 },
  { rank: 7, name: 'Coastal Roofing Solutions', totalSpent: 176200, orders: 52, lastOrder: '2026-03-06', trend: -1.8 },
  { rank: 8, name: 'Pioneer Paints & Coatings', totalSpent: 164800, orders: 47, lastOrder: '2026-03-02', trend: 14.3 },
  { rank: 9, name: 'Central HVAC Systems', totalSpent: 142300, orders: 41, lastOrder: '2026-03-01', trend: 5.9 },
  { rank: 10, name: 'Lakeside Home Renovations', totalSpent: 128900, orders: 38, lastOrder: '2026-02-28', trend: -6.1 },
];

// ──────────────────────────────── INVENTORY DATA ────────────────────────────

const stockByCategory = [
  { category: 'Building Materials', inStock: 4820, lowStock: 12, outOfStock: 3 },
  { category: 'Electrical', inStock: 3150, lowStock: 8, outOfStock: 2 },
  { category: 'Plumbing', inStock: 2740, lowStock: 15, outOfStock: 5 },
  { category: 'Paint & Finishes', inStock: 1890, lowStock: 6, outOfStock: 1 },
  { category: 'Hardware & Tools', inStock: 5230, lowStock: 9, outOfStock: 4 },
  { category: 'Safety Equipment', inStock: 1420, lowStock: 3, outOfStock: 0 },
];

const turnoverRate = [
  { month: 'Jan', rate: 4.2, target: 5.0 },
  { month: 'Feb', rate: 3.8, target: 5.0 },
  { month: 'Mar', rate: 4.7, target: 5.0 },
  { month: 'Apr', rate: 4.5, target: 5.0 },
  { month: 'May', rate: 5.1, target: 5.0 },
  { month: 'Jun', rate: 4.9, target: 5.0 },
  { month: 'Jul', rate: 5.4, target: 5.0 },
  { month: 'Aug', rate: 5.2, target: 5.0 },
  { month: 'Sep', rate: 5.6, target: 5.0 },
  { month: 'Oct', rate: 5.8, target: 5.0 },
  { month: 'Nov', rate: 6.1, target: 5.0 },
  { month: 'Dec', rate: 5.3, target: 5.0 },
];

const agingStock = [
  { sku: 'PT-VRN-008', name: 'Polyurethane Varnish 5L', daysInStock: 187, qty: 42, value: 6300, category: 'Paint' },
  { sku: 'HW-HNG-045', name: 'Brass Door Hinge 4"', daysInStock: 156, qty: 230, value: 4600, category: 'Hardware' },
  { sku: 'SF-GLV-012', name: 'Welding Gloves (Pair)', daysInStock: 134, qty: 85, value: 2550, category: 'Safety' },
  { sku: 'PL-VLV-028', name: 'Gate Valve 50mm Brass', daysInStock: 121, qty: 18, value: 5400, category: 'Plumbing' },
  { sku: 'EL-SWT-019', name: 'Dimmer Switch 600W', daysInStock: 108, qty: 64, value: 3200, category: 'Electrical' },
  { sku: 'BM-INS-003', name: 'Fibreglass Insulation Roll', daysInStock: 98, qty: 35, value: 8750, category: 'Building' },
  { sku: 'HW-LCK-031', name: 'Deadbolt Lock Set Chrome', daysInStock: 91, qty: 28, value: 3920, category: 'Hardware' },
];

// ──────────────────────────────── FINANCIAL DATA ────────────────────────────

const profitLossCards = [
  { title: 'Gross Revenue', value: 3425700, change: 14.2, positive: true, icon: DollarSign, color: '#3b82f6', bg: '#eff6ff' },
  { title: 'Cost of Goods', value: 2054420, change: 11.8, positive: false, icon: Package, color: '#ef4444', bg: '#fef2f2' },
  { title: 'Gross Profit', value: 1371280, change: 18.1, positive: true, icon: TrendingUp, color: '#10b981', bg: '#ecfdf5' },
  { title: 'Net Profit', value: 685640, change: 22.4, positive: true, icon: ShoppingCart, color: '#8b5cf6', bg: '#f5f3ff' },
];

const expenseBreakdown = [
  { name: 'COGS', value: 2054420, color: '#3b82f6' },
  { name: 'Salaries & Wages', value: 342800, color: '#8b5cf6' },
  { name: 'Rent & Utilities', value: 124500, color: '#10b981' },
  { name: 'Transport & Logistics', value: 98200, color: '#f59e0b' },
  { name: 'Marketing', value: 45600, color: '#ef4444' },
  { name: 'Insurance & Taxes', value: 38400, color: '#06b6d4' },
  { name: 'Other Operating', value: 36140, color: '#ec4899' },
];

const monthlyCashFlow = [
  { month: 'Jan', inflow: 218400, outflow: 187200, net: 31200 },
  { month: 'Feb', inflow: 195600, outflow: 178400, net: 17200 },
  { month: 'Mar', inflow: 247800, outflow: 201500, net: 46300 },
  { month: 'Apr', inflow: 231200, outflow: 198700, net: 32500 },
  { month: 'May', inflow: 268900, outflow: 218300, net: 50600 },
  { month: 'Jun', inflow: 254300, outflow: 212800, net: 41500 },
  { month: 'Jul', inflow: 289100, outflow: 234600, net: 54500 },
  { month: 'Aug', inflow: 276400, outflow: 228100, net: 48300 },
  { month: 'Sep', inflow: 302500, outflow: 245800, net: 56700 },
  { month: 'Oct', inflow: 315800, outflow: 258400, net: 57400 },
  { month: 'Nov', inflow: 341200, outflow: 276500, net: 64700 },
  { month: 'Dec', inflow: 284520, outflow: 232400, net: 52120 },
];

// ──────────────────────────────── ANIMATION ─────────────────────────────────

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

// ──────────────────────────────── TOOLTIP STYLES ────────────────────────────

const tooltipStyle = {
  background: '#0f172a',
  border: 'none',
  borderRadius: 8,
  color: '#e2e8f0',
  fontSize: 13,
};

// ──────────────────────────────── CUSTOM PIE LABEL ──────────────────────────

const renderPieLabel = ({ name, percent }: { name: string; percent: number }) =>
  `${name} (${(percent * 100).toFixed(0)}%)`;

// ──────────────────────────────── COMPONENT ─────────────────────────────────

type TabKey = 'sales' | 'inventory' | 'financial';

export default function Reports() {
  const [activeTab, setActiveTab] = useState<TabKey>('sales');
  const [dateRange, setDateRange] = useState({ from: '2025-01-01', to: '2025-12-31' });

  const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    { key: 'sales', label: 'Sales', icon: <ShoppingCart size={16} /> },
    { key: 'inventory', label: 'Inventory', icon: <Package size={16} /> },
    { key: 'financial', label: 'Financial', icon: <DollarSign size={16} /> },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Reports</h1>
          <p style={{ color: '#64748b', fontSize: 14, margin: '4px 0 0' }}>
            Analyze business performance across sales, inventory, and finances.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-secondary">
            <Filter size={16} /> Filters
          </button>
          <button className="btn btn-primary">
            <Download size={16} /> Export
          </button>
        </div>
      </div>

      {/* Date Range Filter */}
      <motion.div
        className="card mb-6"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <div className="flex items-center gap-4">
          <Calendar size={18} color="#64748b" />
          <span style={{ fontSize: 14, fontWeight: 500, color: '#475569' }}>Date Range:</span>
          <input
            type="date"
            className="input"
            style={{ width: 160 }}
            value={dateRange.from}
            onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
          />
          <span style={{ color: '#94a3b8' }}>to</span>
          <input
            type="date"
            className="input"
            style={{ width: 160 }}
            value={dateRange.to}
            onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
          />
          <button className="btn btn-secondary" style={{ padding: '8px 16px' }}>Apply</button>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="tabs">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`tab ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            <span className="flex items-center gap-2">
              {tab.icon} {tab.label}
            </span>
          </button>
        ))}
      </div>

      {/* ═══════════════════════ SALES TAB ═══════════════════════ */}
      {activeTab === 'sales' && (
        <div>
          {/* Monthly Revenue Bar Chart */}
          <motion.div
            className="card mb-6"
            custom={0}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Monthly Revenue</h3>
                <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b' }}>
                  Total: ${monthlyRevenue.reduce((s, m) => s + m.revenue, 0).toLocaleString()}
                </p>
              </div>
              <div className="flex items-center gap-2" style={{ fontSize: 13, color: '#16a34a' }}>
                <TrendingUp size={14} />
                <span style={{ fontWeight: 600 }}>+14.2%</span>
                <span style={{ color: '#64748b' }}>YoY</span>
              </div>
            </div>
            <div style={{ height: 340 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyRevenue} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#94a3b8' }}
                    tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
                  />
                  <Bar dataKey="revenue" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={36} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <div className="grid-2 mb-6">
            {/* Sales by Category Pie */}
            <motion.div
              className="card"
              custom={1}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
            >
              <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 600 }}>Sales by Category</h3>
              <div style={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={salesByCategory}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      innerRadius={55}
                      dataKey="value"
                      label={renderPieLabel}
                      labelLine={{ stroke: '#94a3b8' }}
                    >
                      {salesByCategory.map((entry, idx) => (
                        <Cell key={idx} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={tooltipStyle}
                      formatter={(value: number) => [`$${value.toLocaleString()}`, 'Sales']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Category Summary Cards */}
            <motion.div
              className="card"
              custom={2}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
            >
              <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 600 }}>Category Breakdown</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {salesByCategory.map((cat) => {
                  const total = salesByCategory.reduce((s, c) => s + c.value, 0);
                  const pct = ((cat.value / total) * 100).toFixed(1);
                  return (
                    <div key={cat.name} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 12, height: 12, borderRadius: 3, background: cat.color, flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        <div className="flex items-center justify-between" style={{ marginBottom: 4 }}>
                          <span style={{ fontSize: 14, fontWeight: 500 }}>{cat.name}</span>
                          <span style={{ fontSize: 13, fontWeight: 600 }}>${(cat.value / 1000).toFixed(0)}k</span>
                        </div>
                        <div style={{ height: 6, background: '#f1f5f9', borderRadius: 3, overflow: 'hidden' }}>
                          <div
                            style={{
                              height: '100%',
                              width: `${pct}%`,
                              background: cat.color,
                              borderRadius: 3,
                              transition: 'width 0.5s ease',
                            }}
                          />
                        </div>
                      </div>
                      <span style={{ fontSize: 12, color: '#64748b', width: 40, textAlign: 'right' }}>{pct}%</span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* Top 10 Customers */}
          <motion.div
            className="card mb-6"
            custom={3}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Top 10 Customers</h3>
              <span style={{ fontSize: 13, color: '#64748b' }}>by total spend</span>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Customer</th>
                  <th>Total Spent</th>
                  <th>Orders</th>
                  <th>Last Order</th>
                  <th>Trend</th>
                </tr>
              </thead>
              <tbody>
                {topCustomers.map((c) => (
                  <tr key={c.rank}>
                    <td style={{ fontWeight: 600, color: c.rank <= 3 ? '#3b82f6' : '#94a3b8' }}>#{c.rank}</td>
                    <td style={{ fontWeight: 500 }}>{c.name}</td>
                    <td style={{ fontWeight: 600 }}>${c.totalSpent.toLocaleString()}</td>
                    <td>{c.orders}</td>
                    <td style={{ fontSize: 13, color: '#64748b' }}>{c.lastOrder}</td>
                    <td>
                      <span
                        className="flex items-center gap-2"
                        style={{
                          color: c.trend >= 0 ? '#16a34a' : '#dc2626',
                          fontWeight: 500,
                          fontSize: 13,
                        }}
                      >
                        {c.trend >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                        {c.trend >= 0 ? '+' : ''}{c.trend}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      )}

      {/* ═══════════════════════ INVENTORY TAB ═══════════════════════ */}
      {activeTab === 'inventory' && (
        <div>
          {/* Stock Levels by Category */}
          <motion.div
            className="card mb-6"
            custom={0}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Stock Levels by Category</h3>
                <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b' }}>
                  Total SKUs: {stockByCategory.reduce((s, c) => s + c.inStock + c.lowStock + c.outOfStock, 0).toLocaleString()}
                </p>
              </div>
              <div className="flex gap-3" style={{ fontSize: 12 }}>
                <span className="flex items-center gap-2"><span style={{ width: 10, height: 10, borderRadius: 2, background: '#3b82f6', display: 'inline-block' }} /> In Stock</span>
                <span className="flex items-center gap-2"><span style={{ width: 10, height: 10, borderRadius: 2, background: '#f59e0b', display: 'inline-block' }} /> Low Stock</span>
                <span className="flex items-center gap-2"><span style={{ width: 10, height: 10, borderRadius: 2, background: '#ef4444', display: 'inline-block' }} /> Out of Stock</span>
              </div>
            </div>
            <div style={{ height: 340 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stockByCategory} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend />
                  <Bar dataKey="inStock" name="In Stock" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={28} />
                  <Bar dataKey="lowStock" name="Low Stock" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={28} />
                  <Bar dataKey="outOfStock" name="Out of Stock" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={28} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Turnover Rate */}
          <motion.div
            className="card mb-6"
            custom={1}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Inventory Turnover Rate</h3>
                <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b' }}>
                  Average: {(turnoverRate.reduce((s, m) => s + m.rate, 0) / turnoverRate.length).toFixed(1)}x &middot; Target: 5.0x
                </p>
              </div>
              <span
                className="flex items-center gap-2"
                style={{ fontSize: 13, color: '#16a34a', fontWeight: 600 }}
              >
                <TrendingUp size={14} /> Above target since May
              </span>
            </div>
            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={turnoverRate} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} domain={[3, 7]} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="rate"
                    name="Turnover Rate"
                    stroke="#3b82f6"
                    strokeWidth={2.5}
                    dot={{ fill: '#3b82f6', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="target"
                    name="Target"
                    stroke="#ef4444"
                    strokeWidth={1.5}
                    strokeDasharray="8 4"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Aging Stock Table */}
          <motion.div
            className="card mb-6"
            custom={2}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Aging Stock</h3>
                <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b' }}>
                  Items in stock for over 90 days without movement
                </p>
              </div>
              <span className="badge badge-yellow">{agingStock.length} items</span>
            </div>
            <table>
              <thead>
                <tr>
                  <th>SKU</th>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Days in Stock</th>
                  <th>Qty</th>
                  <th>Value</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {agingStock.map((item) => {
                  const severity = item.daysInStock > 150 ? 'badge-red' : item.daysInStock > 120 ? 'badge-yellow' : 'badge-blue';
                  const label = item.daysInStock > 150 ? 'Critical' : item.daysInStock > 120 ? 'Slow' : 'Aging';
                  return (
                    <tr key={item.sku}>
                      <td style={{ fontFamily: 'monospace', fontSize: 13 }}>{item.sku}</td>
                      <td style={{ fontWeight: 500 }}>{item.name}</td>
                      <td><span className="badge badge-gray">{item.category}</span></td>
                      <td style={{ fontWeight: 600, color: item.daysInStock > 150 ? '#dc2626' : '#f59e0b' }}>
                        {item.daysInStock}d
                      </td>
                      <td>{item.qty}</td>
                      <td style={{ fontWeight: 600 }}>${item.value.toLocaleString()}</td>
                      <td><span className={`badge ${severity}`}>{label}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </motion.div>
        </div>
      )}

      {/* ═══════════════════════ FINANCIAL TAB ═══════════════════════ */}
      {activeTab === 'financial' && (
        <div>
          {/* P&L Summary Cards */}
          <div className="grid-4 mb-6">
            {profitLossCards.map((card, i) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.title}
                  className="stat-card"
                  custom={i}
                  initial="hidden"
                  animate="visible"
                  variants={cardVariants}
                >
                  <div className="flex items-center justify-between" style={{ marginBottom: 12 }}>
                    <h3>{card.title}</h3>
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 10,
                        background: card.bg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Icon size={20} color={card.color} />
                    </div>
                  </div>
                  <div className="value">${(card.value / 1000).toFixed(0)}k</div>
                  <div className={`change ${card.positive ? 'positive' : 'negative'}`}>
                    <span className="flex items-center gap-2">
                      {card.positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                      {card.positive ? '+' : '-'}{card.change}% vs last year
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="grid-2 mb-6">
            {/* Expense Breakdown Pie */}
            <motion.div
              className="card"
              custom={4}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
            >
              <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 600 }}>Expense Breakdown</h3>
              <div style={{ height: 320 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expenseBreakdown}
                      cx="50%"
                      cy="50%"
                      outerRadius={110}
                      innerRadius={60}
                      dataKey="value"
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      labelLine={{ stroke: '#94a3b8' }}
                    >
                      {expenseBreakdown.map((entry, idx) => (
                        <Cell key={idx} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={tooltipStyle}
                      formatter={(value: number) => [`$${value.toLocaleString()}`, 'Amount']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 8 }}>
                {expenseBreakdown.map((exp) => (
                  <div key={exp.name} className="flex items-center gap-2" style={{ fontSize: 12 }}>
                    <span style={{ width: 8, height: 8, borderRadius: 2, background: exp.color, display: 'inline-block' }} />
                    <span style={{ color: '#64748b' }}>{exp.name}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Expense Detail List */}
            <motion.div
              className="card"
              custom={5}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
            >
              <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 600 }}>Expense Detail</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {expenseBreakdown.map((exp) => {
                  const total = expenseBreakdown.reduce((s, e) => s + e.value, 0);
                  const pct = ((exp.value / total) * 100).toFixed(1);
                  return (
                    <div key={exp.name}>
                      <div className="flex items-center justify-between" style={{ marginBottom: 6 }}>
                        <div className="flex items-center gap-2">
                          <span style={{ width: 10, height: 10, borderRadius: 2, background: exp.color, display: 'inline-block' }} />
                          <span style={{ fontSize: 14, fontWeight: 500 }}>{exp.name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span style={{ fontSize: 13, color: '#64748b' }}>{pct}%</span>
                          <span style={{ fontSize: 14, fontWeight: 600 }}>${exp.value.toLocaleString()}</span>
                        </div>
                      </div>
                      <div style={{ height: 5, background: '#f1f5f9', borderRadius: 3, overflow: 'hidden' }}>
                        <div
                          style={{
                            height: '100%',
                            width: `${pct}%`,
                            background: exp.color,
                            borderRadius: 3,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* Monthly Cash Flow */}
          <motion.div
            className="card mb-6"
            custom={6}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Monthly Cash Flow</h3>
                <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b' }}>
                  Net cash flow: ${monthlyCashFlow.reduce((s, m) => s + m.net, 0).toLocaleString()}
                </p>
              </div>
              <div className="flex gap-3" style={{ fontSize: 12 }}>
                <span className="flex items-center gap-2"><span style={{ width: 10, height: 10, borderRadius: 2, background: '#10b981', display: 'inline-block' }} /> Inflow</span>
                <span className="flex items-center gap-2"><span style={{ width: 10, height: 10, borderRadius: 2, background: '#ef4444', display: 'inline-block' }} /> Outflow</span>
                <span className="flex items-center gap-2"><span style={{ width: 10, height: 10, borderRadius: 2, background: '#3b82f6', display: 'inline-block' }} /> Net</span>
              </div>
            </div>
            <div style={{ height: 340 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyCashFlow} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#94a3b8' }}
                    tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="inflow"
                    name="Inflow"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ fill: '#10b981', r: 3 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="outflow"
                    name="Outflow"
                    stroke="#ef4444"
                    strokeWidth={2}
                    dot={{ fill: '#ef4444', r: 3 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="net"
                    name="Net Cash Flow"
                    stroke="#3b82f6"
                    strokeWidth={2.5}
                    dot={{ fill: '#3b82f6', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Financial Summary Table */}
          <motion.div
            className="card mb-6"
            custom={7}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileText size={18} color="#3b82f6" />
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Profit & Loss Summary</h3>
              </div>
              <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: 12 }}>
                <Download size={14} /> Download P&L
              </button>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th style={{ textAlign: 'right' }}>Amount</th>
                  <th style={{ textAlign: 'right' }}>% of Revenue</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ fontWeight: 600 }}>Gross Revenue</td>
                  <td style={{ textAlign: 'right', fontWeight: 600 }}>$3,425,700</td>
                  <td style={{ textAlign: 'right', color: '#64748b' }}>100.0%</td>
                </tr>
                <tr>
                  <td style={{ paddingLeft: 32 }}>Cost of Goods Sold</td>
                  <td style={{ textAlign: 'right', color: '#dc2626' }}>($2,054,420)</td>
                  <td style={{ textAlign: 'right', color: '#64748b' }}>60.0%</td>
                </tr>
                <tr style={{ background: '#f8fafc' }}>
                  <td style={{ fontWeight: 600 }}>Gross Profit</td>
                  <td style={{ textAlign: 'right', fontWeight: 600, color: '#16a34a' }}>$1,371,280</td>
                  <td style={{ textAlign: 'right', color: '#64748b' }}>40.0%</td>
                </tr>
                <tr>
                  <td style={{ paddingLeft: 32 }}>Salaries & Wages</td>
                  <td style={{ textAlign: 'right' }}>($342,800)</td>
                  <td style={{ textAlign: 'right', color: '#64748b' }}>10.0%</td>
                </tr>
                <tr>
                  <td style={{ paddingLeft: 32 }}>Rent & Utilities</td>
                  <td style={{ textAlign: 'right' }}>($124,500)</td>
                  <td style={{ textAlign: 'right', color: '#64748b' }}>3.6%</td>
                </tr>
                <tr>
                  <td style={{ paddingLeft: 32 }}>Transport & Logistics</td>
                  <td style={{ textAlign: 'right' }}>($98,200)</td>
                  <td style={{ textAlign: 'right', color: '#64748b' }}>2.9%</td>
                </tr>
                <tr>
                  <td style={{ paddingLeft: 32 }}>Marketing</td>
                  <td style={{ textAlign: 'right' }}>($45,600)</td>
                  <td style={{ textAlign: 'right', color: '#64748b' }}>1.3%</td>
                </tr>
                <tr>
                  <td style={{ paddingLeft: 32 }}>Insurance & Taxes</td>
                  <td style={{ textAlign: 'right' }}>($38,400)</td>
                  <td style={{ textAlign: 'right', color: '#64748b' }}>1.1%</td>
                </tr>
                <tr>
                  <td style={{ paddingLeft: 32 }}>Other Operating</td>
                  <td style={{ textAlign: 'right' }}>($36,140)</td>
                  <td style={{ textAlign: 'right', color: '#64748b' }}>1.1%</td>
                </tr>
                <tr style={{ background: '#ecfdf5', borderTop: '2px solid #10b981' }}>
                  <td style={{ fontWeight: 700, fontSize: 15 }}>Net Profit</td>
                  <td style={{ textAlign: 'right', fontWeight: 700, fontSize: 15, color: '#16a34a' }}>$685,640</td>
                  <td style={{ textAlign: 'right', fontWeight: 600, color: '#16a34a' }}>20.0%</td>
                </tr>
              </tbody>
            </table>
          </motion.div>
        </div>
      )}
    </div>
  );
}
