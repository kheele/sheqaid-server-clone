exports.sendEmail = async ({email, name, notifMsg, attachments}) => {
    const opts = {
        from: '"SHEQIntel" <no-reply@sheqsolve.com>',
        to: email,
        subject: 'SHEQIntel Notifications',
        html: `<h3><b>Dear ${name || "SHEQIntel User"}</b></h3>\n
            <p>SHEQIntel would like to notify you of the following:</p>\n
            ${notifMsg}\n
            <p>If you didn't request this, you can ignore this email or let us know.</p>\n
            <p>Kind Regards<br/>SHEQIntel</p>`
    };
    if(attachments) {
        opts.attachments = attachments;
    }
    await EmailUtils.send(opts);
};