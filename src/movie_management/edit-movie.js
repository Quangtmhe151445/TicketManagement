import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const API_URL = "http://localhost:9999";

const EditMovie = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const movieId = parseInt(id);

  const [formData, setFormData] = useState({
    title: '',
    genre: '',
    duration: '',
    poster: '',
    trailer: '',
    statusId: '',
    publisherId: '',
    ageRatingId: ''
  });

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

      const [movie, publishersData, ratingsData, statusData] = await Promise.all([
        movieRes.json(),
        publishersRes.json(),
        ratingsRes.json(),
        statusRes.json()
      ]);

      setPublishers(publishersData);
      setAgeRatings(ratingsData);
      setMovieStatus(statusData);

      if (movie) {
        setFormData({
          title: movie.title,
          genre: Array.isArray(movie.genre) ? movie.genre.join(', ') : movie.genre,
          duration: movie.duration,
          poster: movie.poster,
          trailer: movie.trailer,
          statusId: movie.statusId,
          publisherId: movie.publisherId,
          ageRatingId: movie.ageRatingId
        });
      } else {
        alert('Movie not found!');
      }
    } catch (error) {
      console.error('Error loading data:', error);
      alert('Cannot load data. Please ensure the API server is running on http://localhost:9999');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const updatedMovie = {
      title: formData.title,
      genre: formData.genre.split(',').map(g => g.trim()),
      duration: parseInt(formData.duration),
      poster: formData.poster,
      trailer: formData.trailer,
      statusId: parseInt(formData.statusId),
      publisherId: parseInt(formData.publisherId),
      ageRatingId: parseInt(formData.ageRatingId)
    };
    
    try {
      const response = await fetch(`${API_URL}/movies/${movieId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedMovie)
      });

      if (!response.ok) {
        throw new Error('Failed to update movie');
      }

      alert('Movie updated successfully!');
      navigate('/movie-list');
    } catch (error) {
      console.error('Error updating movie:', error);
      alert('Failed to update movie. Please try again.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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

  return (
    <div className="min-vh-100 bg-light py-4">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card shadow-sm">
              <div className="card-header bg-success text-white">
                <h3 className="mb-0">Edit Movie Information</h3>
              </div>
              
              <div className="card-body p-4">
                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">
                        Movie Title <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="form-control"
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">
                        Duration (minutes)
                      </label>
                      <input
                        type="number"
                        name="duration"
                        value={formData.duration}
                        className="form-control"
                        readOnly
                        disabled
                      />
                      <div className="form-text text-muted">
                        Cannot be edited
                      </div>
                    </div>
                  </div>

                  <div className="mb-3 mt-3">
                    <label className="form-label">
                      Genre <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      name="genre"
                      value={formData.genre}
                      onChange={handleChange}
                      className="form-control"
                      required
                    />
                    <div className="form-text">
                      Separate genres with commas
                    </div>
                  </div>

                  <div className="row g-3 mt-1">
                    <div className="col-md-6">
                      <label className="form-label">
                        Publisher
                      </label>
                      <select
                        name="publisherId"
                        value={formData.publisherId}
                        className="form-select"
                        disabled
                      >
                        {publishers.map(publisher => (
                          <option key={publisher.id} value={publisher.id}>
                            {publisher.name} ({publisher.country})
                          </option>
                        ))}
                      </select>
                      <div className="form-text text-muted">
                        Cannot be edited
                      </div>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">
                        Age Rating <span className="text-danger">*</span>
                      </label>
                      <select
                        name="ageRatingId"
                        value={formData.ageRatingId}
                        onChange={handleChange}
                        className="form-select"
                        required
                      >
                        {ageRatings.map(rating => (
                          <option key={rating.id} value={rating.id}>
                            {rating.code} - {rating.description}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="mb-3 mt-3">
                    <label className="form-label">
                      Status <span className="text-danger">*</span>
                    </label>
                    <select
                      name="statusId"
                      value={formData.statusId}
                      onChange={handleChange}
                      className="form-select"
                      required
                    >
                      {movieStatus.map(status => (
                        <option key={status.id} value={status.id}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">
                      Poster URL <span className="text-danger">*</span>
                    </label>
                    <input
                      type="url"
                      name="poster"
                      value={formData.poster}
                      onChange={handleChange}
                      className="form-control"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">
                      Trailer URL <span className="text-danger">*</span>
                    </label>
                    <input
                      type="url"
                      name="trailer"
                      value={formData.trailer}
                      onChange={handleChange}
                      className="form-control"
                      required
                    />
                  </div>

                  <div className="d-flex gap-2 justify-content-end mt-4">
                    <button
                      type="button"
                      className="btn btn-secondary"
                     onClick={() => navigate(-1)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-success"
                    >
                      Update
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditMovie;