import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      app: { name: "Tegra", tagline: "Enterprise Resource Planning" },
      nav: {
        dashboard: "Dashboard",
        sales: "Point of Sale",
        customers: "Customers",
        inventory: "Inventory",
        stocktake: "Stocktake",
        transfers: "Transfers",
        rfid: "RFID Devices",
        suppliers: "Suppliers",
        purchaseOrders: "Purchase Orders",
        shipping: "Shipping",
        invoices: "Invoices",
        accounting: "Accounting",
        reports: "Reports",
        settings: "Settings",
      },
      common: {
        save: "Save",
        cancel: "Cancel",
        delete: "Delete",
        edit: "Edit",
        add: "Add",
        search: "Search...",
        filter: "Filter",
        export: "Export",
        import: "Import",
        status: "Status",
        actions: "Actions",
        noResults: "No results found",
        loading: "Loading...",
      },
      currency: { symbol: "$", code: "USD" },
    },
  },
  fr: {
    translation: {
      app: { name: "Tegra", tagline: "Planification des Ressources" },
      nav: {
        dashboard: "Tableau de bord",
        sales: "Point de Vente",
        customers: "Clients",
        inventory: "Inventaire",
        stocktake: "Inventaire Physique",
        transfers: "Transferts",
        rfid: "Appareils RFID",
        suppliers: "Fournisseurs",
        purchaseOrders: "Bons de Commande",
        shipping: "Expédition",
        invoices: "Factures",
        accounting: "Comptabilité",
        reports: "Rapports",
        settings: "Paramètres",
      },
      common: {
        save: "Enregistrer",
        cancel: "Annuler",
        delete: "Supprimer",
        edit: "Modifier",
        add: "Ajouter",
        search: "Rechercher...",
        filter: "Filtrer",
        export: "Exporter",
        import: "Importer",
        status: "Statut",
        actions: "Actions",
        noResults: "Aucun résultat",
        loading: "Chargement...",
      },
      currency: { symbol: "€", code: "EUR" },
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;
