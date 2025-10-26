import { gs, GlideDateTime } from '@servicenow/glide'

// Auto-prioritize facility issues based on type and urgency
export function autoPrioritizeFacilityIssue(current, previous) {
    if (current.isNewRecord()) {
        const issueType = current.getValue('issue_type')
        const urgencyLevel = current.getValue('urgency_level')
        const safetyHazard = current.getValue('safety_hazard')
        
        let priority = '4'  // Default to low priority
        
        // Safety hazards always get highest priority
        if (safetyHazard == 'true') {
            priority = '1'
        } else if (urgencyLevel === 'critical') {
            priority = '1'
        } else if (urgencyLevel === 'high') {
            priority = '2'
        } else if (urgencyLevel === 'medium') {
            priority = '3'
        }
        
        // Critical systems get higher priority
        if (issueType === 'hvac' || issueType === 'electrical' || issueType === 'security') {
            if (priority > '2') priority = '2'
        }
        
        current.setValue('priority', priority)
        gs.info(`Facility Issue ${current.getDisplayValue('number')} auto-prioritized to ${priority}`)
    }
}

// Auto-assign technicians based on issue type
export function autoAssignTechnician(current, previous) {
    if (current.isNewRecord() && current.getValue('issue_type')) {
        const issueType = current.getValue('issue_type')
        let technicianGroup = ''
        
        switch (issueType) {
            case 'hvac':
                technicianGroup = 'HVAC Technicians'
                break
            case 'electrical':
                technicianGroup = 'Electrical Technicians'
                break
            case 'plumbing':
                technicianGroup = 'Plumbing Technicians'
                break
            case 'lighting':
                technicianGroup = 'Electrical Technicians'
                break
            case 'security':
                technicianGroup = 'Security Technicians'
                break
            case 'cleaning':
                technicianGroup = 'Janitorial Services'
                break
            case 'equipment':
                technicianGroup = 'Equipment Technicians'
                break
            case 'structural':
                technicianGroup = 'Maintenance Technicians'
                break
            case 'safety':
                technicianGroup = 'Safety Technicians'
                break
            case 'pest_control':
                technicianGroup = 'Pest Control Services'
                break
            default:
                technicianGroup = 'General Maintenance'
        }
        
        gs.addInfoMessage(`Issue has been assigned to ${technicianGroup} team`)
        gs.info(`Facility Issue ${current.getDisplayValue('number')} auto-assigned to ${technicianGroup}`)
    }
}

// Validate safety hazard reporting
export function validateSafetyHazard(current, previous) {
    if (current.getValue('safety_hazard') == 'true') {
        const urgencyLevel = current.getValue('urgency_level')
        
        if (urgencyLevel !== 'critical' && urgencyLevel !== 'high') {
            current.setValue('urgency_level', 'critical')
            gs.addInfoMessage('Safety hazards are automatically set to critical urgency')
        }
        
        // Ensure detailed description for safety hazards
        const description = current.getValue('issue_description')
        if (!description || description.length < 100) {
            gs.addErrorMessage('Safety hazards require detailed description (minimum 100 characters)')
            current.setAbortAction(true)
        }
    }
}

// Track resolution time and update follow-up requirements
export function trackResolutionTime(current, previous) {
    if (current.getValue('state') == '6' && previous.getValue('state') != '6') { // Resolved
        const createdDate = new GlideDateTime(current.getValue('sys_created_on'))
        const resolvedDate = new GlideDateTime()
        const diffMs = resolvedDate.getNumericValue() - createdDate.getNumericValue()
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
        
        gs.addInfoMessage(`Issue resolved in ${diffHours} hours`)
        
        // Set follow-up requirements based on issue type
        const issueType = current.getValue('issue_type')
        if (issueType === 'hvac' || issueType === 'electrical' || issueType === 'equipment') {
            current.setValue('follow_up_required', 'true')
            
            // Set follow-up date to 30 days from now
            const followUpDate = new GlideDateTime()
            followUpDate.addDaysUTC(30)
            current.setValue('follow_up_date', followUpDate.getDisplayValue())
        }
        
        gs.info(`Facility Issue ${current.getDisplayValue('number')} resolved in ${diffHours} hours`)
    }
}