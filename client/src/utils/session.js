export function getSessionId() {
    let sessionId = sessionStorage.getItem("sessionId");

    if (!sessionId) {
        sessionId = crypto.randomUUID();

        sessionStorage.setItem(
            "sessionId",
            sessionId
        );
    }

    return sessionId;
}