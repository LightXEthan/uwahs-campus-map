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
        <Col className="content">
          <div className="title">
            <h1>UWA Historical Society Campus Map</h1>
          </div>
          <h2>About</h2>
          <p>
            This app was built for the UWA Historical Society as a project for
            <a href="http://teaching.csse.uwa.edu.au/units/CITS3200/">
              CITS3200 Professional Computing
            </a>
            2019.
          </p>
          <h2>Group 23</h2>
          <ul style={{ listStyleType: "none", padding: 0 }}>
            <li>
              <a href="https://github.com/LightXEthan">Ethan Li-Ming Chin</a>
            </li>
            <li>
              <a href="https://github.com/Elenaires">Huey Charn Lee</a>
            </li>
            <li>
              <a href="https://github.com/JKKim98">Jong Kyung Kim</a>
            </li>
            <li>
              <a href="https://github.com/JMu55">Joshua Richard Mussell</a>
            </li>
            <li>
              <a href="https://github.com/BologneseBandit">Tomas James Mijat</a>
            </li>
          </ul>
          <h2>Acknowledgements</h2>
          <ul style={{ listStyleType: "none", padding: 0 }}>
            <li>Arian Nevjestic - Mentor, Microsoft</li>
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
          <h2>QR Code</h2>
          <p style={{ marginBottom: 0 }}>
            <a href="https://github.com/LightXEthan/uwahs-campus-map/blob/docs/demos/demo/qr-code.png?raw=true">
              QR Code download link
            </a>
          </p>
          <img alt="" src="https://github.com/LightXEthan/uwahs-campus-map/blob/docs/demos/demo/qr-code.png?raw=true" />
          <h2>Credit</h2>
          <p>Credit stuff</p>
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
    .content {
      margin-bottom: 120px;
    }
  }
  .content {
    text-align: center;
    margin-bottom: 60px;
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
    margin: 20px 0;
  }
  .github-icon {
    margin: 0 5px;
  }
  `}</style>
);

export default AboutPage;
