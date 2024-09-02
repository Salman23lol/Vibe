import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, easeInOut } from 'framer-motion';
import { AiOutlineClose } from 'react-icons/ai';
import PropTypes from 'prop-types';

const ALERT_TYPES = {
  success: 'bg-green-100 border-green-400 text-green-700',
  error: 'bg-red-100 border-red-400 text-red-700',
  info: 'bg-blue-100 border-blue-400 text-blue-700',
  warning: 'bg-yellow-100 border-yellow-400 text-yellow-700',
};

const EnhancedAlert = ({
  isOpen,
  title,
  text,
  icon: Icon,
  type = 'info',
  autoClose = false,
  autoCloseDuration = 4000,
  onConfirm,
  onCancel,
  customButton,
  customButtonText,
  onClose,
}) => {
  const [show, setShow] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setShow(true);
      if (autoClose) {
        const exitDelay = autoCloseDuration * 0.75; // Start exit 1/4 of the duration before actual close
        const timer = setTimeout(() => {
          setShow(false);
          if (onClose) onClose();
        }, exitDelay);
        return () => clearTimeout(timer);
      }
    } else {
      setShow(false);
    }
  }, [isOpen, autoClose, autoCloseDuration, onClose]);

  const handleConfirm = () => {
    setShow(false);
    if (onConfirm) onConfirm();
  };

  const handleCancel = () => {
    setShow(false);
    if (onCancel) onCancel();
  };

  const handleClose = () => {
    setShow(false);
    if (onClose) onClose();
  };

  return (
    <AnimatePresence mode="wait">
      {show && (
        <motion.div
          className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }} // Adjust this as needed
        >
          <motion.div
            className={`bg-white p-6 rounded-lg shadow-lg w-80 border-l-4 ${ALERT_TYPES[type]}`}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center mb-4">
              {Icon && <Icon className="text-xl mr-2" />}
              <h3 className="text-lg font-bold">{title}</h3>
              <button
                className="ml-auto text-gray-500"
                onClick={handleClose}
              >
                <AiOutlineClose />
              </button>
            </div>
            <p className="mb-4">{text}</p>
            <div className="flex justify-end space-x-2">
              {customButton ? (
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                  onClick={customButton.onClick}
                >
                  {customButtonText || 'Custom'}
                </button>
              ) : (
                <>
                  {onCancel && (
                    <button
                      className="bg-gray-500 text-white px-4 py-2 rounded"
                      onClick={handleCancel}
                    >
                      Cancel
                    </button>
                  )}
                  {onConfirm && (
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded"
                      onClick={handleConfirm}
                    >
                      Confirm
                    </button>
                  )}
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};


EnhancedAlert.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  icon: PropTypes.elementType,
  type: PropTypes.oneOf(['success', 'error', 'info', 'warning']),
  autoClose: PropTypes.bool,
  autoCloseDuration: PropTypes.number,
  onConfirm: PropTypes.func,
  onCancel: PropTypes.func,
  customButton: PropTypes.shape({
    onClick: PropTypes.func.isRequired,
  }),
  customButtonText: PropTypes.string,
  onClose: PropTypes.func,
};

export default EnhancedAlert;
