const CustomUserClaims = require('../../fn/callables/graphql/CustomUserClaims');
const updateUser = require("../../fn/callables/queries/updateUser");
const CheckUserByResetPassId = require("../../fn/callables/graphql/CheckUserByResetPassId");

//<editor-fold desc="convertIdToBigint">
/**
 * Converts a Hasura Relay ID into a BigInt database ID.
 * If the input is already a number, returns it as-is.
 * If the input is a string, decodes it from Base64 and extracts the actual database ID.
 *
 * @param {string|number} encodedHasuraRelayID - The encoded Hasura Relay ID or a number.
 * @returns {number|string} - The actual database ID or the original input if decoding fails.
 */
global.convertIdToBigint = (encodedHasuraRelayID) => {
    try {
        if (isNumber(encodedHasuraRelayID)) return encodedHasuraRelayID;

        const decodedRelayID = atob(encodedHasuraRelayID);
        const relayIdAsArray = JSON.parse(decodedRelayID);
        const actualDatabaseID = relayIdAsArray[3];
        // console.log(decodedRelayID); // "[1, \"lifeplan\", \"status_plan_header\", 1]"
        // console.log(relayIdAsArray); // [1, "lifeplan", "status_plan_header", 1]
        // console.log(actualDatabaseID); // 1  (the actual database ID)!
        return actualDatabaseID;
    } catch(err) {
        // console.error('convertIdToBigint', encodedHasuraRelayID, err);
        return encodedHasuraRelayID;
    }
};
//</editor-fold>

// <editor-fold defaultstate="collapsed" desc="onSetCustomUserClaims">
/**
 * Sets custom user claims based on the provided access type.
 * Queries user data from the database, processes the user data, and assigns custom claims.
 *
 * @param {Object} decodedIdToken - The decoded authentication token containing user information.
 * @param {string} access_type - The type of access (e.g., "User", "ContractorUser", "Staff") used to determine the query and claims.
 * @returns {Promise<Object|null>} - A promise that resolves to an object with `loggedUser`, `customToken`, and `customClaims`, or null in case of error.
 */
exports.onSetCustomUserClaims = async (decodedIdToken, access_type) => {
    await authorize(access_type);

    const queryData = CustomUserClaims[access_type];
    if (!queryData) {
        return null;
    }

    const {query, operationName} = queryData;

    // console.log('onSetCustomUserClaims decodedIdToken', decodedIdToken)
    if (!decodedIdToken) return null;

    const {uid} = decodedIdToken;

    const item = await getRelayOne({
        query,
        operationName,
        variables: {auth_id: uid},
    });
    // console.log('onSetCustomUserClaims item', item)
    if (!item) {
        return null;
    }

    const loggedUser = {user: item};

    const {
        data: user_data,
        data: {
            company,
            contractor,
            client: my_client,
            project: my_project,
            site: my_site,
        }
    } = loggedUser.user;
    company && (company.id = convertIdToBigint(company.id));
    contractor && (contractor.id = convertIdToBigint(contractor.id));

    my_client && (my_client.id = convertIdToBigint(my_client.id));
    my_project && (my_project.id = convertIdToBigint(my_project.id));
    my_site && (my_site.id = convertIdToBigint(my_site.id));

    my_client && (user_data.client = my_client);
    my_project && (user_data.project = my_project);
    my_site && (user_data.site = my_site);

    if(company) {
        loggedUser.company = {id: company.id, data: company};
    }

    if (access_type === 'User') {
        // if (await isDBCOIDProvider(user_access_type, company_id) || (my_client && await isDBCOIDProvider(user_access_type, my_client.id))) {
        //     access_type = 'COID Provider';
        // } else if (await isDBMedicalCenterProvider(user_access_type, company_id) || (my_client && await isDBMedicalCenterProvider(user_access_type, my_client.id))) {
        //     access_type = 'MedicalPractitioner';
        // }
    }

    const currentCustomClaims = {
        access_type,
        company_id: company && company.id,
        loggedUser: {
            user: {id: user_data.id, auth_id: user_data.auth_id},
            // company: {id: company.id},
        },
    };

    if(company) {
        currentCustomClaims.loggedUser.company = {
            id: company.id,
        };
        currentCustomClaims.isNoProjects = company.no_projects;
        currentCustomClaims.isConsultant = company.consultant;
    }

    if (access_type === 'ContractorUser' || contractor) {
        currentCustomClaims.isContractor = true;
        currentCustomClaims.contractor_id = contractor.id;
    }

    if (my_client) {
        currentCustomClaims.my_client = {id: my_client.id};
    }
    if (my_project) {
        currentCustomClaims.my_project = {id: my_project.id};
    }
    if (my_site) {
        currentCustomClaims.my_site = {id: my_site.id};
    }

    console.log('currentCustomClaims', JSON.stringify(currentCustomClaims).length, JSON.stringify(currentCustomClaims))
    return addCustomUserClaims(uid, currentCustomClaims, access_type).then(async () => {
        try {
            const customToken = await createCustomToken(uid, {access_type});
            return {loggedUser, customToken, customClaims: currentCustomClaims};
        } catch (err) {
            console.error(err)
            return "ERR_CREATING_TOKEN";
        }
    });
};
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="onResetPassword">
/**
 * Resets the user password based on the reset token and updates the user record in the database.
 *
 * @param {Object} data - The data object containing the reset password ID and new password.
 * @param {string} access_type - The type of user access (e.g., "User", "ContractorUser", "Staff").
 * @returns {Promise<string|boolean|null>} - A promise that resolves to true if the password is successfully reset, or returns an error message.
 */
exports.onResetPassword = async (data, access_type) => {
    await authorize(access_type);

    if (!data)
        return null;
    if (!isObject(data))
        return null;

    const {id: reset_password_id, password} = data;
    if (!reset_password_id)
        return null;
    if (!password)
        return null;

    const queryData = CheckUserByResetPassId[access_type];
    if (!queryData) {
        return null;
    }

    const item = await getRelayOne({
        ...queryData,
        variables: {reset_password_id},
    });
    console.log('CheckUserByResetPassId item', item)
    if (!item) {
        return "TOKEN_NOT_FOUND";
    }

    const {id, data: {auth_id, email, phone}} = item;

    const _auth = adminAuth(access_type);

    let promise;
    if (access_type === 'Staff') {
        if(auth_id) {
            promise = _auth.getUser(auth_id);
        } else if (phone) {
            promise = _auth.getUserByPhoneNumber(phone);
        } else if (email) {
            promise = _auth.getUserByEmail(email);
        } else {
            return null;
        }
    } else {
        promise = _auth.getUser(auth_id);
    }

    return promise.then(async (userRecord) => {
        const {uid, email, phoneNumber} = userRecord;

        try {
            const res = await updateUser({id, attrs: {reset_password_id: null}, access_type});
            if (!res) {
                return null;
            }
            if (res === "NO_DB_USER") {
                return res;
            }
        } catch (err) {
            return "UDATE_ERROR";
        }

        // console.log('onResetPassword', access_type, userRecord.changePassword, userRecord.updatePassword);

        try {
            await _auth.updateUser(uid, {password});
            console.log('onResetPassword success')
            return true;
        } catch (err) {
            console.log('onResetPassword err 2', err.message)
            const res = await updateUser({id, attrs: {reset_password_id}, access_type});
            if (!res) {
                return null;
            }
            if (res === "NO_DB_USER") {
                return res;
            }

            return "UPDATE_ERROR";
        }
    });
};
// </editor-fold>
