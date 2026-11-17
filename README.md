# AI Training for Heartland Forward rootEd Advisors

This repository hosts a GitHub Pages site dedicated to providing AI training resources and materials for Heartland Forward rootEd advisors.

## Purpose

This site serves as a centralized hub for:
- AI training materials and resources
- Best practices for integrating AI tools into advising work
- Interactive learning modules
- Documentation and guides

## GitHub Pages Site

Live at https://heartland-forward.github.io/ai-training/, deployed by GitHub Pages from `main`.

## Structure

- `index.html` - Landing page
- `pages/` - Understanding AI, Resources, Prompts, and Survey
- `components/header.html` - Shared header and nav, injected on every page by `js/header.js`. `js/header.js` keeps a copy to fall back on when the file can't be fetched (pages opened straight from disk), so update both when the nav changes
- `js/collapsible.js` - Opens and closes the section cards
- `js/toc.js` - The "On this page" sidebar on long pages
- `js/copy.js` - Copy buttons on prompts
- `js/motion.js` - Fade-ins on every page and the home page chat demo, off for reduced-motion users
- `css/` - Stylesheets (see Design below)
- `images/` - Diagrams, branding, and `og.png`, the link-preview image
- `scripts/og/og-image.html` - Source for `images/og.png`; instructions inside

## Previewing locally

The header is loaded with JavaScript, so open the site through a local server rather than by double-clicking a file:

```
python3 -m http.server 8000
```

Then visit http://localhost:8000.

## Design

The structure follows the MRI design system as used in skilled-workforce (PR #372). The look on top follows heartlandforward.org: their blue (#2d368f) and green (#019966), a soft mint-to-blue wash behind page headers, light blue-tint cards with a bar on top, and near-square corners. Motion lives in `js/motion.js` and is off for anyone who prefers reduced motion.

- `css/base.css`, `css/shared.css`, and `css/footer.css` are exact copies from skilled-workforce. Do not edit them here: change them there and copy them across, so the repos stay comparable.
- `css/tokens.css` holds the colors, type, and spacing values, including the Heartland Forward blue and panel tints.
- `css/style.css` holds everything specific to this site.

## Sourcing

Vendor details (prices, eligibility, dates) are checked against the vendor's own pages. When you add or update one, leave an HTML comment next to it naming the source and the month you checked it.

## Getting Started

To enable GitHub Pages:
1. Go to repository Settings
2. Navigate to Pages section
3. Select the branch (main) and root folder
4. Save and wait for deployment

## Contributing

This is a private repository for Heartland Forward. Please contact the repository administrator for access and contribution guidelines.