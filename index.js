/* eslint-disable no-restricted-syntax */
/* eslint-disable no-console */
/* eslint linebreak-style: ["error", "windows"] */

// Intersections API
// A RESTful API that takes a POST request with a GeoJSON
// linestring and finds intersections with 50 random lines

const express = require('express');

const turf = require('@turf/turf');

const app = express();

app.use(express.json());

const AUTH_HEADER = 'X-API-KEY';
const AUTH_VALUE = 'secret';
const PORT = 3000;

// Generating 50 random lines with ids from L01 to L50
const randomLines = [];
for (let i = 1; i <= 50; i += 1) {
  // Creating a random line with two points
  const line = turf.lineString([
    [Math.random() * 360 - 180, Math.random() * 180 - 90],
    [Math.random() * 360 - 180, Math.random() * 180 - 90],
  ]);
    // Adding an id property to the line
  line.properties.id = `L${i.toString().padStart(2, '0')}`;

  randomLines.push(line);
}

app.post('/intersections', (req, res) => {
  console.log(req);
  // Checking if the auth header is present and valid
  const auth = req.get(AUTH_HEADER);
  if (auth !== AUTH_VALUE) {
    // Sending a 401 response if auth fails
    res.status(401).send('Unauthorized');
    console.error(`Error 401. Received wrong auth header: ${auth}`);
    return;
  }

  const linestring = req.body;

  try {
    // Creating a linestring object from the input
    turf.lineString(turf.getCoords(linestring));
    // If no error is thrown, the linestring is valid
  } catch (error) {
    res.status(400).send(error.message);
    console.error(`Error 400. Malformed request body: ${JSON.stringify(req.body)}`);
    return;
  }

  const intersections = [];

  // Looping through the random lines and finding intersections with the linestring
  for (const line of randomLines) {
    const points = turf.lineIntersect(linestring, line);
    // If there are any points, adding them to the intersections array with the line id
    if (points.features.length > 0) {
      for (const point of points.features) {
        intersections.push({
          lineId: line.properties.id,
          point: point.geometry.coordinates,
        });
      }
    }
  }

  res.status(200).json(intersections);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
