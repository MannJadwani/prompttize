import React, { useState } from 'react';
import { Button } from './Button';
import { Copy, Check, RotateCcw, PenTool } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface ResultStageProps {
  finalPrompt: string;
  onRestart: () => void;
}

export const ResultStage: React.FC<ResultStageProps> = ({ finalPrompt, onRestart }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(finalPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto w-full animate-fade-in-up pb-12">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 text-green-600 rounded-2xl mb-6">
          <Check className="w-8 h-8" />
        </div>
        <h2 className="font-display font-bold text-4xl mb-3">Your Perfect Prompt</h2>
        <p className="text-gray-500 text-lg">Optimized for GPT-4, Claude 3.5, and Gemini Pro.</p>
      </div>

      <div className="bg-white rounded-3xl border-2 border-brand-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
        {/* Toolbar */}
        <div className="bg-brand-black p-4 flex justify-between items-center">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <div className="flex gap-2">
             <button 
                onClick={handleCopy} 
                className="flex items-center gap-2 px-4 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-bold transition-colors"
             >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy'}
             </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 md:p-12 overflow-x-auto">
          <div className="prose prose-lg prose-headings:font-display prose-headings:font-bold prose-h1:text-brand-black prose-p:text-gray-700 max-w-none">
            <ReactMarkdown>{finalPrompt}</ReactMarkdown>
          </div>
        </div>
      </div>

      <div className="mt-12 flex justify-center gap-4">
        <Button variant="outline" onClick={onRestart} className="px-8">
          <RotateCcw className="w-4 h-4" /> Start Over
        </Button>
        <Button onClick={() => window.open('https://chat.openai.com', '_blank')} className="px-8">
           Try in ChatGPT <PenTool className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};