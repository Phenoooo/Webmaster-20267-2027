"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import Footer from "@/components/Footer";
import SiteNav from "@/components/SiteNav";
import { ArrowIcon } from "@/components/icons";
import { courts } from "@/lib/courts";

export default function GamesCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const court = courts[activeIndex];
  const reduceMotion = useReducedMotion();

  function reveal(delay: number) {
    return {
      initial: reduceMotion ? false : { opacity: 0, y: 16, filter: "blur(5px)" },
      animate: { opacity: 1, y: 0, filter: "blur(0px)" },
      transition: {
        duration: reduceMotion ? 0 : 0.4,
        delay: reduceMotion ? 0 : delay,
        ease: "easeOut" as const,
      },
    };
  }

  function showPrevious() {
    setActiveIndex((index) => (index - 1 + courts.length) % courts.length);
  }

  function showNext() {
    setActiveIndex((index) => (index + 1) % courts.length);
  }

  return (
    <main>
      <section className="court-explorer-stage mahogany-section">
        <SiteNav />
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={court.id}
            className={`explorer-slide explorer-slide-${court.id}`}
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -12 }}
            transition={{ duration: reduceMotion ? 0 : 0.32, ease: "easeOut" }}
          >
            <div className="explorer-copy">
              <motion.h1 {...reveal(0.06)}>{court.name}</motion.h1>
              <motion.p className="explorer-tagline" {...reveal(0.12)}>
                {court.tagline}
              </motion.p>
              <motion.p className="explorer-description" {...reveal(0.18)}>
                {court.description}
              </motion.p>
              <motion.div {...reveal(0.24)}>
                <Link href={court.href} className="button button-green">
                  Enter this court <ArrowIcon className="size-4" />
                </Link>
              </motion.div>
            </div>
            <div className="explorer-visual" aria-hidden="true">
              <motion.div
                className={`explorer-visual-image explorer-visual-image-${court.id}`}
                initial={reduceMotion ? false : { opacity: 0, scale: 1.08, filter: "blur(12px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                transition={{ duration: reduceMotion ? 0 : 0.75, ease: "easeOut" }}
              />
            </div>
          </motion.div>
        </AnimatePresence>
        <motion.div
          className="explorer-controls"
          initial={reduceMotion ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.4, delay: reduceMotion ? 0 : 0.2 }}
        >
          <motion.button
            type="button"
            className="explorer-arrow"
            onClick={showPrevious}
            aria-label="Previous court"
            whileHover={reduceMotion ? undefined : { scale: 1.08 }}
            whileTap={reduceMotion ? undefined : { scale: 0.92 }}
          >
            <ArrowIcon className="size-5 rotate-180" />
          </motion.button>
          <div className="explorer-dots" aria-label="Select a court">
            {courts.map((item, index) => (
              <motion.button
                key={item.id}
                type="button"
                aria-label={`Show ${item.name}`}
                aria-current={index === activeIndex ? "true" : undefined}
                className="explorer-dot"
                onClick={() => setActiveIndex(index)}
                whileHover={reduceMotion ? undefined : { scale: 1.18 }}
                whileTap={reduceMotion ? undefined : { scale: 0.88 }}
              />
            ))}
          </div>
          <motion.button
            type="button"
            className="explorer-arrow"
            onClick={showNext}
            aria-label="Next court"
            whileHover={reduceMotion ? undefined : { scale: 1.08 }}
            whileTap={reduceMotion ? undefined : { scale: 0.92 }}
          >
            <ArrowIcon className="size-5" />
          </motion.button>
        </motion.div>
        <p aria-live="polite" className="sr-only">
          {court.name}, court {activeIndex + 1} of {courts.length}
        </p>
      </section>
      <Footer />
    </main>
  );
}
