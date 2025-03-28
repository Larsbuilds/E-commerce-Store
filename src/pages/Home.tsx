import { useEffect, useState, useMemo, useCallback } from 'react';
import { Product } from '../types';
import { fetchProducts, fetchCategories, fetchProductsByCategory } from '../utils/api';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { useTranslation } from 'react-i18next';

const Home = () => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart, removeFromCart } = useCart();
  const { t, i18n } = useTranslation();

  // Debug translations
  useEffect(() => {
    console.log('Current language:', i18n.language);
    console.log('Categories:', categories);
    categories.forEach(category => {
      const translationKey = `product.categories.${category}`;
      const translation = t(translationKey);
      console.log(`Translation for ${category} (${translationKey}):`, translation);
    });
  }, [categories, t, i18n.language]);

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
        setError(t('errors.fetchFailed'));
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [t]);

  // Fetch category products when category changes
  useEffect(() => {
    const loadCategoryProducts = async () => {
      if (!selectedCategory) {
        const products = await fetchProducts();
        setAllProducts(products);
        return;
      }
      try {
        setLoading(true);
        const productsData = await fetchProductsByCategory(selectedCategory);
        setAllProducts(productsData);
      } catch (err) {
        setError(t('errors.fetchFailed'));
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadCategoryProducts();
  }, [selectedCategory, t]);

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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <span className="loading loading-spinner loading-lg"></span>
        <span className="ml-4">{t('common.loading')}</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <p className="text-error mb-4">{error}</p>
        <button className="btn btn-primary" onClick={() => window.location.reload()}>
          {t('common.retry')}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div className="form-control">
          <input
            type="text"
            placeholder={t('common.search')}
            className="input input-bordered w-full"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            className={`btn ${!selectedCategory ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setSelectedCategory('')}
          >
            {t('nav.home')}
          </button>
          {categories.map((category) => (
            <button
              key={category}
              className={`btn ${selectedCategory === category ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setSelectedCategory(category)}
            >
              {t(`product.categories.${category}`)}
            </button>
          ))}
        </div>
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
    </div>
  );
};

export default Home; 