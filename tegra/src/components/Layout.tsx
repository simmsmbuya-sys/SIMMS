import { type ReactNode, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  Package,
  ClipboardList,
  ArrowLeftRight,
  Radio,
  Truck,
  FileText,
  Building2,
  BookOpen,
  BarChart3,
  Settings,
  Menu,
  X,
  ChevronDown,
  Bell,
  Search,
} from "lucide-react";

interface NavItem {
  label: string;
  path: string;
  icon: ReactNode;
  section?: string;
}

const navItems: NavItem[] = [
  { label: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={18} /> },
  { label: "Point of Sale", path: "/sales", icon: <ShoppingCart size={18} />, section: "Sales" },
  { label: "Customers", path: "/customers", icon: <Users size={18} /> },
  { label: "Inventory", path: "/inventory", icon: <Package size={18} />, section: "Operations" },
  { label: "Stocktake", path: "/stocktake", icon: <ClipboardList size={18} /> },
  { label: "Transfers", path: "/transfers", icon: <ArrowLeftRight size={18} /> },
  { label: "RFID Devices", path: "/rfid", icon: <Radio size={18} />, section: "RFID" },
  { label: "Suppliers", path: "/suppliers", icon: <Building2 size={18} />, section: "Supply Chain" },
  { label: "Purchase Orders", path: "/purchase-orders", icon: <FileText size={18} /> },
  { label: "Shipping", path: "/shipping", icon: <Truck size={18} /> },
  { label: "Invoices", path: "/invoices", icon: <FileText size={18} /> },
  { label: "Accounting", path: "/accounting", icon: <BookOpen size={18} />, section: "Finance" },
  { label: "Reports", path: "/reports", icon: <BarChart3 size={18} /> },
  { label: "Settings", path: "/settings", icon: <Settings size={18} />, section: "System" },
];

export function Layout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const currentPage = navItems.find((item) => item.path === location.pathname);

  return (
    <div>
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div style={{ padding: "20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: 36, height: 36, borderRadius: 8,
              background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 800, fontSize: 16, color: "white",
            }}>
              T
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 18, color: "#f8fafc" }}>Tegra</div>
              <div style={{ fontSize: 11, color: "#64748b" }}>ERP System</div>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", display: "none" }}
            className="mobile-close"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <div key={item.path}>
              {item.section && (
                <div className="section-label">{item.section}</div>
              )}
              <NavLink
                to={item.path}
                className={({ isActive }) => isActive ? "active" : ""}
                onClick={() => setSidebarOpen(false)}
              >
                {item.icon}
                {item.label}
              </NavLink>
            </div>
          ))}
        </nav>

        <div style={{ padding: "20px", borderTop: "1px solid #1e293b", marginTop: "auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: 32, height: 32, borderRadius: "50%",
              background: "#3b82f6", display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: 13, fontWeight: 600, color: "white",
            }}>
              SM
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 500 }}>Admin User</div>
              <div style={{ fontSize: 11, color: "#64748b" }}>Business Owner</div>
            </div>
            <ChevronDown size={14} style={{ color: "#64748b" }} />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="header">
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <button
              onClick={() => setSidebarOpen(true)}
              style={{ background: "none", border: "none", cursor: "pointer", display: "none" }}
              className="mobile-menu"
            >
              <Menu size={24} />
            </button>
            <div>
              <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700 }}>
                {currentPage?.label || "Tegra"}
              </h1>
              <p style={{ margin: 0, fontSize: 13, color: "#64748b" }}>
                {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
              </p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ position: "relative" }}>
              <Search size={16} style={{ position: "absolute", left: 12, top: 10, color: "#94a3b8" }} />
              <input
                className="input"
                placeholder="Search..."
                style={{ paddingLeft: 36, width: 240 }}
              />
            </div>
            <button className="btn btn-secondary" style={{ padding: 10 }}>
              <Bell size={18} />
            </button>
          </div>
        </div>

        {children}
      </main>
    </div>
  );
}
