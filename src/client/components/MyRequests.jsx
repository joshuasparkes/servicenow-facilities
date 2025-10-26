import React, { useState, useEffect, useMemo } from 'react';
import { FacilityRequestService } from '../services/FacilityRequestService.js';

export default function MyRequests() {
  const requestService = useMemo(() => new FacilityRequestService(), []);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadRequests();
  }, [requestService]);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const data = await requestService.getMyRequests();
      setRequests(data);
    } catch (err) {
      setError('Failed to load requests');
      console.error('Error loading requests:', err);
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

  const getPriorityClass = (priority) => {
    const priorityValue = typeof priority === 'object' ? priority.value : priority;
    switch (priorityValue) {
      case '1': return 'priority-critical';
      case '2': return 'priority-high';
      case '3': return 'priority-medium';
      case '4': return 'priority-low';
      default: return 'priority-medium';
    }
  };

  const getPriorityText = (priority) => {
    const priorityValue = typeof priority === 'object' ? priority.display_value : priority;
    return priorityValue || 'Medium';
  };

  const getRequestTypeLabel = (type) => {
    const typeValue = typeof type === 'object' ? type.value : type;
    const labels = {
      office_supplies: 'Office Supplies',
      equipment: 'Equipment',
      space_change: 'Space Change',
      maintenance: 'Maintenance',
      catering: 'Catering',
      it_support: 'IT Support',
      other: 'Other'
    };
    return labels[typeValue] || typeValue;
  };

  const filteredRequests = requests.filter(request => {
    if (filter === 'all') return true;
    const stateValue = typeof request.state === 'object' ? request.state.value : request.state;
    return stateValue === filter;
  });

  const getFilterCounts = () => {
    const counts = {
      all: requests.length,
      '1': 0, // New
      '2': 0, // In Progress
      '6': 0, // Resolved
      '7': 0  // Closed
    };
    
    requests.forEach(request => {
      const stateValue = typeof request.state === 'object' ? request.state.value : request.state;
      if (counts[stateValue] !== undefined) {
        counts[stateValue]++;
      }
    });
    
    return counts;
  };

  if (loading) return <div className="loading">Loading your requests...</div>;
  if (error) return <div className="error">{error}</div>;

  const counts = getFilterCounts();

  return (
    <div className="my-requests">
      <div className="requests-header">
        <h2>📋 My Facility Requests</h2>
        <p>Track the status of your submitted facility requests</p>
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

      {filteredRequests.length === 0 ? (
        <div className="no-requests">
          <div className="no-requests-icon">📝</div>
          <h3>No requests found</h3>
          <p>
            {filter === 'all' 
              ? "You haven't submitted any facility requests yet." 
              : `No requests with ${filter === '1' ? 'New' : filter === '2' ? 'In Progress' : filter === '6' ? 'Resolved' : 'Closed'} status.`
            }
          </p>
        </div>
      ) : (
        <div className="requests-list">
          {filteredRequests.map((request) => {
            const sysId = typeof request.sys_id === 'object' ? request.sys_id.value : request.sys_id;
            const number = typeof request.number === 'object' ? request.number.display_value : request.number;
            const shortDescription = typeof request.short_description === 'object' ? 
              request.short_description.display_value : request.short_description;
            const requestType = typeof request.request_type === 'object' ? 
              request.request_type.display_value : request.request_type;
            const createdOn = typeof request.sys_created_on === 'object' ? 
              request.sys_created_on.display_value : request.sys_created_on;
            const requestedByDate = typeof request.requested_by_date === 'object' ? 
              request.requested_by_date.display_value : request.requested_by_date;
            const businessImpact = typeof request.business_impact === 'object' ? 
              request.business_impact.display_value : request.business_impact;
            const estimatedCost = typeof request.estimated_cost === 'object' ? 
              request.estimated_cost.display_value : request.estimated_cost;

            return (
              <div key={sysId} className="request-card">
                <div className="request-header">
                  <div className="request-number">{number}</div>
                  <div className="request-badges">
                    <span className={`status-badge ${getStatusClass(request.state)}`}>
                      {getStatusText(request.state)}
                    </span>
                    <span className={`status-badge ${getPriorityClass(request.priority)}`}>
                      {getPriorityText(request.priority)}
                    </span>
                  </div>
                </div>
                
                <h3 className="request-title">{shortDescription}</h3>
                
                <div className="request-details">
                  <div className="request-detail">
                    <strong>Type:</strong> {getRequestTypeLabel(requestType)}
                  </div>
                  <div className="request-detail">
                    <strong>Submitted:</strong> {new Date(createdOn).toLocaleDateString()}
                  </div>
                  {requestedByDate && (
                    <div className="request-detail">
                      <strong>Requested By:</strong> {new Date(requestedByDate).toLocaleDateString()}
                    </div>
                  )}
                  {businessImpact && (
                    <div className="request-detail">
                      <strong>Business Impact:</strong> {businessImpact}
                    </div>
                  )}
                  {estimatedCost && (
                    <div className="request-detail">
                      <strong>Estimated Cost:</strong> ${estimatedCost}
                    </div>
                  )}
                </div>

                {request.business_justification && (
                  <div className="request-justification">
                    <strong>Business Justification:</strong>
                    <p>{typeof request.business_justification === 'object' ? 
                      request.business_justification.display_value : request.business_justification}</p>
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