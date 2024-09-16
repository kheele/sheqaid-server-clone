const {
    onSetCustomUserClaims,
} = require('./api.js');

/**
 * Handles custom user claims assignment based on the provided authentication token and access type.
 * If a socket client for the given access type exists, it emits an event with the authentication data.
 * If no socket client is available, it logs in the user session, processes the user claims, and returns the session details along with custom claims.
 *
 * @param {Object} params - Parameters for the custom user claims assignment.
 * @param {string} params.idToken - The authentication token of the user.
 * @param {string} params.csrfToken - The CSRF token for security verification.
 * @param {string} params.access_type - The type of access (e.g., "ContractorUser", "Staff") used to determine the socket client or processing method.
 * @returns {Promise<Object|null>} - A promise that resolves to an object containing `sessionCookie`, `options`, `decodedIdToken`, and other custom claims, or null if no processing occurs.
 * @throws {Error} - Throws an error if there is an issue with emitting the event or processing the user claims.
 */
global.onSetCustomUserClaims = async ({idToken, csrfToken, access_type}) => {
    const socketClient = {
        'ContractorUser': socketClientContractor, 'Staff': socketClientHR,
    }[access_type];

    if (socketClient) {
        return socketClient.emit('emit', {
            path: 'accounts/onSetCustomUserClaims',
            data: {idToken, csrfToken},
        }).catch(err => {
            console.error('onSetCustomUserClaims', err)
            throw err;
        });
    }

    let res = await loginSession({idToken, csrfToken});//{sessionCookie, options, decodedIdToken}
    // console.log(`/${access_type} decodedIdToken`, decodedIdToken)
    if (!res) return;
    const {sessionCookie, options, decodedIdToken} = res;

    res = await onSetCustomUserClaims(decodedIdToken, access_type);//{loggedUser, customToken, customClaims}
    // console.log('/User data', data)
    return {sessionCookie, options, decodedIdToken, ...res};
};
