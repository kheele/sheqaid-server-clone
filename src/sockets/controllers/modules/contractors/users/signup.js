const {v4: uuidv4} = require('uuid');
const createImpl = require("../../createImpl");
const updateImpl = require("../../updateImpl");
const {user_details_fragment: details_fragment} = require("./commons");
const {orgs_contractor_fragment} = require("../../../../../graphql/Fragments");
const {
    listClientInstalledPermissionModulesAsNewPermissions
} = require("../../../default/modules/query_modules");
const {listAllPermissionOtherKeysAsNewPermissions} = require("../../../default/permissions/other-keys/query_other_keys");

const args = {
    name: "ContractorUser",
    tbl: "default_contractor_users",
    details_fragment,
    orgs_fragment: orgs_contractor_fragment,
    uploadUpdate: ({id}) => ({
        new_name: `contractor-users/${id}/profile-pic`,
        key: 'profile_pic',
    }),
};

//<editor-fold desc="signupContractorUser">
exports.signupContractorUser = async (socket, input) => {
    let {
        fname,
        lname,
        username,
        phone,
        password,
        notifications_settings: {
            data: {
                receive_asset_management_notifs,
                receive_chemicals_management_notifs,
                receive_contractor_management_notifs,
                receive_employees_expired_docs_medicals,
                receive_employees_profile_notifs,
                receive_incident_management_notifs,
                receive_non_conformance_management_notifs,
                receive_training_management_notifs,
                receive_expired_docs_notifs,
            }
        },
        contractor_id,
    } = input;

    const existingUser = await checkByUsernameContractorUser(username);
    if (existingUser) {
        return "EMAIL_DUP";
    }

    delete input.password;

    console.log('contractor signup input', input);

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

    // const loggedUser = await socket.getLoggedUser();
    // if (!loggedUser) return;
    // const { user:{id: user_id}, company:{id: company_id}} = loggedUser;

    // input.user_id = user_id;
    // input.company_id = company_id;

    const create = createImpl(args);
    const newUser = await create(socket, input);
    if (newUser) {
        const {id, data: {username, fname, lname, contractor}} = newUser;

        const onComplete = async (uid, isNew = true) => {
            if (isNew) {
                await adminContractorsAuthGeneral.auth().signOut();
            }

            const update = updateImpl(args);
            const newUser = await update(socket, {
                id, auth_id: uid,
            });

            await SendEmailUtils.sendCreationEmail('ContractorUserSignup',
                {
                    username,
                    fname,
                    lname,
                    contractorName: contractor.name,
                    contractorUsername: contractor.username,
                });

            return newUser;
        };

        try {
            return await adminContractorsAuthGeneral.auth().createUserWithEmailAndPassword(username, password).then(userCredential => userCredential.user.uid).then(onComplete);
        } catch (err) {
            if (err.code === "auth/email-already-in-use") {
                const uid = await getContractorUserUidByUsername(username);
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
