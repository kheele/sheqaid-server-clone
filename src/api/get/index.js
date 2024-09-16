const {ENDPOINT_CONTRACTORS, ENDPOINT_HR} = process.env;

/**
 * Retrieves the user UID based on the provided username and access type.
 * If the access type is "ContractorUser", it fetches the UID from the contractor's endpoint.
 * If the access type is "Staff", it currently returns `null` as the HR server is not deployed.
 * For other access types, it fetches the UID using Firebase Authentication based on whether the username is an email or phone number.
 *
 * @param {string} username - The username to search for (can be an email or phone number).
 * @param {string} access_type - The type of access (e.g., "ContractorUser", "Staff") used to determine the query method.
 * @returns {Promise<string|null>} - A promise that resolves to the user's UID or `null` if the user is not found.
 * @throws {Error} - Throws an error if there is an issue with fetching or querying user data.
 */
const getUserUidByUsername = async (username, access_type) => {
    if(access_type === 'ContractorUser') {
        return fetch(`${ENDPOINT_CONTRACTORS}api/callables/get/getUserUidByUsername`, {
            method: "POST",
            body: username,
        }).then(res => res.json());
    }
    if(access_type === 'Staff') {
        return null;//TODO: deploy HR Server
        // return fetch(`${ENDPOINT_HR}api/callables/get/getUserUidByUsername`, {
        //     method: "POST",
        //     body: username,
        // }).then(res => res.json());
    }

    const fnName = username.isEmailAddress() ? 'getUserByEmail' : 'getUserByPhoneNumber';
    try {
        const userRecord = await adminAuth(access_type)[fnName](username);
        if (!userRecord)
            return null;
        const {uid, email, phoneNumber} = userRecord;
        return uid;
    } catch (err) {
        console.error('getUserUidByUsername', err);
        switch (err.code) {
            case 'auth/user-not-found':
                return null;
            default:
                return null;//TODO: Return correct response
        }
    }
};

// <editor-fold defaultstate="collapsed" desc="getUserUidByUsername">
/**
 * Retrieves the user UID based on the provided username and access type, after authorizing the access type.
 *
 * @param {string} username - The username to search for (can be an email or phone number).
 * @param {string} access_type - The type of access (e.g., "ContractorUser", "Staff") used to determine the query method.
 * @returns {Promise<string|null>} - A promise that resolves to the user's UID or `null` if the user is not found.
 * @throws {Error} - Throws an error if there is an issue with authorization or fetching the UID.
 */
global.getUserUidByUsername = async (username, access_type) => {
    await authorize(access_type);
    return getUserUidByUsername(username, access_type);
};
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="getUserUidByEmail">
/**
 * Retrieves the user UID based on the provided email address and access type, after authorizing the access type.
 *
 * @param {string} email - The email address to search for.
 * @param {string} access_type - The type of access (e.g., "ContractorUser", "Staff") used to determine the query method.
 * @returns {Promise<string|null>} - A promise that resolves to the user's UID or `null` if the user is not found.
 * @throws {Error} - Throws an error if there is an issue with authorization or fetching the UID.
 */
global.getUserUidByEmail = async (email, access_type) => {
    await authorize(access_type);
    if (!email.isEmailAddress()) {
        return null;
    }
    return getUserUidByUsername(email, access_type);
};
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="getUserUidByPhone">
/**
 * Retrieves the user UID based on the provided phone number and access type, after authorizing the access type.
 *
 * @param {string} phone - The phone number to search for.
 * @param {string} access_type - The type of access (e.g., "ContractorUser", "Staff") used to determine the query method.
 * @returns {Promise<string|null>} - A promise that resolves to the user's UID or `null` if the user is not found.
 * @throws {Error} - Throws an error if there is an issue with authorization or fetching the UID.
 */
global.getUserUidByPhone = async (phone, access_type) => {
    await authorize(access_type);
    if (phone.isEmailAddress()) {
        return null;
    }
    return getUserUidByUsername(phone, access_type);
};
// </editor-fold>
