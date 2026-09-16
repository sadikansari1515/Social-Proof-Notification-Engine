const express = require("express");

const Event = require("../models/Event");
const Notification = require("../models/Notification");

const { findBestCampaign } = require("../services/campaignService");

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
    // 2. FIND BEST CAMPAIGN
    // =====================================

    const campaign = await findBestCampaign(product, location);

    // =====================================
    // 3. NO ELIGIBLE CAMPAIGN
    // =====================================

    if (!campaign) {
      return res.status(200).json({
        message: "No eligible campaign found",

        notification: null,
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

      campaignId: campaign._id,

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

      metadata: {
        campaignId: campaign._id,
      },
    });

    // =====================================
    // 7. SEND REAL-TIME NOTIFICATION
    // =====================================

    const io = req.app.get("io");

    sendNotification(io, notification);

    // =====================================
    // 8. RESPONSE
    // =====================================

    res.status(201).json({
      message: "Purchase event processed successfully",

      campaignId: campaign._id,

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
