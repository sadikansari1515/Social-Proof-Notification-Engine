import { useEffect, useState } from "react";

function Campaigns() {
  const [campaigns, setCampaigns] = useState([]);

  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    product: "",
    message: "",
    locations: "",
    active: true,
  });

  async function fetchCampaigns() {
    try {
      const response = await fetch("http://localhost:5000/api/campaigns");

      const data = await response.json();

      setCampaigns(data);
    } catch (error) {
      console.error("Failed to fetch campaigns:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCampaigns();
  }, []);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setForm({
      ...form,

      [name]: type === "checkbox" ? checked : value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/campaigns", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          name: form.name,

          product: form.product,

          message: form.message,

          locations: form.locations
            .split(",")
            .map((location) => location.trim())
            .filter(Boolean),

          active: form.active,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);

        return;
      }

      setCampaigns([data.campaign, ...campaigns]);

      setForm({
        name: "",
        product: "",
        message: "",
        locations: "",
        active: true,
      });
    } catch (error) {
      console.error(error);
    }
  }

  async function toggleCampaign(campaign) {
    try {
      const response = await fetch(
        `http://localhost:5000/api/campaigns/${campaign._id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            active: !campaign.active,
          }),
        },
      );

      const data = await response.json();

      setCampaigns(
        campaigns.map((item) =>
          item._id === campaign._id ? data.campaign : item,
        ),
      );
    } catch (error) {
      console.error(error);
    }
  }

  if (loading) {
    return <div className="dashboard-loading">Loading campaigns...</div>;
  }

  return (
    <div className="campaign-page">
      <div className="campaign-header">
        <div>
          <h1>Campaigns</h1>

          <p>Create and manage your social proof campaigns.</p>
        </div>
      </div>

      {/* CREATE CAMPAIGN */}

      <div className="campaign-form-card">
        <h2>Create Campaign</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Campaign Name</label>

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="React Course Launch"
              required
            />
          </div>

          <div className="form-group">
            <label>Product</label>

            <input
              type="text"
              name="product"
              value={form.product}
              onChange={handleChange}
              placeholder="React Masterclass"
              required
            />
          </div>

          <div className="form-group">
            <label>Notification Message</label>

            <input
              type="text"
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="just enrolled in React Masterclass"
              required
            />
          </div>

          <div className="form-group">
            <label>Locations</label>

            <input
              type="text"
              name="locations"
              value={form.locations}
              onChange={handleChange}
              placeholder="Delhi, Mumbai, Bangalore"
            />

            <small>Separate locations with commas.</small>
          </div>

          <div className="checkbox-group">
            <input
              type="checkbox"
              name="active"
              checked={form.active}
              onChange={handleChange}
            />

            <label>Campaign Active</label>
          </div>

          <button className="create-campaign-button" type="submit">
            Create Campaign
          </button>
        </form>
      </div>

      {/* CAMPAIGN LIST */}

      <div className="campaign-list">
        <h2>Your Campaigns</h2>

        {campaigns.length === 0 ? (
          <div className="empty-campaigns">No campaigns created yet.</div>
        ) : (
          campaigns.map((campaign) => (
            <div className="campaign-card" key={campaign._id}>
              <div>
                <h3>{campaign.name}</h3>

                <p>
                  <strong>Product:</strong> {campaign.product}
                </p>

                <p>{campaign.message}</p>

                <p>
                  <strong>Locations:</strong>{" "}
                  {campaign.locations.length
                    ? campaign.locations.join(", ")
                    : "All locations"}
                </p>
              </div>

              <div>
                <span
                  className={
                    campaign.active ? "status-active" : "status-inactive"
                  }
                >
                  {campaign.active ? "Active" : "Inactive"}
                </span>

                <button
                  className="toggle-button"
                  onClick={() => toggleCampaign(campaign)}
                >
                  {campaign.active ? "Disable" : "Enable"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Campaigns;
