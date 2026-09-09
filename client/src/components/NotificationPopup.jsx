function NotificationPopup({ notification, onClose }) {
  return (
    <div className="notification">
      <div className="notification-icon">🛒</div>

      <div className="notification-content">
        <div className="notification-title">
          {notification.name} from {notification.location}
        </div>

        <div className="notification-message">{notification.message}</div>

        <div className="notification-time">{notification.time}</div>
      </div>

      <button className="notification-close" onClick={onClose}>
        ×
      </button>
    </div>
  );
}

export default NotificationPopup;
