import React, { Component, Fragment } from "react";

import { ListGroup, ListGroupItem, Button } from "reactstrap";

class MapPOIList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: ""
    };
  }

  render() {
    const { POIList, onListItemClick } = this.props;
    const { selected } = this.state;

    return (
      <Fragment>
        <ListGroup
          style={{ overflow: "auto", height: `${window.innerHeight - 56}px` }}
        >
          {POIList.map(poiitem => (
            <ListGroupItem>
              <Button
                color="link"
                onClick={() => {
                  onListItemClick(poiitem.location);
                }}
              >
                {poiitem.name}
              </Button>
            </ListGroupItem>
          ))}
        </ListGroup>
      </Fragment>
    );
  }
}

export default MapPOIList;
