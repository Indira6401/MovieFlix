const MovieCard = ({ movie: { title, vote_average, poster_path, original_language, release_date } }) => {
  return (
    <div className="movie-card">
      <img
        src={
          poster_path
            ? `https://image.tmdb.org/t/p/w500${poster_path}`
            : "/no-poster.png"
        }
        alt={title}
      />
      <div className="mt-4">
        <h3>{title}</h3>
        <div className="content">
          <div className="rating">
          <img src="/star.svg" alt="star-icon" />
          <span>{vote_average ? vote_average.toFixed(1) : 'N/A'}</span>
          </div>
          <span>•</span>
          <span className="lang">{original_language ? original_language.toUpperCase() : "N/A"}</span>
          <span>•</span>
          <span className="year">{release_date ? release_date.split("-")[0] : "N/A"}</span>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
