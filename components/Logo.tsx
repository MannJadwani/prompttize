import React from 'react';

export const Logo: React.FC<{ size?: 'sm' | 'lg' }> = ({ size = 'sm' }) => {
  const textSize = size === 'lg' ? 'text-4xl' : 'text-xl';
  
  return (
    <div className={`font-display font-bold tracking-tighter flex items-center gap-2 ${textSize}`}>
      <div className={`bg-brand-yellow text-brand-black rounded-lg flex items-center justify-center font-black ${size === 'lg' ? 'w-12 h-12 text-2xl' : 'w-8 h-8 text-lg'}`}>
        P.
      </div>
      <span>Promptize</span>
    </div>
  );
};