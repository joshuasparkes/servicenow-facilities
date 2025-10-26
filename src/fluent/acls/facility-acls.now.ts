import '@servicenow/sdk/global'
import { Acl } from '@servicenow/sdk/core'
import { facility_user, facility_technician, facility_manager } from '../roles/facility-roles.now.js'

// Facility Request Table ACLs
export const facility_request_read = Acl({
    $id: Now.ID['facility_request_read'],
    type: 'record',
    table: 'x_1809194_faciliti_facility_request',
    operation: 'read',
    roles: [facility_user],
    description: 'Allow facility users to read facility requests'
})

export const facility_request_create = Acl({
    $id: Now.ID['facility_request_create'],
    type: 'record',
    table: 'x_1809194_faciliti_facility_request',
    operation: 'create',
    roles: [facility_user],
    description: 'Allow facility users to create facility requests'
})

export const facility_request_write = Acl({
    $id: Now.ID['facility_request_write'],
    type: 'record',
    table: 'x_1809194_faciliti_facility_request',
    operation: 'write',
    roles: [facility_manager],
    condition: 'gs.hasRole("x_1809194_faciliti.facility_manager") || current.caller_id == gs.getUserID()',
    description: 'Allow facility managers to update all requests, or requesters to update their own'
})

export const facility_request_delete = Acl({
    $id: Now.ID['facility_request_delete'],
    type: 'record',
    table: 'x_1809194_faciliti_facility_request',
    operation: 'delete',
    roles: [facility_manager],
    description: 'Only facility managers can delete facility requests'
})

// Facility Issue Table ACLs
export const facility_issue_read = Acl({
    $id: Now.ID['facility_issue_read'],
    type: 'record',
    table: 'x_1809194_faciliti_facility_issue',
    operation: 'read',
    roles: [facility_user],
    description: 'Allow facility users to read facility issues'
})

export const facility_issue_create = Acl({
    $id: Now.ID['facility_issue_create'],
    type: 'record',
    table: 'x_1809194_faciliti_facility_issue',
    operation: 'create',
    roles: [facility_user],
    description: 'Allow facility users to create facility issues'
})

export const facility_issue_write = Acl({
    $id: Now.ID['facility_issue_write'],
    type: 'record',
    table: 'x_1809194_faciliti_facility_issue',
    operation: 'write',
    roles: [facility_technician],
    condition: 'gs.hasRole("x_1809194_faciliti.facility_manager") || gs.hasRole("x_1809194_faciliti.facility_technician") || current.caller_id == gs.getUserID()',
    description: 'Allow facility technicians and managers to update issues, or reporters to update their own'
})

export const facility_issue_delete = Acl({
    $id: Now.ID['facility_issue_delete'],
    type: 'record',
    table: 'x_1809194_faciliti_facility_issue',
    operation: 'delete',
    roles: [facility_manager],
    description: 'Only facility managers can delete facility issues'
})