
import React, { useEffect, useState } from 'react';
import { ArrowRight, ShieldCheck, Truck, Clock, Award, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import Testimonial from '../components/Testimonial';

// Sample product data
const featuredProducts = [
  {
    id: 1,
    name: 'Premium Household LPG Cylinder',
    price: 45.99,
    image: 'https://images.unsplash.com/photo-1585105583421-5cb5f30eea6d?q=80&w=1883',
    category: 'Household',
    isNew: true,
  },
  {
    id: 2,
    name: 'Industrial Propane Gas Tank',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1599059026939-1a4cd20732ef?q=80&w=1898',
    category: 'Industrial',
  },
  {
    id: 3,
    name: 'Portable Camping Gas Canister',
    price: 19.95,
    image: 'https://images.unsplash.com/photo-1635859691068-54aef99a15fa?q=80&w=2069',
    category: 'Portable',
    isNew: true,
  },
  {
    id: 4,
    name: 'Commercial Grade Natural Gas Regulator',
    price: 78.50,
    image: 'https://images.unsplash.com/photo-1589802757245-d10a4135b023?q=80&w=2070',
    category: 'Commercial',
  }
];

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

// Categories
const categories = [
  {
    name: 'Household',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2080',
    description: 'Safe and efficient gas solutions for your home',
  },
  {
    name: 'Industrial',
    image: 'https://images.unsplash.com/photo-1533630561530-d4dd1367db7a?q=80&w=2070',
    description: 'High-capacity gas systems for industrial use',
  },
  {
    name: 'Commercial',
    image: 'https://images.unsplash.com/photo-1585242513918-c8d13d547de5?q=80&w=2070',
    description: 'Reliable gas solutions for businesses',
  },
  {
    name: 'Portable',
    image: 'https://images.unsplash.com/photo-1575343318422-058f3390b8a2?q=80&w=1932',
    description: 'Compact gas canisters for outdoor activities',
  },
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
      
      {/* Categories Section */}
      <section className="section-padding bg-gray-50">
        <div className="page-container">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Gas Solutions for Every Need</h2>
            <p className="text-foreground/70">Explore our comprehensive range of gas products designed for various applications</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Link
                to="/products"
                key={category.name}
                className={`group relative overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-all-300 aspect-square animate-fade-in`}
                style={{ animationDelay: `${100 + index * 100}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20 z-10"></div>
                <img
                  src={category.image}
                  alt={category.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 z-20 p-6 flex flex-col justify-end">
                  <h3 className="text-white font-display font-semibold text-xl mb-1">{category.name}</h3>
                  <p className="text-white/80 text-sm mb-4">{category.description}</p>
                  <div className="text-primary-foreground text-sm font-medium group-hover:underline flex items-center w-fit">
                    Explore Products
                    <ArrowRight size={16} className="ml-1 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      {/* Featured Products Section */}
      <section className="section-padding">
        <div className="page-container">
          <div className="flex flex-wrap items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-2">Featured Products</h2>
              <p className="text-foreground/70">Our most popular gas solutions for your needs</p>
            </div>
            <Link 
              to="/products" 
              className="mt-4 md:mt-0 inline-flex items-center text-primary font-medium hover:text-primary/80 transition-all-200"
            >
              View All Products
              <ArrowRight size={18} className="ml-1 transition-transform hover:translate-x-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {featuredProducts.map((product, index) => (
              <div 
                key={product.id} 
                className="animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <ProductCard {...product} />
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
