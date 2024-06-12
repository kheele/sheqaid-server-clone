exports.sendEmail = async ({email, name, notifMsg, attachments}) => {
    const opts = {
        from: '"SHEQ Aid" <no-reply@sheqsolve.com>',
        to: email,
        subject: 'SHEQ Aid Notifications',
        html: `<h3><b>Dear ${name || "SHEQ Aid User"}</b></h3>\n
            <p>SHEQ Aid would like to notify you of the following:</p>\n
            ${notifMsg}\n
            <p>If you didn't request this, you can ignore this email or let us know.</p>\n
            <p>Kind Regards<br/>SHEQ Aid</p>`
    };
    if(attachments) {
        opts.attachments = attachments;
    }
    await EmailUtils.send(opts);
};