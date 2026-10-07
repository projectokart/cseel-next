'use client';

import { motion } from "framer-motion";
import React from "react";

interface PageTransitionProps {
  children: React.ReactNode;
}

const PageTransition = ({ children }: PageTransitionProps) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{
      duration: 0.55,
      ease: [0.16, 1, 0.3, 1], // Labster fluid spring easing curve
    }}
  >
    {children}
  </motion.div>
);

export default PageTransition;
