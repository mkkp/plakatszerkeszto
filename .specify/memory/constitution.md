<!--
Sync Impact Report
Version change: template → 1.0.0
Modified principles: All principles replaced with web app specific principles
Added sections: Web Application Standards, Development Workflow
Removed sections: None (template sections filled)
Templates requiring updates:
✅ .specify/templates/plan-template.md - Constitution Check section updated
✅ .specify/templates/spec-template.md - No changes needed
✅ .specify/templates/tasks-template.md - No changes needed
Follow-up TODOs: None
-->

# MKKP Plakátszerkesztő Constitution

## Core Principles

### I. Static-First Architecture
All functionality MUST be implemented as client-side JavaScript with no server-side dependencies. The application MUST work entirely in the browser using Webpack for bundling and GitHub Pages for deployment. Rationale: Enables zero-cost hosting and maximum reliability.

### II. User-Centric Design
Every poster type MUST provide intuitive controls with real-time preview. Text inputs MUST support Hungarian characters and proper typography. Image upload MUST work seamlessly across modern browsers. Rationale: Political campaigns require rapid poster generation without technical barriers.

### III. Progressive Enhancement
The application MUST function without JavaScript for basic content display. Core poster templates MUST be accessible via semantic HTML. JavaScript enhancements MUST degrade gracefully. Rationale: Ensures accessibility and search engine visibility.

### IV. GitHub Pages Deployment
All builds MUST produce static assets compatible with GitHub Pages. Deployment MUST be automated via GitHub Actions. The application MUST be accessible at https://plakat.mkkp.party. Rationale: Provides reliable, cost-effective hosting for political campaigns.

### V. Hungarian Language Support
All user interfaces MUST be available in Hungarian. Fonts MUST support Hungarian character sets. Date formats MUST follow Hungarian conventions. Rationale: Serves the primary Hungarian-speaking user base effectively.

## Web Application Standards

### Technology Stack
- Frontend: JavaScript, jQuery, EJS templates, SCSS
- Build: Webpack with Babel for ES6+ support
- Styling: SCSS with responsive design principles
- Deployment: GitHub Pages with automated workflows

### Performance Requirements
- Initial load time MUST be under 3 seconds
- Poster generation MUST complete within 2 seconds
- Application MUST work offline after initial load
- Bundle size MUST remain under 2MB total

## Development Workflow

### Code Quality
- All JavaScript MUST pass ESLint validation
- SCSS MUST follow BEM methodology
- HTML MUST be semantic and accessible
- Commit messages MUST follow conventional commits

### Testing Strategy
- Manual testing REQUIRED for each poster type
- Cross-browser testing REQUIRED for Chrome, Firefox, Safari
- Mobile responsiveness testing REQUIRED
- Deployment testing REQUIRED before production releases

## Governance

This constitution supersedes all other development practices. Amendments require:
1. Documentation of the change rationale
2. Approval from project maintainers
3. Migration plan for existing functionality
4. Update to this constitution file

All pull requests and code reviews MUST verify compliance with these principles. Complexity MUST be justified with clear user benefit. Use AGENTS.md for runtime development guidance.

**Version**: 1.0.0 | **Ratified**: 2025-09-26 | **Last Amended**: 2025-09-26