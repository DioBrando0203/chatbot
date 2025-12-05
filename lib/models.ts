export interface AIModel {
  id: string;
  name: string;
  provider: string;
  apiKeyEnv: string;
  endpoint?: string;
  free: boolean;
  description: string;
}

export const AI_MODELS: AIModel[] = [
  // Google Gemini
  {
    id: 'gemini-2.5-flash',
    name: 'Gemini 2.5 Flash',
    provider: 'Google',
    apiKeyEnv: 'GEMINI_API_KEY',
    free: true,
    description: '15 req/min - Rápido y eficiente',
  },
/*   {
    id: 'gemini-1.5-pro',
    name: 'Gemini 1.5 Pro',
    provider: 'Google',
    apiKeyEnv: 'GEMINI_API_KEY',
    free: true,
    description: '15 req/min - Más potente',
  }, */
  
  // Groq (Ultra rápido)
  {
    id: 'llama-3.3-70b-versatile',
    name: 'Llama 3.3 70B',
    provider: 'Groq',
    apiKeyEnv: 'GROQ_API_KEY',
    endpoint: 'https://api.groq.com/openai/v1/chat/completions',
    free: true,
    description: '30 req/min - Ultra rápido',
  }, 
  {
    id: 'llama-3.1-8b-instant',
    name: 'Llama 3.1 8B',
    provider: 'Groq',
    apiKeyEnv: 'GROQ_API_KEY',
    endpoint: 'https://api.groq.com/openai/v1/chat/completions',
    free: true,
    description: '30 req/min - Instantáneo',
  },

  
  // Together AI
/*   {
    id: 'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo',
    name: 'Llama 3.1 70B (Together)',
    provider: 'Together AI',
    apiKeyEnv: 'TOGETHER_API_KEY',
    endpoint: 'https://api.together.xyz/v1/chat/completions',
    free: true,
    description: '$25 crédito gratis',
  },
  {
    id: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
    name: 'Mixtral 8x7B (Together)',
    provider: 'Together AI',
    apiKeyEnv: 'TOGETHER_API_KEY',
    endpoint: 'https://api.together.xyz/v1/chat/completions',
    free: true,
    description: '$25 crédito gratis',
  }, */
  
  // Hugging Face
/*   {
    id: 'meta-llama/Llama-3.2-3B-Instruct',
    name: 'Llama 3.2 3B',
    provider: 'Hugging Face',
    apiKeyEnv: 'HUGGINGFACE_API_KEY',
    endpoint: 'https://router.huggingface.co/models',
    free: true,
    description: 'Gratis - Aprobado ✅',
  },
  {
    id: 'Qwen/Qwen2.5-7B-Instruct',
    name: 'Qwen 2.5 7B',
    provider: 'Hugging Face',
    apiKeyEnv: 'HUGGINGFACE_API_KEY',
    endpoint: 'https://router.huggingface.co/models',
    free: true,
    description: 'Gratis - Muy bueno',
  },
 */
  // DeepSeek (Gratis)
  {
    id: 'deepseek-chat',
    name: 'DeepSeek Chat',
    provider: 'DeepSeek',
    apiKeyEnv: 'DEEPSEEK_API_KEY',
    endpoint: 'https://api.deepseek.com/v1/chat/completions',
    free: true,
    description: 'Gratis - V3.2 ultra potente',
  },
  {
    id: 'deepseek-reasoner',
    name: 'DeepSeek Reasoner',
    provider: 'DeepSeek',
    apiKeyEnv: 'DEEPSEEK_API_KEY',
    endpoint: 'https://api.deepseek.com/v1/chat/completions',
    free: true,
    description: 'Gratis - Modo razonamiento',
  },

/*   // OpenAI (solo con crédito inicial)
  {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    provider: 'OpenAI',
    apiKeyEnv: 'OPENAI_API_KEY',
    endpoint: 'https://api.openai.com/v1/chat/completions',
    free: false,
    description: '$5 crédito inicial',
  }, */
];

export const DEFAULT_MODEL_ID = 'gemini-2.5-flash';

export function getModelById(id: string): AIModel | undefined {
  return AI_MODELS.find((model) => model.id === id);
}

export function getModelsByProvider(provider: string): AIModel[] {
  return AI_MODELS.filter((model) => model.provider === provider);
}
