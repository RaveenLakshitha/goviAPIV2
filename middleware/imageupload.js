const multerS3 = require("multer-s3");
const AWS = require("aws-sdk");
const multer = require("multer");
const path = require("path");
const shortid = require("shortid");
const s3 = new AWS.S3({
  accessKeyId: "AKIAZ2TS2LCDPED367CE",
  secretAccessKey: "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",
});

//const upload = multer({ storage });
exports.uploads3 = multer({
  storage: multerS3({
    s3: s3,
    bucket: "govibucket01",
    acl: "public-read",
    metadata: function (req, file, cb) {
      cb(null, { fieldname: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, shortid.generate() + "-" + file.originalname);
    },
  }),
});
