const Visitor = require("../models/Visitor");
const Event = require("../models/Event");


// =====================================
// FIND ELIGIBLE VISITORS
// =====================================

async function findEligibleVisitors(campaign) {

    // =====================================
    // 1. FIND ONLINE VISITORS
    // =====================================

    const visitors = await Visitor.find({
        online: true
    });


    const eligibleVisitors = [];


    // =====================================
    // 2. CHECK EVERY VISITOR
    // =====================================

    for (const visitor of visitors) {

        // =====================================
        // LOCATION CHECK
        // =====================================

        const locationMatches =
            !campaign.locations ||
            campaign.locations.length === 0 ||
            campaign.locations.some(
                (location) =>
                    location.toLowerCase() ===
                    visitor.location.toLowerCase()
            );


        if (!locationMatches) {
            continue;
        }


        // =====================================
        // IMPRESSION COUNT
        // =====================================

        const impressionCount =
            await Event.countDocuments({

                type: "impression",

                sessionId:
                    visitor.sessionId,

                "metadata.campaignId":
                    campaign._id

            });


        // =====================================
        // FREQUENCY LIMIT
        // =====================================

        if (
            impressionCount >=
            campaign.frequencyLimit
        ) {

            continue;

        }


        // =====================================
        // VISITOR IS ELIGIBLE
        // =====================================

        eligibleVisitors.push(
            visitor
        );

    }


    return eligibleVisitors;

}


module.exports = {
    findEligibleVisitors
};