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
        listRename: 'prdp_list',
        singular: 'PrDP',
        inc_fragment,
        attrs: {
            desc,
        },
    });
    // console.log('data', data)
}
//</editor-fold>