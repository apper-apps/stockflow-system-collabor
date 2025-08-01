import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import { adjustStock } from '@/services/api/productService';

const StockAdjustmentModal = ({ isOpen, onClose, product, onSuccess }) => {
  const [formData, setFormData] = useState({
    adjustment: '',
    reason: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const reasons = [
    'Received Shipment',
    'Sold Items',
    'Damaged Goods',
    'Inventory Count',
    'Other'
  ];

  // Reset form when modal opens/closes or product changes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        adjustment: '',
        reason: '',
        notes: ''
      });
      setErrors({});
    }
  }, [isOpen, product]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.adjustment) {
      newErrors.adjustment = 'Adjustment value is required';
    } else {
      const adjustmentValue = parseInt(formData.adjustment);
      if (isNaN(adjustmentValue)) {
        newErrors.adjustment = 'Adjustment must be a valid number';
      } else if (adjustmentValue === 0) {
        newErrors.adjustment = 'Adjustment cannot be zero';
      } else if (product && (product.currentStock + adjustmentValue) < 0) {
        newErrors.adjustment = 'Adjustment would result in negative stock';
      }
    }
    
    if (!formData.reason) {
      newErrors.reason = 'Reason is required';
    }
    
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
      const adjustmentValue = parseInt(formData.adjustment);
      await adjustStock(product.Id, adjustmentValue, formData.reason, formData.notes);
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

  if (!product) return null;

  const adjustmentValue = parseInt(formData.adjustment) || 0;
  const newStock = product.currentStock + adjustmentValue;

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
            className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-xl font-semibold text-slate-900">
                Adjust Stock
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
              {/* Product Info */}
              <div className="mb-6 p-4 bg-slate-50 rounded-lg">
                <h3 className="font-medium text-slate-900 mb-2">{product.name}</h3>
                <div className="text-sm text-slate-600">
                  <p>SKU: {product.sku}</p>
                  <p className="font-medium">Current Stock: {product.currentStock}</p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Adjustment Input */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Adjustment *
                  </label>
                  <Input
                    name="adjustment"
                    type="number"
                    value={formData.adjustment}
                    onChange={handleInputChange}
                    placeholder="Enter + or - value (e.g., +10, -5)"
                    className={errors.adjustment ? 'border-red-300 focus:ring-red-500' : ''}
                  />
                  {errors.adjustment && <p className="mt-1 text-sm text-red-600">{errors.adjustment}</p>}
                  {formData.adjustment && !errors.adjustment && (
                    <p className="mt-1 text-sm text-slate-600">
                      New stock will be: <span className="font-medium">{newStock}</span>
                    </p>
                  )}
                </div>

                {/* Reason Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Reason *
                  </label>
                  <select
                    name="reason"
                    value={formData.reason}
                    onChange={handleInputChange}
                    className={`flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${errors.reason ? 'border-red-300 focus:ring-red-500' : ''}`}
                  >
                    <option value="">Select reason</option>
                    {reasons.map(reason => (
                      <option key={reason} value={reason}>{reason}</option>
                    ))}
                  </select>
                  {errors.reason && <p className="mt-1 text-sm text-red-600">{errors.reason}</p>}
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Additional notes (optional)"
                    className="flex w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 mt-6 pt-6 border-t border-slate-200">
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
                  <span>Adjust Stock</span>
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default StockAdjustmentModal;