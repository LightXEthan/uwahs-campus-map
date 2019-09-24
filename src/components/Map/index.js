import React, { Fragment } from "react";
import { compose, withProps } from "recompose";
import dotenv from "dotenv";
import { Spinner  } from 'reactstrap';
import userMarker from './locateMarker.png';
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker
} from "react-google-maps";

dotenv.config();

const retroStyles = require("./retroStyle.json");

const outterStyle = {
  position:'fixed',
  left:'50%',
  top:'50%',
  transform: 'translate(-50%, -50%)',
  width : '13vw',
  height : '13vw'
}

const innerStyle = {
  position:'fixed',
  left:'50%',
  top:'50%',
  transform: 'translate(-50%, -50%)',
  width : '10vw',
  height : '10vw'
}



/**
 * loadingElement: react element when loading google maps
 * containerElement: container... set to window height - height of header
 * TODO: doesn't affect mobile view...
 * mapElement: react element for contained in containerElement... set to 100 to fill containerElement
 */
=======
const Map = compose(
  withProps({
    googleMapURL: `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_API_KEY}&libraries=geometry,drawing,places`,
    loadingElement: <Fragment> <Spinner color='success' style={outterStyle}/> <Spinner color='warning' style={innerStyle} /> </Fragment> ,
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
        {props.POIList.map(marker => (
        <Marker
          position={{
            lat: props.currentLocation.lat,
            lng: props.currentLocation.lng
          }}
        />
      </Fragment>
    )}

    <Marker       //Seperate userLocation from PoI markers.
          icon= {userMarker}
          position={{
            lat: props.currentLocation.lat,
            lng: props.currentLocation.lng,                      
          }}
        />

  </GoogleMap>
));

export default Map;
