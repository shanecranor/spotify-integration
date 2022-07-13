# Truffle Spotify App

The idea behind this project was to create an interface for viewers using the truffle.tv browser extension to quickly and easily view information about the song that a streamer is listening to on stream. To acomplish this, I built a widget in React which pulls data from a Cloudflare worker. The worker caches Spotify API requests and deals with OAuth tokens.

To try it out, feel free to git clone this project and (after creating the truffle.secret.mjs) run truffle-cli dev to launch the dev server and open Firefox or Chrome to go to localhost:8000/extension-mapping

To deploy on sporocarp, run truffle-cli deploy and go to the url spit out in the cli with /extension-mapping appended to the end
You can also test this inside the truffle.tv browser extension by clicking settings and then clicking the bottom right corner of the window, and then adding the url with /extension-mapping as an extension mapping and refreshing the page!
