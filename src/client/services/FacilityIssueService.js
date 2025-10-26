import { PortalUtils } from './PortalUtils.js';

// Service for managing facility issues
export class FacilityIssueService {
  constructor() {
    this.tableName = "x_1809194_faciliti_facility_issue";
  }

  async getMyIssues() {
    try {
      const userId = PortalUtils.getCurrentUserId();
      if (!userId) {
        console.warn('No user ID found, fetching all issues');
        return this.getAllIssues();
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
      console.error('Error fetching issues:', error);
      throw error;
    }
  }

  async getAllIssues(filters = {}) {
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
      console.error('Error fetching all issues:', error);
      throw error;
    }
  }

  async createIssue(issueData) {
    try {
      const userId = PortalUtils.getCurrentUserId();
      
      // Ensure caller_id is set
      const dataToSubmit = {
        ...issueData,
        caller_id: userId || issueData.caller_id
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
      console.error('Error creating issue:', error);
      throw error;
    }
  }

  async updateIssue(sysId, updates) {
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
      console.error('Error updating issue:', error);
      throw error;
    }
  }

  async getIssueById(sysId) {
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
      console.error('Error fetching issue:', error);
      throw error;
    }
  }
}