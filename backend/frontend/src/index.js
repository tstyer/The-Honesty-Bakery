import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './store';

// CSS
import './product_card.css';
import './index.css';
import './about.css';
import './products.css';
import './cart.css';
import './place_order.css';
import './bootstrap.min.css';
import './error.css';

// APP
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);


