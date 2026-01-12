"use client";

import initPlanet3D from "@/components/3D/planet";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    initPlanet3D();
  }, []);
  return (
    <div className="page">
      <section className="hero_main">
        <div className="content">
          <h1>Welcome To The New World</h1>
          <p>
            AI agents that actually bring value to businesses and elevate
            workers productivity.
          </p>

          <button className="cta_btn">Get started.</button>
        </div>
        <canvas className="planet-3D" />

        <div className="content2">
          <p>Meet our satellite constellation ATLAS !</p>
          <h1>Space-powered intelligence for tomorrow’s airspace.</h1>
        </div>
      </section>
    </div>
  );
}
