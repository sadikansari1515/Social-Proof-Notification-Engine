const Visitor = require("../models/Visitor");
const Notification = require("../models/Notification");


// =====================================
// FIND ELIGIBLE VISITORS
// =====================================

async function findEligibleVisitors(
    campaign
) {

    const visitors =
        await Visitor.find({
            online: true
        });


    const eligibleVisitors = [];


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
        // FREQUENCY CHECK
        // =====================================

        const notificationCount =
            await Notification.countDocuments({

                campaignId:
                    campaign._id,

                sessionId:
                    visitor.sessionId

            });


        if (
            notificationCount >=
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