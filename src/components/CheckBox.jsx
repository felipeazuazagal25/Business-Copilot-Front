import React from "react";
import Checkbox from "@mui/material/Checkbox";

const CheckBox = ({ onChange, checked, disabled, indeterminate }) => {
  return (
    <div>
      <Checkbox
        onChange={onChange}
        checked={checked}
        disabled={disabled}
        indeterminate={indeterminate}
        disableRipple
        sx={{
          color: "#4048F1",
          "&:hover": {
            backgroundColor: "rgba(64, 72, 241, 0.1)",
          },
          "&.Mui-checked": {
            color: "#4048F1",
          },
          "&.MuiCheckbox-indeterminate": {
            color: "#4048F1",
          },
        }}
      />
    </div>
  );
};

export default CheckBox;
