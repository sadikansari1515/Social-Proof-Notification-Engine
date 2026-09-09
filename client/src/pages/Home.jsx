import { useEffect, useState } from "react";
import NotificationPopup from "../components/NotificationPopup";

function Home() {
  const [notification, setNotification] = useState({
    name: "Someone",
    location: "Delhi",
    message: "purchased this course",
    time: "2 minutes ago",
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setNotification(null);
    }, 6000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="home">
      <nav className="navbar">
        <h2>SocialProof</h2>

        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#reviews">Reviews</a>
          <button>Login</button>
        </div>
      </nav>

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

          <button className="buy-button">Buy Course →</button>
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
