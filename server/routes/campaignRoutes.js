const express = require("express");

const Campaign = require("../models/Campaign");

const router = express.Router();

// =====================================
// CREATE CAMPAIGN
// =====================================

router.post("/", async (req, res) => {
  try {
    const { name, product, message, locations, active, startDate, endDate } =
      req.body;

    if (!name || !product || !message) {
      return res.status(400).json({
        message: "name, product and message are required",
      });
    }

    const campaign = await Campaign.create({
      name,
      product,
      message,
      locations: locations || [],

      active: active !== undefined ? active : true,

      startDate: startDate || new Date(),

      endDate: endDate || null,
    });

    res.status(201).json({
      message: "Campaign created successfully",

      campaign,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create campaign",

      error: error.message,
    });
  }
});

// =====================================
// GET ALL CAMPAIGNS
// =====================================

router.get("/", async (req, res) => {
  try {
    const campaigns = await Campaign.find().sort({
      createdAt: -1,
    });

    res.json(campaigns);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch campaigns",

      error: error.message,
    });
  }
});

// =====================================
// GET SINGLE CAMPAIGN
// =====================================

router.get("/:id", async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({
        message: "Campaign not found",
      });
    }

    res.json(campaign);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch campaign",

      error: error.message,
    });
  }
});

// =====================================
// UPDATE CAMPAIGN
// =====================================

router.put("/:id", async (req, res) => {
  try {
    const campaign = await Campaign.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!campaign) {
      return res.status(404).json({
        message: "Campaign not found",
      });
    }

    res.json({
      message: "Campaign updated successfully",

      campaign,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to update campaign",

      error: error.message,
    });
  }
});

// =====================================
// DELETE CAMPAIGN
// =====================================

router.delete("/:id", async (req, res) => {
  try {
    const campaign = await Campaign.findByIdAndDelete(req.params.id);

    if (!campaign) {
      return res.status(404).json({
        message: "Campaign not found",
      });
    }

    res.json({
      message: "Campaign deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to delete campaign",

      error: error.message,
    });
  }
});

module.exports = router;
