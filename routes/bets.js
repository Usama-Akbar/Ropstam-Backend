var express = require("express");
var router = express.Router();
require("dotenv").config();
const bet_schema = require("../utils/Schema/BetValidation");

router.post("/play", async function (req, res, next) {
  try {
    const { error } = bet_schema.validate(req.body, { abortEarly: false });

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
        },
      }),
    });
    let result = await response.json();
    if (result.document === null) {
      res.json({
        user: "User not found!",
        result: false,
      });
    } else if (
      parseInt(req.body.Deductedbalance) > parseInt(result.document.balance)
    ) {
      res.json({
        message: "You don't have enough balance to bet",
        result: false,
      });
    } else {
      const deducted_response = await fetch(
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
            database: process.env.DATA_BASE,
            dataSource: process.env.DATA_SOURCE,
            filter: {
              emailAddress: req.body.emailAddress,
            },
            update: { $inc: { balance: -parseInt(req.body.Deductedbalance) } },
          }),
        }
      );

      let deducted_result = await deducted_response.json();
      const betting_response = await fetch(
        `${process.env.BASE_URL}/action/insertOne`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "api-key": process.env.API_KEY,
          },
          body: JSON.stringify({
            collection: "history",
            database: process.env.DATA_BASE,
            dataSource: process.env.DATA_SOURCE,
            document: {
              emailAddress: req.body.emailAddress,
              betType: req.body.betType,
              Deductedbalance: parseInt(req.body.Deductedbalance),
              updatedAt: new Date(),
            },
          }),
        }
      );
      let betting_result = await betting_response.json();
      res.json({
        message: `${result.document.firstName} ${result.document.lastName} has bet "${req.body.betType}" with the amount of ${req.body.Deductedbalance}$`,
        result: true,
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

router.post("/transaction-history", async function (req, res, next) {
  try {
    const response = await fetch(`${process.env.BASE_URL}/action/find`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "api-key": process.env.API_KEY,
      },
      body: JSON.stringify({
        collection: "history",
        database: process.env.DATA_BASE,
        dataSource: process.env.DATA_SOURCE,
        filter: {
          emailAddress: req.body.emailAddress,
        },
      }),
    });
    let result = await response.json();
    if (result.documents.length === 0) {
      res.json({
        message: "History not available!",
        result: false,
      });
    } else {
      res.json({
        history: result.documents,
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
module.exports = router;
