# Foodsum

Foodsum is a React + Vite app that shows random high-resolution food photos from Pixabay.

## Features

- Random food photo on initial load.
- "Random photo" button to fetch a new image.
- Smooth transition between images.
- Dynamic background color based on the selected photo.
- Link to the original Pixabay page and photo author attribution.

## Tech Stack

- React 19
- Vite 8
- CSS Modules
- Pixabay REST API

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create `.env` from `.env.example` and provide your Pixabay API key:

```bash
cp .env.example .env
```

```env
VITE_PIXABAY_KEY=your_pixabay_api_key_here
```

You can get a key at [pixabay.com/api/docs](https://pixabay.com/api/docs/).

### 3. Run in development mode

```bash
npm run dev
```

## Available Scripts

- `npm run dev` - start local dev server.
- `npm run build` - build production bundle into `dist/`.
- `npm run preview` - preview the production build locally.
- `npm run lint` - run ESLint.

## Production Build

```bash
npm run build
```

The output will be generated in `dist/`.

## Deploy

The repository includes `firebase.json` configured for Firebase Hosting with SPA rewrites to `index.html`.

