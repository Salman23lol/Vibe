import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaUser, FaBell, FaBan, FaCog, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { usersURI } from "../../../api";

// A simple loading spinner component
const LoadingSpinner = () => (
  <div className="w-full h-full flex items-center justify-start">
    <div className="w-5 h-5 border-4 border-t-transparent border-blue-500 border-solid rounded-full animate-spin"></div>
  </div>
);

const UserSettings = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    setLoading(true);
    try {
      // Send a request to set user status to offline
      await usersURI.post('/change-status', { status: 'offline' });
      
      // Clear session and local storage
      sessionStorage.clear();
      localStorage.clear();
      
      // Redirect to home page
      navigate('/');
    } catch (err) {
      console.error('Error setting user status to offline:', err);
      // Optionally, handle error (e.g., show notification)
    } finally {
      setLoading(false);
    }
  };

  // Settings options with icons
  const settingsOptions = [
    { text: "Accounts", icon: <FaUser />, action: () => {} },
    { text: "Mute Notifications", icon: <FaBell />, action: () => {} },
    { text: "Blocked", icon: <FaBan />, action: () => {} },
    { text: "Settings", icon: <FaCog />, action: () => navigate('/settings') },
    { text: "Log out", icon: <FaSignOutAlt />, action: handleLogout },
  ];

  return (
    <motion.div
      id="SettingsBox"
      className="absolute top-16 right-0 md:top-24 md:right-8 w-[20rem] bg-zinc-800 bg-opacity-80 p-2 rounded-md shadow-lg shadow-zinc-800"
      initial={{ opacity: 0, scale: 0.95, y: -20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <motion.div className="w-full h-full flex flex-col items-center gap-3">
        {settingsOptions.map(({ text, icon, action }, index) => (
          <motion.div
            key={index}
            className="w-full bg-white bg-opacity-0 duration-300 hover:bg-opacity-5 cursor-pointer p-3 flex items-center gap-2 relative"
            onClick={action}
          >
            {text === "Log out" && loading ? (
              <div className="w-full h-6">
                <LoadingSpinner />
              </div>
            ) : (
              <>
                {icon}
                <span>{text}</span>
              </>
            )}
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default UserSettings;
