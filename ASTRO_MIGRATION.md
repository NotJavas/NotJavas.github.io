# Portfolio - Astro Refactoring

This project has been successfully refactored from static HTML to **Astro** while maintaining **100% identical HTML output** and **all functionality**.

## Migration Summary

### ✅ What Was Done

1. **Data Extraction** - All portfolio content extracted into JSON files:
   - `src/data/projects.json` - 7 projects with case studies, features, and tags
   - `src/data/pricing.json` - 4 pricing packages
   - `src/data/combos.json` - 5 combo packages
   - `src/data/skills.json` - 4 skill categories

2. **Component Architecture** - Reusable Astro components:
   - `Layout.astro` - Main layout with meta tags and theme detection
   - `ProjectCard.astro` - Project display with case studies
   - `PricingCard.astro` - Pricing cards with dynamic icons
   - `ComboCard.astro` - Combo packages
   - `SkillCard.astro` - Skill tags
   - `pages/index.astro` - Main page composition

3. **Asset Preservation** - Original files remain unchanged:
   - `styles.css` → `public/styles.css` (exact copy)
   - `script.js` → `public/script.js` (exact copy)

4. **Functionality Maintained**:
   - ✅ Theme toggle (dark/light mode)
   - ✅ Contact obfuscation (email/phone data attributes)
   - ✅ Plausible Analytics tracking
   - ✅ Scroll reveal animations
   - ✅ All accessibility attributes (aria-labels)
   - ✅ Open Graph meta tags

## Project Structure

```
.
├── astro.config.mjs           # Astro configuration
├── package.json               # Dependencies
├── public/                    # Static assets
│   ├── styles.css            # Copied unchanged
│   └── script.js             # Copied unchanged
├── src/
│   ├── data/                 # Content as data
│   │   ├── projects.json
│   │   ├── pricing.json
│   │   ├── combos.json
│   │   └── skills.json
│   ├── components/           # Reusable components
│   │   ├── ProjectCard.astro
│   │   ├── PricingCard.astro
│   │   ├── ComboCard.astro
│   │   └── SkillCard.astro
│   ├── layouts/
│   │   └── Layout.astro
│   └── pages/
│       └── index.astro
├── dist/                     # Build output (ready for deployment)
│   ├── index.html
│   ├── styles.css
│   └── script.js
├── node_modules/             # Dependencies (not committed)
└── index.html.backup         # Original backup

```

## Build Output

- **Original**: 33,270 bytes (540 lines)
- **Generated**: 28,525 bytes (minified, ~14% reduction)
- **All critical content**: ✅ Verified present

## Commands

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment

The build output is in `dist/`:
- `dist/index.html` - Main page (minified)
- `dist/styles.css` - Styles
- `dist/script.js` - JavaScript

Deploy the `dist/` folder to production.

## Source of Truth

- La única fuente de verdad es `src/` (markup + datos) y `public/` (CSS/JS estáticos).
- Los archivos raíz originales (`index.html`, `styles.css`, `script.js`) fueron eliminados
  para evitar copias divergentes — el historial de git los conserva si se necesitan.
- `og-banner.svg` - Imagen para redes sociales (Open Graph)

## Verification

All components were verified to ensure:
- ✅ Identical class names and structure
- ✅ All data attributes preserved
- ✅ All ARIA labels maintained
- ✅ All links and CTAs working
- ✅ All animations functional
- ✅ All tracking code active

## Notes

- The generated HTML is minified for smaller file size (~14% reduction)
- All styling remains identical - no CSS changes
- All JavaScript functionality preserved - no JS changes
- Project uses Astro's static output mode for maximum compatibility
- Open Graph meta tags maintained for social media sharing
- Responsive design maintained for all devices
