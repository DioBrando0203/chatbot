import { Message } from '@/types';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div
      className={cn(
        'group w-full',
        isUser ? 'bg-transparent' : 'bg-gray-50 dark:bg-gray-800/50'
      )}
    >
      <div className="max-w-3xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-5 md:py-6 flex gap-2 sm:gap-3 md:gap-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {isUser ? (
            <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full bg-indigo-600 text-white dark:bg-indigo-500 flex items-center justify-center font-medium text-xs sm:text-sm shadow-sm">
              U
            </div>
          ) : (
            <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 dark:from-indigo-500 dark:to-indigo-700 flex items-center justify-center p-1 sm:p-1.5 shadow-md">
              <img
                src="/icons/robot.svg"
                alt="Robot Assistant"
                className="w-full h-full"
              />
            </div>
          )}
        </div>

        {/* Message content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
            <span className="font-semibold text-xs sm:text-sm text-gray-900 dark:text-gray-100">
              {isUser ? 'Tú' : 'Asistente'}
            </span>
            <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
              {message.timestamp.toLocaleTimeString('es-ES', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p className="text-sm sm:text-base text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">
              {message.content}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
