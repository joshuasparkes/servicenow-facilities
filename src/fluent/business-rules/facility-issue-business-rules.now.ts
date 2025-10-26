import '@servicenow/sdk/global'
import { BusinessRule } from '@servicenow/sdk/core'
import { 
    autoPrioritizeFacilityIssue, 
    autoAssignTechnician, 
    validateSafetyHazard,
    trackResolutionTime 
} from '../../server/facility-issue-scripts.js'

// Auto-prioritize facility issues based on type and urgency
export const facilityIssueAutoPriority = BusinessRule({
    $id: Now.ID['fiss_auto_priority'],
    name: 'Facility Issue Auto Priority',
    table: 'x_1809194_faciliti_facility_issue',
    when: 'before',
    action: ['insert'],
    script: autoPrioritizeFacilityIssue,
    order: 50,
    active: true,
    description: 'Automatically sets priority based on issue type, urgency level, and safety hazard status'
})

// Auto-assign technicians based on issue type
export const facilityIssueAutoAssign = BusinessRule({
    $id: Now.ID['fiss_auto_assign'],
    name: 'Facility Issue Auto Assignment',
    table: 'x_1809194_faciliti_facility_issue',
    when: 'before',
    action: ['insert'],
    script: autoAssignTechnician,
    order: 100,
    active: true,
    description: 'Automatically assigns issues to appropriate technician teams based on issue type'
})

// Validate safety hazard reporting
export const facilityIssueSafetyValidation = BusinessRule({
    $id: Now.ID['fiss_safety_validation'],
    name: 'Facility Issue Safety Validation',
    table: 'x_1809194_faciliti_facility_issue',
    when: 'before',
    action: ['insert', 'update'],
    script: validateSafetyHazard,
    order: 25,
    active: true,
    description: 'Validates safety hazard reporting and ensures critical urgency and detailed description'
})

// Track resolution time and set follow-up requirements
export const facilityIssueResolutionTracking = BusinessRule({
    $id: Now.ID['fiss_resolution_tracking'],
    name: 'Facility Issue Resolution Tracking',
    table: 'x_1809194_faciliti_facility_issue',
    when: 'after',
    action: ['update'],
    script: trackResolutionTime,
    order: 200,
    active: true,
    description: 'Tracks resolution time and sets follow-up requirements for specific issue types'
})