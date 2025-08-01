import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Card = forwardRef(({
  className,
  children,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "rounded-xl bg-white shadow-sm border border-slate-200 transition-all duration-200 hover:shadow-md",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

export default Card;