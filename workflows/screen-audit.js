export const meta = {
  name: 'screen-audit',
  description: 'Audit every screen in parallel for layout, navigation, localisation and accessibility',
  whenToUse: 'Before release or after a UI change. args: { screens: ["<screen>", ...] }',
  phases: [{ title: 'Audit', detail: 'one agent per screen' }, { title: 'Summary', detail: 'shared fixes first' }],
}
const screens = (args && args.screens) || []
if (!screens.length) return 'Pass args.screens: the list of screens to audit.'
const R = { type: 'object', properties: { screen: { type: 'string' }, problems: { type: 'array', items: { type: 'string' } } }, required: ['screen', 'problems'] }
const res = await pipeline(screens, s => agent(`Audit the "${s}" screen against the ui-developer ui-architecture and localization-accessibility skills: layout at the smallest portrait and largest landscape targets, focus navigation by keyboard and gamepad, every string localisable, colour never the only signal, touch target sizes, binding only to contract events. Return concrete problems with file references.`, { schema: R, phase: 'Audit', label: s }))
phase('Summary')
return await agent(`Group these problems, putting fixes that belong in shared widgets or the theme first:\n${JSON.stringify(res.filter(Boolean))}`, { label: 'summary' })
