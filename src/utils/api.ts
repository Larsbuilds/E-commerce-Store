import { Product } from '../types';
import { cache } from './cache';

const BASE_URL = 'https://fakestoreapi.com';

const CACHE_KEYS = {
  PRODUCTS: 'products',
  CATEGORIES: 'categories',
  PRODUCTS_BY_CATEGORY: (category: string) => `products_category_${category}`,
};

export const fetchProducts = async (): Promise<Product[]> => {
  // Check cache first
  const cachedProducts = cache.get<Product[]>(CACHE_KEYS.PRODUCTS);
  if (cachedProducts) {
    return cachedProducts;
  }

  const response = await fetch(`${BASE_URL}/products`);
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }

  const products = await response.json();
  
  // Cache the results
  cache.set(CACHE_KEYS.PRODUCTS, products);
  
  return products;
};

export const fetchCategories = async (): Promise<string[]> => {
  // Check cache first
  const cachedCategories = cache.get<string[]>(CACHE_KEYS.CATEGORIES);
  if (cachedCategories) {
    return cachedCategories;
  }

  const response = await fetch(`${BASE_URL}/products/categories`);
  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }

  const categories = await response.json();
  
  // Cache the results
  cache.set(CACHE_KEYS.CATEGORIES, categories);
  
  return categories;
};

export const fetchProductById = async (id: number): Promise<Product> => {
  try {
    const response = await fetch(`${BASE_URL}/products/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch product');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};

export const fetchProductsByCategory = async (category: string): Promise<Product[]> => {
  const cacheKey = CACHE_KEYS.PRODUCTS_BY_CATEGORY(category);
  
  // Check cache first
  const cachedProducts = cache.get<Product[]>(cacheKey);
  if (cachedProducts) {
    return cachedProducts;
  }

  const response = await fetch(`${BASE_URL}/products/category/${encodeURIComponent(category)}`);
  if (!response.ok) {
    throw new Error('Failed to fetch products by category');
  }

  const products = await response.json();
  
  // Cache the results
  cache.set(cacheKey, products);
  
  return products;
};

export const searchProducts = async (query: string): Promise<Product[]> => {
  try {
    const products = await fetchProducts();
    const searchQuery = query.toLowerCase();
    return products.filter(product => 
      product.title.toLowerCase().includes(searchQuery) ||
      product.description.toLowerCase().includes(searchQuery) ||
      product.category.toLowerCase().includes(searchQuery)
    );
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
};

// Function to clear cache when needed (e.g., on logout or when data needs to be refreshed)
export const clearApiCache = (): void => {
  cache.clear();
}; 