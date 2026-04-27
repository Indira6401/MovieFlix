import { useEffect, useState } from "react";
import useDebounce from './hooks/useDebounce';
import Search from "./components/search";
import Spinner from "./components/spinner";
import MovieCard from "./components/moviecard";
import { updateSearchTermCount, getTrendingMovies } from "./firebase";

const API_BASE_URL = "https://api.themoviedb.org/3";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
   const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  const [errorMessage, setErrorMessage] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [trendingMovies, setTrendingMovies] = useState([]);
  const [trendingMovieListError, setTrendingMovieListError] = useState("");
  const [trendingMoviesLoading, setTrendingMoviesLoading] = useState(false);

// Debounce the search term to prevent making too many API requests
  // by waiting for the user to stop typing for 1500ms
  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm])

  useEffect(() => {
    const fetchMovies = async (query) => {
      setErrorMessage("");
      setIsLoading(true);
      try {
        const endPoint = query ?
          `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}` :
          `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
        const response = await fetch(endPoint, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
            Authorization: `Bearer ${API_KEY}`,
          },
        });

        if (!response.ok) {
          setErrorMessage("Failed to fetch movies. Please try again later.");
          return;
        }
        const data = await response.json();

        if (!data.results || data.results.length === 0 || data.results === false) {
          setErrorMessage("No movies found.");
          return;
        }

        setMovieList(data.results);
        if (query && data.results.length > 0) {
          updateSearchTermCount(query, data.results[0]);
        }
      } catch (error) {
        console.error(`Error fetching movies: ${error}`);
        setErrorMessage("Failed to fetch movies. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    const fetchTrendingMovies = async () => {
      setTrendingMoviesLoading(true);
      try {
        const movies = await getTrendingMovies();
        setTrendingMovies(movies);
        console.log("Trending movies fetched successfully:", movies);
      } catch (error) {
        console.error("Error fetching trending movies:", error);
        setTrendingMovieListError("Failed to fetch trending movies. Please try again later.");
      } finally {
        setTrendingMoviesLoading(false);
      }
    };
    fetchTrendingMovies();
  }, []);

  const renderMovieContent = () => {
    if (isLoading) {
      return <Spinner />;
    }
    if (errorMessage) {
      return <p className="text-red-500">{errorMessage}</p>;
    }
    return (
      <ul>
        {movieList.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </ul>
    );
  };

  const trendingMoviesList = () => {
    if(trendingMoviesLoading) {
      return <Spinner/>
    }
    if (trendingMovieListError) {
      return <p className="text-red-500">{trendingMovieListError}</p>;
    }
    return (
            trendingMovies.map((movie, index) => (
              <li key={movie.id}>
                <p>{index + 1}</p> 
                <img src={movie.poster_url} alt={movie.title} />
              </li>
            ))
    )
  }
  return (
    <main>
      <div className="pattern" />
      <div className="wrapper">
        <header>
          <img src="/hero.png" alt="hero-banner" />
          <h1>
            Welcome to <span className="text-gradient">MovieFlix</span>
          </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>
        <section className="trending">
          <h2 className="text-white">Trending Movies</h2>
          <ul>
            {trendingMoviesList()}
          </ul>
        </section>
        <section className="all-movies">
          <h2 className="text-white">All Movies</h2>
          {renderMovieContent()}
        </section>
      </div>
    </main>
  );
};

export default App;
