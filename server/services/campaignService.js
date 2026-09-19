const Campaign = require("../models/Campaign");


async function findBestCampaign(
    product,
    location
) {

    const now = new Date();


    const campaigns =
        await Campaign.find({

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


    const eligibleCampaigns =
        campaigns.filter(
            (campaign) => {

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

            }
        );


    if (
        eligibleCampaigns.length === 0
    ) {

        return null;

    }


    eligibleCampaigns.sort(
        (a, b) =>
            b.priority - a.priority
    );


    return eligibleCampaigns[0];

}


module.exports = {
    findBestCampaign
};