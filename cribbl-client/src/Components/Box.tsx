import React from "react";

type BoxType = {
  children: React.ReactNode;
  className?: string;
  selected?: boolean;
  onClick?: () => void;
};

const BoxClassName = `w-12 h-12 mx-px bg-white rounded dead-center hover:bg-purple-500 cursor-pointer`;

const Box = ({
  children,
  className = "",
  selected = false,
  onClick,
}: BoxType) => {
  return (
    <div
      className={`${BoxClassName} ${className} ${
        selected ? "bg-purple-400" : ""
      }`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Box;
