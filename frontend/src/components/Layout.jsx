import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  FolderOpen,
  FileText,
  Settings,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Clients', href: '/clients', icon: Users },
  { name: 'Projects', href: '/projects', icon: FolderOpen },
  { name: 'Invoices', href: '/invoices', icon: FileText },
  { name: 'Settings', href: '/settings', icon: Settings },
];

const getInitials = (name) => {
  if (!name) return 'U';
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const Layout = ({ children }) => {
  const location = useLocation();
  const { user, logout } = useAuth();

  return (
    <div className="flex h-screen bg-slate-50">
      <aside className="hidden w-64 flex-col bg-slate-900 text-white md:flex">
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 overflow-hidden rounded-xl bg-white shadow-sm">
              <img src="/logo.jpeg" alt="SoloHub logo mark" className="h-full w-full scale-[1.8] object-cover" style={{ objectPosition: '50% 37%' }} />
            </div>
            <span className="text-xl font-bold tracking-tight">SoloHub</span>
          </div>
          <p className="mt-1 text-xs text-slate-400">Freelance command center</p>
        </div>
        <nav className="flex-1 space-y-1 px-4">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            return (
              <Link key={item.name} to={item.href} className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${isActive ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}>
                <Icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-slate-800 p-4">
          <div className="flex items-center gap-3 rounded-lg px-4 py-2.5 transition hover:bg-slate-800">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white">{getInitials(user?.fullName)}</div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">{user?.fullName || 'User'}</p>
              <p className="truncate text-xs text-slate-400">{user?.email || 'Freelancer'}</p>
            </div>
            <button type="button" onClick={logout} title="Log out" aria-label="Log out">
              <LogOut className="h-4 w-4 text-slate-400 transition-colors hover:text-white" />
            </button>
          </div>
        </div>
      </aside>

      <div className="fixed left-0 right-0 top-0 z-10 border-b border-slate-200 bg-white p-4 md:hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 overflow-hidden rounded-lg bg-white shadow-sm">
              <img src="/logo.jpeg" alt="SoloHub logo mark" className="h-full w-full scale-[1.8] object-cover" style={{ objectPosition: '50% 37%' }} />
            </div>
            <span className="text-lg font-bold text-slate-900">SoloHub</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-700">{user?.fullName || 'User'}</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white">{getInitials(user?.fullName)}</div>
          </div>
        </div>
      </div>

      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-7xl p-4 pt-20 md:p-6">{children}</div>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-10 flex justify-around border-t border-slate-200 bg-white py-2 md:hidden">
        {navigation.slice(0, 4).map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;
          return (
            <Link key={item.name} to={item.href} className={`flex flex-col items-center gap-0.5 rounded-lg px-3 py-1 text-xs ${isActive ? 'text-emerald-600' : 'text-slate-400'}`}>
              <Icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Layout;
