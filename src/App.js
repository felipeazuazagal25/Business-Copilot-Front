import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { FiSettings } from "react-icons/fi";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";

import { Navbar, Footer, Sidebar, LoadingMessage } from "./components";
import {
  Clients,
  CreateProducts,
  DashboardDailyRoute,
  Drivers,
  Home,
  MakeRoute,
  Order,
  Orders,
  Product,
  Products,
  Sellers,
} from "./pages";
import "./App.css";

import { useStateContext } from "./contexts/ContextProvider";

const App = () => {
  const { activeMenu, loadingMessage } = useStateContext();

  return (
    <div>
      <BrowserRouter>
        <div className="flex relative dark:bg-main-dark-bg">
          <div className="fixed right-4 bottom-4" style={{ zIndex: "1000" }}>
            <TooltipComponent content="Settings" position="Top">
              <button
                type="button"
                className="text-3xl p-3 hover:drop-shadow-xl hover:bg-light-gray text-white"
                style={{ background: "blue", borderRadius: "10%" }}
              >
                <FiSettings />
              </button>
            </TooltipComponent>
          </div>
          <div
            className={
              activeMenu
                ? "w-72 block fixed sidebar bg-white transition-all duration-250 ease-in-out"
                : "w-0"
            }
            style={{ zIndex: "1000" }}
          >
            <Sidebar />
          </div>
          <div
            className={`dark:bg-main-bg bg-main-bg min-h-screen w-full transition-all duration-250 ease-in-out ${
              activeMenu ? "lg:ml-72 lg:w-[calc(100%-18rem)]" : "flex-2"
            }`}
          >
            <div className="bg-main-bg dark:bg-main-dark-bg-nav w-full">
              <Navbar
                className={`${
                  activeMenu ? "lg:w-[calc(100%-18rem)]" : "w-full"
                }`}
              />
              {loadingMessage && <LoadingMessage activeMenu={activeMenu} />}
            </div>

            <div>
              <Routes>
                {/* Dashboard */}
                <Route index path="/" element={<Home />} />
                <Route path="/home" element={<Home />} />

                {/* Pages */}
                <Route path="/orders" element={<Orders />} />
                <Route path="/orders/:id" element={<Order />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/create" element={<CreateProducts />} />
                <Route path="/products/:id" element={<Product />} />
                <Route path="/sellers" element={<Sellers />} />
                <Route path="/clients" element={<Clients />} />
                <Route path="/drivers" element={<Drivers />} />

                {/* Apps */}
                <Route path="/makeroute" element={<MakeRoute />} />
                <Route
                  path="/dashboardDailyRoute/:routeDay"
                  element={<DashboardDailyRoute />}
                />
              </Routes>
            </div>
          </div>
        </div>
      </BrowserRouter>
    </div>
  );
};

export default App;
