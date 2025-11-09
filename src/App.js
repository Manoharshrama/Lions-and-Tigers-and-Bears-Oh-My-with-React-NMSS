import './App.css';

import { useEffect, useState, useRef } from "react";

export default function App() {
  const [breeds, setBreeds] = useState({});
  const [breed, setBreed] = useState("Choose a dog breed");
  const [images, setImages] = useState([]);
  const slideshowRef = useRef(null);
  const timerRef = useRef(null);
  const deleteDelayRef = useRef(null);

  // Fetch list of breeds
  useEffect(() => {
    async function fetchBreeds() {
      try {
        const res = await fetch("https://dog.ceo/api/breeds/list/all");
        const data = await res.json();
        setBreeds(data.message);
      } catch {
        console.log("There was a problem fetching the breed list.");
      }
    }
    fetchBreeds();
  }, []);

  // Fetch images for selected breed
  useEffect(() => {
    if (breed === "Choose a dog breed") return;
    async function fetchImages() {
      try {
        const res = await fetch(`https://dog.ceo/api/breed/${breed}/images`);
        const data = await res.json();
        setImages(data.message);
      } catch {
        console.log("Error loading images");
      }
    }
    fetchImages();
  }, [breed]);

  // Slideshow logic
  useEffect(() => {
    const slideshow = slideshowRef.current;
    if (!slideshow || images.length === 0) return;

    let currentPosition = 0;
    clearInterval(timerRef.current);
    clearTimeout(deleteDelayRef.current);

    // Start slideshow
    function renderInitial() {
      slideshow.innerHTML = "";
      if (images.length > 1) {
        slideshow.innerHTML = `
          <div class="slide" style="background-image: url('${images[0]}')"></div>
          <div class="slide" style="background-image: url('${images[1]}')"></div>
        `;
        currentPosition = 2;
        if (images.length === 2) currentPosition = 0;
        timerRef.current = setInterval(nextSlide, 3000);
      } else {
        slideshow.innerHTML = `
          <div class="slide" style="background-image: url('${images[0]}')"></div>
          <div class="slide"></div>
        `;
      }
    }

    function nextSlide() {
      slideshow.insertAdjacentHTML(
        "beforeend",
        `<div class="slide" style="background-image: url('${images[currentPosition]}')"></div>`
      );
      deleteDelayRef.current = setTimeout(() => {
        const firstSlide = slideshow.querySelector(".slide");
        if (firstSlide) firstSlide.remove();
      }, 1000);
      currentPosition = (currentPosition + 1) % images.length;
    }

    renderInitial();

    return () => {
      clearInterval(timerRef.current);
      clearTimeout(deleteDelayRef.current);
    };
  }, [images]);

  return (
    <div className="app">
      <div className="header">
        <h1>Infinite Dog App</h1>
        <select value={breed} onChange={(e) => setBreed(e.target.value)}>
          <option>Choose a dog breed</option>
          {Object.keys(breeds).map((b) => (
            <option key={b}>{b}</option>
          ))}
        </select>
      </div>
      <div className="slideshow" ref={slideshowRef}></div>
    </div>
  );
}
