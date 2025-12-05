'use client';

import { Select } from '@/components/ui/select';
import { AI_MODELS, DEFAULT_MODEL_ID } from '@/lib/models';

interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (modelId: string) => void;
}

export function ModelSelector({
  selectedModel = DEFAULT_MODEL_ID,
  onModelChange,
}: ModelSelectorProps) {
  const currentModel = AI_MODELS.find(m => m.id === selectedModel);

  // Agrupar modelos por proveedor
  const modelsByProvider = AI_MODELS.reduce((acc, model) => {
    if (!acc[model.provider]) {
      acc[model.provider] = [];
    }
    acc[model.provider].push(model);
    return acc;
  }, {} as Record<string, typeof AI_MODELS>);

  return (
    <div className="flex items-center gap-3 w-full">
      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        <span className="text-sm font-medium hidden sm:inline">Modelo:</span>
      </div>
      <div className="flex-1">
        <Select
          value={selectedModel}
          onChange={(e) => onModelChange(e.target.value)}
          className="w-full"
        >
          {Object.entries(modelsByProvider).map(([provider, models]) => (
            <optgroup key={provider} label={provider}>
              {models.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name} {model.free && '(Gratis)'} - {model.description}
                </option>
              ))}
            </optgroup>
          ))}
        </Select>
      </div>

    </div>
  );
}
