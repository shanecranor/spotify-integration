// import './styles/App.scss'
// import './styles/AppSlim.scss'
// import './styles/Slider.scss'
// import ExpandAlt from './images/expand-alt.svg'
// import Shrink from './images/down-left-and-up-right-to-center-solid.svg'
import React from 'https://npm.tfl.dev/react'
import Draggable from '../draggable/draggable.jsx'
import ScopedStylesheet from "https://tfl.dev/@truffle/ui@0.0.1/components/scoped-stylesheet/scoped-stylesheet.js"
import Stylesheet from "https://tfl.dev/@truffle/ui@0.0.1/components/stylesheet/stylesheet.js"
import jumper from "https://tfl.dev/@truffle/utils@0.0.1/jumper/jumper.js"
import { useEffect, useState } from 'https://npm.tfl.dev/react'
const defaultModifier = { top: -43, right: 0, bottom: 0, left: 0, transition: "none" }
function SpotifyComponent() {
  //set base dimensions
  const base = { x: 415, y: 150 }
  const [dragProps, setDragProps] = useState(
    {
      dimensions: {
        base: base,
        modifiers: defaultModifier
      },
      defaultPosition: { x: 0, y: 0 }
    })
  const [spotifyData, setSpotifyData] = useState()
  const [toolTip, setToolTip] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [trackPosition, setTrackPosition] = useState(0)
  //pull data from cloudflare worker
  const refreshRate = 10000
  const workerUrl = 'https://spotify-status-updater.shanecranor.workers.dev/'
  const orgID = 'shane'
  useEffect(() => {
    const overlayStates = {
      fullSize: { ...defaultModifier },
      collapsed: { ...defaultModifier, top: -98, right: -200, transition: `clip-path 0.5s ease` },
      toolTip: { ...defaultModifier, top: 0 }
    }
    let modifiers = overlayStates.fullSize
    if (toolTip) modifiers = overlayStates.toolTip
    if (collapsed) modifiers = overlayStates.collapsed
    setDragProps((old) => ({
      ...old,
      dimensions: { ...old.dimensions, modifiers: modifiers }
    }))
  }, [collapsed, toolTip])

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
  const timeResolution = 1000
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
  return (
    <aside style={{ background: "none" }}>
      <Stylesheet url={new URL('./styles/root.css', import.meta.url)} />
      <style>{`html { overflow: hidden }`}</style>
      <Draggable
        dimensions={dragProps.dimensions}
        defaultPosition={dragProps.defaultPosition}>
        <ScopedStylesheet url={new URL("styles/App.css", import.meta.url)}>
          <div className={'spotify-component' + collapsedTag}
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
      </Draggable>
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
          <a draggable="false" href={link} target="_blank" rel="noopener noreferrer">{title}</a>
        </div>
        <div className='artist-name'>
          {artists.map(artist => (
            <p key={artist}>
              <a draggable="false" href={artist.external_urls.spotify} target="_blank" rel="noopener noreferrer">
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
