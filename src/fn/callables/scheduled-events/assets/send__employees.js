// const {send: send_expired} = require("./send_expired");
// const {send: send_no_expiry} = require("./send_no_expiry");
// const {send: send_to_expire} = require("./send_to_expire");

//<editor-fold desc="columns">
const columns = [
    {header: 'Company', key: 'Company', width: 30},
    {header: 'Project', key: 'Project', width: 30},
    {header: 'Site', key: 'Site', width: 30},

    {header: 'Department', key: 'Department', width: 25},
    {header: 'Job Position', key: 'Job Position', width: 25},

    {header: 'First Name', key: 'First Name', width: 25},
    {header: 'Last Name', key: 'Last Name', width: 25},
    {header: 'ID/Passport No.', key: 'ID/Passport No.', width: 25},
    {header: 'Gender', key: 'Gender', width: 15},
    {header: 'Phone No.', key: 'Phone No.', width: 15},
    {header: 'Email Address', key: 'Email Address', width: 25},

    {header: 'Expiry Date', key: 'Expiry Date', width: 20},
    {header: 'Document', key: 'Document', width: 35}
];
//</editor-fold>

//<editor-fold desc="send_employees">
exports.send = async ({company_ids, company_groups, collectionGroup, tbl, _group, name,}) => {
    // console.log('*********************************************')
    // console.log('send_employees', collectionGroup)
    // console.log('*********************************************')

    const employees = db_hr.collection('employees').where('removed', '==', false).where('receive_expired_docs_notifs', '==', true);

    const employees_by_company_snapshots = await Promise.all(company_ids.map(company_id => employees.where('company_id', '==', company_id).get()));

    employees_by_company_snapshots.forEach(({docs}) => {
        //each docs / company
        const sentList = company_groups[docs[0].data('company_id')];

        docs.map(doc => {
            return {id: doc.id, data: doc.data()};
        }).filter(({data: {email}}) => !!email).map(({
                                                         id,
                                                         data: {email: username, client, project, site, company_id}
                                                     }) => {
            if (!client) {
                return {id, username, sentList};
            }
            if (!project) {
                return {
                    id,
                    username,
                    sentList: sentList.filter(({data: {client: _client}}) => _client && _client.id === client.id)
                };
            }
            if (!site) {
                return {
                    id,
                    username,
                    sentList: sentList.filter(({data: {project: _project}}) => _project && _project.id === project.id)
                };
            }
            return {
                id, username, sentList: sentList.filter(({data: {site: _site}}) => _site && _site.id === site.id)
            };
        });
    });
};
//</editor-fold>