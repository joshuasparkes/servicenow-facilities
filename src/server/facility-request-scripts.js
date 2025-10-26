import { gs, GlideDateTime } from '@servicenow/glide'

// Auto-assign facility requests based on request type
export function autoAssignFacilityRequest(current, previous) {
    if (current.isNewRecord() && current.getValue('request_type')) {
        const requestType = current.getValue('request_type')
        let assignmentGroup = ''
        
        switch (requestType) {
            case 'office_supplies':
                assignmentGroup = 'Admin Services'
                break
            case 'equipment':
                assignmentGroup = 'Equipment Management'
                break
            case 'space_change':
                assignmentGroup = 'Space Planning'
                break
            case 'maintenance':
                assignmentGroup = 'Maintenance'
                break
            case 'catering':
                assignmentGroup = 'Catering Services'
                break
            case 'it_support':
                assignmentGroup = 'IT Support'
                break
            default:
                assignmentGroup = 'General Facilities'
        }
        
        // Set assignment group (this would typically look up actual groups)
        gs.addInfoMessage(`Request has been assigned to ${assignmentGroup} team`)
        
        // Log the assignment
        gs.info(`Facility Request ${current.getDisplayValue('number')} auto-assigned to ${assignmentGroup}`)
    }
}

// Validate business justification for high-cost requests
export function validateHighCostRequest(current, previous) {
    const estimatedCost = parseFloat(current.getValue('estimated_cost') || '0')
    const businessJustification = current.getValue('business_justification')
    
    if (estimatedCost > 5000 && (!businessJustification || businessJustification.length < 50)) {
        gs.addErrorMessage('Requests over $5,000 require detailed business justification (minimum 50 characters)')
        current.setAbortAction(true)
    }
}

// Set approval to pending for requests requiring manager approval
export function setApprovalStatus(current, previous) {
    const estimatedCost = parseFloat(current.getValue('estimated_cost') || '0')
    const businessImpact = current.getValue('business_impact')
    
    if (estimatedCost > 1000 || businessImpact === 'high' || businessImpact === 'critical') {
        current.setValue('manager_approval', 'pending')
        gs.addInfoMessage('This request requires manager approval due to cost or business impact')
    }
}

// Send notification when request is approved
export function notifyRequestApproval(current, previous) {
    if (current.getValue('manager_approval') === 'approved' && 
        previous.getValue('manager_approval') !== 'approved') {
        
        const approvalDate = new GlideDateTime()
        current.setValue('approval_date', approvalDate.getDisplayValue())
        current.setValue('approved_by', gs.getUserID())
        
        gs.addInfoMessage(`Request approved by ${gs.getUserDisplayName()}`)
        gs.info(`Facility Request ${current.getDisplayValue('number')} approved by ${gs.getUserDisplayName()}`)
    }
}