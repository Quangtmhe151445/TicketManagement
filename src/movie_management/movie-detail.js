import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const API_URL = "http://localhost:9999";

const MovieDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const movieId = parseInt(id);

  const [movie, setMovie] = useState(null);
  const [publishers, setPublishers] = useState([]);
  const [ageRatings, setAgeRatings] = useState([]);
  const [movieStatus, setMovieStatus] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [movieId]);

  const fetchData = async () => {
    try {
      const [movieRes, publishersRes, ratingsRes, statusRes] = await Promise.all([
        fetch(`${API_URL}/movies/${movieId}`),
        fetch(`${API_URL}/publishers`),
        fetch(`${API_URL}/ageRatings`),
        fetch(`${API_URL}/movieStatus`)
      ]);

      if (!movieRes.ok || !publishersRes.ok || !ratingsRes.ok || !statusRes.ok) {
        throw new Error('Failed to fetch data');
      }

      const [movieData, publishersData, ratingsData, statusData] = await Promise.all([
        movieRes.json(),
        publishersRes.json(),
        ratingsRes.json(),
        statusRes.json()
      ]);

      setPublishers(publishersData);
      setAgeRatings(ratingsData);
      setMovieStatus(statusData);

      if (movieData) {
        setMovie(movieData);
      } else {
        alert('Movie not found!');
        navigate('/');
      }
    } catch (error) {
      console.error('Error loading data:', error);
      alert('Cannot load data. Please ensure the API server is running on http://localhost:9999');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const getPublisher = () => {
    return publishers.find(p => p.id === movie?.publisherId);
  };

  const getAgeRating = () => {
    return ageRatings.find(r => r.id === movie?.ageRatingId);
  };

  const getStatus = () => {
    return movieStatus.find(s => s.id === movie?.statusId);
  };

  const getStatusBadge = () => {
    switch(movie?.statusId) {
      case 1: return 'success';
      case 2: return 'primary';
      case 3: return 'secondary';
      default: return 'secondary';
    }
  };

  const handleWatchTrailer = () => {
    window.open(movie?.trailer, '_blank');
  };

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading data...</p>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-vh-100 bg-light py-4">
        <div className="container">
          <div className="alert alert-warning">
            Movie not found
          </div>
          <button onClick={() => navigate('/movie-list')} className="btn btn-primary">
            Back to list
          </button>
        </div>
      </div>
    );
  }

  const publisher = getPublisher();
  const ageRating = getAgeRating();
  const status = getStatus();

  return (
    <div className="min-vh-100 bg-light py-4">
      <div className="container">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <button
            onClick={() => navigate('/movie-list')}
            className="btn btn-link text-decoration-none"
          >
            ← Back to list
          </button>
          <button
            onClick={() => navigate(`/edit-movie/${movie.id}`)}
            className="btn btn-success"
          >
            Edit
          </button>
        </div>

        <div className="card shadow-sm">
          {/* Movie Header Section */}
          <div className="card-header bg-gradient p-4" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
            <h1 className="display-4 mb-3 text-white">{movie.title}</h1>
          </div>

          {/* Content Section */}
          <div className="card-body p-4">
            <div className="row g-4">
              {/* Poster */}
              <div className="col-lg-4">
                <div className="sticky-top" style={{top: '1.5rem'}}>
                  <div className="ratio ratio-2x3 bg-secondary bg-opacity-10 rounded shadow">
                    <img 
                      src={movie.poster} 
                      alt={movie.title} 
                      className="img-fluid rounded"
                      style={{objectFit: 'cover'}}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x450?text=No+Image';
                      }}
                    />
                  </div>
                  <button
                    onClick={handleWatchTrailer}
                    className="btn btn-danger w-100 mt-3"
                  >
                    🎬 Watch Trailer
                  </button>
                </div>
              </div>

              {/* Details */}
              <div className="col-lg-8">
                {/* Status Badge */}
                <div className="d-flex gap-2 mb-4">
                  <span className={`badge bg-${getStatusBadge()} fs-6 px-3 py-2`}>
                    {status?.label}
                  </span>
                  <span className="badge bg-warning text-dark fs-6 px-3 py-2">
                    {ageRating?.code}
                  </span>
                </div>

                {/* Information Grid */}
                <div className="row g-3 mb-4">
                  {/* Duration */}
                  <div className="col-md-6">
                    <div className="card bg-light border">
                      <div className="card-body">
                        <h6 className="card-subtitle mb-2 text-muted">Duration</h6>
                        <p className="card-text fs-3 fw-bold mb-0">{movie.duration} min</p>
                      </div>
                    </div>
                  </div>

                  {/* Age Rating */}
                  <div className="col-md-6">
                    <div className="card bg-light border">
                      <div className="card-body">
                        <h6 className="card-subtitle mb-2 text-muted">Age Rating</h6>
                        <p className="card-text fs-4 fw-bold mb-1">{ageRating?.code}</p>
                        <p className="card-text small text-muted mb-0">{ageRating?.description}</p>
                      </div>
                    </div>
                  </div>

                  {/* Publisher */}
                  <div className="col-md-6">
                    <div className="card bg-light border">
                      <div className="card-body">
                        <h6 className="card-subtitle mb-2 text-muted">Publisher</h6>
                        <p className="card-text fs-5 fw-bold mb-1">{publisher?.name}</p>
                        <span className="badge bg-secondary">{publisher?.country}</span>
                      </div>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="col-md-6">
                    <div className="card bg-light border">
                      <div className="card-body">
                        <h6 className="card-subtitle mb-2 text-muted">Status</h6>
                        <p className="card-text fs-5 fw-bold mb-1">{status?.label}</p>
                        <p className="card-text small text-muted mb-0">Code: {status?.code}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Info Section */}
                <div className="card bg-primary bg-opacity-10 border-primary mb-4">
                  <div className="card-body">
                    <h5 className="card-title text-primary mb-3">Additional Information</h5>
                    <div className="border-bottom border-primary pb-2 mb-2">
                      <div className="d-flex justify-content-between">
                        <span className="fw-semibold">Movie ID:</span>
                        <span className="badge bg-white text-dark font-monospace">{movie.id}</span>
                      </div>
                    </div>
                    <div className="border-bottom border-primary pb-2 mb-2">
                      <div className="d-flex justify-content-between">
                        <span className="fw-semibold">Poster Path:</span>
                        <span className="small text-muted text-truncate ms-2" style={{maxWidth: '300px'}}>{movie.poster}</span>
                      </div>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="fw-semibold">Trailer Link:</span>
                      <a
                        href={movie.trailer}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="small"
                      >
                        View on YouTube
                      </a>
                    </div>
                  </div>
                </div>

                {/* Genre Details */}
                <div className="card" style={{backgroundColor: '#f3e8ff', borderColor: '#a855f7'}}>
                  <div className="card-body">
                    <h5 className="card-title" style={{color: '#7c3aed'}}>Genre Details</h5>
                    <div className="d-flex flex-wrap gap-2">
                      {(Array.isArray(movie.genre) ? movie.genre : [movie.genre]).map((g, index) => (
                        <span
                          key={index}
                          className="badge fs-6 px-3 py-2"
                          style={{backgroundColor: '#e9d5ff', color: '#7c3aed', border: '1px solid #a855f7'}}
                        >
                          {g}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;