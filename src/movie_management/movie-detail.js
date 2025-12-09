import React from 'react';

const MovieDetail = () => {
  // Mock data - giả sử đang xem chi tiết phim "Your Name"
  const movie = {
    id: 1,
    title: "Your Name",
    genre: ["Romance", "Drama"],
    duration: 106,
    poster: "https://files.tofugu.com/articles/reviews/2017-02-14-your-name/header-5120x.jpg",
    trailer: "https://youtu.be/xU47nhruN-Q",
    statusId: 1,
    publisherId: 3,
    ageRatingId: 2
  };

  const publishers = [
    { id: 1, name: "Studio Ghibli", country: "Japan" },
    { id: 2, name: "Disney", country: "USA" },
    { id: 3, name: "Toho", country: "Japan" },
    { id: 4, name: "Warner Bros", country: "USA" }
  ];

  const ageRatings = [
    { id: 1, code: "P", description: "Phù hợp với mọi độ tuổi" },
    { id: 2, code: "C13", description: "Không dành cho khán giả dưới 13 tuổi" },
    { id: 3, code: "C16", description: "Không dành cho khán giả dưới 16 tuổi" },
    { id: 4, code: "C18", description: "Không dành cho khán giả dưới 18 tuổi" }
  ];

  const movieStatus = [
    { id: 1, code: "now-showing", label: "Đang chiếu" },
    { id: 2, code: "coming-soon", label: "Sắp chiếu" },
    { id: 3, code: "ended", label: "Ngưng chiếu" }
  ];

  const getPublisher = () => {
    return publishers.find(p => p.id === movie.publisherId);
  };

  const getAgeRating = () => {
    return ageRatings.find(r => r.id === movie.ageRatingId);
  };

  const getStatus = () => {
    return movieStatus.find(s => s.id === movie.statusId);
  };

  const getStatusBadge = () => {
    switch(movie.statusId) {
      case 1: return 'success';
      case 2: return 'primary';
      case 3: return 'secondary';
      default: return 'secondary';
    }
  };

  const handleBack = () => {
    console.log('Back to list');
  };

  const handleEdit = () => {
    console.log('Edit movie:', movie.id);
  };

  const handleWatchTrailer = () => {
    window.open(movie.trailer, '_blank');
  };

  const publisher = getPublisher();
  const ageRating = getAgeRating();
  const status = getStatus();

  return (
    <div className="min-vh-100 bg-light py-4">
      <div className="container">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <button
            onClick={handleBack}
            className="btn btn-link text-decoration-none"
          >
            ← Quay lại danh sách
          </button>
          <button
            onClick={handleEdit}
            className="btn btn-success"
          >
            Chỉnh sửa
          </button>
        </div>

        <div className="card shadow-sm">
          {/* Movie Header Section */}
          <div className="card-header bg-gradient p-4" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
            <h1 className="display-4 mb-3 ">{movie.title}</h1>
          </div>

          {/* Content Section */}
          <div className="card-body p-4">
            <div className="row g-4">
              {/* Poster */}
              <div className="col-lg-4">
                <div className="sticky-top" style={{top: '1.5rem'}}>
                  <div className="ratio ratio-2x3 mt-5 bg-secondary bg-opacity-10 rounded shadow">
                    <div className="d-flex mt-5 align-items-center justify-content-center">
                      <img src={movie.poster} alt="poster" className="img-fluid rounded" />

                      
                    </div>
                  </div>

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
                        <h6 className="card-subtitle mb-2 text-muted">Thời Lượng</h6>
                        <p className="card-text fs-3 fw-bold mb-0">{movie.duration} phút</p>
                      </div>
                    </div>
                  </div>

                  {/* Age Rating */}
                  <div className="col-md-6">
                    <div className="card bg-light border">
                      <div className="card-body">
                        <h6 className="card-subtitle mb-2 text-muted">Phân Loại Độ Tuổi</h6>
                        <p className="card-text fs-4 fw-bold mb-1">{ageRating?.code}</p>
                        <p className="card-text small text-muted mb-0">{ageRating?.description}</p>
                      </div>
                    </div>
                  </div>

                  {/* Publisher */}
                  <div className="col-md-6">
                    <div className="card bg-light border">
                      <div className="card-body">
                        <h6 className="card-subtitle mb-2 text-muted">Nhà Sản Xuất</h6>
                        <p className="card-text fs-5 fw-bold mb-1">{publisher?.name}</p>
                        <span className="badge bg-secondary">{publisher?.country}</span>
                      </div>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="col-md-6">
                    <div className="card bg-light border">
                      <div className="card-body">
                        <h6 className="card-subtitle mb-2 text-muted">Trạng Thái</h6>
                        <p className="card-text fs-5 fw-bold mb-1">{status?.label}</p>
                        <p className="card-text small text-muted mb-0">Mã: {status?.code}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Info Section */}
                <div className="card bg-primary bg-opacity-10 border-primary mb-4">
                  <div className="card-body">
                    <h5 className="card-title text-primary mb-3">Thông Tin Thêm</h5>
                    <div className="border-bottom border-primary pb-2 mb-2">
                      <div className="d-flex justify-content-between">
                        <span className="fw-semibold">ID Phim:</span>
                        <span className="badge bg-white text-dark font-monospace">{movie.id}</span>
                      </div>
                    </div>
                    <div className="border-bottom border-primary pb-2 mb-2">
                      <div className="d-flex justify-content-between">
                        <span className="fw-semibold">Đường dẫn Poster:</span>
                        <span className="small text-muted text-truncate ms-2" style={{maxWidth: '300px'}}>{movie.poster}</span>
                      </div>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="fw-semibold">Link Trailer:</span>
                      <a
                        href={movie.trailer}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="small"
                      >
                        Xem trên YouTube
                      </a>
                    </div>
                  </div>
                </div>

                {/* Genre Details */}
                <div className="card" style={{backgroundColor: '#f3e8ff', borderColor: '#a855f7'}}>
                  <div className="card-body">
                    <h5 className="card-title" style={{color: '#7c3aed'}}>Thể Loại Chi Tiết</h5>
                    <div className="d-flex flex-wrap gap-2">
                      {movie.genre.map((g, index) => (
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