import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Layout from "@/components/organisms/Layout";
import Dashboard from "@/pages/Dashboard";
import Products from "@/pages/Products";
import Categories from "@/pages/Categories";
import Locations from "@/pages/Locations";
import Reports from "@/pages/Reports";
import Settings from "@/pages/Settings";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={
            <Layout title="Dashboard">
              <Dashboard />
            </Layout>
          } />
          <Route path="/products" element={
            <Layout title="Products">
              <Products />
            </Layout>
          } />
          <Route path="/categories" element={
            <Layout title="Categories">
              <Categories />
            </Layout>
          } />
          <Route path="/locations" element={
            <Layout title="Locations">
              <Locations />
            </Layout>
          } />
          <Route path="/reports" element={
            <Layout title="Reports">
              <Reports />
            </Layout>
          } />
          <Route path="/settings" element={
            <Layout title="Settings">
              <Settings />
            </Layout>
          } />
        </Routes>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          style={{ zIndex: 9999 }}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;