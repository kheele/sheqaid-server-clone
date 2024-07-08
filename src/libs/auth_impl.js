// <editor-fold defaultstate="collapsed" desc="imports">
const {ENDPOINT_CONTRACTORS, ENDPOINT_HR} = process.env;
// </editor-fold>

global.setAuthDecodedIdTokenBySocket = async (socket) => {
    const {request, handshake} = socket;
    if (handshake) {
    // if (request) {
        const {headers, auth} = handshake;
        // console.log('io.use session auth', auth);
        const {token = null, uid} = auth || {};
        if (token) {
            // admin.auth().getUser(uid).then(({customClaims = {}}) => {
            //     console.log('io.use session auth customClaims', customClaims);
            // });
            return await admin.auth().verifyIdToken(token).then(decodedIdToken => {
                request.session.decodedIdToken = decodedIdToken;
                console.log('decodedIdToken', decodedIdToken);
                request.session.save();
                return "AUTHORIZED";
            }).catch(err => {
                console.error(err);
                return 'UNAUTHORIZED';
            });
            // try {
            // 	const [authType, tokenValue] = token.trim().split(' ');
            // 	if (authType !== 'Bearer') {
            // 		// throw new Error('Expected a Bearer token');
            // 	}
            //
            // 	console.log(authType, tokenValue);//
            //
            // 	// const {claims: {sub}} = await jwtVerifier.verifyAccessToken(tokenValue, 'api://default');
            // 	// const user = await oktaClient.getUser(sub);
            //
            // 	// users.set(socket, {
            // 	// 	id: user.id,
            // 	// 	name: [user.profile.firstName, user.profile.lastName].filter(Boolean).join(' '),
            // 	// });
            // } catch (err) {
            // 	console.error(err);
            // }
        }
    }
};

//<editor-fold desc="addCustomUserClaims">
global.addCustomUserClaims = async (uid, claims, access_type) => {
    const _auth = admin.auth();
    return _auth.getUser(uid).then(({customClaims = {}}) => {
        Object.keys(claims).forEach(key => {
            const val = claims[key];
            if (val === null) {
                if(key in customClaims) {
                    delete customClaims[key];
                }
                delete claims[key];
            }
        });
        Object.keys(customClaims).forEach(key => {
           const val = customClaims[key];
           if (val === null) {
               delete customClaims[key];
           }
        });
        return _auth.setCustomUserClaims(uid, {...customClaims, ...claims});
    });
};
//</editor-fold>

//<editor-fold desc="setCustomUserClaims">
global.setCustomUserClaims = async (uid, claims, access_type) => {
    const _auth = admin.auth();
    return _auth.getUser(uid).then(({customClaims}) =>
        _auth.setCustomUserClaims(uid, claims));
}
//</editor-fold>

//<editor-fold desc="createCustomToken">
global.createCustomToken = (uid, claims) => {
    return admin.auth().createCustomToken(uid, claims);
}
//</editor-fold>

global.isValidAccessType = (access_type) => access_type === "User" || access_type === "ContractorUser" || access_type === "Staff";

global.adminAuth = (access_type) => {
    return {
        "User": admin,
        "ContractorUser": admin2,
        "Staff": admin_hr
    }[access_type].auth();
}

global.authorize = (retries = 10) => {
    // Please set the email and private key of service account.
    //authenticate request
    const auth = new google.auth.JWT(
        JWT_DEFAULT_SERVICE_ACCOUNT,
        null,
        JWT_AUTH_KEY,
        [
            "https://www.googleapis.com/auth/drive",
            "https://www.googleapis.com/auth/script.projects",
            "https://www.googleapis.com/auth/iam",
            "https://www.googleapis.com/auth/cloud-platform"
        ]
    );

    return execWhen(() => new Promise((resolve, reject) => {
        auth.authorize((err, tokens) => {
            if (err) {
                reject(err);
            } else {
                resolve(auth);
            }
        });
    }), retries);
};
