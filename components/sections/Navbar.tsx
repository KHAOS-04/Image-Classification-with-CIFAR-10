"use client";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const links = [
  { label: "Predict",    href: "#predict"    },
  { label: "Metrics",    href: "#metrics"    },
  { label: "Matrix",     href: "#matrix"     },
  { label: "Validation", href: "#validation" },
  { label: "Classes",    href: "#classes"    },
];

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Use scroll position to toggle a CSS class — no Framer Motion scroll listener
    const onScroll = () => {
      const el = navRef.current;
      if (!el) return;
      if (window.scrollY > 20) {
        el.style.boxShadow = "0 2px 20px rgba(0,0,0,0.07)";
      } else {
        el.style.boxShadow = "none";
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      ref={navRef}
      initial={{ opacity: 0, y: -14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.44, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0,
        zIndex: 100,
        background: "rgba(247,247,249,0.90)",
        WebkitBackdropFilter: "blur(18px) saturate(1.5)",
        backdropFilter: "blur(18px) saturate(1.5)",
        borderBottom: "1px solid rgba(0,0,0,0.06)",
        boxShadow: "none",
        paddingTop: "env(safe-area-inset-top)",
        /* Transition only composited props */
        transition: "box-shadow 0.25s ease",
        willChange: "auto",
      }}
    >
      <div style={{
        maxWidth: 1080, margin: "0 auto",
        padding: "0 20px", height: 54,
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
      }}>
        {/* Logo */}
        <a href="#" style={{ display: "flex", alignItems: "center", gap: 9, textDecoration: "none", flexShrink: 0 }}>
          <div style={{
            width: 40, height: 30, borderRadius: 8, overflow: "hidden", flexShrink: 0,
            boxShadow: "0 2px 8px rgba(124,58,237,0.28)",
          }}>
            <Image
              src="/visyra.png" alt="Visyra"
              width={30} height={30}
              style={{ objectFit: "cover", width: "100%", height: "100%" }}
              priority
            />
          </div>
          <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: "-0.025em", color: "#09090e" }}>
            Visyra
          </span>
        </a>

        {/* Links */}
        <nav className="hide-mobile" style={{ display: "flex", alignItems: "center", gap: 2 }}>
          {links.map(l => (
            <a key={l.label} href={l.href} style={{
              fontSize: 13, fontWeight: 500, color: "#64748b",
              padding: "5px 13px", borderRadius: 8, textDecoration: "none",
              transition: "color 0.1s, background-color 0.1s",
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.color = "#09090e";
              el.style.backgroundColor = "rgba(0,0,0,0.04)";
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.color = "#64748b";
              el.style.backgroundColor = "transparent";
            }}>
              {l.label}
            </a>
          ))}
        </nav>

        {/* Badge */}
        <div className="hide-mobile" style={{
          fontSize: 11, fontWeight: 700, color: "#7c3aed",
          background: "rgba(237,233,254,0.92)", borderRadius: 20,
          padding: "4px 12px", letterSpacing: "0.04em", flexShrink: 0,
          border: "1px solid rgba(124,58,237,0.12)",
        }}>
          ICT 120 · BSCS 3B
        </div>
      </div>
    </motion.header>
  );
}
