
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import OrderModal from './OrderModal';

interface ProductCardProps {
  id: string | number;
  name: string;
  price: number;
  image: string;
  category: string;
  isNew?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ id, name, price, image, category, isNew = false }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openOrderModal = () => {
    setIsModalOpen(true);
  };

  const closeOrderModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div 
        className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all-300 overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative overflow-hidden pb-[100%]">
          <Link to={`/products/${id}`}>
            <img
              src={image}
              alt={name}
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-in-out ${
                isHovered ? 'scale-110' : 'scale-100'
              }`}
            />
          </Link>
          
          {isNew && (
            <div className="absolute top-3 left-3 bg-primary text-white text-xs font-semibold px-2 py-1 rounded">
              NEW
            </div>
          )}
          
          <div 
            className={`absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm p-2 transition-all duration-300 flex justify-center
              ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}
          >
            <button
              onClick={openOrderModal}
              className="bg-primary text-white text-sm py-1.5 px-3 rounded-full flex items-center justify-center transition-all-200 hover:bg-primary/90 w-full"
            >
              <ShoppingBag size={16} className="mr-1.5" />
              <span className="font-medium">Pesan</span>
            </button>
          </div>
        </div>
        
        <div className="p-4">
          <div className="text-xs text-primary/80 font-medium mb-1">
            {category}
          </div>
          <Link to={`/products/${id}`} className="block group-hover:text-primary transition-all-200">
            <h3 className="font-medium text-base truncate">{name}</h3>
          </Link>
          <div className="mt-1.5 font-display font-semibold text-lg">
            Rp{price.toLocaleString('id-ID')}
          </div>
        </div>
      </div>

      <OrderModal 
        isOpen={isModalOpen} 
        onClose={closeOrderModal} 
        product={{ id, name, price, image, category }}
      />
    </>
  );
};

export default ProductCard;
