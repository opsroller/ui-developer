*Tutorial, for someone using the ui-developer role for the first time. It walks one fixed path from a design to a merged-ready screen.*

# Build your first screen with the ui-developer role

In this tutorial we will build a small **pause dialog** (title, "Resume",
"Settings", "Quit to menu" with a confirm step) from its visual design,
using the ui-developer agent and its `implement-screen` workflow. At the
end you will have the dialog working with touch, mouse, keyboard and
controller, localisable, checked for accessibility, and documented.

You need: a project that has a `CLAUDE.md` and project profile, the
`engineering-practices` and `ui-developer` plugins installed, and a
visual design for the dialog from the graphic designer (a mockup file or
link). We will call it `designs/pause-dialog.png`; use your own path.

## Step 1: Start a branch

Ask Claude:

```
Create a branch feat/pause-dialog following engineering-practices.
```

The output should confirm the new branch. Notice that the branch name
follows Conventional Commits types; every later commit will too.

## Step 2: Let the role onboard

Ask Claude:

```
Use the ui-developer agent. Onboard to this project and tell me the UI
framework, supported inputs, supported languages, target sizes and the
docs location.
```

The agent loads `engineering-practices`, runs `project-onboarding`, and
answers with a short list. Notice the supported inputs and sizes: the
workflow will check exactly those.

## Step 3: Run the workflow

Ask Claude:

```
Run the ui-developer implement-screen workflow with
{ screen: "pause dialog", design: "designs/pause-dialog.png" }
```

The workflow shows six phases. After **Plan** the log reads something like:

```
14 states, 2 design gaps, 1 shared widgets, 2 doc pages planned
```

Notice the design gaps. A typical one is "focused state of the Quit
button not designed -> default: theme focus ring". These go to the
graphic designer later; the workflow builds the default meanwhile.

## Step 4: Watch the checks

During **Check**, five read-only agents look at the dialog in parallel:
layout, input and focus, localization, accessibility, and design
fidelity. During **Fix**, one agent applies everything they found.

Notice that "Quit to menu" opens a confirm modal whose default focus is
the safe option ("Cancel"). That comes from the `ui-architecture` rule
for destructive actions.

## Step 5: Read the result

The workflow ends with a summary like:

```
{ status: "done", states: 14, assumedForDesigner: [...], findingsFixed: 6,
  docs: ["docs/reference/ui/pause-dialog.md", "docs/how-to/how-to-add-a-screen.md"] }
```

Open the two docs pages. Notice that the reference page only describes
(view model fields, events, entry points) and the how-to only gives steps.

## Step 6: Try it yourself

Run the game, open the pause dialog and:

1. Navigate with the D-pad or arrow keys only. Focus is always visible.
2. Switch the language to the pseudo-locale. Every label is accented and
   bracketed, and nothing is clipped.
3. Turn on 200% text. The dialog grows; nothing is lost.

## What we built

We built a pause dialog from a design, on shared widgets, operable by every
supported input, ready for translation, checked against accessibility
minimums, with its reference and how-to pages in the same branch. Next,
see [How to implement a screen from a design](../how-to/how-to-implement-a-screen-from-a-design.md)
for the variations this tutorial skipped, and
[About the UI developer role](../explanation/about-the-role.md) for why
the role works this way.
