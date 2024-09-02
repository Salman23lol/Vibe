import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Loading from './Component/Loading/Loading';
import Testing from './Component/TestingPage/Testing';

const Auth = lazy(() => import('./Component/Auth/Auth'));
const Register = lazy(() => import('./Component/Auth/Auth.Compo/Register'));
const Login = lazy(() => import('./Component/Auth/Auth.Compo/Login'));
const Chat = lazy(() => import('./Component/Chat/Chat'));
const MeInfo = lazy(() => import('./Component/Pages/Me/MeInfo'));
const SettingsPage = lazy(() => import('./Component/Pages/Settings/SettingsPage'));
const Contact = lazy(() => import('./Component/Contact/Contact'));
const ContactInfo = lazy(() => import('./Component/Pages/ContactInfo/ContactInfo'));
const ContactAdd = lazy(() => import('./Component/Pages/AddContact/ContactAdd'));
const NotFound = lazy(() => import('./Component/NotFound/NotFound'));
const IsLoggedin = lazy(() => import('./Middleware/IsLoggedin'));
const AuthCheck = lazy(() => import('./Middleware/AuthCheck'));

const App = () => {
  return (
    <BrowserRouter>
    <div id="Main" className="overflow-hidden">
      <Suspense fallback={<Loading />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<IsLoggedin element={Auth} redirectPath="/home" />} />

          {/* Protected Routes */}
          <Route path="/testing" element={<AuthCheck element={Testing} />} />
          <Route path="/home" element={<AuthCheck element={Contact} />} />
          <Route path="/me" element={<AuthCheck element={MeInfo} />} />
          <Route path="/settings/:id" element={<AuthCheck element={SettingsPage} />} />
          <Route path="/chat/:id" element={<AuthCheck element={Chat} />} />
          <Route path="/contact/:id" element={<AuthCheck element={ContactInfo} />} />
          <Route path="/contact/add" element={<AuthCheck element={ContactAdd} />} />

          {/* Login and Register Routes with redirection logic */}
          <Route path="/auth/register" element={<IsLoggedin element={Register} redirectPath="/home" />} />
          <Route path="/auth/login" element={<IsLoggedin element={Login} redirectPath="/home" />} />

          {/* Catch-all for 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </div>
  </BrowserRouter>
  );
};

export default App;
