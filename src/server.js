process.on('uncaughtException', async (err) => {
    console.error('Caught exception: ', err);
    console.error('Caught exception stringify: ', JSON.stringify(err));

    const opts = {
        from: '"SHEQIntel" <no-reply@sheqsolve.com>',
        to: "support@sheqsolve.com",
        subject: 'SHEQIntel Server Error Reporting',
        html: `<h3>Server Error</h3>\n
            <p>SHEQIntel would like to notify you of the following:</p>\n
            <p><b>------Message Details------</b></p>
            <p>${err.message}</p>\n
            <p><b>------Error Stack Details------</b></p>\n
            <p>${err.stack}</p>`
    };
    // EmailUtils.send(opts);
});

require('./globals.js');
require('./app.js');
