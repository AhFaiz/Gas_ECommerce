
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Home, User, Building2, Calendar, FileVideo, Mail, Moon } from 'lucide-react';

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
    { title: 'Home', path: '/', icon: Home },
    { title: 'Profile', path: '/about', icon: User },
    { title: 'Facilities', path: '/facilities', icon: Building2 },
    { title: 'Activities', path: '/activities', icon: Calendar },
    { title: 'Media Center', path: '/media', icon: FileVideo },
    { title: 'Contact', path: '/contact', icon: Mail },
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
          {navLinks.map((link) => {
            const IconComponent = link.icon;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`relative font-medium transition-all-200 text-sm flex items-center gap-1
                  ${isActive(link.path) 
                    ? 'text-primary font-semibold' 
                    : 'text-foreground/80 hover:text-primary'
                  }
                `}
              >
                <IconComponent size={16} />
                <span>{link.title}</span>
              </Link>
            );
          })}
        </div>

        {/* Dark Mode Toggle (right side) */}
        <div className="hidden md:block">
          <button className="text-foreground/80 hover:text-primary transition-colors-200">
            <Moon size={18} />
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
              {navLinks.map((link) => {
                const IconComponent = link.icon;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center justify-center gap-2 text-xl ${
                      isActive(link.path) ? 'text-primary font-semibold' : 'text-foreground/80'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <IconComponent size={20} />
                    <span>{link.title}</span>
                  </Link>
                );
              })}
              
              {/* Dark Mode Toggle in Mobile Menu */}
              <button className="flex items-center justify-center gap-2 text-xl text-foreground/80">
                <Moon size={20} />
                <span>Dark Mode</span>
              </button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
