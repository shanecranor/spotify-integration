// import './styles/App.scss'
// import './styles/AppSlim.scss'
// import './styles/Slider.scss'
// import ExpandAlt from './images/expand-alt.svg'
// import Shrink from './images/down-left-and-up-right-to-center-solid.svg'
import ScopedStylesheet from "https://tfl.dev/@truffle/ui@0.0.1/components/scoped-stylesheet/scoped-stylesheet.jsx";
import { useEffect, useState } from 'react'
function SpotifyComponent() {
  const [spotifyData, setSpotifyData] = useState()
  const [collapsed, setCollapsed] = useState(false)
  const [slim, setSlim] = useState(false)
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
  if(!spotifyData){
    return <p>loading"</p>;
  }
  const progressDate = new Date(Math.min(trackPosition, spotifyData.length))
  const percentDone = trackPosition/spotifyData.length
  const collapsedTag = collapsed ? ' collapsed' : '';
  return (<>
    <ScopedStylesheet url={new URL("styles/Slider.css", import.meta.url)}>
      <label className='switch'>
        <input type='checkbox' onClick={() => setSlim(oldState => !oldState)}/>
        <span className='slider round'></span>
      </label>
    </ScopedStylesheet>
    <div className={'spotify-component' + collapsedTag + (slim ? ' slim' : '')}
          onClick={() => slim && setCollapsed(oldState => !oldState)}>
      <div className='spotify-container'>
        <div className={'playing-header '}>
          <img 
            className={'album-art ' + collapsedTag}
            src={spotifyData.images[0].url} alt='album cover'
          />
          <div className={'title-text ' +collapsedTag}>Currently playing</div>
          {/* <img 
            className={'expand ' +collapsedTag} src={ new URL("https://www.worldanvil.com/uploads/images/03220ab14fe9a946322a5329bd7977ad.png") }
            alt='expand or shrink the interface'
            onClick={() => setCollapsed(oldState => !oldState)}
          /> */}
        </div>
        <div className='playing-container'>
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
          collapsedTag={collapsedTag}
          />
        </div>
      </div>
    </div>
    </>
  )
}

function SongInfo({title, artists, length, percentDone, progressDate, collapsedTag}){
  function pad(n){
    return n < 10 ? `0${n}` : n
  } 
  function formatDate(d){
    return `${d.getMinutes()}:${pad(d.getSeconds())}`
  }
  return (
    <div className={'right-info-container '+ collapsedTag}>
      <div className={'artist-title-container ' + collapsedTag}>
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
