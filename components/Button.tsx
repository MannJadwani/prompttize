import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "font-display font-bold py-3 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transform active:scale-95";
  
  const variants = {
    primary: "bg-brand-black text-brand-yellow hover:bg-gray-800 shadow-lg hover:shadow-xl border-2 border-transparent",
    secondary: "bg-brand-yellow text-brand-black hover:bg-[#F2C500] shadow-md hover:shadow-lg border-2 border-transparent",
    outline: "bg-transparent text-brand-black border-2 border-brand-black hover:bg-brand-black hover:text-brand-yellow",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};