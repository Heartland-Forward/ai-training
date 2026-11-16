# Claude for Teachers Site Update Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Claude for Teachers access instructions and four missing AI concepts (Projects, Artifacts, Skills, Connectors) plus a sycophancy watch-outs section to the rootEd advisor training site.

**Architecture:** Static HTML site, no build step, no framework, no package manager. Pages are hand-written HTML sharing one stylesheet. The header is injected at runtime by `js/header.js`, which fetches `components/header.html` and rewrites root-relative paths against a base path derived from the script's own URL. Collapsible sections are wired by `js/collapsible.js` matching `.collapsible-header[data-target]` to `#id.collapsible-content`. New work follows these existing patterns exactly rather than introducing anything new.

**Tech Stack:** HTML5, CSS (single 869-line `css/style.css`), vanilla JS (two files, no dependencies). Deployed to GitHub Pages.

**Source of truth for all content decisions:** `docs/superpowers/specs/2026-07-14-claude-for-teachers-design.md`. Read it before starting. Every factual claim, verbatim quote, and do-not-publish item lives there. Do not add facts that are not in the spec.

## Global Constraints

- **No emojis** anywhere in markup, copy, or comments.
- **No em dashes.** Use colons, periods, commas, or parentheses.
- **Comments above the line, never inline.**
- **Terminology: "rootEd advisor."** Lowercase r-o-o-t, capital E, lowercase d, lowercase a in "advisor." Never "rooted", never "ROOTED", never "career coach" (that is a different Arkansas program).
- **Product name is "Claude for Teachers"**, not "Claude for K-12 Teachers".
- **Say "Pro-level features"**, never "Claude Pro" or "Claude Max".
- **The two deadlines are structurally different and must never be phrased alike.** Claude: "Sign up by June 30, 2027" is a signup deadline granting one year from signup. ChatGPT: "free through June 2027" is a fixed end date with no published day. Never write "June 30, 2027" for ChatGPT.
- **Verification partners differ.** Anthropic uses Goodstack. OpenAI uses SheerID. Never swap these.
- **Every `<td>` in every table needs a `data-label` attribute** matching its column header. `css/style.css` uses these to reflow tables into cards on mobile. A missing `data-label` produces a broken mobile layout.
- **Typography is scoped under `.title-section` in `css/style.css`.** Content outside a `.title-section` or `.content-section` will not pick up expected styling.
- **Nothing on the spec's "Do not publish" list may appear.** When unsure whether a claim is supported, omit it.
- Both new and edited pages carry a "verified as of July 2026" stamp.

## Verification approach

This repo has no test framework, no build step, and no package.json. There is nothing to unit test: the deliverable is HTML content. Writing a test harness for this would be more code than the feature.

Verification is therefore a real browser check against a local server, which is also the project's definition of done. Start the server once at the beginning of the session:

```bash
cd /Users/william/ai-training && python3 -m http.server 5501
```

Leave it running. Every task's verification step loads a page from `http://localhost:5501` and confirms specific observable behavior. Use the Playwright MCP tools (`mcp__plugin_playwright_playwright__browser_navigate`, `browser_snapshot`, `browser_click`, `browser_console_messages`) or Claude in Chrome.

**The header only works over HTTP, not `file://`.** `js/header.js` uses `fetch()`, which fails on the file protocol. Opening a page directly from disk shows no nav. Always verify through the server.

---

## File Structure

| File | Responsibility | Change |
|---|---|---|
| `pages/resources.html` | Tool tables with K-12 pricing | Modify: add Claude row, remove stale claim, reframe Gemini, update stamp |
| `pages/get-access.html` | Step-by-step verification walkthroughs | Create |
| `components/header.html` | Shared nav, injected at runtime | Modify: one nav link |
| `index.html` | Landing page card grid | Modify: one card |
| `pages/how-ai-works.html` | Tool-agnostic AI concepts | Modify: five new sections, one existing list updated, one unclosed tag fixed |

---

## Task 1: Fix resources page

Smallest change, highest correctness value: the page currently asserts something false about the product this whole project is about.

**Files:**
- Modify: `pages/resources.html:16` (date stamp), `:41-91` (Free Tools tbody), `:57-62` (Gemini row), `:141` (stale claim)

**Interfaces:**
- Consumes: nothing.
- Produces: nothing. Self-contained.

- [ ] **Step 1: Update the date stamp**

Line 16 currently reads `<em>Updated November 2025.</em>`. Change to `<em>Updated July 2026.</em>`.

- [ ] **Step 2: Add the Claude for Teachers row to the Free Tools table**

Insert as the first row of the `<tbody>` at line 41, before the ChatGPT for Teachers row. It leads because it is the newest and the reason for this work. Match the existing row markup exactly, including `data-label` on every cell and `target="_blank"` on the link.

Cell values:
- Tool: link to `https://claude.ai/teachers`, link text `Claude for Teachers`, wrapped in `<strong>`
- Category: `LLM`
- Standard Price: `$20/mo`
- K-12 Price: `FREE (1 year from signup)`
- Eligibility: `Verified US K-12 educators`

The K-12 Price cell wording matters. It must not read "through June 2027", which is ChatGPT's structure, not Claude's.

- [ ] **Step 3: Reframe the Gemini row**

The current Eligibility cell (line 61) reads `K-12 via Google Workspace for Education`, which implies a reader can go sign up. Gemini for Education is admin-gated: an individual educator cannot enable it. Change the Eligibility cell to `Requires district Workspace admin to enable`.

- [ ] **Step 4: Remove the stale claim**

Line 141, inside the commented-out Key Takeaways block, reads:

```html
<li><strong>What's NOT K-12:</strong> Perplexity Education Pro (university-level only), Claude for Education (higher ed only)</li>
```

Claude for Teachers is now a K-12 offering, so the Claude clause is false. Edit the line to drop it, keeping the Perplexity clause:

```html
<li><strong>What's NOT K-12:</strong> Perplexity Education Pro (university-level only)</li>
```

Leave the block commented out. Uncommenting it is out of scope and would surface content nobody reviewed.

- [ ] **Step 5: Add a note below the Free Tools table about the two deadline shapes**

The table now has two rows with June 2027 dates that mean different things. Directly below the existing note paragraph at line 93, add a second `<p class="text-small text-muted">` explaining: Claude's June 30, 2027 is a signup deadline and the free year runs one year from the date you sign up; ChatGPT's is a fixed end date in June 2027 regardless of when you join.

- [ ] **Step 6: Verify in the browser**

Navigate to `http://localhost:5501/pages/resources.html`. Confirm:
- The Claude row is the first row of Free Tools and links to `claude.ai/teachers`
- The date stamp reads July 2026
- No text anywhere on the page says "higher ed only"
- Resize to 400px wide: the new row reflows into a card with visible field labels (this proves `data-label` is correct)

- [ ] **Step 7: Commit**

```bash
git add pages/resources.html
git commit -m "fix: correct Claude education availability on resources page

Claude for Teachers launched 2026-07-14 as a K-12 offering, so the
page's claim that Anthropic's education product is higher-ed only is
now false. Adds the Claude row, reframes Gemini as admin-gated, and
notes that the two June 2027 dates are structurally different."
```

---

## Task 2: Create the get-access page

**Files:**
- Create: `pages/get-access.html`

**Interfaces:**
- Consumes: `../css/style.css`, `../js/header.js`, `../js/collapsible.js`.
- Produces: the file `pages/get-access.html`, which Task 3 links to from the nav and the landing page. The nav link match in `js/header.js:19-23` keys on the filename, so `data-page="get-access.html"` in Task 3 must match this filename exactly.

- [ ] **Step 1: Create the page skeleton**

Copy the exact `<head>` structure from `pages/resources.html:1-11`, changing only `<title>` and the meta description. Required in order: charset, viewport, description, title, `../css/style.css`, the `../images/branding/hf-logo.svg` favicon, and `../js/header.js`.

Title: `How to Get Access - AI Training`

Body structure: `<main>` containing a `<section class="title-section first-section">` with an `<h1>` reading `How to Get Access` and a lead paragraph, then the content sections below. Close with `<script src="../js/collapsible.js"></script>` before `</body>`, matching `resources.html:147`.

The lead paragraph carries the verified-as-of stamp: note that both offers were verified in July 2026 and that terms change.

- [ ] **Step 2: Add the deadline comparison table**

A `<section class="content-section">` with a collapsible h2 reading `Two offers, two different deadlines`. This goes first because it is the thing most likely to be misunderstood.

Build the table from the spec's deadline table. Four columns: blank/label, Claude for Teachers, ChatGPT for Teachers. Rows: Shape, Date, What you get, Day published. Every `<td>` needs `data-label`.

- [ ] **Step 3: Add the Claude for Teachers walkthrough section**

A `<section class="content-section">` with a collapsible h2 reading `Claude for Teachers`.

Content requirements, all sourced from the spec:
- Lead with what it is: free for verified US K-12 educators, Pro-level features, launched July 2026.
- **The account prerequisite first**, before the steps: the Claude account must use the school-issued email, not a personal one. This is the step people get wrong and it is not recoverable by editing later.
- Quote eligibility verbatim in a `<blockquote>` or styled paragraph: "Claude for Teachers is for individual educators working in US K-12 schools: Classroom teachers, in any subject and any grade from kindergarten through 12th; Instructional coaches, specialists, and interventionists; Librarians, counselors, and other certificated staff."
- What to have ready, verbatim from the modal: "Your school (US K-12, public or private). A Claude account that uses your school-issued email. One document showing your role, like a school ID, contract, pay stub, or certificate."
- The steps: go to `claude.ai/teachers`, click Get started, accept the K-12 Terms of Service and Student Data Processing Addendum, select your school, upload one role document, wait for review.
- **Name Goodstack explicitly and explain why**, in a callout or bolded paragraph: Anthropic hands verification to a partner called Goodstack. Being redirected to an unfamiliar company that asks for a pay stub is expected, not a phishing attempt. Quote: "Reviews are handled by Anthropic's verification partner, Goodstack, and most finish within 24 hours, though they can take up to 3 days during busy periods."
- **Timing as an instruction, not a fact:** verify now, not the night before you need it. Up to 3 days when busy.
- The deadline: "Sign up by June 30, 2027 for your full year of free access." State plainly that the year runs from signup, so signing up earlier does not waste it.
- Why it matters for student data: accepting puts the account under the K-12 Terms of Service and Student Data Processing Addendum, a different agreement than consumer Claude, and training is off by default for every verified educator account.

Do not state what happens when the free year ends. No official source says.

- [ ] **Step 4: Add the ChatGPT for Teachers walkthrough section**

A `<section class="content-section">` with a collapsible h2 reading `ChatGPT for Teachers`.

- Eligibility verbatim: "You are eligible if you: Work for an accredited U.S. K–12 school or district, and Are a teacher, staff member, school leader, or district administrator".
- Verification partner is **SheerID**, not Goodstack.
- Steps: start at `chatgpt.com/k12-verification` with the school or district email, then create or join a workspace tied to the district domain, then set role, subjects, grade levels.
- Cost: free through June 2027. A fixed end date. OpenAI publishes no day of the month, so do not invent one.
- Note it is not Plus and not Pro but a distinct workspace product.

Do not state a verification turnaround time. OpenAI publishes none.

- [ ] **Step 5: Add a short Gemini section explaining why there are no steps**

A `<section class="content-section">` with a collapsible h2 reading `Gemini: why there is no walkthrough`.

Readers will ask, and the honest answer is useful: Gemini for Education is genuinely free for K-12, but it is admin-gated. "Your administrator must have enabled access to Gemini Apps for your account." There is no self-serve path for an individual educator. If your district already runs Google Workspace for Education and has not opted out, you may already have it, since Gemini in Classroom is on by default for users 18 and over. If not, this is a conversation with your district IT, not a signup form.

Add the caution: using consumer Gemini on a personal Google account is a different product with none of the education data protections. It is not a substitute for student-facing work.

- [ ] **Step 6: Verify in the browser**

Navigate to `http://localhost:5501/pages/get-access.html`. Confirm:
- The header nav renders at the top (proves `js/header.js` resolved the path correctly from `pages/`)
- Every collapsible h2 toggles its content open and closed on click
- `browser_console_messages` shows no errors
- At 400px wide, the deadline table reflows into labeled cards
- The page never says "June 30, 2027" in the ChatGPT section
- The page never says "Goodstack" in the ChatGPT section or "SheerID" in the Claude section

- [ ] **Step 7: Commit**

```bash
git add pages/get-access.html
git commit -m "feat: add how-to-get-access page for Claude and ChatGPT

Walkthroughs for the two teacher offers a rootEd advisor can verify for
on a school-issued email. Names Goodstack up front so the handoff does
not read as phishing, and separates Claude's signup deadline from
ChatGPT's fixed end date."
```

---

## Task 3: Wire the new page into nav and landing page

Separate from Task 2 because a reviewer could accept the page and reject its placement.

**Files:**
- Modify: `components/header.html:16` (nav), `index.html:49-52` (card grid)

**Interfaces:**
- Consumes: `pages/get-access.html` from Task 2. The `data-page` value must exactly match that filename.
- Produces: nothing.

- [ ] **Step 1: Add the nav link**

In `components/header.html`, add a link after the Resources link (line 14) and before Prompts. Order reflects the reader's journey: understand the concepts, see the tools, get access, then prompts.

```html
<a href="/pages/get-access.html" class="hf-nav-link" data-page="get-access.html">Get Access</a>
```

The root-relative `/pages/...` href is required. `js/header.js:14-15` rewrites every `href="/` against the computed base path, which is what makes this work in a GitHub Pages subdirectory. A relative href would break.

- [ ] **Step 2: Add the landing page card**

In `index.html`, add a fourth `<a class="doc-card">` inside `.doc-card-grid`, after the Prompts card (closing `</a>` at line 49) and before the grid's closing `</div>` at line 52.

Match the existing card structure exactly: `<a href="pages/get-access.html" class="doc-card" style="text-decoration: none;">`, containing a `<div class="doc-card-header">` with an inline `<svg class="doc-card-icon">` and an `<h3 class="doc-card-title">`, followed by a `<p class="doc-card-description">`.

Title: `Get Access`. Description: `Free Claude and ChatGPT for verified K-12 educators.`

For the icon, use a Heroicons outline path consistent with the others (they are all 24x24, `fill="none"`, `stroke="currentColor"`, `stroke-width="2"`). A key or check-badge icon fits the meaning.

Note the landing page href is relative (`pages/get-access.html`) because `index.html` is at the root, unlike the nav which is root-relative and rewritten. Do not make these match.

- [ ] **Step 3: Verify in the browser**

Navigate to `http://localhost:5501/index.html`. Confirm:
- Four cards render in the grid and the new one clicks through to the get-access page
- The nav shows Get Access between Resources and Prompts

Then navigate to `http://localhost:5501/pages/get-access.html` and confirm the Get Access nav link is styled active (it should carry `hf-nav-link-active`, which `js/header.js:19-23` adds by matching the filename). If it is not active, `data-page` does not match the filename.

Also click through from a nested page (`pages/resources.html`) to confirm the rewritten path resolves from a subdirectory.

- [ ] **Step 4: Commit**

```bash
git add components/header.html index.html
git commit -m "feat: link get-access page from nav and landing page"
```

---

## Task 4: Add Projects and Artifacts sections

**Files:**
- Modify: `pages/how-ai-works.html` (insert after line 338, before the commented block at line 340)

**Interfaces:**
- Consumes: `js/collapsible.js`, already loaded at line 363.
- Produces: two `<section>` elements. Tasks 5 and 6 insert siblings after these, following the same pattern.

**Source material:** `_includes/sections/projects.html` and `_includes/sections/artifacts.html` in the `will-trolinger/hf-claude` repo, fetched to the scratchpad. Adapt, do not copy: strip the HF-internal examples (grants, funders, proposals, reporting calendars) and re-ground in advisor work.

- [ ] **Step 1: Fix the unclosed `<main>` tag**

Before adding anything, fix an existing defect. The commented-out agents block spans lines 340-361, and `</main>` is at line 361, inside the comment. `<main>` is therefore never closed. Browsers auto-close it at `</body>`, so the page renders and nobody has noticed.

Move `</main>` outside the comment: it belongs after the last real section and before the `<script>` tag at line 363. The comment block should open at line 340 and close after the agents `</section>`, without swallowing `</main>`.

This must be fixed now because the new sections go exactly here and would otherwise land inside or after a malformed block.

- [ ] **Step 2: Write the Projects section**

Insert after line 338. Follow the exact pattern of the existing sections, for example `pages/how-ai-works.html:294-338`:

```html
<section id="projects" class="content-section">
    <h2 class="collapsible-header" data-target="projects-content">Projects: Stop Re-Explaining Yourself</h2>
    <div class="collapsible-content" id="projects-content">
        <!-- prose, table, where-to-find-it list -->
    </div>
</section>
```

Content: a Project is a folder of files plus standing instructions every chat inside inherits. Three things live in it: files, instructions, chats. Re-grounded shapes for an advisor, replacing hf-claude's grant/program/report shapes:
- One per school year or senior cohort: the ICAP template, the FAFSA checklist, last year's timeline.
- One per employer or partner relationship: the site-visit notes, the contact history, what they offered last time.
- One per recurring deliverable: the newsletter, the counselor update.

The point to land, adapted from hf-claude: Projects look optional, so most people never make one and spend the year re-pasting the same context. If a body of work comes up more than twice, it deserves a Project.

Close with the "Where to find it" list, matching the existing pattern at lines 326-332:
- **Claude:** Projects
- **ChatGPT:** Projects (near parity; project instructions override global custom instructions)
- **Gemini:** no true equivalent. Gems carry instructions and files but are a persona you switch into. Drive projects group files but carry no standing instructions.

That Gemini gap is a real finding, not a hedge. State it plainly.

- [ ] **Step 3: Write the Artifacts section**

Insert after the Projects section. Same structure, `id="artifacts"`, `data-target="artifacts-content"`.

Content: when the AI makes something substantial, it opens in a side panel next to the chat. You keep talking on the left, the thing you are building lives on the right. Documents, tables, and small working tools land there.

The point to land, from hf-claude: the interesting part is the turnaround, not the artifact. "Can someone build me a simple internal tool for this" normally takes weeks. Here it takes a sentence. An advisor example: a one-page interactive FAFSA deadline tracker for a senior cohort.

"Where to find it":
- **Claude:** Artifacts (opens on its own when output warrants)
- **ChatGPT:** Canvas (a document and code surface)
- **Gemini:** Canvas (manually invoked: Add Files, then Canvas)

Per the spec's do-not-publish list, do **not** claim ChatGPT's Canvas renders live interactive apps. Research contradicted itself on that. Describe it as a document and code surface only.

- [ ] **Step 4: Verify in the browser**

Navigate to `http://localhost:5501/pages/how-ai-works.html`. Confirm:
- Both new sections appear after Deep Research and before the end of the page
- Both h2s toggle open and closed
- `browser_snapshot` shows `<main>` properly closed and the agents block still commented out and not rendering
- Tables reflow at 400px
- No console errors

- [ ] **Step 5: Commit**

```bash
git add pages/how-ai-works.html
git commit -m "feat: add Projects and Artifacts sections to Understanding AI

Also closes the main tag, which was commented out along with the
agents block and left main unclosed."
```

---

## Task 5: Add Skills and Connectors sections

**Files:**
- Modify: `pages/how-ai-works.html` (insert after the Artifacts section from Task 4)

**Interfaces:**
- Consumes: the section pattern established in Task 4.
- Produces: two `<section>` elements.

**Source material:** `_includes/sections/skills.html` and `_includes/sections/connectors.html` from hf-claude. Both contain claims that have gone stale. Read the spec's "Corrections to hf-claude source material" section before writing.

- [ ] **Step 1: Write the Skills section**

`id="skills"`, `data-target="skills-content"`.

Content: a Skill is a packaged set of instructions that turns the model into a specialist for one task. Build it once, and from then on it gets used automatically when you describe matching work. No more pasting the same multi-paragraph prompt.

**Critical correction.** The hf-claude footnote says Claude picks Skills automatically "instead of making you switch into a specific GPT first." That is now wrong: ChatGPT shipped Skills with the same `SKILL.md` and description-matching auto-invocation. Do not port that claim.

"Where to find it":
- **Claude:** Skills. Auto-invoked when your request matches the description.
- **ChatGPT:** Skills. Also auto-invoked on description match, or called explicitly with an @-mention. Workspace and admin-gated, off by default in many workspaces.
- **Gemini:** Gems. Manual only: you switch into a Gem before prompting.

The honest difference between Claude and ChatGPT here is **gating, not capability**. The tool that genuinely requires mode-switching is Gemini. Say it that way.

- [ ] **Step 2: Write the Connectors section**

`id="connectors"`, `data-target="connectors-content"`.

Content: connectors give the model authenticated access to the apps your work already lives in, so you can ask about real source data instead of pasting screenshots. Adapt hf-claude's Drive and Microsoft 365 cards. **Drop the Airtable card**: it is an HF-internal CRM and no advisor has one.

**Two corrections from the spec:**
1. The "read-only, by design" callout is true for Claude but not a blanket rule. ChatGPT's Apps have write actions, admin-gated and off by default. State it per-vendor.
2. Use each vendor's current name. The nouns changed and stale docs will confuse readers searching for them.

"Where to find it":
- **Claude:** Connectors
- **ChatGPT:** Apps (renamed from Connectors in December 2025)
- **Gemini:** Connected Apps (renamed from Extensions). **No Microsoft 365 connector at all**: no Outlook, no OneDrive, no SharePoint.

Give the M365 gap its own callout. For a school district running Microsoft, it is the single most decision-relevant fact in the comparison, and it is the kind of thing a reader will otherwise discover after committing.

Add the district-policy note: connectors touch school email and files, which means student records. Whether an advisor can enable one is often a district IT decision, not a personal one.

- [ ] **Step 3: Verify in the browser**

Navigate to `http://localhost:5501/pages/how-ai-works.html`. Confirm both sections render, toggle, and reflow. Confirm the page nowhere claims ChatGPT requires switching into a Custom GPT to use a Skill. No console errors.

- [ ] **Step 4: Commit**

```bash
git add pages/how-ai-works.html
git commit -m "feat: add Skills and Connectors sections to Understanding AI

Corrects two claims that went stale since the hf-claude source was
written: ChatGPT Skills now auto-invoke on description match, and
connector read-only status varies by vendor."
```

---

## Task 6: Add the sycophancy section and update Deep Research

**Files:**
- Modify: `pages/how-ai-works.html` (new section after Connectors; existing list at lines 326-332)

**Interfaces:**
- Consumes: the section pattern from Task 4.
- Produces: nothing.

**Source material:** `_includes/sections/pitfalls.html` from hf-claude.

- [ ] **Step 1: Add Claude to the existing Deep Research list**

The "Where to find it" list at lines 326-332 names ChatGPT, Gemini, and Perplexity but omits Claude, which is now the site's headline tool. Add a list item matching the existing markup:

```html
<li><strong>Claude:</strong> "Research" mode, alongside the model picker</li>
```

- [ ] **Step 2: Write the sycophancy section**

`id="agreement-trap"`, `data-target="agreement-trap-content"`, h2 reading `The Agreement Trap: When AI Just Agrees With You`.

This is the most valuable thing carried over from hf-claude and it has no equivalent on this site. It is placed last because it reframes everything above it.

Content:
- Sycophancy is a distinct failure mode from hallucination. These models have a built-in bias toward agreeing with whoever they are talking to. Come in with a half-formed opinion and it tends to validate it. Come in with a wrong one and it often validates that too.
- Cite Chandra et al. (Feb 2026), "Sycophantic Chatbots Cause Delusional Spiraling, Even in Ideal Bayesians", linking `https://arxiv.org/html/2602.19141v1`. The uncomfortable finding: knowing about sycophancy does not protect you from it. Awareness is not the fix. Habit is.
- The three habits, re-grounded for advisors:
  - **Come in with an idea, not a blank question.** Not "what should this student do?" but "I am leaning toward the welding program for this student for these reasons. Argue the other side."
  - **Ask for pushback explicitly.** "Tell me what is wrong with this plan, not what is right about it."
  - **Treat fast agreement as a signal to probe.** If it agrees flatly and fast, ask it to steel-man the opposite, or paste the inverted question into a fresh chat. If it agrees with both sides, you learned something.
- Why this section exists for this audience specifically: an advisor talking through a student's pathway is exactly the person who needs this. The cost of a validated bad plan is a student's year.
- The hard rule from hf-claude, adapted: never send AI output to a student, family, or employer without reading it yourself. It can write the first draft. It cannot write the last one.
- The closing note from hf-claude's footnote: this applies to every large language model, not just one product. It is a trait of how they are built.

- [ ] **Step 3: Verify in the browser**

Navigate to `http://localhost:5501/pages/how-ai-works.html`. Confirm:
- The Deep Research list now names Claude
- The new section renders last and toggles
- The arxiv link opens in a new tab
- No console errors

- [ ] **Step 4: Full-page regression check**

All five new sections now exist. Confirm the whole page still works:
- Every collapsible on the page toggles, old sections included (a duplicate `data-target` or `id` would break this silently, and `id="tools"` already exists on this page: make sure nothing collides)
- The nav renders and Understanding AI is marked active
- At 400px, no horizontal scroll on the body
- `browser_console_messages` is clean

Duplicate id check:

```bash
grep -o 'id="[^"]*"' pages/how-ai-works.html | sort | uniq -d
```

Expected: no output. Any output is a collision that must be fixed.

- [ ] **Step 5: Commit**

```bash
git add pages/how-ai-works.html
git commit -m "feat: add agreement trap section and Claude to Deep Research

Carries over the sycophancy material from the hf-claude reference,
re-grounded for advisors. Nothing on this site covered sycophancy,
and an advisor talking through a student's pathway is the reader who
most needs it."
```

---

## Task 7: Terminology sweep

The site predates the rootEd naming and carries the old terms in four places. None are in files the earlier tasks touch, so this is its own task. Verified present as of writing.

**Files:**
- Modify: `README.md:1`, `:3`, `:9`; `index.html:6`; `pages/prompts.html:55`

**Interfaces:**
- Consumes: nothing.
- Produces: a clean terminology grep, which Task 8 depends on.

- [ ] **Step 1: Fix the README**

Line 1 reads `# AI Training for Heartland Forward Career Coaches`. Line 3 reads `...for Heartland Forward rooted Career coaches.` Line 9 reads `- Best practices for integrating AI tools into career coaching`.

Replace "Career Coaches" and "rooted Career coaches" with "rootEd Advisors" and "rootEd advisors" respectively. Line 9 becomes `- Best practices for integrating AI tools into advising work`.

Do not write "career coach" in the replacement. That is a separate Arkansas Department of Education program serving 120 districts, not an old name for this one. Conflating them is the specific error this task exists to prevent.

- [ ] **Step 2: Fix the index.html meta description**

Line 6 reads:

```html
<meta name="description" content="AI Training Resources for Heartland Forward Rooted Advisors - Learn to use AI tools to enhance your career coaching work.">
```

Two problems: "Rooted" is the wrong styling, and "career coaching work" is the wrong program. Replace with:

```html
<meta name="description" content="AI Training Resources for Heartland Forward rootEd Advisors. Learn to use AI tools to enhance your advising work.">
```

Note the hyphen also becomes a period, per the no-em-dash-or-stray-dash house style.

- [ ] **Step 3: Fix the prompts.html reference**

Line 55, inside the commented-out outreach email prompt, reads `- I work with Heartland Forward's Rooted program`. Change `Rooted` to `rootEd`.

The section stays commented out. This is a one-word styling fix to content that already exists, not a decision to publish it.

- [ ] **Step 4: Verify**

Two checks, and the case sensitivity is load-bearing. A `-i` flag makes the second check unsatisfiable, because case-insensitive matching cannot tell `rootEd` from `rooted`.

```bash
grep -rniE 'career coach' pages/ index.html components/ README.md
```
Expected: no output. Case-insensitive is correct here: there is no legitimate use of the phrase on this site.

```bash
grep -rnE '\b(rooted|Rooted|ROOTED)\b' pages/ index.html components/ README.md | grep -v 'heartlandforward.org'
```
Expected: no output. Case-SENSITIVE, and it excludes heartlandforward.org URLs, whose `/rooted/` slugs are a slug artifact rather than a styling error and must not be "corrected".

```bash
grep -rno 'root[eE]d' pages/ index.html components/ README.md
```
Expected: every hit reads `rootEd`.

Load `http://localhost:5501/index.html` and confirm the page still renders (a malformed meta tag would not visibly break, so check the page source rather than trusting the render).

- [ ] **Step 5: Commit**

```bash
git add README.md index.html pages/prompts.html
git commit -m "docs: correct terminology to rootEd advisors

The site used 'Career Coaches' and 'Rooted Advisors'. The program is
styled rootEd, and 'career coach' is a separate Arkansas Department of
Education program that rootEd builds on rather than replaces."
```

---

## Task 8: Final review

**Files:** none modified unless issues are found.

- [ ] **Step 1: Check every constraint from the Global Constraints section**

```bash
grep -rniE 'career coach|rooted advisor|ROOTED advisor' pages/ index.html components/ README.md
```
Expected: no output. Any hit is a terminology violation. Task 7 should have cleared these.

```bash
grep -rn 'Claude Pro\|Claude Max\|Claude for K-12 Teachers' pages/ index.html
```
Expected: no output.

```bash
grep -rn '—' pages/get-access.html
```
Expected: no output (no em dashes). Note: verbatim quotes from OpenAI containing "K–12" use an en dash and are allowed inside quotations.

- [ ] **Step 2: Check the deadline claims did not cross-contaminate**

```bash
grep -n -A5 -B5 'June 30, 2027' pages/
```
Every hit must be in a Claude context. If any appears near ChatGPT, fix it.

- [ ] **Step 3: Confirm nothing from the do-not-publish list appears**

Re-read the spec's "Do not publish" section and grep the new content for each item. Particular attention to: what happens when the free year ends, a deletion SLA number, an OpenAI turnaround time, a specific OpenAI June day, and a claim that ChatGPT Canvas renders live apps.

- [ ] **Step 4: Verify all five pages load clean**

Load each of `index.html`, `pages/how-ai-works.html`, `pages/resources.html`, `pages/get-access.html`, `pages/prompts.html` over the server. Each must show the nav, mark the right link active, and log no console errors. `pages/prompts.html` is included as an untouched control: if it broke, the shared header changed in a way it should not have.

- [ ] **Step 5: Push the branch and open a PR**

```bash
git push -u origin add-claude-for-teachers
```

Do not merge to main. Open a PR for review.

---

## Notes for the implementer

**Do not invent facts.** Every claim on these pages traces to an official source recorded in the spec. If you find yourself wanting to state something the spec does not cover, leave it out and flag it. The spec's do-not-publish list exists because the research specifically could not confirm those items, not because they were overlooked.

**This content has a shelf life.** Model names, tier labels, and feature names are the first things that will go stale: three vendor renames happened in the eight months before this was written. That is why tiers are described by shape rather than version number, and why both pages carry a July 2026 stamp.

**Read the whole spec before Task 1.** The facts and the reasoning behind them are all there, and several tasks depend on knowing why a claim is worded the way it is.
