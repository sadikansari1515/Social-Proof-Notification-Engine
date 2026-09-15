import AnalyticsChart from "../components/AnalyticsChart";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";

import StatCard from "../components/StatCard";

const socket = io("http://localhost:5000");

function Dashboard() {
  const [summary, setSummary] = useState(null);

  const [notifications, setNotifications] = useState([]);

  const [loading, setLoading] = useState(true);

  async function fetchAnalytics() {
    try {
      const summaryResponse = await fetch(
        "http://localhost:5000/api/analytics/summary",
      );

      const summaryData = await summaryResponse.json();

      setSummary(summaryData);

      const notificationResponse = await fetch(
        "http://localhost:5000/api/analytics/notifications",
      );

      const notificationData = await notificationResponse.json();

      setNotifications(notificationData);
    } catch (error) {
      console.error("Failed to load analytics:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // Initial data
    fetchAnalytics();

    // Real-time updates
    socket.on("analytics-updated", (data) => {
      console.log("Analytics updated:", data);

      fetchAnalytics();
    });

    return () => {
      socket.off("analytics-updated");
    };
  }, []);

  if (loading) {
    return <div className="dashboard-loading">Loading analytics...</div>;
  }

  return (
    <div className="dashboard">
      {/* HEADER */}

      <div className="dashboard-header">
        <div>
          <h1>Analytics Dashboard</h1>

          <p>Monitor your social proof performance</p>
        </div>

        <div className="live-status">
          <span className="live-dot">●</span>
          Live
        </div>
      </div>

      {/* STATS */}

      {summary && (
        <div className="stats-grid">
          <StatCard
            title="Impressions"
            value={summary.totalImpressions}
            icon="👁️"
          />

          <StatCard title="Clicks" value={summary.totalClicks} icon="🖱️" />

          <StatCard
            title="Conversions"
            value={summary.totalConversions}
            icon="💰"
          />

          <StatCard title="CTR" value={`${summary.ctr}%`} icon="📈" />

          <StatCard
            title="Conversion Rate"
            value={`${summary.conversionRate}%`}
            icon="🎯"
          />
        </div>
      )}

      {summary && <AnalyticsChart summary={summary} />}

      {/* TABLE */}

      <div className="analytics-section">
        <h2>Notification Performance</h2>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Customer</th>

                <th>Location</th>

                <th>Product</th>

                <th>Impressions</th>

                <th>Clicks</th>

                <th>Conversions</th>

                <th>CTR</th>

                <th>Conversion</th>
              </tr>
            </thead>

            <tbody>
              {notifications.length === 0 ? (
                <tr>
                  <td colSpan="8" className="empty">
                    No notification data available
                  </td>
                </tr>
              ) : (
                notifications.map((notification) => (
                  <tr key={notification.id}>
                    <td>{notification.name}</td>

                    <td>{notification.location}</td>

                    <td>{notification.product}</td>

                    <td>{notification.impressions}</td>

                    <td>{notification.clicks}</td>

                    <td>{notification.conversions}</td>

                    <td>{notification.ctr}%</td>

                    <td>{notification.conversionRate}%</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
