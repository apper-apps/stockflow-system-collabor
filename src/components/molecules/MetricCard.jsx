import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";

const MetricCard = ({ 
  title, 
  value, 
  icon, 
  trend, 
  trendValue, 
  colorScheme = "blue",
  delay = 0 
}) => {
  const colorClasses = {
    blue: {
      bg: "bg-blue-50",
      text: "text-blue-600",
      accent: "text-blue-500"
    },
    red: {
      bg: "bg-red-50",
      text: "text-red-600",
      accent: "text-red-500"
    },
    green: {
      bg: "bg-emerald-50",
      text: "text-emerald-600",
      accent: "text-emerald-500"
    },
    purple: {
      bg: "bg-purple-50",
      text: "text-purple-600",
      accent: "text-purple-500"
    }
  };

  const colors = colorClasses[colorScheme] || colorClasses.blue;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ scale: 1.02 }}
    >
      <Card className="p-6 hover:shadow-lg transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className={`${colors.bg} p-3 rounded-xl`}>
            <ApperIcon name={icon} className={`w-6 h-6 ${colors.text}`} />
          </div>
          {trend && (
            <div className={`flex items-center space-x-1 ${trend === 'up' ? 'text-emerald-600' : 'text-red-600'}`}>
              <ApperIcon 
                name={trend === 'up' ? 'TrendingUp' : 'TrendingDown'} 
                className="w-4 h-4" 
              />
              <span className="text-sm font-medium">{trendValue}</span>
            </div>
          )}
        </div>
        
        <div className="space-y-1">
          <h3 className="text-2xl font-bold text-slate-900">
            {value}
          </h3>
          <p className="text-sm text-slate-600 font-medium">
            {title}
          </p>
        </div>
      </Card>
    </motion.div>
  );
};

export default MetricCard;