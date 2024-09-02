import React, { useState } from "react";
import { storage } from "../../../Config/FirebaseConfig"; // Import the storage from Firebase config
import { FaUser, FaLock, FaPhone, FaImage } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import { IoMdMail } from "react-icons/io";
import { FaHandPointLeft } from "react-icons/fa6";
import "react-toastify/dist/ReactToastify.css";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Link, useNavigate } from "react-router-dom";
import { easeIn, motion } from "framer-motion";
import axios from "axios";
import { authURI } from "../../../api";
import Loading from "../../Loading/Loading"; // Import the Loading component

const Register = () => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // State to manage loading
  const navigate = useNavigate(); // Initialize navigate

  const handleImageUpload = (e) => {
    setImage(e.target.files[0]); // Get the selected image file
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Start loading

    if (!image) {
      toast.error("Please select an image to upload.");
      setIsLoading(false); // Stop loading
      return;
    }

    const imageRef = ref(storage, `profileImages/${image.name}`);

    try {
      await uploadBytes(imageRef, image);
      const imageUrl = await getDownloadURL(imageRef);

      const userData = {
        username: userName,
        email,
        accountPhoneNo: phoneNo,
        password,
        accountImage: imageUrl,
      };

      await axios.post(`${authURI}/register`, userData);
      toast.success("Registered successfully!");
      navigate("/auth/login", { replace: true }); // Redirect to dashboard
    } catch (error) {
      toast.error("Failed to upload image or register user.");
      console.error("Error: ", error);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return isLoading ? (
    <Loading /> // Show loading spinner while registering
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
      <motion.div  initial={{ scale: 0 }}
          animate={{ scale: 1 }} className="w-full max-w-md p-8 space-y-6 bg-white bg-opacity-10 rounded shadow-md">
        <h2 className="text-2xl font-bold text-center">Register</h2>
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="flex items-center border-b border-gray-300 py-2">
            <FaUser className="mr-2" />
            <input
              type="text"
              placeholder="Username"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full px-2 py-1 focus:outline-none bg-transparent placeholder:text-white"
            />
          </div>
          <div className="flex items-center border-b border-gray-300 py-2">
            <FaPhone className="mr-2" />
            <input
              type="text"
              placeholder="Phone Number"
              value={phoneNo}
              onChange={(e) => setPhoneNo(e.target.value)}
              className="w-full px-2 py-1 focus:outline-none bg-transparent placeholder:text-white"
            />
          </div>
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
          <div className="flex items-center border-b border-gray-300 py-2.5">
            <FaImage className="mr-2 text-white" size={20} />
            <input
              type="file"
              id="file-upload"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <label
              htmlFor="file-upload"
              className="cursor-default hover:text-white transition duration-300"
            >
              Account Image
            </label>
          </div>
          <Link
            to="/auth/login"
            className="w-full flex items-center justify-end text-gray-200 "
          >
            Already Have Account?
          </Link>

          <button
            type="submit"
            className="w-full px-4 py-2 font-semibold text-base text-white bg-white bg-opacity-20 rounded-sm hover:bg-opacity-10"
          >
            Register
          </button>
        </form>
      </motion.div>
      <ToastContainer />
    </motion.div>
  );
};

export default Register;
