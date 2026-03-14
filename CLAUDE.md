# Fixfolio Clone

## Project Overview
Static HTML clone of fixfolio.ai/home/en. NOT a React/SvelteKit app — pure static HTML served by Vite.

## Commands
- `npm run dev` — Start dev server on port 5173
- `npm run build` — Build for production
- `npx vercel --prod` — Deploy to Vercel

## Architecture
- `index.html` — Single-page SSR HTML extracted from original SvelteKit site (~62KB)
- `public/css/` — Local CSS files (layout.css is the main one at 120KB)
- `public/js/` — jQuery, fullpage.js, swiper.js, lib.js
- `src/` — Legacy React components from first attempt, NOT used
- Images/videos load from CloudFront CDN (d33jicazpreer9.cloudfront.net)

## Gotchas
- `#wrap` element needs `opacity: 1` — original site sets this via SvelteKit hydration JS
- npm cache may have root-owned files — use `--cache /tmp/npm-cache` if EACCES errors
- Node 20.18.3 — use Vite 5 (Vite 8 is incompatible)
- SvelteKit modulepreload/hydration scripts are removed — only static HTML matters
- Git push needs `gh auth token` for HTTPS auth (no SSH key configured)

## Deployment
- Vercel account: kergrit-3907
- GitHub repo: kergrit/fixfolio-clone
