import React, { createContext, useContext, useEffect } from 'react';
import { useMotionValue, animate } from 'framer-motion';

const COLORS = ["#13FFAA", "#1E67C6", "#CE84CF", "#DD335C"];

const ColorContext = createContext();

export function useColorContext() {
  return useContext(ColorContext);
}

export function ColorProvider({ children }) {
  const color = useMotionValue(COLORS[0]);

  useEffect(() => {
    animate(color, COLORS, {
      ease: "easeInOut",
      duration: 10,
      repeat: Infinity,
      repeatType: "mirror",
    });
  }, [color]);

  return (
    <ColorContext.Provider value={{ color, COLORS }}>
      {children}
    </ColorContext.Provider>
  );
}