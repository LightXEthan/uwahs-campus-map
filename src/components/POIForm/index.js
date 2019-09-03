import React, { Component, Fragment } from "react";

import { withFirebase } from "../Firebase";
import firebase from 'firebase/app'
import "firebase/firebase-storage";

import { Button, Form, FormGroup, Label, Input } from "reactstrap";

class POIForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      longitude: 0,
      latitude: 0,
      timestamp: 0,
      imageStatus: "loading"
    };
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = e => {
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

    var storageRef = this.props.firebase.storage;

    var imageRef;
    storageRef.child("images/pig.png").getDownloadURL().then((url) => {
      console.log("Image has got: ", url);
      imageRef = url;
    });
    console.log("Image has got: ", imageRef);
    // The plan is to use the below code so the url can be changed, this is mainly for testing purposes
    /*
    <img src={imageRef}
        height="200"
        width="200"
        alt="pig"></img>
    */

    return (
      
      <Form onSubmit={this.onSubmit}>
        <img src="https://firebasestorage.googleapis.com/v0/b/map-app-test-8d1f6.appspot.com/o/images%2Fpig.png?alt=media&token=6dd4d11d-750c-4010-a10e-d8f8f0f9fe32"
        height="200"
        width="200"
        alt="pig"></img>
        
        <audio controls>
          <source src="https://firebasestorage.googleapis.com/v0/b/map-app-test-8d1f6.appspot.com/o/audioclip-1564057356-96047.mp4?alt=media&token=e41aeebb-fad5-4362-87ea-04659bd51af0"
        type="audio/mpeg"/>
        </audio> 
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
