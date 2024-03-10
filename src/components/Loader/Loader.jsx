import React from "react";
import { Blocks } from "react-loader-spinner";

const Loader = () => {
  return (
    <div className="flex justify-center items-center h-screen z-50 bg-black fixed w-full top-0 left-0 opacity-90">
      <Blocks
        visible={true}
        height="80"
        width="80"
        color="red"
        ariaLabel="blocks-loading"
      />
    </div>
  );
};

export default Loader;
