import React, { Fragment } from "react";
import { Container, Row, Col } from "reactstrap";

import POIList from "../POIList";
import POIForm from "../POIForm";

const Admin = () => (
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
);

export default Admin;
