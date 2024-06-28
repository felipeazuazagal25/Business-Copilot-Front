import React, { useState, useEffect, useRef, Suspense } from "react";
import ScaleLoader from "react-spinners/ScaleLoader";
import "../index.css";
import Alert from "@mui/material/Alert";

import { convertToChileTime, fromDatetoYearMonthDay } from "../utils/utils";
import { fetchOrders, removeOrders } from "../utils/fetchOrders";

import DataTable from "../components/DataTable";
import { ThreeDot } from "react-loading-indicators";

import * as XLSX from "xlsx";

import {
  Header,
  DataFilters,
  CustomDatePicker,
  Test,
  Button,
} from "../components";
import { useNavigate, useLocation } from "react-router-dom";

const Orders = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);

  const baseUrl = `${window.location.protocol}//${window.location.host}`;

  const getCreatedDate = (queryParams) => {
    if (queryParams.get("createdAt") === null) {
      if (queryParams.get("deliveryDate") === null) {
        return convertToChileTime(new Date());
      } else {
        return null;
      }
    } else {
      return new Date(queryParams.get("createdAt"));
    }
  };

  const getDeliveryDate = (queryParams) => {
    return queryParams.get("deliveryDate")
      ? new Date(queryParams.get("DeliveryDate"))
      : null;
  };

  const [createdDate, setCreatedDate] = useState(getCreatedDate(queryParams));
  const [deliveryDate, setDeliveryDate] = useState(
    getDeliveryDate(queryParams)
  );
  // Variable to show loading animation
  const [data, setData] = useState([]);
  const [isDataLoading, setIsDataLoading] = useState(true); // change it to false when data fetched
  const [dataError, setDataError] = useState(null);
  const [refreshPage, setRefreshPage] = useState(false);

  useEffect(() => {
    console.log("Created date from use Effect", createdDate);
    console.log("Delivery date from use Effect", deliveryDate);

    if (createdDate) {
      queryParams.set("createdAt", fromDatetoYearMonthDay(createdDate));
    } else {
      queryParams.delete("createdAt");
    }

    if (deliveryDate) {
      queryParams.set("deliveryDate", fromDatetoYearMonthDay(deliveryDate));
    } else {
      queryParams.delete("deliveryDate");
    }

    navigate(`/orders?${queryParams.toString()}`, { replace: true });

    // Handling fetchingData

    setIsDataLoading(true);
    setDataError(null);
    const fetchData = async () => {
      try {
        const vals = await fetchOrders(createdDate, deliveryDate);
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
  }, [createdDate, deliveryDate, refreshPage]);

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

  const handleChangeCreatedDate = (newDate) => {
    if (newDate === null && deliveryDate === null) {
      alert("Tiene que tener una fecha.");
    } else {
      setCreatedDate(newDate);
    }
  };

  const handleChangeDeliveryDate = (newDate) => {
    setDeliveryDate(newDate);
  };

  const [showMessage, setShowMessage] = useState(false);

  const actionComplete = (args) => {
    if (args.requestType === "save") {
      console.log(args.data);
      console.log("EMPUJAR DATA DE AQUI PARA LA BASE DE DATOS");
      setShowMessage(true);
      console.log(showMessage);
    }
  };

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

  // Donwload Data in Excel
  const handleDownloadClick = async () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.write(workbook, { bookType: "xlsx", type: "binary" });
    XLSX.writeFile(workbook, "nombre.xlsx");
  };

  return (
    <>
      <div className="m-10 mt-5 p-10 pt-6 bg-white rounded-3xl">
        {/* Showing data saved correctly */}
        <div className="mb-5 flex justify-between">
          <Header category="Página" title="Pedidos" />
          <div className="flex items-center">
            <CustomDatePicker
              label="Fecha Agendado"
              initialValue={createdDate}
              callback={(value) => handleChangeCreatedDate(value)}
              // defaultValue={createdDate}
              readOnly={true}
            />
            <div className="ml-5 mr-5">
              <CustomDatePicker
                label="Fecha de Entrega"
                initialValue={deliveryDate}
                callback={(value) => handleChangeDeliveryDate(value)}
                // defaultValue={createdDate}
                readOnly={true}
              />
            </div>
            <Button
              className="mr-2"
              onClick={() => {
                window.location.href = baseUrl + "/orders/create";
              }}
            >
              Añadir
            </Button>
            <Button color="green" onClick={handleDownloadClick}>
              Descargar Excel
            </Button>
          </div>
        </div>
        <Test />

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
          <DataTable
            addButton={false}
            columns={columns}
            data={data}
            columnRowClick={"order_id"}
            callbackRefresh={() => {
              setRefreshPage(!refreshPage);
            }}
            callbackRemove={(removeElements) =>
              handleRemoveOrders(removeElements)
            }
          />
        )}
      </div>
    </>
  );
};

export default Orders;
