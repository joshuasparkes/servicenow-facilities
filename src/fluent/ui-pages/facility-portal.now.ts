import '@servicenow/sdk/global';
import { UiPage } from '@servicenow/sdk/core';
import facilityPortalHtml from '../../client/index.html';

export const facility_portal = UiPage({
  $id: Now.ID['facility-portal'], 
  endpoint: 'x_1809194_faciliti_facility_portal.do',
  description: 'Facilities Management Portal - Self-service portal for submitting requests and reporting issues',
  category: 'general',
  html: facilityPortalHtml,
  direct: true
})