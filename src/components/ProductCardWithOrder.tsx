
import React, { useState } from 'react';
import { ShoppingCart, X } from 'lucide-react';
import OrderForm from './OrderForm';

interface ProductCardWithOrderProps {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  isNew?: boolean;
}

const ProductCardWithOrder = ({ id, name, price, image, category, isNew }: ProductCardWithOrderProps) => {
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  return (
    <>
      <div className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-border/20 h-full flex flex-col">
        {/* Product Image */}
        <div className="relative h-56 overflow-hidden">
          <img 
            src={image} 
            alt={name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {isNew && (
            <span className="absolute top-2 left-2 bg-primary text-white text-xs font-medium px-2 py-1 rounded">
              New
            </span>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
            <div className="p-4 w-full">
              <button
                onClick={() => setIsOrderModalOpen(true)}
                className="w-full bg-white hover:bg-primary hover:text-white text-primary font-medium py-2 rounded-md transition-colors flex items-center justify-center"
              >
                <ShoppingCart size={16} className="mr-2" />
                Order Now
              </button>
            </div>
          </div>
        </div>
        
        {/* Product Info */}
        <div className="p-4 flex-1 flex flex-col">
          <span className="text-xs font-medium text-primary/80 mb-1">
            {category}
          </span>
          
          <h3 className="font-medium text-lg text-foreground mb-2 flex-1">
            {name}
          </h3>
          
          <div className="flex items-center justify-between mt-auto">
            <span className="font-bold text-lg">${price.toFixed(2)}</span>
            <button
              onClick={() => setIsOrderModalOpen(true)}
              className="bg-primary/10 hover:bg-primary hover:text-white text-primary p-2 rounded-full transition-colors"
            >
              <ShoppingCart size={18} />
              <span className="sr-only">Order Now</span>
            </button>
          </div>
        </div>
      </div>

      {/* Order Modal */}
      {isOrderModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div 
              className="fixed inset-0 transition-opacity" 
              aria-hidden="true"
              onClick={() => setIsOrderModalOpen(false)}
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div 
              className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
            >
              <div className="flex justify-between items-center bg-gray-50 px-6 py-4 border-b">
                <div className="flex items-center">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Order {name}
                  </h3>
                </div>
                <button
                  onClick={() => setIsOrderModalOpen(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X size={18} />
                </button>
              </div>
              
              <div className="p-6">
                <OrderForm productId={id} productName={name} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductCardWithOrder;
