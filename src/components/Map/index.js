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
  render() {
    const config = {};

    return (
      <GoogleMap
        defaultZoom={parseFloat(process.env.REACT_APP_UWA_ZOOM)}
        defaultCenter={{
          lat: parseFloat(process.env.REACT_APP_UWA_LAT),
          lng: parseFloat(process.env.REACT_APP_UWA_LNG)
        }}
      >
        {this.props.isMarkerShown && (
          <Marker
            position={{ lat: -34.397, lng: 150.644 }}
            onClick={this.props.onMarkerClick}
          />
        )}
      </GoogleMap>
    );
  }
}

/**
 * loadingElement: react element when loading google maps
 * containerElement: react element for container... set to window height - height of header
 * TODO: doesn't affect mobile view...
 * mapElement: react element for...
 */
const Map = compose(
  withProps({
    googleMapURL: `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_API_KEY}&libraries=geometry,drawing,places`,
    loadingElement: <h1>loading...</h1>,
    containerElement: (
      <div style={{ height: `${window.innerHeight - 56}px`, width: `100%` }} />
    ),
    mapElement: (
      <div style={{ height: `${window.innerHeight - 56}px`, width: `100%` }} />
    )
  }),
  withScriptjs,
  withGoogleMap
)(MapBase);

export default Map;
