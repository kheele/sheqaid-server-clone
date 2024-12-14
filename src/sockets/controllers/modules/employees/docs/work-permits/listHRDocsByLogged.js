const listHRDocsByLoggedImpl = require('../listHRDocsByLoggedImpl');
const {inc_fragment} = require("./commons");

//<editor-fold desc="listHRDocsByLoggedImpl">
module.exports = async (socket, data) => {
    const {
        notes,
        date,
    } = data;
    return listHRDocsByLoggedImpl({
        socket,
        data,
        tbl: 'hr_employees_docs_work_permits',
        listName: 'work_permit_list',
        singular: 'WorkPermit',
        inc_fragment,
        attrs: {
            notes,
            date,
        },
    });
    // console.log('data', data)
}
//</editor-fold>