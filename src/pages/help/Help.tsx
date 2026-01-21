import { useState } from "react";
import {
  LayoutDashboard,
  Package,
  Users,
  Car,
  ShoppingCart,
  Receipt,
  FileText,
  Settings,
  ChevronRight,
  BookOpen,
  Search,
  CheckCircle2,
  Menu,
  Hammer,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import {
  Card,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

// --- Help Data ---
// You can extend this data structure to add more modules and tasks.
const helpData = [
  {
    id: "dashboard",
    title: "Dashboard",
    icon: LayoutDashboard,
    description: "Get a high-level overview of your business performance.",
    tasks: [
      {
        title: "Navigating the Dashboard",
        description: "Learn how to read the main dashboard key metrics.",
        steps: [
          "Log in to the application to land on the Dashboard.",
          "View the top cards for 'Total Revenue', 'Active Customers', and 'Pending Orders'.",
          "Check the charts for sales trends over time.",
          "Review the 'Recent Activities' section for the latest system updates.",
        ],
      },
    ],
  },
  {
    id: "products",
    title: "Products Management",
    icon: Package,
    description: "Manage your product inventory, categories, and stock levels.",
    tasks: [
      {
        title: "All Products",
        description: "View and filter your entire product catalog.",
        steps: [
          "Navigate to 'Products' > 'All Products' in the sidebar.",
          "Use the search bar to find products by name or SKU.",
          "Filter by category to narrow down the list.",
          "Click the 'Eye' icon to view detailed specifications and weight details.",
        ],
      },
      {
        title: "Add Product",
        description: "Register new gold jewelry or items in the system.",
        steps: [
          "Go to 'Products' > 'Add Product'.",
          "Enter labels like 'Product Name', 'SKU', and 'Metal Type'.",
          "Specify the 'Category' (e.g., Rings, Necklaces).",
          "Record 'Gross Weight' and 'Net Weight' accurately.",
          "Set the 'Cost Price' and 'Selling Price'.",
          "Enable 'Stock Tracking' to monitor inventory levels automatically.",
          "Click 'Save Product' to add it to your catalog.",
        ],
      },
      {
        title: "Categories",
        description: "Organize your inventory with custom groupings.",
        steps: [
          "Navigate to 'Products' > 'Categories'.",
          "View the list of existing product groups.",
          "Click 'Add Category' to create a new one.",
          "Assign categories to products during creation or editing for better reporting.",
        ],
      },
      {
        title: "Units",
        description: "Manage measurement units for gold and jewelry.",
        steps: [
          "Go to 'Products' > 'Units'.",
          "Define units like 'g' (Grams), 'oz' (Ounces), or 'pcs' (Pieces).",
          "Set default units for different product types to ensure consistency.",
        ],
      },
      {
        title: "Stock Management",
        description: "Update inventory levels and track stock movements.",
        steps: [
          "Navigate to 'Products' > 'Stock Management'.",
          "Search for the specific item you want to adjust.",
          "Enter 'Added Quantity' or 'Removed Quantity'.",
          "Log a reason for the adjustment (e.g., New Arrival, Sale, Scrap).",
          "Review the 'Stock History' to see all past adjustments for that item.",
        ],
      },
    ],
  },
  {
    id: "customers",
    title: "Customer Relationship",
    icon: Users,
    description: "Manage customer profiles, view history, and handle assignments.",
    tasks: [
      {
        title: "Registering a New Customer",
        description: "Add a new client to your CRM.",
        steps: [
          "Go to 'Customers' > 'Add Customer'.",
          "Enter basic details: Name, Email, Phone Number.",
          "Add address information for billing and shipping.",
          "Assign a specific sales route if applicable.",
          "Click 'Create Customer' to save.",
        ],
      },
      {
        title: "Viewing Customer Details",
        description: "Access full customer history and orders.",
        steps: [
          "Go to 'Customers' > 'List of Active Customers'.",
          "Click on the 'View' icon (eye) next to a customer's name.",
          "Navigate through tabs to see 'Overview', 'Orders', 'Invoices', and 'Payments'.",
        ],
      },
    ],
  },
  {
    id: "suppliers",
    title: "Suppliers & Purchasing",
    icon: Car,
    description: "Manage vendor relationships, purchase orders, and payments.",
    tasks: [
      {
        title: "Suppliers",
        description: "View and manage your network of vendors and suppliers.",
        steps: [
          "Navigate to 'Purchase' > 'Suppliers' in the sidebar.",
          "Use search to find specific suppliers by name or contact person.",
          "Click on a supplier to view their full profile, including transaction history and outstanding balances.",
        ],
      },
      {
        title: "Add Supplier",
        description: "Register a new vendor or gold supplier in the system.",
        steps: [
          "Go to 'Purchase' > 'Add Supplier'.",
          "Fill in 'Company Name', 'Contact Person', 'Email', and 'Phone Number'.",
          "Provide 'Address' and 'Bank Details' for payment processing.",
          "Click 'Save' to add the supplier to your database.",
        ],
      },
      {
        title: "Purchase Orders",
        description: "Manage your history of items ordered from suppliers.",
        steps: [
          "Navigate to 'Purchase' > 'Purchase Orders'.",
          "Track the status of your orders (Draft, Sent, Partially Received, Received).",
          "Click on any order to view detailed line items and pricing.",
        ],
      },
      {
        title: "New Purchase Order",
        description: "Create a formal request for goods from a supplier.",
        steps: [
          "Go to 'Purchase' > 'New Purchase Order'.",
          "Select the 'Supplier' and 'Warehouse' for delivery.",
          "Add products to the order, specifying quantity and negotiated price.",
          "Review the total estimated cost and click 'Create Order'.",
        ],
      },
      {
        title: "Purchase Invoices",
        description: "Record received invoices for accounting and stock reconciliation.",
        steps: [
          "Navigate to 'Purchase' > 'Purchase Invoices'.",
          "Select the relevant 'Purchase Order' for the incoming invoice.",
          "Verify that the quantities and prices match the physical shipment.",
          "Enter the supplier's 'Invoice Number' and 'Invoice Date'.",
          "Click 'Save Invoice' to update your accounts payable and inventory.",
        ],
      },
      {
        title: "Purchase Payments",
        description: "Track and record payments made to your suppliers.",
        steps: [
          "Go to 'Purchase' > 'Purchase Payments'.",
          "Record a payment against an outstanding purchase invoice.",
          "Select the 'Payment Method' (Cash, Bank Transfer, etc.) and 'Account'.",
          "Save the payment to update the supplier's balance and accounting ledgers.",
        ],
      },
    ],
  },
  {
    id: "sales",
    title: "Sales & Orders",
    icon: ShoppingCart,
    description: "Process orders, manage invoices, and handle payments.",
    tasks: [
      {
        title: "POS (Point of Sale)",
        description: "Quickly process sales for walk-in customers.",
        steps: [
          "Navigate to 'Sales' > 'POS' in the sidebar.",
          "Select or search for products to add to the cart.",
          "Adjust quantities and apply discounts if necessary.",
          "Select the 'Customer' or use the 'Walk-in' option.",
          "Click 'Pay & Finish' to process the transaction and print the receipt.",
        ],
      },
      {
        title: "Orders",
        description: "View and manage all your historical and pending sales orders.",
        steps: [
          "Go to 'Sales' > 'Orders'.",
          "Filter orders by status (Pending, Confirmed, Shipped, Cancelled).",
          "Search for orders by customer name or order number.",
          "Click on an order to view full details, items, and delivery status.",
        ],
      },
      {
        title: "New Order",
        description: "Create a formal sales order for a customer.",
        steps: [
          "Go to 'Sales' > 'New Order'.",
          "Select a 'Customer' and search for products in your inventory.",
          "Add items to the order list and set quantities.",
          "Check taxes, discounts, and shipping details.",
          "Click 'Place Order' to save and generate the order confirmation.",
        ],
      },
      {
        title: "Delivery",
        description: "Manage shipping and track order deliveries.",
        steps: [
          "Navigate to 'Sales' > 'Delivery'.",
          "View orders that are ready for dispatch or currently in transit.",
          "Assign routes and delivery personnel to specific orders.",
          "Update delivery status to 'Delivered' once the customer receives the items.",
        ],
      },
      {
        title: "Invoices",
        description: "Generate and manage professional sales invoices.",
        steps: [
          "Go to 'Sales' > 'Invoices'.",
          "Find orders that are ready for invoicing.",
          "Generate an invoice with one click from a confirmed order.",
          "Print or download PDF invoices for your customers.",
        ],
      },
      {
        title: "Payments",
        description: "Record and track money received from customers.",
        steps: [
          "Navigate to 'Sales' > 'Payments'.",
          "Record a payment against a specific invoice.",
          "Select the 'Payment Method' (Cash, Bank, card) and the destination 'Account'.",
          "View payment history and balances for each customer.",
        ],
      },
    ],
  },
  {
    id: "repairs",
    title: "Repairs Management",
    icon: Hammer,
    description: "Track jewelry repair jobs, managing weights, deposits, and status.",
    tasks: [
      {
        title: "New Repair Job",
        description: "Register an item for repair and take a deposit.",
        steps: [
          "Navigate to 'Repairs' > 'New Repair Job' in the sidebar.",
          "Select the 'Customer' using the search box.",
          "Add one or more items, entering descriptions, gross weight, and estimated cost.",
          "Select the 'Payment Method' for the initial deposit if applicable.",
          "Enter the 'Deposit Amount' and pick an 'Expected Delivery' date.",
          "Click 'Save Job' to generate the repair ticket and deposit receipt.",
        ],
      },
      {
        title: "All Repairs",
        description: "Access full progress and payment records for a job.",
        steps: [
          "Go to 'Repairs' > 'All Repairs'.",
          "Click the 'Eye' icon next to a repair to view its full details.",
          "Review the 'Timeline' to see status changes.",
          "Check the 'Payment History' section to see all partial payments.",
          "Click 'Receipt' on any payment to print its professional receipt.",
        ],
      },
      {
        title: "Updating Repair Status",
        description: "Track the progress of a job from received to delivered.",
        steps: [
          "Open the 'Repair Details' page for the specific job.",
          "Locate the 'Current Status' badge.",
          "Choose a new status: 'Ready', 'Completed', or 'Delivered'.",
          "The system will automatically log the status change for tracking.",
        ],
      },
      {
        title: "Taking Partial Payments",
        description: "Record additional payments against an active repair.",
        steps: [
          "On the 'Repair Details' page, click 'Add Payment'.",
          "Enter the amount and selection the payment method.",
          "Add any internal notes if necessary.",
          "Confirm the payment to update the 'Balance Due' and post to Accounting.",
        ],
      },
    ],
  },

  {
    id: "accounting",
    title: "Accounting",
    icon: Receipt,
    description: "Track income, expenses, and financial overview.",
    tasks: [
      {
        title: "Overview",
        description: "Get a high-level summary of your business finances.",
        steps: [
          "Navigate to 'Accounting' > 'Accounts Overview' in the sidebar.",
          "View key metrics like Total Cash, Bank Balance, and Total Receivables.",
          "Monitor recent financial movements and upcoming bills from the dashboard.",
        ],
      },
      {
        title: "Chart of Accounts",
        description: "Manage your system's financial structure and accounts.",
        steps: [
          "Go to 'Accounting' > 'Chart of Accounts'.",
          "Create and organize accounts into Assets, Liabilities, Equity, Revenue, and Expenses.",
          "Add specific 'Head' accounts for more granular tracking (e.g., specific bank accounts).",
        ],
      },
      {
        title: "Transactions",
        description: "View a complete record of all money entering or leaving the system.",
        steps: [
          "Navigate to 'Accounting' > 'Transactions'.",
          "Search for specific transactions by reference number or description.",
          "Filter by payment mode (Cash, Bank) or transaction type.",
        ],
      },
      {
        title: "Journal",
        description: "Review chronological double-entry records.",
        steps: [
          "Go to 'Accounting' > 'Journal'.",
          "See the raw Debit and Credit entries for every system operation.",
          "Ensure books are balanced and reference external document numbers.",
        ],
      },
      {
        title: "Ledger",
        description: "Detailed per-account transaction history.",
        steps: [
          "Navigate to 'Accounting' > 'Ledger'.",
          "Select a specific account (e.g., 'Main Cash') to see its running balance.",
          "Track how individual transactions affect a specific account's total over time.",
        ],
      },
      {
        title: "Income",
        description: "Monitor revenue from sales, repairs, and other sources.",
        steps: [
          "Go to 'Accounting' > 'Income'.",
          "Track direct income from POS and Repair payments.",
          "Record miscellaneous income not tied to specific sales.",
        ],
      },
      {
        title: "Expenses",
        description: "Log and track all business-related outgoing costs.",
        steps: [
          "Go to 'Accounting' > 'Expenses'.",
          "Click 'Add Expense' to record a new cost (Rent, Salaries, Utilities).",
          "Select the category and bank/cash account used for payment.",
          "Upload receipts for tax compliance and digital record-keeping.",
        ],
      },
      {
        title: "Trial Balance",
        description: "Verify that total Debits equal total Credits.",
        steps: [
          "Go to 'Accounting' > 'Trial Balance'.",
          "Review all account balances at a specific point in time.",
          "Use this report to ensure your books are technically sound before closing a period.",
        ],
      },
      {
        title: "Profit & Loss",
        description: "Review net income by comparing revenue against expenses.",
        steps: [
          "Navigate to 'Accounting' > 'Profit & Loss'.",
          "Choose a date range (Month, Quarter, Year).",
          "Analyze Gross Margin and Net Profit after all overheads.",
        ],
      },
      {
        title: "Product Wise P&L",
        description: "Analyze the profitability of individual items in your inventory.",
        steps: [
          "Go to 'Accounting' > 'Product Wise P&L'.",
          "See which items generate the highest margin vs. those with high turnover.",
          "Analyze total cost of goods sold (COGS) vs. actual revenue per SKU.",
        ],
      },
    ],
  },
  {
    id: "users",
    title: "User Management",
    icon: Users,
    description: "Manage system users, roles, and permissions.",
    tasks: [
      {
        title: "Adding a System User",
        description: "Grant access to the ERP system.",
        steps: [
          "Go to 'Users' > 'Add User'.",
          "Enter the user's name, email, and password.",
          "Assign a Role (e.g., 'Admin', 'Sales Manager').",
          "Click 'Create User'.",
        ]
      },
      {
        title: "Managing Roles",
        description: "Define what users can see and do.",
        steps: [
          "Go to 'Roles & Permissions' > 'Roles'.",
          "Create a new role or edit an existing one.",
          "Check the boxes for permissions (View, Create, Edit, Delete) for each module.",
          "Save the role configuration."
        ]
      }
    ]
  },
  {
    id: "reports",
    title: "Reports & Analytics",
    icon: FileText,
    description: "View detailed reports on sales, inventory, and customers.",
    tasks: [
      {
        title: "Sales Reports",
        description: "Analyze your revenue and order trends over time.",
        steps: [
          "Navigate to 'Reports' in the sidebar and select 'Sales Reports'.",
          "Set your desired date range and filters (customer, status, etc.).",
          "Review the summary metrics for Total Sales, Average Order Value, and Tax collected.",
          "Check the status breakdown charts to see the health of your sales pipeline.",
          "Use the 'Export' feature to download detailed records for external analysis.",
        ],
      },
      {
        title: "Inventory Reports",
        description: "Monitor stock levels, values, and movement across your catalog.",
        steps: [
          "Go to 'Reports' > 'Inventory Reports'.",
          "Check the 'Inventory Status' to see low stock and out-of-stock items at a glance.",
          "Review the 'Inventory Valuation' to see the current market vs. cost value of your stock.",
          "Identify your top-selling products vs. slow-moving items.",
          "Filter by category to analyze specific segments of your inventory.",
        ],
      },
    ],
  },
  {
    id: "settings",
    title: "Settings",
    icon: Settings,
    description: "Configure system preferences and account settings.",
    tasks: [
      {
        title: "Updating Profile",
        description: "Change your password or profile picture.",
        steps: [
          "Click on your avatar in the top right corner.",
          "Select 'Profile Settings'.",
          "Update your personal information.",
          "To change password, go to the 'Security' tab and follow instructions.",
        ],
      },
    ],
  },
  {
    id: "staff",
    title: "HR & Payroll",
    icon: Users,
    description: "Manage employee records, payroll runs, and financial reporting for staff.",
    tasks: [
      {
        title: "Overview",
        description: "Get a summary of your workforce and payroll status.",
        steps: [
          "Navigate to 'HR & Payroll' > 'Overview' in the sidebar.",
          "View key metrics like Total Employees, Net Salary Payout, and Attendance summary.",
          "Monitor upcoming payroll cycles and recent staff additions.",
        ],
      },
      {
        title: "Staff",
        description: "View and manage your complete list of employees.",
        steps: [
          "Go to 'HR & Payroll' > 'Staff'.",
          "Search for staff members by name or department.",
          "Click on a staff record to view personal details, documents, and individual performance logs.",
        ],
      },
      {
        title: "Add Staff",
        description: "Standardized workflow for onboarding new employees.",
        steps: [
          "Navigate to 'HR & Payroll' > 'Add Staff'.",
          "Enter personal information, contact details, and emergency contacts.",
          "Set the 'Basic Salary', department, and designation.",
          "Upload necessary documents like ID proof or contracts.",
          "Create system login credentials if they require ERP access.",
        ],
      },
      {
        title: "Payroll Runs",
        description: "Process monthly salaries and generate payout lists.",
        steps: [
          "Go to 'HR & Payroll' > 'Payroll Runs'.",
          "Choose the month and year for the run.",
          "Select 'Generate Run' to calculate net salaries based on attendance and basic pay.",
          "Review and 'Confirm' the run once all calculations are verified.",
        ],
      },
      {
        title: "Payslips",
        description: "Generate and distribute individual salary slips.",
        steps: [
          "Navigate to 'HR & Payroll' > 'Payslips'.",
          "Filter by staff or month to find specific records.",
          "View, download, or print professional payslips for employees.",
        ],
      },
      {
        title: "Payroll Reports",
        description: "Comprehensive financial analytics for payroll.",
        steps: [
          "Go to 'HR & Payroll' > 'Payroll Reports'.",
          "Analyze salary distribution by department.",
          "Track total payouts over time for budgeting and planning.",
          "Export detailed CSV or PDF reports for accounting records.",
        ],
      },
    ],
  },
];

export default function Help() {
  const [selectedModuleId, setSelectedModuleId] = useState(helpData[0].id);
  const [searchQuery, setSearchQuery] = useState("");

  const selectedModule = helpData.find((m) => m.id === selectedModuleId);

  // Filter modules based on search
  const filteredModules = helpData.filter(
    (m) =>
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.tasks.some((t) =>
        t.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-background">
      {/* Sidebar for Desktop */}
      <aside className="hidden w-80 border-r bg-muted/10 md:flex md:flex-col">
        <div className="p-4 border-b">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-bold tracking-tight">Help Center</h2>
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search help topics..."
              className="pl-8 bg-background"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-2">
            {filteredModules.map((module) => (
              <button
                key={module.id}
                onClick={() => setSelectedModuleId(module.id)}
                className={cn(
                  "w-full flex items-start text-left gap-3 p-3 rounded-lg transition-all",
                  selectedModuleId === module.id
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                <module.icon className="h-5 w-5 mt-0.5" />
                <div>
                  <div className="font-semibold text-sm">{module.title}</div>
                  <div
                    className={cn(
                      "text-xs line-clamp-1 mt-0.5",
                      selectedModuleId === module.id
                        ? "text-primary-foreground/80"
                        : "text-muted-foreground/80"
                    )}
                  >
                    {module.description}
                  </div>
                </div>
              </button>
            ))}
            {filteredModules.length === 0 && (
              <div className="text-center p-4 text-muted-foreground text-sm">
                No matching topics found.
              </div>
            )}
          </div>
        </ScrollArea>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="flex items-center border-b px-6 py-4 md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="mr-4">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] p-0">
              <div className="p-4 border-b">
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="h-6 w-6 text-primary" />
                  <h2 className="text-xl font-bold">Help Center</h2>
                </div>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <ScrollArea className="h-[calc(100vh-140px)]">
                <div className="p-4 space-y-2">
                  {filteredModules.map((module) => (
                    <button
                      key={module.id}
                      onClick={() => setSelectedModuleId(module.id)}
                      className={cn(
                        "w-full flex items-start text-left gap-3 p-3 rounded-lg transition-all",
                        selectedModuleId === module.id
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <module.icon className="h-5 w-5 mt-0.5" />
                      <div>
                        <div className="font-semibold text-sm">
                          {module.title}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </SheetContent>
          </Sheet>
          <span className="font-semibold">Help & Documentation</span>
        </header>

        {selectedModule ? (
          <ScrollArea className="flex-1 p-6 md:p-10">
            <div className="max-w-4xl mx-auto space-y-8">
              {/* Header Section */}
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-primary">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <selectedModule.icon className="h-8 w-8" />
                  </div>
                  <h1 className="text-3xl font-bold tracking-tight text-foreground">
                    {selectedModule.title}
                  </h1>
                </div>
                <p className="text-lg text-muted-foreground max-w-2xl">
                  {selectedModule.description}
                </p>
              </div>

              <div className="h-px bg-border w-full" />

              {/* Tasks Section */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">Common Tasks</h3>
                <div className="grid gap-4">
                  {selectedModule.tasks.map((task, index) => (
                    <Card key={index} className="overflow-hidden border-muted/60 shadow-sm hover:shadow-md transition-shadow">
                      <Collapsible className="group">
                        <CollapsibleTrigger className="flex w-full items-center justify-between p-6 text-left">
                          <div className="space-y-1">
                            <h4 className="font-medium text-lg leading-none group-hover:text-primary transition-colors">
                              {task.title}
                            </h4>
                            {task.description && (
                              <p className="text-sm text-muted-foreground">
                                {task.description}
                              </p>
                            )}
                          </div>
                          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center group-data-[state=open]:bg-primary group-data-[state=open]:text-primary-foreground transition-colors">
                            <ChevronRight className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-90" />
                          </div>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <div className="px-6 pb-6 pt-2">
                            <div className="space-y-4 rounded-md bg-muted/30 p-4 border border-muted-foreground/10">
                              <h5 className="font-medium text-sm text-foreground/80 uppercase tracking-wider">
                                Follow these steps:
                              </h5>
                              <ul className="space-y-4">
                                {task.steps.map((step, stepIndex) => (
                                  <li
                                    key={stepIndex}
                                    className="flex items-start gap-3 text-sm text-muted-foreground"
                                  >
                                    <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold mt-0.5">
                                      {stepIndex + 1}
                                    </span>
                                    <span className="leading-relaxed pt-0.5">
                                      {step}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                              <div className="pt-2 flex items-center gap-2 text-xs text-green-600 font-medium">
                                <CheckCircle2 className="h-3 w-3" />
                                <span>End of procedure</span>
                              </div>
                            </div>
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </ScrollArea>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            Select a module to view help documentation.
          </div>
        )}
      </main>
    </div>
  );
}
