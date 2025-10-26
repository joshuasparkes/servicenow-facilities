import { PortalUtils } from './PortalUtils.js';

// Service for managing facility requests
export class FacilityRequestService {
  constructor() {
    this.tableName = "x_1809194_faciliti_facility_request";
  }

  async getMyRequests() {
    try {
      const userId = PortalUtils.getCurrentUserId();
      if (!userId) {
        console.warn('No user ID found, fetching all requests');
        return this.getAllRequests();
      }

      const response = await fetch(`/api/now/table/${this.tableName}?sysparm_query=caller_id=${userId}&sysparm_display_value=all&sysparm_limit=100&sysparm_order_by=sys_created_on`, {
        method: "GET",
        headers: PortalUtils.createApiHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.result || [];
    } catch (error) {
      console.error('Error fetching requests:', error);
      throw error;
    }
  }

  async getAllRequests(filters = {}) {
    try {
      const searchParams = new URLSearchParams(filters);
      searchParams.set('sysparm_display_value', 'all');
      searchParams.set('sysparm_limit', '100');
      searchParams.set('sysparm_order_by', 'sys_created_on');
      
      const response = await fetch(`/api/now/table/${this.tableName}?${searchParams.toString()}`, {
        method: "GET",
        headers: PortalUtils.createApiHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.result || [];
    } catch (error) {
      console.error('Error fetching all requests:', error);
      throw error;
    }
  }

  async createRequest(requestData) {
    try {
      const userId = PortalUtils.getCurrentUserId();
      
      // Ensure caller_id is set
      const dataToSubmit = {
        ...requestData,
        caller_id: userId || requestData.caller_id
      };

      const response = await fetch(`/api/now/table/${this.tableName}`, {
        method: "POST",
        headers: PortalUtils.createApiHeaders(),
        body: JSON.stringify(dataToSubmit),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating request:', error);
      throw error;
    }
  }

  async updateRequest(sysId, updates) {
    try {
      const response = await fetch(`/api/now/table/${this.tableName}/${sysId}`, {
        method: "PATCH",
        headers: PortalUtils.createApiHeaders(),
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating request:', error);
      throw error;
    }
  }

  async getRequestById(sysId) {
    try {
      const response = await fetch(`/api/now/table/${this.tableName}/${sysId}?sysparm_display_value=all`, {
        method: "GET",
        headers: PortalUtils.createApiHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error('Error fetching request:', error);
      throw error;
    }
  }
}