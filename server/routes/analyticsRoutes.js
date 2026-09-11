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

module.exports = router;
