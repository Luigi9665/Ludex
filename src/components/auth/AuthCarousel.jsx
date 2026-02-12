import { useState, useEffect } from "react";
// Import screenshots (adjust paths as needed)
import Library from "../../assets/landing/library.png";
import GameDetail from "../../assets/landing/game_detail.png";
import Profile from "../../assets/landing/profile.png";
import HomeFull from "../../assets/landing/home_full.png";
import ModalAddGame from "../../assets/landing/modal_add_game.png";

const loginSlides = [
  { id: 1, image: ModalAddGame, alt: "Modale Aggiungi Gioco" },
  { id: 2, image: Library, alt: "Libreria giochi" },
  { id: 3, image: GameDetail, alt: "Dettaglio gioco" },
];

const registerSlides = [
  { id: 1, image: ModalAddGame, alt: "Modale Aggiungi Gioco" },
  { id: 2, image: Profile, alt: "Profilo utente" },
  { id: 3, image: HomeFull, alt: "Community e trending" },
];

const AuthCarousel = ({ variant = "login" }) => {
  const slides = variant === "login" ? loginSlides : registerSlides;
  const [currentIndex, setCurrentIndex] = useState(0);

  // reset index quando cambia il variant
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentIndex(0);
  }, [variant]);

  // autoplay
  useEffect(() => {
    if (!slides.length) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [slides.length]);

  if (!slides.length) {
    return null;
  }

  return (
    <div className="lx-auth-carousel">
      {slides.map((slide, idx) => (
        <div key={slide.id} className={`lx-auth-carousel-slide ${idx === currentIndex ? "lx-auth-carousel-slide--active" : ""}`}>
          <div className="lx-auth-carousel-frame">
            {/* background blur che riempie tutta la view */}
            <div className="lx-auth-carousel-bg" style={{ backgroundImage: `url(${slide.image})` }} aria-hidden="true" />

            {/* immagine "pulita" centrata, non croppata */}
            <img src={slide.image} alt={slide.alt} loading="lazy" className="lx-auth-carousel-img" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default AuthCarousel;
