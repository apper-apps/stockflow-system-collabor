import { toast } from 'react-toastify';
import mockProducts from '@/services/mockData/products.json';

// Create a mutable copy of the mock data
let products = [...mockProducts];

// Mock transaction history data
const transactionHistory = [
  {
    Id: 1,
    productId: 1,
    adjustment: 50,
    reason: 'Initial Stock',
    notes: 'Initial inventory setup',
    timestamp: '2024-01-10T09:00:00Z'
  },
  {
    Id: 2,
    productId: 1,
    adjustment: -12,
    reason: 'Sale',
    notes: 'Bulk order to corporate client',
    timestamp: '2024-01-12T14:30:00Z'
  },
  {
    Id: 3,
    productId: 1,
    adjustment: 25,
    reason: 'Restock',
    notes: 'Quarterly reorder',
    timestamp: '2024-01-14T11:15:00Z'
  },
  {
    Id: 4,
    productId: 2,
    adjustment: 100,
    reason: 'Initial Stock',
    notes: 'New product launch inventory',
    timestamp: '2024-01-08T10:00:00Z'
  },
  {
    Id: 5,
    productId: 2,
    adjustment: -8,
    reason: 'Damaged Goods',
    notes: 'Water damage during storage',
    timestamp: '2024-01-11T16:45:00Z'
  },
  {
    Id: 6,
    productId: 3,
    adjustment: 75,
    reason: 'Initial Stock',
    notes: 'Seasonal preparation',
    timestamp: '2024-01-09T08:30:00Z'
  },
  {
    Id: 7,
    productId: 3,
    adjustment: -15,
    reason: 'Return to Supplier',
    notes: 'Quality control issues',
    timestamp: '2024-01-13T13:20:00Z'
  }
];

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

export const getTransactionHistory = async (productId) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Filter transactions by product ID and sort by timestamp (most recent first)
  const productTransactions = transactionHistory
    .filter(transaction => transaction.productId === productId)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
  return [...productTransactions];
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

  // Add transaction to history
  const maxId = Math.max(...transactionHistory.map(t => t.Id), 0);
  transactionHistory.push({
    Id: maxId + 1,
    productId: productId,
    adjustment: adjustment,
    reason: reason,
    notes: notes,
    timestamp: new Date().toISOString()
  });

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

// Get low stock alerts with urgency indicators
export const getLowStockAlerts = () => {
  const alerts = products.filter(p => p.currentStock <= p.minimumStock)
    .map(product => {
      const stockRatio = product.currentStock / product.minimumStock;
      let urgency = 'low';
      
      if (product.currentStock === 0) {
        urgency = 'critical';
      } else if (stockRatio <= 0.25) {
        urgency = 'critical';
      } else if (stockRatio <= 0.5) {
        urgency = 'high';
      } else if (stockRatio <= 0.75) {
        urgency = 'medium';
      }
      
      return {
        ...product,
        urgency,
        suggestedReorder: calculateReorderQuantity(product),
        daysUntilEmpty: Math.ceil(product.currentStock / (product.minimumStock * 0.1)) // Simplified calculation
      };
    })
    .sort((a, b) => {
      const urgencyOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
    });
    
  return alerts;
};

// Calculate suggested reorder quantity
export const calculateReorderQuantity = (product) => {
  const safetyStock = Math.ceil(product.minimumStock * 0.2); // 20% safety buffer
  const optimalStock = product.minimumStock * 2; // Target stock level
  const currentDeficit = Math.max(0, optimalStock - product.currentStock);
  
  return Math.max(currentDeficit, safetyStock);
};

// Get comprehensive stock analytics
export const getStockAnalytics = () => {
  const totalProducts = products.length;
  const lowStockCount = products.filter(p => p.currentStock <= p.minimumStock && p.currentStock > 0).length;
  const outOfStockCount = products.filter(p => p.currentStock === 0).length;
  const inStockCount = totalProducts - lowStockCount - outOfStockCount;
  
  const totalValue = products.reduce((sum, p) => sum + (p.currentStock * p.unitPrice), 0);
  
  // Category breakdown
  const categoryStats = {};
  products.forEach(product => {
    if (!categoryStats[product.category]) {
      categoryStats[product.category] = { count: 0, value: 0 };
    }
    categoryStats[product.category].count++;
    categoryStats[product.category].value += product.currentStock * product.unitPrice;
  });
  
  const categoryBreakdown = Object.entries(categoryStats)
    .map(([name, stats]) => ({ name, ...stats }))
    .sort((a, b) => b.value - a.value);
    
  const topValueCategories = categoryBreakdown.slice(0, 5);
  
  return {
    totalProducts,
    lowStockCount,
    outOfStockCount,
    inStockCount,
    totalValue,
    categoryBreakdown,
    topValueCategories,
    stockTurnoverRate: 0.75, // Placeholder - would calculate from historical data
    averageStockLevel: Math.round(products.reduce((sum, p) => sum + p.currentStock, 0) / totalProducts)
  };
};

// Export reports data
export const exportReportsData = (products, lowStockAlerts, analytics) => {
  const reportData = {
    generatedAt: new Date().toISOString(),
    summary: {
      totalProducts: analytics.totalProducts,
      lowStockCount: analytics.lowStockCount,
      outOfStockCount: analytics.outOfStockCount,
      totalValue: analytics.totalValue
    },
    lowStockAlerts: lowStockAlerts.map(alert => ({
      name: alert.name,
      sku: alert.sku,
      currentStock: alert.currentStock,
      minimumStock: alert.minimumStock,
      urgency: alert.urgency,
      suggestedReorder: alert.suggestedReorder,
      location: alert.location
    })),
    categoryBreakdown: analytics.categoryBreakdown
  };
  
  // Create downloadable JSON file
  const dataStr = JSON.stringify(reportData, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `inventory-reports-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  
  return true;
};