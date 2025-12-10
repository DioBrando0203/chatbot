'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import type { ContextMaterial, Message, TopicMaterial } from '@/types';
import { ChatMessage } from './chat-message';
import { ChatInput } from './chat-input';
import { ModelSelector } from './model-selector';
import { DEFAULT_MODEL_ID } from '@/lib/models';
import { LottieAnimation } from './lottie-animation';
import { TopicsSidebar } from './topics-sidebar';
import { MaterialsManager } from './materials-manager';
import { fetchTopicsList, fetchTopicsWithContent } from '@/lib/topics';

const ensureTxtExtension = (name: string) => (name.toLowerCase().endsWith('.txt') ? name : `${name}.txt`);

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState(DEFAULT_MODEL_ID);
  const [topics, setTopics] = useState<TopicMaterial[]>([]);
  const [topicsLoading, setTopicsLoading] = useState(false);
  const [topicsError, setTopicsError] = useState<string | null>(null);
  const [selectedTopicNames, setSelectedTopicNames] = useState<string[]>([]);
  const [topicsContent, setTopicsContent] = useState<Record<string, string>>({});
  const [isLoadingContent, setIsLoadingContent] = useState(false);
  const [isManagerOpen, setIsManagerOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const loadTopics = useCallback(async () => {
    setTopicsLoading(true);
    setTopicsError(null);
    try {
      const list = await fetchTopicsList();
      setTopics(list);
      setSelectedTopicNames((prev) => prev.filter((name) => list.some((topic) => topic.name === name)));
    } catch (error) {
      console.error('Error al cargar temas:', error);
      setTopicsError('No se pudieron cargar los temas del bucket.');
    } finally {
      setTopicsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTopics();
  }, [loadTopics]);

  const normalizeContentMap = (map: Record<string, any>): Record<string, string> => {
    const normalized: Record<string, string> = {};
    Object.entries(map || {}).forEach(([name, value]) => {
      if (!name) return;
      const contentValue =
        typeof value === 'string'
          ? value
          : typeof value?.content === 'string'
            ? value.content
            : '';
      normalized[name] = contentValue;
    });
    return normalized;
  };

  const loadSelectedContent = useCallback(
    async (force = false) => {
      const missing = force
        ? selectedTopicNames
        : selectedTopicNames.filter((name) => !topicsContent[name]);
      if (!missing.length) return topicsContent;

      setIsLoadingContent(true);
      setTopicsError(null);
      try {
        const contentMap = await fetchTopicsWithContent();
        const normalized = normalizeContentMap(contentMap);
        const merged = { ...topicsContent, ...normalized };
        setTopicsContent(merged);
        return merged;
      } catch (error) {
        console.error('Error al obtener contenido del tema:', error);
        setTopicsError('No se pudo cargar el contenido del tema seleccionado.');
        return topicsContent;
      } finally {
        setIsLoadingContent(false);
      }
    },
    [selectedTopicNames, topicsContent]
  );

  const handleToggleTopic = (topicName: string) => {
    const normalized = ensureTxtExtension(topicName);

    if (selectedTopicNames.includes(normalized)) {
      setSelectedTopicNames((prev) => prev.filter((name) => name !== normalized));
      return;
    }

    setSelectedTopicNames((prev) => [...prev, normalized]);
  };

  const handleClearTopics = () => {
    setSelectedTopicNames([]);
  };

  const handleDownloadTopic = async (topicName: string) => {
    const normalized = ensureTxtExtension(topicName);
    let source = topicsContent;
    if (!source[normalized]) {
      source = await loadSelectedContent(true);
    }
    const content = source[normalized];

    if (!content) {
      alert('No se pudo descargar el archivo seleccionado.');
      return;
    }

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = normalized;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const handleOpenManager = () => {
    setIsManagerOpen(true);
  };

  const contextMaterials: ContextMaterial[] = useMemo(
    () =>
      selectedTopicNames
        .map((name) => {
          const content = topicsContent[name];
          if (!content) return null;
          return { name, content };
        })
        .filter(Boolean) as ContextMaterial[],
    [selectedTopicNames, topicsContent]
  );

  const totalContextChars = useMemo(
    () => contextMaterials.reduce((acc, item) => acc + item.content.length, 0),
    [contextMaterials]
  );

  const sidebarTopics = useMemo(
    () =>
      topics.map((topic) => {
        const content = topicsContent[topic.name];
        const contentSize = typeof content === 'string' ? content.length : undefined;
        return {
          ...topic,
          size: contentSize ?? topic.size,
          content: typeof content === 'string' ? content : topic.content,
        };
      }),
    [topics, topicsContent]
  );

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    if (isLoadingContent) {
      alert('Espera a que termine de cargar el contenido seleccionado.');
      return;
    }

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      let contextSource = topicsContent;
      if (selectedTopicNames.some((name) => !topicsContent[name])) {
        contextSource = await loadSelectedContent();
      }

      const messageContext: ContextMaterial[] = selectedTopicNames
        .map((name) => {
          const content = contextSource[name];
          if (!content) return null;
          return { name, content };
        })
        .filter(Boolean) as ContextMaterial[];

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          history: messages,
          modelId: selectedModel,
          context: messageContext,
        }),
      });

      const data = await response.json();

      if (data.success) {
        const assistantMessage: Message = {
          role: 'assistant',
          content: data.response,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        throw new Error(data.error || 'Error al obtener respuesta');
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content:
          'Lo siento, hubo un error al procesar tu mensaje. Por favor intenta de nuevo.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-6 lg:py-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-[320px_minmax(0,1fr)] xl:grid-cols-[360px_minmax(0,1fr)] gap-6 items-start">
          <div className="space-y-4">
            <TopicsSidebar
              topics={sidebarTopics}
              topicsLoading={topicsLoading}
              selectedTopicNames={selectedTopicNames}
              onToggleTopic={handleToggleTopic}
              onRefresh={loadTopics}
              onClear={handleClearTopics}
              onDownload={handleDownloadTopic}
              onOpenManager={handleOpenManager}
            />
          </div>

          <div className="flex flex-col gap-4 min-h-[70vh]">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-3">
              <ModelSelector selectedModel={selectedModel} onModelChange={setSelectedModel} />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Selecciona uno de los modelos de IA disponibles.
              </p>
            </div>

            {(contextMaterials.length > 0 || isLoadingContent) && (
              <div className="rounded-lg border border-indigo-200 dark:border-indigo-900 bg-indigo-50/80 dark:bg-indigo-950/40 p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-indigo-900 dark:text-indigo-100">
                      Contexto del Tema
                    </p>
                    <p className="text-xs text-indigo-800/80 dark:text-indigo-200/80">
                      {isLoadingContent
                        ? 'Cargando contenido seleccionado...'
                        : `${totalContextChars.toLocaleString('es-ES')} caracteres listos de ${contextMaterials.length} tema(s)`}
                    </p>
                  </div>
                  <button
                    onClick={handleClearTopics}
                    className="text-xs px-3 py-1 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60"
                  >
                    Limpiar
                  </button>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {contextMaterials.map((item) => (
                    <span
                      key={item.name}
                      className="text-[11px] px-2 py-1 rounded-full bg-white/70 dark:bg-indigo-900/80 text-indigo-900 dark:text-indigo-100 border border-indigo-200 dark:border-indigo-800"
                    >
                      {ensureTxtExtension(item.name)} · {item.content.length.toLocaleString('es-ES')} caracteres
                    </span>
                  ))}
                </div>
                {selectedTopicNames.length > 0 && contextMaterials.length === 0 && !isLoadingContent && (
                  <div className="mt-3 flex flex-wrap gap-2 items-center">
                    <p className="text-xs text-indigo-800/80 dark:text-indigo-200/80">
                      El contenido se cargará al enviar tu siguiente mensaje.
                    </p>
                    <button
                      onClick={() => loadSelectedContent(true)}
                      disabled={isLoadingContent}
                      className="text-[11px] px-3 py-1 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60"
                    >
                      Cargar ahora
                    </button>
                  </div>
                )}
              </div>
            )}

            <div className="flex-1 min-h-0 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
              <div className="h-full overflow-y-auto px-4 sm:px-6 py-6 flex flex-col gap-6 scroll-smooth">
                {messages.length === 0 && (
                  <div className="text-center text-gray-500 dark:text-gray-400 mt-6 sm:mt-10">
                    <div className="flex justify-center mb-4">
                      <LottieAnimation
                        src="/animations/animation.lottie"
                        width={200}
                        height={200}
                        loop={true}
                        autoplay={true}
                      />
                    </div>
                    <p className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                      ¡Hola! ¿En qué puedo ayudarte hoy?
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Selecciona uno o más temas del Curso de CTA "una sola vez, es opcional" para poder ayudarte.
                    </p>
                  </div>
                )}

                {messages.map((message, index) => (
                  <ChatMessage key={index} message={message} />
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl px-4 py-3">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-indigo-500 dark:bg-indigo-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-indigo-500 dark:bg-indigo-400 rounded-full animate-bounce delay-100"></div>
                        <div className="w-2 h-2 bg-indigo-500 dark:bg-indigo-400 rounded-full animate-bounce delay-200"></div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>

            <ChatInput
              input={input}
              isLoading={isLoading}
              onInputChange={setInput}
              onSubmit={sendMessage}
              onKeyDown={handleKeyDown}
            />

            {topicsError && (
              <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-3">
                {topicsError}
              </div>
            )}
          </div>
        </div>
      </div>
      <MaterialsManager
        open={isManagerOpen}
        onClose={() => setIsManagerOpen(false)}
        topics={topics}
        topicsLoading={topicsLoading}
        onRefresh={loadTopics}
        onUpdated={loadTopics}
        onDownload={handleDownloadTopic}
      />
    </div>
  );
}
