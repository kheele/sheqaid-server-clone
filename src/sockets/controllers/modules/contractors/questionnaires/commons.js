//<editor-fold desc="getVariablesAndQueryConfig">
exports.getVariablesAndQueryConfig = (
	{
		orgs_filter = [],
		//
		id,
		//
		name,
		template_id,
		status,
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
		if(template_id) {
			filter.push(`template_id: {_eq: ${template_id}}`);
		}
		if (status) {
			let comp;
			if (status.startsWith('!')) {
				status = status.replace('!', '');
				comp = '_neq';
			} else {
				comp = '_eq';
			}
			
			filter.push(`status: {${comp}: "${status}"}`);
		}
	}
	
	filter = filter.join(',');
	//</editor-fold>
	
	return {filter};
};
//</editor-fold>

//<editor-fold desc="contractor_questionnaire_question_find_fragment">
const contractor_questionnaire_question_find_fragment = (deep = 3) => {
	if (deep === 0) {
		return `id`;
	}
	return `
    id
    answer
    answer_employee{
      id
      fname
      lname
      full_name
      email
    } 
    answer_asset{
      id
      asset_detail{
        id
        name
        reg_num
        serial_num
      }
    }
    responseAttachment
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
    score
    questionnaire{
        id
    }
    idx
    is_page_title
    question_list{
        ${contractor_questionnaire_question_find_fragment(deep - 1)}
    }
    options{
      id
      optionImage
      optionText
      optionType
      answer
    }
    message_list{
        ques{
            id
        }
        msg
        read
        date
        sender{
            id
            fname
            lname
            username
            phone
        }
        recipient{
            id
            fname
            lname
            username
            phone
        }
        contractor_sender{
            id
            fname
            lname
            username
            phone
        }
        contractor_recipient{
            id
            fname
            lname
            username
            phone
        }
        logged_user{
            id
            fname
            lname
            username
            phone
        }
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

//<editor-fold desc="contractor_questionnaire_details_find_fragment">
exports.contractor_questionnaire_details_find_fragment = `
    id
    created_at
    name
    desc
    status
    status_answered_by_sender
    answered_by
    #is_template
    #visibility
    
    progress #computed
    total_questions #computed
    total_answered #computed
    total_compliance #computed
    total_deviations #computed
    total_non_deviations #computed
    total_unanswered #computed
    
    date_completed
    time_completed
    template{
      id
      name
    }
    
    page_title_list:question_list(where: {is_page_title: {_eq: true}}){
        ${contractor_questionnaire_question_find_fragment(3)}
    }
    question_list(where: {is_page_title: {_eq: false}}){
        ${contractor_questionnaire_question_find_fragment(3)}
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

//<editor-fold desc="contractor_questionnaire_details_list_fragment">
exports.contractor_questionnaire_details_list_fragment = `
    id
    created_at
    name
    desc
    status
    status_answered_by_sender
    answered_by
    #is_template
    #visibility
    
    progress #computed
    total_questions #computed
    total_answered #computed
    total_compliance #computed
    total_deviations #computed
    total_non_deviations #computed
    total_unanswered #computed
    
    date_completed
    time_completed
    template{
      id
      name
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
