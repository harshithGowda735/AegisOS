import React from 'react';

const Button = ({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary', 
  isLoading = false, 
  disabled = false,
  className = '',
  icon: Icon
}) => {
  const baseStyles = "relative flex items-center justify-center gap-2 font-bold transition-all duration-300 rounded-2xl active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50";
  
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-600/20 py-4 px-8 text-[17px]",
    secondary: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 py-3 px-6 text-base",
    outline: "bg-transparent border-2 border-slate-200 text-slate-600 hover:border-indigo-500 hover:text-indigo-600 py-3 px-6 text-base",
    ghost: "bg-transparent text-slate-500 hover:bg-slate-50 py-2 px-4 text-sm",
    danger: "bg-rose-500 text-white hover:bg-rose-600 hover:shadow-lg hover:shadow-rose-500/20 py-4 px-8 text-[17px]"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Processing...</span>
        </div>
      ) : (
        <>
          {Icon && <Icon className="w-5 h-5" />}
          {children}
        </>
      )}
    </button>
  );
};

export default Button;
