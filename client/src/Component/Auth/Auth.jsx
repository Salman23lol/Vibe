import React from "react";
import { easeIn, motion } from "framer-motion";
import { CiLogin } from "react-icons/ci";
import { PiTrademarkRegistered } from "react-icons/pi";
import {Link} from 'react-router-dom'

const Auth = () => {
  return (
    <motion.div
    className="w-full h-screen text-gray-200 relative">
      <img src="/Diagram.webp" className="w-full h-screen object-cover absolute" />
      <motion.div
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         transition={{duration:0.3, ease:easeIn}}
      className="w-full h-screen bg-gray-800 absolute bg-opacity-50"></motion.div>
      <div className="w-full h-full flex flex-col sm:flex-row items-center justify-center gap-4 absolute">
        <Link
          to="/auth/login"
          className="w-64 h-64 bg-gray-800 bg-opacity-70 cursor-default rounded-sm text-8xl hover:scale-[102%] duration-200 flex flex-col items-center justify-center gap-2"
        >
          <CiLogin />
          <h1 className="text-3xl font-medium">Login</h1>
        </Link>
        <Link
          to="/auth/register"
          className="w-64 h-64 bg-gray-800 bg-opacity-70 cursor-default rounded-sm text-8xl hover:scale-[102%] duration-200 flex flex-col items-center justify-center gap-2"
        >
          <PiTrademarkRegistered />
          <h1 className="text-3xl font-medium">Register</h1>
        </Link>
      </div>
    </motion.div>
  );
};

export default Auth;
