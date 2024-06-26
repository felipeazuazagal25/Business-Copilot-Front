import React from "react";

import { Header, InDevelopmentPage } from "../components";

const Home = () => {
  return (
    <>
      <div className="m-10 mt-5 p-10 pt-6 bg-white rounded-3xl">
        {/* Showing data saved correctly */}
        <div className="mb-5 flex justify-between">
          <Header category="Página" title="Menú Principal" />
        </div>
        <InDevelopmentPage />
        <div className=""></div>
      </div>
    </>
  );
};

export default Home;
