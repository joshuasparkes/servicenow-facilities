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
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚀</div>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.5rem', fontWeight: '600' }}>Issue Reported Successfully!</h3>
          <p style={{ margin: 0, fontSize: '1.1rem' }}>Your issue has been logged and will be addressed promptly.</p>
        </div>
      </div>
    );
  }

  const showTemperatureFields = formData.issue_type === 'hvac';

  return (
    <div className="form-container">
      <h2 className="form-title">🚨 Report a Facility Issue</h2>
      <p style={{ marginBottom: '2rem', color: 'var(--gray-600)', fontSize: '1.1rem' }}>
        Report maintenance issues, safety hazards, or equipment problems for quick resolution.
      </p>
      
      {error && (
        <div className="error">
          <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>⚠️</div>
          <strong>Error:</strong> {error}
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
            <option value="">🔧 Select issue type...</option>
            <option value="hvac">🌡️ HVAC (Heating/Cooling)</option>
            <option value="electrical">⚡ Electrical</option>
            <option value="plumbing">🚰 Plumbing</option>
            <option value="lighting">💡 Lighting</option>
            <option value="security">🔒 Security Systems</option>
            <option value="cleaning">🧹 Cleaning/Janitorial</option>
            <option value="equipment">🖥️ Equipment Malfunction</option>
            <option value="structural">🏗️ Structural/Building</option>
            <option value="safety">⚠️ Safety Hazard</option>
            <option value="pest_control">🐛 Pest Control</option>
            <option value="other">❓ Other</option>
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
            placeholder="Brief summary of the issue"
            required
            maxLength="160"
          />
          <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginTop: '0.25rem' }}>
            {formData.short_description.length}/160 characters
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Detailed Description *</label>
          <textarea 
            name="issue_description" 
            className="form-textarea"
            value={formData.issue_description}
            onChange={handleChange}
            placeholder="Provide detailed information about the issue, including what you observed, when it started, and any relevant context..."
            required
            minLength="20"
            style={{ minHeight: '140px' }}
          ></textarea>
          <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginTop: '0.25rem' }}>
            Minimum 20 characters ({formData.issue_description.length} entered)
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">🚨 Urgency Level *</label>
            <select 
              name="urgency_level" 
              className="form-select"
              value={formData.urgency_level}
              onChange={handleChange}
              required
            >
              <option value="">Select urgency...</option>
              <option value="low">🟢 Low - Can wait for scheduled maintenance</option>
              <option value="medium">🟡 Medium - Should be addressed within a few days</option>
              <option value="high">🟠 High - Needs attention within 24 hours</option>
              <option value="critical">🔴 Critical - Immediate attention required</option>
            </select>
          </div>
          
          <div className="form-group">
            <label className="form-label">🕒 Issue First Noticed</label>
            <input 
              type="datetime-local" 
              name="reported_date_time" 
              className="form-input"
              value={formData.reported_date_time}
              onChange={handleChange}
            />
          </div>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ 
            fontSize: '1.25rem', 
            fontWeight: '600', 
            marginBottom: '1rem', 
            color: 'var(--gray-700)',
            borderBottom: '2px solid var(--gray-200)',
            paddingBottom: '0.5rem'
          }}>
            ⚠️ Impact Assessment
          </h3>
          
          <div className="form-row">
            <div className="form-group">
              <div className={`form-checkbox-group ${formData.safety_hazard ? 'checked' : ''}`}>
                <input 
                  type="checkbox" 
                  name="safety_hazard" 
                  className="form-checkbox"
                  checked={formData.safety_hazard}
                  onChange={handleChange}
                />
                <label className="form-label" style={{ margin: 0, textTransform: 'none' }}>
                  ⚠️ This is a safety hazard
                </label>
              </div>
            </div>
            
            <div className="form-group">
              <div className={`form-checkbox-group ${formData.affects_operations ? 'checked' : ''}`}>
                <input 
                  type="checkbox" 
                  name="affects_operations" 
                  className="form-checkbox"
                  checked={formData.affects_operations}
                  onChange={handleChange}
                />
                <label className="form-label" style={{ margin: 0, textTransform: 'none' }}>
                  🏢 This affects business operations
                </label>
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ 
            fontSize: '1.25rem', 
            fontWeight: '600', 
            marginBottom: '1rem', 
            color: 'var(--gray-700)',
            borderBottom: '2px solid var(--gray-200)',
            paddingBottom: '0.5rem'
          }}>
            📍 Location Details
          </h3>
          
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">🏢 Building *</label>
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
              <label className="form-label">🏗️ Floor</label>
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
              <label className="form-label">🚪 Room Number</label>
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
              <label className="form-label">👥 People Affected</label>
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
            <label className="form-label">📌 Specific Location Details</label>
            <input 
              type="text" 
              name="specific_location_details" 
              className="form-input"
              value={formData.specific_location_details}
              onChange={handleChange}
              placeholder="More precise location (e.g., 'Near the coffee machine', 'By the east window')"
            />
          </div>
        </div>

        {showTemperatureFields && (
          <div style={{ 
            marginBottom: '2rem',
            padding: '1.5rem',
            background: 'linear-gradient(135deg, var(--primary-50), var(--primary-100))',
            borderRadius: 'var(--radius-lg)',
            border: '2px solid var(--primary-200)'
          }}>
            <h4 style={{ 
              fontSize: '1.125rem', 
              fontWeight: '600', 
              marginBottom: '1rem', 
              color: 'var(--primary-700)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              🌡️ Temperature Information
            </h4>
            
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Current Temperature (°F)</label>
                <input 
                  type="number" 
                  name="current_temperature" 
                  className="form-input"
                  value={formData.current_temperature}
                  onChange={handleChange}
                  placeholder="Current temp"
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
                  placeholder="Desired temp"
                />
              </div>
            </div>
          </div>
        )}

        <div className="form-buttons">
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? (
              <>
                <span style={{ marginRight: '0.5rem' }}>⏳</span>
                Reporting Issue...
              </>
            ) : (
              <>
                <span style={{ marginRight: '0.5rem' }}>📢</span>
                Report Issue
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}