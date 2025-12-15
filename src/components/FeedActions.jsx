import React from "react";
import connect from "../assets/icons/connect.png";
import block from "../assets/icons/block.png";
import ignore from "../assets/icons/ignore.png";

const FeedActions = ({ user }) => {
  return (
    <>
      <button className="btn flex flex-col items-center justify-center p-4 h-auto min-h-[90px] w-24 gap-2">
        <img src={connect} className="w-6 h-6" alt="Connect" />
        <span className="text-sm">Connect</span>
      </button>

      <button className="btn flex flex-col items-center justify-center p-4 h-auto min-h-[90px] w-24 gap-2">
        <img src={ignore} className="w-6 h-6" alt="Ignore" />
        <span className="text-sm">Ignore</span>
      </button>

      <button className="btn flex flex-col items-center justify-center p-4 h-auto min-h-[90px] w-24 gap-2">
        <img src={block} className="w-6 h-6" alt="Block" />
        <span className="text-sm">Block</span>
      </button>
    </>
  );
};

export default FeedActions;
