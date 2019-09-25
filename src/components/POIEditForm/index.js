import React, { Component, Fragment } from 'react';

import { Button, Modal, ModalHeader, ModalBody, Label, Col, Form, FormGroup, Input, TabContent, TabPane, Nav, NavItem, NavLink, Card, CardTitle, CardImg, Row, Progress } from 'reactstrap';
import classnames from 'classnames';

import ReactAudioPlayer from 'react-audio-player';

import { withFirebase } from "../Firebase";
import firebase from 'firebase/app'

class POIEditForm extends Component {

    constructor(props){
        super(props);

        this.state = {
            name: this.props.poi.name,
            latitude: this.props.poi.location.latitude,
            longitude: this.props.poi.location.longitude,
            description: this.props.poi.description,
            fileupload: null,
            imageList: this.props.poi.imageList,
            audioList: this.props.poi.audioList,
            isModalOpen: false,
            isFileOpen: false,
            fileShowing: null,
            activeTab: '1',
            showProgressBar: false,
            uploadProgress: 0
        }
    }

    toggleTab = (tab) => {
        if (this.state.activeTab !== tab) {
          this.setState({
            activeTab: tab
          });
        }
    };

    toggleModal = () => {
        this.setState({
            isModalOpen: !this.state.isModalOpen
        });
    };
    
    toggleFile(file) {
        // When an image is selected, the modal is open to confirm deleting the file
        // The file selected is saved in the state, null is passed when canceling (toggle off delete modal)
        this.setState({
            isFileOpen: !this.state.isFileOpen,
            fileShowing: file
        });
    };

    onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    onChangeFile = e => {
        if (e.target.files.length === 0) {
            this.setState({ fileupload: null });
        }
        else {
            this.setState({ fileupload: e.target.files[0] });
        }
    };

    deleteFile = () => {
        var filepath = null; // Used to delete the file from firebase storage
        var filetype = null; // Used to delete the specific file type
        
        // Delete the files metadata in the files collection
        this.props.firebase.poif(this.props.poi._id).get().then(snapshot => {
            snapshot.forEach(doc => {
                // Finds the doc in files collection by comparing the urls
                let data = doc.data();
                if (data.url === this.state.fileShowing) {
                    filepath = data.filepath;
                    filetype = data.filetype;
                    this.props.firebase.poif(this.props.poi._id).doc(doc.id).delete();
                }
            });
        }).then(() => {
            // Delete file from firebase storage
            //this.props.firebase.storage.ref(filepath).delete();

            // Delete file from the url list in firestore
            if (filetype === 'image') {
                this.props.firebase.poiUpdate(this.props.poi._id).update({
                    imageList: firebase.firestore.FieldValue.arrayRemove(this.state.fileShowing)
                }).then(() => {
                    // Update the new image list
                    this.setState({ imageList: this.props.poi.imageList });
                });
            }
            else if (filetype === 'audio') {
                this.props.firebase.poiUpdate(this.props.poi._id).update({
                    audioList: firebase.firestore.FieldValue.arrayRemove(this.state.fileShowing)
                }).then(() => {
                    // Update the new audio list
                    this.setState({ audioList: this.props.poi.audioList });
                });
            }
        });
        
        // Toggle delete confirmation modal off
        this.setState({ isFileOpen: !this.state.isFileOpen });
    }

    onSubmit = event => {
        const { name, longitude, latitude, description, fileupload, imageList, audioList} = this.state;
    
        const data = {
          name: name,
          location: new firebase.firestore.GeoPoint(parseFloat(latitude), parseFloat(longitude)),
          description: description,
          last_modified: firebase.firestore.FieldValue.serverTimestamp()
        };

        if (fileupload === null) {
            // data is written to firebase
            this.props.firebase.poiUpdate(this.props.poi._id).set(data, { merge: true });
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
                            imageList.push(url);
                            data["imageList"] = imageList;
                        }
                        else if (type === 'audio') {
                            audioList.push(url);
                            data["audioList"] = audioList;
                        }
                        // Updates the poi with the new data
                        this.props.firebase.poiUpdate(this.props.poi._id).set(data, { merge: true });

                        // Adds the file metadata to the files collection
                        this.props.firebase.poif(this.props.poi._id).add({
                            name: null,
                            description: null,
                            filepath: storageRef.fullPath,
                            filetype: type,
                            url: url
                        });

                        // Resets the file states
                        this.setState({ fileupload: null, uploadProgress: 0, showProgressBar: false });
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
            // Loads each image from the imageList of the poi found in the firestore
            return this.state.imageList.map(image => 
                // key of the image is the url token generated by firebase storage
                <Col md="6" className="img-col" key={image.split("token=")[1]}>
                    <Card>
                        <CardImg className="card-img-top" src={image}  alt="Image name here" onClick={() => this.toggleFile(image)}/>
                        <CardTitle>Image name here</CardTitle>
                    </Card>
                </Col>
            );
        }
    }

    loadAudio() {
        // Only loads when the modal is open
        if (this.state.isModalOpen) {
            // Loads each audio from the audioList of the poi found in the firestore
            return this.state.audioList.map(audio => 
                // key of the audio is the url token generated by firebase storage
                <div key={audio.split("token=")[1]}> 
                    <ReactAudioPlayer src={audio} controls/>
                    <Button close onClick={() => this.toggleFile(audio)}/>
                </div>
            );
        }
    }

    render() {

        const {name, latitude, longitude, description, uploadProgress, showProgressBar} = this.state;
        
        return (
            <Fragment>
                {style}
                <Button outline color="none" onClick={this.toggleModal}>
                    <i className="fa fa-pencil"></i>
                </Button> 

                {/* toggle - so that when we click outside of the modal the form disappear */}
                <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal} className='modal-lg'>
                    {/* toggle - so that an 'x' appears in the header and we can dismiss the form */}
                    <ModalHeader toggle={this.toggleModal}>Edit place of interest</ModalHeader>
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
                                <Col>
                                    <Nav tabs>
                                        <NavItem>
                                            <NavLink
                                            className={classnames({ active: this.state.activeTab === '1' })}
                                            onClick={() => { this.toggleTab('1'); }}
                                            >
                                            Image
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink
                                            className={classnames({ active: this.state.activeTab === '2' })}
                                            onClick={() => { this.toggleTab('2'); }}
                                            >
                                            Audio
                                            </NavLink>
                                        </NavItem>
                                    </Nav>
                                    <TabContent activeTab={this.state.activeTab}>
                                        <TabPane tabId="1">
                                            <Row>
                                                {this.loadImage()}  
                                            </Row>
                                        </TabPane>
                                        <TabPane tabId="2">
                                            <Row>
                                            <Col sm="12">
                                                {this.loadAudio()} 
                                            </Col>
                                            </Row>
                                        </TabPane>
                                    </TabContent>
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
                                <Col xs={12}>
                                    <Button type="submit" color="primary">
                                        Save
                                    </Button>
                                </Col>
                            </FormGroup>
                        </Form>
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.state.isFileOpen} toggle={() => this.toggleFile(null)}>
                    <ModalHeader toggle={() => this.toggleFile(null)}>Are you sure you want to delete?</ModalHeader>
                    <ModalBody>
                        <Button outline color="danger" onClick={this.deleteFile}>Delete</Button>
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
