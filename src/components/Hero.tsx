
import React, { useState, useEffect } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

// Array of background images for the carousel
const backgroundImages = [
  "https://cdn0-production-images-kly.akamaized.net/m2jZn2TtAW1pf613wFNr4kKz9rs=/1200x675/smart/filters:quality(75):strip_icc():format(jpeg)/kly-media-production/medias/4515967/original/012462200_1690427557-01912ff0-5e2e-4d47-8b5d-946344fd31ba.jpeg",
  "https://cdn0-production-images-kly.akamaized.net/DdQc1I4poeHA6MxPKxeEx038xtA=/1200x675/smart/filters:quality(75):strip_icc():format(jpeg)/kly-media-production/medias/2795179/original/096958300_1556865172-20190503-Pertamina-Jamin-Stok-LPG-Ramadan-ANGGA-1.jpg",
  "https://asset-2.tstatic.net/tribunnews/foto/bank/images/Gas-elpiji-gas-LPG-3-kg-bos.jpg"
];

const Hero = () => {
  const [loaded, setLoaded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Handle carousel navigation
  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === backgroundImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? backgroundImages.length - 1 : prevIndex - 1
    );
  };

  // Auto-change image every 3.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      nextImage();
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <section className="relative min-h-[90vh] flex items-center pt-16 overflow-hidden">
      {/* Removed the green overlay gradient */}
      
      {/* Carousel background images */}
      {backgroundImages.map((image, index) => (
        <div 
          key={index}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
            index === currentImageIndex ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ backgroundImage: `url('${image}')` }}
        ></div>
      ))}
      
      {/* Carousel navigation buttons */}
      <button 
        onClick={prevImage}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 transition-all duration-200"
        aria-label="Previous image"
      >
        <ChevronLeft size={24} />
      </button>
      
      <button 
        onClick={nextImage}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 transition-all duration-200"
        aria-label="Next image"
      >
        <ChevronRight size={24} />
      </button>
      
      {/* Content */}
      <div className="page-container relative z-20 py-16 md:py-20">
        <div className="max-w-3xl">
          <div 
            className={`transition-all duration-1000 ease-out ${
              loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <div className="inline-block bg-secondary text-foreground text-sm font-medium px-3 py-1 rounded-full mb-6">
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
              className="bg-secondary hover:bg-secondary/90 text-foreground font-medium px-6 py-3 rounded-lg transition-all-200 inline-flex items-center"
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
