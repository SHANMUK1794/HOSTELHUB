import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import { store } from './store/Store.js';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ThemeProvider } from './hooks/ThemeContext.jsx';

// Create the query client instance
const queryClient = new QueryClient();


createRoot(document.getElementById('root')).render(
  // <StrictMode>
     <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
        <BrowserRouter>
        <ThemeProvider>
          <App />
        </ThemeProvider>
        </BrowserRouter>
        </QueryClientProvider>
        </Provider>
     </GoogleOAuthProvider>
      

  // </StrictMode>
);