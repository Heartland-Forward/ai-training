# Design System Port Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Adopt Heartland Forward's shared design system on the ai-training site, so it looks like a sibling of cir-dashboard, hf-datacenter-citing-research, and skilled-workforce.

**Architecture:** Copy five plain-CSS files verbatim from cir-dashboard (the upstream origin), layer them in front of the existing `css/style.css`, and demote `style.css` to an app-specific layer consuming the incoming brand tokens. No class renames. No markup rewrites beyond `<link>` tags and a footer block.

**Tech Stack:** Plain CSS custom properties. No build step, no preprocessor, no framework. The incoming files use no `@import`, `@apply`, or nesting, so the target's no-build status is not an obstacle.

**Source of truth:** `docs/superpowers/specs/2026-07-14-design-system-port.md`. It is 998 lines and contains the exact file manifest (§2), the exact footer HTML and CSS (§3), the reconciliation reasoning (§4), and the per-stage verification (§7). **Read the section named in each task before starting that task.** Do not re-derive decisions it already made.

**Source files:** the three sibling repos are cloned and left in place at
`/private/tmp/claude-501/-Users-william-ai-training/2e4e6def-c4a7-4694-9bc9-b41607901776/scratchpad/style-research/{cir-dashboard,datacenter,skilled-workforce}`.
**cir-dashboard is authoritative.** Copy from it, not from the others. skilled-workforce is a fork that resolved tokens to literals and deleted the dark blocks; do not use it as a source.

## Global Constraints

- **Copy verbatim.** These files are shared across repos. Identical bytes are the point: they diff cleanly and upstream fixes port without reconciliation. `base.css` gets exactly ONE modification (a line-1 provenance comment) and nothing else.
- **KEEP the `.login-page` Clerk block in `base.css`.** Owner decision. It is inert here (no `.login-page` element exists) and keeping it means `base.css` stays byte-identical to both siblings. An earlier draft of the spec said drop it; that has been corrected in every location. Do not drop it.
- **Dark mode: copy the `[data-theme="dark"]` blocks verbatim, build NO toggle, ship light mode only.** Verified attribute-gated with zero `prefers-color-scheme`, so it is inert. Stage 6 verifies this and must not be skipped.
- **No class renames.** Zero collisions were verified between the repo's 23 classes and all five incoming files.
- **`js/header.js` is untouched.** Its basePath rewrite is load-bearing for GitHub Pages subdirectory hosting; three commits in history exist to fix exactly that.
- **CSS `<link>` paths must be RELATIVE** (`css/...` from root, `../css/...` from `pages/`). An absolute `/css/...` 404s in a Pages subdirectory.
- **Link order is load-bearing:** tokens → base → shared → footer → floating-nav → **style.css last**. `style.css` must win ties.
- No emojis. No em dashes (use colons, periods, commas, or parentheses). Comments above the line, never inline.
- Terminology: "rootEd advisor", never "career coach", never "rooted"/"ROOTED".

## Verification approach

No test framework, no build step; the deliverable is CSS. Verification is browser-based.

A server is ALREADY RUNNING at **http://localhost:5501** serving the repo root. Do not start another. Never use `file://`: `js/header.js` uses `fetch()` and fails on that protocol, so the nav silently vanishes.

Six pages must be checked at every stage: `index.html`, `pages/how-ai-works.html`, `pages/resources.html`, `pages/get-access.html`, `pages/prompts.html`, `pages/survey.html`.

**The check that catches the most likely class of bug, per spec §8 Risk 2:** DevTools Network on every page must show six CSS files, all 200, in the order above. A missing or misordered link fails *partially and quietly*, because there are no class collisions, and reads like a content bug.

---

## Task 1: Land the shared files, linked nowhere

Spec §2 (manifest), §2.2 (the one `base.css` modification), §7 stage 1.

**Files:**
- Create: `css/tokens.css`, `css/base.css`, `css/shared.css`, `css/footer.css`, `css/floating-nav.css`
- Modify: none

**Interfaces:**
- Consumes: the cir-dashboard clone.
- Produces: five CSS files that Task 3 links. Their filenames are fixed by that task.

- [ ] **Step 1: Copy all five from cir-dashboard verbatim**

Locate each in the cir-dashboard clone (spec §2 names the paths). Copy byte-for-byte. Do not reformat, do not reorder, do not "clean up". Keep the `.login-page` block in `base.css`.

- [ ] **Step 2: Add the provenance comment to `base.css` line 1**

The single permitted modification. Spec §2.2 gives the exact text. It records that the file is copied from cir-dashboard and must not be hand-edited, which is what stops the next reader from "fixing" it.

- [ ] **Step 3: Verify byte-identity against BOTH siblings**

```bash
cd /private/tmp/claude-501/-Users-william-ai-training/2e4e6def-c4a7-4694-9bc9-b41607901776/scratchpad/style-research
md5 cir-dashboard/<path>/tokens.css datacenter/web/src/styles/tokens.css /Users/william/ai-training/css/tokens.css
```
Run for all five. `tokens.css`, `shared.css`, `footer.css`, `floating-nav.css` must match cir-dashboard exactly. `base.css` differs by the line-1 comment only: verify with `diff` that this is the ONLY difference.

- [ ] **Step 4: Verify the site is pixel-identical**

Nothing links these files yet, so nothing should change. Load all six pages. They must look exactly as before. This is the safe checkpoint: if anything changed here, something is wrong with how the files landed.

- [ ] **Step 5: Commit**

```bash
git add css/tokens.css css/base.css css/shared.css css/footer.css css/floating-nav.css
git commit -m "feat: land shared HF design system files, unlinked

Copied verbatim from cir-dashboard, which is upstream of the CSS the
sibling apps share. base.css carries one added provenance comment; the
Clerk .login-page block is kept so the file stays byte-identical to
both siblings. Nothing links these yet, so the site is unchanged."
```

---

## Task 2: Delete the dead auth block from style.css

Spec §4.7. Verified unreferenced by a repo-wide grep.

**Files:**
- Modify: `css/style.css` (the "User Display (Cloudflare Access)" block, around lines 165-201)

**Interfaces:**
- Consumes: nothing.
- Produces: nothing.

Note this is the reverse of Task 1's Clerk decision, and the two are consistent rather than contradictory. The incoming Clerk block is kept because it is part of a shared upstream file that must stay byte-identical. This block is deleted because it is local dead code in a file we own, referenced by nothing.

- [ ] **Step 1: Confirm it is genuinely dead before deleting**

```bash
grep -rn "user-display\|user-avatar-fallback\|user-greeting" . --include=*.html --include=*.js --include=*.css
```
Expected: hits ONLY inside `css/style.css` itself. Any hit in an HTML or JS file means it is live: stop and report.

- [ ] **Step 2: Delete the block**

Remove the banner comment and all its rules. Delete nothing else.

- [ ] **Step 3: Verify pixel-identical**

Load all six pages. No visual change, because nothing referenced these rules.

- [ ] **Step 4: Commit**

```bash
git add css/style.css
git commit -m "refactor: remove dead Cloudflare Access styling

The site has no authentication. These selectors are referenced by no
HTML or JS in the repo, verified by grep."
```

---

## Task 3: Link the stylesheets on index.html only

Spec §4.2 (link order), §4.4a (the font change), §4.4b (background), §4.6 (the token alias bridge), §7 stage 3.

**This is the highest-risk task in the plan.** One page only, so the blast radius is one page.

**Files:**
- Modify: `index.html` (head), `css/style.css` (font, background, token aliases)

**Interfaces:**
- Consumes: the five files from Task 1.
- Produces: the exact `<link>` block Task 4 replicates on five more pages, and the `style.css` changes that make the port visible everywhere.

- [ ] **Step 1: Add the five link tags to `index.html`, BEFORE `css/style.css`**

Relative paths (`css/tokens.css`, not `/css/tokens.css`). Order: tokens, base, shared, footer, floating-nav, then the existing `style.css` last. Spec §4.2 has the exact block.

- [ ] **Step 2: Delete `font-family: Arial` from `body` in `css/style.css`**

Spec §4.4a. **This is the change that makes the whole port visible.** Until this line goes, Arial silently wins and nothing appears to happen. Deleting it lets `base.css`'s system font stack through.

Expect every page to reflow. Paragraphs may gain or lose a line. Nothing is broken when this happens: it is the port working, and it is precisely what "fonts copied directly over" means.

- [ ] **Step 3: Apply the background change and the token alias bridge**

Spec §4.4b and §4.6. Re-point `--hf-navy` and `--hf-green` at `var(--brand-navy)` and `var(--brand-emerald)`.

Order matters: the aliases only resolve once `tokens.css` is linked, which Step 1 just did on this page. If `tokens.css` were missing, navy elements would render with NO colour rather than the wrong colour, which is a distinctive signature worth remembering.

- [ ] **Step 4: Verify, and check the cascade explicitly**

- DevTools Network: six CSS files, all 200, in order.
- DevTools Computed on a `<p>`: `font-family` starts with `system-ui`.
- Header logo area and nav links still navy. `.doc-card` borders still grey.
- Cards, grid, header layout unchanged.
- Screenshot `index.html`. Task 4 diffs against it.

- [ ] **Step 5: Commit**

```bash
git add index.html css/style.css
git commit -m "feat: link design system on index.html, switch to system fonts

Deleting body font-family: Arial is what makes the port visible: until
it goes, Arial wins the cascade and the tokens have no effect. Every
page reflows to the system stack as a result. style.css loads last and
keeps its .title-section typography."
```

---

## Task 4: Roll the links out to the remaining five pages

Spec §7 stage 4.

**Files:**
- Modify: `pages/how-ai-works.html`, `pages/resources.html`, `pages/get-access.html`, `pages/prompts.html`, `pages/survey.html`

**Interfaces:**
- Consumes: the link block from Task 3, with `../css/` paths instead of `css/`.
- Produces: six consistently-styled pages for Task 5's footer.

- [ ] **Step 1: Add the same six-link block to each of the five pages**

`../css/` paths, since these live in `pages/`. Same order. `style.css` last.

- [ ] **Step 2: Verify every page, and check the two that are most exposed**

- **`how-ai-works.html` hardest.** It is by far the longest and most prose-dense page, so it is the most exposed to `base.css`'s `*` reset. Read it top to bottom.
- **`resources.html` tables.** Resize below 768px and confirm the `data-label` card reflow still works. That mechanism is `css/style.css:448` using `content: attr(data-label)`, and it must survive.
- Click a `.collapsible-header` on `how-ai-works.html`: it must still toggle. `js/collapsible.js` is untouched, so it should.
- DevTools Network on EVERY page: six files, 200, in order.
- `prompts.html` and `survey.html` are the controls. They have no new content, so any change there is purely the port.

- [ ] **Step 3: Commit**

```bash
git add pages/
git commit -m "feat: link design system on remaining five pages"
```

---

## Task 5: Add the footer

Spec §3.1 (exact HTML), §3.2 (exact CSS), §3.3 (the sticky-footer problem), §7 stage 5.

The site has NO footer: they were deliberately removed in commit `51e000c`. This restores one, copied from the siblings.

**Files:**
- Modify: all six pages (footer block before `</body>`), `css/style.css` (three `body` flex declarations)

**Interfaces:**
- Consumes: `css/footer.css` from Task 1, linked by Tasks 3 and 4.
- Produces: nothing.

- [ ] **Step 1: Paste the footer block before `</body>` on all six pages**

Spec §3.1 has the exact HTML. The mailto is `wtrolinger@heartlandforward.org,crews@heartlandforward.org` with subject `AI%20Training%20Inquiry`. The recipients come across verbatim from cir-dashboard; only the subject is ours.

- [ ] **Step 2: Add the three flex declarations to `body`**

Spec §3.3. **Read that section before doing this.** Without it, the footer floats mid-page on short pages like `index.html` instead of sitting at the viewport bottom.

- [ ] **Step 3: Verify**

- Navy-gradient footer at the bottom of every page. Emerald pill "Contact Us".
- On `index.html`, the shortest page, the footer must sit at the **viewport bottom**, not mid-page. This is the check that catches a missed Step 2.
- Scroll `how-ai-works.html`: the header must still stick. `.hf-header` is `position: sticky` and is now a flex child; verify it did not break.
- Below 480px: the footer legal row stacks vertically and the `|` separators disappear.
- Click "Contact Us": the mail client opens with both recipients and the subject.

- [ ] **Step 4: Commit**

```bash
git add pages/ index.html css/style.css
git commit -m "feat: add shared HF footer to all pages

Restores a footer, removed in 51e000c, using the siblings' verbatim
markup and CSS. Only the mailto subject differs per app. body becomes
a flex column so the footer sits at the viewport bottom on short pages."
```

---

## Task 6: Dark-mode safety check

Spec §6.3, §7 stage 6. **Do not skip this.**

**Files:** none, unless it fails.

The incoming tokens carry a full dark-mode block. It is supposed to be inert because every dark rule is `[data-theme="dark"]` attribute-gated and nothing sets that attribute. This task proves it.

- [ ] **Step 1: Emulate dark mode and confirm the site stays light**

DevTools → Rendering → "Emulate prefers-color-scheme: dark". Hard-reload every page.

**Expected: the site still renders light.** White cards, `#f5f5f5` page, navy-gradient footer.

- [ ] **Step 2: Confirm no `data-theme` attribute exists**

DevTools → Elements: `<html>` must have NO `data-theme` attribute. Also:

```bash
grep -rn "prefers-color-scheme\|color-scheme\|data-theme" css/ js/ *.html pages/
```
Every `data-theme` hit must be a selector inside the copied CSS. Zero `prefers-color-scheme` hits outside a copied file.

- [ ] **Step 3: If ANY surface goes dark, stop**

Something is media-gated that the research did not find. Do not ship. Report which file and selector, and what changed.

- [ ] **Step 4: Report the result**

No commit unless a fix was needed.

---

## Task 7: Final review

- [ ] **Step 1: Full-site pass against the stage-1 screenshots**

All six pages, desktop and 400px. The font change is expected and is not a regression. Look instead for: broken layout, lost `.title-section` typography, tables that stopped reflowing, collapsibles that stopped toggling, the header losing its sticky behavior.

- [ ] **Step 2: Confirm the cascade on every page**

DevTools Network: six CSS files, 200, in order, on all six pages. Per spec §8 Risk 2, this is the check that catches the quietest failure mode.

- [ ] **Step 3: Confirm byte-identity survived**

Re-run the md5 comparison from Task 1 Step 3. If any of the four verbatim files drifted during the port, something edited a file it should not have.

- [ ] **Step 4: Report, do not push**

The owner reviews locally before any PR. Summarize what changed visually, what to look at, and anything that surprised you.
