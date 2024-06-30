import React, { useState, useEffect } from "react";

import { Header, DataTable, Button } from "../components";
import { ThreeDot } from "react-loading-indicators";
import { fetchOrders, removeOrders } from "../utils/fetchOrders";
import { fetchDrivers } from "../utils/fetchDrivers";
import { fromDatetoYearMonthDay } from "../utils/utils";

import { useParams, useNavigate } from "react-router-dom";

import { generateRoutePDF, generateLoadDriverPDF } from "../utils/generatePDFs";

const DashboardDailyRoute = () => {
  const navigate = useNavigate();
  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const params = useParams();
  const routeDay = new Date(params.routeDay);

  const [data, setData] = useState([]);
  const [drivers, setDrivers] = useState(null);
  const [isDataLoading, setIsDataLoading] = useState(true); // change it to false when data fetched
  const [dataError, setDataError] = useState(null);
  const [refreshPage, setRefreshPage] = useState(false);

  useEffect(async () => {
    setIsDataLoading(true);
    setDataError(null);
    // generateLoadDriverPDF(orders, driver, date);
    const fetchData = async () => {
      try {
        const vals = await fetchOrders(null, routeDay);
        setData(vals);
        const drivers = await fetchDrivers();
        setDrivers(drivers);
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

  const driver = "Victor";
  const date = "2024-06-29";
  const orders = [
    {
      order_id: 473,
      daily_id: "200",
      name: "Matías González",
      address: "Pasaje Lago Cochranne 110",
      block_depto: "",
      city: "Santiago",
      phone_number: "145828442",
      amount: 54980,
      products: [
        {
          quantity: 2,
          variation: "Lavanda",
          product_name: "Saco 20kg Easy Clean",
        },
        {
          quantity: 1,
          variation: "Manzana",
          product_name: "Manga 24kg Easy Clean",
        },
      ],
      payment_info_array: [{ payment_status: "", payment_method: "Pagado" }],
      delivery_info_array_array: [{ delivery_note: "Llamar por whatsapp x2" }],
      seller_name: "Michi",
    },
    {
      order_id: 474,
      daily_id: "201",
      name: "Carlos Pérez",
      address: "Avenida Siempre Viva 742",
      block_depto: "Block A, Depto 101",
      city: "Santiago",
      phone_number: "123456789",
      amount: 29990,
      products: [
        {
          quantity: 1,
          variation: "Lavanda",
          product_name: "Saco 10kg Easy Clean",
        },
        {
          quantity: 3,
          variation: "Citrus",
          product_name: "Manga 5kg Easy Clean",
        },
      ],
      payment_info_array: [{ payment_status: "", payment_method: "Efectivo" }],
      delivery_info_array_array: [
        { delivery_note: "Entregar antes de las 5 PM" },
      ],
      seller_name: "Luis",
    },
    {
      order_id: 475,
      daily_id: "202",
      name: "Ana Rodríguez",
      address: "Calle Falsa 123",
      block_depto: "Block B, Depto 202",
      city: "Providencia",
      phone_number: "987654321",
      amount: 45990,
      products: [
        {
          quantity: 2,
          variation: "Lavanda",
          product_name: "Saco 15kg Easy Clean",
        },
      ],
      payment_info_array: [
        { payment_status: "", payment_method: "Transferencia" },
      ],
      delivery_info_array_array: [
        { delivery_note: "No llamar, solo dejar en la puerta" },
      ],
      seller_name: "Junior",
    },
    {
      order_id: 476,
      daily_id: "203",
      name: "Luis Martínez",
      address: "Pasaje Sin Nombre 456",
      block_depto: "Block C, Depto 303",
      city: "Las Condes",
      phone_number: "112233445",
      amount: 39990,
      products: [
        {
          quantity: 2,
          variation: "Limon",
          product_name: "Saco 12kg Easy Clean",
        },
      ],
      payment_info_array: [{ payment_status: "", payment_method: "Tarjeta" }],
      delivery_info_array_array: [{ delivery_note: "Llamar al llegar" }],
      seller_name: "Belen",
    },
    {
      order_id: 477,
      daily_id: "204",
      name: "María López",
      address: "Avenida Los Pinos 789",
      block_depto: "",
      city: "Ñuñoa",
      phone_number: "998877665",
      amount: 26990,
      products: [
        {
          quantity: 2,
          variation: "Lavanda",
          product_name: "Saco 12kg Easy Clean",
        },
      ],
      payment_info_array: [{ payment_status: "", payment_method: "Cheque" }],
      delivery_info_array_array: [{ delivery_note: "Dejar con el conserje" }],
      seller_name: "Jose",
    },
    {
      order_id: 478,
      daily_id: "205",
      name: "Jorge Herrera",
      address: "Calle Los Robles 1011",
      block_depto: "Block D, Depto 404",
      city: "Vitacura",
      phone_number: "223344556",
      amount: 50990,
      products: [
        {
          quantity: 5,
          variation: "Lavanda",
          product_name: "Manga 8kg Easy Clean",
        },
      ],
      payment_info_array: [{ payment_status: "", payment_method: "Pagado" }],
      delivery_info_array_array: [
        { delivery_note: "Confirmar entrega con llamada" },
      ],
      seller_name: "Carlos",
    },
    {
      order_id: 479,
      daily_id: "206",
      name: "Elena Gómez",
      address: "Pasaje Las Flores 1213",
      block_depto: "",
      city: "La Florida",
      phone_number: "332211445",
      amount: 38990,
      products: [
        {
          quantity: 2,
          variation: "Limon",
          product_name: "Saco 12kg Easy Clean",
        },
      ],
      payment_info_array: [{ payment_status: "", payment_method: "Pagado" }],
      delivery_info_array_array: [
        { delivery_note: "Entregar a cualquier persona" },
      ],
      seller_name: "Victor",
    },
    {
      order_id: 480,
      daily_id: "11931",
      name: "Miguel Castro",
      address: "Calle Los Álamos 1415",
      block_depto: "Block E, Depto 505",
      city: "Macul",
      phone_number: "556677889",
      amount: 59990,
      products: [
        {
          quantity: 2,
          variation: "Limon",
          product_name: "Saco 12kg Easy Clean",
        },
      ],
      payment_info_array: [{ payment_status: "", payment_method: "Efectivo" }],
      delivery_info_array_array: [{ delivery_note: "Dejar en recepción" }],
      seller_name: "Junior",
    },
    {
      order_id: 481,
      daily_id: "208",
      name: "Paula Díaz",
      address: "Avenida Las Torres 1617",
      block_depto: "Block F, Depto 606",
      city: "San Miguel",
      phone_number: "778899001",
      amount: 45990,
      products: [
        {
          quantity: 2,
          variation: "Lavanda",
          product_name: "Saco 12kg Easy Clean",
        },
      ],
      payment_info_array: [{ payment_status: "", payment_method: "Tarjeta" }],
      delivery_info_array_array: [
        { delivery_note: "Llamar antes de entregar" },
      ],
      seller_name: "Belen",
    },
  ];

  return (
    <>
      <div className="m-10 mt-5 p-10 pt-6 bg-white rounded-3xl">
        {/* Showing data saved correctly */}
        <div className="mb-5 flex justify-between">
          <Header category="Aplicación" title="Rutas y Cargas" />
        </div>
        <div className="">
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
            <div>Error al cargar pedidos.</div>
          ) : (
            <>
              <div></div>
              <div>
                {drivers.map((driver) => {
                  if (driver.name !== "No asignado") {
                    return (
                      <div className="flex px-5 py-2 items-center">
                        <div className="min-w-24">{driver.name}</div>{" "}
                        <div className="min-w-40 px-3 text-center">
                          {data.filter(
                            (item) =>
                              item.delivery_info_array[
                                item.delivery_info_array.length - 1
                              ].driver_id === driver.personnel_id
                          ).length > 0 ? (
                            <Button
                              onClick={() => {
                                generateRoutePDF(
                                  data.filter(
                                    (item) =>
                                      item.delivery_info_array[
                                        item.delivery_info_array.length - 1
                                      ].driver_id === driver.personnel_id
                                  ),
                                  driver.name,
                                  fromDatetoYearMonthDay(routeDay)
                                );
                              }}
                            >
                              Descargar Ruta
                            </Button>
                          ) : (
                            <div>-</div>
                          )}
                        </div>
                        <div className="min-w-40 px-3">
                          {data.filter(
                            (item) =>
                              item.delivery_info_array[
                                item.delivery_info_array.length - 1
                              ].driver_id === driver.personnel_id
                          ).length > 0 ? (
                            <Button
                              onClick={() => {
                                generateLoadDriverPDF(
                                  data.filter(
                                    (item) =>
                                      item.delivery_info_array[
                                        item.delivery_info_array.length - 1
                                      ].driver_id === driver.personnel_id
                                  ),
                                  driver.name,
                                  fromDatetoYearMonthDay(routeDay)
                                );
                              }}
                            >
                              Descargar Carga
                            </Button>
                          ) : (
                            <div>-</div>
                          )}
                        </div>
                      </div>
                    );
                  }
                })}
              </div>

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
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default DashboardDailyRoute;
