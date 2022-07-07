// import './styles/App.scss'
// import './styles/AppSlim.scss'
// import './styles/Slider.scss'
// import ExpandAlt from './images/expand-alt.svg'
// import Shrink from './images/down-left-and-up-right-to-center-solid.svg'
import React from 'https://npm.tfl.dev/react'
import ScopedStylesheet from "https://tfl.dev/@truffle/ui@0.0.1/components/scoped-stylesheet/scoped-stylesheet.js"
import Stylesheet from "https://tfl.dev/@truffle/ui@0.0.1/components/stylesheet/stylesheet.js"
import jumper from "https://tfl.dev/@truffle/utils@0.0.1/jumper/jumper.js"
import { useEffect, useState } from 'https://npm.tfl.dev/react'
function createIframeStyle(toolTip, collapsed, globalMouse) {
  function createClipPath({ top, right, bottom, left }) {
    return `inset(calc(100% - ${top}) calc(100% - ${right}) calc(100% - ${bottom}) calc(100% - ${left}))`
  }
  const overlayStates = {
    fullSize: { top: "71%", right: "415px", bottom: "100%", left: "100%", transition: "0s" },
    fullSizeToolTip: { top: "96%", right: "415px", bottom: "100%", left: "100%", transition: "0s" },
    collapsed: { top: "50px", right: "215px", bottom: "100%", left: "100%", transition: "0.5s" }
  }
  let currentState = overlayStates.fullSize
  if (toolTip) {
    currentState = overlayStates.fullSizeToolTip
  }
  if (collapsed) {
    currentState = overlayStates.collapsed
  }
  let position = {
    x: globalMouse.x,
    y: globalMouse.y
  }
  if (position.x < 5) position.x = 5
  if (position.y < 5) position.y = 5
  // if (position.x > ) position.x = 1000
  // if (position.y > 500) position.y = 500
  console.log(globalMouse)
  let style = {
    width: "430px",
    height: "150px",
    'clip-path': createClipPath(currentState),
    transition: `clip-path ${currentState.transition}`,
    background: "orange",
    position: "fixed",
    top: `${position.y}px`,
    left: `${position.x}px`,
    "z-index": "999",
    overflow: "hidden"
  }
  if (globalMouse.pressed) {
    style = {
      width: "100vw",
      height: "100vh",
      'clip-path': 'none',
      transition: `none`,
      background: "none",
      position: "fixed",
      top: `0`,
      left: `0`,
      "z-index": "999",
      overflow: "hidden"
    }
  }
  return style
}
function SpotifyComponent() {
  /* start of draggable code */
  //thanks bobby for the base https://bobbyhadz.com/blog/react-get-mouse-position
  const [globalMouse, setGlobalMouse] = useState({ startX: 0, startY: 0, x: 0, y: 0, windowHeight: 1000, windowWidth: 1000, pressed: false })
  const [iframeStyle, setIframeStyle] = useState(createIframeStyle(false, false, globalMouse))
  useEffect(() => {
    //get global mouse coordinates
    const handleWindowMouseMove = event => {
      setGlobalMouse((old) => {
        console.log(event.clientX, event.clientY, old.x, old.y, old.startX, old.startY)
        if (old.startDrag && iframeStyle.width == "100vw") {
          console.log(`setting start position to ${[event.clientX, event.clientY]} `)
          return {
            ...old,
            startDrag: false,
            startX: (event.clientX) - old.x,
            startY: (event.clientY) - old.y
          }
        }
        return {
          ...old,
          x: (event.clientX) - old.startX,
          y: (event.clientY) - old.startY,
        }
      })
    }
    if (globalMouse.pressed) {
      setGlobalMouse((old) => ({
        ...old,
        startDrag: true,
      }))
      window.addEventListener('mousemove', handleWindowMouseMove)
    } else {
      setGlobalMouse((old) => ({
        ...old,
        startDrag: false,
      }))
      window.removeEventListener('mousemove', handleWindowMouseMove)
    }
    return () => {
      window.removeEventListener('mousemove', handleWindowMouseMove)
    }
  }, [globalMouse.pressed, iframeStyle.width])
  /* end of draggable code */
  // console.log(globalMousePos)
  const [spotifyData, setSpotifyData] = useState()
  const [toolTip, setToolTip] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [trackPosition, setTrackPosition] = useState(0)
  //pull data from cloudflare worker
  const refreshRate = 10000
  const workerUrl = 'https://spotify-status-updater.shanecranor.workers.dev/'
  const orgID = 'shane'
  useEffect(() => {
    async function setStyles() {
      const style = createIframeStyle(toolTip, collapsed, globalMouse)
      console.log("JUMPING")
      await jumper.call("layout.applyLayoutConfigSteps", {
        layoutConfigSteps: [
          { action: "useSubject" }, // start with our iframe
          { action: "setStyle", value: style },
        ],
      })
      console.log("WE HAVE JUMPED")
      setIframeStyle(style)
    }
    setStyles()
  }, [collapsed, toolTip, globalMouse])

  useEffect(() => {
    async function fetchData() {
      const jsonResponse = await (await fetch(`${workerUrl}?orgID=${orgID}`)).json()
      //store fetch time to calculate song position
      jsonResponse.fetchTime = Date.now()
      setSpotifyData(jsonResponse)
    }
    fetchData() //fetch on page load
    //TODO: queue a fetch to go off at the end of every song
    //fetch at the specified refresh rate
    const fetchInterval = setInterval(
      () => {
        fetchData().catch(console.error)
      },
      refreshRate
    )
    return () => (clearInterval(fetchInterval))
  }, [])
  //update time
  const timeResolution = 200
  useEffect(() => {
    const timeUpdateInterval = setInterval(() => {
      if (!spotifyData) return
      if (spotifyData.is_playing) {
        setTrackPosition(spotifyData.position + (Date.now() - spotifyData.fetchTime))
      } else {
        setTrackPosition(spotifyData.position)
      }
    }, timeResolution)
    return () => (clearInterval(timeUpdateInterval))
  }, [spotifyData])
  if (!spotifyData) return "loading"
  const progressDate = new Date(Math.min(trackPosition, spotifyData.length))
  const percentDone = trackPosition / spotifyData.length
  const collapsedTag = collapsed ? ' collapsed' : ''
  const dragTag = globalMouse.pressed ? ' dragging' : ''
  return (
    <aside
      style={{
        background: "blue",
        position: "absolute",
        top: (globalMouse.pressed ? globalMouse.y + "px" : "0"),
        left: (globalMouse.pressed ? globalMouse.x + "px" : "0"),
        width: "100%",
        height: "100%"
      }}
      onMouseDown={() => setGlobalMouse((old) => ({ ...old, pressed: true }))}
      onMouseUp={() => setGlobalMouse((old) => ({ ...old, pressed: false }))}
    >
      <style>{`html { overflow: hidden }`}</style>
      <ScopedStylesheet url={new URL("styles/App.css", import.meta.url)}>
        <div className={'spotify-component' + collapsedTag + dragTag}
          onClick={() => collapsed && setCollapsed(oldState => !oldState)}
        >
          <img
            className={'album-art ' + collapsedTag}
            src={spotifyData.images[0].url} alt='album cover'
          />
          <SongInfo
            title={spotifyData.title}
            link={spotifyData.link}
            artists={spotifyData.artists}
            length={spotifyData.length}
            percentDone={percentDone}
            progressDate={progressDate}
          />
          <div className='controls' >
            <div className='help tooltip' onMouseOver={() => setToolTip(true)} onMouseOut={() => setToolTip(false)}
              data-hover-text='what the streamer is currently listening to'>?</div>
            <div className='minimize tooltip' onMouseOver={() => setToolTip(true)} onMouseOut={() => setToolTip(false)}
              data-hover-text='shrink the spotify overlay'
              onClick={() => setCollapsed(oldState => !oldState)}>‒</div>
          </div>
        </div>
      </ScopedStylesheet>
    </aside>
  )
}

function SongInfo({ title, link, artists, length, percentDone, progressDate }) {
  function pad(n) {
    return n < 10 ? `0${n}` : n
  }
  function formatDate(d) {
    if (d.getUTCHours())
      return `${d.getUTCHours()}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
    return `${d.getMinutes()}:${pad(d.getSeconds())}`
  }
  return (
    <div className={'song-info '}>
      <div className={'artist-title-container '}>
        <div className='song-title'>
          <a href={link} target="_blank" rel="noopener noreferrer">{title}</a>
        </div>
        <div className='artist-name'>
          {artists.map(artist => (
            <p key={artist}>
              <a href={artist.external_urls.spotify} target="_blank" rel="noopener noreferrer">
                {artist.name}
              </a>
            </p>))}
        </div>
      </div>
      <div className='progress-text-container'>
        <div className='progress'>{formatDate(progressDate)}</div>
        <div className='length'> {formatDate(new Date(length))}</div>
      </div>
      <div className='progress-bar-outer'>
        <div className='progress-bar-inner' style={{ '--song-position': percentDone * 100 + '%' }}> </div>
      </div>
    </div>
  )
}
export default SpotifyComponent
