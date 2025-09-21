"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";

export const InfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className,
}) => {
  const containerRef = React.useRef(null);
  const scrollerRef = React.useRef(null);

  useEffect(() => {
    addAnimation();
  }, []);
  
  const [start, setStart] = useState(false);
  
  function addAnimation() {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);

      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true);
        if (scrollerRef.current) {
          scrollerRef.current.appendChild(duplicatedItem);
        }
      });

      getDirection();
      getSpeed();
      setStart(true);
    }
  }
  
  const getDirection = () => {
    if (containerRef.current) {
      if (direction === "left") {
        containerRef.current.style.setProperty("--animation-direction", "forwards");
      } else {
        containerRef.current.style.setProperty("--animation-direction", "reverse");
      }
    }
  };
  
  const getSpeed = () => {
    if (containerRef.current) {
      if (speed === "fast") {
        containerRef.current.style.setProperty("--animation-duration", "20s");
      } else if (speed === "normal") {
        containerRef.current.style.setProperty("--animation-duration", "60s");
      } else {
        containerRef.current.style.setProperty("--animation-duration", "80s");
      }
    }
  };
  
  return (
    <div className="w-full py-8 bg-gradient-to-b from-white to-emerald-50/30">
      <div
        ref={containerRef}
        className={cn(
          "scroller relative z-20 w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_5%,white_95%,transparent)]",
          className
        )}
      >
        <ul
          ref={scrollerRef}
          className={cn(
            "flex w-full min-w-full shrink-0 flex-nowrap gap-6 py-6",
            start && "animate-scroll",
            pauseOnHover && "hover:[animation-play-state:paused]"
          )}
        >
          {items.map((item, idx) => (
            <li
              className="relative w-[350px] max-w-full shrink-0 rounded-xl bg-white px-8 py-7 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 border border-emerald-100 md:w-[400px] dark:bg-slate-900 dark:border-emerald-900/30"
              key={idx}
            >
              <div className="h-full flex flex-col">
                {/* Icon Container */}
                <div className="w-14 h-14 bg-emerald-50 rounded-lg flex items-center justify-center mb-5 mx-auto dark:bg-emerald-900/20">
                  <div className="text-emerald-600 dark:text-emerald-400">
                    {item.icon}
                  </div>
                </div>
                
                {/* Quote */}
                <p className="relative z-20 text-base leading-[1.7] font-normal text-slate-700 text-center mb-5 flex-grow dark:text-slate-300">
                  {item.quote}
                </p>
                
                {/* Name and Title */}
                <div className="relative z-20 mt-auto flex flex-col items-center pt-5 border-t border-emerald-100 dark:border-emerald-800/30">
                  <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                    {item.name}
                  </h4>
                  <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400 mt-2 bg-emerald-50 px-3 py-1 rounded-md dark:bg-emerald-900/20">
                    {item.title}
                  </span>
                </div>
              </div>
              
              {/* Subtle corner accents */}
              <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
                <div className="absolute top-0 right-0 w-4 h-4 bg-emerald-500/10 rounded-bl-full"></div>
              </div>
              <div className="absolute bottom-0 left-0 w-16 h-16 overflow-hidden">
                <div className="absolute bottom-0 left-0 w-4 h-4 bg-emerald-500/10 rounded-tr-full"></div>
              </div>
            </li>
          ))}
        </ul>
        
        <style>{`
          @keyframes scroll {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(calc(-50% - 0.75rem));
            }
          }
          
          .animate-scroll {
            animation: scroll var(--animation-duration, 40s) linear infinite;
            animation-direction: var(--animation-direction, forwards);
          }
          
          .animate-scroll:hover {
            animation-play-state: paused;
          }
          
          @media (prefers-reduced-motion: reduce) {
            .animate-scroll {
              animation-duration: 1s;
            }
          }
        `}</style>
      </div>
    </div>
  );
};