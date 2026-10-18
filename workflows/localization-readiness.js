// SPDX-License-Identifier: GPL-2.0-or-later
export const meta = {
  name: 'localization-readiness',
  description: 'Make screens ready for translation: parallel read-only scans for hard-coded text, concatenation, plural and formatting misuse and layout breakage under pseudo-localization; one agent applies all string-table and code changes; a pseudo-locale re-check; and the i18n docs in the same PR. Use before adding a language or sending strings to translators. args: { screens: ["<screen>", ...], locales: ["<optional target locale>", ...] }',
  phases: [
    { title: 'Plan', detail: 'string conventions, pseudo-locale settings, target locale traits; doc kinds affected (compass)' },
    { title: 'Scan', detail: 'one read-only agent per screen; returns proposed keys and code changes' },
    { title: 'Apply', detail: 'one agent edits the string tables and code in a single pass' },
    { title: 'Verify', detail: 'pseudo-locale and target-locale re-check per screen, read-only' },
    { title: 'Docs', detail: 'string-key reference, how-to add a string or language' },
    { title: 'Docs check', detail: 'each touched page holds one kind' },
  ],
}

// --- run-modes v1 begin ---
const RUN = ((a, realAgent, realPhase, realLog) => {
  const opted = !!(a && typeof a === 'object' && a.run && typeof a.run === 'object')
  const c = opted ? a.run : {}
  const mode = c.mode === 'inline' ? 'inline' : 'agents'
  const results = c.results && typeof c.results === 'object' ? c.results : {}
  const only = Array.isArray(c.only) && c.only.length ? c.only.map(String) : null
  const from = c.from ? String(c.from) : null
  const titles = typeof meta !== 'undefined' && meta && Array.isArray(meta.phases) ? meta.phases.map((p) => p.title) : []
  const unknown = titles.length ? (from ? [from] : []).filter((t) => !titles.includes(t)) : []
  const error = c.mode && !['agents', 'inline'].includes(c.mode)
    ? `run.mode must be "agents" or "inline", got "${c.mode}"`
    : unknown.length ? `run.from names no phase: ${unknown.join(', ')}. Phases: ${titles.join(', ')}` : null
  const has = (o, k) => Object.prototype.hasOwnProperty.call(o, k)
  const seen = {}
  const out = {}
  const skipped = []
  const next = []
  const logs = []
  let current = ''
  let reached = !from
  let halting = false
  let release = () => {}
  const halted = new Promise((r) => { release = r })
  const picked = (ph, label) => reached && (!only || only.some((s) => s === ph || s === label || label.startsWith(s + ':')))
  const agent = (prompt, opts) => {
    const op = opts || {}
    const ph = op.phase || current
    const base = op.label || ph || 'agent'
    seen[base] = (seen[base] || 0) + 1
    const key = seen[base] > 1 ? `${base}#${seen[base]}` : base
    if (has(results, key)) { out[key] = results[key]; return Promise.resolve(results[key]) }
    if (!picked(ph, base)) { skipped.push(key); return Promise.resolve(null) }
    if (mode === 'agents') {
      return realAgent(prompt, opts).then((r) => { if (r !== null && r !== undefined) out[key] = r; return r })
    }
    next.push({ key, phase: ph, prompt, schema: op.schema || null })
    if (!halting) {
      halting = true
      ;(async () => { for (let i = 0; i < 200; i++) await null; release('__run_halted__') })()
    }
    return new Promise(() => {})
  }
  const phase = (t) => { current = t; if (from && t === from) reached = true; return realPhase(t) }
  const log = (m) => { logs.push(String(m)); return realLog(m) }
  const finish = (value) => {
    if (!opted) return value
    if (value === '__run_halted__') {
      return {
        run: 'inline', status: 'next', next, results: out, skipped, logs,
        how: 'Do each brief in next yourself, in order: follow its prompt in this session (it may tell you to edit files, commit or push), and shape your answer to its schema when one is given. Add each answer to results under its key, then run this workflow again with the same args and run.results set to the merged results. Repeat until status is "done".',
      }
    }
    return { run: mode, status: 'done', result: value, results: out, skipped, logs }
  }
  return { agent, phase, log, finish, halted, error }
})(typeof args === 'undefined' ? undefined : args, agent, phase, log)
if (RUN.error) return RUN.error
const RUN_OUT = await Promise.race([RUN.halted, (async (agent, phase, log) => {
// --- run-modes v1 end (workflow body follows; close it with the tail line) ---

const USAGE = 'usage: localization-readiness { screens: ["<screen>", ...], locales: ["<optional target locale>", ...] }'
if (!args || !Array.isArray(args.screens) || args.screens.length === 0) return USAGE
const screens = args.screens
const locales = Array.isArray(args.locales) && args.locales.length ? args.locales : []

const DOCS_FRAGMENT = 'Classify every user-visible change in this work with the Diataxis compass (action/cognition x study/work). For each, update or add exactly one page of that kind under the project docs/<kind>/ (location per the project profile), keep each page to one kind, start it with one line saying its kind and audience, title it by the project pattern (how-to-<goal>, about-<topic>, reference named for the thing), and link to the related pages of the other kinds. Report pages touched and any change you left undocumented and why.'

const PLAN = {
  type: 'object',
  properties: {
    conventions: { type: 'string' },
    localeTraits: { type: 'array', items: { type: 'string' } },
    docKinds: { type: 'array', items: { type: 'object', properties: { kind: { type: 'string', enum: ['tutorial', 'how-to', 'reference', 'explanation'] }, page: { type: 'string' }, why: { type: 'string' } }, required: ['kind', 'page', 'why'] } },
  },
  required: ['conventions', 'localeTraits', 'docKinds'],
}
const SCAN = {
  type: 'object',
  properties: {
    keys: { type: 'array', items: { type: 'object', properties: { key: { type: 'string' }, source: { type: 'string' }, context: { type: 'string' } }, required: ['key', 'source', 'context'] } },
    codeChanges: { type: 'array', items: { type: 'object', properties: { file: { type: 'string' }, change: { type: 'string' } }, required: ['file', 'change'] } },
    layoutIssues: { type: 'array', items: { type: 'string' } },
  },
  required: ['keys', 'codeChanges', 'layoutIssues'],
}
const APPLY = { type: 'object', properties: { done: { type: 'boolean' }, open: { type: 'array', items: { type: 'string' } } }, required: ['done', 'open'] }
const VERIFY = { type: 'object', properties: { problems: { type: 'array', items: { type: 'string' } } }, required: ['problems'] }
const DOCS = { type: 'object', properties: { pages: { type: 'array', items: { type: 'string' } }, undocumented: { type: 'array', items: { type: 'string' } } }, required: ['pages', 'undocumented'] }
const CHECK = { type: 'object', properties: { pass: { type: 'boolean' }, problems: { type: 'array', items: { type: 'string' } } }, required: ['pass', 'problems'] }

phase('Plan')
const plan = await agent(
  'You are the UI developer. Follow the ui-developer localization skill. From the project profile, state the string-table location, key naming convention, message format (ICU MessageFormat or the framework equivalent) and how to run a pseudo-locale. ' +
  (locales.length ? `For each target locale (${locales.join(', ')}) list the traits that affect UI: CLDR plural categories, script and direction, typical expansion, font coverage, number/date formats. ` : 'No target locales were given; list traits for the longest pseudo-locale and, if the profile names any right-to-left or CJK locale, for those. ') +
  'Then use the Diataxis compass to plan documentation: the string-key conventions and supported-locales reference; a how-to for adding a string or a language if none exists; an explanation if a library or format choice was made. Give page path and why. Do not edit files.',
  { schema: PLAN, phase: 'Plan', label: 'plan' })
if (!plan || !plan.conventions) return 'blocked: planning failed (no string conventions found)'
const traits = Array.isArray(plan.localeTraits) ? plan.localeTraits : []
const docKinds = Array.isArray(plan.docKinds) ? plan.docKinds : []

phase('Scan')
const scans = await pipeline(screens, (s) => agent(
  `Scan the "${s}" screen for internationalization problems. Do NOT edit any file. Conventions: ${plan.conventions}\nLocale traits:\n- ${traits.join('\n- ')}\n` +
  'Follow the localization skill sections 1-4: find hard-coded user text, concatenated sentences, positional placeholders, plural logic written as n == 1, hand-rolled number/date formatting, text in images, reused keys with different meanings, and layout that clips or overlaps under the longest pseudo-locale or breaks in right-to-left. ' +
  'Return: new or changed string keys (key, source text in ICU format, translator context); code changes per file, described precisely; and layout issues with the fix. Return only what this screen needs.',
  { schema: SCAN, phase: 'Scan', label: s }))
const unscanned = []
const keys = []
const changes = []
const layout = []
scans.forEach((r, i) => {
  if (!r) { unscanned.push(screens[i]); return }
  ;(r.keys || []).forEach((k) => keys.push(k))
  ;(r.codeChanges || []).forEach((c) => changes.push(Object.assign({ screen: screens[i] }, c)))
  ;(r.layoutIssues || []).forEach((l) => layout.push(screens[i] + ': ' + l))
})
if (unscanned.length) log('screens whose scan crashed (left unverified): ' + unscanned.join(', '))

phase('Apply')
if (keys.length || changes.length || layout.length) {
  const apply = await agent(
    'Apply these internationalization changes in one pass, following the ui-developer localization and responsive-layout skills. Add all string keys to the string tables in a single edit per table (dedupe identical keys; keep distinct keys where meanings differ). Then make the code and layout changes. Run the project build and tests. Commit with Conventional Commits.\n\n' +
    'String keys:\n' + JSON.stringify(keys) + '\n\nCode changes:\n' + JSON.stringify(changes) + '\n\nLayout issues:\n' + layout.join('\n') +
    '\nReturn done and anything you could not apply.',
    { schema: APPLY, phase: 'Apply', label: 'apply' })
  if (!apply) return { status: 'blocked', reason: 'apply agent failed', keys: keys.length, changes: changes.length, unscanned }
  if (!apply.done || (Array.isArray(apply.open) && apply.open.length)) return { status: 'blocked', open: apply.open || ['apply incomplete'], unscanned }
}

phase('Verify')
const verifies = await pipeline(screens, (s) => agent(
  `Re-check the "${s}" screen in the longest pseudo-locale${locales.length ? ' and in ' + locales.join(', ') : ''}, at the smallest supported window and 200% text. Do NOT edit files. Run the localization skill section 5 checklist. Return remaining problems (empty if clean).`,
  { schema: VERIFY, phase: 'Verify', label: 'verify:' + s }))
const remaining = []
const unverified = unscanned.slice()
verifies.forEach((v, i) => {
  if (!v || !Array.isArray(v.problems)) { if (unverified.indexOf(screens[i]) < 0) unverified.push(screens[i]) }
  else v.problems.forEach((p) => remaining.push(screens[i] + ': ' + p))
})
if (remaining.length) return { status: 'blocked', open: remaining, unverifiedScreens: unverified }

phase('Docs')
const docs = await agent(
  'Document the localization work in the same PR. Planned pages:\n' +
  (docKinds.length ? docKinds.map((d) => `- ${d.kind}: ${d.page} (${d.why})`).join('\n') : '- (none planned; re-run the compass)') +
  '\nTranslator context lives with the keys in the string tables; do not copy it into docs. ' + DOCS_FRAGMENT + ' Commit.',
  { schema: DOCS, phase: 'Docs', label: 'docs' })
if (!docs) return { status: 'blocked', reason: 'docs step failed; work without its docs is not done' }

phase('Docs check')
const check = await agent(
  `For each touched docs page (${(docs.pages || []).join(', ') || 'none reported'}): it holds one Diataxis kind only, starts with a line saying its kind and audience, its title follows the pattern, and it links to related pages of other kinds. Do not edit; report problems.`,
  { schema: CHECK, phase: 'Docs check', label: 'docs-check' })
if (!check) return { status: 'unverified', reason: 'docs check agent failed', docs: docs.pages, unverifiedScreens: unverified }
if (!check.pass) return { status: 'blocked', open: check.problems }

return {
  status: unverified.length ? 'done-with-unverified-screens' : 'done',
  keysAdded: keys.length,
  codeChanges: changes.length,
  layoutFixes: layout.length,
  unverifiedScreens: unverified,
  docs: docs.pages,
  undocumented: docs.undocumented,
}
})(RUN.agent, RUN.phase, RUN.log)]); return RUN.finish(RUN_OUT)
