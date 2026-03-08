import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Search,
  CreditCard,
  Banknote,
  Receipt,
  ChevronDown,
  ChevronUp,
  Check,
  X,
  User,
  Tag,
  Clock,
} from 'lucide-react';

// ── Demo Products ──────────────────────────────────────────────────────────────

interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  category: string;
  color: string;
  inStock: number;
}

const demoProducts: Product[] = [
  { id: 'p1', name: 'Portland Cement 50kg', sku: 'BM-CEM-050', price: 49.99, category: 'Building', color: '#64748b', inStock: 340 },
  { id: 'p2', name: 'Roofing Sheet 3m', sku: 'RF-SHT-003', price: 65.00, category: 'Building', color: '#475569', inStock: 128 },
  { id: 'p3', name: 'Steel Rebar 12mm (6m)', sku: 'ST-REB-012', price: 18.50, category: 'Building', color: '#78716c', inStock: 560 },
  { id: 'p4', name: '2.5mm Twin Cable 100m', sku: 'EL-CBL-214', price: 52.00, category: 'Electronics', color: '#3b82f6', inStock: 22 },
  { id: 'p5', name: 'LED Panel Light 60x60', sku: 'EL-LED-060', price: 34.99, category: 'Electronics', color: '#60a5fa', inStock: 85 },
  { id: 'p6', name: 'Circuit Breaker 32A', sku: 'EL-BRK-032', price: 12.75, category: 'Electronics', color: '#2563eb', inStock: 200 },
  { id: 'p7', name: 'Emulsion Paint 20L White', sku: 'PT-EMU-001', price: 89.99, category: 'Paint', color: '#f8fafc', inStock: 47 },
  { id: 'p8', name: 'Gloss Paint 5L Black', sku: 'PT-GLS-005', price: 42.50, category: 'Paint', color: '#0f172a', inStock: 63 },
  { id: 'p9', name: '32mm PVC Pipe 6m', sku: 'PL-PVC-032', price: 8.99, category: 'Plumbing', color: '#06b6d4', inStock: 310 },
  { id: 'p10', name: '15mm Copper Elbow', sku: 'PL-CPR-015', price: 3.25, category: 'Plumbing', color: '#f59e0b', inStock: 450 },
  { id: 'p11', name: 'M10 Hex Bolts Box/100', sku: 'HW-BLT-M10', price: 14.00, category: 'Hardware', color: '#a8a29e', inStock: 175 },
  { id: 'p12', name: 'Safety Helmet Yellow', sku: 'SF-HLM-YEL', price: 9.50, category: 'Safety', color: '#eab308', inStock: 90 },
  { id: 'p13', name: 'Work Gloves Pair', sku: 'SF-GLV-001', price: 6.99, category: 'Safety', color: '#84cc16', inStock: 220 },
  { id: 'p14', name: 'Tape Measure 5m', sku: 'HW-TAP-005', price: 7.25, category: 'Hardware', color: '#f97316', inStock: 150 },
  { id: 'p15', name: 'Wheelbarrow Heavy Duty', sku: 'HW-WBR-001', price: 125.00, category: 'Hardware', color: '#16a34a', inStock: 18 },
  { id: 'p16', name: 'Sand per Ton', sku: 'BM-SND-001', price: 35.00, category: 'Building', color: '#d4a574', inStock: 999 },
];

const categories = ['All', 'Building', 'Electronics', 'Paint', 'Plumbing', 'Hardware', 'Safety'];

// ── Cart Item ──────────────────────────────────────────────────────────────────

interface CartItem {
  product: Product;
  qty: number;
}

// ── Customers ──────────────────────────────────────────────────────────────────

const customers = [
  { id: 'c0', name: 'Walk-in Customer' },
  { id: 'c1', name: 'Greenfield Hardware Ltd' },
  { id: 'c2', name: 'Metro Construction Co.' },
  { id: 'c3', name: 'Sunrise Plumbing Supplies' },
  { id: 'c4', name: 'Apex Electrical Distributors' },
  { id: 'c5', name: 'Valley Farm Equipment' },
  { id: 'c6', name: 'Pinnacle Builders Inc.' },
];

// ── Recent Transactions ────────────────────────────────────────────────────────

const recentTransactions = [
  { id: 'RCT-2024-4782', customer: 'Greenfield Hardware Ltd', items: 8, total: 12450.00, payment: 'Card', time: '14:32', status: 'completed' },
  { id: 'RCT-2024-4781', customer: 'Metro Construction Co.', items: 15, total: 34200.50, payment: 'Card', time: '13:15', status: 'completed' },
  { id: 'RCT-2024-4780', customer: 'Sunrise Plumbing Supplies', items: 3, total: 2875.00, payment: 'Cash', time: '12:48', status: 'pending' },
  { id: 'RCT-2024-4779', customer: 'Apex Electrical Distributors', items: 22, total: 56780.00, payment: 'Card', time: '11:20', status: 'completed' },
  { id: 'RCT-2024-4778', customer: 'Valley Farm Equipment', items: 5, total: 8340.75, payment: 'Cash', time: '10:05', status: 'completed' },
  { id: 'RCT-2024-4777', customer: 'Walk-in Customer', items: 2, total: 139.98, payment: 'Cash', time: '09:42', status: 'completed' },
  { id: 'RCT-2024-4776', customer: 'Pinnacle Builders Inc.', items: 11, total: 4215.25, payment: 'Card', time: '09:10', status: 'refunded' },
  { id: 'RCT-2024-4775', customer: 'Walk-in Customer', items: 1, total: 65.00, payment: 'Cash', time: '08:55', status: 'completed' },
];

// ── Animation Variants ─────────────────────────────────────────────────────────

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const TAX_RATE = 0.085;

// ── Component ──────────────────────────────────────────────────────────────────

export default function Sales() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Card'>('Cash');
  const [discountInput, setDiscountInput] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState('c0');
  const [showTransactions, setShowTransactions] = useState(false);

  // Filtering
  const filteredProducts = demoProducts.filter((p) => {
    const matchCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchSearch =
      search === '' ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  // Cart helpers
  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.product.id === product.id);
      if (existing) {
        return prev.map((c) =>
          c.product.id === product.id ? { ...c, qty: c.qty + 1 } : c
        );
      }
      return [...prev, { product, qty: 1 }];
    });
  };

  const updateQty = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((c) =>
          c.product.id === productId ? { ...c, qty: Math.max(0, c.qty + delta) } : c
        )
        .filter((c) => c.qty > 0)
    );
  };

  const removeItem = (productId: string) => {
    setCart((prev) => prev.filter((c) => c.product.id !== productId));
  };

  const clearCart = () => setCart([]);

  // Cart totals
  const subtotal = cart.reduce((sum, c) => sum + c.product.price * c.qty, 0);
  const discountAmount = discountInput ? parseFloat(discountInput) || 0 : 0;
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const tax = taxableAmount * TAX_RATE;
  const total = taxableAmount + tax;

  const statusBadge = (status: string) => {
    switch (status) {
      case 'completed': return 'badge-green';
      case 'pending': return 'badge-yellow';
      case 'refunded': return 'badge-red';
      default: return 'badge-gray';
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Point of Sale</h1>
          <p style={{ color: '#64748b', fontSize: 14, margin: '4px 0 0' }}>
            Process sales and manage transactions
          </p>
        </div>
        <div className="flex gap-2">
          <button
            className="btn btn-secondary"
            onClick={() => setShowTransactions(!showTransactions)}
          >
            <Receipt size={16} /> Recent Sales
            {showTransactions ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>
      </div>

      {/* POS Layout: Product Grid + Cart */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 20 }}>
        {/* ── LEFT: Product Grid ──────────────────────────────────────────── */}
        <motion.div
          className="card"
          custom={0}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          style={{ padding: 20 }}
        >
          {/* Search + Category Filters */}
          <div className="flex items-center gap-3 mb-4">
            <div style={{ position: 'relative', flex: 1 }}>
              <Search
                size={16}
                style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}
              />
              <input
                className="input"
                placeholder="Search products by name or SKU..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ paddingLeft: 36 }}
              />
            </div>
          </div>

          <div className="flex gap-2 mb-4" style={{ flexWrap: 'wrap' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                className={`btn ${selectedCategory === cat ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '6px 14px', fontSize: 13 }}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Product Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))',
              gap: 12,
              maxHeight: 520,
              overflowY: 'auto',
              paddingRight: 4,
            }}
          >
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => addToCart(product)}
                style={{
                  background: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: 10,
                  padding: 12,
                  cursor: 'pointer',
                  transition: 'box-shadow 0.15s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)')}
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
              >
                {/* Color placeholder image */}
                <div
                  style={{
                    width: '100%',
                    height: 80,
                    borderRadius: 8,
                    background: product.color,
                    marginBottom: 10,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: product.color === '#f8fafc' || product.color === '#d4a574' ? '#64748b' : '#fff',
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: 0.5,
                  }}
                >
                  {product.sku}
                </div>
                <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 4, lineHeight: 1.3 }}>
                  {product.name}
                </div>
                <div className="flex items-center justify-between">
                  <span style={{ fontWeight: 700, color: '#3b82f6', fontSize: 15 }}>
                    ${product.price.toFixed(2)}
                  </span>
                  <span style={{ fontSize: 11, color: '#94a3b8' }}>
                    {product.inStock} in stock
                  </span>
                </div>
              </motion.div>
            ))}
            {filteredProducts.length === 0 && (
              <div className="empty-state" style={{ gridColumn: '1 / -1', padding: '40px 20px' }}>
                <Search size={36} style={{ marginBottom: 12, opacity: 0.4 }} />
                <h3>No products found</h3>
                <p>Try adjusting your search or category filter</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* ── RIGHT: Cart / Checkout Panel ────────────────────────────────── */}
        <motion.div
          className="card"
          custom={1}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          style={{ padding: 0, display: 'flex', flexDirection: 'column' }}
        >
          {/* Cart Header */}
          <div
            className="flex items-center justify-between"
            style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0' }}
          >
            <div className="flex items-center gap-2">
              <ShoppingCart size={18} />
              <span style={{ fontWeight: 600, fontSize: 16 }}>Cart</span>
              {cart.length > 0 && (
                <span className="badge badge-blue">{cart.reduce((s, c) => s + c.qty, 0)}</span>
              )}
            </div>
            {cart.length > 0 && (
              <button
                className="btn btn-secondary"
                style={{ padding: '4px 10px', fontSize: 12 }}
                onClick={clearCart}
              >
                <X size={12} /> Clear
              </button>
            )}
          </div>

          {/* Customer Selector */}
          <div style={{ padding: '12px 20px', borderBottom: '1px solid #f1f5f9' }}>
            <div className="flex items-center gap-2" style={{ fontSize: 13, color: '#64748b', marginBottom: 6 }}>
              <User size={14} /> Customer
            </div>
            <select
              className="select"
              style={{ width: '100%' }}
              value={selectedCustomer}
              onChange={(e) => setSelectedCustomer(e.target.value)}
            >
              {customers.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Cart Items */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
            <AnimatePresence>
              {cart.length === 0 ? (
                <div className="empty-state" style={{ padding: '40px 20px' }}>
                  <ShoppingCart size={36} style={{ marginBottom: 12, opacity: 0.3 }} />
                  <h3 style={{ fontSize: 15 }}>Cart is empty</h3>
                  <p style={{ fontSize: 13 }}>Click products to add them</p>
                </div>
              ) : (
                cart.map((item) => (
                  <motion.div
                    key={item.product.id}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    style={{
                      padding: '10px 20px',
                      borderBottom: '1px solid #f1f5f9',
                    }}
                  >
                    <div className="flex items-center justify-between" style={{ marginBottom: 4 }}>
                      <span style={{ fontWeight: 500, fontSize: 14, flex: 1, marginRight: 8 }}>
                        {item.product.name}
                      </span>
                      <button
                        onClick={() => removeItem(item.product.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#ef4444',
                          cursor: 'pointer',
                          padding: 4,
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          className="btn btn-secondary"
                          style={{ padding: '2px 8px', minWidth: 28, fontSize: 14 }}
                          onClick={() => updateQty(item.product.id, -1)}
                        >
                          <Minus size={12} />
                        </button>
                        <span style={{ fontWeight: 600, fontSize: 14, minWidth: 20, textAlign: 'center' }}>
                          {item.qty}
                        </span>
                        <button
                          className="btn btn-secondary"
                          style={{ padding: '2px 8px', minWidth: 28, fontSize: 14 }}
                          onClick={() => updateQty(item.product.id, 1)}
                        >
                          <Plus size={12} />
                        </button>
                        <span style={{ fontSize: 12, color: '#94a3b8' }}>
                          @ ${item.product.price.toFixed(2)}
                        </span>
                      </div>
                      <span style={{ fontWeight: 600, fontSize: 14 }}>
                        ${(item.product.price * item.qty).toFixed(2)}
                      </span>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>

          {/* Cart Summary + Checkout */}
          <div style={{ borderTop: '2px solid #e2e8f0', padding: '16px 20px' }}>
            {/* Discount Input */}
            <div className="flex items-center gap-2 mb-4">
              <Tag size={14} color="#64748b" />
              <input
                className="input"
                placeholder="Discount ($)"
                value={discountInput}
                onChange={(e) => setDiscountInput(e.target.value)}
                style={{ flex: 1, padding: '8px 12px' }}
                type="number"
                min="0"
                step="0.01"
              />
            </div>

            {/* Summary Lines */}
            <div style={{ fontSize: 14, marginBottom: 12 }}>
              <div className="flex items-center justify-between" style={{ marginBottom: 6 }}>
                <span style={{ color: '#64748b' }}>Subtotal</span>
                <span style={{ fontWeight: 500 }}>${subtotal.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex items-center justify-between" style={{ marginBottom: 6 }}>
                  <span style={{ color: '#ef4444' }}>Discount</span>
                  <span style={{ fontWeight: 500, color: '#ef4444' }}>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex items-center justify-between" style={{ marginBottom: 6 }}>
                <span style={{ color: '#64748b' }}>Tax (8.5%)</span>
                <span style={{ fontWeight: 500 }}>${tax.toFixed(2)}</span>
              </div>
              <div
                className="flex items-center justify-between"
                style={{ borderTop: '1px solid #e2e8f0', paddingTop: 8, marginTop: 4 }}
              >
                <span style={{ fontWeight: 700, fontSize: 16 }}>Total</span>
                <span style={{ fontWeight: 700, fontSize: 20, color: '#0f172a' }}>
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Payment Method Tabs */}
            <div className="flex gap-2 mb-4">
              <button
                className={`btn ${paymentMethod === 'Cash' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ flex: 1, justifyContent: 'center' }}
                onClick={() => setPaymentMethod('Cash')}
              >
                <Banknote size={16} /> Cash
              </button>
              <button
                className={`btn ${paymentMethod === 'Card' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ flex: 1, justifyContent: 'center' }}
                onClick={() => setPaymentMethod('Card')}
              >
                <CreditCard size={16} /> Card
              </button>
            </div>

            {/* Complete Sale Button */}
            <button
              className="btn btn-success"
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: '14px 20px',
                fontSize: 16,
                fontWeight: 600,
                opacity: cart.length === 0 ? 0.5 : 1,
                pointerEvents: cart.length === 0 ? 'none' : 'auto',
              }}
              onClick={() => {
                if (cart.length > 0) {
                  clearCart();
                  setDiscountInput('');
                }
              }}
            >
              <Check size={18} /> Complete Sale
            </button>
          </div>
        </motion.div>
      </div>

      {/* ── Recent Transactions ────────────────────────────────────────────── */}
      <AnimatePresence>
        {showTransactions && (
          <motion.div
            className="card mt-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: 'hidden', marginTop: 20 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock size={18} color="#64748b" />
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Recent Transactions</h3>
              </div>
              <span style={{ fontSize: 13, color: '#64748b' }}>Today</span>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Receipt #</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((tx) => (
                  <tr key={tx.id}>
                    <td style={{ fontWeight: 500, fontFamily: 'monospace', fontSize: 13 }}>{tx.id}</td>
                    <td style={{ fontWeight: 500 }}>{tx.customer}</td>
                    <td>{tx.items}</td>
                    <td style={{ fontWeight: 600 }}>
                      ${tx.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td>
                      <span className="flex items-center gap-2" style={{ fontSize: 13 }}>
                        {tx.payment === 'Cash' ? <Banknote size={14} /> : <CreditCard size={14} />}
                        {tx.payment}
                      </span>
                    </td>
                    <td style={{ color: '#64748b' }}>{tx.time}</td>
                    <td>
                      <span className={`badge ${statusBadge(tx.status)}`}>{tx.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
