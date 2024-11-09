// index.js or main entry file
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Provider } from 'react-redux';
import { store, persistor } from './app/store'; // import store and persistor
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeProvider } from '@mui/material';
import theme from './theme/theme';
import { PersistGate } from 'redux-persist/integration/react'; // import PersistGate

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <App />
          <ToastContainer position='top-right' autoClose={1500} closeOnClick />
        </PersistGate>
      </Provider>
    </ThemeProvider>
  </React.StrictMode>
);
