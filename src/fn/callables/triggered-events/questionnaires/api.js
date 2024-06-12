const findByIdQuestionnaireContractor = require('../../queries/findByIdQuestionnaireContractor');
const findByIdQuestionnaireInspection = require('../../queries/findByIdQuestionnaireInspection');
const findByIdQuestionMessage = require('../../queries/findByIdQuestionMessage');
const {mutation: insertQuestionnaireScheduleMutation} = require("../../graphql/insertQuestionnaireScheduleMutation");
const {onCreatedQuestionnaireContractors} = require("./api-contractors");
const {onCreatedQuestionnaireInspections} = require("./api-inspections");

const isSection = (ques) => {
    if (!('question_list' in ques)) return false;
    const {question_list} = ques;
    if (question_list.isEmpty()) return false;
    return true;
}

const all_question_list = (question_list) => {
    return question_list.map(v => isSection(v) ? v.question_list : [v]).reduce((a1, a2) => [...a1, ...a2], []).filter(v => v.questionType !== 'NoAnswer');
};

// <editor-fold defaultstate="collapsed" desc="uploadQuestionnaireFilesUpdate">
exports.uploadQuestionnaireFilesUpdate = async (body) => {
    const data = getTriggeredEventsData(body, "default_contractor_questionnaires_ques");
    if (!data) {
        return;
    }

    const {new_item} = data;
    let {id, questionnaire_id, isMultiAnswer, answer, responseAttachment, questionImage, questionType} = new_item;

    console.log('uploadQuestionnaireFilesNew', new_item)

    const onUpdate = async ({id, ...attrs}) => {
        delete attrs.id;

        await updateRelay({
            mutation: `
					    mutation updateQuestionMutation($id: default_contractor_questionnaires_ques_pk_columns_input!, $_set: default_contractor_questionnaires_ques_set_input!) {
					      update_default_contractor_questionnaires_ques_by_pk(pk_columns: $id, _set: $_set) {
					        id
					      }
					    }
					  `,
            operationName: "updateQuestionMutation",
            id,
            attrs,
        });
    };

    await Promise.all([
        async () => {
            const new_name = `questionnaires/${questionnaire_id}/${id}/questionImage`;
            await uploadFilesUpdate({
                id, doc: questionImage, key: 'questionImage', new_name, onUpdate,
            });
        },
        async () => {
            const new_name = `questionnaires/${questionnaire_id}/${id}/responseAttachment`;
            await uploadFilesUpdate({
                id, doc: responseAttachment, key: 'responseAttachment', new_name, onUpdate,
            });
        },
        async () => {
            const new_name = `questionnaires/${questionnaire_id}/${id}/answer`;
            await uploadFilesUpdate({
                id, doc: answer, key: 'answer', new_name, onUpdate,
            });
        },
    ]);
};
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="uploadQuestionOptionFilesUpdate">
exports.uploadQuestionOptionFilesUpdate = async (body) => {
    const data = getTriggeredEventsData(body, "default_contractor_questionnaires_ques_options");
    if (!data) {
        return;
    }

    const {new_item} = data;
    let {id, ques_id, answer, optionImage, optionType} = new_item;

    console.log('uploadQuestionOptionFilesNew', new_item)

    const onUpdate = async ({id, ...attrs}) => {
        delete attrs.id;

        await updateRelay({
            mutation: `
					    mutation updateQuestionOptionMutation($id: default_contractor_questionnaires_ques_options_pk_columns_input!, $_set: default_contractor_questionnaires_ques_options_set_input!) {
					      update_default_contractor_questionnaires_ques_options_by_pk(pk_columns: $id, _set: $_set) {
					        id
					      }
					    }
					  `,
            operationName: "updateQuestionOptionMutation",
            id,
            attrs,
        });
    };

    await Promise.all([
        async () => {
            const new_name = `questionnaires/questions/${ques_id}/${id}/optionImage`;
            await uploadFilesUpdate({
                id, doc: optionImage, key: 'optionImage', new_name, onUpdate,
            });
        },
        async () => {
            const new_name = `questionnaires/questions/${ques_id}/${id}/answer`;
            await uploadFilesUpdate({
                id, doc: answer, key: 'answer', new_name, onUpdate,
            });
        },
    ]);
};
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="createScheduleQuestionnaireUpdate">
exports.createScheduleQuestionnaireUpdate = async (body) => {
    const data = getTriggeredEventsData(body, "default_contractor_questionnaires");
    if (!data) {
        return;
    }

    const {new_item} = data;
    let {id, interval, start_date, time} = new_item;

    console.log('createScheduleQuestionnaireNew', new_item)

    if (interval && start_date && time) {
        const year = new Date().getFullYear();
        const dates = createDateList(interval, year, Dates.parse(start_date));
        for (let n = 0; n < dates.length; n++) {
            const date = dates[n];
            await insertRelay({
                query: insertQuestionnaireScheduleMutation,
                operationName: 'insertQuestionnaireScheduleMutation',
                input: {
                    questionnaire_id: id,
                    date,
                    time,
                    interval,

                    // completed,
                    // date_completed,
                    // time_completed
                },
            });
        }

        console.log('createScheduleQuestionnaireNew interval && start_date && time', interval, start_date, time)
    }
};
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="onCreatedQuestionnaire">
exports.onCreatedQuestionnaire = async (body) => {
    const data = getTriggeredEventsData(body, "default_contractor_questionnaires");
    if (!data) {
        return;
    }

    let {new_item} = data;
    let {
        id,
        is_template,
        group,
        // "user_id",
        // "interval",
        // "time",
        // "start_date",
        // "contractor_id",
        // "contractor_user_id",
        // "asset_type",
        // "employee_id",
        // "responsible_person_id",
        // "responsible_department_id",
        // "project_id",
        // "asset_id": "asset_id",
        // "client_id": "client_id",
        // "contractor_site_id": "contractor_site_id",
        // "site_id": "site_id",
        // "company_id": "company_id"
        // question_list,
    } = new_item;

    if (is_template) {
        return;
    }

    console.log('onCreatedQuestionnaire', new_item)

    if (group === "Contractors") {
        new_item = await findByIdQuestionnaireContractor(id);
    } else if (group === "Inspections") {
        new_item = await findByIdQuestionnaireInspection(id);
    } else {
        return;
    }

    if (!new_item) {
        return;
    }

    const {
        data: {
            name: formName,
            desc,
            user,
            answered_by,
            page_title_list,
            question_list,
            company,
            client,
        }
    } = new_item;

    console.log('group', group)
    console.log('page_title_list', page_title_list.length)
    console.log('question_list', question_list.length)

    let questionsArray = [
        ...all_question_list(page_title_list),
        ...all_question_list(question_list),
    ];

    console.log('questionsArray', questionsArray.length)

    await Promise.all(
        questionsArray.map(async v => {
            console.log('questionsArray update', JSON.stringify(v));
            return await updateRelay({
                mutation: `
                  mutation updateQuestionMutation($id: default_contractor_questionnaires_ques_pk_columns_input!, $_set: default_contractor_questionnaires_ques_set_input!) {
                    update_default_contractor_questionnaires_ques_by_pk(pk_columns: $id, _set: $_set) {
                      id
                    }
                  }
                `,
                operationName: "updateQuestionMutation",
                id: v.id,
                attrs: {
                    questionnaire_id: id,
                },
            });
        })
    );

    if (group === "Contractors") {
        return onCreatedQuestionnaireContractors({new_item, questionsArray});
    }

    if (group === "Inspections") {
        return onCreatedQuestionnaireInspections({new_item, questionsArray});
    }
};
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="onCreatedQuestionnaireMessage">
exports.onCreatedQuestionnaireMessage = async (body) => {
    const data = getTriggeredEventsData(body, "default_contractor_questionnaires_messages");
    if (!data) {
        return;
    }

    let {new_item} = data;
    let {
        id,
        // msg,
        // date,
        // question_id,
        // "contractor_sender_id": "contractor_sender_id",
        // "sender_id": "sender_id",
        // "recipient_id": "recipient_id",
        // "contractor_recipient_id": "contractor_recipient_id",
        // "read": true,
    } = new_item;

    console.log('onCreatedQuestionnaireMessage', new_item)

    new_item = await findByIdQuestionMessage(id);

    if (!new_item) {
        return;
    }

    const {
        data: {
            msg,
            date,
            read,
            contractor_recipient,
            contractor_sender,
            sender,
            recipient,
            ques,
            ques: {
                questionnaire: {
                    name: formName,
                    desc,
                    user,
                    contractor: {
                        id: contractor_id,
                        name: contractorName,
                        username: contractorUsername,
                        contractor_user_list
                    },
                    answered_by,
                    question_list,
                    company,
                    client,
                }
            }
        }
    } = new_item;

    const ccList = [...contractor_user_list.map(v => v.username)];
    if (user) {
        ccList.push(user.username);
    }
    if (contractor_recipient) {
        ccList.push(contractor_recipient.username);
    }
    if (contractor_sender) {
        ccList.push(contractor_sender.username);
    }
    if (sender) {
        ccList.push(sender.username);
    }
    if (recipient) {
        ccList.push(recipient.username);
    }

    let companyName;
    if (client || user.client) {
        companyName = (client || user.client).name;
    } else {
        companyName = (company || user.company).name;
    }

    const sentByName = (contractor_sender || sender).full_name + " (" + (contractor_sender || sender).username + ")";

    const opts = {
        from: '"SHEQ Aid" <no-reply@sheqsolve.com>',
        to: contractorUsername,
        cc: ccList,
        subject: companyName + ' Questionnaire Chat Message',
        html: `<h3><b>Good Day</b></h3>
      <p>You have been sent the following message on the questionnaire:</p>
      <p>Company: <b>${companyName}</b></p>
      <p>Contractor: <b>${contractorName}</b></p>
      <p>Sent By: <b>${sentByName}</b></p>
      <p>Date Sent: <b>${Dates.formatDate(date)}</b></p>
      <p>Questionnaire: <b>${formName}</b></p>
      <p>Question: <b>${ques.questionText}</b></p>
      <p>Message Details: <b>${msg}</b></p>
      <p>Kind Regards<br/>SHEQ Aid</p>`
    };

    await EmailUtils.send(opts);

    console.log('onCreatedQuestionnaireMessage')
};
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="onUpdatedQuestionnaireStatus">
exports.onUpdatedQuestionnaireStatus = async (body) => {
    const data = getTriggeredEventsData(body, "default_contractor_questionnaires");
    if (!data) {
        return;
    }

    let {new_item, old_item} = data;

    if (!old_item || old_item.is_template) {
        return;
    }

    if (old_item.status === new_item.status && old_item.status_answered_by_sender === new_item.status_answered_by_sender) {
        return;
    }

    let changed_status = old_item.status !== new_item.status;
    let changed_status_answered_by_sender = old_item.status_answered_by_sender !== new_item.status_answered_by_sender;

    if (changed_status) {
        changed_status = new_item.status !== 'New' && new_item.status !== 'Seen';
    }

    if (changed_status_answered_by_sender) {
        changed_status_answered_by_sender = new_item.status_answered_by_sender !== 'New' && new_item.status_answered_by_sender !== 'Seen';
    }

    if (!changed_status && !changed_status_answered_by_sender) {
        return;
    }

    let {
        // id,
        // status,
    } = old_item;
    let {
        id,
        status,
        status_answered_by_sender,
        // "user_id",
        // "interval",
        // "time",
        // "start_date",
        // "contractor_id",
        // "contractor_user_id",
        // "asset_type",
        // "employee_id",
        // "responsible_person_id",
        // "responsible_department_id",
        // "project_id",
        // "asset_id": "asset_id",
        // "client_id": "client_id",
        // "contractor_site_id": "contractor_site_id",
        // "site_id": "site_id",
        // "company_id": "company_id"
        // question_list,
    } = new_item;

    console.log('onUpdatedQuestionnaireStatus', new_item)

    new_item = await findByIdQuestionnaire(id);

    if (!new_item) {
        return;
    }

    const {
        data: {
            name: formName,
            desc,
            user,
            contractor: {id: contractor_id, name: contractorName, username, contractor_user_list},
            answered_by,
            question_list,
            company,
            client,
        }
    } = new_item;

    const ccList = [username, ...contractor_user_list.map(v => v.username)];
    if (user) {
        ccList.push(user.username);
    }

    let companyName;
    if (client || user.client) {
        companyName = (client || user.client).name;
    } else {
        companyName = (company || user.company).name;
    }

    let questionsArray = all_question_list(question_list);
    const total = questionsArray.length;
    const answerCount = questionsArray.filter(v => !!v.answer).length;
    const percOfQuesAnswered = (answerCount / total) * 100;

    const promises = [];

    if (changed_status) {
        switch (new_item.status) {
            case "Seen":
            case "New":
//                        skip this status. no email notification sent;
                break;
            case "CompleteRequested":
                status = "requested";
                break;
            case "CompleteAccepted":
                status = "accepted";
                break;
            case "CompleteDeclined":
                status = "declined";
                break;
        }

        const opts = {
            from: '"SHEQ Aid" <no-reply@sheqsolve.com>',
            to: username,
            cc: ccList,
            subject: contractorName + ' Questionnaire From ' + companyName,
            html: `<h3><b>Good Day</b></h3>      
      <p>Please note that the ${formName} questionnaire completion has been <b>${status}</b>.</p>      
      <hr />      
      <p>Company: <b>${companyName}</b></p>      
      <p>Title: <b>${formName}</b></p>      
      <p>Questions Description: <b>${desc}</b></p>      
      <p>Total No. Of Questions: <b>${total}</b></p>      
      <p>No. Of Questions Required: <b>${questionsArray.filter(v => !!v.isMandatory).length}</b></p>      
      <p>No. Of Questions Optional: <b>${questionsArray.filter(v => !v.isMandatory).length}</b></p>      
      <p>No. Of Questions Answered: <b>${answerCount}</b></p>      
      <p>No. Of Questions Unanswered: <b>${questionsArray.filter(v => !v.answer).length}</b></p>      
      <p>Percentage Of Questions Answered: <b>${percOfQuesAnswered.toFixed(1)}% Complete</b></p>      
      <hr/>      
      <p>Kind Regards<br/>SHEQ Aid</p>
		`
        };

        promises.push(EmailUtils.send(opts));
    }

    if (changed_status_answered_by_sender) {
        switch (new_item.status_answered_by_sender) {
            case "ApprovalRequested":
                status_answered_by_sender = "requested";
                break;
            case "ApprovalAccepted":
                status_answered_by_sender = "accepted";
                break;
            case "ApprovalDeclined":
                status_answered_by_sender = "declined";
                break;
        }

        const opts = {
            from: '"SHEQ Aid" <no-reply@sheqsolve.com>',
            to: username,
            cc: ccList,
            subject: contractorName + ' Questionnaire From ' + companyName,
            html: `<h3><b>Good Day</b></h3>      
      <p>Please note that the ${formName} questionnaire approval has been <b>${status_answered_by_sender}</b>.</p>      
      <hr />      
      <p>Company: <b>${companyName}</b></p>      
      <p>Title: <b>${formName}</b></p>      
      <p>Questions Description: <b>${desc}</b></p>      
      <p>Total No. Of Questions: <b>${total}</b></p>      
      <p>No. Of Questions Required: <b>${questionsArray.filter(v => !!v.isMandatory).length}</b></p>      
      <p>No. Of Questions Optional: <b>${questionsArray.filter(v => !v.isMandatory).length}</b></p>      
      <p>No. Of Questions Answered: <b>${answerCount}</b></p>      
      <p>No. Of Questions Unanswered: <b>${questionsArray.filter(v => !v.answer).length}</b></p>      
      <p>Percentage Of Questions Answered: <b>${percOfQuesAnswered.toFixed(1)}% Complete</b></p>      
      <hr/>      
      <p>Kind Regards<br/>SHEQ Aid</p>
		`
        };

        promises.push(EmailUtils.send(opts));
    }

    await Promise.all(promises);

    console.log('onUpdatedQuestionnaireStatus')
};
// </editor-fold>

//<editor-fold desc="createDateList">
function createDateList(interval, year, startDate) {
    const dates = [];

    let start = new Date(year, startDate.getMonth(), startDate.getDate());

    let n;

    if (interval === 'Daily' || interval === 'Weekly') {
        const end = new Date(year + 1, 0, 0);
        if (interval === 'Daily') {
            n = 1;
        } else if (interval === 'Weekly') {
            n = 7;
        }
        while (start <= end) {
            dates.push(start);
            start = new Date(start.getFullYear(), start.getMonth(), start.getDate() + n);
        }
    } else {
        const end = new Date(year + 6, 0, 0);
        if (interval === 'Annually') {
            n = 1;
            while (start <= end) {
                dates.push(start);
                start = new Date(start.getFullYear() + n, start.getMonth(), start.getDate());
            }
        } else {
            if (interval === 'Monthly') {
                n = 1;
            } else if (interval === 'Quarterly') {
                n = 3;
            } else if (interval === 'Bi-Annually') {
                n = 6;
            }
            while (start <= end) {
                dates.push(start);
                start = new Date(start.getFullYear(), start.getMonth() + n, start.getDate());
            }
        }
    }

    return dates;
}

//</editor-fold>
//674