var express = require("express");
var router = express.Router();
require("dotenv").config();
const jwt = require("jsonwebtoken");
const cryprto = require("crypto");
const { ObjectId } = require("mongodb");
const car_schema = require("../../utils/Schema/CarValidation/create");
const BASE_URL =
  "https://ap-southeast-1.aws.data.mongodb-api.com/app/data-tjxqd/endpoint/data/v1";

//verify token function
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

// Get cars list
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
              collection: "cars",
              database: "Ropstam-Dev",
              dataSource: "Ropstam",
            }),
          });
          let result = await response.json();
          if (result.documents === null) {
            res.json({
              cars: result.documents,
              result: true,
              message: "Cars are not available",
            });
          } else if (result.documents.length === 0) {
            res.json({
              cars: [],
              result: true,
              message: "No Cars found",
            });
          } else {
            res.json({
              cars: result.documents,
              result: true,
              message: "Cars retrieved successfully",
            });
          }

          // res.json({
          //   cars: result.documents,
          //   result: true,
          // });
        }
      });
    }
  } catch (e) {
    console.log("ERROR is", e);
    res.status(500).json({
      message:
        "There was a problem in retriving the users list, please try again.",
      result: false,
    });
  }
});

//get specific article
router.get("/get/:id", async function (req, res, next) {
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
            `${process.env.BASE_URL}/action/findOne`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "api-key": process.env.API_KEY,
              },
              body: JSON.stringify({
                collection: "cars",
                database: "Ropstam-Dev",
                dataSource: "Ropstam",
                filter: {
                  _id: { $oid: req.params.id },
                },
              }),
            }
          );
          let result = await response.json();
          if (result === null) {
            res.json({
              message: "Car not found!",
              result: false,
            });
          } else {
            res.json({
              car: result,
              result: true,
            });
          }
        }
      });
    }
  } catch (e) {
    console.log("ERROR is", e);
    res.status(500).json({
      message:
        "There was a problem in retriving the Blogs list, please try again.",
      result: false,
    });
  }
});

// Create cars list
router.post("/create", async function (req, res, next) {
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
          const { error } = car_schema.validate(req.body, {
            abortEarly: false,
          });

          if (error) {
            // Retrieve all validation errors
            const errorDetails = error.details.map((err) => {
              return {
                field: err.path[0],
                message: err.message,
              };
            });

            return res.status(400).json({ errors: errorDetails });
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
                collection: "cars",
                database: "Ropstam-Dev",
                dataSource: "Ropstam",
                document: {
                  title: req.body.title,
                  model: req.body.model,
                  year: req.body.year,
                  color: req.body.color,
                  mileage: req.body.mileage,
                  price: req.body.price,
                  category: req.body.category,
                  tags: req.body.tags,
                  meta_title: req.body.meta_title,
                  meta_description: req.body.meta_description,
                  status: req.body.status,
                  featured: req.body.featured,
                  thumbnail: req.body.thumbnail,
                  owner: req.body.owner,
                  created_at: new Date(),
                  updated_at: new Date(),
                },
              }),
            }
          );
          let result = await response.json();
          res.json({
            result: true,
            message: "Car created successfully",
          });
        }
      });
    }
  } catch (e) {
    console.log("ERROR is", e);
    res.status(500).json({
      message: "There was a problem in creating the blog, please try again.",
      result: false,
    });
  }
});

// Delete cars list
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
                collection: "cars",
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
              result: true,
              message: "Car deleted successfully",
            });
          } else {
            res.json({
              message: "Car not found",
              result: false,
            });
          }
        }
      });
    }
  } catch (e) {
    console.log("ERROR is", e);
    res.status(500).json({
      message: "There was a problem in deleting the blog, please try again.",
      result: false,
    });
  }
});

// Update cars list
router.post("/update/:id", async function (req, res, next) {
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
          const { error } = car_schema.validate(req.body, {
            abortEarly: false,
          });

          if (error) {
            // Retrieve all validation errors
            const errorDetails = error.details.map((err) => {
              return {
                field: err.path[0],
                message: err.message,
              };
            });
          }
          const response = await fetch(
            `${process.env.BASE_URL}/action/updateOne`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "api-key": process.env.API_KEY,
              },
              body: JSON.stringify({
                collection: "cars",
                database: "Ropstam-Dev",
                dataSource: "Ropstam",
                filter: {
                  _id: { $oid: req.params.id },
                },
                update: {
                  $set: {
                    title: req.body.title,
                    model: req.body.model,
                    year: req.body.year,
                    color: req.body.color,
                    mileage: req.body.mileage,
                    price: req.body.price,
                    category: req.body.category,
                    tags: req.body.tags,
                    meta_title: req.body.meta_title,
                    meta_description: req.body.meta_description,
                    thumbnail: req.body.thumbnail,
                    status: req.body.status,
                    featured: req.body.featured,
                    owner: req.body.owner,
                    updated_at: new Date(),
                  },
                },
              }),
            }
          );
          let result = await response.json();
          console.log(result);
          if (result.matchedCount > 0) {
            res.json({
              result: true,
              message: "Car updated successfully",
            });
          } else {
            res.json({
              result: false,
              message: "Car Not Found",
            });
          }
        }
      });
    }
  } catch (e) {
    console.log("ERROR is", e);
    res.status(500).json({
      message: "There was a problem in updating the blog, please try again.",
      result: false,
    });
  }
});

// Published cars list
router.post("/publish/:id", async function (req, res, next) {
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
            `${process.env.BASE_URL}/action/updateOne`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "api-key": process.env.API_KEY,
              },
              body: JSON.stringify({
                collection: "cars",
                database: "Ropstam-Dev",
                dataSource: "Ropstam",
                filter: {
                  _id: { $oid: req.params.id },
                },
                update: {
                  $set: {
                    status: "published",
                    updated_at: new Date(),
                  },
                },
              }),
            }
          );
          let result = await response.json();
          if (result.matchedCount > 0) {
            res.json({
              message: "Car published successfully!",
              result: true,
            });
          } else {
            res.json({
              message: "Car not found",
              result: false,
            });
          }
        }
      });
    }
  } catch (e) {
    console.log("ERROR is", e);
    res.status(500).json({
      message: "There was a problem in creating the article, please try again.",
      result: false,
    });
  }
});

// Unpublished cars list
router.post("/unpublish/:id", async function (req, res, next) {
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
            `${process.env.BASE_URL}/action/updateOne`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "api-key": process.env.API_KEY,
              },
              body: JSON.stringify({
                collection: "cars",
                database: "Ropstam-Dev",
                dataSource: "Ropstam",
                filter: {
                  _id: { $oid: req.params.id },
                },
                update: {
                  $set: { status: "unpublish", updated_at: new Date() },
                },
              }),
            }
          );
          let result = await response.json();
          if (result.matchedCount > 0) {
            res.json({
              message: "Car unpublished successfully!",
              result: true,
            });
          } else {
            res.json({
              message: "Car not found",
              result: false,
            });
          }
        }
      });
    }
  } catch (e) {
    console.log("ERROR is", e);
    res.status(500).json({
      message: "There was a problem in creating the article, please try again.",
      result: false,
    });
  }
});

// Featured cars list
router.post("/feature/:id", async function (req, res, next) {
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
            `${process.env.BASE_URL}/action/updateOne`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "api-key": process.env.API_KEY,
              },
              body: JSON.stringify({
                collection: "cars",
                database: "Ropstam-Dev",
                dataSource: "Ropstam",
                filter: {
                  _id: { $oid: req.params.id },
                },
                update: {
                  $set: {
                    featured: true,
                    updated_at: new Date(),
                  },
                },
              }),
            }
          );
          let result = await response.json();
          if (result.matchedCount > 0) {
            res.json({
              message: "Car set featured successfully!",
              result: true,
            });
          } else {
            res.json({
              message: "Car not found",
              result: false,
            });
          }
        }
      });
    }
  } catch (e) {
    console.log("ERROR is", e);
    res.status(500).json({
      message: "There was a problem in creating the article, please try again.",
      result: false,
    });
  }
});

// Unfeatured cars list
router.post("/unfeature/:id", async function (req, res, next) {
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
            `${process.env.BASE_URL}/action/updateOne`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "api-key": process.env.API_KEY,
              },
              body: JSON.stringify({
                collection: "cars",
                database: "Ropstam-Dev",
                dataSource: "Ropstam",
                filter: {
                  _id: { $oid: req.params.id },
                },
                update: {
                  $set: {
                    featured: false,
                    updated_at: new Date(),
                  },
                },
              }),
            }
          );
          let result = await response.json();
          if (result.matchedCount > 0) {
            res.json({
              message: "Car set unfeatured successfully!",
              result: true,
            });
          } else {
            res.json({
              message: "Car not found",
              result: false,
            });
          }
        }
      });
    }
  } catch (e) {
    console.log("ERROR is", e);
    res.status(500).json({
      message: "There was a problem in creating the article, please try again.",
      result: false,
    });
  }
});

module.exports = router;
