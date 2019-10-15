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
      fileList: [],
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

    this.filelistener = this.props.firebase.files().onSnapshot(
      snapshot => {
        let fileList = [];

        snapshot.forEach(doc => {
          const _id = doc.id;
          const data = doc.data();
          const file = { _id, ...data };
          fileList.push(file);
        });

        this.setState({
          fileList
        });
      },
      error => {
        // TODO: set error state and display error as alert
      }
    );
  }

  /*
  magnometerMount(){
        //Section regarding use of magnometer to display current direction.
        navigator.permissions.query({ name: 'accelerometer' })
        .then(result => {
          if (result.state === 'denied') {
            console.log('Permission to use accelerometer sensor is denied.');
          return;
          }
          console.log('Permission to use accelerometer sensor is allowed.');
          let magSensor = new Magnetometer({frequency: 60});
    
          magSensor.addEventListener('reading', e => {
            console.log("Magnometer is currently working\n")
            console.log("Magnetic field along the X-axis " + magSensor.x + "\n");
            console.log("Magnetic field along the Y-axis " + magSensor.y + "\n");
            console.log("Magnetic field along the Z-axis " + magSensor.z + "\n");
          })
          magSensor.addEventListener('error', event => {
            console.log(event.error.name, event.error.message);
          })
          magSensor.start();  
        };
  }
  */

    //Function regarding reseting the view when a button is pressed
  resetView = () => {
    this.setState(
      () => ({
        mapCenter: {
          lat: parseFloat(process.env.REACT_APP_UWA_LAT),  //Lat value as specified in the env file
          lng: parseFloat(process.env.REACT_APP_UWA_LNG),  //Long value as specified in the env file
        },
        mapZoom: 16      //Zoom value as specified in the env file.
      })
    );
  };



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
    this.filelistener();
  }

  delayedShowMarker = () => {
    setTimeout(() => {
      this.setState({ isMarkerShown: true });
    }, 3000);
  };

  handleDeselect = () => {
    this.setState((state, props) => ({
      selectedPOI: null,
      modal: !state.modal
    }));
  };

  handleSelectPOI = poi => {
    this.setState(
      (state, props) => ({
        mapCenter: {
          lat: poi.location.latitude,
          lng: poi.location.longitude
        },
        selectedPOI: poi
      }),
      () => {
        setTimeout(() => {
          this.setState((state, props) => ({
            modal: !state.modal
          }));
        }, 400);
      }
    );
  };

  render() {
    const {
      isMarkerShown,
      currentLatLng,
      POIList,
      mapCenter,
      mapZoom,
      selectedPOI,
      modal,
      fileList
    } = this.state;

    return (
      <Fragment>
        {style}
        <Container style={{ padding: "0", margin: "0", maxWidth: "100vw" }}>
          <Row style={{ margin: "0" }}>
            <Col
              style={{
                maxWidth: `${
                  window.innerWidth > 760
                    ? window.innerWidth - 380
                    : window.innerWidth
                }px`,
                padding: 0
              }}
            >
              <Map
                isMarkerShown={isMarkerShown}
                onMarkerClick={this.handleSelectPOI}
                onResetView = {this.resetView}
                currentLocation={currentLatLng}
                mapCenter={mapCenter}
                zoom={mapZoom}
                POIList={POIList}
              />
            </Col>
            <Col className="sidebar">
              <MapPOIList
                POIList={POIList}
                onListItemClick={this.handleSelectPOI}
              />
            </Col>
          </Row>
        </Container>
        {selectedPOI && (
          <MapPOIInfo
            modal={modal}
            poi={selectedPOI}
            files={fileList}
            toggle={this.handleDeselect}
          />
        )}
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
