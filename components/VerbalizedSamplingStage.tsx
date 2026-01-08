import React, { useState } from 'react';
import { Button } from './Button';
import { ArrowRight, Sparkles } from 'lucide-react';

interface VerbalizedSamplingStageProps {
  onSubmit: (text: string) => void;
  isLoading: boolean;
}

export const VerbalizedSamplingStage: React.FC<VerbalizedSamplingStageProps> = ({ onSubmit, isLoading }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) onSubmit(text);
  };

  return (
    <div className="max-w-2xl mx-auto w-full animate-fade-in-up">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 bg-brand-black/5 rounded-full px-4 py-1 mb-4">
          <Sparkles className="w-4 h-4" />
          <span className="text-sm font-bold tracking-wide uppercase">Verbalized Sampling</span>
        </div>
        <h2 className="font-display font-bold text-3xl md:text-4xl mb-3">Enter your raw prompt</h2>
        <p className="text-gray-500 text-lg">
          Transform any prompt into a structured, probability-driven prompt using Verbalized Sampling methodology.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="relative">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="e.g. Build a todo app, Create a landing page for my startup, Design a dashboard..."
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
                Compiling...
              </span>
            ) : (
              <>Compile Prompt <ArrowRight className="w-4 h-4" /></>
            )}
          </Button>
        </div>
      </form>

      <div className="mt-8 p-6 bg-blue-50 rounded-2xl border border-blue-200">
        <h3 className="font-bold text-sm text-blue-900 mb-2">What is Verbalized Sampling?</h3>
        <p className="text-sm text-blue-800 leading-relaxed">
          This method transforms your prompt into a structured format that generates multiple candidate solutions with probabilities, 
          selects the best approach, and produces concrete outputs. Perfect for code generators, design tools, and LLMs.
        </p>
      </div>
    </div>
  );
};

