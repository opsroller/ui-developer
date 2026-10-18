// SPDX-License-Identifier: GPL-2.0-or-later
export const meta = {
  name: 'screen-audit',
  description: 'Audit existing screens in parallel across sizes, languages, inputs and accessibility settings, group findings by root cause (shared widgets and theme first), and update the UI reference and troubleshooting docs. Read-only on code. Use before a release or after a broad UI change. args: { screens: ["<screen>", ...], release: "<optional release or milestone name>" }',
  phases: [
    { title: 'Plan', detail: 'test matrix from the project profile; doc kinds affected (compass)' },
    { title: 'Audit', detail: 'one read-only agent per screen; each returns findings' },
    { title: 'Triage', detail: 'group by root cause; verdict: blocked if any blocker' },
    { title: 'Docs', detail: 'update the planned Diataxis pages (accessibility features reference, troubleshooting how-tos)' },
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

const USAGE = 'usage: screen-audit { screens: ["<screen>", ...], release: "<optional release name>" }'
if (!args || !Array.isArray(args.screens) || args.screens.length === 0) return USAGE
const screens = args.screens
const release = args.release || 'the next release'

const DOCS_FRAGMENT = 'Classify every user-visible change in this work with the Diataxis compass (action/cognition x study/work). For each, update or add exactly one page of that kind under the project docs/<kind>/ (location per the project profile), keep each page to one kind, start it with one line saying its kind and audience, title it by the project pattern (how-to-<goal>, about-<topic>, reference named for the thing), and link to the related pages of the other kinds. Report pages touched and any change you left undocumented and why.'

const PLAN = {
  type: 'object',
  properties: {
    matrix: { type: 'array', items: { type: 'string' } },
    docKinds: { type: 'array', items: { type: 'object', properties: { kind: { type: 'string', enum: ['tutorial', 'how-to', 'reference', 'explanation'] }, page: { type: 'string' }, why: { type: 'string' } }, required: ['kind', 'page', 'why'] } },
  },
  required: ['matrix', 'docKinds'],
}
const FINDINGS = { type: 'object', properties: { findings: { type: 'array', items: { type: 'object', properties: { severity: { type: 'string', enum: ['blocker', 'major', 'minor'] }, case: { type: 'string' }, problem: { type: 'string' }, guideline: { type: 'string' }, fix: { type: 'string' } }, required: ['severity', 'case', 'problem', 'fix'] } } }, required: ['findings'] }
const TRIAGE = { type: 'object', properties: { groups: { type: 'array', items: { type: 'object', properties: { rootCause: { type: 'string' }, sharedFix: { type: 'boolean' }, severity: { type: 'string' }, screens: { type: 'array', items: { type: 'string' } }, fix: { type: 'string' } }, required: ['rootCause', 'severity', 'fix'] } }, report: { type: 'string' } }, required: ['groups', 'report'] }
const DOCS = { type: 'object', properties: { pages: { type: 'array', items: { type: 'string' } }, undocumented: { type: 'array', items: { type: 'string' } } }, required: ['pages', 'undocumented'] }
const CHECK = { type: 'object', properties: { pass: { type: 'boolean' }, problems: { type: 'array', items: { type: 'string' } } }, required: ['pass', 'problems'] }

phase('Plan')
const plan = await agent(
  `You are the UI developer preparing a UI audit for ${release}. Follow the ui-developer ui-verification skill, section 1: from the project profile, build the test matrix (sizes, languages including the longest pseudo-locale, inputs, accessibility settings, data cases) as pairwise cases plus the known worst case. ` +
  'Then use the Diataxis compass to plan documentation an audit usually owes: the accessibility features reference (if features changed or were found undocumented), troubleshooting how-tos for problems players hit, the supported-envelope reference if it changed. Give page path and why. Do not edit files.',
  { schema: PLAN, phase: 'Plan', label: 'plan' })
if (!plan || !Array.isArray(plan.matrix) || plan.matrix.length === 0) return 'blocked: planning failed (no test matrix)'
const docKinds = Array.isArray(plan.docKinds) ? plan.docKinds : []

phase('Audit')
const audits = await pipeline(screens, (s) => agent(
  `Audit the "${s}" screen. Do NOT edit any file. Follow the ui-developer ui-verification skill section 2 per-screen pass, using the checklists in the responsive-layout, input-and-focus, localization and accessibility skills (and accessibility/thresholds.md). ` +
  'Cover these matrix cases:\n- ' + plan.matrix.join('\n- ') +
  '\nReturn one finding per problem: severity (blocker, major, minor per ui-verification section 5), the matrix case, the problem, the guideline or skill rule (e.g. "XAG 112", "GAG basic: colour alone", "WCAG 1.4.3"), and the concrete fix with file references.',
  { schema: FINDINGS, phase: 'Audit', label: s }))
const unverified = []
const all = []
audits.forEach((a, i) => {
  if (!a || !Array.isArray(a.findings)) unverified.push(screens[i])
  else a.findings.forEach((f) => all.push(Object.assign({ screen: screens[i] }, f)))
})
if (unverified.length) log('screens whose audit crashed (left unverified): ' + unverified.join(', '))

phase('Triage')
const triage = all.length ? await agent(
  'Group these UI audit findings by root cause. Put causes fixable once in a shared widget, the theme or the navigation owner first, then per-screen fixes. Keep the highest severity in each group. Write a short report for the PR or release notes.\n' + JSON.stringify(all),
  { schema: TRIAGE, phase: 'Triage', label: 'triage' }) : { groups: [], report: 'No findings.' }
if (!triage) return { status: 'unverified', reason: 'triage agent failed', findings: all, unverifiedScreens: unverified }
const groups = Array.isArray(triage.groups) ? triage.groups : []
const blockers = groups.filter((g) => g.severity === 'blocker')

phase('Docs')
const docs = await agent(
  `Update the project docs after the UI audit for ${release}. Planned pages:\n` +
  (docKinds.length ? docKinds.map((d) => `- ${d.kind}: ${d.page} (${d.why})`).join('\n') : '- (none planned; re-run the compass)') +
  '\nAudit findings, for context (findings themselves belong in the PR or release notes, not the docs):\n' + (triage.report || '') +
  '\n' + DOCS_FRAGMENT + ' Commit.',
  { schema: DOCS, phase: 'Docs', label: 'docs' })
if (!docs) return { status: 'blocked', reason: 'docs step failed', report: triage.report, groups }

phase('Docs check')
const check = await agent(
  `For each touched docs page (${(docs.pages || []).join(', ') || 'none reported'}): it holds one Diataxis kind only, starts with a line saying its kind and audience, its title follows the pattern, and it links to related pages of other kinds. Do not edit; report problems.`,
  { schema: CHECK, phase: 'Docs check', label: 'docs-check' })
const docsStatus = !check ? 'unverified' : (check.pass ? 'pass' : 'fail')

return {
  status: blockers.length ? 'blocked' : (unverified.length || docsStatus !== 'pass' ? 'incomplete' : 'pass'),
  blockers: blockers.map((g) => g.rootCause),
  groups,
  report: triage.report,
  unverifiedScreens: unverified,
  docs: docs.pages,
  docsCheck: docsStatus,
  docsProblems: check && !check.pass ? check.problems : [],
}
})(RUN.agent, RUN.phase, RUN.log)]); return RUN.finish(RUN_OUT)
