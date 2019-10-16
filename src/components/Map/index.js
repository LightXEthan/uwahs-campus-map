import React, { Fragment, Component } from "react";
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
  position: "absolute",
  top: "20px",
  right: "20px",
  width: "80px",
  height: "80px"
};

const pointStyleMobile = {
  position: "absolute",
  top: "60px",
  right: "20px",
  width: "15vw",
  height: "15vw"
};

//Styling for Hide PoI Button
const buttonStyle = {
  padding: ".5rem 0rem",
  fontWeight: "500",
  fontSize: "1em"
};

// const lesserButton = {
//   padding: ".2rem 0rem",
//   fontWeight: "500",
//   fontSize: "1em"
// };

const buttonGroupStyle = {
  position: "absolute",
  bottom: "14px",
  left: "50%",
  transform: "translate(-50%, 0)",
  padding: ".5rem 2rem",
  width: "60%"
};

const buttonGroupStyleMobile = {
  position: "absolute",
  bottom: "14px",
  left: "50%",
  transform: "translate(-50%, 0)",
  padding: ".5rem 2rem",
  width: "80%"
};

class MapBase extends Component {
  constructor(props) {
    super(props);

    this.state = {
      zoomLvl: parseFloat(process.env.REACT_APP_UWA_ZOOM),
      mapCenter: {
        lat: parseFloat(process.env.REACT_APP_UWA_LAT),
        lng: parseFloat(process.env.REACT_APP_UWA_LNG)
      },
      currentLoc: {
        lat: 0,
        lng: 0
      },
      selectedPOI: null
    };
  }

  componentDidMount() {
    // this.delayedShowMarker();
  }

  componentDidUpdate() {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        position => {
          if (position.coords) {
            this.setState(prevState => ({
              currentLoc: {
                ...prevState.currentLoc,
                lat: position.coords.latitude,
                lng: position.coords.longitude
              }
            }));
          } else {
            alert("GeoLocation is not supported by this browser.");
          }
        },
        error => {
          let msg = null;
          switch (error.code) {
            case error.PERMISSION_DENIED:
              msg = "User denied the request for Geolocation.";
              break;
            case error.POSITION_UNAVAILABLE:
              msg = "Location information is unavailable.";
              break;
            case error.TIMEOUT:
              msg = "The request to get user location timed out.";
              break;
            default:
              msg = "An unknown error occurred.";
              break;
          }
          alert(msg);
        },
        {
          enableHighAccuracy: false,
          // timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      alert("GeoLocation is not supported by this browser.");
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      selectedPOI: nextProps.selectedPOI
    });

    if (nextProps.selectedPOI === null) {
      this.handleResetView();
    } else {
      nextProps.selectedPOI && this.handleMoveToMarker(nextProps.selectedPOI);
    }
  }

  handleCenterChanged = () => {
    const center = this.refs.map.getCenter();
    const mapCenter = { lat: center.lat(), lng: center.lng() };
    if (JSON.stringify(mapCenter) !== JSON.stringify(this.state.mapCenter)) {
      this.setState({ mapCenter });
    }
  };

  handleZoomChanged = () => {
    const zoomLvl = this.refs.map.getZoom();
    if (JSON.stringify(zoomLvl) !== JSON.stringify(this.state.zoomLvl)) {
      this.setState({ zoomLvl });
    }
  };

  handleMoveToMarker = poi => {
    this.refs.map.panTo({
      lat: poi.location.latitude, //Lat value as specified in the env file
      lng: poi.location.longitude
    });
    this.setState({
      zoomLvl: parseFloat(process.env.REACT_APP_UWA_ZOOM) + 2
    });
  };

  //Function regarding reseting the view when a button is pressed
  handleResetView = () => {
    this.refs.map.panTo({
      lat: parseFloat(process.env.REACT_APP_UWA_LAT), //Lat value as specified in the env file
      lng: parseFloat(process.env.REACT_APP_UWA_LNG) //Long value as specified in the env file
    });
    this.setState({ zoomLvl: parseFloat(process.env.REACT_APP_UWA_ZOOM) });
  };

  handleCenterOnMe = () => {
    this.refs.map.panTo({
      lat: this.state.currentLoc.lat,
      lng: this.state.currentLoc.lng
    });
    this.setState({ zoomLvl: parseFloat(process.env.REACT_APP_UWA_ZOOM) });
  };

  render() {
    const { zoomLvl, mapCenter, currentLoc } = this.state;
    const {
      POIList,
      isMarkerShown,
      onMarkerClick,
      onPOIVisibility
    } = this.props;

    return (
      <GoogleMap
        defaultZoom={parseFloat(process.env.REACT_APP_UWA_ZOOM)}
        defaultCenter={{
          lat: parseFloat(process.env.REACT_APP_UWA_LAT),
          lng: parseFloat(process.env.REACT_APP_UWA_LNG)
        }}
        zoom={zoomLvl}
        center={mapCenter}
        onCenterChanged={this.handleCenterChanged}
        onZoomChanged={this.handleZoomChanged}
        ref="map"
        options={
          isMarkerShown
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
      >
        {isMarkerShown && ( //This section relates to displaying of PoI Markers
          <Fragment>
            {POIList.map(marker => (
              <Marker
                opacity={0.8}
                icon={poiIcon}
                key={marker._id}
                position={{
                  lat: marker.location.latitude,
                  lng: marker.location.longitude
                }}
                onClick={() => {
                  onMarkerClick(marker);
                }}
              />
            ))}
          </Fragment>
        )}

        <Marker //Seperate userLocation from PoI markers.
          icon={userMarker}
          zIndex={10}
          position={{
            lat: currentLoc.lat,
            lng: currentLoc.lng
          }}
        />
        <img
          className="northPoint"
          src={northPoint}
          style={window.innerWidth > 760 ? pointStyleWeb : pointStyleMobile}
          alt="NorthPointer"
        />
        <div
          className="btn-group"
          style={
            window.innerWidth > 760 ? buttonGroupStyle : buttonGroupStyleMobile
          }
        >
          <Button
            color="info"
            size="sm"
            style={buttonStyle}
            onClick={this.handleResetView}
          >
            Reset View
          </Button>
          <Button
            color="primary"
            size="sm"
            style={buttonStyle}
            onClick={onPOIVisibility}
          >
            {isMarkerShown ? "Hide Markers" : "Show Markers"}
          </Button>
          <Button
            color="info"
            size="sm"
            style={buttonStyle}
            onClick={this.handleCenterOnMe}
          >
            My Location
          </Button>
        </div>
      </GoogleMap>
    );
  }
}

/**
 * loadingElement: react element when loading google maps
 * containerElement: container... set to window height - height of header
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
)(MapBase);

export default Map;
