import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/Layout";
import Dashboard from "./views/Dashboard";
import Sales from "./views/Sales";
import Customers from "./views/Customers";
import Inventory from "./views/Inventory";
import Stocktake from "./views/Stocktake";
import Transfers from "./views/Transfers";
import Rfid from "./views/Rfid";
import Suppliers from "./views/Suppliers";
import PurchaseOrders from "./views/PurchaseOrders";
import Shipping from "./views/Shipping";
import Invoices from "./views/Invoices";
import Accounting from "./views/Accounting";
import Reports from "./views/Reports";
import Settings from "./views/Settings";

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
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
      </Layout>
    </BrowserRouter>
  );
}
