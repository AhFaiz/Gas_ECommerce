
import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../integrations/supabase/client';

const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Save to Supabase
      const { data, error } = await supabase
        .from('client_messages')
        .insert({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          subject: formData.subject,
          message: formData.message,
          status: 'Unread', // Explicitly set as string literal to match expected type
          starred: false,
          date: new Date().toISOString(),
        });
      
      if (error) {
        console.error('Error submitting form:', error);
        toast.error('There was an error sending your message. Please try again.');
        setIsSubmitting(false);
        return;
      }
      
      console.log('Form submitted:', formData);
      toast.success('Your message has been sent successfully!');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1.5">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 rounded-lg border border-border focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none transition-all-200"
            placeholder="Your name"
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1.5">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 rounded-lg border border-border focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none transition-all-200"
            placeholder="your.email@example.com"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label htmlFor="phone" className="block text-sm font-medium mb-1.5">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-lg border border-border focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none transition-all-200"
            placeholder="+62 123 4567 890"
          />
        </div>
        
        <div>
          <label htmlFor="subject" className="block text-sm font-medium mb-1.5">
            Subject <span className="text-red-500">*</span>
          </label>
          <select
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 rounded-lg border border-border focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none transition-all-200 bg-white"
          >
            <option value="" disabled>Select a subject</option>
            <option value="General Inquiry">General Inquiry</option>
            <option value="Product Information">Product Information</option>
            <option value="Order Status">Order Status</option>
            <option value="Technical Support">Technical Support</option>
            <option value="Feedback">Feedback</option>
          </select>
        </div>
      </div>
      
      <div>
        <label htmlFor="message" className="block text-sm font-medium mb-1.5">
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={4}
          className="w-full px-4 py-2.5 rounded-lg border border-border focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none transition-all-200 resize-y"
          placeholder="How can we help you?"
        ></textarea>
      </div>
      
      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`bg-primary text-white py-3 px-6 rounded-lg font-medium transition-all-200 hover:bg-primary/90 inline-flex items-center
            ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {isSubmitting ? 'Sending...' : (
            <>
              Send Message
              <Send size={16} className="ml-2" />
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default ContactForm;
