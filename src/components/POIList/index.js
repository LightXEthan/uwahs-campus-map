import React, { Component, Fragment } from "react";
import { ListGroup, ListGroupItem, Col, Button } from "reactstrap";
import { withFirebase } from "../Firebase";

import POIEditForm from "../POIEditForm";
class POIList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      poilist: []
    };
  }

  componentDidMount() {
    this.setState({ loading: true });

    this.listener = this.props.firebase.pois().onSnapshot(
      snapshot => {
        let poilist = [];

        snapshot.forEach(doc => poilist.push(doc.data()));

        this.setState({
          poilist,
          loading: false
        });
      },
      error => {
        // TODO: set error state and display error as alert
      }
    );
  }

  comoponentWillUnmount() {
    this.listener();
  }

  render() {
    const { loading, poilist } = this.state;

    return (
      <Fragment>
        {loading ? (
          <h1>Loading</h1>
        ) : poilist.length > 0 ? (
          <ListGroup flush>
            {poilist.map(poi => (
              <ListGroupItem key={poi.name} action>
                  name: {poi.name},
                  latitude: {poi.location.latitude},
                  longitude: {poi.location.longitude}
                  <POIEditForm/>
            
              </ListGroupItem>
            ))}
          </ListGroup>
        ) : (
          <h1>No Points of Interests found in database</h1>
        )}
      </Fragment>
    );
  }
}

export default withFirebase(POIList);
