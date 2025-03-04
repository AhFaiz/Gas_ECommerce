
import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <section className="relative min-h-[90vh] flex items-center pt-16 overflow-hidden">
      {/* Background with overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40 z-10"></div>
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1588152850700-c8d2abe38762?q=80&w=2070')] bg-cover bg-center"></div>
      
      {/* Content */}
      <div className="page-container relative z-20 py-16 md:py-20">
        <div className="max-w-3xl">
          <div 
            className={`transition-all duration-1000 ease-out ${
              loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <div className="inline-block bg-primary/90 backdrop-blur-sm text-white text-sm font-medium px-3 py-1 rounded-full mb-6">
              Premium Quality Gas Products
            </div>
          </div>
          
          <h1 
            className={`text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white leading-tight mb-6 transition-all duration-1000 delay-200 ease-out ${
              loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            Safe, Reliable &<br />Efficient Gas Solutions
          </h1>
          
          <p 
            className={`text-white/80 text-lg md:text-xl max-w-2xl mb-8 transition-all duration-1000 delay-400 ease-out ${
              loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            We provide high-quality gas products for residential, commercial, and industrial applications with prompt delivery and exceptional service.
          </p>
          
          <div 
            className={`flex flex-wrap gap-4 transition-all duration-1000 delay-600 ease-out ${
              loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <Link
              to="/products"
              className="bg-primary hover:bg-primary/90 text-white font-medium px-6 py-3 rounded-lg transition-all-200 inline-flex items-center"
            >
              Explore Products
              <ArrowRight size={18} className="ml-2" />
            </Link>
            <Link
              to="/contact"
              className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-medium px-6 py-3 rounded-lg transition-all-200"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
