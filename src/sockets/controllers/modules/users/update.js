const createImpl = require("../createImpl");
const updateImpl = require("../updateImpl");
const {findByUsernameDuplicateUser, findByPhoneDuplicateUser, findByIdUser} = require("./query_users");

//<editor-fold desc="create">
exports.update = (args) => async (socket, attrs) => {
    const {
        id,
        username,
        phone,
        password_conf,
    } = attrs;

    const item = await findByIdUser(socket, id);
    if (!item) return;

    if (password_conf) {
        delete attrs.password_conf;
    }

    if (username) {
        const existingUser = await findByUsernameDuplicateUser(socket, {id, username});
        if (existingUser) {
            return "EMAIL_DUP";
        }
    }
    if (phone) {
        const existingUser = await findByPhoneDuplicateUser(socket, {id, phone});
        if (existingUser) {
            return "PHONE_DUP";
        }
    }

    if (username || phone) {
        const {session} = socket.request;
        const {decodedIdToken} = session;

        if(!decodedIdToken) return;

        const { company_id, auth_id} = decodedIdToken;

        // const {company_id, user_id} = socket.session;
        // data.user_id = user_id;
        // data.company_id = company_id;

        const {loggedUser, loggedUserAuth, login: {currAuth}} = storage;
        const {email: old_username, phoneNumber: old_phone} = loggedUserAuth;

        const {username: new_username, phone: new_phone} = attrs;
        console.log('users update new_username new_phone', new_username, new_phone)
        if (loggedUser.user.id === id) {
            if (!password_conf) {
                return "PASSWORD_CONF_REQUIRED";
            }

            const updateUsernameImpl = async (fnName, new_value, credental) => {
                try {
                    await loggedUserAuth.reauthenticateWithCredential(credental);
                    try {
                        await loggedUserAuth[fnName](new_value);
                        return new_value;
                    } catch (err) {
                        throw err;
                    }
                } catch (err) {
                    throw err;
                }
            };

            if (username) {
                try {
                    loggedUser.user.data.username = await updateUsernameImpl(
                        'updateEmail',
                        new_username,
                        firebase.auth.EmailAuthProvider.credential(old_username, password_conf)
                    );
                } catch (err) {
                    console.error(err);
                    throw err;
                }
            }
            if (phone) {
                try {
                    loggedUser.user.data.phone = await updateUsernameImpl(
                        'updatePhoneNumber',
                        new_phone,
                        firebase.auth.EmailAuthProvider.credential(old_username, password_conf)
                    );
                } catch (err) {
                    console.error(err);
                    throw err;
                }
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
