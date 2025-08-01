import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import NavItem from "@/components/molecules/NavItem";

const MobileSidebar = ({ isOpen, onClose }) => {
  const navigationItems = [
    { to: "/", icon: "LayoutDashboard", label: "Dashboard" },
    { to: "/products", icon: "Package", label: "Products" },
    { to: "/categories", icon: "FolderOpen", label: "Categories" },
    { to: "/locations", icon: "MapPin", label: "Locations" },
    { to: "/reports", icon: "BarChart3", label: "Reports" },
    { to: "/settings", icon: "Settings", label: "Settings" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={onClose}
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 bottom-0 w-80 bg-white z-50 lg:hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-br from-primary-500 to-accent-500 p-2 rounded-xl">
                  <ApperIcon name="Package" className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900">StockFlow</h1>
                  <p className="text-xs text-slate-500">Inventory Management</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <ApperIcon name="X" className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="p-4">
              <div className="space-y-2">
                {navigationItems.map((item, index) => (
                  <motion.div
                    key={item.to}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    onClick={onClose}
                  >
                    <NavItem
                      to={item.to}
                      icon={item.icon}
                      label={item.label}
                      isMobile={true}
                    />
                  </motion.div>
                ))}
              </div>
            </nav>

            {/* Bottom Section */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-200">
              <div className="bg-gradient-to-r from-primary-50 to-accent-50 p-4 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-to-br from-primary-500 to-accent-500 p-2 rounded-lg">
                    <ApperIcon name="Zap" className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">Upgrade Plan</p>
                    <p className="text-xs text-slate-600">Get advanced features</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileSidebar;