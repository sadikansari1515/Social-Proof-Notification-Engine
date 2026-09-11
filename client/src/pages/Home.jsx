import { useEffect, useState } from "react";
import { io } from "socket.io-client";

import NotificationPopup from "../components/NotificationPopup";

import { trackConversion } from "../services/analytics";

const socket = io("http://localhost:5000");

function Home() {
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    socket.on("social-proof-notification", (data) => {
      setNotification(data);

      setTimeout(() => {
        setNotification(null);
      }, 6000);
    });

    return () => {
      socket.off("social-proof-notification");
    };
  }, []);

  return (
    <div className="home">
      {/* Your existing navbar */}

      <nav className="navbar">
        <h2>SocialProof</h2>

        <div className="nav-links">
          <a href="#features">Features</a>

          <a href="#reviews">Reviews</a>

          <button>Login</button>
        </div>
      </nav>

      {/* Your existing course section */}

      <main className="hero">
        <div className="hero-content">
          <span className="badge">🚀 Best Selling Course</span>

          <h1>Full Stack Web Development</h1>

          <p className="description">
            Learn HTML, CSS, JavaScript, React, Node.js, Express and MongoDB by
            building real-world projects.
          </p>

          <div className="stats">
            <div>
              <strong>⭐ 4.8</strong>
              <span>Rating</span>
            </div>

            <div>
              <strong>1,250+</strong>
              <span>Students</span>
            </div>

            <div>
              <strong>42 Hours</strong>
              <span>Content</span>
            </div>
          </div>

          <div className="price">
            <span className="old-price">₹1,999</span>

            <strong>₹999</strong>

            <span className="discount">50% OFF</span>
          </div>

          <button
            className="buy-button"
            onClick={() => {
              if (notification?._id) {
                trackConversion(notification._id);
              }

              alert("Course purchased successfully!");
            }}
          >
            Buy Course
          </button>
        </div>
      </main>

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
