import React from 'react'
import { FaUserTimes } from 'react-icons/fa'
import {  FaHandPointLeft } from 'react-icons/fa6' 
import { motion } from "framer-motion";
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-800 bg-opacity-70 p-4 text-white">
    <Link
      to="/"
      className="w-14 h-14 absolute top-4 left-4 bg-white bg-opacity-20 hover:bg-opacity-30 duration-300 flex items-center justify-center text-[1.5rem] rounded-full shadow-lg"
    >
      <FaHandPointLeft />
    </Link>
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
      It seems the contact you are looking for doesn't exist. Please check
      the URL or go back to the home page.
    </p>
  </div>
  )
}

export default NotFound