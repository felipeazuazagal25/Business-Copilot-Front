import React, { useState, useEffect } from "react";
import { Header, InputBox } from "../components";
import { useStateContext } from "../contexts/ContextProvider";
import { useParams } from "react-router-dom";
import { ThreeDot } from "react-loading-indicators";

import {
  fetchProductsById,
  fetchProductVariantsById,
  fetchProductPricesById,
} from "../utils/fetchProducts";

const Product = () => {
  const { loadingMessage, setLoadingMessage } = useStateContext();

  const { product_id } = useParams();

  const [isDataLoading, setIsDataLoading] = useState(false);
  const [dataError, setDataError] = useState(null);
  const [searchText, setSearchText] = useState("");

  const [data, setData] = useState([]);
  const [variants, setVariants] = useState([]);
  const [prices, setPrices] = useState([]);

  const [refreshPage, setRefreshPage] = useState(false);

  useEffect(() => {
    setLoadingMessage(true);
    setIsDataLoading(true);
    setDataError(null);
    const fetchData = async () => {
      try {
        const vals = await fetchProductsById(Number(product_id));
        setData(vals);
        // const variants = await fetchProductVariantsById(Number(product_id));
        // setVariants(variants);
        const prices = await fetchProductPricesById(Number(product_id));
        setPrices(prices);

        console.log(prices);

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
  }, [refreshPage]);

  return (
    <>
      <div className="m-10 mt-5 p-10 pt-6 bg-white rounded-3xl">
        {/* Showing data saved correctly */}
        <div className="mb-5 flex justify-between">
          <Header category="Página" title="Productos" />
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
            <div>No se pudo cargar los productos.</div>
          ) : (
            <div className="w-full">
              <InputBox
                label="Nombre Producto"
                text={data.name}
                callback={(value) => {
                  console.log(value);
                }}
              />
              <div className="flex w-full p-5">
                <div className="w-1/2">Aqui van a ir las variaciones</div>
                <div className="w-1/2">
                  {prices.map((price) => (
                    <div>
                      {price.quantity} - {price.price}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Product;
