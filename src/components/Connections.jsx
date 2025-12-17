import React, { useState } from "react";
import MutualConnections from "./MutualConnections";
import ReceivedConnections from "./ReceivedConnections";
import SentConnections from "./SentConnections";

export const Connections = () => {
  const [activeTab, setActiveTab] = useState("mutual");
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "mutual":
        return <MutualConnections />;
      case "received":
        return <ReceivedConnections />;
      case "sent":
        return <SentConnections />;
      default:
        return <MutualConnections />;
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="flex justify-center mb-6">
        <div role="tablist" className="tabs tabs-boxed">
          <a
            role="tab"
            className={`tab ${activeTab === "mutual" ? "tab-active" : ""}`}
            onClick={() => handleTabClick("mutual")}
          >
            Mutual Connections
          </a>
          <a
            role="tab"
            className={`tab ${activeTab === "received" ? "tab-active" : ""}`}
            onClick={() => handleTabClick("received")}
          >
            Received Connections
          </a>
          <a
            role="tab"
            className={`tab ${activeTab === "sent" ? "tab-active" : ""}`}
            onClick={() => handleTabClick("sent")}
          >
            Sent Connections
          </a>
        </div>
      </div>
      <div className="container mx-auto px-4">{renderTabContent()}</div>
    </div>
  );
};
