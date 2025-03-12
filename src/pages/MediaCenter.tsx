
import React from 'react';
import { FileVideo, Image as ImageIcon, FileText } from 'lucide-react';

const MediaCenter = () => {
  return (
    <div className="min-h-screen pt-32 pb-16">
      <div className="page-container">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <FileVideo size={48} className="text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Media Center</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our collection of videos, images, and publications about our company and services.
          </p>
        </div>
        
        <div className="mt-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-accent p-8 rounded-lg text-center hover:shadow-md transition-all-300 cursor-pointer">
              <FileVideo size={36} className="mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Videos</h3>
              <p className="text-muted-foreground">
                Watch our informative videos about gas safety, product usage, and company events.
              </p>
            </div>
            
            <div className="bg-accent p-8 rounded-lg text-center hover:shadow-md transition-all-300 cursor-pointer">
              <ImageIcon size={36} className="mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Image Gallery</h3>
              <p className="text-muted-foreground">
                Browse through photos of our facilities, products, and community activities.
              </p>
            </div>
            
            <div className="bg-accent p-8 rounded-lg text-center hover:shadow-md transition-all-300 cursor-pointer">
              <FileText size={36} className="mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Publications</h3>
              <p className="text-muted-foreground">
                Access our brochures, annual reports, and press releases.
              </p>
            </div>
          </div>
          
          <div className="bg-muted p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Featured Media</h3>
            <div className="aspect-video bg-gray-200 rounded-lg mb-4"></div>
            <h4 className="text-lg font-medium mb-2">Company Overview 2023</h4>
            <p className="text-muted-foreground">
              A comprehensive look at our company's achievements, values, and vision for the future.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaCenter;
