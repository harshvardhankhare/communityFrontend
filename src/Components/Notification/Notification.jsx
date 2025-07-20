import React, { useState, useEffect } from 'react';
import { FiBell, FiCheck, FiMessageSquare, FiUserPlus, FiThumbsUp, FiX } from 'react-icons/fi';
import './Notification.css';

const Notification = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockNotifications = [
      {
        id: 1,
        type: 'reply',
        user: 'sarahdev',
        content: 'replied to your question about React hooks',
        time: '2 hours ago',
        read: false,
        link: '/question/123'
      },
      {
        id: 2,
        type: 'like',
        user: 'alexcode',
        content: 'liked your answer about state management',
        time: '5 hours ago',
        read: false,
        link: '/question/456'
      },
      {
        id: 3,
        type: 'follow',
        user: 'jamiehacks',
        content: 'started following you',
        time: '1 day ago',
        read: true,
        link: '/profile/jamiehacks'
      },
      {
        id: 4,
        type: 'mention',
        user: 'reactexpert',
        content: 'mentioned you in a comment',
        time: '2 days ago',
        read: true,
        link: '/question/789'
      }
    ];
    
    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter(n => !n.read).length);
  }, []);

  const toggleNotifications = () => {
    setIsOpen(!isOpen);
    if (!isOpen && unreadCount > 0) {
      // Mark all as read when opening
      setNotifications(notifications.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    }
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
    setUnreadCount(prev => prev > 0 ? prev - 1 : 0);
  };

  const clearAll = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  const getNotificationIcon = (type) => {
    switch(type) {
      case 'reply':
        return <FiMessageSquare className="icon reply" />;
      case 'like':
        return <FiThumbsUp className="icon like" />;
      case 'follow':
        return <FiUserPlus className="icon follow" />;
      case 'mention':
        return <FiUserPlus className="icon mention" />;
      default:
        return <FiBell className="icon default" />;
    }
  };

  return (
    <div className="notification-container">
      <button 
        className="notification-button"
        onClick={toggleNotifications}
        aria-label="Notifications"
      >
        <FiBell />
        {unreadCount > 0 && (
          <span className="badge">{unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h3>Notifications</h3>
            <div className="header-actions">
              <button 
                className="mark-all-read"
                onClick={() => {
                  setNotifications(notifications.map(n => ({ ...n, read: true })));
                  setUnreadCount(0);
                }}
                disabled={unreadCount === 0}
              >
                <FiCheck /> Mark all as read
              </button>
              <button className="clear-all" onClick={clearAll}>
                <FiX /> Clear all
              </button>
            </div>
          </div>

          <div className="notification-list">
            {notifications.length > 0 ? (
              notifications.map(notification => (
                <div 
                  key={notification.id} 
                  className={`notification-item ${notification.read ? '' : 'unread'}`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="notification-icon">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="notification-content">
                    <div className="notification-text">
                      <span className="username">@{notification.user}</span> {notification.content}
                    </div>
                    <div className="notification-time">{notification.time}</div>
                  </div>
                  {!notification.read && <div className="unread-dot"></div>}
                </div>
              ))
            ) : (
              <div className="empty-notifications">
                No notifications yet
              </div>
            )}
          </div>

          <div className="notification-footer">
            <a href="/notifications">View all notifications</a>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notification;