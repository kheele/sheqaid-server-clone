const listHRDocsByLoggedImpl = require('../listHRDocsByLoggedImpl');
const {inc_fragment} = require("./commons");

//<editor-fold desc="listHRDocsByLoggedImpl">
module.exports = async (socket, data) => {
    const {
        issued_by_id,
        witness_id,
        type,
        date,
    } = data;
    return listHRDocsByLoggedImpl({
        socket,
        data,
        tbl: 'hr_employees_docs_warnings',
        listName: 'warning_list',
        singular: 'Warning',
        inc_fragment,
        attrs: {
            issued_by_id,
            witness_id,
            type,
            date,
        },
    });
    // console.log('data', data)
}
//</editor-fold>