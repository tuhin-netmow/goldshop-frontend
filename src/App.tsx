import { Link } from "react-router";
import { useAuthUserQuery } from "./store/features/auth/authApiService";
import { Loader, Gem, TrendingUp, Package, ShoppingCart, Hammer, PiggyBank, BarChart3, ShieldCheck, ArrowRight } from "lucide-react";
import { useGetSettingsInfoQuery } from "./store/features/admin/settingsApiService";
import { useAppSettings } from "./hooks/useAppSettings";

import { useAppSelector } from "./store/store";
import { sidebarItemLink } from "./config/sidebarItemLInk";
import { getFirstAllowedRoute } from "./utils/permissionUtils";



const APP = () => {
  const token = useAppSelector((state) => state.auth.token);
  const { data: user, isLoading } = useAuthUserQuery(undefined, {
    skip: !token,
  });

  const { data: settings } = useGetSettingsInfoQuery();
  const isLoggedIn = user?.data?.user?.email;

  useAppSettings(settings?.data);


  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-900">

      {/* SECTION 1: Hero Section */}
      <section className="relative bg-slate-900 text-white py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-yellow-500 rounded-full blur-3xl mix-blend-multiply filter opacity-30 animate-blob"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl mix-blend-multiply filter opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-32 left-20 w-96 h-96 bg-pink-500 rounded-full blur-3xl mix-blend-multiply filter opacity-30 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 mb-8 backdrop-blur-sm">
            <Gem size={16} />
            <span className="text-sm font-medium uppercase tracking-wider">Premium Gold Shop Solutions</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
            The <span className="text-transparent bg-clip-text bg-linear-to-r from-yellow-300 via-yellow-500 to-yellow-600">Gold Standard</span> in <br className="hidden md:block" /> Business Management
          </h1>

          <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-3xl leading-relaxed">
            Elevate your jewelry business with an all-in-one ERP designed for precision. From live rates to karigar management, we handle the carat, so you can focus on the shine.
          </p>

          <div className="flex gap-4 flex-col sm:flex-row">
            {isLoading ? (
              <div className="px-8 py-4 text-white"><Loader className="animate-spin" /></div>
            ) : isLoggedIn ? (
              <Link
                to={getFirstAllowedRoute(sidebarItemLink, user?.data?.user?.role?.permissions || [])}
                className="px-8 py-4 bg-yellow-500 text-slate-900 font-bold rounded-lg shadow-lg shadow-yellow-500/20 hover:bg-yellow-400 transition transform hover:-translate-y-1 flex items-center gap-2"
              >
                Go to Dashboard <ArrowRight size={20} />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-8 py-4 bg-yellow-500 text-slate-900 font-bold rounded-lg shadow-lg shadow-yellow-500/20 hover:bg-yellow-400 transition transform hover:-translate-y-1"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* SECTION 2: Limitless Real-Time Rates */}
      <section className="py-20 px-6 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-6">
                <TrendingUp size={24} />
              </div>
              <h2 className="text-3xl font-bold mb-4 text-slate-800">Live Gold & Silver Rates</h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                Stay updated with real-time market fluctuations. Our dynamic rate engine allows you to define buy/sell margins for 24K, 22K, and 18K gold instantly across all your counters.
              </p>
              <ul className="space-y-3">
                {['Direct Market Integration', 'Multi-city Rate Support', 'Historical Rate Charts'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-700">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-xs">✓</div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex-1 bg-slate-50 p-8 rounded-2xl border border-slate-200 w-full">
              {/* Mock Rate Card */}
              <div className="bg-white rounded-xl shadow-xs overflow-hidden">
                <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
                  <span className="font-semibold">Today's Rates</span>
                  <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">Live ●</span>
                </div>
                <div className="p-4 space-y-4">
                  <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                    <div>
                      <p className="font-bold text-slate-800">Gold 24K</p>
                      <p className="text-xs text-gray-500">99.9% Purity</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">$84.50 / gm</p>
                      <p className="text-xs text-green-600 flex items-center justify-end gap-1">▲ 0.4%</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                    <div>
                      <p className="font-bold text-slate-800">Gold 22K</p>
                      <p className="text-xs text-gray-500">Standard Jewellery</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">$78.20 / gm</p>
                      <p className="text-xs text-green-600 flex items-center justify-end gap-1">▲ 0.2%</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-bold text-slate-800">Silver</p>
                      <p className="text-xs text-gray-500">Fine Silver</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-600">$0.92 / gm</p>
                      <p className="text-xs text-red-500 flex items-center justify-end gap-1">▼ 0.1%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: Inventory Management */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-800">Precision Inventory Control</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Track every item by Tag ID, gross weight, net weight, stones, and purity.</p>
        </div>

        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
          {[
            { icon: Package, title: "RFID Tagging", desc: "Scan hundreds of items in seconds. Automate audits and eliminate manual stock counting errors." },
            { icon: ShieldCheck, title: "Hallmark Verification", desc: "Record HUID and certificate details for every piece to ensure compliance and build customer trust." },
            { icon: ShoppingCart, title: "Stock Aging Analysis", desc: "Identify slow-moving stock and optimize your inventory mix for maximum turnover." }
          ].map((feature, i) => (
            <div key={i} className="bg-white p-8 rounded-2xl shadow-xs hover:shadow-md transition duration-300 border border-transparent hover:border-yellow-200 group">
              <div className="w-14 h-14 bg-yellow-50 rounded-full flex items-center justify-center text-yellow-600 mb-6 group-hover:scale-110 transition">
                <feature.icon size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-800">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 4: Manufacturing & Karigar */}
      <section className="py-20 px-6 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row-reverse items-center gap-16">
          <div className="flex-1">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 mb-6">
              <Hammer size={24} />
            </div>
            <h2 className="text-3xl font-bold mb-4 text-slate-800">Manufacturing & Karigar Accounts</h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              Complete visibility into your melting pot. Track gold issuance to Karigars (artisans), manage wastage (ghat), making charges, and purity testing returns.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-orange-50 rounded-lg border border-orange-100">
                <h4 className="font-bold text-orange-800 mb-1">Job Works</h4>
                <p className="text-sm text-orange-600">Track order status from raw to polished.</p>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg border border-orange-100">
                <h4 className="font-bold text-orange-800 mb-1">Loss Management</h4>
                <p className="text-sm text-orange-600">Auto-calculate acceptable vs. excess loss.</p>
              </div>
            </div>
          </div>
          <div className="flex-1 relative">
            <div className="absolute inset-0 bg-linear-to-tr from-yellow-200 to-orange-100 rounded-full filter blur-3xl opacity-30"></div>
            <img
              src="https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800"
              alt="Goldsmith working"
              className="relative rounded-2xl shadow-xl border-4 border-white transform -rotate-2 hover:rotate-0 transition duration-500"
            />
          </div>
        </div>
      </section>

      {/* SECTION 5: Saving Schemes */}
      <section className="py-20 px-6 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mb-8 backdrop-blur-md">
            <PiggyBank size={32} className="text-yellow-400" />
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Gold Saving Schemes</h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-12">
            Boost customer loyalty and predictable revenue. Manage monthly installment schemes (11+1), generated maturity alerts, and automated ledger postings.
          </p>

          <div className="grid md:grid-cols-4 gap-6 text-left">
            {[
              { val: "Automated", label: "Reminders via SMS/WhatsApp" },
              { val: "Flexible", label: "Weight or Value based accumulation" },
              { val: "Secure", label: "Digital passbooks for customers" },
              { val: "Compliant", label: "KYC & Maturity handling" }
            ].map((stat, i) => (
              <div key={i} className="p-6 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition">
                <div className="text-xl font-bold text-yellow-400 mb-1">{stat.val}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6: Analytics */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 order-2 md:order-1">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-6 rounded-2xl shadow-xs">
                  <div className="text-gray-500 text-sm mb-2">Total Sales</div>
                  <div className="text-2xl font-bold text-slate-800">$1.2M</div>
                  <div className="w-full bg-gray-100 h-1.5 rounded-full mt-3 overflow-hidden">
                    <div className="bg-blue-500 h-full w-[70%]"></div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-xs mt-8">
                  <div className="text-gray-500 text-sm mb-2">Gold Stock</div>
                  <div className="text-2xl font-bold text-slate-800">4.5 kg</div>
                  <div className="w-full bg-gray-100 h-1.5 rounded-full mt-3 overflow-hidden">
                    <div className="bg-yellow-500 h-full w-[45%]"></div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-xs col-span-2">
                  <div className="flex justify-between items-end mb-4">
                    <div>
                      <div className="text-gray-500 text-sm mb-1">Customer Growth</div>
                      <div className="text-2xl font-bold text-slate-800">+850 <span className="text-sm font-normal text-green-500">New this month</span></div>
                    </div>
                    <BarChart3 className="text-blue-500" />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1 order-1 md:order-2">
              <h2 className="text-3xl font-bold mb-4 text-slate-800">Business Intelligence</h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                Don't just sell, analyze. Our dashboard gives you a bird's eye view of your top-selling designs, karigar performance, and daily profit/loss reports.
              </p>
              <a href="#" className="text-blue-600 font-semibold hover:text-blue-700 inline-flex items-center gap-2 group">
                View Sample Reports <ArrowRight size={16} className="group-hover:translate-x-1 transition" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: Footer / CTA */}
      <footer className="bg-slate-900 border-t border-slate-800 pt-20 pb-10 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Transform Your Gold Business?</h2>
          <p className="text-gray-400 mb-10">Join 500+ jewelers who trust our ERP for their daily operations.</p>

          {!isLoggedIn && (
            <Link
              to="/login"
              className="px-10 py-4 bg-yellow-500 text-slate-900 font-bold rounded-lg shadow-lg hover:bg-yellow-400 transition inline-block"
            >
              Get Started Now
            </Link>
          )}

          <div className="mt-20 pt-10 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
            <p>&copy; {new Date().getFullYear()} GoldShop ERP. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition">Privacy Policy</a>
              <a href="#" className="hover:text-white transition">Terms of Service</a>
              <a href="#" className="hover:text-white transition">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default APP;
