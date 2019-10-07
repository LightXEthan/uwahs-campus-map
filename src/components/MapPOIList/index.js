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
        {style}
        <form>
          <div className="searchContainer">
            <div className="searchbar">
              <input
                placeholder="Search for a location..."
                onChange={this.handleInputChange}
              />
              <i className="fa fa-search fa-lg icon" />
            </div>
          </div>
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

const style = (
  <style>
    {`
    .searchContainer {
      padding: 0.5em 1em;
    }

    .searchbar {
      width: 100%;
      position: relative;
      // font-weight: 400;
      // font-style: normal;
      display: inline-flex;
      align-items: center;
    }
    
    input {
      max-width: 100%;
      flex: 1 0 auto;
      outline: 0;
      line-height: 1.21em;
      border: 1px solid rgba(34,36,38,.15);
      border-radius: 500rem;
      padding: 0.67em 2.67em 0.67em 1em;
    }

    input:focus {
      border-color: #85b7d9;
    }

    .icon {
      position: absolute;
      // line-height: 1;
      text-align: center;
      // top: 0;
      right: 0;
      margin: 0;
      height: 100%;
      width: 2.67em;
      opacity: .5;
      font-size: 25px;
      height: 25px;
    }
  `}
  </style>
);

export default MapPOIList;
