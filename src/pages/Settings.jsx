import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";

const Settings = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
          <p className="text-slate-600 mt-2">Configure your inventory management system</p>
        </div>
      </motion.div>

      {/* Placeholder Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-12">
          <div className="text-center">
            <div className="bg-slate-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
              <ApperIcon name="Settings" className="w-8 h-8 text-slate-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              System Configuration Coming Soon
            </h3>
            <p className="text-slate-600 mb-6 max-w-md mx-auto">
              Customize your inventory management system with preferences, 
              alerts, integrations, and user management options.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left max-w-2xl mx-auto">
              <div className="bg-slate-50 p-4 rounded-lg">
                <ApperIcon name="Bell" className="w-5 h-5 text-slate-600 mb-2" />
                <h4 className="font-medium text-slate-900">Notifications</h4>
                <p className="text-sm text-slate-600">Alert preferences</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg">
                <ApperIcon name="Link" className="w-5 h-5 text-slate-600 mb-2" />
                <h4 className="font-medium text-slate-900">Integrations</h4>
                <p className="text-sm text-slate-600">Connect external systems</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg">
                <ApperIcon name="Shield" className="w-5 h-5 text-slate-600 mb-2" />
                <h4 className="font-medium text-slate-900">Security</h4>
                <p className="text-sm text-slate-600">Access control settings</p>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Settings;