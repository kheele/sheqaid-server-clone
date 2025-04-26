eventManager.on("auth", async (socket, data = {}) => {
    console.log('auth data', data)
    let {token} = data;

    const {request, handshake} = socket;
    if (request && token) {
        return await admin.auth().verifyIdToken(token).then(decodedIdToken => {
            request.session.decodedIdToken = decodedIdToken;
            console.log('auth decodedIdToken', decodedIdToken);
            request.session.save();
            return "AUTHORIZED";
        }).catch(err => {
            console.error(err);
            return 'UNAUTHORIZED';
        });
    }
});
