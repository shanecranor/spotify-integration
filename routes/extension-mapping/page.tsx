import React, { useEffect } from "https://npm.tfl.dev/react";
import jumper from "https://tfl.dev/@truffle/utils@0.0.1/jumper/jumper.js";
import SpotifyComponent from "../../components/spotify-component/SpotifyComponent.js";

export default function Home() {
  useEffect(() => {
    const style = {
      width: "500px",
      height: "150px",
      background: "none",
      position: "fixed",
      bottom: 0,
      "z-index": "999",
      overflow: "hidden"
    };
    jumper.call("layout.applyLayoutConfigSteps", {
      layoutConfigSteps: [
        { action: "useSubject" }, // start with our iframe
        { action: "setStyle", value: style },
      ],
    });
  }, []);
  return <SpotifyComponent/>; 
}
