"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";

export default function Footer() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.footer
      className="site-footer"
      initial={reduceMotion ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: reduceMotion ? 0 : 0.45, ease: "easeOut" }}
    >
      <motion.span
        className="footer-rule"
        aria-hidden="true"
        initial={reduceMotion ? false : { scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: false }}
        transition={{ duration: reduceMotion ? 0 : 0.8, ease: "easeOut" }}
      />
      <Link href="/" className="footer-brand">The AI <strong>Courtroom</strong></Link>
      <nav className="footer-links" aria-label="Footer navigation">
        <Link href="/#courts">Explore courts</Link>
        <Link href="/information">Information</Link>
        <Link href="/games">All games</Link>
        <Link href="/profile">Dashboard</Link>
      </nav>
    </motion.footer>
  );
}
