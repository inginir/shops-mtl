import ReactDOM from "react-dom";
import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "../styles/ShopsMap.module.css";
import static_coordinates from "../constants/static-coordinates.json";
import {
  addMainPoint,
  addHotels,
  useAddHotelPoints,
  useShowDirections,
  changeCursorOnEnter,
} from "../helpers/map_helpers";
import axios from "axios";
import { path, pathOr } from "ramda";
import { bookingUrl } from "../constants/api-urls";
import { main_coordinates } from "../constants/misc";
import { fetchHotels } from "./api/hotelsApi";
// import marker_image from "../public/marker-image.png";
// import "./App.css";

mapboxgl.accessToken =
  "pk.eyJ1IjoibW9uYWdnYXIiLCJhIjoiY2ttMnZkZmR0MDJzejJ2bXliNTd0aHZzcSJ9.CL2JLBLsh9KLTwYX6rDSaQ";

let map;

const ShopsMap = () => {
  const router = useRouter();
  const popUpRef = useRef(new mapboxgl.Popup({ offset: 15 }));

  const [shops, setShops] = useState([]);
  const [directions, setDirections] = useState(static_coordinates);
  const [showDirections, setShowDirections] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 300]);

  useEffect(() => {
    fetchHotels(main_coordinates, priceRange, setShops);
  }, []);

  useEffect(() => {
    map = new mapboxgl.Map({
      container: "my-map",
      style: "mapbox://styles/mapbox/streets-v11",
      center: [-73.5693, 45.4961],
      zoom: 14,
      // pitch: 45,
    });
    map.on("load", () => {
      // add the data source for new a feature collection with no features
      map.loadImage(
        "https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-512.png",
        function (error, image) {
          if (error) throw error;
          map.addImage("custom-marker", image);
          addMainPoint(map);
        }
      );
    });

    // change cursor to pointer when user hovers over a clickable feature
    map.on("mouseenter", "main-point", e => {
      if (e.features.length) {
        map.getCanvas().style.cursor = "pointer";
      }
    });

    // change cursor to pointer when user hovers over a clickable feature
    changeCursorOnEnter(
      map,
      directions,
      setDirections,
      showDirections,
      setShowDirections,
      router,
      popUpRef
    );

    // reset cursor to default when user is no longer hovering over a clickable feature
    map.on("mouseleave", "main-point", () => {
      setShowDirections(false);
      map.getCanvas().style.cursor = "";
    });

    map.on("mouseleave", "hotels-circle", () => {
      setShowDirections(false);
      map.getCanvas().style.cursor = "";
    });

    map.on("click", "main-point", e => {
      if (e.features.length) {
        const feature = e.features[0];
        // create popup node
        const popupNode = document.createElement("div");
        ReactDOM.render(
          <Popup
            children={feature.properties.description}
            id={feature.properties.id}
            router={router}
          />,
          popupNode
        );
        // set popup on map
        popUpRef.current
          .setLngLat(feature.geometry.coordinates)
          .setDOMContent(popupNode)
          .addTo(map);
      }
    });
    map.on("click", "hotels-circle", e => {
      if (e.features.length) {
        const feature = e.features[0];
        // create popup node
        const popupNode = document.createElement("div");
        ReactDOM.render(
          <Popup
            children={feature.properties.description}
            id={feature.properties.id}
            router={router}
          />,
          popupNode
        );
        // set popup on map
        popUpRef.current
          .setLngLat(feature.geometry.coordinates)
          .setDOMContent(popupNode)
          .addTo(map);
      }
    });
    return () => map.remove();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useAddHotelPoints(map, shops);

  useShowDirections(map, directions, showDirections);

  const handleMinPriceChange = e => {
    setPriceRange([e.target.value, priceRange[1]]);
  };

  const handleMaxPriceChange = e => {
    setPriceRange([priceRange[0], e.target.value]);
  };

  const handlePriceFieldBlur = () => {
    fetchHotels(main_coordinates, priceRange, setShops);
  };

  return (
    <div className={styles["map-container"]}>
      <div className={styles["title"]}>Welcome to shops-mtl</div>
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
      {/* <button onClick={}/> */}
    </div>
  );
};

export default ShopsMap;
