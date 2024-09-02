import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './App.css'
import { AlertProvider } from './Context/AlertContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
    <AlertProvider>
        <App />
    </AlertProvider>
)
