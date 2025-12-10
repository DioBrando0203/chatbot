import React, { useMemo, useRef, useState } from 'react';
import { apiFetch } from '@/lib/api';
import type { TopicMaterial } from '@/types';

interface MaterialsManagerProps {
  open: boolean;
  onClose: () => void;
  topics: TopicMaterial[];
  topicsLoading: boolean;
  onRefresh: () => void;
  onUpdated: () => Promise<void> | void;
  onDownload: (topicName: string) => void;
}

const ensureTxt = (name: string) => (name.toLowerCase().endsWith('.txt') ? name : `${name}.txt`);

const generateUniqueName = (baseName: string, existingNames: string[]): string => {
  const normalizedExisting = new Set(existingNames.map((n) => ensureTxt(n).toLowerCase()));
  let candidate = baseName || 'material';
  let finalName = ensureTxt(candidate);
  let counter = 1;

  while (normalizedExisting.has(finalName.toLowerCase()) && counter < 1000) {
    candidate = `${baseName} (${counter})`;
    finalName = ensureTxt(candidate);
    counter += 1;
  }

  return candidate;
};

export function MaterialsManager({
  open,
  onClose,
  topics,
  topicsLoading,
  onRefresh,
  onUpdated,
  onDownload,
}: MaterialsManagerProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const existingNames = useMemo(
    () => topics.map((t) => ensureTxt(t.name).toLowerCase()),
    [topics]
  );

  if (!open) return null;

  const handleClose = () => {
    setSelectedFile(null);
    setStatus(null);
    setIsUploading(false);
    setIsDeleting(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClose();
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      alert('Selecciona un archivo PDF, DOCX o TXT');
      return;
    }

    setIsUploading(true);
    setStatus(null);

    try {
      // 1) Extraer texto
      const extractFd = new FormData();
      extractFd.append('file', selectedFile);
      const extractRes: any = await apiFetch('/materiales/extract-text', {
        method: 'POST',
        body: extractFd,
      });

      if (!extractRes?.success || !extractRes?.text) {
        throw new Error(extractRes?.error || 'No se pudo extraer texto del archivo');
      }

      const baseName =
        selectedFile.name.replace(/\.[^/.]+$/, '').trim() || 'material';
      const uniqueBase = generateUniqueName(baseName, existingNames);
      const finalName = ensureTxt(uniqueBase);

      // 2) Crear TXT y subir
      const textBlob = new Blob([extractRes.text], { type: 'text/plain' });
      const txtFile = new File([textBlob], finalName, { type: 'text/plain' });

      const uploadFd = new FormData();
      uploadFd.append('file', txtFile);

      const uploadRes: any = await apiFetch('/materiales/upload', {
        method: 'POST',
        body: uploadFd,
      });

      if (!uploadRes?.success) {
        throw new Error(uploadRes?.error || 'No se pudo subir el archivo');
      }

      setStatus(`Archivo subido: ${finalName}`);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      await onUpdated();
    } catch (error: any) {
      console.error(error);
      setStatus(error?.message || 'Error al subir el archivo');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (name: string) => {
    if (!confirm(`¿Eliminar "${ensureTxt(name)}"?`)) return;

    setIsDeleting(name);
    setStatus(null);
    try {
      await apiFetch('/materiales/delete', {
        method: 'DELETE',
        body: JSON.stringify({ nombre: ensureTxt(name) }),
      });
      setStatus(`Archivo eliminado: ${ensureTxt(name)}`);
      await onUpdated();
    } catch (error: any) {
      console.error(error);
      setStatus(error?.message || 'No se pudo eliminar el archivo');
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-sm overflow-y-auto px-4 py-8">
      <div className="w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-start justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/70">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Gestor de materiales
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Sube nuevos archivos o elimina los existentes en el bucket.
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          >
            ✕
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-[1.1fr_1fr] px-6 py-6">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Subir archivo (PDF, DOCX o TXT)
            </h3>
            <form onSubmit={handleUpload} className="space-y-3">
              <input
                type="file"
                accept=".pdf,.docx,.txt"
                ref={fileInputRef}
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                className="w-full text-sm text-slate-700 dark:text-slate-100 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2"
              />
              <p className="text-xs text-slate-500 dark:text-slate-400">
                El backend extrae el texto y lo sube como .txt al bucket.
              </p>
              <button
                type="submit"
                disabled={isUploading || !selectedFile}
                className="w-full rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 disabled:opacity-60"
              >
                {isUploading ? 'Subiendo...' : 'Subir archivo'}
              </button>
            </form>
            {status && (
              <div className="text-sm text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800 rounded-lg px-3 py-2">
                {status}
              </div>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Archivos actuales ({topics.length})
              </h3>
              <button
                onClick={onRefresh}
                disabled={topicsLoading}
                className="text-xs px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 disabled:opacity-60 transition-colors"
              >
                {topicsLoading ? '...' : 'Refrescar'}
              </button>
            </div>
            <div className="border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950/40 max-h-[340px] overflow-y-auto transition-colors">
              {topicsLoading ? (
                <div className="p-4 text-sm text-slate-500 dark:text-slate-400">Cargando...</div>
              ) : topics.length === 0 ? (
                <div className="p-4 text-sm text-slate-500 dark:text-slate-400">No hay archivos.</div>
              ) : (
                <div className="divide-y divide-slate-200 dark:divide-slate-800">
                  {topics.map((topic) => (
                    <div key={topic.name} className="px-4 py-3 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                            {ensureTxt(topic.name)}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleDelete(topic.name)}
                            disabled={isDeleting === topic.name}
                            className="text-[11px] px-2 py-1 rounded bg-red-100 text-red-700 border border-red-200 hover:border-red-400 dark:bg-red-900/30 dark:text-red-200 dark:border-red-800 transition-colors disabled:opacity-60"
                          >
                            {isDeleting === topic.name ? 'Eliminando...' : 'Eliminar'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/70 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-indigo-400 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
