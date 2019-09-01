import React, { Component } from "react";
import { compose, withProps } from "recompose";
import dotenv from "dotenv";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker
} from "react-google-maps";

dotenv.config();

class MapBase extends Component {

/**
 * loadingElement: react element when loading google maps
 * containerElement: container... set to window height - height of header
 * TODO: doesn't affect mobile view...
 * mapElement: react element for contained in containerElement... set to 100 to fill containerElement
 */
const Map = compose(
  withProps({
    googleMapURL: `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_API_KEY}&libraries=geometry,drawing,places`,
    loadingElement: <h1>loading...</h1>,
    containerElement: (
      <div style={{ height: `${window.innerHeight - 56}px`, width: `100%` }} />
    ),
    mapElement: <div style={{ height: `100%`, width: `100%` }} />
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
    defaultOptions={{ styles: retroStyles }}
  >
    {props.isMarkerShown && (
      <div>
        <Marker
          position={{
            lat: props.currentLocation.lat,
            lng: props.currentLocation.lng
          }}
          onClick={props.onMarkerClick}
        />
        <Marker
          position={{
            lat: parseFloat(process.env.REACT_APP_UWA_LAT),
            lng: parseFloat(process.env.REACT_APP_UWA_LNG)
          }}
          onClick={props.onMarkerClick}
        />
      </div>
    )}
  </GoogleMap>
));

export default Map;
