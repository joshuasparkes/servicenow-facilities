import '@servicenow/sdk/global'
import { BusinessRule } from '@servicenow/sdk/core'
import { 
    autoAssignFacilityRequest, 
    validateHighCostRequest, 
    setApprovalStatus,
    notifyRequestApproval 
} from '../../server/facility-request-scripts.js'

// Auto-assign facility requests based on request type
export const facilityRequestAutoAssign = BusinessRule({
    $id: Now.ID['freq_auto_assign'],
    name: 'Facility Request Auto Assignment',
    table: 'x_1809194_faciliti_facility_request',
    when: 'before',
    action: ['insert'],
    script: autoAssignFacilityRequest,
    order: 100,
    active: true,
    description: 'Automatically assigns facility requests to appropriate teams based on request type'
})

// Validate business justification for high-cost requests
export const facilityRequestCostValidation = BusinessRule({
    $id: Now.ID['freq_cost_validation'],
    name: 'Facility Request Cost Validation',
    table: 'x_1809194_faciliti_facility_request',
    when: 'before',
    action: ['insert', 'update'],
    script: validateHighCostRequest,
    order: 50,
    active: true,
    description: 'Validates that high-cost requests have adequate business justification'
})

// Set approval status for requests requiring approval
export const facilityRequestApprovalStatus = BusinessRule({
    $id: Now.ID['freq_approval_status'],
    name: 'Facility Request Approval Status',
    table: 'x_1809194_faciliti_facility_request',
    when: 'before',
    action: ['insert', 'update'],
    script: setApprovalStatus,
    order: 75,
    active: true,
    description: 'Sets approval status based on cost and business impact'
})

// Handle approval notifications
export const facilityRequestApprovalNotification = BusinessRule({
    $id: Now.ID['freq_approval_notification'],
    name: 'Facility Request Approval Notification',
    table: 'x_1809194_faciliti_facility_request',
    when: 'before',
    action: ['update'],
    script: notifyRequestApproval,
    order: 200,
    active: true,
    description: 'Sends notifications and updates fields when request is approved'
})