const express = require("express");

const Campaign = require("../models/Campaign");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// ============================================
// CREATE CAMPAIGN
// ============================================

router.post("/", protect, async (req, res) => {
  try {
    const campaign = await Campaign.create({
      ...req.body,

      userId: req.user._id,
    });

    res.status(201).json({
      message: "Campaign created successfully",

      campaign,
    });
  } catch (error) {
    console.error("Create campaign error:", error);

    res.status(500).json({
      message: "Failed to create campaign",

      error: error.message,
    });
  }
});

// ============================================
// GET ALL USER CAMPAIGNS
// ============================================

router.get("/", protect, async (req, res) => {
  try {
    const campaigns = await Campaign.find({
      userId: req.user._id,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      campaigns,
    });
  } catch (error) {
    console.error("Get campaigns error:", error);

    res.status(500).json({
      message: "Failed to fetch campaigns",

      error: error.message,
    });
  }
});

// ============================================
// GET SINGLE CAMPAIGN
// ============================================

router.get("/:id", protect, async (req, res) => {
  try {
    const campaign = await Campaign.findOne({
      _id: req.params.id,

      userId: req.user._id,
    });

    if (!campaign) {
      return res.status(404).json({
        message: "Campaign not found",
      });
    }

    res.status(200).json({
      campaign,
    });
  } catch (error) {
    console.error("Get campaign error:", error);

    res.status(500).json({
      message: "Failed to fetch campaign",

      error: error.message,
    });
  }
});

// ============================================
// UPDATE CAMPAIGN
// ============================================

router.put("/:id", protect, async (req, res) => {
  try {
    const campaign = await Campaign.findOneAndUpdate(
      {
        _id: req.params.id,

        userId: req.user._id,
      },

      req.body,

      {
        new: true,

        runValidators: true,
      },
    );

    if (!campaign) {
      return res.status(404).json({
        message: "Campaign not found",
      });
    }

    res.status(200).json({
      message: "Campaign updated successfully",

      campaign,
    });
  } catch (error) {
    console.error("Update campaign error:", error);

    res.status(500).json({
      message: "Failed to update campaign",

      error: error.message,
    });
  }
});

// ============================================
// DELETE CAMPAIGN
// ============================================

router.delete("/:id", protect, async (req, res) => {
  try {
    const campaign = await Campaign.findOneAndDelete({
      _id: req.params.id,

      userId: req.user._id,
    });

    if (!campaign) {
      return res.status(404).json({
        message: "Campaign not found",
      });
    }

    res.status(200).json({
      message: "Campaign deleted successfully",
    });
  } catch (error) {
    console.error("Delete campaign error:", error);

    res.status(500).json({
      message: "Failed to delete campaign",

      error: error.message,
    });
  }
});

module.exports = router;
