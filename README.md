# AI Training for Heartland Forward rootEd Advisors

This repository hosts a GitHub Pages site dedicated to providing AI training resources and materials for Heartland Forward rootEd advisors.

## Purpose

This site serves as a centralized hub for:
- AI training materials and resources
- Best practices for integrating AI tools into advising work
- Interactive learning modules
- Documentation and guides

## GitHub Pages Site

Live at https://will-trolinger.github.io/ai-training/, deployed by GitHub Pages from `main`.

## Structure

- `index.html` - Landing page
- `pages/` - Understanding AI, Resources, Prompts, and Survey
- `components/header.html` - Shared header and nav, injected on every page by `js/header.js`
- `js/collapsible.js` - Opens and closes the section cards
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

The look follows the MRI design system as used in skilled-workforce (PR #372), so this site matches the other Heartland Forward tools.

- `css/base.css`, `css/shared.css`, and `css/footer.css` are exact copies from skilled-workforce. Do not edit them here: change them there and copy them across, so the repos stay comparable.
- `css/tokens.css` holds the colors, type, and spacing values.
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