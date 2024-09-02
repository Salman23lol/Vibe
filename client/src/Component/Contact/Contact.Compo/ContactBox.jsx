import React, { useState, useEffect, useCallback, lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { IoIosSearch, IoIosArrowUp } from "react-icons/io";
import { FaDotCircle } from "react-icons/fa";
import { IoNotificationsOutline } from "react-icons/io5";
import { LiaFilterSolid } from "react-icons/lia";
import { usersURI } from "../../../api";
import { ClearSession } from "../../../Function/ClearSession";
import Loading from "../../Loading/Loading";
import ToolTip from "../../CustomToolTips/CustomerTip";

// Lazy load the components
const UserSettings = lazy(() => import("./UserSettings"));
const Filter = lazy(() => import("./Head/Filter"));
const YourHeader = lazy(() => import("./Head/YourHeader"));
const ContactList = lazy(() => import("./Contact/ContactList"));
const SmallLoading = lazy(() => import("../../Loading/SmallLoading"));

// Filter function to filter contacts based on searchTerm and filter
const filterContacts = (contacts, searchTerm, filter) => {
  let filtered = contacts;

  // Filter by search term (username, email, or accountPhoneNo)
  if (searchTerm) {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    filtered = filtered.filter((contact) =>
      contact.username.toLowerCase().includes(lowerCaseSearchTerm) ||
      contact.email.toLowerCase().includes(lowerCaseSearchTerm) ||
      contact.accountPhoneNo.includes(lowerCaseSearchTerm)
    );
  }

  // Filter by status
  if (filter !== "All") {
    filtered = filtered.filter((contact) => contact.status.toLowerCase() === filter.toLowerCase());
  }

  return filtered;
};

const ContactBox = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchMeInfo, setFetchMeInfo] = useState();

  // Fetch contacts from the API
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const contactsResponse = await usersURI.get("/contacts");

        if (contactsResponse.status === 401 || contactsResponse.data.msg === "Token is not valid") {
          ClearSession();
          return;
        }

        setContacts(contactsResponse.data || []);

        const meInfoResponse = await usersURI.get("/info");
        setFetchMeInfo(meInfoResponse.data);

        setIsLoading(false);
      } catch (err) {
        console.error("Error:", err);
        setIsLoading(false);
      }
    };

    fetchContacts();
  }, []);

  // Update filtered contacts whenever searchTerm, filter, or contacts change
  useEffect(() => {
    setFilteredContacts(filterContacts(contacts, searchTerm, filter));
  }, [contacts, searchTerm, filter]);

  // Event handlers
  const toggleSettings = useCallback(() => {
    setIsSettingsOpen((prev) => !prev);
    if (isFiltersOpen) setIsFiltersOpen(false);
  }, [isFiltersOpen]);

  const toggleFilters = useCallback(() => {
    setIsFiltersOpen((prev) => !prev);
    if (isSettingsOpen) setIsSettingsOpen(false);
  }, [isSettingsOpen]);

  const handleSearchChange = useCallback(
    (event) => setSearchTerm(event.target.value),
    []
  );

  const handleFilterChange = useCallback(
    (newFilter) => setFilter(newFilter),
    []
  );

  // Handle input focus and blur
  const handleInputFocus = () => setIsInputFocused(true);
  const handleInputBlur = () => setIsInputFocused(false);

  return (
    <div className="w-full h-full overflow-hidden text-white text-opacity-70">
      <Suspense fallback={<SmallLoading />}>
        <YourHeader
          toggleSettings={toggleSettings}
          // toggleNotification={toggleNotification}
          toggleFilters={toggleFilters}
          filter={filter}
          fetchMeInfo={fetchMeInfo}
        />
      </Suspense>

      <motion.div
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.4, ease: "easeIn" }}
        className="w-full h-auto flex items-center justify-between gap-3 pr-3 p-2 relative"
      >
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          id="Contact-Search"
          className="w-full h-12 flex items-center bg-white bg-opacity-10 rounded-sm"
        >
          <motion.div
            id="searchbtn"
            className="w-12 h-full flex items-center justify-center bg-white bg-opacity-10 hover:bg-opacity-20 duration-300"
          >
            {isInputFocused ? (
              <IoIosArrowUp className="bg-transparent text-xl" />
            ) : (
              <IoIosSearch className="bg-transparent text-2xl" />
            )}
          </motion.div>

          <motion.input
            placeholder="Search by name..."
            className="w-full text-base bg-transparent py-3 px-3 outline-none placeholder:text-gray-300"
            value={searchTerm}
            onChange={handleSearchChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
          />
        </motion.div>
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          onClick={toggleFilters}
          className="p-3 cursor-pointer bg-white bg-opacity-15 rounded-sm"
          data-tooltip-id="filter-btn-tooltip"
            data-tooltip-content="Filter Your Contacts"
        >
          {filter === "All" && (
            <LiaFilterSolid className="text-[1.5rem] bg-transparent" />
          )}
          {filter === "Online" && (
            <FaDotCircle className="text-[1.5rem] text-green-400 bg-transparent" />
          )}
          {filter === "Offline" && (
            <FaDotCircle className="text-[1.5rem] text-gray-300 text-opacity-80 bg-transparent" />
          )}
          {filter === "Busy" && (
            <FaDotCircle className="text-[1.5rem] text-orange-400 text-opacity-80 bg-transparent" />
          )}
          {filter === "unReaded" && (
            <motion.div
              initial={{ y: 0, rotate: 0, scale: 1 }}
              animate={{
                y: [0, 0, 0, 0, 0],
                rotate: [0, 10, -10, 10, -10, 10, -10, 5, 0],
                scale: [1, 1.05, 1.1, 1.05, 1],
              }}
              transition={{
                duration: 2,
                ease: "easeInOut",
                repeat: Infinity,
              }}
              className="h-full flex items-center justify-center"
            >
              <IoNotificationsOutline className="text-[1.5rem]" />
            </motion.div>
          )}
        </motion.div>
      </motion.div>

      {isLoading && (
        <div className="w-full h-full">
          <Loading />
        </div>
      )}
      <Suspense fallback={<SmallLoading />}>
        <ContactList filter={filter} contacts={filteredContacts}/>
      </Suspense>

      <Suspense fallback={<div>Loading settings...</div>}>
        {isSettingsOpen && <UserSettings />}
      </Suspense>

      <Suspense fallback={<div>Loading filters...</div>}>
        {isFiltersOpen && <Filter onFilterChange={handleFilterChange} />}
      </Suspense>

      <ToolTip id="filter-btn-tooltip" />
    </div>
  );
};

export default ContactBox;
