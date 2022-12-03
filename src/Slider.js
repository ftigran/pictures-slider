import './App.css';
import React, { useState, useRef, useEffect } from 'react';

function Slider({ slides, title }) {
  // console.log(slides)
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHided, setIsHided] = useState(false);
  const sliderRef = useRef();
  const speedRef = useRef(2050);
  const timeoutIdRef = useRef();
  const counterRef = useRef(-1);

  const slideTo = ({ isManual, isNext, slideTo } = {}) => {
    const setCounterRef = (isIncrease) => (isIncrease ? counterRef.current++ : counterRef.current--);
    if (isManual) {
      if (slideTo === undefined) {
        setCounterRef(isNext);
      } else {
        counterRef.current = slideTo;
      }
    } else {
      setCounterRef(speedRef.current > 0);
    }
    const currentSlide = sliderRef.current.childNodes[counterRef.current];
    console.log(currentSlide, counterRef.current)
    if (!currentSlide) {
      stopAutoplay();
      reverseAutoplay();
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

  const slideToNext = () => slideTo();
  useEffect(() => {
    slideToNext();
  })
  const setAutoplay = () => {
    timeoutIdRef.current = setTimeout(() => {
      slideToNext();
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


  function handleKeyPress({ code }) {
    switch (code) {
      case 'Space':
        autoplay();
        break;
      case 'KeyF':
        openFullscreen(sliderRef.current);
        break;
      case 'KeyS':
      case 'KeyE':
        const isSlideToStart = code === 'KeyS'
        
        slideTo({
          isManual: true,
          slideTo: isSlideToStart ? 0 : sliderRef.current.childNodes.length - 1,
        })
        const absSpeed = Math.abs(speedRef.current)
        speedRef.current = isSlideToStart ? absSpeed : - absSpeed
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
      default:
        break;
    }
  }

  return (
    <div className="slider-container" hidden={isHided}>
      <div className="popup">
        <h1>{title.match(/[^/]+$/)[0]}</h1>
        <div className="controls">
          <button onClick={() => setSpeedRef(true)}>Slower</button>
          <button onClick={autoplay}>
            {isPlaying}
            {isPlaying ? 'Stop' : 'Play'}
          </button>
          <button onClick={() => setSpeedRef(false)}>Faster</button>
          <button onClick={reverseAutoplay}>Reverse</button>
          <button onClick={() => openFullscreen(sliderRef.current)}>Fullscreen</button>
          <button onClick={() => setIsHided(true)}>Hide</button>
        </div>
      </div>
      <div className="slider" ref={sliderRef} onKeyDown={handleKeyPress} tabIndex="0">
        {slides.map((src, index) => (
          <img alt="" key={index} src={src} />
        ))}
      </div>
      {/* <video controls="" autoplay="" name="media">
      <source src="./slides/name.mkv" type="video/webm"/>
      </video> */}
    </div>
  );
}

export default Slider;
