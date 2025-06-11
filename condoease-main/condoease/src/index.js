import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import 'core-js'

import WebApp from './web/WebApp' // Use WebApp as the entry point
import MobileApp from './mobile/MobileApp' // Import MobileApp if needed
import store from './store'
import { UserProvider } from './context/UserContext' // Import UserProvider

const isMobile = import.meta.env.VITE_PLATFORM === 'mobile'
console.log('VITE_PLATFORM:', import.meta.env.VITE_PLATFORM)

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <UserProvider>{isMobile ? <MobileApp /> : <WebApp />}</UserProvider>
    </Provider>
  </React.StrictMode>,
)
