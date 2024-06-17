import { React, useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import { styled } from "@mui/material/styles";

const ThemedTextField = styled(TextField)(({ theme }) => ({
  "& .MuiInputBase-root": {
    fontSize: "0.875rem", // Small text
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#4048F1", // Different border color
    },
    "&:hover fieldset": {
      borderColor: "#4048F1",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#4048F1",
    },
  },
}));

const CustomTextField = ({
  callback,
  name = "",
  fullWidth = false,
  variant,
  initialValue,
  multiline = true,
  minRows = 1,
  maxRows = 4,
  className,
  disabled,
  readOnly = false,
  editOnDoubleClick,
  size,
  inputProps,
  inputType = "text",
  defaultValue = null,
  textFormatter = (value) => {
    return value;
  },
  textUnFormatter = (value) => {
    return value;
  },
}) => {
  const [textValue, setTextValue] = useState(initialValue);

  useEffect(() => {
    console.log("readonly inside of customtextfield: ", readOnly);
  }, []);
  return (
    <div>
      <ThemedTextField
        name={name}
        fullWidth={fullWidth}
        inputProps={inputProps}
        className={className}
        variant={variant}
        value={textFormatter(textValue)}
        multiline={multiline}
        InputProps={{
          readOnly: true,
        }}
        minRows={minRows}
        maxRows={maxRows}
        onChange={(event) => {
          if (inputType == "numeric") {
            if (!isNaN(textUnFormatter(event.target.value))) {
              setTextValue(textUnFormatter(event.target.value));
              callback(textUnFormatter(event.target.value));
            }
          } else {
            if (event.target.value === null) {
              setTextValue(defaultValue);
              callback(defaultValue);
            } else {
              setTextValue(textUnFormatter(event.target.value));
              callback(textUnFormatter(event.target.value));
            }
          }
        }}
        size={size}
      />
    </div>
  );
};

export default CustomTextField;
