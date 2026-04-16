import React from 'react';

const Skeleton = ({ className, variant = 'rect' }) => {
  const baseClass = "bg-slate-200 relative overflow-hidden shimmer";
  const variantClass = variant === 'circle' ? "rounded-full" : "rounded-xl";
  
  return (
    <div className={`${baseClass} ${variantClass} ${className}`}>
      <div className="absolute inset-0 shimmer"></div>
    </div>
  );
};

export default Skeleton;
