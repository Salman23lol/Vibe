import React, { useEffect, useState } from "react";
import { usersURI } from "../../../api";
import { useNavigate } from "react-router-dom";
import { FaHandPointLeft } from "react-icons/fa6";
import { FaDotCircle } from "react-icons/fa";
import Loading from "../../Loading/Loading";
import { RiImageEditFill } from "react-icons/ri";
import { GrDocumentUpdate } from "react-icons/gr";
import ToolTip from "../../CustomToolTips/CustomerTip";

const MeInfo = () => {
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

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
    switch (status) {
      case "online":
        return "text-green-500";
      case "offline":
        return "text-gray-300";
      default:
        return "text-orange-400";
    }
  };

  const handleEditToggle = () => {
    setIsEditMode((prev) => !prev);
  };

  return (
    <div className="w-full h-screen p-4 text-white relative flex flex-col items-center justify-center">
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 p-3.5 bg-white bg-opacity-20 hover:bg-opacity-30 duration-300 flex items-center justify-center text-lg rounded-sm shadow-lg"
        data-tooltip-id="back-btn-tooltip"
        data-tooltip-content="Back"
      >
        <FaHandPointLeft />
      </button>
      <button
        id="Edit-btn"
        onClick={handleEditToggle}
        className="absolute top-4 right-4 p-3.5 bg-white bg-opacity-20 hover:bg-opacity-30 duration-300 flex items-center justify-center rounded-sm shadow-lg"
        data-tooltip-id="edit-btn-tooltip"
        data-tooltip-content={`${isEditMode ? 'This is Button to Close Edit Mode' : 'This is Button to Toggle Edit Mode'}`}
      >
        {isEditMode ? (
          <GrDocumentUpdate className="text-[1.16rem]" />
        ) : (
          <RiImageEditFill className="text-[1.2rem]" />
        )}
      </button>

      <div className="w-full h-[32rem] p-4 flex items-center gap-10 justify-center">
        <div className="max-w-[66.666666%] h-96">
          <img
            src={userInfo.accountImage}
            alt="Profile"
            className="w-full h-full rounded-sm mx-auto mb-4"
          />
        </div>
        <div className="w-1/3 flex flex-col items-start p-4">
          <div className="flex flex-col items-start gap-1">
            <h2 className="text-2xl font-bold text-center py-1">
              {userInfo.username}
            </h2>
            <p className="text-center">{userInfo.email}</p>
            <p className="text-center">{userInfo.accountPhoneNo}</p>
          </div>

          {!isEditMode && (
            <div className="flex flex-col items-start gap-2 mt-2">
              <h1 className="text-center flex items-center gap-2">
                Status:
                <span className="flex items-center gap-1">
                  <FaDotCircle className={getStatusColor(userInfo.status)} />
                  {userInfo.status}
                </span>
              </h1>
              <p className="text-center">
                Contacts: {userInfo.contacts.length}
              </p>
              <p className="text-center">
                Blocked Contacts: {userInfo.blockedContacts.length}
              </p>
              <p className="text-center">
                Muted Contacts: {userInfo.mutedContacts.length}
              </p>
              <p className="text-center">
                Joined: {new Date(userInfo.joinDate).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>
      </div>
      
      <ToolTip id="edit-btn-tooltip" />
      <ToolTip id="back-btn-tooltip" />
    </div>
  );
};

export default MeInfo;
