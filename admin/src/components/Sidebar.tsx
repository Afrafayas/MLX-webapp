import React from 'react';
import { LayoutDashboard, Store, ShoppingBag, Users, Settings, ShieldCheck, LogOut } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  pendingCount: number;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, pendingCount, onLogout }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'shops', label: 'Manage Shops', icon: Store, badge: pendingCount > 0 ? pendingCount : null },
    { id: 'products', label: 'Products Directory', icon: ShoppingBag },
    { id: 'users', label: 'User Accounts', icon: Users },
    { id: 'settings', label: 'Platform Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 glass-panel border-r border-white/10 min-h-screen p-4 flex flex-col justify-between hidden md:flex shrink-0">
      <div>
        {/* Brand Logo */}
        <div className="flex items-center gap-3 px-3 py-4 mb-6 border-b border-white/10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="font-extrabold text-xl tracking-tight text-white">
              Cbez<span className="text-indigo-400 text-sm font-semibold ml-1">ADMIN</span>
            </div>
            <div className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">Shop Control Center</div>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">Main Navigation</div>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-inner'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-2 py-0.5 text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full animate-pulse-glow">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Admin User Card Footer */}
      <div className="pt-4 border-t border-white/10">
        <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-900/50 border border-white/5">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow">
            AD
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-white truncate">Super Admin</div>
            <div className="text-[10px] text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
              Live Session
            </div>
          </div>
          <button
            onClick={onLogout}
            className="text-slate-400 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-500/10 transition-colors cursor-pointer"
            title="Log out from Admin"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
