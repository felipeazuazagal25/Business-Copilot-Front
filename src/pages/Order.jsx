import React, { useState, useEffect } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

import { isDateInPast, getNextDayISOString } from "../utils/utils";

import { ThreeDot } from "react-loading-indicators";

import { useParams } from "react-router-dom";
import { customData, customProducts, customDrivers } from "../data/customData";
import {
  Header,
  Button,
  InputBox,
  PopUp,
  CheckBox,
  InputWithSearch,
  CustomDatePicker,
  CustomMultiOption,
  CustomTextField,
  DragAndDrop,
  DataFilters,
} from "../components";

import { MdDelete, MdModeEdit } from "react-icons/md";
import {
  FaCheck,
  FaPhotoVideo,
  FaPlus,
  FaMinus,
  FaExclamation,
} from "react-icons/fa";
import { IoClose } from "react-icons/io5";

import axios from "axios";
import { fetchOrderByID, createOrder } from "../utils/fetchOrders";

const { format } = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
});

const Order = () => {
  const navigate = useNavigate();
  const baseUrl = `${window.location.protocol}//${window.location.host}`;

  const handleGoBack = (event) => {
    event.preventDefault();
    navigate(-1);
  };

  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  const { id } = useParams();
  const infoOrder = customData.filter((item) => item.order_id === id)[0];

  // Fetching order data and setting up important variables
  let [order, setOrder] = useState(infoOrder);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [dataError, setDataError] = useState(null);

  const [paymentInformationPopUp, setPaymentInformationPopUp] = useState([]);
  const [deliveryInformationPopUp, setDeliveryInformationPopUp] = useState([]);
  const [producInfoOrders, setProducInfoOrders] = useState([]);

  const [newProduct, setNewProduct] = useState(false);

  useEffect(() => {
    if (id === "create") {
      setIsDataLoading(false);
      setOrder({
        order_id: undefined, // ???
        daily_id: "",
        name: "",
        created_at: new Date().toISOString(), // Fecha actual
        client_id: undefined, /// ???
        address: "",
        amount: "",
        city: "",
        order_source: "",
        seller_name: "",
        phone_number: "",
        raw: "Orden Creada desde Business Copilot",
        products: [],
        payment_info_array: [
          {
            amount: 0,
            payment_id: undefined, // ???
            payment_date: null,
            payment_method: undefined, // ???
            payment_status: false,
          },
        ],
        delivery_info_array: [
          {
            delivery_date: getNextDayISOString(),
            delivery_note: null,
            delivery_status: "Pendiente de entrega",
          },
        ],
      });
    } else {
      setIsDataLoading(true);
      const fetchData = async () => {
        try {
          const vals = await fetchOrderByID(id);
          setOrder(vals[0]);
          setPaymentInformationPopUp(
            vals[0].payment_info_array.map((item) => false)
          );
          setDeliveryInformationPopUp(
            vals[0].delivery_info_array.map((item) => false)
          );
          setProducInfoOrders(vals[0].products);
          setIsDataLoading(false);
          console.log("Estos son los valotres de val");
          console.log(vals[0]);
          console.log(infoOrder);
        } catch (error) {
          console.log(error);
          setOrder(null);
          setDataError(error);
          setIsDataLoading(false);
        }
      };
      fetchData();
    }
  }, []);

  // Sending all information to END POINT
  const sendPostBackend = async () => {
    try {
      const val = await axios.post(
        process.env.REACT_APP_END_POINT + "/orders/update",
        infoOrder
      );
      console.log(val);
    } catch (error) {
      console.log("Error");
    }
  };

  const createOrderBC = async () => {
    try {
      console.log('Order from "Order" page: ', order);
      const val = await createOrder(order);
      console.log(val);
      window.location.href = baseUrl + "/orders";
    } catch (error) {
      console.log("Error");
    }
  };

  // Show/Hide Message Raw
  const [showMessageRaw, setShowMessageRaw] = useState(false);

  const handleShowMessageRaw = () => {
    setShowMessageRaw(!showMessageRaw);
  };

  // Modifying the Products

  // Base Products handling
  const baseProducts = customProducts.map((item) => {
    return { ...item, filtering: item.product_name + " - " + item.variation };
  });

  // New Product - Handling
  const handleNewProducts = (value) => {
    let currentOrder = { ...order };
    if (baseProducts.map((item) => item.filtering).includes(value)) {
      const newProduct = baseProducts.filter(
        (item) => item.filtering === value
      )[0];
      currentOrder.products.push({
        prodID: newProduct.id,
        product_name: newProduct.product_name,
        variation: newProduct.variation,
        quantity: 1,
        status: null,
      });
    } else {
      currentOrder.products.push({
        prodID: "aosidhfa", // Random Generator
        product_name: value.split(" - ")[0],
        variation: value.split(" - ")[1],
        quantity: 1,
        status: "not found",
      });
    }
    setOrder(currentOrder);
  };

  const handleRemoveProduct = (ind) => {
    const currentOrder = { ...order };
    currentOrder.products.splice(ind, 1);
    setOrder(currentOrder);
  };

  // Increase/Decrease Quantity
  const increaseQuantity = (key) => {
    const currentOrder = { ...order };
    currentOrder.products[key].quantity += 1;
    setOrder(currentOrder);
  };

  const decreaseQuantity = (key) => {
    const currentOrder = { ...order };
    if (currentOrder.products[key].quantity > 1) {
      currentOrder.products[key].quantity -= 1;
    }
    setOrder(currentOrder);
  };

  const handlePaymentStatus = (key) => {
    let currentOrder = { ...order };
    currentOrder.payment_info_array[key].paymentStatus =
      !currentOrder.payment_info_array[key].paymentStatus;
    if (currentOrder.payment_info_array[key].paymentStatus) {
      currentOrder.payment_info_array[key].payment_date = new Date();
    } else {
      currentOrder.payment_info_array[key].payment_date = null;
    }

    setOrder(currentOrder);
  };

  // Payment Information PopUp

  const handlePaymentInformationPopUp = (key) => {
    const list = [...paymentInformationPopUp];
    list[key] = !list[key];
    setPaymentInformationPopUp(list);
    console.log(paymentInformationPopUp);
  };

  const escPaymentInformation = (event) => {
    if (event.key === "Escape") {
      setPaymentInformationPopUp(order.payment_info_array.map((item) => false));
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", escPaymentInformation);
    return () => window.removeEventListener("keydown", escPaymentInformation);
  });

  // Handle Change Payment Information
  const handleChangePaymentMethod = (value, key) => {
    let currentOrder = { ...order };
    currentOrder.payment_info_array[key].payment_method = value;
    setOrder(currentOrder);
  };

  const handleChangePaymentDate = (value, key) => {
    let currentOrder = { ...order };
    currentOrder.payment_info_array[key].payment_date = value;
    setOrder(currentOrder);
  };

  const handleCreationPayment = () => {
    let currentOrder = { ...order };
    currentOrder.payment_info_array.push({
      paymentStatus: false,
      paymentMethod: undefined,
      paymentDate: undefined,
      amount: 0,
    });
    setOrder(currentOrder);
    const list = order.payment_info_array.map((item) => false);
    list[list.length - 1] = !list[list.length - 1];
    setPaymentInformationPopUp(list);
  };

  const updatePaymentAmount = (value, key) => {
    let currentOrder = { ...order };
    currentOrder.payment_info_array[key].amount = value;
    setOrder(currentOrder);
  };

  const handleRemovePayment = (value) => {
    if (order.payment_info_array.length > 1) {
      let currentOrder = { ...order };
      currentOrder.payment_info_array.splice(value, 1);
      setOrder(currentOrder);
      const list = [...paymentInformationPopUp];
      list.splice(value, 1);
      setPaymentInformationPopUp(list);
    } else {
      alert("El pedido debe tener al menos un pago.");
    }
  };

  // Delivery Status
  const handleDeliveryStatus = (key) => {
    let currentOrder = { ...order };
    currentOrder.delivery_info_array[key].deliveryStatus =
      !currentOrder.delivery_info_array[key].deliveryStatus;
    setOrder(currentOrder);
  };

  // Delivery Status PopUp
  const handleDeliveryInformationPopUp = (key) => {
    const list = [...deliveryInformationPopUp];
    list[key] = !list[key];
    setDeliveryInformationPopUp(list);
  };

  const escDeliveryInformation = (event) => {
    if (event.key === "Escape") {
      setDeliveryInformationPopUp(
        order.delivery_info_array.map((item) => false)
      );
    }
  };

  // Handle Delivery Information
  const handleChangeDeliveryDriver = (value, key) => {
    let currentOrder = { ...order };
    currentOrder.delivery_info_array[key].driver = value;
    setOrder(currentOrder);
  };

  const handleChangeDeliveryDate = (value, key) => {
    let currentOrder = { ...order };
    currentOrder.delivery_info_array[key].delivery_date = value;
    setOrder(currentOrder);
  };

  const handleChangeDeliveryNote = (value, key) => {
    let currentOrder = { ...order };
    currentOrder.delivery_info_array[key].deliveryNote = value;
    setOrder(currentOrder);
  };

  const handleCreationDelivery = () => {
    let currentOrder = { ...order };
    currentOrder.delivery_info_array.push({
      deliveryStatus: false,
      driver: "No Asignado",
      deliveryDate: undefined,
      deliveryNote: "",
    });
    setOrder(currentOrder);
    const list = order.delivery_info_array.map((item) => false);
    list[list.length - 1] = !list[list.length - 1];
    setDeliveryInformationPopUp(list);
  };

  const handleRemoveDelivery = (value) => {
    if (order.delivery_info_array.length > 1) {
      let currentOrder = { ...order };
      currentOrder.delivery_info_array.splice(value, 1);
      setOrder(currentOrder);
      const list = [...deliveryInformationPopUp];
      list.splice(value, 1);
      setDeliveryInformationPopUp(list);
    } else {
      alert("El pedido tiene que tener al menos una entrega.");
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", escDeliveryInformation);
    return () => window.removeEventListener("keydown", escDeliveryInformation);
  });

  const handleAddProductEnter = (event, product) => {
    if (event.key === "Enter") {
      const list = [...producInfoOrders];
      list.push(product);
      setProducInfoOrders(list);
      setNewProduct(false);
    }
  };

  return (
    <>
      <div className="mx-10 my-5 mt-5 p-10 pt-6 bg-white rounded-3xl">
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
          <div>Error al cargar los datos</div>
        ) : (
          <div>
            <div className="flex mb-5 items-center justify-between">
              <div className="flex items-center">
                <Link
                  onClick={handleGoBack}
                  className="flex items-center mr-5 rounded-lg h-10"
                >
                  <IoIosArrowRoundBack className="text-[#4048F1] outline outline-[#4048F1] bg-indigo-50 text-3xl h-10 w-10 p-2 mt-5 mb-5 hover:bg-[#4048F1] hover:text-white rounded-lg transition-all duration-100 ease-in-out" />
                </Link>
                <Header category="Página" title={`Pedido ${order.daily_id}`} />
              </div>
              <div className="">
                <div className="text-end px-2 min-w-72">
                  Fuente: {order.orderSource}
                </div>
                {order.order_source === "Whatsapp" && (
                  <>
                    <div className="text-end flex justify-end">
                      <div
                        className="bg-gray-400 select-none text-white px-2 py-1 rounded-md hover:bg-gray-600 transition-all duration-100 ease-in-out"
                        style={{ cursor: "pointer" }}
                        onClick={handleShowMessageRaw}
                      >
                        Ver Mensaje Original
                      </div>
                    </div>

                    <div className="flex justify-end">
                      {showMessageRaw && (
                        <div
                          className="fixed mt-2 px-10 py-5 mb-5 bg-gray-100 flex justify-between rounded-lg drop-shadow-md max-w-72 overflow-hidden transition-all duration-500 ease-in-out"
                          style={{ zIndex: 1000 }}
                        >
                          <div>
                            {order.raw.split("\n").map((item) => (
                              <div className="text-sm">
                                <span>{item}</span> <br />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
            <div
              className="overflow-y-auto"
              style={{ height: "calc(100vh - 280px)" }}
            >
              {/* Whole container*/}
              <div className="flex items-start">
                <div className=" w-[calc(50%)] flex justify-left flex-wrap pr-5 pl-5 ">
                  {/* First Section*/}
                  <div className=" w-[calc(100%)] flex justify-left mt-5">
                    <InputBox
                      label="Nombre Cliente"
                      text={order.name}
                      callback={(value) => {
                        console.log(value);
                        const newOrder = { ...order };
                        order.name = value;
                        setOrder(newOrder);
                        console.log("new Order", newOrder);
                      }}
                    />
                  </div>
                  <div className="w-[calc(100%)] lg:flex flex-column justify-left mt-5">
                    <InputBox label="Direccion" text={order.address} />
                    <div className="m-4"> </div>
                    <InputBox label="Comuna" text={order.city} />
                  </div>
                  <div className="w-[calc(100%)] lg:flex flex-column justify-left mt-5">
                    <InputBox label="Vendedor" text={order.seller_name} />
                    <div className="m-4"> </div>
                    <InputBox label="Teléfono" text={order.phone_number} />
                  </div>

                  <hr className="ml-5 mr-5 mt-10 mb-10 h-1 w-full my-8 bg-gray-400 border-0 rounded" />

                  {/* Product Section */}
                  <div className="w-full ">
                    <div className="flex justify-between w-full items-center">
                      <div className="text-xl text-gray-700 font-extrabold">
                        Productos
                      </div>
                    </div>
                    <hr className="h-1 mt-2 bg-gray-400 border-0  rounded" />
                    <div className="">
                      {order.products.map((item, key) => (
                        <>
                          <div className="flex">
                            <div className="min-w-4 rounded-xl flex items-center justify-center">
                              <button
                                className="mx-1"
                                onClick={() => handleRemoveProduct(key)}
                              >
                                <MdDelete className=" outline-gray-400 text-gray-400 hover:text-red-700 hover:outline-none hover:bg-red-100 h-6 w-6 p-1 rounded-sm text-xl  transition-all duration-150 ease-in-out" />
                              </button>
                              <div className="flex justify-center mx-1">
                                {item.status === "found" ? (
                                  <FaCheck className="text-[#4048F1]" />
                                ) : item.status === "multiple" ? (
                                  <FaExclamation className="text-[#4048F1]" />
                                ) : (
                                  `⚠️`
                                )}
                              </div>
                            </div>
                            <div className="w-full p-3 rounded-xl bg-white transition-all duration-150 ease-in-out">
                              <div className="flex justify-between items-center text-sm">
                                <div className="mr-3">
                                  <div>
                                    {item.status === "not found"
                                      ? item.not_found_name
                                      : item.product_name +
                                        " - " +
                                        item.variant}
                                  </div>
                                  {item.status !== "found" && (
                                    <div
                                      className="text-xs flex text-gray-400"
                                      style={{ zIndex: 1000 }}
                                    >
                                      {item.status === "multiple"
                                        ? "* Posibilidad de producto equivocado"
                                        : "* Producto no encontrado"}
                                    </div>
                                  )}
                                </div>
                                <div className="flex items-center">
                                  <div className="mr-3 min-w-5">
                                    x {item.quantity}
                                  </div>
                                  <button
                                    className=""
                                    onClick={() => increaseQuantity(key)}
                                  >
                                    <FaPlus className="h-4 w-4 p-1 mr-1 outline rounded-sm text-gray-400 hover:bg-[#4048F1] hover:outline-none hover:text-white hover:h-5 hover:w-5 transition-all ease-in-out duration-200" />
                                  </button>
                                  <button onClick={() => decreaseQuantity(key)}>
                                    <FaMinus className="h-4 w-4 p-1 mr-1 outline rounded-sm text-gray-400 hover:bg-[#4048F1] hover:outline-none hover:text-white  hover:h-5 hover:w-5  transition-all ease-in-out duration-200" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>

                          <hr className="h-px bg-gray-300 border-0 rounded" />
                        </>
                      ))}
                      <InputWithSearch
                        className=""
                        callback={handleNewProducts}
                        placeholder="Añadir Producto..."
                        sugg={baseProducts.map((item) => item.filtering)}
                      />
                    </div>
                  </div>
                </div>
                <div className="" style={{ width: "calc(50% - 20px)" }}>
                  {/* Payment Received Section */}
                  <div className="h-50 overflow-y-auto flex-column pb-5">
                    <div className="flex justify-between items-center">
                      <div className="text-xl font-bold">Estado de Pago</div>
                      <div
                        className={` px-2 m-1 rounded-md ${
                          order.payment_info_array
                            .map((item) => item.paymentStatus)
                            .filter(Boolean).length ===
                          order.payment_info_array.map(
                            (item) => item.paymentStatus
                          ).length
                            ? "bg-green-50 text-green-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        Pagado{" "}
                        {
                          order.payment_info_array
                            .map((item) => item.paymentStatus)
                            .filter(Boolean).length
                        }{" "}
                        de{" "}
                        {
                          order.payment_info_array.map(
                            (item) => item.paymentStatus
                          ).length
                        }
                      </div>
                    </div>

                    {order.payment_info_array.map((item, key) => (
                      <div className="p-1 flex-column">
                        <PopUp trigger={paymentInformationPopUp[key]}>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <CheckBox
                                checked={item.paymentStatus}
                                onChange={() => handlePaymentStatus(key)}
                                className="mr-2"
                              />
                              <div className="text-xl font-bold">
                                {item.paymentStatus ? "Pagado" : "No Pagado"}
                              </div>
                            </div>
                            <IoClose
                              style={{ cursor: "pointer" }}
                              className="h-7 w-7 bg-indigo-50 rounded-md text-[#4048F1]  hover:bg-[#4048F1] hover:text-white transition-all duration-50 ease-in-out"
                              onClick={() => {
                                console.log("Imprimiendo key: " + key);
                                handlePaymentInformationPopUp(key);
                              }}
                            />
                          </div>
                          <hr className="h-1 w-full my-3 bg-gray-300 border-0 rounded" />
                          <div className="p-5">
                            <div className="flex w-full justify-between items-center mb-2">
                              <div className="text-center font-bold text-gray-700 mr-10 mb-2">
                                Método de Pago
                              </div>
                              <div className="min-w-24">
                                <CustomMultiOption
                                  callback={(value) =>
                                    handleChangePaymentMethod(value, key)
                                  }
                                  initialValue={item.payment_method}
                                  options={[
                                    "Tarjeta",
                                    "Transferencia",
                                    "Efectivo",
                                    "No Informado",
                                  ]}
                                />
                              </div>
                            </div>
                            <div className="flex w-full justify-between items-center ">
                              <div className="text-center font-bold text-gray-700 mr-10">
                                Fecha de Pago
                              </div>
                              <div className="">
                                <CustomDatePicker
                                  initialValue={
                                    item.payment_date ? item.payment_date : null
                                  }
                                  callback={(value) =>
                                    handleChangePaymentDate(value, key)
                                  }
                                />
                              </div>
                            </div>
                            <div className="flex w-full justify-between items-center my-2">
                              <div className="text-center font-bold text-gray-700 mr-10">
                                Monto
                              </div>
                              <div className="">
                                <CustomTextField
                                  size="small"
                                  inputType="numeric"
                                  inputProps={{
                                    min: 0,
                                    style: { textAlign: "right" },
                                  }}
                                  initialValue={item.amount}
                                  callback={(value) => {
                                    if (!isNaN(value)) {
                                      updatePaymentAmount(value, key);
                                      console.log(value);
                                    }
                                  }}
                                  textFormatter={(value) => format(value)}
                                  textUnFormatter={(value) =>
                                    value.replace(/[,$.]/g, "")
                                  }
                                />
                              </div>
                            </div>
                          </div>
                          <DragAndDrop
                            placeholder={"Comprobante de Transferencia"}
                          />
                        </PopUp>
                        <div className="flex items-center">
                          <div className="flex-column justify-center items-center text-center">
                            <CheckBox
                              checked={
                                order.payment_info_array.map(
                                  (item) => item.paymentStatus
                                )[key]
                              }
                              onChange={() => handlePaymentStatus(key)}
                            />
                            <button onClick={() => handleRemovePayment(key)}>
                              <MdDelete className=" outline-gray-400 text-gray-400 hover:text-red-700 hover:outline-none hover:bg-red-100 h-6 w-6 p-1 rounded-sm text-xl  transition-all duration-150 ease-in-out" />
                            </button>
                          </div>
                          <div
                            className={`group text-sm bg-gray-100  overflow-y-auto w-full rounded-md hover:drop-shadow-lg transition-all duration-50 ease-in-out`}
                            style={{ cursor: "pointer" }}
                            onClick={() => handlePaymentInformationPopUp(key)}
                          >
                            <div className="p-3 flex items-center justify-between">
                              <div className="flex pr-2 items-center">
                                <div className=""></div>
                                <div className="">
                                  {item.payment_method !== undefined && (
                                    <div className="">
                                      <span className="font-bold text-gray-700">
                                        Método de Pago:
                                      </span>{" "}
                                      {item.payment_method}
                                    </div>
                                  )}
                                  {item.payment_date !== null &&
                                    item.payment_date !== undefined &&
                                    typeof item.payment_date.getMonth ===
                                      "function" && (
                                      <div className="">
                                        <span className="font-bold text-gray-700">
                                          Fecha de Pago:
                                        </span>{" "}
                                        {item.payment_date.toLocaleDateString(
                                          "es-CL"
                                        )}
                                      </div>
                                    )}
                                </div>
                              </div>
                              <div className="pl-2 pr-2 flex-column">
                                <div className="font-bold text-gray-700 text-end">
                                  Total
                                </div>
                                <div>{format(item.amount)}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="ml-1">
                      <Button onClick={handleCreationPayment}>
                        Añadir Pago
                      </Button>
                    </div>
                  </div>

                  {/* Delivery Status Section */}
                  <div className="h-50 mt-10 overflow-y-auto flex-column pb-5">
                    <div className="flex justify-between items-center">
                      <div className="text-xl font-bold transition-all duration-50 ease-in-out">
                        Estado de Envío
                      </div>
                      <div
                        className={` px-2 m-1 rounded-md bg-gray-100 text-gray-700`}
                      >
                        Cantidad Envíos{" "}
                        <span className="font-bold">
                          {
                            order.delivery_info_array.map(
                              (item) => item.deliveryStatus
                            ).length
                          }
                        </span>
                      </div>
                    </div>

                    {order.delivery_info_array.map((item, key) => (
                      <div className="p-1 flex-column">
                        <PopUp trigger={deliveryInformationPopUp[key]}>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <CheckBox
                                disabled={isDateInPast(
                                  new Date(item.delivery_date)
                                )}
                                checked={
                                  order.delivery_info_array.map(
                                    (item) => item.deliveryStatus
                                  )[key]
                                }
                                onChange={() => handleDeliveryStatus(key)}
                                className="mr-2"
                              />
                              <div className="text-xl font-bold">
                                Pedido {order.idDay}
                              </div>
                            </div>
                            <IoClose
                              style={{ cursor: "pointer" }}
                              className="h-7 w-7 bg-indigo-50 rounded-md text-[#4048F1]  hover:bg-[#4048F1] hover:text-white transition-all duration-50 ease-in-out"
                              onClick={() =>
                                handleDeliveryInformationPopUp(key)
                              }
                            />
                          </div>
                          <hr className="h-1 w-full my-3 bg-gray-300 border-0 rounded" />
                          <div className="p-5">
                            <div className="flex w-full justify-between mb-3 items-center">
                              <div className="text-center font-bold text-gray-700 mr-10 mb-2">
                                Conductor
                              </div>
                              <div className="">
                                <CustomMultiOption
                                  callback={(value) =>
                                    handleChangeDeliveryDriver(value, key)
                                  }
                                  initialValue={item.driver}
                                  options={customDrivers.map(
                                    (item) => item.name
                                  )}
                                />
                              </div>
                            </div>
                            <div className="flex w-full justify-between items-center">
                              <div className="text-center font-bold text-gray-700 mr-10">
                                Fecha de Entrega
                              </div>
                              <div className="">
                                <CustomDatePicker
                                  initialValue={item.delivery_date}
                                  callback={(value) =>
                                    handleChangeDeliveryDate(value, key)
                                  }
                                />
                              </div>
                            </div>
                            <hr className="my-4" />
                            <div className="flex-column w-full">
                              <div className="font-bold text-gray-700 mr-10">
                                Notas de Entrega
                              </div>
                              <div className="text-gray-700 text-sm rounded-md">
                                <CustomTextField
                                  size="small"
                                  className="w-full text-sm text-left"
                                  initialValue={item.deliveryNote}
                                  callback={(value) => {
                                    handleChangeDeliveryNote(value, key);
                                  }}
                                  textFormatter={(value) => value}
                                  textUnFormatter={(value) => value}
                                />
                              </div>
                            </div>
                          </div>
                          <DragAndDrop
                            className="mb-3"
                            placeholder={"Foto de Entrega"}
                          />
                          <div
                            className={`flex justify-between px-5 rounded-md items-center py-2 ${
                              item.deliveryStatus
                                ? "bg-green-100 "
                                : "bg-red-100"
                            }`}
                          >
                            <div className="text-center font-bold text-black mr-10">
                              Estado de Entrega
                            </div>
                            <div>
                              {item.deliveryStatus
                                ? "Entregado"
                                : "No Entregado"}
                            </div>
                          </div>
                        </PopUp>
                        <div className="flex items-center">
                          <div className="flex-column items-center justify-center text-center">
                            <CheckBox
                              disabled={isDateInPast(
                                new Date(item.delivery_date)
                              )}
                              checked={item.deliveryStatus}
                              onChange={() => handleDeliveryStatus(key)}
                            />
                            <button onClick={() => handleRemoveDelivery(key)}>
                              <MdDelete className="outline-gray-400 text-gray-400 hover:text-red-700 hover:outline-none hover:bg-red-100 h-6 w-6 p-1 rounded-sm text-xl  transition-all duration-150 ease-in-out" />
                            </button>
                          </div>
                          <div
                            className={`group text-sm bg-gray-100 overflow-y-auto w-full rounded-md hover:drop-shadow-lg transition-all duration-50 ease-in-out`}
                            style={{ cursor: "pointer" }}
                            onClick={() => handleDeliveryInformationPopUp(key)}
                          >
                            <div className="p-3 flex items-center justify-between">
                              <div className="flex pr-2 items-center">
                                <div className="">
                                  <div className="flex justify-center"></div>
                                </div>
                                <div className="">
                                  {item.driver !== undefined && (
                                    <div className="">
                                      <span className="font-bold text-gray-700">
                                        Conductor:
                                      </span>{" "}
                                      {item.driver}
                                    </div>
                                  )}
                                  {item.delivery_date !== undefined && (
                                    <div className="">
                                      <span className="font-bold text-gray-700">
                                        Fecha de Entrega:
                                      </span>{" "}
                                      {new Date(
                                        item.delivery_date
                                      ).toLocaleDateString("es-CL")}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="px-2 flex-column">
                                <div className="font-bold text-gray-700 text-end">
                                  Estado
                                </div>
                                <div>
                                  {item.deliveryStatus
                                    ? "Entregado"
                                    : "No Entregado"}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="ml-1 mt-1">
                      <Button onClick={handleCreationDelivery}>
                        Añadir Entrega
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="flex justify-center">
          <Button
            onClick={() =>
              console.log("cancelar cambios y redirigir a la pagina anteiror")
            }
            disabled={false}
            color="red"
            className="min-w-36 mr-3"
          >
            Cancelar
          </Button>

          {id === "create" ? (
            <Button
              disabled={order === infoOrder}
              onClick={() => {
                createOrderBC();
              }}
              className="min-w-36"
            >
              Añadir
            </Button>
          ) : (
            <Button
              disabled={order === infoOrder}
              onClick={sendPostBackend}
              className="min-w-36"
            >
              Guardar
            </Button>
          )}
        </div>
      </div>
    </>
  );
};

export default Order;
