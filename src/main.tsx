import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import 'antd/dist/reset.css'
import App from './App.tsx'
import ErrorBoundary from './components/ErrorBoundary.tsx'
import { I18nProvider } from './i18n/I18nContext.tsx'

console.log('Main.tsx loaded');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <I18nProvider>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </I18nProvider>
    </BrowserRouter>
  </StrictMode>,
)
