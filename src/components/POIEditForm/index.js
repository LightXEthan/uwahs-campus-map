import React, { Component, Fragment } from 'react';
import { Button, Modal, ModalHeader, ModalBody, Label, Col, Form, FormGroup, Input } from 'reactstrap';

import { withFirebase } from "../Firebase";
import firebase from 'firebase/app'

class POIEditForm extends Component {

    constructor(props){
        super(props);

        this.state = {
            name: this.props.poi.name,
            latitude: this.props.poi.location.latitude,
            longitude: this.props.poi.location.longitude,
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

    onSubmit = event => {
        const { name, longitude, latitude } = this.state;
    
        const data = {
          name: name,
          location: new firebase.firestore.GeoPoint(parseFloat(latitude), parseFloat(longitude)),
          timestamp: firebase.firestore.Timestamp.now()
        };
    
        //this.props.firebase.poi(name).set(data, { merge: true });
        this.props.firebase.poiUpdate(this.props.poi._id).set(data, { merge: true });
        this.toggleModal();
    
        event.preventDefault();
    };

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
                                <Col xs={{size: 12}}>
                                    <Button type="submit" color="primary">
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

export default withFirebase(POIEditForm);
