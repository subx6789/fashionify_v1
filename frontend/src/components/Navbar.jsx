import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag, User as UserIcon, LogOut, Menu, X, Package, Layers } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartItemCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Do not render main Navbar on Admin pages
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  const handleLogout = async () => {
    // TODO: Call logout from AuthContext and navigate to /login
    await logout();
    navigate('/login');
  };

  const isAdmin = user?.role === 'ADMIN';

  const linkClass = ({ isActive }) =>
    `text-[14px] tracking-wide transition-colors ${
      isActive
        ? 'font-bold text-[#111111] border-b-2 border-[#111111] pb-0.5'
        : 'font-medium text-neutral-600 hover:text-[#111111]'
    }`;

  const mobileLinkClass = ({ isActive }) =>
    `text-[14px] uppercase tracking-wider ${
      isActive ? 'font-black text-[#111111]' : 'font-semibold text-neutral-500'
    }`;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-100 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl sm:text-2xl font-black tracking-widest text-[#111111] uppercase font-['Plus_Jakarta_Sans']">
            FASHIONIFY
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          <NavLink to="/" className={linkClass} end>
            HOME
          </NavLink>
          <NavLink to="/about" className={linkClass}>
            ABOUT
          </NavLink>
          <NavLink to="/contact" className={linkClass}>
            CONTACT US
          </NavLink>
          {user && (
            <NavLink to="/my-orders" className={linkClass}>
              MY ORDERS
            </NavLink>
          )}

          {isAdmin && (
            <>
              <NavLink to="/admin/products" className="flex items-center gap-1.5 text-[14px] font-semibold text-[#111111] hover:text-neutral-500">
                <Package className="h-4 w-4" /> ADMIN PRODUCTS
              </NavLink>
              <NavLink to="/admin/orders" className="flex items-center gap-1.5 text-[14px] font-semibold text-[#111111] hover:text-neutral-500">
                <Layers className="h-4 w-4" /> ADMIN ORDERS
              </NavLink>
            </>
          )}
        </nav>

        {/* Action Buttons */}
        <div className="hidden items-center gap-5 md:flex">
          <Link to="/cart">
            <button className="relative flex items-center gap-2 text-[14px] font-medium text-[#111111] hover:text-neutral-500">
              <ShoppingBag className="h-5 w-5 stroke-[1.5]" />
              <span>CART</span>
              {cartItemCount > 0 && (
                <span className="ml-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#111111] px-1 text-[10px] font-bold text-white">
                  {cartItemCount}
                </span>
              )}
            </button>
          </Link>

          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-[14px] font-medium text-[#111111]">
                <UserIcon className="h-4 w-4 stroke-[1.5]" />
                <span>{user.name || 'USER'}</span>
                {isAdmin && <Badge variant="secondary" className="ml-1 text-[9px] py-0 px-1">ADMIN</Badge>}
              </div>
              <button onClick={handleLogout} className="text-[#707070] hover:text-[#111111] transition-colors">
                <LogOut className="h-4 w-4 stroke-[1.5]" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-[14px] font-medium text-[#111111] hover:text-neutral-500">
                LOG IN
              </Link>
              <Link to="/register">
                <Button size="sm">REGISTER</Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu controls */}
        <div className="flex items-center gap-3 md:hidden">
          <Link to="/cart" className="relative p-1">
            <ShoppingBag className="h-5 w-5 stroke-[1.5] text-[#111111]" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#111111] text-[10px] font-bold text-white">
                {cartItemCount}
              </span>
            )}
          </Link>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-1 text-[#111111]">
            {mobileMenuOpen ? <X className="h-6 w-6 stroke-[1.5]" /> : <Menu className="h-6 w-6 stroke-[1.5]" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-b border-neutral-200 bg-white px-6 pb-6 pt-4 md:hidden">
          <div className="flex flex-col space-y-4">
            <NavLink
              to="/"
              end
              onClick={() => setMobileMenuOpen(false)}
              className={mobileLinkClass}
            >
              Home
            </NavLink>
            <NavLink
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className={mobileLinkClass}
            >
              About
            </NavLink>
            <NavLink
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className={mobileLinkClass}
            >
              Contact Us
            </NavLink>
            {user && (
              <NavLink
                to="/my-orders"
                onClick={() => setMobileMenuOpen(false)}
                className={mobileLinkClass}
              >
                My Orders
              </NavLink>
            )}
            {isAdmin && (
              <>
                <NavLink
                  to="/admin/products"
                  onClick={() => setMobileMenuOpen(false)}
                  className={mobileLinkClass}
                >
                  Admin Products
                </NavLink>
                <NavLink
                  to="/admin/orders"
                  onClick={() => setMobileMenuOpen(false)}
                  className={mobileLinkClass}
                >
                  Admin Orders
                </NavLink>
              </>
            )}

            <div className="pt-4 border-t border-neutral-100 flex flex-col space-y-3">
              {user ? (
                <div className="flex items-center justify-between">
                  <span className="text-[14px] font-medium text-[#111111]">{user.name || user.email}</span>
                  <Button variant="outline" size="sm" onClick={() => { handleLogout(); setMobileMenuOpen(false); }}>
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full">LOG IN</Button>
                  </Link>
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full">REGISTER</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;