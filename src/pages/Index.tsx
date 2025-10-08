
import React, { useEffect, useState } from 'react';
import { ArrowRight, ShieldCheck, Truck, Clock, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

import Hero from '../components/Hero';
import CustomerReviews from '../components/CustomerReviews';

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero />
      
      {/* Features Section */}
      <section className="section-padding bg-white">
        <div className="page-container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {[
              { icon: ShieldCheck, title: 'Safety Guaranteed', description: 'All products meet stringent safety standards' },
              { icon: Truck, title: 'Fast Delivery', description: 'Prompt and reliable delivery to your doorstep' },
              { icon: Clock, title: '24/7 Support', description: 'Round-the-clock customer service and assistance' },
              { icon: Award, title: 'Premium Quality', description: 'Only the highest quality gas products' }
            ].map((feature, index) => (
              <div 
                key={index}
                className={`p-6 rounded-xl shadow-sm hover:shadow-md transition-all-300 bg-white border border-border/50 flex flex-col items-center text-center animate-fade-in`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon size={24} className="text-primary" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-foreground/70 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Customer Reviews Section */}
      <CustomerReviews />
      
      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-blue-700 z-0"></div>
        <div 
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1589802757263-7fea40e02560?q=80&w=2070')] bg-cover bg-center opacity-20 z-0"
        ></div>
        
        <div className="page-container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">Ready to Experience Premium Gas Solutions?</h2>
            <p className="text-white/90 text-lg mb-8">
              Join thousands of satisfied customers who trust us for their gas needs. From consultation to delivery, we ensure a seamless experience.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/products"
                className="bg-white text-primary font-medium px-6 py-3 rounded-lg hover:bg-white/90 transition-all-200"
              >
                Browse Products
              </Link>
              <Link
                to="/contact"
                className="bg-transparent border border-white text-white font-medium px-6 py-3 rounded-lg hover:bg-white/10 transition-all-200"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
