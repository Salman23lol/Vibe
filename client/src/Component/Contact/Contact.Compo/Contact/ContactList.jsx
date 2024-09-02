import React, { useEffect, useState } from 'react';
import { easeIn, motion } from 'framer-motion';
import SingleContact from './SingleContact';
import EmptyContactState from './EmptyContactState';
import { usersURI } from '../../../../api';

const ContactList = ({ contacts = [] }) => {
  const [userInfo, setUserInfo] = useState()
  useEffect(() => {
    const fetchLogginInfo = async ()=>{
      try {
        const meInfoResponse = await usersURI.get("/info");
        if(meInfoResponse.status === 401){
          console.log(meInfoResponse.data)
        }
          setUserInfo(meInfoResponse.data)
      } catch (error) {
        
      }
    }
    fetchLogginInfo()
  }, [])
  


  return (
    <div className="w-full h-[84vh] md:h-[76vh] flex items-center justify-center p-4 md:p-0 text-white text-opacity-70">
      <div className="w-full h-full flex flex-col items-center gap-3 bg-transparent">
        {contacts.length > 0 ? (
          <div className="w-full flex flex-col items-center bg-transparent overflow-y-scroll no-scrollbar">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, ease: easeIn }}
              className="text-xl font-medium mb-2"
            >
              Contacts
            </motion.p>
            <div className="w-full md:w-[70%] flex flex-col items-center gap-2.5 bg-transparent overflow-y-scroll no-scrollbar">
              {contacts.map((contact, index) => (
                <motion.div
                  key={contact.id} // Use a unique identifier as the key
                  initial={{ y: '100%', opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 1, delay: index * 0.1, ease: "easeOut" }}
                  className="w-full h-full"
                >
                  <SingleContact
                    contact={contact}
                    userInfo={userInfo}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <EmptyContactState />
        )}
      </div>
    </div>
  );
};

export default ContactList;
