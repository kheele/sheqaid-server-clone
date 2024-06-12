//<editor-fold desc="getVariablesAndQueryConfig">
exports.getVariablesAndQueryConfig = (
	{
		orgs_filter = [],
		//
		id,
		//
		name,
        visibility,
        answered_by,
		//
		site_id, project_id, client_id,
		//
		exact_orgs = false,
	}
) => {
	//<editor-fold desc="variables, filters">
	let filter = orgs_filter || [];//orgsFilter({socket, site_id, project_id, client_id, exact_orgs});
	
	if(id) {
		filter.push(`id: {_eq: ${id}}`);
	} else {
		if(name) {
			filter.push(`name: {_ilike: "%${name}%"}`);
		}
		if(visibility) {
			filter.push(`visibility: {_eq: "${visibility}"}`);
		}
		if(answered_by) {
			filter.push(`answered_by: {_eq: "${answered_by}"}`);
		}
	}
	
	filter = filter.join(',');
	//</editor-fold>
	
	return {filter};
};
//</editor-fold>

//<editor-fold desc="safety_file_template_question_find_fragment">
const safety_file_template_question_find_fragment = (deep = 3) => {
	if (deep === 0) {
		return `id`;
	}
	return `
    id
    hasResponseAttachment
    responseAttachmentRequired
    expiry
    comments
    hasExpiry
    isEditableDoc
    isMandatory
    isMultiAnswer
    open
    linkDoc {
        id
        created_at
        name
        desc
        category
    }
    maxScore
    notify
    notifyAction
    questionImage
    questionText
    questionType
    questionnaire{
        id
    }
    idx
    is_page_title
    question_list:question_list{
        ${safety_file_template_question_find_fragment(deep - 1)}
    }
    options{
      optionImage
      optionText
      optionType
    }
    notified_list{
        employee{
            id
            fname
            lname
            email
            phone
        }
        ques{
            id
        }
    }
    #ques_path_list{
    #    id
    #    path
    #    ques{
    #        id
    #    }
    #}
`;
};
//</editor-fold>

//<editor-fold desc="safety_file_template_details_find_fragment">
exports.safety_file_template_details_find_fragment = `
    id
    created_at
    name
    desc
    status
    status_answered_by_sender
    answered_by
    is_template
    visibility
    scheduled
    
    total_questions #computed
    
    template_questionnaire_list_aggregate{
      aggregate{
        count
      }
    }
    page_title_list:question_list(where: {is_page_title: {_eq: true}}){
        ${safety_file_template_question_find_fragment(3)}
    }
    question_list:question_list(where: {is_page_title: {_eq: false}}){
        ${safety_file_template_question_find_fragment(3)}
    }
    contractor_site{
        id
        name
    }
    contractor {
        id
        name
    }
`;
//</editor-fold>

//<editor-fold desc="safety_file_template_details_list_fragment">
exports.safety_file_template_details_list_fragment = `
    id
    created_at
    name
    desc
    status
    status_answered_by_sender
    answered_by
    is_template
    visibility
    scheduled
    
    total_questions #computed
    
    template_questionnaire_list_aggregate{
      aggregate{
        count
      }
    }
    contractor_site{
        id
        name
    }
    contractor {
        id
        name
    }
`;
//</editor-fold>
