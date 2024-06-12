
//<editor-fold desc="getVariablesAndQueryConfig">
exports.getVariablesAndQueryConfig = (
    {
        orgs_filter = [],
        status,
        //
        site_id, project_id, client_id,
        //
        exact_orgs = false,
    }
) => {
    //<editor-fold desc="variables, filters">
    let filter = orgs_filter || [];//orgsFilter({socket, site_id, project_id, client_id, exact_orgs});

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

    filter = filter.join(',');
    //</editor-fold>

    return {filter};
};
//</editor-fold>

//<editor-fold desc="inspection_question_find_fragment">
const inspection_question_find_fragment = (deep = 3) => {
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
        ${inspection_question_find_fragment(deep - 1)}
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

//<editor-fold desc="inspection_details_find_fragment">
exports.inspection_details_find_fragment = `
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
    asset_type
    asset{
      id
      asset_detail{
        asset_type
        name
        reg_num
        serial_num
        manufacturer
        model
        location
        toolkit
        condition
        owning_company
      }
      profile_pic:photo_list(where: {is_default: {_eq: true}}){
          id
          doc    
          is_default
      }
      photo_list{
        id
        is_default
        doc
      }
      responsible_person{
        id
        lname
        fname
        email
        phone
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
        ${inspection_question_find_fragment(3)}
    }
    question_list:question_list(where: {is_page_title: {_eq: false}}){
        ${inspection_question_find_fragment(3)}
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

//<editor-fold desc="inspection_details_list_fragment">
exports.inspection_details_list_fragment = `
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
    asset_type
    asset{
      id
      asset_detail{
        asset_type
        name
        reg_num
        serial_num
        manufacturer
        model
      }
      profile_pic:photo_list(where: {is_default: {_eq: true}}){
          id
          doc    
          is_default
      }
      photo_list{
        id
        is_default
        doc
      }
      responsible_person{
        id
        full_name
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
