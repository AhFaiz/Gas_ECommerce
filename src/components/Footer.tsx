
import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-secondary pt-16 pb-8 text-foreground/80">
      <div className="page-container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="space-y-4">
            <Link
              to="/"
              className="inline-block text-primary font-display font-bold text-2xl mb-2"
            >
              Gas<span className="text-foreground">ify</span>
            </Link>
            <p className="text-sm leading-relaxed">
              Your trusted partner for reliable gas supply solutions. We deliver quality products with exceptional service.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="text-foreground/60 hover:text-primary transition-all-200" aria-label="Facebook">
                <Facebook size={18} />
              </a>
              <a href="#" className="text-foreground/60 hover:text-primary transition-all-200" aria-label="Twitter">
                <Twitter size={18} />
              </a>
              <a href="#" className="text-foreground/60 hover:text-primary transition-all-200" aria-label="Instagram">
                <Instagram size={18} />
              </a>
              <a href="#" className="text-foreground/60 hover:text-primary transition-all-200" aria-label="LinkedIn">
                <Linkedin size={18} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-display font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-sm hover:text-primary transition-all-200 hover:translate-x-1 inline-block">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-sm hover:text-primary transition-all-200 hover:translate-x-1 inline-block">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm hover:text-primary transition-all-200 hover:translate-x-1 inline-block">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm hover:text-primary transition-all-200 hover:translate-x-1 inline-block">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-display font-semibold text-lg mb-4">Products</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/products" className="text-sm hover:text-primary transition-all-200 hover:translate-x-1 inline-block">
                  Household Gas
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-sm hover:text-primary transition-all-200 hover:translate-x-1 inline-block">
                  Industrial Gas
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-sm hover:text-primary transition-all-200 hover:translate-x-1 inline-block">
                  Commercial Gas
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-sm hover:text-primary transition-all-200 hover:translate-x-1 inline-block">
                  Portable Cylinders
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-display font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin size={18} className="text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm">123 Gas Avenue, Industrial Park, Jakarta 12345, Indonesia</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={18} className="text-primary flex-shrink-0" />
                <span className="text-sm">+62 123 4567 890</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={18} className="text-primary flex-shrink-0" />
                <span className="text-sm">info@gasify.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border/50 mt-10 pt-6 text-center text-sm text-foreground/60">
          <p>&copy; {new Date().getFullYear()} Gasify. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
