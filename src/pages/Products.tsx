
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
  is_new: boolean;
  stock: number;
  created_at?: string; // Add created_at field as optional
}

const categories = [
  'All',
  'Household',
  'Industrial',
  'Commercial',
  'Portable',
  'Outdoor',
  'Accessories'
];

const priceRanges = [
  { label: 'All Prices', value: 'all' },
  { label: 'Under $50', value: 'under-50' },
  { label: '$50 - $100', value: '50-100' },
  { label: '$100 - $200', value: '100-200' },
  { label: 'Over $200', value: 'over-200' }
];

const sortOptions = [
  { label: 'Newest', value: 'newest' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Name A-Z', value: 'name-asc' },
  { label: 'Name Z-A', value: 'name-desc' }
];

const Products = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  
  // Fetch products from Supabase
  useEffect(() => {
    async function fetchProducts() {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('products')
          .select('*');
        
        if (error) {
          console.error('Error fetching products:', error);
          toast.error('Failed to load products');
          return;
        }
        
        setProducts(data as Product[]);
        setIsLoading(false);
      } catch (error) {
        console.error('Exception fetching products:', error);
        toast.error('An unexpected error occurred');
        setIsLoading(false);
      }
    }
    
    fetchProducts();
  }, []);
  
  // Apply filters and sorting
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
    
    // Apply price range filter
    if (selectedPriceRange !== 'all') {
      switch (selectedPriceRange) {
        case 'under-50':
          result = result.filter(product => product.price < 50);
          break;
        case '50-100':
          result = result.filter(product => product.price >= 50 && product.price <= 100);
          break;
        case '100-200':
          result = result.filter(product => product.price > 100 && product.price <= 200);
          break;
        case 'over-200':
          result = result.filter(product => product.price > 200);
          break;
        default:
          break;
      }
      filterCount++;
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'newest':
        // Sort by created_at (newest first)
        result.sort((a, b) => {
          const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
          const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
          return dateB - dateA;
        });
        break;
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }
    
    setActiveFiltersCount(filterCount);
    setFilteredProducts(result);
  }, [searchQuery, selectedCategory, selectedPriceRange, sortBy, products]);
  
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedPriceRange('all');
    setSortBy('newest');
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
              <div className="mb-6">
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
              
              {/* Price Range */}
              <div>
                <h4 className="font-medium text-sm mb-2">Price Range</h4>
                <div className="space-y-2">
                  {priceRanges.map((range) => (
                    <div key={range.value} className="flex items-center">
                      <button
                        onClick={() => setSelectedPriceRange(range.value)}
                        className={`text-sm flex items-center w-full transition-all-200 hover:text-primary ${
                          selectedPriceRange === range.value 
                            ? 'text-primary font-medium' 
                            : 'text-foreground/80'
                        }`}
                      >
                        <span 
                          className={`w-3 h-3 rounded-full mr-2 ${
                            selectedPriceRange === range.value 
                              ? 'bg-primary' 
                              : 'border border-gray-300'
                          }`} 
                        />
                        {range.label}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Products Grid */}
          <div className="flex-1">
            {/* Sort Options */}
            <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
              <div>
                <p className="text-foreground/70">
                  {isLoading ? (
                    'Loading products...'
                  ) : (
                    <>Showing <span className="font-medium text-foreground">{filteredProducts.length}</span> products</>
                  )}
                </p>
              </div>
              
              <div className="flex items-center">
                <label className="text-foreground/70 mr-2 text-sm">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white border border-border rounded-lg px-3 py-1.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
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
                      isNew={!!product.is_new} // Ensure boolean type with double negation
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
