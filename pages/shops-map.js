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
} from "../helpers/map_helpers";
import axios from "axios";
import { path, pathOr } from "ramda";
import { bookingUrl } from "../constants/api-urls";
import { main_coordinates } from "../constants/misc";
// import marker_image from "../public/marker-image.png";
// import "./App.css";

mapboxgl.accessToken =
  "pk.eyJ1IjoibW9uYWdnYXIiLCJhIjoiY2ttMnZkZmR0MDJzejJ2bXliNTd0aHZzcSJ9.CL2JLBLsh9KLTwYX6rDSaQ";

const Popup = ({ children, id, router }) => {
  const handleClick = e => {
    e.preventDefault();
    router.push(`/shop?id=${id}`);
  };
  return (
    <>
      <div style={{ padding: "10px" }}>{children}</div>
      <button onClick={handleClick}>Details</button>
    </>
  );
};

let map;
const ShopsMap = () => {
  const router = useRouter();
  const popUpRef = useRef(new mapboxgl.Popup({ offset: 15 }));

  const [shops, setShops] = useState([]);
  const [directions, setDirections] = useState(static_coordinates);
  const [showDirections, setShowDirections] = useState(false);

  const priceRange = [1, 100];

  useEffect(() => {
    axios
      .get(bookingUrl, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
        },
      })
      .then(res => {
        const shopsRaw = path(["data", "results"], res);
        console.log("shopsRaw", shopsRaw);
        const shopsReduced = shopsRaw.map(
          ({
            latLng,
            hid,
            data: { name, address } = {},
            prices: { nightly = "" } = {},
          }) => ({
            hid,
            name,
            address,
            price: Math.floor(nightly),
            coordinates: latLng.reverse(),
          })
        );
        setShops(shopsReduced);
      });
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
      // const image = (
      //   <img src="../public/marker-image.png" width="150" height="150" />
      // );
      // map.addImage("main-custom-marker", image);
    });

    // change cursor to pointer when user hovers over a clickable feature
    map.on("mouseenter", "main-point", e => {
      if (e.features.length) {
        map.getCanvas().style.cursor = "pointer";
      }
    });

    // change cursor to pointer when user hovers over a clickable feature
    map.on("mouseenter", "hotels-circle", e => {
      // setDirections(!directions);
      console.log("e", e);
      const { lat, lng } = pathOr({}, ["lngLat"], e);
      axios
        .get(
          `https://directions.stay22.com/route/v2/walking/${lng}, ${lat};${main_coordinates[0]}, ${main_coordinates[1]}?alternatives=false&steps=true&geometries=geojson&overview=full`
        )
        .then(res => {
          const fetchedDirections = path(
            ["data", "routes", "0", "geometry", "coordinates"],
            res
          );
          setDirections(fetchedDirections);
          setShowDirections(true);
        });
      if (e.features.length) {
        map.getCanvas().style.cursor = "pointer";
        //SHOW POPUP ON HOVER
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

  return (
    <div className={styles["map-container"]}>
      <div className={styles["title"]}>Welcome to shops-mtl</div>
      <div id="my-map" style={{ height: 500, width: 500 }} />
    </div>
  );
};

export default ShopsMap;
