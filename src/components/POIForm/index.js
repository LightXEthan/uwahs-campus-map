import React, { Component, Fragment } from "react";

import { withFirebase } from "../Firebase";

import { Button, Form, FormGroup, Label, Input } from "reactstrap";

class POIForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      longitude: "",
      latitude: ""
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
      longitude: longitude,
      latitude: latitude
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
          <Label for="longitude">Longitude</Label>
          <Input
            type="text"
            name="longitude"
            id="longitude"
            placeholder="longitude"
            value={longitude}
            onChange={this.onChange}
          />
          <Label for="latitude">Latitude</Label>
          <Input
            type="text"
            name="latitude"
            id="latitude"
            placeholder="Latitude"
            value={latitude}
            onChange={this.onChange}
          />
        </FormGroup>
        <Button>Add Point of Interest</Button>
      </Form>
    );
  }
}

export default withFirebase(POIForm);
