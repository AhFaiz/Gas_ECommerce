
import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import ContactForm from '../components/ContactForm';

const Contact = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Our Location',
      content: 'Jl H.Mawi KP. Waru, GG. SERIUS RT04/RW01, Parung, Indonesia',
    },
    {
      icon: Phone,
      title: 'Phone Number',
      content: '+62 812 8332 9743',
    },
    {
      icon: Mail,
      title: 'Email Address',
      content: 'info@gasify.com',
    },
    {
      icon: Clock,
      title: 'Business Hours',
      content: 'Mon - Fri: 8:00 AM - 6:00 PM',
    },
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/90 to-blue-600/90 text-white py-16 md:py-24">
        <div className="page-container">
          <div className="max-w-3xl">
            <h1 
              className={`font-display font-bold text-3xl md:text-4xl lg:text-5xl mb-6 transition-all duration-1000 ease-out ${
                loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              Get in Touch
            </h1>
            <p 
              className={`text-white/80 text-lg md:text-xl max-w-2xl transition-all duration-1000 delay-200 ease-out ${
                loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              Have questions or need assistance? We're here to help! Reach out to our friendly team through any of the channels below.
            </p>
          </div>
        </div>
      </section>
      
      {/* Contact Information */}
      <section className="py-12 md:py-16 bg-white">
        <div className="page-container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {contactInfo.map((item, index) => (
              <div 
                key={index} 
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all-300 p-6 border border-border/50 flex flex-col items-center text-center animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <item.icon size={24} className="text-primary" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-foreground/70">{item.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Contact Form Section */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="page-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <div>
              <h2 className="font-display font-bold text-3xl mb-4">Send Us a Message</h2>
              <p className="text-foreground/70 mb-8">
                Fill out the form below, and our team will get back to you as soon as possible. We value your inquiries and are committed to providing you with the information you need.
              </p>
              
              <ContactForm />
            </div>
            
            <div className="lg:pl-10">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-border/50 mb-8">
                <h3 className="font-display font-semibold text-xl mb-4">Frequently Asked Questions</h3>
                
                <div className="space-y-6">
                  {[
                    {
                      question: "How do I place an order for gas delivery?",
                      answer: "You can place an order through our website, mobile app, or by calling our customer service number. We'll arrange delivery based on your location and availability."
                    },
                    {
                      question: "What payment methods do you accept?",
                      answer: "We accept cash, credit/debit cards, bank transfers, and digital payment methods like GoPay and OVO."
                    },
                    {
                      question: "How quickly can I get gas delivered?",
                      answer: "For standard deliveries, we typically deliver within 24-48 hours. For emergency situations, we offer expedited delivery services."
                    },
                    {
                      question: "Do you offer bulk discounts for businesses?",
                      answer: "Yes, we provide special pricing for commercial and industrial customers based on volume and frequency of orders. Contact our sales team for details."
                    }
                  ].map((faq, index) => (
                    <div key={index}>
                      <h4 className="font-medium text-base mb-1">{faq.question}</h4>
                      <p className="text-foreground/70 text-sm">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
