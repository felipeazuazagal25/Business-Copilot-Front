import React, { useState } from "react";

const DataTable = ({ orders }) => {
  const [selectedOrders, setSelectedOrders] = useState([]);

  const handleSelectAll = () => {
    setSelectedOrders(orders.map((order) => order.id));
  };

  const handleSelectChange = (orderId) => {
    const newSelection = [...selectedOrders];
    const index = newSelection.indexOf(orderId);
    if (index > -1) {
      newSelection.splice(index, 1);
    } else {
      newSelection.push(orderId);
    }
    setSelectedOrders(newSelection);
  };

  const hasSelection = selectedOrders.length > 0;

  return <></>;
};

export default DataTable;
