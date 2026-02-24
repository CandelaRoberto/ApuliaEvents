import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Provider} from "react-redux";
import store from "./Auth/store.js";
import { logoutUser } from "./Auth/Slice/authSlice.js";

const originalFetch = window.fetch;

window.fetch = async (url, options = {}) => {
    const state = store.getState();
    const token = state.auth.token;

    const headers = { ...(options.headers || {}) };

    if (token) headers["Authorization"] = `Bearer ${token}`;

    if (options.body && !(options.body instanceof FormData) && !headers["Content-Type"]) {
        headers["Content-Type"] = "application/json";
    }

    const response = await originalFetch(url, {
        ...options,
        headers,
        credentials: "include",
    });

    if (response.status === 401) {
        store.dispatch(logoutUser());
        window.location.href = "/";
        return;
    }

    return response;
};


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
    <App />
    </Provider>
  </React.StrictMode>
);


