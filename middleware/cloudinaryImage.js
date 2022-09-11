const cloudinary = require("cloudinary");

const cloud = cloudinary.config({
  cloud_name: "govipiyasa",
  api_key: "872342239799831",
  api_secret: "BNWfD4MuQQ-es9zrjQm29SBTzQM",
});

uploadToCloudinary = (path, folder) => {
  return cloudinary.v2.uploader
    .upload(path, { folder })
    .then((data) => {
      return { url: data.url, public_id: data.public_id };
    })
    .catch((error) => {
      console.log(error);
    });
};

module.exports = { uploadToCloudinary };
