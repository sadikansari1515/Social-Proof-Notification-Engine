const express = require("express");

const {
  createPurchaseNotification,
  sendNotification,
} = require("../services/notificationEngine");

const router = express.Router();

router.post("/purchase", (req, res) => {
  const { name, location, product } = req.body;

  if (!name || !location || !product) {
    return res.status(400).json({
      message: "name, location and product are required",
    });
  }

  const purchase = {
    name,
    location,
    product,
  };

  const notification = createPurchaseNotification(purchase);

  sendNotification(req.app.get("io"), notification);

  res.status(201).json({
    message: "Purchase event processed",
    notification,
  });
});

module.exports = router;
