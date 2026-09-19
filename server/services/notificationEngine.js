function createPurchaseNotification(
    purchase,
    campaign
) {

    return {

        type: "purchase",

        name:
            purchase.name,

        location:
            purchase.location,

        product:
            purchase.product,

        message:
            campaign.message,

        campaignId:
            campaign._id,

        time:
            "just now",

        createdAt:
            new Date()

    };

}


// =====================================
// SEND TO VISITOR
// =====================================

function sendNotificationToVisitor(
    io,
    visitor,
    notification
) {

    io.to(
        `session:${visitor.sessionId}`
    ).emit(
        "social-proof-notification",
        notification
    );

}


module.exports = {

    createPurchaseNotification,

    sendNotificationToVisitor

};