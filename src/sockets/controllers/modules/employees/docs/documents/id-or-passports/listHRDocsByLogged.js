const listHRDocsByLoggedImpl = require('../../listHRDocsByLoggedImpl');
const {inc_fragment} = require("./commons");

//<editor-fold desc="listHRDocsByLoggedImpl">
module.exports = async (socket, data) => {
    const {
        desc,
    } = data;
    return listHRDocsByLoggedImpl({
        socket,
        data,
        tbl: 'hr_employees_documents',
        listName: 'document_list',
        listRename: 'id_or_passport_list',
        singular: 'ID/Passport',
        inc_fragment,
        attrs: {
            desc,
        },
    });
    // console.log('data', data)
}
//</editor-fold>