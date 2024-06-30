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
  console.log(process.env.REACT_APP_END_POINT + "/orders/" + id);
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

export const createOrder = async (rawOrder) => {
  // const order
  const order = {
    daily_id: rawOrder.daily_id,
    name: rawOrder.name,
    address: rawOrder.name,
    amount: rawOrder.amount,
    city: rawOrder.city,
    phone_number: rawOrder.phone_number,
    products: ["120 kg Safari - lavanda", "20 kg Minino - lavanda"],
    // products: [
    //   { product_name: "easy clean", variant: "lavanda", quantity: 6 },
    //   { product_name: "minino", variant: "lavanda", quantity: 1 },
    // ],
    seller: rawOrder.seller,
    payment: "Pagado", // Pendiente
    observation: "Dejar en conserjería", // Pendiente
    raw: "Orden insertada por Business Copilot",
  };
  console.log(order);
  const val = axios.post(
    process.env.REACT_APP_END_POINT + "/orders/create",
    order
  );
  return val;
};

export const getGroupedOrders = (orders, driversTemplate) => {
  console.log("Entrando a getGrpuedOders");
  const ordersByCity = orders.reduce((acc, order) => {
    acc[order.city] = (acc[order.city] || 0) + 1;
    return acc;
  }, {});

  // Create initial data structure
  const initialData = {
    groups: {},
    groupOrder: [],
  };

  driversTemplate.forEach(({ driver, city }) => {
    if (!initialData.groups[driver]) {
      initialData.groups[driver] = {
        id: driver,
        title: driver,
        cards: [],
      };
      initialData.groupOrder.push(driver);
    }
    console.log("ordersbyCity", ordersByCity);
    if (ordersByCity[city] > 0) {
      initialData.groups[driver].cards.push({
        id: city,
        content: city,
        number: ordersByCity[city],
      });
    }
  });

  console.log(initialData);
  return initialData;
};

const initialData = {
  groups: {
    Victor: {
      id: "group-1",
      title: "Group 1",
      cards: [
        { id: "card-1", content: "Card 1", number: 10 },
        { id: "card-2", content: "Card 2", number: 20 },
        { id: "card-3", content: "Card 3", number: 30 },
      ],
    },
    "group-2": {
      id: "group-2",
      title: "Group 2",
      cards: [
        { id: "card-4", content: "Card 4", number: 40 },
        { id: "card-5", content: "Card 5", number: 50 },
      ],
    },
    "group-3": {
      id: "group-3",
      title: "Group 3",
      cards: [],
    },
    "group-4": {
      id: "group-4",
      title: "Group 4",
      cards: [],
    },
    "group-5": {
      id: "group-5",
      title: "Group 5",
      cards: [],
    },
  },
  groupOrder: ["group-1", "group-2", "group-3", "group-4", "group-5"],
};

export const assignDriverToOrders = (groupedData, orders, drivers) => {
  const groups = groupedData.groups;
  const result = [];
  const driversCity = Object.keys(groups).map((driver) => ({
    driver_name: driver,
    cities: groups[driver].cards.map((card) => card.id),
  }));
  driversCity.forEach((item) => {
    const driver_id = drivers.filter(
      (driver) => driver.name === item.driver_name
    )[0].personnel_id;
    item.cities.forEach((city) => {
      const cityOrders = orders.filter((order) => order.city === city);
      cityOrders.forEach((order) => {
        result.push({
          delivery_id:
            order.delivery_info_array[order.delivery_info_array.length - 1]
              .delivery_id,
          driver_id: driver_id,
        });
      });
    });
  });

  console.log("result", result); // Remove when conneted to database

  const val = axios.post(
    process.env.REACT_APP_END_POINT + "/orders/edit/driver",
    { delivery_info: result }
  );

  return val;
};
