import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  className = '', 
  isLoading = false,
  disabled = false,
  icon: Icon,
  type = 'button'
}) => {
  const baseStyles = "px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-sky-500 text-white hover:bg-sky-600 shadow-sm hover:shadow-sky-500/20 focus:ring-sky-500",
    secondary: "bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 focus:ring-slate-200",
    danger: "bg-rose-500 text-white hover:bg-rose-600 shadow-sm focus:ring-rose-500",
    ghost: "bg-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-900"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isLoading || disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <>
          {Icon && <Icon className="w-4 h-4" />}
          {children}
        </>
      )}
    </button>
  );
};

export default Button;
