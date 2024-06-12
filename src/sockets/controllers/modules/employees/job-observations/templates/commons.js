//<editor-fold desc="getVariablesAndQueryConfig">
exports.getVariablesAndQueryConfig = (
	{
		orgs_filter = [],
		//
		id,
		//
		status,
		name,
		scheduled,
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
		if(status) {
			filter.push(`status: {_eq: "${status}"}`);
		}
		if(name) {
			filter.push(`name: {_ilike: "%${name}%"}`);
		}
		if(scheduled) {
			filter.push(`scheduled: {_eq: ${scheduled === "Yes"}}`);
		}
	}
	
	filter = filter.join(',');
	//</editor-fold>
	
	return {filter};
};
//</editor-fold>

//<editor-fold desc="job_observation_template_question_find_fragment">
const job_observation_template_question_find_fragment = (deep = 3) => {
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
    questionnaire_id
    questionnaire{
        id
    }
    idx
    is_page_title
    question_list:question_list{
        ${job_observation_template_question_find_fragment(deep - 1)}
    }
    options{
      id
      optionImage
      optionText
      optionType
    }
    notified_list{
        id
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

//<editor-fold desc="job_observation_template_details_find_fragment">
exports.job_observation_template_details_find_fragment = `
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
    job_position{
      id
      name
    }
    
    total_questions #computed
    
    template_questionnaire_list_aggregate{
      aggregate{
        count
      }
    }
    page_title_list:question_list(where: {is_page_title: {_eq: true}}){
        ${job_observation_template_question_find_fragment(3)}
    }
    question_list:question_list(where: {is_page_title: {_eq: false}}){
        ${job_observation_template_question_find_fragment(3)}
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

//<editor-fold desc="job_observation_template_details_list_fragment">
exports.job_observation_template_details_list_fragment = `
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
    job_position{
      id
      name
    }
    
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
