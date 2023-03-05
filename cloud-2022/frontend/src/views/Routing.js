import React from "react";
import MainPage from "./MainPage";
import StudentPage from "./StudentPage";
import AdminPage from "./AdminPage";
import MenuPage from "./MenuPage";
import CanteensPage from "./CanteensPage";
import { Route, Routes } from "react-router-dom";
import OrderPage from './OrderPage';
import MenuAdminPage from './MenuAdminPage';
import CanteensAdminPage from './CanteensAdminPage';
import OrdersAdminPage from  './OrdersAdminPage';

export default function Routing() {
  return (
    <Routes>
      <Route exact path="/" element={<MainPage />} />

      <Route exact path="/tuke/profile" element={<StudentPage />} />
      <Route exact path="/upjs/profile" element={<StudentPage />} />

      <Route exact path="/tuke/" element={<MenuPage />} />
      <Route exact path="/upjs/" element={<MenuPage />} />

      <Route exact path="/tuke/makeorder" element={<OrderPage />} />
      <Route exact path="/upjs/makeorder" element={<OrderPage />} />

      <Route exact path="/tuke/canteens" element={<CanteensPage />} />
      <Route exact path="/upjs/canteens" element={<CanteensPage />} />

      {/* admin pages */}
      <Route exact path="/tuke/admin/canteens" element={<CanteensAdminPage/>} />
      <Route exact path="/upjs/admin/canteens" element={<CanteensAdminPage/>} />
      <Route exact path="/tuke/admin/" element={<MenuAdminPage />} />
      <Route exact path="/upjs/admin/" element={<MenuAdminPage/>} />
      <Route exact path="/tuke/admin/orders" element={<OrdersAdminPage />} />
      <Route exact path="/upjs/admin/orders" element={<OrdersAdminPage/>} />
    </Routes>
  );
}
