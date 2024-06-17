import { React, useState, useRef } from "react";
import { Button } from "../components";

import { FaCheck } from "react-icons/fa";
import { FaX } from "react-icons/fa6";

const InputWithSearch = ({
  callback,
  children,
  sugg,
  placeholder,
  originalItems,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  // Focus Text
  const handleFocus = () => {
    setIsFocused(!isFocused);
  };

  //Handling Callback
  const handleCallback = (item) => {
    setIsFocused(false);
    item !== "" && callback(item);
    setSelectedItem("");
  };

  const [selectedItem, setSelectedItem] = useState("");

  const handleSelectedItem = (selectedItem) => {
    setSelectedItem(selectedItem);
    setIsFocused(false);
  };

  // Changing dynamically the suggestions
  const [suggestions, setSuggestions] = useState([...sugg]);

  const handleSuggestions = (value) => {
    const list = [...sugg];
    const newSuggestions = list.filter((item) =>
      item.toLowerCase().includes(value.toLowerCase())
    );
    setSuggestions(newSuggestions);
  };

  // isFocused false when pressing Enter
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      setIsFocused(false);
      if (inputRef.current) {
        inputRef.current.blur(); // Ensure the input is blurred
      }
      selectedItem !== ""
        ? handleCallback(selectedItem)
        : console.log("cant assign that");
    }
  };

  return (
    <div
      className={`mx-5 text-sm p-3 rounded-lg ${
        isFocused ? "bg-gray-100" : "bg-white"
      }`}
    >
      <div className="flex justify-between items-center">
        <input
          placeholder={placeholder}
          ref={inputRef}
          className={`focus:outline-none focus:ring-0 focus:border-gray-900 min-h-8 min-w-72 text-gray-700 ${
            isFocused ? "bg-gray-100" : "bg-white"
          }`}
          onFocus={handleFocus}
          value={selectedItem}
          onChange={(event) => {
            setSelectedItem(event.target.value);
            handleSuggestions(event.target.value);
          }}
          onKeyDown={(event) => {
            event.key === "Enter" && handleKeyDown(event);
          }}
        />
        {isFocused && (
          <div className="">
            <Button
              color="green"
              className="mr-2"
              onClick={() => {
                selectedItem !== "" && handleCallback(selectedItem);
              }}
            >
              <FaCheck className="w-2" />
            </Button>
            <Button
              color="red"
              onClick={() => {
                handleFocus();
                setSelectedItem("");
              }}
            >
              <FaX className="w-2" />
            </Button>
          </div>
        )}
      </div>
      {isFocused && (
        <div className="flex-column overflow-y-auto max-h-36">
          <hr />
          {suggestions !== undefined &&
            suggestions.map((item, index) => (
              <>
                <div
                  key={index}
                  className="px-3 py-2"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    handleSelectedItem(item);
                    handleCallback(item);
                  }}
                >
                  {item}
                </div>
              </>
            ))}
        </div>
      )}
    </div>
  );
};

export default InputWithSearch;
