"use client";
import { useRef, useEffect, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  speed?: number;   // 0.0 = static, 0.15 = max recommended. Default: 0.10
}

/**
 * High-performance parallax using a single native rAF loop per instance.
 *
 * Design decisions:
 * ─────────────────
 * • No Framer Motion — eliminates the React render cycle from scroll handling
 * • IntersectionObserver gating — rAF loop is a no-op when off screen
 * • Early-exit on <0.4px scroll delta — skips identical frames
 * • willChange: "transform" — promotes to GPU compositor layer at mount
 * • translate3d(0,Xpx,0) — force hardware acceleration
 * • Mobile: speed halved automatically (iOS momentum scroll is sensitive)
 * • prefers-reduced-motion: disabled entirely
 */
export default function ParallaxSection({ children, speed = 0.10 }: Props) {
  const wrapRef  = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap  = wrapRef.current;
    const inner = innerRef.current;
    if (!wrap || !inner) return;

    // Respect reduced-motion preference
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;

    // Halve speed on mobile/touch for smoother feel
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const effectiveSpeed = isMobile ? speed * 0.5 : speed;

    // Only run when visible
    let visible = false;
    const io = new IntersectionObserver(
      ([e]) => { visible = e.isIntersecting; },
      { rootMargin: "25% 0px 25% 0px" }
    );
    io.observe(wrap);

    let raf    = 0;
    let lastSY = -9999;

    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!visible) return;

      const sy = window.scrollY;
      if (Math.abs(sy - lastSY) < 0.4) return;  // skip near-identical frames
      lastSY = sy;

      const rect   = wrap.getBoundingClientRect();
      const mid    = rect.top + rect.height * 0.5;
      const vhMid  = window.innerHeight * 0.5;
      const offset = ((mid - vhMid) * effectiveSpeed).toFixed(2);

      // translate3d keeps this on the compositor (no layout, no paint)
      inner.style.transform = `translate3d(0,${offset}px,0)`;
    };

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [speed]);

  return (
    <div ref={wrapRef} style={{ position: "relative" }}>
      <div
        ref={innerRef}
        style={{
          willChange: "transform",
          transform: "translate3d(0,0px,0)",  // initial GPU layer hint
        }}
      >
        {children}
      </div>
    </div>
  );
}
