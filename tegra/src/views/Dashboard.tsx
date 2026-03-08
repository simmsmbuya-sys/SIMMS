import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  DollarSign,
  ShoppingCart,
  Package,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Banknote,
  Smartphone,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Eye,
} from 'lucide-react';

const revenueData = [
  { day: 'Mon', revenue: 32400, orders: 38 },
  { day: 'Tue', revenue: 41200, orders: 52 },
  { day: 'Wed', revenue: 38700, orders: 45 },
  { day: 'Thu', revenue: 45100, orders: 58 },
  { day: 'Fri', revenue: 52300, orders: 67 },
  { day: 'Sat', revenue: 48900, orders: 61 },
  { day: 'Sun', revenue: 25920, orders: 34 },
];

const recentTransactions = [
  {
    id: 'RCT-2024-4782',
    customer: 'Greenfield Hardware Ltd',
    items: 8,
    amount: 12450.0,
    payment: 'Bank Transfer',
    status: 'completed',
    time: '14:32',
  },
  {
    id: 'RCT-2024-4781',
    customer: 'Metro Construction Co.',
    items: 15,
    amount: 34200.5,
    payment: 'Credit Card',
    status: 'completed',
    time: '13:15',
  },
  {
    id: 'RCT-2024-4780',
    customer: 'Sunrise Plumbing Supplies',
    items: 3,
    amount: 2875.0,
    payment: 'Mobile Money',
    status: 'pending',
    time: '12:48',
  },
  {
    id: 'RCT-2024-4779',
    customer: 'Apex Electrical Distributors',
    items: 22,
    amount: 56780.0,
    payment: 'Bank Transfer',
    status: 'completed',
    time: '11:20',
  },
  {
    id: 'RCT-2024-4778',
    customer: 'Valley Farm Equipment',
    items: 5,
    amount: 8340.75,
    payment: 'Cash',
    status: 'completed',
    time: '10:05',
  },
];

const lowStockAlerts = [
  { sku: 'HW-PVC-032', name: '32mm PVC Pipe (6m)', current: 8, reorder: 50, category: 'Plumbing' },
  { sku: 'EL-CBL-214', name: '2.5mm Twin Cable (100m)', current: 3, reorder: 25, category: 'Electrical' },
  { sku: 'PT-EMU-001', name: 'Emulsion Paint 20L White', current: 12, reorder: 40, category: 'Paint' },
  { sku: 'HW-BLT-M10', name: 'M10 Hex Bolts (Box/100)', current: 5, reorder: 30, category: 'Fasteners' },
  { sku: 'PL-CPR-015', name: '15mm Copper Elbow', current: 18, reorder: 60, category: 'Plumbing' },
];

const topProducts = [
  { name: 'Portland Cement 50kg', unitsSold: 1247, revenue: 62350, trend: 12.3 },
  { name: 'Roofing Sheets (3m)', unitsSold: 834, revenue: 54210, trend: 8.7 },
  { name: 'Steel Rebar 12mm', unitsSold: 2150, revenue: 43000, trend: -2.1 },
  { name: 'Emulsion Paint 20L', unitsSold: 423, revenue: 38070, trend: 15.4 },
  { name: 'Electrical Wire 2.5mm', unitsSold: 612, revenue: 30600, trend: 5.9 },
];

const paymentIcon = (method: string) => {
  switch (method) {
    case 'Bank Transfer': return <Banknote size={14} />;
    case 'Credit Card': return <CreditCard size={14} />;
    case 'Mobile Money': return <Smartphone size={14} />;
    case 'Cash': return <DollarSign size={14} />;
    default: return <DollarSign size={14} />;
  }
};

const statCards = [
  {
    title: 'Total Revenue',
    value: '$284,520',
    change: '+12.5%',
    positive: true,
    subtitle: 'vs last month',
    icon: DollarSign,
    color: '#3b82f6',
    bg: '#eff6ff',
  },
  {
    title: 'Orders Today',
    value: '47',
    change: '+8.2%',
    positive: true,
    subtitle: 'vs yesterday',
    icon: ShoppingCart,
    color: '#8b5cf6',
    bg: '#f5f3ff',
  },
  {
    title: 'Inventory Value',
    value: '$1.2M',
    change: '-2.4%',
    positive: false,
    subtitle: 'vs last month',
    icon: Package,
    color: '#10b981',
    bg: '#ecfdf5',
  },
  {
    title: 'Low Stock Alerts',
    value: '12',
    change: '+3',
    positive: false,
    subtitle: 'items need reorder',
    icon: AlertTriangle,
    color: '#f59e0b',
    bg: '#fffbeb',
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

export default function Dashboard() {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Dashboard</h1>
          <p style={{ color: '#64748b', fontSize: 14, margin: '4px 0 0' }}>
            Welcome back. Here's what's happening today.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-secondary">
            <Eye size={16} /> View Reports
          </button>
        </div>
      </div>

      {/* Stat Cards */}
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
              <div className={`change ${stat.positive ? 'positive' : 'negative'}`}>
                <span className="flex items-center gap-2">
                  {stat.positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  {stat.change} {stat.subtitle}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Revenue Chart & Recent Transactions */}
      <div className="grid-2 mb-6">
        <motion.div
          className="card"
          custom={4}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Revenue Overview</h3>
              <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b' }}>Last 7 days</p>
            </div>
            <div className="flex items-center gap-2" style={{ fontSize: 13, color: '#64748b' }}>
              <TrendingUp size={14} color="#16a34a" />
              <span style={{ color: '#16a34a', fontWeight: 600 }}>+14.2%</span> vs prior week
            </div>
          </div>
          <div style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#94a3b8' }}
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{
                    background: '#0f172a',
                    border: 'none',
                    borderRadius: 8,
                    color: '#e2e8f0',
                    fontSize: 13,
                  }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3b82f6"
                  strokeWidth={2.5}
                  fill="url(#revenueGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          className="card"
          custom={5}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Recent Transactions</h3>
            <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: 12 }}>
              View All
            </button>
          </div>
          <table>
            <thead>
              <tr>
                <th>Receipt #</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Payment</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.map((tx) => (
                <tr
                  key={tx.id}
                  onMouseEnter={() => setHoveredRow(tx.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                  style={{ cursor: 'pointer' }}
                >
                  <td style={{ fontWeight: 500, fontFamily: 'monospace', fontSize: 13 }}>{tx.id}</td>
                  <td>
                    <div style={{ fontWeight: 500 }}>{tx.customer}</div>
                    <div style={{ fontSize: 12, color: '#94a3b8' }}>{tx.items} items &middot; {tx.time}</div>
                  </td>
                  <td style={{ fontWeight: 600 }}>${tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  <td>
                    <span className="flex items-center gap-2" style={{ fontSize: 13 }}>
                      {paymentIcon(tx.payment)} {tx.payment}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${tx.status === 'completed' ? 'badge-green' : 'badge-yellow'}`}>
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>

      {/* Low Stock & Top Products */}
      <div className="grid-2 mb-6">
        <motion.div
          className="card"
          custom={6}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle size={18} color="#f59e0b" />
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Low Stock Alerts</h3>
            </div>
            <span className="badge badge-red">12 items</span>
          </div>
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>SKU</th>
                <th>Stock</th>
                <th>Reorder Pt</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {lowStockAlerts.map((item) => {
                const ratio = item.current / item.reorder;
                const severity = ratio < 0.15 ? 'badge-red' : ratio < 0.35 ? 'badge-yellow' : 'badge-blue';
                const label = ratio < 0.15 ? 'Critical' : ratio < 0.35 ? 'Low' : 'Warning';
                return (
                  <tr key={item.sku}>
                    <td>
                      <div style={{ fontWeight: 500 }}>{item.name}</div>
                      <div style={{ fontSize: 12, color: '#94a3b8' }}>{item.category}</div>
                    </td>
                    <td style={{ fontFamily: 'monospace', fontSize: 13 }}>{item.sku}</td>
                    <td style={{ fontWeight: 600, color: ratio < 0.15 ? '#dc2626' : '#f59e0b' }}>
                      {item.current}
                    </td>
                    <td>{item.reorder}</td>
                    <td>
                      <span className={`badge ${severity}`}>{label}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </motion.div>

        <motion.div
          className="card"
          custom={7}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp size={18} color="#3b82f6" />
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Top Selling Products</h3>
            </div>
            <span style={{ fontSize: 13, color: '#64748b' }}>This month</span>
          </div>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Product</th>
                <th>Units Sold</th>
                <th>Revenue</th>
                <th>Trend</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map((product, idx) => (
                <tr key={product.name}>
                  <td style={{ fontWeight: 600, color: '#94a3b8' }}>{idx + 1}</td>
                  <td style={{ fontWeight: 500 }}>{product.name}</td>
                  <td>{product.unitsSold.toLocaleString()}</td>
                  <td style={{ fontWeight: 600 }}>${product.revenue.toLocaleString()}</td>
                  <td>
                    <span
                      className="flex items-center gap-2"
                      style={{
                        color: product.trend >= 0 ? '#16a34a' : '#dc2626',
                        fontWeight: 500,
                        fontSize: 13,
                      }}
                    >
                      {product.trend >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                      {product.trend >= 0 ? '+' : ''}{product.trend}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    </div>
  );
}
