import { motion } from "framer-motion";
import React, { useState, useEffect } from "react";
import { HexColorPicker } from "react-colorful";
import { FaPalette, FaTimes } from "react-icons/fa";

const ColorPicker = ({ color, onChange }) => {
  const [showPicker, setShowPicker] = useState(false);
  const [opacity, setOpacity] = useState(1); // Initial opacity value

  // Parse initial opacity from color (if provided)
  useEffect(() => {
    if (color.length === 9) {
      // Assuming color is in #RRGGBBAA format
      const initialOpacity = parseInt(color.slice(-2), 16) / 255;
      setOpacity(initialOpacity);
    }
  }, [color]);

  // Handle opacity change and update color with opacity
  const handleOpacityChange = (e) => {
    const newOpacity = parseFloat(e.target.value);
    setOpacity(newOpacity);
    updateColorWithOpacity(color, newOpacity);
  };

  // Function to update color with opacity
  const updateColorWithOpacity = (color, opacity) => {
    const alphaHex = Math.round(opacity * 255)
      .toString(16)
      .padStart(2, "0"); // Convert to hex and pad
    const newColor = color.slice(0, 7) + alphaHex; // Append alpha to the color
    onChange(newColor);
  };

  return (
    <div className="relative inline-block">
      {/* Button to toggle the color picker */}
      <motion.button
        whileHover={{ rotate: 180, scale: 0.95 }}
        transition={{ duration: 0.5 }}
        onClick={() => setShowPicker(!showPicker)}
        className="w-16 h-16 text-2xl rounded-full flex items-center justify-center relative"
        style={{ backgroundColor: color }}
      >
        <FaPalette className="text-white" />
      </motion.button>

      {/* Color Picker Modal */}
      {showPicker && (
        <div className="absolute z-10 mt-2 p-4 px-6 bg-zinc-700 rounded shadow-lg">
          <HexColorPicker
            color={color}
            onChange={(newColor) => updateColorWithOpacity(newColor, opacity)}
          />

          {/* Opacity Slider */}
          <div className="mt-4">
            <label className="text-gray-200">
              Opacity: {Math.round(opacity * 100)}%
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={opacity}
              onChange={handleOpacityChange}
              className="w-full mt-1"
            />
          </div>

          {/* Close Icon */}
          <FaTimes
            className="text-gray-200 cursor-pointer absolute top-2 right-2"
            onClick={() => setShowPicker(false)}
          />
        </div>
      )}
    </div>
  );
};

export default ColorPicker;
