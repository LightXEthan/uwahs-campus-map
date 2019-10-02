import React, { Fragment, Component } from "react";
import { Container, Row, Col, Input, InputGroup, InputGroupAddon, InputGroupText } from "reactstrap";

import POIList from "../POIList";
import POIForm from "../POIForm";
import { AuthUserContext, withAuthorization } from '../Session';

class  Admin extends Component {
  constructor(props){
      super(props);

      this.state = {
        search: ''
      };
  }

  handleSignOut = event => {    
      this.props.firebase.doSignOut()
  };

  updateSearch = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    return (
      <AuthUserContext.Consumer>
        {authUser => (
          <Fragment>
            <Container>
              <Row>
                <Col sm="12">
                  <h1>Admin Page</h1>
                </Col>
              </Row>
              <Row>
                <Col sm="12" className="text-right">
                  <POIForm />
                </Col>
              </Row>
              <Row>
                <Col sm="6">
                  <InputGroup>
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>Filter</InputGroupText>
                    </InputGroupAddon>                
                    <Input 
                      type="text" 
                      name="search" 
                      id="search" 
                      placeholder="Point of interest"
                      value={this.state.search}
                      onChange={this.updateSearch}
                    />
                  </InputGroup>                  
                </Col>
              </Row>
              <Row>
                <Col sm="12">
                  <POIList searchTerm={this.state.search}/>
                </Col>
              </Row>
            </Container>
          </Fragment>
        )}
      </AuthUserContext.Consumer>
    );       
  }
}

const condition = authUser => !!authUser;

export default withAuthorization(condition)(Admin);
