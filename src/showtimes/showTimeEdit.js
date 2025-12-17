import { Modal } from 'react-bootstrap';
import ShowtimeForm from './showTimeForm';

export default function ShowtimeEdit({ show, onHide, ...props }) {
    const isEdit = !!props.initialData;

    return (
        <Modal
            show={show}
            onHide={onHide}
            centered
            size="lg"
            backdrop="static"
        >
            <Modal.Header
                closeButton
                style={{
                    background: 'linear-gradient(90deg, #0d6efd, #6610f2)',
                    color: '#fff'
                }}
            >
                <Modal.Title className="fw-bold fs-4">
                    {isEdit ? '🎞 Update Showtime' : '🎬 Create Showtime'}
                </Modal.Title>
            </Modal.Header>

            <Modal.Body
                style={{
                    backgroundColor: '#f1f3f5'
                }}
            >
                <ShowtimeForm
                    {...props}
                    submitLabel={isEdit ? 'Update Showtime' : 'Create Showtime'}
                />
            </Modal.Body>
        </Modal>
    );
}
