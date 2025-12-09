import { apiFetch } from './api';
import type { TopicMaterial } from '@/types';

const DEFAULT_SUPABASE_URL = 'https://ljxppmeunlfgqhuqxtfz.supabase.co';
const DEFAULT_SUPABASE_BUCKET = 'Nube2';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabaseBucket = process.env.NEXT_PUBLIC_SUPABASE_BUCKET || DEFAULT_SUPABASE_BUCKET;

const normalizeFilesArray = (files: any): any[] => {
  if (Array.isArray(files)) return files;
  if (files && typeof files === 'object') return Object.values(files);
  return [];
};

export const fetchTopicsList = async (path?: string): Promise<TopicMaterial[]> => {
  const query = path ? `?path=${encodeURIComponent(path)}` : '';
  const data = await apiFetch(`/materiales/list-topics${query}`);

  const filesArray = normalizeFilesArray(data?.files);

  return filesArray
    .map((file: any) => {
      if (typeof file === 'string') return { name: file };
      if (file?.name) {
        return {
          name: file.name,
          size: typeof file.size === 'number' ? file.size : undefined,
          updatedAt: file.updated_at || file.updatedAt,
          publicUrl: file.public_url || file.publicUrl,
        } satisfies TopicMaterial;
      }
      return null;
    })
    .filter(Boolean) as TopicMaterial[];
};

export const fetchTopicsWithContent = async (path?: string): Promise<Record<string, TopicMaterial>> => {
  const query = path ? `?path=${encodeURIComponent(path)}` : '';
  const data = await apiFetch(`/materiales/list-topics-with-content${query}`);

  const filesArray = normalizeFilesArray(data?.files);

  const topicsMap: Record<string, TopicMaterial> = {};

  filesArray.forEach((file: any) => {
    const name = typeof file === 'string' ? file : file?.name;
    if (!name) return;

    const content = typeof file?.content === 'string' ? file.content : '';
    const size = typeof file?.size === 'number' ? file.size : content ? content.length : undefined;

    topicsMap[name] = {
      name,
      content,
      size,
      updatedAt: file?.updated_at || file?.updatedAt,
      publicUrl: file?.public_url || file?.publicUrl,
    };
  });

  return topicsMap;
};

export const buildPublicUrl = (objectPath: string) => {
  const cleanPath = objectPath.replace(/^\/+/, '');
  return `${supabaseUrl}/storage/v1/object/public/${supabaseBucket}/${cleanPath}`;
};
