//<editor-fold desc="inspection_question_list_fragment">
exports.inspection_question_list_fragment = inspection_question_list_fragment = (deep = 3) => {
    if(deep === 0) {
        return `id`;
    }
    return `
    id
    answer
    answer_employee{
      id
    } 
    answer_asset{
      id
    }
    responseAttachment
    hasResponseAttachment
    responseAttachmentRequired
    expiry
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
        ${inspection_question_list_fragment(deep - 1)}
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
