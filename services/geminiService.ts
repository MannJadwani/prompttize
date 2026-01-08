import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ClarificationQuestion, QuestionResponse } from "../types";

const getApiKey = (): string => {
  return localStorage.getItem('gemini_api_key') || '';
};

const getAI = () => {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("API Key missing. Please enter your Gemini API key.");
  }
  return new GoogleGenAI({ apiKey });
};

const QUESTION_MODEL = 'gemini-3-flash-preview';
const FINAL_MODEL = 'gemini-3-flash-preview';

export const generateQuestions = async (rawPrompt: string): Promise<ClarificationQuestion[]> => {
  const ai = getAI();

  const systemInstruction = `
    You are Promptize, an expert prompt engineering assistant.
    Your goal is to identify missing context in a user's raw, unstructured prompt.
    Analyze the prompt and generate 3 to 5 critical follow-up questions that will help clarify:
    - Target Audience
    - Platform/Format
    - Tone/Style
    - Specific Constraints
    - Underlying Goal

    Do not ask redundant questions if the info is already present.
    Keep questions concise and conversational.
  `;

  const schema: Schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        id: { type: Type.STRING },
        question: { type: Type.STRING },
        category: { type: Type.STRING, enum: ['audience', 'tone', 'format', 'context', 'goal'] },
      },
      required: ['id', 'question', 'category'],
    },
  };

  try {
    const response = await ai.models.generateContent({
      model: QUESTION_MODEL,
      contents: rawPrompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.7,
      },
    });

    const text = response.text;
    if (!text) return [];
    return JSON.parse(text) as ClarificationQuestion[];
  } catch (error) {
    console.error("Error generating questions:", error);
    // Fallback if JSON parsing fails or API errors
    return [
      { id: '1', question: 'Who is the primary audience for this?', category: 'audience' },
      { id: '2', question: 'What is the desired tone (e.g., professional, casual)?', category: 'tone' },
      { id: '3', question: 'What is the specific goal you want to achieve?', category: 'goal' }
    ];
  }
};

export const generateFinalPrompt = async (
  originalPrompt: string,
  qaPairs: QuestionResponse[]
): Promise<string> => {
  const ai = getAI();

  const qaContext = qaPairs.map(qa => `Q: ${qa.questionText}\nA: ${qa.answer}`).join('\n\n');

  const prompt = `
    Original User Idea: "${originalPrompt}"

    Clarification Context:
    ${qaContext}

    Task:
    Construct a "Perfect Prompt" based on the original idea and the clarification answers.
    The output should be a structured prompt ready to be pasted into an LLM (ChatGPT, Claude, Gemini).

    Structure the final output clearly with these sections (using Markdown):
    # Role
    [Define the persona]

    # Objective
    [Clear goal]

    # Context
    [Audience, Platform, Background info]

    # Style & Tone
    [Voice instructions]

    # Constraints & Format
    [Length, specific structure requirements]

    # Instructions
    [Step-by-step logic if needed]
  `;

  try {
    const response = await ai.models.generateContent({
      model: FINAL_MODEL,
      contents: prompt,
      config: {
        temperature: 0.7,
      },
    });

    return response.text || "Failed to generate prompt.";
  } catch (error) {
    console.error("Error generating final prompt:", error);
    return "An error occurred while generating the final prompt. Please try again.";
  }
};

const VERBALIZED_SAMPLING_PROMPT = `You are a Prompt Compiler.

Your job is to take ANY input prompt (raw, vague, short, or detailed) and convert it into a structured, high-quality prompt that follows the rules below.

DO NOT solve the task itself.
ONLY rewrite the prompt.

========================
INPUT
========================
You will receive:
- A raw user prompt describing what they want to build / generate / design.

========================
OUTPUT GOAL
========================
Rewrite the input into a SINGLE, clean, executable prompt that:

1. Uses Verbalized Sampling methodology
2. Instructs the model to generate and assign probabilities to candidate solutions
3. Forces exploration before execution by requiring multiple candidate approaches
4. Instructs the model to select a solution based on the generated probabilities
5. Produces a final concrete output (code / site / app / content)
6. Is compatible with tools like Lovable, code generators, or LLMs

========================
MANDATORY STRUCTURE
========================

Your rewritten prompt MUST contain these sections, in this order:

--------------------------------
A) ROLE + GOAL
--------------------------------
- Clearly define the role (e.g., "You are a senior product designer + engineer")
- Clearly define the final goal (what is being built)

--------------------------------
B) EXTRACTED / ASSUMED INPUTS
--------------------------------
- Convert vague instructions into explicit inputs
- If data is missing, make reasonable demo assumptions
- Present them as editable variables or demo values

--------------------------------
C) VERBALIZED SAMPLING (MANDATORY)
--------------------------------
Step 1 — Generate candidates:
- Instruct the model to generate 6–10 distinct candidate solutions / directions / approaches
- For EACH candidate, the model must provide:
  - Name
  - Core idea / approach
  - Key characteristics
  - Tradeoffs or risks
  - A probability assessment P(this is the best solution) ∈ [0.00, 1.00]

Probability requirements:
- The model must assign probabilities such that all probabilities sum to exactly 1.00
- No probability may be 0.00
- At least 25–30% of candidates must be non-typical but viable approaches
- The model should think critically about which solution is most likely to succeed

--------------------------------
D) SELECTION USING PROBABILITIES
--------------------------------
- Instruct the model to select the highest-probability candidate based on the probabilities it generated
- Instruct the model to also select ONE wildcard candidate (not the top one)
- Require the model to explain:
  - Why the top candidate wins based on its probability assessment
  - When the wildcard candidate might outperform despite lower probability

--------------------------------
E) BUILD / EXECUTION REQUIREMENTS
--------------------------------
- Convert the task into strict build constraints
- Specify:
  - Output format (single file, app, doc, etc.)
  - Tech / style preferences
  - UX / performance / quality rules
  - Accessibility + SEO if applicable
- Disallow unnecessary explanations or fluff

--------------------------------
F) OUTPUT FORMAT (STRICT)
--------------------------------
Specify exactly how the final output must be returned, e.g.:
- Lists first
- Then final output
- One code block
- Nothing after

========================
STYLE RULES
========================
- Be precise, not verbose
- Use confident, directive language
- Avoid marketing fluff unless explicitly requested
- Assume the model is capable — do not explain basics
- If the original prompt is weak, silently improve it
- NEVER ask follow-up questions unless the task is impossible without them

========================
FINAL INSTRUCTION
========================
Return ONLY the rewritten prompt.
Do NOT explain your reasoning.
Do NOT add commentary.`;

export const generateVerbalizedSamplingPrompt = async (rawPrompt: string): Promise<string> => {
  const ai = getAI();

  const fullPrompt = `${VERBALIZED_SAMPLING_PROMPT}

========================
USER INPUT
========================
${rawPrompt}`;

  try {
    const response = await ai.models.generateContent({
      model: FINAL_MODEL,
      contents: fullPrompt,
      config: {
        temperature: 0.7,
      },
    });

    return response.text || "Failed to generate verbalized sampling prompt.";
  } catch (error) {
    console.error("Error generating verbalized sampling prompt:", error);
    return "An error occurred while generating the verbalized sampling prompt. Please try again.";
  }
};