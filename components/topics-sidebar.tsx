import type { TopicMaterial } from '@/types';
import React from 'react';

interface TopicsSidebarProps {
  topics: TopicMaterial[];
  topicsLoading: boolean;
  selectedTopicNames: string[];
  onToggleTopic: (topicName: string) => void;
  onRefresh: () => void;
  onClear: () => void;
  onDownload: (topicName: string) => void;
  onOpenManager: () => void;
}

const ensureTxt = (name: string) => (name.toLowerCase().endsWith('.txt') ? name : `${name}.txt`);

export function TopicsSidebar({
  topics,
  topicsLoading,
  selectedTopicNames,
  onToggleTopic,
  onRefresh,
  onClear,
  onDownload,
  onOpenManager,
}: TopicsSidebarProps) {
  return (
    <aside className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-lg h-fit md:sticky md:top-4 lg:top-6 space-y-4 transition-colors">
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">Temas del bucket</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Selecciona para dar contexto al chat. El contenido se carga al marcar.
          </p>
        </div>
        <button
          onClick={onRefresh}
          disabled={topicsLoading}
          className="text-xs px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 disabled:opacity-60 transition-colors"
        >
          {topicsLoading ? '...' : 'Refrescar'}
        </button>
      </div>

      <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
        <button
          onClick={onClear}
          className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 transition-colors"
        >
          Sin contexto
        </button>
        <span className="bg-indigo-100 text-indigo-800 dark:bg-indigo-500/20 dark:text-indigo-200 px-2 py-1 rounded-full">
          {selectedTopicNames.length} seleccionados
        </span>
      </div>

      <div className="border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950/40 max-h-[460px] overflow-y-auto transition-colors">
        {topicsLoading ? (
          <div className="p-4 text-sm text-slate-500 dark:text-slate-400">Cargando temas...</div>
        ) : topics.length === 0 ? (
          <div className="p-4 text-sm text-slate-500 dark:text-slate-400">No hay temas en el bucket.</div>
        ) : (
          <div className="divide-y divide-slate-200 dark:divide-slate-800">
            {topics.map((topic) => {
              const isActive = selectedTopicNames.includes(topic.name);
              return (
                <div
                  key={topic.name}
                  className={`flex items-start gap-3 px-4 py-3 transition-colors ${
                    isActive
                      ? 'bg-indigo-50 dark:bg-indigo-500/10 border-l-2 border-indigo-400'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-900/60'
                  }`}
                >
                  <input
                    type="checkbox"
                    className="mt-1 accent-indigo-600"
                    checked={isActive}
                    onChange={() => onToggleTopic(topic.name)}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold truncate text-slate-900 dark:text-slate-100">
                        {ensureTxt(topic.name)}
                      </span>
                      {topic.size ? (
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">
                          {(topic.size / 1024).toFixed(1)} KB
                        </span>
                      ) : null}
                    </div>
                    {topic.updatedAt && (
                      <p className="text-[11px] text-slate-500 dark:text-slate-500">
                        {new Date(topic.updatedAt).toLocaleDateString('es-ES')}
                      </p>
                    )}
                    <div className="mt-2 flex gap-2 flex-wrap">
                      <button
                        onClick={() => onDownload(topic.name)}
                        className="text-[11px] px-2 py-1 rounded bg-slate-100 text-slate-800 border border-slate-200 hover:border-indigo-400 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700 transition-colors"
                      >
                        Descargar
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 p-3 space-y-2 transition-colors">
        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Agregar o eliminar</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Para subir o borrar temas abre el gestor rápido.
        </p>
        <button
          onClick={onOpenManager}
          className="w-full px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold"
        >
          Abrir gestor
        </button>
      </div>
    </aside>
  );
}
