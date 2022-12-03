import './App.css';
import React, { useState, useRef, useEffect } from 'react';
import * as data from './data.json'

const separatedImages = [[]];
Object.values(data).forEach((arr) => {
  const last = separatedImages[separatedImages.length - 1];
  if (last.length < 500) {
    separatedImages[separatedImages.length - 1] = last.concat(arr);
  } else {
    separatedImages[separatedImages.length] = [...arr];
  }
});
function App() {
  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const sliderRef = useRef();
  const speedRef = useRef(2050);
  const timeoutIdRef = useRef();
  const counterRef = useRef(0);

  const slideToNext = ({ isManual, isNext } = {}) => {
    console.log(isManual, speedRef.current);
    const setCounterRef = (isIncrease) => (isIncrease ? counterRef.current++ : counterRef.current--);
    if (isManual) {
      setCounterRef(isNext);
    } else {
      setCounterRef(speedRef.current > 0);
    }
    const currentSlide = sliderRef.current.childNodes[counterRef.current];
    if (!currentSlide) {
      stopAutoplay();
      return;
    }
    sliderRef.current.scrollTo({
      top: 0,
      left: currentSlide.offsetLeft - (window.innerWidth - currentSlide.width) / 2,
      behavior: 'smooth',
    });

    const activeClass = 'active';
    sliderRef.current.querySelectorAll(`img.${activeClass}`).forEach((el) => el.classList.remove(activeClass));
    currentSlide.classList.add(activeClass);
  };
  const setAutoplay = () => {
    timeoutIdRef.current = setTimeout(() => {
      slideToNext();
      console.log(isPlaying);
      setAutoplay();
    }, Math.abs(speedRef.current));
  };

  const stopAutoplay = () => {
    clearTimeout(timeoutIdRef.current);
    setIsPlaying(false);
  };

  const autoplay = () => {
    if (isPlaying) {
      stopAutoplay();
    } else {
      slideToNext();
      setAutoplay();
      setIsPlaying(true);
    }
  };

  const setSpeedRef = (isIncrease) => {
    let delta = 100;
    if (!isIncrease) delta = -delta;
    if (speedRef.current > 0) {
      speedRef.current += delta;
    } else {
      speedRef.current -= delta;
    }
  };

  const reverseAutoplay = () => (speedRef.current = -speedRef.current);
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

  let scale = 110;
  const setScale = (isIncrease) => {
    let delta = 5;
    if (!isIncrease) {
      if (scale === 100) return;
      delta = -delta;
    }
    scale += delta;
    sliderRef.current.style = `--active-slide-scale: ${scale}%;`;
  };

  function handleKeyPress({ code }) {
    console.log(code);
    switch (code) {
      case 'Space':
        autoplay();
        break;
      case 'KeyF':
        openFullscreen(sliderRef.current);
        break;
      case 'KeyR':
        reverseAutoplay();
        break;
      case 'ArrowLeft':
      case 'ArrowRight':
        slideToNext({
          isManual: true,
          isNext: code === 'ArrowRight',
        });
        break;
      case 'Equal':
      case 'Minus':
        setSpeedRef(code === 'Minus');
        break;
      case 'ArrowUp':
      case 'ArrowDown':
        setScale(code === 'ArrowUp');
        break;
      default:
        break;
    }
  }

  return (
    <div className="App">
      <button onClick={() => setIndex(index - 1)}>Prev index</button>
      <button onClick={() => setIndex(index + 1)}>Next index</button>
      <span style={{ marginLeft: 30 }}>Autoplay</span>
      <button onClick={() => setSpeedRef(true)}>Slower</button>
      <button onClick={autoplay}>
        {isPlaying}
        {isPlaying ? 'Stop' : 'Play'}
      </button>
      <button onClick={() => setSpeedRef(false)}>Faster</button>
      <button onClick={reverseAutoplay}>Reverse</button>
      <button onClick={() => openFullscreen(sliderRef.current)}>Fullscreen</button>
      <div className="slider" ref={sliderRef} onKeyDown={handleKeyPress} tabIndex="0">
        {separatedImages[index % separatedImages.length].map((src, index) => (
          <img alt="" key={src} src={src} />
        ))}
      </div>
      {/* <video controls="" autoplay="" name="media">
      <source src="./slides/name.mkv" type="video/webm"/>
      </video> */}
    </div>
  );
}

export default App;
