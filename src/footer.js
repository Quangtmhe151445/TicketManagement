import {Row} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
function Footer() {
  return (
    <Row
      className="p-2 mt-3 d-flex justify-content-center align-items-center"
      style={{ backgroundColor: "#383737ff" }}
    >
      <div className="text-center" style={{ color: "white" }}>
        @ 21_PhanThiThao_BL5_Fall25. All rights reserved.
      </div>
    </Row>
  );
}
export default Footer;
