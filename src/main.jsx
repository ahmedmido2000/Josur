import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import './index.css'
import App from './App.jsx'
import store from './store'
import ErrorBoundary from './components/ErrorBoundary'
import ToastNotification from './components/ToastNotification'

// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

// FontAwesome
import '@fortawesome/fontawesome-free/css/all.min.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <ErrorBoundary>
        <BrowserRouter>
          <App />
          <ToastNotification />
        </BrowserRouter>
      </ErrorBoundary>
    </Provider>
  </StrictMode>
)
