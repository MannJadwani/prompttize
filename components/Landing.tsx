import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { Logo } from './Logo';
import { ArrowRight, Sparkles, Zap, LayoutTemplate, Key, ExternalLink } from 'lucide-react';
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/clerk-react';

interface LandingProps {
  onStart: () => void;
  onStartVerbalizedSampling?: () => void;
}

export const Landing: React.FC<LandingProps> = ({ onStart, onStartVerbalizedSampling }) => {
  const [apiKey, setApiKey] = useState('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);

  useEffect(() => {
    const storedKey = localStorage.getItem('gemini_api_key');
    if (storedKey) {
      setShowApiKeyInput(false);
    } else {
      setShowApiKeyInput(true);
    }
  }, []);

  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('gemini_api_key', apiKey.trim());
      setShowApiKeyInput(false);
    }
  };

  const handleChangeApiKey = () => {
    setShowApiKeyInput(true);
    setApiKey('');
  };

  return (
    <div className="min-h-screen bg-brand-yellow flex flex-col">
      <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto w-full">
        <Logo />
        {!showApiKeyInput && (
          <div className="flex gap-3 items-center">
            <button
              onClick={handleChangeApiKey}
              className="text-sm font-medium text-gray-600 hover:text-brand-black transition-colors"
            >
              Change API Key
            </button>
            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="outline" className="!py-2 !px-4 text-sm">
                  Sign In
        </Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        )}
      </nav>

      {showApiKeyInput && (
        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="max-w-md w-full bg-white rounded-3xl border-2 border-brand-black shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-brand-black text-brand-yellow w-12 h-12 rounded-xl flex items-center justify-center">
                <Key className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-display font-bold text-2xl">Enter Your Gemini API Key</h2>
                <p className="text-sm text-gray-500 mt-1">Required to use Promptize</p>
              </div>
            </div>
            
            <div className="mb-6">
              <label htmlFor="api-key" className="block text-sm font-semibold text-gray-700 mb-2">
                Gemini API Key
              </label>
              <input
                id="api-key"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your API key"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white text-base font-medium focus:outline-none focus:border-brand-black focus:ring-0 transition-all"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && apiKey.trim()) {
                    handleSaveApiKey();
                  }
                }}
                autoFocus
              />
              <p className="text-xs text-gray-500 mt-2">
                Your API key is stored locally and never sent to our servers.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <Button
                onClick={handleSaveApiKey}
                disabled={!apiKey.trim()}
                className="w-full"
              >
                Save API Key <ArrowRight className="w-4 h-4" />
              </Button>
              <button
                onClick={() => window.open('https://aistudio.google.com/apikey', '_blank')}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 bg-white text-base font-semibold text-gray-700 hover:border-brand-black hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
              >
                Get API Key <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {!showApiKeyInput && (
        <>
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 text-center max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-brand-black/5 rounded-full px-4 py-1 mb-8">
          <Sparkles className="w-4 h-4" />
          <span className="text-sm font-bold tracking-wide uppercase">AI Prompt Engineer</span>
        </div>
        
        <h1 className="font-display font-bold text-6xl md:text-8xl tracking-tight leading-[0.9] mb-8 text-brand-black">
          Turn messy thoughts<br />
          into <span className="text-white drop-shadow-md">perfect prompts.</span>
        </h1>
        
        <p className="text-xl md:text-2xl font-medium mb-12 max-w-2xl mx-auto leading-relaxed opacity-90">
          Stop guessing what to ask AI. Promptize asks <i>you</i> the right questions to build the ultimate structured prompt.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center max-w-2xl mx-auto">
          <SignedIn>
          <Button onClick={onStart} className="text-lg py-4 !bg-brand-black !text-brand-yellow">
            Create a Prompt <ArrowRight className="w-5 h-5" />
          </Button>
            {onStartVerbalizedSampling && (
              <Button onClick={onStartVerbalizedSampling} variant="outline" className="text-lg py-4">
                Verbalized Sampling <Sparkles className="w-5 h-5" />
              </Button>
            )}
          </SignedIn>
          <SignedOut>
            <SignUpButton mode="modal">
              <Button className="text-lg py-4 !bg-brand-black !text-brand-yellow">
                Get Started <ArrowRight className="w-5 h-5" />
              </Button>
            </SignUpButton>
          </SignedOut>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 w-full text-left">
          {[
            { 
              icon: <Zap className="w-6 h-6" />, 
              title: "Instant Clarity", 
              desc: "We analyze your intent and find missing context instantly." 
            },
            { 
              icon: <LayoutTemplate className="w-6 h-6" />, 
              title: "Structured Output", 
              desc: "Get prompts formatted for GPT-4, Claude, and Gemini." 
            },
            { 
              icon: <Sparkles className="w-6 h-6" />, 
              title: "Better Results", 
              desc: "Stop getting generic answers. Get expert-level outputs." 
            },
          ].map((f, i) => (
            <div key={i} className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border-2 border-brand-black/5 shadow-sm hover:shadow-md transition-all">
              <div className="bg-brand-black text-brand-yellow w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                {f.icon}
              </div>
              <h3 className="font-display font-bold text-xl mb-2">{f.title}</h3>
              <p className="text-gray-700 leading-snug">{f.desc}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="p-6 text-center text-sm font-medium opacity-60">
        © 2024 Promptize. Built with Google Gemini.
      </footer>
        </>
      )}
    </div>
  );
};