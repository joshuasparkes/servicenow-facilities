import React, { useState, useEffect, useMemo } from 'react';
import { FacilityIssueService } from '../services/FacilityIssueService.js';

export default function MyIssues() {
  const issueService = useMemo(() => new FacilityIssueService(), []);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadIssues();
  }, [issueService]);

  const loadIssues = async () => {
    try {
      setLoading(true);
      const data = await issueService.getMyIssues();
      setIssues(data);
    } catch (err) {
      setError('Failed to load issues');
      console.error('Error loading issues:', err);
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

  const getUrgencyClass = (urgency) => {
    const urgencyValue = typeof urgency === 'object' ? urgency.value : urgency;
    switch (urgencyValue) {
      case 'critical': return 'priority-critical';
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return 'priority-medium';
    }
  };

  const getUrgencyText = (urgency) => {
    const urgencyValue = typeof urgency === 'object' ? urgency.display_value : urgency;
    return urgencyValue || 'Medium';
  };

  const getIssueTypeLabel = (type) => {
    const typeValue = typeof type === 'object' ? type.value : type;
    const labels = {
      hvac: 'HVAC',
      electrical: 'Electrical',
      plumbing: 'Plumbing',
      lighting: 'Lighting',
      security: 'Security',
      cleaning: 'Cleaning',
      equipment: 'Equipment',
      structural: 'Structural',
      safety: 'Safety Hazard',
      pest_control: 'Pest Control',
      other: 'Other'
    };
    return labels[typeValue] || typeValue;
  };

  const filteredIssues = issues.filter(issue => {
    if (filter === 'all') return true;
    const stateValue = typeof issue.state === 'object' ? issue.state.value : issue.state;
    return stateValue === filter;
  });

  const getFilterCounts = () => {
    const counts = {
      all: issues.length,
      '1': 0, // New
      '2': 0, // In Progress
      '6': 0, // Resolved
      '7': 0  // Closed
    };
    
    issues.forEach(issue => {
      const stateValue = typeof issue.state === 'object' ? issue.state.value : issue.state;
      if (counts[stateValue] !== undefined) {
        counts[stateValue]++;
      }
    });
    
    return counts;
  };

  if (loading) return <div className="loading">Loading your issues...</div>;
  if (error) return <div className="error">{error}</div>;

  const counts = getFilterCounts();

  return (
    <div className="my-issues">
      <div className="issues-header">
        <h2>🔧 My Facility Issues</h2>
        <p>Track the status of your reported facility issues</p>
      </div>

      <div className="filter-tabs">
        <button 
          className={filter === 'all' ? 'filter-tab active' : 'filter-tab'}
          onClick={() => setFilter('all')}
        >
          All ({counts.all})
        </button>
        <button 
          className={filter === '1' ? 'filter-tab active' : 'filter-tab'}
          onClick={() => setFilter('1')}
        >
          New ({counts['1']})
        </button>
        <button 
          className={filter === '2' ? 'filter-tab active' : 'filter-tab'}
          onClick={() => setFilter('2')}
        >
          In Progress ({counts['2']})
        </button>
        <button 
          className={filter === '6' ? 'filter-tab active' : 'filter-tab'}
          onClick={() => setFilter('6')}
        >
          Resolved ({counts['6']})
        </button>
        <button 
          className={filter === '7' ? 'filter-tab active' : 'filter-tab'}
          onClick={() => setFilter('7')}
        >
          Closed ({counts['7']})
        </button>
      </div>

      {filteredIssues.length === 0 ? (
        <div className="no-issues">
          <div className="no-issues-icon">🚨</div>
          <h3>No issues found</h3>
          <p>
            {filter === 'all' 
              ? "You haven't reported any facility issues yet." 
              : `No issues with ${filter === '1' ? 'New' : filter === '2' ? 'In Progress' : filter === '6' ? 'Resolved' : 'Closed'} status.`
            }
          </p>
        </div>
      ) : (
        <div className="issues-list">
          {filteredIssues.map((issue) => {
            const sysId = typeof issue.sys_id === 'object' ? issue.sys_id.value : issue.sys_id;
            const number = typeof issue.number === 'object' ? issue.number.display_value : issue.number;
            const shortDescription = typeof issue.short_description === 'object' ? 
              issue.short_description.display_value : issue.short_description;
            const issueType = typeof issue.issue_type === 'object' ? 
              issue.issue_type.display_value : issue.issue_type;
            const createdOn = typeof issue.sys_created_on === 'object' ? 
              issue.sys_created_on.display_value : issue.sys_created_on;
            const building = typeof issue.building === 'object' ? 
              issue.building.display_value : issue.building;
            const floor = typeof issue.floor === 'object' ? 
              issue.floor.display_value : issue.floor;
            const roomNumber = typeof issue.room_number === 'object' ? 
              issue.room_number.display_value : issue.room_number;
            const safetyHazard = typeof issue.safety_hazard === 'object' ? 
              issue.safety_hazard.display_value : issue.safety_hazard;
            const affectsOperations = typeof issue.affects_operations === 'object' ? 
              issue.affects_operations.display_value : issue.affects_operations;

            return (
              <div key={sysId} className="issue-card">
                <div className="issue-header">
                  <div className="issue-number">{number}</div>
                  <div className="issue-badges">
                    <span className={`status-badge ${getStatusClass(issue.state)}`}>
                      {getStatusText(issue.state)}
                    </span>
                    <span className={`status-badge ${getUrgencyClass(issue.urgency_level)}`}>
                      {getUrgencyText(issue.urgency_level)}
                    </span>
                    {(safetyHazard === 'true' || safetyHazard === true) && (
                      <span className="status-badge priority-critical">
                        ⚠️ Safety Hazard
                      </span>
                    )}
                  </div>
                </div>
                
                <h3 className="issue-title">{shortDescription}</h3>
                
                <div className="issue-details">
                  <div className="issue-detail">
                    <strong>Type:</strong> {getIssueTypeLabel(issueType)}
                  </div>
                  <div className="issue-detail">
                    <strong>Reported:</strong> {new Date(createdOn).toLocaleDateString()}
                  </div>
                  <div className="issue-detail">
                    <strong>Location:</strong> {building}
                    {floor && `, Floor ${floor}`}
                    {roomNumber && `, Room ${roomNumber}`}
                  </div>
                  {(affectsOperations === 'true' || affectsOperations === true) && (
                    <div className="issue-detail">
                      <strong>Impact:</strong> <span className="text-warning">Affects Business Operations</span>
                    </div>
                  )}
                </div>

                {issue.issue_description && (
                  <div className="issue-description">
                    <strong>Description:</strong>
                    <p>{typeof issue.issue_description === 'object' ? 
                      issue.issue_description.display_value : issue.issue_description}</p>
                  </div>
                )}

                {issue.resolution_description && (
                  <div className="issue-resolution">
                    <strong>Resolution:</strong>
                    <p>{typeof issue.resolution_description === 'object' ? 
                      issue.resolution_description.display_value : issue.resolution_description}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}