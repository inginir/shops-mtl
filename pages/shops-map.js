import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import { useRouter } from "next/router";
import styles from "../styles/ShopsMap.module.css";
import static_coordinates from "../constants/static-coordinates.json";
import {
  useAddHotelPoints,
  useAddMainPoint,
  useShowDirections,
  useSetupMap,
} from "../helpers/map_helpers";
import { main_coordinates } from "../constants/misc";
import { fetchHotels } from "./api/hotelsApi";

mapboxgl.accessToken =
  "pk.eyJ1IjoibW9uYWdnYXIiLCJhIjoiY2ttMnZkZmR0MDJzejJ2bXliNTd0aHZzcSJ9.CL2JLBLsh9KLTwYX6rDSaQ";

const ShopsMap = () => {
  const router = useRouter();
  const popUpRef = useRef(new mapboxgl.Popup({ offset: 15 }));

  const [map, setMap] = useState();
  const [hotels, setHotels] = useState([]);
  const [directions, setDirections] = useState(static_coordinates);
  const [priceRange, setPriceRange] = useState([0, 300]);

  useEffect(() => {
    fetchHotels(main_coordinates, priceRange, setHotels);
  }, []);

  //MAP HOOKS
  useSetupMap(setMap);
  useAddMainPoint(map, popUpRef, router);
  useAddHotelPoints(map, hotels, setDirections, router, popUpRef);
  useShowDirections(map, directions);

  const handleMinPriceChange = e => {
    setPriceRange([e.target.value, priceRange[1]]);
  };

  const handleMaxPriceChange = e => {
    setPriceRange([priceRange[0], e.target.value]);
  };

  const handlePriceFieldBlur = () => {
    fetchHotels(main_coordinates, priceRange, setHotels);
  };

  return (
    <div className={styles["map-container"]}>
      <div className={styles["title"]}>Welcome to hotels-mtl</div>
      <div id="my-map" style={{ height: 500, width: 500 }} />
      <input
        onChange={handleMinPriceChange}
        onBlur={handlePriceFieldBlur}
        value={priceRange[0]}
      />
      <input
        onChange={handleMaxPriceChange}
        onBlur={handlePriceFieldBlur}
        value={priceRange[1]}
      />
    </div>
  );
};

export default ShopsMap;
