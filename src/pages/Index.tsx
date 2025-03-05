
import React, { useEffect, useState } from 'react';
import { ArrowRight, ShieldCheck, Truck, Clock, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

import Hero from '../components/Hero';
import Testimonial from '../components/Testimonial';

// Sample testimonial data
const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Homeowner',
    avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
    content: 'The service is exceptional! My gas cylinders are always delivered on time, and the staff is very courteous. I\'ve been a customer for over 2 years now and highly recommend Gasify.',
    rating: 5,
  },
  {
    name: 'Michael Chen',
    role: 'Restaurant Owner',
    avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
    content: 'As a restaurant owner, reliable gas supply is critical for my business. Gasify has never let me down, even during peak seasons. Their commercial solutions are perfect for our needs.',
    rating: 5,
  },
  {
    name: 'David Rodriguez',
    role: 'Factory Manager',
    avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
    content: 'We\'ve partnered with Gasify for our industrial gas needs for the last 3 years. Their bulk delivery options and competitive pricing have helped us optimize our operations.',
    rating: 4,
  }
];

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
      
      {/* Testimonials Section */}
      <section className="section-padding bg-gray-50">
        <div className="page-container">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">What Our Customers Say</h2>
            <p className="text-foreground/70">Don't just take our word for it – here's what customers have to say about our products and services</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className="animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Testimonial {...testimonial} />
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Newsletter Section */}
      <section className="section-padding bg-white">
        <div className="page-container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Stay Updated</h2>
            <p className="text-foreground/70 mb-8">
              Subscribe to our newsletter for the latest product updates, promotions, and industry insights.
            </p>
            
            <form className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-grow px-4 py-3 rounded-lg border border-border focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none transition-all-200"
                required
              />
              <button
                type="submit"
                className="bg-primary hover:bg-primary/90 text-white font-medium px-6 py-3 rounded-lg transition-all-200 whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
            <p className="text-xs text-foreground/60 mt-3">
              By subscribing, you agree to our Privacy Policy and consent to receive updates from our company.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
