import React, { useState, useEffect, useMemo } from 'react';
import { FacilityRequestService } from '../services/FacilityRequestService.js';
import { FacilityIssueService } from '../services/FacilityIssueService.js';
import './Dashboard.css';

export default function Dashboard() {
  const requestService = useMemo(() => new FacilityRequestService(), []);
  const issueService = useMemo(() => new FacilityIssueService(), []);
  
  const [stats, setStats] = useState({
    myRequests: 0,
    myIssues: 0,
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, [requestService, issueService]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [myRequests, myIssues] = await Promise.all([
        requestService.getMyRequests(),
        issueService.getMyIssues()
      ]);

      // Combine recent activity from both requests and issues
      const recentActivity = [
        ...myRequests.slice(0, 3).map(item => ({
          ...item,
          type: 'request',
          icon: '📝'
        })),
        ...myIssues.slice(0, 3).map(item => ({
          ...item,
          type: 'issue',
          icon: '🚨'
        }))
      ].sort((a, b) => {
        const aDate = typeof a.sys_updated_on === 'object' ? a.sys_updated_on.value : a.sys_updated_on;
        const bDate = typeof b.sys_updated_on === 'object' ? b.sys_updated_on.value : b.sys_updated_on;
        return new Date(bDate) - new Date(aDate);
      }).slice(0, 5);

      setStats({
        myRequests: myRequests.length,
        myIssues: myIssues.length,
        recentActivity
      });
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (state) => {
    const stateValue = typeof state === 'object' ? state.value : state;
    switch (stateValue) {
      case '1': return 'status-new';
      case '2': return 'status-in-progress';
      case '6': return 'status-resolved';
      case '7': return 'status-closed';
      default: return 'status-new';
    }
  };

  const getStatusText = (state) => {
    const stateValue = typeof state === 'object' ? state.display_value : state;
    return stateValue || 'New';
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>📊 Dashboard</h2>
        <p>Quick overview of your facility requests and issues</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-content">
            <h3>{stats.myRequests}</h3>
            <p>My Requests</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">🚨</div>
          <div className="stat-content">
            <h3>{stats.myIssues}</h3>
            <p>My Issues</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-content">
            <h3>{stats.myRequests + stats.myIssues}</h3>
            <p>Total Items</p>
          </div>
        </div>
      </div>

      <div className="recent-activity">
        <h3>Recent Activity</h3>
        {stats.recentActivity.length === 0 ? (
          <div className="no-activity">
            <p>No recent activity. Start by submitting a request or reporting an issue!</p>
          </div>
        ) : (
          <div className="activity-list">
            {stats.recentActivity.map((item) => {
              const sysId = typeof item.sys_id === 'object' ? item.sys_id.value : item.sys_id;
              const shortDescription = typeof item.short_description === 'object' ? 
                item.short_description.display_value : item.short_description;
              const updatedOn = typeof item.sys_updated_on === 'object' ? 
                item.sys_updated_on.display_value : item.sys_updated_on;
              const number = typeof item.number === 'object' ? 
                item.number.display_value : item.number;

              return (
                <div key={sysId} className="activity-item">
                  <div className="activity-icon">{item.icon}</div>
                  <div className="activity-content">
                    <div className="activity-title">
                      {number} - {shortDescription}
                    </div>
                    <div className="activity-meta">
                      <span className={`status-badge ${getStatusClass(item.state)}`}>
                        {getStatusText(item.state)}
                      </span>
                      <span className="activity-date">
                        Updated: {new Date(updatedOn).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="action-grid">
          <div className="action-card">
            <div className="action-icon">📝</div>
            <h4>Submit a Request</h4>
            <p>Need office supplies, equipment, or space changes? Submit a facility request.</p>
          </div>
          
          <div className="action-card">
            <div className="action-icon">🚨</div>
            <h4>Report an Issue</h4>
            <p>Found a problem? Report maintenance issues, safety hazards, or equipment failures.</p>
          </div>
          
          <div className="action-card">
            <div className="action-icon">📋</div>
            <h4>Track Progress</h4>
            <p>View your submitted requests and issues, and track their progress.</p>
          </div>
        </div>
      </div>
    </div>
  );
}