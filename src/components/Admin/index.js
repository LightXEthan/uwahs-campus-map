import React, { Fragment } from "react";
import { Container, Row, Col } from "reactstrap";

import POIList from "../POIList";
import POIForm from "../POIForm";
import { AuthUserContext, withAuthorization } from '../Session';

const Admin = () => (
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
            <Col sm="12">
              <POIList />
            </Col>
          </Row>
        </Container>
      </Fragment>
    )}
  </AuthUserContext.Consumer>
);

const condition = authUser => !!authUser;

export default withAuthorization(condition)(Admin);
