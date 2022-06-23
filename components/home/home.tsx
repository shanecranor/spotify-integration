import React from "react";
import PropTypes from "prop-types";

import AnotherComponent from "../another-component/another-component.tsx";
import SpotifyComponent from "../spotify-component/SpotifyComponent";
export default function DefaultSite({ exampleProp }) {
  return (
    <div>
      <p>{exampleProp}</p>
      <SpotifyComponent/>
    </div>
  );
}

DefaultSite.propTypes = {
  exampleProp: PropTypes.string,
};
