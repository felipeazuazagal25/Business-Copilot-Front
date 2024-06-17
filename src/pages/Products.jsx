import React, { useState, useEffect, useRef, Suspense } from "react";
import { customProducts } from "../data/customData";
import { useSearchParams } from "react-router-dom";

import TextField from "@mui/material/TextField";
import { CustomTextField } from "../components";
import { FaSearch } from "react-icons/fa";

// import { setTimeout } from "timers/promises";

import { Header } from "../components";
import DataTable from "../components/DataTable";

import { fetchProducts, removeProducts } from "../utils/fetchProducts";
import { Refresh } from "@mui/icons-material";

import { useStateContext } from "../contexts/ContextProvider";

import { ThreeDot } from "react-loading-indicators";

const Products = () => {
  const { loadingMessage, setLoadingMessage } = useStateContext();

  const [urlSearchText, setUrlSearchText] = useState(
    useSearchParams()[0].get("searchText")
  );
  console.log("Esto es el urlSearchText", urlSearchText);

  const [originalData, setOriginalData] = useState(customProducts); // Fetch here the data with API calls

  const columns = [
    {
      header: "Nombre del Producto",
      accessorKey: "name",
      footer: "Product Name",
    },
    { header: "Variante", accessorKey: "variant", footer: "Variant" },
    // {
    //   header: "Productos",
    //   accessorKey: "products",
    //   footer: "Products",
    //   cell: ({ row }) =>
    //     row.original.products !== undefined &&
    //     row.original.products
    //       .filter((item) => item.product_name !== "NotFound")
    //       .map((item) => (
    //         <>
    //           {item.product_name} <br />
    //         </>
    //       )),
    // },
  ];

  const [isDataLoading, setIsDataLoading] = useState(false);
  const [dataError, setDataError] = useState(null);
  const [searchText, setSearchText] = useState("");

  const [data, setData] = useState([]);

  const [refreshPage, setRefreshPage] = useState(false);

  useEffect(() => {
    setLoadingMessage(true);
    setIsDataLoading(true);
    setDataError(null);
    const fetchData = async () => {
      try {
        const vals = await fetchProducts();
        console.log("nuevos productos: ", vals);
        setData(vals);
        setIsDataLoading(false);
        setLoadingMessage(false);
      } catch (error) {
        console.log(error);
        setData(null);
        setDataError(error);
        setIsDataLoading(false);
        setLoadingMessage(false);
      }
    };
    fetchData();

    if (urlSearchText !== null) {
      setSearchText(urlSearchText);
    }
    setData(
      originalData.filter((item) =>
        item.matchingString
          .toLowerCase()
          .includes(searchText.toLowerCase().replace(/[\s-]/g, ""))
      )
    );
  }, [refreshPage]);

  const handleUpdateSearchText = (value) => {
    setSearchText(value);
    console.log("handel update search text: " + value);
    const newData = [...originalData];
    setUrlSearchText(
      new URLSearchParams({
        textSearch: value,
      }).toString()
    );
    if (value === "") {
      window.history.replaceState(null, "", "/products" + value);
    } else {
      window.history.replaceState(null, "", "/products?searchText=" + value);
    }
    setData(
      newData.filter((item) =>
        item.matching_string
          .toLowerCase()
          .includes(value.toLowerCase().replace(/[\s-]/g, ""))
      )
    );
  };

  const handleNewData = (newData) => {
    setData(newData);
  };

  const handleRemoveProducts = async (products) => {
    const removeProductsID = products.map((item) => item.product_id);
    try {
      removeProducts(removeProductsID).then((value) => {
        console.log(value);
        setRefreshPage(!refreshPage);
      });
      console.log("recargue la bien");
    } catch (error) {
      throw Error(error.message);
    }
  };

  return (
    <>
      <div className="m-10 mt-5 p-10 pt-6 bg-white rounded-3xl">
        {/* Showing data saved correctly */}
        <div className="mb-5 flex justify-between">
          <Header category="Página" title="Productos" />
          <div className="flex justify-center items-center">
            <CustomTextField
              initialValue={urlSearchText}
              multiline={false}
              size="small"
              callback={(value) => {
                console.log("Callbakc function value: " + value);
                handleUpdateSearchText(value);
              }}
            />
            <FaSearch
              onClick={() => handleUpdateSearchText(searchText)}
              className="text-[#4048F1] ml-2 p-2 min-h-8 min-w-8 rounded-sm outline"
              style={{ cursor: "pointer" }}
            />
          </div>
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
          <div>No se pudo cargar los productos.</div>
        ) : (
          <DataTable
            columns={columns}
            data={data}
            callbackRemove={(res) => {
              if (res.length > 0) {
                handleRemoveProducts(res);
              }
            }}
            callbackRefresh={(value) => setRefreshPage(!refreshPage)}
          />
        )}
      </div>
    </>
  );
};

export default Products;
