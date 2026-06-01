# Foodsum

Foodsum is a React + Vite app that shows a random high-resolution food photo from Pixabay.

## Features

- Random food photo on page load and by button click
- Smooth transition between image requests
- Dynamic gradient background generated from the current image colors
- Link to original Pixabay page and photo author

## Tech Stack

- React 19
- Vite 8
- CSS Modules
- Pixabay API

## Requirements

- Node.js 18+ (recommended 20+)
- npm
- Pixabay API key

## Environment Variables

Create a `.env` file in the project root:

```env
VITE_PIXABAY_KEY=your_pixabay_api_key_here
```

You can copy the template from `.env.example`.

## Getting Started

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview production build locally:

```bash
npm run preview
```

Run lint:

```bash
npm run lint
```

## Deployment

The project includes Firebase Hosting config (`firebase.json`) and is configured to serve files from `dist`.

Typical deploy flow:

```bash
npm run build
firebase deploy
```

## Project Structure

```text
src/
  components/      # UI components (Header, Footer, ImageCard, RandomButton)
  services/        # API calls (Pixabay)
  styles/          # Global styles
  App.jsx          # Main app logic and UI
```
