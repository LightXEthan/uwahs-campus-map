import React, { Component, Fragment } from "react";
import { Modal, ModalBody, ModalHeader, Form, FormGroup, Col, Input, Label, Button } from "reactstrap";
import onClickOutside from 'react-onclickoutside'

class UploadFile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isModalOpen: true,
            filename: this.props.filename,
            description: "",
            parentCallback: this.props.parentCallBack
        };
    }

    toggleModal = () => {
        this.setState({
          isModalOpen: !this.state.isModalOpen
        });
        this.props.parentCallback(false);
    };

    onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    onSubmit = (event) => {
        this.props.parentCallback(false);
        this.toggleModal();
        event.preventDefault();
    };

    render() {

        const { isModalOpen, filename, description } = this.state;

        return (
            <Fragment>
                <Modal
                    isOpen={isModalOpen}
                    toggle={this.toggleModal}
                    className="modal-lg"
                >
                <ModalHeader toggle={this.toggleModal}>
                    Edit File
                </ModalHeader>
                <ModalBody>
                    <Form onSubmit={this.onSubmit}>
                    <FormGroup>
                        <Label htmlFor="filename" xs={12}>
                        File Name
                        </Label>
                        <Col>
                        <Input
                            id="filename"
                            name="filename"
                            value={filename}
                            onChange={this.onChange}
                            type="text"
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
                        <Button
                            type="button"
                            color="danger"
                            //onClick={this.toggleNestedModal}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            color="primary"
                            onClick={this.onSubmit}
                            style={{ position: "absolute", right: "16px" }}
                        >
                            Apply
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

export default onClickOutside(UploadFile);

