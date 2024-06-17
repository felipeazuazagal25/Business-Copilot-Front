import React from "react";
import TextField from "@mui/material/TextField";

import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  root: {
    "& .MuiInputBase-input": {
      outline: "2px",
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "#4048F1",
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#4048F1",
      },
      "&:hover fieldset": {
        borderColor: "#4048F1",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#4048F1",
      },
    },
  },
});

const InputBox = ({ label, text }) => {
  const classes = useStyles();
  return (
    <TextField
      fullWidth
      id="outlined-basic"
      label={label}
      variant="outlined"
      defaultValue={text}
      className={`${classes.root}`}
      InputLabelProps={{
        style: {
          fontSize: 18, // Adjust the font size as needed
          padding: "0 5px", // Increase padding around the label
          backgroundColor: "white",
          color: "#4048F1",
        },
      }}
    />
  );
};

export default InputBox;
