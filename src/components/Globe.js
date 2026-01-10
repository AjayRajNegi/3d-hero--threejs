"use client";
import React from "react";
import * as d3 from "d3-dsv";
import indexBy from "index-array-by";
import earth from "../../public/earth/day.jpg";
import dynamic from "next/dynamic";

const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });

function GlobeHome() {
  const { useState, useEffect, useRef } = React;
  const globeEl = useRef();

  const [airports, setAirports] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const COUNTRY = "United States";
  const OPACITY = 0.125;

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (globeEl.current) {
      globeEl.current.pointOfView({
        lat: 0,
        lng: 0,
        altitude: 2.5,
      });
    }
  }, []);

  useEffect(() => {
    Promise.all([
      fetch(
        "https://raw.githubusercontent.com/jpatokal/openflights/master/data/airports.dat"
      )
        .then((res) => res.text())
        .then((d) =>
          d3.csvParseRows(
            d,
            ([
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
            })
          )
        ),
      fetch(
        "https://raw.githubusercontent.com/jpatokal/openflights/master/data/routes.dat"
      )
        .then((res) => res.text())
        .then((d) =>
          d3.csvParseRows(
            d,
            ([
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
            })
          )
        ),
    ]).then(([airports, routes]) => {
      const byIata = indexBy(airports, "iata", false);

      const filteredRoutes = routes
        .filter(
          (d) => byIata[d.srcIata] && byIata[d.dstIata] && d.stops === "0"
        )
        .map((d) => ({
          ...d,
          srcAirport: byIata[d.srcIata],
          dstAirport: byIata[d.dstIata],
        }))
        .filter(
          (d) =>
            d.srcAirport.country === COUNTRY && d.dstAirport.country !== COUNTRY
        );

      setAirports(airports);
      setRoutes(filteredRoutes);
    });
  }, []);

  if (!dimensions.width || !dimensions.height) return null;

  return (
    <Globe
      ref={globeEl}
      width={dimensions.width}
      height={dimensions.height}
      globeImageUrl={earth.src}
      camera={{
        fov: 15,
        near: 0.1,
        far: 10000,
      }}
      enablePointerInteraction={false}
      arcsData={routes}
      arcStartLat={(d) => +d.srcAirport.lat}
      arcStartLng={(d) => +d.srcAirport.lng}
      arcEndLat={(d) => +d.dstAirport.lat}
      arcEndLng={(d) => +d.dstAirport.lng}
      arcDashLength={0.25}
      arcDashGap={1}
      arcDashInitialGap={() => Math.random()}
      arcDashAnimateTime={4000}
      arcColor={() => [
        `rgba(48, 64, 77, ${OPACITY})`,
        `rgba(191, 204, 214, ${OPACITY})`,
      ]}
      arcsTransitionDuration={0}
      pointsData={airports}
      pointColor={() => "white"}
      pointAltitude={0}
      pointRadius={0.03}
      pointsMerge
    />
  );
}

export default GlobeHome;
