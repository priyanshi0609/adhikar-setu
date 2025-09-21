"use client";
import React, { useEffect, useRef, useState } from "react";
import { useMotionValueEvent, useScroll, motion } from "motion/react";
import { cn } from "@/lib/utils";

export const StickyScroll = ({ content, contentClassName }) => {
  const [activeCard, setActiveCard] = React.useState(0);
  const ref = useRef(null);


  const { scrollYProgress } = useScroll({
    container: ref,
    offset: ["start start", "end start"],
  });

  const cardLength = content.length;

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const cardsBreakpoints = content.map((_, index) => index / cardLength);
    const closestBreakpointIndex = cardsBreakpoints.reduce(
      (acc, breakpoint, index) => {
        const distance = Math.abs(latest - breakpoint);
        if (distance < Math.abs(latest - cardsBreakpoints[acc])) {
          return index;
        }
        return acc;
      },
      0
    );
    setActiveCard(closestBreakpointIndex);
  });

  const linearGradients = [
    "linear-gradient(to bottom right, #16a34a, #22c55e)", // green-600 to green-500
    "linear-gradient(to bottom right, #15803d, #16a34a)", // green-700 to green-600
    "linear-gradient(to bottom right, #166534, #15803d)", // green-800 to green-700
    "linear-gradient(to bottom right, #14532d, #166534)", // green-900 to green-800
  ];

  const [backgroundGradient, setBackgroundGradient] = useState(linearGradients[0]);

  useEffect(() => {
    setBackgroundGradient(linearGradients[activeCard % linearGradients.length]);
  }, [activeCard]);

  return (
    <div className="bg-green-50 rounded-2xl p-6">
      <motion.div
        ref={ref} 
        className="relative flex h-[34rem] justify-center space-x-10 overflow-y-auto rounded-xl p-6 backdrop-blur-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Left side - list of cards */}
        <div className="relative flex items-start px-4">
          <div className="max-w-2xl">
            {content.map((item, index) => (
              <motion.div
                key={item.title + index}
                className="my-24 py-6 px-4 rounded-lg transition-all duration-300"
                initial={{ opacity: 0, x: -20 }}
                animate={{
                  opacity: activeCard === index ? 1 : 0.4,
                  x: 0,
                  backgroundColor:
                    activeCard === index
                      ? "rgba(187, 247, 208, 0.2)"
                      : "transparent",
                }}
                transition={{ duration: 0.5 }}
              >
                <motion.div className="flex items-center mb-4">
                  {item.icon && (
                    <motion.div
                      className="mr-4 text-2xl text-green-700 p-3 bg-green-100 rounded-full"
                      animate={{
                        scale: activeCard === index ? 1.1 : 1,
                        backgroundColor:
                          activeCard === index ? "#bbf7d0" : "#f0fdf4",
                      }}
                      transition={{ type: "spring", stiffness: 500 }}
                    >
                      {item.icon}
                    </motion.div>
                  )}
                  <h2 className="text-2xl font-bold text-green-900">
                    {item.title}
                  </h2>
                </motion.div>
                <motion.p className="text-lg mt-4 max-w-sm text-green-700 leading-relaxed">
                  {item.description}
                </motion.p>

                {/* Subtle connector line between items */}
                {index < content.length - 1 && (
                  <motion.div
                    className="h-8 w-0.5 bg-green-200 ml-7 mt-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: activeCard === index ? 1 : 0.3 }}
                  />
                )}
              </motion.div>
            ))}
            <div className="h-40" />
          </div>
        </div>

        {/* Right side - sticky preview box */}
        <motion.div
          style={{ background: backgroundGradient }}
          className={cn(
            "sticky top-10 hidden h-72 w-80 overflow-hidden rounded-2xl lg:flex items-center justify-center text-white font-semibold shadow-xl border-2 border-white/20",
            contentClassName
          )}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
        >
          {content[activeCard].content ?? (
            <motion.div
              className="text-center p-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="text-5xl mb-4">✨</div>
              <div className="text-xl">Feature Preview</div>
              <p className="text-sm font-normal mt-2 opacity-90">
                Scroll to explore more features
              </p>
            </motion.div>
          )}
        </motion.div>
      </motion.div>

      {/* Bottom dots navigation */}
      <div className="flex justify-center mt-8">
        <div className="flex space-x-2">
          {content.map((_, index) => (
            <button
              key={index}
              className={cn(
                "w-3 h-3 rounded-full transition-all duration-300",
                activeCard === index ? "bg-green-700 w-8" : "bg-green-300"
              )}
              onClick={() => {
                const element = ref.current;
                if (element) {
                  const scrollPos =
                    (index / content.length) * element.scrollHeight;
                  element.scrollTo({ top: scrollPos, behavior: "smooth" });
                }
              }}
              aria-label={`Go to feature ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
