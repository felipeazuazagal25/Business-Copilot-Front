import React, { useState, useEffect } from "react";
import { fetchOrders, removeOrders } from "../../utils/fetchOrders";
import { getDuplicates, areThereNotFoundProducts } from "../../utils/utils";
import CustomDatePicker from "../CustomDatePicker";
import { ThreeDot } from "react-loading-indicators";
import DataTable from "../DataTable";

const MakeRouteStep4 = ({ routeDay }) => {
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
        setData(
          vals.filter((item) => item && areThereNotFoundProducts(item.products))
        );
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
        Limpieza de Productos
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
        ) : data.length === 0 ? (
          <div>Todos los pedidos tienen productos en la base de datos</div>
        ) : (
          <>
            <div>
              Los siguientes pedidos tienen productos que no están en la base de
              datos.
            </div>
            <div className="">
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
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MakeRouteStep4;
