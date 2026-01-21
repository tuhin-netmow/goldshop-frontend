import { Settings as SettingsIcon, User, Coins } from 'lucide-react';
import { Card, CardHeader } from "@/components/ui/card";
import EditProfilePage from "./pages/UserProfilePage";
import GoldRatesSettings from "./pages/GoldRatesSettings";
import { useState } from 'react';

const sidebarNavItems = [
  {
    title: "Profile",
    href: "profile",
    icon: <User className="w-5 h-5" />,
  },
  {
    title: "Gold Rates",
    href: "gold-rates",
    icon: <Coins className="w-5 h-5" />,
  },
];

export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="space-y-6">
      {/* Enhanced Header Card */}
      <Card className="overflow-hidden border-2 transition-all duration-300 hover:border-blue-200 hover:shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 dark:from-blue-950/30 dark:via-indigo-950/30 dark:to-blue-950/30 border-b-1 border-blue-100 dark:border-blue-900 py-3 gap-0">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-blue-600 to-blue-500 rounded-xl shadow-lg shadow-blue-500/30">
              <SettingsIcon className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                Settings
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                Manage company account settings and daily rates.
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Content */}
      <div className="flex flex-col space-y-8 lg:flex-row lg:gap-12 lg:space-y-0">
        <aside className="-mx-4 lg:w-1/5">
          {/* Custom Sidebar that overrides the link behavior for simple state switching if router not set up for sub-routes yet */}
          <nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
            {sidebarNavItems.map((item) => (
              <button
                key={item.href}
                onClick={() => setActiveTab(item.href)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md w-full text-left transition-colors ${activeTab === item.href
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100"
                  : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                  }`}
              >
                {item.icon}
                {item.title}
              </button>
            ))}
          </nav>
        </aside>
        <div className="flex-1 lg:max-w-2xl">
          {activeTab === 'profile' && <EditProfilePage />}
          {activeTab === 'gold-rates' && <GoldRatesSettings />}
        </div>
      </div>
    </div>
  );
}
