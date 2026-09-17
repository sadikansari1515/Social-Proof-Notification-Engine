import { useEffect, useState } from "react";
import { io } from "socket.io-client";

import NotificationPopup from "../components/NotificationPopup";
import { getSessionId } from "../utils/session";

const socket = io("http://localhost:5000");

function Home() {
  const [notification, setNotification] = useState(null);

  // =====================================
  // RECEIVE NOTIFICATION
  // =====================================

  useEffect(() => {
    socket.on("social-proof-notification", (data) => {
      console.log("Notification received:", data);

      setNotification(data);
    });

    return () => {
      socket.off("social-proof-notification");
    };
  }, []);

  // =====================================
  // TEST PURCHASE
  // =====================================

  const createPurchase = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/events/purchase",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            name: "Rahul",

            location: "Delhi",

            product: "React Masterclass",

            sessionId: getSessionId(),
          }),
        },
      );

      const data = await response.json();

      console.log("Purchase response:", data);
    } catch (error) {
      console.error("Purchase failed:", error);
    }
  };

  // =====================================
  // UI
  // =====================================

  return (
    <div>
      <h1>Full Stack Web Development</h1>

      <p>Learn React, Node.js, Express and MongoDB.</p>

      {/* TEST PURCHASE BUTTON */}

      <button onClick={createPurchase}>Test Purchase</button>

      {/* NOTIFICATION */}

      {notification && (
        <NotificationPopup
          notification={notification}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
}

export default Home;
