import React, { useState } from 'react';
import { IoNotificationsOutline } from 'react-icons/io5';
import { FaDotCircle } from 'react-icons/fa';
import { CiFilter } from 'react-icons/ci';
import { motion } from "framer-motion";

const Filter = ({ onFilterChange }) => {
  const [selectedFilter, setSelectedFilter] = useState('');

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
    onFilterChange(filter);
  };

  const filterOptions = [
    { 
      name: 'unReaded', 
      icon: (
        <motion.div
          initial={{ y: 0, rotate: 0, scale: 1 }}
          animate={{
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
          <IoNotificationsOutline className="text-xl" />
        </motion.div>
      ) 
    },
    { name: 'Busy', icon: <FaDotCircle className="text-orange-400 text-[1.2rem]" /> },
    { name: 'Online', icon: <FaDotCircle className="text-green-400 text-[1.2rem]" /> },
    { name: 'Offline', icon: <FaDotCircle className="text-gray-300 text-opacity-80 text-[1.2rem]" /> },
    { name: 'All', icon: <CiFilter className="text-[1.5rem]" /> },
  ];

  return (
    <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    className="absolute top-[8rem] right-3 md:top-[10rem] md:right-[2.7rem] w-64 md:w-96 h-auto bg-zinc-800 bg-opacity-90  shadow-lg shadow-zinc-800">
      <div className="p-2 flex flex-col items-start gap-2">
        {filterOptions.map((filter) => (
          <div
            key={filter.name}
            className={`w-full p-3 flex items-center gap-3 duration-300 hover:bg-white hover:bg-opacity-5 cursor-default ${
              selectedFilter === filter.name ? 'bg-white bg-opacity-5' : ''
            }`}
            onClick={() => handleFilterChange(filter.name)}
          >
            {filter.icon}
            <span>{filter.name}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default Filter;
