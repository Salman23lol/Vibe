import React, { useEffect, useState } from "react";
import { IoSettingsOutline } from "react-icons/io5";
import { PiAddressBookLight } from "react-icons/pi";
import { AiOutlineBell } from "react-icons/ai";
import { motion, easeIn } from "framer-motion";
import { Link } from "react-router-dom";
import NotificationSettings from "../../../Notification/NotificationSettings";
import { usersURI } from "../../../../api";
import ToolTip from "../../../CustomToolTips/CustomerTip";

const YourHeader = ({ toggleSettings, fetchMeInfo }) => {
  const [notifications, setNotifications] = useState([]);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [hasNotifications, setHasNotifications] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await usersURI.get("/notifications");
        const fetchedNotifications = response.data || [];
        setNotifications(fetchedNotifications);
        setHasNotifications(fetchedNotifications.length > 0); // Update based on fetched data
      } catch (error) {
        console.error("Failed to fetch notifications", error);
      }
    };

    fetchNotifications();

    // Set up an interval to fetch notifications every minute (60000ms)
    const intervalId = setInterval(fetchNotifications, 60000);

    // Cleanup the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const toggleNotification = () => {
    setIsNotificationOpen((prev) => !prev);
  };

  return (
    <motion.div
      initial={{ y: -50 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4, ease: easeIn }}
      className="w-full flex flex-col"
    >
      <div className="w-full h-auto bg-white bg-opacity-10 flex items-center justify-between pr-2">
        <Link
          to="/me"
          className="flex items-center gap-3 p-1"
          data-tooltip-id="your-profile-btn-tooltip"
          data-tooltip-content="Your Profile"
        >
          <motion.img
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            loading="lazy"
            className="w-auto h-12 text-2xl rounded"
            src={fetchMeInfo?.accountImage || "/path/to/default/image.jpg"}
            alt="Account"
          />
        </Link>
        <div className="flex items-center gap-4">
          <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            whileHover={{ scale: 1.05 }}
            className="w-10 h-10 cursor-default bg-white bg-opacity-10 flex items-center justify-center"
            data-tooltip-id="add-contact-btn-tooltip"
            data-tooltip-content="Find Contacts"
          >
            <Link
              to="/contact/add"
              className="flex items-center justify-center w-full h-full cursor-default"
            >
              <PiAddressBookLight className="text-[1.5rem]" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            whileHover={{ scale: 1.05 }}
            onClick={toggleNotification}
            className="w-10 h-10 p-1 cursor-default bg-white bg-opacity-10 flex items-center justify-center rounded-sm relative"
            data-tooltip-id="notification-btn-tooltip"
            data-tooltip-content="View Notifications"
          >
            <AiOutlineBell className="text-[1.4rem]" />
            {hasNotifications && (
              <span className="absolute top-1 left-1 w-1.5 h-1.5 rounded-full bg-white bg-opacity-50"></span>
            )}
          </motion.div>

          <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            whileHover={{ scale: 1.05 }}
            onClick={toggleSettings}
            className="w-10 h-10 p-1 cursor-default bg-white bg-opacity-15 flex items-center justify-center rounded-sm"
            data-tooltip-id="settings-btn-tooltip"
            data-tooltip-content="Settings"
          >
            <IoSettingsOutline className="text-[1.4rem]" />
          </motion.div>
        </div>
      </div>
      {isNotificationOpen && (
        <NotificationSettings
          notifications={notifications}
          setNotifications={setNotifications}
          setHasNotifications={setHasNotifications} // Pass the state setter function
        />
      )}
      <ToolTip id="settings-btn-tooltip"/>
      <ToolTip id="add-contact-btn-tooltip" place="left" />
      <ToolTip id="notification-btn-tooltip" />
      <ToolTip id="your-profile-btn-tooltip" place='right' />
    </motion.div>
  );
};

export default YourHeader;
