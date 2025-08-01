import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";

const Categories = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Categories</h1>
          <p className="text-slate-600 mt-2">Organize your products into logical categories</p>
        </div>
        <Button className="flex items-center space-x-2">
          <ApperIcon name="Plus" className="w-4 h-4" />
          <span>Add Category</span>
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
            <div className="bg-accent-50 rounded-full p-4 w-16 h-16 mx-auto mb-4">
              <ApperIcon name="FolderOpen" className="w-8 h-8 text-accent-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              Category Management Coming Soon
            </h3>
            <p className="text-slate-600 mb-6 max-w-md mx-auto">
              Create hierarchical categories to organize your products and 
              make inventory management more efficient and intuitive.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left max-w-2xl mx-auto">
              <div className="bg-slate-50 p-4 rounded-lg">
                <ApperIcon name="TreePine" className="w-5 h-5 text-slate-600 mb-2" />
                <h4 className="font-medium text-slate-900">Hierarchical Structure</h4>
                <p className="text-sm text-slate-600">Nested category organization</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg">
                <ApperIcon name="Tag" className="w-5 h-5 text-slate-600 mb-2" />
                <h4 className="font-medium text-slate-900">Smart Tagging</h4>
                <p className="text-sm text-slate-600">Auto-categorize products</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg">
                <ApperIcon name="BarChart3" className="w-5 h-5 text-slate-600 mb-2" />
                <h4 className="font-medium text-slate-900">Category Analytics</h4>
                <p className="text-sm text-slate-600">Performance by category</p>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Categories;