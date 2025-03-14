
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Home, Package, Info, MessageSquare } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [mobileMenuOpen]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { title: 'Home', path: '/', icon: <Home size={18} className="mr-2" /> },
    { title: 'Products', path: '/products', icon: <Package size={18} className="mr-2" />, activeColor: 'text-green-500' },
    { title: 'About Us', path: '/about', icon: <Info size={18} className="mr-2" /> },
    { title: 'Contact', path: '/contact', icon: <MessageSquare size={18} className="mr-2" /> },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all-300 ${
        isScrolled 
          ? 'bg-white shadow-md py-3' 
          : isHomePage 
            ? 'bg-white shadow-sm py-5' 
            : 'bg-white py-5'
      }`}
    >
      <nav className="page-container flex justify-between items-center">
        <Link 
          to="/" 
          className="flex items-center space-x-2 text-primary font-display font-bold text-2xl transition-transform-300 hover:scale-105"
        >
          <span className="flex items-center">Gas<span className="text-foreground">ify</span></span>
        </Link>

        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`relative font-medium transition-all-200 text-sm uppercase tracking-wide flex items-center
                ${isActive(link.path) 
                  ? link.activeColor || 'text-primary font-semibold' 
                  : 'text-foreground/80 hover:text-primary'
                }
                after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[2px] after:bg-primary after:origin-bottom-right after:scale-x-0 
                ${isActive(link.path) ? 'after:scale-x-100' : 'hover:after:scale-x-100 hover:after:origin-bottom-left'} 
                after:transition-transform after:duration-300
              `}
            >
              {link.icon}
              {link.title}
            </Link>
          ))}
        </div>

        <div className="hidden md:block"></div>

        <button
          className="md:hidden text-foreground p-1 z-50"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div
          className={`fixed inset-0 bg-white z-40 md:hidden transition-all-300 ${
            mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
          }`}
        >
          <div className="flex flex-col h-full pt-20 pb-16 px-6">
            <div className="flex flex-col space-y-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center text-lg font-medium transition-all-200
                    ${isActive(link.path) 
                      ? (link.path === '/products' ? 'text-green-500' : 'text-primary') 
                      : 'text-gray-800'
                    }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="w-8 h-8 flex items-center justify-center mr-4 bg-gray-100 rounded-md">
                    {React.cloneElement(link.icon, { 
                      size: 24,
                      className: isActive(link.path) && link.path === '/products' ? 'text-green-500' : 
                               isActive(link.path) ? 'text-primary' : 'text-gray-600'
                    })}
                  </span>
                  <span>{link.title}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
