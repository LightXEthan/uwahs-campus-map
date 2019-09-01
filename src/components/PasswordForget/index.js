import React, { Component, Fragment } from "react";
import { withRouter } from "react-router-dom";
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
    successful: false,
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
            this.setState({successful:!this.state.successful});
        })
        .catch(error => {
            this.setState({ error });
        });

        event.preventDefault();
    };

    onChange = event => {
        this.setState({ [event.target.name]: event.target.value});
    };

    /*updateSuccessful = event => {
        this.setState({successful:!this.state.successful});
        this.props.history.push(ROUTES.SIGN_IN);
    };*/

    redirectToSignIn = event => {
        this.context.history.push(ROUTES.SIGN_IN);
    }

    render() {
        const { email, error} = this.state;
        const isInvalid = email === '';

        if(!this.state.successful)
        {
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
        else
        {
            return (
                <Fragment>
                    <Col sm="12" md={{ size: 4, offset: 4 }}>
                        <Card body>
                            <CardTitle>Check your email for a link to reset your password. If it doesn't appear within a few minutes, check your spam folder.</CardTitle>
                            <Button color="primary" size="lg" block
                                type="submit"
                                onClick={this.redirectToSignIn}>
                                Return to sign in
                            </Button>
                            {error && <p>{error.message}</p>}
                        </Card>
                    </Col>
                </Fragment>
             );
        }
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