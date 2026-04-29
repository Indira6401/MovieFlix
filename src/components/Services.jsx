import { updateSearchTermCount, getTrendingMovies } from "../firebase";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

export const fetchMovies = async (query) => {
  const endPoint = query
    ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
    : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

  const response = await fetch(endPoint, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      accept: "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
  });

  if (!response.ok) throw new Error("Failed to fetch movies. Please try again later.");

  const data = await response.json();

  if (!data.results || data.results.length === 0) throw new Error("No movies found.");

  if (query) updateSearchTermCount(query, data.results[0]);

  return data.results;
};

export const fetchTrendingMovies = async () => {
  return await getTrendingMovies();
};
