/**
 * Central registry of all URL debug/dev parameters.
 * Parsed once at module load — use the exported object everywhere.
 *
 * ── Hash params ────────────────────────────────────────────────────────────
 *   #debug          Enable verbose logging (LogMng.MODE_DEBUG)
 *
 * ── GET params ─────────────────────────────────────────────────────────────
 *   ?sdkError       Simulate Yandex SDK init failure → shows error screen
 *   ?testParam=     Logged to console in BootScene (example param)
 */

const _search = new URLSearchParams(location.search);

export const DevParams = {
  debug:    location.hash === '#debug',
  sdkError: _search.has('sdkError'),
  testParam: _search.get('testParam'),
} as const;
