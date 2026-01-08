import React, { useState } from 'react';
import { Button } from './Button';
import { ArrowRight, MessageSquarePlus } from 'lucide-react';

interface InputStageProps {
  onSubmit: (text: string) => void;
  isLoading: boolean;
}

export const InputStage: React.FC<InputStageProps> = ({ onSubmit, isLoading }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) onSubmit(text);
  };

  return (
    <div className="max-w-2xl mx-auto w-full animate-fade-in-up">
      <div className="mb-8">
        <h2 className="font-display font-bold text-3xl md:text-4xl mb-3">What are you trying to do?</h2>
        <p className="text-gray-500 text-lg">Don't worry about format. Just dump your raw idea.</p>
      </div>

      <form onSubmit={handleSubmit} className="relative">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="e.g. Write a LinkedIn post about AI for startups, or help me plan a vegan meal prep for the week..."
          className="w-full h-64 p-6 rounded-3xl border-2 border-gray-200 bg-white text-xl font-medium focus:outline-none focus:border-brand-black focus:ring-0 resize-none shadow-sm transition-all"
          disabled={isLoading}
          autoFocus
        />
        
        <div className="absolute bottom-6 right-6">
           <Button 
            type="submit" 
            disabled={!text.trim() || isLoading}
            className={!text.trim() ? 'opacity-0 scale-90' : 'opacity-100 scale-100'}
           >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-brand-yellow"></span>
                Analyzing...
              </span>
            ) : (
              <>Analyze Intent <ArrowRight className="w-4 h-4" /></>
            )}
          </Button>
        </div>
      </form>

      <div className="mt-8 flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
        <span className="text-sm font-bold text-gray-400 self-center shrink-0 mr-2">Try:</span>
        {["Write a cover letter", "Debug my React code", "Plan a marketing launch"].map((t) => (
          <button 
            key={t}
            onClick={() => setText(t)}
            className="whitespace-nowrap px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-semibold text-gray-600 hover:border-brand-black hover:bg-gray-50 transition-colors"
          >
            {t}
          </button>
        ))}
      </div>
    </div>
  );
};