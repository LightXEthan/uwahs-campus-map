import React, { Component, Fragment } from "react";

import Map from "../Map";
import MapPOIList from "../MapPOIList";
import MapPOIInfo from "../MapPOIInfo";

import { withFirebase } from "../Firebase";

import { Container, Row, Col } from "reactstrap";

class MapPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isMarkerShown: false,
      currentLatLng: {
        lat: 0,
        lng: 0
      },
      POIList: [],
      mapCenter: {
        lat: parseFloat(process.env.REACT_APP_UWA_LAT),
        lng: parseFloat(process.env.REACT_APP_UWA_LNG)
      },
      mapZoom: 16,
      selectedPOI: null,
      modal: false
    };
  }

  componentDidMount() {
    this.delayedShowMarker();

    this.listener = this.props.firebase.pois().onSnapshot(
      snapshot => {
        let POIList = [];

        snapshot.forEach(doc => {
          const _id = doc.id;
          const data = doc.data();
          const poi = { _id, ...data };
          POIList.push(poi);
        });

        this.setState({
          POIList,
          loading: false
        });
      },
      error => {
        // TODO: set error state and display error as alert
      }
    );
  }

  componentDidUpdate() {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        position => {
          if (position.coords) {
            this.setState(prevState => ({
              currentLatLng: {
                ...prevState.currentLatLng,
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

  componentWillUnmount() {
    this.listener();
  }

  delayedShowMarker = () => {
    setTimeout(() => {
      this.setState({ isMarkerShown: true });
    }, 3000);
  };

  handleMarkerClick = poi => {
    this.setState((state, props) => ({
      selectedPOI: poi,
      modal: !state.modal
    }));
  };

  handlePOIListItemClick = poi => {
    this.setState((state, props) => ({
      mapCenter: {
        lat: poi.location.latitude,
        lng: poi.location.longitude
      },
      selectedPOI: poi
    }));
  };

  handleDeselect = () => {
    this.setState((state, props) => ({
      selectedPOI: null
    }));
  };

  render() {
    const {
      isMarkerShown,
      currentLatLng,
      POIList,
      mapCenter,
      mapZoom,
      selectedPOI
    } = this.state;

    return (
      <Fragment>
        {style}
        <Container style={{ padding: "0", margin: "0", maxWidth: "100vw" }}>
          <Row style={{ margin: "0" }}>
            <Col
              style={{ maxWidth: `${window.innerWidth - 380}px`, padding: 0 }}
            >
              {selectedPOI == null ||
              (selectedPOI && window.innerWidth >= 760) ? (
                <Map
                  isMarkerShown={isMarkerShown}
                  onMarkerClick={this.handleMarkerClick}
                  currentLocation={currentLatLng}
                  mapCenter={mapCenter}
                  zoom={mapZoom}
                  POIList={POIList}
                />
              ) : (
                <MapPOIInfo poi={selectedPOI} onBack={this.handleDeselect} />
              )}
            </Col>
            <Col className="sidebar">
              {selectedPOI == null || window.innerWidth < 760 ? (
                <MapPOIList
                  POIList={POIList}
                  onListItemClick={this.handlePOIListItemClick}
                />
              ) : (
                <MapPOIInfo
                  className="infoSide"
                  poi={selectedPOI}
                  onBack={this.handleDeselect}
                />
              )}
            </Col>
          </Row>
        </Container>
      </Fragment>
    );
  }
}

const style = (
  <style>{`
    .sidebar, .infoSide {
      padding: 0;
      flex: 0 0 380px;
    }
    @media (max-width: 760px) {
      .sidebar {
        display: none;
      }
    }
  `}</style>
);

export default withFirebase(MapPage);
