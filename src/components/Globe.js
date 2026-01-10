"use client";
import React from "react";
import * as d3 from "d3-dsv";
import indexBy from "index-array-by";
import earth from "../../public/earth/day.jpg";
import dynamic from "next/dynamic";
import { div } from "three/tsl";

const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });

// import background from "";

function GlobeHome() {
  const { useState, useEffect, useRef } = React;
  const globeEl = useRef();
  const [airports, setAirports] = useState([]);
  const [routes, setRoutes] = useState([]);

  const COUNTRY = "United States";
  const OPACITY = 0.125;
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

  useEffect(() => {
    Promise.all([
      fetch(
        "https://raw.githubusercontent.com/jpatokal/openflights/master/data/airports.dat"
      )
        .then((res) => res.text())
        .then((d) => d3.csvParseRows(d, airportParse)),
      fetch(
        "https://raw.githubusercontent.com/jpatokal/openflights/master/data/routes.dat"
      )
        .then((res) => res.text())
        .then((d) => d3.csvParseRows(d, routeParse)),
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

  //   useEffect(() => {
  //     globeEl.current.pointOfView({ lat: 42, lng: -71, altitude: 2 });
  //   }, []);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Globe
        ref={globeEl}
        width={1000}
        height={1000}
        showGlobe={true}
        globeImageUrl={earth.src}
        //   backgroundImageUrl={background}
        arcsData={routes}
        arcStartLat={(d) => +d.srcAirport.lat}
        arcStartLng={(d) => +d.srcAirport.lng}
        arcEndLat={(d) => +d.dstAirport.lat}
        arcEndLng={(d) => +d.dstAirport.lng}
        arcDashLength={0.25}
        arcDashGap={1}
        arcDashInitialGap={() => Math.random()}
        arcDashAnimateTime={4000}
        arcColor={(d) => [
          `rgba(48, 64, 77, ${OPACITY})`,
          `rgba(191, 204, 214, ${OPACITY})`,
        ]}
        arcsTransitionDuration={0}
        pointsData={airports}
        pointColor={() => "white"}
        pointAltitude={0}
        pointRadius={0.03}
        pointsMerge={true}
      />
    </div>
  );
}

export default GlobeHome;
