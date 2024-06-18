//<editor-fold desc="getVariablesAndQueryConfig">
exports.getVariablesAndQueryConfig = (
    {
        orgs_filter = [],
        //
        id,
        //
        name,
        task_observed,
        interval,
        team_observed_id,
        template_id,
        //
        site_id, project_id, client_id,
        //
        exact_orgs = false,
    }
) => {
    //<editor-fold desc="variables, filters">
    let filter = orgs_filter || [];//orgsFilter({socket, site_id, project_id, client_id, exact_orgs});

    if (id) {
        filter.push(`id: {_eq: ${id}}`);
    } else {
        if (name) {
            filter.push(`name: {_ilike: "%${name}%"}`);
        }
        if (task_observed) {
            filter.push(`task_observed: {_ilike: "%${task_observed}%"}`);
        }
        if (interval) {
            filter.push(`interval: {_eq: "${interval}"}`);
        }
        if (team_observed_id) {
            filter.push(`team_observed_id: {_eq: ${team_observed_id}}`);
        }
        if (template_id) {
            filter.push(`template_id: {_eq: ${template_id}}`);
        }
    }

    filter = filter.join(',');
    //</editor-fold>

    return {filter};
};
//</editor-fold>

//<editor-fold desc="job_observation_question_find_fragment">
const job_observation_question_find_fragment = (deep = 3) => {
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
        ${job_observation_question_find_fragment(deep - 1)}
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

//<editor-fold desc="job_observation_details_find_fragment">
exports.job_observation_details_find_fragment = `
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
    
    interval
    start_date
    time
    schedule_date
    date_completed
    time_completed
    task_observed
    team_observed{
        id
        name
    }
    employee{
      id
      fname
      lname
      full_name
      email
      phone
      job_position{
        id
        name
      }
    }
    template{
      id
      name
    }
    responsible_person{
      id
      full_name
    }
    responsible_department{
      id
      name
    }
    
    page_title_list:question_list(where: {is_page_title: {_eq: true}}){
        ${job_observation_question_find_fragment(3)}
    }
    question_list:question_list(where: {is_page_title: {_eq: false}}){
        ${job_observation_question_find_fragment(3)}
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

//<editor-fold desc="job_observation_details_list_fragment">
exports.job_observation_details_list_fragment = `
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
    schedule_date
    date_completed
    time_completed
    task_observed
    team_observed{
        id
        name
    }
    employee{
      id
      fname
      lname
      full_name
      email
      phone
      job_position{
        id
        name
      }
    }
    template{
      id
      name
    }
    responsible_person{
      id
      full_name
    }
    responsible_department{
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
