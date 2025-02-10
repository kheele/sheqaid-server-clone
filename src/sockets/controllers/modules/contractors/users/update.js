const updateImpl = require("../../updateImpl");
const {user_details_fragment: details_fragment} = require("./commons");
const {orgs_contractor_fragment} = require("../../../../../graphql/Fragments");
const {findByUsernameDuplicateContractorUser, findByPhoneDuplicateContractorUser} = require("./query_contractor_users");

const args = {
    name: "ContractorUser",
    tbl: "default_contractor_users",
    details_fragment,
    orgs_fragment: orgs_contractor_fragment,
    uploadUpdate: ({id}) => ({
        new_name: `contractor-users/${id}/profile-pic`,
        key: 'profile-pic',
    }),
};

//<editor-fold desc="updateContractorUser">
exports.updateContractorUser = async (socket, attrs) => {
    const {
        id,
        username,
        phone,
        password_conf,
    } = attrs;

    const dbUser = await checkByIdContractorUser(id);
    if (!dbUser) return;

    if (password_conf) {
        delete attrs.password_conf;
    }

    if (username) {
        const existingUser = await findByUsernameDuplicateContractorUser(socket, {id, username});
        if (existingUser) {
            return "EMAIL_DUP";
        }
    }
    if (phone) {
        const existingUser = await findByPhoneDuplicateContractorUser(socket, {id, phone});
        if (existingUser) {
            return "PHONE_DUP";
        }
    }

    if (username || phone) {
        const decodedIdToken = await socket.getDecodedIdToken();
        if (!decodedIdToken) return;
        const {loggedUser, email: old_username, phone_number: old_phone} = decodedIdToken;

        const {username: new_username, phone: new_phone} = attrs;
        console.log('users update new_username new_phone', new_username, new_phone)
        if (loggedUser.user.id === id) {
            if (!password_conf) {
                return "PASSWORD_CONF_REQUIRED";
            }

            const updateUsernameImpl = async (uid, {authProviderType, new_value, old_value}) => {
                try {
                    const verified = await socket.emit('users/reauthenticateWithCredential', {
                        authProviderType,
                        old_value,
                        password_conf,
                    });
                    if(verified === true || verified === 'AUTH_WRONG_PASSWORD') return verified;
                    if(!verified) return 'CANT_UPDATE_OTHER_USER_EMAIL_OR_PHONE';

                    await admin.auth().updateUser(uid, {
                        [authProviderType]: new_value
                    });
                    return new_value;
                } catch (err) {
                    throw err;
                }
            };

            try {
                const verified = await updateUsernameImpl(dbUser.data.auth_id, username ? {
                    authProviderType: 'email',
                    new_value: new_username,
                    old_value: old_username
                } : {
                    authProviderType: 'phone_number',
                    new_value: new_phone,
                    old_value: old_phone
                });

                if(verified === 'AUTH_WRONG_PASSWORD') return verified;
                if(!verified) return;
            } catch (err) {
                console.error(err);
                throw err;
            }
        } else {
            //cant update other user email
            return 'CANT_UPDATE_OTHER_USER_EMAIL_OR_PHONE';
        }
    }

    const update = updateImpl(args);
    return update(socket, {
        ...attrs, id,
    });
};
//</editor-fold>
