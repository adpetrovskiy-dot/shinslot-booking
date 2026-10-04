import { env } from 'cloudflare:workers';
import { json } from '@/lib/server';

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  if (!/^[0-9a-f-]{36}$/.test(id)) return json({ error: 'Фото не найдено' }, 404);
  if (!env.BUCKET) return json({ error: 'Хранилище недоступно' }, 503);
  const object = await env.BUCKET.get(`hero/${id}`);
  if (!object) return json({ error: 'Фото не найдено' }, 404);
  return new Response(object.body, {
    headers: {
      'Content-Type': object.httpMetadata?.contentType || 'image/jpeg',
      'Cache-Control': 'public, max-age=31536000, immutable',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
