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
  // OpenAI
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o mini',
    provider: 'OpenAI',
    apiKeyEnv: 'OPENAI_API_KEY',
    endpoint: 'https://api.openai.com/v1/chat/completions',
    free: false,
    description: 'Rapido y economico',
  },
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'OpenAI',
    apiKeyEnv: 'OPENAI_API_KEY',
    endpoint: 'https://api.openai.com/v1/chat/completions',
    free: false,
    description: 'Mejor calidad',
  },

  // Groq (ultra rapido)
  {
    id: 'llama-3.3-70b-versatile',
    name: 'Llama 3.3 70B',
    provider: 'Groq',
    apiKeyEnv: 'GROQ_API_KEY',
    endpoint: 'https://api.groq.com/openai/v1/chat/completions',
    free: true,
    description: 'Responde al instante',
  },
  {
    id: 'llama-3.1-8b-instant',
    name: 'Llama 3.1 8B',
    provider: 'Groq',
    apiKeyEnv: 'GROQ_API_KEY',
    endpoint: 'https://api.groq.com/openai/v1/chat/completions',
    free: true,
    description: 'Muy veloz y ligero',
  },

  // DeepSeek (gratis)
  {
    id: 'deepseek-chat',
    name: 'DeepSeek Chat',
    provider: 'DeepSeek',
    apiKeyEnv: 'DEEPSEEK_API_KEY',
    endpoint: 'https://api.deepseek.com/v1/chat/completions',
    free: true,
    description: 'Chat rapido',
  },
  {
    id: 'deepseek-reasoner',
    name: 'DeepSeek Reasoner',
    provider: 'DeepSeek',
    apiKeyEnv: 'DEEPSEEK_API_KEY',
    endpoint: 'https://api.deepseek.com/v1/chat/completions',
    free: true,
    description: 'Ideal para razonar',
  },

  // Together AI
/*  {
    id: 'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo',
    name: 'Llama 3.1 70B (Together)',
    provider: 'Together AI',
    apiKeyEnv: 'TOGETHER_API_KEY',
    endpoint: 'https://api.together.xyz/v1/chat/completions',
    free: true,
    description: '$25 credito gratis',
  },
  {
    id: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
    name: 'Mixtral 8x7B (Together)',
    provider: 'Together AI',
    apiKeyEnv: 'TOGETHER_API_KEY',
    endpoint: 'https://api.together.xyz/v1/chat/completions',
    free: true,
    description: '$25 credito gratis',
  }, */

  // Hugging Face
/*  {
    id: 'meta-llama/Llama-3.2-3B-Instruct',
    name: 'Llama 3.2 3B',
    provider: 'Hugging Face',
    apiKeyEnv: 'HUGGINGFACE_API_KEY',
    endpoint: 'https://router.huggingface.co/models',
    free: true,
    description: 'Gratis - aprobado',
  },
  {
    id: 'Qwen/Qwen2.5-7B-Instruct',
    name: 'Qwen 2.5 7B',
    provider: 'Hugging Face',
    apiKeyEnv: 'HUGGINGFACE_API_KEY',
    endpoint: 'https://router.huggingface.co/models',
    free: true,
    description: 'Gratis - muy bueno',
  }, */
];

export const DEFAULT_MODEL_ID = 'gpt-4o-mini';

export function getModelById(id: string): AIModel | undefined {
  return AI_MODELS.find((model) => model.id === id);
}

export function getModelsByProvider(provider: string): AIModel[] {
  return AI_MODELS.filter((model) => model.provider === provider);
}
