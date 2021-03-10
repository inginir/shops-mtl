import ReactDOM from "react-dom";
import React, { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "../styles/ShopsMap.module.css";

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
const ShopsMap = () => {
  const router = useRouter();
  const popUpRef = useRef(new mapboxgl.Popup({ offset: 15 }));

  // initialize map when component mounts
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: "my-map",
      style: "mapbox://styles/mapbox/streets-v11",
      center: [-73.57561, 45.50162],
      zoom: 12.5,
      // pitch: 45,
    });
    map.on("load", () => {
      // add the data source for new a feature collection with no features
      map.loadImage(
        "https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png",
        function (error, image) {
          if (error) throw error;
          map.addImage("custom-marker", image);
          // Add a GeoJSON source with 2 points
          map.addSource("points", {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: [
                {
                  type: "Feature",
                  geometry: {
                    type: "Point",
                    coordinates: [-73.57561, 45.50162],
                  },
                  properties: {
                    id: "1",
                    title: "Wirkn",
                    description: "My future company! ;)",
                  },
                },
                {
                  type: "Feature",
                  geometry: {
                    type: "Point",
                    coordinates: [-73.563, 45.512],
                  },
                  properties: {
                    id: "2",
                    title: "Quartier des spectacles",
                    description:
                      "A cool place in montreal that hosts a lot of events",
                  },
                },
              ],
            },
          });

          // Add a symbol layer
          map.addLayer({
            id: "points",
            type: "symbol",
            source: "points",
            layout: {
              "icon-image": "custom-marker",
              // get the title name from the source's "title" property
              "text-field": ["get", "title"],
              "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
              "text-offset": [0, 1.25],
              "text-anchor": "top",
            },
          });
        }
      );
    });

    // change cursor to pointer when user hovers over a clickable feature
    map.on("mouseenter", "points", e => {
      if (e.features.length) {
        map.getCanvas().style.cursor = "pointer";
      }
    });

    // reset cursor to default when user is no longer hovering over a clickable feature
    map.on("mouseleave", "points", () => {
      map.getCanvas().style.cursor = "";
    });

    map.on("click", "points", e => {
      if (e.features.length) {
        const feature = e.features[0];
        // create popup node
        const popupNode = document.createElement("div");
        console.log("feature", feature);
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

  return (
    <div className={styles["map-container"]}>
      <div className={styles["title"]}>Welcome to shops-mtl</div>
      <div id="my-map" style={{ height: 500, width: 500 }} />
    </div>
  );
};

export default ShopsMap;
