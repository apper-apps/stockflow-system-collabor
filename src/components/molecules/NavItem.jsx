import React from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const NavItem = ({ to, icon, label, isMobile = false }) => {
  return (
    <NavLink to={to}>
      {({ isActive }) => (
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`
            relative flex items-center space-x-3 px-3 py-2.5 rounded-xl font-medium transition-all duration-200
            ${isActive 
              ? 'bg-primary-50 text-primary-700 shadow-sm' 
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }
            ${isMobile ? 'text-base' : 'text-sm'}
          `}
        >
          <ApperIcon 
            name={icon} 
            className={`w-5 h-5 ${isActive ? 'text-primary-600' : ''}`} 
          />
          <span>{label}</span>
          {isActive && (
            <motion.div
              layoutId="activeIndicator"
              className="absolute right-2 w-2 h-2 bg-primary-500 rounded-full"
              initial={false}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
        </motion.div>
      )}
    </NavLink>
  );
};

export default NavItem;