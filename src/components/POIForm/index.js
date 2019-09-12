import React, { Component, Fragment } from "react";
import { Button, Modal, ModalHeader, ModalBody, Label, Col, Form, FormGroup, Input } from 'reactstrap';

import { withFirebase } from "../Firebase";
import firebase from 'firebase/app';
import "firebase/firebase-storage";

const INITIAL_STATE = {
  name: "",
  longitude: 0,
  latitude: 0,
  fileupload: null,
  filetype: null,
  imageList: [],
  audioList: []
}
class POIForm extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE};
  }

  toggleModal = () => {
    this.setState({
        isModalOpen: !this.state.isModalOpen
    });
  };

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onChangeFile = e => {
    if (e.target.files.length === 0) {
      this.setState({
        fileupload: null,
        filetype: null
      });
    }
    else {
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
      this.props.firebase.poi().set(data, { merge: true })
      .then(() => {
        this.setState({ ...INITIAL_STATE });
      })
    } else {
      // detects the type of file to organise into file in firebase storage
      var folder = null;
      var type = null;
      if (filetype.includes('image')) {
        folder = 'images/';
        type = 'image';
      }
      else if (filetype.includes('audio')) {
        folder = 'audios/';
        type = 'audio';
      }
      else {
        console.error("File uploaded is an incompatible file type: " + filetype);
        alert("Error: incompatible file type.");
      }

      if (folder !== null) {

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
              // Adds the download link and data to firestore
              this.props.firebase.poi().set(data, { merge: true });
            },
            error => {
              console.log(error);
              alert("Error with getting file from firestore.");
          })
          .then(() => {
            this.setState({ ...INITIAL_STATE });
          })
        }
        , error => {
          console.log(error);
          alert("Error with uploading file to firebase storage.");
        });
      }
    }

    this.toggleModal();
    e.preventDefault();
  };

  render() {
    const { name, longitude, latitude  } = this.state;
    const isInvalid = name === '';

    return (
        <Fragment>
            <Button outline color="none" onClick={this.toggleModal}>
                <i className="fa fa-plus-circle fa-3x"></i>
            </Button> 
            <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                <ModalHeader toggle={this.toggleModal}>Add point of interest</ModalHeader>
                <ModalBody>
                    <Form onSubmit={this.onSubmit}>
                        <FormGroup>
                            <Label htmlFor="name" xs={12}>Name</Label>
                            <Col>
                                <Input
                                    id="name"
                                    name="name"
                                    value={name}
                                    onChange={this.onChange}
                                    type="text"
                                    placeholder="point of interest"
                                />
                            </Col>
                        </FormGroup>
                        <FormGroup>
                            <Label htmlFor="latitude" xs={12}>Latitude</Label>
                            <Col>
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
                            </Col>
                        </FormGroup>
                        <FormGroup>
                            <Label htmlFor="longitude" xs={12}>Longitude</Label>
                            <Col>
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
                            </Col>
                        </FormGroup>
                        <FormGroup>
                            <Label htmlFor="fileupload" xs={12}>Upload a file. (Image/Audio)</Label>
                            <Col>
                                <Input
                                    type="file"
                                    name="fileupload"
                                    id="fileupload"
                                    onChange={this.onChangeFile}
                                />
                            </Col>
                        </FormGroup>
                        <FormGroup className="text-right">
                            <Col xs={12}>
                                <Button type="submit" color="primary" disabled={isInvalid}>
                                    Save
                                </Button>
                            </Col>
                        </FormGroup>
                    </Form>
                </ModalBody>
            </Modal>  
        </Fragment>        
    );
  }
}

export default withFirebase(POIForm);
