import React from "react";

import { Row, Col, Modal, ModalHeader, ModalBody } from "reactstrap";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import ReactAudioPlayer from "react-audio-player";

const carouselSettings = {
  accessibility: true,
  arrows: false,
  // autoplay: true,
  autoplaySpeed: 3000,
  dots: true,
  infinite: true,
  slidesToShow: 1,
  slidesToScroll: 1,
  speed: 1000
};

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

const getImageMeta = (imageMetaId, fileList) => {
  return fileList.find(e => {
    return e._id === imageMetaId;
  });
};

const getAudioMeta = (audioMetaId, fileList) => {
  return fileList.find(e => {
    return e._id === audioMetaId;
  });
};

const MapPOIInfo = props => {
  const { poi, files, modal, toggle } = props;

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
                  poi.imageArray.map(image => {
                    const imageMeta = getImageMeta(image.metaID, files);

                    return (
                      <>
                        <div className="imageContainer">
                          <img
                            src={imageMeta.url}
                            key={imageMeta.url.split("token=")[1]}
                            alt="UWA History"
                            className="carouselImage"
                          />
                        </div>
                        <ImageMeta
                          name={imageMeta.name}
                          desc={imageMeta.description}
                        />
                      </>
                    );
                  })
                )}
              </Slider>
            </Col>
          </Row>
          <hr style={{ marginTop: "1.8rem" }} />
          <Row noGutters>
            <Col>
              <h4 className="header">About {poi.name}</h4>
              {poi.description === "" || poi.description === undefined //TODO: for dev only
                ? "There is no description for this point at the moment."
                : poi.description}
            </Col>
          </Row>
          <hr />
          <Row noGutters>
            <Col>
              <h4 className="header">Oral History Excerpts</h4>

              {poi.audioArray.length === 0
                ? "There is no audio files for this point at the moment."
                : poi.audioArray.map(audio => {
                    const audioMeta = getAudioMeta(audio.metaID, files);

                    return (
                      <>
                        <div className="audioMeta">
                          <p className="audioName">{audioMeta.name}</p>
                          <p className="audioDesc">{audioMeta.description}</p>
                        </div>
                        <ReactAudioPlayer
                          className="audioPlayer"
                          src={audioMeta.url}
                          key={audioMeta.url.split("token=")[1]}
                          controls
                        />
                      </>
                    );
                  })}
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
    .imageMetaContainer {
      padding: 0.4rem 0 !important;
      // height: auto;
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
    // margin: auto !important;
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
  .imageContainer {
    // display: flex;
    // height: 400px;
  }
  .imageMetaContainer {
    background-color: #fafafa;
    text-align: center;
    padding: .5rem 2rem;
    bottom: 0;
  }
  .imageMetaBackground { 
    background-color: #eaeaea;
    height: 100%;
    padding: .5rem;
  }
  .imageName {
    margin: 0;
    word-wrap: break-word;
  }
  .imageDesc {
    margin: 10px 0 0 0;
    color: #000000ad;
    word-wrap: break-word;
  }
  .header { 
    text-align: center;
  }
  .audioName {
    text-align: center;
    margin-bottom: 0px;
    word-wrap: break-word;
  }
  .audioDesc {
    text-align: center;
    margin-bottom: 5px;
    color: grey;
    word-wrap: break-word;
  }
  .audioPlayer {
    display: block;
    width: 100%;
    margin-bottom: 0.5rem;
  }
  .modal-content {
    border-radius: 0;
    word-wrap: break-word;
  }
  `}</style>
);

export default MapPOIInfo;
