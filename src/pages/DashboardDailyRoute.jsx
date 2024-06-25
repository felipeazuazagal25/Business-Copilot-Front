import React, { useState, useEffect } from "react";

import { Header } from "../components";
import { fetchOrders } from "../utils/fetchOrders";

import { useParams, useNavigate } from "react-router-dom";

const DashboardDailyRoute = () => {
  const navigate = useNavigate();
  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const params = useParams();
  const routeDay = params.routeDay;

  const [data, setData] = useState([]);
  const [isDataLoading, setIsDataLoading] = useState(true); // change it to false when data fetched
  const [dataError, setDataError] = useState(null);
  const [refreshPage, setRefreshPage] = useState(false);

  useEffect(async () => {
    setIsDataLoading(true);
    setDataError(null);
    const fetchData = async () => {
      try {
        const vals = await fetchOrders(null, routeDay);
        setData(vals);
        setIsDataLoading(false);
      } catch (error) {
        console.log(error);
        setData(null);
        setDataError(error);
        setIsDataLoading(false);
      }
    };
    fetchData();
  }, [refreshPage]);

  return (
    <>
      <div className="m-10 mt-5 p-10 pt-6 bg-white rounded-3xl">
        {/* Showing data saved correctly */}
        <div className="mb-5 flex justify-between">
          <Header category="Aplicación" title="Rutas y Cargas" />
        </div>
        <div className="">as</div>
      </div>
    </>
  );
};

export default DashboardDailyRoute;
