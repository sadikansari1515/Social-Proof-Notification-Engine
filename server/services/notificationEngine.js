function createPurchaseNotification(purchase) {

    return {
        type: "purchase",

        name: purchase.name,

        location: purchase.location,

        product: purchase.product,

        message: `purchased ${purchase.product}`,

        time: "just now",

        createdAt: new Date()
    };
}


function sendNotification(io, notification) {

    io.emit("social-proof-notification", notification);

}


module.exports = {
    createPurchaseNotification,
    sendNotification
};