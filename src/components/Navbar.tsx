
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingCart, Search } from 'lucide-react';

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

  const navLinks = [
    { title: 'Home', path: '/' },
    { title: 'Products', path: '/products' },
    { title: 'About Us', path: '/about' },
    { title: 'Contact', path: '/contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all-300 ${
        isScrolled 
          ? 'glass-morphism py-3' 
          : isHomePage 
            ? 'bg-[#f0f0f0]/85 backdrop-blur-sm py-5' // gray translucent background for homepage
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
              className={`relative font-medium transition-all-200 text-sm uppercase tracking-wide
                ${isActive(link.path) 
                  ? 'text-primary font-semibold' 
                  : 'text-foreground/80 hover:text-primary'
                }
                after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[2px] after:bg-primary after:origin-bottom-right after:scale-x-0 
                ${isActive(link.path) ? 'after:scale-x-100' : 'hover:after:scale-x-100 hover:after:origin-bottom-left'} 
                after:transition-transform after:duration-300
              `}
            >
              {link.title}
            </Link>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-4">
          <button className="text-foreground/70 hover:text-primary transition-all-200 rounded-full p-2 hover:bg-primary/10">
            <Search size={20} />
          </button>
          <button className="relative text-foreground/70 hover:text-primary transition-all-200 rounded-full p-2 hover:bg-primary/10">
            <ShoppingCart size={20} />
            <span className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center bg-primary text-white text-[10px] font-bold rounded-full">
              0
            </span>
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-foreground p-1"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Menu */}
        <div
          className={`fixed inset-0 bg-background/95 backdrop-blur-md z-50 md:hidden transition-all-300 ${
            mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}
        >
          <div className="flex flex-col h-full page-container pt-20 pb-16">
            <div className="flex flex-col space-y-6 text-center">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-xl ${
                    isActive(link.path) ? 'text-primary font-semibold' : 'text-foreground/80'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.title}
                </Link>
              ))}
            </div>

            <div className="mt-auto flex justify-center space-x-8">
              <button className="text-foreground/70 hover:text-primary transition-all-200">
                <Search size={24} />
              </button>
              <button className="relative text-foreground/70 hover:text-primary transition-all-200">
                <ShoppingCart size={24} />
                <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-primary text-white text-xs font-bold rounded-full">
                  0
                </span>
              </button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
