import React from "react";

import { Row, Col, Modal, ModalHeader, ModalBody } from "reactstrap";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import ReactAudioPlayer from "react-audio-player";

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

const getMeta = id => {};

const getAllMeta = () => {};

const ImageMeta = props => {
  const { name, desc } = props;

  return (
    <div className="imageMetaContainer">
      <div className="imageMetaBackground">
        <p className="imageName">{name ? name : "No name"}</p>
        <p className="imageDesc">{desc ? desc : "No description"}</p>
      </div>
    </div>
  );
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
                {poi.imageArray.length === 0 ? (
                  <div>There is no images for this point at the moment.</div>
                ) : (
                  poi.imageArray.map(image => (
                    <>
                      <img
                        src={image.url}
                        key={image.url.split("token=")[1]}
                        alt="UWA History"
                        className="carouselImage"
                      />
                      <ImageMeta name={image.name} />
                    </>
                  ))
                )}
              </Slider>
            </Col>
          </Row>
          <hr style={{ marginTop: "1.8rem" }} />
          <Row noGutters>
            <Col>
              <h4>Oral Histories</h4>

              {poi.audioArray.length === 0
                ? "There is no audio files for this point at the moment."
                : poi.audioArray.map(audio => (
                    <ReactAudioPlayer
                      className="audioplayer"
                      src={audio.url}
                      key={audio.url.split("token=")[1]}
                      controls
                    />
                  ))}
            </Col>
          </Row>
          <hr style={{ marginTop: "0.5rem" }} />
          <Row noGutters>
            <Col>
              <h4>About {poi.name}</h4>
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
  @media (max-width: 760px) {
    .modal {
      height: auto;
    }
    .modal-dialog {
      margin: 0;
    }
    .modal-content {
      border-radius: 0;
      word-wrap: break-word;
    }
    .modal-title {
      width: 83vw;
    }
    .modal-dialog-scrollable .modal-content {
      max-height: 100vh;
    }
  }
  ::-webkit-scrollbar {
    width: 0px;
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
    background-color: #fafafa;
  }
  .imageMetaContainer {
    background-color: #fafafa;
    text-align: center;
    padding: .5rem 2rem;
  }
  .imageMetaBackground { 
    background-color: #eaeaea;
    height: 100%;
  }
  .imageName {
    margin: 0;
  }
  .imageDesc {
    margin-top: 10px;
    color: #000000ad;
  }
  .audioplayer {
    display: block;
    width: 100%;
    margin-bottom: 0.5rem;
  }
  `}</style>
);

export default MapPOIInfo;
