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
        .get("https://api.stay22.com/v2/booking", {
          httpsAgent: agent,
          params: {
            latitude: lat,
            longitude: lng,
            radius: 1000,
            checkin: "2021-06-10",
            checkout: "2021-06-12",
            minprice: min,
            maxprice: max,
            language: "en",
            currency: "USD",
            rooms: 1,
            limit: 20,
            page: 1,
            country: "CA",
          },
        })
        .then(response => {
          console.log("response", Object.keys(response));
          res.send(response.data);
        })
        .catch(error => {
          res.send(error);
        });
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
