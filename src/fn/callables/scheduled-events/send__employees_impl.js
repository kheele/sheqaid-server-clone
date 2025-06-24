//<editor-fold desc="sendImpl">
exports.sendImpl = async (user_list, send_final) => {
	for (let j = 0; j < user_list.length; j++) {
		const user = user_list[j];
		const {
			id,
			data:{
				email,
				fname,
				lname,
				company,
				client,
				project,
				site,
			}
		} = user;

		if(!email) return;

		const name = `${fname} ${lname}`;
		const company_name = (site || project || client) ? client.name : company.name;

		if(site) {
			await send_final({email, name, company_name, item: site});
		} else if(project) {
			await send_final({email, name, company_name, item: project});
		} else if(client) {
			await send_final({email, name, company_name, item: client});
		} else {
			await send_final({email, name, company_name, item: company});
		}
	}
};
//</editor-fold>
