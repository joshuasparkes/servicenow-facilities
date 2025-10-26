// Utility functions for ServiceNow portal authentication and user access
export class PortalUtils {
  static getCurrentUserId() {
    // Try multiple ways to get the current user ID in ServiceNow portals
    if (window.g_user && window.g_user.userID) {
      return window.g_user.userID;
    }
    if (window.NOW && window.NOW.user && window.NOW.user.userID) {
      return window.NOW.user.userID;
    }
    if (window.g_user && window.g_user.sys_id) {
      return window.g_user.sys_id;
    }
    // Fallback - try to get from DOM or other sources
    const userInput = document.querySelector('input[name="sysparm_user"]');
    if (userInput) {
      return userInput.value;
    }
    return null;
  }

  static getAuthToken() {
    // Try multiple tokens that might be available
    if (window.g_ck) {
      return window.g_ck;
    }
    if (window.NOW && window.NOW.security_token) {
      return window.NOW.security_token;
    }
    // Try to get CSRF token from meta tag
    const csrfToken = document.querySelector('meta[name="csrf-token"]');
    if (csrfToken) {
      return csrfToken.getAttribute('content');
    }
    return '';
  }

  static async getCurrentUserInfo() {
    try {
      const response = await fetch('/api/now/table/sys_user?sysparm_query=user_name=' + (window.g_user?.userName || 'admin') + '&sysparm_limit=1', {
        headers: {
          'Accept': 'application/json',
          'X-UserToken': this.getAuthToken()
        }
      });

      if (response.ok) {
        const data = await response.json();
        return data.result?.[0] || null;
      }
    } catch (error) {
      console.error('Error fetching current user info:', error);
    }
    return null;
  }

  static createApiHeaders() {
    return {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-UserToken': this.getAuthToken(),
      'X-Requested-With': 'XMLHttpRequest'
    };
  }
}