import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import { createProduct, updateProduct, getCategories, getLocations } from '@/services/api/productService';

const ProductModal = ({ isOpen, onClose, product, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    description: '',
    category: '',
    currentStock: 0,
    minimumStock: 0,
    unitPrice: 0,
    location: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [categories] = useState(getCategories());
  const [locations] = useState(getLocations());

  // Reset form when modal opens/closes or product changes
  useEffect(() => {
    if (isOpen) {
      if (product) {
        setFormData({
          name: product.name || '',
          sku: product.sku || '',
          description: product.description || '',
          category: product.category || '',
          currentStock: product.currentStock || 0,
          minimumStock: product.minimumStock || 0,
          unitPrice: product.unitPrice || 0,
          location: product.location || ''
        });
      } else {
        setFormData({
          name: '',
          sku: '',
          description: '',
          category: '',
          currentStock: 0,
          minimumStock: 0,
          unitPrice: 0,
          location: ''
        });
      }
      setErrors({});
    }
  }, [isOpen, product]);

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.sku.trim()) newErrors.sku = 'SKU is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.location) newErrors.location = 'Location is required';
    if (formData.currentStock < 0) newErrors.currentStock = 'Current stock cannot be negative';
    if (formData.minimumStock < 0) newErrors.minimumStock = 'Minimum stock cannot be negative';
    if (formData.unitPrice <= 0) newErrors.unitPrice = 'Unit price must be greater than 0';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the form errors');
      return;
    }

    setLoading(true);
    
    try {
      if (product) {
        await updateProduct(product.Id, formData);
      } else {
        await createProduct(formData);
      }
      
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={handleBackdropClick}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-xl font-semibold text-slate-900">
                {product ? 'Edit Product' : 'Add New Product'}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600"
              >
                <ApperIcon name="X" className="w-5 h-5" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Product Name */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Product Name *
                  </label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter product name"
                    className={errors.name ? 'border-red-300 focus:ring-red-500' : ''}
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>

                {/* SKU */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    SKU *
                  </label>
                  <Input
                    name="sku"
                    value={formData.sku}
                    onChange={handleInputChange}
                    placeholder="Enter SKU"
                    className={errors.sku ? 'border-red-300 focus:ring-red-500' : ''}
                  />
                  {errors.sku && <p className="mt-1 text-sm text-red-600">{errors.sku}</p>}
                </div>

                {/* Unit Price */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Unit Price *
                  </label>
                  <Input
                    name="unitPrice"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.unitPrice}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    className={errors.unitPrice ? 'border-red-300 focus:ring-red-500' : ''}
                  />
                  {errors.unitPrice && <p className="mt-1 text-sm text-red-600">{errors.unitPrice}</p>}
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className={`flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${errors.category ? 'border-red-300 focus:ring-red-500' : ''}`}
                  >
                    <option value="">Select category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Location *
                  </label>
                  <select
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className={`flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${errors.location ? 'border-red-300 focus:ring-red-500' : ''}`}
                  >
                    <option value="">Select location</option>
                    {locations.map(location => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                  {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
                </div>

                {/* Current Stock */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Current Stock
                  </label>
                  <Input
                    name="currentStock"
                    type="number"
                    min="0"
                    value={formData.currentStock}
                    onChange={handleInputChange}
                    placeholder="0"
                    className={errors.currentStock ? 'border-red-300 focus:ring-red-500' : ''}
                  />
                  {errors.currentStock && <p className="mt-1 text-sm text-red-600">{errors.currentStock}</p>}
                </div>

                {/* Minimum Stock */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Minimum Stock Level
                  </label>
                  <Input
                    name="minimumStock"
                    type="number"
                    min="0"
                    value={formData.minimumStock}
                    onChange={handleInputChange}
                    placeholder="0"
                    className={errors.minimumStock ? 'border-red-300 focus:ring-red-500' : ''}
                  />
                  {errors.minimumStock && <p className="mt-1 text-sm text-red-600">{errors.minimumStock}</p>}
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Enter product description"
                    className="flex w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 mt-8 pt-6 border-t border-slate-200">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={onClose}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex items-center space-x-2"
                >
                  {loading && <ApperIcon name="Loader2" className="w-4 h-4 animate-spin" />}
                  <span>{product ? 'Update Product' : 'Add Product'}</span>
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ProductModal;