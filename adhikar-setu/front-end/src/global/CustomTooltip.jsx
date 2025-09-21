import React from "react";

const CustomTooltip = ({ children, text }) => {
  return (
    <div className="relative flex items-center group">
      {children}
      <span className="absolute top-full mt-2 hidden w-max rounded bg-gray-800 px-2 py-1 text-xs text-white group-hover:block whitespace-nowrap">
        {text}
      </span>
    </div>
  );
};

export default CustomTooltip;
