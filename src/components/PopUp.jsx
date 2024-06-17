import zIndex from "@mui/material/styles/zIndex";
import { React } from "react";

const PopUp = ({ trigger, children }) => {
  return trigger ? (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40"
      style={{ zIndex: 2000 }}
    >
      <div className="bg-white flex-column justify-center p-5 rounded shadow-lg min-h-[calc(40vh)] min-w-[calc(25%)]">
        {children}
      </div>
    </div>
  ) : (
    <></>
  );
};

export default PopUp;
