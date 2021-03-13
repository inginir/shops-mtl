import ReactDOM from "react-dom";
import { path, pathOr } from "ramda";
import { useEffect } from "react";
import { fetchDirections } from "../pages/api/hotelsApi";
import Popup from "../components/Popup";
import { main_coordinates } from "../constants/misc";

export const addMainPoint = map => {
  map.addSource("main-point", {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: main_coordinates,
          },
          properties: {
            id: "1",
            title: "Bell Center",
            description: "A cool place in montreal that hosts a lot of events",
          },
        },
      ],
    },
  });

  // Add a symbol layer
  map.addLayer({
    id: "main-point",
    type: "symbol",
    source: "main-point",
    // paint: {
    //   "fill-color": "#00ffff",
    // },
    layout: {
      "icon-image": "custom-marker",
      // get the title name from the source's "title" property
      "text-field": ["get", "title"],
      "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
      "text-offset": [0, 1.25],
      "text-anchor": "top",
      "icon-size": 0.07,
      "icon-allow-overlap": true,
      "text-allow-overlap": true,
      //   "icon-color": "yellow",
      //   "icon-halo-color": "yellow",
    },
  });
};

export const addHotels = (map, hotels = []) => {
  const features = hotels.map(({ id, coordinates, name, price, address }) => {
    return {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates,
      },
      properties: {
        id,
        title: name,
        price: `$${price}`,
        description: address,
      },
    };
  });

  if (map && map.loaded()) {
    if (map.getLayer("hotels-circle")) map.removeLayer("hotels-circle");
    if (map.getLayer("hotels-price")) map.removeLayer("hotels-price");
    if (map.getSource("hotels")) map.removeSource("hotels");

    map.addSource("hotels", {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features,
      },
    });

    map.addLayer({
      id: "hotels-circle",
      type: "circle",
      source: "hotels",
      paint: {
        "circle-color": "#e75480",
        "circle-radius": 15,
        "circle-opacity": 0.65,
      },
      layout: {},
    });
    // Add a symbol layer
    map.addLayer({
      id: "hotels-price",
      type: "symbol",
      source: "hotels",
      layout: {
        // "icon-image": "custom-marker",
        // get the title name from the source's "title" property
        "text-field": ["get", "price"],
        "text-size": 10,
        // "text-color": "#ff0",
        "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
        "text-offset": [0, -0.65],
        "text-anchor": "top",
        // "icon-size": 0.05,
      },
    });
  }
};

export const useAddHotelPoints = (map, hotels) => {
  useEffect(() => {
    map && addHotels(map, hotels);
  }, [hotels]);
};

export const useShowDirections = (map, directions) => {
  useEffect(() => {
    if (map && map.loaded()) {
      if (map.getLayer("hover-route")) map.removeLayer("hover-route");
      if (map.getSource("hover-route")) map.removeSource("hover-route");

      map.addSource("hover-route", {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: directions,
          },
        },
      });
      map.addLayer({
        id: "hover-route",
        type: "line",
        source: "hover-route",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#0000FF",
          "line-width": 4,
        },
      });
    }
  }, [directions]);
};

export const onHotelsHover = (map, setDirections, router, popUpRef) => {
  map.on("mouseenter", "hotels-circle", e => {
    const { lat, lng } = pathOr({}, ["lngLat"], e);
    fetchDirections([lng, lat], main_coordinates).then(res => {
      const fetchedDirections = path(
        ["data", "routes", "0", "geometry", "coordinates"],
        res
      );
      setDirections(fetchedDirections);
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
          title={feature.properties.title}
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
    map.on("mouseleave", "hotels-circle", () => {
      // setShowDirections(false);
      setDirections([]);
      map.getCanvas().style.cursor = "";
    });
  });
};

export const onMainPointHover = (map, popUpRef, router) => {
  // change cursor to pointer when user hovers over a clickable feature
  map.on("mouseenter", "main-point", e => {
    if (e.features.length) {
      map.getCanvas().style.cursor = "pointer";
    }
  });
  // reset cursor to default when user is no longer hovering over a clickable feature
  map.on("mouseleave", "main-point", () => {
    map.getCanvas().style.cursor = "";
  });
  map.on("mouseenter", "main-point", e => {
    if (e.features.length) {
      const feature = e.features[0];
      // create popup node
      const popupNode = document.createElement("div");
      ReactDOM.render(
        <Popup
          title={feature.properties.title}
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
};
