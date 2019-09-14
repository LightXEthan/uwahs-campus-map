import React, { Fragment, Component } from "react";
import { Button, Modal, ModalHeader, ModalBody, Label, Col, Form, FormGroup, Input } from 'reactstrap';

import { withFirebase } from "../Firebase";

const INITIAL_STATE = {
    passwordOne: '',
    passwordTwo: '',
    error: null,
};

class PasswordChangeForm extends Component {
    constructor(props) {
        super(props);

        this.state = { ...INITIAL_STATE };
    }

    toggleModal = () => {
        this.setState({
            isModalOpen: !this.state.isModalOpen
        });
    };

    onSubmit = event => {
        const { passwordOne } = this.state;

        this.props.firebase
        .doPasswordUpdate(passwordOne)
        .then(() => {
            this.setState({ ...INITIAL_STATE });
        })
        .catch(error => {
            this.setState({ error });
        });

        this.toggleModal();
        event.preventDefault();  
    };

    onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    render() {
        const { passwordOne, passwordTwo, error } = this.state;
        const isInvalid = passwordOne === '' || passwordOne !== passwordTwo;

        return (
            <Fragment>
                <Button onClick={this.toggleModal}>
                    Password Reset
                </Button>
                <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                    <ModalHeader toggle={this.toggleModal}>Change Password</ModalHeader>
                    <ModalBody>
                        <Form onSubmit={this.onSubmit}>
                            <FormGroup>
                                <Label htmlFor="passwordOne" xs={12}>New Password</Label>
                                <Col>
                                    <Input
                                        id="passwordOne"
                                        name="passwordOne"
                                        value={passwordOne}
                                        onChange={this.onChange}
                                        type="password"
                                        placeholder="New Password"
                                    />
                                </Col>
                            </FormGroup>
                            <FormGroup>
                                <Label htmlFor="passwordTwo" xs={12}>Confirm New Password</Label>
                                <Col>
                                    <Input
                                        id="passwordTwo"
                                        name="passwordTwo"
                                        value={passwordTwo}
                                        onChange={this.onChange}
                                        type="password"
                                        placeholder="Confirm New Password"
                                    />
                                </Col>
                            </FormGroup>
                            <FormGroup>
                                <Col>
                                    <Button type="submit" color="primary" disabled={isInvalid}>
                                        Reset My Password
                                    </Button>
                                </Col>
                            </FormGroup>
                            <FormGroup>
                                <Col>
                                    {error && <p>{error.message}</p>}
                                </Col>
                            </FormGroup>
                        </Form>
                    </ModalBody>
                </Modal>  
            </Fragment>        
        );
    }
}

export default withFirebase(PasswordChangeForm);