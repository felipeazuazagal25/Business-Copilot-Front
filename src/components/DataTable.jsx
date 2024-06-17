import { React, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../index.css";

import { customData } from "../data/customData";
import { CheckBox, PopUp } from "../components";

import { IoMdRefresh } from "react-icons/io";
import { IoWarningOutline } from "react-icons/io5";
import { MdDelete, MdDeleteOutline } from "react-icons/md";

import {
  useReactTable,
  flexRender,
  getCoreRowModel,
} from "@tanstack/react-table";

import { Button } from "../components";

const DataTable = ({
  columns,
  data,
  columnRowClick = "id",
  handleRemoveElements,
  callbackRemove,
  addPage,
  callbackRefresh,
  addButton = true,
}) => {
  const [callbackResponse, setcallbackResponse] = useState({
    refresh: false,
    deleteElements: [],
  });
  // Making the Table adjust to the size of the Screen
  function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return {
      width,
      height,
    };
  }

  function useWindowDimensions() {
    const [windowDimensions, setWindowDimensions] = useState(
      getWindowDimensions()
    );

    useEffect(() => {
      function handleResize() {
        setWindowDimensions(getWindowDimensions());
      }

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

    return windowDimensions;
  }

  const { height, width } = useWindowDimensions();

  // Hyperlinks to each row
  const navigate = useNavigate();
  const location = useLocation();

  // Additional to paste random ID

  const checkboxColumn = {
    id: "checkbox",
    header: "",
    cell: ({ row }) => (
      <CheckBox
        checked={checked[row.id]}
        onChange={() => handleChekedRow(row.id)}
      />
    ),
  };

  const table = useReactTable({
    data,
    columns: [checkboxColumn, ...columns],
    getCoreRowModel: getCoreRowModel(),
  });

  // Checkbox for each row
  const [checked, setChecked] = useState(data.map((item) => false));

  useEffect(() => {
    setChecked(data.map((item) => false));
    setTopChecked(false);
  }, [data]);

  const handleChekedRow = (key) => {
    const list = [...checked];
    list[key] = !list[key];
    setChecked(list);
    if (list.filter((item) => item === true).length === list.length) {
      setTopChecked(true);
    }
    if (list.filter((item) => item === true).length === 0) {
      setTopChecked(false);
    }
  };

  const [topChecked, setTopChecked] = useState(false);

  const handleTopCheckedBox = (value) => {
    if (!topChecked === true) {
      const list = checked.map(() => true);
      setChecked(list);
    } else if (!topChecked === false) {
      const list = checked.map(() => false);
      setChecked(list);
    }

    if (value) {
      setTopChecked(value);
    }
    setTopChecked(!topChecked);
  };

  const [showPopUpDelete, setShowPopUpDelete] = useState(false);

  const handlePopUpDelete = (value) => {
    if (value === null) {
      setShowPopUpDelete(!showPopUpDelete);
    } else {
      setShowPopUpDelete(value);
    }
  };

  const [newData, setNewData] = useState(data);

  return (
    <>
      <div className="p-2 rounded-xl mb-3 flex items-center">
        {/* PopUp Menu */}
        <PopUp trigger={showPopUpDelete}>
          <div className=" flex-column">
            <div className="flex-column justify-center items-center text-center mt-5">
              <div className="font-bold text-xl mb-5">Confirmar acción</div>
              <div className="flex justify-center w-full mb-24">
                <IoWarningOutline className="h-12 w-12 text-red-600" />
              </div>
              <div className="text-md">
                La acción que vas a realizar no es reversible.
              </div>
            </div>
            <div className="flex-column justify-center items-center text-center font-bold mb-3">
              ¿Estás seguro que deseas continuar?
            </div>

            <div className="flex justify-center mb-5">
              <button
                onClick={() => handlePopUpDelete(false)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900 mx-3 p-2 rounded-md text-sm "
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  callbackRemove(
                    data.filter((item, id) => checked[id] && item)
                  );
                  handlePopUpDelete(false);
                }}
                className="bg-red-100 hover:bg-red-200 text-red-600 hover:text-red-800 mx-3 px-2 rounded-md text-sm"
              >
                Eliminar
              </button>
            </div>
          </div>
        </PopUp>
        {/* Bar on the top of the table */}
        <div className="flex justify-between w-full items-center">
          {/* Left Section */}
          <div className="flex items-center">
            <CheckBox
              checked={topChecked}
              indeterminate={
                checked.filter((item) => item === true).length > 0 &&
                checked.filter((item) => item === true).length < checked.length
              }
              onChange={handleTopCheckedBox}
            />
            <button
              className="p-2 h-10 w-10 rounded-full custom-hover-border active:bg-black"
              onClick={() => {
                console.log("making a callback here");
                callbackRefresh("saad,skjfhkasdjhfkads");
              }}
            >
              <IoMdRefresh className="h-full w-full text-[#4048F1]" />
            </button>
            {checked.filter((item) => item === true).length > 0 && (
              <button
                onClick={() => handlePopUpDelete(true)}
                className="p-2 h-10 w-10 rounded-full custom-hover-border"
              >
                <MdDeleteOutline className="h-full w-full text-[#4048F1]" />
              </button>
            )}
          </div>
          {/* Right Section */}
          <div>
            {addButton && (
              <Button
                onClick={() => {
                  navigate(location.pathname + "/create");
                }}
              >
                Añadir
              </Button>
            )}
          </div>
        </div>
      </div>
      <div
        className="overflow-y-auto overflow-x-auto drop-shadow-md rounded-2xl"
        style={{
          height: height - 260,
        }}
      >
        <table className="w-full text-left rtl:text-right text-sky-blue">
          <thead
            className="sticky top-0 text-sm text-white uppercase bg-[#4048F1]"
            style={{ zIndex: 1000 }}
          >
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="px-6 py-3">
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="pt-5 pb-5 pl-3">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                // style={{ cursor: "pointer" }}
                key={row.id}
                className={`border-b hover:text-gray-900 transition-all duration-100 ease-in-out ${
                  checked[row.id]
                    ? "bg-gray-200 text-black"
                    : "hover:bg-gray-50 bg-white text-gray-600"
                }`}
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="pt-4 pb-4 pl-3"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      console.log(cell.column.id);
                      if (cell.column.id === "checkbox") {
                      } else {
                        navigate(
                          location.pathname + "/" + row.original[columnRowClick]
                        );
                      }
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default DataTable;
