
class SendEmailUtils {

    static async sendCreationEmail(type, {
        companyName,
        username,
        password,
        fname,
        lname,
        contractorName,
        contractorUsername
    }) {
        const html = {
            UserCreate: () => `<h3><b>Dear ${fname + ' ' + lname}</b></h3>\n
                <p>We are pleased to inform you that your account has been successfully registered on the SHEQ Aid system.</p>\n
                <p>Your Username is <b>${username}</b></p>\n
                <p>Password is <b>${password}</b></p>\n
                <p>
                    Please keep this email for your records as it contains important information regarding your account on the SHEQ Aid.<br/>
                    You can now log in and start using the features and tools that the system offers.
                </p>\n
                <p>If you have any questions or concerns, please do not hesitate to contact us.</p>\n
                ${Utils.getAppDownloadOptionMsg()}`,
            UserSignup: () => `<h3><b>Dear ${fname + ' ' + lname}</b></h3>\n
                <p>We are pleased to inform you that your account has been successfully registered on the SHEQ Aid system.</p>\n
                <p>Your Username is <b>${username}</b></p>\n
                <p>The company associated with your account is <b>${companyName}</b></p>\n
                <p>
                    Please keep this email for your records as it contains important information regarding your account on the SHEQ Aid.<br/>
                    You can now log in and start using the features and tools that the system offers.
                </p>\n
                <p>If you have any questions or concerns, please do not hesitate to contact us.</p>\n
                <p>Thank you for choosing the SHEQ Aid system.</p>\n
                <p>Best Regards<br/>SHEQ Aid</p>`,
            ContractorUserCreate: () => `<h3><b>Dear ${fname + ' ' + lname}</b></h3>\n
                <p>We are pleased to inform you that your account has been successfully registered on the SHEQ Aid system.</p>\n
                <p>Your Username is <b>${username}</b></p>\n
                <p>Password is <b>${password}</b></p>\n
                <p>Contractor Name: ${contractorName}</p>\n
                <p>Contractor Email Addess: ${contractorUsername}</p>\n
                <p>
                    Please keep this email for your records as it contains important information regarding your account on the SHEQ Aid.<br/>
                    You can now log in and start using the features and tools that the system offers.
                </p>\n
                <p>If you have any questions or concerns, please do not hesitate to contact us.</p>\n
                ${Utils.getAppDownloadOptionMsg()}`,
            ContractorUserSignup: () => `<h3><b>Dear ${fname + ' ' + lname}</b></h3>\n
                <p>We are pleased to inform you that your account has been successfully registered on the SHEQ Aid system.</p>\n
                <p>Your Username is <b>${username}</b></p>\n
                <p>Contractor Name: ${contractorName}</p>\n
                <p>Contractor Email Addess: ${contractorUsername}</p>\n
                <p>
                    Please keep this email for your records as it contains important information regarding your account on the SHEQ Aid.<br/>
                    You can now log in and start using the features and tools that the system offers.
                </p>\n
                <p>If you have any questions or concerns, please do not hesitate to contact us.</p>\n
                <p>Thank you for choosing the SHEQ Aid system.</p>\n
                <p>Best Regards<br/>SHEQ Aid</p>`,
            ContractorCreate: () => `<h3><b>Dear ${contractorName}</b></h3>\n
                <p>We are pleased to inform you that your account has been successfully registered on the SHEQ Aid system.</p>\n
                <p>Your Username is <b>${username}</b></p>\n
                <p>Please use <b>${username}</b> as your Username in order to set up your account.</p>\n
                <p>
                    Please keep this email for your records as it contains important information regarding your account on the SHEQ Aid.<br/>
                    You can now log in and start using the features and tools that the system offers.
                </p>
                <p>If you have any questions or concerns, please do not hesitate to contact us.</p>\n
                <p>Thank you for choosing the SHEQ Aid system.</p>\n
                ${Utils.getAppDownloadOptionMsg({isContractor: true})}`
        }[type];

        const opts = {
            from: '"SHEQ Aid" <no-reply@sheqsolve.com>',
            to: username,
            subject: 'Welcome to SHEQ Aid',
            html: html()
        };

        await EmailUtils.send(opts);
    }
}

module.exports = SendEmailUtils;
