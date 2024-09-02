import React, { useState, useEffect } from "react";
import { FaBan, FaDotCircle } from "react-icons/fa";
import { IoVolumeMute } from "react-icons/io5";
import { Link } from "react-router-dom";

// Function to get the status icon and label
const getStatusIcon = (status) => {
  const statusConfig = {
    online: { color: "text-green-400", label: "Online" },
    offline: { color: "text-gray-300", label: "Offline" },
    busy: { color: "text-orange-400", label: "Busy" },
  };
  const { color, label } = statusConfig[status] || {};
  return color && label ? (
    <span className="flex items-center gap-1 text-sm">
      <FaDotCircle className={`${color} text-xs`} />
      {label}
    </span>
  ) : null;
};

const SingleContact = ({ contact, userInfo }) => {
  const [isBlocked, setIsBlocked] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  setTimeout(() => {
    useEffect(() => {
      // Safely access blockedContacts and mutedContacts
      const blockedContacts = userInfo.blockedContacts || [];
      const mutedContacts = userInfo.mutedContacts || [];
      
      setIsBlocked(blockedContacts.includes(contact._id));
      setIsMuted(mutedContacts.includes(contact._id));
    }, [contact._id]);    
  }, 1000);


  return (
    <div
      className={`flex items-center justify-between w-full p-3 bg-opacity-10 rounded shadow-md bg-gray-100`}
    >
      <Link
        to={`/chat/${contact._id}`}
        className="flex items-center justify-between gap-3 w-full"
      >
        <div className="w-full flex items-start gap-4">
        <div className="w-14 h-14 relative">
          <img
            src={contact.accountImage}
            alt={`Profile picture of ${contact.username}`}
            loading="eager"
            className="object-fill w-full h-full rounded"
          />
        </div>

        <div className="flex flex-col">
          <p className="text-lg font-semibold">{contact.username}</p>
          <p className="text-sm">{getStatusIcon(contact.status)}</p>
        </div>
        </div>

          {isBlocked && (
            <FaBan
              className="text-white text-opacity-40 text-xl"
              title="Blocked"
            />
          )}
          {isMuted && (
            <IoVolumeMute
              className="text-white text-opacity-40 text-[1.4rem]"
              title="Muted"
            />
          )}
      </Link>
    </div>
  );
};

export default SingleContact;
