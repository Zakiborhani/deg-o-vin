// Dara IT portal CMS (format v2) — framework-free core.
// Plain TypeScript and fetch only, so the same file works in Next, Nuxt, Astro
// or plain Node; the framework-specific glue is a few lines around it.
// Spec: friendly-crm-enhancer/docs/cms-v2.md
//
// Values are plain data: render them as text, never as HTML.

export type CmsValue = string | number | boolean | null;
export type CmsRow = { _id?: string } & Record<string, CmsValue>;
export type CmsContent = { fields: Record<string, CmsValue>; lists: Record<string, CmsRow[]> };

export type CmsFieldType = "text" | "richtext" | "number" | "boolean" | "image" | "url";
export type CmsField = { key: string; type: CmsFieldType; label: string; page?: string; default?: CmsValue; required?: boolean };
export type CmsList = { key: string; label: string; page?: string; itemFields: readonly CmsField[]; default?: readonly CmsRow[] };
export type CmsManifest = { version: 2; fields: readonly CmsField[]; lists: readonly CmsList[] };

export const DEFAULT_PORTAL_URL = "https://portal-dara-it.com";

/** What the site publishes at /.well-known/dara-cms.json. */
export function manifestResponseBody(manifest: CmsManifest, customerId: string) {
  return { ...manifest, customerId };
}

/**
 * Fetches the customer's published content. Never throws: if the portal is
 * down, slow, or has no manifest yet, it returns empty content and the
 * manifest defaults are used, so the site looks exactly as before.
 * `init` passes framework options through (e.g. Next's `{ next: { revalidate: 60 } }`).
 */
export async function fetchCmsContent(
  opts: { customerId: string; portalUrl?: string; timeoutMs?: number },
  init: RequestInit & Record<string, unknown> = {},
): Promise<CmsContent> {
  const empty: CmsContent = { fields: {}, lists: {} };
  if (!opts.customerId) return empty;
  const url = `${opts.portalUrl ?? DEFAULT_PORTAL_URL}/api/public/cms/v2/${opts.customerId}`;
  try {
    const res = await fetch(url, { ...init, signal: AbortSignal.timeout(opts.timeoutMs ?? 4000) });
    if (!res.ok) return empty; // 404 before the first manifest
    const body = (await res.json()) as Partial<CmsContent>;
    return { fields: body.fields ?? {}, lists: body.lists ?? {} };
  } catch {
    return empty;
  }
}

/** Typed reader over fetched content with the manifest defaults as fallback. */
export function createCms<M extends CmsManifest>(manifest: M, content: CmsContent) {
  type FieldKey = M["fields"][number]["key"];
  type ListKey = M["lists"][number]["key"];
  const fieldDefaults = Object.fromEntries(manifest.fields.map((f) => [f.key, f.default ?? null]));
  const listDefaults = Object.fromEntries(manifest.lists.map((l) => [l.key, (l.default ?? []) as CmsRow[]]));

  /** A saved value wins, even when empty ("" hides optional things like links). */
  const field = (key: FieldKey): CmsValue => {
    const v = content.fields[key];
    return v !== undefined && v !== null ? v : (fieldDefaults[key] ?? null);
  };
  const list = (key: ListKey): CmsRow[] => {
    const rows = content.lists[key];
    return Array.isArray(rows) ? rows : (listDefaults[key] ?? []);
  };
  return { field, list, text: (key: FieldKey) => cmsText(field(key)) };
}

/** Value as trimmed text ('' for empty/missing). */
export function cmsText(v: CmsValue | undefined): string {
  return v == null ? "" : String(v).trim();
}

/** Image URL; the site's own absolute URLs (sent as defaults) become local paths again. */
export function cmsImage(v: CmsValue | undefined, siteOrigin: string): string {
  const url = cmsText(v);
  return url.startsWith(siteOrigin + "/") ? url.slice(siteOrigin.length) : url;
}

/** Richtext split into non-empty lines. */
export function cmsLines(v: CmsValue | undefined): string[] {
  return cmsText(v).split("\n").map((l) => l.trim()).filter(Boolean);
}

/** Richtext split into paragraphs on empty lines. */
export function cmsParagraphs(v: CmsValue | undefined): string[] {
  return cmsText(v).split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
}
