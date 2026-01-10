"use client";
import initPlanet3D from "@/components/3D/planet";
import WorldGlobe from "@/components/WorldGlobe";
import { useEffect } from "react";
import Globe from "../components/Globe";

export default function Home() {
  useEffect(() => {
    // initPlanet3D();
    //initAirplane3D();
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
        {/* <canvas className="planet-3D" /> */}
        <div className="planet-3D">
          <Globe />
        </div>
      </section>
    </div>
  );
}
