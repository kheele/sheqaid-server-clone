const { v4: uuidv4 } = require('uuid');
const createImpl = require("../../modules/createImpl");
const updateImpl = require("../../modules/updateImpl");
const {user_details_fragment: details_fragment} = require("./commons");

const args = {
    name: "User",
    tbl: "default_users",
    details_fragment,
    uploadUpdate: ({id}) => ({
        new_name: `users/${id}/profile-pic`,
        key: 'profile_pic',
    }),
};

//<editor-fold desc="createUser">
exports.createUser = async (socket, input) => {
    let {
        //
        linked_employee_id,
        //
        profile_pic,
        fname,
        lname,
        username,
        auth_type = 'MultiFactor',
        //
        receive_asset_management_notifs,
        receive_chemicals_management_notifs,
        receive_contractor_management_notifs,
        receive_employees_expired_docs_medicals,
        receive_employees_profile_notifs,
        receive_incident_management_notifs,
        receive_inspection_management_notifs,
        receive_non_conformance_management_notifs,
        receive_training_management_notifs,
        receive_expired_docs_notifs,
        //
        site,
        project,
        client,
        blacklisted_client_list,
        blacklisted_project_list,
        blacklisted_site_list,
        permissions_modules_sheq,
        permissions_modules_hr,
        permissions_modules_claims,
        permissions_modules_extra,
        permissions_other_list,
    } = input;

    const existingUser = await checkByUsernameUser(username);
    if (existingUser) {
        return "EMAIL_DUP";
    }

    console.log('input', input);

    // console.log('permissions_modules_sheq', permissions_modules_sheq);
    // console.log('permissions_modules_hr', permissions_modules_hr);
    // console.log('permissions_modules_claims', permissions_modules_claims);
    // console.log('permissions_modules_extra', permissions_modules_extra);

    let __permissions_modules_sheq = [];
    let __permissions_modules_hr = [];
    let __permissions_modules_claims = [];
    let __permissions_modules_extra = [];
    if (permissions_modules_sheq) {
        __permissions_modules_sheq = permissions_modules_sheq.list || permissions_modules_sheq;
    }
    if (permissions_modules_hr) {
        __permissions_modules_hr = permissions_modules_hr.list || permissions_modules_hr;
    }
    if (permissions_modules_claims) {
        __permissions_modules_claims = permissions_modules_claims.list || permissions_modules_claims;
    }
    if (permissions_modules_extra) {
        __permissions_modules_extra = permissions_modules_extra.list || permissions_modules_extra;
    }

    // console.log('permissions_other_list', permissions_other_list);
    let __permissions_other_list = [];
    if (permissions_other_list) {
        __permissions_other_list = permissions_other_list.list || permissions_other_list;
    }

    const data = {
        fname,
        lname,
        username: username.toLowerCase(),
        auth_type,
        linked_employee_id,
        site_id: site && site.id,
        project_id: project && project.id,
        client_id: client && client.id,
        blacklisted_client_list: {data: (blacklisted_client_list || []).map(({id: client_id}) => ({client_id}))},
        blacklisted_project_list: {data: (blacklisted_project_list || []).map(({id: project_id}) => ({project_id}))},
        blacklisted_site_list: {data: (blacklisted_site_list || []).map(({id: site_id}) => ({site_id}))},
        notifications_settings: {
            data: {
                receive_asset_management_notifs,
                receive_chemicals_management_notifs,
                receive_contractor_management_notifs,
                receive_employees_expired_docs_medicals,
                receive_employees_profile_notifs,
                receive_incident_management_notifs,
                receive_inspection_management_notifs,
                receive_non_conformance_management_notifs,
                receive_training_management_notifs,
                receive_expired_docs_notifs,
            }
        },
        permissions_module_list: {
            data: [
                ...__permissions_modules_sheq,
                ...__permissions_modules_hr,
                ...__permissions_modules_claims,
                ...__permissions_modules_extra,
            ].map(({module, actions}) => ({module_id: convertIdToBigint(module.id), actions: {data: {...actions}}}))
        },
        permissions_other_list: {
            data: __permissions_other_list
                .map(({key, actions}) => ({key_id: convertIdToBigint(key.id), actions: {data: {...actions}}}))
        },
    };

    const loggedUser = await socket.getLoggedUser();
    if(!loggedUser) return;
    const { user:{id: user_id}, company:{id: company_id}} = loggedUser;

    data.user_id = user_id;
    data.company_id = company_id;

    const create = createImpl(args);
    const newUser = await create(socket, data);
    if (newUser) {
        if (linked_employee_id) {
            const _updateEmployee = updateImpl({
                name: "Employees",
                tbl: "hr_employees",
                details_fragment: `
                    id
                `,
            });

            await _updateEmployee(socket, {
                id: linked_employee_id,
                linked_user_id: newUser.id,
            });
        }

        const {id, data: {username, fname, lname, company}} = newUser;

        let password = uuidv4();
        password = password.substring(0, password.indexOf('-'));

        const onComplete = async (uid, isNew = true) => {
            if (isNew) {
                await admin.auth(adminAuthGeneral).revokeRefreshTokens(uid).then(() => {
                    console.log(`Tokens for user ${uid} have been revoked.`);
                }).catch((error) => {
                    console.error('Error revoking tokens:', error);
                });
            }

            const update = updateImpl(args);
            const newUser = await update(socket, {
                id, auth_id: uid,
            });

            await SendEmailUtils.sendCreationEmail('UserCreate',
                {companyName: company.name, username, password, fname, lname});

            return newUser;
        };

        try {
            return await admin.auth(adminAuthGeneral).createUser({
                email: username,
                emailVerified: false,
                password,
                disabled: false,
            }).then(user => user.uid).then(onComplete);
        } catch (err) {
            if (err.code === "auth/email-already-in-use") {
                const uid = await getUserUidByUsername(username);
                if (uid) {
                    return onComplete(uid, false);
                }
            } else {
                console.error(err);
                throw err;
            }
        }
    }
};
//</editor-fold>
