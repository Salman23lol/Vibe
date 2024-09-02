import React from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";
import 'react-tooltip/dist/react-tooltip.css';
import { motion } from "framer-motion";

const ToolTip = ({ id, place }) => (
  <ReactTooltip
    id={id}
    style={{
      width: "auto",
      height: "auto",
      backgroundColor: "rgba(39, 39, 42, 0.8)",
      borderRadius: "0.375rem",
      fontSize: "0.7rem",
      padding: "0.4rem",
      paddingLeft: "0.6rem",
      paddingRight: "0.6rem",
      color: "#D1D5DB",
      textAlign: "center",
      alignItems: "start",
      zIndex: "1000000",
      fontWeight: "500",
      letterSpacing: "0.3px",
    }}
    render={(tooltipProps) => (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.3 }}
        {...tooltipProps}
      >
        {tooltipProps?.content || ''}
      </motion.div>
    )}
    place={place || 'bottom'}
    effect="solid"
  />
);

export default ToolTip;
