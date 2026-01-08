export enum AppStep {
  LANDING = 'LANDING',
  INPUT = 'INPUT',
  CLARIFYING = 'CLARIFYING',
  GENERATING = 'GENERATING',
  RESULT = 'RESULT',
  VERBALIZED_SAMPLING = 'VERBALIZED_SAMPLING',
}

export interface ClarificationQuestion {
  id: string;
  question: string;
  category: 'audience' | 'tone' | 'format' | 'context' | 'goal';
}

export interface QuestionResponse {
  questionId: string;
  questionText: string;
  answer: string;
}

export interface PromptizeState {
  step: AppStep;
  originalPrompt: string;
  questions: ClarificationQuestion[];
  responses: QuestionResponse[];
  finalPrompt: string;
  isLoading: boolean;
  error: string | null;
}