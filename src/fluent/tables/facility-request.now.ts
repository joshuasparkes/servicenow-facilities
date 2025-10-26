import '@servicenow/sdk/global'
import { 
    Table, 
    StringColumn, 
    ChoiceColumn, 
    DateColumn, 
    ReferenceColumn, 
    DecimalColumn 
} from '@servicenow/sdk/core'

// Facility Request Table - for requesting services like office supplies, equipment, space changes
export const x_1809194_faciliti_facility_request = Table({
    name: 'x_1809194_faciliti_facility_request',
    label: 'Facility Request',
    extends: 'task',
    schema: {
        // Request Information
        request_type: ChoiceColumn({
            label: 'Request Type',
            mandatory: true,
            dropdown: 'dropdown_with_none',
            choices: {
                office_supplies: { label: 'Office Supplies', sequence: 10 },
                equipment: { label: 'Equipment Request', sequence: 20 },
                space_change: { label: 'Space Change/Move', sequence: 30 },
                maintenance: { label: 'Maintenance Request', sequence: 40 },
                catering: { label: 'Catering/Events', sequence: 50 },
                it_support: { label: 'IT Support', sequence: 60 },
                other: { label: 'Other', sequence: 100 }
            }
        }),
        
        // Request Details
        business_justification: StringColumn({
            label: 'Business Justification',
            maxLength: 1000,
            mandatory: true
        }),
        
        requested_by_date: DateColumn({
            label: 'Requested By Date',
            mandatory: true
        }),
        
        location: ReferenceColumn({
            label: 'Location',
            referenceTable: 'cmn_location'
        }),
        
        building: StringColumn({
            label: 'Building',
            maxLength: 100
        }),
        
        floor: StringColumn({
            label: 'Floor',
            maxLength: 50
        }),
        
        room_number: StringColumn({
            label: 'Room Number',
            maxLength: 50
        }),
        
        // Cost Information
        estimated_cost: DecimalColumn({
            label: 'Estimated Cost'
        }),
        
        budget_code: StringColumn({
            label: 'Budget Code',
            maxLength: 50
        }),
        
        // Priority and Impact
        business_impact: ChoiceColumn({
            label: 'Business Impact',
            dropdown: 'dropdown_with_none',
            choices: {
                low: { label: 'Low - Minimal business impact', sequence: 10 },
                medium: { label: 'Medium - Moderate business impact', sequence: 20 },
                high: { label: 'High - Significant business impact', sequence: 30 },
                critical: { label: 'Critical - Business operations at risk', sequence: 40 }
            }
        }),
        
        // Approval Information
        manager_approval: ChoiceColumn({
            label: 'Manager Approval',
            dropdown: 'dropdown_with_none',
            choices: {
                pending: { label: 'Pending', sequence: 10 },
                approved: { label: 'Approved', sequence: 20 },
                rejected: { label: 'Rejected', sequence: 30 }
            },
            default: 'pending'
        }),
        
        approved_by: ReferenceColumn({
            label: 'Approved By',
            referenceTable: 'sys_user'
        }),
        
        approval_date: DateColumn({
            label: 'Approval Date'
        }),
        
        // Assignment and Tracking
        assigned_to: ReferenceColumn({
            label: 'Assigned To',
            referenceTable: 'sys_user'
        }),
        
        vendor: StringColumn({
            label: 'Vendor/Supplier',
            maxLength: 200
        }),
        
        vendor_quote_number: StringColumn({
            label: 'Vendor Quote Number',
            maxLength: 100
        }),
        
        // Completion Information
        actual_cost: DecimalColumn({
            label: 'Actual Cost'
        }),
        
        completion_notes: StringColumn({
            label: 'Completion Notes',
            maxLength: 1000
        })
    },
    
    // Table Configuration for Portal Access
    display: 'number',
    extensible: true,
    audit: true,
    accessible_from: 'public',
    caller_access: 'tracking',
    actions: ['create', 'read', 'update', 'delete'],
    allow_web_service_access: true,
    auto_number: {
        prefix: 'FREQ',
        number: 1000,
        number_of_digits: 7
    }
})