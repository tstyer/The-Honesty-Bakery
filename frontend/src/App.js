import React, { useEffect, useState } from "react";
import axios from "axios";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import { Container } from "react-bootstrap";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";
import HomeScreen from "./screens/HomeScreen";
import ProductScreen from "./screens/ProductScreen";
import CartScreen from "./screens/CartScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";

import PaymentScreen from "./screens/PaymentScreen";
import PlaceOrderScreen from "./screens/PlaceOrderScreen";
import OrderScreen from "./screens/OrderScreen";


function App() {
  const [stripePromise, setStripePromise] = useState(null);

  useEffect(() => {
    const load = async () => {
      const { data } = await axios.get("/api/config/stripe/");
      setStripePromise(loadStripe(data.publishableKey));
    };
    load();
  }, []);

  return (
    <Router>
      <Header />

      <main className="py-3">
        <Container>
          {stripePromise ? (
            <Elements stripe={stripePromise}>
              <Routes>
                <Route path="/" element={<HomeScreen />} />
                <Route path="/product/:id" element={<ProductScreen />} />

                {/* Cart routes */}
                <Route path="/cart" element={<CartScreen />} />
                <Route path="/cart/:id" element={<CartScreen />} />

                <Route path="/login" element={<LoginScreen />} />
                <Route path="/register" element={<RegisterScreen />} />

                {/* Payment routes */}
                <Route path="/payment" element={<PaymentScreen />} />
                <Route path="/placeorder" element={<PlaceOrderScreen />} />
                <Route path="/order/:id" element={<OrderScreen />} />
              </Routes>
            </Elements>
          ) : (
            <div>Loading payments…</div>
          )}
        </Container>
      </main>

      <Footer />
    </Router>
  );
}

