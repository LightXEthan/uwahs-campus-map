import React, { Component, Fragment } from "react";

import Map from "../Map";
import { withFirebase } from "../Firebase";

class MapPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isMarkerShown: false,
      currentLatLng: {
        lat: 0,
        lng: 0
      },
      POIList: []
    };
  }

  componentDidMount() {
    this.delayedShowMarker();

    this.listener = this.props.firebase.pois().onSnapshot(
      snapshot => {
        let POIList = [];

        snapshot.forEach(doc => POIList.push(doc.data()));

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

  handleMarkerClick = () => {
    this.setState({ isMarkerShown: false });
    this.delayedShowMarker();
  };

  render() {
    const { isMarkerShown, currentLatLng, POIList } = this.state;

    return (
      <Fragment>
        <Map
          isMarkerShown={isMarkerShown}
          onMarkerClick={this.handleMarkerClick}
          currentLocation={currentLatLng}
          POIList={POIList}
        />
      </Fragment>
    );
  }
}

export default withFirebase(MapPage);
