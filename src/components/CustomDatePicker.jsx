import { React, useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import TextField from "@mui/material/TextField";

import { createTheme, ThemeProvider, styled } from "@mui/material/styles";

const CustomDatePicker = ({
  callback,
  initialValue,
  label = "",
  className = "",
  defaultValue = null,
}) => {
  const [value, setValue] = useState(initialValue);

  const theme = createTheme({
    components: {
      MuiPickersPopper: {
        styleOverrides: {
          root: {
            zIndex: 3000,
          },
        },
      },
      MuiPickersToolbar: {
        styleOverrides: {
          root: {
            color: "#ffffff",
            borderRadius: "2px",
            borderWidth: "1px",
            borderColor: "#4048F1",
            border: "1px solid",
            backgroundColor: "#4048F1",
          },
        },
      },
      MuiPickersDay: {
        styleOverrides: {
          root: {
            "&.Mui-selected": {
              backgroundColor: "#4048F1",
              color: "#ffffff",
              "&:hover": {
                backgroundColor: "#272cb3",
              },
            },
          },
        },
      },
    },
  });

  const CustomTextField = styled(TextField)(({ theme }) => ({
    "& .MuiInputBase-root": {
      fontSize: "0.875rem", // Small text
      //height: "2.5rem", // Less height
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

  return (
    <div>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            size="small"
            style={{ zIndex: 4000 }}
            className={className}
            label={label}
            value={value}
            onChange={(newValue) => {
              console.log("value: " + value);
              console.log("newValue: " + newValue);
              if (newValue !== null) {
                setValue(newValue);
              } else {
                setValue(defaultValue);
              }
              callback(newValue !== null ? newValue : defaultValue);
            }}
            renderInput={(params) => (
              <CustomTextField
                {...params}
                InputLabelProps={{
                  readOnly: true,
                  style: {
                    fontSize: 15,
                    backgroundColor: "transparent",
                    color: "#4048F1",
                  },
                }}
              />
            )}
          />
        </LocalizationProvider>
      </ThemeProvider>
    </div>
  );
};

export default CustomDatePicker;
