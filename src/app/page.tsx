"use client";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    // initPlanet3D();
  }, []);
  return (
    <div className="page">
      <section className="hero-main">
        <canvas className="planet-3D" />
      </section>
    </div>
  );
}
