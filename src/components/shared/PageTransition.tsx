'use client';

import { motion } from "framer-motion";
import React from "react";

interface PageTransitionProps {
  children: React.ReactNode;
}

const PageTransition = ({ children }: PageTransitionProps) => (
  <motion.div
    initial={{ opacity: 0.8 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.12, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);

export default PageTransition;
