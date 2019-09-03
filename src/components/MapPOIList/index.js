import React, { Component, Fragment } from "react";

import { ListGroup, ListGroupItem } from "reactstrap";

class MapPOIList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: ""
    };
  }

  render() {
    const { POIList } = this.props;
    const { selected } = this.state;

    return (
      <Fragment>
        <ListGroup>
          {POIList.map(poiitem => (
            <ListGroupItem>{poiitem.name}</ListGroupItem>
          ))}
        </ListGroup>
      </Fragment>
    );
  }
}

export default MapPOIList;
