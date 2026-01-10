"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { csvParseRows } from "d3-dsv";
// import indexBy from "index-array-by";

// IMPORTANT: disable SSR for react-globe.gl
const Globe = dynamic(() => import("react-globe.gl"), {
  ssr: false,
});

const COUNTRY = "United States";
const OPACITY = 0.22;

/* ------------------ Types ------------------ */

interface Airport {
  airportId: string;
  name: string;
  city: string;
  country: string;
  iata: string;
  icao: string;
  lat: string;
  lng: string;
}

interface Route {
  airline: string;
  airlineId: string;
  srcIata: string;
  srcAirportId: string;
  dstIata: string;
  dstAirportId: string;
  stops: string;
  srcAirport?: Airport;
  dstAirport?: Airport;
}

/* ------------------ Parsers ------------------ */

const airportParse = (row: string[]): Airport => {
  const [airportId, name, city, country, iata, icao, lat, lng] = row;

  return {
    airportId,
    name,
    city,
    country,
    iata,
    icao,
    lat,
    lng,
  };
};

const routeParse = (row: string[]): Route => {
  const [
    airline,
    airlineId,
    srcIata,
    srcAirportId,
    dstIata,
    dstAirportId,
    ,
    stops,
  ] = row;

  return {
    airline,
    airlineId,
    srcIata,
    srcAirportId,
    dstIata,
    dstAirportId,
    stops,
  };
};

/* ------------------ Component ------------------ */

export default function WorldGlobe() {
  const globeRef = useRef<any>(null);
  const [airports, setAirports] = useState<Airport[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);

  const byIata = new Map<string, Airport>();

  useEffect(() => {
    Promise.all([
      fetch(
        "https://raw.githubusercontent.com/jpatokal/openflights/master/data/airports.dat"
      )
        .then((res) => res.text())
        .then((text) => csvParseRows(text, airportParse)),

      fetch(
        "https://raw.githubusercontent.com/jpatokal/openflights/master/data/routes.dat"
      )
        .then((res) => res.text())
        .then((text) => csvParseRows(text, routeParse)),
    ]).then(([airportsData, routesData]) => {
      airportsData.forEach((a) => {
        if (a.iata) {
          byIata.set(a.iata, a);
        }
      });

      const filteredRoutes = routesData
        .filter((r) => byIata.has(r.srcIata) && byIata.has(r.dstIata))
        .filter((r) => r.stops === "0")
        .map((r) => ({
          ...r,
          srcAirport: byIata.get(r.srcIata)!,
          dstAirport: byIata.get(r.dstIata)!,
        }))
        .filter(
          (r) =>
            r.srcAirport.country === COUNTRY && r.dstAirport.country !== COUNTRY
        );

      setAirports(airportsData);
      setRoutes(filteredRoutes);
    });
  }, []);

  useEffect(() => {
    if (!globeRef.current) return;

    globeRef.current.pointOfView({
      lat: 39.6,
      lng: -98.5,
      altitude: 2,
    });
  }, []);

  return (
    <div className="w-full h-full">
      <Globe<Route>
        ref={globeRef}
        globeImageUrl="//cdn.jsdelivr.net/npm/three-globe/example/img/earth-night.jpg"
        arcsData={routes}
        arcStartLat={(d) => +d.srcAirport!.lat}
        arcStartLng={(d) => +d.srcAirport!.lng}
        arcEndLat={(d) => +d.dstAirport!.lat}
        arcEndLng={(d) => +d.dstAirport!.lng}
        arcDashLength={0.25}
        arcDashGap={1}
        arcDashInitialGap={() => Math.random()}
        arcDashAnimateTime={4000}
        arcColor={() => [
          `rgba(0, 255, 0, ${OPACITY})`,
          `rgba(255, 0, 0, ${OPACITY})`,
        ]}
        arcsTransitionDuration={0}
        pointsData={airports}
        pointColor={() => "orange"}
        pointAltitude={0}
        pointRadius={0.02}
        pointsMerge
      />
    </div>
  );
}
