const express = require('express');
const { query, validationResult } = require('express-validator');
const { getDistance } = require('geolib');

const restaurants = require('./restaurants.json').restaurants;
//const validateBlurHashes = require('./validateBlurHashes');
//validateBlurHashes(restaurants);

const app = express();

const isQueryMatch = (restObj, query) => {
  return (
    restObj.name.toLowerCase().includes(query.toLowerCase()) ||
    restObj.description.toLowerCase().includes(query.toLowerCase()) ||
    restObj.tags.some(tag => {
      return tag.toLowerCase().includes(query.toLowerCase());
    })
  );
};

const isUnder3k = (restLocation, destLat, destLon) => {
  return (
    getDistance(
      { latitude: restLocation[1], longitude: restLocation[0] },
      { latitude: destLat, longitude: destLon }
    ) < 3000
  );
};

app.get(
  '/restaurants/search',
  [
    query('q')
      .isString()
      .notEmpty()
      .trim(),
    query('lat').isFloat({ min: -90.0, max: 90.0 }),
    query('lon').isFloat({ min: -180.0, max: 180.0 })
  ],
  function(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    res.send(
      restaurants.filter(
        obj =>
          isQueryMatch(obj, req.query.q) &&
          isUnder3k(obj.location, req.query.lat, req.query.lon)
      )
    );
  }
);

app.listen(3000);
