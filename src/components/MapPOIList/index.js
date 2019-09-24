import React, { Component, Fragment } from "react";

import { ListGroup, ListGroupItem, Button } from "reactstrap";

class MapPOIList extends Component {
  render() {
    const { POIList, onListItemClick } = this.props;

    return (
      <Fragment>
        <ListGroup
          style={{ overflow: "auto", height: `${window.innerHeight - 56}px` }}
        >
          {POIList.map(poiitem => (
            <ListGroupItem key={poiitem._id}>
              <Button
                key={poiitem._id}
                color="link"
                onClick={() => {
                  onListItemClick(poiitem);
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
