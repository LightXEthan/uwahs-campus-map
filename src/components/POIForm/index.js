import React, { Component, Fragment } from "react";

import { withFirebase } from "../Firebase";
import firebase from 'firebase/app';
import "firebase/firebase-storage";

import { Button, Form, FormGroup, Label, Input } from "reactstrap";

class POIForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      longitude: 0,
      latitude: 0,
      fileupload: null,
      filetype: null,
      imageList: [],
      audioList: []
    };
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onChangeFile = e => {
    if (e.exists) {
      this.setState({
        fileupload: e.target.files[0],
        filetype: e.target.files[0].type
      });
    }
  };

  onSubmit = e => {
    const { name, longitude, latitude, fileupload, imageList, audioList, filetype } = this.state;
    
    /* data to be written to firebase
     * name: name of the location
     * location: [lat, long]
     * timestamp: date added
     * imageList: [list of images ref]
     * audioList: [list of audio ref]
     */ 
    var data = {
      name: name,
      location: new firebase.firestore.GeoPoint(parseFloat(latitude), parseFloat(longitude)),
      timestamp: firebase.firestore.Timestamp.now(),
      imageList: [],
      audioList: []
    };

    if (fileupload === null) {
      // data is written to firebase
      this.props.firebase.poi().set(data, { merge: true });

    } else {
      // detects the type of file to organise into file in firebase storage
      var folder = '';
      var type = '';
      if (filetype.includes('image')) {
        folder = 'images/';
        type = 'image';
      }
      else if (filetype.includes('audio')) {
        folder = 'audios/';
        type = 'audio';
      }
      else {
        console.error("File uploaded not compatible type: " + filetype);
      }
      var storageRef = this.props.firebase.storage.ref(folder + fileupload.name);

      // uploads file to firebase storage
      storageRef.put(fileupload).then(() => {
        // gets the url from the uploaded file
        storageRef.getDownloadURL().then(
          (url) => {
            if (type === 'image') {
              imageList.push(url);
              data["imageList"] = imageList;
            }
            else if (type === 'audio') {
              audioList.push(url);
              data["audioList"] = audioList;
            }
            this.props.firebase.poi().set(data, { merge: true });
          },
          error => {
            console.log(error);
        });
      }, error => {
        console.log(error);
      });
    }
    
    e.preventDefault();
  };

  render() {
    const { name, longitude, latitude  } = this.state;

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
          <Label for="fileupload">Upload a file. (Image/Audio)</Label>
          <Input
            type="file"
            name="fileupload"
            id="fileupload"
            onChange={this.onChangeFile}
          />
        </FormGroup>
        <Button>Add Point of Interest</Button>
      </Form>
    );
  }
}

export default withFirebase(POIForm);
