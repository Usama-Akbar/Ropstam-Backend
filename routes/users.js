var express = require("express");
var router = express.Router();
require("dotenv").config();
const signin_schema = require("../utils/Schema/AuthValidation/signin");
const signup_schema = require("../utils/Schema/AuthValidation/signup");
const deposit_schema = require("../utils/Schema/AuthValidation/deposit");

// Get Users List

router.get("/list", async function (req, res, next) {
  try {
    const response = await fetch(`${process.env.BASE_URL}/action/find`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "api-key": process.env.API_KEY,
      },
      body: JSON.stringify({
        collection: "users",
        database: process.env.DATA_BASE,
        dataSource: process.env.DATA_SOURCE,
      }),
    });
    let result = await response.json();
    res.json({
      users: result.documents,
      result: true,
    });
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
    const response = await fetch(`${process.env.BASE_URL}/action/findOne`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "api-key": process.env.API_KEY,
      },
      body: JSON.stringify({
        collection: "users",
        database: process.env.DATA_BASE,
        dataSource: process.env.DATA_SOURCE,
        filter: {
          _id: { $oid: req.params.id },
        },
      }),
    });
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
        database: process.env.DATA_BASE,
        dataSource: process.env.DATA_SOURCE,
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
    } else {
      res.json({
        result: true,
        type: result.document.userType,
        userName: result.document.firstName + " " + result.document.lastName,
        emailAddress: result.document.emailAddress,
        balance: result.document.balance,
        mobileNumber: result.document.mobileNumber,
        message: "You have successful login",
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

// Deposit Balance

router.post("/deposit-balance", async function (req, res, next) {
  try {
    const { error } = deposit_schema.validate(req.body, { abortEarly: false });

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
    const response = await fetch(`${process.env.BASE_URL}/action/updateOne`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "api-key": process.env.API_KEY,
      },
      body: JSON.stringify({
        collection: "users",
        database: process.env.DATA_BASE,
        dataSource: process.env.DATA_SOURCE,
        filter: {
          emailAddress: req.body.emailAddress,
        },
        update: { $inc: { balance: req.body.balance } },
      }),
    });

    let result = await response.json();
    console.log(result);
    if (result.matchedCount === 0) {
      res.json({
        result: false,
        message: "User not found",
      });
    } else {
      res.json({
        result: true,
        message: "Balance Added Successfully",
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
    const response = await fetch(`${process.env.BASE_URL}/action/findOne`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "api-key": process.env.API_KEY,
      },
      body: JSON.stringify({
        collection: "users",
        database: process.env.DATA_BASE,
        dataSource: process.env.DATA_SOURCE,
        filter: {
          emailAddress: req.body.emailAddress,
        },
      }),
    });
    let result = await response.json();
    if (result.document === null) {
      const response = await fetch(`${process.env.BASE_URL}/action/insertOne`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "api-key": process.env.API_KEY,
        },
        body: JSON.stringify({
          collection: "users",
          database: process.env.DATA_BASE,
          dataSource: process.env.DATA_SOURCE,
          document: {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            emailAddress: req.body.emailAddress,
            mobileNumber: req.body.mobileNumber,
            password: req.body.password,
            balance: 0,
            status: "active",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        }),
      });

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
