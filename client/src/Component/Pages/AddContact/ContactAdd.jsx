import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { motion } from "framer-motion";
import { useMediaQuery } from "react-responsive";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { usersURI } from "../../../api"; // Update with the correct path to your API file
import { FaHandPointLeft } from "react-icons/fa6";
import { useAlert } from "../../../Context/AlertContext";
import { AiOutlineCheckCircle, AiOutlineInfoCircle } from 'react-icons/ai'; // Import icons

const AddContact = () => {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const isMd = useMediaQuery({ query: "(min-width: 768px)" });
  const navigate = useNavigate(); // Initialize useNavigate
  const { showAlert } = useAlert(); // Access showAlert from context

  useEffect(() => {
    if (query) {
      fetchSearchResults(query).then((results) => setSearchResults(results));
    } else {
      setSearchResults([]);
    }
  }, [query]);

  useEffect(() => {
    if (isMd) {
      fetchSuggestions().then((results) => setSuggestions(results));
    }
  }, [isMd]);

  const fetchSuggestions = async () => {
    try {
      const response = await usersURI.get("/suggestion-contacts");
      return response.data;
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      return [];
    }
  };

  const fetchSearchResults = async (query) => {
    try {
      const response = await usersURI.post("/find-contact", {
        searchTerm: query,
        searchType: "name",
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching search results:", error);
      return [];
    }
  };

  const addContact = async (contactId) => {
    try {
      const res = await usersURI.post("/add-contact", { contactId });
      showAlert({
        title: 'Success',
        text: res.data.msg,
        type: 'success',
        icon: AiOutlineCheckCircle,
        autoClose: true,
        autoCloseDuration: 3000, // 3 seconds
      });
    } catch (error) {
      console.log(error)
      showAlert({
        title: 'Error',
        text: error.response.data.msg,
        type: 'error',
        icon: AiOutlineInfoCircle,
        autoClose: true,
        autoCloseDuration: 3000, // 2 seconds
      });
    }
  };

  const handleAddContact = (contactId) => {
    addContact(contactId);
  };

  const handleInfoContact = (contactId) => {
    navigate(`/contact/${contactId}`);
  };

  const handleSearchChange = (e) => {
    setQuery(e.target.value);
  };

  const handleGoBack = () => {
    navigate(-1); // Navigate back in history
  };

  return (
    <main className="w-full h-screen p-4 flex flex-col md:flex-row relative bg-transparent text-white">
      <section className="flex flex-col w-full md:w-2/3">
        <div className="h-12 flex items-center rounded-sm bg-transparent">
          <button
            onClick={handleGoBack}
            className="p-3.5 rounded-sm bg-white bg-opacity-15 hover:bg-opacity-20 mx-4"
            aria-label="Go Back"
          >
            <FaHandPointLeft className="text-lg" />
          </button>
          <div className="bg-white bg-opacity-10 w-14 h-12 flex items-center justify-center">
            <FaSearch className="text-lg" />
          </div>
          <input
            type="text"
            placeholder="Search contacts..."
            value={query}
            onChange={handleSearchChange}
            className="w-full h-full rounded-sm outline-none bg-white bg-opacity-10 px-2 placeholder:text-inherit"
            aria-label="Search Contacts"
          />
        </div>

        <div className="mt-4">
          {searchResults.length > 0 ? (
            searchResults.map((result) => (
              <motion.div
                key={result._id}
                className="flex items-center p-1 mb-3 rounded-sm bg-white bg-opacity-5 shadow-md shadow-zinc-700"
                whileHover={{ scale: 1.02 }}
                aria-label={`Contact: ${result.username}`}
              >
                <img
                  src={result.accountImage}
                  alt={`${result.username}'s avatar`}
                  className="w-16 h-16 rounded"
                  loading="eager"
                />
                <span className="flex-1 font-medium mx-4">
                  {result.username}
                </span>
                <button
                  onClick={() => handleAddContact(result._id)}
                  className="w-12 h-8 bg-white bg-opacity-10 hover:bg-opacity-20 duration-300 text-white rounded-sm shadow-md text-sm shadow-zinc-700 mx-1"
                >
                  Add
                </button>
                <button
                  onClick={() => handleInfoContact(result._id)}
                  className="w-12 h-8 bg-white bg-opacity-10 hover:bg-opacity-20 duration-300 text-white rounded-sm shadow-md text-sm shadow-zinc-700 mx-1"
                >
                  Info
                </button>
              </motion.div>
            ))
          ) : (
            <></>
          )}
        </div>
      </section>

      {isMd && (
        <section className="w-full md:w-1/2 md:ml-4 mt-4 md:mt-2">
          <h2 className="text-xl mb-7">Suggestions</h2>
          {suggestions.length > 0 ? (
            suggestions.map((suggestion) => (
              <motion.div
                key={suggestion._id}
                className="flex items-center p-1 rounded-sm mb-3 bg-white bg-opacity-5 shadow-md shadow-zinc-700"
                whileHover={{ scale: 1.02 }}
                aria-label={`Suggestion: ${suggestion.username}`}
              >
                <div className="w-16 h-16">
                  <img
                    src={suggestion.accountImage}
                    alt={`${suggestion.username}'s avatar`}
                    className="w-full h-full rounded object-cover"
                    loading="eager"
                  />
                </div>
                <span className="flex-1 font-medium mx-4">
                  {suggestion.username}
                </span>
                <button
                  onClick={() => handleAddContact(suggestion._id)}
                  className="w-12 h-8 bg-white bg-opacity-10 hover:bg-opacity-20 duration-300 text-white rounded-sm shadow-md text-sm shadow-zinc-700 mx-1"
                >
                  Add
                </button>
                <button
                  onClick={() => handleInfoContact(suggestion._id)}
                  className="w-12 h-8 bg-white bg-opacity-10 hover:bg-opacity-20 duration-300 text-white rounded-sm shadow-md text-sm shadow-zinc-700 mx-1"
                >
                  Info
                </button>
              </motion.div>
            ))
          ) : (
            <p className="text-gray-500">No suggestions available</p>
          )}
        </section>
      )}
    </main>
  );
};

export default AddContact;
