const { default: axios } = require("axios");
const express = require("express");
const next = require("next");
const https = require("https");
const bodyParser = require("body-parser");
const cors = require("cors");
const PORT = 8080;
// const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev: false });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const server = express();
    server.use(bodyParser.urlencoded({ extended: false }));
    server.use(bodyParser.json());
    server.use(cors());
    server.get("/api/hotels", (req, res) => {
      console.log("H");
      const agent = new https.Agent({
        rejectUnauthorized: false,
      });
      const { lat = 45.4961, lng = -73.5693, max, min } = req.query;
      axios
        .get("https://www.stay22.com/api/booking", {
          httpsAgent: agent,
          params: {
            min,
            max,
            width: 660,
            height: 400,
            adults: 1,
            children: 0,
            infants: 0,
            guests: 1,
            rooms: 1,
            currency: "USD",
            langshort: "en",
            priceper: "nightly",
            limit: 30,
            lat,
            lng,
            nelat: lat - 0.01,
            nelng: lng - 0.01,
            swlat: lat + 0.01,
            swlng: lng + 0.01,
            zoom: 10,
            isnear: true,
            // showairbnbs: true,
            // centerlat: lat + 0.00004,
            // centerlng: lng + 0.00004,
          },
        })
        .then(response => {
          console.log("response", Object.keys(response));
          res.send(response.data);
        })
        .catch(error => res.send(error));
      //   return res.send("hey");
    });

    server.get("*", (req, res) => {
      return handle(req, res);
    });

    server.listen(PORT, err => {
      if (err) throw err;
      console.log("> Ready on http://localhost:" + PORT);
    });
  })
  .catch(ex => {
    console.error(ex.stack);
    process.exit(1);
  });
