import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ChatInputProps {
  input: string;
  isLoading: boolean;
  onInputChange: (value: string) => void;
  onSubmit: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

export function ChatInput({
  input,
  isLoading,
  onInputChange,
  onSubmit,
  onKeyDown,
}: ChatInputProps) {
  return (
    <div className="border-t p-4">
      <div className="flex space-x-2">
        <Input
          type="text"
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Escribe tu mensaje aquí..."
          disabled={isLoading}
        />
        <Button
          onClick={onSubmit}
          disabled={isLoading || !input.trim()}
        >
          {isLoading ? 'Enviando...' : 'Enviar'}
        </Button>
      </div>
    </div>
  );
}
