import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { MoralisProvider } from "react-moralis";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      <MoralisProvider appId={import.meta.env.VITE_MORALIS_APPID} serverUrl={import.meta.env.VITE_MORALIS_SERVERURL}>
          <App />
      </MoralisProvider>
  </React.StrictMode>
)
