import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ApolloProvider } from '@apollo/client'

createRoot(document.getElementById('root')).render(
  <ApolloProvider client={{ client }}>
    <StrictMode>
      <App />
    </StrictMode>,
  </ApolloProvider>
)
