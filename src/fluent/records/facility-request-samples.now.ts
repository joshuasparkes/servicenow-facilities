import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'

// Sample Facility Request Records for testing and demonstration

// Office Supplies Request
export const facilityRequest1 = Record({
    $id: Now.ID['freq_sample_1'],
    table: 'x_1809194_faciliti_facility_request',
    data: {
        request_type: 'office_supplies',
        short_description: 'Request for standing desks for accounting department',
        business_justification: 'The accounting department has requested ergonomic standing desks to improve employee health and productivity. Current desks are outdated and causing employee discomfort.',
        requested_by_date: '2024-02-15',
        building: 'Main Office Building',
        floor: '3rd Floor',
        room_number: 'Suite 302',
        estimated_cost: 2500.00,
        budget_code: 'ACCT-ERGO-2024',
        business_impact: 'medium',
        manager_approval: 'pending',
        state: 1, // New
        priority: 3 // Medium
    },
    $meta: {
        installMethod: 'demo'
    }
})

// Equipment Request - High Cost
export const facilityRequest2 = Record({
    $id: Now.ID['freq_sample_2'],
    table: 'x_1809194_faciliti_facility_request',
    data: {
        request_type: 'equipment',
        short_description: 'New conference room projection system',
        business_justification: 'The main conference room projection system has failed and needs replacement. This room is used for client presentations and board meetings. A modern system with wireless connectivity and 4K resolution is required to maintain professional standards and support hybrid meetings.',
        requested_by_date: '2024-01-30',
        building: 'Main Office Building',
        floor: '1st Floor',
        room_number: 'Conference Room A',
        estimated_cost: 8500.00,
        budget_code: 'CONF-TECH-2024',
        business_impact: 'high',
        manager_approval: 'approved',
        approved_by: 'admin', // This would be a real sys_id in production
        approval_date: '2024-01-25',
        vendor: 'TechPro Solutions',
        vendor_quote_number: 'TPS-2024-001',
        state: 2, // In Progress
        priority: 2 // High
    },
    $meta: {
        installMethod: 'demo'
    }
})

// Space Change Request
export const facilityRequest3 = Record({
    $id: Now.ID['freq_sample_3'],
    table: 'x_1809194_faciliti_facility_request',
    data: {
        request_type: 'space_change',
        short_description: 'Reconfigure marketing department layout',
        business_justification: 'Marketing team is expanding from 8 to 12 people. Current layout cannot accommodate additional staff. Need to reconfigure space to create collaborative work areas.',
        requested_by_date: '2024-02-28',
        building: 'Main Office Building',
        floor: '2nd Floor',
        room_number: 'Marketing Wing',
        estimated_cost: 15000.00,
        budget_code: 'MKTG-EXPANSION-2024',
        business_impact: 'critical',
        manager_approval: 'pending',
        state: 1, // New
        priority: 2 // High
    },
    $meta: {
        installMethod: 'demo'
    }
})

// Maintenance Request - Approved and Completed
export const facilityRequest4 = Record({
    $id: Now.ID['freq_sample_4'],
    table: 'x_1809194_faciliti_facility_request',
    data: {
        request_type: 'maintenance',
        short_description: 'Annual HVAC system maintenance',
        business_justification: 'Scheduled annual maintenance for HVAC system to ensure optimal performance and energy efficiency during summer months.',
        requested_by_date: '2024-01-15',
        building: 'Main Office Building',
        floor: 'All Floors',
        estimated_cost: 3200.00,
        budget_code: 'HVAC-MAINT-2024',
        business_impact: 'medium',
        manager_approval: 'approved',
        approved_by: 'admin',
        approval_date: '2024-01-10',
        vendor: 'ClimateControl Services',
        actual_cost: 3150.00,
        completion_notes: 'All HVAC units serviced, filters replaced, system optimized for summer operation. No issues found.',
        state: 6, // Resolved
        priority: 3 // Medium
    },
    $meta: {
        installMethod: 'demo'
    }
})