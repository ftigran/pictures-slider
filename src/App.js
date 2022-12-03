import './App.css';
import React, { useRef } from 'react';
import * as data from './data.json'
import Slider from './Slider'

const albums = Object.entries(data).filter(([title, images]) => !!title && Array.isArray(images));


function App() {
  const appRef = useRef();

  let scale = 110;
  const getScaleStyle = () => `--active-slide-scale: ${scale}%;`
  const setScale = (isIncrease) => {
    let delta = 5;
    if (!isIncrease) {
      if (scale === 100) return;
      delta = -delta;
    }
    scale += delta;
    appRef.current.style = getScaleStyle();
  };

  function handleKeyPress({ code }) {
    switch (code) {
      case 'KeyF':
        openFullscreen(appRef.current);
        break;
      case 'ArrowUp':
      case 'ArrowDown':
        setScale(code === 'ArrowUp');
        break;
      default:
        break;
    }
  }

  const openFullscreen = (elem) => {
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
      /* Safari */
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      /* IE11 */
      elem.msRequestFullscreen();
    }
  };
  return (
    <div className="App" ref={appRef} onKeyDown={handleKeyPress} tabIndex={0}>
      {albums.map(([title, images], index) => (<Slider key={index} slides={images} title={title} />))}
      {/* <video controls="" autoplay="" name="media">
      <source src="./slides/name.mkv" type="video/webm"/>
      </video> */}
    </div>
  );
}

export default App;
