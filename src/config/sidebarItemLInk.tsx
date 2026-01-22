import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  Settings,
  Hammer,
  List,
  PlusCircle,
  Layers,
  Ruler,
  Boxes,
  UserPlus,
  FileText,
  CreditCard,
  Truck,
  DollarSign,
  TrendingUp,
  UserCog,
  Calculator,
  PackageCheck,
  Briefcase,
  HelpCircle,
} from "lucide-react";
import { lazy } from "react";
import {
  SuperAdminPermission,
  ProductPermission,
  CustomerPermission,
  SalesPermission,
  SettingsPermission,
  SupplierPermission,
  ReportPermission,
  StaffPermission,
  AccountingPermission,
} from "./permissions";

const Dashboard = lazy(() => import("../pages/dashboard/Dashboard"));
const Products = lazy(() => import("../pages/products/Products"));
const CreateProduct = lazy(() => import("@/pages/products/create"));
const ProductCategories = lazy(() => import("@/pages/products/categories"));
const StockManagement = lazy(() => import("@/pages/products/stock"));
const Customers = lazy(() => import("@/pages/customer/Customers"));
const AddCustomer = lazy(() => import("@/pages/customer/AddCustomer"));
const EditCustomerPage = lazy(() => import("@/pages/customer/EditCustomerPage"));
const CustomerViewPage = lazy(() => import("@/pages/customer/CustomerViewPage"));
const PosOrder = lazy(() => import("@/pages/salesOrders/pos/PosOrder"));
const Orders = lazy(() => import("@/pages/salesOrders/order/OrderList"));
const CreateOrderPage = lazy(() => import("@/pages/salesOrders/order/createOrder"));
const EditOrderPage = lazy(() => import("@/pages/salesOrders/order/editOrder"));
const OrderDetails = lazy(() => import("@/pages/salesOrders/order/OrderDetails"));
const Invoices = lazy(() => import("@/pages/salesOrders/invoices"));
const InvoiceDetailsPage = lazy(() => import("@/pages/salesOrders/invoices/InvoiceDetails"));
const Payments = lazy(() => import("@/pages/salesOrders/payments/Payments"));
const PaymentDetails = lazy(() => import("@/pages/salesOrders/payments/PaymentDetails"));
const CreatePaymentPage = lazy(() => import("@/pages/salesOrders/payments/createPayment"));
const DeliveryPage = lazy(() => import("@/pages/salesOrders/delivery/DeliveryPage"));
const ProductDetailsPage = lazy(() => import("@/pages/products/ProductDetails"));
const EditProductPage = lazy(() => import("@/pages/products/edit"));
const UnitsPage = lazy(() => import("@/pages/unit"));
const RepairsList = lazy(() => import("@/pages/repairs/RepairsList"));
const CreateRepair = lazy(() => import("@/pages/repairs/CreateRepair"));
const RepairDetails = lazy(() => import("@/pages/repairs/RepairDetails"));
const SettingsSidebarLayout = lazy(() => import("@/pages/Settings/Settings"));
const SuppliersList = lazy(() => import("@/pages/suppliers/supplier/suppliersList"));
const AddSupplierPage = lazy(() => import("@/pages/suppliers/supplier/AddSupplier"));
const EditSupplierPage = lazy(() => import("@/pages/suppliers/supplier/EditSupplier"));
const PurchaseOrdersList = lazy(() => import("@/pages/suppliers/purchaseOrder/PurchaseOrdersList"));
const CreatePurchaseOrderPage = lazy(() => import("@/pages/suppliers/purchaseOrder/CreatePurchaseOrderPage"));
const ViewPurchaseOrderPage = lazy(() => import("@/pages/suppliers/purchaseOrder/ViewPurchaseOrderPage"));
const EditPurchaseOrderPage = lazy(() => import("@/pages/suppliers/purchaseOrder/EditPurchaseOrderPage"));
const PurchaseInvoicesList = lazy(() => import("@/pages/suppliers/purchaseOrderInvoices/PurchaseInvoicesList"));
const PurchaseInvoicesDetails = lazy(() => import("@/pages/suppliers/purchaseOrderInvoices/PurchaseInvoicesDetails"));
const PurchaseInvoicePrintPreview = lazy(() => import("@/pages/suppliers/purchaseOrderInvoices/PurchaseInvoicePrintPreview"));
const PurchasePayments = lazy(() => import("@/pages/suppliers/purchasePayments/PurchasePayments"));
const PurchasePaymentsDetails = lazy(() => import("@/pages/suppliers/purchasePayments/PurchasePaymentsDetails"));
const CreatePurchasePayments = lazy(() => import("@/pages/suppliers/purchasePayments/CreatePurchasePayments"));
const SalesReportsPage = lazy(() => import("@/pages/reports/SalesReports"));
const InventoryReports = lazy(() => import("@/pages/reports/InventoryReports"));
const StaffsList = lazy(() => import("@/pages/staffs"));
const AddStaffPage = lazy(() => import("@/pages/staffs/add"));
const EditStaffPage = lazy(() => import("@/pages/staffs/edit"));
const StaffDetailsPage = lazy(() => import("@/pages/staffs/StaffDetails"));
const HrPayrollOverview = lazy(() => import("@/pages/HrAndPayroll/HrPayrollOverview"));
const PayrollRuns = lazy(() => import("@/pages/HrAndPayroll/PayrollRuns"));
const Payslips = lazy(() => import("@/pages/HrAndPayroll/Payslips"));
const PayrollReports = lazy(() => import("@/pages/HrAndPayroll/PayrollReports"));
//const Accounting = lazy(() => import("@/pages/accounting/Accounting"));
const ChartOfAccounts = lazy(() => import("@/pages/accounting/ChartOfAccounts"));
const Transactions = lazy(() => import("@/pages/accounting/Transactions"));
const Income = lazy(() => import("@/pages/accounting/Income"));
const Expenses = lazy(() => import("@/pages/accounting/Expenses"));
const AddIncomePage = lazy(() => import("@/pages/accounting/AddIncomePage"));
const AddExpanse = lazy(() => import("@/pages/accounting/AddExpanse"));
const TrialBalance = lazy(() => import("@/pages/accounting/TrialBalance"));
const ProfitAndLoss = lazy(() => import("@/pages/accounting/ProfitAndLoss"));
const ProductWiseProfitLoss = lazy(() => import("@/pages/accounting/ProductWiseProfitLoss"));
const JournalReport = lazy(() => import("@/pages/accounting/JournalReport"));
const LedgerReport = lazy(() => import("@/pages/accounting/LedgerReport"));
const Help = lazy(() => import("@/pages/help/Help"));


export const sidebarItemLink = [
  // DASHBOARD
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
    element: <Dashboard />,
    allowedPermissions: [
      SuperAdminPermission.ACCESS_ALL,
    ],
  },

  // PRODUCTS (Gold Inventory)
  {
    title: "Products",
    url: "#",
    icon: Package,
    allowedPermissions: [
      ProductPermission.VIEW,
      SuperAdminPermission.ACCESS_ALL,
    ],
    items: [
      {
        title: "All Products",
        url: "/dashboard/products",
        element: <Products />,
        icon: List,
        allowedPermissions: [
          ProductPermission.LIST,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "",
        url: "/dashboard/products/:productId",
        element: <ProductDetailsPage />,
        allowedPermissions: [
          ProductPermission.DETAILS,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "Add Product",
        url: "/dashboard/products/create",
        element: <CreateProduct />,
        icon: PlusCircle,
        allowedPermissions: [
          ProductPermission.CREATE,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "",
        url: "/dashboard/products/:productId/edit",
        element: <EditProductPage />,
        allowedPermissions: [
          ProductPermission.EDIT,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "Categories",
        url: "/dashboard/products/categories",
        element: <ProductCategories />,
        icon: Layers,
        allowedPermissions: [
          ProductPermission.VIEW_CATEGORIES,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "Units",
        url: "/dashboard/products/unit",
        element: <UnitsPage />,
        icon: Ruler,
        allowedPermissions: [
          ProductPermission.VIEW_UNITS,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "Stock Management",
        url: "/dashboard/products/stock",
        element: <StockManagement />,
        icon: Boxes,
        allowedPermissions: [
          ProductPermission.MANAGE_STOCK,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
    ],
  },

  // SUPPLIERS & PURCHASES
  {
    title: "Purchase",
    url: "#",
    icon: Truck,
    allowedPermissions: [
      SupplierPermission.VIEW,
      SuperAdminPermission.ACCESS_ALL,
    ],
    items: [
      {
        title: "Suppliers",
        url: "/dashboard/suppliers",
        element: <SuppliersList />,
        icon: List,
        allowedPermissions: [
          SupplierPermission.LIST,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "Add Supplier",
        url: "/dashboard/suppliers/create",
        element: <AddSupplierPage />,
        icon: UserPlus,
        allowedPermissions: [
          SupplierPermission.CREATE,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "",
        url: "/dashboard/suppliers/:supplierId/edit",
        element: <EditSupplierPage />,
        allowedPermissions: [
          SupplierPermission.EDIT,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "Purchase Orders",
        url: "/dashboard/purchase-orders",
        element: <PurchaseOrdersList />,
        icon: FileText,
        allowedPermissions: [
          SupplierPermission.LIST,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "New Purchase Order",
        url: "/dashboard/purchase-orders/create",
        element: <CreatePurchaseOrderPage />,
        icon: PlusCircle,
        allowedPermissions: [
          SupplierPermission.CREATE_PURCHASE_ORDER,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "",
        url: "/dashboard/purchase-orders/:purchaseId",
        element: <ViewPurchaseOrderPage />,
        allowedPermissions: [
          SupplierPermission.VIEW_PURCHASE_ORDER_DETAILS,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "",
        url: "/dashboard/purchase-orders/:purchaseId/edit",
        element: <EditPurchaseOrderPage />,
        allowedPermissions: [
          SupplierPermission.EDIT_PURCHASE_ORDER,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "Purchase Invoices",
        url: "/dashboard/purchase-invoices",
        element: <PurchaseInvoicesList />,
        icon: FileText,
        allowedPermissions: [
          SupplierPermission.VIEW_PURCHASE_INVOICES,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "",
        url: "/dashboard/purchase-invoices/:id",
        element: <PurchaseInvoicesDetails />,
        allowedPermissions: [
          SupplierPermission.VIEW_PURCHASE_INVOICE_DETAILS,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "",
        url: "/dashboard/purchase-invoices/:id/preview",
        element: <PurchaseInvoicePrintPreview />,
        allowedPermissions: [
          SupplierPermission.PREVIEW_PURCHASE_INVOICE,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "Purchase Payments",
        url: "/dashboard/purchase-payments",
        element: <PurchasePayments />,
        icon: CreditCard,
        allowedPermissions: [
          SupplierPermission.VIEW_PURCHASE_PAYMENTS,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "",
        url: "/dashboard/purchase-payments/create",
        element: <CreatePurchasePayments />,
        allowedPermissions: [
          SupplierPermission.CREATE_PURCHASE_PAYMENT,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "",
        url: "/dashboard/purchase-payments/:id",
        element: <PurchasePaymentsDetails />,
        allowedPermissions: [
          SupplierPermission.VIEW_PURCHASE_PAYMENT_DETAILS,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
    ],
  },

  // CUSTOMERS
  {
    title: "Customers",
    url: "#",
    icon: Users,
    allowedPermissions: [
      CustomerPermission.VIEW,
      SuperAdminPermission.ACCESS_ALL,
    ],
    items: [
      {
        title: "All Customers",
        url: "/dashboard/customers",
        element: <Customers />,
        icon: List,
        allowedPermissions: [
          CustomerPermission.LIST,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "",
        url: "/dashboard/customers/:customerId",
        element: <CustomerViewPage />,
        allowedPermissions: [
          CustomerPermission.DETAILS,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "Add Customer",
        url: "/dashboard/customers/create",
        element: <AddCustomer />,
        icon: UserPlus,
        allowedPermissions: [
          CustomerPermission.CREATE,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "",
        url: "/dashboard/customers/:customerId/edit",
        element: <EditCustomerPage />,
        allowedPermissions: [
          CustomerPermission.EDIT,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
    ],
  },

  // SALES & ORDERS
  {
    title: "Sales",
    url: "#",
    icon: ShoppingCart,
    allowedPermissions: [SalesPermission.VIEW, SuperAdminPermission.ACCESS_ALL],
    items: [
      {
        title: "POS",
        url: "/dashboard/sales/pos",
        element: <PosOrder />,
        icon: DollarSign,
        allowedPermissions: [
          SalesPermission.POS_ORDER,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "Orders",
        url: "/dashboard/sales/orders",
        element: <Orders />,
        icon: List,
        allowedPermissions: [
          SalesPermission.ORDERS,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "New Order",
        url: "/dashboard/sales/orders/create",
        icon: PlusCircle,
        element: <CreateOrderPage />,
        allowedPermissions: [
          SalesPermission.CREATE_ORDER,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "",
        url: "/dashboard/sales/orders/:orderId",
        element: <OrderDetails />,
        allowedPermissions: [
          SalesPermission.ORDER_DETAILS,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "",
        url: "/dashboard/sales/orders/:orderId/edit",
        element: <EditOrderPage />,
        allowedPermissions: [
          SalesPermission.EDIT_ORDER,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "Delivery",
        url: "/dashboard/sales/delivery",
        element: <DeliveryPage />,
        icon: PackageCheck,
        allowedPermissions: [
          SalesPermission.DELIVERY,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "Invoices",
        url: "/dashboard/sales/invoices",
        element: <Invoices />,
        icon: FileText,
        allowedPermissions: [
          SalesPermission.INVOICES,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "",
        url: "/dashboard/sales/invoices/:invoiceId",
        element: <InvoiceDetailsPage />,
        allowedPermissions: [
          SalesPermission.INVOICE_DETAILS,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "Payments",
        url: "/dashboard/sales/payments",
        element: <Payments />,
        icon: CreditCard,
        allowedPermissions: [
          SalesPermission.PAYMENTS,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "",
        url: "/dashboard/sales/payments/:paymentId",
        element: <PaymentDetails />,
        allowedPermissions: [
          SalesPermission.PAYMENT_DETAILS,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "",
        url: "/dashboard/sales/payments/create",
        element: <CreatePaymentPage />,
        allowedPermissions: [
          SalesPermission.CREATE_PAYMENT,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
    ],
  },

  // REPAIRS
  {
    title: "Repairs",
    url: "#",
    icon: Hammer,
    allowedPermissions: [
      SuperAdminPermission.ACCESS_ALL,
    ],
    items: [
      {
        title: "All Repairs",
        url: "/dashboard/repairs",
        element: <RepairsList />,
        icon: List,
        allowedPermissions: [
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "New Repair Job",
        url: "/dashboard/repairs/create",
        element: <CreateRepair />,
        icon: PlusCircle,
        allowedPermissions: [
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "",
        url: "/dashboard/repairs/:id",
        element: <RepairDetails />,
        allowedPermissions: [
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
    ],
  },

  // HR & PAYROLL
  {
    title: "HR & Payroll",
    url: "#",
    icon: UserCog,
    allowedPermissions: [
      StaffPermission.VIEW,
      SuperAdminPermission.ACCESS_ALL,
    ],
    items: [
      {
        title: "Overview",
        url: "/dashboard/payroll",
        element: <HrPayrollOverview />,
        icon: LayoutDashboard,
        allowedPermissions: [
          StaffPermission.VIEW,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "Staff",
        url: "/dashboard/staffs",
        element: <StaffsList />,
        icon: Users,
        allowedPermissions: [
          StaffPermission.LIST,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "Add Staff",
        url: "/dashboard/staffs/add",
        element: <AddStaffPage />,
        icon: UserPlus,
        allowedPermissions: [
          StaffPermission.CREATE,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "",
        url: "/dashboard/staffs/:id",
        element: <StaffDetailsPage />,
        allowedPermissions: [
          StaffPermission.DETAILS,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "",
        url: "/dashboard/staffs/:id/edit",
        element: <EditStaffPage />,
        allowedPermissions: [
          StaffPermission.EDIT,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "Payroll Runs",
        url: "/dashboard/payroll/payroll-runs",
        element: <PayrollRuns />,
        icon: DollarSign,
        allowedPermissions: [
          StaffPermission.VIEW,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "Payslips",
        url: "/dashboard/payroll/payslips",
        element: <Payslips />,
        icon: FileText,
        allowedPermissions: [
          StaffPermission.VIEW,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "Payroll Reports",
        url: "/dashboard/payroll/payroll-reports",
        element: <PayrollReports />,
        icon: TrendingUp,
        allowedPermissions: [
          StaffPermission.VIEW,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
    ],
  },

  // ACCOUNTING
  {
    title: "Accounting",
    url: "#",
    icon: Calculator,
    allowedPermissions: [
      AccountingPermission.VIEW,
      SuperAdminPermission.ACCESS_ALL,
    ],
    items: [
      // {
      //   title: "Overview",
      //   url: "/dashboard/accounting",
      //   element: <Accounting />,
      //   icon: LayoutDashboard,
      //   allowedPermissions: [
      //     AccountingPermission.VIEW,
      //     SuperAdminPermission.ACCESS_ALL,
      //   ],
      // },
      {
        title: "Chart of Accounts",
        url: "/dashboard/accounting/chart-of-accounts",
        element: <ChartOfAccounts />,
        icon: List,
        allowedPermissions: [
          AccountingPermission.CHART_OF_ACCOUNTS,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "Transactions",
        url: "/dashboard/accounting/transactions",
        element: <Transactions />,
        icon: FileText,
        allowedPermissions: [
          AccountingPermission.TRANSACTIONS,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "Journal",
        url: "/dashboard/accounting/journal",
        element: <JournalReport />,
        icon: FileText,
        allowedPermissions: [
          AccountingPermission.JOURNAL_REPORT,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "Ledger",
        url: "/dashboard/accounting/ledger",
        element: <LedgerReport />,
        icon: List,
        allowedPermissions: [
          AccountingPermission.LEDGER_REPORT,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "Income",
        url: "/dashboard/accounting/income",
        element: <Income />,
        icon: TrendingUp,
        allowedPermissions: [
          AccountingPermission.INCOMES,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "",
        url: "/dashboard/accounting/add-income",
        element: <AddIncomePage />,
        allowedPermissions: [
          AccountingPermission.CREATE_INCOME,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "Expenses",
        url: "/dashboard/accounting/expenses",
        element: <Expenses />,
        icon: DollarSign,
        allowedPermissions: [
          AccountingPermission.EXPENSES,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "",
        url: "/dashboard/accounting/add-expense",
        element: <AddExpanse />,
        allowedPermissions: [
          AccountingPermission.CREATE_EXPENSE,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "Trial Balance",
        url: "/dashboard/accounting/trial-balance",
        element: <TrialBalance />,
        icon: Briefcase,
        allowedPermissions: [
          AccountingPermission.TRIAL_BALANCE,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "Profit & Loss",
        url: "/dashboard/accounting/profit-and-loss",
        element: <ProfitAndLoss />,
        icon: TrendingUp,
        allowedPermissions: [
          AccountingPermission.PROFIT_AND_LOSS,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "Product Wise P&L",
        url: "/dashboard/accounting/product-wise-profit-loss",
        element: <ProductWiseProfitLoss />,
        icon: Package,
        allowedPermissions: [
          AccountingPermission.PROFIT_AND_LOSS,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
    ],
  },

  // REPORTS
  {
    title: "Reports",
    url: "#",
    icon: TrendingUp,
    allowedPermissions: [
      ReportPermission.VIEW,
      SuperAdminPermission.ACCESS_ALL,
    ],
    items: [
      {
        title: "Sales Reports",
        url: "/dashboard/reports/sales",
        element: <SalesReportsPage />,
        icon: DollarSign,
        allowedPermissions: [
          ReportPermission.SALES,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "Inventory Reports",
        url: "/dashboard/reports/inventory",
        element: <InventoryReports />,
        icon: Boxes,
        allowedPermissions: [
          ReportPermission.INVENTORY,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
    ],
  },

  // SETTINGS
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: Settings,
    element: <SettingsSidebarLayout />,
    allowedPermissions: [
      SettingsPermission.VIEW,
      SuperAdminPermission.ACCESS_ALL,
    ],
  },

  // HELP
  {
    title: "Help",
    url: "/dashboard/help",
    icon: HelpCircle,
    element: <Help />,
    allowedPermissions: [
      SuperAdminPermission.ACCESS_ALL,
      ProductPermission.VIEW,
    ],
  },
];
