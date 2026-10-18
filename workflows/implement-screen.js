// SPDX-License-Identifier: GPL-2.0-or-later
export const meta = {
  name: 'implement-screen',
  description: 'Implement one in-app screen, dialog or HUD element from its visual design and flow spec: state inventory, build on shared widgets, parallel read-only checks for layout, input/focus, localization and accessibility, one fix pass, and its Diataxis docs in the same PR. Use for any new or substantially changed screen. args: { screen: "<screen name>", design: "<path or link to the visual design>", flow: "<optional path or section of the flow spec>" }',
  phases: [
    { title: 'Plan', detail: 'state inventory, design gaps, shared widgets needed, doc kinds affected (compass)' },
    { title: 'Build', detail: 'tokens and shared widgets first, then the screen, bound through a view model' },
    { title: 'Check', detail: 'parallel read-only checks: layout, input and focus, localization, accessibility' },
    { title: 'Fix', detail: 'one agent applies all findings, shared widgets first' },
    { title: 'Docs', detail: 'write or update the planned Diataxis pages in the same PR' },
    { title: 'Docs check', detail: 'each touched page holds one kind; titles and links follow the pattern' },
    { title: 'Handoff', detail: 'commit and push the screen, run the build and tests, return a handoff for engineering-practices deliver-package or land-pr' },
  ],
}

// --- run-modes v2 begin ---
const RUN = ((a, realAgent, realPhase, realLog) => {
  const opted = !!(a && typeof a === 'object' && a.run && typeof a.run === 'object')
  const c = opted ? a.run : {}
  const mode = c.mode === 'inline' ? 'inline' : 'agents'
  const results = c.results && typeof c.results === 'object' ? c.results : {}
  const reviewers = c.reviewers && typeof c.reviewers === 'object' ? c.reviewers : {}
  const only = Array.isArray(c.only) && c.only.length ? c.only.map(String) : null
  const from = c.from ? String(c.from) : null
  const titles = typeof meta !== 'undefined' && meta && Array.isArray(meta.phases) ? meta.phases.map((p) => p.title) : []
  const unknown = titles.length ? (from ? [from] : []).filter((t) => !titles.includes(t)) : []
  const error = c.mode && !['agents', 'inline'].includes(c.mode)
    ? `run.mode must be "agents" or "inline", got "${c.mode}"`
    : unknown.length ? `run.from names no phase: ${unknown.join(', ')}. Phases: ${titles.join(', ')}` : null
  const has = (o, k) => Object.prototype.hasOwnProperty.call(o, k)
  // An answer must carry every required key of its schema, as the runtime
  // enforces for agents; returns the missing keys, or null when it fits.
  const missing = (v, schema) => {
    if (v === null || v === undefined) return 'an answer'
    if (!schema || schema.type !== 'object') return null
    if (typeof v !== 'object' || Array.isArray(v)) return 'a JSON object'
    const gap = (schema.required || []).filter((k) => !has(v, k) || v[k] === undefined)
    return gap.length ? gap.join(', ') : null
  }
  const seen = {}
  const out = {}
  // Who answered each step marked independent: "subagent" when this run
  // spawned it, else the reviewer named in run.reviewers, else "self".
  const by = {}
  const who = (k) => (typeof reviewers[k] === 'string' && reviewers[k].trim() ? reviewers[k].trim() : 'self')
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
    const independent = op.independent === true
    const ph = op.phase || current
    const base = op.label || ph || 'agent'
    seen[base] = (seen[base] || 0) + 1
    const key = seen[base] > 1 ? `${base}#${seen[base]}` : base
    let note = null
    if (has(results, key)) {
      const gap = missing(results[key], op.schema)
      if (!gap) { out[key] = results[key]; if (independent) by[key] = who(key); return Promise.resolve(results[key]) }
      note = `answer missing ${gap}; answer this brief again`
    }
    if (!picked(ph, base)) { skipped.push(key); return Promise.resolve(null) }
    if (mode === 'agents') {
      const pass = Object.assign({}, op)
      delete pass.independent
      return realAgent(prompt, opts ? pass : opts).then((r) => {
        if (r !== null && r !== undefined) { out[key] = r; if (independent) by[key] = 'subagent' }
        return r
      })
    }
    const brief = { key, phase: ph, prompt, schema: op.schema || null }
    if (independent) brief.independent = true
    if (note) brief.note = note
    next.push(brief)
    if (!halting) {
      halting = true
      // Wait 200 microtask turns before pausing, so every sibling in a
      // parallel() or pipeline() fan-out queues its brief into this pause.
      ;(async () => { for (let i = 0; i < 200; i++) await null; release('__run_halted__') })()
    }
    return new Promise(() => {})
  }
  const phase = (t) => { current = t; if (from && t === from) reached = true; return realPhase(t) }
  const log = (m) => { logs.push(String(m)); return realLog(m) }
  const finish = (value) => {
    if (!opted) return value
    const self_reviewed = Object.keys(by).filter((k) => by[k] === 'self')
    if (value === '__run_halted__') {
      return {
        run: 'inline', status: 'next', next, results: out, reviewers: by, self_reviewed, skipped, logs,
        how: 'Do each brief in next, in order: follow its prompt in this session (it may tell you to edit files, commit or push), and shape your answer to its schema when one is given, with every required field. A brief marked independent reviews work this run produced, so do not answer it yourself: send its prompt to a reviewer with no part in the work (the project\'s code-reviewer role, a fresh session or a fresh subagent), use their answer, and name them in run.reviewers under its key; if you must answer it yourself, it is listed in self_reviewed and must be reported as self-reviewed. A brief with a note was answered before without the fields it names. Add each answer to results under its key, then run this workflow again with the same args, run.results set to the merged results and run.reviewers to the merged reviewers. Repeat until status is "done". To avoid pasting results back on every call, drive the run with engineering-practices tools/run-inline.mjs and a state file instead: it stores each answer and prints only the next briefs.',
      }
    }
    return { run: mode, status: 'done', result: value, results: out, reviewers: by, self_reviewed, skipped, logs }
  }
  return { agent, phase, log, finish, halted, error }
})(typeof args === 'undefined' ? undefined : args, agent, phase, log)
if (RUN.error) return RUN.error
const RUN_OUT = await Promise.race([RUN.halted, (async (agent, phase, log) => {
// --- run-modes v2 end (workflow body follows; close it with the tail line) ---

const USAGE = 'usage: implement-screen { screen: "<screen name>", design: "<path or link to the visual design>", flow: "<optional flow spec>" }'
if (!args || !args.screen || !args.design) return USAGE
const screen = args.screen
const design = args.design
const flow = args.flow || 'the flow spec the project profile names (ask the game designer if none exists)'

const DOCS_FRAGMENT = 'Classify every user-visible change in this work with the Diataxis compass (action/cognition x study/work). For each, update or add exactly one page of that kind under the project docs/<kind>/ (location per the project profile), keep each page to one kind, start it with one line saying its kind and audience, title it by the project pattern (how-to-<goal>, about-<topic>, reference named for the thing), and link to the related pages of the other kinds. Report pages touched and any change you left undocumented and why.'

const PLAN = {
  type: 'object',
  properties: {
    states: { type: 'array', items: { type: 'string' } },
    designGaps: { type: 'array', items: { type: 'string' } },
    sharedWidgets: { type: 'array', items: { type: 'string' } },
    docKinds: { type: 'array', items: { type: 'object', properties: { kind: { type: 'string', enum: ['tutorial', 'how-to', 'reference', 'explanation'] }, page: { type: 'string' }, why: { type: 'string' } }, required: ['kind', 'page', 'why'] } },
  },
  required: ['states', 'designGaps', 'sharedWidgets', 'docKinds'],
}
const BUILD = { type: 'object', properties: { done: { type: 'boolean' }, files: { type: 'array', items: { type: 'string' } }, notes: { type: 'string' } }, required: ['done', 'files'] }
const FINDINGS = { type: 'object', properties: { findings: { type: 'array', items: { type: 'object', properties: { severity: { type: 'string', enum: ['blocker', 'major', 'minor'] }, problem: { type: 'string' }, fix: { type: 'string' } }, required: ['severity', 'problem', 'fix'] } } }, required: ['findings'] }
const FIX = { type: 'object', properties: { open: { type: 'array', items: { type: 'string' } } }, required: ['open'] }
const DOCS = { type: 'object', properties: { pages: { type: 'array', items: { type: 'string' } }, undocumented: { type: 'array', items: { type: 'string' } } }, required: ['pages', 'undocumented'] }
const CHECK = { type: 'object', properties: { pass: { type: 'boolean' }, problems: { type: 'array', items: { type: 'string' } } }, required: ['pass', 'problems'] }

phase('Plan')
const plan = await agent(
  `You are the UI developer. Read the visual design at ${design} and ${flow} for the "${screen}" screen, and the project's contracts doc. ` +
  'Follow the ui-developer design-implementation skill, section 2: list every element and screen state (including focus, disabled, empty, error, long text, right-to-left, smallest size, 200% text, reduced motion) and mark each designed or missing. ' +
  'List design gaps as questions for the graphic designer or game designer, each with the default you will assume. List shared widgets or tokens to add or extend. ' +
  'Then plan documentation with the Diataxis compass: each doc kind this screen affects (new screen: reference for its view model, events and entry points; explanation if a design choice was made; how-to if someone must do something new), with page path and why. Do not edit files.',
  { schema: PLAN, phase: 'Plan', label: 'plan' })
if (!plan || !Array.isArray(plan.states) || plan.states.length === 0) return 'blocked: planning failed (no state inventory) for ' + screen
const gaps = Array.isArray(plan.designGaps) ? plan.designGaps : []
const widgets = Array.isArray(plan.sharedWidgets) ? plan.sharedWidgets : []
const docKinds = Array.isArray(plan.docKinds) ? plan.docKinds : []
log(`${plan.states.length} states, ${gaps.length} design gaps, ${widgets.length} shared widgets, ${docKinds.length} doc pages planned`)

phase('Build')
const build = await agent(
  `Build the "${screen}" screen following the ui-developer skills design-implementation (section 3 build order), ui-architecture, responsive-layout, input-and-focus, localization and accessibility, using the stack and paths in the project profile. ` +
  (widgets.length ? 'First add or extend these shared widgets/tokens:\n- ' + widgets.join('\n- ') + '\n' : '') +
  'Cover these states:\n- ' + plan.states.join('\n- ') +
  (gaps.length ? '\nImplement the stated default for each design gap and mark it "assumed" in a list for the PR:\n- ' + gaps.join('\n- ') : '') +
  '\nBind through a view model and the navigation owner; no game rules in UI code; every string in the string tables. Run the project\'s build and tests. Commit with Conventional Commits. Return done, the files you changed, and notes.',
  { schema: BUILD, phase: 'Build', label: 'build' })
if (!build || !build.done) return 'blocked: build did not complete for ' + screen + (build && build.notes ? ': ' + build.notes : '')
const files = Array.isArray(build.files) ? build.files : []

phase('Check')
const lenses = [
  { key: 'layout', text: 'responsive layout and safe areas: run the responsive-layout skill section 5 test matrix' },
  { key: 'input', text: 'input and focus: run the input-and-focus skill checklist for every input the project supports' },
  { key: 'localization', text: 'localization: run the localization skill checklist, including the longest pseudo-locale and right-to-left if in scope' },
  { key: 'accessibility', text: 'accessibility: run the accessibility skill audit method and accessibility/thresholds.md basic checklist' },
  { key: 'fidelity', text: 'design fidelity and state correctness: design-implementation section 5 and the ui-architecture screen lifecycle checklist, against ' + design },
]
const results = await parallel(lenses.map((l) => () => agent(
  `Check the new "${screen}" screen (files: ${files.join(', ') || 'see the latest commit'}) for ${l.text}. Do NOT edit any file. ` +
  'Return each real problem with severity (blocker, major, minor per the ui-verification skill), the problem, and the concrete fix (prefer shared widget or theme fixes). Return an empty list if you find nothing.',
  { schema: FINDINGS, phase: 'Check', label: 'check:' + l.key, independent: true })))
const unverified = []
const findings = []
results.forEach((r, i) => {
  if (!r || !Array.isArray(r.findings)) unverified.push(lenses[i].key)
  else r.findings.forEach((f) => findings.push(Object.assign({ lens: lenses[i].key }, f)))
})
if (unverified.length) log('check lenses that crashed (left unverified): ' + unverified.join(', '))

phase('Fix')
if (findings.length) {
  const fix = await agent(
    `Apply these findings to the "${screen}" screen in one pass. Fix shared widgets and theme first, then the screen. Re-run the project's build and tests and re-check each finding. Commit.\n\n` +
    findings.map((f, i) => `${i + 1}. [${f.severity}] (${f.lens}) ${f.problem} -> ${f.fix}`).join('\n') +
    '\nReturn the findings you could not fix (empty list if all fixed).',
    { schema: FIX, phase: 'Fix', label: 'fix' })
  if (!fix) return { status: 'blocked', reason: 'fix agent failed', open: findings.map((f) => f.problem) }
  if (Array.isArray(fix.open) && fix.open.length) return { status: 'blocked', open: fix.open, unverifiedLenses: unverified }
}

phase('Docs')
const docs = await agent(
  `Document the "${screen}" screen in the same PR. Planned pages:\n` +
  (docKinds.length ? docKinds.map((d) => `- ${d.kind}: ${d.page} (${d.why})`).join('\n') : '- (none planned; re-run the compass)') +
  '\n' + DOCS_FRAGMENT + ' If the screen adds accessibility settings, update the accessibility features reference. Commit.',
  { schema: DOCS, phase: 'Docs', label: 'docs' })
if (!docs) return { status: 'blocked', reason: 'docs step failed; a screen without its docs is not done' }

phase('Docs check')
const check = await agent(
  `Check the docs for the "${screen}" work. For each touched page (${(docs.pages || []).join(', ') || 'none reported'}): it holds one Diataxis kind only (no instructions in reference or explanation, no explanation beyond a clause in how-tos), starts with a line saying its kind and audience, its title follows the pattern, and it links to related pages of other kinds. Do not edit; report problems.`,
  { schema: CHECK, phase: 'Docs check', label: 'docs-check', independent: true })
if (!check) return { status: 'unverified', reason: 'docs check agent failed', docs: docs.pages, unverifiedLenses: unverified }
if (!check.pass) return { status: 'blocked', open: check.problems }

// The handoff is what engineering-practices deliver-package takes as
// prior, so the screen ships without being built again.
phase('Handoff')
const HANDOFF = { type: 'object', properties: { branch: { type: 'string' }, pr: { type: 'string' }, head_sha: { type: 'string' }, tests_pass: { type: 'boolean' }, problem: { type: 'string' } }, required: ['branch', 'tests_pass'] }
const hand = await agent(
  `Hand off the "${screen}" screen. If you are on the default branch, cut a Conventional branch (feat/<slug>) from the latest remote default branch; otherwise stay on the current feature branch. Commit every file this run wrote (the screen and shared widget files: ${files.join(', ') || 'see the build commits'}; the string tables; and the docs pages: ${(docs.pages || []).join(', ') || 'as written'}) as Conventional Commits, and push. Run the project's build, tests and the docs or link checks the project profile names on the pushed head. Do not open, mark ready or merge a PR: the engineering-practices workflow named in the result does that. Follow the engineering-practices git-workflow skill. Return the branch, any open PR, the head commit SHA, whether the checks pass on that head, and the problem if not.`,
  { schema: HANDOFF, phase: 'Handoff', label: 'handoff' })
if (!hand || !hand.branch) return { status: 'blocked', open: [hand && hand.problem ? hand.problem : 'handoff step returned nothing; the screen may be uncommitted or unpushed'] }
if (!hand.tests_pass) return { status: 'blocked', open: [`build or tests fail on ${hand.branch}${hand.head_sha ? ' at ' + hand.head_sha : ''}: ${hand.problem || 'no details'}`] }

return {
  status: unverified.length ? 'done-with-unverified-checks' : 'done',
  states: plan.states.length,
  assumedForDesigner: gaps,
  findingsFixed: findings.length,
  unverifiedLenses: unverified,
  docs: docs.pages,
  undocumented: docs.undocumented,
  handoff: {
    from: 'ui-developer:implement-screen',
    branch: hand.branch,
    pr: hand.pr || '',
    head_sha: hand.head_sha || '',
    tests_pass: true,
    docs: docs.pages || [],
    undocumented: docs.undocumented || [],
    notes: (gaps.length ? [`${gaps.length} design gap(s) implemented with assumed defaults; list them in the PR for the designer`] : [])
      .concat(unverified.length ? [`check lenses left unverified: ${unverified.join(', ')}`] : []),
  },
  next: 'ship it without rebuilding: /engineering-practices:deliver-package { wp: "<the package>", prior: <this result> }; with no work package, /engineering-practices:land-pr { branch: "<handoff.branch>" }',
}
})(RUN.agent, RUN.phase, RUN.log)]); return RUN.finish(RUN_OUT)
