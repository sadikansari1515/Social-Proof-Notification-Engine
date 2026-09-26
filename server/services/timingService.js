const Event = require("../models/Event");


async function isVisitorOnCooldown(
    sessionId,
    campaignId,
    cooldown
) {

    const cooldownTime =
        new Date(
            Date.now() -
            cooldown * 1000
        );


    const recentImpression =
        await Event.findOne({

            type: "impression",

            sessionId: sessionId,

            "metadata.campaignId":
                campaignId,

            createdAt: {
                $gte: cooldownTime
            }

        }).sort({
            createdAt: -1
        });


    if (!recentImpression) {

        return false;

    }


    return true;

}


module.exports = {
    isVisitorOnCooldown
};