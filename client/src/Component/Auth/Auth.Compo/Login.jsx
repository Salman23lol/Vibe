import React, { useState } from "react";
import { easeIn, motion } from "framer-motion";
import { FaLock } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaHandPointLeft } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { authURI, updateToken } from "../../../api"; // Import the updateToken function
import Loading from "../../Loading/Loading";
import axios from "axios";
import { IoMdMail } from "react-icons/io";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post(`${authURI}/login`, { email, password });

      // Set token in session storage and update Axios headers
      updateToken(res.data.token);

      toast.success("Logged in successfully!");
      setIsLoading(false);
      setTimeout(() => {
        navigate("/home", { replace: true });
      }, 500);
    } catch (error) {
      toast.error(
        "Failed to log in. Please check if your credentials are correct."
      );
      setIsLoading(false);
    }
  };

  return isLoading ? (
    <Loading />
  ) : (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: easeIn }}
      className="flex flex-col items-center justify-center h-screen bg-transparent text-white relative"
    >
      <Link
        to="/"
        className="p-3.5 absolute top-4 left-4 bg-white bg-opacity-10 hover:bg-opacity-20 duration-300 text-lg"
      >
        <FaHandPointLeft />
      </Link>
      <motion.div
        initial={{ y: -60 }}
        animate={{ y: 0 }}
        className="w-full max-w-md p-8 space-y-6 bg-white bg-opacity-10 rounded shadow-md"
      >
        <h2 className="text-2xl font-bold text-center">Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="flex items-center border-b border-gray-300 py-2">
            <IoMdMail className="mr-2" size={20} />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-2 py-1 focus:outline-none bg-transparent placeholder:text-white"
            />
          </div>
          <div className="flex items-center border-b border-gray-300 py-2">
            <FaLock className="mr-2" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-2 py-1 focus:outline-none bg-transparent placeholder:text-white"
            />
          </div>
          <Link
            to="/auth/register"
            className="w-full flex items-center justify-end text-gray-200 "
          >
            Don't Have Account?
          </Link>
          <button
            type="submit"
            className="w-full px-4 py-2 font-semibold text-base text-white duration-200 bg-white bg-opacity-20 rounded-sm hover:bg-opacity-10"
          >
            Login
          </button>
        </form>
      </motion.div>
      <ToastContainer />
    </motion.div>
  );
};

export default Login;
