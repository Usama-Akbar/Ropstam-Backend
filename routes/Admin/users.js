var express = require("express");
var router = express.Router();
require("dotenv").config();
const jwt = require("jsonwebtoken");
const cryprto = require("crypto");
const Joi = require("joi");
const BASE_URL =
  "https://ap-southeast-1.aws.data.mongodb-api.com/app/data-tjxqd/endpoint/data/v1";
const signin_schema = require("../../utils/Schema/AuthValidation/signin");
const signup_schema = require("../../utils/Schema/AuthValidation/signup");
const userupdate_schema = require("../../utils/Schema/AuthValidation/userupdate");
// Get Users List
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

// Get Users List

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
              collection: "users",
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
        "There was a problem in retriving the users list, please try again.",
      result: false,
    });
  }
});

// Get Specific User

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
                collection: "users",
                database: "Ropstam-Dev",
                dataSource: "Ropstam",
                filter: {
                  _id: { $oid: req.params.id },
                },
              }),
            }
          );
          let result = await response.json();
          if (result.document === null) {
            res.json({
              user: "User not found!",
              result: false,
            });
          } else {
            res.json({
              user: result.document,
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

// Activate User

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
                collection: "users",
                database: "Ropstam-Dev",
                dataSource: "Ropstam",
                filter: {
                  _id: { $oid: req.params.id },
                },
                update: { $set: { status: "active" } },
              }),
            }
          );
          let result = await response.json();
          if (result.matchedCount > 0) {
            res.json({
              message: "User activated successfully!",
              result: true,
            });
          } else {
            res.json({
              message: "User not found",
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
        "There was a problem in retriving the users list, please try again.",
      result: false,
    });
  }
});

// Inactivate User

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
                collection: "users",
                database: "Ropstam-Dev",
                dataSource: "Ropstam",
                filter: {
                  _id: { $oid: req.params.id },
                },
                update: { $set: { status: "inactive" } },
              }),
            }
          );
          let result = await response.json();
          if (result.matchedCount > 0) {
            res.json({
              message: "User deactivated successfully!",
              result: true,
            });
          } else {
            res.json({
              message: "User not found",
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
        "There was a problem in retriving the users list, please try again.",
      result: false,
    });
  }
});

// Sign in User

router.post("/sign-in", async function (req, res, next) {
  try {
    const { error } = signin_schema.validate(req.body, { abortEarly: false });

    if (error) {
      // Retrieve all validation errors
      const errorDetails = error.details.map((err) => {
        return {
          field: err.path[0],
          message: err.message,
        };
      });

      return res.status(400).json({ result: false, errors: errorDetails });
    }
    const response = await fetch(`${process.env.BASE_URL}/action/findOne`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "api-key": process.env.API_KEY,
      },
      body: JSON.stringify({
        collection: "users",
        database: "Ropstam-Dev",
        dataSource: "Ropstam",
        filter: {
          emailAddress: req.body.emailAddress,
          password: req.body.password,
        },
      }),
    });

    let result = await response.json();
    console.log(result);
    if (result.document === null) {
      res.json({
        result: false,
        message: "You have entered invalid credentials",
      });
    } else if (result.document.status === "active") {
      // create a payload object
      const data = {
        id: req.body._id,
        emailAddress: req.body.emailAddress,
        password: req.body.password,
        userType: result.document.userType,
      };
      const payload = data;
      const ACCESS_TOKEN_SECRET = cryprto.randomBytes(64).toString("hex");
      // sign the payload with your secret key
      const token = jwt.sign(payload, ACCESS_TOKEN_SECRET);
      const getnewTOken = await fetch(
        `${process.env.BASE_URL}/action/updateOne`,
        {
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
            filter: { emailAddress: req.body.emailAddress },
            update: {
              $set: {
                secret: token,
                updatedAt: new Date(),
              },
            },
          }),
        }
      );
      console.log("SECTEYS", await getnewTOken.json());
      res.json({
        result: true,
        accessToken: token,
        type: result.document.userType,
        userName: result.document.firstName + " " + result.document.lastName,
        emailAddress: result.document.emailAddress,
        message: "You have successful login",
      });
    } else {
      res.json({
        result: false,
        message:
          "Your account has been deactivated. Please contact support to reactivate your account.",
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

// Sign up User

router.post("/sign-up", async function (req, res, next) {
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
          const { error } = signup_schema.validate(req.body, {
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
            `${process.env.BASE_URL}/action/findOne`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "api-key": process.env.API_KEY,
              },
              body: JSON.stringify({
                collection: "users",
                database: "Ropstam-Dev",
                dataSource: "Ropstam",
                filter: {
                  emailAddress: req.body.emailAddress,
                },
              }),
            }
          );
          let result = await response.json();
          if (result.document === null) {
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
                  collection: "users",
                  database: "Ropstam-Dev",
                  dataSource: "Ropstam",
                  document: {
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    userType: req.body.userType,
                    emailAddress: req.body.emailAddress,
                    mobileNumber: req.body.mobileNumber,
                    password: req.body.password,
                    status: "active",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                  },
                }),
              }
            );
            const tokenrequest = await fetch(
              `${process.env.BASE_URL}/action/insertOne`,
              {
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
                  document: {
                    emailAddress: req.body.emailAddress,
                    secret: "",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                  },
                }),
              }
            );
            console.log(await tokenrequest.json());
            let result = await response.json();
            res.json({
              result: true,
              message: "Account created successfully",
              userid: result.insertedId,
            });
          } else {
            res.json({
              message: "Email Already Exists",
              result: false,
            });
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

// Update User

router.post("/update", async function (req, res, next) {
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
          const { error } = userupdate_schema.validate(req.body, {
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
            `${process.env.BASE_URL}/action/updateOne`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "api-key": process.env.API_KEY,
              },

              body: JSON.stringify({
                collection: "users",
                database: "Ropstam-Dev",
                dataSource: "Ropstam",
                filter: {
                  _id: { $oid: req.body.id },
                },
                update: {
                  $set: {
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    userType: req.body.userType,
                    mobileNumber: req.body.mobileNumber,
                    updatedAt: new Date(),
                  },
                },
              }),
            }
          );
          let result = await response.json();
          if (result.matchedCount > 0) {
            res.json({
              message: "User updated successfully!",
              result: true,
            });
          } else {
            res.json({
              message: "User not found",
              result: false,
            });
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

// Reset Password

router.post("/reset-password", async function (req, res, next) {
  try {
    const response = await fetch(`${process.env.BASE_URL}/action/findOne`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "api-key": process.env.API_KEY,
      },

      body: JSON.stringify({
        collection: "users",
        database: "Ropstam-Dev",
        dataSource: "Ropstam",
        filter: {
          emailAddress: req.body.emailAddress,
        },
      }),
    });
    let result = await response.json();
    console.log(result);
    if (result.document !== null) {
      await fetch(`${process.env.BASE_URL}/action/updateOne`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "api-key": process.env.API_KEY,
        },

        body: JSON.stringify({
          collection: "users",
          database: "Ropstam-Dev",
          dataSource: "Ropstam",
          filter: {
            emailAddress: req.body.emailAddress,
          },
          update: {
            $set: {
              password: req.body.password,
            },
          },
        }),
      });
      res.json({
        message: "Password updated Successfully",
        result: true,
      });
    } else {
      res.json({
        message: "User not found",
        result: false,
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

module.exports = router;
