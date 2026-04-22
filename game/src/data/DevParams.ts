/**
 * Central registry of all URL debug/dev parameters.
 * Parsed once at module load — use the exported object everywhere.
 *
 * ── Hash params ────────────────────────────────────────────────────────────
 *   #debug          Enable verbose logging (LogMng.MODE_DEBUG)
 *
 * ── GET params ─────────────────────────────────────────────────────────────
 *   ?testParam=     Logged to console in BootScene (example param)
 */

const _search = new URLSearchParams(location.search);

export const DevParams = {
  debug:     location.hash === '#debug',
  testParam: _search.get('testParam'),
} as const;
