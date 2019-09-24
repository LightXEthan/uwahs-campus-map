import React, { Component, Fragment } from "react";
import { ListGroup, ListGroupItem, Col, Button, Span } from "reactstrap";
import { withFirebase } from "../Firebase";

import POIEditForm from "../POIEditForm";
class POIList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,   // true when poi list is loading
      sort: "name",     // Vaiable for sorting
      poilist: []       // stores list of poi
    };
  }

  componentDidMount() {
    this.setState({ loading: true });

    // Gets realtime list of poi
    this.listener = this.props.firebase.pois().orderBy(this.state.sort).onSnapshot(
      snapshot => {
        let poilist = [];

        // Gets the data from each poi
        snapshot.forEach(doc => {
          const data = doc.data();
          const _id = doc.id;
          let poiDoc = {_id, ...data};
          poilist.push(poiDoc);
        });

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
              // add the below to ListGroupItem to align edit pencil to the right
              //className="d-flex justify-content-between align-items-center"
              <ListGroupItem key={poi._id} action>
                  name: {poi.name},
                  latitude: {poi.location.latitude},
                  longitude: {poi.location.longitude}
                  <POIEditForm poi={poi}/>
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
