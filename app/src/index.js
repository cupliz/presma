import React from 'react'
import ReactDOM from 'react-dom'
import * as serviceWorker from './serviceWorker'
import 'react-toastify/dist/ReactToastify.css'
import "react-datepicker/dist/react-datepicker.css"
import 'bootstrap/dist/css/bootstrap.min.css'
import 'react-table-v6/react-table.css'
import "react-datepicker/dist/react-datepicker.css"
import App from './App'

import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
// import logger from 'redux-logger'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { PersistGate } from 'redux-persist/integration/react'
import { composeWithDevTools } from 'redux-devtools-extension'
import { rootReducer } from './store.js'

const persistedReducer = persistReducer({ key: 'root', storage }, rootReducer)
const middleware = composeWithDevTools(applyMiddleware(thunk))
const store = createStore(persistedReducer, middleware)
const persistor = persistStore(store)

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
  ,
  document.getElementById('root')
)

// unregister() to register() below. Note this comes with some pitfalls.
serviceWorker.unregister()
