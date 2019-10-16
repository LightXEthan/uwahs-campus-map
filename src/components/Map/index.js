import React, { Fragment } from "react";
import { compose, withProps } from "recompose";
import dotenv from "dotenv";
import { Spinner, Button } from "reactstrap";
import userMarker from "./locateMarker.png";
import northPoint from "./NorthPoint1.png";
import poiIcon from "./infoIcon.png";

import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker
} from "react-google-maps";

dotenv.config();

const retroStyles = require("./retroStyle.json");
const retroLabels = require("./retroStyleLabel.json");

const outterStyle = {
  position: "fixed",
  left: "50%",
  top: "50%",
  transform: "translate(-50%, -50%)",
  width: "13vw",
  height: "13vw"
};

const innerStyle = {
  position: "fixed",
  left: "50%",
  top: "50%",
  transform: "translate(-50%, -50%)",
  width: "10vw",
  height: "10vw"
};

//Styling for North Pointer
const sidebarWidth = 380;
const mapWidth = 760;

const pointStyleWeb = {
  // position: "fixed",
  // left: window.innerWidth - 1.25 * sidebarWidth,
  // top: window.innerHeight - window.innerHeight * 0.925,
  position: "absolute",
  top: "20px",
  right: "20px",
  width: "80px",
  height: "80px"
};

const pointStyleMobile = {
  // position: "fixed",
  // left: "85vw",
  // top: window.innerHeight - window.innerHeight * 0.9,
  position: "absolute",
  top: "60px",
  right: "20px",
  width: "15vw",
  height: "15vw"
};

const resetViewButton = {
  // position: "fixed",
  // left: window.innerWidth - (sidebarWidth + 100),
  // top: window.innerHeight - window.innerHeight * 0.08,
  // width: "100px",
  // height: "2rem"
  // position: "absolute",
  // bottom: "10px",
  // left: "50%",
  // transform: "translate(-50%, 0)",
  padding: ".5rem 0rem",
  fontWeight: "500",
  fontSize: "1em"
};

//Styling for Hide PoI Button
const hidePOIButton = {
  // position: "absolute",
  // bottom: "10px",
  // left: "50%",
  // transform: "translate(-50%, 0)",
  padding: "1rem 0rem",
  fontWeight: "500",
  fontSize: "1em"
  // left: "5vw",
  // top: window.innerHeight - window.innerHeight * 0.03
};

const buttonGroupStyle = {
  position: "absolute",
  bottom: "14px",
  left: "50%",
  transform: "translate(-50%, 0)",
  padding: ".5rem 2rem",
  width: "60%"
};

// const resetViewButtonMobile = {
//   position: "fixed",
//   left: window.innerWidth - 100,
//   top: window.innerHeight - window.innerHeight * 0.06,
//   width: "100px",
//   height: "2rem"
// };
// const pointStyleMobile ={

//       position : "fixed",
//       left : "85vw",
//       top : window.innerHeight - (window.innerHeight *0.90),
//       width : "15vw",
//       height : "15vw"
// }
// left: "5vw",
// top: window.innerHeight - window.innerHeight * 0.03
// };

// const buttonStyleMobile = {
//   position: "fixed",
//   left: "1vw",
//   top: window.innerHeight - window.innerHeight * 0.07
// };

/**
 * loadingElement: react element when loading google maps
 * containerElement: container... set to window height - height of header
 * TODO: doesn't affect mobile view...
 * mapElement: react element for contained in containerElement... set to 100 to fill containerElement
 */
const Map = compose(
  withProps({
    googleMapURL: `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_API_KEY}&libraries=geometry,drawing,places`,
    loadingElement: (
      <Fragment>
        <Spinner color="success" style={outterStyle} />
        <Spinner color="warning" style={innerStyle} />
      </Fragment>
    ),
    containerElement: <div style={{ height: `100vh`, width: `100%` }} />,
    mapElement: <div style={{ height: `100vh`, width: `100%` }} />
  }),
  withScriptjs,
  withGoogleMap
)(props => (
  <GoogleMap
    defaultZoom={parseFloat(process.env.REACT_APP_UWA_ZOOM)}
    defaultCenter={{
      lat: parseFloat(process.env.REACT_APP_UWA_LAT),
      lng: parseFloat(process.env.REACT_APP_UWA_LNG)
    }}
    options={
      props.isMarkerShown
        ? {
            styles: retroStyles,
            disableDefaultUI: true,
            mapTypeId: "roadmap",
            zoomControl: true
          }
        : {
            styles: [],
            disableDefaultUI: false,
            fullscreenControl: false,
            streetViewControl: false,
            mapTypeControlOptions: { mapTypeIds: ["roadmap", "satellite"] }
          }
    }
    center={{
      lat: props.mapCenter.lat,
      lng: props.mapCenter.lng
    }}
  >
    {props.isMarkerShown && ( //This section relates to displaying of PoI Markers
      <Fragment>
        {props.POIList.map(marker => (
          <Marker
            opacity={0.8}
            icon={poiIcon}
            key={marker._id}
            position={{
              lat: marker.location.latitude,
              lng: marker.location.longitude
            }}
            onClick={() => {
              props.onMarkerClick(marker);
            }}
          />
        ))}
      </Fragment>
    )}

    <Marker //Seperate userLocation from PoI markers.
      icon={userMarker}
      zIndex={10}
      position={{
        lat: props.currentLocation.lat,
        lng: props.currentLocation.lng
      }}
    />
    <img
      className="northPoint"
      src={northPoint}
      style={window.innerWidth > 760 ? pointStyleWeb : pointStyleMobile}
      alt="NorthPointer"
    />
    <div className="btn-group-vertical" style={buttonGroupStyle}>
      <Button
        color="primary"
        size="sm"
        style={hidePOIButton}
        onClick={props.onButtonClick}
      >
        {props.isMarkerShown ? "Hide Markers" : "Show Markers"}
      </Button>
      <Button
        color="info"
        size="sm"
        style={resetViewButton}
        onClick={props.onResetView}
      >
        Reset View
      </Button>
    </div>
  </GoogleMap>
));

export default Map;
