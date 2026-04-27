# MovieFlix

MovieFlix is a React 19 movie discovery app built with Vite. It fetches movie data from TMDB, lets users search with a debounced input, and stores search popularity in Firebase Firestore to render a small trending section.

## Tech Stack

- React 19
- Vite 8
- Tailwind CSS 4
- Firebase
- Cloud Firestore
- TMDB API

## What The App Does

- Loads popular movies on first render
- Searches movies from TMDB as the user types
- Debounces search input to reduce API requests
- Tracks successful search terms in Firestore
- Displays top trending searches from Firestore

## Architecture Overview

The app is currently a small single-page frontend with one top-level container component and a few focused UI helpers.

### Layers

1. Presentation layer
   - `src/components/search.jsx`
   - `src/components/MovieCard.jsx`
   - `src/components/spinner.jsx`

2. Page/container layer
   - `src/App.jsx`
   - Owns state, effects, API calls, loading states, and rendering decisions

3. Reusable hook layer
   - `src/hooks/useDebounce.js`
   - Delays search updates before network requests are triggered

4. Data/service layer
   - `src/firebase.js`
   - Reads and writes trending-search data in Firestore
   - `fetch(...)` calls inside `src/App.jsx`
   - Reads movie data from TMDB

### Runtime Flow

```text
User types in Search
  -> searchTerm state updates
  -> useDebounce waits 500ms
  -> debouncedSearchTerm changes
  -> App fetches movies from TMDB
  -> movieList updates
  -> first result is used to update Firestore search count

App mounts
  -> fetch popular movies from TMDB
  -> fetch top trending searches from Firestore
  -> render Trending Movies + All Movies sections
```

### Data Flow

```text
TMDB API
  -> popular/discover movies
  -> search results
  -> UI cards in MovieFlix

Firestore
  -> stores searchTerm, count, movie_id, poster_url
  -> returns top 5 searches ordered by count
  -> UI trending strip
```

## Project Structure

```text
movieflix/
├── public/
│   ├── hero.png
│   ├── hero-bg.png
│   ├── logo.png
│   ├── no-poster.png
│   ├── search-icon.svg
│   └── star.svg
├── src/
│   ├── components/
│   │   ├── MovieCard.jsx
│   │   ├── search.jsx
│   │   └── spinner.jsx
│   ├── hooks/
│   │   └── useDebounce.js
│   ├── App.jsx
│   ├── firebase.js
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── eslint.config.js
├── index.html
├── package.json
└── vite.config.js
```

## Key Files

### `src/App.jsx`

- Main orchestration component
- Holds movie, search, loading, and error state
- Fetches movies from TMDB
- Fetches trending entries from Firestore

### `src/firebase.js`

- Initializes the Firebase app
- Connects to Cloud Firestore
- Updates search counts in the `moviemetrics` collection
- Fetches the top 5 trending searches

### `src/hooks/useDebounce.js`

- Prevents rapid API requests while the user is typing

### `src/components/*`

- `search.jsx`: controlled search input
- `MovieCard.jsx`: movie display card
- `spinner.jsx`: loading indicator

## Environment Variables

Create a `.env.local` file in `movieflix/` with these values:

```env
VITE_TMDB_API_KEY=your_tmdb_bearer_token
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
```

## Firestore Data Model

The app expects a Firestore collection named `moviemetrics` with documents shaped like:

```text
searchTerm: string
count: number
movie_id: number
poster_url: string
```

`getTrendingMovies()` orders by `count` descending and limits results to 5.

## Getting Started

```bash
npm install
npm run dev
```

Open the local Vite URL shown in the terminal.

## Available Scripts

- `npm run dev` starts the development server
- `npm run build` creates a production build
- `npm run preview` previews the production build locally
- `npm run lint` runs ESLint

## Current Architectural Notes

- The project is simple and easy to follow because most logic lives in one place.
- `App.jsx` currently mixes view orchestration and TMDB fetching logic, which is acceptable for a small app but will get harder to maintain as features grow.
- A natural next step would be to move TMDB requests into a dedicated service such as `src/services/tmdb.js`.
- If the app grows further, trending state and movie-search state could also be split into feature hooks like `useMovies` and `useTrendingMovies`.

## Suggested Next Refactor

If you want to scale this project cleanly, use this direction:

```text
src/
├── components/
├── features/
│   ├── movies/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── services/
│   └── trending/
│       ├── components/
│       ├── hooks/
│       └── services/
├── lib/
└── main.jsx
```

That would separate:

- UI components
- feature-specific hooks
- third-party API access
- shared utilities

## Notes

- `src/App.css` still contains default Vite starter styles and does not appear to drive the current UI.
- `src/appwrite.js` is still present in the repo, but the current app flow uses `src/firebase.js`.
- There is also a sibling `trending-movies/` folder in the workspace, but this README documents the `movieflix/` app only.
