import { toast } from 'react-toastify';
import mockProducts from '@/services/mockData/products.json';

// Create a mutable copy of the mock data
let products = [...mockProducts];

// Helper function to get next ID
const getNextId = () => {
  return products.length > 0 ? Math.max(...products.map(p => p.Id)) + 1 : 1;
};

// Helper function to validate product data
const validateProduct = (product) => {
  const errors = [];
  
  if (!product.name?.trim()) errors.push('Product name is required');
  if (!product.sku?.trim()) errors.push('SKU is required');
  if (!product.category?.trim()) errors.push('Category is required');
  if (!product.location?.trim()) errors.push('Location is required');
  if (product.currentStock < 0) errors.push('Current stock cannot be negative');
  if (product.minimumStock < 0) errors.push('Minimum stock cannot be negative');
  if (product.unitPrice <= 0) errors.push('Unit price must be greater than 0');
  
  return errors;
};

// Get all products
export const getAllProducts = () => {
  return [...products];
};

// Get product by ID
export const getProductById = (id) => {
  const numericId = parseInt(id);
  if (isNaN(numericId)) {
    throw new Error('Product ID must be a valid number');
  }
  
  const product = products.find(p => p.Id === numericId);
  return product ? { ...product } : null;
};

// Create new product
export const createProduct = (productData) => {
  const errors = validateProduct(productData);
  if (errors.length > 0) {
    throw new Error(errors.join(', '));
  }
  
  // Check for duplicate SKU
  if (products.some(p => p.sku.toLowerCase() === productData.sku.toLowerCase())) {
    throw new Error('SKU already exists');
  }
  
  const newProduct = {
    ...productData,
    Id: getNextId(),
    lastUpdated: new Date().toISOString()
  };
  
  products.push(newProduct);
  toast.success(`Product "${newProduct.name}" created successfully`);
  return { ...newProduct };
};

// Update product
export const updateProduct = (id, updateData) => {
  const numericId = parseInt(id);
  if (isNaN(numericId)) {
    throw new Error('Product ID must be a valid number');
  }
  
  const index = products.findIndex(p => p.Id === numericId);
  if (index === -1) {
    throw new Error('Product not found');
  }
  
  const updatedProduct = {
    ...products[index],
    ...updateData,
    Id: numericId, // Preserve original ID
    lastUpdated: new Date().toISOString()
  };
  
  const errors = validateProduct(updatedProduct);
  if (errors.length > 0) {
    throw new Error(errors.join(', '));
  }
  
  // Check for duplicate SKU (excluding current product)
  if (products.some(p => p.Id !== numericId && p.sku.toLowerCase() === updatedProduct.sku.toLowerCase())) {
    throw new Error('SKU already exists');
  }
  
  products[index] = updatedProduct;
  toast.success(`Product "${updatedProduct.name}" updated successfully`);
  return { ...updatedProduct };
};

// Delete product
export const deleteProduct = (id) => {
  const numericId = parseInt(id);
  if (isNaN(numericId)) {
    throw new Error('Product ID must be a valid number');
  }
  
  const index = products.findIndex(p => p.Id === numericId);
  if (index === -1) {
    throw new Error('Product not found');
  }
  
  const deletedProduct = products[index];
  products.splice(index, 1);
  toast.success(`Product "${deletedProduct.name}" deleted successfully`);
  return true;
};

export const adjustStock = (productId, adjustment, reason, notes = '') => {
  const productIndex = products.findIndex(p => p.Id === productId);
  if (productIndex === -1) {
    throw new Error('Product not found');
  }

  const product = products[productIndex];
  const newStock = product.currentStock + adjustment;
  
  if (newStock < 0) {
    throw new Error('Stock cannot be negative');
  }

  // Update the product stock
  products[productIndex] = {
    ...product,
    currentStock: newStock,
    lastUpdated: new Date().toISOString()
  };

  // Log the adjustment (in a real app, this would go to an audit log)
  console.log(`Stock adjusted for ${product.name}: ${adjustment > 0 ? '+' : ''}${adjustment} (Reason: ${reason})`);
  
  toast.success(`Stock adjusted successfully. New quantity: ${newStock}`);
  return products[productIndex];
};

// Get stock status
export const getStockStatus = (currentStock, minimumStock) => {
  if (currentStock === 0) {
    return { status: 'out-of-stock', label: 'Out of Stock', color: 'red' };
  } else if (currentStock <= minimumStock) {
    return { status: 'low-stock', label: 'Low Stock', color: 'amber' };
  } else {
    return { status: 'in-stock', label: 'In Stock', color: 'emerald' };
  }
};

// Get available categories
export const getCategories = () => {
  const categories = [...new Set(mockProducts.map(p => p.category))];
  return categories.sort();
};

// Get available locations
export const getLocations = () => {
  const locations = [...new Set(mockProducts.map(p => p.location))];
  return locations.sort();
};