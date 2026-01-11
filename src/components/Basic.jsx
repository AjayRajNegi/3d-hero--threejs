"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { useState, useEffect, useRef } from "react";
import indexBy from "index-array-by";
import { csvParseRows } from "d3-dsv";
import dynamic from "next/dynamic";

const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });

const COUNTRY = "United States";
const OPACITY = 0.1;

const airportParse = ([
  airportId,
  name,
  city,
  country,
  iata,
  icao,
  lat,
  lng,
  alt,
  timezone,
  dst,
  tz,
  type,
  source,
]) => ({
  airportId,
  name,
  city,
  country,
  iata,
  icao,
  lat,
  lng,
  alt,
  timezone,
  dst,
  tz,
  type,
  source,
});

const routeParse = ([
  airline,
  airlineId,
  srcIata,
  srcAirportId,
  dstIata,
  dstAirportId,
  codeshare,
  stops,
  equipment,
]) => ({
  airline,
  airlineId,
  srcIata,
  srcAirportId,
  dstIata,
  dstAirportId,
  codeshare,
  stops,
  equipment,
});

export default function Basic() {
  const globeEl = useRef();
  const [airports, setAirports] = useState([]);
  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    // load data
    Promise.all([
      fetch(
        "https://raw.githubusercontent.com/jpatokal/openflights/master/data/airports.dat"
      )
        .then((res) => res.text())
        .then((d) => csvParseRows(d, airportParse)),
      fetch(
        "https://raw.githubusercontent.com/jpatokal/openflights/master/data/routes.dat"
      )
        .then((res) => res.text())
        .then((d) => csvParseRows(d, routeParse)),
    ]).then(([airports, routes]) => {
      const byIata = indexBy(airports, "iata", false);

      const filteredRoutes = routes
        .filter(
          (d) =>
            byIata.hasOwnProperty(d.srcIata) && byIata.hasOwnProperty(d.dstIata)
        )
        .filter((d) => d.stops === "0")
        .map((d) =>
          Object.assign(d, {
            srcAirport: byIata[d.srcIata],
            dstAirport: byIata[d.dstIata],
          })
        )
        .filter(
          (d) =>
            d.srcAirport.country === COUNTRY && d.dstAirport.country !== COUNTRY
        );

      setAirports(airports);
      setRoutes(filteredRoutes);
    });
  }, []);

  const handleGlobeReady = () => {
    if (!globeEl.current) return;

    const camera = globeEl.current.camera();
    const controls = globeEl.current.controls();
    const scene = globeEl.current.scene();

    const size = {
      width: window.innerWidth,
      height: window.innerHeight,
      pixelRatio: window.devicePixelRatio,
    };

    camera.fov = 30;
    camera.near = 0.1;
    camera.far = 10000;
    camera.aspect = size.width / size.height;

    camera.position.set(0, 100, 200);
    //camera.position.set(0, 0, 500);

    const lookAtPoint = camera.position.clone();
    lookAtPoint.z -= 100; // Look 100 units in front along -Z axis
    camera.lookAt(lookAtPoint);

    camera.updateProjectionMatrix();

    if (controls) {
      controls.enabled = false;
    }
    // let animationId;
    // const animate = () => {
    //   if (scene) {
    //     scene.rotation.y += 0.001; // Auto-rotate the globe
    //   }

    //   animationId = requestAnimationFrame(animate);
    // };
    // animate();
    // return () => {
    //   if (animationId) cancelAnimationFrame(animationId);
    // };

    // Animations
    gsap.registerPlugin(ScrollTrigger);

    gsap
      .timeline({
        scrollTrigger: {
          trigger: ".hero_main",
          start: () => "top top",
          scrub: 3,
          anticipatePin: 1,
          pin: true,
        },
      })
      .to(
        ".hero_main .content",
        {
          filter: `blur(40px)`,
          autoAlpha: 0,
          scale: 0.5,
          duration: 2,
          ease: "power1.inOut",
        },
        "setting"
      )
      .to(
        camera.position,
        {
          x: 0,
          y: window.innerWidth > 768 ? 0 : 0,
          z: window.innerWidth > 768 ? 500 : 500,
          duration: 2,
          ease: "power1.inOut",
        },
        "setting"
      );

    gsap.ticker.add((time) => {
      scene.rotation.y = time * 0.2;
    });
    gsap.ticker.lagSmoothing(0);
  };

  return (
    <Globe
      ref={globeEl}
      globeImageUrl="/earth/day.jpg"
      showAtmosphere={true}
      backgroundColor="rgba(0,0,0,0)"
      rendererConfig={{
        antialias: true,
        alpha: true,
      }}
      onGlobeReady={handleGlobeReady}
      arcsData={routes}
      arcLabel={(d) => `${d.airline}: ${d.srcIata} → ${d.dstIata}`}
      arcStartLat={(d) => +d.srcAirport.lat}
      arcStartLng={(d) => +d.srcAirport.lng}
      arcEndLat={(d) => +d.dstAirport.lat}
      arcEndLng={(d) => +d.dstAirport.lng}
      arcDashLength={0}
      arcDashGap={1}
      arcDashInitialGap={() => Math.random()}
      arcDashAnimateTime={4000}
      arcsTransitionDuration={0}
      arcStroke={null}
      arcColor={() => "#88602333"}
      pointsData={airports}
      pointColor={() => "orange"}
      pointAltitude={0}
      pointRadius={0.02}
      pointsMerge={true}
    />
  );
}
