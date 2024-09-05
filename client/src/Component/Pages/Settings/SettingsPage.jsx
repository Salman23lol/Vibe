import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaHandPointLeft } from "react-icons/fa6";
import Modal from "react-modal";
import { motion, AnimatePresence } from "framer-motion";
import { CagePattern, SkullsPattern } from "./Settings.Compo/Pattrens";
import ColorPicker from "./ColorPicker";

const patterns = [
  { name: "Cage", component: CagePattern },
  { name: "Skulls", component: SkullsPattern },
];
const bgPresets = [
  { name: "Gray 50%", color: "#4A4A4A80" },
  { name: "Blue 50%", color: "#3B82F680" },
  { name: "Red 30%", color: "#EF444480" },
  { name: "Green 40%", color: "#10B98166" },
  { name: "Purple 60%", color: "#8B5CF666" },
  { name: "Orange 70%", color: "#F9731666" },
  { name: "Teal 20%", color: "#14B8A666" },
  { name: "Yellow 80%", color: "#F59E0BCC" },
  { name: "Indigo 40%", color: "#4F46E566" },
  { name: "Cyan 50%", color: "#06B6D480" },
  { name: "Emerald 50%", color: "#10B98180" },
  { name: "Rose 50%", color: "#F43F5E80" },
  { name: "SkyBlue 40%", color: "#38BDF880" },
  { name: "Violet 60%", color: "#6D28D880" },
  { name: "Sunset 50%", color: "#F9731666" },
  { name: "Lilac 70%", color: "#D6BCFA80" },
  { name: "Coral 50%", color: "#F8717080" },
  { name: "Mint 40%", color: "#A7F3D080" },
  { name: "Electric 70%", color: "#3B82F780" },
  { name: "Gold 60%", color: "#FBBF2480" },
];



const SettingsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPattern, setSelectedPattern] = useState("");
  const [bgColor, setBgColor] = useState("#DFDBE5");
  const [patternColor, setPatternColor] = useState("#9C92AC");
  const [draggedColor, setDraggedColor] = useState(null);

  const handlePatternClick = (pattern) => {
    setSelectedPattern(pattern);
    setIsModalOpen(true);
  };

  const handleDragStart = (color) => setDraggedColor(color);

  const handleDrop = (e, type) => {
    e.preventDefault();
    if (!draggedColor) return;

    if (type === "bg") setBgColor(draggedColor);
    else if (type === "pattern") setPatternColor(draggedColor);

    setDraggedColor(null);
  };

  const handleApply = () => {
    console.log("Customized Pattern:", selectedPattern);
    console.log("Applied Background Color:", bgColor);
    console.log("Applied Pattern Color:", patternColor);
    setIsModalOpen(false);
  };  

  const renderPatterns = () =>
    patterns.map(({ name, component: PatternComponent }) => (
      <div
        key={name}
        className="w-full h-64 cursor-pointer transition-transform hover:scale-[97%]"
        onClick={() => handlePatternClick(name)}
      >
        <PatternComponent bgColor={bgColor} patternColor={patternColor} />
      </div>
    ));

  return (
    <div className="w-full h-screen bg-transparent text-white">
      <BackButton />
      <PageHeader title="Settings" />
      <div className="w-full h-full grid grid-cols-2">
        <Section title="Appearance" content={renderPatterns()} />
        <Section title="Account" content={<AccountPlaceholders />} />
      </div>
      <AnimatePresence>
        {isModalOpen && (
          <PatternSettingsModal
            isOpen={isModalOpen}
            onRequestClose={() => setIsModalOpen(false)}
            selectedPattern={selectedPattern}
            patterns={patterns}
            bgColor={bgColor}
            patternColor={patternColor}
            setBgColor={setBgColor}
            setPatternColor={setPatternColor}
            handleDrop={handleDrop}
            handleDragStart={handleDragStart}
            handleApply={handleApply}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Components

const BackButton = () => (
  <Link
    to="/"
    className="p-3.5 absolute top-4 left-4 bg-white bg-opacity-10 hover:bg-opacity-20 duration-300 text-lg"
  >
    <FaHandPointLeft />
  </Link>
);

const PageHeader = ({ title }) => (
  <h1 className="text-2xl font-semibold text-center pt-6 pb-4">{title}</h1>
);

const Section = ({ title, content }) => (
  <div className="w-full h-full">
    <h2 className="text-xl text-center font-light tracking-wide">{title}</h2>
    <div className="w-full h-auto grid grid-cols-2 gap-1 p-5">{content}</div>
  </div>
);

const AccountPlaceholders = () =>
  Array(6).fill(null).map((_, index) => (
    <div key={index} className="w-full h-64 border"></div>
  ));

const PatternSettingsModal = ({
  isOpen,
  onClose,
  onRequestClose,
  selectedPattern,
  patterns,
  bgColor,
  patternColor,
  setBgColor,
  setPatternColor,
  handleDrop,
  handleDragStart,
  handleApply,
}) => {
  const selectedPatternComponent = patterns.find(
    (p) => p.name === selectedPattern
  )?.component;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Pattern Settings"
      className="flex items-center justify-center h-full"
      overlayClassName="fixed inset-0 text-white"
    >
      <div
              onClick={onClose}
              className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            ></div>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: -400 }}
        transition={{ duration: 0.3 }}
        className="absolute bg-white bg-opacity-15 rounded-lg p-2 w-[70%] h-[81vh]"
      >
        <h2 className="text-xl text-center py-2 pb-3">
          {selectedPattern} Settings
        </h2>
        <div className="flex flex-col items-center gap-4">
          <motion.div
            className="w-[90%] h-64 flex items-center justify-center rounded-md"
            onDrop={(e) => handleDrop(e, "pattern")}
            onDragOver={(e) => e.preventDefault()}
          >
            {selectedPatternComponent &&
              selectedPatternComponent({ bgColor, patternColor })}
          </motion.div>
          <ColorAdjusters
            bgColor={bgColor}
            patternColor={patternColor}
            setBgColor={setBgColor}
            setPatternColor={setPatternColor}
            handleDrop={handleDrop}
            handleDragStart={handleDragStart}
          />
        </div>
        <ModalActions onClose={onRequestClose} onApply={handleApply} />
      </motion.div>
    </Modal>
  );
};

const ColorAdjusters = ({
  bgColor,
  patternColor,
  setBgColor,
  setPatternColor,
  handleDrop,
  handleDragStart,
}) => (
  <div className="w-full flex items-start justify-center gap-2">
    <ColorAdjuster
      title="Background Color"
      color={bgColor}
      onChange={setBgColor}
      onDrop={(e) => handleDrop(e, "bg")}
    />
    <ColorAdjuster
      title="Pattern Color"
      color={patternColor}
      onChange={setPatternColor}
      onDrop={(e) => handleDrop(e, "pattern")}
    />
    <PresetPicker handleDragStart={handleDragStart} />
  </div>
);

const ColorAdjuster = ({ title, color, onChange, onDrop }) => (
  <div
    className="w-[70%] h-64 flex flex-col items-center justify-center rounded-md border border-gray-400"
    onDrop={onDrop}
    onDragOver={(e) => e.preventDefault()}
  >
    <h3 className="text-base pb-2">{title}</h3>
    <ColorPicker color={color} onChange={onChange} />
  </div>
);

const PresetPicker = ({ handleDragStart }) => (
  <div className="w-full p-[1.2rem] flex flex-col items-center border border-gray-400 rounded-md">
    <h3 className="text-base pb-2">Presets</h3>
    <div className="grid grid-cols-5 gap-2">
      {bgPresets.map((preset) => (
        <button
          key={preset.name}
          className="w-14 h-14 p-2 rounded text-sm hover:scale-[103%] transition-transform duration-200 ease-in-out"
          style={{ backgroundColor: preset.color }}
          draggable
          onDragStart={() => handleDragStart(preset.color)}
        >
          {preset.name}
        </button>
      ))}
    </div>
  </div>
);

const ModalActions = ({ onClose, onApply }) => (
  <div className="w-full flex items-center justify-end gap-3">
    <button
      className="mt-4 px-4 py-2 bg-red-500 bg-opacity-40 hover:bg-opacity-50 rounded transition-colors"
      onClick={onClose}
    >
      Close
    </button>
    <button
      className="mt-4 px-4 py-2 bg-green-500 bg-opacity-40 hover:bg-opacity-50 rounded transition-colors"
      onClick={onApply}
    >
      Apply
    </button>
  </div>
);

export default SettingsPage;
