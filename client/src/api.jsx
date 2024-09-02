// api.js
import axios from 'axios';

// Base API URL https://vibe-z8y6.vercel.app
// const api = 'http://localhost:5000';
const api = 'http://localhost:5000';

// Axios instances with default headers
export const authURI = `${api}/api/auth`;

let token = sessionStorage.getItem('sessionToken');

// Authorization header setup using session token
const authHeader = () => {
  token = sessionStorage.getItem('sessionToken');
  return token ? { 'x-auth-token': token } : {};
};

// Function to update the token dynamically
export const updateToken = (newToken) => {
  sessionStorage.setItem('sessionToken', newToken);
  token = newToken;

  // Update headers for existing Axios instances
  chatsURI.defaults.headers = authHeader();
  usersURI.defaults.headers = authHeader();
};

// Axios instances
export const chatsURI = axios.create({
  baseURL: `${api}/api/chats`,
  headers: authHeader()
});

export const usersURI = axios.create({
  baseURL: `${api}/api/users`,
  headers: authHeader()
});
