"use client";
import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

/**
 * Staircase — static CSS, no JS scroll binding.
 * The visual depth comes from the layered opacity/size, not motion.
 * Keeping it still removes one whole animation pipeline.
 */
function Staircase() {
  const steps = [
    { w: "13%",  h: 235, top: "8%",  op: 0.68 },
    { w: "23%",  h: 205, top: "12%", op: 0.55 },
    { w: "35%",  h: 175, top: "16%", op: 0.45 },
    { w: "50%",  h: 145, top: "20%", op: 0.34 },
    { w: "67%",  h: 115, top: "24%", op: 0.23 },
    { w: "85%",  h: 88,  top: "28%", op: 0.13 },
    { w: "103%", h: 62,  top: "32%", op: 0.06 },
  ];

  return (
    <div style={{
      position: "absolute", inset: 0,
      display: "flex", alignItems: "center", justifyContent: "center",
      pointerEvents: "none", overflow: "hidden",
    }}>
      {steps.map((s, i) => (
        <motion.div key={i}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: s.op, y: 0 }}
          // Stagger entrance only — no ongoing scroll bind
          transition={{ duration: 0.9, delay: 0.05 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: "absolute",
            width: s.w, height: s.h, top: s.top,
            background: `linear-gradient(160deg,
              rgba(196,181,253,${0.64 - i * 0.07}) 0%,
              rgba(167,139,250,${0.38 - i * 0.04}) 55%,
              rgba(124,58,237,${0.13 - i * 0.015}) 100%)`,
            borderRadius: 26,
            // Subtle slow drift per-step via CSS — no JS scroll cost
            animation: `aurora-a ${22 + i * 5}s cubic-bezier(0.45,0.05,0.55,0.95) infinite`,
            animationDelay: `${-i * 3.5}s`,
            willChange: "transform",
          }}
        />
      ))}
    </div>
  );
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  /**
   * Use scrollY DIRECTLY — no useSpring intermediary.
   * useSpring was the main source of lag (150ms of intentional delay).
   * Direct transforms feel immediate and cinematic.
   */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Parallax layers — different rates create depth
  // Using scrollYProgress (0→1 over hero height) is cheaper than raw scrollY
  const contentY  = useTransform(scrollYProgress, [0, 1], ["0px", "120px"]);
  const contentOp = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
  const imageY    = useTransform(scrollYProgress, [0, 1], ["0px", "-50px"]);
  const imageS    = useTransform(scrollYProgress, [0, 0.85], [1, 0.88]);
  const stairY    = useTransform(scrollYProgress, [0, 1], ["0px", "70px"]);

  return (
    <section
      ref={sectionRef}
      style={{ position: "relative", minHeight: "100svh", overflow: "hidden" }}
    >
      {/* Staircase — parallax layer (moves slowest) */}
      <motion.div style={{
        position: "absolute", inset: 0, zIndex: 0,
        y: stairY, willChange: "transform",
      }}>
        <Staircase />
      </motion.div>

      {/* Content — moves fastest (creates max depth) */}
      <motion.div
        style={{ y: contentY, opacity: contentOp, willChange: "transform, opacity" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div style={{
          position: "relative", zIndex: 10,
          display: "flex", flexDirection: "column", alignItems: "center",
          textAlign: "center", padding: "clamp(56px,8vh,80px) 20px 40px",
        }}>

          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: "rgba(237,233,254,0.92)",
              border: "1px solid rgba(124,58,237,0.2)",
              borderRadius: 20, padding: "5px 14px", marginBottom: "clamp(28px,5vh,44px)",
              fontSize: 11, fontWeight: 700, color: "#6d28d9",
              letterSpacing: "0.07em", textTransform: "uppercase",
              WebkitBackdropFilter: "blur(8px)", backdropFilter: "blur(8px)",
            }}
          >
            <span className="anim-pulse-dot" style={{
              width: 6, height: 6, borderRadius: "50%", background: "#7c3aed", flexShrink: 0,
            }} />
            ICT 120 — Intelligent Systems
          </motion.div>

          {/* Hero image — moves at its own intermediate rate */}
          <motion.div
            initial={{ opacity: 0, scale: 0.82 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            style={{
              y: imageY, scale: imageS,
              position: "relative",
              marginBottom: "clamp(28px,5vh,44px)",
              willChange: "transform",
            }}
          >
            {/* Ambient glow behind image */}
            <div style={{
              position: "absolute", top: "50%", left: "50%",
              transform: "translate(-50%,-50%)",
              width: "145%", height: "135%",
              borderRadius: "50%",
              background: "radial-gradient(ellipse, rgba(124,58,237,0.30) 0%, rgba(192,38,211,0.14) 35%, transparent 68%)",
              filter: "blur(28px)",
              pointerEvents: "none",
            }} />

            {/* Orbit ring — slow CW */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
              style={{
                position: "absolute", inset: -20, borderRadius: "50%",
                border: "1.5px solid transparent",
                borderTopColor: "rgba(124,58,237,0.48)",
                borderRightColor: "rgba(196,181,253,0.18)",
                willChange: "transform",
              }}
            />
            {/* Counter ring — slow CCW, dashed */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 36, repeat: Infinity, ease: "linear" }}
              style={{
                position: "absolute", inset: -33, borderRadius: "50%",
                border: "1px dashed rgba(192,38,211,0.16)",
                willChange: "transform",
              }}
            />

            {/* The image — floats via pure CSS (no JS overhead) */}
            <div className="anim-float" style={{ position: "relative", willChange: "transform" }}>
              <Image
                src="/visyra.png"
                alt="Visyra neural classification"
                width={256}
                height={171}
                style={{
                  objectFit: "contain",
                  filter: "drop-shadow(0 28px 52px rgba(91,33,182,0.58)) drop-shadow(0 8px 18px rgba(192,38,211,0.26))",
                }}
                priority
              />
            </div>
          </motion.div>

          {/* Flanking text — TARS two-column layout */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1px 1fr",
            gap: "0 32px",
            alignItems: "start",
            width: "100%", maxWidth: 800,
            marginBottom: 34,
            textAlign: "left",
          }}
            className="max-sm:flex max-sm:flex-col max-sm:text-center max-sm:items-center"
          >
            {/* Left */}
            <motion.div
              initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.38, ease: [0.22, 1, 0.36, 1] }}
            >
              <h1 style={{
                fontSize: "clamp(1.75rem, 3.3vw, 2.55rem)",
                fontWeight: 800, lineHeight: 1.09,
                letterSpacing: "-0.03em", color: "#09090e",
                fontFamily: "-apple-system,'SF Pro Display','Inter',system-ui,sans-serif",
              }}>
                Image Classification<br />with CIFAR-10
              </h1>
              <p style={{
                marginTop: 11, fontSize: 13.5, lineHeight: 1.68,
                color: "#64748b", maxWidth: 268,
              }}>
                A project for{" "}
                <strong style={{ color: "#09090e", fontWeight: 600 }}>
                  ICT 120 — Intelligent Systems
                </strong>
                , a Convolutional Neural Network trained on 60,000 images across 10 object classes.
              </p>
            </motion.div>

            {/* Divider */}
            <div className="hide-mobile"
              style={{ background: "rgba(0,0,0,0.07)", alignSelf: "stretch", minHeight: 88 }} />

            {/* Right specs */}
            <motion.div
              initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.44, ease: [0.22, 1, 0.36, 1] }}
              style={{ display: "flex", flexDirection: "column", gap: 15 }}
              className="max-sm:items-center max-sm:mt-5"
            >
              {[
                { label: "Architecture", val: "Conv2D → MaxPool → Dense" },
                { label: "Dataset",      val: "CIFAR-10 · 60,000 images"  },
                { label: "Test Accuracy",val: "78.4%"                     },
                { label: "Inference",    val: "~12 ms / image"            },
              ].map(({ label, val }) => (
                <div key={label}>
                  <div style={{
                    fontSize: 10, fontWeight: 700, color: "#94a3b8",
                    textTransform: "uppercase", letterSpacing: "0.1em",
                  }}>{label}</div>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: "#09090e", marginTop: 2 }}>
                    {val}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.56, ease: [0.22, 1, 0.36, 1] }}
            style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", justifyContent: "center" }}
          >
            <a
              href="#predict"
              style={{
                display: "inline-flex", alignItems: "center", gap: 7,
                background: "#09090e", color: "white",
                fontSize: 13, fontWeight: 700,
                padding: "11px 22px", borderRadius: 22,
                textDecoration: "none",
                boxShadow: "0 4px 20px rgba(0,0,0,0.20)",
                transition: "transform 0.12s cubic-bezier(0.22,1,0.36,1), box-shadow 0.12s ease",
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = "translateY(-2px)";
                el.style.boxShadow = "0 8px 28px rgba(0,0,0,0.26)";
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = "translateY(0)";
                el.style.boxShadow = "0 4px 20px rgba(0,0,0,0.20)";
              }}
            >
              Try a Prediction <ArrowRight size={13} />
            </a>
            <a
              href="#metrics"
              style={{
                display: "inline-flex", alignItems: "center",
                color: "#64748b", fontSize: 13, fontWeight: 500,
                textDecoration: "none",
                transition: "color 0.1s ease",
              }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "#09090e"}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "#64748b"}
            >
              View results →
            </a>
          </motion.div>

          {/* Scroll cue */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 1.0 }}
            style={{
              display: "flex", flexDirection: "column", alignItems: "center",
              gap: 5, marginTop: "clamp(28px,4vh,40px)",
            }}
          >
            <span style={{
              fontSize: 10, color: "#94a3b8",
              letterSpacing: "0.2em", textTransform: "uppercase",
            }}>Scroll</span>
            <div style={{
              width: 1, height: 26,
              background: "linear-gradient(to bottom, rgba(124,58,237,0.5), transparent)",
            }} />
          </motion.div>

        </div>
      </motion.div>
    </section>
  );
}
