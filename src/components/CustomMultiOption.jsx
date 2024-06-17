import React from "react";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";

import { createTheme, ThemeProvider, styled } from "@mui/material/styles";
import { TextField } from "@mui/material";

const CustomOutlinedInput = styled(OutlinedInput)({
  "& .MuiInputBase-root": {
    fontSize: "0.875rem", // Small text
    height: "2.5rem", // Less height
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
});

const CustomMultiOption = ({ callback, options, initialValue = "" }) => {
  const [paymentMethod, setPaymentMethod] = React.useState(initialValue);

  const theme = createTheme({
    components: {
      MuiPopover: {
        styleOverrides: {
          root: {
            zIndex: 5000,
          },
        },
      },
      MuiPickersPopper: {
        styleOverrides: {
          root: {
            zIndex: 5000,
          },
        },
      },
      MuiSelect: {
        styleOverrides: {
          root: {
            zIndex: 5000,
          },
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            zIndex: 5000,
          },
        },
      },
    },
  });
  const handleChange = (event) => {
    setPaymentMethod(event.target.value);
    callback(event.target.value);
  };

  return (
    <div className="">
      <ThemeProvider theme={theme}>
        <FormControl
          variant="outlined"
          className="w-full"
          sx={{ padding: "0rem" }}
        >
          <InputLabel id="id"></InputLabel>
          <Select
            sx={{
              fontSize: "0.875rem",
              height: "2.5rem",
              padding: "0rem",
              margin: "0rem",
            }}
            labelId="id"
            id="demo-simple-select"
            value={paymentMethod}
            onChange={handleChange}
          >
            {options.map((item) => (
              <MenuItem sx={{ fontSize: "0.875rem" }} value={item}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </ThemeProvider>
    </div>
  );
};

export default CustomMultiOption;
