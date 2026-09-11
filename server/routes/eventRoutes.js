const express = require("express");

const Event = require("../models/Event");
const Notification = require("../models/Notification");

const {
  createPurchaseNotification,
  sendNotification,
} = require("../services/notificationEngine");

const router = express.Router();

router.post("/purchase", async (req, res) => {
  try {
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

    // 1. Create notification

    const notificationData = createPurchaseNotification(purchase);

    // 2. Save notification

    const notification = await Notification.create(notificationData);

    // 3. Save actual event

    await Event.create({
      type: "purchase",

      name,

      location,

      product,

      notificationId: notification._id,
    });

    // 4. Send notification to visitors

    const io = req.app.get("io");

    sendNotification(io, notification);

    res.status(201).json({
      message: "Purchase event processed successfully",

      notification,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to process purchase event",

      error: error.message,
    });
  }
});

module.exports = router;
