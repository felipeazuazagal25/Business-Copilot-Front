import React, { useState, useEffect } from "react";
import { fetchOrders, removeOrders } from "../../utils/fetchOrders";
import { getDuplicates } from "../../utils/utils";
import CustomDatePicker from "../CustomDatePicker";
import { ThreeDot } from "react-loading-indicators";
import DataTable from "../DataTable";

const MakeRouteStep2 = ({ routeDay }) => {
  const [data, setData] = useState([]);
  const [countBySeller, setCountBySeller] = useState({});
  const [isDataLoading, setIsDataLoading] = useState(true); // change it to false when data fetched
  const [dataError, setDataError] = useState(null);
  const [refreshPage, setRefreshPage] = useState(false);

  useEffect(async () => {
    setIsDataLoading(true);
    setDataError(null);
    const fetchData = async () => {
      try {
        const vals = await fetchOrders(null, routeDay);
        const valsDuplicate = getDuplicates(vals);
        setData(valsDuplicate);
        setIsDataLoading(false);
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

  return (
    <div className="flex-column justify-center p-3">
      <div className="w-full text-xl font-bold text-gray-600">
        Eliminar Duplicados
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
    </div>
  );
};

export default MakeRouteStep2;
