const {v4: uuidv4} = require('uuid');
const createImpl = require("../createImpl");
const updateImpl = require("../updateImpl");
const {user_details_fragment: details_fragment} = require("./commons");
const {
    listClientInstalledPermissionModulesAsNewPermissions, listClientInstalledPermissionModules
} = require("../../general/modules/query_modules");
const {listAllPermissionOtherKeysAsNewPermissions} = require("../../general/permissions/other-keys/query_other_keys");

const args = {
    name: "User", tbl: "default_users", details_fragment, uploadUpdate: ({id}) => ({
        new_name: `users/${id}/profile-pic`, key: 'profile_pic',
    }),
};

//<editor-fold desc="signupUser">
exports.signupUser = async (socket, input) => {
    let {
        uid, customToken, fname, lname, username, phone, password, company, company: {
            data: {
                account_type,
                consultant,
                has_projects,
                name,
                phone: company_phone,
                email,
                address,
                category_id,
                country_iso2,
                zone_id,
                city_id,
            }
        }
    } = input;

    let existingUser = await checkByUsernameUser(username);
    if (existingUser) {
        return "EMAIL_DUP";
    }

    existingUser = await checkByPhoneUser(phone);
    if (existingUser) {
        return "PHONE_DUP";
    }

    delete input.password;
    delete input.uid;
    delete input.customToken;

    if (account_type === 'Trial') {
        company.data.trial_start_date = Dates.formatDateSQL(new Date());
        company.data.trial_max_days = 30;
    }

    {
        const module_list = await listClientInstalledPermissionModules(socket);
        company.data.module_list = {
            data: module_list.map(({id}) => ({module_id: id})),
        };
    }

    input.notifications_settings = {
        data: {
            receive_expired_docs_notifs: true, //
            receive_contractor_management_notifs: true,
            receive_asset_management_notifs: true,
            receive_incident_management_notifs: true,
            receive_inspection_management_notifs: true,
            receive_chemicals_management_notifs: true,
            receive_non_conformance_management_notifs: true,
            receive_training_management_notifs: true, //
            receive_employees_profile_notifs: true,
            receive_employees_expired_docs_medicals: true,
        }
    };

    {
        // const permissions_module_list = moduleManager.moduleListInstalledAll.map(({id}) => {
        //     return {module_id: id, actions: {data: {create: true, view: true, edit: true, remove: true, share: true}}};
        // });
        // const permissions_other_list = storage.list.permissionOtherKeys.map(key => {
        //     return {key_id: key.id, actions: {data: {create: true, edit: true, view: true, remove: true, share: true}}};
        // });//{id, key: {id, value}, actions}

        const permissions_module_list = await listClientInstalledPermissionModulesAsNewPermissions(socket);
        const permissions_other_list = await listAllPermissionOtherKeysAsNewPermissions(socket);//{id, key: {id, value}, actions}

        input.permissions_module_list = {
            data: permissions_module_list,
        };
        input.permissions_other_list = {
            data: permissions_other_list
        };
    }

    const create = createImpl(args);
    const newUser = await create(socket, input);
    if (newUser) {
        const {id, data: {username, fname, lname, company}} = newUser;

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

            await SendEmailUtils.sendCreationEmail('UserSignup', {
                companyName: company.name, username, password, fname, lname,
            });

            return newUser;
        };

        if (uid) {
            return onComplete(uid);
        }

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
