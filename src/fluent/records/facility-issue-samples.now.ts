import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'

// Sample Facility Issue Records for testing and demonstration

// HVAC Issue - Critical
export const facilityIssue1 = Record({
    $id: Now.ID['fiss_sample_1'],
    table: 'x_1809194_faciliti_facility_issue',
    data: {
        issue_type: 'hvac',
        short_description: 'Air conditioning not working in server room',
        issue_description: 'The air conditioning unit in the server room has completely stopped working. Temperature is rising rapidly and could damage critical equipment. This is affecting the main data center cooling system.',
        urgency_level: 'critical',
        safety_hazard: false,
        affects_operations: true,
        reported_date_time: '2024-01-20 09:15:00',
        building: 'Main Office Building',
        floor: 'Basement',
        room_number: 'Server Room B',
        specific_location_details: 'Main HVAC unit near the central server rack',
        number_of_people_affected: 0,
        current_temperature: 85,
        desired_temperature: 68,
        estimated_repair_time: 4,
        state: 2, // In Progress
        priority: 1 // Critical
    },
    $meta: {
        installMethod: 'demo'
    }
})

// Electrical Issue - Safety Hazard
export const facilityIssue2 = Record({
    $id: Now.ID['fiss_sample_2'],
    table: 'x_1809194_faciliti_facility_issue',
    data: {
        issue_type: 'electrical',
        short_description: 'Sparking electrical outlet in break room',
        issue_description: 'Electrical outlet near the coffee station is sparking intermittently when appliances are plugged in. This poses a significant fire hazard and electrical shock risk. The outlet appears to have scorch marks around it and makes crackling sounds.',
        urgency_level: 'critical',
        safety_hazard: true,
        affects_operations: true,
        reported_date_time: '2024-01-22 14:30:00',
        building: 'Main Office Building',
        floor: '2nd Floor',
        room_number: 'Break Room',
        specific_location_details: 'Wall outlet next to the coffee station, approximately 3 feet from the sink',
        number_of_people_affected: 25,
        estimated_repair_time: 2,
        vendor_contractor: 'SafeElectric Inc.',
        state: 1, // New
        priority: 1 // Critical
    },
    $meta: {
        installMethod: 'demo'
    }
})

// Plumbing Issue - Resolved
export const facilityIssue3 = Record({
    $id: Now.ID['fiss_sample_3'],
    table: 'x_1809194_faciliti_facility_issue',
    data: {
        issue_type: 'plumbing',
        short_description: 'Leaking faucet in executive washroom',
        issue_description: 'The main faucet in the executive washroom has a persistent leak. Water is dripping constantly, causing water waste and potential damage to the vanity cabinet below.',
        urgency_level: 'medium',
        safety_hazard: false,
        affects_operations: false,
        reported_date_time: '2024-01-18 11:45:00',
        building: 'Main Office Building',
        floor: '4th Floor',
        room_number: 'Executive Washroom',
        specific_location_details: 'Main sink faucet, hot water handle',
        number_of_people_affected: 5,
        estimated_repair_time: 1,
        root_cause: 'Worn out O-ring in the hot water valve assembly',
        resolution_description: 'Replaced worn O-ring and cleaned valve seat. Tested for proper operation and no leaks.',
        parts_used: 'O-ring kit part #OR-2024-15, valve seat cleaner',
        repair_cost: 45,
        preventive_action_needed: true,
        follow_up_required: false,
        state: 6, // Resolved
        priority: 3 // Medium
    },
    $meta: {
        installMethod: 'demo'
    }
})

// Security System Issue
export const facilityIssue4 = Record({
    $id: Now.ID['fiss_sample_4'],
    table: 'x_1809194_faciliti_facility_issue',
    data: {
        issue_type: 'security',
        short_description: 'Card reader malfunction at main entrance',
        issue_description: 'The card reader at the main entrance is not recognizing employee access cards. Some cards work intermittently while others are completely rejected. This is causing delays and potential security concerns.',
        urgency_level: 'high',
        safety_hazard: false,
        affects_operations: true,
        reported_date_time: '2024-01-21 08:00:00',
        building: 'Main Office Building',
        floor: '1st Floor',
        room_number: 'Main Entrance',
        specific_location_details: 'Primary card reader unit to the right of the main doors',
        number_of_people_affected: 150,
        estimated_repair_time: 3,
        vendor_contractor: 'SecureAccess Systems',
        state: 2, // In Progress
        priority: 2 // High
    },
    $meta: {
        installMethod: 'demo'
    }
})

// Cleaning Issue - Low Priority
export const facilityIssue5 = Record({
    $id: Now.ID['fiss_sample_5'],
    table: 'x_1809194_faciliti_facility_issue',
    data: {
        issue_type: 'cleaning',
        short_description: 'Carpet stain in reception area',
        issue_description: 'Large coffee stain on the carpet in the main reception area near the seating area. The stain is noticeable and detracts from the professional appearance of the reception area.',
        urgency_level: 'low',
        safety_hazard: false,
        affects_operations: false,
        reported_date_time: '2024-01-19 16:20:00',
        building: 'Main Office Building',
        floor: '1st Floor',
        room_number: 'Reception Area',
        specific_location_details: 'Main carpet, approximately 6 feet from the reception desk near the guest seating',
        number_of_people_affected: 0,
        estimated_repair_time: 2,
        state: 1, // New
        priority: 4 // Low
    },
    $meta: {
        installMethod: 'demo'
    }
})