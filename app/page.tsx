import Background from "@/components/Background";
import Navbar from "@/components/sections/Navbar";
import Hero from "@/components/sections/Hero";
import UploadPredict from "@/components/sections/UploadPredict";
import Metrics from "@/components/sections/Metrics";
import ConfusionMatrix from "@/components/sections/ConfusionMatrix";
import ValidationRuns from "@/components/sections/ValidationRuns";
import ClassGallery from "@/components/sections/ClassGallery";
import ParallaxSection from "@/components/ParallaxSection";

export default function Home() {
  return (
    <>
      <Background />
      <Navbar />

      {/*
        paddingTop matches navbar height.
        Hero manages its own internal parallax.
        Content sections use native rAF parallax at gentle speeds.
        Alternating speeds (0.10 / 0.08) create subtle wave-like depth.
      */}
      <main style={{ paddingTop: 54 }}>
        <Hero />

        <ParallaxSection speed={0.10}>
          <UploadPredict />
        </ParallaxSection>

        <ParallaxSection speed={0.08}>
          <Metrics />
        </ParallaxSection>

        <ParallaxSection speed={0.12}>
          <ConfusionMatrix />
        </ParallaxSection>

        <ParallaxSection speed={0.08}>
          <ValidationRuns />
        </ParallaxSection>

        <ParallaxSection speed={0.07}>
          <ClassGallery />
        </ParallaxSection>
      </main>

      <footer style={{
        borderTop: "1px solid rgba(0,0,0,0.06)",
        padding: "18px 20px",
        paddingBottom: "calc(18px + env(safe-area-inset-bottom))",
        textAlign: "center",
      }}>
        <p style={{ fontSize: 11, color: "#94a3b8" }}>
          <strong style={{ color: "#374151", fontWeight: 600 }}>Visyra</strong>
          {" "}· CIFAR-10 CNN Classification ·{" "}
          <span style={{ color: "#7c3aed" }}>ICT 120 Final Project</span>
          {" "}· BSCS 3B
        </p>
      </footer>
    </>
  );
}
