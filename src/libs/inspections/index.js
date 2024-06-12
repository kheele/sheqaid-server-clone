
function exec_days(start_date) {
	if(start_date) {
		const lastDate = Dates.getWeeksStartAndEndDateRange(start_date, new Date()).map(({currDate}) => currDate).pop();
		console.log('lastDate', lastDate)//
		if (lastDate) {
			const days = lastDate.durationNextDays(new Date());
			console.log('lastDate', lastDate, days)
			if (days === 0) {
				return Dates.formatDateSQL(lastDate);
			}
			return Dates.formatDateSQL(lastDate.addDays(1));
		}
		return Dates.formatDateSQL(start_date);
	}
}

function exec_weeks(start_date) {
	if(start_date) {
		const lastDate = Dates.getWeeksStartAndEndDateRange(start_date, new Date()).map(({currDate}) => currDate).pop();
		// return Dates.formatDateSQL(lastDate.addWeeks(1));
		return lastDate && Dates.formatDateSQL(lastDate.addDays(7));
	}
}

function exec_months(start_date) {
	if(start_date) {
		const lastDate = Dates.getMonthsStartAndEndDateRange(start_date, new Date()).map(({currDate}) => currDate).pop();
		return lastDate && Dates.formatDateSQL(lastDate.addMonths(1));
	}
}

function exec_quarters(start_date) {
	if(start_date) {
		const lastDate = Dates.getQuartersStartAndEndDateRange(start_date, new Date()).map(({currDate}) => currDate).pop();
		return lastDate && Dates.formatDateSQL(lastDate.addMonths(3));
	}
}

function exec_bi_annuals(start_date) {
	if(start_date) {
		const lastDate = Dates.getHalvesStartAndEndDateRange(start_date, new Date()).map(({currDate}) => currDate).pop();
		return lastDate && Dates.formatDateSQL(lastDate.addMonths(6));
	}
}

function exec_annuals(start_date) {
	if(start_date) {
		const lastDate = Dates.getYearsStartAndEndDateRange(start_date, new Date()).map(({currDate}) => currDate).pop();
		return lastDate && Dates.formatDateSQL(lastDate.addYears(1));
	}
}

exports.create_schedule_date = ({interval, start_date, schedule_date}) => {
	if (schedule_date) {
		schedule_date = Dates.parse(schedule_date);
	}
	
	const now = new Date();
	now.setHours(0);
	now.setMinutes(0);
	now.setSeconds(0);
	
	if (interval === "Daily") {
		if (schedule_date) {
			if(schedule_date < now) {
				return exec_days(schedule_date);
			}
			return Dates.formatDateSQL(schedule_date.addDays(1));
		} else {
			return exec_days(start_date);
		}
	} else if (interval === "Weekly") {
		if (schedule_date) {
			if(schedule_date < now) {
				return exec_weeks(schedule_date);
			}
			
			let days = schedule_date.durationNextDays(new Date());
			if (days === 7) {
				return Dates.formatDateSQL(schedule_date.addWeeks(1));
			}
			const lastDate = Dates.getWeeksStartAndEndDateRange(schedule_date, new Date()).map(({currDate}) => currDate).pop();
			console.log('lastDate', interval, lastDate)
			
			if (!lastDate) return;
			
			days = lastDate.durationNextDays(new Date());
			console.log('lastDate', interval, lastDate, days)
			if (days === 0) {
				return Dates.formatDateSQL(lastDate);
			}
			// return Dates.formatDateSQL(lastDate.addWeeks(1));
			return Dates.formatDateSQL(lastDate.addDays(7));
		} else {
			return exec_weeks(start_date);
		}
	} else if (interval === "Monthly") {
		if (schedule_date) {
			if(schedule_date < now) {
				return exec_months(schedule_date);
			}
			
			let months = schedule_date.durationNextMonths(new Date());
			if (months === 1) {
				return Dates.formatDateSQL(schedule_date.addMonths(1));
			}
			const lastDate = Dates.getMonthsStartAndEndDateRange(schedule_date, new Date()).map(({currDate}) => currDate).pop();
			console.log('lastDate', interval, lastDate)//
			
			if (!lastDate) return;
			
			months = lastDate.durationNextMonths(new Date());
			const days = lastDate.durationNextDays(new Date());
			console.log('lastDate', interval, lastDate, months, days)
			if (months === 0) {
				if (days === 0) {
					return Dates.formatDateSQL(lastDate);
				}
			}
			return Dates.formatDateSQL(lastDate.addMonths(1));
		} else {
			return exec_months(start_date);
		}
	} else if (interval === "Quarterly") {
		if (schedule_date) {
			if(schedule_date < now) {
				return exec_quarters(schedule_date);
			}
			
			let months = schedule_date.durationNextMonths(new Date());
			if (months === 3) {
				return Dates.formatDateSQL(schedule_date.addMonths(3));
			}
			const lastDate = Dates.getQuartersStartAndEndDateRange(schedule_date, new Date()).map(({currDate}) => currDate).pop();
			console.log('lastDate', interval, lastDate)//
			
			if (!lastDate) return;
			
			months = lastDate.durationNextMonths(new Date());
			const days = lastDate.durationNextDays(new Date());
			console.log('lastDate', interval, lastDate, months, days)
			if (months === 0) {
				if (days === 0) {
					return Dates.formatDateSQL(lastDate);
				}
			}
			return Dates.formatDateSQL(lastDate.addMonths(3));
		} else {
			return exec_quarters(start_date);
		}
	} else if (interval === "Bi-Annually") {
		if (schedule_date) {
			if(schedule_date < now) {
				return exec_bi_annuals(schedule_date);
			}
			
			let months = schedule_date.durationNextMonths(new Date());
			if (months === 6) {
				return Dates.formatDateSQL(schedule_date.addMonths(6));
			}
			const lastDate = Dates.getHalvesStartAndEndDateRange(schedule_date, new Date()).map(({currDate}) => currDate).pop();
			console.log('lastDate', interval, lastDate)
			
			if (!lastDate) return;
			
			months = lastDate.durationNextMonths(new Date());
			const days = lastDate.durationNextDays(new Date());
			console.log('lastDate', interval, lastDate, months, days)
			if (months === 0) {
				if (days === 0) {
					return Dates.formatDateSQL(lastDate);
				}
			}
			return Dates.formatDateSQL(lastDate.addMonths(6));
		} else {
			return exec_bi_annuals(start_date);
		}
	} else if (interval === "Annually") {
		if (schedule_date) {
			if(schedule_date < now) {
				return exec_annuals(schedule_date);
			}
			
			let years = schedule_date.durationNextYears(new Date());
			if (years === 1) {
				return Dates.formatDateSQL(schedule_date.addYears(1));
			}
			const lastDate = Dates.getYearsStartAndEndDateRange(schedule_date, new Date()).map(({currDate}) => currDate).pop();
			console.log('lastDate', interval, lastDate)
			
			if (!lastDate) return;
			
			years = lastDate.durationNextYears(new Date());
			const days = lastDate.durationNextDays(new Date());
			console.log('lastDate', interval, lastDate, years, days)
			if (years === 0) {
				if (days === 0) {
					return Dates.formatDateSQL(lastDate);
				}
			}
			return Dates.formatDateSQL(lastDate.addYears(1));
		} else {
			return exec_annuals(start_date);
		}
	}
};

// <editor-fold defaultstate="collapsed" desc="insertInspectionsQuestionnaire">
exports.insertInspectionsQuestionnaire = async (input) => {
	return await insertGraphQL({
		mutation: `
            mutation insertInspectionsQuestionnaireMutation($object: default_contractor_questionnaires_insert_input!) {
                insert_default_contractor_questionnaires_one(
                    object: $object
                ) {
                    id
                }
            }
        `,
		operationName: 'insertInspectionsQuestionnaireMutation',
		input: {
			...input,
			is_template: false,
			group: "Inspections",
			answered_by: "Sender",
		}
	});
};
// </editor-fold>

exports.updateInspectionsQuestionnaire = async (attrs) => {
	const {id} = attrs;
	delete attrs.id;
	
	return updateGraphQL({
		mutation: `
            mutation updateInspectionsQuestionnaireMutation($id: default_contractor_questionnaires_pk_columns_input!, $_set: default_contractor_questionnaires_set_input!) {
                update_default_contractor_questionnaires_by_pk(pk_columns: $id, _set: $_set) {
                    id
                }
            }
        `,
		operationName: 'updateInspectionsQuestionnaireMutation',
		id,
		attrs,
	});
};

// <editor-fold defaultstate="collapsed" desc="getQuestionnaireTemplateForm">
exports.getQuestionnaireTemplateForm = (question_list) => {
	const mapQuestions = (v, n) => {
		delete v.id;
		delete v.open;
		delete v.questionnaire_id;
		
		if (isArray(v.question_list) && v.question_list.isNotEmpty()) {
			delete v.options;
			delete v.notified_list;
			delete v.message_list;
			delete v.ques_path_list;
			
			v.question_list = {data: v.question_list.map(mapQuestions)};
		} else {
			delete v.question_list;
			
			// console.log('questionImage', v.questionImage)
			// if(v.questionImage) {
			//     const {path} = v.questionImage;
			//     v.questionImage = {path: await Utils.toDataURI(path)};
			// }
			
			// console.log('options', v.options)
			if (isArray(v.options) && v.options.isNotEmpty()) {
				v.options = {
					data: v.options,
				};
			} else {
				delete v.options;
			}
			
			// console.log('notified_list', v.notified_list)
			if (isArray(v.notified_list) && v.notified_list.isNotEmpty()) {
				v.notified_list = {
					data: v.notified_list,
				};
			} else {
				delete v.notified_list;
			}
			
			// console.log('ques_path_list', v.ques_path_list)
			// if(isArray(v.ques_path_list) && v.ques_path_list.isNotEmpty()) {
			//     v.ques_path_list = {
			//         data: v.ques_path_list,
			//     };
			// } else {
			//     delete v.ques_path_list;
			// }
			
			v.answer = null;
			v.answer_employee_id = null;
			v.answer_asset_id = null;
			
			v.score = null;
			v.responseAttachment = null;
		}
		return v;
	};
	return question_list.map(mapQuestions);
}
// </editor-fold>


const isSection = (ques) => {
	if (!('question_list' in ques)) return false;
	const {question_list} = ques;
	if (question_list.isEmpty()) return false;
	return true;
}

exports.all_question_list = (question_list) => {
	return question_list.map(v => isSection(v) ? v.question_list : [v]).reduce((a1, a2) => [...a1, ...a2], []).filter(v => v.questionType !== 'NoAnswer');
};
