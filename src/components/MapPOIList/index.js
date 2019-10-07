import React, { Component } from "react";

import { ListGroup, ListGroupItem, Button } from "reactstrap";

import Fuse from "fuse.js";

const options = {
  shouldSort: true,
  threshold: 0.6,
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength: 1,
  keys: [{ name: "name", weight: 1.0 }, { name: "description", weight: 0.3 }]
};

class MapPOIList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchRes: []
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.POIList !== this.state.searchRes) {
      this.setState({
        searchRes: [...nextProps.POIList]
      });
    }
    this.fuse = new Fuse(this.props.POIList, options);
  }

  handleInputChange = e => {
    let stuff =
      e.target.value !== ""
        ? this.fuse.search(e.target.value)
        : this.props.POIList;
    this.setState({
      searchRes: [...stuff]
    });
  };

  render() {
    const { POIList, onListItemClick } = this.props;

    return (
      <>
        <form>
          <input
            placeholder="Search for a location..."
            onChange={this.handleInputChange}
          ></input>
        </form>

        <ListGroup
          style={{ overflow: "auto", height: `${window.innerHeight - 56}px` }}
        >
          {this.state.searchRes.map(poiitem => (
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
      </>
    );
  }
}

export default MapPOIList;
