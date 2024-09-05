import React, { useEffect, useState } from "react";
import { usersURI } from "../../../api";
import { useNavigate } from "react-router-dom";
import { FaHandPointLeft } from "react-icons/fa6";
import { FaDotCircle } from "react-icons/fa";
import { RiImageEditFill } from "react-icons/ri";
import { GrDocumentUpdate } from "react-icons/gr";
import Loading from "../../Loading/Loading";
import ToolTip from "../../CustomToolTips/CustomerTip";
import { storage } from "../../../Config/FirebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { motion, AnimatePresence } from "framer-motion";

const MeInfo = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await usersURI.get(`/info`);
        setUserInfo(response.data);
        
      } catch (error) {
        setError("Failed to fetch user information");
        console.error("Error fetching user info:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  if (loading) return <Loading />;
  if (error) return <div>{error}</div>;

  const getStatusColor = (status) => {
    return status === "online"
      ? "text-green-500"
      : status === "offline"
      ? "text-gray-300"
      : "text-orange-400";
  };

  const handleEditToggle = () => {
    setIsEditMode(!isEditMode);
    setEditingField(null);
  };

  const handleFieldClick = (field) => {
    setEditingField(field);
    setEditValue(userInfo[field]);
  };

  const handleUpdate = async () => {
    try {
      let imageUrl = userInfo.accountImage;

      if (selectedImage) {
        const storageRef = ref(storage, `profileImages/${selectedImage.name}`);
        await uploadBytes(storageRef, selectedImage);
        imageUrl = await getDownloadURL(storageRef);
      }

      const updatedData = {
        imageUrl: imageUrl !== userInfo.accountImage ? imageUrl : undefined,
        username: editingField === "username" ? editValue : userInfo.username,
        phoneNo:
          editingField === "accountPhoneNo"
            ? editValue
            : userInfo.accountPhoneNo,
        status: editingField === "status" ? editValue : userInfo.status,
      };

      await usersURI.post("/update-profile", updatedData);

      setUserInfo((prev) => ({
        ...prev,
        accountImage: imageUrl,
        username: updatedData.username,
        accountPhoneNo: updatedData.phoneNo,
        status: updatedData.status,
      }));

      setEditingField(null);
      setPreviewImage(null);
      setSelectedImage(null);
    } catch (error) {
      console.error("Error updating user info:", error);
    }
  };

  const handleCancel = () => {
    setEditingField(null);
    setPreviewImage(null);
    setSelectedImage(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  return (
    <div className="w-full h-screen md:p-4 text-white relative flex flex-col items-center justify-center">
      <motion.button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 p-3.5 bg-white bg-opacity-20 hover:bg-opacity-30 duration-300 flex items-center justify-center text-lg rounded-sm shadow-lg"
        data-tooltip-id="back-btn-tooltip"
        data-tooltip-content="Back"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <FaHandPointLeft />
      </motion.button>
      <motion.button
        onClick={handleEditToggle}
        className="absolute top-4 right-4 p-3.5 bg-white bg-opacity-20 hover:bg-opacity-30 duration-300 flex items-center justify-center rounded-sm shadow-lg"
        data-tooltip-id="edit-btn-tooltip"
        data-tooltip-content={`${isEditMode ? "Close Edit Mode" : "Toggle Edit Mode"}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {isEditMode ? <GrDocumentUpdate className="text-[1.16rem]" /> : <RiImageEditFill className="text-[1.2rem]" />}
      </motion.button>

      <div className="w-full flex items-center justify-center gap-10">
        <motion.div className="w-96 h-96 relative" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
          <img
            src={userInfo.accountImage}
            alt="Profile"
            className="w-full h-full rounded-md mx-auto mb-4 object-cover"
            loading="eager"
          />
          {isEditMode && (
            <button
              className="absolute top-2 right-2 p-2 bg-white bg-opacity-10 hover:bg-opacity-15 duration-200 text-white rounded shadow-lg flex items-center gap-1"
              onClick={() => document.getElementById("imageUpload").click()}
            >
              <RiImageEditFill />
              Edit
            </button>
          )}
        </motion.div>
        <input
          type="file"
          id="imageUpload"
          className="hidden"
          onChange={handleImageChange}
        />
        <motion.div className="w-auto flex flex-col items-start p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
          <div className="flex flex-col items-center md:items-start gap-2">
            <h2 className="text-2xl text-center py-1 gap-2 flex items-center">
              {userInfo.username}
              {isEditMode && (
                <button
                  className="p-1 text-xs bg-white bg-opacity-10 hover:bg-opacity-15 duration-200 text-white rounded shadow-lg flex items-center gap-1"
                  onClick={() => handleFieldClick("username")}
                >
                  Edit
                </button>
              )}
            </h2>

            <h1 className="text-center text-lg flex items-center gap-2">
              {userInfo.accountPhoneNo}
              {isEditMode && (
                <button
                  className="p-1 text-xs bg-white bg-opacity-10 hover:bg-opacity-15 duration-200 text-white rounded shadow-lg flex items-center gap-1"
                  onClick={() => handleFieldClick("accountPhoneNo")}
                >
                  Edit
                </button>
              )}
            </h1>

            <h1 className="text-center flex items-center gap-1" onClick={() => isEditMode && handleFieldClick("status")}>
              Status:
              <span className="flex items-center gap-1">
                <FaDotCircle className={getStatusColor(userInfo.status)} />
                {userInfo.status}
              </span>
              {isEditMode && (
                <button
                  className="p-1 text-xs bg-white bg-opacity-10 hover:bg-opacity-15 duration-200 text-white rounded shadow-lg flex items-center gap-1"
                  onClick={() => handleFieldClick("status")}
                >
                  Edit
                </button>
              )}
            </h1>
          </div>

          {!isEditMode && (
            <div className="flex flex-col items-start gap-2 mt-2">
              <p className="text-center">Contacts: {userInfo.contacts.length}</p>
              <p className="text-center">Joined: {new Date(userInfo.joinDate).toLocaleDateString()}</p>
            </div>
          )}
        </motion.div>
      </div>

      <AnimatePresence>
        {isEditMode && editingField && (
          <motion.div
            className="w-full h-screen absolute flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div
              onClick={handleCancel}
              className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            ></div>
            <div className="absolute w-full max-w-xl h-auto bg-white bg-opacity-15 p-6 rounded shadow-md flex flex-col gap-4 items-center justify-center">
              <h3 className="w-full text-xl mb-2 text-white flex items-center justify-center gap-2">
                Editing: {editingField.charAt(0).toUpperCase() + editingField.slice(1)}
              </h3>
              {editingField === "status" ? (
                <select
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="text-white p-2 w-full bg-zinc-800 bg-opacity-80 rounded mb-4 outline-none border-none"
                >
                  <option value="online">Online</option>
                  <option value="offline">Offline</option>
                  <option value="busy">Busy</option>
                  <option value="away">Away</option>
                </select>
              ) : (
                <input
                  type="text"
                  value={editValue}
                  placeholder={editingField.charAt(0).toUpperCase() + editingField.slice(1)}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="text-white p-2 w-full bg-zinc-800 bg-opacity-80 outline-none rounded mb-4"
                />
              )}
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={handleUpdate}
                  className="p-2 bg-green-400 bg-opacity-50 hover:bg-opacity-20 duration-200 rounded text-white "
                >
                  Update
                </button>
                <button
                  onClick={handleCancel}
                  className="p-2 bg-red-400 bg-opacity-50 hover:bg-opacity-20 duration-200 rounded text-white "
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {previewImage && (
          <motion.div
            className="w-full h-screen absolute flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div
              onClick={handleCancel}
              className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            ></div>
            <div className="absolute w-[90%] h-auto bg-white bg-opacity-15 p-4 rounded md:w-[70%] flex flex-col items-center">
              <img
                src={previewImage}
                alt="Preview"
                className="w-full h-auto mb-4 object-cover"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleUpdate}
                  className="p-2 bg-green-400 bg-opacity-50 hover:bg-opacity-20 duration-200 rounded text-white "
                >
                  Update
                </button>
                <button
                  onClick={handleCancel}
                  className="p-2 bg-red-400 bg-opacity-50 hover:bg-opacity-20 duration-200 rounded text-white "
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ToolTip id="edit-btn-tooltip" />
      <ToolTip id="back-btn-tooltip" />
    </div>
  );
};

export default MeInfo;
