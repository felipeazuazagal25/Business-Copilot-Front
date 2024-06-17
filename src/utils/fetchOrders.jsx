import { Result } from "postcss";

import { fromDatetoYearMonthDay } from "../utils/utils";

import axios from "axios";

export const fetchOrders = async (createdDate = null, deliveryDate = null) => {
  const formattedCreatedDate = createdDate
    ? "createdAt=" + fromDatetoYearMonthDay(createdDate)
    : "";

  const formattedDeliveryDate = deliveryDate
    ? "deliveryDate=" + fromDatetoYearMonthDay(deliveryDate)
    : "";

  const endpointUrl =
    process.env.REACT_APP_END_POINT +
    "/orders/" +
    formattedCreatedDate +
    (formattedCreatedDate && formattedDeliveryDate && "&") +
    formattedDeliveryDate;

  const response = await fetch(endpointUrl, {
    method: "GET",
  });

  console.log(endpointUrl);

  if (!response.ok) {
    throw new Error("Error al conectar con el servidor");
    return response;
  }
  const result = await response.json();
  console.log(result);
  if (result.status === "404") {
    throw new Error("No hay pedidos para esta fecha");
  }

  return result;
};

export const fetchOrderByID = async (id) => {
  const response = await fetch(
    process.env.REACT_APP_END_POINT + "/orders/" + id,
    {
      method: "GET",
      headers: {
        "ngrok-skip-browser-warning": "aa",
      },
    }
  );
  if (!response.ok) {
    throw new Error("Error al conectar con el servidor");
    return response;
  }
  const result = await response.json();
  console.log(result);
  if (result.status === "404") {
    throw new Error("No hay pedidos con este ID");
  }

  return result;
};

export const removeOrders = async (ordersID) => {
  const val = await axios.post(
    process.env.REACT_APP_END_POINT + "/orders/delete",
    { order_id: ordersID }
  );
  console.log(val);

  return val;
};
