import React, { Component, Fragment } from "react";
import { Card, CardTitle, Container, Row, Button, Form, FormGroup, Label, Input, Col } from 'reactstrap';
import { Link } from "react-router-dom";

import { withFirebase } from "../Firebase";
import * as ROUTES from "../../constants/routes";

const PasswordForget = () => (
    <div>
        <Container>
            <Row>
                <Col sm="12" md={{ size: 6, offset: 3 }}>
                    <h3  className="text-center">Reset your password</h3>
                </Col>
            </Row>
            <br/>
            <Row>
                <PasswordForgetForm />
            </Row>
        </Container>
    </div>
);

const INITIAL_STATE = {
    email: '',
    error: null,
};

class PasswordForgetFormBase extends Component {
    constructor(props) {
        super(props);
        this.state = { ...INITIAL_STATE };
    }

    onSubmit = event => {
        const { email } = this.state;
        this.props.firebase
        .doPasswordReset(email)
        .then(() => {
            this.setState({ ...INITIAL_STATE });
        })
        .catch(error => {
            this.setState({ error });
        });

        event.preventDefault();
    };

    onChange = event => {
        this.setState({ [event.target.name]: event.target.value});
    };

    render() {
        const { email, error } = this.state;
        const isInvalid = email === '';

        return (
            <Fragment>
                <Col sm="12" md={{ size: 4, offset: 4 }}>
                    <Card body>
                        <CardTitle>Enter your email address and we will send you a link to reset your password.</CardTitle>
                        <Form onSubmit={this.onSubmit}>
                            <FormGroup>
                                <Input
                                    id="email"
                                    name="email"
                                    value={email}
                                    onChange={this.onChange}
                                    type="email"
                                    placeholder="Email Address"
                                />
                            </FormGroup>
                            
                            <Button color="primary" size="lg" block
                                disabled={isInvalid} 
                                type="submit">
                                Send password reset email
                            </Button>
                            {error && <p>{error.message}</p>}
                        </Form>
                    </Card>
                </Col>
            </Fragment>
        );
    }
}

const PasswordForgetLink = () => (
    <p>
        <Link to={ROUTES.PASSWORD_FORGET}>Forgot Password?</Link>
    </p>
);

export default PasswordForget;

const PasswordForgetForm = withFirebase(PasswordForgetFormBase);
export { PasswordForgetForm, PasswordForgetLink };