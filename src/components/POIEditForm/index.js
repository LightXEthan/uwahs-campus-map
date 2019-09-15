import React, { Component, Fragment } from 'react';

import { Button, Modal, ModalHeader, ModalBody, Label, Col, Form, FormGroup, Input } from 'reactstrap';

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
            filetype: null,
            imageList: this.props.poi.imageList,
            audioList: this.props.poi.audioList,
            isModalOpen: false,
            isImageOpen: false,
            fileShowingid: null,
            fileShowing: null
        }
    }

    toggleModal = () => {
        this.setState({
            isModalOpen: !this.state.isModalOpen
        });
    };
    
    toggleFile(file) {
        // When an image is selected, the modal is open to delete file
        // The file is saved in the state, null is passed when canceling (toggle off delete modal)
        this.setState({
            isImageOpen: !this.state.isImageOpen,
            fileShowing: file
        });
    };

    onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
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

    deleteFile = () => {
        console.log("Trying to delete file: ", this.props.poi._id, this.state.fileShowing, this.state.imageList);
        var filepath = null; // Used to delete the file from firebase storage
        
        // Delete file from firestore
        this.props.firebase.poiUpdate(this.props.poi._id).update({
            imageList: firebase.firestore.FieldValue.arrayRemove(this.state.fileShowing)
        }).then(() => {
            // Update the new image list
            this.setState({ imageList: this.props.poi.imageList });
        });

        // Delete the files metadata in the files collection
        this.props.firebase.poif(this.props.poi._id).get().then(snapshot => {
            snapshot.forEach(doc => {
                // Finds the doc in files collection by comparing the urls
                let data = doc.data();
                if (data.url === this.state.fileShowing) {
                    filepath = data.fullPath;
                    this.props.firebase.poif(this.props.poi._id).doc(doc.id).delete();
                }
            });
        });

        // Delete file from firebase storage

        // Toggle delete confirmation modal off
        this.setState({ isImageOpen: !this.state.isImageOpen });
    }

    onSubmit = event => {
        const { name, longitude, latitude, fileupload, imageList, audioList, filetype } = this.state;
    
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
                                url: url
                            });

                            // Resets the file states
                            this.setState({
                                fileupload: null,
                                filetype: null
                            });
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
            console.log("Load", this.state.imageList);
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
                //TODO: add delete
                <div key={audio.split("token=")[1]}> 
                    <ReactAudioPlayer src={audio} controls/>
                    <Button close/>
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
                                <Col xs={12}>
                                    <Button type="submit" color="primary">
                                        Save
                                    </Button>
                                </Col>
                            </FormGroup>
                        </Form>

                        {this.loadImage()}
                        {this.loadAudio()}
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.state.isImageOpen} toggle={() => this.toggleFile(null)}>
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
