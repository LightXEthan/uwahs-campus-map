import React, { Component, Fragment } from "react";
import { withRouter } from "react-router-dom";
import { compose } from "recompose";
import { Card, Container, Row, Button, Form, FormGroup, Label, Input, Col } from 'reactstrap';

import { PasswordForgetLink } from "../PasswordForget";
import { withFirebase } from "../Firebase";
import * as ROUTES from "../../constants/routes";

const SignIn = () => (
    <div>
        <Container>
            <Row>
                <Col sm="12" md={{ size: 6, offset: 3 }}>
                    <h3  className="text-center">Sign in to UWAHS Campus Map</h3>
                </Col>
            </Row>
            <br/>
            <Row>
                <SignInForm />
            </Row>
        </Container>
    </div>
);

const INITIAL_STATE = {
    email: '',
    password: '',
    error: null,
}

class SignInFormBase extends Component {
    constructor(props) {
        super(props);

        this.state = { ...INITIAL_STATE };
    }

    onSubmit = event => {
        const { email, password } = this.state;

        this.props.firebase
            .doSignInWithEmailAndPassword(email, password)
            .then(() => {
                this.setState({ ...INITIAL_STATE });
                this.props.history.push(ROUTES.ADMIN);
            })
            .catch(error => {
                this.setState({ error });
            });

            event.preventDefault();
    };

    onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    onForgot = event => {
        alert("Hello! I am an alert box!!");
    };

    render() {
        const {email, password, error } = this.state;
        const isInvalid = password === '' || email === '';

        return (
            <Fragment>
                <Col sm="12" md={{ size: 6, offset: 3 }}>
                    <Card body>
                        <Form onSubmit = {this.onSubmit}>
                            <FormGroup>
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    value={email}
                                    onChange={this.onChange}
                                    type="email"
                                    placeholder="Email Address"
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    value={password}
                                    onChange={this.onChange}
                                    type="password"
                                    placeholder="Password"
                                />
                            </FormGroup>
                            <PasswordForgetLink />
                            <Button color="primary" size="lg" block
                                disabled={isInvalid}
                                type="submit"
                                value="submit"
                                colour="primary">
                                Sign In
                            </Button>
                            {error && <p>{error.message}</p>}
                        </Form>
                    </Card>
                </Col>
            </Fragment>
        );
    }
}

const SignInForm = compose(
    withRouter,
    withFirebase,
)(SignInFormBase);

export default SignIn;

export { SignInForm };