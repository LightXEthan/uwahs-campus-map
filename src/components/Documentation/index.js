import React, {Component, Fragment} from "react";
import ReactMarkdown from 'react-markdown';

const text = `

## Documentation
\n
The documentation of this project can be found in our [GitHub wiki: here!](https://github.com/LightXEthan/uwahs-campus-map/wiki)
`;

class Documentation extends Component {
  render() {
    return (
      <Fragment>
        <ReactMarkdown source={text} />
      </Fragment>
    )
  }
}

export default Documentation;