const CustomUserClaims = require("../../fn/callables/graphql/CustomUserClaims");

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

global.loginSession = async (data) => {
    console.log('loginSession')
    // Get the ID token passed and the CSRF token.
    // console.log('loginSession', req)
    const {idToken, csrfToken} = data;
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
};

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
};
