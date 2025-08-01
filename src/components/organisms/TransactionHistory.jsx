import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { getTransactionHistory } from '@/services/api/productService';
import ApperIcon from '@/components/ApperIcon';

const TransactionHistory = ({ productId }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const history = await getTransactionHistory(productId);
        setTransactions(history);
      } catch (error) {
        console.error('Failed to fetch transaction history:', error);
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [productId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-4">
        <ApperIcon name="Loader2" className="w-4 h-4 animate-spin text-slate-400" />
        <span className="ml-2 text-sm text-slate-500">Loading transaction history...</span>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-4">
        <ApperIcon name="Clock" className="w-6 h-6 mx-auto text-slate-300 mb-2" />
        <p className="text-sm text-slate-500">No transaction history available</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-slate-700 flex items-center space-x-2">
        <ApperIcon name="History" className="w-4 h-4" />
        <span>Transaction History</span>
      </h4>
      
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {transactions.map((transaction) => (
          <div 
            key={transaction.Id} 
            className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200"
          >
            <div className="flex items-center space-x-3">
              <div className={`p-1.5 rounded-full ${
                transaction.adjustment > 0 
                  ? 'bg-emerald-100 text-emerald-600' 
                  : 'bg-red-100 text-red-600'
              }`}>
                <ApperIcon 
                  name={transaction.adjustment > 0 ? "Plus" : "Minus"} 
                  className="w-3 h-3" 
                />
              </div>
              
              <div className="min-w-0 flex-1">
                <div className="flex items-center space-x-2">
                  <span className={`text-sm font-medium ${
                    transaction.adjustment > 0 ? 'text-emerald-600' : 'text-red-600'
                  }`}>
                    {transaction.adjustment > 0 ? '+' : ''}{transaction.adjustment}
                  </span>
                  <span className="text-xs text-slate-500">•</span>
                  <span className="text-xs text-slate-600">{transaction.reason}</span>
                </div>
                
                <div className="text-xs text-slate-500 mt-1">
                  {format(new Date(transaction.timestamp), 'MMM d, yyyy • h:mm a')}
                </div>
                
                {transaction.notes && (
                  <div className="text-xs text-slate-600 mt-1 italic">
                    "{transaction.notes}"
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionHistory;