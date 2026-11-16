# Heartland Forward Design System Port

> **SUPERSEDED APPROACH. Read this box before the rest of the document.**
>
> This spec describes the FIRST approach: copy the five shared CSS files in and
> layer them in front of `style.css` without changing the pages' markup. That
> approach shipped and failed. Because the pages used their own class names
> (`.doc-card`, `.content-section`, `.title-section`) and the shared files use
> the dashboard's (`.chart-card`, `.pillar-section`, `.summary-section`), the
> copied CSS matched almost nothing. The only visible change was the font, and
> the site still looked nothing like the dashboard.
>
> **What actually shipped instead:** the pages' markup was rewritten onto the
> dashboard's own class vocabulary, and every value was measured against the
> live dashboard rather than inferred from these files. Concretely:
> - Markup converted to `.pillar-section` / `.summary-section` / `.container` /
>   `.chart-card` / `.metrics-section` / `.section-header`, so the shared CSS
>   actually applies.
> - `style.css` cut to a ~450-line app layer doing only what the dashboard has
>   no equivalent for: the top header bar and prose/list/table styling.
> - Landing hero, centered section headers (navy 2rem, emerald description),
>   card geometry, collapsible chevron, and grey/white section bands with a
>   hairline break all matched to measured dashboard values.
> - `landing-page.css` and `executive-summary.css` were also brought over
>   (this spec's manifest omitted them).
> - Separately, the "Get Access" page was folded into Resources.
>
> The token-and-reconciliation analysis below (sections 1-6, the manifest, the
> dark-mode and nav findings) is still accurate and was the correct groundwork.
> The execution order in section 7 is not what happened. The real work is the
> commit range `8b9a649..cb28acf` on `add-claude-for-teachers`; read the code,
> not section 7, to see what the site does.

Date: 2026-07-14
Target: `/Users/william/ai-training` (static HTML, no build step, GitHub Pages)
Upstream: `cir-dashboard` (React 19 + TS + Vite)
Downstream precedents: `datacenter` (Vite + React), `skilled-workforce` (static HTML, no build)

Status: ready to execute.

---

## 0. How to read this document

Every claim below is marked as either **VERIFIED** (I read the bytes: md5, diff, or grep output)
or **INFERRED** (reasoning on top of verified facts). Where a supplied report disagrees with a
file, the file wins and the disagreement is called out explicitly in section 9.

Clone paths are abbreviated. Full prefix:
`/private/tmp/claude-501/-Users-william-ai-training/2e4e6def-c4a7-4694-9bc9-b41607901776/scratchpad/style-research/`

---

## 1. The shared system

### 1.1 What is genuinely common

The design system is five plain CSS files. **VERIFIED: none of them require a build step.**
No `@import` (except one line in CIR's `index.css`, discussed in 2.2), no `@tailwind`, no `@apply`,
no `@use`, no `@mixin`, no SCSS variables, no CSS nesting (`&`). They are vanilla CSS custom
properties and ordinary selectors, which every modern browser parses natively from a `<link>` tag.
**This is the single most important fact in this document**: the target's lack of a build step is
not an obstacle to adopting the system verbatim.

| File | Lines | cir-dashboard | datacenter | skilled-workforce |
|---|---|---|---|---|
| `tokens.css` | 564 | `src/styles/tokens.css` | `web/src/styles/tokens.css` | **absent** |
| `base.css` | 253 | `src/index.css` (253) | `web/src/styles/base.css` | `css/base.css` (212) |
| `shared.css` | 733 | `src/components/dashboard/shared.css` | `web/src/styles/shared.css` | `css/shared.css` (726) |
| `footer.css` | 92 | `src/components/dashboard/footer.css` | `web/src/styles/footer.css` | `css/footer.css` (81) |
| `floating-nav.css` | 406 | `src/components/navigation/floating-nav.css` | `web/src/styles/floating-nav.css` | **absent** |

**VERIFIED by md5.** cir-dashboard and datacenter are **byte-identical** on `tokens.css`
(`43102671916ba49545084fa1605572d4`), `shared.css` (`bebf4eed2746b31d2fcd7222a465684c`),
`footer.css` (`eb490856d0b610782273bbb87f243662`), and `floating-nav.css`
(`72c48209ac1cbb02123d9972295c1c79`). datacenter's README claim ("copied verbatim from the CIR
dashboard") is **true and checksum-confirmed**.

`tool.css` (425 lines, datacenter only) is **not** part of the shared system. It is datacenter's
app-specific layer (`dc-`, `tool-`, `est-` prefixes). Its analogue in the target is `css/style.css`.
This mapping drives the whole reconciliation plan in section 4.

### 1.2 Where they diverge, and who is authoritative

There is exactly one axis of divergence, and it runs cir+datacenter vs skilled-workforce.

**skilled-workforce is a fork, not a copy. VERIFIED.**

- It has **no `tokens.css`**. Instead `css/main.css` opens with its own hand-written `:root` block
  using a *different, private naming scheme*: `--navy`, `--navy-dark`, `--green`, `--green-light`,
  `--text`, `--border`, `--bg`, `--radius`, `--font`. These names exist nowhere in the upstream system.
- Every shared file it took was **token-resolved to literals**. `var(--brand-navy)` became `#243269`,
  `var(--bg-overlay-fade-85)` became `rgba(255, 255, 255, 0.85)`, and so on.
- The dark-mode blocks were **deleted** during that resolution.
- Cost, measured: `shared.css` diverges from upstream by **149 changed lines**; `footer.css` by 11
  lines (the dark block plus every token). It can no longer take an upstream change by copy.

**Authority ruling: cir-dashboard is authoritative on every divergence.** datacenter corroborates it
byte-for-byte. skilled-workforce is a lossy derivative and is authoritative on nothing.

This matters because the brief calls skilled-workforce "structurally the closest analogue to the
target," which is true, and it is tempting to therefore copy *its* files. **Do not.** Structurally
closest is not the same as authoritative. skilled-workforce resolved its tokens because it *chose*
to, not because a static site *requires* it — CSS custom properties need no build step (VERIFIED,
1.1). Following skilled-workforce would import its drift and start the target's life as a second
fork. Following cir-dashboard costs nothing extra and keeps three of four repos byte-identical.

### 1.3 The three footers, concretely

The brief asks how the three footers differ. **VERIFIED by diff:**

- **cir-dashboard vs datacenter: zero difference in CSS.** Same md5. The *markup* differs by exactly
  one string — the mailto `subject=` parameter (`Community%20Dashboard%20Inquiry` vs
  `Datacenter%20Impact%20Tool%20Inquiry`). Everything else — address, copyright, privacy/terms
  URLs, class names, separator pipes — is identical.
- **skilled-workforce vs cir-dashboard: 11 lines.** All of it is (a) the deleted 10-line
  `[data-theme="dark"] .dashboard-footer` block and (b) token references swapped for literals.
  **Zero design intent differs.** Same gradient, same padding (`26px 19px`), same font sizes
  (`0.76rem` / `0.68rem`), same pill radius (`16px`). skilled-workforce's markup differs from
  CIR's only in the mailto subject (`Skilled%20Trades%20Pathways%20Inquiry`) and `rel="noopener"`
  vs `rel="noopener noreferrer"`.

**Conclusion (INFERRED from the above): the footer is a fixed brand asset with exactly one
per-app variable — the mailto subject line.** That is the only thing the target gets to choose.

### 1.4 Brand facts, confirmed against files

All the brief's "established facts" check out. **VERIFIED:**

- Navy `#243269` (`--brand-navy`), navy-deep `#1a2451` (`--brand-navy-deep`), emerald `#019966`
  (`--brand-emerald`), emerald-bright `#10b981` (`--brand-emerald-bright`), emerald-bright-light
  `#34d399`.
- Footer gradient: `linear-gradient(135deg, var(--brand-navy) 0%, var(--brand-navy-deep) 100%)` —
  i.e. `#243269` to `#1a2451` at `135deg`. Confirmed.
- System font stack, no external font loading. **VERIFIED: zero `fonts.googleapis` / `@font-face`
  references in any of the five files.** The exact stack, repeated verbatim in `base.css`,
  `shared.css`, `footer.css`, and `floating-nav.css`:
  ```
  system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif
  ```
- `tokens.css` holds **382 custom property declarations** (I counted; the reference-pr-report says
  "~150" — see section 9).

---

## 2. Exact file manifest

Destination is `/Users/william/ai-training/`. All five incoming files land in `css/` alongside the
existing `style.css`.

### 2.1 `tokens.css` — COPY VERBATIM

- **Source:** `cir-dashboard/src/styles/tokens.css` (564 lines)
- **Destination:** `css/tokens.css`
- **Modifications:** none. Byte-for-byte.
- **Justification:** This is the root of the system; every other file consumes `var(--*)` from it.
  It is byte-identical in cir-dashboard and datacenter, so copying it verbatim makes the target the
  third identical holder. It is plain CSS and needs no build. Includes the `[data-theme="dark"]`
  block — **keep it**, see section 6.

### 2.2 `base.css` — COPY WITH ONE NAMED MODIFICATION

- **Source:** `datacenter/web/src/styles/base.css` (253 lines) — **not** CIR's file directly.
- **Destination:** `css/base.css`
- **Why datacenter is the right source here (VERIFIED):** CIR's copy lives at `src/index.css` and is
  **identical except for line 1**. CIR line 1 is `@import './styles/tokens.css';`; datacenter line 1
  is `/* tokens.css is imported ahead of this file in main.tsx. */`. That is the *entire* diff —
  2 lines changed, nothing else. datacenter already did the work of decoupling the file from an
  `@import`, which is what a `<link>`-based static site wants.
- **The one modification:** line 1's comment says "in main.tsx", which is false for us. Change it to:
  ```css
  /* tokens.css is linked ahead of this file in each page's <head>. */
  ```
  **This is a comment-only change. Zero CSS behaviour changes.** It is the only edit to any incoming
  file, and it is made *because* leaving a knowingly-false comment in place is worse than a
  one-line, semantically-null divergence.
- **Do not use `@import`** even though it would work without a build: `@import` is a serial,
  render-blocking fetch. Ordered `<link>` tags are strictly better and are what datacenter's
  structure already implies.
- **KEEP the Clerk/auth block.** Owner decision; see the rewritten 2.6. `base.css` ships byte-identical apart from the line-1 provenance comment.

### 2.3 `shared.css` — COPY VERBATIM

- **Source:** `cir-dashboard/src/components/dashboard/shared.css` (733 lines)
- **Destination:** `css/shared.css`
- **Modifications:** none.
- **Justification:** This is the file the governing rule was written for. It is 733 lines of
  dashboard component chrome (`.pillar-section`, `.metrics-section`, `.chart-card`,
  `.export-button`, `.favorite-button`, `.metric-item`, `.metrics-sidebar`, `.year-selector`) and
  **the target uses none of it today**. Per the rule — "Do not trim merely-unused-today component
  styles: that turns a shared asset into a private fork" — it goes in whole.
- **Safety, VERIFIED:** I extracted every class used across `index.html`, all six `pages/*.html`, and
  `components/header.html` (23 classes total) and checked each against all five incoming files.
  **There are zero class-name collisions.** `shared.css` cannot visually affect the target's current
  markup. It is completely inert until someone writes a `.metrics-section`.
- **Judgment call for the owner (flagged, not decided):** this ships ~15KB of currently-dead CSS to a
  5-page docs site. The governing rule says do it; the reference-pr-report says don't (section 9).
  I follow the rule. If the owner would rather optimise bytes than diffability, this file — and only
  this file — is the one to reconsider. That is a decision about priorities, not correctness.

### 2.4 `footer.css` — COPY VERBATIM

- **Source:** `cir-dashboard/src/components/dashboard/footer.css` (92 lines)
- **Destination:** `css/footer.css`
- **Modifications:** none. **Take the CIR/token version, not skilled-workforce's resolved version.**
  Because we are copying `tokens.css`, every `var()` in this file resolves. **VERIFIED:** I resolved
  all 14 tokens `footer.css` consumes against `tokens.css`'s `:root` — all 14 are present
  (`--brand-navy`, `--brand-navy-deep`, `--bg-overlay-fade-85/-70/-55/-25/-12`, `--bg-overlay-tooltip`,
  `--brand-emerald-bright`, `--brand-emerald-bright-light`, `--brand-emerald-bright-alpha-40/-15`,
  `--bg-page`, `--border-default`). Nothing dangles.
- **Justification:** Owner: "The footer should be copied directly." Verbatim from upstream is the
  most direct reading, and it keeps the target byte-identical with two of three siblings.

### 2.5 `floating-nav.css` — COPY VERBATIM, DO NOT WIRE UP

- **Source:** `cir-dashboard/src/components/navigation/floating-nav.css` (406 lines)
- **Destination:** `css/floating-nav.css`
- **Modifications:** none.
- **Justification:** It is one of the five files datacenter names as the shared core, so it is part
  of the system by the owner's own definition. It is **inert without markup** — it styles
  `.floating-nav`, `.nav-toggle`, `.nav-item`, `.nav-progress`, none of which exist in the target
  (zero collisions, VERIFIED). Copying it costs ~9KB and buys the option in section 5.
- **Note:** this file contains `.nav-user-btn` (12 references). That is a *floating-nav button slot*,
  not Clerk styling — it is pure geometry and colour, has no auth dependency, and is not on the drop
  list. See 2.6.

### 2.6 The Clerk/auth styling — KEEP IT. Owner decision, reversing this section's original recommendation.

**VERIFIED by grep across all five incoming files.** Clerk/auth styling exists in **exactly one
file** — `base.css` — as **one contiguous block, lines 199–238** of datacenter's copy. There is no
Clerk styling in `tokens.css`, `shared.css`, `footer.css`, or `floating-nav.css`.

The block:

```
/* Login Page (Clerk SignIn component wrapper) */   <- the comment banner
.login-page                                          <- rule
.login-page > *                                      <- rule
@media (max-width: 640px) { .login-page { ... } }    <- media override
@media (max-height: 620px) { .login-page { ... } }   <- media override
```

**Decision: keep all of it. Copy `base.css` byte-identical.** Do not delete these selectors.

This section originally recommended dropping them, on the reasoning that the target has no Clerk, no
React, and no authentication, so the block is structurally impossible here. The owner was presented
with that recommendation alongside a fact it had surfaced: skilled-workforce **kept** the block
(VERIFIED: `skilled-workforce/css/base.css:174`) despite also being a static site with no auth. So
dropping it would make the target's `base.css` the only one of three that diverges from upstream.

The owner chose to keep it, and the reasoning holds up:

- The block is 4 rules and a comment. No `.login-page` element exists in this repo, so the rules
  never match and cost nothing at runtime.
- Keeping them means `base.css` stays byte-identical to cir-dashboard and datacenter, so it diffs
  cleanly forever and upstream fixes port without manual reconciliation.
- Deleting them buys readability in a file nobody hand-edits, at the price of forking it on day one.

The "drop what is structurally impossible" carve-out still stands as a rule. It simply does not pay
here, because the cost of the carve-out (a permanent fork of a shared file) exceeds the benefit
(four inert selectors removed).

**Consequence for §2.2:** `base.css` now has exactly ONE modification, the line-1 provenance comment.
Not two.

### 2.7 `tool.css` — DO NOT COPY

- **Source:** `datacenter/web/src/styles/tool.css` (425 lines)
- **Justification:** Not part of the shared system. It is datacenter's private app layer
  (`.dc-container`, `.dc-loading`, `.dc-section`, `.tool-header`, `.est-header`) for a county-scoring
  tool the target has nothing to do with. Its own header comment says it "only maps the tool's own
  pieces." The target already has its equivalent: `css/style.css`.

### 2.8 Assets to copy

**None. VERIFIED.**

- No font files — system stack only, zero `@font-face`, zero Google Fonts.
- No footer images — the footer is pure CSS + text.
- No icon files — the incoming icons are CSS-drawn `<span>` transforms or inline `<svg>` written into
  `.tsx` files, not separate assets.
- The target already has `images/branding/hf-logo.svg` (25,874 bytes) and its header already uses it.

The footer needs **no asset files whatsoever**. This is worth stating plainly because it is the kind
of thing that gets assumed and then blocks a port.

### 2.9 Files NOT to touch

`js/header.js`, `js/collapsible.js`, `components/header.html`, and the six `pages/*.html` bodies
(other than adding `<link>` tags and the footer block). No JS changes are needed by this port at all.

---

## 3. The footer, in full

The target has had no footer since commit `51e000c` ("Refactor: Extract shared header component and
remove footers", 2025-11-26). **VERIFIED by reading the commit:** the thing that was removed was
*not* the brand footer. It was an ad-hoc, inline-styled block:

```html
<footer style="background-color: var(--hf-navy); color: white; padding: 2rem 1.5rem; text-align: center;">
  <div style="max-width: 64rem; margin: 0 auto;">
    <p style="margin: 0; color: rgba(255,255,255,0.9);">&copy; 2025 Heartland Forward. All rights reserved.</p>
    <p style="margin: 0.5rem 0 0 0; font-size: 0.875rem; color: rgba(255,255,255,0.7);">Rooted Program - Preparing students for the future of work</p>
  </div>
</footer>
```

Flat navy (no gradient), `2025`, no address, no legal links, inline styles. **Nothing of it should be
restored.** What follows replaces it wholesale. This is a useful data point for the owner: the footer
was removed because it was off-brand, and this port is the fix, not a reversal.

### 3.1 The exact HTML

Paste this immediately before `</body>` on **every page**, after `</main>`. It is byte-identical to
skilled-workforce's static rendering of the CIR component, with only the mailto subject changed.

```html
<footer class="dashboard-footer">
  <div class="footer-content">
    <span>Questions or feedback?</span>
    <a href="mailto:wtrolinger@heartlandforward.org,crews@heartlandforward.org?subject=AI%20Training%20Inquiry" class="footer-email-link">Contact Us</a>
  </div>
  <div class="footer-legal">
    <span>&copy; 2026 Heartland Forward. All rights reserved.</span>
    <span class="footer-separator">|</span>
    <span>110 NW 2nd Street, Bentonville, AR 72712</span>
    <span class="footer-separator">|</span>
    <a href="https://heartlandforward.org/privacy-policy/" target="_blank" rel="noopener">Privacy Policy</a>
    <span class="footer-separator">|</span>
    <a href="https://heartlandforward.org/terms-conditions/" target="_blank" rel="noopener">Terms &amp; Conditions</a>
  </div>
</footer>
```

**Every value, itemised:**

| Thing | Exact value | Source |
|---|---|---|
| Recipients | `wtrolinger@heartlandforward.org,crews@heartlandforward.org` | identical in all 3 repos |
| Subject | `AI%20Training%20Inquiry` | **the one per-app variable** — see below |
| Copyright | `© 2026 Heartland Forward. All rights reserved.` | identical in all 3 |
| Address | `110 NW 2nd Street, Bentonville, AR 72712` | identical in all 3 |
| Privacy | `https://heartlandforward.org/privacy-policy/` | identical in all 3 |
| Terms | `https://heartlandforward.org/terms-conditions/` | identical in all 3 |
| Separator | `|` in a `<span class="footer-separator">` | identical in all 3 |
| Assets | **none** | VERIFIED |

**The mailto subject is the only field you get to choose. FLAG FOR OWNER:** the three siblings use
`Community%20Dashboard%20Inquiry`, `Datacenter%20Impact%20Tool%20Inquiry`, and
`Skilled%20Trades%20Pathways%20Inquiry`. I propose `AI%20Training%20Inquiry` to match the site's
`<title>` ("AI Training - Heartland Forward"), but this is the owner's call and takes five seconds to
change. Everything else in the footer is fixed brand and must not be edited.

**On `rel`:** I use `rel="noopener"` (skilled-workforce's static form). The React repos use
`rel="noopener noreferrer"`. Functionally equivalent for these links in every current browser
(`noopener` is what closes the `window.opener` hole; modern browsers imply it for `target="_blank"`
anyway). Either is fine; pick one and be consistent.

**On `© 2026`:** hardcoded, matching all three siblings. It will need a manual bump in January. This
is pre-existing brand behaviour, not something this port should unilaterally "fix" with JS.

### 3.2 The exact CSS

**Recommendation: preserve the tokens, do not resolve them.** Copy
`cir-dashboard/src/components/dashboard/footer.css` to `css/footer.css` byte-for-byte:

```css
/* Dashboard Footer */
.dashboard-footer {
  background: linear-gradient(135deg, var(--brand-navy) 0%, var(--brand-navy-deep) 100%);
  padding: 26px 19px;
  text-align: center;
  position: relative;
  z-index: 10;
}

/*
 * Dark mode: drop the navy gradient. On a dark canvas the navy block
 * was reading as "another section" rather than a footer; collapsing
 * to bg-page with a thin top divider keeps the footer present without
 * adding visual weight.
 */
[data-theme="dark"] .dashboard-footer {
  background: var(--bg-page);
  border-top: 1px solid var(--border-default);
}

.footer-content {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  font-size: 0.76rem;
  color: var(--bg-overlay-fade-85);
}

.footer-email-link {
  color: var(--brand-emerald-bright);
  text-decoration: none;
  font-weight: 500;
  padding: 6px 16px;
  border: 1px solid var(--brand-emerald-bright-alpha-40);
  border-radius: 16px;
  transition: background-color 0.1s ease, border-color 0.1s ease, color 0.1s ease;
  cursor: pointer;
  display: inline-block;
}

.footer-email-link:hover {
  background: var(--brand-emerald-bright-alpha-15);
  border-color: var(--brand-emerald-bright);
  color: var(--brand-emerald-bright-light);
}

.footer-legal {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1px solid var(--bg-overlay-fade-12);
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  font-size: 0.68rem;
  color: var(--bg-overlay-fade-55);
}

.footer-legal a {
  color: var(--bg-overlay-fade-70);
  text-decoration: none;
  transition: color 0.1s ease;
}

.footer-legal a:hover {
  color: var(--bg-overlay-tooltip);
}

.footer-separator {
  color: var(--bg-overlay-fade-25);
}

@media (max-width: 480px) {
  .footer-content {
    flex-direction: column;
    gap: 13px;
  }

  .footer-legal {
    flex-direction: column;
    gap: 6px;
  }

  .footer-separator {
    display: none;
  }
}
```

**Why tokens preserved rather than resolved:** we are shipping `tokens.css`, so all 14 tokens resolve
(VERIFIED, 2.4). Resolving them would gain nothing and would be the exact move that turned
skilled-workforce into a fork. For reference, the resolved equivalents are `--brand-navy` `#243269`,
`--brand-navy-deep` `#1a2451`, `--brand-emerald-bright` `#10b981`,
`--brand-emerald-bright-light` `#34d399`, `--bg-overlay-fade-85` `rgba(255,255,255,0.85)`,
`--bg-overlay-fade-70` `rgba(255,255,255,0.7)`, `--bg-overlay-fade-55` `rgba(255,255,255,0.55)`,
`--bg-overlay-fade-25` `rgba(255,255,255,0.25)`, `--bg-overlay-fade-12` `rgba(255,255,255,0.12)`,
`--bg-overlay-tooltip` `rgba(255,255,255,0.95)`,
`--brand-emerald-bright-alpha-40` `rgba(16,185,129,0.4)`,
`--brand-emerald-bright-alpha-15` `rgba(16,185,129,0.15)`.

### 3.3 The sticky-footer problem — read this

**VERIFIED, and it is a real trap.** `css/style.css:212` sets `main { flex: 1; }`, but **`body` is
not `display: flex`** anywhere in the target. That declaration has been inert since the day it was
written. Checking git history explains why: it is vestigial from the pre-`51e000c` era when footers
existed.

Neither cir-dashboard nor skilled-workforce makes `body` a flex column — their content is always tall
enough that the footer never rides up. **The target's `index.html` is short.** On a tall desktop
viewport the footer will sit in the middle of the page with grey below it. It will look broken.

**Fix — add to `css/style.css`'s existing `body` rule:**

```css
body {
  /* ... existing declarations ... */
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
```

This activates the already-present `main { flex: 1 }` and pins the footer to the bottom. **Verified
safe:** `.hf-header` is `position: sticky`, which continues to work as a flex child. This is three
declarations in the target's own file — it does not touch any incoming file.

---

## 4. Reconciling with the existing `css/style.css`

This is the hard part, and it turns out to be much easier than it looks, for one verified reason.

### 4.1 The finding that decides it

**VERIFIED: there are zero class-name collisions between the incoming system and the target's
markup.** I extracted all 23 classes used across every HTML file in the repo:

```
airtable-embed, collapsible-content, collapsible-header, content-section, doc-card,
doc-card-description, doc-card-grid, doc-card-header, doc-card-icon, doc-card-title,
first-section, hf-header, hf-header-container, hf-logo, hf-logo-link, hf-menu-btn,
hf-menu-overlay, hf-nav, hf-nav-link, last-section, text-muted, text-small, title-section
```

and grepped every one against all five incoming files. **Not a single match.** The `hf-*`, `doc-*`,
`collapsible-*`, and `*-section` namespaces are entirely disjoint from the incoming `.pillar-*`,
`.metrics-*`, `.chart-*`, `.nav-*`, `.footer-*` namespaces.

The two systems cannot fight over classes. The **only** overlap is on bare element/global selectors,
of which there are exactly four in `base.css` (`*`, `:root`, `body`, `h1`) plus two inert ones
(`#root`, `.app` — no such elements exist in the target).

### 4.2 Recommendation: layer in front, and demote `style.css` to the `tool.css` role

**Do this. Not a wholesale replace, not a page-by-page migration.**

Copy the five files into `css/` untouched. Link them ahead of `style.css` in every page. Leave every
existing class name alone. `css/style.css` keeps its identity but changes *role*: it stops being the
whole design system and becomes the app-specific layer that consumes brand tokens — **exactly the
role `tool.css` plays in datacenter.** That is not an analogy I invented; it is the architecture the
sibling repo already validated.

Load order for `index.html` (root):
```html
<link rel="stylesheet" href="css/tokens.css">
<link rel="stylesheet" href="css/base.css">
<link rel="stylesheet" href="css/shared.css">
<link rel="stylesheet" href="css/footer.css">
<link rel="stylesheet" href="css/floating-nav.css">
<link rel="stylesheet" href="css/style.css">
```

Load order for `pages/*.html`:
```html
<link rel="stylesheet" href="../css/tokens.css">
<link rel="stylesheet" href="../css/base.css">
<link rel="stylesheet" href="../css/shared.css">
<link rel="stylesheet" href="../css/footer.css">
<link rel="stylesheet" href="../css/floating-nav.css">
<link rel="stylesheet" href="../css/style.css">
```

This mirrors datacenter's `main.tsx` import order exactly (tokens → base → shared → footer →
floating-nav → app layer), which is itself the documented cascade order.

**CRITICAL — use relative paths, never `/css/...`.** VERIFIED: every existing page uses relative
stylesheet hrefs (`css/style.css` from root, `../css/style.css` from `pages/`). That is *why* the
site survives GitHub Pages subdirectory hosting. A root-relative `/css/tokens.css` would resolve to
`https://owner.github.io/css/tokens.css` and 404 on a project page. Match the existing convention.

### 4.3 Why not the alternatives

- **Replace wholesale and rewrite the pages' classes.** Rejected. The incoming classes are *dashboard*
  classes (`.pillar-section`, `.chart-card`, `.metrics-sidebar`); the target is a docs site with no
  charts and no metrics. There is nothing to rewrite `.doc-card` *into* — `shared.css` has no card
  primitive that fits. This would mean inventing new markup for six pages to gain nothing, and it
  would break `js/collapsible.js`'s `.collapsible-header` contract for good measure. High cost, zero
  benefit.
- **Migrate page by page.** Rejected. Page-by-page migration exists to de-risk collisions. There are
  no collisions (4.1). It would leave the site in a half-branded state across multiple commits for no
  risk reduction.

### 4.4 What this costs — the honest list

Five concrete conflicts, all on global selectors, all in the target's own file. Because `style.css`
loads **last**, it wins every tie at equal specificity. That means most of these resolve *by
default*, and the ones that need action need it because the owner **wants** the incoming value.

**(a) Font — MUST change, this is the owner's explicit ask.**
`style.css:207` sets `body { font-family: Arial, Helvetica, sans-serif; }`. `base.css` sets
`:root { font-family: system-ui, ... }`. **`body` beats `:root` for the body element and every
descendant inherits from body — so Arial would silently win and the port would achieve nothing
visually.** Owner: "Fonts... should be copied directly over." **Delete the `font-family` declaration
from `style.css`'s `body` rule** so the system stack inherits from `:root`.
*This is the single highest-impact line in the whole port. Every word of body text on all six pages
changes typeface.* Expect it to look different. That is the point.

**(b) Page background — SHOULD change.**
`style.css:205` sets `body { background-color: #F3F4F6; }` (Tailwind gray-100). `base.css` sets
`:root { background-color: var(--bg-page) }` = `#f5f5f5`. Body's background paints over html's, so
`#F3F4F6` wins by default. Owner: "background colors... copied directly over."
**Change to `background-color: var(--bg-page);`.** A near-invisible shift (#F3F4F6 → #f5f5f5) but it
puts the value under token control, which is the whole point.

**(c) The `*` reset — low risk, verify visually.**
`base.css` opens with `* { box-sizing: border-box; margin: 0; padding: 0; }`. The target currently
only resets `box-sizing`. So incoming `margin: 0; padding: 0` on everything is new. **Assessed low
risk:** the target's typography sets `margin-bottom` explicitly on every `h1`–`h4`, `p`, `ul`, `ol`,
and all of it is scoped under `.content-section` / `.title-section`, so it does not depend on UA
default margins. But this is the one change that could subtly reflow prose. **Look at
`how-ai-works.html` (the longest page, 363 lines) specifically.**

**(d) Global `h1` — inert, but note the stray.**
`base.css` has `h1 { font-size: 2rem; margin-bottom: 1rem; color: var(--text-h1); }`. Specificity:
`.content-section h1` (0,1,1) beats bare `h1` (0,0,1), and every `h1` in the target is inside a
section. **So it never applies.** Worth knowing it is there if a bare `h1` is ever added — and worth
noting `--text-h1` resolves to `#1e3a5f`, which is *not* brand navy `#243269`. That is an upstream
quirk, not ours to fix here.

**(e) `#root` / `.app` — inert.** No such elements. Ignore.

### 4.5 The `.title-section` typography constraint

The brief correctly flags that the target's typography is scoped under `.title-section` /
`.content-section`. **This constrains things, and the constraint is load-bearing in our favour.**

Because all six type rules are written as `.content-section h1, .title-section h1 { ... }` — a
(0,1,1) selector — they **outrank every bare-element rule `base.css` can throw at them**. That is
precisely why layering is safe: the target's carefully-tuned prose typography (navy `#243269`
headings, `#374151` body copy, the 1.875rem/1.5rem/1.25rem/1.125rem scale) survives the port
untouched, automatically, with no `!important` anywhere.

The trade-off: the target's type scale stays *its own*. It does not become the CIR type scale. That
is correct and intentional — **there is no shared type scale to adopt.** VERIFIED: the incoming system
has no `--text-xs`/`--text-sm`/`--text-base` tokens; the 382 tokens in `tokens.css` are colour,
shadow, and chart-palette tokens only, and sizes are set ad hoc per component. So "copy the fonts"
means copy the *font family* (4.4a) — the shared system has no type scale to copy. Keep the target's.

### 4.6 The `--hf-*` alias bridge

`style.css:6-12` declares its own `:root` block:
```css
:root { --hf-navy: #243269; --hf-green: #019966; --hf-grey: #D6D6D6; --hf-black: #000000; --hf-white: #ffffff; }
```
`--hf-navy` and `--hf-green` are **exact duplicates** of `--brand-navy` and `--brand-emerald`. They
are used ~20 times across `style.css`.

**Recommendation: keep the names, re-point them at the incoming tokens.**
```css
:root {
  /* Aliases onto the shared brand tokens in tokens.css. Kept so existing
     rules and any inline styles referencing --hf-* keep working. */
  --hf-navy: var(--brand-navy);
  --hf-green: var(--brand-emerald);
  --hf-grey: #D6D6D6;
  --hf-black: #000000;
  --hf-white: #ffffff;
}
```
This gives one source of truth for navy and emerald **without touching a single one of the ~20 usage
sites**, and without breaking anything that references `--hf-navy` from an inline `style=` attribute.
`--hf-grey`/`--hf-black`/`--hf-white` have no clean upstream equivalent — leave them as literals.

**CORRECTED after the port's final review. Do NOT execute the swap as this section originally
described it: it named the wrong token and the wrong count.**

The original text said `style.css` hardcodes `#243269` in **eight** places and recommended swapping
them to `var(--brand-navy)`. Both halves were wrong.

**Wrong count.** It is **five**, not eight: `style.css:244, 254, 264, 274` (the `h1`-`h4` rules) and
`:547` (`.doc-card-title`, which is not an `h1`-`h4` rule). Pre-port it was six, including the
`--hf-navy` declaration that the alias bridge above already re-pointed correctly.

**Wrong token, and this is the part that matters.** `tokens.css:349-355` carries an explicit upstream
warning that contradicts the original recommendation: where navy is used as **text**, consumers should
use `--text-heading`, NOT `--brand-navy`. The two behave differently:

- `--brand-navy` is pinned to `#243269` in BOTH themes (`tokens.css:70` light, `:356` dark). It is a
  brand chrome colour, not a text colour.
- `--text-heading` is `#243269` in light (`tokens.css:44`, byte-equal to the current literal, so zero
  visual change) and `#f1f5f9` in dark (`:321`).

Swapping heading text to `var(--brand-navy)` would therefore encode navy text on a `#1e1e1e`
background for anyone who ever enables dark mode, while creating false confidence that the headings
"track upstream". It would make the file worse, not better, in exactly the way that is hardest to
notice.

**Decision: leave the five literals alone for now.** They are inert today (the literal equals the
token in light mode) and dark mode is unreachable. If someone later wants to finish the job, the
correct swap is to `var(--text-heading)`, not `var(--brand-navy)`, and it should be done in the same
change that adds a dark-mode toggle, so the result can actually be seen.

### 4.7 The dead auth block in the target — DELETE

**VERIFIED: `css/style.css:165-201` — the "User Display (Cloudflare Access)" block — is dead code.**
I grepped the entire repo (`*.html`, `*.js`, `*.css`, `*.md`) for `user-display`, `user-avatar`,
`user-greeting`, `Cloudflare`, `cf-access`, and `CF_Authorization`. **The only hits are the
definitions in `style.css` itself and its own media query. Zero references from any markup or script.**
The site has no authentication.

Delete these selectors:
```
/* User Display (Cloudflare Access) */   <- comment banner
.user-display
.user-avatar-fallback
.user-greeting
@media (max-width: 640px) { .user-greeting { display: none } .user-avatar-fallback { ... } }
```

**Justification, and why this is not a rule violation:** the governing rule protects *shared* assets
from being trimmed into private forks. This block is not shared — it exists in no other repo, it is
the target's own dead code, and it styles an auth UI the site does not and will not have. Removing it
is the same carve-out as 2.6, applied to the target's own file. It also removes the confusing
implication that this site has a login.

---

## 5. The nav question

### 5.1 The tradeoff, stated honestly

**The floating nav and the header are not competing implementations of the same thing.** This is the
crux, and reading `FloatingNav.tsx` settles it. **VERIFIED — the floating nav is an *in-page section
jumper*:**

- Its items are `{ id: 'scores' }`, `{ id: 'demand' }` — **DOM element IDs on the current page**, not URLs.
- `handleNavClick` calls `document.getElementById(id)` then `scrollIntoView({ behavior: 'smooth' })`.
  It **never navigates**.
- It runs an `IntersectionObserver` scroll-spy to highlight the section you are looking at.
- It drives a scroll-progress bar via `requestAnimationFrame`.

It exists because cir-dashboard and datacenter are **single-page apps with long stacked sections**.
The target is a **six-page multi-page site**. There are no long in-page sections to jump between
(the `.collapsible-*` sections are collapsed by default and have no IDs to spy on), and the thing the
target's users actually need — getting from Resources to Prompts — is a *page load*, which the
floating nav has no concept of.

Adopting it for navigation would mean rewriting it into something it is not, then maintaining a
second nav that says the same things as the header. Two navs, one purpose, double the surface.

### 5.2 Recommendation: keep `.hf-header`. Ship `floating-nav.css` unwired. Do not add markup.

Three parts, each for its own reason:

1. **`.hf-header` stays as the site's navigation.** It is the right tool (multi-page), it is already
   built, it has a working hamburger, and — decisively — **`js/header.js`'s runtime-fetch-and-rewrite
   exists specifically to survive GitHub Pages subdirectory hosting.** VERIFIED: it computes
   `basePath` by slicing its own `<script src>` back to `/js/`, then rewrites `href="/` and `src="/`
   in the fetched header HTML against that base. That machinery is load-bearing and hard-won (three
   commits in history are fixes to exactly this: `3dad962`, `3f5cb26`, `635b1c2`). **Nothing in this
   port touches it.** No JS changes, no changes to `components/header.html`, no changes to the
   `<script src="js/header.js">` tags. The port is CSS + a footer block.

2. **`floating-nav.css` is copied anyway**, verbatim, per section 2.5 — it is part of the five-file
   shared system by the owner's own definition, and it is provably inert without markup.

3. **No `.floating-nav` markup is added.** Copying a stylesheet is honouring the shared system.
   Injecting a redundant second nav is a UX change nobody asked for.

**The option this preserves (INFERRED):** `pages/how-ai-works.html` is 363 lines with many
collapsible sections — the one page in the repo that could genuinely want in-page section jumping. If
that is ever wanted, `floating-nav.css` is already sitting there byte-identical to upstream, and the
work is ~40 lines of vanilla JS (IntersectionObserver + scrollIntoView, both native) plus IDs on the
sections. No CSS work, no fork. That is a good place to be, and it costs 9KB to stand there.

**Flag for owner:** if you actively want the floating nav visible on the site as a brand signature
rather than as navigation, say so — it is a different (and defensible) goal, but it needs the JS
written and needs a decision about what its items point at on a six-page site. I am not deciding that
silently.

---

## 6. Dark mode

**Owner's decision (received during this work): ship light mode only. No toggle for now, revisit later.**

**Resolution: copy the `[data-theme="dark"]` block verbatim. Build no toggle. Ship light mode.**

### 6.1 The two things I was asked to verify — both check out

**1. Is the dark block attribute-gated or media-gated?**

**VERIFIED: it is attribute-gated, and there is no media gating anywhere.**

I grepped **all five incoming files** (`tokens.css`, `base.css`, `shared.css`, `footer.css`,
`floating-nav.css`), plus datacenter's and skilled-workforce's full CSS directories, for
`prefers-color-scheme`. **Zero matches. Not one, in any file, in any repo.** I also grepped for the
`color-scheme` property — **zero matches.**

Every dark rule is gated on the `[data-theme="dark"]` attribute selector. The complete census:

| File | `data-theme` occurrences | What they are |
|---|---|---|
| `tokens.css` | 3 | 2 in comments, **1 real selector**: `[data-theme="dark"] {` at line 280 (block runs 280–563) |
| `footer.css` | 1 | `[data-theme="dark"] .dashboard-footer` |
| `floating-nav.css` | 9 | `.nav-toggle`, `.nav-search-btn`, `.nav-user-btn`, `.nav-translator-btn`, `.nav-item.active` variants |
| `base.css` | 0 | — |
| `shared.css` | 0 | — |

**So the block is genuinely inert.** It cannot activate unless something sets `data-theme="dark"` on
an ancestor. The site will render pure light mode. **This is the good outcome — the risk the
coordinator flagged does not exist here.**

**2. Does anything else set `data-theme` or read `prefers-color-scheme`?**

**VERIFIED: nothing we are copying does.**

- In cir-dashboard, the attribute is set by `src/context/ThemeContext.tsx` (plus a pre-hydration
  script in its `index.html`). **We are copying neither — they are React/TSX files, not part of the
  five-file CSS system.**
- **datacenter sets `data-theme` nowhere.** Zero hits across its `.tsx`/`.ts`/`.html`. It already
  ships exactly the configuration we are proposing: full dark token block present, no toggle, light
  mode only, in production, today.
- **skilled-workforce sets `data-theme` nowhere** (it deleted the dark blocks entirely).
- The target has no JS that touches `data-theme` and we are adding none.

**datacenter is the proof case.** The arrangement the owner asked for is not theoretical — a sibling
repo has been running it since 2026-07-10.

### 6.2 Why keeping it is right (not just harmless)

- **It costs nothing at runtime.** Inert attribute-gated rules are parsed once and never matched.
- **Dropping it would fork `tokens.css` immediately**, violating the copy-verbatim rule on the very
  file that is currently byte-identical across cir-dashboard and datacenter. `tokens.css` is 564
  lines and the dark block is lines 280–563 — **half the file**. Deleting it would make the target's
  most important shared file unrecognisable to `diff`.
- **It is a hand-designed palette, not boilerplate.** Reading it, the dark block carries inline design
  rationale — why brand navy lightens on dark, why shadows need more alpha on dark surfaces, why the
  footer drops its gradient. That is real design work the owner explicitly wants "later."
- **It makes "later" cheap.** With the block present, dark mode becomes: add a toggle that sets one
  attribute. Without it, dark mode becomes: redesign a palette.

**Answer to "is a token block without a toggle useful or dead weight?"** Useful. It is a *stored
decision*, and it is the difference between a 40-line feature and a design project. The one thing
that would make it dead weight — silently activating for OS-dark users — is verified not to happen.

### 6.3 The verification that catches this if I am wrong

Even though I verified it statically, **the browser check is non-negotiable** because it is the only
thing that proves it end-to-end. In stage 6 of the execution order: set macOS to Dark Mode
(System Settings → Appearance → Dark), hard-reload every page, confirm the site still renders light —
white cards, `#f5f5f5` page, navy-gradient footer. If any surface goes dark, something is
media-gated after all and the port must stop until it is found.

---

## 7. Execution order

Six stages. Each is independently verifiable in a browser. No test framework exists; verification is
Playwright or a manual pass against a local server.

**Serve locally (no build step, so any static server works):**
```
cd /Users/william/ai-training && python3 -m http.server 8000
```
Then check `http://localhost:8000/` and each `http://localhost:8000/pages/*.html`.

> **Coordination note, now resolved.** This document was written while another agent was actively
> editing `pages/*.html`. That content work is complete and merged into this branch as of commit
> `2b501c5`: six pages now exist, including `pages/get-access.html`, and `pages/how-ai-works.html`
> has grown five new sections. All stages below are safe to run. Re-read the page files before
> stage 3 rather than trusting any line count quoted in this document from before that work landed.

### Stage 1 — Land the shared files, linked nowhere

Copy all five into `css/`. Apply the `base.css` line-1 provenance comment (2.2) and nothing else:
the `.login-page` block STAYS, per the owner decision in 2.6. **Change no HTML.**

- **Verify:** site is pixel-identical to before. Nothing links the new files yet.
- **Could break:** nothing. This is the safe checkpoint.
- **How to see it:** load all six pages; they should look exactly as they do now.

### Stage 2 — Clean up `style.css`'s dead code and alias the tokens

Delete the "User Display (Cloudflare Access)" block (4.7). Re-point `--hf-navy`/`--hf-green` at
`var(--brand-navy)`/`var(--brand-emerald)` (4.6).

- **Verify:** still pixel-identical. The aliases resolve to the same hex values they replaced.
- **Could break:** if `tokens.css` is not linked yet, `var(--brand-navy)` resolves to *nothing* and
  every navy element goes transparent/black. **This stage's correctness depends on stage 3.** Safer
  ordering: do the `.user-display` deletion here, and defer the alias swap to stage 3. **Recommended.**
- **How to see it:** header logo area and nav links stay navy; `.doc-card` borders stay grey.

### Stage 3 — Link the stylesheets on ONE page (`index.html`)

Add the five `<link>` tags **before** `css/style.css` (4.2), using **relative** paths. Then apply the
`style.css` font (4.4a) and background (4.4b) changes, and the alias swap if deferred.

- **Verify:** `index.html` body text switches from Arial to the system stack (on macOS: SF Pro — the
  difference is obvious). Cards, grid, and header keep their current layout. Page bg ~unchanged.
- **Could break:** **this is the highest-risk stage.** (a) wrong `<link>` order → `style.css` loses
  ties it should win; (b) `*{margin:0}` reflows prose; (c) a `/css/` absolute path 404s on Pages.
- **How to see it:** DevTools → Network: all six CSS files 200, in order. DevTools → Elements →
  Computed on a `<p>`: `font-family` should start `system-ui`. Compare against a screenshot from
  stage 1.

### Stage 4 — Roll the links out to the remaining five pages

Same six `<link>` tags with `../css/` paths on `how-ai-works.html`, `resources.html`, `prompts.html`,
`survey.html`, `get-access.html`.

- **Verify:** every page matches index's typography. **Check `how-ai-works.html` hardest** — it is the
  longest (363 lines), the most prose-dense, and the most exposed to the `*` reset.
- **Could break:** `../css/` typo'd as `css/`; tables in `resources.html` reflowing.
- **How to see it:** resize to <768px on `resources.html` and confirm the `data-label` card reflow
  still works. Click a `.collapsible-header` on `how-ai-works.html` and confirm it still toggles
  (`js/collapsible.js` is untouched, so it should).

### Stage 5 — Add the footer

Paste the footer block (3.1) before `</body>` on all six pages. Add the three flex declarations to
`body` (3.3).

- **Verify:** navy-gradient footer at the bottom of every page. Emerald pill "Contact Us". On
  `index.html` (the short page) the footer must sit at the **viewport bottom**, not mid-page.
- **Could break:** forgetting the `body` flex change → footer floats mid-page on `index.html`;
  `.hf-header`'s `position: sticky` misbehaving as a flex child (it should not — verify).
- **How to see it:** load `index.html` on a tall window. Scroll `how-ai-works.html` and confirm the
  header still sticks. Resize to <480px and confirm the footer legal row stacks vertically and the
  `|` separators disappear. Click "Contact Us" → mail client opens with both recipients and the
  subject.

### Stage 6 — Dark-mode safety check (do not skip)

Set macOS to Dark Mode (System Settings → Appearance → Dark). Hard-reload every page.

- **Verify:** **the site still renders light.** White cards, `#f5f5f5` page, navy-gradient footer.
- **Could break:** if any surface goes dark, something is `prefers-color-scheme`-gated that I did not
  find. **Stop and find it before shipping.**
- **How to see it:** DevTools → Elements → `<html>` must have **no** `data-theme` attribute. Then
  DevTools → Rendering → "Emulate prefers-color-scheme: dark" and confirm again — that catches it
  even without changing OS settings.

---

## 8. Risks

Ordered by likelihood × damage.

### Risk 1 (most likely) — The font change lands and looks "wrong"

**This is the one to expect.** Deleting `font-family: Arial` from `body` changes every word on all six
pages. Arial → system-ui is not subtle: different metrics, different line-breaking, slightly
different vertical rhythm. Prose-heavy pages (`how-ai-works.html`) will reflow, and paragraphs may
gain or lose a line.

Nothing is broken when this happens — it is the port working. But it is exactly the kind of change
that reads as a regression to someone who did not expect it. **Screenshot every page at stage 1 and
diff against stage 4.** And tell the owner it is coming: it is the most visible single effect of the
whole port, and it is precisely what "fonts copied directly over" means.

### Risk 2 — Cascade order silently inverted

If the `<link>` tags land *after* `css/style.css`, or one is missing on one page, the failure is
**partial and quiet**: most things look right because there are no class collisions, but `base.css`'s
`:root` font would lose to `body`'s Arial (looks like "the port did nothing"), or `style.css`'s
carefully-scoped typography would lose ties it should win (looks like "the port broke the prose").
Both are easy to misdiagnose as content bugs.

**Check first after the port:** DevTools → Network on **every** page — six CSS files, all 200, in the
order tokens → base → shared → footer → floating-nav → style. It takes ten seconds and catches this
class of bug completely. Second check: `var(--brand-navy)` resolving — if `tokens.css` failed to load,
Computed styles show navy elements with *no* colour rather than the wrong colour, which is a
distinctive and easy-to-spot signature.

### Risk 3 — GitHub Pages subdirectory path breakage

Relative CSS paths are why this site works in a Pages subdirectory. A `/css/tokens.css` would work
perfectly on `localhost:8000` and **404 in production**. Localhost cannot catch this.

**Mitigation:** grep for `href="/css` before committing. Verify on the deployed Pages URL, not just
locally.

**Aside, VERIFIED, not caused by this port:** the deploy workflow is at **`.github/static.yml`**, not
`.github/workflows/static.yml`. GitHub Actions only reads `.github/workflows/`, so **this workflow is
almost certainly not running.** The site is presumably served by Pages' branch mode instead — which
works fine and is unaffected by this port. Flagging it because it will confuse anyone who tries to
verify a deploy by watching the Actions tab. **Out of scope; do not fix it as part of this port.**

### Risk 4 — The `*` reset reflows prose

`base.css`'s `* { margin: 0; padding: 0 }` is new to the target. Assessed low (4.4c: the target's
typography sets margins explicitly and scopes them under `.content-section`), but it is the change
with the widest blast radius and the least specific failure mode.

**Check:** `how-ai-works.html` end to end at stage 4. Look for collapsed gaps between headings and
paragraphs, and list indentation.

### Risk 5 — Merge conflict with the agent editing `pages/*.html`

Another agent is actively adding pages and nav entries. Stages 3–5 touch all six page files' `<head>`
and `</body>`. Concurrent edits to the same files are likely.

**Mitigation:** do stages 1–2 (css-only) now; coordinate before stage 3. Any page added later needs
the same six `<link>` tags and the same footer block — worth telling that agent so new pages are born
correct rather than retrofitted.

---

## 9. Where the reports disagree with the files

The brief asked for these explicitly. In every case **the file wins**.

1. **reference-pr-report: "`tokens.css` is a single `:root` block of ~150 CSS custom properties."**
   **Wrong on both counts.** VERIFIED: **382** declarations, and it is **two** blocks — `:root`
   (lines 14–258) and `[data-theme="dark"]` (lines 280–563). The dark block is roughly half the file.
   Consequence: anyone budgeting the "just delete dark mode" work off that report would badly
   underestimate how much of the file they were about to fork.

2. **reference-pr-report: "Don't blindly import an entire shared stylesheet if most of it doesn't
   apply... Prefer: extract only the token values and the handful of component classes actually
   needed."** and **"don't cargo-cult an entire token file's scope... take only what will be used."**
   **Directly contradicts the owner's governing rule** ("copy the shared system whole so files stay
   identical and diffable across repos... Do not trim merely-unused-today component styles"). This is
   not a factual error — it is advice written before the rule was set. **The rule wins.** I flag it
   because it is the single biggest divergence between the reports and this plan, and anyone reading
   that report afterwards will think the plan got it backwards. It didn't; the priority changed from
   "minimise bytes" to "maximise diffability", and the owner made that call.

3. **The "skilled-workforce is the closest analogue" framing** (from the brief itself, not a report).
   True structurally, **but misleading as guidance.** VERIFIED: skilled-workforce is a token-resolved
   fork that diverges from upstream by 149 lines in `shared.css` alone and carries no `tokens.css`.
   Its resolve-the-tokens approach was a *choice*, not a static-site necessity — CSS custom properties
   need no build step. **Copy cir-dashboard's files, not skilled-workforce's.** Use skilled-workforce
   only for its static-HTML footer markup shape (which is genuinely useful, section 3.1).

4. **skilled-workforce-report: "This footer has zero dependency on `main.css` tokens... every value
   is a hardcoded literal in `footer.css` itself, so the file is fully self-contained."**
   **True of skilled-workforce's file, and true as written — but do not act on it.** It describes the
   forked artifact, not the design system. Since we ship `tokens.css`, we take CIR's token-based
   footer (2.4), whose 14 tokens I verified all resolve.

5. **The brief's premise that `css/style.css` is 869 lines.** It is **870**. Trivial, noted for
   completeness since line numbers are cited throughout. The auth block the brief locates at
   "~165-200" is at **165–201**.

6. **datacenter README's "copied verbatim" claim — CONFIRMED, not contradicted.** Worth stating
   plainly since the brief asked me to check: md5-identical on all four files it shares with
   cir-dashboard. `base.css` differs from CIR's `src/index.css` by exactly one line (the `@import`),
   which is a rename-and-decouple, not drift. The claim is honest.

---

## 10. Summary of decisions

| Question | Decision |
|---|---|
| Which repo is authoritative | **cir-dashboard**, corroborated byte-for-byte by datacenter |
| Which files come over | `tokens.css`, `base.css`, `shared.css`, `footer.css`, `floating-nav.css` → `css/` |
| Which file does not | `tool.css` (datacenter's app layer; `style.css` is our equivalent) |
| Modifications to incoming files | **Exactly one**: `base.css` line-1 provenance comment. Nothing else. |
| Clerk/auth styling | **KEEP.** Owner decision. Inert here (no `.login-page` element exists), and keeping it means `base.css` stays byte-identical to both siblings rather than forking on day one. |
| Reconciliation | **Layer in front; demote `style.css` to the `tool.css` role.** Zero class collisions verified |
| Class renames | **None** |
| Nav | **Keep `.hf-header`.** Ship `floating-nav.css` unwired. `js/header.js` untouched |
| Dark mode | **Copy the block verbatim. No toggle. Light mode only.** Verified attribute-gated, zero `prefers-color-scheme` |
| Footer | CIR's token-based CSS verbatim + static HTML; only the mailto subject is ours |
| Assets to copy | **None** |
| Target's dead auth block | **Delete** (`style.css:165–201`, verified unreferenced) |

### Open calls — all four now resolved by the owner

1. **Footer mailto subject** — RESOLVED: `AI%20Training%20Inquiry`. Note the recipients (`wtrolinger@`
   plus `crews@`) come across verbatim from cir-dashboard, which already uses the owner's own address.
   The owner asked for "my email" and copying achieves that with no deviation. Flagged to the owner
   that this puts Cass on every advisor's Contact Us; awaiting no further input, so keep both. (3.1)
2. **`shared.css`'s 733 dead lines** — RESOLVED: ship it whole. The owner asked for a full copy, and
   both siblings already carry the same unused rules. Identical files are the point. (2.3)
3. **`.login-page`** — RESOLVED: **KEEP it.** Reverses this document's original recommendation. See
   the rewritten 2.6. `base.css` therefore stays byte-identical to both siblings. (2.6)
4. **Floating nav as brand signature rather than navigation** — NOT PURSUED. `floating-nav.css` ships
   verbatim but unwired, per 5.2. Reading `FloatingNav.tsx` settled it: it is an in-page section
   jumper (`getElementById` + `scrollIntoView`), and this site is six separate pages. If the owner
   later wants it as a brand signature, that is a separate goal needing JS and a decision about
   targets. Not decided silently.

### Dark mode — resolved

Copy the `[data-theme="dark"]` block verbatim, build no toggle, ship light mode only. Verified
attribute-gated with zero `prefers-color-scheme` across all five files and both downstream repos, so
it is genuinely inert. Stage 6 verifies this in-browser and must not be skipped. See 6.1-6.3.
