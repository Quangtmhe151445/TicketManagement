import React, { useState } from 'react';

const AddMovie = () => {
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

  // Mock data
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-vh-100 bg-light py-4">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card shadow-sm">
              <div className="card-header bg-primary text-white">
                <h3 className="mb-0">Thêm Phim Mới</h3>
              </div>
              
              <div className="card-body p-4">
                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">
                        Tên Phim <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Nhập tên phim"
                        className="form-control"
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">
                        Thời Lượng (phút) <span className="text-danger">*</span>
                      </label>
                      <input
                        type="number"
                        name="duration"
                        value={formData.duration}
                        onChange={handleChange}
                        placeholder="Nhập thời lượng"
                        min="1"
                        className="form-control"
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3 mt-3">
                    <label className="form-label">
                      Thể Loại <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      name="genre"
                      value={formData.genre}
                      onChange={handleChange}
                      placeholder="Nhập thể loại phim (ví dụ: Action, Drama, Romance)"
                      className="form-control"
                      required
                    />
                    <div className="form-text">
                      Nhập các thể loại cách nhau bởi dấu phẩy
                    </div>
                  </div>

                  <div className="row g-3 mt-1">
                    <div className="col-md-6">
                      <label className="form-label">
                        Nhà Sản Xuất <span className="text-danger">*</span>
                      </label>
                      <select
                        name="publisherId"
                        value={formData.publisherId}
                        onChange={handleChange}
                        className="form-select"
                        required
                      >
                        <option value="">-- Chọn nhà sản xuất --</option>
                        {publishers.map(publisher => (
                          <option key={publisher.id} value={publisher.id}>
                            {publisher.name} ({publisher.country})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">
                        Phân Loại Độ Tuổi <span className="text-danger">*</span>
                      </label>
                      <select
                        name="ageRatingId"
                        value={formData.ageRatingId}
                        onChange={handleChange}
                        className="form-select"
                        required
                      >
                        <option value="">-- Chọn phân loại độ tuổi --</option>
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
                      Trạng Thái <span className="text-danger">*</span>
                    </label>
                    <select
                      name="statusId"
                      value={formData.statusId}
                      onChange={handleChange}
                      className="form-select"
                      required
                    >
                      <option value="">-- Chọn trạng thái --</option>
                      {movieStatus.map(status => (
                        <option key={status.id} value={status.id}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">
                      URL Poster <span className="text-danger">*</span>
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
                      URL Trailer <span className="text-danger">*</span>
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
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                    >
                      Thêm Phim
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