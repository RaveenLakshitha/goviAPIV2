const { config } = require("dotenv");
const NodeGeocoder = require("node-geocoder");

const options = {
  provider: "google",
  // Optional depending on the providers
  apiKey: "AIzaSyDf2cCnLYdxN3Ro5fSuQvqCz5j7OQcK7AU", // for Mapquest, OpenCage, Google Premier
  formatter: null, // 'gpx', 'string', ...
};

const geocoder = NodeGeocoder(options);

module.exports = geocoder;
