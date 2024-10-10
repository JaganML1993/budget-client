import React from "react";
import { RotatingLines } from "react-loader-spinner";

const Loader = ({
  strokeColor = "grey",
  strokeWidth = "5",
  animationDuration = "0.75",
  width = "96"
}) => {
  return (
    <div className="loader-container">
      <RotatingLines
        strokeColor={strokeColor}
        strokeWidth={strokeWidth}
        animationDuration={animationDuration}
        width={width}
      />
    </div>
  );
};

export default Loader;
