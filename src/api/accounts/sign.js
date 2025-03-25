const CustomUserClaims = require("../../fn/callables/graphql/CustomUserClaims");

/**
 * Signs out a user based on the provided session and access type.
 * If the access type is "ContractorUser" or "Staff", it emits an event through the appropriate socket client.
 * For other access types, it revokes the user's refresh tokens and ends the session.
 *
 * @param {Object} params - Parameters for signing out the user.
 * @param {Object} params.session - The session object to destroy (if applicable).
 * @param {string} params.sessionCookie - The session cookie to verify and revoke.
 * @param {string} params.access_type - The type of access (e.g., "ContractorUser", "Staff") used to determine the socket client or processing method.
 * @returns {Promise<boolean>} - A promise that resolves to `true` if the sign-out process is successful.
 * @throws {Error} - Throws an error if there is an issue with emitting the event or revoking tokens.
 */
global.signOut = async ({session, sessionCookie, access_type}) => {
    if (access_type === 'ContractorUser') {
        return socketClientContractor.emit('emit', {
            path: 'accounts/sign/out',
        }).catch(err => {
            console.error('signOut', err)
            throw err;
        });
    }
    if (access_type === 'Staff') {
        return socketClientHR.emit('emit', {
            path: 'accounts/sign/out',
        }).catch(err => {
            console.error('signOut', err)
            throw err;
        });
    }

    const _auth = admin.auth();
    // const _auth = adminAuth(access_type);

    // res.clearCookie('session');
    return _auth
        .verifySessionCookie(sessionCookie)
        .then((decodedClaims) => {
            return _auth.revokeRefreshTokens(decodedClaims.sub);
        }).
        // then(() => {
        //     return new Promise((resolve, reject) => {
        //         session.destroy(() => {
        //             // res.status(204).end();
        //             resolve(true);
        //         });
        //     });
        // }).
        then(() => true);
};

/**
 * Re-authenticates a user based on the provided UID and access type.
 * For specific access types, it emits an event through the appropriate socket client.
 * For other access types, it creates a custom token using Firebase Authentication.
 *
 * @param {Object} params - Parameters for re-authenticating the user.
 * @param {string} params.uid - The UID of the user to re-authenticate.
 * @param {string} params.access_type - The type of access (e.g., "ContractorUser", "Staff") used to determine the socket client or processing method.
 * @returns {Promise<Object|string>} - A promise that resolves to an object containing the custom token or an error string.
 * @throws {Error} - Throws an error if there is an issue with emitting the event or creating the custom token.
 */
global.onReAuthUser = async ({uid, access_type}) => {
    if (!isValidAccessType(access_type)) {
        return;
    }

    if (!uid) {
        return;
    }

    {
        const queryData = CustomUserClaims[access_type];
        if (!queryData) {
            return;
        }

        const {query, operationName} = queryData;

        const item = await getRelayOne({
            query,
            operationName,
            variables: {auth_id: uid},
        });
        console.log('onReAuthUser item', item)
        if (!item) {
            return "NO_USER_DB";
        }
    }

    let tokenRes;
    if (access_type === 'ContractorUser') {
        tokenRes = await socketClientContractor.emit('emit', {
            path: 'accounts/sign/onReAuthUser',
            data: {uid},
        }).catch(err => {
            console.error('onReAuthUser', err)
            throw err;
        });
    } else if (access_type === 'Staff') {
        tokenRes = await socketClientHR.emit('emit', {
            path: 'accounts/sign/onReAuthUser',
            data: {uid},
        }).catch(err => {
            console.error('onReAuthUser', err)
            throw err;
        });
    } else {
        console.log('onReAuthUser', uid)
        const _auth = admin.auth();
        // const _auth = adminAuth(access_type);
        tokenRes = await _auth.getUser(uid).then(async userRecord => {
            if (!userRecord) {
                return "NO_USER_AUTH";
            }

            const {uid, email, phoneNumber} = userRecord;

            try {
                const customToken = await _auth.createCustomToken(uid, {access_type});
                return {customToken};
            } catch (err) {
                console.error(err)
                return "ERR_CREATING_TOKEN";
            }
        });
    }

    console.log('onReAuthUser res', tokenRes)
    return tokenRes;
};

/**
 * Handles user login by creating a session cookie from the provided ID token and CSRF token.
 * Verifies the ID token and creates a session cookie with a specified expiration time.
 *
 * @param {Object} data - Parameters for logging in the user.
 * @param {string} data.idToken - The ID token of the user.
 * @param {string} data.csrfToken - The CSRF token for security verification.
 * @returns {Promise<Object|string>} - A promise that resolves to an object containing `sessionCookie`, `options`, and `decodedIdToken`, or an error string if unauthorized.
 * @throws {Error} - Throws an error if there is an issue with verifying the ID token or creating the session cookie.
 */
global.loginSession = async (data) => {
    console.log('loginSession')
    // Get the ID token passed and the CSRF token.
    // console.log('loginSession', req)
    const {idToken, csrfToken, access_type} = data;
    // Guard against CSRF attacks.
    // if (csrfToken !== req.cookies.csrfToken) {
    //     return 'UNAUTHORIZED REQUEST!';
    // }
    // Set session expiration to 5 days.
    const expiresIn = 60 * 60 * 24 * 5 * 1000;
    // Create the session cookie. This will also verify the ID token in the process.
    // The session cookie will have the same claims as the ID token.
    // To only allow session cookie setting on recent sign-in, auth_time in ID token
    // can be checked to ensure user was recently signed in before creating a session cookie.
    const _auth = admin.auth();
    // const _auth = adminAuth(access_type);

    return _auth.verifyIdToken(idToken).then((decodedIdToken) => {
        // Only process if the user just signed in the last 60 minutes.
        // if (new Date().getTime() / 1000 - decodedIdToken.auth_time < 60 * 60) {
        // Create session cookie and set it.
        return _auth.createSessionCookie(idToken, {expiresIn}).then(sessionCookie => {
            // Set cookie policy for session cookie.
            const options = {maxAge: expiresIn, httpOnly: true, secure: true};
            console.log("session", sessionCookie)
            return {sessionCookie, options, decodedIdToken};
        }).catch(err => {
            console.error(err)
            return 'UNAUTHORIZED REQUEST!';
        });
        // }
        // A user that was not recently signed in is trying to set a session cookie.
        // To guard against ID token theft, require re-authentication.
        // return 'Recent sign in required!';
    });
};

/**
 * Verifies the session cookie for the provided access type.
 * If the access type is "ContractorUser" or "Staff", it emits an event through the appropriate socket client.
 * For other access types, it verifies the session cookie using Firebase Authentication.
 *
 * @param {Object} params - Parameters for verifying the session.
 * @param {Object} params.data - Additional data to send with the verification request.
 * @param {string} params.sessionCookie - The session cookie to verify.
 * @param {string} params.access_type - The type of access (e.g., "ContractorUser", "Staff") used to determine the socket client or processing method.
 * @returns {Promise<Object>} - A promise that resolves to the decoded session claims.
 * @throws {Error} - Throws an error if there is an issue with emitting the event or verifying the session cookie.
 */
global.verifySession = ({data, sessionCookie, access_type}) => {
    if (access_type === 'ContractorUser') {
        return socketClientContractor.emit('emit', {
            path: 'accounts/sign/verifySession',
            data,
        }).catch(err => {
            console.error('verifySession', err)
            throw err;
        });
    }
    if (access_type === 'Staff') {
        return socketClientHR.emit('emit', {
            path: 'accounts/sign/verifySession',
            data,
        }).catch(err => {
            console.error('verifySession', err)
            throw err;
        });
    }

    // const sessionCookie = req.cookies.session || '';
    // Verify the session cookie. In this case an additional check is added to detect
    // if the user's Firebase session was revoked, user deleted/disabled, etc.

    // returns decodedClaims
    return admin.auth().verifySessionCookie(sessionCookie, true /** checkRevoked */);
    // return adminAuth(access_type).verifySessionCookie(sessionCookie, true /** checkRevoked */);
};

/**
 * Retrieves and verifies the decoded ID token from the provided session cookie based on the access type.
 * If the access type is "ContractorUser" or "Staff", it emits an event through the appropriate socket client.
 * For other access types, it verifies the session cookie using Firebase Authentication.
 *
 * @param {Object} params - Parameters for retrieving the decoded ID token.
 * @param {string} params.sessionCookie - The session cookie to verify.
 * @param {string} params.access_type - The type of access (e.g., "ContractorUser", "Staff") used to determine the socket client or processing method.
 * @returns {Promise<Object>} - A promise that resolves to the decoded ID token.
 * @throws {Error} - Throws an error if there is an issue with emitting the event or verifying the session cookie.
 */
global.getDecodedIdTokenFromSession = async ({sessionCookie, access_type}) => {
    if (access_type === 'ContractorUser') {
        return socketClientContractor.emit('emit', {
            path: 'get/getDecodedIdTokenFromSession',
        }).catch(err => {
            console.error('getDecodedIdTokenFromSession', err)
            throw err;
        });
    }
    if (access_type === 'Staff') {
        return socketClientHR.emit('emit', {
            path: 'get/getDecodedIdTokenFromSession',
        }).catch(err => {
            console.error('getDecodedIdTokenFromSession', err)
            throw err;
        });
    }

    // const sessionCookie = req.cookies.session || '';

    return admin.auth().verifySessionCookie(sessionCookie);
    // return adminAuth(access_type).verifySessionCookie(sessionCookie);
};
