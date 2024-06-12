const getName = v => {
	if (!v) {
		return 'N/A';
	}
	
	return v.name;
};

eventManager.on("error-reporting/onCreate", async (socket, input) => {
	if (!input) return;
	
	const {
		message,
		stack,
		error_info,
		//
		access_type,
		//
		company_id,
		client_id,
		project_id,
		site_id,
		selected_client_id,
		selected_project_id,
		selected_site_id,
		//
		contractor_id,
		logged_contractor_id,
		selected_contractor_site_id,
		user_id,
	} = input;
	
	const data = await insertGraphQL({
		mutation: `
			mutation insertErrorReportingMutation($object: default_error_reporting_insert_input!) {
		    insert_default_error_reporting_one(
		      object: $object
		    ) {
		      id
		      #
		      company{
		        name
		      }
		      client{
		        name
		      }
		      project{
		        name
		      }
		      site{
		        name
		      }
		      #
					selected_client{
		        name
		      }
					selected_project{
		        name
		      }
					selected_site{
		        name
		      }
					contractor{
		        name
		      }
					logged_contractor{
		        name
		      }
					selected_contractor_site{
		        name
		      }
					user{
						fname
						lname
						username
					}
		    }
		  }
		`,
		input,
		operationName: "createErrorReporting",
	});
	
	const {
		company,
		client,
		project,
		site,
		selected_client,
		selected_project,
		selected_site,
		contractor,
		logged_contractor,
		selected_contractor_site,
		user = {},
	} = data;
	
	const {data: user_data = {}} = user;
	
	const {fname, lname, username, email} = user_data;
	
	const opts = {
		from: '"SHEQ Aid - Support" <no-reply@sheqsolve.com>',
		to: "support@sheqsolve.com",
		subject: 'Error Reporting',
		html: '<h3>System Error</h3>\n\
                <p><b>------Loaction Details------</b></p>\n\
                <p>Company: ' + getName(company) + '</p>\n\
                <p>Client: ' + getName(client) + '</p>\n\
                <p>Project: ' + getName(project) + '</p>\n\
                <p>Site: ' + getName(site) + '</p>\n\
                <p>Contractor: ' + getName(contractor) + '</p>\n\
                <p><b>------------</b></p>\n\
                <p>Logged Contractor: ' + getName(logged_contractor) + '</p>\n\
                <p>Selected Client: ' + getName(selected_client) + '</p>\n\
                <p>Selected Project: ' + getName(selected_project) + '</p>\n\
                <p>Selected Site: ' + getName(selected_site) + '</p>\n\
                <p>Selected Contractor Site: ' + getName(selected_contractor_site) + '</p>\n\
                <p><b>------User Details------</b></p>\n\
                <p>User:<br/>First Name: ' + (fname || 'N/A') + ',<br/>Last Name: ' + (lname || 'N/A') + ',<br/>Username: ' + (username || 'N/A') + ',<br/>Email Address: ' + (email || 'N/A') + '</p>\n\
                <p><b>------Date & Time Details------</b></p>\n\
                <p>Date & Time: ' + d + '</p>\n\
                <p><b>------Message Details------</b></p>\n\
                <p>' + message + '</p>\n\
                <p><b>------Error Stack Details------</b></p>\n\
                <p>' + stack + '</p>\n\
                <p><b>------Error Info Details------</b></p>\n\
                <p>' + error_info + '</p>'
	};
	
	await EmailUtils.send(opts);
	return true;
});
