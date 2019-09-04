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
      imageList: [],
      audioList: [],
      loading: true,
      image: ""
    };
  }

  componentDidMount() {
    this.setState({ loading: true });

    var storageRef = this.props.firebase.storage.ref();
    var file = "images/pig.png";
    this.listener = storageRef.child(file).getDownloadURL().then(
      (url) => {
        this.setState({
          image: url,
          loading: false 
        });
        console.log("Image has got: ", url);
    },
      error => {
        console.log(error);
    });
  }

  componentWillUnmount() {
    this.listener();
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onChangeFile = e => {
    this.setState({
      fileupload: e.target.files[0],
      filetype: e.target.files[0].type
    });
  };

  onSubmit = e => {
    const { name, longitude, latitude, fileupload, imageList, filetype } = this.state;

    // detects the type of file to organise into file in firebase storage
    var folder = ''
    if (filetype.includes('image')) {
      folder = 'images/'
    }
    else if (filetype.includes('audio')) {
      folder = 'audios/'
    }
    else {
      console.error("File uploaded not compatible type: " + filetype);
    }
    var storageRef = this.props.firebase.storage.ref(folder + fileupload.name);

    // data to be written to firebase
    /* name: name of the location
     * location: [lat, long]
     * timestamp: date added
     * imageList: [list of images ref]
     * audioList: [list of audio ref]
     */ 
    const data = {
      name: name,
      location: new firebase.firestore.GeoPoint(parseFloat(latitude), parseFloat(longitude)),
      timestamp: firebase.firestore.Timestamp.now()
    };

    // data is written to firebase
    this.props.firebase.poi(name).set(data, { merge: true });
    
    // uploads file to firebase
    storageRef.put(fileupload).then(() => {
      console.log('Uploaded file success!');
      // gets the url from the uploaded file
      storageRef.getDownloadURL().then(
        (url) => {
          imageList.push(url);
          console.log("File uploaded: ", url);
          this.props.firebase.poi(name).set({imageList: imageList}, { merge: true });
        },
        error => {
          console.log(error);
      });
    }, error => {
      console.log(error);
    });

    e.preventDefault();
  };

  render() {
    const { name, longitude, latitude, loading, image  } = this.state;

    return (
      
      <Form onSubmit={this.onSubmit}>
        {loading ? (
          <p>Loading...</p>
        ) : (<img src={image}
        height="200"
        width="200"
        alt="pig"></img>
        )}
        
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
