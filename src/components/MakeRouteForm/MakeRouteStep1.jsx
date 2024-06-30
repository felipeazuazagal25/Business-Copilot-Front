import React, { useState, useEffect } from "react";
import { fetchOrders } from "../../utils/fetchOrders";
import CustomDatePicker from "../CustomDatePicker";
import { Button, DataTable } from "../../components";
import { ThreeDot } from "react-loading-indicators";

const MakeRouteStep1 = ({ daySelectedCallback }) => {
  const [routeDay, setRouteDay] = useState(null);

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
        setData(vals);
        setIsDataLoading(false);
        const counts = {};
        vals.forEach((item) => {
          counts[item.seller_name] = (counts[item.seller_name] || 0) + 1;
        });
        setCountBySeller(counts);
        console.log(vals);
      } catch (error) {
        console.log(error);
        setData(null);
        setDataError(error);
        setIsDataLoading(false);
      }
    };
    fetchData();
  }, [routeDay, refreshPage]);

  return (
    <div className="flex-column justify-center p-3">
      <div className="w-full text-xl font-bold text-gray-600">
        Selecciona un Día
      </div>
      <div className="flex w-full justify-center">
        <div className="w-full justify-center">
          <div className="flex justify-between w-full">
            <CustomDatePicker
              initialValue={null}
              callback={(value) => {
                {
                  daySelectedCallback(value);
                  setRouteDay(value);
                }
              }}
            />
          </div>
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
            <div className="p-5"></div>
          ) : (
            <>
              <div className="flex w-full justify-center oultine">
                <div className="p-5 max-w-sm  w-full">
                  <div className="bg-gray-200 flex w-full justify-between p-3 rounded-md">
                    <div className=" font-bold text-xl">
                      Cantidad de Pedidos:{" "}
                    </div>
                    <div className="font-bold text-xl">{data.length}</div>
                  </div>
                  {Object.entries(countBySeller).map(([key, value]) => (
                    <div className="flex mx-3 px-3 my-1 p-1 justify-between text-lg bg-gray-100 rounded-md">
                      <div className="">{key}</div>
                      <div>{value}</div>
                    </div>
                  ))}
                </div>
              </div>
              <DataTable
                addButton={false}
                columns={columns}
                data={data}
                columnRowClick={"order_id"}
                callbackRefresh={() => {
                  setRefreshPage(!refreshPage);
                }}
                callbackRemove={(removeElements) => console.log(removeElements)}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MakeRouteStep1;
