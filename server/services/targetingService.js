const Visitor = require("../models/Visitor");
const Event = require("../models/Event");

const {
    isVisitorOnCooldown
} = require("./timingService");


// =====================================
// FIND ELIGIBLE VISITORS
// =====================================

async function findEligibleVisitors(
    campaign
) {

    // =====================================
    // FIND ONLINE VISITORS
    // =====================================

    const visitors =
        await Visitor.find({
            online: true
        });


    const eligibleVisitors = [];


    // =====================================
    // CHECK EACH VISITOR
    // =====================================

    for (
        const visitor of visitors
    ) {

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

        const impressionCount =
            await Event.countDocuments({

                type: "impression",

                sessionId:
                    visitor.sessionId,

                "metadata.campaignId":
                    campaign._id

            });


        if (
            impressionCount >=
            campaign.frequencyLimit
        ) {

            continue;

        }


        // =====================================
        // COOLDOWN CHECK
        // =====================================

        const onCooldown =
    await isVisitorOnCooldown(

        visitor.sessionId,

        campaign._id,

        campaign.cooldown

    );


        if (onCooldown) {

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