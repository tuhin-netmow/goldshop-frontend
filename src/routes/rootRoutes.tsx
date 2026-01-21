import { createBrowserRouter } from "react-router";
import App from "../App";
import NotFound from "../pages/NotFound";
import DashboardLayout from "../Layout/Dashboard";
import Dashboard from "../pages/dashboard/Dashboard";
import { generateRoutes } from "../utils/routesGenerators";
import Login from "@/pages/auth/Login";
import RegisterPage from "@/pages/auth/Register";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import ProtectedRoute from "@/routes/ProtectedRoute";
import { sidebarItemLink } from "@/config/sidebarItemLInk";
import UnauthorizedPage from "@/pages/UnauthorizedPage";
import Privacy from "@/pages/privacy/Privacy";
import Terms from "@/pages/terms/Terms";
import Contact from "@/pages/contact/Contact";
import RepairInvoice from "@/pages/repairs/RepairInvoice";
import PaymentReceipt from "@/pages/salesOrders/payments/PaymentReceipt";
import InvoicePrintPreview from "@/pages/salesOrders/invoices/InvoicePrintPreview";
import RepairPaymentReceipt from "@/pages/repairs/RepairPaymentReceipt";

// Generate dynamic dashboard routes (relative paths)
const dashboardRoutes = generateRoutes(sidebarItemLink, "dashboard");


// Define routes using createBrowserRouter

const rootRouter = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFound />,
    children: [{ index: true, element: <App /> }],
  },

  { path: "/login", element: <Login /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "/forgot-password", element: <ForgotPassword /> },
  { path: "/unauthorized", element: <UnauthorizedPage /> },
  { path: "/privacy", element: <Privacy /> },
  { path: "/terms", element: <Terms /> },
  { path: "/contact", element: <Contact /> },

  //  PROTECTED DASHBOARD
  {
    element: <ProtectedRoute />, // No allowed[] needed
    children: [
      {
        path: "/dashboard/repairs/:id/invoice",
        element: <RepairInvoice />,
      },
      {
        path: "/dashboard/repairs/:id/payments/:paymentId/receipt",
        element: <RepairPaymentReceipt />,
      },
      {
        path: "/dashboard/sales/payments/:paymentId/receipt",
        element: <PaymentReceipt />,
      },
      {
        path: "/dashboard/sales/invoices/:invoiceId/preview",
        element: <InvoicePrintPreview />,
      },
      {
        path: "/dashboard",
        element: <DashboardLayout />,
        children: [
          { index: true, element: <Dashboard /> },
          ...dashboardRoutes,
        ],
      },
    ],
  },
]);

export default rootRouter;

