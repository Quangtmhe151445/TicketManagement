import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';

const API_URL = "http://localhost:9999";

const AddMovie = () => {
  const navigate = useNavigate();
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
  const [importing, setImporting] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [publishersRes, ratingsRes, statusRes] = await Promise.all([
        fetch(`${API_URL}/publishers`),
        fetch(`${API_URL}/ageRatings`),
        fetch(`${API_URL}/movieStatus`)
      ]);

      if (!publishersRes.ok || !ratingsRes.ok || !statusRes.ok) {
        throw new Error('Failed to fetch data');
      }

      const [publishersData, ratingsData, statusData] = await Promise.all([
        publishersRes.json(),
        ratingsRes.json(),
        statusRes.json()
      ]);

      setPublishers(publishersData);
      setAgeRatings(ratingsData);
      setMovieStatus(statusData);
    } catch (error) {
      console.error('Error loading data:', error);
      alert('Cannot load data. Please ensure the API server is running on http://localhost:9999');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newMovie = {
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
      const response = await fetch(`${API_URL}/movies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newMovie)
      });

      if (!response.ok) {
        throw new Error('Failed to add movie');
      }

      alert('Movie added successfully!');
      navigate('/');
    } catch (error) {
      console.error('Error adding movie:', error);
      alert('Failed to add movie. Please try again.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImportExcel = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImporting(true);
    const reader = new FileReader();

    reader.onload = async (evt) => {
      try {
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);

        console.log('Imported movies:', data);
        
        // Validate and format data
        const validMovies = data.filter(row => {
          return row.title && row.duration && row.genre && 
                 row.poster && row.trailer && 
                 row.statusId && row.publisherId && row.ageRatingId;
        }).map(row => ({
          title: row.title,
          genre: typeof row.genre === 'string' ? row.genre.split(',').map(g => g.trim()) : row.genre,
          duration: parseInt(row.duration),
          poster: row.poster,
          trailer: row.trailer,
          statusId: parseInt(row.statusId),
          publisherId: parseInt(row.publisherId),
          ageRatingId: parseInt(row.ageRatingId)
        }));

        // Import movies to API
        let successCount = 0;
        for (const movie of validMovies) {
          try {
            const response = await fetch(`${API_URL}/movies`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(movie)
            });
            
            if (response.ok) {
              successCount++;
            }
          } catch (error) {
            console.error('Error importing movie:', movie.title, error);
          }
        }

        alert(`Successfully imported ${successCount} out of ${validMovies.length} movie(s)!`);
        
        // After successful import, navigate back to list
        setTimeout(() => navigate('/'), 1000);
        
      } catch (error) {
        console.error('Error parsing Excel file:', error);
        alert('Error importing file. Please check the file format.\n\nExpected columns: title, genre, duration, poster, trailer, statusId, publisherId, ageRatingId');
      } finally {
        setImporting(false);
        e.target.value = '';
      }
    };

    reader.readAsBinaryString(file);
  };

  const downloadTemplate = () => {
    const template = [
      {
        title: 'Example Movie',
        genre: 'Action, Drama',
        duration: 120,
        poster: 'https://example.com/poster.jpg',
        trailer: 'https://youtu.be/xxxxx',
        statusId: 1,
        publisherId: 1,
        ageRatingId: 2
      }
    ];

    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Movies');
    XLSX.writeFile(wb, 'movie_import_template.xlsx');
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
              <div className="card-header bg-primary text-white">
                <div className="d-flex justify-content-between align-items-center">
                  <h3 className="mb-0">Add New Movie</h3>
                  <div className="d-flex gap-2">
                    <button
                      type="button"
                      className="btn btn-light btn-sm"
                      onClick={downloadTemplate}
                    >
                      📥 Download Template
                    </button>
                    <button
                      type="button"
                      className="btn btn-success btn-sm"
                      onClick={handleImportExcel}
                      disabled={importing}
                    >
                      {importing ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Importing...
                        </>
                      ) : (
                        <>📤 Import Excel</>
                      )}
                    </button>
                  </div>
                </div>
              </div>
              
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".xlsx,.xls"
                style={{ display: 'none' }}
              />

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
                        placeholder="Enter movie title"
                        className="form-control"
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">
                        Duration (minutes) <span className="text-danger">*</span>
                      </label>
                      <input
                        type="number"
                        name="duration"
                        value={formData.duration}
                        onChange={handleChange}
                        placeholder="Enter duration"
                        min="1"
                        className="form-control"
                        required
                      />
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
                      placeholder="Enter genres (e.g., Action, Drama, Romance)"
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
                        Publisher <span className="text-danger">*</span>
                      </label>
                      <select
                        name="publisherId"
                        value={formData.publisherId}
                        onChange={handleChange}
                        className="form-select"
                        required
                      >
                        <option value="">-- Select publisher --</option>
                        {publishers.map(publisher => (
                          <option key={publisher.id} value={publisher.id}>
                            {publisher.name} ({publisher.country})
                          </option>
                        ))}
                      </select>
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
                        <option value="">-- Select age rating --</option>
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
                      <option value="">-- Select status --</option>
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
                      placeholder="https://example.com/poster.jpg"
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
                      placeholder="https://youtu.be/xxxxx"
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
                      className="btn btn-primary"
                    >
                      Add Movie
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

export default AddMovie;