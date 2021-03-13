import axios from "axios";
import { path } from "ramda";

export const fetchDirections = (from, to) =>
  axios.get(
    `https://directions.stay22.com/route/v2/walking/${from[0]}, ${from[1]};${to[0]}, ${to[1]}?alternatives=false&steps=true&geometries=geojson&overview=full`
  );

export const fetchHotels = (origin, priceRange, setHotels) => {
  axios
    .get("http://localhost:8080/api/hotels", {
      // .get("/api/hotels", {
      params: {
        lng: origin[0],
        lat: origin[1],
        min: priceRange[0],
        max: priceRange[1],
      },
    })
    .then(res => {
      const shopsRaw = path(["data", "results"], res);
      const shopsReduced = shopsRaw.map(
        ({
          latitude,
          longitude,
          id,
          address: { street } = {},
          name,
          min_rates: { per_night },
          prices: { nightly = "" } = {},
        }) => ({
          id,
          name,
          address: street,
          price: Math.floor(per_night),
          coordinates: [longitude, latitude],
        })
      );
      setHotels(shopsReduced);
    });
};
