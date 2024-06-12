//<editor-fold desc="inspection_question_list_fragment">
const {create_schedule_date, updateInspectionsQuestionnaire, getQuestionnaireTemplateForm,
    insertInspectionsQuestionnaire
} = require("../../../../libs/inspections");
const inspection_question_list_fragment = (deep = 3) => {
    if (deep === 0) {
        return `id`;
    }
    return `
    id
    answer
    answer_employee_id
    answer_asset_id
    comments
    responseAttachment
    hasResponseAttachment
    responseAttachmentRequired
    expiry
    hasExpiry
    isEditableDoc
    isMandatory
    isMultiAnswer
    #open
    link_doc_id
    maxScore
    notify
    notifyAction
    questionImage
    questionText
    questionType
    score
    #questionnaire_id
    #idx
    is_page_title
    question_list{
        ${inspection_question_list_fragment(deep - 1)}
    }
    options{
      optionImage
      optionText
      optionType
      #answer
    }
    notified_list{
        employee_id
        #question_id
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

//<editor-fold desc="inspection_details_fragment">
const inspection_details_fragment = `
    id
    ques_next_id
    ques_prev_id
    #created_at
    name
    desc
    status
    status_answered_by_sender
    answered_by
    #is_template
    visibility
    
    interval
    start_date
    time        
    schedule_date
    #
    asset_type
    asset_id
    template_id
    responsible_person_id
    responsible_department_id
    
    question_list{
        ${inspection_question_list_fragment(3)}
    }
    contractor_site_id
    contractor_client_id
    contractor_id
    company_id        
    client_id        
    project_id        
    site_id   
`;
//</editor-fold>

//<editor-fold desc="query">
const query = `
query onScheduleNextDateQuery($schedule_date: date) {
  default_contractor_questionnaires_connection(
    where: {
      company_id: {_eq: 18},
      
	    removed: {_eq: false},
      is_template: {_eq: false},
      group: {_eq: "Inspections"},
      ques_next_id: {_is_null: true},
      _or: [
        {schedule_date: {_eq: $schedule_date}},
        {schedule_date: {_is_null: true}}
      ]
    }
  ){
    edges{
      node{
        ${inspection_details_fragment}
      }
    }
  }
}
`;
//</editor-fold>

// <editor-fold defaultstate="collapsed" desc="onScheduleNextDate">
exports.onScheduleNextDate = async (data) => {
    // await authorize();

    const list = await listRelay({
        query,
        operationName: "onScheduleNextDateQuery",
        variables: {
            schedule_date: Dates.formatDateSQL(new Date().addDays(-1)),
        },
    });

    if (!list) {
        // res.send();
        return;
    }

    // console.log('onScheduleNextDate', list)

    await Promise.all(list.map(async ({id, data}) => {
        let {
            //
            company_id,
            client_id,
            project_id,
            site_id,
            //
            contractor_id,
            contractor_client_id,
            contractor_site_id,
            //
            // status,
            status_answered_by_sender,//
            answered_by,
            // is_template,
            visibility,
            //
            asset_type,
            asset_id,
            //
            responsible_person_id,
            responsible_department_id,
            //
            interval,
            start_date,
            time,
            schedule_date,
            //
            template_id,
            ques_next_id,
            ques_prev_id,
            //
            name,
            desc,
            question_list,
        } = data;

        //start_date
        
        const prev_schedule_date = schedule_date;
        schedule_date = create_schedule_date({interval, start_date, schedule_date});
        
        console.log('scheduling:', id, interval, start_date, prev_schedule_date, schedule_date);
        // return;////
        
        if(!schedule_date) {
            return;
        }

        question_list = getQuestionnaireTemplateForm(question_list);

        const save = async (input) => {
            // console.log('input', input);

            const scheduledItem = await insertInspectionsQuestionnaire(input);
            console.log('scheduledItem', scheduledItem);
            if (scheduledItem) {
                return updateInspectionsQuestionnaire({id: input.ques_prev_id, ques_next_id: scheduledItem.id}).
                then(_ => scheduledItem);
            }
        };

        const input = {
            company_id,
            client_id,
            project_id,
            site_id,
            //
            contractor_id,
            contractor_client_id,
            contractor_site_id,
            //
            status_answered_by_sender,
            answered_by,
            visibility,
            //
            asset_type,
            asset_id,
            //
            responsible_person_id,
            responsible_department_id,
            interval,
            start_date,
            time,
            //
            schedule_date,
            //
            template_id,
            //
            name,
            desc,
            question_list: {data: question_list},
        };

        const savedItem = await save({...input, ques_prev_id: id});

        if(savedItem){
            schedule_date = create_schedule_date({interval, schedule_date});
            if (schedule_date) {
                await save({...input, ques_prev_id: savedItem.id, schedule_date});
            }
        }
    }));
};
// </editor-fold>
