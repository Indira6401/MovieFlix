# MovieFlix

MovieFlix is a React 19 movie discovery app built with Vite. It fetches movie data from TMDB, lets users search with a debounced input, and stores search popularity in Firebase Firestore to render a trending section.

## Tech Stack

- React 19
- Vite 8
- Tailwind CSS 4
- Firebase Firestore
- Firebase Hosting
- TMDB API

## Features

- Browse popular movies on load
- Search movies with debounced input
- Track successful searches in Firestore
- Show top 5 trending searches from Firestore

## Architecture

```
src/
├── App.jsx                    ← state, effects, rendering
├── firebase.js                ← Firestore read/write
├── hooks/
│   └── useDebounce.js         ← delays search before fetch fires
└── components/
    ├── Services.jsx            ← pure data-fetching (TMDB + Firestore)
    ├── Search.jsx              ← search input UI
    ├── MovieCard.jsx           ← single movie card UI
    └── Spinner.jsx             ← loading indicator
```

### Layers

1. **Presentation** — `Search.jsx`, `MovieCard.jsx`, `Spinner.jsx`
   Renders UI only, no logic or state.

2. **Container** — `App.jsx`
   Owns all state and effects. Calls services, handles loading/error states, decides what to render.

3. **Service** — `components/Services.jsx`
   Pure data-fetching layer. No React state. Returns data or throws. `App.jsx` decides what to do with the result.

4. **Data** — `firebase.js`
   Firebase setup and Firestore operations (read trending, write search count).

5. **Hook** — `hooks/useDebounce.js`
   Delays updating the search value so TMDB is not called on every keystroke.


## Run Locally

```bash
npm install
npm run dev
```

## Deploy

```bash
npm run build
firebase deploy --only hosting
```