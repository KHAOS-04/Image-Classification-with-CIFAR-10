"use client";
import { useEffect, useRef } from "react";

/**
 * Premium interactive background:
 *  1. Three CSS-animated aurora orbs (GPU only, no JS)
 *  2. Mouse-reactive cursor glow (single rAF loop, lerp smoothing)
 *  3. Neural particle canvas (separate rAF, throttled, pauses off-tab)
 *
 * All animation runs on the compositor thread via transform/opacity.
 * No layout or paint triggered after mount.
 */
export default function Background() {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const glowRef    = useRef<HTMLDivElement>(null);
  const mouse      = useRef({ x: 0.5, y: 0.5 });
  const target     = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    /* ── 1. Cursor glow ─────────────────────────────────────────── */
    const onMove = (e: MouseEvent) => {
      target.current.x = e.clientX / window.innerWidth;
      target.current.y = e.clientY / window.innerHeight;
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    let glowRaf: number;
    const LERP = 0.072;  // smoothing factor: higher = snappier

    const tickGlow = () => {
      glowRaf = requestAnimationFrame(tickGlow);
      const m = mouse.current;
      const t = target.current;
      // Early-exit when barely moving — skip unnecessary style writes
      const dx = t.x - m.x, dy = t.y - m.y;
      if (Math.abs(dx) < 0.0005 && Math.abs(dy) < 0.0005) return;
      m.x += dx * LERP;
      m.y += dy * LERP;
      const el = glowRef.current;
      if (el) {
        // Use translate3d to stay on compositor
        el.style.transform = `translate3d(${(m.x * 100 - 50).toFixed(2)}%, ${(m.y * 100 - 50).toFixed(2)}%, 0)`;
      }
    };
    glowRaf = requestAnimationFrame(tickGlow);

    /* ── 2. Neural particle canvas ──────────────────────────────── */
    const canvas = canvasRef.current;
    const ctx    = canvas?.getContext("2d", { alpha: true });
    if (!canvas || !ctx) return;

    const isMobile  = window.innerWidth < 768;
    const isLowEnd  = navigator.hardwareConcurrency <= 2;
    const N = isMobile || isLowEnd ? 18 : 44;
    const DIST = isMobile ? 100 : 120;

    type P = { x: number; y: number; vx: number; vy: number; a: number; r: number };

    let W = 0, H = 0;
    const resize = () => {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });

    const pts: P[] = Array.from({ length: N }, () => ({
      x:  Math.random() * window.innerWidth,
      y:  Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.20,
      vy: (Math.random() - 0.5) * 0.20,
      a:  Math.random() * 0.14 + 0.04,
      r:  Math.random() * 1.4 + 0.4,
    }));

    let canvasRaf: number;
    let lastFrame = 0;
    const FPS_CAP = isMobile ? 30 : 60;
    const FRAME_MS = 1000 / FPS_CAP;

    const drawCanvas = (ts: number) => {
      canvasRaf = requestAnimationFrame(drawCanvas);
      if (!visRef.current) return;  // pause when off-screen
      if (ts - lastFrame < FRAME_MS) return;  // frame rate cap
      lastFrame = ts;

      ctx.clearRect(0, 0, W, H);

      // Connections — only draw if not mobile
      if (!isMobile) {
        for (let i = 0; i < N; i++) {
          for (let j = i + 1; j < N; j++) {
            const dx = pts[i].x - pts[j].x;
            const dy = pts[i].y - pts[j].y;
            const d2 = dx * dx + dy * dy;
            if (d2 < DIST * DIST) {
              const d = Math.sqrt(d2);
              ctx.beginPath();
              ctx.strokeStyle = `rgba(124,58,237,${(0.034 * (1 - d / DIST)).toFixed(3)})`;
              ctx.lineWidth = 0.55;
              ctx.moveTo(pts[i].x, pts[i].y);
              ctx.lineTo(pts[j].x, pts[j].y);
              ctx.stroke();
            }
          }
        }
      }

      // Dots
      for (const p of pts) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; else if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; else if (p.y > H) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(124,58,237,${p.a})`;
        ctx.fill();
      }
    };

    // Intersection observer — pause canvas when not visible
    const visRef = { current: true };
    const io = new IntersectionObserver(([e]) => { visRef.current = e.isIntersecting; });
    io.observe(canvas);

    canvasRaf = requestAnimationFrame(drawCanvas);

    // Pause on hidden tab
    const onVis = () => {
      if (document.hidden) {
        cancelAnimationFrame(canvasRaf);
        cancelAnimationFrame(glowRaf);
      } else {
        canvasRaf = requestAnimationFrame(drawCanvas);
        glowRaf   = requestAnimationFrame(tickGlow);
      }
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      cancelAnimationFrame(canvasRaf);
      cancelAnimationFrame(glowRaf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("visibilitychange", onVis);
      io.disconnect();
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -10,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      {/* ── Base ── */}
      <div style={{ position: "absolute", inset: 0, background: "#f7f7f9" }} />

      {/* ── Mesh gradient overlay ── */}
      <div style={{
        position: "absolute", inset: 0,
        background: [
          "radial-gradient(ellipse 80% 50% at 50% -8%, rgba(196,181,253,0.42) 0%, transparent 65%)",
          "radial-gradient(ellipse 40% 30% at 85% 92%, rgba(192,38,211,0.07) 0%, transparent 60%)",
          "radial-gradient(ellipse 36% 28% at 8% 72%,  rgba(79,70,229,0.06) 0%, transparent 58%)",
        ].join(", "),
        pointerEvents: "none",
      }} />

      {/* ── Aurora blobs — CSS animated, zero JS cost ── */}
      {/* Top-left violet */}
      <div className="bg-aurora-a" style={{
        position: "absolute",
        top: "-18%", left: "-8%",
        width: "70vw", height: "70vw",
        borderRadius: "50%",
        background: "radial-gradient(ellipse, rgba(167,139,250,0.46) 0%, rgba(124,58,237,0.22) 30%, transparent 68%)",
        filter: "blur(60px)",
        willChange: "transform",
      }} />

      {/* Bottom-right magenta */}
      <div className="bg-aurora-b" style={{
        position: "absolute",
        bottom: "-14%", right: "-8%",
        width: "58vw", height: "58vw",
        borderRadius: "50%",
        background: "radial-gradient(ellipse, rgba(192,38,211,0.10) 0%, rgba(139,92,246,0.06) 35%, transparent 66%)",
        filter: "blur(72px)",
        willChange: "transform",
      }} />

      {/* Mid blue-violet */}
      <div className="bg-aurora-c" style={{
        position: "absolute",
        top: "38%", left: "55%",
        width: "44vw", height: "44vw",
        borderRadius: "50%",
        background: "radial-gradient(ellipse, rgba(79,70,229,0.07) 0%, transparent 65%)",
        filter: "blur(80px)",
        willChange: "transform",
      }} />

      {/* ── Cursor-reactive glow — JS lerp ── */}
      <div
        ref={glowRef}
        style={{
          position: "absolute",
          top: "50%", left: "50%",
          width: "52vw", height: "52vw",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(124,58,237,0.065) 0%, rgba(139,92,246,0.035) 45%, transparent 70%)",
          filter: "blur(56px)",
          transform: "translate3d(-50%, -50%, 0)",
          willChange: "transform",
        }}
      />

      {/* ── Neural particle canvas ── */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.5,
          mixBlendMode: "multiply",
        }}
      />
    </div>
  );
}
