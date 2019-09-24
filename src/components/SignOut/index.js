import React, { Component } from "react";
import { Button } from "reactstrap";
import { compose } from "recompose";

import { withFirebase } from '../Firebase';

class  SignOutButton extends Component {
    constructor(props){
        super(props);
    }

    handleSignOut = event => {    
        this.props.firebase.doSignOut()
    };

    render() {
        return (
            <Button outline onClick={this.handleSignOut}>
              <span className="fa fa-sign-out fa-lg"></span> Sign Out
            </Button>
        );       
    }
}

const SignOut = compose(
    withFirebase,
)(SignOutButton);

export default SignOut;

