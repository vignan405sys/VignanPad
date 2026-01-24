import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { PeerProvider } from './context/PeerContext.jsx'
import { CloudProvider } from './context/CloudContext.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <CloudProvider>
            <PeerProvider>
                <App />
            </PeerProvider>
        </CloudProvider>
    </React.StrictMode>,
)

