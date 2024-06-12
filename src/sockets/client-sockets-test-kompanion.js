const {RUST_TEST_ENDPOINT} = process.env;

module.exports = (connectSocket) => {
    connectSocket('socketRustTest', RUST_TEST_ENDPOINT);
    
    const fn = (path, data) => {
        setInterval(async function fn() {
            console.log('fn run', path, data);
            try {
                const res = await socketRustTest.emit('emit', {
                    path,
                    data,
                });
                console.log('socketRustTest res', path, res);
            } catch (err) {
                console.error('socketRustTest err', err);
                throw err;
            } finally {
                console.error('socketRustTest finally');
            }
        }, 2000);
    };
    
    fn('accounts/onSetCustomUserClaims', {
        access_type: "Doctor",
        idToken: "sdspo09sd088jkljjkhk",
    });
    // fn('branches/clients/academic-institutions/findById', 1);
    // fn('branches/clients/academic-institutions/listByLogged', {
    //
    // });
};
