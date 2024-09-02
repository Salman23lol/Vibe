import React from "react";
import { easeIn, motion } from "framer-motion";
import { CiLogin } from "react-icons/ci";
import { PiTrademarkRegistered } from "react-icons/pi";
import {Link} from 'react-router-dom'

const Auth = () => {
  return (
    <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{duration:0.3, ease:easeIn}}
    className="w-full h-screen text-white">
      <div className="w-full h-full flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          to="/auth/login"
          className="w-64 h-64 bg-white bg-opacity-20 cursor-default rounded-sm text-8xl hover:scale-[102%] duration-200 flex flex-col items-center justify-center gap-2"
        >
          <CiLogin />
          <h1 className="text-3xl font-medium">Login</h1>
        </Link>
        <Link
          to="/auth/register"
          className="w-64 h-64 bg-white bg-opacity-20 cursor-default rounded-sm text-8xl hover:scale-[102%] duration-200 flex flex-col items-center justify-center gap-2"
        >
          <PiTrademarkRegistered />
          <h1 className="text-3xl font-medium">Register</h1>
        </Link>
      </div>
    </motion.div>
  );
};

export default Auth;
