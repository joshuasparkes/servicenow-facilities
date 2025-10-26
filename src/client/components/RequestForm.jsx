import React, { useState } from 'react';
import { FacilityRequestService } from '../services/FacilityRequestService.js';

export default function RequestForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    request_type: '',
    short_description: '',
    business_justification: '',
    requested_by_date: '',
    building: '',
    floor: '',
    room_number: '',
    estimated_cost: '',
    budget_code: '',
    business_impact: ''
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const requestService = new FacilityRequestService();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await requestService.createRequest(formData);
      setSuccess(true);
      setFormData({
        request_type: '',
        short_description: '',
        business_justification: '',
        requested_by_date: '',
        building: '',
        floor: '',
        room_number: '',
        estimated_cost: '',
        budget_code: '',
        business_impact: ''
      });
      
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 2000);
      
    } catch (err) {
      setError(err.message || 'Failed to submit request');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="form-container">
        <div className="success">
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.5rem', fontWeight: '600' }}>Request Submitted Successfully!</h3>
          <p style={{ margin: 0, fontSize: '1.1rem' }}>You'll be redirected to view your requests shortly.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="form-container">
      <h2 className="form-title">📝 Submit a Facility Request</h2>
      <p style={{ marginBottom: '2rem', color: 'var(--gray-600)', fontSize: '1.1rem' }}>
        Request office supplies, equipment, maintenance, or other facility services.
      </p>
      
      {error && (
        <div className="error">
          <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>⚠️</div>
          <strong>Error:</strong> {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Request Type *</label>
          <select 
            name="request_type" 
            className="form-select" 
            value={formData.request_type}
            onChange={handleChange}
            required
          >
            <option value="">📋 Select request type...</option>
            <option value="office_supplies">📝 Office Supplies</option>
            <option value="equipment">💻 Equipment Request</option>
            <option value="space_change">🏢 Space Change/Move</option>
            <option value="maintenance">🔧 Maintenance Request</option>
            <option value="catering">🍽️ Catering/Events</option>
            <option value="it_support">💾 IT Support</option>
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
            placeholder="Brief summary of your request"
            required
            maxLength="160"
          />
          <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginTop: '0.25rem' }}>
            {formData.short_description.length}/160 characters
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Business Justification *</label>
          <textarea 
            name="business_justification" 
            className="form-textarea"
            value={formData.business_justification}
            onChange={handleChange}
            placeholder="Explain why this request is needed and how it benefits the business..."
            required
            minLength="20"
            style={{ minHeight: '120px' }}
          ></textarea>
          <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginTop: '0.25rem' }}>
            Minimum 20 characters ({formData.business_justification.length} entered)
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">📅 Requested By Date *</label>
            <input 
              type="date" 
              name="requested_by_date" 
              className="form-input"
              value={formData.requested_by_date}
              onChange={handleChange}
              required
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">📊 Business Impact</label>
            <select 
              name="business_impact" 
              className="form-select"
              value={formData.business_impact}
              onChange={handleChange}
            >
              <option value="">Select impact level...</option>
              <option value="low">🟢 Low - Minimal business impact</option>
              <option value="medium">🟡 Medium - Moderate business impact</option>
              <option value="high">🟠 High - Significant business impact</option>
              <option value="critical">🔴 Critical - Business operations at risk</option>
            </select>
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
              <label className="form-label">🏢 Building</label>
              <input 
                type="text" 
                name="building" 
                className="form-input"
                value={formData.building}
                onChange={handleChange}
                placeholder="Building name or number"
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
            💰 Budget Information
          </h3>
          
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">💵 Estimated Cost</label>
              <input 
                type="number" 
                name="estimated_cost" 
                className="form-input"
                value={formData.estimated_cost}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                min="0"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">🏷️ Budget Code</label>
              <input 
                type="text" 
                name="budget_code" 
                className="form-input"
                value={formData.budget_code}
                onChange={handleChange}
                placeholder="Budget or cost center code"
              />
            </div>
          </div>
        </div>

        <div className="form-buttons">
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? (
              <>
                <span style={{ marginRight: '0.5rem' }}>⏳</span>
                Submitting...
              </>
            ) : (
              <>
                <span style={{ marginRight: '0.5rem' }}>📨</span>
                Submit Request
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}