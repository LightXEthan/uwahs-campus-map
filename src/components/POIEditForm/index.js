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
            imageList: this.props.poi.imageList,
            audioList: this.props.poi.audioList,
            isModalOpen: false
        }
    }

    toggleModal = () => {
        this.setState({
            isModalOpen: !this.state.isModalOpen
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

    onSubmit = event => {
        const { name, longitude, latitude, fileupload, imageList, audioList, filetype } = this.state;
    
        const data = {
          name: name,
          location: new firebase.firestore.GeoPoint(parseFloat(latitude), parseFloat(longitude)),
          timestamp: firebase.firestore.Timestamp.now()
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
                            this.props.firebase.poiUpdate(this.props.poi._id).set(data, { merge: true });
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
        let images = [];
        let len = this.state.imageList.length;

        for (let i = 0; i < len; i++) {
            let image = this.state.imageList[i];
            let namelen = image.length;
            let key = image.substring(namelen - 36, namelen);

            images.push(
                <Img 
                    src={this.state.imageList[i]}
                    key={key}
                />
            )
        }
        return images;
    }

    loadAudio() {
        let audios = [];
        let len = this.state.audioList.length;

        for (let i = 0; i < len; i++) {
            let audio = this.state.audioList[i];
            let namelen = audio.length;
            let key = audio.substring(namelen - 36, namelen);

            audios.push(
                <ReactAudioPlayer 
                    src={audio}
                    controls
                    key={key}
                />
            )
        }
        return audios;
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
                                <Col xs={{size: 12}}>
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
            </Fragment>        
        );
    }   
}

export default withFirebase(POIEditForm);
