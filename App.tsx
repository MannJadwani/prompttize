import React, { useState } from 'react';
import { Landing } from './components/Landing';
import { InputStage } from './components/InputStage';
import { ClarificationStage } from './components/ClarificationStage';
import { ResultStage } from './components/ResultStage';
import { VerbalizedSamplingStage } from './components/VerbalizedSamplingStage';
import { Logo } from './components/Logo';
import { AppStep, PromptizeState, QuestionResponse } from './types';
import { generateQuestions, generateFinalPrompt, generateVerbalizedSamplingPrompt } from './services/geminiService';
import { SignedIn, SignedOut } from '@clerk/clerk-react';

const initialState: PromptizeState = {
  step: AppStep.LANDING,
  originalPrompt: '',
  questions: [],
  responses: [],
  finalPrompt: '',
  isLoading: false,
  error: null,
};

export default function App() {
  const [state, setState] = useState<PromptizeState>(initialState);

  const handleStart = () => {
    setState(prev => ({ ...prev, step: AppStep.INPUT }));
  };

  const handleInitialSubmit = async (text: string) => {
    setState(prev => ({ ...prev, isLoading: true, originalPrompt: text }));
    try {
      const questions = await generateQuestions(text);
      setState(prev => ({
        ...prev,
        questions,
        step: AppStep.CLARIFYING,
        isLoading: false,
      }));
    } catch (e) {
      console.error(e);
      setState(prev => ({ ...prev, isLoading: false, error: 'Failed to analyze prompt.' }));
    }
  };

  const handleClarificationComplete = async (responses: QuestionResponse[]) => {
    setState(prev => ({ ...prev, responses, isLoading: true }));
    try {
      const finalPrompt = await generateFinalPrompt(state.originalPrompt, responses);
      setState(prev => ({
        ...prev,
        finalPrompt,
        step: AppStep.RESULT,
        isLoading: false,
      }));
    } catch (e) {
      console.error(e);
      setState(prev => ({ ...prev, isLoading: false, error: 'Failed to generate final prompt.' }));
    }
  };

  const handleVerbalizedSamplingSubmit = async (text: string) => {
    setState(prev => ({ ...prev, isLoading: true, originalPrompt: text }));
    try {
      const finalPrompt = await generateVerbalizedSamplingPrompt(text);
      setState(prev => ({
        ...prev,
        finalPrompt,
        step: AppStep.RESULT,
        isLoading: false,
      }));
    } catch (e) {
      console.error(e);
      setState(prev => ({ ...prev, isLoading: false, error: 'Failed to generate verbalized sampling prompt.' }));
    }
  };

  const handleRestart = () => {
    setState({ ...initialState, step: AppStep.INPUT });
  };

  const handleGoHome = () => {
    setState(initialState);
  };

  const handleStartVerbalizedSampling = () => {
    setState(prev => ({ ...prev, step: AppStep.VERBALIZED_SAMPLING }));
  };

  if (state.step === AppStep.LANDING) {
    return <Landing onStart={handleStart} onStartVerbalizedSampling={handleStartVerbalizedSampling} />;
  }

  return (
    <>
      <SignedIn>
        <div className="min-h-screen flex flex-col bg-[#FAFAFA]">
          <header className="px-6 py-6 border-b border-gray-100 bg-white sticky top-0 z-50">
            <div className="max-w-5xl mx-auto w-full flex justify-between items-center">
              <div onClick={handleGoHome} className="cursor-pointer">
                <Logo />
              </div>
              {state.step !== AppStep.RESULT && state.step !== AppStep.LANDING && (
                <button onClick={handleRestart} className="text-sm font-bold text-gray-400 hover:text-brand-black transition-colors">
                  Reset
                </button>
              )}
            </div>
          </header>

          <main className="flex-1 px-4 py-8 md:py-12 flex flex-col max-w-5xl mx-auto w-full">
            {state.step === AppStep.INPUT && (
              <InputStage onSubmit={handleInitialSubmit} isLoading={state.isLoading} />
            )}
            
            {state.step === AppStep.VERBALIZED_SAMPLING && (
              <VerbalizedSamplingStage onSubmit={handleVerbalizedSamplingSubmit} isLoading={state.isLoading} />
            )}
            
            {state.step === AppStep.CLARIFYING && (
              <ClarificationStage 
                questions={state.questions} 
                onComplete={handleClarificationComplete}
                isLoading={state.isLoading}
              />
            )}
            
            {state.step === AppStep.RESULT && (
              <ResultStage 
                finalPrompt={state.finalPrompt} 
                onRestart={handleRestart}
              />
            )}
          </main>
        </div>
      </SignedIn>
      <SignedOut>
        <Landing onStart={handleStart} />
      </SignedOut>
    </>
  );
}