import React, { useEffect, useState } from "react";
import { Header, DataGrid } from "../components";

import { fetchSellers } from "../utils/fetchSellers";

import { useStateContext } from "../contexts/ContextProvider";

import { ThreeDot } from "react-loading-indicators";

const Sellers = () => {
  const { loadingMessage, setLoadingMessage } = useStateContext();

  const [refreshPage, setRefreshPage] = useState(false);

  const [isDataLoading, setIsDataLoading] = useState(false);
  const [dataError, setDataError] = useState(null);
  const [searchText, setSearchText] = useState("");

  const [data, setData] = useState([]);

  useEffect(async () => {
    setLoadingMessage(true);
    setIsDataLoading(true);
    setDataError(null);
    const fetchData = async () => {
      try {
        const vals = await fetchSellers();
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
  }, [refreshPage]);

  return (
    <>
      <div className="m-10 mt-5 p-10 pt-6 bg-white rounded-3xl">
        {/* Showing data saved correctly */}
        <div className="mb-5 flex justify-between">
          <Header category="Página" title="Vendedores" />
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
          <div>No se pudo cargar los vendedores.</div>
        ) : (
          <DataGrid
            data={data}
            callbackRefresh={() => setRefreshPage(!refreshPage)}
            title="name"
            subtitle=""
            infoLabel={["Posición", "Activo"]} // se puede poner todo en un objeto
            info={["position", "is_active"]}
            boxSize={{ widht: 64, height: "auto" }}
          ></DataGrid>
        )}
      </div>
    </>
  );
};

export default Sellers;
