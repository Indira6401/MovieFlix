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
## Features

- Browse popular movies
- Search movies with debounced input
- Track successful searches in Firestore
- Show top trending searches

## Architecture

- `src/App.jsx`: main container for state, effects, TMDB fetches, and page rendering
- `src/firebase.js`: Firebase setup plus Firestore read/write logic for trending searches
- `src/hooks/useDebounce.js`: delays search updates before requests fire
- `src/components/`: UI components for search, loading, and movie cards

Current flow:
```text
Search input -> debounced value -> TMDB fetch -> movie list render
                                   -> Firestore search count update

App load -> TMDB popular movies
         -> Firestore trending searches
```
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