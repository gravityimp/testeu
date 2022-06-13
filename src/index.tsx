import React from 'react';
import ReactDOM from "react-dom";
import App from './App';
import ReactTooltip from 'react-tooltip';
import { BrowserRouter } from 'react-router-dom'
import { SnackbarProvider } from 'notistack';

const rootElement = document.getElementById("root");
ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <SnackbarProvider maxSnack={3}>
        <ReactTooltip />
        <App />
      </SnackbarProvider>
    </BrowserRouter>
  </React.StrictMode>
  , rootElement
);