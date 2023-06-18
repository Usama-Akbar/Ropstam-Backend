var express = require("express");
var router = express.Router();
require("dotenv").config();
const jwt = require("jsonwebtoken");
const cryprto = require("crypto");
const { ObjectId } = require("mongodb");
const category_schema = require("../../utils/Schema/CategoryValidation/create");
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

// Get categories list
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
              collection: "cars-categories",
              database: "Ropstam-Dev",
              dataSource: "Ropstam",
            }),
          });
          let result = await response.json();
          if (result.documents === null) {
            res.json({
              categories: result.documents,
              result: true,
              message: "Categories are not available",
            });
          } else if (result.documents.length === 0) {
            res.json({
              categories: result.documents,
              result: true,
              message: "No categories found",
            });
          } else {
            res.json({
              categories: result.documents,
              result: true,
              message: "Categories retrieved successfully",
            });
          }

          // res.json({
          //   articles: result.documents,
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

//get specific category
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
                collection: "cars-categories",
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
              category: "Category not found!",
              result: false,
            });
          } else {
            res.json({
              category: result,
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
        "There was a problem in retriving the users list, please try again.",
      result: false,
    });
  }
});

//Create specific category
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
          const { error } = category_schema.validate(req.body, {
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
                collection: "cars-categories",
                database: "Ropstam-Dev",
                dataSource: "Ropstam",
                document: {
                  category: req.body.category,
                  description: req.body.description,
                  status: "active",
                  createdAt: new Date(),
                  updatedAt: new Date(),
                },
              }),
            }
          );
          let result = await response.json();
          res.json({
            result: true,
            message: "Category created successfully",
          });
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

//Delete specific category
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
                collection: "cars-categories",
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
              message: "Category Deleted successfully!",
              result: true,
            });
          } else {
            res.json({
              message: "Category not found",
              result: false,
            });
          }
        }
      });
    }
  } catch (e) {
    console.log("ERROR is", e);
    res.status(500).json({
      message: "There was a problem in deleting the article, please try again.",
      result: false,
    });
  }
});

// Update articles list
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
                collection: "cars-categories",
                database: "Ropstam-Dev",
                dataSource: "Ropstam",
                filter: {
                  _id: { $oid: req.params.id },
                },
                update: {
                  $set: {
                    category: req.body.category,
                    description: req.body.description,
                    updatedAt: new Date(),
                  },
                },
              }),
            }
          );
          let result = await response.json();
          if (result.matchedCount > 0) {
            res.json({
              message: "Category Updated successfully!",
              result: true,
            });
          } else {
            res.json({
              message: "Category not found",
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

router.post("/activate/:id", async function (req, res, next) {
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
                collection: "cars-categories",
                database: "Ropstam-Dev",
                dataSource: "Ropstam",
                filter: {
                  _id: { $oid: req.params.id },
                },
                update: {
                  $set: {
                    status: "active",
                    updatedAt: new Date(),
                  },
                },
              }),
            }
          );
          let result = await response.json();
          if (result.matchedCount > 0) {
            res.json({
              message: "Category Activated successfully!",
              result: true,
            });
          } else {
            res.json({
              message: "Category not found",
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
router.post("/deactivate/:id", async function (req, res, next) {
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
                collection: "cars-categories",
                database: "Ropstam-Dev",
                dataSource: "Ropstam",
                filter: {
                  _id: { $oid: req.params.id },
                },
                update: {
                  $set: {
                    status: "inactive",
                    updatedAt: new Date(),
                  },
                },
              }),
            }
          );
          let result = await response.json();
          console.log(result);
          if (result.matchedCount > 0) {
            res.json({
              message: "Category deactivated successfully!",
              result: true,
            });
          } else {
            res.json({
              message: "Category not found",
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
