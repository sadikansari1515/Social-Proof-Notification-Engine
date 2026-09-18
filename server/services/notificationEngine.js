function createPurchaseNotification(purchase) {

    return {

        type: "purchase",

        name: purchase.name,

        location: purchase.location,

        product: purchase.product,

        message:
            purchase.message ||
            `purchased ${purchase.product}`,

        time: "just now",

        createdAt: new Date()

    };

}


// =====================================
// SEND TO SESSION
// =====================================

function sendNotificationToSession(
    io,
    sessionId,
    notification
) {

    io.to(
        `session:${sessionId}`
    ).emit(
        "social-proof-notification",
        notification
    );

}


// =====================================
// SEND TO LOCATION
// =====================================

function sendNotificationToLocation(
    io,
    location,
    notification
) {

    io.to(
        `location:${location.toLowerCase()}`
    ).emit(
        "social-proof-notification",
        notification
    );

}


module.exports = {

    createPurchaseNotification,

    sendNotificationToSession,

    sendNotificationToLocation

};