import { useEffect, useState } from "react";
import useDebounce from './hooks/useDebounce';

import Search from "./components/Search";
import Spinner from "./components/Spinner";
import MovieCard from "./components/MovieCard";

import { fetchMovies, fetchTrendingMovies } from "./components/Services";


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
    const loadMovies = async () => {
      setErrorMessage("");
      setIsLoading(true);
      try {
        const movies = await fetchMovies(debouncedSearchTerm);
        setMovieList(movies);
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    loadMovies();
  }, [debouncedSearchTerm]);

  useEffect(() => {
    const loadTrendingMovies = async () => {
      setTrendingMoviesLoading(true);
      try {
        const movies = await fetchTrendingMovies();
        setTrendingMovies(movies);
      } catch (error) {
        console.error("Error fetching trending movies:", error);
        setTrendingMovieListError("Failed to fetch trending movies. Please try again later.");
      } finally {
        setTrendingMoviesLoading(false);
      }
    };
    loadTrendingMovies();
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
