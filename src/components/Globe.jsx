"use client";

import React, { useState, useEffect, useRef } from "react";
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

export const Globe1 = () => {
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
        ) // exclude unknown airports
        .filter((d) => d.stops === "0") // non-stop flights only
        .map((d) =>
          Object.assign(d, {
            srcAirport: byIata[d.srcIata],
            dstAirport: byIata[d.dstIata],
          })
        )
        .filter(
          (d) =>
            d.srcAirport.country === COUNTRY && d.dstAirport.country !== COUNTRY
        ); // international routes from country

      setAirports(airports);
      setRoutes(filteredRoutes);
    });
  }, []);

  const handleGlobeReady = () => {
    if (!globeEl.current) return;

    const size = {
      width: window.innerWidth,
      height: window.innerHeight,
      pixelRatio: window.devicePixelRatio,
    };

    const camera = globeEl.current.camera();
    const controls = globeEl.current.controls();

    // --- Camera (MATCHES Three.js SCENE) ---
    camera.fov = 15;
    camera.near = 0.1;
    camera.far = 10000;
    camera.pixelRatio = size.width / size.height;

    globeEl.current.pointOfView({ lat: 0, lng: 0, altitude: 10 });
    camera.position.set(
      0, // x
      1.075, // y (scaled from 2.15)
      800.25 // z (scaled from 4.5)
    );

    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();

    // --- Controls (match static camera feel) ---
    if (controls) {
      controls.enableZoom = true;
      controls.enablePan = false;
      controls.enableRotate = false;
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.2;
      controls.update();
    }
  };

  return (
    <Globe
      size={0.5}
      ref={globeEl}
      globeImageUrl="/earth/day.jpg"
      bumpImageUrl="/earth/specularClouds.jpg"
      showAtmosphere={false}
      backgroundColor="rgba(0,0,0,0)"
      rendererConfig={{
        antialias: true,
        alpha: true,
      }}
      onGlobeReady={handleGlobeReady}
      arcsData={routes}
      arcLabel={(d) => `${d.airline}: ${d.srcIata} &#8594; ${d.dstIata}`}
      arcStartLat={(d) => +d.srcAirport.lat}
      arcStartLng={(d) => +d.srcAirport.lng}
      arcEndLat={(d) => +d.dstAirport.lat}
      arcEndLng={(d) => +d.dstAirport.lng}
      arcDashLength={0.5}
      arcDashGap={1}
      arcDashInitialGap={() => Math.random()}
      arcDashAnimateTime={4000}
      // arcColor={d => [`rgba(0, 255, 0, ${OPACITY})`, `rgba(255, 0, 0, ${OPACITY})`]}
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
};
