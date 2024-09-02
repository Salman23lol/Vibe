// AlertContext.jsx
import React, { createContext, useState, useContext } from 'react';
import EnhancedAlert from '../Component/CustomSweetAlert/CustomAlert'; // Import your alert component

const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const [alert, setAlert] = useState({
    isOpen: false,
    title: '',
    text: '',
    icon: null,
    type: 'info',
    autoClose: false,
    autoCloseDuration: 2000,
  });

  const showAlert = (options) => {
    return new Promise((resolve) => {
      setAlert({
        isOpen: true,
        ...options,
        onClose: () => {
          hideAlert();
          if (options.onClose) {
            options.onClose();  
          }
          resolve(); // Resolve the promise when the alert is closed
        }
      });
    });
  };
  

  const hideAlert = () => {
    setAlert((prevAlert) => ({
      ...prevAlert,
      isOpen: false,
    }));
  };

  return (
    <AlertContext.Provider value={{ showAlert, hideAlert }}>
      {children}
      {alert.isOpen && (
        <EnhancedAlert
          isOpen={alert.isOpen}
          title={alert.title}
          text={alert.text}
          icon={alert.icon}
          type={alert.type}
          autoClose={alert.autoClose}
          autoCloseDuration={alert.autoCloseDuration}
          onClose={hideAlert}
        />
      )}
    </AlertContext.Provider>
  );
};

export const useAlert = () => useContext(AlertContext);
