//<editor-fold desc="getVariablesAndQueryConfig">
exports.getVariablesAndQueryConfig = (
	{
		orgs_filter = [],
		//
		id,
		//
		view,
		//
		training_frequency,
		date,
		subject_list,
		subject_id,
		subject_category_list,
		subject_category,
		trainer_list,
		trainer_id,
		job_position_list,
		job_position_id,
		employee_list,
		//
		training_toolbox_talk_id,
		//
		site_id, project_id, client_id,
		//
		exact_orgs = false,
	}
) => {
	//<editor-fold desc="variables, filters">
	let filterToolboxTalk = orgs_filter || [];//orgsFilter({socket, site_id, project_id, client_id, exact_orgs});
	
	let filter = [];
	
	if (id) {
		filter.push(`id: {_eq: ${id}}`);
	} else {
		if (subject_list) {
			filterToolboxTalk.push(`subject_id: {_in: ${subject_list}}`);
		}
		if (subject_id) {
			filterToolboxTalk.push(`subject_id: {_eq: ${subject_id}}`);
		}
		if (subject_category_list) {
			filterToolboxTalk.push(`subject_category: {_in: ${subject_category_list.map(v => `"${v}"`)}}`);
		}
		if (subject_category) {
			filterToolboxTalk.push(`subject_category: {_eq: "${subject_category}"}`);
		}
		if (training_frequency) {
			filterToolboxTalk.push(`training_frequency: {_eq: "${training_frequency}"}`);
		}
		
		if (view === "Toolbox Talk / Safety Meeting") {
			if (training_toolbox_talk_id) {
				filterToolboxTalk.push(`id: {_eq: ${training_toolbox_talk_id}}`);
			}
			filterToolboxTalk = `,${filterToolboxTalk.join(',')}`;
		} else {
			if (training_toolbox_talk_id) {
				filterToolboxTalk = `,training_toolbox_talk_id: {_eq: ${training_toolbox_talk_id}}`;
			} else {
				filterToolboxTalk = `,training_toolbox_talk: {${filterToolboxTalk.join(',')}}`;
			}
		}
		
		//
		if (date) {
			filter.push(`toolbox_talk_list{date: {_eq: ${date}}}`);
		}
		if (trainer_list) {
			filter.push(`toolbox_talk_list{trainer_id: {_in: ${trainer_list}}}`);
		}
		if (trainer_id) {
			filter.push(`toolbox_talk_list{trainer_id: {_eq: ${trainer_id}}}`);
		}
		if (job_position_list) {
			filter.push(`toolbox_talk_list{job_position_list{job_position_id: {_in: ${job_position_list}}}}`);
		}
		if (job_position_id) {
			filter.push(`toolbox_talk_list{job_position_list{job_position_id: {_eq: ${job_position_id}}}}`);
		}
		if (employee_list) {
			filter.push(`toolbox_talk_list{register_list{employee_id: {_in: ${employee_list}}}}`);
		}
		
		if (!filter.isEmpty()) {
			filter = `,${filter.join(',')}`;
		}
	}
	//</editor-fold>
	
	return {filter, filterToolboxTalk};
};
//</editor-fold>

//<editor-fold desc="training_toolbox_talks_details_fragment">
exports.training_toolbox_talks_details_fragment = `
  id
  training_frequency
  subject{
    id
    name
  }
  subject_category
  toolbox_talk_list{
    id
    date
    time_from
    time_to
    doc
    attendance_register_doc
    institution_conducting_training
    toolbox_talk{
        id
    }
    trainer{
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
    trainer_other{
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
    job_position_list{
        id
        job_position{
            id
            name
        }
    }
    attendance_register_list{
        id
        date
        signature
        toolbox_talk_list{
            id
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
    }
  }
`;
//</editor-fold>

//<editor-fold desc="sheq_training_toolbox_talk_list_details_fragment">
exports.sheq_training_toolbox_talk_list_details_fragment = `
    id
    date
    time_from
    time_to
    doc
    attendance_register_doc
    institution_conducting_training
    toolbox_talk{
        id
    }
    trainer{
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
    trainer_other{
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
    job_position_list{
        id
        job_position{
            id
            name
        }
    }
    attendance_register_list{
        id
        date
        signature
        toolbox_talk_list{
            id
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
    }
    toolbox_talk{
      id
		  training_frequency
		  subject{
		    id
		    name
		  }
		  subject_category
    }
`;
//</editor-fold>
