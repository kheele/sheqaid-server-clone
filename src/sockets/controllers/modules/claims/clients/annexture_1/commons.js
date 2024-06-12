
//<editor-fold desc="coida_claims_annexture_1_fragment">
exports.coida_claims_annexture_1_fragment = `
    id
          
          totalFieldCount
          totalFieldMax
          
          #A. Recording Of Incident
          company_name
          id_num
          accident_date
          accident_time
          part_of_body_affected
          effect_on_person
          expected_period_of_disablement
          disease_desc
          process
          incident_reported_compensationcommissioner__provincial_director
          incident_reported_police
          saps_office
          saps_reference
          substance_exposed_to
          
          #B. Incident Investigation
          investigator{
            id
            fname
            lname
            full_name
          }
          investigator_other{
            id
            fname
            lname
            full_name
          }
          investigation_date
          investigator_designation
          incident_desc
          incident_cause
          steps_to_prevent_recurrence
          investigator_signature
          investigator_signature_date
          
          #C. Action Taken By Employer To Prevent The Recurrence Of Similar Incident
          employer_preventative_action_for_recurrence_of_similar_incident
          employer_signature
          employer_signature_date
          
          #D. Remarks By Health & Safety Committee
          health_and_safety_committee_remarks
          chairperson_of_health_and_safety_committee_signature
          chairperson_of_health_and_safety_committee_signature_date
`;
//</editor-fold>