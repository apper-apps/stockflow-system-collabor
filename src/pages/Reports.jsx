import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";

const Reports = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Reports</h1>
          <p className="text-slate-600 mt-2">Analytics and insights for your inventory data</p>
        </div>
        <Button className="flex items-center space-x-2">
          <ApperIcon name="Plus" className="w-4 h-4" />
          <span>Create Report</span>
        </Button>
      </motion.div>

      {/* Placeholder Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-12">
          <div className="text-center">
            <div className="bg-purple-50 rounded-full p-4 w-16 h-16 mx-auto mb-4">
              <ApperIcon name="BarChart3" className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              Advanced Reporting Coming Soon
            </h3>
            <p className="text-slate-600 mb-6 max-w-md mx-auto">
              Generate comprehensive reports and analytics to make data-driven 
              decisions about your inventory management and business operations.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left max-w-2xl mx-auto">
              <div className="bg-slate-50 p-4 rounded-lg">
                <ApperIcon name="TrendingUp" className="w-5 h-5 text-slate-600 mb-2" />
                <h4 className="font-medium text-slate-900">Trend Analysis</h4>
                <p className="text-sm text-slate-600">Identify patterns and trends</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg">
                <ApperIcon name="PieChart" className="w-5 h-5 text-slate-600 mb-2" />
                <h4 className="font-medium text-slate-900">Visual Dashboards</h4>
                <p className="text-sm text-slate-600">Interactive charts and graphs</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg">
                <ApperIcon name="Download" className="w-5 h-5 text-slate-600 mb-2" />
                <h4 className="font-medium text-slate-900">Export Options</h4>
                <p className="text-sm text-slate-600">PDF, Excel, and CSV export</p>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Reports;