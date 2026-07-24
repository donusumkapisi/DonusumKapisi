"use client";

import { motion, type Variants } from "motion/react";

const variants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

const TAGS = {
  div: motion.div,
  h1: motion.h1,
  h2: motion.h2,
  p: motion.p,
} as const;

/**
 * Scroll-triggered reveal used throughout the marketing pages. Animates once
 * when the element enters the viewport so repeated scrolling doesn't replay it.
 */
export function FadeIn({
  children,
  delay = 0,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: keyof typeof TAGS;
}) {
  const Component = TAGS[as];

  return (
    <Component
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={variants}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </Component>
  );
}
