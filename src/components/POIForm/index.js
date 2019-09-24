import React, { Component, Fragment } from "react";
import { Button, Modal, ModalHeader, ModalBody, Label, Col, Form, FormGroup, Input, Progress } from 'reactstrap';

import { withFirebase } from "../Firebase";
import firebase from 'firebase/app';
import "firebase/firebase-storage";

const INITIAL_STATE = {
  name: "",           // Name of the poi
  longitude: 0,       // Longitude
  latitude: 0,        // Latitude
  description: "",    // Description of the poi
  fileupload: null,   // holds the file that is being uploaded
  uploadProgress: 0    // file upload progress
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
      this.setState({ fileupload: null });
    }
    else {
      this.setState({ fileupload: e.target.files[0] });
    }
  };

  onSubmit = e => {
    const { name, longitude, latitude, description, fileupload } = this.state;
    
    /* data to be written to firebase
     * name: name of the location
     * description: decription of the location
     * location: [lat, long]
     * last_modified: date last modified
     * date_created: date created
     * imageList: [list of images ref]
     * audioList: [list of audio ref]
     */ 
    var data = {
      name: name,
      description: description,
      location: new firebase.firestore.GeoPoint(parseFloat(latitude), parseFloat(longitude)),
      last_modified: firebase.firestore.FieldValue.serverTimestamp(),
      date_created: firebase.firestore.FieldValue.serverTimestamp(),
      imageList: [],
      audioList: []
    };

    if (fileupload === null) {
      // data is written to firebase
      this.props.firebase.pois().add(data)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
      });
      this.toggleModal();

    } else {
      // detects the type of file to organise into file in firebase storage
      var type = null;
      if (fileupload.type.includes('image')) {
        type = 'image';
      }
      else if (fileupload.type.includes('audio')) {
        type = 'audio';
      }
      else {
        console.error("File uploaded is an incompatible file type: " + fileupload.type);
        alert("Error: incompatible file type.");
      }

      if (type !== null) {

        // Create a firebase storage reference to the uploading file. Types are put in folers
        var storageRef = this.props.firebase.storage.ref(type + 's/' + fileupload.name);

        // upload file
        var uploadTask = storageRef.put(fileupload);

        // monitor progress of file upload
        uploadTask.on('state_changed', (snapshot) => {
          var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          this.setState({ uploadProgress: progress }); 
          },
          error => {
              console.log(error);
              alert("Error with uploading file to firebase storage.");
          },
          () => {
            storageRef.getDownloadURL().then((url) => {
              if (type === 'image') {
                data["imageList"] = [url];
              }
              else if (type === 'audio') {
                data["audioList"] = [url];
              }
              // Adds the download link and data to firestore
              this.props.firebase.pois().add(data).then(docRef => {

                // Adds the file metadata to the files collection
                this.props.firebase.poif(docRef.id).add({
                  name: null,
                  description: null,
                  filepath: storageRef.fullPath,
                  filetype: type,
                  url: url
                });

                this.setState({ ...INITIAL_STATE });
                this.toggleModal();
              })
            },
            error => {
            console.log(error);
            alert("Error with getting file from firestore.");
          })
      });
    }}
    
    e.preventDefault();
  };

  render() {
    const { name, longitude, latitude, description, uploadProgress } = this.state;
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
                            <Label htmlFor="description" xs={12}>Description</Label>
                            <Col>
                                <Input
                                    type="textarea"
                                    name="description"
                                    id="description"
                                    value={description}
                                    onChange={this.onChange}
                                    rows="6"
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
                        <FormGroup>
                                <Col xs={6}>
                                    <Progress value={uploadProgress} />
                                </Col>
                        </FormGroup>
                        <FormGroup className="d-flex">
                            <div className="mr-auto p-2">
                                <Button onClick={this.toggleModal}>
                                    Cancel
                                </Button>
                            </div>
                            <div className="p-2">
                                <Button type="submit" color="primary" disabled={isInvalid}>
                                    Save
                                </Button>
                            </div>
                        </FormGroup>
                    </Form>
                </ModalBody>
            </Modal>  
        </Fragment>        
    );
  }
}

export default withFirebase(POIForm);
