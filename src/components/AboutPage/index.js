import React from "react";
import { Container, Row, Col, Button } from "reactstrap";

const AboutPage = () => (
  <>
    {style}
    <Button href="/" className="back-button" style={{ textAlign: "center" }}>
      <p className="button-text">
        <i className="fa fa-map fa-lg map-icon" />
        Back to Map
      </p>
    </Button>
    <Container>
      <Row>
        <Col style={{ textAlign: "center", marginBottom: "120px" }}>
          <div className="title">
            <h1>UWA Historical Society Campus Map</h1>
          </div>
          <h2>About</h2>
          <p>description ladida... This app was built for UWAHS as a project for CITS3200 Professional Computing 2019.</p>
          <h2>Members of Group 23</h2>
          <ul style={{ listStyleType: "none", padding: 0 }}>
            <li>Ethan Li-Ming Chin</li>
            <li>Huey Charn Lee</li>
            <li>Jong Kyung Kim</li>
            <li>Joshua Richard Mussell</li>
            <li>Tomas James Mijat</li>
          </ul>
          <h2>Acknowledgements</h2>
          <ul style={{ listStyleType: "none", padding: 0 }}>
            <li>Arian Nevjestic (Microsoft)</li>
          </ul>
          <h2>Contribute</h2>
          <p>
            Find the source code and documentation in the Github repository
            <a href="https://github.com/LightXEthan/uwahs-campus-map">
              <i className="fa fa-github-square github-icon fa-lg" />
            </a>
            and the&nbsp;
            <a href="https://github.com/LightXEthan/uwahs-campus-map/wiki">
              Wiki
            </a>
            .
          </p>
          <h2>Copyright</h2>
          <p>copyright mumbo jumbo</p>
        </Col>
      </Row>
    </Container>
  </>
);

const style = (
  <style>{`
  @media (max-width: 760px) {
    .back-button {
      position: fixed;
      bottom: 10px;
      z-index: 3000;
      left: 0;
      right: 0;
      margin-left: 10px !important;
      margin-right: 10px !important;
      height: 100px !important;
    }
    .button-text {
      margin: 30px 0 !important;
    }
  }
  .back-button {
    position: fixed;
    bottom: 10px;
    z-index: 3000;
    left: 0;
    right: 0;
    margin-left: 30%;
    margin-right: 30%;
  }
  .button-text {
    margin: 0;
  }
  .map-icon {
    margin-right: 10px;
  }
  .title {
    word-wrap: break-word;
    margin: 30px 0;
  }
  .github-icon {
    margin: 0 5px;
  }
  `}</style>
);

export default AboutPage;
