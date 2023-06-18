var express = require("express");
var router = express.Router();
require("dotenv").config();
var multer = require("multer");
var fs = require("fs");
const media_schema = require("../../utils/Schema/MediaValidation/create");
const BASE_URL =
  "https://ap-southeast-1.aws.data.mongodb-api.com/app/data-tjxqd/endpoint/data/v1";

async function VerifyToken(token) {
  return new Promise(async function (resolve, reject) {
    const request = await fetch(`${process.env.BASE_URL}/action/findOne`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "api-key": process.env.API_KEY,
      },
      body: JSON.stringify({
        collection: "secrets",
        database: "Ropstam-Dev",
        dataSource: "Ropstam",
        filter: { secret: token },
      }),
    });
    const response = await request.json();
    if (response.document === null) {
      resolve({ status: "unauthenticated" });
    } else {
      resolve({ status: "authenticated" });
    }
  });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `./upload`);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
    filename = file.originalname;
  },
});
const upload = multer({ storage });

router.post("/upload", upload.single("file"), async function (req, res, next) {
  try {
    if (
      req.header("x-access-token") === undefined ||
      req.header("x-access-token").length === 0
    ) {
      res.status(403).json({
        message: "A token is required for authentication.",
        result: false,
      });
    } else {
      VerifyToken(req.header("x-access-token")).then(async function (resolve) {
        if (resolve.status === "unauthenticated") {
          res.status(401).json({
            message:
              "Access denied, you are not allowed to access the API with this token.",
            result: false,
          });
        } else {
          try {
            if (req.file == undefined) {
              const response = await fetch(
                `${process.env.BASE_URL}/action/insertOne`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "api-key": process.env.API_KEY,
                  },
                  body: JSON.stringify({
                    collection: "media",
                    database: "Ropstam-Dev",
                    dataSource: "Ropstam",
                    document: {
                      imageURL: ``,
                      title: req.body.title,
                      category: req.body.category,
                      altText: req.body.altText,
                      createdAt: new Date(),
                      updatedAt: new Date(),
                    },
                  }),
                }
              );
              const result = await response.json();
              res.send({
                message: `File uploaded successfully.`,
                result: true,
              });
            } else {
              let file_path = req.file.path;
              let data_file = fs.createReadStream(file_path);
              var FormData = require("form-data");
              var image = new FormData();
              image.append("image", data_file);

              const AWS = require("aws-sdk");

              const s3 = new AWS.S3({
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
              });

              const bucketName = "ropstam";

              const params = {
                Bucket: bucketName,
                Key: req.file.filename,
                Body: data_file,
              };

              s3.upload(params, async function (err, data) {
                if (err) {
                  res.send({
                    message: `Fail to upload this file.`,
                    result: false,
                  });
                }
                const response = await fetch(
                  `${process.env.BASE_URL}/action/insertOne`,
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Accept: "application/json",
                      "api-key": process.env.API_KEY,
                    },
                    body: JSON.stringify({
                      collection: "media",
                      database: "Ropstam-Dev",
                      dataSource: "Ropstam",
                      document: {
                        imageURL: `https://ropstam.s3.ap-southeast-1.amazonaws.com/${req.file.filename}`,
                        title: req.body.title,
                        category: req.body.category,
                        altText: req.body.altText,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                      },
                    }),
                  }
                );
                const result = await response.json();
                res.send({
                  image: `https://ropstam.s3.ap-southeast-1.amazonaws.com/${req.file.filename}`,
                  message: `File uploaded successfully.`,
                  result: true,
                });
              });
            }
          } catch (e) {
            console.log(e);
          }
        }
      });
    }
  } catch (e) {
    console.log("ERROR is", e);
    res.status(500).json({
      result: false,
      message:
        "There was a problem in retriving the users list, please try again.",
    });
  }
});

router.get("/list", async function (req, res, next) {
  try {
    if (
      req.header("x-access-token") === undefined ||
      req.header("x-access-token").length === 0
    ) {
      res.status(403).json({
        message: "A token is required for authentication.",
        result: false,
      });
    } else {
      VerifyToken(req.header("x-access-token")).then(async function (resolve) {
        if (resolve.status === "unauthenticated") {
          res.status(401).json({
            message:
              "Access denied, you are not allowed to access the API with this token.",
            result: false,
          });
        } else {
          const response = await fetch(`${process.env.BASE_URL}/action/find`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              "api-key": process.env.API_KEY,
            },
            body: JSON.stringify({
              collection: "media",
              database: "Ropstam-Dev",
              dataSource: "Ropstam",
            }),
          });
          let result = await response.json();
          res.json({
            users: result.documents,
            result: true,
          });
        }
      });
    }
  } catch (e) {
    console.log("ERROR is", e);
    res.status(500).json({
      message:
        "There was a problem in retriving the media list, please try again.",
      result: false,
    });
  }
});

router.delete("/delete/:id", async function (req, res, next) {
  try {
    if (
      req.header("x-access-token") === undefined ||
      req.header("x-access-token").length === 0
    ) {
      res.status(403).json({
        message: "A token is required for authentication.",
        result: false,
      });
    } else {
      VerifyToken(req.header("x-access-token")).then(async function (resolve) {
        if (resolve.status === "unauthenticated") {
          res.status(401).json({
            message:
              "Access denied, you are not allowed to access the API with this token.",
            result: false,
          });
        } else {
          const response = await fetch(
            `${process.env.BASE_URL}/action/deleteOne`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "api-key": process.env.API_KEY,
              },
              body: JSON.stringify({
                collection: "media",
                database: "Ropstam-Dev",
                dataSource: "Ropstam",
                filter: {
                  _id: { $oid: req.params.id },
                },
              }),
            }
          );
          let result = await response.json();
          if (result.deletedCount > 0) {
            res.json({
              message: "Media deleted successfully!",
              result: true,
            });
          } else {
            res.json({
              message: "Media not found",
              result: false,
            });
          }
        }
      });
    }
  } catch (e) {
    console.log("ERROR is", e);
    res.status(500).json({
      message:
        "There was a problem in retriving the media list, please try again.",
      result: false,
    });
  }
});

module.exports = router;
