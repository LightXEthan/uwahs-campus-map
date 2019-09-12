import React, { Component, Fragment } from "react";

import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

import { Row, Col, Button } from "reactstrap";

class MapPOIInfo extends Component {
  render() {
    const { poi, onBack } = this.props;

    return (
      <Fragment>
        {style}
        <Row>
          <Col md="2" style={{ padding: 5 }}>
            <Button onClick={() => onBack()}>Back</Button>
          </Col>
          <Col md="10">
            <h5>{poi.name}</h5>
          </Col>
        </Row>
        <Row>
          <Col>
            <img
              src={poi.imageList[0]}
              alt=""
              style={{
                width: window.innerWidth < 380 ? window.innerWidth : 380,
                maxHeight: window.innerWidth
              }}
            />
          </Col>
        </Row>
        <Row>
          <Col>a short desc</Col>
        </Row>
        <Row>
          <Col>list of audio</Col>
        </Row>
      </Fragment>
    );
  }
}

const style = (
  <style>{`
    .col, .row, col-md-2 {
      padding: 0;
      margin: 0;
    }
  `}</style>
);

export default MapPOIInfo;
