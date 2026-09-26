const Campaign = require("../models/Campaign");

// ============================================
// Find eligible campaigns
// ============================================

async function findEligibleCampaigns(product, location) {
  const now = new Date();

  const campaigns = await Campaign.find({
    active: true,

    product: product,

    startDate: {
      $lte: now,
    },

    $or: [
      {
        endDate: null,
      },
      {
        endDate: {
          $gte: now,
        },
      },
    ],
  });

  // ----------------------------------------
  // Location filtering
  // ----------------------------------------

  const eligibleCampaigns = campaigns.filter((campaign) => {
    // Empty locations means
    // all locations are allowed

    if (!campaign.locations || campaign.locations.length === 0) {
      return true;
    }

    return campaign.locations.some(
      (campaignLocation) =>
        campaignLocation.toLowerCase() === location.toLowerCase(),
    );
  });

  return eligibleCampaigns;
}

// ============================================
// Weighted random selection
// ============================================

function selectWeightedCampaign(campaigns) {
  if (campaigns.length === 0) {
    return null;
  }

  // ----------------------------------------
  // Find highest priority
  // ----------------------------------------

  const highestPriority = Math.max(
    ...campaigns.map((campaign) => campaign.priority),
  );

  // ----------------------------------------
  // Only highest priority campaigns
  // participate in random selection
  // ----------------------------------------

  const priorityCampaigns = campaigns.filter(
    (campaign) => campaign.priority === highestPriority,
  );

  // ----------------------------------------
  // Calculate total weight
  // ----------------------------------------

  const totalWeight = priorityCampaigns.reduce(
    (total, campaign) => total + (campaign.weight || 1),
    0,
  );

  // ----------------------------------------
  // Random number
  // ----------------------------------------

  let random = Math.random() * totalWeight;

  // ----------------------------------------
  // Select campaign
  // ----------------------------------------

  for (const campaign of priorityCampaigns) {
    random -= campaign.weight || 1;

    if (random <= 0) {
      return campaign;
    }
  }

  // Fallback
  return priorityCampaigns[priorityCampaigns.length - 1];
}

// ============================================
// Main function
// ============================================

async function findBestCampaign(product, location) {
  const campaigns = await findEligibleCampaigns(product, location);

  if (campaigns.length === 0) {
    return null;
  }

  return selectWeightedCampaign(campaigns);
}

module.exports = {
  findEligibleCampaigns,
  selectWeightedCampaign,
  findBestCampaign,
};
