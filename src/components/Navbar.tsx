
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

  // Close mobile menu when changing routes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { title: 'Home', path: '/', icon: <Home size={18} className="mr-2" /> },
    { title: 'Products', path: '/products', icon: <Package size={18} className="mr-2" /> },
    { title: 'About Us', path: '/about', icon: <Info size={18} className="mr-2" /> },
    { title: 'Contact', path: '/contact', icon: <MessageSquare size={18} className="mr-2" /> },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all-300 ${
        isScrolled 
          ? 'glass-morphism py-3' 
          : isHomePage 
            ? 'bg-[#f0f0f0]/85 backdrop-blur-sm py-5' 
            : 'bg-transparent py-5'
      }`}
    >
      <nav className="page-container flex justify-between items-center">
        <Link 
          to="/" 
          className="flex items-center space-x-2 text-primary font-display font-bold text-2xl transition-transform-300 hover:scale-105"
        >
          <span className="flex items-center">Gas<span className="text-foreground">ify</span></span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`relative font-medium transition-all-200 text-sm uppercase tracking-wide flex items-center
                ${isActive(link.path) 
                  ? 'text-primary font-semibold' 
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

        {/* Empty div to maintain layout balance (replaced cart icons) */}
        <div className="hidden md:block"></div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-foreground p-1 z-50"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Menu - Fullscreen overlay */}
        <div
          className={`fixed inset-0 bg-background/95 backdrop-blur-md z-40 md:hidden transition-all-300 ${
            mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
          }`}
        >
          <div className="flex flex-col h-full page-container pt-24 pb-16">
            <div className="flex flex-col space-y-8 text-center">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-xl flex items-center justify-center transition-all-200 ${
                    isActive(link.path) ? 'text-primary font-semibold' : 'text-foreground/80'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {React.cloneElement(link.icon, { size: 24 })}
                  <span className="ml-3 text-lg font-medium">{link.title}</span>
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
