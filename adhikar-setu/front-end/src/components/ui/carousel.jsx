"use client";
import { IconArrowNarrowRight } from "@tabler/icons-react";
import { useState, useRef, useId, useEffect } from "react";

const Slide = ({
  slide,
  index,
  current,
  handleSlideClick
}) => {
  const { icon, title, description } = slide;

  return (
    <li
      className="flex flex-1 flex-col items-center justify-center relative text-center transition-all duration-500 ease-in-out w-[70vmin] h-[70vmin] mx-[4vmin] z-10 cursor-pointer"
      onClick={() => handleSlideClick(index)}
      style={{
        transform:
          current !== index
            ? "scale(0.95)"
            : "scale(1)",
        opacity: current !== index ? 0.7 : 1,
        transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.5s ease",
      }}>
      <div
        className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white to-emerald-50 rounded-xl overflow-hidden transition-all duration-300 ease-out flex items-center justify-center p-8 border border-emerald-100 shadow-sm hover:shadow-md"
        style={{
          transform:
            current === index
              ? "translate3d(0, 0, 0)"
              : "none",
        }}>
        
        {/* Content Container */}
        <div className="relative z-10">
          
          {/* Icon */}
          <div className="w-16 h-16 bg-emerald-100 rounded-xl flex items-center justify-center mb-6 mx-auto">
            <div className="text-emerald-700">
              {icon}
            </div>
          </div>
          
          {/* Title */}
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">
            {title}
          </h2>
          
          {/* Description */}
          <p className="text-sm md:text-base text-gray-600 leading-relaxed mb-6">
            {description}
          </p>
        
  
        </div>

        {/* Active indicator */}
        {current === index && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-emerald-500 rounded-full"></div>
        )}
      </div>
    </li>
  );
};

const CarouselControl = ({
  type,
  title,
  handleClick
}) => {
  return (
    <button
      className={`w-10 h-10 flex items-center mx-2 justify-center bg-white border border-gray-200 rounded-full focus:outline-none hover:bg-gray-50 active:bg-gray-100 transition duration-200 shadow-sm ${
        type === "previous" ? "rotate-180" : ""
      }`}
      title={title}
      onClick={handleClick}>
      <IconArrowNarrowRight className="text-gray-600" />
    </button>
  );
};

export default function Carousel({
  slides
}) {
  const [current, setCurrent] = useState(0);

  const handlePreviousClick = () => {
    const previous = current - 1;
    setCurrent(previous < 0 ? slides.length - 1 : previous);
  };

  const handleNextClick = () => {
    const next = current + 1;
    setCurrent(next === slides.length ? 0 : next);
  };

  const handleSlideClick = (index) => {
    if (current !== index) {
      setCurrent(index);
    }
  };

  const id = useId();

  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(() => {
      handleNextClick();
    }, 5000);

    return () => clearInterval(interval);
  }, [current]);

  return (
    <div className="relative w-full max-w-4xl mx-auto py-8">
      <div
        className="relative w-[70vmin] h-[70vmin] mx-auto"
        aria-labelledby={`carousel-heading-${id}`}>
        <ul
          className="absolute flex mx-[-4vmin] transition-transform duration-700 ease-in-out"
          style={{
            transform: `translateX(-${current * (100 / slides.length)}%)`,
          }}>
          {slides.map((slide, index) => (
            <Slide
              key={index}
              slide={slide}
              index={index}
              current={current}
              handleSlideClick={handleSlideClick} />
          ))}
        </ul>
        
        {/* Navigation Dots */}
        <div className="absolute flex justify-center w-full bottom-[-2rem] space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                current === index ? "bg-emerald-600 w-6" : "bg-gray-300"
              }`}
              onClick={() => handleSlideClick(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
        
        {/* Navigation Arrows */}
        <div className="absolute flex justify-between w-full top-1/2 transform -translate-y-1/2 px-4">
          <CarouselControl
            type="previous"
            title="Go to previous feature"
            handleClick={handlePreviousClick} />

          <CarouselControl 
            type="next" 
            title="Go to next feature" 
            handleClick={handleNextClick} />
        </div>
      </div>
    </div>
  );
}