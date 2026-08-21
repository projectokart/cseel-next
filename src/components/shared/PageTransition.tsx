'use client';

import { motion } from "framer-motion";
import React from "react";

interface PageTransitionProps {
  children: React.ReactNode;
}

const PageTransition = ({ children }: PageTransitionProps) => (
  <motion.div
    initial={{ opacity: 0, y: 6 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
  >
    {children}
  </motion.div>
);

export default PageTransition;
