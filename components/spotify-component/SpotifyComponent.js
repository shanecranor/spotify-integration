// import './styles/App.scss'
// import './styles/AppSlim.scss'
// import './styles/Slider.scss'
// import ExpandAlt from './images/expand-alt.svg'
// import Shrink from './images/down-left-and-up-right-to-center-solid.svg'
import React from 'https://npm.tfl.dev/react'
import ScopedStylesheet from "https://tfl.dev/@truffle/ui@0.0.1/components/scoped-stylesheet/scoped-stylesheet.jsx";
import Stylesheet from "https://tfl.dev/@truffle/ui@0.0.1/components/stylesheet/stylesheet.jsx";
import { useEffect, useState } from 'https://npm.tfl.dev/react'
function SpotifyComponent() {
  const [spotifyData, setSpotifyData] = useState()
  const [collapsed, setCollapsed] = useState(false)
  const [trackPosition, setTrackPosition] = useState(0)
  //fetch data 
  useEffect(() => {
    async function fetchData(){
      const jsonResponse = await (await fetch('https://spotify-status-updater.shanecranor.workers.dev/?orgID=shane')).json()
      jsonResponse.fetchTime = Date.now()
      setSpotifyData(jsonResponse)
    }
    fetchData()
    const fetchInterval = setInterval(() => {
      fetchData().catch(console.error)
    }, 5000)
    return () => (clearInterval(fetchInterval))
  }, [])
  //update time
  useEffect(() => {
    const timeUpdateInterval = setInterval(() => {
      if(!spotifyData) return
      if(spotifyData.is_playing){
        setTrackPosition(spotifyData.position+(Date.now()-spotifyData.fetchTime))
      } else {
        setTrackPosition(spotifyData.position)
      }
    }, 200)
    return () => (clearInterval(timeUpdateInterval))
  }, [spotifyData])
  if(!spotifyData) return "loading"
  const progressDate = new Date(Math.min(trackPosition, spotifyData.length))
  const percentDone = trackPosition/spotifyData.length
  const collapsedTag = collapsed ? ' collapsed' : ''
  return (
    <>
      <style>{`html { overflow: hidden }`}</style>
      <ScopedStylesheet url={new URL("styles/App.css", import.meta.url)}>
        <div className={'spotify-component' + collapsedTag}
          onClick={() => collapsed && setCollapsed(oldState => !oldState)}>
          <img 
            className={'album-art ' + collapsedTag}
            src={spotifyData.images[0].url} alt='album cover'
          />
          <SongInfo 
          title={spotifyData.title}
          artists={spotifyData.artists}
          length={spotifyData.length}
          percentDone={percentDone}
          progressDate={progressDate}
          />
          <div className='controls'>
          <div  className='help tooltip' 
            data-hover-text='What the streamer is currently listening to'>?</div>
          <div  className='minimize tooltip' 
            data-hover-text='shrink the spotify overlay'
            onClick={() => setCollapsed(oldState => !oldState)}>‒</div>

          </div>
        </div>
    </ScopedStylesheet>
    </>
  )
}

function SongInfo({title, artists, length, percentDone, progressDate}){
  function pad(n){
    return n < 10 ? `0${n}` : n
  } 
  function formatDate(d){
    return `${d.getMinutes()}:${pad(d.getSeconds())}`
  }
  return (
    <div className={'song-info '}>
      <div className={'artist-title-container '}>
        <div className='song-title'>
          {title}
        </div>
        <div className='artist-name'> 
          {artists.map(artist => (artist.name)).join(", ")}
        </div>
      </div>
      <div className='progress-text-container'>
        <div className='progress'>{formatDate(progressDate)}</div>
        <div className='length'> {formatDate(new Date(length))}</div>
      </div>
      <div className='progress-bar-outer'> 
        <div className='progress-bar-inner'  style={{'--song-position':percentDone*100+'%'}}> </div>
      </div>
    </div>
  )
}
export default SpotifyComponent
