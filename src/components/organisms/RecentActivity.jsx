import React from "react";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";

const RecentActivity = ({ activities }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'stock_in': return 'Plus';
      case 'stock_out': return 'Minus';
      case 'low_stock': return 'AlertTriangle';
      case 'new_product': return 'Package';
      default: return 'Activity';
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'stock_in': return 'text-emerald-600 bg-emerald-50';
      case 'stock_out': return 'text-red-600 bg-red-50';
      case 'low_stock': return 'text-amber-600 bg-amber-50';
      case 'new_product': return 'text-blue-600 bg-blue-50';
      default: return 'text-slate-600 bg-slate-50';
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-6 flex items-center space-x-2">
        <ApperIcon name="Activity" className="w-5 h-5 text-primary-600" />
        <span>Recent Activity</span>
      </h3>
      
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <motion.div
            key={activity.Id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="flex items-center space-x-4 p-3 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <div className={`p-2 rounded-lg ${getActivityColor(activity.type)}`}>
              <ApperIcon 
                name={getActivityIcon(activity.type)} 
                className="w-4 h-4" 
              />
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">
                {activity.description}
              </p>
              <p className="text-xs text-slate-500">
                {activity.location} • {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
              </p>
            </div>
            
            {activity.quantity && (
              <div className="text-sm font-medium text-slate-600">
                {activity.type === 'stock_out' ? '-' : '+'}{activity.quantity}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </Card>
  );
};

export default RecentActivity;