import Globe from "react-globe.gl";
import { csvParseRows } from "d3-dsv";
import indexBy from "index-array-by";
import { useRef, useState, useEffect } from "react";

/* -------------------- Types -------------------- */

interface Airport {
  airportId: string;
  name: string;
  city: string;
  country: string;
  iata: string;
  icao: string;
  lat: string;
  lng: string;
  alt: string;
  timezone: string;
  dst: string;
  tz: string;
  type: string;
  source: string;
}

interface Route {
  airline: string;
  airlineId: string;
  srcIata: string;
  srcAirportId: string;
  dstIata: string;
  dstAirportId: string;
  codeshare: string;
  stops: string;
  equipment: string;
  srcAirport?: Airport;
  dstAirport?: Airport;
}

/* -------------------- Main Function -------------------- */

// const initAirplane3D = (): void => {
//   const COUNTRY = "India";
//   const OPACITY = 0.22;

//   const globeContainer = document.getElementById("globeViz");
//   if (!globeContainer) {
//     console.warn("globeViz container not found");
//     return;
//   }

//   const myGlobe = new Globe(globeContainer)
//     .globeImageUrl("/public/earth/day.jpg")
//     .pointOfView({ lat: 22.9734, lng: 78.6569, altitude: 2 })
//     .arcLabel((d: any) => {
//       const route = d as Route;
//       return `${route.airline}: ${route.srcIata} → ${route.dstIata}`;
//     })

//     .arcStartLat((d: any) => +(d as Route).srcAirport!.lat)
//     .arcStartLng((d: any) => +(d as Route).srcAirport!.lng)
//     .arcEndLat((d: any) => +(d as Route).dstAirport!.lat)
//     .arcEndLng((d: any) => +(d as Route).dstAirport!.lng)
//     .arcDashLength(0.25)
//     .arcDashGap(1)
//     .arcDashInitialGap(() => Math.random())
//     .arcDashAnimateTime(4000)
//     .arcColor(() => [
//       `rgba(0, 255, 0, ${OPACITY})`,
//       `rgba(255, 0, 0, ${OPACITY})`,
//     ])
//     .arcsTransitionDuration(0)
//     .pointColor(() => "orange")
//     .pointAltitude(0)
//     .pointRadius(0.04)
//     .pointsMerge(true);

//   /* -------------------- Parsers -------------------- */

//   const airportParse = (row: string[]): Airport => {
//     const [
//       airportId,
//       name,
//       city,
//       country,
//       iata,
//       icao,
//       lat,
//       lng,
//       alt,
//       timezone,
//       dst,
//       tz,
//       type,
//       source,
//     ] = row;

//     return {
//       airportId,
//       name,
//       city,
//       country,
//       iata,
//       icao,
//       lat,
//       lng,
//       alt,
//       timezone,
//       dst,
//       tz,
//       type,
//       source,
//     };
//   };

//   const routeParse = (row: string[]): Route => {
//     const [
//       airline,
//       airlineId,
//       srcIata,
//       srcAirportId,
//       dstIata,
//       dstAirportId,
//       codeshare,
//       stops,
//       equipment,
//     ] = row;

//     return {
//       airline,
//       airlineId,
//       srcIata,
//       srcAirportId,
//       dstIata,
//       dstAirportId,
//       codeshare,
//       stops,
//       equipment,
//     };
//   };

//   /* -------------------- Data Load -------------------- */

//   Promise.all([
//     fetch(
//       "https://raw.githubusercontent.com/jpatokal/openflights/master/data/airports.dat"
//     )
//       .then((res) => res.text())
//       .then((d) => csvParseRows(d, airportParse)),

//     fetch(
//       "https://raw.githubusercontent.com/jpatokal/openflights/master/data/routes.dat"
//     )
//       .then((res) => res.text())
//       .then((d) => csvParseRows(d, routeParse)),
//   ]).then(([airports, routes]) => {
//     const byIata = indexBy(airports, "iata", false) as Record<string, Airport>;

//     const filteredRoutes: Route[] = routes
//       .filter((d) => byIata[d.srcIata] && byIata[d.dstIata])
//       .filter((d) => d.stops === "0")
//       .map((d) => ({
//         ...d,
//         srcAirport: byIata[d.srcIata],
//         dstAirport: byIata[d.dstIata],
//       }))
//       .filter(
//         (d) =>
//           d.srcAirport!.country === COUNTRY && d.dstAirport!.country !== COUNTRY
//       );

//     myGlobe.pointsData(airports).arcsData(filteredRoutes);
//   });
// };

const World = () => {
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

  useEffect(() => {
    // aim at continental US centroid
    globeEl.current.pointOfView({ lat: 39.6, lng: -98.5, altitude: 2 });
  }, []);

  return (
    <Globe
      ref={globeEl}
      globeImageUrl="//cdn.jsdelivr.net/npm/three-globe/example/img/earth-night.jpg"
      arcsData={routes}
      arcLabel={(d) => `${d.airline}: ${d.srcIata} &#8594; ${d.dstIata}`}
      arcStartLat={(d) => +d.srcAirport.lat}
      arcStartLng={(d) => +d.srcAirport.lng}
      arcEndLat={(d) => +d.dstAirport.lat}
      arcEndLng={(d) => +d.dstAirport.lng}
      arcDashLength={0.25}
      arcDashGap={1}
      arcDashInitialGap={() => Math.random()}
      arcDashAnimateTime={4000}
      arcColor={(d) => [
        `rgba(0, 255, 0, ${OPACITY})`,
        `rgba(255, 0, 0, ${OPACITY})`,
      ]}
      arcsTransitionDuration={0}
      pointsData={airports}
      pointColor={() => "orange"}
      pointAltitude={0}
      pointRadius={0.02}
      pointsMerge={true}
    />
  );
};

// export default initAirplane3D;
