const findByIdImpl = require("../../modules/findByIdImpl");
const path = "files";

eventManager.on(`${path}/upload`, async (socket, data) => {
	if(!data) return;

	console.log(`${path}/upload data`, data)

	const {role, id, path: f} = data;

	const key = role === 'AdminUser' || role === 'User' || role === 'Staff' ? "profile_pic" :
		role === 'Contractor' || role === 'Client' ? "profile_pic" : null;
	const tbl = role === 'AdminUser' ? "admin_users" :
		role === 'User' ? "default_users" : role === 'Staff' ? "hr_employees" :
		role === 'Contractor' ? "default_contractors" : role === 'Client' ? "default_clients" : null;

	const input = {
		[key]: f,
	};

	const new_name = "profile-pic";
	const name = "UploadFile";

	await upload({input, id, tbl, new_name, name, key});

	const findById = findByIdImpl({
		name,
		tbl,
		details_fragment: `
			id
			${key}
		`,
		orgs_fragment: null,
	});
	return findById(socket, id);
});

async function upload({input, id, tbl, new_name, name, key}) {
	const docKey = key || 'doc';
	let { [docKey]: doc } = input;

	if (doc) {
		await uploadFilesUpdate({
			id,
			doc,
			new_name,
			onUpdate: async ({ id, ...attrs }) => {
				delete attrs.id;

				await updateRelay({
					mutation: `
                        mutation update${name}Mutation($id: ${tbl}_pk_columns_input!, $_set: ${tbl}_set_input!) {
                            update_${tbl}_by_pk(pk_columns: $id, _set: $_set) {
                                id
                            }
                        }
                    `,
					operationName: `update${name}Mutation`,
					id,
					attrs,
				});
			}
		});
	}
}