import {Row} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

function Footer() {
  return (
    <Row
      className="p-2 mt-3 d-flex justify-content-center align-items-center"
      style={{ 
        backgroundColor: "#383737ff", 
        position: 'fixed', 
        bottom: 0,         
        width: '100%',     
        zIndex: 1000,      
        margin: 0,         
      }}
    >
      <div className="text-center" style={{ color: "white" }}>
        Assignment FER202 - Cinema Management - Group 1
      </div>
    </Row>
  );
}
export default Footer;