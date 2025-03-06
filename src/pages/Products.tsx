
import React, { useState, useEffect } from 'react';
import { Search, Filter, ChevronDown, X } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Types
interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  is_new?: boolean;
}

// Updated categories to only include the three specified plus "All"
const categories = [
  'All',
  'Household',
  'Industrial',
  'Portable'
];

const Products = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch products from Supabase
  useEffect(() => {
    async function fetchProducts() {
      try {
        setIsLoading(true);
        setError(null);
        
        // Use simplified query to avoid RLS errors
        console.log('Fetching products from Supabase...');
        const { data, error } = await supabase
          .from('products')
          .select('*');
        
        if (error) {
          console.error('Error fetching products:', error);
          setError('Failed to load products. Please try again later.');
          toast.error('Failed to load products');
          setIsLoading(false);
          return;
        }
        
        console.log('Products fetched successfully:', data);
        // Make sure we have data before setting it
        if (data && Array.isArray(data)) {
          setProducts(data as Product[]);
        } else {
          setProducts([]);
          setError('No products found.');
        }
      } catch (error) {
        console.error('Exception fetching products:', error);
        setError('An unexpected error occurred. Please try again later.');
        toast.error('An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchProducts();
  }, []);
  
  // Apply filters
  useEffect(() => {
    let result = [...products];
    let filterCount = 0;
    
    // Apply search filter
    if (searchQuery) {
      result = result.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      filterCount++;
    }
    
    // Apply category filter
    if (selectedCategory !== 'All') {
      result = result.filter(product => product.category === selectedCategory);
      filterCount++;
    }
    
    setActiveFiltersCount(filterCount);
    setFilteredProducts(result);
  }, [searchQuery, selectedCategory, products]);
  
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
  };

  return (
    <div className="min-h-screen pt-20">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-primary/90 to-blue-600/90 text-white py-16 md:py-24">
        <div className="page-container">
          <div className="max-w-3xl">
            <h1 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl mb-4">
              Gas Products Catalog
            </h1>
            <p className="text-white/80 text-lg md:text-xl mb-6">
              Browse our comprehensive range of high-quality gas products for all your needs
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-2xl">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search size={18} className="text-white/60" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products..."
                className="w-full bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/60 py-3 pl-12 pr-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/60 hover:text-white"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Product Listing */}
      <div className="page-container py-8 md:py-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters - Mobile Toggle */}
          <div className="md:hidden mb-4">
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="flex items-center justify-between w-full px-4 py-3 bg-secondary rounded-lg"
            >
              <div className="flex items-center">
                <Filter size={18} className="mr-2" />
                <span>Filters{activeFiltersCount > 0 ? ` (${activeFiltersCount})` : ''}</span>
              </div>
              <ChevronDown size={18} className={`transition-transform ${filtersOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>
          
          {/* Filters Sidebar */}
          <div 
            className={`md:w-64 space-y-6 ${filtersOpen ? 'block' : 'hidden'} md:block`}
          >
            <div className="bg-white rounded-lg shadow-sm p-5 border border-border/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-semibold">Filters</h3>
                {activeFiltersCount > 0 && (
                  <button 
                    onClick={clearFilters}
                    className="text-primary text-sm hover:underline"
                  >
                    Clear All
                  </button>
                )}
              </div>
              
              {/* Categories */}
              <div>
                <h4 className="font-medium text-sm mb-2">Categories</h4>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <div key={category} className="flex items-center">
                      <button
                        onClick={() => setSelectedCategory(category)}
                        className={`text-sm flex items-center w-full transition-all-200 hover:text-primary ${
                          selectedCategory === category 
                            ? 'text-primary font-medium' 
                            : 'text-foreground/80'
                        }`}
                      >
                        <span 
                          className={`w-3 h-3 rounded-full mr-2 ${
                            selectedCategory === category 
                              ? 'bg-primary' 
                              : 'border border-gray-300'
                          }`} 
                        />
                        {category}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Products Grid */}
          <div className="flex-1">
            {/* Product count */}
            <div className="mb-6">
              <p className="text-foreground/70">
                {isLoading ? (
                  'Loading products...'
                ) : (
                  <>Showing <span className="font-medium text-foreground">{filteredProducts.length}</span> products</>
                )}
              </p>
            </div>
            
            {/* Products */}
            {isLoading ? (
              // Loading skeleton
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="w-full h-64 bg-gray-200 animate-pulse"></div>
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-1/4"></div>
                      <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4"></div>
                      <div className="h-6 bg-gray-200 rounded animate-pulse w-1/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              // Error message
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-4">
                  <X className="h-6 w-6 text-red-600" />
                </div>
                <p className="text-foreground/80 text-lg mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product, index) => (
                  <div 
                    key={product.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <ProductCard 
                      id={product.id} 
                      name={product.name} 
                      price={product.price} 
                      image={product.image} 
                      category={product.category} 
                      isNew={!!product.is_new}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-foreground/60 text-lg mb-4">No products match your criteria.</p>
                <button
                  onClick={clearFilters}
                  className="text-primary font-medium hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
