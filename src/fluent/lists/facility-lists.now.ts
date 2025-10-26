import '@servicenow/sdk/global'
import { List, default_view } from '@servicenow/sdk/core'

// Facility Request List
export const facility_request_list = List({
    table: 'x_1809194_faciliti_facility_request',
    view: default_view,
    columns: [
        { element: 'number', position: 0 },
        { element: 'request_type', position: 1 },
        { element: 'short_description', position: 2 },
        { element: 'state', position: 3 },
        { element: 'caller_id', position: 4 },
        { element: 'requested_by_date', position: 5 },
        { element: 'business_impact', position: 6 },
        { element: 'manager_approval', position: 7 },
        { element: 'assigned_to', position: 8 },
        { element: 'sys_updated_on', position: 9 }
    ]
})

// Facility Issue List
export const facility_issue_list = List({
    table: 'x_1809194_faciliti_facility_issue',
    view: default_view,
    columns: [
        { element: 'number', position: 0 },
        { element: 'issue_type', position: 1 },
        { element: 'short_description', position: 2 },
        { element: 'state', position: 3 },
        { element: 'caller_id', position: 4 },
        { element: 'urgency_level', position: 5 },
        { element: 'safety_hazard', position: 6 },
        { element: 'assigned_technician', position: 7 },
        { element: 'reported_date_time', position: 8 },
        { element: 'sys_updated_on', position: 9 }
    ]
})