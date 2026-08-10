import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Store,
  LogOut,
  Menu,
  X,
  User as UserIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const AdminLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, end: true },
    { name: 'Products', path: '/admin/products', icon: Package, end: false },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingBag, end: false },
  ];

  const SidebarContent = () => (
    <div className="flex h-full flex-col justify-between p-6">
      <div className="space-y-6">
        {/* Branding */}
        <div>
          <Link to="/" className="block">
            <span className="text-xl font-extrabold tracking-widest text-[#111111] uppercase font-['Plus_Jakarta_Sans']">
              FASHIONIFY
            </span>
          </Link>
          <span className="text-[11px] font-bold tracking-wider text-[#707070] uppercase mt-0.5 block">
            Admin Panel
          </span>
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 text-[14px] font-semibold transition-colors rounded-none ${
                    isActive
                      ? 'bg-[#111111] text-white'
                      : 'text-[#707070] hover:bg-neutral-100 hover:text-[#111111]'
                  }`
                }
              >
                <Icon className="h-4 w-4 stroke-[1.75]" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer / User info */}
      <div className="space-y-4 pt-6 border-t border-neutral-200">
        <Link
          to="/"
          onClick={() => setMobileMenuOpen(false)}
          className="flex items-center gap-2.5 text-[13px] font-semibold text-[#707070] hover:text-[#111111] transition-colors"
        >
          <Store className="h-4 w-4 stroke-[1.75]" />
          <span>Back to Store</span>
        </Link>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="h-8 w-8 rounded-full bg-neutral-100 flex items-center justify-center shrink-0 border border-neutral-200">
              <UserIcon className="h-4 w-4 text-[#111111]" />
            </div>
            <div className="truncate">
              <p className="text-[13px] font-bold text-[#111111] truncate">
                {user?.name || user?.email || 'Admin User'}
              </p>
              <p className="text-[10px] font-semibold text-[#707070] uppercase">Administrator</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            title="Logout"
            className="p-1.5 text-[#707070] hover:text-[#E53935] transition-colors"
          >
            <LogOut className="h-4 w-4 stroke-[1.75]" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col md:flex-row">
      {/* Mobile Top Bar */}
      <header className="flex h-16 items-center justify-between border-b border-neutral-200 bg-white px-4 md:hidden sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#111111]"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
          <span className="text-base font-extrabold tracking-wider text-[#111111] uppercase font-['Plus_Jakarta_Sans']">
            Fashionify Admin
          </span>
        </div>
        <Link to="/">
          <Button variant="ghost" size="sm" className="gap-1 text-xs">
            <Store className="h-3.5 w-3.5" /> Store
          </Button>
        </Link>
      </header>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 md:hidden" onClick={() => setMobileMenuOpen(false)}>
          <div
            className="h-full w-64 bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Desktop Fixed Sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 border-r border-neutral-200 bg-white z-20">
        <SidebarContent />
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 md:pl-64 min-h-screen">
        <div className="p-4 sm:p-8 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
};

export default AdminLayout;
