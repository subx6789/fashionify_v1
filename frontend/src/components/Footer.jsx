import { Link, useLocation } from 'react-router-dom';

const Footer = () => {
  const location = useLocation();

  // Hide footer on Admin pages
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="w-full border-t border-neutral-200 bg-white py-6 text-neutral-600">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 sm:flex-row sm:px-6 lg:px-8">
        <Link to="/" className="text-lg font-black tracking-widest text-[#111111] uppercase font-['Plus_Jakarta_Sans']">
          FASHIONIFY
        </Link>

        <p className="text-xs text-neutral-400">
          © {new Date().getFullYear()} FASHIONIFY. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
