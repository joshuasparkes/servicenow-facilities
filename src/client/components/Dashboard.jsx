import React, { useState, useEffect, useMemo } from "react";
import { FacilityRequestService } from "../services/FacilityRequestService.js";
import { FacilityIssueService } from "../services/FacilityIssueService.js";
import { PortalUtils } from "../services/PortalUtils.js";
import "./Dashboard.css";

export default function Dashboard() {
  const requestService = useMemo(() => new FacilityRequestService(), []);
  const issueService = useMemo(() => new FacilityIssueService(), []);

  const [stats, setStats] = useState({
    myRequests: 0,
    myIssues: 0,
    recentActivity: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState("");

  useEffect(() => {
    loadDashboardData();
  }, [requestService, issueService]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setDebugInfo("Starting to load dashboard data...");

      const testResponse = await fetch(
        "/api/now/table/sys_user?sysparm_limit=1",
        {
          headers: PortalUtils.createApiHeaders(),
        },
      );

      setDebugInfo(`Test API call status: ${testResponse.status}`);

      if (!testResponse.ok) {
        throw new Error(`API connectivity test failed: ${testResponse.status}`);
      }

      const userId = PortalUtils.getCurrentUserId();
      setDebugInfo(`User ID: ${userId}, attempting to load data...`);

      const [myRequests, myIssues] = await Promise.all([
        requestService.getMyRequests().catch((err) => {
          console.warn("Failed to load requests:", err);
          return [];
        }),
        issueService.getMyIssues().catch((err) => {
          console.warn("Failed to load issues:", err);
          return [];
        }),
      ]);

      setDebugInfo(
        `Loaded ${myRequests.length} requests and ${myIssues.length} issues`,
      );

      const recentActivity = [
        ...myRequests.slice(0, 3).map((item) => ({
          ...item,
          type: "request",
          icon: "📝",
          iconBg: "blue",
        })),
        ...myIssues.slice(0, 3).map((item) => ({
          ...item,
          type: "issue",
          icon: "🚨",
          iconBg: "red",
        })),
      ]
        .sort((a, b) => {
          const aDate =
            typeof a.sys_updated_on === "object"
              ? a.sys_updated_on.value
              : a.sys_updated_on;
          const bDate =
            typeof b.sys_updated_on === "object"
              ? b.sys_updated_on.value
              : b.sys_updated_on;
          return new Date(bDate) - new Date(aDate);
        })
        .slice(0, 5);

      setStats({
        myRequests: myRequests.length,
        myIssues: myIssues.length,
        recentActivity,
      });

      setError(null);
    } catch (err) {
      const errorMsg = `Failed to load dashboard data: ${err.message}`;
      setError(errorMsg);
      setDebugInfo(`Error: ${errorMsg}`);
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (state) => {
    const stateValue = typeof state === "object" ? state.value : state;
    switch (stateValue) {
      case "1":
        return "status-new";
      case "2":
        return "status-in-progress";
      case "6":
        return "status-resolved";
      case "7":
        return "status-closed";
      default:
        return "status-new";
    }
  };

  const getStatusText = (state) => {
    const stateValue = typeof state === "object" ? state.display_value : state;
    return stateValue || "New";
  };

  if (loading) {
    return (
      <div className="loading-tahoe">
        <div className="loading-spinner"></div>
        <div className="loading-text">Loading your workspace...</div>
        {debugInfo && <div className="debug-info">{debugInfo}</div>}
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-tahoe">
        <div className="error-icon">⚠️</div>
        <div className="error-message">{error}</div>
        <div className="debug-info">Debug Info: {debugInfo}</div>
        <div className="debug-info">
          User ID: {PortalUtils.getCurrentUserId() || "Not available"}
          <br />
          Auth Token:{" "}
          {PortalUtils.getAuthToken() ? "Available" : "Not available"}
        </div>
        <button className="retry-button" onClick={loadDashboardData}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard-tahoe">
      {/* Hero Header */}
      <div className="dashboard-hero">
        <div className="hero-content">
          <h1 className="hero-title">Facility Portal</h1>
          <p className="hero-subtitle">
            Manage your workspace requests and issues
          </p>
        </div>
        <div className="hero-decoration"></div>
      </div>

      {/* Stats Cards */}
      <div className="stats-container">
        <div className="stat-card-tahoe stat-blue">
          <div className="stat-icon-wrapper">
            <div className="stat-icon">📝</div>
          </div>
          <div className="stat-info">
            <div className="stat-value">{stats.myRequests}</div>
            <div className="stat-label">My Requests</div>
          </div>
          <div className="stat-glow stat-glow-blue"></div>
        </div>

        <div className="stat-card-tahoe stat-red">
          <div className="stat-icon-wrapper">
            <div className="stat-icon">🚨</div>
          </div>
          <div className="stat-info">
            <div className="stat-value">{stats.myIssues}</div>
            <div className="stat-label">My Issues</div>
          </div>
          <div className="stat-glow stat-glow-red"></div>
        </div>

        <div className="stat-card-tahoe stat-green">
          <div className="stat-icon-wrapper">
            <div className="stat-icon">✓</div>
          </div>
          <div className="stat-info">
            <div className="stat-value">
              {stats.myRequests + stats.myIssues}
            </div>
            <div className="stat-label">Total Active</div>
          </div>
          <div className="stat-glow stat-glow-green"></div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="activity-panel">
        <div className="panel-header">
          <h2 className="panel-title">Recent Activity</h2>
          <div className="panel-badge">{stats.recentActivity.length}</div>
        </div>

        {stats.recentActivity.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3 className="empty-title">No Activity Yet</h3>
            <p className="empty-message">
              Start by submitting a request or reporting an issue
            </p>
          </div>
        ) : (
          <div className="activity-grid">
            {stats.recentActivity.map((item) => {
              const sysId =
                typeof item.sys_id === "object"
                  ? item.sys_id.value
                  : item.sys_id;
              const shortDescription =
                typeof item.short_description === "object"
                  ? item.short_description.display_value
                  : item.short_description;
              const updatedOn =
                typeof item.sys_updated_on === "object"
                  ? item.sys_updated_on.display_value
                  : item.sys_updated_on;
              const number =
                typeof item.number === "object"
                  ? item.number.display_value
                  : item.number;

              return (
                <div key={sysId} className={`activity-card ${item.iconBg}`}>
                  <div className="activity-card-icon">{item.icon}</div>
                  <div className="activity-card-content">
                    <div className="activity-number">{number}</div>
                    <div className="activity-description">
                      {shortDescription}
                    </div>
                    <div className="activity-footer">
                      <span
                        className={`status-pill ${getStatusClass(item.state)}`}
                      >
                        {getStatusText(item.state)}
                      </span>
                      <span className="activity-time">
                        {new Date(updatedOn).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="actions-panel">
        <div className="panel-header">
          <h2 className="panel-title">Quick Actions</h2>
        </div>

        <div className="actions-grid">
          <div className="action-tile action-blue">
            <div className="action-icon-bg">
              <div className="action-icon">📝</div>
            </div>
            <div className="action-content">
              <h3 className="action-title">New Request</h3>
              <p className="action-description">Submit facility request</p>
            </div>
          </div>

          <div className="action-tile action-red">
            <div className="action-icon-bg">
              <div className="action-icon">🚨</div>
            </div>
            <div className="action-content">
              <h3 className="action-title">Report Issue</h3>
              <p className="action-description">Flag maintenance problem</p>
            </div>
          </div>

          <div className="action-tile action-purple">
            <div className="action-icon-bg">
              <div className="action-icon">📊</div>
            </div>
            <div className="action-content">
              <h3 className="action-title">View All</h3>
              <p className="action-description">See complete history</p>
            </div>
          </div>

          <div className="action-tile action-orange">
            <div className="action-icon-bg">
              <div className="action-icon">⚙️</div>
            </div>
            <div className="action-content">
              <h3 className="action-title">Settings</h3>
              <p className="action-description">Manage preferences</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
