import React, { Component } from "react";

import { Row, Col, Modal, ModalHeader, ModalBody } from "reactstrap";

const MapPOIInfo = props => {
  const { poi, onBack, modal, toggle } = props;

  return (
    <>
      <Modal isOpen={modal} toggle={toggle} size="lg" scrollable>
        <ModalHeader toggle={toggle}>
          <h3 style={{ marginBottom: 0 }}>{poi.name}</h3>
        </ModalHeader>
        <ModalBody>
          <Row noGutters>
            <Col>
              {poi.imageList.length === 0 ? (
                "There is no images for this point at the moment."
              ) : (
                <img
                  src={poi.imageList[0]}
                  alt=""
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    height: "auto"
                  }}
                />
              )}
            </Col>
          </Row>
          <hr />
          <Row noGutters>
            <Col>
              {poi.description === "" || poi.description === undefined //TODO: for dev only
                ? "There is no description for this point at the moment."
                : poi.description}
            </Col>
          </Row>
          <hr />
          <Row noGutters>
            <Col>
              {poi.audioList.length === 0
                ? "There is no audio files for this point at the moment."
                : "stsdf"}{" "}
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    </>
  );
};

export default MapPOIInfo;
