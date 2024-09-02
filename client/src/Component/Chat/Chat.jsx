import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { chatsURI, usersURI } from "../../api";
import { FormatUTC } from "../../Function/FormatUTC";
import { FaChevronDown, FaHandPointLeft } from "react-icons/fa6";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { MdDeleteOutline, MdEdit } from "react-icons/md";
import { FaChevronLeft } from "react-icons/fa6";
import { useAlert } from "../../Context/AlertContext";
import { AiOutlineInfoCircle } from "react-icons/ai";

const Chat = () => {
  const navigate = useNavigate();
  const { showAlert } = useAlert(); 

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const { id } = useParams();

  const [userInfo, setUserInfo] = useState({});
  const [contactInfo, setContactInfo] = useState({});
  const [chatId, setChatId] = useState(null);

  const [editMode, setEditMode] = useState(false);
  const [editMessageId, setEditMessageId] = useState(null);

  const [borderedMessageIndex, setBorderedMessageIndex] = useState(null);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [status, setStatus] = useState({
    isMuted: false,
    isBlocked: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const chatResponse = await chatsURI.get(`/exists/${id}`);
        if(!chatResponse.data.exists){navigate('/home')}
        if (chatResponse.data.exists) {
          setChatId(chatResponse.data.chatId);
          const chatData = await chatsURI.get(`/${chatResponse.data.chatId}`);
          setMessages(chatData.data.messages);
          const [contactData, meData] = await Promise.all([
            usersURI.get(`/info/${id}`),
            usersURI.get("/info"),
          ]);
          setContactInfo(contactData.data);
          setUserInfo(meData.data);

          setStatus({
            isMuted: meData.data.mutedContacts.includes(id),
            isBlocked: meData.data.blockedContacts.includes(id),
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    const intervalId = setInterval(async () => {
      if (chatId) {
        try {
          const response = await chatsURI.get(`/${chatId}`);
          setMessages(response.data.messages);
        } catch (error) {
          console.error("Error fetching new messages:", error);
        }
      }
    }, 5000);

    return () => clearInterval(intervalId);
  }, [id, chatId]);

  const handleSendMessage = () => {
    if (message.trim() && chatId) {
      if (editMode && editMessageId) {
        chatsURI
          .put(`/edit-message`, {
            content: message,
            chatId,
            messageId: editMessageId,
          })
          .then(() => {
            setMessages((prevMessages) =>
              prevMessages.map((msg) =>
                msg._id === editMessageId ? { ...msg, content: message } : msg
              )
            );
            handleCancelEdit();
          })
          .catch((error) => {
            console.error("Error editing message:", error);
            showAlert({
              title: 'Error',
              text: error.response.data.msg,
              type: 'error',
              icon: AiOutlineInfoCircle,
              autoClose: true,
              autoCloseDuration: 3000,
            });
          });
      } else {
        const newMessage = {
          sender: userInfo._id,
          content: message,
        };
  
        chatsURI
          .post("/send-message", {
            chatId: chatId,
            content: message,
          })
          .then(() => {
            setMessages((prevMessages) => [...prevMessages, newMessage]);
            setMessage("");
          })
          .catch((error) => {
            console.error("Error sending message:", error);
            showAlert({
              title: 'Error',
              text: error.response.data.msg,
              type: 'error',
              icon: AiOutlineInfoCircle,
              autoClose: true,
              autoCloseDuration: 3000,
            });
          });
      }
    }
  };

  const handleEditMessage = (msgId, content) => () => {
    setEditMode(true);
    setEditMessageId(msgId);
    setMessage(content);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setEditMessageId(null);
    setMessage("");
  };

  const handleMenuToggle = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const toggleBlock = async () => {
    try {
      const response = await usersURI.post("/block-contact", { contactId: id });
      if (response.status === 201) {
        setStatus((prevStatus) => ({
          ...prevStatus,
          isBlocked: !prevStatus.isBlocked,
        }));
      }
    } catch (error) {
      console.error("Error toggling block:", error);
    }
  };

  const toggleMute = async () => {
    try {
      const response = await usersURI.post("/mute-contact", { contactId: id });
      if (response.status === 201) {
        setStatus((prevStatus) => ({
          ...prevStatus,
          isMuted: !prevStatus.isMuted,
        }));
        toast.success(response.data.msg || "Contact muted successfully!");
      }
    } catch (error) {
      console.error("Error toggling mute:", error);
    }
  };

  const toggleUnmute = async () => {
    try {
      const response = await usersURI.post("/unmute-contact", {
        contactId: id,
      });
      if (response.status === 201) {
        setStatus((prevStatus) => ({
          ...prevStatus,
          isMuted: !prevStatus.isMuted,
        }));
        toast.success(response.data.msg || "Contact unmuted successfully!");
      }
    } catch (error) {
      console.error("Error toggling unmute:", error);
    }
  };

  const toggleUnblock = async () => {
    try {
      const response = await usersURI.post("/unblock-contact", {
        contactId: id,
      });
      if (response.status === 201) {
        setStatus((prevStatus) => ({
          ...prevStatus,
          isBlocked: !prevStatus.isBlocked,
        }));
      }
    } catch (error) {
      console.error("Error toggling unblock:", error);
    }
  };

  const removeContact = async () => {
    try {
      const response = await usersURI.post("/remove-contact", {
        contactId: id,
      });
      if (response.status === 201) {
        showAlert({
          title: 'Error',
          text: response.data.msg,
          type: 'error',
          icon: AiOutlineInfoCircle,
          autoClose: true,
          autoCloseDuration: 3000,
        });
        // Use a timeout to navigate after the alert closes
        setTimeout(() => {
          navigate("/home");
        }, 3000); // This should match the autoCloseDuration
      }
      
    } catch (error) {
      showAlert({
        title: 'Error',
        text: error,
        type: 'error',
        icon: AiOutlineInfoCircle,
        autoClose: true,
        autoCloseDuration: 3000,
      });
      console.error("Error removing contact:", error);
    }
  };

  const handleDoubleClick = (index) => {
    setBorderedMessageIndex(index);
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      console.log({ messageId, chatId });
      const res = await chatsURI.post("/delete-message", {
        messageId,
        chatId,
      });
      Swal.fire({
        title: res.data.msg,
      });
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Something went wrong!",
        icon: "error",
      });
    }
  };

  return (
    <motion.div
    initial={{ scale:0.9 ,opacity:0}}
    animate={{ scale:1 ,opacity:1}}
    className="flex flex-col h-screen bg-transparent text-white sm:p-8 relative">
      <nav className="w-full h-14 bg-transparent p-2 flex items-center gap-3 mt-4 sm:mt-0">
        <button
          onClick={() => navigate(-1)}
          className="p-3.5 bg-white bg-opacity-10 hover:bg-opacity-20 duration-300 text-lg rounded-sm shadow-lg"
          aria-label="Back to Home"
        >
          <FaHandPointLeft />
        </button>
        <div className="w-full h-auto flex items-center justify-between p-2 bg-white bg-opacity-10 rounded">
          <div className="flex items-center gap-2">
            {contactInfo.accountImage && (
              <img
                src={contactInfo.accountImage}
                alt={`${contactInfo.username}'s profile`}
                className="w-auto h-12 rounded mr-2"
              />
            )}
            <h1 className="text-white font-semibold mb-2">
              {contactInfo.username || "Loading..."}
            </h1>
          </div>
        </div>
        <button
          className="p-3.5 bg-white bg-opacity-15 hover:bg-opacity-20 duration-300 text-lg rounded-sm shadow-md"
          aria-label="Menu"
          onClick={handleMenuToggle}
        >
          <BiDotsVerticalRounded />
        </button>
      </nav>

      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="absolute top-[6rem] right-6 sm:right-12 w-[22rem] h-auto bg-zinc-800 bg-opacity-80 shadow-lg shadow-zinc-800 rounded p-2 flex flex-col items-center gap-3 cursor-default"
        >
          {status.isMuted ? (
            <button
              onClick={toggleUnmute}
              className="w-full h-auto bg-white bg-opacity-0 hover:bg-opacity-5 duration-300 rounded-sm cursor-pointer flex items-center justify-center p-3.5"
            >
              <h1>Unmute Contact</h1>
            </button>
          ) : (
            <button
              onClick={toggleMute}
              className="w-full h-auto bg-white bg-opacity-0 hover:bg-opacity-5 duration-300 rounded-sm cursor-pointer flex items-center justify-center p-3.5"
            >
              <h1>Mute Contact</h1>
            </button>
          )}
          {status.isBlocked ? (
            <button
              onClick={toggleUnblock}
              className="w-full h-auto bg-white bg-opacity-0 hover:bg-opacity-5 duration-300 rounded-sm cursor-pointer flex items-center justify-center p-3.5"
            >
              <h1>Unblock Contact</h1>
            </button>
          ) : (
            <button
              onClick={toggleBlock}
              className="w-full h-auto bg-white bg-opacity-0 hover:bg-opacity-5 duration-300 rounded-sm cursor-pointer flex items-center justify-center p-3.5"
            >
              <h1>Block Contact</h1>
            </button>
          )}
          <button
            onClick={() => navigate(`/contact/${id}`)}
            className="w-full h-auto bg-white bg-opacity-0 hover:bg-opacity-5 duration-300 rounded-sm cursor-pointer flex items-center justify-center p-3.5"
          >
            <h1>Contact Info</h1>
          </button>
          <button
            onClick={removeContact}
            className="w-full h-auto bg-red-400 bg-opacity-0 hover:bg-opacity-10 duration-300 rounded-sm cursor-pointer flex items-center justify-center p-3.5"
          >
            <h1>Remove Contact</h1>
          </button>
        </motion.div>
      )}

      <div className="w-full flex-grow bg-transparent overflow-y-scroll no-scrollbar mt-1">
        {/* Messages */}
        <div className="w-full flex flex-col space-y-6 p-2">
          {messages.length > 0 ? (
            messages.map((msg, index) => (
              <div key={index} className="">
                {msg.sender === userInfo._id && (
                  <div
                    className={`w-full flex items-start justify-end gap-2`}
                    onDoubleClick={() => handleDoubleClick(index)}
                  >
                    {borderedMessageIndex === index &&
                      msg.sender === userInfo._id && (
                        <div className="w-[5rem] flex flex-wrap items-center justify-center gap-1">
                          <button
                            className="w-full h-8 px-2 py-1 rounded duration-200 bg-white bg-opacity-5 hover:bg-opacity-10 text-sm"
                            onClick={() => {
                              handleDoubleClick();
                              handleCancelEdit();
                            }}
                          >
                            Cancel
                          </button>

                          <button
                            className="p-2 rounded-sm text-white duration-200 bg-white bg-opacity-5 hover:bg-opacity-10"
                            onClick={handleEditMessage(msg._id, msg.content)}>
                            <MdEdit />
                          </button>

                          <button
                            className="p-2 rounded-sm text-white  duration-200 bg-white bg-opacity-5 hover:bg-opacity-10"
                            onClick={() => handleDeleteMessage(msg._id)}
                          >
                            <MdDeleteOutline />
                          </button>
                        </div>
                      )}

                    <button
                      className="p-1 text-white text-opacity-15 bg-white bg-opacity-[3%] text-sm"
                      onClick={() => handleDoubleClick(index)}
                    >
                      {borderedMessageIndex === index ? (
                        <FaChevronDown />
                      ) : (
                        <FaChevronLeft />
                      )}
                    </button>

                    <div className="p-2 rounded-sm max-w-sm md:max-w-2xl break-words bg-white bg-opacity-5">
                      {msg.content}
                    </div>
                    <div className="w-18 h-18 flex flex-col items-center justify-center gap-1 border-l-[1px] border-white border-opacity-40 px-2">
                      <img
                        src={
                          userInfo.accountImage ||
                          "https://via.placeholder.com/30"
                        }
                        alt="You"
                        className="w-12 h-12 rounded"
                      />
                      <p className="text-xs">{FormatUTC(msg.createdAt)}</p>
                    </div>
                  </div>
                )}
                {/* Contact's Messages (Right Side) */}
                {msg.sender === contactInfo._id && (
                  <div className="w-full flex items-start justify-start gap-2">
                    <div className="w-18 h-18 flex flex-col items-center gap-1 border-r-[1px] border-white border-opacity-40 px-2">
                      <img
                        src={
                          contactInfo.accountImage ||
                          "https://via.placeholder.com/30"
                        }
                        alt={`${contactInfo.username || "Contact"}'s avatar`}
                        className="w-12 h-12 rounded"
                      />
                      <p className="text-xs">{FormatUTC(msg.createdAt)}</p>
                    </div>
                    <div className="max-w-2xl p-2 break-words rounded-sm bg-white bg-opacity-5">
                      {msg.content}
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-center text-gray-400">No messages yet...</p>
          )}
        </div>
      </div>

      <div className="bg-transparent flex items-center">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-grow p-4 rounded-l outline-none bg-white bg-opacity-10 text-white shadow-lg placeholder:text-white"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSendMessage();
            }
          }}
        />
        <button
          onClick={handleSendMessage}
          className="p-4 bg-white bg-opacity-15 rounded-r shadow-md"
        >
          {editMode ? "Update" : "Send"}
        </button>
      </div>
    </motion.div>
  );
};

export default Chat;
