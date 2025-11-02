import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import 'core-js'

import WebApp from './web/WebApp' // Use WebApp as the entry point
import store from './store'
import { UserProvider } from './context/UserContext'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <UserProvider>
        <WebApp />
      </UserProvider>
    </Provider>
  </React.StrictMode>,
)
