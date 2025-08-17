import React, { useState } from "react";
import UserComponent from "../Usuarios/UserComponent";
import UserRolesComponent from "../Rol/UserRolesComponent";
import "./AdminPanel.css"

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("users");

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="admin-panel">
      <div className="tab-buttons">
        <button
          className={`tab-button ${activeTab === "users" ? "active" : ""}`}
          onClick={() => handleTabChange("users")}
        >
          Usuarios
        </button>
        <button
          className={`tab-button ${activeTab === "roles" ? "active" : ""}`}
          onClick={() => handleTabChange("roles")}
        >
          Roles
        </button>
      </div>

      <div className="tab-content">
        {activeTab === "users" && <UserComponent />}
        {activeTab === "roles" && <UserRolesComponent />}
      </div>
    </div>
  );
};

export default AdminPanel;
