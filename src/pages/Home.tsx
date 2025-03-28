import { useEffect, useState, useMemo, useCallback } from 'react';
import { Product } from '../types';
import { fetchProducts, fetchCategories, fetchProductsByCategory } from '../utils/api';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';

const Home = () => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart, removeFromCart } = useCart();

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [productsData, categoriesData] = await Promise.all([
          fetchProducts(),
          fetchCategories(),
        ]);
        setAllProducts(productsData);
        setCategories(categoriesData);
      } catch (err) {
        setError('Failed to load products');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Fetch category products when category changes
  useEffect(() => {
    const loadCategoryProducts = async () => {
      if (!selectedCategory) {
        setAllProducts(await fetchProducts());
        return;
      }
      try {
        setLoading(true);
        const productsData = await fetchProductsByCategory(selectedCategory);
        setAllProducts(productsData);
      } catch (err) {
        setError('Failed to load category products');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadCategoryProducts();
  }, [selectedCategory]);

  // Memoized event handlers
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  const handleCategoryChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
  }, []);

  // Filter products based on debounced search query
  const filteredProducts = useMemo(() => {
    if (!debouncedSearchQuery.trim()) return allProducts;
    
    const query = debouncedSearchQuery.toLowerCase();
    return allProducts.filter(product => 
      product.title.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query)
    );
  }, [allProducts, debouncedSearchQuery]);

  if (loading && allProducts.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search products..."
            className="input input-bordered w-full"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        <select
          className="select select-bordered w-full md:w-auto"
          value={selectedCategory}
          onChange={handleCategoryChange}
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={addToCart}
            onRemoveFromCart={removeFromCart}
          />
        ))}
      </div>
      {filteredProducts.length === 0 && (
        <div className="text-center py-8">
          <p className="text-lg">No products found</p>
        </div>
      )}
    </div>
  );
};

export default Home; 