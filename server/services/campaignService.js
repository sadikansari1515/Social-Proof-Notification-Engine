const Campaign = require("../models/Campaign");

async function findBestCampaign(product, location) {
  const now = new Date();

  // =====================================
  // FIND ACTIVE CAMPAIGNS
  // =====================================

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

  // =====================================
  // FILTER BY LOCATION
  // =====================================

  const eligibleCampaigns = campaigns.filter((campaign) => {
    // Empty locations = all locations
    if (campaign.locations.length === 0) {
      return true;
    }

    return campaign.locations.some(
      (campaignLocation) =>
        campaignLocation.toLowerCase() === location.toLowerCase(),
    );
  });

  // =====================================
  // NO CAMPAIGN
  // =====================================

  if (eligibleCampaigns.length === 0) {
    return null;
  }

  // =====================================
  // SORT BY PRIORITY
  // =====================================

  eligibleCampaigns.sort((a, b) => b.priority - a.priority);

  // =====================================
  // RETURN BEST CAMPAIGN
  // =====================================

  return eligibleCampaigns[0];
}

module.exports = {
  findBestCampaign,
};
