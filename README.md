README
This is an Express-NodeJS application that implements an Intersections API. The API takes a POST request with a GeoJSON linestring and finds intersections with 50 randomly generated lines on the plane.

The API requires a header X-API-KEY with a value 'secret' for authentication. It returns a JSON array of objects, each containing a lineId and a point property. The lineId is a string representing the id of the intersecting line, from L01 to L50. The point is an array of two numbers representing the longitude and latitude of the intersection point.

If there are no intersections, the API returns an empty array.

If the request is missing or malformed, or if the auth header is invalid, the API returns an appropriate error message and status code.

The API can be tested with Postman or cURL by sending a POST request to http://localhost:3000/intersections with the header and body as described above.

For example, using cURL:

curl -X POST -H "X-API-KEY: secret" -H "Content-Type: application/json" \
-d '{"type":"LineString","coordinates":[[-180,-90],[180,90]]}' \
http://localhost:3000/intersections