import React, { Component, Fragment } from "react";

import { withFirebase } from "../Firebase";
import firebase from 'firebase/app'

import { Button, Form, FormGroup, Label, Input } from "reactstrap";

class POIForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      longitude: 0,
      latitude: 0,
      timestamp: 0
    };
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = e => {
    console.log("here");
    const { name, longitude, latitude } = this.state;

    const data = {
      name: name,
      location: new firebase.firestore.GeoPoint(parseFloat(latitude), parseFloat(longitude)),
      timestamp: firebase.firestore.Timestamp.now()
    };

    this.props.firebase.poi(name).set(data, { merge: true });

    e.preventDefault();
  };

  render() {
    const { name, longitude, latitude } = this.state;

    return (
      <Form onSubmit={this.onSubmit}>
        <FormGroup>
          <Label for="name">Name</Label>
          <Input
            type="text"
            name="name"
            id="name"
            placeholder="POI Name"
            value={name}
            onChange={this.onChange}
          />
          <Label for="latitude">Latitude</Label>
          <Input
            type="number"
            name="latitude"
            id="latitude"
            value={latitude}
            onChange={this.onChange}
            min="-90"
            max="90"
            step="any"
          />
          <Label for="longitude">Longitude</Label>
          <Input
            type="number"
            name="longitude"
            id="longitude"
            value={longitude}
            onChange={this.onChange}
            min="-180"
            max="180"
            step="any"
          />
        </FormGroup>
        <Button>Add Point of Interest</Button>
      </Form>
    );
  }
}

export default withFirebase(POIForm);
