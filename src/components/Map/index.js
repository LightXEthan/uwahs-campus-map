import React, { Fragment } from "react";
import { compose, withProps } from "recompose";
import dotenv from "dotenv";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker
} from "react-google-maps";

dotenv.config();

const retroStyles = require("./retroStyle.json");

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
    center={{
      lat: props.mapCenter.lat,
      lng: props.mapCenter.lng
    }}
    defaultOptions={{ styles: retroStyles }}
  >
    {props.isMarkerShown && (
      <Fragment>
        <Marker
          position={{
            lat: props.currentLocation.lat,
            lng: props.currentLocation.lng
          }}
        />
        {props.POIList.map(poi => (
          <Marker
            key={poi._id}
            position={{
              lat: poi.location.latitude,
              lng: poi.location.longitude
            }}
            onClick={() => {
              props.onMarkerClick(poi);
            }}
          />
        ))}
      </Fragment>
    )}
  </GoogleMap>
));

export default Map;
