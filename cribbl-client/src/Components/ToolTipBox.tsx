import React from "react";

type ToolTipBoxType = {
  children: React.ReactNode;
  name?: string;
};

const ToolTipBox = ({ children, name }: ToolTipBoxType) => {
  return (
    <div className="has-tooltip relative">
      {children}
      <div className="absolute left-1/2 -top-2/3 w-28 py-[2px] text-center -translate-x-1/2 tooltip bg-black rounded text-xs text-white max-w-lg">
        <span>{name}</span>
      </div>
    </div>
  );
};

export default ToolTipBox;
