import React, { Component, Fragment } from "react";

import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Label,
  Col,
  Form,
  FormGroup,
  Input,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Card,
  CardTitle,
  CardImg,
  Row,
  Progress
} from "reactstrap";
import classnames from "classnames";

import ReactAudioPlayer from "react-audio-player";

import { withFirebase } from "../Firebase";
import firebase from "firebase/app";

class POIEditForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: this.props.poi.name,
      latitude: this.props.poi.location.latitude,
      longitude: this.props.poi.location.longitude,
      description: this.props.poi.description,
      fileupload: null,
      imageArray: this.props.poi.imageArray,
      audioArray: this.props.poi.audioArray,
      isModalOpen: false,
      isFileOpen: false,
      fileSelected: null,
      activeTab: "1",
      showProgressBar: false,
      uploadProgress: 0
    };
  }

  // Toggles which files are being viewed (images, audio)
  toggleTab = tab => {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  };

  // Toggles the state variable of the EditForm Modal to its opposite
  toggleModal = () => {
    this.setState({
      isModalOpen: !this.state.isModalOpen
    });
  };

  // When an image is selected, the modal is open to confirm deleting the file
  // The file selected is saved in the state, null is passed when canceling (toggle off delete modal)
  toggleFile = file => {
    this.setState({
      isFileOpen: !this.state.isFileOpen,
      fileSelected: file
    });
  };

  // Toggles the "Are you sure you want to delete" modal.
  toggleNestedModal = () => {
    this.setState({
      isAreYouSureOpen: !this.state.isAreYouSureOpen
    });
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  onChangeFile = e => {
    if (e.target.files.length === 0) {
      this.setState({ fileupload: null });
    } else {
      this.setState({ fileupload: e.target.files[0] });
    }
  };

  getFileName = () => {
    if (this.state.isFileOpen) {

    }
  };

  // Updates the metadata file and remove it if there are no references
  updateMetadata = metaID => {
    // Read the file metadata
    this.props.firebase.files().doc(metaID).get().then(docRef => {
      if (docRef) {
        let file = docRef.data();
        let nref = file.nref;
  
        if (nref <= 1) {
          // Delete file from firebase storage
          this.props.firebase.storage.ref(file.filepath).delete();
  
          // Delete the document
          this.props.firebase.files().doc(metaID).delete();
          
        } else {
          this.props.firebase.files().doc(metaID).update({
            nref: firebase.firestore.FieldValue.increment(-1)
          });
        }
      }
    });
  }

  // Delete the image from imageArray and metafile
  deleteFile = () => {
    var metaID = this.state.fileSelected.metaID;

    // Delete the file from the file array, activeTab = 1 when image
    if (this.state.activeTab === '1') {
      // Removes the image on the modal
      let index = this.state.imageArray.indexOf(this.state.fileSelected);
      if (index > -1) {
        this.state.imageArray.splice(index, 1);
      }

      // Removes the entry from firestore
      this.props.firebase.poiUpdate(this.props.poi._id).update({
        imageArray: firebase.firestore.FieldValue.arrayRemove(this.state.fileSelected)
      });
      
    }
    else if (this.state.activeTab === '2') {
      // Removes the audio on the modal, activeTab = 1 when audio
      let index = this.state.audioArray.indexOf(this.state.fileSelected);
      if (index > -1) {
        this.state.audioArray.splice(index, 1);
      }

      // Removes the entry from firestore
      this.props.firebase.poiUpdate(this.props.poi._id).update({
        audioList: firebase.firestore.FieldValue.arrayRemove(this.state.fileSelected)
      });
    }

    // Read the file metadata
    this.updateMetadata(metaID);

    // reset states and toggle delete confirmation model
    this.setState({ fileSelected: null, isFileOpen: !this.state.isFileOpen });
  };

  // Iterates through all files and deletes time
  deleteAllFiles = () => {
    this.state.imageArray.forEach(image => {
      // Read the file metadata
      this.updateMetadata(image.metaID);
    });
    this.state.audioArray.forEach(audio => {
      // Read the file metadata
      this.updateMetadata(audio.metaID);
    });
  }

  // Calls the database delete function for the specified poi and then hides the modals.
  onPOIDelete = () => {
    // Delete all the files associated with this poi
    this.deleteAllFiles();
    
    // Delete poi
    this.props.firebase.poiDelete(this.props.poi._id);
    this.toggleNestedModal();
    this.toggleModal();
  };

  // Add new file to the current viewing edit for and to firestore
  addFile = (type, filedata) => {
    if (type === 'image') {
      // Add to currently viewing edit form
      this.state.imageArray.push(filedata);
      // Adds a new image using a map to the image array to firestore
      this.props.firebase.poiUpdate(this.props.poi._id).update({
        imageArray: firebase.firestore.FieldValue.arrayUnion(filedata)
      });
    }
    else if (type === 'audio') {
      // Add to currently viewing edit form
      this.state.audioArray.push(filedata);
      // Adds a new audio using a map to the image array to firestore
      this.props.firebase.poiUpdate(this.props.poi._id).update({
        audioArray: firebase.firestore.FieldValue.arrayUnion(filedata)
      });
    }
  }

  onSubmit = event => {
    const {
      name,
      longitude,
      latitude,
      description,
      fileupload
    } = this.state;

    const data = {
      name: name,
      location: new firebase.firestore.GeoPoint(
        parseFloat(latitude),
        parseFloat(longitude)
      ),
      description: description,
      last_modified: firebase.firestore.FieldValue.serverTimestamp()
    };

    if (fileupload === null) {
      // data is written to firebase
      this.props.firebase.poiUpdate(this.props.poi._id).set(data, { merge: true });
      this.toggleModal();
    } else {

      // starts the progress bar
      this.setState({ showProgressBar: true });

      // detects the type of file to organise into file in firebase storage
      var type = null;
      if (fileupload.type.includes("image")) {
        type = "image";
      } else if (fileupload.type.includes("audio")) {
        type = "audio";
      } else {
        console.error(
          "File uploaded is an incompatible file type: " + fileupload.type
        );
        alert("Error: incompatible file type.");
      }

      if (type !== null) {
        // gets the storage reference for the file to be added
        var filename = type + "s/" + fileupload.name;
        var storageRef = this.props.firebase.storage.ref(filename);

        // checks if the file already exists
        var fileRef = this.props.firebase.files();
        fileRef.where("filepath", "==", filename)
          .get()
          .then(queryDoc => {
            // If the query is empty, that means a document for the file does not exist
            if (queryDoc.empty) {

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
                      name: null,
                      description: null,
                      filepath: storageRef.fullPath,
                      filetype: type,
                      nref: 1,
                      url: url,
                      date_added: firebase.firestore.FieldValue.serverTimestamp()
                    }

                    // Adds the file metadata to the files collection
                    this.props.firebase.files().add(metadata).then(fileRef => {

                      // Add file data for poi doc
                      var filedata = {
                        name: null,
                        url: url,
                        metaID: fileRef.id
                      }

                      // Add new file to the current viewing edit for and to firestore
                      this.addFile(type, filedata);
                    });

                    // Resets the file states
                    this.setState({ fileupload: null, uploadProgress: 0, showProgressBar: false });
                  },
                    error => {
                      console.log(error);
                      alert("Error with getting file from firestore.");
                    })
                });


            } else {
              alert(`That document already exists in firebase storage. Please ensure that the file you have uploaded matches the one see. If not, please rename the file before uploading.`);
              console.log("Document already exists: ", queryDoc);

              var metaID, url;

              // gets the metaid and url from the document, there should only be one
              queryDoc.forEach(doc => {
                metaID = doc.id;
                url = doc.data().url;
              });
              
              let filedata = {
                name: null,
                url: url,
                metaID: metaID
              };

              // Add new file to the current viewing edit for and to firestore
              this.addFile(type, filedata);

              // Increase metadata number of references count by one
              this.props.firebase.files().doc(metaID).update({
                nref: firebase.firestore.FieldValue.increment(1)
              });

              this.setState({ showProgressBar: false });
            }
          });
      }
    }
    event.preventDefault();
  };

  loadImage() {
    // Only loads when the modal is open
    if (this.state.isModalOpen) {
      // Loads each image from the imageArray of the poi found in the firestore
      return this.state.imageArray.map(image => (
        // key of the image is the url token generated by firebase storage
        <Col md="6" className="img-col" key={image.url.split("token=")[1]}>
          <Card>
            <CardImg
              className="card-img-top"
              src={image.url}
              alt="Image name here"
              onClick={() => this.toggleFile(image)}
            />
            <CardTitle>{image.name}</CardTitle>
          </Card>
        </Col>
      ));
    }
  }

  loadAudio() {
    // Only loads when the modal is open
    if (this.state.isModalOpen) {
      // Loads each audio from the audioArray of the poi found in the firestore
      return this.state.audioArray.map(audio => (
        // key of the audio is the url token generated by firebase storage
        <div key={audio.url.split("token=")[1]}>
          <ReactAudioPlayer src={audio.url} controls />
          {/*<Button close onClick={() => this.toggleFile(audio)} />*/}
        </div>
      ));
    }
  }

  render() {
    const { name, latitude, longitude, description, uploadProgress, showProgressBar } = this.state;

    return (
      <Fragment>
        {style}
        <Button outline color="none" onClick={this.toggleModal}>
          <i className="fa fa-pencil"></i>
        </Button>

        {/* toggle - so that when we click outside of the modal the form disappear */}
        <Modal
          isOpen={this.state.isModalOpen}
          toggle={this.toggleModal}
          className="modal-lg"
        >
          {/* toggle - so that an 'x' appears in the header and we can dismiss the form */}
          <ModalHeader toggle={this.toggleModal}>
            Edit place of interest
          </ModalHeader>
          <ModalBody>
            <Form onSubmit={this.onSubmit}>
              <FormGroup>
                <Label htmlFor="name" xs={12}>
                  Name
                </Label>
                <Col>
                  <Input
                    id="name"
                    name="name"
                    value={name}
                    onChange={this.onChange}
                    type="text"
                  />
                </Col>
              </FormGroup>
              <FormGroup>
                <Label htmlFor="latitude" xs={12}>
                  Latitude
                </Label>
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
                <Label htmlFor="longitude" xs={12}>
                  Longitude
                </Label>
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
                <Label htmlFor="description" xs={12}>
                  Description
                </Label>
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
                {/* Describes the positioning of the buttons at the bottom of the form*/}
                <Row noGutters>
                  <Button
                    type="button"
                    color="danger"
                    onClick={this.toggleNestedModal}
                  >
                    Delete
                  </Button>
                  <Button
                    type="submit"
                    color="primary"
                    onClick={this.onSubmit}
                    style={{ position: "absolute", right: "16px" }}
                  >
                    Save
                  </Button>
                </Row>
              </FormGroup>
              <FormGroup>
                <Col>
                  <Nav tabs>
                    <NavItem>
                      <NavLink
                        className={classnames({
                          active: this.state.activeTab === "1"
                        })}
                        onClick={() => {
                          this.toggleTab("1");
                        }}
                      >
                        Image
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={classnames({
                          active: this.state.activeTab === "2"
                        })}
                        onClick={() => {
                          this.toggleTab("2");
                        }}
                      >
                        Audio
                      </NavLink>
                    </NavItem>
                  </Nav>
                  <TabContent activeTab={this.state.activeTab}>
                    <TabPane tabId="1">
                      <Row>{this.loadImage()}</Row>
                    </TabPane>
                    <TabPane tabId="2">
                      <Row>
                        <Col sm="12">{this.loadAudio()}</Col>
                      </Row>
                    </TabPane>
                  </TabContent>
                </Col>
              </FormGroup>
              <FormGroup>
                <Label htmlFor="fileupload" xs={12}>
                  Upload a file. (Image/Audio)
                </Label>
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
                <Col xs={12}>
                  <Button type="submit" color="primary">
                    Save
                  </Button>
                </Col>
              </FormGroup>
            </Form>
            <Modal
              isOpen={this.state.isAreYouSureOpen}
              toggle={this.toggleNestedModal}
            >
              <ModalHeader>
                Are you sure you want to delete {this.state.name}?
              </ModalHeader>
              <ModalBody>
                <Row noGutters>
                  <Col xs={2}>
                    <Button
                      type="button"
                      color="danger"
                      onClick={this.onPOIDelete}
                    >
                      Yes, Delete
                    </Button>
                  </Col>
                  <Col xs={7}></Col>
                  <Col xs={3}>
                    <Button
                      type="button"
                      color="success"
                      onClick={this.toggleNestedModal}
                    >
                      No, Back Out
                    </Button>
                  </Col>
                </Row>
              </ModalBody>
            </Modal>
          </ModalBody>
        </Modal>
        <Modal
          isOpen={this.state.isFileOpen}
          toggle={() => this.toggleFile(null)}
        >
          <ModalHeader toggle={() => this.toggleFile(null)}>
            Are you sure you want to delete?
          </ModalHeader>
          <ModalBody>
            <Button outline color="danger" onClick={this.deleteFile}>
              Delete
            </Button>
          </ModalBody>
        </Modal>
      </Fragment>
    );
  }
}

const style = (
  <style>
    {`
          .img-col {
              padding: 0 0.5rem;
          }
          .nav-tabs .nav-link {
              cursor: pointer;
          }
          .card {
              height: 300px;
              margin-top: 0.5rem;
              margin-bottom: 0.5rem;
          }
          .card-title {
              margin-bottom: 0;
              height: 50px
          }
          .card-img-top {
              max-width: 100%;
              max-height: 250px;
              margin: auto auto;
              width: auto;
          }
      `}
  </style>
);

export default withFirebase(POIEditForm);
