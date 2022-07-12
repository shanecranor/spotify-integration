import React, { useEffect } from "https://npm.tfl.dev/react";
import SpotifyComponent from "../../components/spotify-component/SpotifyComponent.jsx";
import { toDist } from "https://tfl.dev/@truffle/distribute@1.0.0/format/wc/index.js";

function Home() {
  return <>
    <style>{`:root {
	--tfl-color-bg-fill: rgba(0, 0, 0, 0) !important;
}

#root {
	--tfl-color-bg-fill: rgba(0, 0, 0, 0) !important;
}`}</style>
    <SpotifyComponent />
  </>;
}

export default toDist("react", Home, import.meta.url);
