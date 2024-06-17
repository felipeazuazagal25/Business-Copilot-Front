import React from "react";

const DataFilters = ({ children, callback }) => {
  return (
    <div className="min-h-16 mb-5 rounded-lg flex justify-between p-3 items-center">
      {children}
    </div>
  );
};

export default DataFilters;
