
import React from 'react';
import { Star } from 'lucide-react';

interface TestimonialProps {
  name: string;
  role: string;
  avatar: string;
  content: string;
  rating: number;
}

const Testimonial: React.FC<TestimonialProps> = ({ name, role, avatar, content, rating }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all-200 h-full flex flex-col">
      <div className="flex space-x-1 mb-3 text-yellow-400">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            size={16} 
            fill={i < rating ? 'currentColor' : 'none'} 
            className={i < rating ? 'text-yellow-400' : 'text-gray-300'} 
          />
        ))}
      </div>
      
      <div className="flex-grow">
        <p className="text-foreground/80 text-pretty leading-relaxed text-sm">
          "{content}"
        </p>
      </div>
      
      <div className="flex items-center mt-5 pt-5 border-t border-border">
        <div className="w-10 h-10 rounded-full overflow-hidden mr-3 flex-shrink-0">
          <img 
            src={avatar} 
            alt={name} 
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h4 className="font-medium text-sm">{name}</h4>
          <p className="text-foreground/60 text-xs">{role}</p>
        </div>
      </div>
    </div>
  );
};

export default Testimonial;
