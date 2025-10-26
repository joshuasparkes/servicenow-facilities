import React, { useState, useEffect } from "react";
import RequestForm from "./components/RequestForm.jsx";
import IssueForm from "./components/IssueForm.jsx";
import Dashboard from "./components/Dashboard.jsx";
import MyRequests from "./components/MyRequests.jsx";
import MyIssues from "./components/MyIssues.jsx";
import { PortalUtils } from "./services/PortalUtils.js";
import "./app.css";

export default function App() {
  const [currentView, setCurrentView] = useState("dashboard");
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Wait a bit for ServiceNow globals to be available
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Try to get current user info
      const userInfo = await PortalUtils.getCurrentUserInfo();
      setUser(userInfo);

      console.log("Portal initialized with user:", userInfo);
      console.log("Available globals:", {
        g_user: window.g_user,
        NOW: window.NOW,
        g_ck: window.g_ck,
      });
    } catch (error) {
      console.error("Error initializing app:", error);
    } finally {
      setAuthReady(true);
    }
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case "request":
        return <RequestForm onSuccess={() => setCurrentView("my-requests")} />;
      case "issue":
        return <IssueForm onSuccess={() => setCurrentView("my-issues")} />;
      case "my-requests":
        return <MyRequests />;
      case "my-issues":
        return <MyIssues />;
      case "dashboard":
      default:
        return <Dashboard />;
    }
  };

  if (!authReady) {
    return (
      <div className="facility-portal">
        <div className="loading">
          <div>🏢 Initializing Facilities Portal...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="facility-portal">
      <header className="portal-header apple-navbar">
        <div className="navbar-content">
          <span className="apple-logo"></span>
          <h1 className="navbar-title">Facilities Services</h1>
          {user && (
            <span className="welcome-text">
              Welcome, {user.first_name} {user.last_name}
            </span>
          )}
          {!user && (
            <span className="welcome-text">Welcome to Facilities</span>
          )}
        </div>
      </header>

      <nav className="apple-tabs">
        <button
          className={
            currentView === "dashboard" ? "nav-button active" : "nav-button"
          }
          onClick={() => handleViewChange("dashboard")}
        >
          📊 Dashboard
        </button>
        <button
          className={
            currentView === "request" ? "nav-button active" : "nav-button"
          }
          onClick={() => handleViewChange("request")}
        >
          📝 Submit Request
        </button>
        <button
          className={
            currentView === "issue" ? "nav-button active" : "nav-button"
          }
          onClick={() => handleViewChange("issue")}
        >
          🚨 Report Issue
        </button>
        <button
          className={
            currentView === "my-requests" ? "nav-button active" : "nav-button"
          }
          onClick={() => handleViewChange("my-requests")}
        >
          📋 My Requests
        </button>
        <button
          className={
            currentView === "my-issues" ? "nav-button active" : "nav-button"
          }
          onClick={() => handleViewChange("my-issues")}
        >
          🔧 My Issues
        </button>
      </nav>

      <main className="portal-content">{renderCurrentView()}</main>
    </div>
  );
}
