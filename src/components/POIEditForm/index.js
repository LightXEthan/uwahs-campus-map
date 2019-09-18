import React, { Component, Fragment } from 'react';

import { Button, Modal, ModalHeader, ModalBody, Label, Col, Row, Form, FormGroup, Input } from 'reactstrap';

import Img from 'react-image';
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
            fileupload: null,
            imageList: this.props.poi.imageList,
            audioList: this.props.poi.audioList,
            isModalOpen: false,
            isAreYouSureOpen: false,
            isFileOpen: false,
            fileShowing: null
        }
    }

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

    toggleNestedModal = () => {
        this.setState({
            isAreYouSureOpen: !this.state.isAreYouSureOpen
        });
    }

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

    onDelete = () => {
        this.toggleNestedModal();
    }

    onNestedDelete = () => {
        this.props.firebase.poiDelete(this.props.poi._id);
        this.toggleNestedModal();
        this.toggleModal();
    }

    onSubmit = event => {
        const { name, longitude, latitude, fileupload, imageList, audioList } = this.state;
    
        const data = {
          name: name,
          location: new firebase.firestore.GeoPoint(parseFloat(latitude), parseFloat(longitude)),
          last_modified: firebase.firestore.FieldValue.serverTimestamp()
        };

        if (fileupload === null) {
            // data is written to firebase
            this.props.firebase.poiUpdate(this.props.poi._id).set(data, { merge: true });
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
                var storageRef = this.props.firebase.storage.ref(type + 's/' + fileupload.name);
        
                // uploads file to firebase
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
                            this.setState({ fileupload: null });
                            this.toggleModal();
                        },
                        error => {
                        console.log(error);
                        alert("Error with getting file from firestore.");
                    });
                }, error => {
                    console.log(error);
                    alert("Error with uploading file to firebase storage.");
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
                // key of the audio is the url token generated by firebase storage
                <Img src={image} key={image.split("token=")[1]} height="auto" width="100%" 
                    onClick={() => this.toggleFile(image)}
                />
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

        const {name, latitude, longitude} = this.state;
        
        return (
            <Fragment>
                <Button outline color="none" onClick={this.toggleModal}>
                    <i className="fa fa-pencil"></i>
                </Button> 

                {/* toggle - so that when we click outside of the modal the form disappear */}
                <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                    {/* toggle - so that an 'x' appears in the header and we can dismiss the form */}
                    <ModalHeader toggle={this.toggleModal}>Edit place of interest</ModalHeader>
                    <ModalBody>
                        <Form>
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
                                <Row noGutters="true">
                                    <Col xs={1}>
                                        <Button type="button" color="danger" onClick={this.onDelete}>
                                            Delete
                                        </Button>
                                    </Col>
                                    <Col xs={9}></Col>
                                    <Col xs={2}>
                                        <Button type="button" color="primary" onClick={this.onSubmit}>
                                            Save
                                        </Button>
                                    </Col>
                                </Row>   
                            </FormGroup>
                        </Form>
                        {this.loadImage()}
                        {this.loadAudio()}
                        <Modal isOpen={this.state.isAreYouSureOpen} toggle={this.toggleNestedModal}>
                            <ModalHeader>Are you sure you want to delete {this.state.name}?</ModalHeader>
                            <ModalBody>
                                <Row noGutters="true">
                                    <Col xs={2}>
                                        <Button type="button" color="danger" onClick={this.onNestedDelete}>
                                            Yes, Delete
                                        </Button>
                                    </Col>
                                    <Col xs={7}></Col>
                                    <Col xs={3}>
                                        <Button type="button" color="success" onClick={this.toggleNestedModal}>
                                            No, Back Out
                                        </Button>
                                    </Col>
                                </Row>
                            </ModalBody>
                        </Modal>
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

export default withFirebase(POIEditForm);
