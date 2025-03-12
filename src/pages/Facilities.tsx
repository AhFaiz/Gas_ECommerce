
import React from 'react';
import { Building2 } from 'lucide-react';

const Facilities = () => {
  return (
    <div className="min-h-screen pt-32 pb-16">
      <div className="page-container">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Building2 size={48} className="text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Our Facilities</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our state-of-the-art facilities designed to ensure the highest quality gas products and services.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          {[1, 2, 3].map((item) => (
            <div key={item} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all-300">
              <div className="h-48 bg-muted"></div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Facility {item}</h3>
                <p className="text-muted-foreground">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. 
                  In hac habitasse platea dictumst.
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Facilities;
