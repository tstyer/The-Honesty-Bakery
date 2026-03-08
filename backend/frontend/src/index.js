import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './store';
import './product_card.css';

import './index.css';
import './about.css';
import './products.css';
import './cart.css';
import './place_order.css';
import './bootstrap.min.css';
import App from './App';

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <App />
    <ToastContainer position="top-center" autoClose={2000} />
  </Provider>
);


