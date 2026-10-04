import { env } from 'cloudflare:workers';
import { defaultConfig, type Config } from './shinslot';

export const tenantSlug = 'demo';
export function database() { if (!env.DB) throw new Error('DB binding missing'); return env.DB; }
export async function tenant() {
  const row = await database().prepare('SELECT * FROM tenants WHERE slug = ?').bind(tenantSlug).first<{draft:string;published:string;owner_id:string|null}>();
  return row;
}
export async function config(published=true):Promise<Config> {
  const row = await tenant();
  return row ? JSON.parse(published ? row.published : row.draft) as Config : defaultConfig;
}
export function signedIn(request:Request) { return request.headers.get('oai-authenticated-user-id'); }
export async function admin(request:Request) {
  const id = signedIn(request); if (!id) return null;
  const row = await tenant();
  return row?.owner_id && row.owner_id !== id ? null : id;
}
export function json(data:unknown,status=200) { return Response.json(data,{status,headers:{'Cache-Control':'no-store'}}); }
export function validDate(s:string) { return /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(Date.parse(s)); }
export function localIso(date:string, time:string) { return new Date(`${date}T${time}:00+03:00`).toISOString(); }
export function timeMinutes(s:string) { const [h,m]=s.split(':').map(Number); return h*60+m; }
export function minutesTime(n:number) { return `${String(Math.floor(n/60)).padStart(2,'0')}:${String(n%60).padStart(2,'0')}`; }
