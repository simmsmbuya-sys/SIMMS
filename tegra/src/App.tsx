import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/Layout";

// Lazy-load all views for code-splitting
const Dashboard = lazy(() => import("./views/Dashboard"));
const Sales = lazy(() => import("./views/Sales"));
const Customers = lazy(() => import("./views/Customers"));
const Inventory = lazy(() => import("./views/Inventory"));
const Stocktake = lazy(() => import("./views/Stocktake"));
const Transfers = lazy(() => import("./views/Transfers"));
const Rfid = lazy(() => import("./views/Rfid"));
const Suppliers = lazy(() => import("./views/Suppliers"));
const PurchaseOrders = lazy(() => import("./views/PurchaseOrders"));
const Shipping = lazy(() => import("./views/Shipping"));
const Invoices = lazy(() => import("./views/Invoices"));
const Accounting = lazy(() => import("./views/Accounting"));
const Reports = lazy(() => import("./views/Reports"));
const Settings = lazy(() => import("./views/Settings"));

function PageLoader() {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "center",
      height: "50vh", color: "#94a3b8", fontSize: 14,
    }}>
      <div style={{ textAlign: "center" }}>
        <div style={{
          width: 32, height: 32, border: "3px solid #e2e8f0",
          borderTopColor: "#3b82f6", borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
          margin: "0 auto 12px",
        }} />
        Loading...
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/stocktake" element={<Stocktake />} />
            <Route path="/transfers" element={<Transfers />} />
            <Route path="/rfid" element={<Rfid />} />
            <Route path="/suppliers" element={<Suppliers />} />
            <Route path="/purchase-orders" element={<PurchaseOrders />} />
            <Route path="/shipping" element={<Shipping />} />
            <Route path="/invoices" element={<Invoices />} />
            <Route path="/accounting" element={<Accounting />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Suspense>
      </Layout>
    </BrowserRouter>
  );
}
