import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { FaDotCircle, FaUserTimes, FaPhoneAlt, FaRegCalendarAlt } from "react-icons/fa";
import { FaHandPointLeft } from "react-icons/fa6";
import { usersURI } from "../../../api"; // Update with the correct path to your API file
import { FormatUTC } from "../../../Function/FormatUTC";
import { MdOutlineEmail } from "react-icons/md";
import Loading from '../../Loading/Loading'

const ContactInfo = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const response = await usersURI.post(`/find-contact`, {
          searchType: "id",
          searchTerm: id,
        });
        setContact(response.data);
      } catch (error) {
        console.error("Error fetching contact:", error);
        setContact(null);
      } finally {
        setLoading(false);
      }
    };

    fetchContact();
  }, [id]);

  if (loading) {
    return (
      <Loading />
    );
  }

  if (!contact) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-gradient-to-r from-gray-700 via-gray-900 to-black p-4 text-white">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 p-3.5 bg-white bg-opacity-20 hover:bg-opacity-30 duration-300 flex items-center justify-center text-lg rounded-full shadow-lg"
          aria-label="Back to Home"
        >
          <FaHandPointLeft />
        </button>
        <motion.div
          className="text-8xl mb-6 bg-transparent"
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
        >
          <FaUserTimes className="bg-transparent" />
        </motion.div>
        <p className="text-lg font-semibold mb-2 bg-transparent">
          No Contact Found
        </p>
        <p className="text-md text-gray-300">
          The contact you are looking for doesn't exist. Please check the contact ID or return to the home page.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-transparent  flex flex-col items-center justify-center p-6 relative text-white">
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 p-3.5 bg-white bg-opacity-20 hover:bg-opacity-30 duration-300 flex items-center justify-center text-lg rounded-sm  shadow-lg"
        aria-label="Back to Home"
      >
        <FaHandPointLeft />
      </button>

      <motion.div
        className="w-full max-w-md p-8 bg-white bg-opacity-10 rounded-lg shadow-2xl flex flex-col items-center space-y-5"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.img
          src={contact.accountImage}
          alt={contact.username}
          className="w-auto h-64 object-cover rounded shadow-md"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        />
        <h1 className="text-3xl tracking-wide">{contact.username}</h1>

        <div className="flex flex-col items-start w-full space-y-2">
          <p className="text-lg flex items-center gap-3">
            <FaDotCircle
              className={`text-${
                contact.status === "online" ? "green" : "orange"
              }-400 animate-pulse`}
            />
            {contact.status}  
          </p>
          <p className="text-lg flex items-center gap-3">
            <MdOutlineEmail className="text-xl text-white" />
            {contact.email}
          </p>
          <p className="text-lg flex items-center gap-3">
            <FaPhoneAlt className="text-xl text-white" />
            {contact.accountPhoneNo}
          </p>
          <p className="text-lg flex items-center gap-3">
            <FaRegCalendarAlt className="text-xl text-white" />
            {FormatUTC(contact.joinDate)}
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default React.memo(ContactInfo);
