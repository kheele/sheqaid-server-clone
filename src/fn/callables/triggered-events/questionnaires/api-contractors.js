const findByIdQuestionnaireContractor = require('../../queries/findByIdQuestionnaireContractor');

// <editor-fold defaultstate="collapsed" desc="onCreatedQuestionnaire">
exports.onCreatedQuestionnaireContractors = async ({new_item, questionsArray}) => {
	const {
		data: {
			name: formName,
			desc,
			user,
			contractor: {id: contractor_id, name: contractorName, username, contractor_user_list},
			answered_by,
			page_title_list,
			question_list,
			company,
			client,
		}
	} = new_item;

	const ccList = [username, ...contractor_user_list.map(v => v.username)];
	if(user) {
		ccList.push(user.username);
	}

	let companyName;
	if(client || user.client) {
		companyName = (client || user.client).name;
	} else {
		companyName = (company || user.company).name;
	}

	const opts = {
		from: '"SHEQ Aid" <no-reply@sheqsolve.com>',
		to: username,
		bcc: ccList,
		subject: contractorName + ' Questionnaire From ' + companyName
	};

	if (answered_by === 'Sender') {
		opts.html = `<h3><b>Good Day</b></h3>
        <p>${contractorName} has been sent ${formName} questionnaire for approval.</p>
        <hr />
        <p>Company: <b>${companyName}</b></p>
        <p>Title: <b>${formName}</b></p>
        <p>Questions Description: <b>${desc}</b></p>
        <p>Total No. Of Questions: <b>${questionsArray.length}</b></p>
        <p>No. Of Questions Required: <b>${questionsArray.filter(v => !!v.isMandatory).length}</b></p>
        <p>No. Of Questions Optional: <b>${questionsArray.filter(v => !v.isMandatory).length}</b></p>
        <hr />
        <p>You will be required to use SHEQ Aid application to approve the questionnaire</p>
        <hr />
        <p>Kind Regards<br/>SHEQ Aid</p>`;
	} else {
		opts.html = `
			<h3><b>Good Day</b></h3>
			<p>${contractorName} has been sent ${formName} questionnaire to answer.</p>
			<hr />
			<p>Company: <b>${companyName}</b></p>
			<p>Title: <b>${formName}</b></p>
			<p>Questions Description: <b>${desc}</b></p>
			<p>Total No. Of Questions: <b>${questionsArray.length}</b></p>
			<p>No. Of Questions Required: <b>${questionsArray.filter(v => !!v.isMandatory).length}</b></p>
			<p>No. Of Questions Optional: <b>${questionsArray.filter(v => !v.isMandatory).length}</b></p>
			<hr />
			<p>You will be required to use SHEQ Aid application to answer the questionnaire</p>
			<hr />
			<p>Kind Regards<br/>SHEQ Aid</p>
		`;
	}

	await EmailUtils.send(opts);

	console.log('onCreatedQuestionnaire')
};
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="onUpdatedQuestionnaireStatus">
exports.onUpdatedQuestionnaireStatus = async (body) => {
	const data = getTriggeredEventsData(body, "default_contractor_questionnaires");
	if(!data){
		return;
	}

	let {new_item, old_item} = data;

	if (!old_item || old_item.is_template) {
		return;
	}

	if(old_item.status === new_item.status && old_item.status_answered_by_sender === new_item.status_answered_by_sender) {
		return;
	}

	let changed_status = old_item.status !== new_item.status;
	let changed_status_answered_by_sender = old_item.status_answered_by_sender !== new_item.status_answered_by_sender;

	if(changed_status){
		changed_status = new_item.status !== 'New' && new_item.status !== 'Seen';
	}

	if(changed_status_answered_by_sender){
		changed_status_answered_by_sender = new_item.status_answered_by_sender !== 'New' && new_item.status_answered_by_sender !== 'Seen';
	}

	if(!changed_status && !changed_status_answered_by_sender) {
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

	new_item = await findByIdQuestionnaireContractor(id);

	if(!new_item) {
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
	if(user) {
		ccList.push(user.username);
	}

	let companyName;
	if(client || user.client) {
		companyName = (client || user.client).name;
	} else {
		companyName = (company || user.company).name;
	}

	let questionsArray = all_question_list(question_list);
	const total = questionsArray.length;
	const answerCount = questionsArray.filter(v => !!v.answer).length;
	const percOfQuesAnswered = (answerCount / total) * 100;

	const promises = [];

	if(changed_status) {
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

	if(changed_status_answered_by_sender) {
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
