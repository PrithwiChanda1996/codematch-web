import React from "react";

export const DisconnectButton = ({ connection }) => {
  return <button className="btn btn-error btn-sm">Disconnect</button>;
};

export const AcceptRejectButtons = ({ connection }) => {
  return (
    <div className="flex gap-2">
      <button className="btn btn-success btn-sm">Accept</button>
      <button className="btn btn-error btn-sm">Reject</button>
    </div>
  );
};

export const CancelButton = ({ connection }) => {
  return <button className="btn btn-warning btn-sm">Cancel</button>;
};
