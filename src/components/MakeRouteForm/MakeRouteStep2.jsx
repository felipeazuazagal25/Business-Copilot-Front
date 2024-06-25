import React, { useState, useEffect } from "react";
import { fetchOrders, removeOrders } from "../../utils/fetchOrders";
import { findMissingNumberSequence } from "../../utils/utils";
import { ThreeDot } from "react-loading-indicators";

import CustomTextField from "../CustomTextField";

import Button from "../Button";
import { setRef } from "@mui/material";

const MakeRouteStep2 = ({ routeDay }) => {
  const [data, setData] = useState([]);
  const [isDataLoading, setIsDataLoading] = useState(true); // change it to false when data fetched
  const [dataError, setDataError] = useState(null);
  const [refreshPage, setRefreshPage] = useState(false);

  const [namesDuplicates, setNamesDuplicates] = useState([]);

  useEffect(async () => {
    setIsDataLoading(true);
    setDataError(null);
    const fetchData = async () => {
      try {
        const vals = await fetchOrders(null, routeDay);
        setData(vals);
        setIsDataLoading(false);

        if (lowerBound === null || upperBound === null) {
        } else {
          if (lowerBound >= upperBound) {
          } else {
            const filteredOrders = vals.filter(
              (item) =>
                item.daily_id >= lowerBound && item.daily_id <= upperBound
            );
            const missingValues = findMissingNumberSequence(
              filteredOrders.map((item) => Number(item.daily_id))
            );
            console.log("missing values", missingValues);
            setMissingValues(missingValues);
            setCheckShowMissingValues(true);
          }
        }
      } catch (error) {
        console.log(error);
        setData(null);
        setDataError(error);
        setIsDataLoading(false);
      }
    };
    fetchData();
  }, [routeDay, refreshPage]);

  const columns = [
    { header: "ID", accessorKey: "daily_id", footer: "ID" },
    { header: "Nombre", accessorKey: "name", footer: "Name" },
    { header: "Dirección", accessorKey: "address", footer: "Adress" },
    { header: "Comuna", accessorKey: "city", footer: "City" },
    {
      header: "Productos",
      accessorKey: "products",
      footer: "Products",
      cell: ({ row }) =>
        row.original.products !== undefined &&
        row.original.products
          .filter((item) => item.product_name !== "NotFound")
          .map((item) => (
            <>
              {item.product_name} <br />
            </>
          )),
    },
  ];

  const handleRemoveOrders = async (orders) => {
    const removeOrdersID = orders.map((item) => item.order_id);
    try {
      removeOrders(removeOrdersID).then((value) => {
        setRefreshPage(!refreshPage);
      });
    } catch (error) {
      throw Error(error.message);
    }
  };

  const [lowerBound, setLowerBound] = useState(null);
  const [upperBound, setUpperBound] = useState(null);
  const handleChangeLowerBound = (value) => {
    setLowerBound(value);
  };
  const handleChangeUpperBound = (value) => {
    setUpperBound(value);
  };

  const [checkShowMissingValues, setCheckShowMissingValues] = useState(false);
  const [missingValues, setMissingValues] = useState([]);
  const checkSequenceDailyID = () => {
    setRefreshPage(!refreshPage);
    if (lowerBound === null || upperBound === null) {
      alert("Debe ingresar valores.");
    } else {
      if (lowerBound >= upperBound) {
        alert("Valores no válidos.");
      } else {
        const filteredOrders = data.filter(
          (item) => item.daily_id >= lowerBound && item.daily_id <= upperBound
        );
        const missingValues = findMissingNumberSequence(
          filteredOrders.map((item) => Number(item.daily_id))
        );
        console.log("missing values", missingValues);
        setMissingValues(missingValues);
        setCheckShowMissingValues(true);
      }
    }
  };

  return (
    <div className="flex-column justify-center p-3">
      <div className="w-full text-xl font-bold text-gray-600">
        Pedidos faltantes
      </div>
      <div>
        {isDataLoading ? (
          <div className="w-full text-center min-h-72 flex items-center justify-center">
            <ThreeDot
              variant="brick-stack"
              color="#4048F1"
              size="medium"
              text=""
              textColor=""
            />
          </div>
        ) : dataError ? (
          <div>No hay pedidos agendados en esta fecha.</div>
        ) : (
          <>
            <div>Inserte rango para verificar</div>
            <div className="flex w-full justify-between items-center">
              <div className="flex ">
                <div className="mx-2">
                  <CustomTextField
                    inputType="numeric"
                    multiline={false}
                    initialValue={lowerBound}
                    callback={(value) => {
                      console.log(value);
                      handleChangeLowerBound(value);
                      setCheckShowMissingValues(false);
                      setMissingValues([]);
                    }}
                  />
                </div>
                <div className="mx-2">
                  <CustomTextField
                    inputType="numeric"
                    multiline={false}
                    initialValue={upperBound}
                    callback={(value) => {
                      console.log(value);
                      handleChangeUpperBound(value);
                      setCheckShowMissingValues(false);
                      setMissingValues([]);
                    }}
                  />
                </div>
              </div>
              <Button onClick={checkSequenceDailyID}>
                {checkShowMissingValues ? "Revisar Nuevamente" : "Revisar"}
              </Button>
            </div>
            <div className="p-5">
              {checkShowMissingValues ? (
                missingValues.length > 0 ? (
                  missingValues.map((item) => (
                    <>
                      <div className="text-lg font-bold">
                        Faltan los siguientes pedidos
                      </div>
                      <div className="py-2 px-3 bg-gray-100 my-1 rounded-lg">
                        Pedido {item}
                      </div>
                    </>
                  ))
                ) : (
                  <div>
                    Todos los pedidos dentro de la secuencia se encuentran
                    agendados.
                  </div>
                )
              ) : (
                <></>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MakeRouteStep2;
