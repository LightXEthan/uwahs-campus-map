import React from "react";

import { Row, Col, Modal, ModalHeader, ModalBody } from "reactstrap";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const carouselSettings = {
  accessibility: true,
  arrows: false,
  autoplay: true,
  autoplaySpeed: 3000,
  dots: true,
  infinite: true,
  slidesToShow: 1,
  slidesToScroll: 1,
  speed: 1000
};

const MapPOIInfo = props => {
  const { poi, modal, toggle } = props;

  return (
    <>
      {style}
      <Modal isOpen={modal} toggle={toggle} size="lg" scrollable>
        <ModalHeader toggle={toggle}>{poi.name}</ModalHeader>
        <ModalBody>
          <Row noGutters className="carouselRow">
            <Col>
              <Slider {...carouselSettings}>
                {poi.imageList.length === 0
                  ? "There is no images for this point at the moment."
                  : poi.imageList.map(image => (
                      <img src={image} alt="UWA History" />
                    ))}
              </Slider>
            </Col>
          </Row>
          <hr style={{ marginTop: "1.8rem" }} />
          <Row noGutters>
            <Col>
              {poi.audioList.length === 0
                ? "There is no audio files for this point at the moment."
                : "list of audio"}
            </Col>
          </Row>
          <hr />
          <Row noGutters>
            <Col>
              <h4>{poi.name}</h4>
              {poi.description === "" || poi.description === undefined //TODO: for dev only
                ? "There is no description for this point at the moment."
                : poi.description}
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    </>
  );
};

const style = (
  <style>{`
  .slick-slide {
    max-height: 400px;
  }
  .slick-slide img {
    max-height: 400px;
    max-width: 100% !important;
    margin-left: auto !important;
    margin-right: auto !important;  
    width: auto !important;
    display: flex !important;
  }
  .slick-initialized .slick-track {
    display: flex;
    align-items: center;
  }
  .carouselRow {
    background-color: lightgrey;
  }
  // .carouselImage {
  //   max-width: 100%;
  //   max-height: 350x;
  //   margin-left: auto;
  //   margin-right: auto;
  //   vertical-align: middle
  // }
  ::-webkit-scrollbar {
    width: 0px;
  }
  `}</style>
);

export default MapPOIInfo;
