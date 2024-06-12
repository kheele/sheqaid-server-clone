//<editor-fold desc="getVariablesAndQueryConfig">
exports.getVariablesAndQueryConfig = (
	{
		orgs_filter = [],
		//
		id,
		//
		name,
		interval,
		template_id,
		//
		logged_employee_id,
		site_id, project_id, client_id,
		//
		exact_orgs = false,
	}
) => {
	//<editor-fold desc="variables, filters">
	let filter = orgs_filter || [];//orgsFilter({socket, site_id, project_id, client_id, exact_orgs});
	
	if(id) {
		filter.push(`id: {_eq: ${id}}`);
	}  else {
		if(logged_employee_id) {
			filter.push(`_or: [
				{responsible_department: {employee_list:{id: {_eq: ${logged_employee_id}}}}},
				{responsible_person_list:{employee_id: {_eq: ${logged_employee_id}}}}
			]`);
		}
		
		//
		if(name) {
			filter.push(`name: {_ilike: "%${name}%"}`);
		}
		if(interval) {
			filter.push(`interval: {_eq: "${interval}"}`);
		}
		if(template_id) {
			filter.push(`template_id: {_eq: ${template_id}}`);
		}
	}
	
	filter = filter.join(',');
	//</editor-fold>
	
	return {filter};
};
//</editor-fold>

//<editor-fold desc="safety_file_question_find_fragment">
const safety_file_question_find_fragment = (deep = 3) => {
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
    question_list:question_list{
        ${safety_file_question_find_fragment(deep - 1)}
    }
    options{
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

//<editor-fold desc="safety_file_details_find_fragment">
exports.safety_file_details_find_fragment = `
    id
    ques_next_id
    ques_prev_id
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
    
    interval
    start_date
    time
    due_date
    schedule_date
    date_completed
    time_completed

    template{
      id
      name
    }
    responsible_person_list{
      id
      questionnaire_id
      questionnaire{
        id
      }
      employee{
	      id
	      full_name
	      email
	      phone
	      linked_user_id
	      linked_user{
	        id
	        username
	      }
      }
    }
    responsible_person_other_list{
      id
      questionnaire_id
      questionnaire{
        id
      }
      employee_other{
	      id
	      full_name
	      email
	      phone
      }
    }
    responsible_user{
      id
      full_name
      username
      linked_employee_id
      linked_employee{
        id
        email
      }
    }
    
    page_title_list:question_list(where: {is_page_title: {_eq: true}}){
        ${safety_file_question_find_fragment(3)}
    }
    question_list:question_list(where: {is_page_title: {_eq: false}}){
        ${safety_file_question_find_fragment(3)}
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

//<editor-fold desc="safety_file_details_list_fragment">
exports.safety_file_details_list_fragment = `
    id
    ques_next_id
    ques_prev_id
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
    
    interval
    start_date
    time
    due_date
    schedule_date
    date_completed
    time_completed
    
    template{
      id
      name
    }
    responsible_person_list{
      id
      questionnaire_id
      questionnaire{
        id
      }
      employee{
	      id
	      full_name
	      email
	      phone
	      linked_user_id
	      linked_user{
	        id
	        username
	      }
      }
    }
    responsible_person_other_list{
      id
      questionnaire_id
      questionnaire{
        id
      }
      employee_other{
	      id
	      full_name
	      email
	      phone
      }
    }
    responsible_user{
      id
      linked_employee_id
      linked_employee{
        id
        email
      }
      username
      full_name
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
