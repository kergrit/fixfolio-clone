# Fixfolio Clone

Static HTML clone of [fixfolio.ai/home/en](https://fixfolio.ai/home/en) served locally via Vite.

## Tech Stack

- **Vite** - Dev server & build tool
- **jQuery / jQuery UI** - DOM manipulation & UI interactions
- **fullpage.js** - Full-screen scrolling sections
- **Swiper** - Touch slider/carousel
- **Pretendard** - Web font (loaded from CDN)

## Project Structure

```
fixfolio-clone/
├── index.html          # Main page (SSR HTML from original site)
├── vite.config.js      # Vite configuration
├── public/
│   ├── css/            # Stylesheets (layout, swiper, fullpage, etc.)
│   └── js/             # Scripts (jQuery, fullpage, swiper, lib)
└── package.json
```

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Build & Deploy

```bash
# Build for production
npm run build

# Deploy to Vercel
npx vercel --prod
```

## Live Demo

https://fixfolio-clone.vercel.app

## Notes

- Images and videos are served from the original CloudFront CDN
- CSS/JS assets are stored locally in `public/`
- Tracking scripts (Facebook Pixel, Google Tag, etc.) have been removed
