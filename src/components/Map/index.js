import React, { Fragment } from "react";
import { compose, withProps } from "recompose";
import dotenv from "dotenv";
import { Spinner, Button } from "reactstrap";
import userMarker from "./locateMarker.png";
import northPoint from "./NorthPoint1.png";

import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker
} from "react-google-maps";

dotenv.config();

const retroStyles = require("./retroStyle.json");

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

const sidebarWidth = 380;
const mapWidth = 760;

const pointStyleWeb = {
  position: "fixed",
  left: window.innerWidth - 1.25 * sidebarWidth,
  top: window.innerHeight - window.innerHeight * 0.925,
  width: "80px",
  height: "80px"
};

const pointStyleMobile = {
  position: "fixed",
  left: "85vw",
  top: window.innerHeight - window.innerHeight * 0.9,
  width: "15vw",
  height: "15vw"
};

const resetViewButton = {
  // position: "fixed",
  // left: window.innerWidth - (sidebarWidth + 100),
  // top: window.innerHeight - window.innerHeight * 0.08,
  // width: "100px",
  // height: "2rem"
  position: "absolute",
  bottom: "10px",
  left: "50%",
  transform: "translate(-50%, 0)",
  padding: ".5rem 2rem"
};

// const resetViewButtonMobile = {
//   position: "fixed",
//   left: window.innerWidth - 100,
//   top: window.innerHeight - window.innerHeight * 0.06,
//   width: "100px",
//   height: "2rem"
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
    defaultOptions={{ styles: retroStyles, disableDefaultUI: true }}
    center={{
      lat: props.mapCenter.lat,
      lng: props.mapCenter.lng
    }}
  >
    {props.isMarkerShown && (
      <Fragment>
        {props.POIList.map(marker => (
          <Marker
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
      position={{
        lat: props.currentLocation.lat,
        lng: props.currentLocation.lng
      }}
    />
    <img
      src={northPoint}
      style={window.innerWidth > mapWidth ? pointStyleWeb : pointStyleMobile}
      alt="NorthPointer"
    />
    <Button
      color="info"
      size="sm"
      style={resetViewButton}
      onClick={props.onResetView}
    >
      Reset View
    </Button>
  </GoogleMap>
));

export default Map;
