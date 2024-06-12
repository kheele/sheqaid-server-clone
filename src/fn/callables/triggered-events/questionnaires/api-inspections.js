const findByIdQuestionnaireInspection = require('../../queries/findByIdQuestionnaireInspection');
const {
	create_schedule_date, updateInspectionsQuestionnaire, all_question_list,
} = require("../../../../libs/inspections");

// <editor-fold defaultstate="collapsed" desc="onCreatedQuestionnaire">
exports.onCreatedQuestionnaireInspections = async ({new_item, questionsArray}) => {
	let {
		id,
		data: {
			name: formName,
			desc,
			user,
			// contractor: {id: contractor_id, name: contractorName, username, contractor_user_list},
			answered_by,
			page_title_list,
			question_list,
			interval,
			start_date,
			schedule_date,
			company,
			client,
		}
	} = new_item;
	
	if (!schedule_date && start_date) {
		const prev_schedule_date = schedule_date;
		schedule_date = create_schedule_date({interval, start_date, schedule_date});
		console.log('scheduling:', id, interval, start_date, prev_schedule_date, schedule_date);
		if (!schedule_date) {
			return;
		}
		
		const savedItem = await updateInspectionsQuestionnaire({id, schedule_date});
		
		// schedule_date = create_schedule_date({interval, schedule_date});
		// if (schedule_date) {
		//     question_list = getQuestionnaireTemplateForm(question_list);
		//
		//     const input = {
		//         company_id,
		//         client_id,
		//         project_id,
		//         site_id,
		//         //
		//         contractor_id,
		//         contractor_client_id,
		//         contractor_site_id,
		//         //
		//         status_answered_by_sender,
		//         answered_by,
		//         visibility,
		//         //
		//         asset_type,
		//         asset_id,
		//         //
		//         responsible_person_id,
		//         responsible_department_id,
		//         interval,
		//         start_date,
		//         time,
		//         //
		//         schedule_date,
		//         //
		//         template_id,
		//         //
		//         name,
		//         desc,
		//         question_list: {data: question_list},
		//     };
		//
		//     const scheduledItem = await insertInspectionsQuestionnaire({...input, ques_prev_id: id, schedule_date});
		//     console.log('scheduledItem', scheduledItem);
		//     if (scheduledItem) {
		//         return updateInspectionsQuestionnaire({id, ques_next_id: scheduledItem.id}).
		//         then(_ => scheduledItem);
		//     }
		// }
	}
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
	
	new_item = await findByIdQuestionnaireInspection(id);
	
	if (!new_item) {
		return;
	}
	
	const {
		data: {
			//
			company,
			client,
			project,
			site,
			contractor,
			//
			user,
			//
			name: formName,
			desc,
			answered_by,
			question_list,
			responsible_person,
			asset, asset: {asset_detail},
		}
	} = new_item;
	
	//
	
	let questionsArray = all_question_list(question_list);
	const total = questionsArray.length;
	const answerCount = questionsArray.filter(v => !!v.answer).length;
	const percOfQuesAnswered = (answerCount / total) * 100;
	
	const emails = [];
	if (responsible_person) {
		emails.push(responsible_person.email);
	}
	
	const promises = [];
	
	if(contractor) {
		emails.push(...contractor.contractor_user_list.map(v => v.username));
		
		if (site && site.user_list) {
			emails.push(...site.user_list.map(v => v.username));
		}
		if (project && project.user_list) {
			emails.push(...project.user_list.map(v => v.username));
		}
		if (client && client.user_list) {
			emails.push(...client.user_list.map(v => v.username));
		}
		if (company && company.user_list) {
			emails.push(...company.user_list.map(v => v.username));
		}
		
		//
		
		//TODO: Fix contractor company
		let companyName;
		if (contractor.client) {
			companyName = contractor.client.name;
		} else {
			companyName = contractor.company.name;
		}
		
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
				bcc: emails.distinct().join(','),
				subject: companyName + ' Inspection Conducted by ' + responsible_person.full_name,
				html: `<h3><b>Good Day</b></h3>
				      <p>Please note that the ${asset_detail.name} inspection has been completed.</p>
				      <hr />
				      <p>Contractor: <b>${contractor.name}</b></p>
				      <p>Company: <b>${companyName}</b></p>
				      <p>Project: <b>${project && project.name || 'N/A'}</b></p>
				      <p>Site: <b>${site && site.name || 'N/A'}</b></p>
				      <p>Asset ID: <b>${asset.id}</b></p>
				      <p>Asset Type: <b>${asset_detail.asset_type}</b></p>
				      <p>Asset Name: <b>${asset_detail.name}</b></p>
				      <p>Registarion No.: <b>${asset_detail.reg_num}</b></p>
				      <p>Serial No.: <b>${asset_detail.serial_num}</b></p>
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
				bcc: emails.distinct().join(','),
				subject: companyName + ' Inspection Conducted by ' + responsible_person.full_name,
				html: `<h3><b>Good Day</b></h3>
      <p>Please note that the ${asset_detail.name} inspection has been completed.</p>
			<hr />
			<p>Company: <b>${companyName}</b></p>
			<p>Project: <b>${project && project.name || 'N/A'}</b></p>
			<p>Site: <b>${site && site.name || 'N/A'}</b></p>
			<p>Asset ID: <b>${asset.id}</b></p>
			<p>Asset Type: <b>${asset_detail.asset_type}</b></p>
			<p>Asset Name: <b>${asset_detail.name}</b></p>
			<p>Registarion No.: <b>${asset_detail.reg_num || 'N/A'}</b></p>
			<p>Serial No.: <b>${asset_detail.serial_num || 'N/A'}</b></p>
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
	} else {
		if (site && site.user_list) {
			emails.push(...site.user_list.map(v => v.username));
		}
		if (project && project.user_list) {
			emails.push(...project.user_list.map(v => v.username));
		}
		if (client && client.user_list) {
			emails.push(...client.user_list.map(v => v.username));
		}
		if (company && company.user_list) {
			emails.push(...company.user_list.map(v => v.username));
		}
		
		//
		
		let companyName;
		if (client || responsible_person.client || user.client) {
			companyName = (client || user.client).name;
		} else {
			companyName = (company || responsible_person.company || user.company).name;
		}
		
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
				bcc: emails.distinct().join(','),
				subject: companyName + ' Inspection Conducted by ' + responsible_person.full_name,
				html: `<h3><b>Good Day</b></h3>
				      <p>Please note that the ${asset_detail.name} inspection has been completed.</p>
				      <hr />
				      <p>Company: <b>${companyName}</b></p>
				      <p>Project: <b>${project && project.name || 'N/A'}</b></p>
				      <p>Site: <b>${site && site.name || 'N/A'}</b></p>
				      <p>Asset ID: <b>${asset.id}</b></p>
				      <p>Asset Type: <b>${asset_detail.asset_type}</b></p>
				      <p>Asset Name: <b>${asset_detail.name}</b></p>
				      <p>Registarion No.: <b>${asset_detail.reg_num}</b></p>
				      <p>Serial No.: <b>${asset_detail.serial_num}</b></p>
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
				bcc: emails.distinct().join(','),
				subject: companyName + ' Inspection Conducted by ' + responsible_person.full_name,
				html: `<h3><b>Good Day</b></h3>
      <p>Please note that the ${asset_detail.name} inspection has been completed.</p>
			<hr />
			<p>Company: <b>${companyName}</b></p>
			<p>Project: <b>${project && project.name || 'N/A'}</b></p>
			<p>Site: <b>${site && site.name || 'N/A'}</b></p>
			<p>Asset ID: <b>${asset.id}</b></p>
			<p>Asset Type: <b>${asset_detail.asset_type}</b></p>
			<p>Asset Name: <b>${asset_detail.name}</b></p>
			<p>Registarion No.: <b>${asset_detail.reg_num || 'N/A'}</b></p>
			<p>Serial No.: <b>${asset_detail.serial_num || 'N/A'}</b></p>
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
	}
	
	await Promise.all(promises);
	
	console.log('onUpdatedQuestionnaireStatus')
};
// </editor-fold>
