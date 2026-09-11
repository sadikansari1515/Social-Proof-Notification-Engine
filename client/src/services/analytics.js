import { getSessionId } from "../utils/session";

const API_URL = "http://localhost:5000/api/analytics";

export async function trackImpression(notificationId) {
    try {
        await fetch(`${API_URL}/impression`, {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                notificationId,
                sessionId: getSessionId()
            })
        });

    } catch (error) {
        console.error(
            "Failed to track impression:",
            error
        );
    }
}


export async function trackClick(notificationId) {
    try {
        await fetch(`${API_URL}/click`, {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                notificationId,
                sessionId: getSessionId()
            })
        });

    } catch (error) {
        console.error(
            "Failed to track click:",
            error
        );
    }
}


export async function trackConversion(notificationId) {
    try {
        await fetch(`${API_URL}/conversion`, {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                notificationId,
                sessionId: getSessionId()
            })
        });

    } catch (error) {
        console.error(
            "Failed to track conversion:",
            error
        );
    }
}