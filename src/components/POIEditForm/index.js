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
      isEditFileModalOpen: false,
      fileSelected: null,
      selectedFileName: "",
      selectedFileDescription: "",
      activeTab: "1",
      showProgressBar: false,
      uploadProgress: 0,
      isDeleteFileModalOpen: false,
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

  // When an image is selected, the edit file modal is open
  // The file selected is saved in the state, null is passed when canceling (toggle off delete modal)
  toggleFile = (file, fileName, fileDescription) => {
    this.setState({
      isEditFileModalOpen: !this.state.isEditFileModalOpen,
      fileSelected: file,
      selectedFileName: fileName,
      selectedFileDescription: fileDescription
    });
  };

  // Toggles the "Are you sure you want to delete POI" modal.
  toggleNestedModal = () => {
    this.setState({
      isAreYouSureOpen: !this.state.isAreYouSureOpen
    });
  };

   // Toggles the "Are you sure you want to delete file" modal.
   toggleNestedDeleteFileModal = () => {
    this.setState({
      isDeleteFileModalOpen: !this.state.isDeleteFileModalOpen
    });
  };

  // Updates state
  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  // Updates state when form input changes for files
  onChangeFile = e => {
    if (e.target.files.length === 0) {
      // Removes the file from state when canceling upload
      this.setState({ fileupload: null });
    } else {
      // Adds the file to the state
      this.setState({ fileupload: e.target.files[0] });
    }
  };

  // Updates state and file information in firestore
  onFileInfoChange = () => {
    const {selectedFileName, selectedFileDescription, fileSelected, audioArray, imageArray} = this.state;
    const data = {
      name: selectedFileName,
      description: selectedFileDescription,
      last_modified: firebase.firestore.FieldValue.serverTimestamp()
    };

    // Gets fileID
    var metaID = fileSelected.metaID;

    // Updates firestore file collection
    this.props.firebase.fileUpdate(metaID).set(data, { merge: true });

    // Updates imageArray, activeTab = 1 when image
    if (this.state.activeTab === '1') {
      let index = this.state.imageArray.indexOf(this.state.fileSelected);
      if (index > -1) {
        let newArray = imageArray;
        newArray[index].name = selectedFileName;
        newArray[index].description = selectedFileDescription;
        this.setState({ imageArray: newArray });

        const data = {
          imageArray: newArray,
          last_modified: firebase.firestore.FieldValue.serverTimestamp()
        };

        // Updates firestore POI collection
        this.props.firebase.poiUpdate(this.props.poi._id).set(data, { merge: true });
      }      
    }

    // Updates audioArray, activeTab = 2 when audio
    else if (this.state.activeTab === '2') {
      let index = this.state.audioArray.indexOf(this.state.fileSelected);
      if (index > -1) {
        let newArray = audioArray;
        newArray[index].name = selectedFileName;
        newArray[index].description = selectedFileDescription;
        this.setState({ audioArray: newArray });

        const data = {
          audioArray: newArray,
          last_modified: firebase.firestore.FieldValue.serverTimestamp()
        };

        // Updates firestore POI collection
        this.props.firebase.poiUpdate(this.props.poi._id).set(data, { merge: true });
      }
    }

    // Sets states and close edit file modal
    this.setState({ isEditFileModalOpen: !this.state.isEditFileModalOpen });
  }

  // Removes the metadata doc from the files collection in firestore
  deleteMetadata = metaID => {
    // Read the file metadata
    this.props.firebase.files().doc(metaID).get().then(docRef => {
      if (docRef) {
        let file = docRef.data();
  
        // Delete file from firebase storage
        this.props.firebase.storage.ref(file.filepath).delete();

        // Delete the document
        this.props.firebase.files().doc(metaID).delete();
      }
    });
  }

  // Deletes the image from imageArray and metafile
  deleteFile = () => {
    var metaID = this.state.fileSelected.metaID;

    // Delete the file from the file array, activeTab = 1 when image
    if (this.state.activeTab === '1') {
      // Removes the image on the modal
      let index = this.state.imageArray.indexOf(this.state.fileSelected);
      if (index > -1) {
        let newArray = this.state.imageArray;
        newArray.splice(index, 1);
        this.setState({ imageArray: newArray });
      }

      // Removes the entry from firestore
      this.props.firebase.poiUpdate(this.props.poi._id).update({
        imageArray: firebase.firestore.FieldValue.arrayRemove(this.state.fileSelected)
      });
      
    }
    else if (this.state.activeTab === '2') {
      // Removes the audio on the modal, activeTab = 2 when audio
      let index = this.state.audioArray.indexOf(this.state.fileSelected);
      if (index > -1) {
        let newArray = this.state.audioArray;
        newArray.splice(index, 1);
        this.setState({ audioArray: newArray });
      }

      // Removes the entry from firestore
      this.props.firebase.poiUpdate(this.props.poi._id).update({
        audioArray: firebase.firestore.FieldValue.arrayRemove(this.state.fileSelected)
      });
    }

    // Delete the file metadata
    this.deleteMetadata(metaID);

    // reset states and toggle delete confirmation model
    this.setState({ fileSelected: null, isEditFileModalOpen: !this.state.isEditFileModalOpen, isDeleteFileModalOpen: !this.state.isDeleteFileModalOpen });
  };

  // Iterates through all files and deletes time
  deleteAllFiles = () => {
    this.state.imageArray.forEach(image => {
      // Delete the file metadata
      this.deleteMetadata(image.metaID);
    });
    this.state.audioArray.forEach(audio => {
      // Delete the file metadata
      this.deleteMetadata(audio.metaID);
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
      let newFileData = this.state.imageArray;
      newFileData.push(filedata);
      this.setState({ imageArray: newFileData });
      
      // Adds a new image using a map to the image array to firestore
      this.props.firebase.poiUpdate(this.props.poi._id).update({
        imageArray: firebase.firestore.FieldValue.arrayUnion(filedata)
      });
    }
    else if (type === 'audio') {
      // Add to currently viewing edit form
      let newFileData = this.state.audioArray;
      newFileData.push(filedata);
      this.setState({ audioArray: newFileData });

      // Adds a new audio using a map to the image array to firestore
      this.props.firebase.poiUpdate(this.props.poi._id).update({
        audioArray: firebase.firestore.FieldValue.arrayUnion(filedata)
      });
    }
  }

  /** When save button is pressed the below function will run
   *  If no file
   *    1. Updated poi data will be updated to firestore
   *  If file is uploaded
   *    1. The file is uploaded to firebase storage
   *    2. A document is created in 'files' collection for the file
   *    3. A document is added to the 'poi' collection for the poi
   */
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
        var filename = fileupload.name.split('.').slice(0, -1).join('.'); // Name of the file
        var filelabel = type + "s/" + fileupload.name + "%%" + new Date(); // Name for storage
        var storageRef = this.props.firebase.storage.ref(filelabel);

        // uploads file
        var uploadTask = storageRef.put(fileupload);

        // monitors progress of file upload
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

              // Sets metadata
              var metadata = {
                name: filename,
                description: null,
                filepath: storageRef.fullPath,
                filetype: type,
                url: url,
                date_added: firebase.firestore.FieldValue.serverTimestamp()
              }

              // Adds the file metadata to the files collection
              this.props.firebase.files().add(metadata).then(fileRef => {

                // Adds file data for poi doc
                var filedata = {
                  name: filename,
                  url: url,
                  metaID: fileRef.id,
                  description: null
                }

                // Adds new file to the current viewing edit for and to firestore
                this.addFile(type, filedata);
              });

              // Resets the file states
              this.setState({ fileupload: null, uploadProgress: 0, showProgressBar: false });
              var file = document.getElementById("fileupload");
              file.value = file.defaultValue;
            },
              error => {
                console.log(error);
                alert("Error with getting file from firestore.");
              })
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
              alt={image.name}
              onClick={() => this.toggleFile(image, image.name, image.description)}
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
        <Col md="6" className="img-col" key={audio.url.split("token=")[1]}>
          <figure >
          <figcaption>{audio.name}</figcaption>
          <ReactAudioPlayer src={audio.url} controls />
          <Button outline 
            color="none" 
            onClick={() => this.toggleFile(audio, audio.name, audio.description)} 
            style={{ position: "absolute", top: "30px", right: "35px" }}>
            <i className="fa fa-pencil"></i>
          </Button> 
          </figure>
        </Col>
      ));
    }
  }

  render() {
    const { name, latitude, longitude, description, uploadProgress, showProgressBar, selectedFileName, selectedFileDescription } = this.state;
    
    return (
      <Fragment>
        {style}
        <Button outline color="none" onClick={this.toggleModal}>
          <i className="fa fa-pencil"></i>
        </Button>
        {/* Edit POI modal */}
        <Modal
          isOpen={this.state.isModalOpen}
          toggle={this.toggleModal}
          className="modal-lg"
        >
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
                      <Row>{this.loadAudio()}</Row>
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
                {/* Describes the positioning of the buttons at the bottom of the form*/}
                <Col>
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
                </Col>
              </FormGroup>
            </Form>

            {/* Delete POI modal */}
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

        {/* Edit file modal */}
        <Modal
          isOpen={this.state.isEditFileModalOpen}
          toggle={() => this.toggleFile(null)}
        >
          <ModalHeader toggle={() => this.toggleFile(null)}>
            Edit file
          </ModalHeader>
          <ModalBody>
            <Form onSubmit={this.onSubmit}>
            <FormGroup>
                <Label htmlFor="selectedFileName" xs={12}>
                File Name
                </Label>
                <Col>
                <Input
                    id="selectedFileName"
                    name="selectedFileName"
                    value={selectedFileName}
                    onChange={this.onChange}
                    type="text"
                />
                </Col>
            </FormGroup>
            <FormGroup>
                <Label htmlFor="selectedFileDescription" xs={12}>
                Description
                </Label>
                <Col>
                <Input
                    type="textarea"
                    name="selectedFileDescription"
                    id="selectedFileDescription"
                    value={selectedFileDescription}
                    onChange={this.onChange}
                    rows="6"
                />
                </Col>
            </FormGroup>
            <FormGroup>
                <Col>
                <Button type="button" outline color="danger" onClick={this.toggleNestedDeleteFileModal}>
                  Delete
                </Button>
                <Button
                    color="primary"
                    onClick={this.onFileInfoChange} 
                    style={{ position: "absolute", right: "16px" }}
                >
                    Apply
                </Button>
                </Col>
            </FormGroup>
            </Form>
          </ModalBody>

          {/* Delete file modal */}
          <Modal
              isOpen={this.state.isDeleteFileModalOpen}
              toggle={this.toggleNestedDeleteFileModal}
            >
              <ModalHeader toggle={this.toggleNestedDeleteFileModal}>
                Are you sure you want to delete?
              </ModalHeader>
              <ModalBody>
                  <Col>
                    <Button
                      type="button"
                      color="danger"
                      onClick={this.deleteFile}
                    >
                      Yes
                    </Button>
                    <Button
                      type="button"
                      color="success"
                      onClick={this.toggleNestedDeleteFileModal}
                      style={{ position: "absolute", right: "16px" }}
                    >
                      No
                    </Button>
                  </Col>
              </ModalBody>
            </Modal>
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



