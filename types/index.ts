export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface TopicMaterial {
  name: string;
  size?: number;
  updatedAt?: string | Date;
  publicUrl?: string;
  content?: string;
}

export interface ContextMaterial {
  name: string;
  content: string;
}
