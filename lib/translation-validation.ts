/** Reject missing copy and damaged interpolation before publishing a translation. */
export function validateTranslations(source: Record<string, string>, translated: Record<string, unknown>): translated is Record<string, string> {
  if (!translated || typeof translated !== 'object' || Array.isArray(translated)) return false
  return Object.entries(source).every(([key, value]) => {
    const output = translated[key]
    if (typeof output !== 'string' || (!output.trim() && value.trim())) return false
    const placeholders = (text: string) => (text.match(/\{\w+\}/g) ?? []).sort().join('|')
    return placeholders(value) === placeholders(output)
  })
}
