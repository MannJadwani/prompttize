import React, { useState, useRef, useEffect } from 'react';
import { Button } from './Button';
import { ClarificationQuestion, QuestionResponse } from '../types';
import { Send, CheckCircle2 } from 'lucide-react';

interface ClarificationStageProps {
  questions: ClarificationQuestion[];
  onComplete: (responses: QuestionResponse[]) => void;
  isLoading: boolean;
}

export const ClarificationStage: React.FC<ClarificationStageProps> = ({ questions, onComplete, isLoading }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentAnswer, setCurrentAnswer] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentIndex]);

  const handleNext = () => {
    if (!currentAnswer.trim()) return;

    const newAnswers = { ...answers, [currentQuestion.id]: currentAnswer };
    setAnswers(newAnswers);
    setCurrentAnswer('');

    if (isLastQuestion) {
      // Compile results
      const responses: QuestionResponse[] = questions.map(q => ({
        questionId: q.id,
        questionText: q.question,
        answer: newAnswers[q.id]
      }));
      onComplete(responses);
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleNext();
    }
  };

  return (
    <div className="max-w-2xl mx-auto w-full flex flex-col h-[calc(100vh-160px)]">
      <div className="mb-6 flex items-center justify-between">
         <h2 className="font-display font-bold text-2xl">Refining your idea</h2>
         <span className="text-sm font-bold bg-gray-200 px-3 py-1 rounded-full text-gray-600">
            {currentIndex + 1} / {questions.length}
         </span>
      </div>

      <div className="flex-1 overflow-y-auto mb-6 space-y-6 pr-2">
        {questions.slice(0, currentIndex + 1).map((q, idx) => {
          const isCurrent = idx === currentIndex;
          const answer = answers[q.id];

          return (
            <div key={q.id} className={`flex flex-col gap-3 ${isCurrent ? 'animate-fade-in' : 'opacity-60'}`}>
              {/* AI Question Bubble */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-brand-black text-brand-yellow flex items-center justify-center font-bold text-xs shrink-0 mt-1">
                  AI
                </div>
                <div className="bg-white border-2 border-gray-100 p-4 rounded-2xl rounded-tl-none shadow-sm max-w-[85%]">
                  <p className="font-medium text-lg text-gray-800">{q.question}</p>
                  <span className="text-xs font-bold text-brand-yellow bg-brand-black/90 px-2 py-0.5 rounded uppercase mt-2 inline-block tracking-wider">
                    {q.category}
                  </span>
                </div>
              </div>

              {/* User Answer Bubble (if answered) */}
              {answer && (
                <div className="flex items-start gap-3 justify-end">
                  <div className="bg-brand-yellow p-4 rounded-2xl rounded-tr-none shadow-sm max-w-[85%] text-brand-black">
                    <p className="font-medium text-lg">{answer}</p>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-gray-200 text-gray-600 flex items-center justify-center font-bold text-xs shrink-0 mt-1">
                    You
                  </div>
                </div>
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="relative">
        <div className="bg-white p-2 rounded-2xl border-2 border-gray-200 shadow-lg flex items-center gap-2 focus-within:border-brand-black transition-colors">
          <input
            ref={inputRef}
            type="text"
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isLoading ? "Generating final prompt..." : "Type your answer..."}
            className="flex-1 bg-transparent border-none focus:ring-0 text-lg px-4 py-3 placeholder:text-gray-400"
            disabled={isLoading}
          />
          <Button 
            onClick={handleNext} 
            disabled={!currentAnswer.trim() || isLoading}
            className="!p-3 rounded-xl"
          >
            {isLoading ? <span className="animate-spin w-5 h-5 border-2 border-current border-t-transparent rounded-full" /> : <Send className="w-5 h-5" />}
          </Button>
        </div>
        <p className="text-center text-xs text-gray-400 mt-3 font-medium">Press Enter to continue</p>
      </div>
    </div>
  );
};