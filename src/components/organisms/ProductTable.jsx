import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import { getStockStatus } from '@/services/api/productService';

const ProductTable = ({ products, onEdit, onDelete, onAdjustStock }) => {
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedProducts = [...products].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    // Handle different data types
    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const SortIcon = ({ field }) => {
    if (sortField !== field) {
      return <ApperIcon name="ArrowUpDown" className="w-4 h-4 text-slate-400" />;
    }
    return sortDirection === 'asc' ? 
      <ApperIcon name="ArrowUp" className="w-4 h-4 text-primary-600" /> :
      <ApperIcon name="ArrowDown" className="w-4 h-4 text-primary-600" />;
  };

  const StockBadge = ({ currentStock, minimumStock }) => {
    const { status, label, color } = getStockStatus(currentStock, minimumStock);
    
    const colorClasses = {
      red: 'bg-red-100 text-red-800 border-red-200',
      amber: 'bg-amber-100 text-amber-800 border-amber-200',
      emerald: 'bg-emerald-100 text-emerald-800 border-emerald-200'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colorClasses[color]}`}>
        {label}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort('name')}
                  className="flex items-center space-x-1 text-xs font-medium text-slate-500 uppercase tracking-wider hover:text-slate-700"
                >
                  <span>Product Name</span>
                  <SortIcon field="name" />
                </button>
              </th>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort('sku')}
                  className="flex items-center space-x-1 text-xs font-medium text-slate-500 uppercase tracking-wider hover:text-slate-700"
                >
                  <span>SKU</span>
                  <SortIcon field="sku" />
                </button>
              </th>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort('category')}
                  className="flex items-center space-x-1 text-xs font-medium text-slate-500 uppercase tracking-wider hover:text-slate-700"
                >
                  <span>Category</span>
                  <SortIcon field="category" />
                </button>
              </th>
              <th className="px-6 py-3 text-left">
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Stock Status</span>
              </th>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort('currentStock')}
                  className="flex items-center space-x-1 text-xs font-medium text-slate-500 uppercase tracking-wider hover:text-slate-700"
                >
                  <span>Current Stock</span>
                  <SortIcon field="currentStock" />
                </button>
              </th>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort('location')}
                  className="flex items-center space-x-1 text-xs font-medium text-slate-500 uppercase tracking-wider hover:text-slate-700"
                >
                  <span>Location</span>
                  <SortIcon field="location" />
                </button>
              </th>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort('lastUpdated')}
                  className="flex items-center space-x-1 text-xs font-medium text-slate-500 uppercase tracking-wider hover:text-slate-700"
                >
                  <span>Last Updated</span>
                  <SortIcon field="lastUpdated" />
                </button>
              </th>
              <th className="px-6 py-3 text-right">
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {sortedProducts.map((product, index) => (
              <motion.tr
                key={product.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-slate-50"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-slate-900">{product.name}</div>
                    {product.description && (
                      <div className="text-sm text-slate-500 truncate max-w-xs">{product.description}</div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-mono text-slate-600 bg-slate-100 px-2 py-1 rounded">
                    {product.sku}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-slate-900">{product.category}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StockBadge currentStock={product.currentStock} minimumStock={product.minimumStock} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-slate-900">
                    <span className="font-medium">{product.currentStock}</span>
                    <span className="text-slate-500"> / {product.minimumStock} min</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-slate-600">{product.location}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-slate-600">
                    {format(new Date(product.lastUpdated), 'MMM d, yyyy')}
                  </span>
                </td>
<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onAdjustStock(product)}
                      className="text-slate-600 hover:text-blue-600"
                      title="Adjust Stock"
                    >
                      <ApperIcon name="Package" className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(product)}
                      className="text-slate-600 hover:text-primary-600"
                    >
                      <ApperIcon name="Edit" className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(product)}
                      className="text-slate-600 hover:text-red-600"
                    >
                      <ApperIcon name="Trash2" className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {sortedProducts.length === 0 && (
        <div className="text-center py-12">
          <ApperIcon name="Package" className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">No products found</h3>
          <p className="text-slate-600">Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  );
};

export default ProductTable;