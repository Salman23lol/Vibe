import React from "react";
import { motion } from "framer-motion";
import { usersURI } from "../../api";
import { useNavigate } from "react-router-dom";
import { FormatUTC } from "../../Function/FormatUTC";

const NotificationSettings = ({
  notifications = [],
  setNotifications,
  setHasNotifications,
}) => {
  const navigate = useNavigate();

  const removeNotificationFromDisplay = (id) => {
    setNotifications((prevNotifications) => {
      const updatedNotifications = prevNotifications.filter(
        (notification) => notification._id !== id
      );
      setHasNotifications(updatedNotifications.length > 0); // Update notification status
      return updatedNotifications;
    });
  };

  const handleAccept = async (id) => {
    try {
      await usersURI.post(`/respond-contact-request`, {
        notificationId: id,
        action: "accept",
      });
      removeNotificationFromDisplay(id);
      navigate("/");
    } catch (error) {
      console.error("Failed to accept contact request", error);
    }
  };

  const handleDeny = async (id) => {
    try {
      await usersURI.post(`/respond-contact-request`, {
        notificationId: id,
        action: "deny",
      });
      removeNotificationFromDisplay(id);
    } catch (error) {
      console.error("Failed to deny contact request", error);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await usersURI.post(`/delete/notification`, { notificationId: id });
      removeNotificationFromDisplay(id);
    } catch (error) {
      console.error("Failed to mark notification as read", error);
    }
  };

  const renderNotificationContent = (notification) => {
    switch (notification.type) {
      case "contact_request":
        return (
          <div className="w-full flex items-center justify-between">
            <h1 className="text-sm mb-3 p-1">{notification.message}</h1>
            <div className="w-1/3 flex flex-wrap items-center justify-end gap-1">
              <button
                onClick={() => handleAccept(notification._id)}
                className="bg-green-400 bg-opacity-30 hover:bg-opacity-20 duration-300 text-white py-1 px-2 rounded text-sm"
              >
                Accept
              </button>
              <button
                onClick={() => handleDeny(notification._id)}
                className="bg-red-400 bg-opacity-30 hover:bg-opacity-20 duration-300 text-white py-1 px-2 rounded text-sm"
              >
                Deny
              </button>
              <button
                onClick={() => navigate(`/contact/${notification.from}`)}
                className="bg-white bg-opacity-30 hover:bg-opacity-20 duration-300 text-white py-1 px-2 rounded text-sm"
              >
                Info
              </button>
            </div>
          </div>
        );
      case "contact_request_response":
        return (
          <div className="w-full flex items-center justify-between gap-4">
            <div className="flex flex-col items-start gap-1">
              <h1 className="text-sm">{notification.message}</h1>
              <p className="text-[11px]">{FormatUTC(notification.date)}</p>
            </div>
            <motion.button
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => handleMarkAsRead(notification._id)}
              className="bg-white bg-opacity-10 hover:bg-opacity-20 duration-300 text-white w-[5rem] px-2 py-1 rounded text-xs"
            >
              Mark as Read
            </motion.button>
          </div>
        );
      case "contact_removed":
        return (
          <div className="w-full flex items-center justify-between gap-4">
            <div className="flex flex-col items-start gap-1">
              <h1 className="text-sm">{notification.message}</h1>
              <p className="text-[11px]">{FormatUTC(notification.date)}</p>
            </div>
            <motion.button
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => handleMarkAsRead(notification._id)}
              className="bg-white bg-opacity-10 hover:bg-opacity-20 duration-300 text-white w-[5rem] px-2 py-1 rounded text-xs"
            >
              Mark as Read
            </motion.button>
          </div>
        );
      default:
        return "You have a new notification";
    }
  };

  return (
    <motion.div
      id="NotificationSettings"
      className="absolute top-16 right-0 md:top-24 md:right-24 w-[26rem] h-[320px] bg-zinc-800 bg-opacity-70 p-2 rounded-md shadow-sm z-50"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <motion.div className="w-full h-full flex flex-col items-center gap-3">
        <div className="w-full text-white font-bold p-3 bg-transparent">
          Notifications
        </div>
        {notifications.length > 0 ? (
          <div className="overflow-y-scroll no-scrollbar space-y-4">
            {notifications.map((notification) => (
              <motion.div
                initial={{ y: -40, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.2 }}
                key={notification._id}
                className="w-full bg-white bg-opacity-5 duration-300 rounded-sm cursor-pointer p-3 flex items-center gap-2"
              >
                {renderNotificationContent(notification)}
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="w-full flex items-center justify-center">
            <h1 className="text-sm text-white">You have 0 notifications</h1>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default NotificationSettings;
