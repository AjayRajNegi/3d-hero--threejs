"use client";

import Basic from "../../components/Basic";

export default function Home() {
  return (
    <div className="page">
      {/* PINNED SCENE */}
      <div className="basic-canvas">
        <Basic />
      </div>
      {/* Absolute component blocks */}
      <div
        className="lines-simulation"
        style={{
          position: "fixed",
          zIndex: 4,
          top: "50%",
          left: "0%",
          backgroundColor: "red",
          text: "white",
          width: "50%",
          opacity: 0,
          display: "none",
        }}
      >
        <p>Meet our satellite constellation ATLAS !</p>
        <h1 style={{ fontSize: "55px" }}>
          Space-powered intelligence for tomorrow’s airspace.
        </h1>
      </div>
      <div
        className="satellite"
        style={{
          position: "fixed",
          zIndex: 4,
          top: "50%",
          left: "10%",
          backgroundColor: "skyblue",
          text: "white",
          width: "80%",
          margin: "auto",
          opacity: 1,
          display: "none",
          fontSize: "20px",
          padding: "10px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>Passengers Anually</div>
          <div>No. of flights</div>
        </div>
        <div style={{ textAlign: "center" }}>
          Annual passengers Scale: ~600 million
        </div>
      </div>

      {/* Screens */}

      <section className="hero_pin">
        <div className="content">
          <h1>Welcome To The New World</h1>
          <p>
            AI agents that actually bring value to businesses and elevate
            workers productivity.
          </p>
          <button className="cta_btn">Get started.</button>
        </div>
      </section>

      {/* NORMAL CONTENT AFTER 500vh */}
      <section className="after_hero">
        <div>
          <h2>Now we scroll normally</h2>
          <p>This is standard document flow.</p>
        </div>
      </section>
      <section className="last">
        <h2>Now we scroll normally</h2>
        <p>This is standard document flow.</p>
      </section>
    </div>
  );
}
