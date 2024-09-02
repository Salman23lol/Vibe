import React, { lazy, Suspense } from "react";
import { easeIn, motion } from "framer-motion";

// Lazy load the ContactBox component
const ContactBox = lazy(() => import("./Contact.Compo/ContactBox"));
const Loading = lazy(() => import("../Loading/Loading"));

const Contact = () => {
  return (
    <motion.div
      initial={{ scale: 0.95 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.3, ease: easeIn }}
      className="w-full h-screen md:p-8 overflow-hidden"
    >
      <Suspense fallback={<Loading />}>
        <ContactBox />
      </Suspense>
    </motion.div>
  );
};

export default Contact;
