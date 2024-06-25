import React, { useState, useEffect } from "react";

import { CheckBox, PopUp } from "../components";

import { IoMdRefresh } from "react-icons/io";

import { titleCase } from "../utils/utils";

const DataGrid = ({
  data,
  callbackRefresh,
  title,
  subtitle,
  infoLabel,
  info,
  boxSize = { width: "72", height: "128" },
}) => {
  const [checked, setChecked] = useState(data.map((item) => false));
  console.log(boxSize);

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

  return (
    <>
      <div className="flex justify-between">
        <div className="flex">
          {" "}
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
        </div>
        <div className="flex"></div>
      </div>
      <div className="flex flex-wrap w-full">
        {data.map((item, id) => (
          <div
            style={{ cursor: "pointer" }}
            className={` h-${boxSize.height} w-${
              boxSize.width
            } px-5 pt-2 pb-4 m-3 rounded-md hover:drop-shadow-lg transition-all ease-in-out duration-100 ${
              checked[id] ? "bg-gray-200 drop-shadow-md" : "bg-gray-100"
            }`}
          >
            {/* Title */}
            <div className="flex items-center justify-between w-full">
              <div className="font-bold text-xl">{item[title]}</div>
              <CheckBox
                checked={checked[id]}
                onChange={() => handleChekedRow(id)}
              />
            </div>
            {/* Subtitle */}
            {item[subtitle] ? (
              <div className="flex items-center justify-between w-full">
                <div className="text-md text-gray-600">{item[subtitle]}</div>
              </div>
            ) : (
              <></>
            )}
            {/* Info */}
            <div className="px-2 mt-2">
              {info.map((infoField, id) => (
                <div className="flex w-full justify-between">
                  <div className="text-gray-600">{infoLabel[id]}:</div>
                  <div className="">
                    {typeof item[infoField] === "boolean"
                      ? item[infoField]
                        ? "Si"
                        : "No"
                      : titleCase(item[infoField])}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default DataGrid;
