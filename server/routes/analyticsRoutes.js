const express = require("express");

const Event = require("../models/Event");
const Notification = require("../models/Notification");

const router = express.Router();

// ===============================
// IMPRESSION
// ===============================

router.post("/impression", async (req, res) => {
  try {
    const { notificationId, sessionId } = req.body;

    if (!notificationId) {
      return res.status(400).json({
        message: "notificationId is required",
      });
    }

    const notification = await Notification.findById(notificationId);

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found",
      });
    }

    // Increase impression count
    notification.impressions += 1;

    await notification.save();

    const io = req.app.get("io");

    io.emit("analytics-updated", {
      type: "impression",
      notificationId,
    });

    // Store analytics event
    await Event.create({
      type: "impression",
      notificationId,
      sessionId,
    });

    res.status(201).json({
      message: "Impression tracked successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to track impression",
      error: error.message,
    });
  }
});

// ===============================
// CLICK
// ===============================

router.post("/click", async (req, res) => {
  try {
    const { notificationId, sessionId } = req.body;

    if (!notificationId) {
      return res.status(400).json({
        message: "notificationId is required",
      });
    }

    const notification = await Notification.findById(notificationId);

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found",
      });
    }

    // Increase click count
    notification.clicks += 1;

    await notification.save();

    const io = req.app.get("io");

io.emit("analytics-updated", {
    type: "click",
    notificationId
});

    // Store analytics event
    await Event.create({
      type: "click",
      notificationId,
      sessionId,
    });

    res.status(201).json({
      message: "Click tracked successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to track click",
      error: error.message,
    });
  }
});

// ===============================
// CONVERSION
// ===============================

router.post("/conversion", async (req, res) => {
  try {
    const { notificationId, sessionId } = req.body;

    if (!notificationId) {
      return res.status(400).json({
        message: "notificationId is required",
      });
    }

    const notification = await Notification.findById(notificationId);

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found",
      });
    }

    // Increase conversion count
    notification.conversions += 1;

    await notification.save();

    io.emit("analytics-updated", {
    type: "conversion",
    notificationId
});

    // Store analytics event
    await Event.create({
      type: "conversion",
      notificationId,
      sessionId,
    });

    res.status(201).json({
      message: "Conversion tracked successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to track conversion",
      error: error.message,
    });
  }
});

// ===============================
// ANALYTICS SUMMARY
// ===============================

router.get("/summary", async (req, res) => {
  try {
    const result = await Notification.aggregate([
      {
        $group: {
          _id: null,

          totalImpressions: {
            $sum: "$impressions",
          },

          totalClicks: {
            $sum: "$clicks",
          },

          totalConversions: {
            $sum: "$conversions",
          },
        },
      },
    ]);

    const data = result[0] || {
      totalImpressions: 0,
      totalClicks: 0,
      totalConversions: 0,
    };

    const ctr =
      data.totalImpressions > 0
        ? (data.totalClicks / data.totalImpressions) * 100
        : 0;

    const conversionRate =
      data.totalClicks > 0
        ? (data.totalConversions / data.totalClicks) * 100
        : 0;

    res.json({
      totalImpressions: data.totalImpressions,

      totalClicks: data.totalClicks,

      totalConversions: data.totalConversions,

      ctr: Number(ctr.toFixed(2)),

      conversionRate: Number(conversionRate.toFixed(2)),
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch analytics summary",

      error: error.message,
    });
  }
});

// ===============================
// NOTIFICATION PERFORMANCE
// ===============================

router.get("/notifications", async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });

    const data = notifications.map((notification) => {
      const ctr =
        notification.impressions > 0
          ? (notification.clicks / notification.impressions) * 100
          : 0;

      const conversionRate =
        notification.clicks > 0
          ? (notification.conversions / notification.clicks) * 100
          : 0;

      return {
        id: notification._id,
        name: notification.name,
        location: notification.location,
        product: notification.product,

        impressions: notification.impressions,

        clicks: notification.clicks,

        conversions: notification.conversions,

        ctr: Number(ctr.toFixed(2)),

        conversionRate: Number(conversionRate.toFixed(2)),

        createdAt: notification.createdAt,
      };
    });

    res.json(data);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch notification analytics",

      error: error.message,
    });
  }
});

module.exports = router;
