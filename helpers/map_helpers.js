import { useEffect } from "react";

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
            coordinates: [-73.5693, 45.4961],
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
  const features = hotels.map(({ hid, coordinates, name, price, address }) => {
    return {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates,
      },
      properties: {
        id: hid,
        title: name,
        price: `$${price}`,
        description: address,
      },
    };
  });
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
};

export const useAddHotelPoints = (map, hotels) => {
  useEffect(() => {
    map && addHotels(map, hotels);
  }, [hotels]);
};

export const useShowDirections = (map, directions, showDirections) => {
  useEffect(() => {
    if (map && map.loaded()) {
      if (map.getLayer("hover-route")) map.removeLayer("hover-route");
      if (map.getSource("hover-route")) map.removeSource("hover-route");
      console.log("directions", directions);
      if (showDirections) {
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
    }
  }, [directions, showDirections]);
};