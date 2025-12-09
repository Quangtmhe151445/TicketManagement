// src/CinemaRoom/CinemaRoomManager.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Alert } from 'react-bootstrap';
import RoomList from './RoomList';
import RoomForm from './RoomForm';

const API_URL = '/cinema_rooms';

// Hàm helper để chuyển số thành chữ cái (A, B, C...)
const numberToLetter = (n) => String.fromCharCode(65 + n);

// Hàm helper để tạo seat_map và seat_types từ form data
const generateSeatMapAndTypes = (data) => {
    const total_rows = parseInt(data.total_rows, 10);
    const seats_per_row = parseInt(data.seats_per_row, 10);
    
    // 1. Phân tích chuỗi hàng VIP/Couple
    const vipRows = data.vip_rows.toUpperCase().split(',').map(r => r.trim()).filter(r => r);
    const coupleRows = data.couple_rows.toUpperCase().split(',').map(r => r.trim()).filter(r => r);

    const newSeatMap = [];
    const newSeatTypes = {};

    for (let i = 0; i < total_rows; i++) {
        const rowLetter = numberToLetter(i);
        const rowArr = [];
        
        // Xác định loại ghế mặc định cho hàng này
        let seatType = 'Standard';
        if (vipRows.includes(rowLetter)) {
            seatType = 'VIP';
        } else if (coupleRows.includes(rowLetter)) {
            seatType = 'Couple';
        }

        // Tạo tên ghế và thêm loại ghế vào seat_types
        for (let j = 1; j <= seats_per_row; j++) {
            rowArr.push(`${rowLetter}${j}`);
        }
        newSeatMap.push(rowArr);
        newSeatTypes[rowLetter] = seatType;
    }

    return { seat_map: newSeatMap, seat_types: newSeatTypes };
};


function CinemaRoomManager() {
    const [rooms, setRooms] = useState([]);
    const [currentRoom, setCurrentRoom] = useState(null); 
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // ===============================================
    // GET: Hàm lấy dữ liệu từ JSON Server (Fetch)
    // ===============================================
    const fetchRooms = async () => {
        setLoading(true);
        setError(null);
        try {
            // Thay thế API_URL bằng đường dẫn đầy đủ nếu JSON Server chạy trên cổng khác (vd: 'http://localhost:5000/cinema_rooms')
            const response = await fetch(API_URL);
            if (!response.ok) {
                // Báo lỗi nếu kết nối thành công nhưng server trả về mã lỗi
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            
            // Định dạng dữ liệu từ database.json để hiển thị trên UI
            const formattedRooms = data.map(room => ({
                ...room,
                // Tính tổng số ghế: Đếm tất cả phần tử trong mảng 2D
                total_seats: room.seat_map ? room.seat_map.flat().length : 0, 
                // Hiển thị loại ghế: Ghép các giá trị của object seat_types
                seat_types: room.seat_types 
                            ? Object.values(room.seat_types).filter((v, i, a) => a.indexOf(v) === i).join(', ') 
                            : 'Chưa cấu hình'
            }));
            setRooms(formattedRooms);
        } catch (err) {
            // Lỗi này thường do JSON Server chưa chạy hoặc lỗi CORS
            setError('Lỗi kết nối hoặc tải dữ liệu. Vui lòng kiểm tra JSON Server.');
            console.error("Lỗi Fetching:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRooms();
    }, []);

    // ===============================================
    // POST/PUT: Xử lý Lưu dữ liệu (Fetch)
    // ===============================================
    const handleSave = async (roomData) => {
        setError(null);
        
        // 1. Tạo seat_map và seat_types từ dữ liệu form
        const { seat_map, seat_types } = generateSeatMapAndTypes(roomData);

        // 2. Cấu trúc lại dữ liệu cho JSON Server
        const simplifiedData = {
             id: roomData.id || `room${Date.now()}`, // Tạo ID mới nếu không phải là chỉnh sửa
             name: roomData.name,
             type: roomData.type,
             status: roomData.status,
             seat_map: seat_map, 
             seat_types: seat_types 
        };

        const method = currentRoom ? 'PUT' : 'POST';
        const url = currentRoom ? `${API_URL}/${currentRoom.id}` : API_URL;

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(simplifiedData)
            });

            if (!response.ok) { throw new Error(`HTTP error! status: ${response.status}`); }

            setShowForm(false);
            setCurrentRoom(null);
            fetchRooms(); // Load lại danh sách
        } catch (err) {
            setError('Lỗi khi lưu dữ liệu phòng chiếu.');
            console.error("Lỗi Saving:", err);
        }
    };

    // ===============================================
    // DELETE: Xử lý Xóa dữ liệu (Fetch)
    // ===============================================
    const handleDelete = async (roomId) => {
        if (window.confirm(`Bạn có chắc chắn muốn xóa phòng ${roomId} không?`)) {
            setError(null);
            try {
                const response = await fetch(`${API_URL}/${roomId}`, {
                    method: 'DELETE',
                });
                
                if (!response.ok) { throw new Error(`HTTP error! status: ${response.status}`); }
                
                fetchRooms(); // Load lại danh sách
            } catch (err) {
                setError('Lỗi khi xóa phòng chiếu.');
                console.error("Lỗi Deleting:", err);
            }
        }
    };

    // UI Handlers
    const handleEdit = (room) => { setCurrentRoom(room); setShowForm(true); };
    const handleAdd = () => { setCurrentRoom(null); setShowForm(true); };
    const handleCancel = () => { setShowForm(false); setCurrentRoom(null); };

    if (loading) return <Container className="mt-4"><p>Đang tải dữ liệu phòng chiếu...</p></Container>;
    
    return (
        <Container className="mt-4" style={{ paddingBottom: '50px' }}>
            <h2 className="mb-4 text-center text-primary">🎬 Quản Lý Phòng Chiếu (Cinema Hall)</h2>
            <hr />
            
            {error && <Alert variant="danger">{error}</Alert>}

            <Row>
                <Col xs={12} className="mb-3 d-flex justify-content-end">
                    <Button variant="success" onClick={handleAdd}>➕ Thêm Phòng Mới</Button>
                </Col>
            </Row>

            {/* Form Thêm/Chỉnh Sửa */}
            {showForm && (
                <div className="mb-4 p-4 border border-secondary rounded shadow-sm bg-light">
                    <h4 className="text-secondary">{currentRoom ? 'Chỉnh Sửa Phòng Chiếu' : 'Thêm Phòng Chiếu Mới'}</h4>
                    <RoomForm room={currentRoom} onSave={handleSave} onCancel={handleCancel} />
                </div>
            )}

            {/* Bảng Danh Sách Phòng */}
            {!showForm && <RoomList rooms={rooms} onEdit={handleEdit} onDelete={handleDelete} />}
        </Container>
    );
}

export default CinemaRoomManager;