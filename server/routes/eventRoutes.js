const express = require("express");

const Event = require("../models/Event");
const Notification = require("../models/Notification");

const { findBestCampaign } = require("../services/campaignService");

const { findEligibleVisitors } = require("../services/targetingService");

const {
  createPurchaseNotification,
  sendNotificationToVisitor,
} = require("../services/notificationEngine");

const router = express.Router();

// =====================================
// PURCHASE EVENT
// =====================================

router.post("/purchase", async (req, res) => {
  try {
    const { name, location, product, sessionId } = req.body;

    // =====================================
    // 1. VALIDATE
    // =====================================

    if (!name || !location || !product || !sessionId) {
      return res.status(400).json({
        message: "name, location, product and sessionId are required",
      });
    }

    // =====================================
    // 2. FIND CAMPAIGN
    // =====================================

    const campaign = await findBestCampaign(product, location);

    if (!campaign) {
      return res.status(200).json({
        message: "No eligible campaign found",

        notification: null,
      });
    }

    // =====================================
    // 3. FIND VISITORS
    // =====================================

    const visitors = await findEligibleVisitors(campaign);

    // =====================================
    // 4. NO VISITORS
    // =====================================

    if (visitors.length === 0) {
      return res.status(200).json({
        message: "Campaign found but no eligible visitors",

        notification: null,
      });
    }

    // =====================================
    // 5. CREATE BASE NOTIFICATION
    // =====================================

    const notificationData = createPurchaseNotification(
      {
        name,
        location,
        product,
      },
      campaign,
    );

    // =====================================
    // 6. SEND TO EACH VISITOR
    // =====================================

    for (const visitor of visitors) {
      const notification = await Notification.create({
        ...notificationData,

        sessionId: visitor.sessionId,
      });

      // Send notification
      sendNotificationToVisitor(
        req.app.get("io"),

        visitor,

        notification,
      );

      // Save event
      await Event.create({
        type: "purchase",

        name,

        location,

        product,

        notificationId: notification._id,

        sessionId: visitor.sessionId,

        metadata: {
          campaignId: campaign._id,

          sourceSessionId: sessionId,
        },
      });
    }

    // =====================================
    // 7. RESPONSE
    // =====================================

    res.status(201).json({
      message: "Purchase event processed successfully",

      campaignId: campaign._id,

      visitorsNotified: visitors.length,
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
