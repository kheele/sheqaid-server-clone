const io = require('socket.io-client');

const {ENDPOINT_CONTRACTORS, ENDPOINT_HR, ENDPOINT_FILE_UPLOADER} = process.env;

const connectSocket = (key, domain) => {
    global[key] = io(domain, {
        withCredentials: true,
        transports: ['websocket'], // Only allow WebSocket transport

        // auth: (cb) => {
        // 	const {session} = self;
        // 	if (session.isLoggedIn) {
        // 		const {currentUser} = session.auth;
        // 		currentUser.getIdToken().then(token => {
        // 			cb({token});
        // 		});
        // 	} else {
        // 		cb({token: null});
        // 	}
        // },
    });

    const socket = global[key];

    socket.on('connect', () => {
        console.log(`Connected to ${key} server`, socket.id);
    });

    socket.on('connect_error', (err) => {
        console.log(`Connection error to ${key} server:`, domain, err.message);
    });

    socket.on('disconnect', () => {
        console.log(`Disconnected from ${key} server`, socket.id);
    });

    const emit = socket.emit;

    socket.emit = (...args) => {
        return new Promise((resolve, reject) => {
            emit.apply(socket, [...args, (res, err) => {
                if (err) {
                    console.log('emit err', err)
                    return reject(err);
                }

                console.log('emit res', res)
                if (res) {
                    resolve(res);
                } else {
                    resolve();
                }
            }]);
        });
    };
};

connectSocket('socketClientContractor', ENDPOINT_CONTRACTORS);
connectSocket('socketClientHR', ENDPOINT_HR);
connectSocket('socketFileUploader', ENDPOINT_FILE_UPLOADER);

// require('./client-sockets-test-kompanion')(connectSocket);
