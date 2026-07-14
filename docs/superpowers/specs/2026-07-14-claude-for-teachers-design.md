# Claude for Teachers and cross-vendor AI concepts

Design doc. 2026-07-14.

## Problem

Anthropic launched Claude for Teachers on 2026-07-14, free for verified US K-12 educators. The ai-training site has no Claude content at all, and what it does say about Anthropic's education offering is wrong: `pages/resources.html` carries a commented-out Key Takeaways block asserting "Claude for Education (higher ed only)" under a "What's NOT K-12" heading.

Separately, the site teaches AI concepts (tokens, context windows, modalities, thinking models, tools, deep research) but omits the four concepts that most change how someone actually works: Projects, Artifacts, Skills, and Connectors.

A companion repo, `will-trolinger/hf-claude`, already covers all four for the Heartland Forward internal team, in a voice that got good feedback. That content is the raw material for this work, but it needs re-grounding for a different audience and correcting in two places where it has gone stale.

## Audience

rootEd advisors. Styled **rootEd**: lowercase r-o-o-t, capital E, lowercase d. Never "rooted", never "ROOTED". In prose, "rootEd advisor" with a lowercase a.

They are embedded full-time in rural high schools, work one-on-one with seniors on FAFSA completion, career exploration, ICAP planning, and employer connections. They hold school-issued educator email addresses and have already cleared ChatGPT for Teachers verification, which settles the eligibility question empirically.

Note for future editors: "career coach" is **not** an older name for rootEd advisor. It is a separate Arkansas Department of Education program (Division of Career and Technical Education) serving 120 school districts, which rootEd builds on and coexists with. The two should not be merged. This site is for rootEd advisors.

## Scope

Three content changes plus wiring.

### 1. `pages/how-ai-works.html` gains five sections

Projects, Artifacts, Skills, Connectors, and a watch-outs section on sycophancy. Each follows the page's existing house style exactly: a `<section class="content-section">` containing an `<h2 class="collapsible-header" data-target="...">`, a sibling `<div class="collapsible-content" id="...">`, prose, and a table with `data-label` attributes on every `<td>` for the mobile card reflow.

Each section closes with a "Where to find it" list naming the Claude, ChatGPT, and Gemini equivalents. This is not a new convention: the existing Deep Research section already ends with exactly this pattern, listing ChatGPT, Gemini, and Perplexity. Claude gets added to that existing list, which currently omits it.

Content is adapted from the corresponding hf-claude sections with HF-internal examples (grants, funders, Airtable CRM, district maps) replaced by advisor work (FAFSA nights, employer outreach, senior caseloads, ICAP planning).

The fifth section carries the sycophancy material from hf-claude `pitfalls.html`. It has no equivalent on this site, and an advisor talking a student through a pathway decision is precisely the reader who needs to know the model will validate a half-formed plan. It includes the Chandra et al. finding that awareness alone does not protect against the effect, and the three habits that do: come in with an idea rather than a blank question, ask for pushback explicitly, treat fast agreement as a signal to probe.

### 2. `pages/get-access.html` (new)

Walkthroughs for the two offers a rootEd advisor can self-verify for on a school-issued email: Claude for Teachers and ChatGPT for Teachers.

Requirements this page must satisfy:

- Name **Goodstack** up front as Anthropic's verification partner. An advisor handed off mid-flow to an unfamiliar third party asking for a pay stub will reasonably read it as phishing and abandon. Saying so in advance is the difference between a completed and an abandoned verification.
- Frame timing as a "do this now" instruction. Most reviews finish in 24 hours, up to 3 days when busy. The failure mode is starting verification the night before it is needed.
- Quote eligibility verbatim rather than paraphrasing. Any paraphrase risks asserting a claim the vendor did not make.
- Draw the deadline distinction (below) in a table. This is the single most publishable error in the project.
- Call out that accepting pulls the account under the K-12 Terms of Service and Student Data Processing Addendum, a different agreement than consumer Claude. This is the substantive reason to verify rather than use a personal account near student data.

Gemini is excluded from this page. See "Rejected" below.

### 3. `pages/resources.html` updated

- Add a Claude for Teachers row to the Free Tools table.
- Delete the stale "Claude for Education (higher ed only)" line from the commented-out Key Takeaways block.
- Change the "Updated November 2025" stamp to July 2026.
- Reframe the Gemini row: free but admin-gated, and possibly already on.

### Wiring

- Nav link in `components/header.html` (the nav is shared and injected at runtime by `js/header.js`, so this is the only place it needs adding).
- A fourth card on `index.html`, matching the existing `doc-card` pattern.
- `pages/prompts.html` is untouched.

## Verified facts

Every claim below was confirmed against an official source. The two deadline structures are the highest-risk item.

### Claude for Teachers

- Product name is **Claude for Teachers**. The solutions page is titled "Claude for K-12 teachers" but the product name in the blog, support article, and in-product modal is Claude for Teachers. Use the latter.
- Launched 2026-07-14. The K-12 Terms of Service carry the same effective date.
- Eligibility, verbatim from `support.claude.com/en/articles/15926041`: "Claude for Teachers is for individual educators working in US K-12 schools: Classroom teachers, in any subject and any grade from kindergarten through 12th; Instructional coaches, specialists, and interventionists; Librarians, counselors, and other certificated staff." And: "Important: Claude for Teachers is not for students. It's an educator-only offering."
- Verification needs, verbatim from the live modal at `claude.ai/teachers`: "Your school (US K-12, public or private). A Claude account that uses your school-issued email. One document showing your role, like a school ID, contract, pay stub, or certificate."
- Also verbatim from the modal: "Claude for Teachers is for educators only, and you must be 18 or older. Reviews are handled by Anthropic's verification partner, Goodstack, and most finish within 24 hours, though they can take up to 3 days during busy periods."
- Verification partner is **Goodstack**, not SheerID. Third-party blogs widely claim SheerID; they are wrong, likely contaminated from ChatGPT's flow. This is only visible in the live modal.
- Cost, verbatim and confirmed on three official sources: "Sign up by June 30, 2027 for your full year of free access." This is a **signup deadline**. The free year runs one year from signup.
- Tier: Pro-level features on a Teams-plan substrate. The support article says "Claude Pro-level features, with Claude Code and Cowork" and "a free Claude for Teams plan for verified educators". Neither the solutions page nor the announcement contains the word "Pro" or "Max". Say "Pro-level features", not "Claude Pro".
- Training off by default: "Training is off by default for every verified educator account."
- The account is the prerequisite people miss: sign up with the school address, not a personal one.

### ChatGPT for Teachers

- Launched 2025-11-19, about eight months before Anthropic's.
- Eligibility, verbatim from `help.openai.com/en/articles/12844995`: "You are eligible if you: Work for an accredited U.S. K–12 school or district, and Are a teacher, staff member, school leader, or district administrator".
- Verification partner is **SheerID**.
- Cost: "free through June 2027". A **fixed end date** for everyone regardless of signup date. OpenAI publishes no day of the month. Do not write "June 30, 2027" for OpenAI; that date belongs to Anthropic.
- Not Plus and not Pro. A distinct workspace product.
- ChatGPT Team has been renamed **ChatGPT Business**.

### The deadline distinction

| | Claude for Teachers | ChatGPT for Teachers |
|---|---|---|
| Shape | Signup deadline | Fixed end date |
| Date | Sign up by June 30, 2027 | Free through June 2027 |
| What you get | One year free from your signup date | Free until the cliff, whenever you joined |
| Day published? | Yes | No |

### Cross-vendor equivalents

- **Projects**: Claude Projects, ChatGPT Projects (near parity). Gemini has **no true equivalent**. The closest are Gems (instructions and files, but a persona you switch into) and Drive projects (files, no standing instructions). Neither does both.
- **Artifacts**: Claude Artifacts, ChatGPT Canvas, Gemini Canvas (name current, not renamed). Gemini's Canvas is manually invoked; Claude opens Artifacts on its own.
- **Skills**: Claude Skills and ChatGPT Skills **both auto-invoke on description match**. Gemini Gems are manual-select only.
- **Research**: Claude Research mode, ChatGPT deep research, Gemini Deep Research. All current names.
- **Connectors**: Claude Connectors, ChatGPT **Apps** (renamed from Connectors, 2025-12-17), Gemini **Connected Apps** (renamed from Extensions). Gemini has **no Microsoft 365 connector** at all: no Outlook, OneDrive, or SharePoint. For a district on Microsoft, this decides the tool.
- **Model tiers**: describe by shape (fast / balanced / heavy), not version numbers. Gemini is a two-rung Flash/Pro ladder plus Deep Think, an Ultra-only reasoning mode. Presenting Gemini as a three-tier parallel to Claude would be inaccurate.

### Corrections to hf-claude source material

Two claims in the source repo have gone stale and must not be ported as written.

1. **The Skills footnote is wrong.** It says Claude "picks a relevant Skill automatically when your request matches, instead of making you switch into a specific GPT first." OpenAI has since shipped Skills with the same `SKILL.md` and description-matching design, verified directly at `learn.chatgpt.com/docs/build-skills` and `developers.openai.com`. The claim now holds only against Custom GPTs, which still exist and still require manual selection but are no longer the right comparison. The durable difference is **gating, not capability**: OpenAI's Skills are workspace/admin-gated and default-off until 2026-07-23. The vendor that genuinely requires mode-switching is Gemini.
2. **The "read-only, by design" connector callout needs a caveat.** True for Claude. ChatGPT's Apps have write actions, admin-gated and default-off, not absent. State it per-vendor rather than as a blanket claim.

Also: the Airtable connector card does not port. It is an HF-internal CRM; a rootEd advisor has no Airtable. Drive and M365 stay.

## Do not publish

No official source states these. Leave them out rather than guessing.

- What happens to a Claude account when the free year ends. Anthropic is silent. (OpenAI does address its own: "we may introduce or adjust pricing".)
- Anthropic's student-data deletion SLA number. The solutions page asserts "a defined SLA" and never publishes a duration.
- OpenAI's exact June 2027 day.
- OpenAI's verification turnaround time.
- Whether Anthropic covers administrators or paraprofessionals. Unlisted, not excluded.
- Whether ChatGPT Canvas renders live interactive apps the way Artifacts do. Research contradicted itself on this. Describe Canvas as a document and code surface; omit live-app parity unless verified in the UI.
- Any active Google AI Pro student offer. The terms found expired 2026-04-30 and were higher-ed and 18+ only, so it never applied to high schoolers regardless.
- Google AI Plus and AI Pro pricing. Sources conflict.
- Exact model-picker labels at any vendor. Rollouts are gradual.

Both new and edited pages carry a "verified as of July 2026" stamp. Model names and tier labels are the first thing that will go stale.

## Rejected

- **Gemini on the get-access page.** Gemini for Education is free but admin-gated: "your administrator must have enabled access to Gemini Apps for your account." There is no self-serve path for an individual educator. It stays a resources row, framed honestly as "free, admin-gated, and you may already have it" (it is on by default for 18+ users in domains that have not opted out) rather than "go sign up".
- **Cowork and Dispatch.** Both need the desktop app and a machine the user controls. That does not match an advisor on a school-managed laptop. Claude for Teachers does include Cowork, so this may be worth revisiting.
- **Reworking how-ai-works to remove overlap.** The four new sections are additive; nothing on the existing page duplicates them.

## Success criteria

- A rootEd advisor can go from this site to a verified Claude for Teachers account without getting spooked by Goodstack or stalling on which email to use.
- No reader conflates the two deadline structures.
- Every quoted line is verbatim from an official source, and no claim on the do-not-publish list appears.
- New sections are indistinguishable in style from the existing ones: same collapsible pattern, same table markup, same mobile reflow.
