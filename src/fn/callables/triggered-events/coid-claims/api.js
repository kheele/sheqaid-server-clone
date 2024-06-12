// <editor-fold defaultstate="collapsed" desc="onUpdateCOIDClaim">
exports.onUpdateCOIDClaim = async (body) => {
	const data = getTriggeredEventsData(body, "coida_claims");
	if (!data) {
		return;
	}
	
	const {old_item, new_item} = data;
	let {id, company_id, client_id, claim_number, doctor_email, receipient_coid_provider_id, employee_id, doc,} = new_item;
	
	console.log('onUpdateCOIDClaim', new_item)
	
	if (
		old_item && new_item && (
			old_item.claim_number !== new_item.claim_number
		)
	) {
		if (receipient_coid_provider_id) {
			const receipient_coid_provider = await getRelayOne({
				query: `
					query findByIdCOIDAProviderQuery{
		        default_companies_connection(
		          where: {id: {_eq: ${receipient_coid_provider_id}},},
		        ) {
		          edges {
				        node {
				          id
				          name
				          user_list(where: {receive_claim_notifs: {_eq: true}}){
				            id
				            username
				          }
				        }
				      }
				    }
				  }
				`,
				operationName: 'findByIdCOIDAProviderQuery',
			});
			if (!receipient_coid_provider) {
				return;
			}
			
			const {data: {user_list}} = receipient_coid_provider;
			const emails = user_list.map(v => v.username);
			
			let msg;
			if (!old_item.claim_number && new_item.claim_number) {
				msg = `The claim number <b>(${new_item.claim_number})</b> has been added.`;
			} else if (old_item.claim_number && !new_item.claim_number) {
				msg = `The claim number <b>(${old_item.claim_number})</b> has been removed.`;
			} else if (old_item.claim_number !== new_item.claim_number) {
				msg = `The claim number has been updated from <b>(${old_item.claim_number})</b> to <b>(${new_item.claim_number})</b>.`;
			}
			
			if (!msg) return;
			
			const opts = {
				from: '"SHEQ Aid" <no-reply@sheqsolve.com>',
				bcc: emails.join(','),
				subject: 'SHEQ Aid Notifications (Claim Number Added/Updated)',
				html: `<h3><b>SHEQ Aid User</b></h3>\n
            <p>SHEQ Aid would like to notify you of the following:</p>\n
            <p>${msg}</p>\n
            <p>If you have any questions or concerns, please do not hesitate to contact us.</p>\n
            <p>Thank you for choosing the SHEQ Aid system.</p>\n
            p>If you didn't request this, you can ignore this email or let us know.</p>\n
            <p>Kind Regards<br/>SHEQ Aid</p>`
			};
			
			await EmailUtils.send(opts);
		}
	}
	
	if (
		old_item && new_item && new_item.receipient_coid_provider_id && (
			old_item.receipient_coid_provider_id !== new_item.receipient_coid_provider_id
		)
	) {
		if (receipient_coid_provider_id) {
			const receipient_coid_provider = await getRelayOne({
				query: `
					query findByIdCOIDAProviderQuery{
		        default_companies_connection(
		          where: {id: {_eq: ${new_item.receipient_coid_provider_id}},},
		        ) {
		          edges {
				        node {
				          id
				          name
				          user_list(where: {receive_claim_notifs: {_eq: true}}){
				            id
				            username
				          }
				        }
				      }
				    }
				  }
				`,
				operationName: 'findByIdCOIDAProviderQuery',
			});
			if (!receipient_coid_provider) {
				return;
			}
			
			const employee = await getRelayOne({
				query: `
					query findByIdEmployeeQuery{
		        hr_employees_connection(
		          where: {id: {_eq: ${new_item.employee_id}},},
		        ) {
		          edges {
				        node {
				          id
				          full_name
				          client{
				            id
				            name
				          }
				          project{
				            id
				            name
				          }
				          site{
				            id
				            name
				          }
				        }
				      }
				    }
				  }
				`,
				operationName: 'findByIdEmployeeQuery',
			});
			if (!employee) {
				return;
			}
			
			const {data: {user_list}} = receipient_coid_provider;
			const emails = user_list.map(v => v.username);
			
			const {
				data: {
					full_name,
					company, client, project, site
				}
			} = employee;
			
			const location = (client, project, site) => {
				let v = 'Company: ';
				if (!client) {
					v += `${company.name}<br />`;
				} else {
					v += `${client.name}<br />`;
				}
				
				if (project) {
					v += `Project: ${project.name}<br />`;
				}
				
				if (site) {
					v += `Site: ${site.name}<br />`;
				}
				
				return v;
			};
			
			const opts = {
				from: '"SHEQ Aid" <no-reply@sheqsolve.com>',
				bcc: emails.join(','),
				subject: 'SHEQ Aid Notifications (New Claim Approved)',
				html: `<h3><b>SHEQ Aid User</b></h3>\n
            <p>SHEQ Aid would like to notify you of the following:</p>\n
            <p>${(client || company).name} has approved the claim for <b>${full_name}</p>\n
            <p>Location: ${location(client, project, site)}</p>\n
            <p>If you have any questions or concerns, please do not hesitate to contact us.</p>\n
            <p>Thank you for choosing the SHEQ Aid system.</p>\n
            p>If you didn't request this, you can ignore this email or let us know.</p>\n
            <p>Kind Regards<br/>SHEQ Aid</p>`
			};
			
			await EmailUtils.send(opts);
		}
	}
	
	if (
		(!old_item && new_item && new_item.doctor_email) ||
		(old_item && new_item && (old_item.doctor_email !== new_item.doctor_email))
	) {
		const actionCodeSettings = {
			// URL you want to redirect back to. The domain (www.example.com) for this
			// URL must be in the authorized domains list in the Firebase Console.
			url: `https://forms.sheqaid.com/cm/mcsp/?id=${id}`,
			// This must be true.
			handleCodeInApp: true,
//    dynamicLinkDomain: 'forms.sheqaid.com'
		};
		admin.auth().sendSignInLinkToEmail(new_item.doctor_email, actionCodeSettings).then(() => {
			// The link was successfully sent. Inform the user.
			// Save the email locally so you don't need to ask the user for it again
			// if they open the link on the same device.
//    window.localStorage.setItem('emailForSignIn', doctor_email);
			// ...
			console.log('sendSignInLinkToEmail', new_item.doctor_email)
		}).catch((err) => {
			const {code, message} = err;
			console.error(err)
		});
	}
};
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="uploadCOIDClaimWCI2">
exports.uploadCOIDClaimWCI2 = async (body) => {
	const data = getTriggeredEventsData(body, "coida_claims_wcl_2");
	if (!data) {
		return;
	}

	const {new_item} = data;
	let {id, doc_certified_id, doc_salary_slip} = new_item;

	console.log('uploadCOIDClaimWCI2', new_item)

	{
		const new_name = `coid-claims/wcl2/${id}/doc-certified-id-docs`;
		await uploadFilesUpdate({
			id, doc_certified_id, key: "doc_certified_id", new_name, onUpdate: async ({id, ...attrs}) => {
				delete attrs.id;

				await updateRelay({
					mutation: `
			    mutation updateCOIDClaimWCI2DocMutation($id: coida_claims_wcl_2_pk_columns_input!, $_set: coida_claims_wcl_2_set_input!) {
			      update_coida_claims_wcl_2_by_pk(pk_columns: $id, _set: $_set) {
			        id
			      }
			    }
			  `,
					operationName: "updateCOIDClaimWCI2DocMutation",
					id,
					attrs,
				});
			}
		});
	}

	{
		const new_name = `coid-claims/wcl2/${id}/doc-salary-slip-docs`;
		await uploadFilesUpdate({
			id, doc_salary_slip, key: "doc_salary_slip", new_name, onUpdate: async ({id, ...attrs}) => {
				delete attrs.id;

				await updateRelay({
					mutation: `
						mutation updateCOIDClaimWCI2DocMutation($id: coida_claims_wcl_2_pk_columns_input!, $_set: coida_claims_wcl_2_set_input!) {
						  update_coida_claims_wcl_2_by_pk(pk_columns: $id, _set: $_set) {
							id
						  }
						}
					`,
					operationName: "updateCOIDClaimWCI2DocMutation",
					id,
					attrs,
				});
			}
		});
	}
};
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="uploadCOIDClaimWCI4">
exports.uploadCOIDClaimWCI4 = async (body) => {
	const data = getTriggeredEventsData(body, "coida_claims_wcl_4");
	if (!data) {
		return;
	}

	const {new_item} = data;
	let {id, x_rays_report, external_doc} = new_item;

	console.log('uploadCOIDClaimWCI4', new_item)

	{
		const new_name = `coid-claims/wcl4/${id}/external-docs`;
		await uploadFilesUpdate({
			id, external_doc, key: "external_doc", new_name, onUpdate: async ({id, ...attrs}) => {
				delete attrs.id;

				await updateRelay({
					mutation: `
			    mutation updateCOIDClaimWCI4DocMutation($id: coida_claims_wcl_4_pk_columns_input!, $_set: coida_claims_wcl_4_set_input!) {
			      update_coida_claims_wcl_4_by_pk(pk_columns: $id, _set: $_set) {
			        id
			      }
			    }
			  `,
					operationName: "updateCOIDClaimWCI4DocMutation",
					id,
					attrs,
				});
			}
		});
	}

	{
		const new_name = `coid-claims/wcl4/${id}/x-rays-report-docs`;
		await uploadFilesUpdate({
			id, x_rays_report, key: "x_rays_report", new_name, onUpdate: async ({id, ...attrs}) => {
				delete attrs.id;

				await updateRelay({
					mutation: `
			    mutation updateCOIDClaimWCI4DocMutation($id: coida_claims_wcl_4_pk_columns_input!, $_set: coida_claims_wcl_4_set_input!) {
			      update_coida_claims_wcl_4_by_pk(pk_columns: $id, _set: $_set) {
			        id
			      }
			    }
			  `,
					operationName: "updateCOIDClaimWCI4DocMutation",
					id,
					attrs,
				});
			}
		});
	}
};
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="uploadCOIDClaimWCI5">
exports.uploadCOIDClaimWCI5 = async (body) => {
	const data = getTriggeredEventsData(body, "coida_claims_wcl_5");
	if (!data) {
		return;
	}

	const {new_item} = data;
	let {id, external_doc} = new_item;

	console.log('uploadCOIDClaimWCI5', new_item)

	const new_name = `coid-claims/wcl5/${id}/external-docs`;
	await uploadFilesUpdate({
		id, external_doc, key: "external_doc", new_name, onUpdate: async ({id, ...attrs}) => {
			delete attrs.id;

			await updateRelay({
				mutation: `
			    mutation updateCOIDClaimWCI5DocMutation($id: coida_claims_wcl_5_pk_columns_input!, $_set: coida_claims_wcl_5_set_input!) {
			      update_coida_claims_wcl_5_by_pk(pk_columns: $id, _set: $_set) {
			        id
			      }
			    }
			  `,
				operationName: "updateCOIDClaimWCI5DocMutation",
				id,
				attrs,
			});
		}
	});
};
// </editor-fold>
