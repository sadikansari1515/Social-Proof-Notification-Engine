const express = require("express");

const Event = require("../models/Event");
const Notification = require("../models/Notification");
const Campaign = require("../models/Campaign");

const { sendNotification } = require("../services/notificationEngine");

const router = express.Router();

// =====================================
// PURCHASE EVENT
// =====================================

router.post("/purchase", async (req, res) => {
  try {
    const { name, location, product } = req.body;

    // =====================================
    // 1. VALIDATE REQUEST
    // =====================================

    if (!name || !location || !product) {
      return res.status(400).json({
        message: "name, location and product are required",
      });
    }

    // =====================================
    // 2. FIND ACTIVE CAMPAIGN
    // =====================================

    const campaign = await Campaign.findOne({
      active: true,
      product: product,
    });

    // =====================================
    // 3. IF NO CAMPAIGN EXISTS
    // =====================================

    if (!campaign) {
      return res.status(200).json({
        message: "Purchase recorded but no active campaign found",
      });
    }

    // =====================================
    // 4. CREATE NOTIFICATION
    // =====================================

    const notificationData = {
      type: "purchase",

      name: name,

      location: location,

      product: product,

      message: campaign.message,

      time: "just now",

      createdAt: new Date(),
    };

    // =====================================
    // 5. SAVE NOTIFICATION
    // =====================================

    const notification = await Notification.create(notificationData);

    // =====================================
    // 6. SAVE PURCHASE EVENT
    // =====================================

    await Event.create({
      type: "purchase",

      name: name,

      location: location,

      product: product,

      notificationId: notification._id,
    });

    // =====================================
    // 7. SEND REAL-TIME NOTIFICATION
    // =====================================

    const io = req.app.get("io");

    sendNotification(io, notification);

    // =====================================
    // 8. SEND RESPONSE
    // =====================================

    res.status(201).json({
      message: "Purchase event processed successfully",

      notification,
    });
  } catch (error) {
    console.error("Purchase event error:", error);

    res.status(500).json({
      message: "Failed to process purchase event",

      error: error.message,
    });
  }
});

module.exports = router;
