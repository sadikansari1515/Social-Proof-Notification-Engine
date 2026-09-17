const Campaign = require("../models/Campaign");
const Notification = require("../models/Notification");


async function findBestCampaign(
    product,
    location,
    sessionId
) {

    const now = new Date();


    // =====================================
    // 1. FIND ACTIVE CAMPAIGNS
    // =====================================

    const campaigns = await Campaign.find({

        active: true,

        product: product,

        startDate: {
            $lte: now
        },

        $or: [
            {
                endDate: null
            },
            {
                endDate: {
                    $gte: now
                }
            }
        ]

    });


    // =====================================
    // 2. FILTER BY LOCATION
    // =====================================

    const locationMatchedCampaigns =
        campaigns.filter((campaign) => {

            // Empty locations = all locations
            if (
                !campaign.locations ||
                campaign.locations.length === 0
            ) {
                return true;
            }

            return campaign.locations.some(
                (campaignLocation) =>
                    campaignLocation.toLowerCase() ===
                    location.toLowerCase()
            );

        });


    // =====================================
    // 3. CHECK FREQUENCY LIMIT
    // =====================================

    const eligibleCampaigns = [];


    for (const campaign of locationMatchedCampaigns) {

        const notificationCount =
            await Notification.countDocuments({

                campaignId: campaign._id,

                sessionId: sessionId

            });


        if (
            notificationCount <
            campaign.frequencyLimit
        ) {

            eligibleCampaigns.push(campaign);

        }

    }


    // =====================================
    // 4. NO ELIGIBLE CAMPAIGN
    // =====================================

    if (eligibleCampaigns.length === 0) {

        return null;

    }


    // =====================================
    // 5. SORT BY PRIORITY
    // =====================================

    eligibleCampaigns.sort(
        (a, b) =>
            b.priority - a.priority
    );


    // =====================================
    // 6. RETURN BEST CAMPAIGN
    // =====================================

    return eligibleCampaigns[0];

}


module.exports = {
    findBestCampaign
};