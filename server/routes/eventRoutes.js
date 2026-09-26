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

// ============================================
// POST /api/events/purchase
// ============================================

router.post("/purchase", async (req, res) => {
  try {
    // ----------------------------------------
    // 1. Get purchase data
    // ----------------------------------------

    const { name, location, product, sessionId } = req.body;

    // ----------------------------------------
    // 2. Validate request
    // ----------------------------------------

    if (!name || !location || !product || !sessionId) {
      return res.status(400).json({
        message: "name, location, product and sessionId are required",
      });
    }

    // ----------------------------------------
    // 3. Find best campaign
    // ----------------------------------------

    const campaign = await findBestCampaign(product, location);

    // ----------------------------------------
    // 4. No campaign found
    // ----------------------------------------

    if (!campaign) {
      // Purchase still happened,
      // so save the purchase event.

      await Event.create({
        type: "purchase",

        name,

        location,

        product,

        sessionId,

        metadata: {
          source: "purchase",
        },
      });

      return res.status(200).json({
        message: "Purchase recorded but no eligible campaign found",

        notification: null,
      });
    }

    // ----------------------------------------
    // 5. Find eligible visitors
    // ----------------------------------------

    const visitors = await findEligibleVisitors(campaign);

    // ----------------------------------------
    // 6. Save actual purchase event ONCE
    // ----------------------------------------

    await Event.create({
      type: "purchase",

      name,

      location,

      product,

      sessionId,

      metadata: {
        source: "purchase",
        campaignId: campaign._id,
      },
    });

    // ----------------------------------------
    // 7. No eligible visitors
    // ----------------------------------------

    if (visitors.length === 0) {
      return res.status(200).json({
        message: "Purchase recorded but no eligible visitors found",

        campaignId: campaign._id,

        visitorsNotified: 0,
      });
    }

    // ----------------------------------------
    // 8. Create notification data
    // ----------------------------------------

    const notificationData = createPurchaseNotification(
      {
        name,
        location,
        product,
      },

      campaign,
    );

    // ----------------------------------------
    // 9. Send notification to visitors
    // ----------------------------------------

    await Promise.all(
      visitors.map(async (visitor) => {
        // Create notification
        // specifically for this visitor

        const notification = await Notification.create({
          ...notificationData,

          sessionId: visitor.sessionId,
        });

        // --------------------------------
        // Delay
        // --------------------------------

        if (campaign.delay > 0) {
          await new Promise((resolve) => {
            setTimeout(resolve, campaign.delay * 1000);
          });
        }

        // --------------------------------
        // Send through Socket.IO
        // --------------------------------

        sendNotificationToVisitor(
          req.app.get("io"),

          visitor,

          notification,
        );
      }),
    );

    // ----------------------------------------
    // 10. Response
    // ----------------------------------------

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
