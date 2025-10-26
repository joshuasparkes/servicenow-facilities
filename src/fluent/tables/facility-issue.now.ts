import '@servicenow/sdk/global'
import { 
    Table, 
    StringColumn, 
    ChoiceColumn, 
    DateTimeColumn, 
    ReferenceColumn, 
    IntegerColumn,
    BooleanColumn 
} from '@servicenow/sdk/core'

// Facility Issue Table - for reporting problems like broken equipment, HVAC issues, maintenance needs
export const x_1809194_faciliti_facility_issue = Table({
    name: 'x_1809194_faciliti_facility_issue',
    label: 'Facility Issue',
    extends: 'task',
    schema: {
        // Issue Classification
        issue_type: ChoiceColumn({
            label: 'Issue Type',
            mandatory: true,
            dropdown: 'dropdown_with_none',
            choices: {
                hvac: { label: 'HVAC (Heating/Cooling)', sequence: 10 },
                electrical: { label: 'Electrical', sequence: 20 },
                plumbing: { label: 'Plumbing', sequence: 30 },
                lighting: { label: 'Lighting', sequence: 40 },
                security: { label: 'Security Systems', sequence: 50 },
                cleaning: { label: 'Cleaning/Janitorial', sequence: 60 },
                equipment: { label: 'Equipment Malfunction', sequence: 70 },
                structural: { label: 'Structural/Building', sequence: 80 },
                safety: { label: 'Safety Hazard', sequence: 90 },
                pest_control: { label: 'Pest Control', sequence: 100 },
                other: { label: 'Other', sequence: 110 }
            }
        }),
        
        // Issue Details
        issue_description: StringColumn({
            label: 'Issue Description',
            maxLength: 2000,
            mandatory: true
        }),
        
        // Location Information
        location: ReferenceColumn({
            label: 'Location',
            referenceTable: 'cmn_location',
            mandatory: true
        }),
        
        building: StringColumn({
            label: 'Building',
            maxLength: 100,
            mandatory: true
        }),
        
        floor: StringColumn({
            label: 'Floor',
            maxLength: 50
        }),
        
        room_number: StringColumn({
            label: 'Room Number',
            maxLength: 50
        }),
        
        specific_location_details: StringColumn({
            label: 'Specific Location Details',
            maxLength: 500
        }),
        
        // Urgency and Safety
        urgency_level: ChoiceColumn({
            label: 'Urgency Level',
            mandatory: true,
            dropdown: 'dropdown_with_none',
            choices: {
                low: { label: 'Low - Can wait for scheduled maintenance', sequence: 10 },
                medium: { label: 'Medium - Should be addressed within a few days', sequence: 20 },
                high: { label: 'High - Needs attention within 24 hours', sequence: 30 },
                critical: { label: 'Critical - Immediate attention required', sequence: 40 }
            }
        }),
        
        safety_hazard: BooleanColumn({
            label: 'Safety Hazard?',
            default: false
        }),
        
        affects_operations: BooleanColumn({
            label: 'Affects Business Operations?',
            default: false
        }),
        
        // Detection and Impact
        reported_date_time: DateTimeColumn({
            label: 'Issue First Noticed',
            mandatory: true
        }),
        
        number_of_people_affected: IntegerColumn({
            label: 'Number of People Affected',
            min: 0
        }),
        
        // Temperature Issues (for HVAC)
        current_temperature: IntegerColumn({
            label: 'Current Temperature (°F)'
        }),
        
        desired_temperature: IntegerColumn({
            label: 'Desired Temperature (°F)'
        }),
        
        // Assignment and Response
        assigned_technician: ReferenceColumn({
            label: 'Assigned Technician',
            referenceTable: 'sys_user'
        }),
        
        vendor_contractor: StringColumn({
            label: 'External Vendor/Contractor',
            maxLength: 200
        }),
        
        estimated_repair_time: IntegerColumn({
            label: 'Estimated Repair Time (hours)'
        }),
        
        // Resolution Information
        root_cause: StringColumn({
            label: 'Root Cause Analysis',
            maxLength: 1000
        }),
        
        resolution_description: StringColumn({
            label: 'Resolution Description',
            maxLength: 1000
        }),
        
        parts_used: StringColumn({
            label: 'Parts/Materials Used',
            maxLength: 500
        }),
        
        repair_cost: IntegerColumn({
            label: 'Repair Cost'
        }),
        
        // Follow-up and Prevention
        preventive_action_needed: BooleanColumn({
            label: 'Preventive Action Needed?',
            default: false
        }),
        
        follow_up_required: BooleanColumn({
            label: 'Follow-up Required?',
            default: false
        }),
        
        follow_up_date: DateTimeColumn({
            label: 'Follow-up Date'
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
        prefix: 'FISS',
        number: 1000,
        number_of_digits: 7
    }
})