import { StrictMode } from 'react'

import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { PersistGate } from 'redux-persist/integration/react'

// Side-effect import: validates required env vars at startup and throws
// with a clear message if any are missing, rather than failing silently later.
import './Utils/envValidation'

import ErrorBoundary from './Components/ErrorBoundary'
import store, { persistor } from './Store/store'
import App from './App'

import './index.scss'

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Root element #root not found in DOM. Check your index.html.')
}

ReactDOM.createRoot(rootElement).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ErrorBoundary>
          <BrowserRouter>
            <ToastContainer autoClose={3000} />
            <App />
          </BrowserRouter>
        </ErrorBoundary>
      </PersistGate>
    </Provider>
  </StrictMode>
)
