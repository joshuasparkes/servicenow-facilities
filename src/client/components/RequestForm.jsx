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
          ✅ Request submitted successfully! You will be redirected to view your requests.
        </div>
      </div>
    );
  }

  return (
    <div className="form-container">
      <h2 className="form-title">📝 Submit a Facility Request</h2>
      
      {error && (
        <div className="error">
          ❌ {error}
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
            <option value="">Select request type...</option>
            <option value="office_supplies">Office Supplies</option>
            <option value="equipment">Equipment Request</option>
            <option value="space_change">Space Change/Move</option>
            <option value="maintenance">Maintenance Request</option>
            <option value="catering">Catering/Events</option>
            <option value="it_support">IT Support</option>
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
            placeholder="Brief description of your request"
            required
            maxLength="160"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Business Justification *</label>
          <textarea 
            name="business_justification" 
            className="form-textarea"
            value={formData.business_justification}
            onChange={handleChange}
            placeholder="Explain why this request is needed and how it benefits the business"
            required
            minLength="20"
          ></textarea>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Requested By Date *</label>
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
            <label className="form-label">Business Impact</label>
            <select 
              name="business_impact" 
              className="form-select"
              value={formData.business_impact}
              onChange={handleChange}
            >
              <option value="">Select impact level...</option>
              <option value="low">Low - Minimal business impact</option>
              <option value="medium">Medium - Moderate business impact</option>
              <option value="high">High - Significant business impact</option>
              <option value="critical">Critical - Business operations at risk</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Building</label>
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

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Estimated Cost</label>
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
            <label className="form-label">Budget Code</label>
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

        <div className="form-buttons">
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit Request'}
          </button>
        </div>
      </form>
    </div>
  );
}