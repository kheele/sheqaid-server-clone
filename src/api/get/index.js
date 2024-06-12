const {ENDPOINT_CONTRACTORS, ENDPOINT_HR} = process.env;

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
global.getUserUidByUsername = async (username, access_type) => {
    await authorize(access_type);
    return getUserUidByUsername(username, access_type);
};
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="getUserUidByEmail">
global.getUserUidByEmail = async (email, access_type) => {
    await authorize(access_type);
    if (!email.isEmailAddress()) {
        return null;
    }
    return getUserUidByUsername(email, access_type);
};
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="getUserUidByPhone">
global.getUserUidByPhone = async (phone, access_type) => {
    await authorize(access_type);
    if (phone.isEmailAddress()) {
        return null;
    }
    return getUserUidByUsername(phone, access_type);
};
// </editor-fold>
