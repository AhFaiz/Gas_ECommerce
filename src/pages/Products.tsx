
import React, { useState, useEffect } from 'react';
import { Search, Filter, ChevronDown, X } from 'lucide-react';
import ProductCard from '../components/ProductCard';

// Sample product data
const productsData = [
  {
    id: 1,
    name: 'Premium Household LPG Cylinder',
    price: 45.99,
    image: 'https://images.unsplash.com/photo-1585105583421-5cb5f30eea6d?q=80&w=1883',
    category: 'Household',
    isNew: true,
  },
  {
    id: 2,
    name: 'Industrial Propane Gas Tank',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1599059026939-1a4cd20732ef?q=80&w=1898',
    category: 'Industrial',
  },
  {
    id: 3,
    name: 'Portable Camping Gas Canister',
    price: 19.95,
    image: 'https://images.unsplash.com/photo-1635859691068-54aef99a15fa?q=80&w=2069',
    category: 'Portable',
    isNew: true,
  },
  {
    id: 4,
    name: 'Commercial Grade Natural Gas Regulator',
    price: 78.50,
    image: 'https://images.unsplash.com/photo-1589802757245-d10a4135b023?q=80&w=2070',
    category: 'Commercial',
  },
  {
    id: 5,
    name: 'High-Pressure Gas Cylinder for Industrial Use',
    price: 189.95,
    image: 'https://images.unsplash.com/photo-1589802757271-5e70817436fb?q=80&w=2070',
    category: 'Industrial',
  },
  {
    id: 6,
    name: 'Compact LPG Cylinder for Home Cooking',
    price: 39.99,
    image: 'https://images.unsplash.com/photo-1642543492483-4bcabf0a63c7?q=80&w=2070',
    category: 'Household',
  },
  {
    id: 7,
    name: 'Restaurant-Grade Propane System',
    price: 249.99,
    image: 'https://images.unsplash.com/photo-1623491959225-382aba5597b3?q=80&w=2071',
    category: 'Commercial',
    isNew: true,
  },
  {
    id: 8,
    name: 'Ultralight Backpacking Gas Canister',
    price: 15.50,
    image: 'https://images.unsplash.com/photo-1619170743049-406d053e96bd?q=80&w=2070',
    category: 'Portable',
  },
  {
    id: 9,
    name: 'Automatic Gas Leak Detector',
    price: 59.95,
    image: 'https://images.unsplash.com/photo-1585123388867-3bfe6dd4bdbf?q=80&w=2070',
    category: 'Accessories',
  },
  {
    id: 10,
    name: 'High BTU Outdoor Propane Heater',
    price: 179.99,
    image: 'https://images.unsplash.com/photo-1605108040941-7c762d5ed4e4?q=80&w=1887',
    category: 'Outdoor',
  },
  {
    id: 11,
    name: 'Digital Gas Pressure Regulator',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1517439270744-8c9e4c4206b6?q=80&w=1899',
    category: 'Accessories',
  },
  {
    id: 12,
    name: 'Refillable BBQ Gas Cylinder',
    price: 64.50,
    image: 'https://images.unsplash.com/photo-1597739239353-50270a473397?q=80&w=2070',
    category: 'Outdoor',
    isNew: true,
  }
];

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
  const [filteredProducts, setFilteredProducts] = useState(productsData);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  
  // Apply filters and sorting
  useEffect(() => {
    let result = [...productsData];
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
        // Assuming newest is default order
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
  }, [searchQuery, selectedCategory, selectedPriceRange, sortBy]);
  
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
                  Showing <span className="font-medium text-foreground">{filteredProducts.length}</span> products
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
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product, index) => (
                  <div 
                    key={product.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <ProductCard {...product} />
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
