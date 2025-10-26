import React, { useState } from 'react';
import { FacilityIssueService } from '../services/FacilityIssueService.js';

export default function IssueForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    issue_type: '',
    short_description: '',
    issue_description: '',
    urgency_level: '',
    building: '',
    floor: '',
    room_number: '',
    specific_location_details: '',
    safety_hazard: false,
    affects_operations: false,
    reported_date_time: new Date().toISOString().slice(0, 16),
    number_of_people_affected: '',
    current_temperature: '',
    desired_temperature: ''
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const issueService = new FacilityIssueService();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await issueService.createIssue(formData);
      setSuccess(true);
      
      // Reset form
      setFormData({
        issue_type: '',
        short_description: '',
        issue_description: '',
        urgency_level: '',
        building: '',
        floor: '',
        room_number: '',
        specific_location_details: '',
        safety_hazard: false,
        affects_operations: false,
        reported_date_time: new Date().toISOString().slice(0, 16),
        number_of_people_affected: '',
        current_temperature: '',
        desired_temperature: ''
      });
      
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 2000);
      
    } catch (err) {
      setError(err.message || 'Failed to submit issue');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="form-container">
        <div className="success">
          ✅ Issue reported successfully! You will be redirected to view your issues.
        </div>
      </div>
    );
  }

  const showTemperatureFields = formData.issue_type === 'hvac';

  return (
    <div className="form-container">
      <h2 className="form-title">🚨 Report a Facility Issue</h2>
      
      {error && (
        <div className="error">
          ❌ {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Issue Type *</label>
          <select 
            name="issue_type" 
            className="form-select" 
            value={formData.issue_type}
            onChange={handleChange}
            required
          >
            <option value="">Select issue type...</option>
            <option value="hvac">HVAC (Heating/Cooling)</option>
            <option value="electrical">Electrical</option>
            <option value="plumbing">Plumbing</option>
            <option value="lighting">Lighting</option>
            <option value="security">Security Systems</option>
            <option value="cleaning">Cleaning/Janitorial</option>
            <option value="equipment">Equipment Malfunction</option>
            <option value="structural">Structural/Building</option>
            <option value="safety">Safety Hazard</option>
            <option value="pest_control">Pest Control</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Short Description *</label>
          <input 
            type="text" 
            name="short_description" 
            className="form-input"
            value={formData.short_description}
            onChange={handleChange}
            placeholder="Brief description of the issue"
            required
            maxLength="160"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Detailed Description *</label>
          <textarea 
            name="issue_description" 
            className="form-textarea"
            value={formData.issue_description}
            onChange={handleChange}
            placeholder="Provide detailed information about the issue, including what you observed, when it started, and any relevant context"
            required
            minLength="20"
            style={{ minHeight: '120px' }}
          ></textarea>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Urgency Level *</label>
            <select 
              name="urgency_level" 
              className="form-select"
              value={formData.urgency_level}
              onChange={handleChange}
              required
            >
              <option value="">Select urgency...</option>
              <option value="low">Low - Can wait for scheduled maintenance</option>
              <option value="medium">Medium - Should be addressed within a few days</option>
              <option value="high">High - Needs attention within 24 hours</option>
              <option value="critical">Critical - Immediate attention required</option>
            </select>
          </div>
          
          <div className="form-group">
            <label className="form-label">Issue First Noticed</label>
            <input 
              type="datetime-local" 
              name="reported_date_time" 
              className="form-input"
              value={formData.reported_date_time}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <div className="form-checkbox-group">
              <input 
                type="checkbox" 
                name="safety_hazard" 
                className="form-checkbox"
                checked={formData.safety_hazard}
                onChange={handleChange}
              />
              <label className="form-label">This is a safety hazard</label>
            </div>
          </div>
          
          <div className="form-group">
            <div className="form-checkbox-group">
              <input 
                type="checkbox" 
                name="affects_operations" 
                className="form-checkbox"
                checked={formData.affects_operations}
                onChange={handleChange}
              />
              <label className="form-label">This affects business operations</label>
            </div>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Building *</label>
            <input 
              type="text" 
              name="building" 
              className="form-input"
              value={formData.building}
              onChange={handleChange}
              placeholder="Building name or number"
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Floor</label>
            <input 
              type="text" 
              name="floor" 
              className="form-input"
              value={formData.floor}
              onChange={handleChange}
              placeholder="Floor number or name"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Room Number</label>
            <input 
              type="text" 
              name="room_number" 
              className="form-input"
              value={formData.room_number}
              onChange={handleChange}
              placeholder="Room number or area"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Number of People Affected</label>
            <input 
              type="number" 
              name="number_of_people_affected" 
              className="form-input"
              value={formData.number_of_people_affected}
              onChange={handleChange}
              placeholder="0"
              min="0"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Specific Location Details</label>
          <input 
            type="text" 
            name="specific_location_details" 
            className="form-input"
            value={formData.specific_location_details}
            onChange={handleChange}
            placeholder="More precise location information (e.g., 'Near the coffee machine', 'By the east window')"
          />
        </div>

        {showTemperatureFields && (
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Current Temperature (°F)</label>
              <input 
                type="number" 
                name="current_temperature" 
                className="form-input"
                value={formData.current_temperature}
                onChange={handleChange}
                placeholder="Temperature"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Desired Temperature (°F)</label>
              <input 
                type="number" 
                name="desired_temperature" 
                className="form-input"
                value={formData.desired_temperature}
                onChange={handleChange}
                placeholder="Desired temperature"
              />
            </div>
          </div>
        )}

        <div className="form-buttons">
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Report Issue'}
          </button>
        </div>
      </form>
    </div>
  );
}