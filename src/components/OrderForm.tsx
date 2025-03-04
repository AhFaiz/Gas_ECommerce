
import React, { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';

interface OrderFormProps {
  productId?: number;
  productName?: string;
}

const OrderForm = ({ productId, productName }: OrderFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    quantity: 1,
    product: productName || '',
    additionalInfo: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Order submitted:', formData);
      toast.success('Your order has been submitted successfully!');
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        quantity: 1,
        product: productName || '',
        additionalInfo: '',
      });
      setIsSubmitting(false);
    }, 1000);
  };

  // Sample products for dropdown selection (if no specific product is selected)
  const products = [
    'Premium Household LPG Cylinder',
    'Industrial Propane Gas Tank',
    'Portable Camping Gas Canister',
    'Commercial Grade Natural Gas Regulator',
    'High-Pressure Gas Cylinder for Industrial Use',
    'Compact LPG Cylinder for Home Cooking',
    'Restaurant-Grade Propane System',
    'Ultralight Backpacking Gas Canister',
    'Automatic Gas Leak Detector',
    'High BTU Outdoor Propane Heater',
    'Digital Gas Pressure Regulator',
    'Refillable BBQ Gas Cylinder',
  ];

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
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 rounded-lg border border-border focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none transition-all-200"
            placeholder="+62 123 4567 890"
          />
        </div>
        
        <div>
          <label htmlFor="quantity" className="block text-sm font-medium mb-1.5">
            Quantity <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            min="1"
            required
            className="w-full px-4 py-2.5 rounded-lg border border-border focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none transition-all-200"
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="address" className="block text-sm font-medium mb-1.5">
          Delivery Address <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          required
          className="w-full px-4 py-2.5 rounded-lg border border-border focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none transition-all-200"
          placeholder="Your full address"
        />
      </div>
      
      <div>
        <label htmlFor="product" className="block text-sm font-medium mb-1.5">
          Product <span className="text-red-500">*</span>
        </label>
        {productName ? (
          <input
            type="text"
            id="product"
            name="product"
            value={productName}
            readOnly
            className="w-full px-4 py-2.5 rounded-lg border border-border bg-gray-50 cursor-not-allowed"
          />
        ) : (
          <select
            id="product"
            name="product"
            value={formData.product}
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 rounded-lg border border-border focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none transition-all-200 bg-white"
          >
            <option value="" disabled>Select a product</option>
            {products.map((product) => (
              <option key={product} value={product}>{product}</option>
            ))}
          </select>
        )}
      </div>
      
      <div>
        <label htmlFor="additionalInfo" className="block text-sm font-medium mb-1.5">
          Additional Information
        </label>
        <textarea
          id="additionalInfo"
          name="additionalInfo"
          value={formData.additionalInfo}
          onChange={handleChange}
          rows={3}
          className="w-full px-4 py-2.5 rounded-lg border border-border focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none transition-all-200 resize-y"
          placeholder="Any specific requirements or delivery instructions"
        ></textarea>
      </div>
      
      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`bg-primary text-white py-3 px-6 rounded-lg font-medium transition-all-200 hover:bg-primary/90 inline-flex items-center
            ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {isSubmitting ? 'Processing...' : (
            <>
              Place Order
              <ShoppingCart size={16} className="ml-2" />
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default OrderForm;
