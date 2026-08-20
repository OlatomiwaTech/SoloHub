import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FolderOpen,
  FileText,
  Settings,
  LogOut,
} from "lucide-react";

const Layout = ({ children }) => {
  const location = useLocation();

  const navigation = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Clients", href: "/clients", icon: Users },
    { name: "Projects", href: "/projects", icon: FolderOpen },
    { name: "Invoices", href: "/invoices", icon: FileText },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="hidden md:flex md:flex-col w-64 bg-slate-900 text-white">
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 overflow-hidden rounded-xl bg-white shadow-sm">
              <img
                src="/logo.jpeg"
                alt="SoloHub logo mark"
                className="h-full w-full scale-[1.8] object-cover"
                style={{ objectPosition: '50% 37%' }}
              />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">SoloHub</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Freelance command center</p>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-emerald-600 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-slate-800 cursor-pointer transition">
            <div className="h-8 w-8 rounded-full bg-emerald-600 flex items-center justify-center text-sm font-bold text-white">
              T
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-white">Tomiwa</p>
              <p className="text-xs text-slate-400">Freelancer</p>
            </div>
            <LogOut className="h-4 w-4 text-slate-400" />
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-slate-200 p-4 fixed top-0 left-0 right-0 z-10">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 overflow-hidden rounded-lg bg-white shadow-sm">
              <img
                src="/logo.jpeg"
                alt="SoloHub logo mark"
                className="h-full w-full scale-[1.8] object-cover"
                style={{ objectPosition: '50% 37%' }}
              />
            </div>
            <span className="text-lg font-bold text-slate-900">SoloHub</span>
          </div>
          <div className="h-8 w-8 rounded-full bg-emerald-600 flex items-center justify-center text-sm font-bold text-white">
            T
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto md:ml-0">
        <div className="p-4 md:p-6 pt-20 md:pt-6 max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around py-2 z-10">
        {navigation.slice(0, 4).map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg text-xs ${
                isActive ? "text-emerald-600" : "text-slate-400"
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Layout;