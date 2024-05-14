import React, { useState, useRef } from "react";
import "../css/Slideshow.css";
import { php_url } from "../vars";

const delay = 2500;

function Slideshow({gameId}) {
  const [index, setIndex] = useState(0);
  const [images, setImages] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const timeoutRef = useRef(null);

  function loadImages() {
      fetch(php_url + "/game/" + gameId + "/images", {
          method: "GET",
          credentials: "include", // Include cookies
      })
          .then((response) => response.json())
          .then((data) => {
              setImages(data);
              console.log("screens:", data);
              setIsLoaded(true);
          })
          .catch((error) => {
              console.error("There was an error!", error);
          });
  }

  React.useEffect(() => {
    loadImages();
  }, []);
  
  function resetTimeout() {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }

  React.useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(
      () =>
        setIndex((prevIndex) =>
          prevIndex === images.length - 1 ? 0 : prevIndex + 1
        ),
      delay
    );

    return () => {
      resetTimeout();
    };
  }, [index]);

  return (
    <div className="slideshow">
      <div
        className="slideshowSlider"
        style={{ transform: `translate3d(${-index * 100}%, 0, 0)` }}
      >
        {images.map((image, index) => (
        <div className="slide" key={index}>
            <img className="game-img" src={image.image} alt={image.id} />        
        </div>
        ))}
      </div>

      <div className="slideshowDots">
        {images.map((_, idx) => (
          <div
            key={idx}
            className={`slideshowDot${index === idx ? " active" : ""}`}
            onClick={() => {
              setIndex(idx);
            }}
          ></div>
        ))}
      </div>
    </div>
  );
}

export default Slideshow;