import '@servicenow/sdk/global'
import { Role } from '@servicenow/sdk/core'

// Base role for any user who can submit facility requests and issues
export const facility_user = Role({
    name: 'x_1809194_faciliti.facility_user',
    description: 'Users who can submit facility requests and report issues',
    can_delegate: true,
    grantable: true
})

// Role for facility technicians who work on issues
export const facility_technician = Role({
    name: 'x_1809194_faciliti.facility_technician',
    description: 'Technicians who can be assigned to and work on facility issues',
    contains_roles: [facility_user],
    can_delegate: true,
    grantable: true
})

// Role for facility managers who can approve requests and manage the system
export const facility_manager = Role({
    name: 'x_1809194_faciliti.facility_manager',
    description: 'Managers who can approve facility requests and oversee facility operations',
    contains_roles: [facility_technician],
    can_delegate: true,
    grantable: true
})