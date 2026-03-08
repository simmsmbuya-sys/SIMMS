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
  Sparkles,
  Command,
} from "lucide-react";

interface NavItem {
  label: string;
  path: string;
  icon: ReactNode;
  section?: string;
}

const navItems: NavItem[] = [
  { label: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={17} /> },
  { label: "Point of Sale", path: "/sales", icon: <ShoppingCart size={17} />, section: "Sales" },
  { label: "Customers", path: "/customers", icon: <Users size={17} /> },
  { label: "Inventory", path: "/inventory", icon: <Package size={17} />, section: "Operations" },
  { label: "Stocktake", path: "/stocktake", icon: <ClipboardList size={17} /> },
  { label: "Transfers", path: "/transfers", icon: <ArrowLeftRight size={17} /> },
  { label: "RFID Devices", path: "/rfid", icon: <Radio size={17} />, section: "Tracking" },
  { label: "Suppliers", path: "/suppliers", icon: <Building2 size={17} />, section: "Supply Chain" },
  { label: "Purchase Orders", path: "/purchase-orders", icon: <FileText size={17} /> },
  { label: "Shipping", path: "/shipping", icon: <Truck size={17} /> },
  { label: "Invoices", path: "/invoices", icon: <FileText size={17} /> },
  { label: "Accounting", path: "/accounting", icon: <BookOpen size={17} />, section: "Finance" },
  { label: "Reports", path: "/reports", icon: <BarChart3 size={17} /> },
  { label: "Settings", path: "/settings", icon: <Settings size={17} />, section: "System" },
];

export function Layout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const currentPage = navItems.find((item) => item.path === location.pathname);

  return (
    <div>
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        {/* Logo */}
        <div style={{ padding: "24px 20px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{
              width: 38, height: 38, borderRadius: 10,
              background: "linear-gradient(135deg, #6366f1, #a78bfa)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 900, fontSize: 17, color: "white",
              boxShadow: "0 4px 12px rgba(99, 102, 241, 0.35)",
              letterSpacing: "-0.02em",
            }}>
              T
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 18, color: "#f8fafc", letterSpacing: "-0.03em" }}>Tegra</div>
              <div style={{ fontSize: 10.5, color: "#475569", fontWeight: 500, letterSpacing: "0.5px", textTransform: "uppercase" }}>Enterprise ERP</div>
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

        {/* Quick Search */}
        <div style={{ padding: "0 16px 12px" }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "8px 12px", borderRadius: 8,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.06)",
            cursor: "pointer", transition: "all 0.15s",
            color: "#64748b", fontSize: 13,
          }}>
            <Search size={14} />
            <span style={{ flex: 1 }}>Quick search...</span>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 2,
              fontSize: 10, padding: "2px 6px", borderRadius: 4,
              background: "rgba(255,255,255,0.06)", color: "#64748b",
              fontWeight: 600,
            }}>
              <Command size={10} /> K
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav" style={{ flex: 1, overflowY: "auto", paddingBottom: 12 }}>
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

        {/* Pro badge */}
        <div style={{ padding: "12px 16px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "10px 14px", borderRadius: 10,
            background: "linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.08))",
            border: "1px solid rgba(99, 102, 241, 0.15)",
          }}>
            <Sparkles size={16} style={{ color: "#a78bfa" }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: "#e2e8f0" }}>Pro Plan</div>
              <div style={{ fontSize: 10.5, color: "#64748b" }}>All features unlocked</div>
            </div>
          </div>
        </div>

        {/* User */}
        <div style={{ padding: "12px 16px 20px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{
            display: "flex", alignItems: "center", gap: "10px",
            padding: "8px 10px", borderRadius: 10, cursor: "pointer",
            transition: "background 0.15s",
          }}>
            <div style={{
              width: 34, height: 34, borderRadius: 10,
              background: "linear-gradient(135deg, #6366f1, #a78bfa)",
              display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: 12, fontWeight: 700, color: "white",
            }}>
              SM
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0" }}>Simms Mbuya</div>
              <div style={{ fontSize: 11, color: "#64748b" }}>Business Owner</div>
            </div>
            <ChevronDown size={14} style={{ color: "#475569" }} />
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
              <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, letterSpacing: "-0.03em" }}>
                {currentPage?.label || "Tegra"}
              </h1>
              <p style={{ margin: 0, fontSize: 13, color: "#64748b", fontWeight: 450 }}>
                {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
              </p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ position: "relative" }}>
              <Search size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
              <input
                className="input"
                placeholder="Search anything..."
                style={{ paddingLeft: 36, width: 260, fontSize: 13 }}
              />
            </div>
            <button className="btn btn-secondary" style={{ padding: "10px", position: "relative" }}>
              <Bell size={17} />
              <span style={{
                position: "absolute", top: 6, right: 6,
                width: 7, height: 7, borderRadius: "50%",
                background: "#ef4444", border: "2px solid white",
              }} />
            </button>
          </div>
        </div>

        {children}
      </main>
    </div>
  );
}
