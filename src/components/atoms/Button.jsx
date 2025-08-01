import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Button = forwardRef(({
  className,
  variant = "primary",
  size = "md",
  children,
  ...props
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-primary-500 hover:bg-primary-600 text-white focus:ring-primary-500 shadow-sm hover:shadow-md",
    secondary: "bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 focus:ring-primary-500 shadow-sm hover:shadow-md",
    ghost: "hover:bg-slate-100 text-slate-700 focus:ring-primary-500",
    danger: "bg-red-500 hover:bg-red-600 text-white focus:ring-red-500 shadow-sm hover:shadow-md",
    outline: "border border-slate-300 bg-transparent hover:bg-slate-50 text-slate-700 focus:ring-primary-500",
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm rounded-lg",
    md: "px-4 py-2 text-sm rounded-lg",
    lg: "px-6 py-3 text-base rounded-lg",
  };
  
  return (
    <button
      ref={ref}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;