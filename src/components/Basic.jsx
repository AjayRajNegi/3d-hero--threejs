"use client";

import gsap from "gsap";
import * as THREE from "three";
import { ScrollTrigger } from "gsap/all";
import { useState, useEffect, useRef, use } from "react";
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

    camera.position.set(0, 110, 150);
    //camera.position.set(0, 0, 500);
    console.log("asdfsadfs", globeEl.current.getGlobeRadius());

    const lookAtPoint = camera.position.clone();
    lookAtPoint.z -= 100;
    camera.lookAt(lookAtPoint);

    camera.updateProjectionMatrix();

    if (controls) {
      controls.enabled = false;
    }

    //====================== Clouds ======================//
    const globe = globeEl.current;

    const CLOUDS_IMG_URL = "/earth/clouds.png";
    const CLOUDS_ALT = 0.006;
    const CLOUDS_ROTATION_SPEED = -0.02;

    new THREE.TextureLoader().load(CLOUDS_IMG_URL, (cloudsTexture) => {
      const clouds = new THREE.Mesh(
        new THREE.SphereGeometry(
          globe.getGlobeRadius() * (1 + CLOUDS_ALT),
          75,
          75
        ),
        new THREE.MeshPhongMaterial({ map: cloudsTexture, transparent: true })
      );
      globe.scene().add(clouds);

      (function rotateClouds() {
        clouds.rotation.y += (CLOUDS_ROTATION_SPEED * Math.PI) / 180;
        requestAnimationFrame(rotateClouds);
      })();
    });

    //====================== Animations ======================//
    gsap.registerPlugin(ScrollTrigger);
    // Hero section animation
    const heroTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".hero_pin",
        start: "top top",
        end: "+=80%",
        scrub: 3,
        pin: true,
        anticipatePin: 1,
      },
    });

    heroTimeline
      .to(".content", {
        filter: "blur(40px)",
        autoAlpha: 0,
        scale: 0.5,
        duration: 2,
        ease: "power1.inOut",
      })
      .to(
        camera.position,
        {
          x: 0,
          y: 0,
          z: 500,
          duration: 2,
          ease: "power1.inOut",
        },
        "<"
      );

    // Lines simulation animation
    const linesTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".after_hero",
        //start: "top 80%",
        //end: "bottom 40%",
        end: "bottom 40%",
        scrub: 3,
      },
    });

    linesTimeline
      .fromTo(
        ".lines-simulation",
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.5,
          ease: "power1.inOut",
        }
      )
      .to(".lines-simulation", {
        opacity: 1,
        duration: 0.5,
        ease: "power1.inOut",
      })
      .to(".lines-simulation", {
        opacity: 0,
        duration: 0.5,
        ease: "power1.inOut",
      });

    // Satellite and final camera animation
    const satelliteTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".last",
        start: "top 80%",
        end: "bottom 20%",
        scrub: 3,
      },
    });

    satelliteTimeline
      .fromTo(
        ".satellite",
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.5,
          ease: "power1.inOut",
        }
      )
      .to(
        camera.position,
        {
          x: -80,
          y: 80,
          z: 200,
          duration: 2,
          ease: "power1.inOut",
        },
        "<"
      )
      .to(".satellite", {
        opacity: 0,
        duration: 0.5,
      });

    // Scene rotation
    gsap.ticker.add((time) => {
      scene.rotation.y = time * 0.2;
    });
    gsap.ticker.lagSmoothing(0);
  };

  useEffect(() => {}, []);

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
      // arcLabel={(d) => `${d.airline}: ${d.srcIata} → ${d.dstIata}`}
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
