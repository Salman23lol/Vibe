import React from "react";
import { motion } from "framer-motion";
import { FaUserTimes } from "react-icons/fa";

const EmptyContactState = () => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 bg-opacity-10 p-4 rounded-sm">
      <motion.div
        className="text-8xl mb-6  bg-transparent"
        initial={{ opacity: 0.5 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
      >
        <FaUserTimes className="bg-transparent" />
      </motion.div>
      <p className="text-lg font-semibold mb-2 bg-transparent">0 Contacts Found</p>
    </div>
  );
};

export default EmptyContactState;
