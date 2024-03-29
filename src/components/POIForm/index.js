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
  showProgressBar: false, // display file upload progress bar
  uploadProgress: 0    // file upload progress
}
class POIForm extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  // Toggles the 'add new poi' modal
  toggleModal = () => {
    this.setState({
      isModalOpen: !this.state.isModalOpen
    });
  };

  // Updates state when form input changes
  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  // Updates state when form input changes for files
  onChangeFile = e => {
    if (e.target.files.length === 0) {
      // Removes the file from state when canceling upload
      this.setState({ fileupload: null });
    }
    else {
      // Adds the file to the state
      this.setState({ fileupload: e.target.files[0] });
    }
  };

  /** When save button is pressed the below function will run
   *  If no file
   *    1. Updated poi data will be updated to firestore
   *  If file is uploaded
   *    1. The file is uploaded to firebase storage
   *    2. A document is created in 'files' collection for the file
   *    3. A document is added to the 'poi' collection for the poi
   */
  onSubmit = e => {
    const { name, longitude, latitude, description, fileupload } = this.state;

    /* data to be written to firebase
     * name: name of the location
     * description: decription of the location
     * location: [lat, long]
     * last_modified: date last modified
     * date_created: date created
     * imageArray: [list of images ref]
     * audioArray: [list of audio ref]
     */
    var data = {
      name: name,
      description: description,
      location: new firebase.firestore.GeoPoint(parseFloat(latitude), parseFloat(longitude)),
      last_modified: firebase.firestore.FieldValue.serverTimestamp(),
      date_created: firebase.firestore.FieldValue.serverTimestamp(),
      imageArray: [],
      audioArray: []
    };

    if (fileupload === null) {
      // data is written to firebase
      this.props.firebase.pois().add(data)
        .then(() => {
          this.setState({ ...INITIAL_STATE });
        });
      this.toggleModal();

    } else {
      this.setState({ showProgressBar: true });

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
        var filename = fileupload.name.split('.').slice(0, -1).join('.'); // Name of the file
        var filelabel = type + "s/" + fileupload.name + "%%" + new Date(); // Name for storage
        var storageRef = this.props.firebase.storage.ref(filelabel);

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

              // Set metadata
              var metadata = {
                name: filename,
                description: null,
                filepath: storageRef.fullPath,
                filetype: type,
                url: url,
                date_added: firebase.firestore.FieldValue.serverTimestamp()
              }
              
              // Create a doc for the metadata in files collection
              this.props.firebase.files().add(metadata).then(fileRef => {

                // Add file data for poi doc
                var filedata = {
                  name: filename,
                  url: url,
                  metaID: fileRef.id
                }

                // Sets the data for file
                if (type === 'image') {
                  data["imageArray"] = [filedata];
                }
                else if (type === 'audio') {
                  data["audioArray"] = [filedata];
                }

                // Creates a new document with the data, adds the download link of file and data in firestore
                this.props.firebase.pois().add(data).then(() => {
                  // Reset the states and closes modal
                  this.setState({ ...INITIAL_STATE });
                  this.toggleModal();
                });
              });
            },
              error => {
                console.log(error);
                alert("Error with getting file from firestore.");
              })
          });
      }
    }
    e.preventDefault();
  };

  render() {
    const { name, longitude, latitude, description, uploadProgress, showProgressBar } = this.state;
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
                  {showProgressBar && <Progress value={uploadProgress} />}
                </Col>
              </FormGroup>
              <FormGroup>
                <Col>
                  <Button onClick={this.toggleModal}>
                    Cancel
                  </Button>
                  <Button type="submit" color="primary" disabled={isInvalid} style={{ position: "absolute", right: "16px" }}>
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
