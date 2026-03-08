import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package,
  Search,
  Plus,
  Filter,
  AlertTriangle,
  Check,
  X,
  Edit,
  Trash2,
  Download,
  ChevronDown,
  MoreHorizontal,
  ArrowUpDown,
  PackageMinus,
  PackagePlus,
  Ban,
} from 'lucide-react';

interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  stockQty: number;
  reserved: number;
  available: number;
  costPrice: number;
  sellingPrice: number;
  reorderPoint: number;
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
}

const demoProducts: Product[] = [
  { id: '1', sku: 'ELC-001', name: 'Wireless Bluetooth Headphones', category: 'Electronics', stockQty: 245, reserved: 18, available: 227, costPrice: 32.50, sellingPrice: 79.99, reorderPoint: 50, status: 'in-stock' },
  { id: '2', sku: 'ELC-014', name: 'USB-C Fast Charging Cable 2m', category: 'Electronics', stockQty: 520, reserved: 45, available: 475, costPrice: 3.20, sellingPrice: 12.99, reorderPoint: 100, status: 'in-stock' },
  { id: '3', sku: 'ELC-027', name: 'Portable Power Bank 20000mAh', category: 'Electronics', stockQty: 12, reserved: 5, available: 7, costPrice: 18.75, sellingPrice: 44.99, reorderPoint: 30, status: 'low-stock' },
  { id: '4', sku: 'CLT-015', name: 'Men\'s Cotton Crew T-Shirt', category: 'Clothing', stockQty: 380, reserved: 22, available: 358, costPrice: 5.40, sellingPrice: 24.99, reorderPoint: 60, status: 'in-stock' },
  { id: '5', sku: 'CLT-032', name: 'Women\'s Running Leggings', category: 'Clothing', stockQty: 0, reserved: 0, available: 0, costPrice: 12.80, sellingPrice: 49.99, reorderPoint: 40, status: 'out-of-stock' },
  { id: '6', sku: 'CLT-048', name: 'Unisex Waterproof Jacket', category: 'Clothing', stockQty: 8, reserved: 3, available: 5, costPrice: 28.60, sellingPrice: 89.99, reorderPoint: 20, status: 'low-stock' },
  { id: '7', sku: 'FD-003', name: 'Organic Extra Virgin Olive Oil 1L', category: 'Food', stockQty: 165, reserved: 12, available: 153, costPrice: 6.90, sellingPrice: 16.99, reorderPoint: 40, status: 'in-stock' },
  { id: '8', sku: 'FD-019', name: 'Premium Basmati Rice 5kg', category: 'Food', stockQty: 0, reserved: 0, available: 0, costPrice: 4.50, sellingPrice: 12.49, reorderPoint: 80, status: 'out-of-stock' },
  { id: '9', sku: 'FD-041', name: 'Dark Chocolate Bar 85% Cocoa', category: 'Food', stockQty: 430, reserved: 30, available: 400, costPrice: 1.80, sellingPrice: 5.99, reorderPoint: 100, status: 'in-stock' },
  { id: '10', sku: 'HM-007', name: 'Stainless Steel Kitchen Scale', category: 'Home', stockQty: 6, reserved: 2, available: 4, costPrice: 14.20, sellingPrice: 34.99, reorderPoint: 15, status: 'low-stock' },
  { id: '11', sku: 'HM-022', name: 'Memory Foam Pillow Set (2pc)', category: 'Home', stockQty: 92, reserved: 8, available: 84, costPrice: 18.50, sellingPrice: 54.99, reorderPoint: 20, status: 'in-stock' },
  { id: '12', sku: 'HM-038', name: 'LED Desk Lamp with USB Port', category: 'Home', stockQty: 0, reserved: 0, available: 0, costPrice: 11.30, sellingPrice: 29.99, reorderPoint: 25, status: 'out-of-stock' },
  { id: '13', sku: 'SPT-005', name: 'Yoga Mat 6mm Non-Slip', category: 'Sports', stockQty: 175, reserved: 10, available: 165, costPrice: 8.40, sellingPrice: 29.99, reorderPoint: 30, status: 'in-stock' },
  { id: '14', sku: 'SPT-018', name: 'Adjustable Dumbbell Set 20kg', category: 'Sports', stockQty: 4, reserved: 1, available: 3, costPrice: 42.00, sellingPrice: 99.99, reorderPoint: 10, status: 'low-stock' },
  { id: '15', sku: 'SPT-029', name: 'Insulated Water Bottle 750ml', category: 'Sports', stockQty: 310, reserved: 25, available: 285, costPrice: 6.20, sellingPrice: 19.99, reorderPoint: 50, status: 'in-stock' },
];

const categories = ['All Categories', 'Electronics', 'Clothing', 'Food', 'Home', 'Sports'];
const statusFilters = ['All', 'In Stock', 'Low Stock', 'Out of Stock'];
const sortOptions = ['Name A-Z', 'Name Z-A', 'Stock: Low to High', 'Stock: High to Low', 'Price: Low to High', 'Price: High to Low'];

const statusBadge = (status: string) => {
  switch (status) {
    case 'in-stock': return <span className="badge badge-green">In Stock</span>;
    case 'low-stock': return <span className="badge badge-yellow">Low Stock</span>;
    case 'out-of-stock': return <span className="badge badge-red">Out of Stock</span>;
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

const emptyProduct = {
  sku: '',
  name: '',
  category: 'Electronics',
  stockQty: 0,
  costPrice: 0,
  sellingPrice: 0,
  reorderPoint: 0,
};

export default function Inventory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Name A-Z');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [adjustProduct, setAdjustProduct] = useState<Product | null>(null);
  const [adjustType, setAdjustType] = useState<'add' | 'remove' | 'set'>('add');
  const [adjustQty, setAdjustQty] = useState(0);
  const [adjustReason, setAdjustReason] = useState('');
  const [newProduct, setNewProduct] = useState(emptyProduct);

  const stats = [
    { title: 'Total Products', value: '1,247', icon: Package, color: '#3b82f6', bg: '#eff6ff' },
    { title: 'In Stock', value: '1,089', icon: Check, color: '#10b981', bg: '#ecfdf5' },
    { title: 'Low Stock', value: '98', icon: AlertTriangle, color: '#f59e0b', bg: '#fffbeb' },
    { title: 'Out of Stock', value: '60', icon: Ban, color: '#ef4444', bg: '#fef2f2' },
  ];

  const filteredProducts = useMemo(() => {
    let items = [...demoProducts];

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      items = items.filter(p => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q));
    }
    if (categoryFilter !== 'All Categories') {
      items = items.filter(p => p.category === categoryFilter);
    }
    if (statusFilter !== 'All') {
      const statusMap: Record<string, string> = { 'In Stock': 'in-stock', 'Low Stock': 'low-stock', 'Out of Stock': 'out-of-stock' };
      items = items.filter(p => p.status === statusMap[statusFilter]);
    }

    switch (sortBy) {
      case 'Name A-Z': items.sort((a, b) => a.name.localeCompare(b.name)); break;
      case 'Name Z-A': items.sort((a, b) => b.name.localeCompare(a.name)); break;
      case 'Stock: Low to High': items.sort((a, b) => a.stockQty - b.stockQty); break;
      case 'Stock: High to Low': items.sort((a, b) => b.stockQty - a.stockQty); break;
      case 'Price: Low to High': items.sort((a, b) => a.sellingPrice - b.sellingPrice); break;
      case 'Price: High to Low': items.sort((a, b) => b.sellingPrice - a.sellingPrice); break;
    }

    return items;
  }, [searchTerm, categoryFilter, statusFilter, sortBy]);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedIds.size === filteredProducts.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredProducts.map(p => p.id)));
    }
  };

  const openAdjustModal = (product: Product) => {
    setAdjustProduct(product);
    setAdjustType('add');
    setAdjustQty(0);
    setAdjustReason('');
    setShowAdjustModal(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Inventory</h1>
          <p style={{ color: '#64748b', fontSize: 14, margin: '4px 0 0' }}>
            Manage your products and stock levels
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => { setNewProduct(emptyProduct); setShowAddModal(true); }}>
          <Plus size={16} /> Add Product
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

      {/* Filter Bar */}
      <motion.div className="card mb-4" custom={4} initial="hidden" animate="visible" variants={cardVariants}>
        <div className="flex items-center gap-3" style={{ flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: '1 1 250px' }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              className="input"
              placeholder="Search products by name or SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: 36, width: '100%' }}
            />
          </div>
          <select className="select" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            {categories.map(c => <option key={c}>{c}</option>)}
          </select>
          <select className="select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            {statusFilters.map(s => <option key={s}>{s}</option>)}
          </select>
          <select className="select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            {sortOptions.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
      </motion.div>

      {/* Bulk Actions */}
      <AnimatePresence>
        {selectedIds.size > 0 && (
          <motion.div
            className="card mb-4"
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            style={{ background: '#eff6ff', border: '1px solid #bfdbfe' }}
          >
            <div className="flex items-center justify-between">
              <span style={{ fontSize: 14, fontWeight: 500, color: '#1e40af' }}>
                {selectedIds.size} item{selectedIds.size > 1 ? 's' : ''} selected
              </span>
              <div className="flex gap-2">
                <button className="btn btn-secondary" style={{ fontSize: 13 }}>
                  <PackagePlus size={14} /> Adjust Stock
                </button>
                <button className="btn btn-secondary" style={{ fontSize: 13 }}>
                  <Download size={14} /> Export
                </button>
                <button className="btn btn-danger" style={{ fontSize: 13 }}>
                  <Ban size={14} /> Deactivate
                </button>
                <button className="btn btn-secondary" onClick={() => setSelectedIds(new Set())} style={{ fontSize: 13 }}>
                  <X size={14} /> Clear
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Products Table */}
      <motion.div className="card" custom={5} initial="hidden" animate="visible" variants={cardVariants}>
        <div className="flex items-center justify-between mb-4">
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>
            Products ({filteredProducts.length})
          </h3>
          <div className="flex items-center gap-2" style={{ fontSize: 13, color: '#64748b' }}>
            <Filter size={14} />
            {categoryFilter !== 'All Categories' || statusFilter !== 'All' ? 'Filtered' : 'All products'}
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="empty-state">
            <Package size={48} strokeWidth={1} />
            <h3>No products found</h3>
            <p>Try adjusting your filters or search term</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th style={{ width: 40 }}>
                    <input
                      type="checkbox"
                      checked={selectedIds.size === filteredProducts.length && filteredProducts.length > 0}
                      onChange={toggleAll}
                    />
                  </th>
                  <th>SKU</th>
                  <th>Product Name</th>
                  <th>Category</th>
                  <th style={{ textAlign: 'right' }}>Stock Qty</th>
                  <th style={{ textAlign: 'right' }}>Reserved</th>
                  <th style={{ textAlign: 'right' }}>Available</th>
                  <th style={{ textAlign: 'right' }}>Cost Price</th>
                  <th style={{ textAlign: 'right' }}>Selling Price</th>
                  <th style={{ textAlign: 'right' }}>Reorder Pt</th>
                  <th>Status</th>
                  <th style={{ width: 80 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} style={{ cursor: 'pointer' }}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedIds.has(product.id)}
                        onChange={() => toggleSelect(product.id)}
                      />
                    </td>
                    <td style={{ fontFamily: 'monospace', fontSize: 13, fontWeight: 500 }}>{product.sku}</td>
                    <td style={{ fontWeight: 500 }}>{product.name}</td>
                    <td>
                      <span className="badge badge-blue" style={{ fontWeight: 400 }}>{product.category}</span>
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: 600, color: product.stockQty === 0 ? '#dc2626' : product.stockQty <= product.reorderPoint ? '#f59e0b' : '#0f172a' }}>
                      {product.stockQty.toLocaleString()}
                    </td>
                    <td style={{ textAlign: 'right', color: '#64748b' }}>{product.reserved}</td>
                    <td style={{ textAlign: 'right', fontWeight: 500 }}>{product.available.toLocaleString()}</td>
                    <td style={{ textAlign: 'right', color: '#64748b' }}>${product.costPrice.toFixed(2)}</td>
                    <td style={{ textAlign: 'right', fontWeight: 600 }}>${product.sellingPrice.toFixed(2)}</td>
                    <td style={{ textAlign: 'right', color: '#64748b' }}>{product.reorderPoint}</td>
                    <td>{statusBadge(product.status)}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <button
                          className="btn btn-secondary"
                          style={{ padding: '4px 8px', fontSize: 12 }}
                          onClick={() => openAdjustModal(product)}
                          title="Adjust Stock"
                        >
                          <ArrowUpDown size={13} />
                        </button>
                        <button
                          className="btn btn-secondary"
                          style={{ padding: '4px 8px', fontSize: 12 }}
                          title="Edit"
                        >
                          <Edit size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Add Product Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              className="modal"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: 600 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>Add New Product</h2>
                <button className="btn btn-secondary" style={{ padding: '4px 8px' }} onClick={() => setShowAddModal(false)}>
                  <X size={16} />
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label>SKU</label>
                  <input className="input" placeholder="e.g. ELC-050" value={newProduct.sku} onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select className="select" value={newProduct.category} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}>
                    {categories.filter(c => c !== 'All Categories').map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Product Name</label>
                  <input className="input" placeholder="Enter product name" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Initial Stock Quantity</label>
                  <input className="input" type="number" min="0" value={newProduct.stockQty} onChange={(e) => setNewProduct({ ...newProduct, stockQty: Number(e.target.value) })} />
                </div>
                <div className="form-group">
                  <label>Reorder Point</label>
                  <input className="input" type="number" min="0" value={newProduct.reorderPoint} onChange={(e) => setNewProduct({ ...newProduct, reorderPoint: Number(e.target.value) })} />
                </div>
                <div className="form-group">
                  <label>Cost Price ($)</label>
                  <input className="input" type="number" min="0" step="0.01" value={newProduct.costPrice} onChange={(e) => setNewProduct({ ...newProduct, costPrice: Number(e.target.value) })} />
                </div>
                <div className="form-group">
                  <label>Selling Price ($)</label>
                  <input className="input" type="number" min="0" step="0.01" value={newProduct.sellingPrice} onChange={(e) => setNewProduct({ ...newProduct, sellingPrice: Number(e.target.value) })} />
                </div>
              </div>

              <div className="flex justify-between" style={{ marginTop: 24, gap: 12 }}>
                <button className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={() => setShowAddModal(false)}>
                  <Plus size={16} /> Add Product
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stock Adjustment Modal */}
      <AnimatePresence>
        {showAdjustModal && adjustProduct && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAdjustModal(false)}
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
                <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>Adjust Stock</h2>
                <button className="btn btn-secondary" style={{ padding: '4px 8px' }} onClick={() => setShowAdjustModal(false)}>
                  <X size={16} />
                </button>
              </div>

              <div style={{ background: '#f8fafc', borderRadius: 8, padding: 16, marginBottom: 20 }}>
                <div style={{ fontWeight: 600, fontSize: 15 }}>{adjustProduct.name}</div>
                <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>
                  SKU: {adjustProduct.sku} &middot; Current Stock: <strong>{adjustProduct.stockQty}</strong>
                </div>
              </div>

              <div className="form-group">
                <label>Adjustment Type</label>
                <div className="flex gap-2">
                  {(['add', 'remove', 'set'] as const).map(type => (
                    <button
                      key={type}
                      className={`btn ${adjustType === type ? 'btn-primary' : 'btn-secondary'}`}
                      onClick={() => setAdjustType(type)}
                      style={{ flex: 1, textTransform: 'capitalize' }}
                    >
                      {type === 'add' && <PackagePlus size={14} />}
                      {type === 'remove' && <PackageMinus size={14} />}
                      {type === 'set' && <Package size={14} />}
                      {type === 'add' ? 'Add' : type === 'remove' ? 'Remove' : 'Set To'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Quantity</label>
                <input
                  className="input"
                  type="number"
                  min="0"
                  value={adjustQty}
                  onChange={(e) => setAdjustQty(Number(e.target.value))}
                />
                {adjustQty > 0 && (
                  <div style={{ fontSize: 13, color: '#64748b', marginTop: 6 }}>
                    New stock level:{' '}
                    <strong>
                      {adjustType === 'add'
                        ? adjustProduct.stockQty + adjustQty
                        : adjustType === 'remove'
                        ? Math.max(0, adjustProduct.stockQty - adjustQty)
                        : adjustQty}
                    </strong>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Reason</label>
                <input
                  className="input"
                  placeholder="e.g. Received new shipment, Damaged goods, Cycle count correction"
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                />
              </div>

              <div className="flex justify-between" style={{ marginTop: 24, gap: 12 }}>
                <button className="btn btn-secondary" onClick={() => setShowAdjustModal(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={() => setShowAdjustModal(false)}>
                  <Check size={16} /> Apply Adjustment
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
